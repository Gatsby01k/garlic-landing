// app/layout.jsx
import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";

// Привязываем шрифты к CSS-переменным (работает в Server Components)
const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"], variable: "--font-display" });

export const metadata = {
  title: "GARLIC — Meme Token",
  description: "Мем‑токен с острым характером. Zero tax, locked liquidity.",
  // УБРАЛИ metadataBase, чтобы не падать на Invalid URL
  openGraph: {
    title: "GARLIC — Meme Token",
    description: "Присоединяйся к чесночной армии 🧄",
    // url тоже можно убрать или позже подставить реальный:
    // url: "https://garlic-landing.vercel.app",
    siteName: "GARLIC",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GARLIC — Meme Token",
    description: "🧄 + 🌶️ = 🚀",
    images: ["/og.jpg"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
