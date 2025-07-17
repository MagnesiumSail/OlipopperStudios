// === FILE: src/app/api/stripe/webhook/route.ts ===
// This file handles Stripe webhook events, particularly for order completion

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import jwt from "jsonwebtoken";
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
const JWT_SECRET = process.env.PATTERN_DOWNLOAD_SECRET || "something-very-secret";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const resend = new Resend(process.env.RESEND_API_KEY);

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

        await resend.emails.send({
          from: process.env.EMAIL_FROM!, // Your verified sender email, e.g. "Olipopper Studios <noreply@olipopper.com>"
          to: email,
          subject: `Your Sewing Pattern: ${item.product.name}`,
          html: `
            <p>Thank you for purchasing <b>${item.product.name}</b> from Olipopper Studios!</p>
            <p>Your pattern is ready to download:</p>
            <p>
              <a href="${downloadLink}">${downloadLink}</a>
            </p>
            <p>This link will expire in 2 days. If you have any trouble, reply to this email!</p>
            <p>Happy sewing,<br/>Olipopper Studios</p>
          `,
        });
      }
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: 'Unhandled event type' }, { status: 200 });
}
