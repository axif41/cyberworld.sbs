import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

const AdvancedHomeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const colors = [
      'rgba(34, 197, 94, 0.4)',
      'rgba(22, 163, 74, 0.3)',
      'rgba(74, 222, 128, 0.35)',
      'rgba(134, 239, 172, 0.3)',
      'rgba(16, 185, 129, 0.3)',
    ];

    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const drawHexagon = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      alpha: number
    ) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.05)';
      ctx.lineWidth = 1;
      const spacing = 60;
      for (let x = 0; x < w; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    };

    let time = 0;
    const hexPositions = [
      { x: 0.1, y: 0.15, size: 80 },
      { x: 0.85, y: 0.1, size: 60 },
      { x: 0.92, y: 0.7, size: 90 },
      { x: 0.05, y: 0.8, size: 70 },
      { x: 0.5, y: 0.05, size: 50 },
      { x: 0.75, y: 0.45, size: 45 },
      { x: 0.2, y: 0.5, size: 55 },
    ];

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(240, 253, 244, 1)');
      grad.addColorStop(0.5, 'rgba(248, 255, 254, 1)');
      grad.addColorStop(1, 'rgba(236, 253, 245, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Draw subtle grid
      drawGrid(ctx, w, h);

      // Draw animated hexagons
      hexPositions.forEach((pos, i) => {
        const pulse = Math.sin(time * 0.02 + i * 0.8) * 0.5 + 0.5;
        const alpha = 0.04 + pulse * 0.06;
        drawHexagon(ctx, pos.x * w, pos.y * h, pos.size + pulse * 15, alpha);
        drawHexagon(ctx, pos.x * w, pos.y * h, pos.size * 0.6 + pulse * 8, alpha * 0.7);
      });

      // Draw wave curves
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        ctx.moveTo(0, h * 0.6 + wave * 40);
        for (let x = 0; x <= w; x += 5) {
          const y =
            h * 0.6 +
            wave * 40 +
            Math.sin((x / w) * Math.PI * 3 + time * 0.01 + wave * 1.2) * 30 +
            Math.sin((x / w) * Math.PI * 5 + time * 0.015) * 15;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.06 - wave * 0.015})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw and update particles
      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Draw connection lines between nearby particles
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Radial glow in center
      const radGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.4);
      radGrad.addColorStop(0, 'rgba(34, 197, 94, 0.04)');
      radGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default AdvancedHomeBackground;
