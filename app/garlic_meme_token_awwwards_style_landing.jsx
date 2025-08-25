"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Twitter, Send, Rocket, Shield, Coins, Sparkles, ChevronRight, ExternalLink, BadgeCheck, CheckCircle, Lock, Link as LinkIcon, Quote } from "lucide-react";

// Опциональный импорт shadcn Button, если есть в проекте
let ShadcnBtn = null;
try { ShadcnBtn = require("@/components/ui/button").Button; } catch (e) {}

function cn(...classes) { return classes.filter(Boolean).join(" "); }

// ====== Общие маленькие компоненты ======
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
  <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06] mix-blend-soft-light"
       style={{ backgroundImage:"url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"140\" height=\"140\"><filter id=\"n\"><feTurbulence baseFrequency=\"0.7\" numOctaves=\"3\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\" opacity=\"0.8\"/></svg>')" }} />
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

const Btn = ({ className, children, ...rest }) => {
  if (ShadcnBtn) return React.createElement(ShadcnBtn, { className, ...rest }, children);
  return (
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
};

// ====== Хук параллакса ======
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

// ====== SVG-логотип ======
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

// ====== Маркиза ======
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

// ====== Счётчик ======
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

// ====== Хедер ======
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
          <a href="#about" className="hover:text-white">О проекте</a>
          <a href="#token" className="hover:text-white">Токеномика</a>
          <a href="#roadmap" className="hover:text-white">Дорожная карта</a>
          <a href="#buy" className="hover:text-white">Как купить</a>
          <a href="#community" className="hover:text-white">Комьюнити</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#buy" className="hidden md:block">
            <Btn>Купить <ChevronRight className="h-4 w-4"/></Btn>
          </a>
        </div>
      </motion.div>
    </Container>
  </div>
);

// ====== HERO ======
const Hero = () => {
  const { ref, x, y } = useMouseParallax(24);
  const sx = useSpring(x, { stiffness: 120, damping: 16 });
  const sy = useSpring(y, { stiffness: 120, damping: 16 });

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-32 md:pt-40">
      <Glow className="left-[10%] top-[0%] h-[35rem] w-[35rem] bg-lime-400/30" />
      <Glow className="right-[-10%] top-[30%] h-[40rem] w-[40rem] bg-emerald-500/20" />
      <Glow className="left-1/3 top-[70%] h-[28rem] w-[28rem] bg-lime-300/20" />

      <Container>
        <div className="grid items-center gap-8 md:grid-cols-2">
          <motion.div className="relative z-10"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="mb-4 flex items-center gap-2 text-xs text-white/70">
              <Pill>#memecoin</Pill><Pill>#awwwards</Pill><Pill>#garlic</Pill>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95]">
              <span className="bg-gradient-to-r from-white via-lime-200 to-lime-400 bg-clip-text text-transparent">GARLIC</span>
              <span className="block text-white/80">Мем‑токен с <span className="text-lime-300">острым</span> характером</span>
            </h1>
            <p className="mt-6 max-w-xl text-white/70">Без утилиты? Возможно. Без вкуса — никогда. Присоединяйся к культа­вой армии 🧄 и приправь крипту юмором.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#buy"><Btn>Купить GARLIC <ExternalLink className="h-4 w-4"/></Btn></a>
              <a href="#community" className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 hover:bg-white/5">Сообщество</a>
              <div className="hidden md:flex items-center gap-2 text-xs text-white/50"><Kbd>G</Kbd><span>— авто‑скролл к токеномике</span></div>
            </div>
          </motion.div>

          <motion.div className="relative -mr-6 md:mr-0"
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/0 blur-2xl" />
            <div className="relative aspect-square rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl">
              <GarlicSVG className="h-full w-full" tiltX={sx} tiltY={sy} />
              <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-white/5" />
              <div className="pointer-events-none absolute -left-6 top-6"><Pill>🧄 + 🌶️ = 🚀</Pill></div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 md:mt-14">
          <Marquee items={["No utility. Just spice.","Community first.","Liquidity: locked.","Zero taxes.","100% memes.","Global aroma."]} />
        </div>
      </Container>
    </section>
  );
};

