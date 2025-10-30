"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getQuestionById, getTotalStations } from '@/lib/questions';

export default function StationPage() {
  const params = useParams();
  const stationId = parseInt(params.id as string);
  const [code, setCode] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [question, setQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [cooldown, setCooldown] = useState(0);
  const [timeCheck, setTimeCheck] = useState<any>(null);
  const [showIntroModal, setShowIntroModal] = useState(false);

  const questionData = getQuestionById(stationId);

  useEffect(() => {
    // Check if station 1 or if previous code is stored
    if (stationId === 1) {
      // Check if intro modal was already shown
      const introShown = localStorage.getItem('scavengerIntroShown');
      if (!introShown) {
        setShowIntroModal(true);
      } else {
        setHasAccess(true);
        setQuestion(questionData);
      }
    } else {
      const storedCodes = JSON.parse(localStorage.getItem('scavengerCodes') || '[]');
      const prevCode = storedCodes[stationId - 2]; // codes are 0-indexed for previous stations
      if (prevCode) {
        setHasAccess(true);
        setQuestion(questionData);
      }
    }

    // Check time lock
    if (questionData?.timeLock) {
      fetch('/api/checkTime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stationId })
      })
      .then(res => res.json())
      .then(data => setTimeCheck(data));
    }
  }, [stationId, questionData]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleCodeSubmit = () => {
    if (code.trim()) {
      const storedCodes = JSON.parse(localStorage.getItem('scavengerCodes') || '[]');
      const prevCode = storedCodes[stationId - 2];
      if (code.toUpperCase() === prevCode?.toUpperCase()) {
        setHasAccess(true);
        setQuestion(questionData);
      } else {
        alert('Falscher Code! Bitte scanne den vorherigen QR-Code und löse das Rätsel!');
      }
    }
  };

  const handleCloseIntroModal = () => {
    setShowIntroModal(false);
    localStorage.setItem('scavengerIntroShown', 'true');
    setHasAccess(true);
    setQuestion(questionData);
  };

  const handleAnswerSubmit = async (answerIndex: number) => {
    if (isSubmitting || cooldown > 0) return;

    setIsSubmitting(true);
    setSelectedAnswer(answerIndex);

    try {
      const response = await fetch('/api/checkAnswer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stationId, answerIndex })
      });

      const data = await response.json();
      setResult(data);

      if (data.correct) {
        if (data.nextCode) {
          const storedCodes = JSON.parse(localStorage.getItem('scavengerCodes') || '[]');
          storedCodes[stationId - 1] = data.nextCode; // store for next station
          localStorage.setItem('scavengerCodes', JSON.stringify(storedCodes));
        }
      } else if (data.cooldown) {
        setCooldown(data.cooldown);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!questionData) {
    return <div className="min-h-screen flex items-center justify-center">Station nicht gefunden</div>;
  }

  if (timeCheck && !timeCheck.unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md text-center">
          <h1 className="text-2xl font-bold text-yellow-400 mb-4">Zeitgesperrt!</h1>
          <p className="text-gray-300">{timeCheck.message}</p>
        </div>
      </div>
    );
  }

  if (showIntroModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">
            🏆 Willkommen zur Schnitzeljagd!
          </h2>
          <div className="text-gray-200 space-y-3 mb-6">
            <p>
              <strong>🎯 Ziel:</strong> Löse alle Rätsel und finde den Schatz!
            </p>
            <p>
              <strong>🔓 Wie es funktioniert:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Jede Station hat eine Frage mit 4 Antworten</li>
              <li>Richtige Antwort gibt dir einen Code für die nächste Station</li>
              <li>Falsche Antwort = 30 Sekunden warten</li>
              <li>Einige Stationen sind zeitgesperrt</li>
              <li>Der Fortschritt wird automatisch gespeichert</li>
            </ul>
            <p className="text-yellow-400 font-semibold">
              Viel Spaß und viel Erfolg! 🍀
            </p>
          </div>
          <button
            onClick={handleCloseIntroModal}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Los geht's! 🚀
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md">
          <h1 className="text-2xl font-bold text-cyan-400 mb-4">Code erforderlich</h1>
          <p className="text-gray-300 mb-4">Gib den Code der vorherigen Station ein:</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded mb-4 text-white"
            placeholder="Code eingeben..."
          />
          <button
            onClick={handleCodeSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
          >
            Zugang freischalten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">Station {stationId}</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">{question.questionText}</h2>

          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerSubmit(index)}
                disabled={isSubmitting || cooldown > 0 || result?.correct}
                className={`p-4 rounded-lg font-medium transition-all ${
                  selectedAnswer === index
                    ? result?.correct && index === question.correctAnswerIndex
                      ? 'bg-green-600 text-white'
                      : result && !result.correct && index === selectedAnswer
                      ? 'bg-red-600 text-white'
                      : 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                } ${cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {cooldown > 0 && (
          <div className="text-center text-red-400 font-semibold">
            Falsche Antwort! Warte {cooldown} Sekunden...
          </div>
        )}

        {result && result.correct && (
          <div className="text-center">
            {result.finalRevealText ? (
              <div className="bg-green-800 p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-green-300 mb-2">🎉 Geschafft!</h3>
                <p className="text-gray-200">{result.finalRevealText}</p>
              </div>
            ) : (
              <div className="bg-green-800 p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-green-300 mb-2">Richtig!</h3>
                <p className="text-gray-200">Code für Station {stationId + 1}: <strong>{result.nextCode}</strong></p>
                <p className="text-sm text-gray-400 mt-2">Scanne den nächsten QR-Code!</p>
              </div>
            )}
          </div>
        )}

        {result && !result.correct && !result.cooldown && (
          <div className="text-center text-red-400 font-semibold">
            Falsche Antwort! Versuche es nochmal.
          </div>
        )}
      </div>
    </div>
  );
}