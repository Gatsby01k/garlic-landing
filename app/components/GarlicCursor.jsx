"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const isFinePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(pointer: fine) and (hover: hover)").matches;

const INTERACTIVE =
  'a, button, [role="button"], input, select, textarea, .cursor-link, [data-cursor]';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function GarlicCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hasTarget, setHasTarget] = useState(false);
  const [isDown, setIsDown] = useState(false);

  // mouse coords -> smooth follower
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 30, mass: 0.4 });
  const y = useSpring(my, { stiffness: 300, damping: 30, mass: 0.4 });

  // tilt by velocity
  const rotMV = useMotionValue(0);
  const rot = useSpring(rotMV, { stiffness: 200, damping: 20 });
  const last = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    if (!isFinePointer()) return;

    const id = setTimeout(() => setEnabled(true), 0);

    const onMove = (e) => {
      setVisible(true);
      mx.set(e.clientX);
      my.set(e.clientY);

      const now = performance.now();
      const dt = now - (last.current.t || now);
      const dx = e.clientX - (last.current.x || e.clientX);
      const angle = clamp((dx / (dt || 1)) * 0.6, -14, 14);
      rotMV.set(angle);
      last.current = { x: e.clientX, y: e.clientY, t: now };

      const el = e.target?.closest?.(INTERACTIVE);
      setHasTarget(Boolean(el));
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    const onDown = () => setIsDown(true);
    const onUp = () => setIsDown(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      clearTimeout(id);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [mx, my, rotMV]);

  // показываем РОВНО ОДНУ сущность:
  const showRing = hasTarget || isDown; // кольцо только над интерактивом/при клике
  const showDot = !showRing;            // иначе — белая точка

  const ringSize = useMemo(() => (showRing ? (isDown ? 30 : 60) : 0), [showRing, isDown]);
  const dotSize = showDot ? 6 : 0;

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      style={{ x, y }}
      aria-hidden
    >
      {/* GLOW — только когда видно кольцо */}
      <div
        className="absolute -z-10"
        style={{
          transform: "translate(-50%, -50%)",
          filter: "blur(24px)",
          opacity: showRing ? 0.35 : 0,
          width: ringSize * 1.5,
          height: ringSize * 1.5,
          borderRadius: 999,
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(190,242,100,0.65), rgba(52,211,153,0.35) 50%, rgba(0,0,0,0) 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* RING + GARLIC ICON */}
      <div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
        <motion.div
          animate={{
            width: ringSize,
            height: ringSize,
            borderWidth: showRing ? 1 : 0,
            backgroundColor: showRing ? "rgba(255,255,255,0.2)" : "transparent",
            opacity: visible && showRing ? 1 : 0,
            scale: isDown ? 0.95 : 1,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.45 }}
          className="rounded-full border border-white/90 backdrop-blur-[2px] mix-blend-difference shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
        />

        <motion.svg
          viewBox="0 0 64 64"
          width={showRing ? ringSize * 0.52 : 0}
          height={showRing ? ringSize * 0.52 : 0}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{ opacity: visible && showRing ? 1 : 0, rotate: rot }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <defs>
            <radialGradient id="garlicBulb" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#f5fff1" />
              <stop offset="70%" stopColor="#d7f7b5" />
              <stop offset="100%" stopColor="#b4f28a" />
            </radialGradient>
            <linearGradient id="garlicStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8fe36a" />
              <stop offset="100%" stopColor="#4d7c0f" />
            </linearGradient>
          </defs>
          <path
            d="M32 10c-2.8 5-4.6 8-6.9 10.5C16 28 12 29.5 12 41c0 10.8 9.6 18 20 18s20-7.2 20-18c0-11.5-4-13-13.1-20.5C36.6 18 34.8 15 32 10z"
            fill="url(#garlicBulb)" stroke="url(#garlicStroke)" strokeWidth="2"
          />
          <path d="M32 12c-2 9-4 15.5-4 29" stroke="#4d7c0f" strokeWidth="1.5" opacity=".35"/>
          <path d="M38 15c-1.2 8-2.6 14.8-2.6 25" stroke="#4d7c0f" strokeWidth="1.2" opacity=".28"/>
          <path d="M26 15c1.2 8 2.6 14.8 2.6 25" stroke="#4d7c0f" strokeWidth="1.2" opacity=".28"/>
          <path d="M32 6c2.2 2.7 3.2 6.5 2.6 9.7-1.6-1.6-3.8-2.7-6-3.2.5-2.6 1.6-4.8 3.4-6.5z"
            fill="#b4f28a" stroke="#4d7c0f" strokeWidth="1.4" opacity=".95"/>
        </motion.svg>
      </div>

      {/* DOT — только в «idle» режиме */}
      <div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
        <motion.div
          animate={{ width: dotSize, height: dotSize, opacity: visible && showDot ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="rounded-full bg-white mix-blend-difference"
        />
      </div>
    </motion.div>
  );
}
