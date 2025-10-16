"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type StepperFormProps = {
  name: string;
};

const StepWrapper = ({ children, backgroundImage }: { children: React.ReactNode; backgroundImage?: number }) => {
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
            className="absolute w-full h-full flex flex-col justify-end items-center text-center overflow-y-auto"
        >
            {/* Background Image - optimized with Next.js Image */}
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={`/images/${backgroundImage}.jpg`}
                        alt="Background"
                        fill
                        priority
                        quality={75}
                        sizes="100vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                </div>
            )}
            
            {/* Gradient Overlay - from bottom 66% dark to top transparent */}
            <div 
                className="absolute inset-0 z-10"
                style={{
                    background: 'linear-gradient(to top, rgba(10, 10, 10, 0.98) 0%, rgba(10, 10, 10, 0.95) 40%, rgba(10, 10, 10, 0.7) 66%, transparent 100%)',
                }}
            />
            
            {/* Content */}
            <div className="relative z-20 w-full pb-12 sm:pb-16 pt-32 sm:pt-40 px-4 sm:px-6 md:px-8 flex flex-col items-center">
                {children}
            </div>
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
          <StepWrapper key={1} backgroundImage={currentImage}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center">Achtung, {name}!</h1>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-200 text-center">Du wurdest für eine geheime Mission ausgewählt.</p>
            <button onClick={() => handleSetStep(2)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 sm:py-3 sm:px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 text-base sm:text-lg">
              Starte den vibe check
            </button>
            <p className="text-base sm:text-lg text-gray-300 mt-4 text-center">Bist du bereit?</p>
          </StepWrapper>
        )}
        {step === 2 && (
          <StepWrapper key={2} backgroundImage={currentImage}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-cyan-300 text-center">KRITISCHER CHECK</h2>
            <p className="text-lg sm:text-xl mb-8 sm:mb-12 text-gray-200 text-center">Kannst du am 15. November ab 18:00 Uhr?</p>
            
            <div className="flex gap-4 sm:gap-6 justify-center">
              <button onClick={() => handleSetStep(3)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-6 sm:py-3 sm:px-8 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300 text-base sm:text-lg">
                JA
              </button>
              <button onClick={handleNo} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 sm:py-3 sm:px-8 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300 text-base sm:text-lg">
                NEIN
              </button>
            </div>
          </StepWrapper>
        )}
        {step === 3 && (
          <StepWrapper key={3} backgroundImage={currentImage}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-yellow-300 text-center">Was spricht dich am meisten an?</h2>
            <p className="text-sm sm:text-md mb-6 text-gray-400 italic text-center">(Keine Sorge, wir fahren nicht ins Watz)</p>
            
            <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-xs">
              <button onClick={() => handleSetStep(4)} className="bg-gray-800/80 backdrop-blur-sm hover:bg-purple-700 border-2 border-transparent hover:border-purple-400 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base">
                Bottle Party
              </button>
              <button onClick={() => handleSetStep(4)} className="bg-gray-800/80 backdrop-blur-sm hover:bg-pink-700 border-2 border-transparent hover:border-pink-400 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base">
                Irgendwas zum Essen
              </button>
              <button onClick={() => handleSetStep(4)} className="bg-gray-800/80 backdrop-blur-sm hover:bg-cyan-700 border-2 border-transparent hover:border-cyan-400 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base">
                Beides (wähl das Leben)
              </button>
            </div>
            <p className="text-base sm:text-lg text-gray-300 mt-6 text-center">Hauptsache du kommst!</p>
          </StepWrapper>
        )}
        {step === 4 && (
          <StepWrapper key={4} backgroundImage={currentImage}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-orange-400 text-center">Wo findet das Spektakel statt?</h2>
            <div className="bg-gray-800/90 backdrop-blur-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 max-w-2xl w-full">
              <p className="text-lg sm:text-xl text-cyan-300 mb-3 sm:mb-4 font-semibold">📍 Geheimer Treffpunkt</p>
              <p className="text-base sm:text-lg text-gray-200 mb-2 break-words">{process.env.NEXT_PUBLIC_PARTY_ADDRESS || 'Adresse wird noch bekannt gegeben'}</p>
              
              {/* Google Maps Embed */}
              <div className="relative w-full h-48 sm:h-64 mb-3 sm:mb-4 rounded-lg overflow-hidden shadow-lg">
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
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 mb-4 w-full text-center text-sm sm:text-base"
              >
                🗺️ Route von meinem Standort
              </a>
            </div>
            
            <button 
              onClick={() => handleSetStep(5)} 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
            >
              Perfekt, ich bin dabei! ✓
            </button>
          </StepWrapper>
        )}
        {step === 5 && (
          <StepWrapper key={5} backgroundImage={currentImage}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-green-400 text-center">Mission FAST erfolgreich!</h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-200 text-center">Du musst nur mehr der Gruppe beitreten.</p>
            
            <div className="bg-blue-900/40 backdrop-blur-sm border-2 border-blue-400 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8 max-w-md w-full">
              <p className="text-base sm:text-lg text-blue-300 font-semibold mb-1">💫 +1 willkommen!</p>
              <p className="text-sm sm:text-md text-gray-200">Du kannst gerne jemanden mitbringen - bitte gib vorher Bescheid! 😊</p>
            </div>
            
            <a 
              href={process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 hover:from-green-500 hover:via-emerald-600 hover:to-green-500 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-10 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 text-sm sm:text-base md:text-xl animate-pulse"
              style={{
                animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite, glow 2s ease-in-out infinite',
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.6), 0 0 40px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.2)',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                <span className="text-lg sm:text-xl md:text-2xl">📱</span>
                <span className="whitespace-nowrap sm:whitespace-normal">Tritt der WhatsApp-Gruppe bei</span>
                <span className="text-lg sm:text-xl md:text-2xl">🎉</span>
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
          <StepWrapper key={10} backgroundImage={currentImage}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-orange-500 animate-bounce text-center">Warte mal...</h2>
            <p className="text-xl sm:text-2xl mb-4 text-gray-200 text-center">Bist du dir WIRKLICH sicher?</p>
            <p className="text-base sm:text-lg mb-8 text-gray-300 italic text-center">Es wird legendär! 🎉</p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md">
              <button 
                onClick={() => { setNoCount(0); handleSetStep(3); }} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full shadow-md transform hover:scale-110 transition-transform duration-300 animate-pulse text-sm sm:text-base"
              >
                OK, ich komme doch! 😊
              </button>
              <button 
                onClick={handleNo} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
              >
                Ja, sicher
              </button>
            </div>
          </StepWrapper>
        )}
        
        {step === 11 && (
          <StepWrapper key={11} backgroundImage={currentImage}>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-red-500 text-center">ERNSTHAFT?!</h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-2 text-gray-200 text-center">Du willst meinen Geburtstag verpassen?</p>
            <p className="text-base sm:text-lg md:text-xl mb-6 text-gray-300 text-center">Das gibt&apos;s nur einmal... 🎂</p>
            
            <img 
              src="https://media.giphy.com/media/3oEduOnl5IHM5NRodO/giphy.gif" 
              alt="Please" 
              className="mb-6 sm:mb-8 rounded-lg shadow-lg max-w-[200px] sm:max-w-sm mx-auto"
            />
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-lg">
              <button 
                onClick={() => { setNoCount(0); handleSetStep(3); }} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300 text-base sm:text-lg md:text-xl"
              >
                Mist, du hast Recht! 💚
              </button>
              <button 
                onClick={handleNo} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
              >
                Kann echt nicht
              </button>
            </div>
          </StepWrapper>
        )}
        
        {step === 12 && (
          <StepWrapper key={12} backgroundImage={currentImage}>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 text-purple-500 animate-pulse text-center">LETZTE CHANCE!</h2>
            <p className="text-xl sm:text-2xl md:text-3xl mb-4 text-gray-200 font-bold text-center">Komm schon! 🙏</p>
            
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-300 text-center">Alle werden da sein... nur du fehlst!</p>
            <div className="mb-6 sm:mb-8 text-center">
              <p className="text-sm sm:text-base md:text-lg text-yellow-300 mb-2">❌ Keine Ausreden - es ist SAMSTAG!</p>
              <p className="text-sm sm:text-base md:text-lg text-yellow-300 mb-2">❌ Keine Arbeit, keine Uni</p>
              <p className="text-sm sm:text-base md:text-lg text-yellow-300 mb-2">✅ Pure Eskalation & Spaß!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-lg">
              <button 
                onClick={() => { setNoCount(0); handleSetStep(3); }} 
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-3 sm:py-4 md:py-5 px-8 sm:px-10 md:px-12 rounded-full shadow-2xl transform hover:scale-110 sm:hover:scale-125 transition-all duration-300 text-base sm:text-xl md:text-2xl animate-bounce"
              >
                OKAY, ICH KOMME! 🎉
              </button>
              <button 
                onClick={handleNo} 
                className="bg-gray-700/80 backdrop-blur-sm hover:bg-gray-800 text-gray-400 font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300 text-xs sm:text-sm"
              >
                Kann wirklich nicht...
              </button>
            </div>
          </StepWrapper>
        )}
        
        {step === 6 && (
          <StepWrapper key={6} backgroundImage={currentImage}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-red-500 text-center">MISSION GESCHEITERT</h2>
            <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-gray-200 text-center">Schade. Wirklich schade. Bitte gib mir Bescheid!</p>
            <p className="text-sm sm:text-base md:text-lg mb-8 text-gray-400 italic text-center">Aber hey, vielleicht beim nächsten Mal... oder so. 😢</p>
            
            <button 
              onClick={() => { setNoCount(0); handleSetStep(1); }} 
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
            >
              Das war ein Fehler
            </button>
          </StepWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}
