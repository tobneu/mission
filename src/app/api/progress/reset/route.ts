import { NextRequest, NextResponse } from 'next/server';
import { resetProgress } from '@/lib/progressStorage';

export async function GET(request: NextRequest) {
  try {
    // Optionally you could add a simple secret check here if needed
    resetProgress();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error resetting progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
