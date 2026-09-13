"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, Locale } from "@/i18n/context";
import { useAuth, DEMO_USERS } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import {
  ShieldAlert,
  ShoppingBag,
  HeartPulse,
  Store,
  SlidersHorizontal,
  ChevronDown,
  Globe,
  Menu,
  X,
  UserCheck,
  Tag,
} from "lucide-react";

export default function Navbar() {
  const { t, locale, setLocale, dir } = useTranslation();
  const { user, role, switchUser } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("common.home") },
    { href: "/app", label: t("common.myPets") },
    { href: "/app/reminders", label: t("common.reminders") },
    { href: "/shop", label: t("common.shop") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-900/10 group-hover:bg-emerald-700 transition">
                Z
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-stone-900 leading-none">
                  ZAYA
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 tracking-wider uppercase">
                  Pet Care • Maroc
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "text-emerald-900 bg-emerald-50 font-semibold"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right actions: Demo persona switcher, Cart, Language, Portals */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Personas Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleMenuOpen(!roleMenuOpen);
                  setLangMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium text-stone-700 hover:bg-stone-100 transition"
                title="Changer de perspective utilisateur (Démo)"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline font-semibold">{user?.name?.split(" ")[0]}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                  {role}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {roleMenuOpen && (
                <div
                  className={`absolute ${dir === "rtl" ? "left-0" : "right-0"} mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2`}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-600 border-b border-stone-100">
                    {t("nav.demoRoles")}
                  </div>
                  {DEMO_USERS.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition ${
                        user?.id === u.id ? "bg-emerald-50/70 font-bold text-emerald-900" : "text-stone-700"
                      }`}
                    >
                      <div>
                        <div className="font-medium text-stone-900">{u.name}</div>
                        <div className="text-[10px] text-stone-600">{u.city} • {u.clinicName || u.storeName || u.email}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold">
                        {u.role}
                      </span>
                    </button>
                  ))}

                  <div className="border-t border-stone-100 mt-1 pt-1 px-3 py-1 flex items-center justify-between text-[11px] text-stone-600">
                    <Link href="/vet" className="hover:text-emerald-700 flex items-center gap-1 font-medium">
                      <HeartPulse className="w-3 h-3" /> Vétérinaire
                    </Link>
                    <Link href="/merchant" className="hover:text-emerald-700 flex items-center gap-1 font-medium">
                      <Store className="w-3 h-3" /> Boutique
                    </Link>
                    <Link href="/admin" className="hover:text-emerald-700 flex items-center gap-1 font-medium">
                      <SlidersHorizontal className="w-3 h-3" /> Admin
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher (FR / AR / EN) */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangMenuOpen(!langMenuOpen);
                  setRoleMenuOpen(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
              >
                <Globe className="w-3.5 h-3.5 text-stone-500" />
                <span>{locale.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {langMenuOpen && (
                <div
                  className={`absolute ${dir === "rtl" ? "left-0" : "right-0"} mt-2 w-36 bg-white rounded-xl shadow-xl border border-stone-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2`}
                >
                  <button
                    onClick={() => {
                      setLocale("fr");
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                      locale === "fr" ? "font-bold text-emerald-900 bg-emerald-50/60" : "text-stone-700"
                    }`}
                  >
                    <span>Français</span>
                    <span className="text-[10px] text-stone-600 font-normal">FR</span>
                  </button>
                  <button
                    onClick={() => {
                      setLocale("ar");
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                      locale === "ar" ? "font-bold text-emerald-900 bg-emerald-50/60" : "text-stone-700"
                    }`}
                  >
                    <span>العربية (RTL)</span>
                    <span className="text-[10px] text-stone-600 font-normal">AR</span>
                  </button>
                  <button
                    onClick={() => {
                      setLocale("en");
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                      locale === "en" ? "font-bold text-emerald-900 bg-emerald-50/60" : "text-stone-700"
                    }`}
                  >
                    <span>English</span>
                    <span className="text-[10px] text-stone-600 font-normal">EN</span>
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-stone-700 hover:text-emerald-900 hover:bg-emerald-50 transition"
              aria-label={t("common.cart")}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Primary Action CTA */}
            <Link
              href="/app"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{t("common.myPets")}</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 md:hidden hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-sm"
            >
              {t("common.myPets")}
            </Link>
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-stone-600 pt-2">
              <Link href="/vet" className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100">
                Vétérinaires
              </Link>
              <Link href="/merchant" className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100">
                Commerçants
              </Link>
              <Link href="/admin" className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100">
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
