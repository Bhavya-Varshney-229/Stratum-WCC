import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

export const MouseTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Clean up any historical disable flag so the trail is always active
    try {
      localStorage.removeItem('stratum_mouse_trail');
    } catch {}

    // Disable only on coarse touch-only devices without a fine cursor
    if (window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const points = pointsRef.current;
      const last = points[points.length - 1];

      // Smooth point capture: require at least 2.5px movement to avoid clumping
      if (!last || Math.hypot(e.clientX - last.x, e.clientY - last.y) >= 2.5) {
        points.push({
          x: e.clientX,
          y: e.clientY,
          time: now,
        });
      }

      // Keep maximum 26 points for an agile, fluid ribbon that never lags
      if (points.length > 26) {
        pointsRef.current = points.slice(-26);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Lifetime of the trail tail in milliseconds (smooth & quick fade, not lingering)
    const TRAIL_LIFETIME = 260;

    let isRunning = true;
    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      const now = performance.now();
      const points = pointsRef.current;

      // Drop expired trail points
      while (points.length > 0 && now - points[0].time > TRAIL_LIFETIME) {
        points.shift();
      }

      if (points.length >= 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw smooth, non-poofy filament trail using quadratic Bézier curves
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];

          // Normalized age factor: 0 at the tail, 1 at the leading cursor tip
          const progress = (i + 1) / points.length;

          // Refined alpha: subtle and sleek, no blurry poofs or huge glow
          const alpha = Math.max(0.03, Math.min(0.7, progress * 0.75));

          // Diminishing stroke width: tapers gracefully from ~2.4px to ~0.5px
          const strokeWidth = Math.max(0.5, progress * 2.4);

          ctx.beginPath();
          ctx.lineWidth = strokeWidth;
          ctx.strokeStyle = `rgba(255, 97, 36, ${alpha})`;

          if (i === 0) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
          } else {
            const p0 = points[i - 1];
            const midX1 = (p0.x + p1.x) / 2;
            const midY1 = (p0.y + p1.y) / 2;
            const midX2 = (p1.x + p2.x) / 2;
            const midY2 = (p1.y + p2.y) / 2;
            ctx.moveTo(midX1, midY1);
            ctx.quadraticCurveTo(p1.x, p1.y, midX2, midY2);
          }
          ctx.stroke();
        }

        // Tiny crisp leading micro-dot at the cursor
        const tip = points[points.length - 1];
        if (tip && now - tip.time < 80) {
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 97, 36, 0.85)';
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 select-none"
      style={{ pointerEvents: 'none' }}
    />
  );
};