// ====== ABOUT ======
const About = () => (
  <section id="about" className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="О проекте" title="Крипта, но вкуснее" caption="GARLIC — мем‑токен и сообщество людей, которые любят острое. Мы строим весёлую, добрую и дерзкую культуру вокруг чеснока — в мемах, NFT и партнёрствах."/>
      <div className="grid gap-6 md:grid-cols-3">
        <Card><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300/20 text-lime-200"><Rocket className="h-5 w-5"/></div><h3 className="text-lg font-semibold">Вирусный бренд</h3><p className="mt-2 text-sm text-white/70">Мемы, челленджи, стикеры. Комьюнити растит аромат быстрее любого маркетинга.</p></Card>
        <Card><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300/20 text-lime-200"><Coins className="h-5 w-5"/></div><h3 className="text-lg font-semibold">Честная экономика</h3><p className="mt-2 text-sm text-white/70">Публичный контракт, заблокированная ликвидность, нулевые налоги на сделки.</p></Card>
        <Card><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300/20 text-lime-200"><Sparkles className="h-5 w-5"/></div><h3 className="text-lg font-semibold">События и NFT</h3><p className="mt-2 text-sm text-white/70">Дропа­ем коллекции «Cloves», поддерживаем художников, проводим spicy‑ивенты.</p></Card>
      </div>
    </Container>
  </section>
);

// ====== TRUST (новый блок доверия) ======
const Trust = () => (
  <section id="trust" className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="Trust & Transparency" title="Почему нам доверяют"
        caption="Показываем факты, не обещания: ликвидность, верификация контракта и публичные ссылки." />
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200"><Lock className="h-5 w-5"/></div>
          <h3 className="text-lg font-semibold">Liquidity Locked</h3>
          <p className="mt-2 text-sm text-white/70">
            Ликвидность заблокирована на DEX. Смотри транзакцию на{" "}
            <a className="text-lime-300 underline" href="https://etherscan.io/" target="_blank" rel="noreferrer">Etherscan</a>.
          </p>
        </Card>
        <Card>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200"><BadgeCheck className="h-5 w-5"/></div>
          <h3 className="text-lg font-semibold">Verified Contract</h3>
          <p className="mt-2 text-sm text-white/70">
            Контракт верифицирован. Используем стандарты OpenZeppelin.
          </p>
        </Card>
        <Card>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200"><Shield className="h-5 w-5"/></div>
          <h3 className="text-lg font-semibold">Audit (TBA)</h3>
          <p className="mt-2 text-sm text-white/70">
            Аудит запланирован. Отчёт будет опубликован и привязан к tx‑хэшу.
          </p>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card>
          <h4 className="text-sm text-white/60">Контракт</h4>
          <div className="mt-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-white/80">
              <LinkIcon className="h-4 w-4"/> <span className="text-white/60">0x… (появится в день запуска)</span>
            </span>
          </div>
        </Card>
        <Card>
          <h4 className="text-sm text-white/60">Налоги</h4>
          <div className="mt-2 text-2xl font-extrabold">0%</div>
          <p className="mt-1 text-sm text-white/60">Без «скрытых» комиссий.</p>
        </Card>
        <Card>
          <h4 className="text-sm text-white/60">Комьюнити</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill>DAO Multisig</Pill><Pill>Public Roadmap</Pill><Pill>Open Discord</Pill>
          </div>
        </Card>
      </div>
    </Container>
  </section>
);

// ====== PARTNERS (as seen on) ======
const Partners = () => (
  <section className="relative py-16">
    <Container>
      <div className="mb-8 text-center text-xs tracking-[0.2em] uppercase text-white/50">As seen on / Partners</div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 place-items-center opacity-80">
        {/* Положи логотипы в /public/partners/*.svg и замени пути ниже */}
        <img src="/partners/coingecko.svg" className="h-6 md:h-7" alt="CoinGecko"/>
        <img src="/partners/cmc.svg" className="h-6 md:h-7" alt="CMC"/>
        <img src="/partners/uniswap.svg" className="h-6 md:h-7" alt="Uniswap"/>
        <img src="/partners/pancake.svg" className="h-6 md:h-7" alt="PancakeSwap"/>
        <img src="/partners/dexscreener.svg" className="h-6 md:h-7" alt="DEX Screener"/>
        <img src="/partners/opensea.svg" className="h-6 md:h-7" alt="OpenSea"/>
      </div>
    </Container>
  </section>
);

