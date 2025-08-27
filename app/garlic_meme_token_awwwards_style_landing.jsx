"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback, useContext, createContext } from "react";
import Link from "next/link";
import Image from "next/image";

/* ======================= Настройки темы / утилы ======================= */
const cx = (...a) => a.filter(Boolean).join(" ");
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const lerp = (a, b, t) => a + (b - a) * t;
const isClient = typeof window !== "undefined";

/* ======================= Контекст: курсор / клики ======================= */
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

/* ======================= I18N: словарь ======================= */
const LANGS = ["ru", "en", "hi", "id"];
const FALLBACK = "ru";

const DICT = {
  ru: {
    nav: {
      approach: "Подход",
      policy: "Политика",
      tokenomics: "Токеномика",
      roadmap: "Дорожная карта",
      buy: "Купить",
    },
    trustStrip: ["FAIR LAUNCH", "ZERO TAX", "LP LOCK", "RENOUNCED"],
    hero: {
      tags: ["дисциплина", "ликвидность", "комьюнити"],
      titleTop: "GARLIC",
      titleBottom: "мем-монета с протокольной дисциплиной.",
      paragraph:
        "Наша легенда — чеснок против вампиров рынка: FUD, скама и паники. Правила заданы кодом: честный запуск (fair launch), 0% налог, ликвидность заблокирована, права на контракт отказаны. Смех лечит, дисциплина защищает.",
      ctaBuy: "Купить $GARLIC",
      ctaDocs: "Легенда и правила",
      note: "Никаких обещаний доходности. Только мемы и правила.",
    },
    legend: {
      kicker: "Легенда",
      title: "Чеснок против вампиров рынка",
      p1: "На крипторынке полно «вампиров»: FUD, скам-памперы, «ночные охотники» за ликвидностью. $GARLIC — мем, который пахнет победой: чем сильнее запах, тем дальше от нас нечисть.",
      p2: "Мем — это смех и культура, но правила — это защита. Поэтому у нас дисциплина протокола: никаких скрытых тумблеров, никаких налогов на трейды, ликвидность заперта, права — в никуда.",
      quotes: [
        "“Пахнет пробоем: солнечные свечи прожигают тьму.”",
        "“Вампиры рынка не любят чеснок. Хорошо, что мы — весь погреб.”",
        "“Zero-tax и renounced — меньше места для магии за кулисами.”",
      ],
    },
    policy: {
      kicker: "Политика",
      title: "Жёсткие правила, мягкий юмор",
      caption: "Ожидания формализованы заранее. Прозрачные настройки → предсказуемое поведение токена.",
      c1t: "Налог на трейды — 0%",
      c1p: "Торговля без комиссий контракта. Ваш PnL — это рынок, а не строка кода.",
      c2t: "LP — заблокирована",
      c2p: "Ликвидность заперта смарт-контрактом/локом. Вампиры не высосут пул ночью.",
      c3t: "Права — отказаны",
      c3p: "Контракт renounced: никто не подменит правила на лету.",
      c4t: "Честный запуск",
      c4p: "Никаких приватных аллокаций за сценой. Один старт для всех.",
      badge: "Никаких обещаний доходности. Только мем и дисциплина.",
    },
    signals: {
      kicker: "Сигналы",
      title: "Что делает мем живым",
      cards: [
        {
          t: "Маскот: головка чеснока",
          p: "Смешной, дружелюбный персонаж 🧄. Пакуем эмоции в образ, а не в обещания.",
        },
        {
          t: "Мем-язык",
          p: "Вампиры рынка, солнечные свечи, запах победы. Контент, который хочется форвардить.",
        },
        {
          t: "Визуальная система",
          p: "Светлая палитра, скевдо-стикеры, шуточные ярлыки. Узнаваемо в ленте.",
        },
        {
          t: "Формальная дисциплина",
          p: "Нормы, как у протоколов: минимум параметров, максимум предсказуемости.",
        },
      ],
    },
    tokenomics: {
      kicker: "Токеномика",
      title: "Прозрачно и предсказуемо",
      caption: "Меньше параметров — меньше неопределённости. Конфигурация озвучена заранее.",
      supply: "Общее предложение",
      supplyVal: "1 000 000 000 $GARLIC",
      items: [
        { t: "Налог на трейды", v: "0%" },
        { t: "Ликвидность", v: "LP lock" },
        { t: "Права контракта", v: "Renounced" },
        { t: "Запуск", v: "Fair launch" },
      ],
      foot: "Нет приватных сейлов. Нет «магических кнопок». Только мем и рынок.",
    },
    roadmap: {
      kicker: "Дорожная карта",
      title: "От запаха — к легенде",
      p1: ["Запуск сайта и соцсетей", "Листинг на DEX", "LP lock, renounced", "Нарратив «анти-вампир»"],
      p2: ["NFT «Cloves» для активных", "Коллабы с художниками", "Комьюнити-меметика"],
      p3: ["Интеграции с трекерами", "Тематические квесты", "IRL-атрибутика"],
      note: "Всё — без обещаний доходности. Развиваем культуру и поддерживаем правила.",
    },
    how: {
      kicker: "Как купить",
      title: "Пара кликов — и ты с нами",
      steps: [
        {
          t: "1) Подключи кошелёк",
          p: "MetaMask или любой совместимый. Проверь сеть и комиссию.",
        },
        {
          t: "2) Выбери пару и размер",
          p: "Подбери размер сделки, учти проскальзывание и волатильность.",
        },
        {
          t: "3) Подтверди обмен",
          p: "Жди подтверждения транзакции. Плати только газ — налогов нет.",
        },
        {
          t: "4) Безоп. чек-лист",
          p: "Не кликай подозрительное. Наши правила — публичны и проверяемы.",
        },
      ],
      cta: "Купить $GARLIC",
      dex: "DEX",
      docs: "Контракт",
    },
    community: {
      kicker: "Комьюнити",
      title: "Мем живёт в людях",
      p: "Чеснок — против вампиров рынка, но за людей. Присоединяйся к чату, кидай мемы, придумывай наклейки, разжигай «солнечные свечи».",
      tg: "Telegram",
      x: "X (Twitter)",
      gh: "GitHub",
    },
    footer: {
      p1: "Ни этот сайт, ни команда не дают финансовых советов. Мем — это культура. Правила — это дисциплина.",
      p2: "© $GARLIC. Ноль налогов. LP lock. Renounced. Fair launch.",
    },
    switcher: {
      title: "Язык",
      ru: "Русский",
      en: "English",
      hi: "हिंदी",
      id: "Indonesia",
    },
  },

  // англ. версия коротко, чтобы не ломать компонент, если кто-то переключит язык
  en: {
    nav: { approach: "Approach", policy: "Policy", tokenomics: "Tokenomics", roadmap: "Roadmap", buy: "Buy" },
    trustStrip: ["FAIR LAUNCH", "ZERO TAX", "LP LOCK", "RENOUNCED"],
    hero: {
      tags: ["discipline", "liquidity-first", "community"],
      titleTop: "GARLIC",
      titleBottom: "a meme with protocol discipline.",
      paragraph:
        "Legend: garlic vs market vampires — FUD, scams and panic. Rules in code: fair launch, 0% tax, LP locked, renounced ownership.",
      ctaBuy: "Buy $GARLIC",
      ctaDocs: "Legend & rules",
      note: "No promises of profit. Only memes and rules.",
    },
    legend: {
      kicker: "Legend",
      title: "Garlic vs market vampires",
      p1: "Vampires are FUD and scammers. Garlic smells like victory.",
      p2: "Memes for fun. Rules for safety. Zero tax, LP lock, renounced.",
      quotes: [
        "“Smells like breakout. Sun candles burn the night.”",
        "“Vampires hate garlic. We are the whole pantry.”",
        "“Zero-tax and renounced — fewer backstage switches.”",
      ],
    },
    policy: {
      kicker: "Policy",
      title: "Hard rules, soft humor",
      caption: "Clear settings → predictable token behavior.",
      c1t: "Trade tax — 0%",
      c1p: "No contract taxes. Your PnL is market only.",
      c2t: "LP locked",
      c2p: "No nightly draining. Vampires stay hungry.",
      c3t: "Renounced",
      c3p: "No one flips switches at night.",
      c4t: "Fair launch",
      c4p: "One start for everyone. No backroom allocations.",
      badge: "No profit promises.",
    },
    signals: {
      kicker: "Signals",
      title: "What keeps the meme alive",
      cards: [
        { t: "Mascot: garlic head", p: "Friendly, shareable 🧄." },
        { t: "Meme language", p: "Vampires, sun candles, smell of victory." },
        { t: "Visual system", p: "Sticker-like accents, bright palette." },
        { t: "Protocol discipline", p: "Minimal params, max predictability." },
      ],
    },
    tokenomics: {
      kicker: "Tokenomics",
      title: "Transparent & predictable",
      caption: "Fewer parameters — less uncertainty.",
      supply: "Total supply",
      supplyVal: "1,000,000,000 $GARLIC",
      items: [
        { t: "Trade tax", v: "0%" },
        { t: "Liquidity", v: "LP lock" },
        { t: "Ownership", v: "Renounced" },
        { t: "Launch", v: "Fair" },
      ],
      foot: "No private sales. No magic buttons.",
    },
    roadmap: {
      kicker: "Roadmap",
      title: "From smell to legend",
      p1: ["Website & socials", "DEX launch", "LP lock, renounced", "Narrative set"],
      p2: ["NFT “Cloves”", "Artist collabs", "Community memetics"],
      p3: ["Tracker integrations", "Quests", "IRL merch"],
      note: "No profit promises. Culture and rules.",
    },
    how: {
      kicker: "How to buy",
      title: "A couple clicks",
      steps: [
        { t: "1) Connect wallet", p: "MetaMask or any compatible." },
        { t: "2) Choose pair & size", p: "Mind slippage and volatility." },
        { t: "3) Confirm swap", p: "Pay gas only — no tax." },
        { t: "4) Safety checklist", p: "Rules are public and verifiable." },
      ],
      cta: "Buy $GARLIC",
      dex: "DEX",
      docs: "Contract",
    },
    community: {
      kicker: "Community",
      title: "Memes live in people",
      p: "Join chat, share memes, fuel the sun candles.",
      tg: "Telegram",
      x: "X (Twitter)",
      gh: "GitHub",
    },
    footer: {
      p1: "No financial advice. Memes are culture. Rules are discipline.",
      p2: "© $GARLIC. Zero tax. LP lock. Renounced. Fair launch.",
    },
    switcher: { title: "Language", ru: "Русский", en: "English", hi: "हिंदी", id: "Indonesia" },
  },

  hi: { nav: { approach: "दृष्टिकोण", policy: "नीति", tokenomics: "टोकनोमिक्स", roadmap: "रोडमैप", buy: "खरीदें" }, trustStrip: ["FAIR LAUNCH","ZERO TAX","LP LOCK","RENOUNCED"], hero: { tags: ["अनुशासन","लिक्विडिटी","समुदाय"], titleTop: "GARLIC", titleBottom: "मीम, पर प्रोटोकॉल अनुशासन के साथ.", paragraph: "लिजेंड: बाजार के वैम्पायरों के खिलाफ लहसुन. 0% टैक्स, LP लॉक, renounced.", ctaBuy: "खरीदें $GARLIC", ctaDocs: "नियम" }, switcher: { title: "भाषा", ru: "Русский", en: "English", hi: "हिंदी", id: "Indonesia" } },
  id: { nav: { approach: "Pendekatan", policy: "Kebijakan", tokenomics: "Tokenomik", roadmap: "Roadmap", buy: "Beli" }, trustStrip: ["FAIR LAUNCH","ZERO TAX","LP LOCK","RENOUNCED"], hero: { tags: ["disiplin","likuiditas","komunitas"], titleTop: "GARLIC", titleBottom: "meme dengan disiplin protokol.", paragraph: "Legenda: bawang putih vs vampir pasar. 0% pajak, LP terkunci, kepemilikan dilepas.", ctaBuy: "Beli $GARLIC", ctaDocs: "Aturan" }, switcher: { title: "Bahasa", ru: "Русский", en: "English", hi: "हिंदी", id: "Indonesia" } },
};

