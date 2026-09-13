"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useTranslation } from "@/i18n/context";
import { formatPrice } from "@/lib/country";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotalMAD, deliveryFeeMAD, totalMAD, itemCount } = useCart();
  const { t, locale } = useTranslation();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-100 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 text-center space-y-4 shadow-sm border border-stone-200">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">{t("shop.emptyCart")}</h2>
          <p className="text-xs text-stone-500">
            Découvrez nos croquettes premium, médailles connectées ZAYA et soins essentiels.
          </p>
          <Link
            href="/shop"
            className="inline-block px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
          >
            Découvrir la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continuer mes achats</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
          <ShoppingBag className="w-7 h-7 text-emerald-800" />
          <span>{t("shop.cartTitle")} ({itemCount})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.isRecurring}`}
                className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 ring-1 ring-stone-200/60 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-stone-900 line-clamp-1">
                        {item.name}
                      </h3>
                    </div>

                    {item.isRecurring ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                        <RotateCcw className="w-3 h-3" />
                        Abonnement tous les {item.intervalDays || 30} jours (-5%)
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-stone-500">
                        Achat unique
                      </span>
                    )}

                    <div className="font-black text-sm text-emerald-900 pt-0.5">
                      {formatPrice(item.priceMAD, locale)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center">
                  <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white shadow-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white shadow-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
            <h3 className="font-extrabold text-base text-stone-900">Récapitulatif</h3>

            <div className="space-y-2.5 text-xs text-stone-600 pb-3 border-b border-stone-100">
              <div className="flex justify-between">
                <span>{t("shop.subtotal")}</span>
                <span className="font-bold text-stone-900">{formatPrice(subtotalMAD, locale)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t("shop.deliveryFee")}</span>
                <span className="font-bold text-stone-900">
                  {deliveryFeeMAD === 0 ? (
                    <span className="text-emerald-700 uppercase font-black text-[10px]">
                      {t("shop.freeDelivery")}
                    </span>
                  ) : (
                    formatPrice(deliveryFeeMAD, locale)
                  )}
                </span>
              </div>
              {subtotalMAD < 450 && (
                <div className="text-[10px] text-stone-500 bg-stone-50 p-2 rounded-xl">
                  Plus que <strong>{formatPrice(450 - subtotalMAD, locale)}</strong> pour bénéficier de la livraison offerte au Maroc !
                </div>
              )}
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="font-black text-sm text-stone-900">{t("shop.total")}</span>
              <span className="font-black text-2xl text-emerald-900">
                {formatPrice(totalMAD, locale)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <span>{t("shop.checkoutBtn")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 text-[11px] text-stone-500 space-y-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Expédié sous 24h par Cathedis / Express Maroc</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Paiement à la livraison en espèces ou carte</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
