"use client";

import React, { useEffect, useRef, useState, useContext, createContext } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  Twitter, Send, Rocket, Shield, Coins, Sparkles,
  ChevronRight, ExternalLink, BadgeCheck, Lock, Link as LinkIcon, Quote, Layers, GaugeCircle
} from "lucide-react";
import FloatingCloves from "./components/FloatingCloves";

/* ======================= I18N: словарь ======================= */
const LANGS = ["en", "hi", "id"];
const FALLBACK = "en";

const DICT = {
    en: {
    nav: { approach: "Approach", policy: "Policy", tokenomics: "Tokenomics", roadmap: "Roadmap", buy: "Buy" },
    trustStrip: ["FAIR LAUNCH", "ZERO TAX", "LP LOCK", "RENOUNCED"],
    hero: {
      tags: ["smell-of-money", "mafia", "community"],
      titleTop: "GARLIC",
      titleBottom: "The Smell of Money.",
      paragraph:
        "Crypto stinks of rugs and shady switches. We brought garlic: fair launch, 0% on trades, liquidity locked and ownership renounced. Welcome to the Garlic Mafia.",
      buy: "Join the Mafia",
      policy: "Why people trust the garlic",
      badge: "meme-first • code-backed",
      marquee: [
        "0% taxes",
        "Liquidity is locked",
        "Ownership renounced",
        "Holders don’t panic, they sauté",
        "No rugs, only rugs of garlic"
      ],
      keyHint: "— tokenomics"
    },
    approach: {
      kicker: "Approach",
      title: "Kitchen humor, serious code",
      caption: "Everyone promises moon — we promise kitchen. Garlic doesn’t fly, garlic sizzles.",
      c1t: "Fair Launch, One Family",
      c1p: "No presales or private allocations. One starting bell — one market temperature.",
      c2t: "0% Tax, 100% Smell",
      c2p: "No trade tax — focus on liquidity and spread, not on switches.",
      c3t: "Mafia raids › ads",
      c3p: "We weaponize memes: daily raid targets, caption banks, copy-paste one-liners."
    },
    policy: {
      kicker: "Policy",
      title: "Why it feels rug-proof",
      caption: "We fix expectations in code. Clear settings → predictable behavior.",
      c1t: "Trade tax — 0%",
      c1p: "Trading without tax. Friction is minimal; liquidity has priority.",
      c2t: "Liquidity is locked",
      c2p: "LP locked at launch — anti-rug by design.",
      c3t: "Ownership — renounced",
      c3p: "No admin switches — code takes responsibility, not a person.",
      s1: "Contract",
      s1v: "Address is published on launch day",
      s2: "Architecture",
      s2v: "OpenZeppelin stack and standard patterns",
      s2v2: "Non-upgradeable. No surprise switches.",
      s3: "Policy",
      pills: ["Fair Launch", "No Presale", "Anti-Rug policy"]
    },
    partners: { header: "As seen on / Partners" },
    signals: {
      kicker: "Signals",
      title: "This market stinks. Garlic smells better.",
      caption: "Calm code. Loud culture.",
      q1: "“0% tax, renounced, locked — garlic-proof config.”",
      q2: "“Holders don’t panic, they sauté.”",
      q3: "“No rugs, only rugs of garlic.”"
    },
    tokenomics: {
      kicker: "Tokenomics",
      title: "Transparent and raid-ready",
      caption: "Fewer parameters — less uncertainty. Configuration prioritizes liquidity.",
      supply: "Total supply",
      taxes: "Taxes",
      taxesVal: "0 %",
      liquidity: "Liquidity",
      liquidityVal: "Locked",
      dist: "Distribution",
      distList: [
        "60% — Liquidity",
        "20% — Community / Mafia raids",
        "10% — Partnerships",
        "10% — Mafia reserve (multisig)"
      ],
      arch: "Architecture",
      archP: "Standard contracts, ownership renounced after launch, non-upgradeable.",
      pills: ["OpenZeppelin", "Non-upgradeable", "DAO reserve"]
    },
    roadmap: {
      kicker: "Roadmap",
      title: "From kitchen joke to cult classic",
      caption: "Flexible, focused on value for holders and creators.",
      phase: "Phase",
      p1: [
        "Website, socials, DEX launch",
        "LP lock, renounced",
        "Mafia raid starter pack (templates & one-liners)"
      ],
      p2: [
        "Daily missions: #SmellOfMoney, panic-button reply, raid schedule",
        "Influencer collabs & X Spaces",
        "Partner integrations (trackers/tools)"
      ],
      p3: [
        "Garlic Mafia DAO (community fund)",
        "Raid bot & public leaderboard",
        "CEX listings (if possible)"
      ]
    },
    buy: {
      kicker: "How to buy",
      title: "Three steps, then raid",
      caption: "Wallet — base coin — swap. Then culture.",
      s1: "Wallet",
      s1p: "MetaMask / Rabby / OKX. Pick a network (ETH/BSC).",
      s2: "Base & gas",
      s2p: "Fund ETH/BNB for swap and network fees.",
      s3: "Swap to $GARLIC",
      s3p: "Uniswap / PancakeSwap. Address goes live on launch day.",
      cta: "Join the Garlic Mafia",
      note: "* Not financial advice. Crypto is volatile."
    },
    community: {
      kicker: "Community",
      title: "Garlic Mafia",
      caption: "If you hold a clove — you’re in the family. Raids, missions, memes — spread the smell."
    },
    footer: {
      disclaimer: "Meme project. No profit is guaranteed.",
      hint: "Press",
      hintAfter: "— tokenomics"
    }
  },
    hi: {
    nav: { approach: "दृष्टिकोण", policy: "पॉलिसी", tokenomics: "टोकनोमिक्स", roadmap: "रोडमैप", buy: "खरीदें" },
    trustStrip: ["फेयर लॉन्च", "0% टैक्स", "LP लॉक", "रेनाउन्स"],
    hero: {
      tags: ["स्मेल-ऑफ-मनी", "माफिया", "कम्युनिटी"],
      titleTop: "GARLIC",
      titleBottom: "पैसों की खुशबू",
      paragraph:
        "क्रिप्टो में स्कैम और रग की बदबू है। हम लाए लहसुन: फेयर लॉन्च, 0% टैक्स, लॉक्ड लिक्विडिटी और रेनाउन्स्ड ओनरशिप। वेलकम टू गार्लिक माफिया।",
      buy: "माफिया में शामिल हों",
      policy: "लोग गार्लिक पर क्यों भरोसा करते हैं",
      badge: "मीम-फर्स्ट • कोड-बैक्ड",
      marquee: [
        "0% टैक्स",
        "लिक्विडिटी लॉक्ड है",
        "ओनरशिप रेनाउन्स्ड",
        "होल्डर पैनिक नहीं करते, वे सॉते करते हैं",
        "नो रग्स, सिर्फ गार्लिक वाले रग्स"
      ],
      keyHint: "— टोकनोमिक्स"
    },
    approach: {
      kicker: "दृष्टिकोण",
      title: "किचन ह्यूमर, सीरियस कोड",
      caption: "सब मून का वादा करते हैं — हम किचन का। गार्लिक उड़ता नहीं, गार्लिक चटकता है।",
      c1t: "फेयर लॉन्च, एक फैमिली",
      c1p: "कोई प्रीसेल नहीं, कोई प्राइवेट अलोकेशन नहीं। सबका एक ही स्टार्ट।",
      c2t: "0% टैक्स, 100% स्मेल",
      c2p: "कोई ट्रेड टैक्स नहीं — फोकस सिर्फ लिक्विडिटी और स्प्रेड पर।",
      c3t: "माफिया रेड्स › ऐड्स",
      c3p: "हम मीम्स को हथियार बनाते हैं: डेली रेड टारगेट्स और कॉपी-पेस्ट वन-लाइनर्स।"
    },
    community: {
      kicker: "कम्युनिटी",
      title: "गार्लिक माफिया",
      caption: "अगर आप एक लौंग होल्ड करते हैं — आप फैमिली में हैं। रेड्स, मिशन, मीम्स — स्मेल फैलाइए।"
    },
    footer: {
      disclaimer: "मीम प्रोजेक्ट। कोई प्रॉफिट गारंटी नहीं।",
      hint: "प्रेस",
      hintAfter: "— टोकनोमिक्स"
    }
  },

    id: {
    nav: { approach: "Pendekatan", policy: "Kebijakan", tokenomics: "Tokenomik", roadmap: "Peta Jalan", buy: "Beli" },
    trustStrip: ["FAIR LAUNCH", "0% PAJAK", "LP TERKUNCI", "RENONCED"],
    hero: {
      tags: ["smell-of-money", "mafia", "komunitas"],
      titleTop: "GARLIC",
      titleBottom: "Aroma Uang",
      paragraph:
        "Crypto bau scam dan rug. Kami bawa bawang putih: fair launch, 0% pajak, likuiditas terkunci, kepemilikan dilepas. Selamat datang di Garlic Mafia.",
      buy: "Gabung Mafia",
      policy: "Kenapa orang percaya garlic",
      badge: "meme-first • code-backed",
      marquee: [
        "0% pajak",
        "Likuiditas terkunci",
        "Kepemilikan dilepas",
        "Holder tidak panik, mereka menumis",
        "Tidak ada rug, hanya karpet bawang putih"
      ],
      keyHint: "— tokenomik"
    },
    approach: {
      kicker: "Pendekatan",
      title: "Humor dapur, kode serius",
      caption: "Semua janji ke bulan — kami janji ke dapur. Garlic tidak terbang, garlic mendesis.",
      c1t: "Fair Launch, Satu Keluarga",
      c1p: "Tidak ada presale, tidak ada alokasi privat. Semua mulai sama.",
      c2t: "0% Pajak, 100% Aroma",
      c2p: "Tidak ada pajak perdagangan — fokus pada likuiditas dan penyebaran.",
      c3t: "Mafia raids › iklan",
      c3p: "Kami mempersenjatai meme: target raid harian, template, dan one-liner siap pakai."
    },
    community: {
      kicker: "Komunitas",
      title: "Garlic Mafia",
      caption: "Kalau kamu pegang satu siung — kamu keluarga. Raid, misi, meme — sebarkan aroma."
    },
    footer: {
      disclaimer: "Proyek meme. Tidak ada keuntungan yang dijamin.",
      hint: "Tekan",
      hintAfter: "— tokenomik"
    }
  }
};

