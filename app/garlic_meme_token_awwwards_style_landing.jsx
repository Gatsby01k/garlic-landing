"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  Twitter, Send, Rocket, Shield, Coins, Sparkles,
  ChevronRight, ExternalLink, BadgeCheck, Lock, Link as LinkIcon, Quote, Layers, GaugeCircle
} from "lucide-react";
import FloatingCloves from "./components/FloatingCloves";

function cn(...classes) { return classes.filter(Boolean).join(" "); }

/* ----------------------- БАЗОВЫЕ ----------------------- */
const Container = ({ className, children }) => (
  <div className={cn("mx-auto w-full max-w-[1200px] px-4 md:px-8", className)}>{children}</div>
);

const SectionTitle = ({ kicker, title, caption, className }) => (
  <div className={cn("mb-10 text-center", className)}>
    {kicker && (<div className="mb-2 text-xs tracking-[0.2em] uppercase text-lime-300/80">{kicker}</div>)}
    <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-lime-300 via-white to-lime-400 bg-clip-text text-transparent">
      {title}
    </h2>
    {caption && (<p className="mt-4 text-sm md:text-base text-white/70 max-w-2xl mx-auto">{caption}</p>)}
  </div>
);

const Noise = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06] mix-blend-soft-light"
    style={{
      backgroundImage:
        'url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"140\\" height=\\"140\\"><filter id=\\"n\\"><feTurbulence baseFrequency=\\"0.7\\" numOctaves=\\"3\\"/></filter><rect width=\\"100%\\" height=\\"100%\\" filter=\\"url(%23n)\\" opacity=\\"0.8\\"/></svg>")'
    }}
  />
);

const Glow = ({ className }) => (<div className={cn("absolute -z-10 blur-3xl", className)} />);

const Card = ({ className, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.24 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={cn(
      "group relative rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl",
      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_10px_30px_-10px_rgba(0,0,0,0.45)]",
      "transition-transform duration-300 will-change-transform hover:-translate-y-1",
      className
    )}
  >
    <div className="pointer-events-none absolute inset-0 rounded-3xl [background:linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))] opacity-70" />
    {children}
  </motion.div>
);

const Kbd = ({ children }) => (
  <kbd className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] uppercase tracking-wider text-white/70">{children}</kbd>
);

const Btn = ({ className, children, ...rest }) => (
  <motion.button
    whileHover={{ scale: 1.02, rotate: -1 }}
    whileTap={{ scale: 0.98 }}
    {...rest}
    className={cn(
      "relative inline-flex items-center gap-2 rounded-full px-5 py-3",
      "font-semibold tracking-wide",
      "bg-gradient-to-b from-lime-400 to-lime-500 text-black",
      "shadow-[0_8px_20px_-6px_rgba(132,204,22,0.6)] hover:shadow-[0_12px_28px_-6px_rgba(132,204,22,0.75)]",
      className
    )}
  >
    {children}
  </motion.button>
);

/* ----------------------- ПАРАЛЛАКС ----------------------- */
function useMouseParallax(strength = 20) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      x.set((mx / r.width) * strength);
      y.set((my / r.height) * strength);
    };
    const onLeave = () => { x.set(0); y.set(0); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [x, y, strength]);
  return { ref, x, y };
}

