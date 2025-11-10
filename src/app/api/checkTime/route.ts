import { NextRequest, NextResponse } from 'next/server';
import { getQuestionById } from '@/lib/questions';

export async function POST(request: NextRequest) {
  try {
    const { taskId } = await request.json();

    if (typeof taskId !== 'number') {
      return NextResponse.json({ error: 'Invalid taskId' }, { status: 400 });
    }

    const question = getQuestionById(taskId);
    if (!question) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (!question.timeLock) {
      return NextResponse.json({ unlocked: true });
    }

    const now = new Date();
    const lockTime = new Date(question.timeLock);

    if (now >= lockTime) {
      return NextResponse.json({ unlocked: true });
    } else {
      return NextResponse.json({
        unlocked: false,
        message: `Dieses Rätsel wird um ${lockTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr freigeschaltet!`,
        unlockTime: question.timeLock
      });
    }

  } catch (error) {
    console.error('Error in checkTime:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}