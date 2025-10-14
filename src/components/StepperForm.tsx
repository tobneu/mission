"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type StepperFormProps = {
  name: string;
};

const StepWrapper = ({ children }: { children: React.ReactNode }) => {
    const variants = {
        enter: { x: '100%', opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0 },
    };

    return (
        <motion.div
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
            className="absolute w-full h-full flex flex-col justify-center items-center text-center p-8"
        >
            {children}
        </motion.div>
    );
};


export default function StepperForm({ name }: StepperFormProps) {
  const [step, setStep] = useState(1);
  const [noCount, setNoCount] = useState(0);

  const handleNext = () => setStep(step + 1);
  const handleSetStep = (step: number) => setStep(step);
  
  const handleNo = () => {
    if (noCount < 3) {
      setNoCount(noCount + 1);
      setStep(10 + noCount); // Steps 10, 11, 12 für die nervigen Nachfragen
    } else {
      setStep(6); // Nach 3x NEIN -> finale Ablehnung
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepWrapper key={1}>
            <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Achtung, {name}!</h1>
            <p className="text-xl mb-8 text-gray-400">Du wurdest für eine geheime Mission ausgewählt.</p>
            <button onClick={() => handleSetStep(2)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
              Starte den vibe check
            </button>
          </StepWrapper>
        )}
        {step === 2 && (
          <StepWrapper key={2}>
            <h2 className="text-4xl font-bold mb-4 text-cyan-300">KRITISCHER CHECK</h2>
            <p className="text-xl mb-8 text-gray-400">Kannst du am 15. November ab 18:00 Uhr?</p>
            <div className="flex gap-6">
              <button onClick={() => handleSetStep(3)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300">
                JA
              </button>
              <button onClick={handleNo} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300">
                NEIN
              </button>
            </div>
          </StepWrapper>
        )}
        {step === 3 && (
          <StepWrapper key={3}>
            <h2 className="text-4xl font-bold mb-4 text-yellow-300">Was spricht dich am meisten an?</h2>
            <p className="text-md mb-8 text-gray-500 italic">(Keine Sorge, wir fahren nicht ins Watz)</p>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button onClick={() => handleSetStep(4)} className="bg-gray-800 hover:bg-purple-700 border-2 border-transparent hover:border-purple-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
                Bottle Party
              </button>
              <button onClick={() => handleSetStep(4)} className="bg-gray-800 hover:bg-pink-700 border-2 border-transparent hover:border-pink-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
                Irgendwas zum Essen
              </button>
              <button onClick={() => handleSetStep(4)} className="bg-gray-800 hover:bg-cyan-700 border-2 border-transparent hover:border-cyan-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
                Beides (wähl das Leben)
              </button>
            </div>
          </StepWrapper>
        )}
        {step === 4 && (
          <StepWrapper key={4}>
            <h2 className="text-4xl font-bold mb-6 text-orange-400">Wo findet das Spektakel statt?</h2>
            <button onClick={() => handleSetStep(5)} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
              Zeig mir den geheimen Treffpunkt!
            </button>
          </StepWrapper>
        )}
        {step === 5 && (
          <StepWrapper key={5}>
            <h2 className="text-4xl font-bold mb-4 text-green-400">MISSION ERFOLGREICH!</h2>
            <p className="text-xl mb-8 text-gray-300">Du bist dabei. Alle weiteren Infos in der Gruppe.</p>
            <a href="https://chat.whatsapp.com/DeaDBeefCafe" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full animate-pulse shadow-xl transform hover:scale-110 transition-transform duration-300">
              Tritt der WhatsApp-Gruppe bei
            </a>
          </StepWrapper>
        )}
        
        {/* Nervige Nachfragen bei NEIN */}
        {step === 10 && (
          <StepWrapper key={10}>
            <h2 className="text-5xl font-bold mb-4 text-orange-500 animate-bounce">Warte mal...</h2>
            <p className="text-2xl mb-8 text-gray-300">Bist du dir WIRKLICH sicher?</p>
            <p className="text-lg mb-8 text-gray-400 italic">Es wird legendär! 🎉</p>
            <div className="flex gap-6">
              <button 
                onClick={() => { setNoCount(0); handleSetStep(3); }} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-md transform hover:scale-110 transition-transform duration-300 animate-pulse"
              >
                OK, ich komme doch! 😊
              </button>
              <button 
                onClick={handleNo} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300"
              >
                Ja, sicher
              </button>
            </div>
          </StepWrapper>
        )}
        
        {step === 11 && (
          <StepWrapper key={11}>
            <h2 className="text-6xl font-bold mb-4 text-red-500">ERNSTHAFT?!</h2>
            <p className="text-2xl mb-4 text-gray-300">Du willst meinen Geburtstag Geburtstag verpassen?</p>
            <p className="text-xl mb-8 text-gray-400">Das gibt's nur einmal... 🎂</p>
            <img 
              src="https://media.giphy.com/media/3oEduOnl5IHM5NRodO/giphy.gif" 
              alt="Please" 
              className="mb-8 rounded-lg shadow-lg max-w-sm mx-auto"
            />
            <div className="flex gap-6">
              <button 
                onClick={() => { setNoCount(0); handleSetStep(3); }} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300 text-xl"
              >
                Mist, du hast Recht! 💚
              </button>
              <button 
                onClick={handleNo} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300"
              >
                Kann echt nicht
              </button>
            </div>
          </StepWrapper>
        )}
        
        {step === 12 && (
          <StepWrapper key={12}>
            <h2 className="text-7xl font-bold mb-6 text-purple-500 animate-pulse">LETZTE CHANCE!</h2>
            <p className="text-3xl mb-4 text-gray-200 font-bold">Komm schon, {name}! 🙏</p>
            <p className="text-xl mb-8 text-gray-400">Alle werden da sein... nur du fehlst!</p>
            <div className="mb-8">
              <p className="text-lg text-yellow-300 mb-2">❌ Keine langweilige Uni-Vorlesung</p>
              <p className="text-lg text-yellow-300 mb-2">❌ Kein nerviger Arbeitstag</p>
              <p className="text-lg text-yellow-300 mb-2">✅ Pure Eskalation & Spaß!</p>
            </div>
            <div className="flex gap-6">
              <button 
                onClick={() => { setNoCount(0); handleSetStep(3); }} 
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-5 px-12 rounded-full shadow-2xl transform hover:scale-125 transition-all duration-300 text-2xl animate-bounce"
              >
                OKAY, ICH KOMME! 🎉
              </button>
              <button 
                onClick={handleNo} 
                className="bg-gray-700 hover:bg-gray-800 text-gray-400 font-bold py-3 px-6 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300 text-sm"
              >
                Kann wirklich nicht...
              </button>
            </div>
          </StepWrapper>
        )}
        
        {step === 6 && (
          <StepWrapper key={6}>
            <h2 className="text-4xl font-bold mb-4 text-red-500">MISSION GESCHEITERT</h2>
            <p className="text-xl mb-8 text-gray-400">Schade. Wirklich schade.</p>
            <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDBscjBjdjVqa2Z1d3J0YzEwZzM2b3JzZ3NqYmJjZ3B6eGNrN2ZqdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oFzm622W766v4jQyY/giphy.gif" alt="Sad" className="mb-8 rounded-lg shadow-lg" />
            <button 
              onClick={() => { setNoCount(0); handleSetStep(1); }} 
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300"
            >
              Das war ein Fehler
            </button>
          </StepWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}
