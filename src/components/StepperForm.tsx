"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type StepperFormProps = {
  name: string;
};

type Confetti = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
};

const StepWrapper = ({ children, backgroundImage }: { children: React.ReactNode; backgroundImage?: number }) => {
    const containerVariants = {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const contentVariants = {
        enter: { opacity: 0, y: 20 },
        center: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
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
                        className="object-cover object-[center_15%]"
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
            <motion.div 
                variants={contentVariants}
                initial="enter"
                animate="center"
                transition={{ delay: 0.1, duration: 0.3 }}
                className="relative z-20 w-full pb-12 sm:pb-16 pt-32 sm:pt-40 px-4 sm:px-6 md:px-8 flex flex-col items-center"
            >
                {children}
            </motion.div>
        </motion.div>
    );
};


export default function StepperForm({ name }: StepperFormProps) {
  const [step, setStep] = useState(1);
  const [noCount, setNoCount] = useState(0);
  const [currentImage, setCurrentImage] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize audio on mount
  useEffect(() => {
    audioRef.current = new Audio('/music/edm.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Set to 30% volume

    // Initialize sound effects
    correctSoundRef.current = new Audio('/music/correct.mp3');
    correctSoundRef.current.volume = 0.5;
    
    wrongSoundRef.current = new Audio('/music/wrong.mp3');
    wrongSoundRef.current.volume = 0.5;

    // Cleanup: pause and remove audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      correctSoundRef.current = null;
      wrongSoundRef.current = null;
    };
  }, []);

  // Confetti animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const confetti: Confetti[] = [];

    // Create fewer, more subtle confetti pieces
    for (let i = 0; i < 50; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 1 + 0.5,
        size: Math.random() * 6 + 3,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        gravity: 0.05,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((c) => {
        c.vy += c.gravity;
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.rotationSpeed;

        if (c.y > canvas.height + 50) {
          c.y = -50;
          c.x = Math.random() * canvas.width;
          c.vy = Math.random() * 1 + 0.5;
        }
        if (c.x < -50 || c.x > canvas.width + 50) {
          c.vx *= -1;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.fillStyle = c.color;
        ctx.globalAlpha = 0.4; // More subtle transparency
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size / 3);
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const playCorrectSound = () => {
    if (correctSoundRef.current) {
      correctSoundRef.current.currentTime = 0;
      correctSoundRef.current.play().catch(err => console.log('Sound play failed:', err));
    }
  };

  const playWrongSound = () => {
    if (wrongSoundRef.current) {
      wrongSoundRef.current.currentTime = 0;
      wrongSoundRef.current.play().catch(err => console.log('Sound play failed:', err));
    }
  };

  const getRandomImage = () => {
    const randomNum = Math.floor(Math.random() * 7) + 1;
    setCurrentImage(randomNum);
    return randomNum;
  };

  const handleSetStep = (newStep: number, playSound: 'correct' | 'wrong' | 'none' = 'none') => {
    getRandomImage();
    setStep(newStep);
    
    // Play sound effects
    if (playSound === 'correct') {
      playCorrectSound();
    } else if (playSound === 'wrong') {
      playWrongSound();
    }
    
    // Start music when moving from step 1 to step 2
    if (step === 1 && newStep === 2 && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Audio play failed:', err);
      });
    }
  };
  
  const handleNo = () => {
    playWrongSound();
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
      {/* Confetti Canvas - between background and content */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 15 }}
      />
      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepWrapper key={1} backgroundImage={currentImage}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center">Achtung, {name}!</h1>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-200 text-center">Du wurdest für eine geheime Mission ausgewählt.</p>
            <button onClick={() => handleSetStep(2)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-base sm:text-lg">
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
              <button onClick={() => handleSetStep(3, 'correct')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-base sm:text-lg">
                JA
              </button>
              <button onClick={handleNo} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-base sm:text-lg">
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
              <button onClick={() => handleSetStep(4, 'correct')} className="bg-gray-800/80 backdrop-blur-sm hover:bg-purple-700 border-2 border-transparent hover:border-purple-400 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                Bottle Party
              </button>
              <button onClick={() => handleSetStep(4, 'correct')} className="bg-gray-800/80 backdrop-blur-sm hover:bg-pink-700 border-2 border-transparent hover:border-pink-400 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                Irgendwas zum Essen
              </button>
              <button onClick={() => handleSetStep(4, 'correct')} className="bg-gray-800/80 backdrop-blur-sm hover:bg-cyan-700 border-2 border-transparent hover:border-cyan-400 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
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
              onClick={() => handleSetStep(5, 'correct')} 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
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
                onClick={() => { setNoCount(0); playCorrectSound(); handleSetStep(3, 'none'); }} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 animate-pulse text-base sm:text-lg"
              >
                OK, ich komme doch! 😊
              </button>
              <button 
                onClick={handleNo} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
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
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-lg">
              <button 
                onClick={() => { setNoCount(0); playCorrectSound(); handleSetStep(3, 'none'); }} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 text-base sm:text-lg"
              >
                Mist, du hast Recht! 💚
              </button>
              <button 
                onClick={handleNo} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
              >
                Kann echt nicht, ich geb dir Bescheid
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
                onClick={() => { setNoCount(0); playCorrectSound(); handleSetStep(3, 'none'); }} 
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-3 px-10 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 text-lg sm:text-xl animate-bounce"
              >
                OKAY, ICH KOMME! 🎉
              </button>
              <button 
                onClick={handleNo} 
                className="bg-gray-700/80 backdrop-blur-sm hover:bg-gray-800 text-gray-400 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-base"
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
              onClick={() => { setNoCount(0); playCorrectSound(); handleSetStep(1, 'none'); }} 
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
            >
              Das war ein Fehler
            </button>
          </StepWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}
