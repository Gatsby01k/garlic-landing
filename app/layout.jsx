// app/layout.jsx
import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";

// Подвязываем шрифты к CSS-переменным (работает на серверных компонентах)
const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"], variable: "--font-display" });

export const metadata = {
  title: "GARLIC — Meme Token",
  description: "Мем‑токен с острым характером. Zero tax, locked liquidity.",
  metadataBase: new URL("https://<твой-домен-или-vercel-url>"),
  openGraph: {
    title: "GARLIC — Meme Token",
    description: "Присоединяйся к чесночной армии 🧄",
    url: "https://<твой-домен-или-vercel-url>",
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
      {/* font-sans привяжем к --font-sans в globals.css */}
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
