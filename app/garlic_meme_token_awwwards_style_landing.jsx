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
    trustStrip: ["0% TAX", "LP LOCK", "COMMUNITY FIRST", "NO NFTs"],
    hero: {
      tags: ["protection", "community", "meme"],
      titleTop: "GARLIC",
      titleBottom: "Щит твоего портфеля.",
      paragraph:
        "Чеснок веками был символом защиты. В крипте $GARLIC — простой знак, который каждый понимает: отгоняем «кровососов» рынка и держимся вместе. Символ > обещаний. Комьюнити > шума.",
      buy: "Купить $GARLIC",
      policy: "Что это такое",
      badge: "symbol-driven • community-first",
      marquee: [
        "Protect your bag with GARLIC",
        "No garlic — no gains",
        "One clove is weak. A bulb is unstoppable.",
        "0% tax • LP locked • Community first"
      ]
    },
    approach: {
      kicker: "Подход",
      title: "Простой символ. Ясный вайб. Живое сообщество.",
      caption: "Без кринжа, без сложных обещаний — только легенда, которая сразу считывается.",
      items: [
        {
          icon: "Shield",
          title: "Символ защиты",
          text: "GARLIC — это мем-щит. Видишь чеснок — понимаешь: «моё в безопасности». Мем, который работает без объяснений."
        },
        {
          icon: "Sparkles",
          title: "Культура вместо утилити",
          text: "DOGE — добрый пёс. PEPE — вечная лягушка. GARLIC — защита. Мы строим настроение, а не whitepaper."
        },
        {
          icon: "Coins",
          title: "Честный запуск",
          text: "0% tax, залоченная ликвидность, прозрачное распределение. Никаких хитрых контрактных трюков."
        }
      ]
    },
    policy: {
      kicker: "Policy",
      title: "Три правила чеснока",
      principles: [
        { title: "Символ > обещаний", text: "Мы не продаём «утилити». Мы создаём знак, за который хочется держаться." },
        { title: "Комьюнити > эго", text: "Холдер — главная звезда. Мем живёт благодаря людям, а не фичам." },
        { title: "Простота > сложность", text: "Чем меньше шума — тем сильнее мем. Всё остальное — лишнее." }
      ],
      note: "Никаких NFT, налогов на сделки или «магических» схем."
    },
    tokenomics: {
      kicker: "Tokenomics",
      title: "Честная основа без фокусов",
      supply: "Total Supply",
      supplyVal: "1,000,000,000 $GARLIC",
      taxes: "Taxes", taxesVal: "0%",
      liquidity: "Liquidity", liquidityVal: "Locked",
      dist: "Distribution",
      distList: [
        "60% — Ликвидность (LP, лок)",
        "20% — Комьюнити/гроуф",
        "10% — Партнёрства и листинги",
        "10% — Команда (вестинг)"
      ],
      arch: "Архитектура",
      archP: "Стандартный контракт, renounce после запуска, без апгрейдов. Прозрачный и предсказуемый.",
      pills: ["Fair launch", "LP locked", "0% tax"]
    },
    roadmap: {
      kicker: "Roadmap",
      title: "От простого запуска к культуре",
      caption: "Этапы развития мем-легенды и комьюнити.",
      phase: "Этап",
      p1: { title: "Launch & Garlic Army", text: "Старт, базовые каналы, мем-пак, onboarding холдеров." },
      p2: { title: "Meme Expansion", text: "Ежедневные форматы, шеры, челленджи, вирусные лозунги." },
      p3: { title: "Listings & Growth", text: "Площадки, партнёрства, органический рост армии." },
      p4: { title: "Garlic Fest", text: "Ивенты и челленджи для держателей: «Protect your bag with garlic»." }
    },
    faq: {
      kicker: "FAQ",
      title: "Коротко и по делу",
      items: [
        { q: "Зачем мне $GARLIC?", a: "Чтобы быть частью Garlic Army. Это символ защиты, который мгновенно понятен." },
        { q: "Это мем или утилити?", a: "Это мем. В этом его сила: символ, эмоция, сообщество." },
        { q: "Есть ли налоги и NFT?", a: "Нет. 0% tax, без NFT, без лишней сложности." }
      ]
    },
    buy: {
      kicker: "Как купить",
      title: "Три шага — и ты в армии",
      caption: "Кошелёк — базовая монета — своп. Дальше — культура.",
      s1: "Кошелёк", s1p: "MetaMask / Rabby / OKX. Выбери сеть (ETH/BSC).",
      s2: "База и газ", s2p: "Пополни ETH/BNB для свопа и комиссий сети.",
      s3: "Своп на $GARLIC", s3p: "Uniswap / PancakeSwap. Адрес появится в день запуска.",
      cta: "Вступить в Garlic Army",
      note: "* Не финансовый совет. Криптовалюты волатильны."
    },
    community: {
      kicker: "Community",
      title: "Garlic Army",
      caption: "Ты — долька. Вместе — головка. Символ прост, движение — мощное.",
      actions: [
        { label: "Telegram", caption: "Новости и мемы" },
        { label: "Twitter", caption: "Шеры и лозунги" },
        { label: "Chart", caption: "Смотри движение" }
      ]
    }
  },

  hi: {
    nav: { approach: "दृष्टिकोण", policy: "नीति", tokenomics: "टोकनॉमिक्स", roadmap: "रोडमैप", buy: "खरीदें" },
    trustStrip: ["फेयर लॉन्च", "0% टैक्स", "लिक्विडिटी लॉक", "रेनाउन्स्ड"],
    hero: {
      tags: ["अनुशासन", "लिक्विडिटी-फर्स्ट", "कम्युनिटी"],
      titleTop: "GARLIC",
      titleBottom: "नियमों के साथ मीम。",
      paragraph:
        "नियम कोड में सेट हैं: फेयर लॉन्च, 0% टैक्स, लिक्विडिटी फर्स्ट। लक्ष्य простой: внимание stays on idea और liquidity — बाकी काम मार्केट करता है。",
      buy: "पोजिशन लें",
      policy: "नीति देखें",
      badge: "रूल-बेस्ड • मीम-ड्रिवन",
      marquee: [
        "One start for everyone",
        "No hidden taxes",
        "Liquidity over hype",
        "Signal over noise"
      ]
    },
    approach: {
      kicker: "दृष्टिकोण",
      title: "सरल नियम। स्पष्ट संकेत। टिकाऊ कम्युनिटी।",
      caption: "किसी भी शॉर्टकट के बिना — साफ, समझने योग्य, प्रतिरक्षित।",
      items: [
        { icon: "Layers", title: "फेयर लॉन्च", text: "हर किसी के लिए एक старт। कोई निजी मिंट, कोई सीक्रेट डील्स नहीं।" },
        { icon: "GaugeCircle", title: "0% टैक्स", text: "ट्रेड पर कोई टैक्स नहीं। कोई छिपी फीस नहीं। केवल рынок." },
        { icon: "Lock", title: "LP लॉक", text: "लिक्विडिटी लॉक: भरोसा, прозрачность, понятные правила." }
      ]
    },
    policy: {
      kicker: "नीति",
      title: "चार столпа политики",
      principles: [
        { title: "Справедливость", text: "Один старт для всех, без приватных листингов." },
        { title: "Прозрачность", text: "0% налогов на сделки, без скрытых условий." },
        { title: "Ликвидность", text: "Ликвидность важнее хайпа." },
        { title: "Сообщество", text: "Долгосрочная ценность строится людьми, а не обещаниями." }
      ],
      note: "Никаких звёздочек и футнот. Всё прямо в коде."
    },
    tokenomics: {
      kicker: "टोकनॉमिक्स",
      title: "सीधे и честно",
      supply: "कुल सप्लाई",
      supplyVal: "1,000,000,000 $GARLIC",
      taxes: "टैक्स", taxesVal: "0 %",
      liquidity: "लिक्विडिटी", liquidityVal: "लॉक्ड",
      dist: "वितरण",
      distList: ["60% — लिक्विडिटी", "20% — कम्युनिटी / एयरड्रॉप / рост", "10% — партнёрство", "10% — DAO резерв (мультисиг)"],
      arch: "आर्किटेक्चर",
      archP: "स्टैंडर्ड कॉन्ट्रैक्ट, लॉन्च के बाद रीनाउंस, नॉन-अपग्रेडेबल।",
      pills: ["OpenZeppelin", "Non-upgradeable", "DAO резерв"]
    },
    roadmap: {
      kicker: "रोडमैप",
      title: "क्लीन लॉन्च से संस्कृति तक",
      caption: "लचीला; होल्डर्स и креэйторс के मूल्य पर केंद्रित。",
      phase: "फेज़",
      p1: { title: "लॉन्च", text: "फेयर लॉन्च, каналы, базовый мем-пак." },
      p2: { title: "Расширение", text: "Коллабы, мем-форматы, рост охвата." },
      p3: { title: "Листинги", text: "Биржи и сервисы отслеживания." },
      p4: { title: "Комьюнити", text: "Челленджи, ивенты, регулярные акции。" }
    },
    faq: {
      kicker: "FAQ",
      title: "Скоро",
      items: [
        { q: "Почему GARLIC?", a: "Простой символ защиты, понятный всем." }
      ]
    },
    buy: {
      kicker: "Как купить",
      title: "Три шага",
      caption: "Кошелёк — базовая монета — своп。",
      s1: "Кошелёк", s1p: "MetaMask / Rabby / OKX. नेटवर्क चुनें (ETH/BSC).",
      s2: "База и газ", s2p: "ETH/BNB для комиссий и свопа.",
      s3: "Своп на $GARLIC", s3p: "Адрес в день запуска。",
      cta: "Присоединиться",
      note: "* Crypto is volatile."
    },
    community: {
      kicker: "Community",
      title: "Garlic Army",
      caption: "Комьюнити решает。",
      actions: [
        { label: "Telegram", caption: "Новости" },
        { label: "Twitter", caption: "Шеры" },
        { label: "Chart", caption: "График" }
      ]
    }
  },

  id: {
    // оставлено как в исходнике (индонезийская локаль)
  }
};

