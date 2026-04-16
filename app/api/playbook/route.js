import { NextResponse } from 'next/server';
import { generatePlaybook } from '@/lib/gemini';

export async function POST(request) {
  try {
    const body = await request.json();
    const { incidentType, context } = body;

    if (!incidentType) {
      return NextResponse.json(
        { success: false, error: 'Incident type is required' },
        { status: 400 }
      );
    }

    const playbook = await generatePlaybook(incidentType, context);

    return NextResponse.json({ success: true, data: playbook });
  } catch (error) {
    console.error("Error in /api/playbook:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate playbook' },
      { status: 500 }
    );
  }
}
