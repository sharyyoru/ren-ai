import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generatePropertyDescription(property: {
  title: string;
  area: string;
  city: string;
  bedrooms: number;
  price: number;
  developer: string;
  amenities?: string[];
}): Promise<string> {
  const prompt = `Generate a compelling 2-paragraph property description for a real estate listing:
  
Property: ${property.title}
Location: ${property.area}, ${property.city}
Bedrooms: ${property.bedrooms}
Price: AED ${property.price.toLocaleString()}
Developer: ${property.developer}
Amenities: ${property.amenities?.join(", ") || "Premium amenities"}

Write in a professional, luxurious tone suitable for high-end UAE real estate.`;

  const result = await gemini.generateContent(prompt);
  return result.response.text();
}

export async function generateLeadSummary(interactions: {
  messages: string[];
  propertyViews: string[];
  inquiries: string[];
}): Promise<string> {
  const prompt = `Analyze this lead's behavior and generate a brief summary (2-3 sentences):
  
Messages sent: ${interactions.messages.length}
Properties viewed: ${interactions.propertyViews.join(", ")}
Inquiries about: ${interactions.inquiries.join(", ")}

Provide insights on their preferences and likelihood to convert.`;

  const result = await gemini.generateContent(prompt);
  return result.response.text();
}

export async function generateEmailReply(context: {
  clientName: string;
  inquiry: string;
  propertyName?: string;
}): Promise<string> {
  const prompt = `Generate a professional email reply for a real estate inquiry:
  
Client: ${context.clientName}
Their inquiry: "${context.inquiry}"
${context.propertyName ? `Property: ${context.propertyName}` : ""}

Write a helpful, friendly response. Keep it concise (3-4 sentences).`;

  const result = await gemini.generateContent(prompt);
  return result.response.text();
}

export async function generateBrochureContent(property: {
  title: string;
  description: string;
  features: string[];
  paymentPlan: object;
  images: string[];
}): Promise<{
  headline: string;
  tagline: string;
  highlights: string[];
  callToAction: string;
}> {
  const prompt = `Generate marketing content for a property brochure:
  
Property: ${property.title}
Description: ${property.description}
Features: ${property.features.join(", ")}

Return JSON with: headline, tagline, highlights (array of 4 bullet points), callToAction`;

  const result = await gemini.generateContent(prompt);
  const text = result.response.text();
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fallback
  }
  
  return {
    headline: property.title,
    tagline: "Luxury Living Redefined",
    highlights: property.features.slice(0, 4),
    callToAction: "Schedule Your Private Viewing Today",
  };
}
