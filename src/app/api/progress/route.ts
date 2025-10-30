import { NextResponse } from 'next/server';
import { questions, getTotalStations } from '@/lib/questions';
import { getSolvedStations } from '@/lib/progressStorage';

export async function GET() {
  try {
    const now = new Date();
    const solvedStations = getSolvedStations();
    const progress = {
      totalStations: getTotalStations(),
      solvedStations: Array.from(solvedStations),
      stations: questions.map(q => {
        const isSolved = solvedStations.has(q.id);
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