/* ----------------------- ЛОГО SVG ----------------------- */
const GarlicSVG = ({ className, tiltX, tiltY }) => (
  <motion.svg viewBox="0 0 300 300" className={cn("drop-shadow-2xl", className)}
    style={{ x: tiltX, y: tiltY }} initial={{ rotate: -6, scale: 0.9 }}
    animate={{ rotate: [-6, 6, -6], scale: [0.9, 1, 0.9] }} transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}>
    <defs>
      <radialGradient id="gBulb" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#f5fff1"/><stop offset="70%" stopColor="#d7f7b5"/><stop offset="100%" stopColor="#b4f28a"/></radialGradient>
      <linearGradient id="gStroke" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8fe36a" /><stop offset="100%" stopColor="#4d7c0f" /></linearGradient>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/></filter>
    </defs>
    <path d="M150 60c-10 18-16 29-24 38-28 33-50 38-50 82 0 42 37 68 74 68s74-26 74-68c0-44-22-49-50-82-8-9-14-20-24-38z" fill="url(#gBulb)" stroke="url(#gStroke)" strokeWidth="3" />
    <path d="M150 64c-6 36-12 62-12 116" stroke="#4d7c0f" strokeWidth="2" opacity=".4"/>
    <path d="M170 74c-4 32-8 60-8 102" stroke="#4d7c0f" strokeWidth="2" opacity=".3"/>
    <path d="M130 74c4 32 8 60 8 102" stroke="#4d7c0f" strokeWidth="2" opacity=".3"/>
    <path d="M150 40c8 10 12 24 10 36-6-6-14-10-22-12 2-10 6-18 12-24z" fill="#b4f28a" stroke="#4d7c0f" strokeWidth="2" filter="url(#soft)"/>
    <ellipse cx="120" cy="150" rx="12" ry="28" fill="#fff" opacity=".25"/>
    <ellipse cx="185" cy="180" rx="8" ry="18" fill="#fff" opacity=".18"/>
  </motion.svg>
);

const Pill = ({ children }) => (<span className="rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1 text-xs text-lime-200">{children}</span>);

/* ----------------------- МАРКИЗА ----------------------- */
const Marquee = ({ items }) => (
  <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
    <div className="animate-[marquee_18s_linear_infinite] whitespace-nowrap">
      {items.concat(items).map((it, i) => (
        <span key={i} className="mx-6 inline-flex items-center gap-2 text-sm text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-lime-400 inline-block" /> {it}
        </span>
      ))}
    </div>
    <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
  </div>
);

/* ----------------------- СЧЁТЧИК ----------------------- */
const Counter = ({ to, suffix }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const loop = (t) => {
      const p = Math.min(1, (t - start) / 1200);
      setVal(Math.round(to * (0.5 - Math.cos(Math.PI * p) / 2)));
      if (p < 1) requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [to]);
  return <>{val.toLocaleString()} {suffix}</>;
};

/* ----------------------- ХЕДЕР ----------------------- */
const Header = () => (
  <div className="fixed inset-x-0 top-0 z-40">
    <Container>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl"
      >
        <a href="#top" className="flex items-center gap-2">
          <span className="text-2xl">🧄</span>
          <span className="font-semibold tracking-wide">GARLIC</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="#about" className="hover:text-white">Подход</a>
          <a href="#policy" className="hover:text-white">Политика</a>
          <a href="#token" className="hover:text-white">Токеномика</a>
          <a href="#roadmap" className="hover:text-white">Дорожная карта</a>
          <a href="#buy" className="hover:text-white">Купить</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#buy" className="hidden md:block">
            <Btn>Купить $GARLIC <ChevronRight className="h-4 w-4"/></Btn>
          </a>
        </div>
      </motion.div>
    </Container>
  </div>
);