/* helpers for i18n */
const LangContext = createContext({ lang: FALLBACK, setLang: (_l) => {} });
function getDeep(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
}
function useT() {
  const { lang } = useContext(LangContext);
  return (path) => getDeep(DICT[lang], path) ?? getDeep(DICT[FALLBACK], path) ?? "";
}

/* ======================= UI helpers ======================= */
function cn(...classes) { return classes.filter(Boolean).join(" "); }

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

/* ======================= эффекты ======================= */
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

/* ======================= SVG логотип ======================= */
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

/* ======================= Language Switcher (custom dropdown) ======================= */
const LanguageSwitcher = () => {
  const { lang, setLang } = useContext(LangContext);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const options = [
    { value: "en", label: "EN", hint: "English" },
    { value: "hi", label: "हिंदी", hint: "Hindi" },
    { value: "id", label: "ID", hint: "Bahasa" },
  ];
  const current = options.find(o => o.value === lang) || options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-xs text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-lime-300/50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="font-semibold">{current.label}</span>
        <ChevronRight className={`h-3 w-3 transition-transform ${open ? "rotate-90" : "rotate-0"}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="listbox"
            className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#0b0f0a]/90 backdrop-blur-xl shadow-[0_10px_30px_-12px_rgba(0,0,0,.6)]"
          >
            {options.map(opt => (
              <li key={opt.value}>
                <button
                  onClick={() => { setLang(opt.value); setOpen(false); }}
                  role="option"
                  aria-selected={lang === opt.value}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm
                    ${lang === opt.value ? "bg-white/[0.07] text-white" : "text-white/80 hover:bg-white/[0.06]"}`}
                >
                  <span>{opt.label}</span>
                  <span className="text-[10px] text-white/40">{opt.hint}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ======================= Header c переключателем ======================= */
const Header = () => {
  const t = useT();
  return (
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
            <a href="#about" className="hover:text-white">{t("nav.approach")}</a>
            <a href="#policy" className="hover:text-white">{t("nav.policy")}</a>
            <a href="#token" className="hover:text-white">{t("nav.tokenomics")}</a>
            <a href="#roadmap" className="hover:text-white">{t("nav.roadmap")}</a>
            <a href="#buy" className="hover:text-white">{t("nav.buy")}</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#buy" className="hidden md:block">
              <Btn>{t("nav.buy")} $GARLIC <ChevronRight className="h-4 w-4"/></Btn>
            </a>
            <LanguageSwitcher />
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

/* ======================= HERO ======================= */
const Hero = () => {
  const t = useT();
  const { ref, x, y } = useMouseParallax(24);
  const sx = useSpring(x, { stiffness: 120, damping: 16 });
  const sy = useSpring(y, { stiffness: 120, damping: 16 });

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-32 md:pt-40">
      {/* policy strip */}
      <div className="absolute left-0 right-0 top-20 z-20">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] text-white/70 backdrop-blur">
            {["0","1","2","3"].map((i, idx) => (
              <React.Fragment key={i}>
                {idx !== 0 && <span className="opacity-30">•</span>}
                <span className={idx===0 ? "text-white/90" : ""}>{t(`trustStrip.${i}`)}</span>
              </React.Fragment>
            ))}
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
              {t("hero.tags.0") && <Pill>{t("hero.tags.0")}</Pill>}
              {t("hero.tags.1") && <Pill>{t("hero.tags.1")}</Pill>}
              {t("hero.tags.2") && <Pill>{t("hero.tags.2")}</Pill>}
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95]">
              <span className="bg-gradient-to-r from-white via-lime-200 to-lime-400 bg-clip-text text-transparent">{t("hero.titleTop")}</span>
              <span className="block text-white/80">{t("hero.titleBottom")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-white/70">{t("hero.paragraph")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#buy"><Btn>{t("hero.buy")} <ExternalLink className="h-4 w-4"/></Btn></a>
              <a href="#policy" className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 hover:bg-white/5">{t("hero.policy")}</a>
              <div className="hidden md:flex items-center gap-2 text-xs text-white/50"><Kbd>G</Kbd><span>{t("hero.keyHint")}</span></div>
            </div>
          </motion.div>

          <motion.div className="relative -mr-6 md:mr-0"
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/0 blur-2xl" />
            <div className="relative aspect-square rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl">
              <GarlicSVG className="h-full w-full" tiltX={sx} tiltY={sy} />
              <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-white/5" />
              <div className="pointer-events-none absolute -left-6 top-6"><Pill>{t("hero.badge")}</Pill></div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 md:mt-14">
          <Marquee items={[
            t("hero.marquee.0"), t("hero.marquee.1"), t("hero.marquee.2"), t("hero.marquee.3"), t("hero.marquee.4")
          ]} />
        </div>
      </Container>
    </section>
  );
};

/* ======================= Approach ======================= */
const About = () => {
  const t = useT();
  return (
    <section id="about" className="relative py-20 md:py-28">
      <Container>
        <SectionTitle
          kicker={t("approach.kicker")}
          title={t("approach.title")}
          caption={t("approach.caption")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300/20 text-lime-200"><Rocket className="h-5 w-5"/></div>
            <h3 className="text-lg font-semibold">{t("approach.c1t")}</h3>
            <p className="mt-2 text-sm text-white/70">{t("approach.c1p")}</p>
          </Card>
          <Card>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300/20 text-lime-200"><Coins className="h-5 w-5"/></div>
            <h3 className="text-lg font-semibold">{t("approach.c2t")}</h3>
            <p className="mt-2 text-sm text-white/70">{t("approach.c2p")}</p>
          </Card>
          <Card>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300/20 text-lime-200"><Sparkles className="h-5 w-5"/></div>
            <h3 className="text-lg font-semibold">{t("approach.c3t")}</h3>
            <p className="mt-2 text-sm text-white/70">{t("approach.c3p")}</p>
          </Card>
        </div>
      </Container>
    </section>
  );
};

/* ======================= Policy ======================= */
const Policy = () => {
  const t = useT();
  return (
    <section id="policy" className="relative py-20 md:py-28">
      <Container>
        <SectionTitle
          kicker={t("policy.kicker")}
          title={t("policy.title")}
          caption={t("policy.caption")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200"><GaugeCircle className="h-5 w-5"/></div>
            <h3 className="text-lg font-semibold">{t("policy.c1t")}</h3>
            <p className="mt-2 text-sm text-white/70">{t("policy.c1p")}</p>
          </Card>
          <Card>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200"><Lock className="h-5 w-5"/></div>
            <h3 className="text-lg font-semibold">{t("policy.c2t")}</h3>
            <p className="mt-2 text-sm text-white/70">{t("policy.c2p")}</p>
          </Card>
          <Card>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200"><Shield className="h-5 w-5"/></div>
            <h3 className="text-lg font-semibold">{t("policy.c3t")}</h3>
            <p className="mt-2 text-sm text-white/70">{t("policy.c3p")}</p>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card>
            <h4 className="text-sm text-white/60">{t("policy.s1")}</h4>
            <div className="mt-2 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-white/80">
                <LinkIcon className="h-4 w-4"/> <span className="text-white/60">{t("policy.s1v")}</span>
              </span>
            </div>
          </Card>
          <Card>
            <h4 className="text-sm text-white/60">{t("policy.s2")}</h4>
            <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
              <Layers className="h-4 w-4 opacity-70"/> {t("policy.s2v")}
            </div>
            <p className="mt-2 text-sm text-white/60">{t("policy.s2v2")}</p>
          </Card>
          <Card>
            <h4 className="text-sm text-white/60">{t("policy.s3")}</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              <Pill>{t("policy.pills.0")}</Pill><Pill>{t("policy.pills.1")}</Pill><Pill>{t("policy.pills.2")}</Pill>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
};

/* ======================= Partners (svg badges) ======================= */
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

        <rect x="1" y="1" width="178" height="50" rx="14" fill="rgba(255,255,255,0.06)"/>
        <rect x="2" y="2" width="176" height="24" rx="13" fill={`url(#${gidSoft})`} opacity=".8"/>

        {/* углы */}
        <g filter={`url(#${glowId})`}>
          <motion.path variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }} transition={{ duration: 0.5, ease: "easeOut" }} d="M6 6 H22 M6 6 V22" {...cornerStroke} />
          <motion.path variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.03 }} d="M174 6 H158 M174 6 V22" {...cornerStroke} />
          <motion.path variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }} d="M6 46 H22 M6 46 V30" {...cornerStroke} />
          <motion.path variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.09 }} d="M174 46 H158 M174 46 V30" {...cornerStroke} />
        </g>

        {/* блик */}
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
  const t = useT();
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
          {t("partners.header")}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 place-items-center">
          {partners.map((p) => <PartnerBadge key={p.keyName} {...p} />)}
        </div>
      </Container>
    </section>
  );
};

