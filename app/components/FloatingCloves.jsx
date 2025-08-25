"use client";
import React from "react";
import { motion } from "framer-motion";

const Clove = ({ x, size, delay }) => (
  <motion.div
    initial={{ y: 40, opacity: 0 }}
    animate={{ y: -40, opacity: 0.8 }}
    transition={{ repeat: Infinity, repeatType: "mirror", duration: 6 + Math.random()*4, delay }}
    className="pointer-events-none absolute"
    style={{ left: `${x}%` }}
  >
    <svg width={size} height={size} viewBox="0 0 64 64" className="opacity-60">
      <defs>
        <radialGradient id="g" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f5fff1" />
          <stop offset="70%" stopColor="#d7f7b5" />
          <stop offset="100%" stopColor="#b4f28a" />
        </radialGradient>
      </defs>
      <path d="M32 10c-3 5-5 8-7 10.5C16 28 12 30 12 41c0 11 9.5 18 20 18s20-7 20-18c0-11-4-13-13-20.5-2-2.5-4-5.5-7-10.5z" fill="url(#g)" opacity=".6"/>
    </svg>
  </motion.div>
);

export default function FloatingCloves() {
  const items = Array.from({ length: 10 }, (_, i) => ({
    x: 5 + i*9 + (i%2?3:-2),
    size: 14 + ((i*7)%10),
    delay: i * 0.35
  }));

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
        {items.map((p, i) => <Clove key={i} {...p} />)}
      </div>
    </div>
  );
}