/* ----------------------- HERO (профи-тон + интерес) ----------------------- */
const Hero = () => {
  const { ref, x, y } = useMouseParallax(24);
  const sx = useSpring(x, { stiffness: 120, damping: 16 });
  const sy = useSpring(y, { stiffness: 120, damping: 16 });

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-32 md:pt-40">
      {/* сигнал правил сверху */}
      <div className="absolute left-0 right-0 top-20 z-20">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] text-white/70 backdrop-blur">
            <span className="text-white/90">FAIR LAUNCH</span>
            <span className="opacity-30">•</span>
            <span>ZERO TAX</span>
            <span className="opacity-30">•</span>
            <span>LP LOCK</span>
            <span className="opacity-30">•</span>
            <span>RENOUNCED</span>
          </div>
        </Container>
      </div>

      <Glow className="left-[10%] top-[0%] h-[35rem] w-[35rem] bg-lime-400/30" />
      <Glow className="right-[-10%] top-[30%] h-[40rem] w-[40rem] bg-emerald-500/20" />
      <Glow className="left-1/3 top-[70%] h-[28rem] w-[28rem] bg-lime-300/20" />

      <Container>
        <div className="grid items-center gap-8 md:grid-cols-2">
          <motion.div className="relative z-10"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="mb-4 flex items-center gap-2 text-xs text-white/70">
              <Pill>discipline</Pill><Pill>liquidity-first</Pill><Pill>community</Pill>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95]">
              <span className="bg-gradient-to-r from-white via-lime-200 to-lime-400 bg-clip-text text-transparent">GARLIC</span>
              <span className="block text-white/80">Мем с дисциплиной протокола.</span>
            </h1>
            <p className="mt-6 max-w-xl text-white/70">
              Правила зафиксированы кодом: честный запуск, 0% на сделки, заблокированная ликвидность и renounced.
              Мы убрали шум, чтобы внимание было на идее и ликвидности — остальное сделает рынок.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#buy"><Btn>Войти в позицию <ExternalLink className="h-4 w-4"/></Btn></a>
              <a href="#policy" className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 hover:bg-white/5">Политика протокола</a>
              <div className="hidden md:flex items-center gap-2 text-xs text-white/50"><Kbd>G</Kbd><span>— токеномика</span></div>
            </div>
          </motion.div>

          <motion.div className="relative -mr-6 md:mr-0"
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/0 blur-2xl" />
            <div className="relative aspect-square rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl">
              <GarlicSVG className="h-full w-full" tiltX={sx} tiltY={sy} />
              <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-white/5" />
              <div className="pointer-events-none absolute -left-6 top-6"><Pill>rule-based • meme-driven</Pill></div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 md:mt-14">
          <Marquee items={[
            "Один старт для всех",
            "Налоги 0%",
            "Ликвидность блокируется",
            "Владелец отказывается от прав",
            "Культура комьюнити решает",
          ]} />
        </div>
      </Container>
    </section>
  );
};

/* ----------------------- ПОДХОД ----------------------- */
const About = () => (
  <section id="about" className="relative py-20 md:py-28">
    <Container>
      <SectionTitle
        kicker="Подход"
        title="Профессиональная структура, мем-подача"
        caption="Мы делаем мем читабельным для капитала: простые правила, низкое трение входа и культурный символ."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300/20 text-lime-200"><Rocket className="h-5 w-5"/></div>
          <h3 className="text-lg font-semibold">Fair-launch без перегибов</h3>
          <p className="mt-2 text-sm text-white/70">Никаких приватных аллокаций. Один горизонт входа — одна температура рынка.</p>
        </Card>
        <Card>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300/20 text-lime-200"><Coins className="h-5 w-5"/></div>
          <h3 className="text-lg font-semibold">Zero-tax, zero-friction</h3>
          <p className="mt-2 text-sm text-white/70">Сделки без налога — фокус на ликвидности и спрэде, а не на настройках.</p>
        </Card>
        <Card>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300/20 text-lime-200"><Sparkles className="h-5 w-5"/></div>
          <h3 className="text-lg font-semibold">Культура&nbsp;›&nbsp;маркетинг</h3>
          <p className="mt-2 text-sm text-white/70">Сильный символ 🧄, ирония и порядок — контент рождается из комьюнити.</p>
        </Card>
      </div>
    </Container>
  </section>
);

