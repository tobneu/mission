import { NextResponse } from 'next/server';
import { questions, getTotalTasks } from '@/lib/questions';
import { getSolvedTasks } from '@/lib/progressStorage';

export async function GET() {
  try {
    const now = new Date();
    const solvedTasks = getSolvedTasks();
    const progress = {
      totalTasks: getTotalTasks(),
      solvedTasks: Array.from(solvedTasks),
      tasks: questions.map(q => {
        const isSolved = solvedTasks.has(q.id);
        let timeUntilUnlock: number | null = null;
        let isLocked = false;

        if (q.timeLock) {
          const lockTime = new Date(q.timeLock);
          if (now < lockTime) {
            isLocked = true;
            timeUntilUnlock = Math.max(0, lockTime.getTime() - now.getTime());
          }
        }

        return {
          id: q.id,
          isSolved,
          isLocked,
          timeUntilUnlock, // in milliseconds
          unlockTime: q.timeLock ? new Date(q.timeLock).toISOString() : null,
          hasTimeLock: !!q.timeLock
        };
      })
    };

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error in progress API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}