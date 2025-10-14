'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [gifUrls, setGifUrls] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gifImagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    // Fetch multiple random GIFs from Giphy
    const fetchRandomGifs = async () => {
      try {
        const apiKey = 'VVaEH5k7UKzIuvngtpAqnZ8nQQW5U5hw';
        const searches = ['fish', 'champagne'];
        const randomSearch = searches[Math.floor(Math.random() * searches.length)];
        
        const gifPromises = [];
        
        // Fetch 7 random fish/champagne themed GIFs
        for (let i = 0; i < 7; i++) {
          gifPromises.push(
            fetch(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${randomSearch}&rating=g`)
              .then(res => res.json())
          );
        }
        
        const results = await Promise.all(gifPromises);
        const urls = results
          .map(data => data.data?.images?.original?.url)
          .filter(url => url) as string[];
        
        setGifUrls(urls.length > 0 ? urls : [
          'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif'
        ]);
      } catch (error) {
        console.error('Error fetching GIFs:', error);
        setGifUrls(['https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif']);
      }
    };

    fetchRandomGifs();
  }, []);

  useEffect(() => {
    if (gifUrls.length === 0) return;

    // Load all GIFs as Images
    gifUrls.forEach((url, index) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        gifImagesRef.current[index] = img;
      };
    });
  }, [gifUrls]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Crazy spinning shapes
    const shapes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      type: number;
    }> = [];

    for (let i = 0; i < 200; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        size: Math.random() * 20 + 5,
        color: `hsl(${Math.random() * 360}, 90%, 60%)`,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        type: Math.floor(Math.random() * 3),
      });
    }

    // Bouncing GIFs (more than landing page!)
    const bouncingGifs: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      width: number;
      height: number;
      rotation: number;
      rotationSpeed: number;
      imageIndex: number;
      scale: number;
      scaleSpeed: number;
    }> = [];

    for (let i = 0; i < Math.min(7, gifUrls.length); i++) {
      const width = 100 + Math.random() * 150;
      bouncingGifs.push({
        x: Math.random() * (canvas.width - width),
        y: Math.random() * (canvas.height - width),
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        width: width,
        height: width,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        imageIndex: i,
        scale: 1,
        scaleSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      // Psychedelic background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${(time * 50) % 360}, 70%, 10%)`);
      gradient.addColorStop(0.5, `hsl(${(time * 30 + 120) % 360}, 70%, 15%)`);
      gradient.addColorStop(1, `hsl(${(time * 70 + 240) % 360}, 70%, 10%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw crazy shapes
      shapes.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotationSpeed;

        // Wrap around
        if (s.x < -50) s.x = canvas.width + 50;
        if (s.x > canvas.width + 50) s.x = -50;
        if (s.y < -50) s.y = canvas.height + 50;
        if (s.y > canvas.height + 50) s.y = -50;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = 0.6;

        switch (s.type) {
          case 0:
            ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size);
            break;
          case 1:
            ctx.beginPath();
            ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 2:
            ctx.beginPath();
            ctx.moveTo(0, -s.size / 2);
            ctx.lineTo(-s.size / 2, s.size / 2);
            ctx.lineTo(s.size / 2, s.size / 2);
            ctx.closePath();
            ctx.fill();
            break;
        }

        ctx.restore();
      });

      // Draw bouncing GIFs with extra effects
      bouncingGifs.forEach((gif) => {
        const img = gifImagesRef.current[gif.imageIndex];
        
        gif.x += gif.vx;
        gif.y += gif.vy;
        gif.rotation += gif.rotationSpeed;
        gif.scale = 1 + Math.sin(time * gif.scaleSpeed) * 0.3;

        // Bounce with energy
        if (gif.x <= 0 || gif.x + gif.width >= canvas.width) {
          gif.vx *= -1.1;
        }
        if (gif.y <= 0 || gif.y + gif.height >= canvas.height) {
          gif.vy *= -1.1;
        }

        // Keep speed reasonable
        gif.vx = Math.max(-10, Math.min(10, gif.vx));
        gif.vy = Math.max(-10, Math.min(10, gif.vy));

        gif.x = Math.max(0, Math.min(canvas.width - gif.width, gif.x));
        gif.y = Math.max(0, Math.min(canvas.height - gif.height, gif.y));

        if (img && img.complete) {
          ctx.save();
          ctx.translate(gif.x + gif.width / 2, gif.y + gif.height / 2);
          ctx.rotate(gif.rotation);
          ctx.scale(gif.scale, gif.scale);
          ctx.globalAlpha = 0.95;
          ctx.shadowBlur = 30;
          ctx.shadowColor = `hsl(${(time * 100 + gif.imageIndex * 50) % 360}, 100%, 50%)`;
          ctx.drawImage(img, -gif.width / 2, -gif.height / 2, gif.width, gif.height);
          ctx.restore();
        }
      });

      // Glitch effect
      if (Math.random() > 0.9) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`;
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 300,
          Math.random() * 100
        );
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [gifUrls]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Floating 404 Text */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pointer-events-none">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 animate-pulse mb-4">
          404
        </h1>
        <p className="text-3xl text-white font-bold mb-8 animate-bounce">
          Diese Seite existiert nicht... oder doch? 🤔
        </p>
        <Link 
          href="/"
          className="pointer-events-auto bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300 text-xl animate-pulse"
        >
          Zurück zur Realität
        </Link>
      </div>
    </div>
  );
}