/* ----------------------- ПОЛИТИКА ПРОТОКОЛА (без «проверь сам») ----------------------- */
const Policy = () => (
  <section id="policy" className="relative py-20 md:py-28">
    <Container>
      <SectionTitle
        kicker="Политика"
        title="Что зафиксировано правилами"
        caption="Мы формализуем ожидания заранее. Понятные настройки → предсказуемое поведение токена."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200"><GaugeCircle className="h-5 w-5"/></div>
          <h3 className="text-lg font-semibold">Налог на сделки — 0%</h3>
          <p className="mt-2 text-sm text-white/70">
            Торговля без налога. Трение минимально, ликвидность имеет приоритет.
          </p>
        </Card>
        <Card>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200"><Lock className="h-5 w-5"/></div>
          <h3 className="text-lg font-semibold">Ликвидность блокируется</h3>
          <p className="mt-2 text-sm text-white/70">
            Пул фиксируется на период релиза — дизайн против спешных манипуляций.
          </p>
        </Card>
        <Card>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200"><Shield className="h-5 w-5"/></div>
          <h3 className="text-lg font-semibold">Ownership — renounced</h3>
          <p className="mt-2 text-sm text-white/70">
            Управляющих тумблеров нет — код берёт ответственность, а не человек.
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card>
          <h4 className="text-sm text-white/60">Контракт</h4>
          <div className="mt-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-white/80">
              <LinkIcon className="h-4 w-4"/> <span className="text-white/60">Адрес публикуется в день релиза</span>
            </span>
          </div>
        </Card>
        <Card>
          <h4 className="text-sm text-white/60">Архитектура</h4>
          <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
            <Layers className="h-4 w-4 opacity-70"/> OpenZeppelin-стек и стандартные паттерны
          </div>
          <p className="mt-2 text-sm text-white/60">Без экспериментальных апгрейдов и сюрпризов.</p>
        </Card>
        <Card>
          <h4 className="text-sm text-white/60">Политика</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill>Fair Launch</Pill><Pill>No Presale</Pill><Pill>Anti-Rug policy</Pill>
          </div>
        </Card>
      </div>
    </Container>
  </section>
);

