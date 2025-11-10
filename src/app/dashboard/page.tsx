"use client";

import { useState, useEffect } from 'react';
import { getQuestionById } from '../../lib/questions';

interface TaskProgress {
  id: number;
  isSolved: boolean;
  isLocked: boolean;
  timeUntilUnlock: number | null;
  unlockTime: string | null;
  hasTimeLock: boolean;
}

interface ProgressData {
  totalTasks: number;
  solvedTasks: number[];
  tasks: TaskProgress[];
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState<{ [key: number]: string }>({});

  const fetchProgress = async () => {
    try {
      console.log('Fetching progress...');
      const response = await fetch('/api/progress');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      // Validate data structure
      if (!data || typeof data.totalTasks !== 'number') {
        throw new Error('Invalid data structure received');
      }
      
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
      // Set some fallback data or show error state
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
    // Refresh every 5 seconds
    const interval = setInterval(fetchProgress, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!progress) return;
    const updateCountdowns = () => {
      const newCountdowns: { [key: number]: string } = {};

      progress.tasks.forEach(task => {
        // compute countdown only from unlockTime when it's in the future
        if (task.hasTimeLock && task.unlockTime) {
          const unlockTs = new Date(task.unlockTime).getTime();
          const remaining = unlockTs - Date.now();
          if (remaining > 0) {
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            newCountdowns[task.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          } else {
            // unlocked
            newCountdowns[task.id] = '00:00:00';
          }
        }
      });

      setCountdowns(newCountdowns);
    };

    updateCountdowns();
    const countdownInterval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(countdownInterval);
  }, [progress]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Lade Dashboard...</div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-400 text-xl">Fehler beim Laden der Daten</div>
      </div>
    );
  }

  const solvedCount = progress.solvedTasks.length;
  const totalCount = progress.totalTasks;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="text-center">
            <div className="text-6xl font-bold text-green-400 mb-2">
              {solvedCount}/{totalCount}
            </div>
            <div className="text-xl text-gray-300">
              Tasks gelöst
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(solvedCount / totalCount) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {(() => {
            // Determine the next unsolved task index (first not solved)
            const nextUnsolvedIndex = progress.tasks.findIndex(t => !t.isSolved);
            const nextUnsolvedId = nextUnsolvedIndex >= 0 ? progress.tasks[nextUnsolvedIndex].id : null;

            return progress.tasks.map(task => {
              const question = getQuestionById(task.id);
              // The displayed "current task location" is stored as nextTaskLocation on the previous question
              const prevQuestion = task.id > 1 ? getQuestionById(task.id - 1) : undefined;
              const currentTaskLocation = prevQuestion?.nextTaskLocation ?? null;
              return (
              <div
                key={task.id}
              className={`bg-gray-800 rounded-lg p-4 border-2 transition-all ${
                task.isSolved
                  ? 'border-green-500 bg-green-900/20'
                    : (task.hasTimeLock && task.unlockTime && new Date(task.unlockTime).getTime() > Date.now())
                    ? 'border-yellow-500 bg-yellow-900/20'
                    : (!task.isSolved && task.id === nextUnsolvedId)
                    ? 'border-blue-500 bg-blue-900/10'
                  : 'border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Task {task.id}</h3>
                  {task.isSolved && (
                  <span className="text-green-400 text-xl">✅</span>
                )}
                  {/* Time-locked (future unlock) */}
                  {(task.hasTimeLock && task.unlockTime && new Date(task.unlockTime).getTime() > Date.now()) && !task.isSolved && (
                    <span className="text-yellow-400 text-xl">⏰</span>
                  )}
                  {/* Available (next unsolved and not time-locked) */}
                  {!task.isSolved && task.id === nextUnsolvedId && !(task.hasTimeLock && task.unlockTime && new Date(task.unlockTime).getTime() > Date.now()) && (
                    <span className="text-blue-400 text-xl">🔓</span>
                  )}
                  {/* Locked / not yet available */}
                  {!task.isSolved && task.id !== nextUnsolvedId && !(task.hasTimeLock && task.unlockTime && new Date(task.unlockTime).getTime() > Date.now()) && (
                    <span className="text-gray-400 text-xl">🔒</span>
                  )}
              </div>
                <div className="text-sm text-gray-300">
                  {task.isSolved ? (
                    <div>
                      <div className="text-green-400">Gelöst!</div>
                      {currentTaskLocation && (
                        <div className="text-xs text-gray-300 mt-1">Ort dieses Tasks: {currentTaskLocation}</div>
                      )}
                      {/* 'Nächster Ort' entfernt hier, damit die Location nur beim folgenden Task als 'Ort' angezeigt wird (vermeidet Duplikate) */}
                    </div>
                  ) : (task.hasTimeLock && task.unlockTime && new Date(task.unlockTime).getTime() > Date.now()) ? (
                    <div>
                      <div className="text-yellow-400 mb-1">Verfügbar in:</div>
                      <div className="text-2xl font-mono font-bold text-yellow-300">
                        {countdowns[task.id] || '00:00:00'}
                      </div>
                      {task.unlockTime && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(task.unlockTime).toLocaleTimeString('de-DE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} Uhr
                        </div>
                      )}
                    </div>
                  ) : task.id === nextUnsolvedId ? (
                    <div>
                      <span className="text-blue-300">Jetzt verfügbar</span>
                      {currentTaskLocation && (
                        <div className="text-xs text-gray-400 mt-1">Ort: {currentTaskLocation}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">Noch nicht verfügbar</span>
                  )}
                </div>
            </div>
            )
          })
          })()}
        </div>

        <div className="mt-8 text-center text-gray-400">
          <p>Dashboard aktualisiert sich automatisch alle 5 Sekunden</p>
          <button
            onClick={fetchProgress}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Sofort aktualisieren
          </button>
        </div>
      </div>
    </div>
  );
}