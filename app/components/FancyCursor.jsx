"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const isFinePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(pointer: fine)").matches;

const SELECTORS_INTERACTIVE =
  'a, button, [role="button"], input, select, textarea, .cursor-link, [data-cursor]';

export default function FancyCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeEl, setActiveEl] = useState(null);
  const [isDown, setIsDown] = useState(false);
  const [label, setLabel] = useState("");

  // raw mouse coords
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // smooth follower
  const x = useSpring(mx, { stiffness: 300, damping: 30, mass: 0.4 });
  const y = useSpring(my, { stiffness: 300, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (!isFinePointer()) return; // не включаем на тач-устройствах
    setEnabled(true);

    const onMove = (e) => {
      setVisible(true);
      mx.set(e.clientX);
      my.set(e.clientY);

      const el = e.target?.closest?.(SELECTORS_INTERACTIVE);
      setActiveEl(el || null);
      if (el) {
        const custom = el.getAttribute("data-cursor-label");
        if (custom) setLabel(custom);
        else if (el.tagName === "A") setLabel("OPEN");
        else if (el.tagName === "BUTTON" || el.getAttribute("role") === "button") setLabel("CLICK");
        else setLabel("");
      } else {
        setLabel("");
      }
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
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [mx, my]);

  const ringSize = useMemo(() => {
    if (!activeEl) return 36;      // базовый размер
    if (isDown) return 28;         // клик – чуть меньше
    return 56;                     // над интерактивом – крупнее
  }, [activeEl, isDown]);

  const dotSize = activeEl ? 0 : 6; // над интерактивом прячем точку

  if (!enabled) return null;

  return (
    <>
      {/* Обёртка для позиционирования (x,y), внутри – центрируем элементы -50%/-50% */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{ x, y }}
        aria-hidden
      >
        {/* RING */}
        <div
          className="relative"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <motion.div
            animate={{
              width: ringSize,
              height: ringSize,
              borderWidth: activeEl ? 0 : 1,
              backgroundColor: activeEl ? "rgba(255,255,255,0.2)" : "transparent",
              opacity: visible ? 1 : 0,
              scale: isDown ? 0.95 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.4 }}
            className={[
              "rounded-full",
              "border",
              "border-white/90",
              "backdrop-blur-[2px]",
              "mix-blend-difference", // контраст на любом фоне
              "shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
            ].join(" ")}
          />

          {/* LABEL в центре кольца */}
          <motion.div
            initial={false}
            animate={{
              opacity: activeEl && label ? 1 : 0,
              scale: activeEl && label ? 1 : 0.9,
            }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[10px] font-semibold uppercase tracking-widest mix-blend-difference"
            style={{ color: "#fff" }}
          >
            {label}
          </motion.div>
        </div>

        {/* DOT */}
        <div
          className="relative"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <motion.div
            animate={{
              width: dotSize,
              height: dotSize,
              opacity: visible ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="rounded-full bg-white mix-blend-difference"
          />
        </div>
      </motion.div>
    </>
  );
}
