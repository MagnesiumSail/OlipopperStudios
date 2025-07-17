// === FILE: src/app/api/stripe/webhook/route.ts ===
// This file handles Stripe webhook events, particularly for order completion

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import jwt from "jsonwebtoken";
// import { sendEmail } from "@/lib/email"; // TODO: replace with your real email function

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
const JWT_SECRET = process.env.PATTERN_DOWNLOAD_SECRET || "something-very-secret";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new NextResponse('Missing stripe-signature header', { status: 400 });
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
    console.error('❌ Stripe webhook signature verification failed:', err);
    return new NextResponse('Webhook Error: Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_email;
    const name = session.metadata?.customerName || 'Unknown';
    const rawCart = session.metadata?.rawCart;
    const sessionId = session.id;

    if (!email || !rawCart) {
      console.warn('⚠️ Webhook missing required metadata');
      return new NextResponse('Missing required metadata', { status: 400 });
    }

    let cart: { productId: number; quantity: number }[];
    try {
      cart = JSON.parse(rawCart);
    } catch (err) {
      console.error('❌ Failed to parse cart JSON:', err);
      return new NextResponse('Invalid cart format', { status: 400 });
    }

    // Get all products in the cart
    const products = await prisma.product.findMany({
      where: { id: { in: cart.map(i => i.productId) } },
    });

    // Create the order with all items
    const order = await prisma.order.create({
      data: {
        customerEmail: email,
        customerName: name,
        status: "paid",
        isPaid: true,
        totalPrice: products.reduce((sum, product) => {
          const item = cart.find(c => c.productId === product.id);
          return sum + (product.price * (item?.quantity || 1));
        }, 0),
        orderItems: {
          create: cart.map(item => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            unitPrice: products.find(p => p.id === item.productId)?.price || 0,
          })),
        }
      },
      include: { orderItems: { include: { product: true } } },
    });

    // Send pattern download links if any orderItem is a pattern
    for (const item of order.orderItems) {
      if (item.product.isPattern && item.product.patternURL) {
        const token = jwt.sign(
          {
            orderId: order.id,
            patternId: item.productId,
            email,
          },
          JWT_SECRET,
          { expiresIn: "2d" }
        );
        const downloadLink = `${BASE_URL}/api/pattern-download?token=${token}`;
        // TODO: Replace this with your real sendEmail call!
        console.log(`Would email ${email}: Download your pattern here: ${downloadLink}`);

        // Example sendEmail:
        // await sendEmail({
        //   to: email,
        //   subject: "Your Olipopper Pattern Download",
        //   html: `<p>Thank you for your purchase!<br/>
        //   Download your pattern: <a href="${downloadLink}">${downloadLink}</a></p>`,
        // });
      }
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: 'Unhandled event type' }, { status: 200 });
}
