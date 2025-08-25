"use client";
import React, { useRef } from "react";

function cn(...c){return c.filter(Boolean).join(" ");}

// такой же стиль как у твоего Btn
const base =
  "relative inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold tracking-wide " +
  "bg-gradient-to-b from-lime-400 to-lime-500 text-black " +
  "shadow-[0_8px_20px_-6px_rgba(132,204,22,0.6)] hover:shadow-[0_12px_28px_-6px_rgba(132,204,22,0.75)]";

export default function MagneticBtn({ className, strength=22, children, ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${(mx/rect.width)*strength}px, ${(my/rect.height)*strength}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };

  return (
    <span className="inline-block will-change-transform" onMouseMove={onMove} onMouseLeave={onLeave}>
      <button {...rest} ref={ref} className={cn(base, className)}>
        {children}
      </button>
    </span>
  );
}
