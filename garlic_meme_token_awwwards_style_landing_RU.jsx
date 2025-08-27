"use client";

import React, { useEffect, useRef, useState, useContext, createContext } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  Twitter, Send, Rocket, Shield, Coins, Sparkles,
  ChevronRight, ExternalLink, BadgeCheck, Lock, Link as LinkIcon, Quote, Layers, GaugeCircle
} from "lucide-react";
import FloatingCloves from "./components/FloatingCloves";

/* ======================= I18N: словарь ======================= */
const LANGS = ["ru", "en", "hi", "id"];
const FALLBACK = "ru";

const DICT = {
  en: {
    nav: { approach: "Approach", policy: "Policy", tokenomics: "Tokenomics", roadmap: "Roadmap", buy: "Buy" },
    trustStrip: ["FAIR LAUNCH", "ZERO TAX", "LP LOCK", "RENOUNCED"],
    hero: {
      tags: ["discipline", "liquidity-first", "community"],
      titleTop: "GARLIC",
      titleBottom: "A meme with protocol discipline.",
      paragraph:
        "Rules are set in code: fair launch, 0% on trades, liquidity locked and ownership renounced. We remove noise so attention stays on idea and liquidity — the market does the rest.",
      buy: "Enter position",
      policy: "Protocol policy",
      badge: "rule-based • meme-driven",
      marquee: [
        "One start for everyone",
        "0% taxes",
        "Liquidity is locked",
        "Ownership renounced",
        "Culture drives adoption"
      ],
      keyHint: "— tokenomics"
    },
    approach: {
      kicker: "Approach",
      title: "Professional structure, meme presentation",
      caption: "We make the meme readable to capital: simple rules, low friction and a cultural symbol.",
      c1t: "Fair launch, no bending",
      c1p: "No private allocations. One entry horizon — one market temperature.",
      c2t: "Zero-tax, zero-friction",
      c2p: "No trade tax — focus on liquidity and spread, not on toggles.",
      c3t: "Culture › marketing",
      c3p: "A strong symbol 🧄, irony and order — community generates the content."
    },
    policy: {
      kicker: "Policy",
      title: "What is fixed by rules",
      caption: "We formalize expectations upfront. Clear settings → predictable token behavior.",
      c1t: "Trade tax — 0%",
      c1p: "Trading without tax. Friction is minimal; liquidity has priority.",
      c2t: "Liquidity is locked",
      c2p: "The pool is fixed during launch — design against rushed manipulation.",
      c3t: "Ownership — renounced",
      c3p: "No admin switches — code takes responsibility, not a person.",
      s1: "Contract",
      s1v: "Address is published on launch day",
      s2: "Architecture",
      s2v: "OpenZeppelin stack and standard patterns",
      s2v2: "No experimental upgrades or surprises.",
      s3: "Policy",
      pills: ["Fair Launch", "No Presale", "Anti-Rug policy"]
    },
    partners: { header: "As seen on / Partners" },
    signals: {
      kicker: "Signals",
      title: "Calm tone, serious intent",
      caption: "We like numbers and irony. Both coexist when rules are simple.",
      q1: "“Structure like a protocol, not a prank. Watching liquidity.”",
      q2: "“Garlic vibe explained in the language of capital — rare.”",
      q3: "“Zero-tax and renounced — a steady configuration. Market does the rest.”"
    },
    tokenomics: {
      kicker: "Tokenomics",
      title: "Transparent and predictable",
      caption: "Fewer parameters — less uncertainty. Configuration prioritizes liquidity.",
      supply: "Total supply",
      taxes: "Taxes",
      taxesVal: "0 %",
      liquidity: "Liquidity",
      liquidityVal: "Locked",
      dist: "Distribution",
      distList: ["60% — Liquidity", "20% — Community / airdrops / quests", "10% — Partnerships", "10% — DAO reserve (multisig)"],
      arch: "Architecture",
      archP: "Standard contracts, ownership renounced after launch, non-upgradeable.",
      pills: ["OpenZeppelin", "Non-upgradeable", "DAO reserve"]
    },
    roadmap: {
      kicker: "Roadmap",
      title: "From clean launch to culture",
      caption: "Flexible, focused on value for holders and creators.",
      phase: "Phase",
      p1: ["Website, socials, DEX launch", "LP lock, renounced", "Meme narrative & visual language"],
      p2: ["NFT “Cloves” for active members", "Artist collaborations", "Community activations & raffles"],
      p3: ["Garlic DAO (creator grants)", "Mini-games / integrations", "CEX listings (if possible)"]
    },
    buy: {
      kicker: "How to buy",
      title: "Three steps, no fuss",
      caption: "Wallet — base coin — swap. Then culture.",
      s1: "Wallet", s1p: "MetaMask / Rabby / OKX. Pick a network (ETH/BSC).",
      s2: "Base & gas", s2p: "Fund ETH/BNB for swap and network fees.",
      s3: "Swap to $GARLIC", s3p: "Uniswap / PancakeSwap. Address goes live on launch day.",
      cta: "Join the community",
      note: "* Not financial advice. Crypto is volatile."
    },
    community: {
      kicker: "Community",
      title: "Rational meme: a smile with discipline",
      caption: "Announcements, discussions, raffles, builds — join and bring your flavor."
    },
    footer: {
      disclaimer: "Meme project. No profit is guaranteed.",
      hint: "Press",
      hintAfter: "— tokenomics"
    }
  },
  ru: {
  nav: {
    approach: "Легенда",
    policy: "Политика",
    tokenomics: "Токеномика",
    roadmap: "Карта",
    buy: "Купить"
  },
  trustStrip: [
    "ЧЕСТНЫЙ СТАРТ",
    "0% НАЛОГ",
    "LP ЗАКРЫТ",
    "ПРАВА ОТКАЗАНЫ"
  ],
  hero: {
    tags: [
      "мем",
      "ликвидность",
      "комьюнити"
    ],
    titleTop: "GARLIC",
    titleBottom: "Мем‑монета, от которой вампиры бегут.",
    paragraph: "Запах 🧄 выгоняет ФУД, скам и ночной дрифт маркет‑вампиров. Честный запуск, 0% на сделки, LP под замком и отказ от прав. Мы шутим, но правила — жёсткие: внимание остаётся на идее и ликвидности — рынок делает остальное.",
    buy: "Купить $GARLIC",
    policy: "Политика протокола",
    badge: "мем‑драйв • правила в коде",
    marquee: [
      "Один старт для всех",
      "0% налоги",
      "Ликвидность под замком",
      "Права — отказ",
      "Культура двигает спрос"
    ],
    keyHint: "— токеномика"
  },
  approach: {
    kicker: "Легенда",
    title: "ГАРЛИК против вампиров рынка",
    caption: "Думай о нас как о чесночной гвоздике в кошельке: отпугивает вампиров (скамеров и ФУДеров), радует вкусовые рецепторы культуры.",
    c1t: "Честный старт — без укусов",
    c1p: "Без приватных аллокаций. Один горизонт входа — одна температура рынка.",
    c2t: "0% налог — меньше трения",
    c2p: "Никаких налогов на сделки — приоритет ликвидности и спреда, а не тумблеров.",
    c3t: "Маскот › мифология › контент",
    c3p: "Сильный символ 🧄, самоирония и порядок. Контент рождается сообществом."
  },
  policy: {
    kicker: "Политика",
    title: "Что зафиксировано кодом",
    caption: "Ожидания формализованы заранее. Чёткие настройки → предсказуемое поведение токена.",
    c1t: "Налог на сделки — 0%",
    c1p: "Торговля без налога. Минимальное трение; приоритет — ликвидность.",
    c2t: "Ликвидность — под замком",
    c2p: "Пул фиксируется на запуске — дизайн против поспешных манипуляций.",
    c3t: "Отказ от прав",
    c3p: "Никаких админ‑переключателей — ответственность на коде, а не на человеке.",
    s1: "Контракт",
    s1v: "Адрес публикуется в день запуска",
    s2: "Архитектура",
    s2v: "Стек OpenZeppelin и стандартные паттерны",
    s2v2: "Никаких экспериментальных апгрейдов и сюрпризов.",
    s3: "Политика",
    pills: [
      "Fair Launch",
      "No Presale",
      "Anti‑Rug"
    ]
  },
  signals: {
    kicker: "Сигналы",
    title: "Спокойный тон, острые намерения",
    caption: "Мы любим цифры и иронию. Они уживаются, когда правила просты.",
    q1: "«Структура как у протокола, а не розыгрыша. Смотрим на ликвидность.»",
    q2: "«Чесночный вайб, объяснённый на языке капитала — редкость.»",
    q3: "«Ноль налогов и отказ от прав — устойчивая конфигурация. Рынок сделает остальное.»"
  },
  tokenomics: {
    kicker: "Токеномика",
    title: "Прозрачно и предсказуемо",
    caption: "Меньше параметров — меньше неопределённости. Конфигурация ставит ликвидность на первое место.",
    supply: "Общий выпуск",
    taxes: "Налоги",
    taxesVal: "0 %",
    liquidity: "Ликвидность",
    liquidityVal: "Заблокирована",
    dist: "Распределение",
    distList: [
      "60% — Ликвидность",
      "20% — Комьюнити / airdrops / quests",
      "10% — Партнёрства",
      "10% — Резерв DAO (multisig)"
    ],
    arch: "Архитектура",
    archP: "Стандартные контракты, права будут отказаны после запуска, без апгрейдов.",
    pills: [
      "OpenZeppelin",
      "Без апгрейдов",
      "Резерв DAO"
    ]
  },
  roadmap: {
    kicker: "Карта",
    title: "От чистого запуска к кулинарной культуре",
    caption: "Гибко, с фокусом на ценность для холдеров и создателей.",
    phase: "Этап",
    p1: [
      "Сайт, соцсети, запуск на DEX",
      "LP‑замок, отказ от прав",
      "Мифология и визуальный язык"
    ],
    p2: [
      "NFT «Cloves» для активных участников",
      "Коллаборации с художниками",
      "Активации комьюнити и розыгрыши"
    ],
    p3: [
      "Garlic DAO (гранты создателям)",
      "Мини‑игры / интеграции",
      "Листинги CEX (если получится)"
    ]
  },
  buy: {
    kicker: "Как купить",
    title: "Три шага — без повара",
    caption: "Кошелёк — базовая монета — своп. Дальше — культура.",
    s1: "Кошелёк",
    s1p: "MetaMask / Rabby / OKX. Выбери сеть (ETH/BSC).",
    s2: "База и газ",
    s2p: "Пополни ETH/BNB для свопа и комиссий сети.",
    s3: "Своп в $GARLIC",
    s3p: "Uniswap / PancakeSwap. Адрес публикуется в день запуска.",
    cta: "Вступить в сообщество",
    note: "* Не финансовый совет. Крипта волатильна."
  },
  community: {
    kicker: "Сообщество",
    title: "Мем с характером: пахнем, но красиво",
    caption: "Анонсы, обсуждения, розыгрыши, билды — присоединяйся и привноси свой аромат."
  },
  partners: {
    header: "Как нас видят / Партнёры"
  },
  footer: {
    disclaimer: "Мем‑проект. Доход не гарантирован.",
    hint: "Нажми",
    hintAfter: "— токеномика"
  }
},
  hi: {
    nav: { approach: "दृष्टिकोण", policy: "नीतियाँ", tokenomics: "टोकनॉमिक्स", roadmap: "रोडमैप", buy: "खरीदें" },
    trustStrip: ["फेयर लॉन्च", "शून्य टैक्स", "एलपी लॉक", "ओनरशिप रीनाउंस्ड"],
    hero: {
      tags: ["अनुशासन", "लिक्विडिटी-फर्स्ट", "कम्युनिटी"],
      titleTop: "GARLIC",
      titleBottom: "मीम, पर प्रोटोकॉल का अनुशासन।",
      paragraph:
        "नियम कोड में तय हैं: फेयर लॉन्च, ट्रेड पर 0%, लॉक्ड लिक्विडिटी और रीनाउंस्ड ओनरशिप। शोर कम — फोकस आइडिया और लिक्विडिटी पर; बाकी बाजार करता है।",
      buy: "पोज़िशन लें",
      policy: "प्रोटोकॉल पॉलिसी",
      badge: "रूल-बेस्ड • मीम-ड्रिवन",
      marquee: [
        "सभी के लिए एक ही शुरुआत",
        "0% टैक्स",
        "लिक्विडिटी लॉक",
        "ओनरशिप रीनाउंस्ड",
        "संस्कृति से अपनापन"
      ],
      keyHint: "— टोकनॉमिक्स"
    },
    approach: {
      kicker: "दृष्टिकोण",
      title: "प्रोफेशनल स्ट्रक्चर, मीम-प्रेज़ेंटेशन",
      caption: "हम मीम को पूँजी की भाषा में पढ़ने योग्य बनाते हैं: सरल नियम, कम घर्षण और सांस्कृतिक प्रतीक।",
      c1t: "फेयर लॉन्च, बिना मोड़-तोड़",
      c1p: "कोई प्राइवेट अलोकेशन नहीं। एक ही प्रवेश क्षितिज — एक ही बाज़ार तापमान।",
      c2t: "ज़ीरो-टैक्स, ज़ीरो-फ्रिक्शन",
      c2p: "ट्रेड टैक्स नहीं — फोकस लिक्विडिटी और स्प्रेड पर, टॉगल्स पर नहीं।",
      c3t: "संस्कृति › मार्केटिंग",
      c3p: "मज़बूत प्रतीक 🧄, हल्की विडंबना और अनुशासन — कंटेंट कम्युनिटी से आता है।"
    },
    policy: {
      kicker: "नीतियाँ",
      title: "जो नियमों से तय है",
      caption: "उम्मीदें पहले से औपचारिक — स्पष्ट सेटिंग्स → पूर्वानुमेय व्यवहार।",
      c1t: "ट्रेड टैक्स — 0%",
      c1p: "ट्रेडिंग बिना टैक्स। घर्षण न्यूनतम; लिक्विडिटी प्राथमिकता।",
      c2t: "लिक्विडिटी लॉक",
      c2p: "लॉन्च फेज़ में पूल फिक्स — जल्दबाज़ी की हेराफेरी के विरुद्ध डिज़ाइन।",
      c3t: "ओनरशिप — रीनाउंस्ड",
      c3p: "एडमिन स्विच नहीं — व्यक्ति नहीं, कोड उत्तरदायी।",
      s1: "कॉन्ट्रैक्ट", s1v: "पता लॉन्च-डे पर प्रकाशित होगा",
      s2: "आर्किटेक्चर", s2v: "OpenZeppelin स्टैक, मानक पैटर्न", s2v2: "कोई प्रयोगात्मक अपग्रेड नहीं।",
      s3: "पॉलिसी", pills: ["Fair Launch", "No Presale", "Anti-Rug नीति"]
    },
    partners: { header: "As seen on / Partners" },
    signals: {
      kicker: "संकेत",
      title: "शांत टोन, गंभीर इरादा",
      caption: "हमें आँकड़े और ह्यूमर दोनों पसंद हैं — नियम सरल हों तो साथ रहते हैं।",
      q1: "“प्रोटोकॉल-जैसी संरचना, मज़ाक नहीं। लिक्विडिटी पर नज़र।”",
      q2: "“गार्लिक वाइब पूँजी की भाषा में — दुर्लभ।”",
      q3: "“ज़ीरो-टैक्स और रीनाउंस्ड — स्थिर कॉन्फ़िग। आगे बाज़ार।”"
    },
    tokenomics: {
      kicker: "टोकनॉमिक्स",
      title: "पारदर्शी और पूर्वानुमेय",
      caption: "कम पैरामीटर — कम अनिश्चितता। कॉन्फ़िग लिक्विडिटी-ओरिएंटेड है।",
      supply: "कुल सप्लाई",
      taxes: "टैक्स", taxesVal: "0 %",
      liquidity: "लिक्विडिटी", liquidityVal: "लॉक्ड",
      dist: "वितरण",
      distList: ["60% — लिक्विडिटी", "20% — कम्युनिटी / एयरड्रॉप / क्वेस्ट", "10% — पार्टनरशिप", "10% — DAO रिज़र्व (मल्टीसिग)"],
      arch: "आर्किटेक्चर",
      archP: "स्टैंडर्ड कॉन्ट्रैक्ट, लॉन्च के बाद रीनाउंस, नॉन-अपग्रेडेबल।",
      pills: ["OpenZeppelin", "Non-upgradeable", "DAO रिज़र्व"]
    },
    roadmap: {
      kicker: "रोडमैप",
      title: "क्लीन लॉन्च से संस्कृति तक",
      caption: "लचीला; होल्डर्स और क्रिएटर्स के मूल्य पर केंद्रित।",
      phase: "फेज़",
      p1: ["वेबसाइट, सोशल्स, DEX लॉन्च", "LP लॉक, रीनाउंस्ड", "मीम नैरेटिव और विज़ुअल लैंग्वेज"],
      p2: ["NFT “Cloves” — सक्रिय सदस्यों हेतु", "आर्टिस्ट कोलैबोरेशन", "कम्युनिटी एक्टिवेशन और रैफल"],
      p3: ["Garlic DAO (क्रिएटर ग्रांट)", "मिनी-गेम्स / इंटीग्रेशन", "CEX लिस्टिंग (संभव हो तो)"]
    },
    buy: {
      kicker: "कैसे खरीदें",
      title: "तीन स्टेप, बिना झंझट",
      caption: "वॉलेट — बेस कॉइन — स्वैप। फिर संस्कृति।",
      s1: "वॉलेट", s1p: "MetaMask / Rabby / OKX. नेटवर्क चुनें (ETH/BSC).",
      s2: "बेस और गैस", s2p: "स्वैप व फ़ीस हेतु ETH/BNB जोड़ें।",
      s3: "स्वैप टू $GARLIC", s3p: "Uniswap / PancakeSwap. पता लॉन्च-डे पर लाइव होगा।",
      cta: "कम्युनिटी से जुड़ें",
      note: "* यह वित्तीय सलाह नहीं है। क्रिप्टो अस्थिर है।"
    },
    community: {
      kicker: "कम्युनिटी",
      title: "तर्कसंगत मीम: मुस्कान और अनुशासन",
      caption: "अनाउंसमेंट, चर्चा, रैफल, बिल्ड — जुड़ें और अपना फ्लेवर लाएँ।"
    },
    footer: {
      disclaimer: "मीम-प्रोजेक्ट। लाभ की गारंटी नहीं।",
      hint: "दबाएँ",
      hintAfter: "— टोकनॉमिक्स"
    }
  },
  id: {
    nav: { approach: "Pendekatan", policy: "Kebijakan", tokenomics: "Tokenomik", roadmap: "Peta Jalan", buy: "Beli" },
    trustStrip: ["Peluncuran Adil", "Tanpa Pajak", "LP Terkunci", "Kepemilikan Dilepas"],
    hero: {
      tags: ["disiplin", "likuiditas-first", "komunitas"],
      titleTop: "GARLIC",
      titleBottom: "Meme dengan disiplin protokol.",
      paragraph:
        "Aturan ditetapkan di kode: peluncuran adil, 0% biaya transaksi, likuiditas terkunci, kepemilikan dilepas. Kami buang noise — fokus pada ide & likuiditas; pasar yang bergerak.",
      buy: "Masuk posisi",
      policy: "Kebijakan protokol",
      badge: "rule-based • meme-driven",
      marquee: [
        "Satu awal untuk semua",
        "0% pajak",
        "Likuiditas terkunci",
        "Kepemilikan dilepas",
        "Budaya mendorong adopsi"
      ],
      keyHint: "— tokenomik"
    },
    approach: {
      kicker: "Pendekatan",
      title: "Struktur profesional, presentasi meme",
      caption: "Meme yang mudah dibaca oleh modal: aturan sederhana, friksi rendah, simbol budaya.",
      c1t: "Peluncuran adil, tanpa akal-akal",
      c1p: "Tanpa alokasi privat. Satu horizon masuk — satu suhu pasar.",
      c2t: "Tanpa pajak, friksi rendah",
      c2p: "Tanpa pajak transaksi — fokus pada likuiditas & spread, bukan saklar.",
      c3t: "Budaya › pemasaran",
      c3p: "Simbol kuat 🧄, humor & ketertiban — konten lahir dari komunitas."
    },
    policy: {
      kicker: "Kebijakan",
      title: "Yang dikunci oleh aturan",
      caption: "Ekspektasi diformalkan sejak awal. Setelan jelas → perilaku token yang dapat diprediksi.",
      c1t: "Biaya transaksi — 0%",
      c1p: "Perdagangan tanpa pajak. Friksi minimal; likuiditas prioritas.",
      c2t: "Likuiditas terkunci",
      c2p: "Pool dikunci saat peluncuran — desain anti-manipulasi tergesa-gesa.",
      c3t: "Kepemilikan dilepas",
      c3p: "Tanpa saklar admin — kode yang bertanggung jawab, bukan orang.",
      s1: "Kontrak", s1v: "Alamat diumumkan saat peluncuran",
      s2: "Arsitektur", s2v: "Stack OpenZeppelin & pola standar", s2v2: "Tanpa upgrade eksperimental.",
      s3: "Kebijakan", pills: ["Fair Launch", "No Presale", "Kebijakan Anti-Rug"]
    },
    partners: { header: "As seen on / Partners" },
    signals: {
      kicker: "Sinyal",
      title: "Nada tenang, niat serius",
      caption: "Kami suka angka dan humor; keduanya rukun saat aturannya simpel.",
      q1: "“Strukturnya protokol, bukan lelucon. Pantau likuiditas.”",
      q2: "“Vibe garlic dijelaskan dalam bahasa modal — jarang.”",
      q3: "“Zero-tax & renounced — konfig stabil. Sisanya pasar.”"
    },
    tokenomics: {
      kicker: "Tokenomik",
      title: "Transparan & dapat diprediksi",
      caption: "Parameter lebih sedikit — ketidakpastian lebih kecil. Konfigurasi memprioritaskan likuiditas.",
      supply: "Total suplai",
      taxes: "Pajak", taxesVal: "0 %",
      liquidity: "Likuiditas", liquidityVal: "Terkunci",
      dist: "Distribusi",
      distList: ["60% — Likuiditas", "20% — Komunitas / airdrop / quest", "10% — Kemitraan", "10% — Cadangan DAO (multisig)"],
      arch: "Arsitektur",
      archP: "Kontrak standar, kepemilikan dilepas setelah peluncuran, non-upgradeable.",
      pills: ["OpenZeppelin", "Non-upgradeable", "Cadangan DAO"]
    },
    roadmap: {
      kicker: "Peta Jalan",
      title: "Dari peluncuran bersih ke budaya",
      caption: "Fleksibel, berfokus pada nilai bagi holder & kreator.",
      phase: "Fase",
      p1: ["Situs, sosial, peluncuran DEX", "LP terkunci, renounced", "Narasi meme & bahasa visual"],
      p2: ["NFT “Cloves” untuk yang aktif", "Kolaborasi artis", "Aktivasi komunitas & raffle"],
      p3: ["Garlic DAO (hibah kreator)", "Gim mini / integrasi", "Listing CEX (bila memungkinkan)"]
    },
    buy: {
      kicker: "Cara beli",
      title: "Tiga langkah, tanpa ribet",
      caption: "Wallet — koin dasar — swap. Lalu budaya.",
      s1: "Wallet", s1p: "MetaMask / Rabby / OKX. Pilih jaringan (ETH/BSC).",
      s2: "Dasar & gas", s2p: "Isi ETH/BNB untuk swap & biaya jaringan.",
      s3: "Swap ke $GARLIC", s3p: "Uniswap / PancakeSwap. Alamat live saat peluncuran.",
      cta: "Gabung komunitas",
      note: "* Bukan nasihat keuangan. Kripto volatil."
    },
    community: {
      kicker: "Komunitas",
      title: "Meme rasional: senyum dengan disiplin",
      caption: "Pengumuman, diskusi, raffle, build — gabung & bawa rasa kamu."
    },
    footer: {
      disclaimer: "Proyek meme. Tidak ada jaminan profit.",
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
