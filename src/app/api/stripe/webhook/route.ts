// === FILE: src/app/api/stripe/webhook/route.ts ===
// This file handles Stripe webhook events, particularly for order completion

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Stripe webhook signature verification failed:", err);
    return new NextResponse("Webhook Error: Invalid signature", {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_email?.toLowerCase();
    const name = session.metadata?.customerName || "Unknown";
    const rawCart = session.metadata?.rawCart;
    const sessionId = session.id;

    if (!email || !rawCart) {
      console.warn("⚠️ Webhook missing required metadata");
      return new NextResponse("Missing required metadata", { status: 400 });
    }

    let cart: { productId: number; quantity: number; size?: string }[];
    try {
      cart = JSON.parse(rawCart);
    } catch (err) {
      console.error("❌ Failed to parse cart JSON:", err);
      return new NextResponse("Invalid cart format", { status: 400 });
    }

    // Get all products in the cart
    const products = await prisma.product.findMany({
      where: { id: { in: cart.map((i) => i.productId) } },
    });

    const user = await prisma.user.findUnique({ where: { email } });
    const order = await prisma.order.create({
      data: {
        customerEmail: email,
        customerName: name,
        userId: user ? user.id : null,
        status: "paid",
        isPaid: true,
        totalPrice: products.reduce((sum, product) => {
          const item = cart.find((c) => c.productId === product.id);
          return sum + product.price * (item?.quantity || 1);
        }, 0),
        orderItems: {
          create: cart.map((item) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            unitPrice:
              products.find((p) => p.id === item.productId)?.price || 0,
            ...(item.size && { size: item.size }),
          })),
        },
      },
      include: { orderItems: { include: { product: true } } },
    });

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: email,
        subject: "Order Confirmation - Olipopper Studios",
        html: `
      <h2>Thank you for your order!</h2>
      <p>Hi ${name},</p>
      <p>Your order <strong>#${order.id}</strong> has been received and is being processed.</p>
      <p>
        <strong>Order Details:</strong><br/>
        ${order.orderItems
          .map(
            (item) =>
              `${item.product?.name || "Product"} x${item.quantity}${item.size ? ` (Size: ${item.size})` : ""}`
          )
          .join("<br/>")}
      </p>
      <p>
        <strong>Total:</strong> $${((order.totalPrice ?? 0) / 100).toFixed(2)}
      </p>
      <p>
        You will receive another email when your order ships or is ready for download.<br/>
        If you have any questions, reply to this email or contact us at <a href="mailto:contact@olipopperstudios.com">contact@olipopperstudios.com</a>.
      </p>
      <p>
        Thank you!<br/>
        Olipopper Studios
      </p>
    `,
      });
      console.log(`Order confirmation email sent to ${email}`);
    } catch (err) {
      console.error("❌ Failed to send confirmation email:", err);
    }

    for (const item of order.orderItems) {
      if (item.product.isPattern && item.product.patternURL) {
        try {
          console.log(`Attempting to send pattern PDF to ${email}...`);
          const pdfRes = await fetch(item.product.patternURL);
          if (!pdfRes.ok) {
            console.error(
              `Failed to fetch PDF at ${item.product.patternURL}:`,
              pdfRes.statusText
            );
            continue;
          }
          const pdfBuffer = await pdfRes.arrayBuffer();

          await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: `Your Sewing Pattern: ${item.product.name}`,
            html: `...`,
            attachments: [
              {
                filename: `${item.product.name}.pdf`,
                content: Buffer.from(pdfBuffer),
                contentType: "application/pdf",
              },
            ],
          });
          console.log(`Successfully sent email to ${email}`);
        } catch (err) {
          console.error("Failed to send pattern PDF email:", err);
        }
      }
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { message: "Unhandled event type" },
    { status: 200 }
  );
}
