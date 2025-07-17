// === FILE: src/app/api/checkout/route.ts ===
// This file handles the API route for creating a Stripe checkout session.

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this path to your singleton

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { cart, email, name } = await req.json();

    if (!email || !cart || cart.length === 0) {
      return NextResponse.json(
        { message: "Missing required info" },
        { status: 400 }
      );
    }

    // Build secure line_items from real DB values
    const line_items = [];

    for (const item of cart) {
      if (
        typeof item.quantity !== "number" ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        return NextResponse.json(
          { message: `Invalid quantity for product ${item.productId}.` },
          { status: 400 }
        );
      }
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { images: true },
      });

      if (!product || !product.isActive) {
        return NextResponse.json(
          { message: `Product ${item.productId} is invalid.` },
          { status: 400 }
        );
      }

      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.images?.[0] ? [product.images[0].url] : [],
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items,
      metadata: {
        customerName: name || "",
        rawCart: JSON.stringify(cart), // Optional: log original request
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err.message);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
