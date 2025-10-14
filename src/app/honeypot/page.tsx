'use client';

import { useEffect } from 'react';

export default function HoneypotPage() {

  // Tab-Bombe bei jedem Klick auf die unsichtbaren Buttons
  const handleTrollClick = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        window.open('https://www.youtube.com/watch?v=FoD0rTRGaNE', '_blank');
      }, i * 200);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-black overflow-hidden">
      <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 animate-pulse">Gotcha!</h1>
      <p className="text-2xl mb-8 text-gray-300">Sieht so aus, als hättest du versucht, das System auszutricksen...</p>
      
      {/* Grid mit mehreren gleichzeitig abspielenden Videos für maximales Chaos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl mb-8">
        {/* Video 1 mit unsichtbarem Button */}
        <div className="relative aspect-w-16 aspect-h-9 shadow-2xl shadow-red-500/50 rounded-lg overflow-hidden">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/FoD0rTRGaNE?autoplay=1&loop=1&playlist=FoD0rTRGaNE" title="Video 1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
          <button 
            onClick={handleTrollClick}
            className="absolute inset-0 w-full h-full bg-transparent cursor-pointer z-10 opacity-0 hover:opacity-5 hover:bg-red-500 transition-opacity"
            aria-label="Troll Button"
          />
        </div>
        
        {/* Video 2 mit unsichtbarem Button */}
        <div className="relative aspect-w-16 aspect-h-9 shadow-2xl shadow-yellow-500/50 rounded-lg overflow-hidden">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/FoD0rTRGaNE?autoplay=1&loop=1&playlist=FoD0rTRGaNE" title="Video 2" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
          <button 
            onClick={handleTrollClick}
            className="absolute inset-0 w-full h-full bg-transparent cursor-pointer z-10 opacity-0 hover:opacity-5 hover:bg-yellow-500 transition-opacity"
            aria-label="Troll Button"
          />
        </div>
        
        {/* Video 3 mit unsichtbarem Button */}
        <div className="relative aspect-w-16 aspect-h-9 shadow-2xl shadow-purple-500/50 rounded-lg overflow-hidden">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/FoD0rTRGaNE?autoplay=1&loop=1&playlist=FoD0rTRGaNE" title="Video 3" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
          <button 
            onClick={handleTrollClick}
            className="absolute inset-0 w-full h-full bg-transparent cursor-pointer z-10 opacity-0 hover:opacity-5 hover:bg-purple-500 transition-opacity"
            aria-label="Troll Button"
          />
        </div>
        
        {/* Video 4 mit unsichtbarem Button */}
        <div className="relative aspect-w-16 aspect-h-9 shadow-2xl shadow-green-500/50 rounded-lg overflow-hidden">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/FoD0rTRGaNE?autoplay=1&loop=1&playlist=FoD0rTRGaNE" title="Video 4" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
          <button 
            onClick={handleTrollClick}
            className="absolute inset-0 w-full h-full bg-transparent cursor-pointer z-10 opacity-0 hover:opacity-5 hover:bg-green-500 transition-opacity"
            aria-label="Troll Button"
          />
        </div>
      </div>
      
      <p className="text-xl text-red-400 font-bold animate-bounce">🔥 MAXIMALES CHAOS AKTIVIERT 🔥</p>
      <p className="text-lg text-yellow-300 mt-4 animate-pulse">💣 Tab-Bombe gestartet... 💣</p>
      <p className="text-sm text-gray-500 mt-2">💡 Tipp: Nicht auf die Videos klicken... 😈</p>
    </div>
  );
}
