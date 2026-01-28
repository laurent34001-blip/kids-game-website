import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Menu } from "@/components/menu";
import "./globals.css";
import "@/components/menu/style.css";
import "@/components/menu/styleguide.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Djogo - Les incroyables Ateliers Manuels Immersifs à Lyon",
  description: "Plateforme de réservation et back-office pour ateliers créatifs DJOGO.",
  icons: {
    icon: "/djogo_favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
          <header>
            <Menu />
          </header>
          {children}
          <footer className="border-t border-zinc-200 bg-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-zinc-500">
              <span>DJOGO · Système de réservation sur mesure</span>
              <span>RGPD · Stripe · Export CSV/Excel</span>
              <Link href="/cgv" className="w-fit text-zinc-500 hover:text-zinc-900">
                Conditions générales de vente
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
