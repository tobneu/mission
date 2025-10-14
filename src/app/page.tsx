'use client';


import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [gifUrls, setGifUrls] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gifImagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const fetchRandomGifs = async () => {
      try {
        const apiKey = 'VVaEH5k7UKzIuvngtpAqnZ8nQQW5U5hw';
        const gifPromises = [];
        
        for (let i = 0; i < 5; i++) {
          gifPromises.push(
            fetch(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&rating=g`)
              .then(res => res.json())
          );
        }
        
        const results = await Promise.all(gifPromises);
        const urls = results
          .map(data => data.data?.images?.original?.url)
          .filter(url => url) as string[];
        
        setGifUrls(urls.length > 0 ? urls : ['https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif']);
      } catch (error) {
        console.error('Error fetching GIFs:', error);
        setGifUrls(['https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif']);
      }
    };

    fetchRandomGifs();
  }, []);

  useEffect(() => {
    if (gifUrls.length === 0) return;

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

    const confetti: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      gravity: number;
    }> = [];

    for (let i = 0; i < 150; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2 + 1,
        size: Math.random() * 10 + 5,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        gravity: 0.1,
      });
    }

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
    }> = [];

    for (let i = 0; i < Math.min(5, gifUrls.length); i++) {
      const width = 150 + Math.random() * 100;
      bouncingGifs.push({
        x: Math.random() * (canvas.width - width),
        y: Math.random() * (canvas.height - width),
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        width: width,
        height: width,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        imageIndex: i,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((c) => {
        c.vy += c.gravity;
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.rotationSpeed;

        if (c.y > canvas.height + 50) {
          c.y = -50;
          c.x = Math.random() * canvas.width;
          c.vy = Math.random() * 2 + 1;
        }
        if (c.x < -50 || c.x > canvas.width + 50) {
          c.vx *= -1;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.fillStyle = c.color;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size / 3);
        ctx.restore();
      });

      bouncingGifs.forEach((gif) => {
        const img = gifImagesRef.current[gif.imageIndex];
        
        gif.x += gif.vx;
        gif.y += gif.vy;
        gif.rotation += gif.rotationSpeed;

        if (gif.x <= 0 || gif.x + gif.width >= canvas.width) {
          gif.vx *= -0.95;
        }
        if (gif.y <= 0 || gif.y + gif.height >= canvas.height) {
          gif.vy *= -0.95;
        }

        gif.x = Math.max(0, Math.min(canvas.width - gif.width, gif.x));
        gif.y = Math.max(0, Math.min(canvas.height - gif.height, gif.y));

        if (img && img.complete) {
          ctx.save();
          ctx.translate(gif.x + gif.width / 2, gif.y + gif.height / 2);
          ctx.rotate(gif.rotation);
          ctx.globalAlpha = 0.9;
          ctx.shadowBlur = 20;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
          ctx.drawImage(img, -gif.width / 2, -gif.height / 2, gif.width, gif.height);
          ctx.restore();
        }
      });

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
    <div className="relative min-h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
