"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ClickRipple() {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const onDown = (e) => {
      // не спамим при тач-скролле
      if (e.button !== 0) return;
      const r = { id: Math.random(), x: e.clientX, y: e.clientY };
      setRipples((s) => [...s.slice(-4), r]); // максимум 5
      // авто-удаление
      setTimeout(() => setRipples((s) => s.filter((i) => i.id !== r.id)), 700);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998]">
      {ripples.map(({ id, x, y }) => (
        <motion.span
          key={id}
          initial={{ opacity: 0.3, scale: 0 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute rounded-full border border-white/60 mix-blend-difference"
          style={{
            left: x, top: y, width: 48, height: 48,
            transform: "translate(-50%, -50%)"
          }}
        />
      ))}
    </div>
  );
}
