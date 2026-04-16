import { NextResponse } from 'next/server';
import { fetchThreatFeeds } from '@/lib/apiClients';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 20;

  try {
    const threats = await fetchThreatFeeds(limit);
    return NextResponse.json({ success: true, data: threats });
  } catch (error) {
    console.error("Error in /api/threats:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch threat intelligence data' },
      { status: 500 }
    );
  }
}
