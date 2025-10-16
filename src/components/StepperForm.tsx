"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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
  const [currentImage, setCurrentImage] = useState(1);

  const getRandomImage = () => {
    const randomNum = Math.floor(Math.random() * 7) + 1;
    setCurrentImage(randomNum);
    return randomNum;
  };

  const handleSetStep = (newStep: number) => {
    getRandomImage();
    setStep(newStep);
  };
  
  const handleNo = () => {
    getRandomImage();
    if (noCount < 3) {
      setNoCount(noCount + 1);
      setStep(10 + noCount);
    } else {
      setStep(6);
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
            <p className="text-lg text-gray-400 mt-4">Bist du bereit?</p>
          </StepWrapper>
        )}
        {step === 2 && (
          <StepWrapper key={2}>
            <h2 className="text-4xl font-bold mb-4 text-cyan-300">KRITISCHER CHECK</h2>
            <p className="text-xl mb-8 text-gray-400">Kannst du am 15. November ab 18:00 Uhr?</p>
            
            {/* Random funny image */}
            <div className="mb-6">
              <Image 
                src={`/images/${currentImage}.jpg`}
                alt="Funny reaction"
                width={200}
                height={200}
                className="rounded-full shadow-2xl border-4 border-cyan-400 mx-auto"
              />
            </div>
            
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
            <p className="text-md mb-4 text-gray-500 italic">(Keine Sorge, wir fahren nicht ins Watz)</p>
            
            {/* Random funny image */}
            <div className="mb-6">
              <Image 
                src={`/images/${currentImage}.jpg`}
                alt="Funny reaction"
                width={180}
                height={180}
                className="rounded-lg shadow-2xl border-4 border-yellow-400 mx-auto"
              />
            </div>
            
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
            <p className="text-lg text-gray-400 mt-4">Hauptsache du kommst!</p>
          </StepWrapper>
        )}
        {step === 4 && (
          <StepWrapper key={4}>
            <h2 className="text-4xl font-bold mb-6 text-orange-400">Wo findet das Spektakel statt?</h2>
            <div className="bg-gray-800 rounded-lg p-6 mb-6 max-w-2xl">
              <p className="text-xl text-cyan-300 mb-4 font-semibold">📍 Geheimer Treffpunkt</p>
              <p className="text-lg text-gray-300 mb-2">{process.env.NEXT_PUBLIC_PARTY_ADDRESS || 'Adresse wird noch bekannt gegeben'}</p>
              
              {/* Google Maps Embed */}
              <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo'}&q=${encodeURIComponent(process.env.NEXT_PUBLIC_PARTY_ADDRESS || 'Stephansplatz 1, Wien, Austria')}&zoom=15`}
                  allowFullScreen
                />
              </div>
              
              {/* Route Button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(process.env.NEXT_PUBLIC_PARTY_ADDRESS || 'Stephansplatz 1, Wien, Austria')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 mb-4 w-full text-center"
              >
                🗺️ Route von meinem Standort
              </a>
            </div>
            
            <button 
              onClick={() => handleSetStep(5)} 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              Perfekt, ich bin dabei! ✓
            </button>
          </StepWrapper>
        )}
        {step === 5 && (
          <StepWrapper key={5}>
            <h2 className="text-4xl font-bold mb-4 text-green-400">Mission FAST erfolgreich!</h2>
            <p className="text-xl mb-6 text-gray-300">Du musst nur mehr der Gruppe beitreten.</p>
            
            {/* Happy celebration image */}
            <div className="mb-6">
              <Image 
                src={`/images/${currentImage}.jpg`}
                alt="Let's go!"
                width={200}
                height={200}
                className="rounded-full shadow-2xl border-4 border-green-400 mx-auto"
              />
            </div>
            
            <div className="bg-blue-900/30 border-2 border-blue-400 rounded-lg p-4 mb-6 max-w-md">
              <p className="text-lg text-blue-300 font-semibold mb-1">💫 +1 willkommen!</p>
              <p className="text-md text-gray-300">Du kannst gerne jemanden mitbringen - bitte gib vorher Bescheid! 😊</p>
            </div>
            
            <a 
              href={process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 hover:from-green-500 hover:via-emerald-600 hover:to-green-500 text-white font-bold py-5 px-10 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 text-xl animate-pulse"
              style={{
                animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite, glow 2s ease-in-out infinite',
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.6), 0 0 40px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.2)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-2xl">📱</span>
                Tritt der WhatsApp-Gruppe bei
                <span className="text-2xl">🎉</span>
              </span>
              <style jsx>{`
                @keyframes glow {
                  0%, 100% {
                    box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 0 40px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.2);
                  }
                  50% {
                    box-shadow: 0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.6), 0 0 90px rgba(34, 197, 94, 0.4);
                  }
                }
              `}</style>
            </a>
          </StepWrapper>
        )}
        
        {/* Nervige Nachfragen bei NEIN */}
        {step === 10 && (
          <StepWrapper key={10}>
            <h2 className="text-5xl font-bold mb-4 text-orange-500 animate-bounce">Warte mal...</h2>
            <p className="text-2xl mb-4 text-gray-300">Bist du dir WIRKLICH sicher?</p>
            <p className="text-lg mb-6 text-gray-400 italic">Es wird legendär! 🎉</p>
            
            {/* Random funny image with pleading look */}
            <div className="mb-6">
              <Image 
                src={`/images/${currentImage}.jpg`}
                alt="Please come!"
                width={220}
                height={220}
                className="rounded-full shadow-2xl border-4 border-orange-400 mx-auto animate-pulse"
              />
            </div>
            
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
            <p className="text-2xl mb-2 text-gray-300">Du willst meinen Geburtstag verpassen?</p>
            <p className="text-xl mb-6 text-gray-400">Das gibt&apos;s nur einmal... 🎂</p>
            
            {/* Random funny image with sad/pleading look */}
            <div className="mb-6">
              <Image 
                src={`/images/${currentImage}.jpg`}
                alt="Sad birthday boy"
                width={250}
                height={250}
                className="rounded-lg shadow-2xl border-4 border-red-500 mx-auto"
              />
            </div>
            
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
            <p className="text-3xl mb-2 text-gray-200 font-bold">Komm schon! 🙏</p>
            
            {/* Random funny image - desperate look */}
            <div className="mb-6">
              <Image 
                src={`/images/${currentImage}.jpg`}
                alt="Last chance!"
                width={280}
                height={280}
                className="rounded-full shadow-2xl border-8 border-purple-500 mx-auto animate-bounce"
              />
            </div>
            
            <p className="text-xl mb-8 text-gray-400">Alle werden da sein... nur du fehlst!</p>
            <div className="mb-8">
              <p className="text-lg text-yellow-300 mb-2">❌ Keine Ausreden - es ist SAMSTAG!</p>
              <p className="text-lg text-yellow-300 mb-2">❌ Keine Arbeit, keine Uni</p>
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
            <p className="text-xl mb-6 text-gray-400">Schade. Wirklich schade. Bitte gib mir Bescheid!</p>
            <p className="text-lg mb-6 text-gray-500 italic">Aber hey, vielleicht beim nächsten Mal... oder so. 😢</p>
            
            {/* Sad farewell image */}
            <div className="mb-6">
              <Image 
                src={`/images/${currentImage}.jpg`}
                alt="Sad times"
                width={300}
                height={300}
                className="rounded-full shadow-2xl border-8 border-red-600 mx-auto grayscale opacity-50"
              />
            </div>
            
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
