"use client";
import React from "react";
import { motion } from "framer-motion";

const Clove = ({ x, size, delay, drift = 20 }) => (
  <motion.div
    initial={{ y: 60, x: 0, opacity: 0 }}
    animate={{ y: -60, x: [0, drift, -drift, 0], opacity: 0.85 }}
    transition={{
      repeat: Infinity,
      repeatType: "mirror",
      duration: 7 + Math.random() * 5,
      delay,
      ease: "easeInOut",
      times: [0, 0.33, 0.66, 1]
    }}
    className="pointer-events-none absolute"
    style={{ left: `${x}%` }}
  >
    <svg width={size} height={size} viewBox="0 0 64 64" className="opacity-80 drop-shadow-[0_2px_10px_rgba(190,242,100,0.25)]">
      <defs>
        <radialGradient id="g" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f5fff1" />
          <stop offset="70%" stopColor="#d7f7b5" />
          <stop offset="100%" stopColor="#b4f28a" />
        </radialGradient>
      </defs>
      <path d="M32 10c-3 5-5 8-7 10.5C16 28 12 30 12 41c0 11 9.5 18 20 18s20-7 20-18c0-11-4-13-13-20.5-2-2.5-4-5.5-7-10.5z" fill="url(#g)"/>
    </svg>
  </motion.div>
);

export default function FloatingCloves() {
  const items = Array.from({ length: 18 }, (_, i) => ({
    x: 4 + i * (96 / 17),                // по ширине
    size: 16 + ((i * 11) % 18),          // 16..34 px
    delay: i * 0.25,
    drift: 14 + (i % 5) * 6              // горизонтальный дрейф
  }));

  return (
    // поверх градиента, но под контентом
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[2]">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
        {items.map((p, i) => <Clove key={i} {...p} />)}
      </div>
    </div>
  );
}
