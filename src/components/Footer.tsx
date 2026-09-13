"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/i18n/context";
import { ShieldCheck, MapPin, Phone, MessageSquare, Heart, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl">
                Z
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                ZAYA
              </span>
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 pt-2">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Maroc (Casablanca, Rabat, Marrakech)
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Données Sécurisées
              </span>
            </div>
            <div className="pt-2">
              <a
                href="https://wa.me/212661123456"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/50 text-emerald-300 text-xs font-semibold transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Support WhatsApp Officiel Maroc (+212)
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Plateforme
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/app" className="hover:text-emerald-400 transition">
                  {t("common.myPets")}
                </Link>
              </li>
              <li>
                <Link href="/p/luna_sec_7891" className="hover:text-emerald-400 transition flex items-center gap-1">
                  Démo Médaille NFC <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/p/max_lost_demo_9921" className="hover:text-amber-400 transition flex items-center gap-1 text-amber-300 font-medium">
                  🚨 Démo Mode Perdu <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-emerald-400 transition">
                  {t("common.shop")} & Croquettes
                </Link>
              </li>
              <li>
                <Link href="/app/subscriptions" className="hover:text-emerald-400 transition">
                  Abonnements Récurrents
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners & Ecosystem */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Partenaires
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/vet" className="hover:text-emerald-400 transition flex items-center gap-1">
                  {t("common.forVets")}
                </Link>
              </li>
              <li>
                <Link href="/merchant" className="hover:text-emerald-400 transition flex items-center gap-1">
                  {t("common.forMerchants")}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition">
                  Portail Administration
                </Link>
              </li>
              <li>
                <span className="text-stone-400">Cliniques à Casablanca & Rabat</span>
              </li>
            </ul>
          </div>

          {/* Languages & Guarantee */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Langues & Marché
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <button
                onClick={() => setLocale("fr")}
                className={`text-left px-2.5 py-1.5 rounded transition ${
                  locale === "fr" ? "bg-emerald-900/60 text-emerald-300 font-semibold" : "text-stone-400 hover:text-white"
                }`}
              >
                Français (Maroc)
              </button>
              <button
                onClick={() => setLocale("ar")}
                className={`text-left px-2.5 py-1.5 rounded transition ${
                  locale === "ar" ? "bg-emerald-900/60 text-emerald-300 font-semibold" : "text-stone-400 hover:text-white"
                }`}
              >
                العربية (المغرب - RTL)
              </button>
              <button
                onClick={() => setLocale("en")}
                className={`text-left px-2.5 py-1.5 rounded transition ${
                  locale === "en" ? "bg-emerald-900/60 text-emerald-300 font-semibold" : "text-stone-400 hover:text-white"
                }`}
              >
                English (Global)
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>{t("footer.copyright")}</p>
          <div className="flex items-center gap-6">
            <span>Devise : Dirham Marocain (MAD)</span>
            <span>Casablanca • Rabat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
