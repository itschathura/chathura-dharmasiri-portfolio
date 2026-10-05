"use client";

import { useEffect, useState } from "react";
import { Rocket } from "lucide-react";

export default function RocketCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [rotation, setRotation] = useState(45);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let particleId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      setIsVisible(true);

      // Calculate direction of mouse movement
      const dx = x - lastX;
      const dy = y - lastY;
      const distance = Math.hypot(dx, dy);

      if (distance > 2) {
        // Calculate angle in degrees (pointing top-right by default)
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45;
        setRotation(angle);

        // Spawn thruster particle trail
        if (Math.random() > 0.3) {
          const newParticle = {
            id: particleId++,
            x: x - dx * 0.4,
            y: y - dy * 0.4,
            size: Math.random() * 4 + 2,
          };
          setParticles((prev) => [...prev.slice(-12), newParticle]);
        }
      }

      lastX = x;
      lastY = y;
      setPosition({ x, y });

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.classList.contains("cursor-pointer"))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Fade out particles
  useEffect(() => {
    if (particles.length === 0) return;
    const timeout = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 120);
    return () => clearTimeout(timeout);
  }, [particles]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden md:block">
      {/* Particle Flame Trail */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-accent-cyan opacity-70 animate-ping"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 8px #00f3ff, 0 0 12px #9d00ff',
          }}
        />
      ))}

      {/* Rocket Cursor Icon */}
      <div
        className="absolute transition-transform duration-75 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${isHovered ? 1.35 : 1})`,
        }}
      >
        <div className={`p-1.5 rounded-full transition-all duration-200 ${
          isHovered 
            ? "bg-accent-cyan/20 text-accent-cyan shadow-[0_0_25px_#00f3ff]" 
            : "text-accent-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.9)]"
        }`}>
          <Rocket size={isHovered ? 22 : 18} className="transform -rotate-45" />
        </div>
      </div>
    </div>
  );
}
