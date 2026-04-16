import { NextResponse } from 'next/server';
import { fetchCVEs } from '@/lib/apiClients';
import { enhanceDescription } from '@/lib/gemini';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || '';

  try {
    const rawCVEs = await fetchCVEs(keyword);
    
    // Optionally enhance descriptions with AI if they ask for it specifically in the UI (too slow to do all at once)
    // For demo purposes, we will return the raw data and let the frontend request AI enhancement for individual CVE details
    return NextResponse.json({ success: true, data: rawCVEs });
  } catch (error) {
    console.error("Error in /api/cve:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch CVE data' },
      { status: 500 }
    );
  }
}
