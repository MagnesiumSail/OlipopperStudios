// src/app/api/custom-order/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log('Received custom order:', data);

    // Just echo back confirmation for now
    return NextResponse.json({ message: 'Custom order received.' }, { status: 200 });
  } catch (error) {
    console.error('Error handling custom order:', error);
    return NextResponse.json({ error: 'Failed to process custom order.' }, { status: 500 });
  }
}
