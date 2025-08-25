// app/layout.jsx
import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import ScrollProgressBar from "./components/ScrollProgressBar";
import ClickRipple from "./components/ClickRipple";
import GarlicCursor from "./components/GarlicCursor";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"], variable: "--font-display" });

export const metadata = {
  title: "GARLIC — Meme Token",
  description: "Мем-токен с острым характером. Zero tax, locked liquidity.",
  openGraph: {
    title: "GARLIC — Meme Token",
    description: "Присоединяйся к чесночной армии 🧄",
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
  // положи любой из этих файлов, чтобы не ловить 404
  icons: { icon: ["/favicon.png", "/favicon.ico"] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="antialiased font-sans">
        <ScrollProgressBar />
        <ClickRipple />
        <GarlicCursor />
        {children}
      </body>
    </html>
  );
}
