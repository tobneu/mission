"use client";

import { useState, useEffect } from 'react';

interface StationProgress {
  id: number;
  isSolved: boolean;
  isLocked: boolean;
  timeUntilUnlock: number | null;
  unlockTime: string | null;
  hasTimeLock: boolean;
}

interface ProgressData {
  totalStations: number;
  solvedStations: number[];
  stations: StationProgress[];
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
      if (!data || typeof data.totalStations !== 'number') {
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

      progress.stations.forEach(station => {
        if (station.isLocked && station.timeUntilUnlock) {
          const remaining = station.timeUntilUnlock;
          if (remaining > 0) {
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            newCountdowns[station.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          } else {
            newCountdowns[station.id] = '00:00:00';
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

  const solvedCount = progress.solvedStations.length;
  const totalCount = progress.totalStations;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-400">
          🏆 Schnitzeljagd Dashboard
        </h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="text-center">
            <div className="text-6xl font-bold text-green-400 mb-2">
              {solvedCount}/{totalCount}
            </div>
            <div className="text-xl text-gray-300">
              Stationen gelöst
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress.stations.map(station => (
            <div
              key={station.id}
              className={`bg-gray-800 rounded-lg p-4 border-2 transition-all ${
                station.isSolved
                  ? 'border-green-500 bg-green-900/20'
                  : station.isLocked
                  ? 'border-yellow-500 bg-yellow-900/20'
                  : 'border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Station {station.id}</h3>
                {station.isSolved && (
                  <span className="text-green-400 text-xl">✅</span>
                )}
                {station.isLocked && !station.isSolved && (
                  <span className="text-yellow-400 text-xl">⏰</span>
                )}
                {!station.isLocked && !station.isSolved && (
                  <span className="text-gray-400 text-xl">🔒</span>
                )}
              </div>

              <div className="text-sm text-gray-300">
                {station.isSolved ? (
                  <span className="text-green-400">Gelöst!</span>
                ) : station.isLocked ? (
                  <div>
                    <div className="text-yellow-400 mb-1">Gesperrt bis:</div>
                    <div className="text-2xl font-mono font-bold text-yellow-300">
                      {countdowns[station.id] || '00:00:00'}
                    </div>
                    {station.unlockTime && (
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(station.unlockTime).toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} Uhr
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">Noch nicht verfügbar</span>
                )}
              </div>
            </div>
          ))}
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