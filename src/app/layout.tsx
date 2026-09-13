import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/context";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZAYA — Tout ce dont votre animal a besoin, au même endroit | Pet-Care Maroc",
  description:
    "Plateforme marocaine de technologie pour animaux de compagnie : identité connectée NFC & QR, mode animal perdu, carnet de santé digital, rappels vétérinaires et boutique en ligne avec réassort automatique.",
  keywords: [
    "pet ID Maroc",
    "NFC pet tag",
    "médaille connectée chien chat Maroc",
    "carnet de santé animal digital",
    "rappel vaccin chien Casablanca",
    "animalerie en ligne Maroc",
    "croquettes livraison Maroc",
    "vétérinaire Casablanca Rabat",
  ],
  authors: [{ name: "ZAYA Technologies" }],
  openGraph: {
    title: "ZAYA — Everything your pet needs, in one place",
    description: "Identité connectée, santé préventive et e-commerce récurrent pour animaux au Maroc.",
    url: "https://zaya.ma",
    siteName: "ZAYA",
    locale: "fr_MA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-100 selection:text-emerald-900">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
