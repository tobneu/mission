import { NextRequest, NextResponse } from 'next/server';
import { getQuestionById } from '@/lib/questions';
import { addSolvedStation } from '@/lib/progressStorage';

// Simple in-memory storage for cooldowns (in production, use Redis or similar)
const cooldowns = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const { stationId, answerIndex, clientCode } = await request.json();

    if (typeof stationId !== 'number' || typeof answerIndex !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const question = getQuestionById(stationId);
    if (!question) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }

    // Check time lock if present
    if (question.timeLock) {
      const now = new Date();
      const lockTime = new Date(question.timeLock);
      if (now < lockTime) {
        return NextResponse.json({
          error: 'Time locked',
          message: `Dieses Rätsel wird um ${lockTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr freigeschaltet!`
        }, { status: 403 });
      }
    }

    // Check cooldown
    const cooldownKey = `station-${stationId}`;
    const lastAttempt = cooldowns.get(cooldownKey);
    const now = Date.now();
    const cooldownDuration = 30 * 1000; // 30 seconds

    if (lastAttempt && now - lastAttempt < cooldownDuration) {
      const remaining = Math.ceil((cooldownDuration - (now - lastAttempt)) / 1000);
      return NextResponse.json({
        correct: false,
        cooldown: remaining
      });
    }

    // Validate answer
    const isCorrect = answerIndex === question.correctAnswerIndex;

    if (isCorrect) {
      // Clear cooldown on correct answer
      cooldowns.delete(cooldownKey);

      // Track solved station
      addSolvedStation(stationId);

      if (question.finalRevealText) {
        return NextResponse.json({
          correct: true,
          finalRevealText: question.finalRevealText
        });
      } else {
        return NextResponse.json({
          correct: true,
          nextCode: question.nextStationCode
        });
      }
    } else {
      // Set cooldown on wrong answer
      cooldowns.set(cooldownKey, now);

      return NextResponse.json({
        correct: false,
        cooldown: 30
      });
    }

  } catch (error) {
    console.error('Error in checkAnswer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}