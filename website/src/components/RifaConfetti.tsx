"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#E97C43", "#00468C", "#FFD166", "#06D6A0", "#EF476F", "#F8F4EF"];

export function RifaConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 8 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 3,
      angle: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 0.15,
    }));

    let raf: number;
    let alive = true;

    function draw() {
      if (!alive || !ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.va;
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      }
      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-hidden
    />
  );
}
