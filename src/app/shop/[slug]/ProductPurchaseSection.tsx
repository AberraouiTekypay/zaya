"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/country";
import { ShoppingBag, Check, RotateCcw } from "lucide-react";

export default function ProductPurchaseSection({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [isRecurring, setIsRecurring] = useState(false);
  const [intervalDays, setIntervalDays] = useState(product.defaultIntervalDays || 30);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const regularPrice = product.priceMAD;
  const recurringPrice = Number((regularPrice * 0.95).toFixed(2));
  const activePrice = isRecurring ? recurringPrice : regularPrice;

  const handleAddToCart = () => {
    addToCart(product, quantity, isRecurring, intervalDays);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Price display */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-stone-900">
          {formatPrice(activePrice)}
        </span>
        {isRecurring && (
          <span className="text-sm font-semibold text-stone-400 line-through">
            {formatPrice(regularPrice)}
          </span>
        )}
        {product.compareAtPriceMAD && !isRecurring && (
          <span className="text-sm font-semibold text-stone-400 line-through">
            {formatPrice(product.compareAtPriceMAD)}
          </span>
        )}
      </div>

      {/* Purchase Mode Selector */}
      {product.isRecurringEligible && (
        <div className="space-y-2 pt-1">
          <div
            onClick={() => setIsRecurring(false)}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
              !isRecurring
                ? "border-emerald-800 bg-emerald-50/40 shadow-xs"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            <div>
              <div className="font-bold text-xs text-stone-900">Achat unique</div>
              <div className="text-[11px] text-stone-500">Expédié une seule fois</div>
            </div>
            <span className="font-bold text-xs text-stone-900">{formatPrice(regularPrice)}</span>
          </div>

          <div
            onClick={() => setIsRecurring(true)}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition space-y-3 ${
              isRecurring
                ? "border-amber-600 bg-amber-50/40 shadow-xs"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Abonnement récurrent (-5%)</span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Ne manquez jamais de croquettes • Annulable à tout moment
                </div>
              </div>
              <span className="font-bold text-xs text-amber-900">{formatPrice(recurringPrice)}</span>
            </div>

            {isRecurring && (
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
                <span className="text-stone-700 font-semibold">Fréquence de livraison :</span>
                <select
                  value={intervalDays}
                  onChange={(e) => setIntervalDays(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white font-bold text-xs text-stone-900 focus:ring-2 focus:ring-amber-500"
                >
                  <option value={14}>Toutes les 2 semaines (14j)</option>
                  <option value={21}>Toutes les 3 semaines (21j)</option>
                  <option value={30}>Tous les mois (30 jours)</option>
                  <option value={60}>Tous les 2 mois (60 jours)</option>
                  <option value={90}>Tous les 3 mois (90 jours)</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quantity & CTA */}
      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-lg bg-white shadow-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center text-sm"
          >
            -
          </button>
          <span className="w-10 text-center font-bold text-xs text-stone-900">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-lg bg-white shadow-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center text-sm"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md ${
            added
              ? "bg-emerald-700 text-white"
              : isRecurring
              ? "bg-amber-600 hover:bg-amber-500 text-white"
              : "bg-emerald-800 hover:bg-emerald-700 text-white"
          }`}
        >
          {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          <span>
            {added
              ? "Ajouté à votre panier !"
              : isRecurring
              ? `Activer l'abonnement (${formatPrice(activePrice * quantity)})`
              : `Ajouter au panier (${formatPrice(activePrice * quantity)})`}
          </span>
        </button>
      </div>
    </div>
  );
}