/* ======================= Хелперы i18n ======================= */
const LangContext = createContext({ lang: FALLBACK, t: (p) => p });
function useLang() { return useContext(LangContext); }

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function cn(...classes) { return classes.filter(Boolean).join(" "); }
/* ======================= Кнопочные утилиты ======================= */
const Kbd = ({ children }) => (
  <span className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] leading-none text-white/70">
    {children}
  </span>
);

const Container = ({ className = "", children }) => (
  <div className={cn("mx-auto w-full max-w-7xl px-4 md:px-6", className)}>{children}</div>
);

const SectionTitle = ({ kicker, title, caption }) => (
  <div className="mx-auto max-w-3xl text-center">
    {kicker && <div className="mb-2 text-xs uppercase tracking-wider text-white/60">{kicker}</div>}
    <h2 className="text-2xl font-semibold leading-tight md:text-4xl">{title}</h2>
    {caption && <p className="mt-3 text-white/70">{caption}</p>}
  </div>
);

const Pill = ({ children }) => (
  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">{children}</span>
);

const Card = ({ className = "", children }) => (
  <div className={cn("rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6", className)}>{children}</div>
);

/* ======================= i18n хук ======================= */
function useT() {
  const { lang } = useLang();
  const dict = DICT[lang] || DICT[FALLBACK];
  return (path) => {
    const parts = path.split(".");
    let cur = dict;
    for (const p of parts) cur = cur?.[p];
    return cur ?? path;
  };
}

