import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  let language = 'uz';
  try {
    const data = await request.json();
    const message = data.message;
    language = data.language || 'uz';
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are "Finovo AI Assistant" (Nova.X), a world-class financial expert.
      
      CORE RULES:
      1. LANGUAGE DETECTION: Analyze the user's message.
      2. If the user asks for "3 tilda", "3 languages", or "translate", your response MUST be in Uzbek, Russian, and English (clearly separated with headers).
      3. OTHERWISE, respond ONLY in the same language the user is using (Uzbek, Russian, or English).
      
      PERSONALITY & DEPTH:
      - Provide expert advice on budgeting, savings, and investment.
      - Use clear steps or examples when helping with app features.
      - Be professional yet friendly. No unnecessary filler.
      
      User Message: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    return NextResponse.json({ response: responseText });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ 
      response: language === 'uz' 
        ? "Kechirasiz, sun'iy intellekt bilan bog'lanishda muammo bo'ldi. Iltimos, keyinroq qayta urinib ko'ring." 
        : "Sorry, there was a problem connecting to the AI. Please try again later."
    });
  }
}
