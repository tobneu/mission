import { NextRequest, NextResponse } from 'next/server';
import { getQuestionById } from '@/lib/questions';
import { addSolvedTask, getCooldownForTask, setCooldownForTask, clearCooldownForTask } from '@/lib/progressStorage';
import { generateTaskCode } from '@/lib/tokenUtils';

// Cooldown configuration (seconds) — can be set via env var QUESTION_COOLDOWN_SECONDS
const COOLDOWN_SECONDS = Math.max(0, parseInt(process.env.QUESTION_COOLDOWN_SECONDS ?? '30', 10));

export async function POST(request: NextRequest) {
  try {
    const { taskId, answerIndex } = await request.json();

    if (typeof taskId !== 'number' || typeof answerIndex !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const question = getQuestionById(taskId);
    if (!question) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
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

    // Check cooldown (persistent per-task)
    const now = Date.now();
    const cooldownUntil = getCooldownForTask(taskId);
    if (cooldownUntil && now < cooldownUntil) {
      const remaining = Math.ceil((cooldownUntil - now) / 1000);
      return NextResponse.json({ correct: false, cooldown: remaining });
    }

    // Validate answer
  const isCorrect = answerIndex === question.correctAnswerIndex;

    if (isCorrect) {
      // Clear cooldown on correct answer
      clearCooldownForTask(taskId);

      // Track solved task
      addSolvedTask(taskId);

      if (question.finalRevealText) {
        return NextResponse.json({
          correct: true,
          finalRevealText: question.finalRevealText
        });
      } else {
        // prefer explicit nextTaskCode/location from the question data
        const nextId = taskId + 1;
        const nextCode = question.nextTaskCode ?? generateTaskCode(nextId);
        const nextLocation = question.nextTaskLocation ?? null;
        return NextResponse.json({
          correct: true,
          nextTaskLocation: nextLocation,
          nextTaskCode: nextCode
        });
      }
    } else {
      // Set cooldown on wrong answer (persisted)
      const until = now + COOLDOWN_SECONDS * 1000;
      setCooldownForTask(taskId, until);
      return NextResponse.json({ correct: false, cooldown: COOLDOWN_SECONDS });
    }

  } catch (error) {
    console.error('Error in checkAnswer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}