/* ----------------------- ПАРТНЁРЫ (уголки awwwards) ----------------------- */
const PartnerBadge = ({ keyName, label, href, from = "#a3e635", to = "#84cc16" }) => {
  const gid = `grad-${keyName}`;
  const gidSoft = `grad-soft-${keyName}`;
  const gidShine = `grad-shine-${keyName}`;
  const clipId = `clip-${keyName}`;
  const glowId = `glow-${keyName}`;

  const Icon = () => {
    switch (keyName) {
      case "uniswap":
        return (
          <g>
            <path d="M8 10 v10 c0 8 6 14 14 14s14-6 14-14V10" fill="none" stroke={`url(#${gid})`} strokeWidth="2.6" strokeLinecap="round"/>
            <path d="M8 10 Q 22 2 36 10" fill="none" stroke={`url(#${gid})`} strokeWidth="2" strokeLinecap="round" opacity=".35"/>
          </g>
        );
      case "pancake":
        return (
          <g>
            <rect x="8" y="8" width="24" height="9" rx="4.5" fill={`url(#${gid})`} opacity=".9"/>
            <rect x="6" y="17" width="28" height="10" rx="5" fill={`url(#${gid})`} opacity=".6"/>
          </g>
        );
      case "dexscreener":
        return (
          <g>
            <polyline points="6,26 14,18 20,22 30,12" fill="none" stroke={`url(#${gid})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="14" cy="18" r="1.8" fill="#fff" opacity=".9"/><circle cx="20" cy="22" r="1.8" fill="#fff" opacity=".9"/>
          </g>
        );
      case "coingecko":
        return (
          <g>
            <circle cx="20" cy="20" r="14" fill={`url(#${gid})`} opacity=".65"/>
            <circle cx="16" cy="18" r="3.2" fill="#0b0f0a" opacity=".9"/>
            <path d="M20 26 q6 1 8 5" stroke="#0b0f0a" strokeWidth="2" opacity=".45" fill="none" strokeLinecap="round"/>
          </g>
        );
      case "cmc":
        return (
          <g>
            <circle cx="20" cy="20" r="12" fill="none" stroke={`url(#${gid})`} strokeWidth="2.4"/>
            <circle cx="20" cy="20" r="6"  fill="none" stroke={`url(#${gid})`} strokeWidth="2.4" opacity=".6"/>
          </g>
        );
      case "opensea":
        return (
          <g>
            <polygon points="22,8 28,20 16,20" fill={`url(#${gid})`} opacity=".9"/>
            <path d="M12 26 q8 -10 16 0" fill="none" stroke={`url(#${gid})`} strokeWidth="2.4"/>
            <path d="M10 26 h20"        fill="none" stroke={`url(#${gid})`} strokeWidth="2.2" opacity=".55"/>
          </g>
        );
      default:
        return null;
    }
  };

  const cornerStroke = { stroke: `url(#${gid})`, strokeWidth: 1.8, strokeLinecap: "round", fill: "none" };

  return (
    <a href={href} target="_blank" rel="noreferrer" className="group">
      <motion.svg
        width="180" height="52" viewBox="0 0 180 52"
        initial="rest" whileHover="hover"
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        className="drop-shadow-[0_10px_28px_rgba(132,204,22,0.16)]"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} /><stop offset="100%" stopColor={to} />
          </linearGradient>
          <linearGradient id={gidSoft} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22"/><stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id={gidShine} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0"/><stop offset="50%" stopColor="#fff" stopOpacity="0.6"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
          <clipPath id={clipId}><rect x="1.5" y="1.5" width="177" height="49" rx="13.5"/></clipPath>
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* стекло без сплошной рамки */}
        <rect x="1" y="1" width="178" height="50" rx="14" fill="rgba(255,255,255,0.06)"/>
        <rect x="2" y="2" width="176" height="24" rx="13" fill={`url(#${gidSoft})`} opacity=".8"/>

        {/* уголки */}
        <g filter={`url(#${glowId})`}>
          <motion.path variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }} transition={{ duration: 0.5, ease: "easeOut" }} d="M6 6 H22 M6 6 V22" {...cornerStroke} />
          <motion.path variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.03 }} d="M174 6 H158 M174 6 V22" {...cornerStroke} />
          <motion.path variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }} d="M6 46 H22 M6 46 V30" {...cornerStroke} />
          <motion.path variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.09 }} d="M174 46 H158 M174 46 V30" {...cornerStroke} />
        </g>

        {/* бегущий блик */}
        <g clipPath={`url(#${clipId})`}>
          <motion.rect
            variants={{ rest: { x: -70, opacity: 0 }, hover: { x: 220, opacity: 0.85 } }}
            y="0" width="70" height="52" rx="14"
            fill={`url(#${gidShine})`}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ mixBlendMode: "screen" }}
          />
        </g>

        {/* Лого + текст */}
        <g transform="translate(10,6)"><Icon /></g>
        <text x="60" y="31" fontFamily="var(--font-sans), ui-sans-serif" fontSize="12" letterSpacing="0.08em" fill="#fff" opacity="0.92">
          {label}
        </text>
      </motion.svg>
    </a>
  );
};

const Partners = () => {
  const partners = [
    { keyName: "uniswap",     label: "Uniswap",       href: "https://app.uniswap.org",     from: "#ff8bd5", to: "#ff3ac3" },
    { keyName: "pancake",     label: "PancakeSwap",   href: "https://pancakeswap.finance", from: "#f7c473", to: "#d98324" },
    { keyName: "dexscreener", label: "DEX Screener",  href: "https://dexscreener.com",     from: "#34d399", to: "#10b981" },
    { keyName: "coingecko",   label: "CoinGecko",     href: "https://www.coingecko.com",   from: "#a3e635", to: "#84cc16" },
    { keyName: "cmc",         label: "CoinMarketCap", href: "https://coinmarketcap.com",   from: "#60a5fa", to: "#3b82f6" },
    { keyName: "opensea",     label: "OpenSea",       href: "https://opensea.io",          from: "#93c5fd", to: "#60a5fa" },
  ];

  return (
    <section className="relative py-16">
      <Container>
        <div className="mb-8 text-center text-xs tracking-[0.2em] uppercase text-white/50">
          As seen on / Partners
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 place-items-center">
          {partners.map((p) => <PartnerBadge key={p.keyName} {...p} />)}
        </div>
      </Container>
    </section>
  );
};