/* ==================== Транслятор ==================== */
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

/* ==================== Вёрсточные атомы ==================== */
function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-800/70 bg-neutral-900/60 px-3 py-1 text-xs tracking-wide">
      {children}
    </span>
  );
}

function SectionKicker({ children }) {
  return <div className="text-xs tracking-widest text-neutral-400 uppercase">{children}</div>;
}

function H2({ children }) {
  return <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">{children}</h2>;
}

function Card({ children, className }) {
  return (
    <div className={cx("rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-5 md:p-6", className)}>
      {children}
    </div>
  );
}

function Ribbon() {
  const t = useT();
  const items = t("trustStrip");
  return (
    <div className="relative isolate my-6 overflow-hidden">
      <div className="flex animate-[ribbon_30s_linear_infinite] whitespace-nowrap border-y border-neutral-800/80 py-2 text-xs tracking-[0.2em]">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-6 text-neutral-300">
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

/* ======================= Language Switcher (custom dropdown) ======================= */
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
    { code: "ru", label: t("switcher.ru") || "Русский" },
    { code: "en", label: t("switcher.en") || "English" },
    { code: "hi", label: t("switcher.hi") || "हिंदी" },
    { code: "id", label: t("switcher.id") || "Indonesia" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border border-neutral-800/70 bg-neutral-900/60 px-3 py-1.5 text-sm"
      >
        <span className="i-twemoji-earth-africa inline-block h-4 w-4" />
        <span>{t("switcher.title") || "Язык"}</span>
        <span className="text-neutral-400">({lang.toUpperCase()})</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-800/70 bg-neutral-900/95 p-1 shadow-xl backdrop-blur">
          {items.map((it) => (
            <button
              key={it.code}
              onClick={() => {
                setLang(it.code);
                if (isClient) localStorage.setItem("lang", it.code);
                setOpen(false);
              }}
              className={cx(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-800",
                lang === it.code && "bg-neutral-800"
              )}
            >
              <span>{it.label}</span>
              {lang === it.code && <span className="i-heroicons-check-16-solid" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ======================= Hero ======================= */
function Hero() {
  const t = useT();
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-start gap-6 md:gap-8">
          <div className="flex flex-wrap items-center gap-2">
            {t("hero.tags").map((x, i) => (
              <Tag key={i}>{x}</Tag>
            ))}
          </div>

          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              {t("hero.titleTop")}
              <span className="ml-3 inline-block align-bottom text-xl font-medium text-neutral-400">($GARLIC)</span>
            </h1>
            <p className="mt-3 text-xl md:text-2xl text-neutral-300">{t("hero.titleBottom")}</p>
          </div>

          <p className="max-w-3xl text-neutral-300">{t("hero.paragraph")}</p>

          <div className="flex flex-col sm:flex-row items-start gap-3">
            <a
              href="#buy"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-black transition hover:opacity-90"
            >
              <span className="i-heroicons-arrow-down-tray-16-solid" />
              {t("hero.ctaBuy")}
            </a>
            <a
              href="#policy"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-800/70 bg-neutral-900/60 px-4 py-2 transition hover:bg-neutral-800"
            >
              <span className="i-heroicons-command-line-16-solid" />
              {t("hero.ctaDocs")}
            </a>
          </div>

          <Ribbon />

          <p className="text-xs text-neutral-500">{t("hero.note")}</p>
        </div>
      </div>

      {/* Decor */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)] blur-2xl" />
      <div className="pointer-events-none absolute -left-10 top-40 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_center,rgba(190,255,190,0.06),transparent_60%)] blur-2xl" />
    </section>
  );
}

/* ======================= Legend ======================= */
function Legend() {
  const t = useT();
  const quotes = t("legend.quotes") || [];
  return (
    <section id="approach" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <SectionKicker>{t("legend.kicker")}</SectionKicker>
          <H2>{t("legend.title")}</H2>
          <p className="mt-4 text-neutral-300">{t("legend.p1")}</p>
          <p className="mt-3 text-neutral-300">{t("legend.p2")}</p>
        </div>
        <div className="grid gap-3">
          {quotes.map((q, i) => (
            <Card key={i} className="text-neutral-200">{q}</Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================= Policy ======================= */
function Policy() {
  const t = useT();
  const items = [
    { t: t("policy.c1t"), p: t("policy.c1p") },
    { t: t("policy.c2t"), p: t("policy.c2p") },
    { t: t("policy.c3t"), p: t("policy.c3p") },
    { t: t("policy.c4t"), p: t("policy.c4p") },
  ];
  return (
    <section id="policy" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="mb-8">
        <SectionKicker>{t("policy.kicker")}</SectionKicker>
        <H2>{t("policy.title")}</H2>
        <p className="mt-3 max-w-3xl text-neutral-300">{t("policy.caption")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it, i) => (
          <Card key={i}>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-neutral-800/80" />
              <div>
                <div className="font-semibold">{it.t}</div>
                <div className="mt-1 text-neutral-300">{it.p}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-4 text-xs text-neutral-500">{t("policy.badge")}</div>
    </section>
  );
}

/* ======================= Signals ======================= */
function Signals() {
  const t = useT();
  const cards = t("signals.cards") || [];
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="mb-8">
        <SectionKicker>{t("signals.kicker")}</SectionKicker>
        <H2>{t("signals.title")}</H2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c, i) => (
          <Card key={i}>
            <div className="font-semibold">{c.t}</div>
            <div className="mt-1 text-neutral-300">{c.p}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ======================= Tokenomics ======================= */
function Tokenomics() {
  const t = useT();
  const items = t("tokenomics.items") || [];
  return (
    <section id="tokenomics" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="mb-8">
        <SectionKicker>{t("tokenomics.kicker")}</SectionKicker>
        <H2>{t("tokenomics.title")}</H2>
        <p className="mt-3 text-neutral-300">{t("tokenomics.caption")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-neutral-400">{t("tokenomics.supply")}</div>
          <div className="mt-1 text-xl font-semibold">{t("tokenomics.supplyVal")}</div>
          <div className="mt-4 grid gap-2">
            {items.map((x, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-800/70 bg-neutral-900/50 px-3 py-2">
                <span>{x.t}</span>
                <span className="text-neutral-300">{x.v}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-neutral-500">{t("tokenomics.foot")}</div>
        </Card>
        <Card className="md:col-span-2">
          <div className="mb-3 text-sm text-neutral-400">Notes</div>
          <ul className="list-disc pl-5 text-neutral-300">
            <li>Нет скрытых налогов, скрытых тумблеров, «экстренных» функций.</li>
            <li>LP lock & renounced — проверяемо в эксплорере.</li>
            <li>Мы строим культуру, а не продаём обещания.</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}

/* ======================= Roadmap ======================= */
function Roadmap() {
  const t = useT();
  const p1 = t("roadmap.p1") || [];
  const p2 = t("roadmap.p2") || [];
  const p3 = t("roadmap.p3") || [];
  return (
    <section id="roadmap" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="mb-8">
        <SectionKicker>{t("roadmap.kicker")}</SectionKicker>
        <H2>{t("roadmap.title")}</H2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[p1, p2, p3].map((arr, i) => (
          <Card key={i}>
            <ol className="list-decimal pl-5 text-neutral-300">
              {arr.map((x, idx) => (
                <li key={idx} className="mb-2">{x}</li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
      <div className="mt-4 text-xs text-neutral-500">{t("roadmap.note")}</div>
    </section>
  );
}

/* ======================= How to buy ======================= */
function HowToBuy() {
  const t = useT();
  const steps = t("how.steps") || [];
  return (
    <section id="buy" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="mb-8">
        <SectionKicker>{t("how.kicker")}</SectionKicker>
        <H2>{t("how.title")}</H2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((s, i) => (
          <Card key={i}>
            <div className="font-semibold">{s.t}</div>
            <div className="mt-1 text-neutral-300">{s.p}</div>
          </Card>
        ))}
        <Card>
          <div className="mb-3 text-sm text-neutral-400">Links</div>
          <div className="flex flex-wrap gap-2">
            <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-black transition hover:opacity-90">
              <span className="i-heroicons-banknotes-16-solid" />
              {t("how.dex")}
            </a>
            <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-neutral-800/70 bg-neutral-900/60 px-4 py-2 transition hover:bg-neutral-800">
              <span className="i-heroicons-document-text-16-solid" />
              {t("how.docs")}
            </a>
          </div>
          <div className="mt-3 text-xs text-neutral-500">Проверь адрес контракта только в официальных источниках.</div>
        </Card>
        <Card>
          <div className="mb-3 text-sm text-neutral-400">Checklist</div>
          <ul className="list-disc pl-5 text-neutral-300">
            <li>Сверь домен и ссылки.</li>
            <li>Никому не показывай seed.</li>
            <li>Учитывай проскальзывание, газ, волатильность.</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}

/* ======================= Community ======================= */
function Community() {
  const t = useT();
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="mb-8">
        <SectionKicker>{t("community.kicker")}</SectionKicker>
        <H2>{t("community.title")}</H2>
      </div>
      <Card>
        <p className="text-neutral-300">{t("community.p")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-black transition hover:opacity-90">
            <span className="i-simple-icons-telegram" />
            {t("community.tg")}
          </a>
          <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-neutral-800/70 bg-neutral-900/60 px-4 py-2 transition hover:bg-neutral-800">
            <span className="i-simple-icons-x" />
            {t("community.x")}
          </a>
          <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-neutral-800/70 bg-neutral-900/60 px-4 py-2 transition hover:bg-neutral-800">
            <span className="i-simple-icons-github" />
            {t("community.gh")}
          </a>
        </div>
      </Card>
    </section>
  );
}

/* ======================= Footer ======================= */
function Footer() {
  const t = useT();
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-16">
      <div className="text-xs text-neutral-500">{t("footer.p1")}</div>
      <div className="mt-1 text-xs text-neutral-600">{t("footer.p2")}</div>
    </footer>
  );
}

/* ======================= Навбар ======================= */
function Navbar() {
  const t = useT();
  return (
    <div className="sticky top-0 z-40 border-b border-neutral-800/70 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-md bg-white" />
          <div className="text-sm font-bold tracking-tight">$GARLIC</div>
        </div>
        <nav className="hidden gap-6 md:flex">
          <a href="#approach" className="text-sm text-neutral-300 hover:text-white">
            {t("nav.approach")}
          </a>
          <a href="#policy" className="text-sm text-neutral-300 hover:text-white">
            {t("nav.policy")}
          </a>
          <a href="#tokenomics" className="text-sm text-neutral-300 hover:text-white">
            {t("nav.tokenomics")}
          </a>
          <a href="#roadmap" className="text-sm text-neutral-300 hover:text-white">
            {t("nav.roadmap")}
          </a>
          <a href="#buy" className="text-sm text-neutral-300 hover:text-white">
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
      </div>
    </div>
  );
}

/* ======================= Детект языка ======================= */
function useAutoLang() {
  const { setLang } = useContext(LangContext);
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (saved && LANGS.includes(saved)) setLang(saved);
    else {
      const b = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "";
      if (b.startsWith("ru")) setLang("ru");
      else if (b.startsWith("hi")) setLang("hi");
      else if (b.startsWith("id")) setLang("id");
      else setLang("ru");
    }
  }, [setLang]);
}

/* ======================= Корневой компонент ======================= */
export default function GarlicAwwwardsSite() {
  const [lang, setLangState] = useState(FALLBACK);
  const setLang = useCallback((l) => setLangState(LANGS.includes(l) ? l : FALLBACK), []);
  const langValue = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  useAutoLang();

  return (
    <CursorProvider>
      <LangContext.Provider value={langValue}>
        <div className="min-h-screen bg-neutral-950 text-white">
          <Navbar />
          <main>
            <Hero />
            <Legend />
            <Policy />
            <Signals />
            <Tokenomics />
            <Roadmap />
            <HowToBuy />
            <Community />
          </main>
          <Footer />
        </div>
      </LangContext.Provider>
    </CursorProvider>
  );
}
