"use client";

import { useEffect, useRef, useState } from 'react';

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars] = useState(() => Array.from({ length: 350 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.3,
    opacity: Math.random(),
    speed: Math.random() * 0.02
  })));

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      
      // Definir o tamanho real do canvas
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      
      // Definir o tamanho de exibição do canvas
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      // Não precisamos mais fazer ctx.scale aqui pois já aplicamos a escala no tamanho do canvas
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const renderStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Usar as dimensões reais do canvas para o cálculo
      stars.forEach(star => {
        ctx.beginPath();
        const currentOpacity = star.opacity * (Math.sin(Date.now() * star.speed) * 0.2 + 0.8);
        ctx.fillStyle = `rgba(233, 213, 255, ${currentOpacity})`;
        
        // Calcular posição usando as dimensões reais do canvas
        const x = (star.x * canvas.width) / 100;
        const y = (star.y * canvas.height) / 100;
        
        // Ajustar o tamanho da estrela baseado na escala
        const scale = window.devicePixelRatio || 1;
        ctx.arc(x, y, star.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    renderStars();

    const animate = () => {
      renderStars();
      return requestAnimationFrame(animate);
    };

    const animationFrame = animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrame);
    };
  }, [stars]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
}