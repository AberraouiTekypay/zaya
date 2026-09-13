"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/i18n/context";
import { formatPrice } from "@/lib/country";
import {
  Wifi,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  BellRing,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Store,
  ChevronDown,
  Sparkles,
  PhoneCall,
  MessageCircle,
} from "lucide-react";

export default function HomePage() {
  const { t, locale, dir } = useTranslation();
  const [simulatedLost, setSimulatedLost] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Comment fonctionne la médaille connectée ZAYA ?",
      a: "La médaille ZAYA intègre une puce NFC passive sans batterie ainsi qu'un QR code haute définition gravé au laser. N'importe quel smartphone moderne peut la scanner instantanément sans avoir besoin d'installer une application pour afficher les contacts d'urgence de l'animal.",
    },
    {
      q: "Le mode Animal Perdu est-il payant ?",
      a: "Non, la sécurité vitale de votre compagnon est notre priorité absolue. L'activation du Mode Perdu et les alertes de localisation pour retrouver votre animal sont gratuites pour tous les utilisateurs possédant une médaille ZAYA.",
    },
    {
      q: "Mes données personnelles sont-elles protégées ?",
      a: "Absolument. Votre adresse de domicile exacte et les documents médicaux confidentiels ne sont jamais divulgués sur la page publique de scan. Seuls votre nom et vos moyens de contact d'urgence (téléphone, WhatsApp) sont accessibles.",
    },
    {
      q: "Comment fonctionne le réassort automatique de croquettes ?",
      a: "En fonction de la race, du poids et de la date de votre dernière commande, ZAYA prédit quand vous allez manquer de croquettes et vous envoie un rappel pour renouveler en un clic, ou vous livre automatiquement à la fréquence choisie avec 5% de réduction.",
    },
    {
      q: "Je suis vétérinaire au Maroc, comment rejoindre le réseau ?",
      a: "Vous pouvez créer votre compte praticien gratuitement pour inscrire vos patients, enregistrer les vaccinations officielles et proposer les médailles ZAYA directement à vos clients dans votre clinique.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-stone-900 to-stone-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t("hero.badge")}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                {t("hero.headline")}
              </h1>

              <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t("hero.subtitle")}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/app"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-xl shadow-emerald-600/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>{t("hero.ctaPrimary")}</span>
                  <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                </Link>

                <Link
                  href="/shop/medaille-zaya-nfc-inox"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition flex items-center justify-center gap-2"
                >
                  <span>{t("hero.ctaSecondary")}</span>
                </Link>
              </div>

              {/* Social Proof & Metrics */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-stone-800/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">4 500+</div>
                  <div className="text-[11px] text-stone-400">Animaux protégés</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">85+</div>
                  <div className="text-[11px] text-stone-400">Cliniques au Maroc</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">98%</div>
                  <div className="text-[11px] text-stone-400">Ponctualité rappels</div>
                </div>
              </div>
            </div>

            {/* Right: Modern Tag & Pet Visual Representation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Physical Tag Mockup Card */}
                <div className="bg-stone-900/90 backdrop-blur-xl border border-stone-700/70 rounded-3xl p-6 shadow-2xl space-y-6 transform rotate-1 hover:rotate-0 transition duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-emerald-500/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80"
                          alt="Luna"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-lg text-white">Luna</h3>
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-800">
                            Chat • 3 ans
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">British Shorthair • Casablanca</p>
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <Wifi className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Connected tag status pill */}
                  <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="font-semibold text-stone-200">Médaille NFC Active</span>
                    </div>
                    <span className="font-mono text-emerald-400 text-[11px] font-bold">ZY-CAS-101</span>
                  </div>

                  {/* Smart Next Due Care Card */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      Prochains rappels synchronisés
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <HeartPulse className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="font-semibold text-white">Rappel Vaccin Annuel</div>
                          <div className="text-[10px] text-stone-400">Clinique d'Anfa (Dr. Bennani)</div>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded bg-emerald-900/60 text-emerald-300 font-bold text-[10px]">
                        Dans 12 jours
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <RotateCcw className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="font-semibold text-white">Royal Canin Shorthair</div>
                          <div className="text-[10px] text-stone-400">Sac presque vide (estimé)</div>
                        </div>
                      </div>
                      <Link
                        href="/shop/royal-canin-british-shorthair-4kg"
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-[10px] transition"
                      >
                        Recommander
                      </Link>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <Link
                      href="/p/luna_sec_7891"
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition"
                    >
                      <span>Voir la page publique que voit le trouveur</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="py-20 sm:py-28 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              {t("howItWorks.title")}
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {t("howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:border-emerald-200 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
                01
              </div>
              <h3 className="text-xl font-bold text-stone-900">{t("howItWorks.step1Title")}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{t("howItWorks.step1Desc")}</p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
                02
              </div>
              <h3 className="text-xl font-bold text-stone-900">{t("howItWorks.step2Title")}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{t("howItWorks.step2Desc")}</p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:border-emerald-200 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-lg">
                03
              </div>
              <h3 className="text-xl font-bold text-stone-900">{t("howItWorks.step3Title")}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{t("howItWorks.step3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOST PET MODE - PROMINENT FEATURE & LIVE SIMULATOR */}
      <section className="py-20 sm:py-28 bg-stone-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Fonctionnalité Majeure ZAYA</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {t("features.lostModeHighlight")}
              </h2>

              <p className="text-base text-stone-300 leading-relaxed">
                {t("features.lostModeDesc")}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-sm text-stone-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Appel & WhatsApp directs</strong> en 1 clic pour joindre le maître instantanément.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-stone-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Transmission de position</strong> : le trouveur peut vous envoyer le quartier et un mot rassurant sans aucun compte.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-stone-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zéro fuite de données privées</strong> : votre adresse physique et les dossiers médicaux restent 100% confidentiels.
                  </span>
                </div>
              </div>

              {/* Interactive simulator controls */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => setSimulatedLost(!simulatedLost)}
                  className={`px-5 py-3 rounded-xl font-bold text-xs shadow-lg transition flex items-center gap-2 ${
                    simulatedLost
                      ? "bg-stone-800 text-stone-300 hover:bg-stone-700"
                      : "bg-amber-500 text-stone-950 hover:bg-amber-400"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>{simulatedLost ? "Réinitialiser en Mode Normal" : "Simuler l'alerte 'Animal Perdu'"}</span>
                </button>

                <Link
                  href="/p/max_lost_demo_9921"
                  target="_blank"
                  className="text-xs text-stone-400 hover:text-white underline underline-offset-4 font-medium"
                >
                  Voir la vraie démo de Max à Rabat →
                </Link>
              </div>
            </div>

            {/* Right: Live Interactive Public Scan Simulator */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm rounded-[36px] bg-stone-900 border-4 border-stone-800 p-5 shadow-2xl relative overflow-hidden transition-all duration-300">
                {/* Mobile screen top notch */}
                <div className="w-32 h-4 bg-stone-950 rounded-full mx-auto mb-4" />

                {/* Status banner */}
                <div
                  className={`p-3.5 rounded-2xl mb-4 text-center transition-all ${
                    simulatedLost
                      ? "bg-amber-500 text-stone-950 font-black animate-pulse shadow-lg"
                      : "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                  }`}
                >
                  <div className="text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5">
                    {simulatedLost ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    {simulatedLost ? "🚨 CET ANIMAL EST PERDU" : "Cet animal est en sécurité"}
                  </div>
                </div>

                {/* Pet Photo & Identity */}
                <div className="text-center space-y-2">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-emerald-500/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&auto=format&fit=crop&q=80"
                      alt="Max"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-2xl font-black text-white">Max</h4>
                  <p className="text-xs text-stone-400">Berger Allemand • Rabat</p>
                </div>

                {simulatedLost && (
                  <div className="mt-3 p-3 rounded-xl bg-stone-950 border border-amber-500/30 text-[11px] text-amber-200 leading-snug">
                    « Perdu près de la forêt Hilton à Rabat. Répond à son nom. Merci de me contacter d'urgence ! »
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-5 space-y-2.5">
                  <a
                    href="tel:+212662987654"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Appeler Sarah (Propriétaire)
                  </a>

                  <a
                    href="https://wa.me/212662987654"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    Envoyer un WhatsApp avec ma position
                  </a>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800 text-center">
                  <span className="text-[10px] text-stone-400">
                    🔒 Adresse physique et dossier médical protégés
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HEALTH, VET RELATIONSHIP & SMART REMINDERS */}
      <section className="py-20 sm:py-28 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Illustrated Dashboard Component */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/80 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">Clinique Vétérinaire d'Anfa</h4>
                      <p className="text-xs text-stone-600">Dr. Youssef Bennani • Casablanca</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    Vétérinaire Agréé
                  </span>
                </div>

                {/* Vaccines List */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Carnet vaccinal certifié
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-stone-900">Vaccin Purevax RCP + Rage</div>
                      <div className="text-[10px] text-stone-600">Lot: FR-VACC-88291 • Administré le 25 Sept</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      À jour
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-stone-900">Vermifuge Milbemax Chat</div>
                      <div className="text-[10px] text-stone-600">Comprimé large spectre</div>
                    </div>
                    <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                      Rappel dans 1 mois
                    </span>
                  </div>
                </div>

                {/* Weight Evolution Preview */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-emerald-950">Suivi du poids idéal</span>
                    <span className="font-extrabold text-emerald-800">4.25 kg</span>
                  </div>
                  <div className="w-full bg-emerald-200/50 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-4/5 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                    <span>3.9 kg (an dernier)</span>
                    <span className="font-medium text-emerald-800">Poids de forme stable</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Explanatory Copy */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Santé Préventive ZAYA</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                {t("features.healthTitle")}
              </h2>

              <p className="text-base text-stone-600 leading-relaxed">
                {t("features.healthDesc")}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-stone-200">
                  <BellRing className="w-5 h-5 text-emerald-700 mb-2" />
                  <h4 className="font-bold text-xs text-stone-900">Rappels multi-canaux</h4>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Notifications in-app, e-mail et WhatsApp pour ne rien oublier.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200">
                  <Stethoscope className="w-5 h-5 text-emerald-700 mb-2" />
                  <h4 className="font-bold text-xs text-stone-900">Lien Vétérinaire Direct</h4>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Votre clinique met à jour les vaccins et documents en 1 clic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMMERCE & REORDER FLYWHEEL */}
      <section className="py-20 sm:py-28 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-2">
                Le Cercle Vertueux ZAYA
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                Boutique & Réassort Intelligent
              </h2>
              <p className="text-sm text-stone-600 max-w-xl mt-2">
                Du rappel de santé découle le besoin en produit. ZAYA vous permet de renouveler vos croquettes et soins sans friction.
              </p>
            </div>

            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0"
            >
              <span>Accéder à toute la boutique</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product 1: Official ZAYA Tag */}
            <div className="rounded-3xl bg-stone-50 border border-stone-200/80 p-5 hover:border-emerald-300 hover:shadow-lg transition duration-200 flex flex-col justify-between">
              <div>
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop&q=80"
                    alt="Médaille ZAYA NFC"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-800 text-white text-[10px] font-bold">
                    Essentiel
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 line-clamp-2">
                  Médaille ZAYA NFC + QR Code Intelligente (Inox Brossé)
                </h4>
                <p className="text-xs text-stone-600 mt-1">Étanche IP68, gravure laser inaltérable.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                <span className="font-extrabold text-base text-emerald-900">{formatPrice(79, locale)}</span>
                <Link
                  href="/shop/medaille-zaya-nfc-inox"
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  Découvrir
                </Link>
              </div>
            </div>

            {/* Product 2: Royal Canin British */}
            <div className="rounded-3xl bg-stone-50 border border-stone-200/80 p-5 hover:border-emerald-300 hover:shadow-lg transition duration-200 flex flex-col justify-between">
              <div>
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=80"
                    alt="Royal Canin Chat"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-bold">
                    -5% Abonnement
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 line-clamp-2">
                  Royal Canin British Shorthair Adult 4kg
                </h4>
                <p className="text-xs text-stone-600 mt-1">Alimentation féline ciblée pour musculature robuste.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                <span className="font-extrabold text-base text-emerald-900">{formatPrice(349, locale)}</span>
                <Link
                  href="/shop/royal-canin-british-shorthair-4kg"
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  Commander
                </Link>
              </div>
            </div>

            {/* Product 3: Royal Canin Dog */}
            <div className="rounded-3xl bg-stone-50 border border-stone-200/80 p-5 hover:border-emerald-300 hover:shadow-lg transition duration-200 flex flex-col justify-between">
              <div>
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500&auto=format&fit=crop&q=80"
                    alt="Royal Canin Medium Adult"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-stone-900 text-white text-[10px] font-bold">
                    Bestseller
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 line-clamp-2">
                  Royal Canin Medium Adult 15kg (Chien)
                </h4>
                <p className="text-xs text-stone-600 mt-1">Digestion optimale et défenses naturelles.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                <span className="font-extrabold text-base text-emerald-900">{formatPrice(680, locale)}</span>
                <Link
                  href="/shop/royal-canin-medium-adult-15kg"
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  Commander
                </Link>
              </div>
            </div>

            {/* Product 4: Bravecto */}
            <div className="rounded-3xl bg-stone-50 border border-stone-200/80 p-5 hover:border-emerald-300 hover:shadow-lg transition duration-200 flex flex-col justify-between">
              <div>
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=80"
                    alt="Bravecto Chien"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-800 text-white text-[10px] font-bold">
                    Protection 3 Mois
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 line-clamp-2">
                  Bravecto Chien (10-20 kg) - 1 Comprimé à Croquer
                </h4>
                <p className="text-xs text-stone-600 mt-1">12 semaines complètes contre puces et tiques.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                <span className="font-extrabold text-base text-emerald-900">{formatPrice(320, locale)}</span>
                <Link
                  href="/shop/bravecto-comprime-chien-10-20kg"
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  Commander
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOR PROFESSIONALS (VETS & MERCHANTS) */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Vets */}
            <div className="p-8 rounded-3xl bg-stone-850 border border-stone-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Pour les Vétérinaires</h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Modernisez votre pratique avec un espace clinique dédié : inscrivez les patients, mettez à jour les dossiers vaccinaux officiels, programmez des rappels automatiques et délivrez les médailles ZAYA sur place.
              </p>
              <div className="pt-2">
                <Link
                  href="/vet"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition"
                >
                  <span>Accéder au Portail Praticien</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* For Merchants */}
            <div className="p-8 rounded-3xl bg-stone-850 border border-stone-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Pour les Animaleries & Fournisseurs</h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Connectez vos produits à la demande récurrente des propriétaires d'animaux au Maroc. Gérez votre catalogue, vos prix en Dirhams et recevez des commandes régulières prédictives.
              </p>
              <div className="pt-2">
                <Link
                  href="/merchant"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-white text-xs font-bold transition"
                >
                  <span>Espace Vendeur ZAYA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-20 sm:py-24 bg-stone-50 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-800">FAQ</h2>
            <p className="text-3xl font-extrabold text-stone-900">Questions Fréquentes</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-stone-200 overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-sm text-stone-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform ${
                        isOpen ? "rotate-180 text-emerald-700" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-900 to-stone-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Offrez à votre compagnon la protection qu'il mérite.
          </h2>
          <p className="text-base text-emerald-100 max-w-xl mx-auto">
            Rejoignez des milliers de propriétaires de chiens et de chats au Maroc qui prennent soin de leur animal avec ZAYA.
          </p>
          <div className="pt-2">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-950 font-extrabold text-sm shadow-2xl transition"
            >
              <span>Créer le profil de votre animal maintenant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
