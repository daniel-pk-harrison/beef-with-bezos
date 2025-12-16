'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/lib/theme/hooks';

// Matrix rain effect
function useMatrixRain(
  canvas: HTMLCanvasElement | null,
  enabled: boolean,
  color: string
) {
  useEffect(() => {
    if (!canvas || !enabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Matrix characters
    const chars =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      // Fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [canvas, enabled, color]);
}

// Fire/particles effect
function useFireEffect(
  canvas: HTMLCanvasElement | null,
  enabled: boolean,
  colors: string[]
) {
  useEffect(() => {
    if (!canvas || !enabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
    }

    const particles: Particle[] = [];
    const maxParticles = 100;

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 3 - 2,
      life: 0,
      maxLife: Math.random() * 60 + 40,
      size: Math.random() * 20 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles
      if (particles.length < maxParticles) {
        particles.push(createParticle());
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.size *= 0.98;

        const alpha = 1 - p.life / p.maxLife;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color.slice(0, 7) +
          Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, '0');
        ctx.fill();

        if (p.life >= p.maxLife || p.size < 1) {
          particles.splice(i, 1);
        }
      }
    };

    const interval = setInterval(draw, 16);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [canvas, enabled, colors]);
}

// Confetti effect
function useConfettiEffect(
  canvas: HTMLCanvasElement | null,
  enabled: boolean
) {
  useEffect(() => {
    if (!canvas || !enabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Confetti {
      x: number;
      y: number;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
      width: number;
      height: number;
      color: string;
    }

    const confetti: Confetti[] = [];
    const colors = [
      '#ff0000',
      '#ff7700',
      '#ffff00',
      '#00ff00',
      '#0077ff',
      '#7700ff',
      '#ff00ff',
    ];

    const createConfetti = (): Confetti => ({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      width: Math.random() * 10 + 5,
      height: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new confetti
      if (confetti.length < 50 && Math.random() > 0.9) {
        confetti.push(createConfetti());
      }

      // Update and draw
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.rotationSpeed;
        c.vy += 0.05; // Gravity

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
        ctx.restore();

        if (c.y > canvas.height + 20) {
          confetti.splice(i, 1);
        }
      }
    };

    const interval = setInterval(draw, 16);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [canvas, enabled]);
}

// Stars/space effect
function useStarsEffect(
  canvas: HTMLCanvasElement | null,
  enabled: boolean
) {
  useEffect(() => {
    if (!canvas || !enabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Star {
      x: number;
      y: number;
      z: number;
      size: number;
    }

    const stars: Star[] = [];
    const numStars = 200;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 0.5,
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 16, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      for (const star of stars) {
        star.z -= 2;
        if (star.z <= 0) {
          star.z = 1000;
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
        }

        const scale = 1000 / star.z;
        const x = star.x * scale;
        const y = star.y * scale;
        const size = star.size * scale;

        const alpha = Math.min(1, (1000 - star.z) / 500);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const interval = setInterval(draw, 16);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [canvas, enabled]);
}

// Sparkles effect
function useSparklesEffect(
  canvas: HTMLCanvasElement | null,
  enabled: boolean
) {
  useEffect(() => {
    if (!canvas || !enabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Sparkle {
      x: number;
      y: number;
      size: number;
      life: number;
      maxLife: number;
    }

    const sparkles: Sparkle[] = [];

    const createSparkle = (): Sparkle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 2,
      life: 0,
      maxLife: Math.random() * 40 + 20,
    });

    const drawStar = (x: number, y: number, size: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.moveTo(0, 0);
        ctx.lineTo(size / 4, size / 4);
        ctx.lineTo(0, size);
        ctx.lineTo(-size / 4, size / 4);
      }
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new sparkles
      if (sparkles.length < 30 && Math.random() > 0.8) {
        sparkles.push(createSparkle());
      }

      // Update and draw
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.life++;

        const progress = s.life / s.maxLife;
        const alpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2;

        drawStar(s.x, s.y, s.size * (1 + Math.sin(s.life * 0.2) * 0.3), alpha);

        if (s.life >= s.maxLife) {
          sparkles.splice(i, 1);
        }
      }
    };

    const interval = setInterval(draw, 16);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [canvas, enabled]);
}

export function CanvasEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  const particles = theme.effects.particles;

  useMatrixRain(
    canvasRef.current,
    particles === 'matrix' || theme.effects.matrixRain,
    theme.colors.primary[500]
  );

  useFireEffect(canvasRef.current, particles === 'fire', [
    '#ff4400',
    '#ff6600',
    '#ff8800',
    '#ffaa00',
    '#ffcc00',
  ]);

  useConfettiEffect(canvasRef.current, particles === 'confetti');

  useStarsEffect(canvasRef.current, particles === 'stars');

  useSparklesEffect(canvasRef.current, particles === 'sparkles');

  // Only render canvas if we have particle effects
  if (
    particles === 'none' &&
    !theme.effects.matrixRain
  ) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
