import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    
    switch (type) {
      case "property_description":
        prompt = `Generate a compelling 2-paragraph property description for a real estate listing in the UAE market:
        
Property: ${data.title}
Location: ${data.area}, ${data.city}
Bedrooms: ${data.bedrooms}
Bathrooms: ${data.bathrooms}
Size: ${data.sizeSqft} sqft
Price: AED ${data.price?.toLocaleString()}
Developer: ${data.developer}
Amenities: ${data.amenities?.join(", ") || "Premium amenities"}
Completion: ${data.completionDate || "Ready"}

Write in a professional, luxurious tone suitable for high-end UAE real estate. Highlight key selling points and lifestyle benefits.`;
        break;

      case "lead_summary":
        prompt = `Analyze this real estate lead and generate a brief 2-3 sentence summary:

Name: ${data.name}
Source: ${data.source}
Messages exchanged: ${data.messageCount}
Properties viewed: ${data.propertiesViewed?.join(", ") || "None"}
Budget range: ${data.budget || "Not specified"}
Preferences: ${data.preferences || "Not specified"}

Provide insights on their preferences, urgency level, and likelihood to convert. Be concise and actionable.`;
        break;

      case "email_reply":
        prompt = `Generate a professional email reply for a real estate inquiry:

Client: ${data.clientName}
Their inquiry: "${data.inquiry}"
Property: ${data.propertyName || "General inquiry"}
Context: ${data.context || "Initial contact"}

Write a helpful, friendly response in 3-4 sentences. Be professional but warm. Include a call to action.`;
        break;

      case "whatsapp_reply":
        prompt = `Generate a WhatsApp reply for a real estate inquiry. Keep it conversational and brief (2-3 sentences max):

Client: ${data.clientName}
Their message: "${data.message}"
Context: ${data.context || "Property inquiry"}

Be friendly, helpful, and include an emoji if appropriate. Keep it short for WhatsApp.`;
        break;

      case "brochure_content":
        prompt = `Generate marketing content for a property brochure PDF:

Property: ${data.title}
Developer: ${data.developer}
Location: ${data.location}
Price: AED ${data.price?.toLocaleString()}
Features: ${data.features?.join(", ")}
Payment Plan: ${data.paymentPlan || "Flexible payment plan available"}

Generate JSON with these fields:
- headline: Catchy main title (max 8 words)
- tagline: Compelling subtitle (max 12 words)
- highlights: Array of 4 key selling points (short phrases)
- description: 2 paragraphs describing the property
- callToAction: Compelling CTA (max 6 words)

Return ONLY valid JSON, no markdown.`;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid generation type" },
          { status: 400 }
        );
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // For brochure content, try to parse JSON
    if (type === "brochure_content") {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({ success: true, data: parsed });
        }
      } catch {
        // Return as text if JSON parsing fails
      }
    }

    return NextResponse.json({ success: true, data: text });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
