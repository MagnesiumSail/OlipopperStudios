// === FILE: src/app/api/checkout/route.ts ===
// This file handles the API route for creating a Stripe checkout session.

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPurchasingPaused } from "@/lib/siteSettings";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  if (await getPurchasingPaused()) {
    return NextResponse.json(
      { error: "Purchasing is temporarily paused. Please try again later." },
      { status: 503 }
    );
  }
  
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { cart, name } = await req.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ message: "Missing required info" }, { status: 400 });
    }

    // Build secure line_items from real DB values
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

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

    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: session.user.email,
      line_items,
      metadata: {
        customerName: name || session.user.name || "",
        rawCart: JSON.stringify(cart),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json({ url: sessionStripe.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err.message);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
