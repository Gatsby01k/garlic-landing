"use client";
import { motion, useScroll } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed left-0 top-0 z-[10000] h-[3px] w-full origin-left bg-gradient-to-r from-lime-300 via-white to-lime-400"
    />
  );
}
