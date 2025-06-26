// === FILE: src/app/api/stripe/webhook/route.ts ===
// This file handles the Stripe webhook for processing checkout session completions.

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

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

    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) continue;

      await prisma.order.create({
        data: {
          productId: product.id,
          customerEmail: email,
          customerName: name,
          quantity: item.quantity,
          totalPrice: product.price * item.quantity,
          status: 'paid',
          isCustom: false,
          sessionId: sessionId,       },
      });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: 'Unhandled event type' }, { status: 200 });
}
