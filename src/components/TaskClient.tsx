"use client";

import { useState, useEffect } from 'react';
import { getQuestionById, Question } from '@/lib/questions';
import { generateTaskCode } from '@/lib/tokenUtils';

  // --- cookie helpers (small and local to this component) ---
  function setCookie(name: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  }

  function getCookie(name: string) {
    const v = document.cookie.match('(?:^|; )' + name.replace(/([.*+?^${}()|[\]\\])/g, '\\$1') + '=([^;]*)');
    return v ? decodeURIComponent(v[1]) : null;
  }

interface Result {
  correct?: boolean;
  cooldown?: number;
  nextTaskCode?: string;
  nextTaskLocation?: string;
  finalRevealText?: string;
  error?: string;
}

interface TimeCheck {
  unlocked?: boolean;
  message?: string;
  unlockTime?: string;
  error?: string;
}

export default function TaskClient({ taskId }: { taskId: number }) {
  const [code, setCode] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  // no clipboard state needed anymore; we store codes as cookies
  const [cooldown, setCooldown] = useState(0);
  const [timeCheck, setTimeCheck] = useState<TimeCheck | null>(null);
  const [showIntroModal, setShowIntroModal] = useState(false);

  const questionData = getQuestionById(taskId);

  useEffect(() => {
    if (taskId === 1) {
      const introShown = localStorage.getItem('scavengerIntroShown');
      if (!introShown) {
        setShowIntroModal(true);
      } else {
        setHasAccess(true);
        setQuestion(questionData ?? null);
      }
    } else {
      // check cookie for the code for this task
      const prevCode = getCookie(`scavengerCode-${taskId}`);
      // Determine the expected previous-code: prefer an explicit nextTaskCode on the previous question,
      // otherwise fall back to the deterministic generated code for this taskId.
      const prevQuestion = getQuestionById(taskId - 1);
      let expectedPrev: string | null = null;
      if (prevQuestion?.nextTaskCode) {
        expectedPrev = prevQuestion.nextTaskCode;
      } else {
        try {
          expectedPrev = generateTaskCode(taskId);
        } catch (e) {
          // if generation fails (missing secret), don't auto-unlock
          expectedPrev = null;
        }
      }

      if (prevCode && expectedPrev && String(prevCode).toUpperCase() === String(expectedPrev).toUpperCase()) {
        setHasAccess(true);
        setQuestion(questionData ?? null);
      }
    }

    if (questionData?.timeLock) {
      fetch('/api/checkTime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      })
        .then(res => res.json())
        .then(data => setTimeCheck(data));
    }
  }, [taskId, questionData]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleCodeSubmit = () => {
    if (!code.trim()) return;

    // compute expected code for this task: prefer explicit nextTaskCode from previous question
    const prevQuestion = getQuestionById(taskId - 1);
    let expected: string | null = null;
    if (prevQuestion?.nextTaskCode) {
      expected = prevQuestion.nextTaskCode;
    } else {
      try {
        expected = generateTaskCode(taskId);
      } catch (e) {
        expected = null;
      }
    }

    if (expected && code.toUpperCase() === String(expected).toUpperCase()) {
      setHasAccess(true);
      setQuestion(questionData!);
    } else {
      alert('Falscher Code! Bitte scanne den vorherigen QR-Code und löse das Rätsel!');
    }
  };

  const handleCloseIntroModal = () => {
    setShowIntroModal(false);
    localStorage.setItem('scavengerIntroShown', 'true');
    setHasAccess(true);
    setQuestion(questionData ?? null);
  };

  // no clipboard helper — we store codes as cookies instead of copying to clipboard

  const handleAnswerSubmit = async (answerIndex: number) => {
    if (isSubmitting || cooldown > 0) return;

    setIsSubmitting(true);
    setSelectedAnswer(answerIndex);

    try {
      const response = await fetch('/api/checkAnswer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, answerIndex })
      });

      const data = await response.json();
      setResult(data);

      if (data.correct) {
        if (data.nextTaskCode) {
          // persist the secret key for the next task as a cookie named scavengerCode-<nextTaskId>
          setCookie(`scavengerCode-${taskId + 1}`, data.nextTaskCode as string, 7);
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
    return <div className="min-h-screen flex items-center justify-center">Task nicht gefunden</div>;
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
              <li>Jede Task hat eine Frage mit 4 Antworten</li>
              <li>Richtige Antwort gibt dir einen Code für die nächste Task</li>
              <li>Falsche Antwort = 30 Sekunden warten</li>
              <li>Einige Tasks sind zeitgesperrt</li>
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
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">Task gefunden</h1>

          <p>Du kommst hier nur weiter, wenn du die Frage davor schon gelöst hast</p>
          <div className="flex items-end space-x-3">
        <span
          className="w-4 h-4 bg-purple-400 rounded-full animate-bounce"
          style={{ animationDelay: '0s' }}
        />
        <span
          className="w-4 h-4 bg-purple-400 rounded-full animate-bounce"
          style={{ animationDelay: '0.12s' }}
        />
        <span
          className="w-4 h-4 bg-purple-400 rounded-full animate-bounce"
          style={{ animationDelay: '0.24s' }}
        />
          </div>

          <p className="mt-4 text-gray-300 text-sm">Bitte warten…</p>
          
        </div>
        
      </div>
          


    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">Task {taskId}</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">{questionData.questionText}</h2>

          <div className="grid grid-cols-1 gap-3">
            {questionData.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerSubmit(index)}
                disabled={isSubmitting || cooldown > 0 || result?.correct}
                className={`p-4 rounded-lg font-medium transition-all ${
                  selectedAnswer === index
                    ? result?.correct && index === questionData.correctAnswerIndex
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
          result.finalRevealText ? (
            <div className="bg-green-800 p-4 rounded-lg">
              <h3 className="text-2xl font-bold text-green-300 mb-2">🎉 Geschafft!</h3>
              <p className="text-gray-200 mb-3">{result.finalRevealText}</p>
            </div>
          ) : (
            <div className="bg-green-800 p-4 rounded-lg">
              <h3 className="text-2xl font-bold text-green-300 mb-2">🎉 Geschafft!</h3>
              {result.nextTaskLocation && <p className="text-gray-200 mb-3">Nächster Task: <b>{result.nextTaskLocation}</b></p>}
            </div>
          )
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