// ====== TESTIMONIALS ======
const Testimonials = () => (
  <section className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="Отзывы" title="Что говорит комьюнити" caption="Немного любви и мемов от наших холдеров."/>
      <div className="grid gap-6 md:grid-cols-3">
        {[1,2,3].map((i) => (
          <Card key={i}>
            <div className="flex items-start gap-3">
              <Quote className="h-5 w-5 text-lime-300/80 mt-1"/>
              <div>
                <p className="text-sm text-white/80">“Чесночный вайб спас мой крипто‑портфель — хотя нет, просто поднял настроение 😄.”</p>
                <div className="mt-3 text-xs text-white/50">— @spicy_builder</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

// ====== FAQ (на details/summary — без библиотек) ======
const FAQ = () => (
  <section className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="FAQ" title="Частые вопросы" />
      <div className="grid gap-3 md:grid-cols-2">
        {[
          {q:"Есть ли налоги на покупку/продажу?",a:"Нет. Налоги 0%. Комиссия — только газ сети."},
          {q:"Где взять токен?",a:"На DEX (Uniswap/Pancake). Контрактный адрес опубликуем в день запуска."},
          {q:"Ликвидность заблокирована?",a:"Да, лока — публикуем ссылку на tx для проверки."},
          {q:"Это инвестсовет?",a:"Нет. Мем‑проект, делайте своё исследование (DYOR)."}
        ].map(({q,a},i)=>(
          <details key={i} className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <summary className="cursor-pointer list-none select-none text-sm font-medium text-white/90 flex items-center justify-between">
              {q} <span className="ml-4 text-white/40 group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-sm text-white/70">{a}</p>
          </details>
        ))}
      </div>
    </Container>
  </section>
);

// ====== TOKENOMICS / ROADMAP / BUY / COMMUNITY / FOOTER (без изменений по сути) ======
const Tokenomics = () => (
  <section id="token" className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="Токеномика" title="Просто. Прозрачно. Осторожно остро." caption="Детали могут измениться до релиза. DYOR, это не инвестиционный совет."/>
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-4"><div className="text-sm text-white/60">Общий supply</div><div className="mt-2 text-3xl font-extrabold"><Counter to={1_000_000_000}/> $GARLIC</div><p className="mt-3 text-sm text-white/60">Фиксирован, без эмиссии.</p></Card>
        <Card className="md:col-span-4"><div className="text-sm text-white/60">Налоги на сделки</div><div className="mt-2 text-3xl font-extrabold"><Counter to={0}/> %</div><p className="mt-3 text-sm text-white/60">Покупка и продажа без налогов.</p></Card>
        <Card className="md:col-span-4"><div className="text-sm text-white/60">Ликвидность</div><div className="mt-2 text-3xl font-extrabold">Locked</div><p className="mt-3 text-sm text-white/60">Зафиксирована на DEX для защиты холдеров.</p></Card>
        <Card className="md:col-span-6"><h3 className="text-lg font-semibold">Распределение</h3><ul className="mt-3 space-y-2 text-sm text-white/70"><li>• 60% — Ликвидность</li><li>• 20% — Комьюнити/airdrop/квесты</li><li>• 10% — Маркетинг и партнёрства</li><li>• 10% — Резерв DAO (мультисиг)</li></ul></Card>
        <Card className="md:col-span-6"><h3 className="text-lg font-semibold">Контракт</h3><p className="mt-3 text-sm text-white/70">Сеть: Ethereum или BSC. Адрес будет опубликован в день запуска.</p><div className="mt-4 flex flex-wrap gap-2"><Pill>OpenZeppelin</Pill><Pill>Verified</Pill><Pill><BadgeCheck className="mr-1 inline h-3 w-3"/>Audited (TBA)</Pill></div></Card>
      </div>
    </Container>
  </section>
);

const Roadmap = () => (
  <section id="roadmap" className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="Дорожная карта" title="Зубчик за зубчиком" caption="Гибкая и мем‑ориентированная. Цели уточняются голосованием DAO."/>
      <div className="grid gap-6 md:grid-cols-3">
        {[1,2,3].map((ph) => (
          <Card key={ph}>
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-lime-300/80">Clove 0{ph}</div>
            <h3 className="text-lg font-semibold">Фаза {ph}</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {ph===1 && (<><li>• Запуск сайта и социальных сетей</li><li>• Листинг на DEX, ликвидность</li><li>• Airdrop для ранних мем‑создателей</li></>)}
              {ph===2 && (<><li>• NFT‑коллекция «Cloves»</li><li>• Партнёрства с кулинарными брендами</li><li>• Мерч и оффлайн spicy‑митапы</li></>)}
              {ph===3 && (<><li>• Garlic DAO (гранты авторам мемов)</li><li>• Игровые интеграции / мини‑игры</li><li>• Листинги CEX (по возможности)</li></>)}
            </ul>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

const HowToBuy = () => (
  <section id="buy" className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="Как купить" title="3 шага — и аромат с вами" />
      <div className="grid gap-6 md:grid-cols-3">
        <Card><div className="text-sm text-white/60">Шаг 1</div><h3 className="mt-1 text-lg font-semibold">Установите кошелёк</h3><p className="mt-2 text-sm text-white/70">MetaMask, Rabby, OKX Wallet. Выберите сеть (ETH/BSC).</p></Card>
        <Card><div className="text-sm text-white/60">Шаг 2</div><h3 className="mt-1 text-lg font-semibold">Купите ETH/BNB</h3><p className="mt-2 text-sm text-white/70">Пополните кошелёк через биржу или on‑ramp. Нужен газ.</p></Card>
        <Card><div className="text-sm text-white/60">Шаг 3</div><h3 className="mt-1 text-lg font-semibold">Обменяйте на $GARLIC</h3><p className="mt-2 text-sm text-white/70">Uniswap/PancakeSwap. Проверьте адрес контракта на сайте.</p></Card>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Btn onClick={() => document.getElementById("community")?.scrollIntoView({behavior:"smooth"})}>Перейти в комьюнити <Send className="h-4 w-4"/></Btn>
        <span className="text-xs text-white/50">* Крипта — риск. DYOR. Не инвестсовет.</span>
      </div>
    </Container>
  </section>
);

const Community = () => (
  <section id="community" className="relative py-20 md:py-28">
    <Container>
      <SectionTitle kicker="Сообщество" title="Вступай в Garlic‑культ" caption="Сила — в мемах, людях и чесночном духе."/>
      <div className="flex flex-wrap items-center gap-4">
        <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="group"><Btn className="bg-white text-black hover:opacity-90"><Twitter className="h-4 w-4"/> X (Twitter)</Btn></a>
        <a href="https://t.me/" target="_blank" rel="noreferrer" className="group"><Btn><Send className="h-4 w-4"/> Telegram</Btn></a>
        <a href="/litepaper.pdf" target="_blank" rel="noreferrer" className="group"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 hover:bg-white/5"><Shield className="h-4 w-4"/> Litepaper</span></a>
      </div>
    </Container>
  </section>
);

const Footer = () => (
  <footer className="relative py-10 text-xs text-white/60">
    <Container>
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2"><span className="text-lg">🧄</span><span>© {new Date().getFullYear()} Garlic. All smells reserved.</span></div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <span className="text-white/40">This is a meme project. Not financial advice.</span>
        </div>
      </div>
    </Container>
  </footer>
);

// ====== Страница ======
export default function GarlicAwwwardsSite() {
  useEffect(() => {
    const onKey = (e) => { if ((e.key || "").toLowerCase() === "g") { document.getElementById("token")?.scrollIntoView({ behavior: "smooth" }); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0b0f0a] text-white selection:bg-lime-300/30 selection:text-white">
      <Noise />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 [background:radial-gradient(circle_at_50%_-20%,rgba(190,242,100,0.15),transparent_55%),radial-gradient(circle_at_90%_10%,rgba(52,211,153,0.12),transparent_40%)]" />

      <Header />
      <Hero />
      <About />

      {/* Доверие и социальные доказательства */}
      <Trust />
      <Partners />
      <Testimonials />

      <Tokenomics />
      <Roadmap />
      <HowToBuy />
      <FAQ />
      <Community />
      <Footer />

      <div className="fixed bottom-4 right-4 hidden rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] text-white/70 md:block">
        Нажми <Kbd>G</Kbd> — токеномика
      </div>
    </main>
  );
}
