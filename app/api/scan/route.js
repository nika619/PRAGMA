import { NextResponse } from 'next/server';
import { scanTarget } from '@/lib/apiClients';
import { enhanceDescription } from '@/lib/gemini';

export async function POST(request) {
  try {
    const body = await request.json();
    const { target, type } = body;

    if (!target) {
      return NextResponse.json(
        { success: false, error: 'Target is required' },
        { status: 400 }
      );
    }

    const scanData = await scanTarget(target, type);
    
    // Add Gemini AI intelligence to the scan summary automatically
    const rawSummary = `Target ${target} has ${scanData.ports.length} open ports and runs ${scanData.tech.map(t=>t.name).join(',')}. SSL Grade is ${scanData.ssl.grade}.`;
    
    // Do not fail if AI enhancement fails, just return unenhanced
    let aiSummary = rawSummary;
    try {
       aiSummary = await enhanceDescription(`Generate a brief 2-sentence risk summary for an organization based on these scan results: ${rawSummary}`);
    } catch (e) {
       console.log("Failed to AI enhance scan summary, using raw.");
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...scanData,
        aiSummary
      } 
    });
  } catch (error) {
    console.error("Error in /api/scan:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to scan target' },
      { status: 500 }
    );
  }
}