/* ----------------------- СОЦИАЛЬНОЕ ДОКА-ВО ----------------------- */
const Testimonials = () => (
  <section className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="Сигналы" title="Тон спокойный, намерения серьёзные" caption="Нам нравятся цифры и ирония. Обе вещи уживаются, если правила просты."/>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {u:"@alpha_scavenger",t:"“Структура как у протокола, а не у шутки. Слежу за ликвидностью.”"},
          {u:"@memelord",t:"“Чесночный вайб объяснён на языке капитала — редко так делают.”"},
          {u:"@defi_builder",t:"“Zero-tax и renounced — конфигурация без дерготни. Дальше — работа рынка.”"}
        ].map((o, i) => (
          <Card key={i}>
            <div className="flex items-start gap-3">
              <Quote className="h-5 w-5 text-lime-300/80 mt-1"/>
              <div>
                <p className="text-sm text-white/80">{o.t}</p>
                <div className="mt-3 text-xs text-white/50">— {o.u}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

/* ----------------------- ТОКЕНОМИКА ----------------------- */
const Tokenomics = () => (
  <section id="token" className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="Токеномика" title="Прозрачно и предсказуемо" caption="Меньше параметров — меньше неопределённости. Конфигурация ориентирована на ликвидность."/>
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-4">
          <div className="text-sm text-white/60">Общий supply</div>
          <div className="mt-2 text-3xl font-extrabold"><Counter to={1_000_000_000}/> $GARLIC</div>
          <p className="mt-3 text-sm text-white/60">Фиксированный, без дополнительной эмиссии.</p>
        </Card>
        <Card className="md:col-span-4">
          <div className="text-sm text-white/60">Налоги</div>
          <div className="mt-2 text-3xl font-extrabold"><Counter to={0}/> %</div>
          <p className="mt-3 text-sm text-white/60">Сделки без налога. Точка.</p>
        </Card>
        <Card className="md:col-span-4">
          <div className="text-sm text-white/60">Ликвидность</div>
          <div className="mt-2 text-3xl font-extrabold">Блокируется</div>
          <p className="mt-3 text-sm text-white/60">Пул фиксируется на период релиза.</p>
        </Card>
        <Card className="md:col-span-6">
          <h3 className="text-lg font-semibold">Распределение</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>• 60% — Ликвидность</li>
            <li>• 20% — Комьюнити/airdrop/квесты</li>
            <li>• 10% — Партнёрства</li>
            <li>• 10% — Резерв DAO (мультисиг)</li>
          </ul>
        </Card>
        <Card className="md:col-span-6">
          <h3 className="text-lg font-semibold">Архитектура</h3>
          <p className="mt-3 text-sm text-white/70">Стандартные контракты, отказ от управляющих полномочий после релиза, без апгрейдов.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>OpenZeppelin</Pill><Pill>Non-upgradeable</Pill><Pill>DAO-резерв</Pill>
          </div>
        </Card>
      </div>
    </Container>
  </section>
);

/* ----------------------- ДОРОЖНАЯ КАРТА ----------------------- */
const Roadmap = () => (
  <section id="roadmap" className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="Дорожная карта" title="От чистого запуска к культуре" caption="Гибкая, ориентированная на ценность для holder’ов и создателей."/>
      <div className="grid gap-6 md:grid-cols-3">
        {[1,2,3].map((ph) => (
          <Card key={ph}>
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-lime-300/80">Clove 0{ph}</div>
            <h3 className="text-lg font-semibold">Фаза {ph}</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {ph===1 && (<>
                <li>• Сайт, соцсети, запуск на DEX</li>
                <li>• Блокировка LP, renounced</li>
                <li>• Мем-наратив и визуальный язык</li>
              </>)}
              {ph===2 && (<>
                <li>• NFT «Cloves» для активных</li>
                <li>• Коллаборации с художниками</li>
                <li>• Комьюнити-активации и раффлы</li>
              </>)}
              {ph===3 && (<>
                <li>• Garlic DAO (гранты авторам)</li>
                <li>• Мини-игры/интеграции</li>
                <li>• Список централизованных бирж (по возможности)</li>
              </>)}
            </ul>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

/* ----------------------- КАК КУПИТЬ ----------------------- */
const HowToBuy = () => (
  <section id="buy" className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="Как купить" title="Три шага без суеты" caption="Кошелёк — базовая монета — обмен. Дальше культура."/>
      <div className="grid gap-6 md:grid-cols-3">
        <Card><div className="text-sm text-white/60">Шаг 1</div><h3 className="mt-1 text-lg font-semibold">Кошелёк</h3><p className="mt-2 text-sm text-white/70">MetaMask / Rabby / OKX. Выберите сеть (ETH/BSC).</p></Card>
        <Card><div className="text-sm text-white/60">Шаг 2</div><h3 className="mt-1 text-lg font-semibold">База и газ</h3><p className="mt-2 text-sm text-white/70">Пополните ETH/BNB для обмена и комиссий.</p></Card>
        <Card><div className="text-sm text-white/60">Шаг 3</div><h3 className="mt-1 text-lg font-semibold">Swap на $GARLIC</h3><p className="mt-2 text-sm text-white/70">Uniswap/PancakeSwap. Адрес контракта публикуется в день релиза.</p></Card>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Btn onClick={() => document.getElementById("community")?.scrollIntoView({behavior:"smooth"})}>Вступить в комьюнити <Send className="h-4 w-4"/></Btn>
        <span className="text-xs text-white/50">* Не финансовый совет. Крипторынок волатилен.</span>
      </div>
    </Container>
  </section>
);

/* ----------------------- КОМЬЮНИТИ ----------------------- */
const Community = () => (
  <section id="community" className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="Комьюнити" title="Разумный мем: улыбка и дисциплина" caption="Анонсы, обсуждения, раффлы, билды — присоединяйся и приноси свою дольку вкуса."/>
      <div className="flex flex-wrap items-center gap-4">
        <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="group"><Btn className="bg-white text-black hover:opacity-90"><Twitter className="h-4 w-4"/> X (Twitter)</Btn></a>
        <a href="https://t.me/" target="_blank" rel="noreferrer" className="group"><Btn><Send className="h-4 w-4"/> Telegram</Btn></a>
        <a href="/litepaper.pdf" target="_blank" rel="noreferrer" className="group">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 hover:bg-white/5">
            <Shield className="h-4 w-4"/> Litepaper
          </span>
        </a>
      </div>
    </Container>
  </section>
);

/* ----------------------- ФУТЕР ----------------------- */
const Footer = () => (
  <footer className="relative py-10 text-xs text-white/60">
    <Container>
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2"><span className="text-lg">🧄</span><span>© {new Date().getFullYear()} Garlic. All smells reserved.</span></div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <span className="text-white/40">Мем-проект. Доходность не гарантируется.</span>
        </div>
      </div>
    </Container>
  </footer>
);

/* ----------------------- СТРАНИЦА ----------------------- */
export default function GarlicAwwwardsSite() {
  useEffect(() => {
    const onKey = (e) => { if ((e.key || "").toLowerCase() === "g") { document.getElementById("token")?.scrollIntoView({ behavior: "smooth" }); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0b0f0a] text-white selection:bg-lime-300/30 selection:text-white">
      {/* фон */}
      <Noise />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 [background:radial-gradient(circle_at_50%_-20%,rgba(190,242,100,0.15),transparent_55%),radial-gradient(circle_at_90%_10%,rgba(52,211,153,0.12),transparent_40%)]" />
      <FloatingCloves /> {/* под контентом */}

      {/* контент */}
      <Header />
      <Hero />
      <About />
      <Policy />
      <Partners />
      <Testimonials />
      <Tokenomics />
      <Roadmap />
      <HowToBuy />
      <Community />
      <Footer />

      <div className="fixed bottom-4 right-4 hidden rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] text-white/70 md:block">
        Нажми <Kbd>G</Kbd> — токеномика
      </div>
    </main>
  );
}