/* ======================= Testimonials ======================= */
const Testimonials = () => {
  const t = useT();
  const quotes = [t("signals.q1"), t("signals.q2"), t("signals.q3")].filter(Boolean);
  return (
    <section className="relative py-20 md:py-28">
      <Container>
        <SectionTitle kicker={t("signals.kicker")} title={t("signals.title")} caption={t("signals.caption")} />
        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((text, i) => (
            <Card key={i}>
              <div className="flex items-start gap-3">
                <Quote className="h-5 w-5 text-lime-300/80 mt-1"/>
                <div>
                  <p className="text-sm text-white/80">{text}</p>
                  <div className="mt-3 text-xs text-white/50">— @garlic_{i+1}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

/* ======================= Tokenomics ======================= */
const Tokenomics = () => {
  const t = useT();
  return (
    <section id="token" className="relative py-20 md:py-28">
      <Container>
        <SectionTitle kicker={t("tokenomics.kicker")} title={t("tokenomics.title")} caption={t("tokenomics.caption")}/>
        <div className="grid gap-6 md:grid-cols-12">
          <Card className="md:col-span-4">
            <div className="text-sm text-white/60">{t("tokenomics.supply")}</div>
            <div className="mt-2 text-3xl font-extrabold"><Counter to={1_000_000_000}/> $GARLIC</div>
            <p className="mt-3 text-sm text-white/60">Fixed, no additional mint.</p>
          </Card>
          <Card className="md:col-span-4">
            <div className="text-sm text-white/60">{t("tokenomics.taxes")}</div>
            <div className="mt-2 text-3xl font-extrabold">{t("tokenomics.taxesVal")}</div>
            <p className="mt-3 text-sm text-white/60">No trade tax.</p>
          </Card>
          <Card className="md:col-span-4">
            <div className="text-sm text-white/60">{t("tokenomics.liquidity")}</div>
            <div className="mt-2 text-3xl font-extrabold">{t("tokenomics.liquidityVal")}</div>
            <p className="mt-3 text-sm text-white/60">Pool fixed during launch period.</p>
          </Card>
          <Card className="md:col-span-6">
            <h3 className="text-lg font-semibold">{t("tokenomics.dist")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>• {t("tokenomics.distList.0")}</li>
              <li>• {t("tokenomics.distList.1")}</li>
              <li>• {t("tokenomics.distList.2")}</li>
              <li>• {t("tokenomics.distList.3")}</li>
            </ul>
          </Card>
          <Card className="md:col-span-6">
            <h3 className="text-lg font-semibold">{t("tokenomics.arch")}</h3>
            <p className="mt-3 text-sm text-white/70">{t("tokenomics.archP")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill>{t("tokenomics.pills.0")}</Pill><Pill>{t("tokenomics.pills.1")}</Pill><Pill>{t("tokenomics.pills.2")}</Pill>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
};

/* ======================= Roadmap ======================= */
const Roadmap = () => {
  const t = useT();
  return (
    <section id="roadmap" className="relative py-20 md:py-28">
      <Container>
        <SectionTitle kicker={t("roadmap.kicker")} title={t("roadmap.title")} caption={t("roadmap.caption")}/>
        <div className="grid gap-6 md:grid-cols-3">
          {[1,2,3].map((ph) => (
            <Card key={ph}>
              <div className="mb-3 text-xs uppercase tracking-[0.2em] text-lime-300/80">Clove 0{ph}</div>
              <h3 className="text-lg font-semibold">{t("roadmap.phase")} {ph}</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                {t(`roadmap.p${ph}.0`) && <li>• {t(`roadmap.p${ph}.0`)}</li>}
                {t(`roadmap.p${ph}.1`) && <li>• {t(`roadmap.p${ph}.1`)}</li>}
                {t(`roadmap.p${ph}.2`) && <li>• {t(`roadmap.p${ph}.2`)}</li>}
              </ul>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

/* ======================= How to buy ======================= */
const HowToBuy = () => {
  const t = useT();
  return (
    <section id="buy" className="relative py-20 md:py-28">
      <Container>
        <SectionTitle kicker={t("buy.kicker")} title={t("buy.title")} caption={t("buy.caption")}/>
        <div className="grid gap-6 md:grid-cols-3">
          <Card><div className="text-sm text-white/60">1</div><h3 className="mt-1 text-lg font-semibold">{t("buy.s1")}</h3><p className="mt-2 text-sm text-white/70">{t("buy.s1p")}</p></Card>
          <Card><div className="text-sm text-white/60">2</div><h3 className="mt-1 text-lg font-semibold">{t("buy.s2")}</h3><p className="mt-2 text-sm text-white/70">{t("buy.s2p")}</p></Card>
          <Card><div className="text-sm text-white/60">3</div><h3 className="mt-1 text-lg font-semibold">{t("buy.s3")}</h3><p className="mt-2 text-sm text-white/70">{t("buy.s3p")}</p></Card>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Btn onClick={() => document.getElementById("community")?.scrollIntoView({behavior:"smooth"})}>{t("buy.cta")} <Send className="h-4 w-4"/></Btn>
          <span className="text-xs text-white/50">{t("buy.note")}</span>
        </div>
      </Container>
    </section>
  );
};

/* ======================= Community ======================= */
const Community = () => {
  const t = useT();
  return (
    <section id="community" className="relative py-20 md:py-28">
      <Container>
        <SectionTitle kicker={t("community.kicker")} title={t("community.title")} caption={t("community.caption")}/>
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
};

/* ======================= Footer ======================= */
const Footer = () => {
  const t = useT();
  return (
    <footer className="relative py-10 text-xs text-white/60">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2"><span className="text-lg">🧄</span><span>© {new Date().getFullYear()} Garlic. All smells reserved.</span></div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <span className="text-white/40">{t("footer.disclaimer")}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

/* ======================= Page ======================= */
export default function GarlicAwwwardsSite() {
  const [lang, setLangState] = useState(FALLBACK);

  // init from localStorage or browser
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (saved && LANGS.includes(saved)) setLangState(saved);
    else {
      const b = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "";
      if (b.startsWith("hi")) setLangState("hi");
      else if (b.startsWith("id")) setLangState("id");
      else setLangState("en");
    }
  }, []);

  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  useEffect(() => {
    const onKey = (e) => { if ((e.key || "").toLowerCase() === "g") { document.getElementById("token")?.scrollIntoView({ behavior: "smooth" }); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <main className="relative min-h-screen bg-[#0b0f0a] text-white selection:bg-lime-300/30 selection:text-white">
        {/* фоновые слои */}
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

        <LangHint />
      </main>
    </LangContext.Provider>
  );
}

const LangHint = () => {
  const t = useT();
  return (
    <div className="fixed bottom-4 right-4 hidden rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] text-white/70 md:flex items-center gap-2">
      {t("footer.hint")} <Kbd>G</Kbd> {t("footer.hintAfter")}
    </div>
  );
};
