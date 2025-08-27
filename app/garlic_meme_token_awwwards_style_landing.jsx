"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback, useContext, createContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation, useMotionValue, useSpring } from "framer-motion";
import {
  Check,
  Flame,
  Stars,
  ShieldCheck,
  Sparkles,
  Sun,
  Zap,
  Coins,
  LucideIcon,
  CoinsIcon,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Globe,
} from "lucide-react";

/* =========================================================================
   UI ATOMS
   ========================================================================= */

const cx = (...a) => a.filter(Boolean).join(" ");
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const lerp = (a, b, t) => a + (b - a) * t;

const isClient = typeof window !== "undefined";

function Container({ className = "", ...props }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-4", className)} {...props} />;
}

function Kbd({ children }) {
  return (
    <span className="rounded-md border border-white/20 bg-white/5 px-1.5 py-0.5 text-[10px] tracking-wider">
      {children}
    </span>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs tracking-wide">
      {children}
    </span>
  );
}

function SectionKicker({ children }) {
  return <div className="text-xs tracking-widest text-white/50 uppercase">{children}</div>;
}

function H2({ children }) {
  return <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">{children}</h2>;
}

function Card({ children, className }) {
  return (
    <div className={cx("rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6", className)}>
      {children}
    </div>
  );
}

/* =========================================================================
   CUSTOM CURSOR + CLICK RIPPLE (unchanged design)
   ========================================================================= */

