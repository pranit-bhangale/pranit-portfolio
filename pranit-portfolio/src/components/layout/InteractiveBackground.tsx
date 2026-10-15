import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  color: string;
}

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking with smooth lerp
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
      radius: 130, // repulsion & disperse radius
      linkRadius: 110, // cursor link connection radius
    };

    // Responsive particle count
    const getParticleCount = () => {
      const area = width * height;
      if (width < 640) return Math.min(30, Math.floor(area / 20000));
      if (width < 1024) return Math.min(55, Math.floor(area / 18000));
      return Math.min(85, Math.floor(area / 16000));
    };

    const colors = [
      'rgba(99, 102, 241, ', // Primary Indigo
      'rgba(139, 92, 246, ', // Violet
      'rgba(168, 85, 247, ', // Purple
    ];

    let particles: Particle[] = [];

    const initParticles = () => {
      const count = getParticleCount();
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 0.35),
          vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 0.35),
          radius: Math.random() * 0.8 + 1.0,
          baseAlpha: Math.random() * 0.2 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    initParticles();

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    // Mouse & Touch listeners
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Animation Loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.66, 2.0); // normalize dt for 60fps
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // 1. Smooth Purple Ambient Spotlight Glow (subtle, soft warmth)
      if (mouse.active) {
        const spotlightRadius = width < 768 ? 200 : 320;
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          spotlightRadius
        );
        // Multi-stop falloff: ambient purple glow without washing out deep dark theme
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.045)');
        gradient.addColorStop(0.35, 'rgba(139, 92, 246, 0.022)');
        gradient.addColorStop(0.7, 'rgba(168, 85, 247, 0.007)');
        gradient.addColorStop(1, 'rgba(9, 9, 11, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Update and Draw Particles
      const particleLen = particles.length;
      for (let i = 0; i < particleLen; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Normal particle drift
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          // Wrap around edges gracefully
          if (p.x < -10) p.x = width + 10;
          else if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          else if (p.y > height + 10) p.y = -10;

          // Mouse interaction (react, disperse, and link to the cursor)
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Disperse / push away organically
            if (dist < mouse.radius && dist > 0) {
              const force = (1 - dist / mouse.radius) * 1.5;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }

            // Link to the cursor with faint purple line
            if (dist < mouse.linkRadius && dist > 0) {
              const mouseLineAlpha = (1 - dist / mouse.linkRadius) * 0.16;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(139, 92, 246, ${mouseLineAlpha})`;
              ctx.lineWidth = 0.55;
              ctx.stroke();
            }
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.baseAlpha})`;
        ctx.fill();

        // 3. Connect nearby particles with faint constellation lines
        const maxDist = width < 768 ? 80 : 105;
        for (let j = i + 1; j < particleLen; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.09;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
            ctx.lineWidth = 0.45;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Pause when tab is inactive to preserve battery and CPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Interactive HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
      />
    </div>
  );
};

export default React.memo(InteractiveBackground);
