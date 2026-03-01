import { useEffect, useRef } from 'react';

export default function CyberpunkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Matrix rain columns
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>{}[]|/\\';

    function draw() {
      // Semi-transparent black to create trail effect
      ctx!.fillStyle = 'rgba(7, 7, 18, 0.05)';
      ctx!.fillRect(0, 0, width, height);

      // Green matrix characters
      ctx!.font = `${fontSize}px "Share Tech Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Vary opacity for depth effect
        const opacity = Math.random() * 0.5 + 0.1;
        if (drops[i] * fontSize < height * 0.3) {
          ctx!.fillStyle = `rgba(0, 212, 255, ${opacity})`;
        } else {
          ctx!.fillStyle = `rgba(0, 255, 136, ${opacity * 0.6})`;
        }

        ctx!.fillText(char, x, y);

        // Reset drop to top randomly
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    function animate() {
      draw();
      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
