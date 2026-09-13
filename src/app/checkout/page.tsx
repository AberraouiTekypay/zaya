"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/i18n/context";
import { MOROCCO_CONFIG, formatPrice } from "@/lib/country";
import {
  CreditCard,
  Banknote,
  Truck,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  Lock,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotalMAD, deliveryFeeMAD, totalMAD, clearCart } = useCart();
  const { t, locale } = useTranslation();

  const [formData, setFormData] = useState({
    name: user?.name || "Amine Berraoui",
    phone: user?.phone || "+212 661 12 34 56",
    city: user?.city || "Casablanca",
    address: user?.address || "14 Rue du Souvenir, Maarif",
    notes: "",
    paymentMethod: "CASH_ON_DELIVERY",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6 text-center">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-stone-900">Votre panier est vide</h2>
          <Link
            href="/shop"
            className="inline-block px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
          >
            Découvrir la boutique
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address || !formData.phone) {
      setError("Adresse et numéro de téléphone requis.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderPayload = {
        userId: user?.id || "usr_amine_owner",
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPriceMAD: item.priceMAD,
          isRecurring: item.isRecurring,
          intervalDays: item.intervalDays,
        })),
        paymentMethod: formData.paymentMethod,
        deliveryAddress: formData.address,
        city: formData.city,
        phone: formData.phone,
        notes: formData.notes,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Échec de validation de commande");
      }

      clearCart();
      router.push("/app/orders?success=1");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour au panier</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Finalisation de votre commande
        </h1>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Address & Payment Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery address */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
              <h2 className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-800" />
                <span>Adresse de Livraison au Maroc</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Téléphone pour le livreur *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+212 6XX XX XX XX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Ville *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {MOROCCO_CONFIG.cities.map((c) => (
                      <option key={c.id} value={c.nameFr}>
                        {c.nameFr} ({c.nameAr})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Adresse & Quartier *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maarif, 14 Rue..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Instructions pour le livreur (optionnel)</label>
                <input
                  type="text"
                  placeholder="Étage, code d'immeuble, point de repère..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
              <h2 className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-800" />
                <span>Mode de Règlement</span>
              </h2>

              <div className="space-y-3">
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start justify-between cursor-pointer transition ${
                    formData.paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-emerald-800 bg-emerald-50/40"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === "CASH_ON_DELIVERY"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "CASH_ON_DELIVERY" })}
                      className="mt-0.5 text-emerald-800 focus:ring-emerald-600"
                    />
                    <div>
                      <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-emerald-700" />
                        Paiement à la livraison (Espèces)
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Réglez auprès du coursier à la réception de votre colis. Aucun paiement en ligne requis.
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                    Populaire au Maroc
                  </span>
                </label>

                <label
                  className={`p-4 rounded-2xl border-2 flex items-start justify-between cursor-pointer transition ${
                    formData.paymentMethod === "CMI_CARD"
                      ? "border-emerald-800 bg-emerald-50/40"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === "CMI_CARD"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "CMI_CARD" })}
                      className="mt-0.5 text-emerald-800 focus:ring-emerald-600"
                    />
                    <div>
                      <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-emerald-700" />
                        Carte bancaire marocaine (CMI 3D-Secure)
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Paiement sécurisé par carte nationale ou internationale.
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    3D Secure
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
            <h3 className="font-extrabold text-base text-stone-900">Votre Panier ({items.length})</h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.id}-${item.isRecurring}`} className="flex items-center justify-between text-xs py-1 border-b border-stone-100">
                  <div className="space-y-0.5 max-w-[200px]">
                    <div className="font-semibold text-stone-900 line-clamp-1">{item.name}</div>
                    <div className="text-[10px] text-stone-500">Qté: {item.quantity} {item.isRecurring ? "(Abonnement)" : ""}</div>
                  </div>
                  <span className="font-extrabold text-stone-900">{formatPrice(item.priceMAD * item.quantity, locale)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 text-xs text-stone-600 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-bold text-stone-900">{formatPrice(subtotalMAD, locale)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison (Maroc)</span>
                <span className="font-bold text-stone-900">
                  {deliveryFeeMAD === 0 ? "Gratuit" : formatPrice(deliveryFeeMAD, locale)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-stone-100">
                <span className="font-black text-sm text-stone-900">Total net</span>
                <span className="font-black text-2xl text-emerald-900">{formatPrice(totalMAD, locale)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? "Traitement de votre commande..." : `Confirmer la commande (${formatPrice(totalMAD, locale)})`}</span>
            </button>

            <div className="pt-2 text-[11px] text-stone-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Commande garantie avec numéro de suivi SMS/WhatsApp</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