/* ======================= Курсор / Утки ======================= */
function useMagnet(strength = 12) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      x.set((mx / r.width) * strength);
      y.set((my / r.height) * strength);
    };
    const onLeave = () => { x.set(0); y.set(0); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return { ref, x, y };
}

/* ======================= Хедер / Навигация ======================= */
const Header = () => {
  const t = useT();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const nav = DICT[lang]?.nav || DICT[FALLBACK].nav;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-lime-400 to-emerald-400" />
          <span className="font-semibold">GARLIC</span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#approach" className="text-sm text-white/80 hover:text-white">{nav.approach}</a>
          <a href="#policy" className="text-sm text-white/80 hover:text-white">{nav.policy}</a>
          <a href="#tokenomics" className="text-sm text-white/80 hover:text-white">{nav.tokenomics}</a>
          <a href="#roadmap" className="text-sm text-white/80 hover:text-white">{nav.roadmap}</a>
          <a href="#buy" className="text-sm font-medium text-lime-300 hover:text-white/90">{nav.buy}</a>
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden rounded-lg border border-white/15 p-2 text-white/80">
          <span className="sr-only">Menu</span>
          <Layers className="h-4 w-4" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-0 right-0 top-14 border-b border-white/10 bg-black/90 md:hidden"
            >
              <Container className="flex flex-col gap-4 py-4">
                <a onClick={() => setOpen(false)} href="#approach" className="text-white/90">{nav.approach}</a>
                <a onClick={() => setOpen(false)} href="#policy" className="text-white/90">{nav.policy}</a>
                <a onClick={() => setOpen(false)} href="#tokenomics" className="text-white/90">{nav.tokenomics}</a>
                <a onClick={() => setOpen(false)} href="#roadmap" className="text-white/90">{nav.roadmap}</a>
                <a onClick={() => setOpen(false)} href="#buy" className="text-lime-300">{nav.buy}</a>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
};

