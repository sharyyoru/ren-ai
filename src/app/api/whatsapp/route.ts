import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// WhatsApp status endpoint
export async function GET() {
  // In production, this would check whatsapp-web.js session status
  // For now, return configuration status
  
  const sessionPath = process.env.WHATSAPP_SESSION_PATH;
  
  return NextResponse.json({
    configured: !!sessionPath,
    sessionPath,
    status: "ready", // Would be: 'disconnected' | 'connecting' | 'ready'
    instructions: {
      setup: [
        "1. Install whatsapp-web.js: npm install whatsapp-web.js qrcode-terminal",
        "2. Create a WhatsApp service file that initializes the client",
        "3. Scan the QR code with your WhatsApp mobile app",
        "4. Session will be saved to WHATSAPP_SESSION_PATH",
        "5. All messages will be synced to the communications table"
      ],
      endpoints: {
        status: "GET /api/whatsapp - Check connection status",
        send: "POST /api/whatsapp/send - Send a message",
        webhook: "POST /api/whatsapp/webhook - Receive incoming messages"
      }
    }
  });
}

// Send WhatsApp message
export async function POST(request: NextRequest) {
  try {
    const { contactId, phone, message } = await request.json();

    if (!phone || !message) {
      return NextResponse.json(
        { error: "Phone and message are required" },
        { status: 400 }
      );
    }

    // In production, this would use whatsapp-web.js to send the message
    // For now, we simulate and log to communications table
    
    // Log the outgoing message
    const { data, error } = await supabase
      .from("communications")
      .insert({
        contact_id: contactId,
        type: "whatsapp",
        content: message,
        direction: "out",
        status: "sent",
        metadata_json: { phone, simulated: true }
      })
      .select()
      .single();

    if (error) {
      console.error("Error logging message:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Message sent (simulated)",
      data,
      note: "In production, this would send via whatsapp-web.js"
    });
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