const CursorContext = createContext({ x: 0, y: 0, clicked: false });
function CursorProvider({ children }) {
  const [state, setState] = useState({ x: 0, y: 0, clicked: false });

  useEffect(() => {
    const move = (e) => setState((s) => ({ ...s, x: e.clientX, y: e.clientY }));
    const down = () => setState((s) => ({ ...s, clicked: true }));
    const up = () => setState((s) => ({ ...s, clicked: false }));
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return <CursorContext.Provider value={state}>{children}</CursorContext.Provider>;
}

function GarlicCursor() {
  const { x, y, clicked } = useContext(CursorContext);
  const size = clicked ? 12 : 8;
  return (
    <div
      style={{ left: x, top: y, width: size, height: size, transform: "translate(-50%, -50%)" }}
      className="pointer-events-none fixed z-[100] rounded-full bg-white/70 mix-blend-difference"
    />
  );
}

function ClickRipple() {
  const [ripples, setRipples] = useState([]);
  useEffect(() => {
    const handler = (e) => {
      setRipples((r) => [...r, { id: Math.random(), x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples((r) => r.slice(1)), 500);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
          style={{
            left: r.x,
            top: r.y,
            width: 160,
            height: 160,
            animation: "ripple 0.5s ease-out forwards",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          0% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(0.5);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================================
   I18N (structure preserved). We only changed DICT.en texts below.
   ========================================================================= */

const LANGS = ["en", "hi", "id"];
const FALLBACK = "en";

const DICT = {
  en: {
    nav: { approach: "Approach", policy: "Policy", tokenomics: "Tokenomics", roadmap: "Roadmap", buy: "Buy" },
    trustStrip: ["FAIR LAUNCH", "ZERO TAX", "LP LOCK", "RENOUNCED"],
    hero: {
      tags: ["discipline", "liquidity-first", "community"],
      titleTop: "GARLIC",
      titleBottom: "a meme with protocol discipline.",
      paragraph:
        "Legend: garlic vs market vampires — FUD, scams and panic. Rules in code: fair launch, 0% tax, LP locked, renounced ownership. Humor for culture, rules for safety.",
      ctaBuy: "Buy $GARLIC",
      ctaDocs: "Legend & rules",
      note: "No promises of profit. Only memes and rules.",
    },
    approach: {
      kicker: "Legend",
      title: "Garlic vs market vampires",
      c1t: "Meme first, rules upfront",
      c1p:
        "There are ‘vampires’ on every market night: FUD, scam pumpers, sneaky liquidity hunters. $GARLIC smells like victory — the stronger the smell, the farther the vampires.",
      c2t: "Discipline > Mystery",
      c2p:
        "Memes are fun; rules are protection. We keep protocol discipline: no hidden switches, zero trade tax, locked LP, renounced ownership.",
      c3t: "Culture compounds",
      c3p:
        "A friendly garlic-mascot 🧄, bright sticker visuals, and an anti-vampire narrative you’ll want to forward.",
    },
    policy: {
      kicker: "Policy",
      title: "Hard rules, soft humor",
      caption:
        "We formalize expectations upfront. Clear settings → predictable token behavior.",
      c1t: "Trade tax — 0%",
      c1p: "No contract taxes. Your PnL is pure market.",
      c2t: "LP — locked",
      c2p: "Liquidity is locked. No nightly draining by ‘vampires’.",
      c3t: "Ownership — renounced",
      c3p: "No one can flip the rules mid-flight.",
      c4t: "Fair launch",
      c4p: "No backroom allocations. One start for everyone.",
      badge: "No profit promises. Meme + discipline only.",
    },
    tokenomics: {
      kicker: "Tokenomics",
      title: "Transparent & predictable",
      caption:
        "Fewer parameters — less uncertainty. Configuration stated upfront.",
      supply: "Total supply",
      supplyVal: "1,000,000,000 $GARLIC",
      items: [
        { t: "Trade tax", v: "0%" },
        { t: "Liquidity", v: "LP lock" },
        { t: "Ownership", v: "Renounced" },
        { t: "Launch", v: "Fair launch" },
      ],
      foot: "No private sales. No ‘magic buttons’. Just meme and market.",
    },
    signals: {
      kicker: "Signals",
      title: "What keeps a meme alive",
      cards: [
        {
          t: "Mascot: garlic head",
          p: "Friendly, shareable 🧄. Pack emotions into a character, not promises.",
        },
        {
          t: "Meme language",
          p: "Market vampires, sun candles, smell of victory. Content that begs to be forwarded.",
        },
        {
          t: "Visual system",
          p: "Bright palette, sticker accents, playful labels. Instantly recognizable in feed.",
        },
        {
          t: "Protocol discipline",
          p: "Fewer parameters, less uncertainty. Clear config above all.",
        },
      ],
    },
    roadmap: {
      kicker: "Roadmap",
      title: "From smell to legend",
      p1: ["Website & socials", "DEX launch", "LP lock, renounced", "Anti-vampire narrative"],
      p2: ["NFT “Cloves” for active members", "Artist collabs", "Community memetics"],
      p3: ["Tracker integrations", "Quests", "IRL merch"],
      note: "Everything without profit promises. We build culture and keep rules.",
    },
    how: {
      kicker: "How to buy",
      title: "A couple of clicks — and in",
      steps: [
        { t: "1) Connect wallet", p: "MetaMask or compatible. Check network and fees." },
        { t: "2) Pick pair & size", p: "Mind slippage and volatility." },
        { t: "3) Confirm swap", p: "Wait for confirmation. Pay gas only — zero tax." },
        { t: "4) Safety checklist", p: "Don’t click suspicious stuff. Our rules are public and verifiable." },
      ],
      cta: "Buy $GARLIC",
      dex: "DEX",
      docs: "Contract",
    },
    community: {
      kicker: "Community",
      title: "Memes live in people",
      p: "Garlic is against market vampires, but for people. Join chat, drop memes, craft stickers, light the sun candles.",
      tg: "Telegram",
      x: "X (Twitter)",
      gh: "GitHub",
    },
    footer: {
      hint: "Tip:",
      hintAfter: "to open language switcher",
      p1: "This is not financial advice. Meme is culture; rules are discipline.",
      p2: "© $GARLIC. Zero tax. LP lock. Renounced. Fair launch.",
    },
    switcher: { title: "Language", ru: "Русский", en: "English", hi: "हिंदी", id: "Indonesia" },
  },

  hi: {
    nav: { approach: "दृष्टिकोण", policy: "नीति", tokenomics: "टोकनोमिक्स", roadmap: "रोडमैप", buy: "खरीदें" },
    trustStrip: ["FAIR LAUNCH","ZERO TAX","LP LOCK","RENOUNCED"],
    hero: {
      tags: ["अनुशासन","लिक्विडिटी","समुदाय"],
      titleTop: "GARLIC",
      titleBottom: "मीम, पर प्रोटोकॉल अनुशासन के साथ.",
      paragraph: "लिजेंड: बाजार के वैम्पायरों के खिलाफ लहसुन. 0% टैक्स, LP लॉक, renounced.",
      ctaBuy: "खरीदें $GARLIC",
      ctaDocs: "नियम",
      note: "लाभ का वादा नहीं."
    },
    approach: {
      kicker: "Legend",
      title: "Garlic vs Vampires",
      c1t: "Meme first",
      c1p: "FUD और स्कैम के खिलाफ.",
      c2t: "Discipline",
      c2p: "Zero tax, LP lock, renounced.",
      c3t: "Culture",
      c3p: "Sticker vibes, community.",
    },
    policy: {
      kicker: "Policy", title: "Hard rules, soft humor",
      caption: "Clear settings → predictable behavior.",
      c1t: "Trade tax — 0%", c1p: "No contract taxes.",
      c2t: "LP — locked", c2p: "No draining.",
      c3t: "Ownership — renounced", c3p: "No switches.",
      c4t: "Fair launch", c4p: "One start for everyone.",
      badge: "No profit promises.",
    },
    tokenomics: {
      kicker: "Tokenomics", title: "Transparent & predictable",
      caption: "Fewer parameters — less uncertainty.",
      supply: "Total supply", supplyVal: "1,000,000,000 $GARLIC",
      items: [
        { t: "Trade tax", v: "0%" }, { t: "Liquidity", v: "LP lock" },
        { t: "Ownership", v: "Renounced" }, { t: "Launch", v: "Fair" },
      ],
      foot: "No private sales.",
    },
    signals: { kicker: "Signals", title: "Meme alive", cards: [
      { t: "Mascot", p: "Garlic head 🧄" },
      { t: "Language", p: "Vampires, sun candles" },
      { t: "Visual", p: "Bright stickers" },
      { t: "Discipline", p: "Clear config" },
    ]},
    roadmap: {
      kicker: "Roadmap", title: "From smell to legend",
      p1: ["Website & socials","DEX","LP lock, renounced","Narrative"],
      p2: ["NFT “Cloves”","Artist collabs","Community"],
      p3: ["Trackers","Quests","IRL merch"],
      note: "No profit promises.",
    },
    how: {
      kicker: "How to buy", title: "A couple of clicks",
      steps: [
        { t: "1) Connect wallet", p: "MetaMask or compatible." },
        { t: "2) Pick pair & size", p: "Mind slippage." },
        { t: "3) Confirm swap", p: "Pay gas only." },
        { t: "4) Safety", p: "Rules are public." },
      ],
      cta: "Buy $GARLIC", dex: "DEX", docs: "Contract",
    },
    community: { kicker: "Community", title: "Memes live in people", p: "Join and share.", tg: "Telegram", x: "X (Twitter)", gh: "GitHub" },
    footer: { hint: "Tip:", hintAfter: "language switcher", p1: "No financial advice.", p2: "© $GARLIC." },
    switcher: { title: "Language", ru: "Русский", en: "English", hi: "हिंदी", id: "Indonesia" },
  },

  id: {
    nav: { approach: "Pendekatan", policy: "Kebijakan", tokenomics: "Tokenomik", roadmap: "Roadmap", buy: "Beli" },
    trustStrip: ["FAIR LAUNCH","ZERO TAX","LP LOCK","RENOUNCED"],
    hero: {
      tags: ["disiplin","likuiditas","komunitas"],
      titleTop: "GARLIC",
      titleBottom: "meme dengan disiplin protokol.",
      paragraph: "Legenda: bawang putih vs vampir pasar. 0% pajak, LP terkunci, kepemilikan dilepas.",
      ctaBuy: "Beli $GARLIC",
      ctaDocs: "Aturan",
      note: "Bukan nasihat finansial.",
    },
    approach: {
      kicker: "Legenda",
      title: "Garlic vs para vampir",
      c1t: "Meme dulu, aturan jelas",
      c1p: "FUD & scam diusir oleh bau kemenangan.",
      c2t: "Disiplin",
      c2p: "Zero tax, LP lock, renounced.",
      c3t: "Budaya",
      c3p: "Stiker cerah, narasi anti-vampir.",
    },
    policy: {
      kicker: "Kebijakan", title: "Aturan tegas, humor lembut",
      caption: "Pengaturan jelas → perilaku dapat diprediksi.",
      c1t: "Pajak transaksi — 0%", c1p: "Tidak ada pajak kontrak.",
      c2t: "LP — terkunci", c2p: "Tidak ada pengurasan.",
      c3t: "Kepemilikan — dilepas", c3p: "Tidak ada saklar rahasia.",
      c4t: "Fair launch", c4p: "Satu mulai untuk semua.",
      badge: "Tanpa janji profit.",
    },
    tokenomics: {
      kicker: "Tokenomik", title: "Transparan & dapat diprediksi",
      caption: "Parameter lebih sedikit — ketidakpastian lebih kecil.",
      supply: "Total supply", supplyVal: "1,000,000,000 $GARLIC",
      items: [
        { t: "Pajak transaksi", v: "0%" }, { t: "Likuiditas", v: "LP lock" },
        { t: "Kepemilikan", v: "Renounced" }, { t: "Peluncuran", v: "Fair" },
      ],
      foot: "Tanpa private sale.",
    },
    signals: { kicker: "Sinyal", title: "Meme tetap hidup", cards: [
      { t: "Maskot", p: "Kepala bawang 🧄" },
      { t: "Bahasa meme", p: "Vampir, sun candles" },
      { t: "Visual", p: "Stiker cerah" },
      { t: "Disiplin", p: "Konfigurasi jelas" },
    ]},
    roadmap: {
      kicker: "Roadmap", title: "Dari aroma ke legenda",
      p1: ["Website & sosial","DEX","LP lock, renounced","Narasi"],
      p2: ["NFT “Cloves”","Kolaborasi artis","Komunitas"],
      p3: ["Integrasi tracker","Quest","Merch IRL"],
      note: "Tanpa janji profit.",
    },
    how: {
      kicker: "Cara membeli", title: "Beberapa klik saja",
      steps: [
        { t: "1) Hubungkan dompet", p: "MetaMask atau kompatibel." },
        { t: "2) Pilih pair & ukuran", p: "Perhatikan slippage." },
        { t: "3) Konfirmasi swap", p: "Bayar gas saja." },
        { t: "4) Keamanan", p: "Aturan publik & dapat diverifikasi." },
      ],
      cta: "Beli $GARLIC", dex: "DEX", docs: "Kontrak",
    },
    community: { kicker: "Komunitas", title: "Meme hidup di orang", p: "Gabung & berbagi.", tg: "Telegram", x: "X (Twitter)", gh: "GitHub" },
    footer: { hint: "Tip:", hintAfter: "bahasa", p1: "Bukan nasihat finansial.", p2: "© $GARLIC." },
    switcher: { title: "Bahasa", ru: "Русский", en: "English", hi: "हिंदी", id: "Indonesia" },
  },
};

function getDeep(obj, path) {
  if (!obj) return null;
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    cur = cur?.[p];
    if (cur == null) return null;
  }
  return cur;
}
const LangContext = createContext({ lang: FALLBACK, setLang: () => {} });
function useT() {
  const { lang } = useContext(LangContext);
  return (path) => getDeep(DICT[lang], path) ?? getDeep(DICT[FALLBACK], path) ?? "";
}

/* =========================================================================
   NAVBAR + LANGUAGE SWITCHER (unchanged)
   ========================================================================= */

function LangSwitcher() {
  const { lang, setLang } = useContext(LangContext);
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const items = [
    { code: "en", label: t("switcher.en") || "English" },
    { code: "hi", label: t("switcher.hi") || "हिंदी" },
    { code: "id", label: t("switcher.id") || "Indonesia" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm"
      >
        <Globe className="h-4 w-4" />
        <span>{t("switcher.title") || "Language"}</span>
        <span className="text-white/50">({lang.toUpperCase()})</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/15 bg-black/80 p-1 shadow-xl backdrop-blur">
          {items.map((it) => (
            <button
              key={it.code}
              onClick={() => {
                setLang(it.code);
                if (isClient) localStorage.setItem("lang", it.code);
                setOpen(false);
              }}
              className={cx(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10",
                lang === it.code && "bg-white/10"
              )}
            >
              <span>{it.label}</span>
              {lang === it.code && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const t = useT();
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
      <Container className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-md bg-white" />
          <div className="text-sm font-bold tracking-tight">$GARLIC</div>
        </div>
        <nav className="hidden gap-6 md:flex">
          <a href="#approach" className="text-sm text-white/70 hover:text-white">
            {t("nav.approach")}
          </a>
          <a href="#policy" className="text-sm text-white/70 hover:text-white">
            {t("nav.policy")}
          </a>
          <a href="#tokenomics" className="text-sm text-white/70 hover:text-white">
            {t("nav.tokenomics")}
          </a>
          <a href="#roadmap" className="text-sm text-white/70 hover:text-white">
            {t("nav.roadmap")}
          </a>
          <a href="#buy" className="text-sm text-white/70 hover:text-white">
            {t("nav.buy")}
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <a
            href="#buy"
            className="hidden rounded-xl bg-white px-3 py-1.5 text-sm text-black transition hover:opacity-90 md:block"
          >
            {t("nav.buy")}
          </a>
        </div>
      </Container>
    </div>
  );
}

/* =========================================================================
   LANGUAGE AUTO-DETECT (unchanged)
   ========================================================================= */

function useAutoLang() {
  const { setLang } = useContext(LangContext);
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (saved && LANGS.includes(saved)) setLang(saved);
    else {
      const b = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "";
      if (b.startsWith("hi")) setLang("hi");
      else if (b.startsWith("id")) setLang("id");
      else setLang("en");
    }
  }, [setLang]);
}

/* =========================================================================
   HERO
   ========================================================================= */

function Ribbon() {
  const t = useT();
  const items = t("trustStrip");
  return (
    <div className="relative isolate my-6 overflow-hidden">
      <div className="flex animate-[ribbon_30s_linear_infinite] whitespace-nowrap border-y border-white/10 py-2 text-xs tracking-[0.2em]">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-6 text-white/70">
            {items.join(" • ")}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes ribbon {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

function Hero() {
  const t = useT();
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24">
      <Container>
        <div className="flex flex-col items-start gap-6 md:gap-8">
          <div className="flex flex-wrap items-center gap-2">
            {t("hero.tags").map((x, i) => (
              <Tag key={i}>{x}</Tag>
            ))}
          </div>

          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              {t("hero.titleTop")}
              <span className="ml-3 inline-block align-bottom text-xl font-medium text-white/60">($GARLIC)</span>
            </h1>
            <p className="mt-3 text-xl md:text-2xl text-white/80">{t("hero.titleBottom")}</p>
          </div>

          <p className="max-w-3xl text-white/80">{t("hero.paragraph")}</p>

          <div className="flex flex-col sm:flex-row items-start gap-3">
            <a
              href="#buy"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-black transition hover:opacity-90"
            >
              <ArrowRight className="h-4 w-4" />
              {t("hero.ctaBuy")}
            </a>
            <a
              href="#policy"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 transition hover:bg-white/10"
            >
              <CommandIcon className="h-4 w-4" />
              {t("hero.ctaDocs")}
            </a>
          </div>

          <Ribbon />

          <p className="text-xs text-white/50">{t("hero.note")}</p>
        </div>
      </Container>

      {/* decor lights (unchanged) */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)] blur-2xl" />
      <div className="pointer-events-none absolute -left-10 top-40 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_center,rgba(190,255,190,0.06),transparent_60%)] blur-2xl" />
    </section>
  );
}

function CommandIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M6 9h12M6 15h12M9 6v12M15 6v12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================================
   APPROACH (Legend)
   ========================================================================= */

function Approach() {
  const t = useT();
  return (
    <section id="approach" className="py-14 md:py-20">
      <Container>
        <div className="mb-8">
          <SectionKicker>{t("approach.kicker")}</SectionKicker>
          <H2>{t("approach.title")}</H2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{t("approach.c1t")}</h3>
            <p className="mt-2 text-sm text-white/70">{t("approach.c1p")}</p>
          </Card>
          <Card>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
              <Coins className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{t("approach.c2t")}</h3>
            <p className="mt-2 text-sm text-white/70">{t("approach.c2p")}</p>
          </Card>
          <Card>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{t("approach.c3t")}</h3>
            <p className="mt-2 text-sm text-white/70">{t("approach.c3p")}</p>
          </Card>
        </div>
      </Container>
    </section>
  );
}

/* =========================================================================
   POLICY
   ========================================================================= */

function Policy() {
  const t = useT();
  const items = [
    { t: t("policy.c1t"), p: t("policy.c1p"), icon: <Coins className="h-5 w-5" /> },
    { t: t("policy.c2t"), p: t("policy.c2p"), icon: <ShieldCheck className="h-5 w-5" /> },
    { t: t("policy.c3t"), p: t("policy.c3p"), icon: <Sun className="h-5 w-5" /> },
    { t: t("policy.c4t"), p: t("policy.c4p"), icon: <Stars className="h-5 w-5" /> },
  ];
  return (
    <section id="policy" className="py-14 md:py-20">
      <Container>
        <div className="mb-8">
          <SectionKicker>{t("policy.kicker")}</SectionKicker>
          <H2>{t("policy.title")}</H2>
          <p className="mt-3 max-w-3xl text-white/70">{t("policy.caption")}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((it, i) => (
            <Card key={i}>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-8 w-8 shrink-0 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                  {it.icon}
                </div>
                <div>
                  <div className="font-semibold">{it.t}</div>
                  <div className="mt-1 text-white/70">{it.p}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-xs text-white/50">{t("policy.badge")}</div>
      </Container>
    </section>
  );
}

/* =========================================================================
   SIGNALS
   ========================================================================= */

function Signals() {
  const t = useT();
  const cards = t("signals.cards") || [];
  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="mb-8">
          <SectionKicker>{t("signals.kicker")}</SectionKicker>
          <H2>{t("signals.title")}</H2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((c, i) => (
            <Card key={i}>
              <div className="font-semibold">{c.t}</div>
              <div className="mt-1 text-white/70">{c.p}</div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* =========================================================================
   TOKENOMICS
   ========================================================================= */

function Tokenomics() {
  const t = useT();
  const items = t("tokenomics.items") || [];
  return (
    <section id="tokenomics" className="py-14 md:py-20">
      <Container>
        <div className="mb-8">
          <SectionKicker>{t("tokenomics.kicker")}</SectionKicker>
          <H2>{t("tokenomics.title")}</H2>
          <p className="mt-3 text-white/70">{t("tokenomics.caption")}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="text-sm text-white/60">{t("tokenomics.supply")}</div>
            <div className="mt-1 text-xl font-semibold">{t("tokenomics.supplyVal")}</div>
            <div className="mt-4 grid gap-2">
              {items.map((x, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                >
                  <span>{x.t}</span>
                  <span className="text-white/70">{x.v}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-white/50">{t("tokenomics.foot")}</div>
          </Card>
          <Card className="md:col-span-2">
            <div className="mb-3 text-sm text-white/60">Notes</div>
            <ul className="list-disc pl-5 text-white/70">
              <li>No hidden taxes, no hidden switches, no “emergency” magic.</li>
              <li>LP lock & renounced — verifiable on chain.</li>
              <li>We build culture, not sell promises.</li>
            </ul>
          </Card>
        </div>
      </Container>
    </section>
  );
}

/* =========================================================================
   ROADMAP
   ========================================================================= */

function Roadmap() {
  const t = useT();
  const p1 = t("roadmap.p1") || [];
  const p2 = t("roadmap.p2") || [];
  const p3 = t("roadmap.p3") || [];
  return (
    <section id="roadmap" className="py-14 md:py-20">
      <Container>
        <div className="mb-8">
          <SectionKicker>{t("roadmap.kicker")}</SectionKicker>
          <H2>{t("roadmap.title")}</H2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[p1, p2, p3].map((arr, i) => (
            <Card key={i}>
              <ol className="list-decimal pl-5 text-white/70">
                {arr.map((x, idx) => (
                  <li key={idx} className="mb-2">
                    {x}
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-xs text-white/50">{t("roadmap.note")}</div>
      </Container>
    </section>
  );
}

/* =========================================================================
   HOW TO BUY
   ========================================================================= */

function HowToBuy() {
  const t = useT();
  const steps = t("how.steps") || [];
  return (
    <section id="buy" className="py-14 md:py-20">
      <Container>
        <div className="mb-8">
          <SectionKicker>{t("how.kicker")}</SectionKicker>
          <H2>{t("how.title")}</H2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((s, i) => (
            <Card key={i}>
              <div className="font-semibold">{s.t}</div>
              <div className="mt-1 text-white/70">{s.p}</div>
            </Card>
          ))}
          <Card>
            <div className="mb-3 text-sm text-white/60">Links</div>
            <div className="flex flex-wrap gap-2">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-black transition hover:opacity-90"
              >
                <Coins className="h-4 w-4" />
                {t("how.dex")}
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 transition hover:bg-white/10"
              >
                <DocumentIcon className="h-4 w-4" />
                {t("how.docs")}
              </a>
            </div>
            <div className="mt-3 text-xs text-white/50">
              Always verify contract address via official sources.
            </div>
          </Card>
          <Card>
            <div className="mb-3 text-sm text-white/60">Checklist</div>
            <ul className="list-disc pl-5 text-white/70">
              <li>Verify domain and links.</li>
              <li>Never share your seed phrase.</li>
              <li>Mind slippage, gas, and volatility.</li>
            </ul>
          </Card>
        </div>
      </Container>
    </section>
  );
}

function DocumentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M7 4h7l3 3v13H7z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 4v4h4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* =========================================================================
   COMMUNITY
   ========================================================================= */

function Community() {
  const t = useT();
  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="mb-8">
          <SectionKicker>{t("community.kicker")}</SectionKicker>
          <H2>{t("community.title")}</H2>
        </div>
        <Card>
          <p className="text-white/70">{t("community.p")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-black transition hover:opacity-90"
            >
              <TelegramIcon className="h-4 w-4" />
              {t("community.tg")}
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 transition hover:bg-white/10"
            >
              <XIcon className="h-4 w-4" />
              {t("community.x")}
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 transition hover:bg-white/10"
            >
              <GitHubIcon className="h-4 w-4" />
              {t("community.gh")}
            </a>
          </div>
        </Card>
      </Container>
    </section>
  );
}

function TelegramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.8 15.3l-.4 5c.6 0 .8-.2 1.1-.5l2.6-2.4 5.4 4c1 .6 1.7.3 2-.9l3.7-17.2c.3-1.2-.5-1.7-1.5-1.4L1.8 9.2c-1.2.4-1.2 1.1-.2 1.4l5.2 1.6 12.1-7.6c.6-.3 1.1-.1.6.2" />
    </svg>
  );
}
function XIcon(props) {
  return (
    <svg viewBox="0 0 1200 1227" fill="currentColor" {...props}>
      <path d="M714 685l460 542H967L611 783 195 1227H0l500-558L26 0h207l326 381 393-381h195z" />
    </svg>
  );
}
function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 .1.8-.2 1.6-1 .2-.7.7-1.2 1.1-1.5-2.7-.3-5.6-1.3-5.6-6 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1.1-.3 3.5 1.2a12 12 0 016.4 0c2.4-1.5 3.5-1.2 3.5-1.2.6 1.6.2 2.9.1 3.2.7.9 1.2 2 1.2 3.3 0 4.7-2.9 5.7-5.6 6 .5.4 1 .9 1 2.1v3.2c0 .3.2.7.9.6A12 12 0 0012 .5z" />
    </svg>
  );
}

/* =========================================================================
   FOOTER
   ========================================================================= */

function Footer() {
  const t = useT();
  return (
    <footer className="pb-16">
      <Container>
        <div className="text-xs text-white/60">{t("footer.p1")}</div>
        <div className="mt-1 text-xs text-white/50">{t("footer.p2")}</div>
      </Container>
    </footer>
  );
}

const LangHint = () => {
  const t = useT();
  return (
    <div className="fixed bottom-4 right-4 hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/70 md:flex items-center gap-2">
      {t("footer.hint")} <Kbd>G</Kbd> {t("footer.hintAfter")}
    </div>
  );
};

/* =========================================================================
   ROOT COMPONENT (design preserved)
   ========================================================================= */

export default function GarlicAwwwardsSite() {
  const [lang, setLangState] = useState(FALLBACK);
  const setLang = useCallback((l) => setLangState(LANGS.includes(l) ? l : FALLBACK), []);
  const langValue = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  useAutoLang();

  return (
    <CursorProvider>
      <LangContext.Provider value={langValue}>
        <div className="min-h-screen bg-black text-white selection:bg-lime-300/30 selection:text-white">
          <GarlicCursor />
          <ClickRipple />
          <Navbar />
          <main>
            <Hero />
            <Approach />
            <Policy />
            <Signals />
            <Tokenomics />
            <Roadmap />
            <HowToBuy />
            <Community />
          </main>
          <Footer />
          <LangHint />
        </div>
      </LangContext.Provider>
    </CursorProvider>
  );
}
