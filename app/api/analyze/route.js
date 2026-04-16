import { NextResponse } from 'next/server';
import { analyzeThreat } from '@/lib/gemini';
import { fetchReputation } from '@/lib/apiClients';

export async function POST(request) {
  try {
    const body = await request.json();
    const { input, type } = body;

    if (!input || !type) {
      return NextResponse.json(
        { success: false, error: 'Input and type are required' },
        { status: 400 }
      );
    }

    // First fetch reputation context (simulated in API Client)
    const context = await fetchReputation(input, type);
    
    // Then send to Gemini for deep analysis, passing along the context
    // In a real scenario, we'd append the context string to the input
    const enhancedInput = `
      Target to analyze: ${input}
      Context from intelligence feeds: ${JSON.stringify(context)}
    `;

    const analysis = await analyzeThreat(enhancedInput, type);

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze threat' },
      { status: 500 }
    );
  }
}