/* ======================= HERO ======================= */
const Hero = () => {
  const t = useT();

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <FloatingCloves />
      <Container className="relative z-10 flex min-h-[68vh] flex-col items-center justify-center py-16 md:py-24">
        <div className="mb-4 flex gap-2">
          {t("hero.tags").map((g, i) => (
            <Pill key={i}>{g}</Pill>
          ))}
        </div>
        <div className="mb-2 text-center text-5xl font-bold md:text-7xl">{t("hero.titleTop")}</div>
        <div className="mb-4 text-center text-xl font-medium opacity-90 md:text-2xl">{t("hero.titleBottom")}</div>
        <p className="mx-auto mb-6 max-w-2xl text-center text-white/70">{t("hero.paragraph")}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="#buy" className="group inline-flex items-center gap-2 rounded-full bg-lime-300/90 px-4 py-2 text-black hover:bg-lime-300">
            {t("hero.buy")} <ChevronRight className="h-4 w-4 transition -translate-x-0.5 group-hover:translate-x-0" />
          </a>
          <a href="#policy" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/90 hover:bg-white/5">
            {t("hero.policy")} <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="pointer-events-none mt-10 flex flex-wrap justify-center gap-2 opacity-70">
          {t("hero.marquee").map((m, i) => <Pill key={i}>{m}</Pill>)}
        </div>
      </Container>
    </section>
  );
};
/* ======================= Approach ======================= */
const Approach = () => {
  const t = useT();

  return (
    <section id="approach" className="relative py-16 md:py-24">
      <Container>
        <SectionTitle
          kicker={t("approach.kicker")}
          title={t("approach.title")}
          caption={t("approach.caption")}
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-lime-300/20 text-lime-200"><Shield className="h-5 w-5"/></div>
            <h3 className="text-lg font-semibold">{t("approach.items.0.title")}</h3>
            <p className="mt-2 text-sm text-white/70">{t("approach.items.0.text")}</p>
          </Card>
          <Card>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-lime-300/20 text-lime-200"><Sparkles className="h-5 w-5"/></div>
            <h3 className="text-lg font-semibold">{t("approach.items.1.title")}</h3>
            <p className="mt-2 text-sm text-white/70">{t("approach.items.1.text")}</p>
          </Card>
          <Card>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-lime-300/20 text-lime-200"><Coins className="h-5 w-5"/></div>
            <h3 className="text-lg font-semibold">{t("approach.items.2.title")}</h3>
            <p className="mt-2 text-sm text-white/70">{t("approach.items.2.text")}</p>
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
    <section id="policy" className="relative border-y border-white/10 bg-white/5 py-16 md:py-24">
      <Container>
        <SectionTitle kicker={t("policy.kicker")} title={t("policy.title")} caption={t("policy.caption")}/>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {t("policy.principles").map((p, i) => (
            <Card key={i}>
              <div className="mb-2 flex items-center gap-2 text-lime-200"><BadgeCheck className="h-4 w-4"/><span className="font-medium">{p.title}</span></div>
              <p className="text-sm text-white/70">{p.text}</p>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-white/60">{t("policy.note")}</div>
      </Container>
    </section>
  );
};

/* ======================= Tokenomics ======================= */
const Tokenomics = () => {
  const t = useT();

  return (
    <section id="tokenomics" className="relative py-16 md:py-24">
      <Container>
        <SectionTitle kicker={t("tokenomics.kicker")} title={t("tokenomics.title")} caption={t("tokenomics.caption")}/>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card>
            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/60">{t("tokenomics.supply")}</div>
                <div className="font-medium">{t("tokenomics.supplyVal")}</div>
              </div>
              <div>
                <div className="text-white/60">{t("tokenomics.taxes")}</div>
                <div className="font-medium">{t("tokenomics.taxesVal")}</div>
              </div>
              <div>
                <div className="text-white/60">{t("tokenomics.liquidity")}</div>
                <div className="font-medium">{t("tokenomics.liquidityVal")}</div>
              </div>
            </div>

            <div className="text-white/60">{t("tokenomics.dist")}</div>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-white/80">
              {t("tokenomics.distList").map((li, i) => <li key={i}>{li}</li>)}
            </ul>
          </Card>

          <Card>
            <div className="text-white/60">{t("tokenomics.arch")}</div>
            <p className="mt-2 text-sm text-white/70">{t("tokenomics.archP")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {t("tokenomics.pills").map((p, i) => <Pill key={i}>{p}</Pill>)}
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
  const phases = [
    t("roadmap.p1"), t("roadmap.p2"), t("roadmap.p3"), t("roadmap.p4"),
  ];

  return (
    <section id="roadmap" className="relative border-y border-white/10 bg-white/5 py-16 md:py-24">
      <Container>
        <SectionTitle kicker={t("roadmap.kicker")} title={t("roadmap.title")} caption={t("roadmap.caption")}/>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {phases.map((p, i) => (
            <Card key={i}>
              <div className="mb-2 text-xs uppercase tracking-wider text-white/60">{t("roadmap.phase")} {i + 1}</div>
              <div className="text-lg font-semibold">{p.title}</div>
              <p className="mt-2 text-sm text-white/70">{p.text}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
/* ======================= Компоненты для SVG рамок (Awwwards-style) ======================= */
const FrameCorners = ({ className = "" }) => {
  const gid = `g${Math.random().toString(36).slice(2)}`;
  return (
    <svg className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} fill="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#bef264" offset="0"></stop>
          <stop stopColor="#86efac" offset="1"></stop>
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="calc(100% - 16px)" height="calc(100% - 16px)" rx="18" stroke={`url(#${gid})`} strokeWidth="1.2" opacity=".22"/>
      <g>
        <path d="M12 40 L12 18 L34 18" stroke={`url(#${gid})`} strokeWidth="2.2" opacity=".55"/>
        <path d="Mcalc(100% - 12px) 40 Lcalc(100% - 12px) 18 Lcalc(100% - 34px) 18" stroke={`url(#${gid})`} strokeWidth="2.2" opacity=".55"/>
        <path d="M12 calc(100% - 40px) L12 calc(100% - 18px) L34 calc(100% - 18px)" stroke={`url(#${gid})`} strokeWidth="2.2" opacity=".55"/>
        <path d="Mcalc(100% - 12px) calc(100% - 40px) Lcalc(100% - 12px) calc(100% - 18px) Lcalc(100% - 34px) calc(100% - 18px)" stroke={`url(#${gid})`} strokeWidth="2.2" opacity=".55"/>
      </g>
    </svg>
  );
};

/* ======================= Комьюнити ======================= */
const Community = () => {
  const t = useT();

  return (
    <section id="community" className="relative py-16 md:py-24">
      <Container>
        <SectionTitle kicker={t("community.kicker")} title={t("community.title")} caption={t("community.caption")}/>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {t("community.actions").map((a, i) => (
            <Card key={i} className="relative overflow-hidden">
              <FrameCorners />
              <div className="relative z-10">
                <div className="mb-2 text-sm text-white/60">{a.caption}</div>
                <div className="flex items-center gap-2 text-lg font-semibold">{a.label} <ExternalLink className="h-4 w-4"/></div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

/* ======================= Buy ======================= */
const Buy = () => {
  const t = useT();
  const steps = [
    { t: "s1", p: "s1p", Icon: WalletIcon },
    { t: "s2", p: "s2p", Icon: Coins },
    { t: "s3", p: "s3p", Icon: Rocket },
  ];

  return (
    <section id="buy" className="relative py-20 md:py-28">
      <Container>
        <SectionTitle kicker={t("buy.kicker")} title={t("buy.title")} caption={t("buy.caption")}/>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(({ t: key, p, Icon }, i) => (
            <Card key={i}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-lime-300/20 text-lime-200">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-lg font-semibold">{t(`buy.${key}`)}</div>
              <p className="mt-2 text-sm text-white/70">{t(`buy.${p}`)}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a href="#" className="inline-flex items-center gap-2 rounded-full bg-lime-300/90 px-4 py-2 text-black hover:bg-lime-300">
            {t("buy.cta")} <ChevronRight className="h-4 w-4"/>
          </a>
        </div>

        <div className="mt-4 text-center text-xs text-white/60">{t("buy.note")}</div>
      </Container>
    </section>
  );
};

/* ======================= Иконка кошелька ======================= */
const WalletIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" {...props}>
    <path d="M3 7.5c0-.83.67-1.5 1.5-1.5H18a2 2 0 0 1 2 2v1H7a4 4 0 0 0-4 4v-5.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="3" y="8" width="18" height="11.5" rx="2.4" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="17.2" cy="13.8" r="1.2" fill="currentColor"/>
  </svg>
);

/* ======================= Подвал / подсказка языка ======================= */
const Footer = () => {
  const t = useT();
  return (
    <footer className="border-t border-white/10 py-10 text-center text-sm text-white/60">
      <Container>
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          {DICT[FALLBACK].trustStrip.map((x, i) => <Pill key={i}>{x}</Pill>)}
        </div>
        <div className="text-white/50">&copy; {new Date().getFullYear()} GARLIC. All rights reserved.</div>
      </Container>
    </footer>
  );
};
/* ======================= Главный компонент ======================= */
export default function GarlicAwwwardsSite() {
  const [lang, setLang] = useState(FALLBACK);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "g") {
        setLang((cur) => {
          const idx = LANGS.indexOf(cur);
          return LANGS[(idx + 1) % LANGS.length] || FALLBACK;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("garlic-lang");
    if (saved && LANGS.includes(saved)) setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("garlic-lang", lang);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, t: useT() }}>
      <main className="min-h-screen bg-black text-white">
        <Header />
        <Hero />
        <Approach />
        <Policy />
        <Tokenomics />
        <Roadmap />
        <Community />
        <Buy />
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
/* ======================= Доп. тексты футера (fallback) ======================= */
DICT.en.footer = {
  hint: "Switch language",
  hintAfter: "(press)"
};
DICT.hi.footer = {
  hint: "भाषा बदलें",
  hintAfter: "(दबाएँ)"
};
DICT.id = DICT.id || {};
DICT.id.footer = {
  hint: "Ganti bahasa",
  hintAfter: "(tekan)"
};
