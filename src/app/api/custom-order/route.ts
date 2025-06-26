// src/app/api/custom-order/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const htmlBody = `
      <h2>New Custom Order Request</h2>
      <p><strong>Garment Type:</strong> ${data.garmentType}</p>
      <p><strong>Fabric:</strong> ${data.fabric}</p>
      <p><strong>Color:</strong> ${data.color}</p>
      <p><strong>Design Details:</strong> ${data.designDetails}</p>
      <p><strong>Occasion:</strong> ${data.occasion}</p>
      <p><strong>Size:</strong> ${data.size}</p>
      <p><strong>Measurements:</strong> Waist: ${data.waist}, Bust: ${data.bust}, Hips: ${data.hips}, Height: ${data.height}</p>
      <hr />
      <p><strong>Customer:</strong> ${data.name} (${data.email})</p>
    `;

    console.log('Sending email with data:', data);

    const emailRes = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.EMAIL_TO!,
      subject: `New Custom Order from ${data.name}`,
      html: htmlBody,
    });

    console.log('Resend response:', emailRes);

    return NextResponse.json({ success: true, id: emailRes });
  } catch (err) {
    console.error('Email failed:', err);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
