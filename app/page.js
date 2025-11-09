'use client';

import { useEffect, useRef } from 'react';

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const aspectRatio = 9 / 16;
    const setCanvasSize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const windowRatio = windowWidth / windowHeight;

      if (windowRatio > aspectRatio) {
        canvas.height = windowHeight;
        canvas.width = windowHeight * aspectRatio;
      } else {
        canvas.width = windowWidth;
        canvas.height = windowWidth / aspectRatio;
      }
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Rain particles
    const raindrops = [];
    const numRaindrops = 150;

    for (let i = 0; i < numRaindrops; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.3 + 0.2
      });
    }

    // Streetlamp flicker
    let lampIntensity = 0.6;
    let flickerTimer = 0;

    const animate = () => {
      // Dark misty background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a12');
      gradient.addColorStop(0.5, '#151520');
      gradient.addColorStop(1, '#1a1a28');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Mist layers
      ctx.fillStyle = 'rgba(30, 30, 40, 0.3)';
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

      ctx.fillStyle = 'rgba(25, 25, 35, 0.4)';
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

      // Distant street - dark pavement
      ctx.fillStyle = 'rgba(20, 20, 25, 0.8)';
      ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.25);

      // Flickering streetlamp
      flickerTimer += 0.1;
      if (Math.random() > 0.95) {
        lampIntensity = Math.random() * 0.4 + 0.3;
      } else {
        lampIntensity += (0.6 - lampIntensity) * 0.1;
      }

      const lampX = canvas.width * 0.15;
      const lampY = canvas.height * 0.4;

      // Lamp glow
      const lampGradient = ctx.createRadialGradient(lampX, lampY, 0, lampX, lampY, 200);
      lampGradient.addColorStop(0, `rgba(255, 240, 200, ${lampIntensity * 0.3})`);
      lampGradient.addColorStop(0.3, `rgba(255, 240, 200, ${lampIntensity * 0.15})`);
      lampGradient.addColorStop(1, 'rgba(255, 240, 200, 0)');
      ctx.fillStyle = lampGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lamp post
      ctx.fillStyle = `rgba(40, 40, 45, ${0.8 + lampIntensity * 0.2})`;
      ctx.fillRect(lampX - 3, lampY, 6, canvas.height - lampY);

      // Lamp head
      ctx.fillStyle = `rgba(255, 240, 200, ${lampIntensity})`;
      ctx.fillRect(lampX - 15, lampY - 10, 30, 10);

      // The Listener - tall, unnaturally thin figure
      const listenerX = canvas.width * 0.5;
      const listenerY = canvas.height * 0.45;
      const listenerHeight = canvas.height * 0.35;
      const listenerWidth = listenerHeight * 0.15;

      // Body - elongated and thin
      ctx.save();
      ctx.translate(listenerX, listenerY);

      // Slight lean forward
      ctx.rotate(0.08);

      // Smooth pale body
      const bodyGradient = ctx.createLinearGradient(-listenerWidth/2, 0, listenerWidth/2, 0);
      bodyGradient.addColorStop(0, 'rgba(220, 220, 225, 0.95)');
      bodyGradient.addColorStop(0.5, 'rgba(235, 235, 240, 1)');
      bodyGradient.addColorStop(1, 'rgba(220, 220, 225, 0.95)');

      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.ellipse(0, listenerHeight * 0.4, listenerWidth * 0.5, listenerHeight * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head - featureless, tilted
      ctx.save();
      ctx.translate(0, -listenerHeight * 0.15);
      ctx.rotate(0.25); // Tilted head

      const headGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, listenerWidth * 0.8);
      headGradient.addColorStop(0, 'rgba(240, 240, 245, 1)');
      headGradient.addColorStop(0.7, 'rgba(230, 230, 235, 1)');
      headGradient.addColorStop(1, 'rgba(210, 210, 215, 0.9)');

      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, listenerWidth * 0.7, listenerWidth * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Long thin arms
      ctx.strokeStyle = 'rgba(225, 225, 230, 0.95)';
      ctx.lineWidth = listenerWidth * 0.15;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(-listenerWidth * 0.3, listenerHeight * 0.2);
      ctx.lineTo(-listenerWidth * 1.2, listenerHeight * 0.7);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(listenerWidth * 0.3, listenerHeight * 0.2);
      ctx.lineTo(listenerWidth * 1.2, listenerHeight * 0.7);
      ctx.stroke();

      // Long thin legs
      ctx.beginPath();
      ctx.moveTo(-listenerWidth * 0.2, listenerHeight * 0.8);
      ctx.lineTo(-listenerWidth * 0.3, listenerHeight * 1.3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(listenerWidth * 0.2, listenerHeight * 0.8);
      ctx.lineTo(listenerWidth * 0.3, listenerHeight * 1.3);
      ctx.stroke();

      ctx.restore();

      // Rain falling around the figure
      raindrops.forEach(drop => {
        ctx.strokeStyle = `rgba(180, 190, 210, ${drop.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;

        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      // Atmospheric fog overlay
      ctx.fillStyle = 'rgba(15, 15, 25, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </div>
  );
}
