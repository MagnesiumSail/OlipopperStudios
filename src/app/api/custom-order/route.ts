// === FILE: src/app/api/custom-order/route.ts ===
// This file handles the API route for submitting a custom order form.

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    let imagesHtml = "";
    if (Array.isArray(data.designImages) && data.designImages.length > 0) {
      imagesHtml = `
    <h3>Design Inspiration Images</h3>
    <ul>
      ${(data.designImages as string[])
        .map(
          (url: string) =>
            `<li>
              <a href="${url}" target="_blank">${url}</a><br/>
              <img src="${url}" style="max-width:200px;max-height:200px;"/>
            </li>`
        )
        .join("")}
    </ul>
  `;
    }

    const htmlBody = `
      <h2>New Custom Order</h2>
      <p><strong>Garment Type:</strong> ${data.garmentType} ${data.otherGarment || ""}</p>
      <p><strong>Fabric:</strong> ${data.fabric}</p>
      <p><strong>Color:</strong> ${data.color}</p>
      <p><strong>Design Details:</strong> ${data.designDetails}</p>
      ${imagesHtml}
      <p><strong>Occasion:</strong> ${data.occasion}</p>
      <h3>Measurements</h3>
      <ul>
        <li>Size: ${data.size} ${data.customSize || ""}</li>
        <li>Waist: ${data.waist}</li>
        <li>Bust: ${data.bust}</li>
        <li>Hips: ${data.hips}</li>
        <li>Height: ${data.height}</li>
        <li>Bra: ${data.braBand || ""}${data.braCup || ""}</li>
        <li>Under Bust: ${data.underBust}</li>
        <li>Shoulder Span: ${data.shoulderSpan}</li>
        <li>Inseam: ${data.inseam}</li>
        <li>Arm Length: ${data.armLength}</li>
        <li>Bicep: ${data.bicep}</li>
        <li>Wrist: ${data.wrist}</li>
        <li>Neck: ${data.neckCircumference}</li>
        <li>Thigh: ${data.thigh}</li>
        <li>Calf: ${data.calf}</li>
        <li>Shoulder to Waist: ${data.shoulderToWaist}</li>
        <li>Other Measurements: ${data.otherMeasurements}</li>
      </ul>
      <h3>Preferences</h3>
      <p>Fabric Swatch Approval: ${data["Fabric Swatch Approval"] ? "Yes" : "No"}</p>
      <p>Sketch Approval: ${data["Sketch Approval"] ? "Yes" : "No"}</p>
      <p>Progress updates (messages): ${data["Progress updates (messages)"] ? "Yes" : "No"}</p>
      <p>Progress updates (photos): ${data["Progress updates (photos)"] ? "Yes" : "No"}</p>
      <p>None (surprise me): ${data["None (surprise me)"] ? "Yes" : "No"}</p>
      <p>Other follow-up: ${data.followUpOther}</p>
      <h3>Customer Info</h3>
      <p>Name: ${data.name}</p>
      <p>Phone: ${data.phone}</p>
      <p>Email: ${data.email}</p>
      <p>Preferred Contact: ${data.preferredContact}</p>
      <h3>Budget & Timeline</h3>
      <p>Budget: ${data.budget}</p>
      <p>Deadline: ${data.deadline}</p>
      <p>Rush Order: ${data.rushOrder}</p>
      <h3>Closures</h3>
      <ul>
        ${["Zipper (exposed)", "Zipper (hidden/invisible)", "Buttons (functional)", "Buttons (decorative)", "Hook & eye", "Lacing", "Snaps", "Velcro", "Tie closure"].map((type) => `<li>${type}: ${data[type] ? "Yes" : "No"}</li>`).join("")}
      </ul>
      <p>Other Closures: ${data.closureOther}</p>
      <h3>Pockets</h3>
      <p>No Pockets: ${data["No pockets"] ? "Yes" : "No"}</p>
      <p>Hidden/Secret Pockets: ${data["Hidden/secret pockets"] ? "Yes" : "No"}</p>
      <p>Other Pockets: ${data.pocketOther}</p>
      <h3>Fit</h3>
      <p>Tailored: ${data.tailored ? "Yes" : "No"}</p>
      <p>Tight: ${data.tight ? "Yes" : "No"}</p>
      <p>Relaxed: ${data.relaxed ? "Yes" : "No"}</p>
      <p>Other Fit: ${data.fitOther}</p>
      <p>Lining: ${data.lining ? "Yes" : "No"}</p>
      <p>Other Lining: ${data.liningOther}</p>
      <h3>Additional Info</h3>
      <p>${data.additionalInfo}</p>
    `;

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.EMAIL_TO!,
      subject: `New Custom Order from ${data.name}`,
      html: htmlBody,
    });

    return NextResponse.json({ success: true, id: response });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
