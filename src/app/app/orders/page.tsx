"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/country";
import {
  Package,
  RotateCcw,
  Truck,
  ArrowLeft,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?userId=${user?.id || "usr_amine_owner"}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error("Failed to load orders", e);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async () => {
    setReordering(true);
    setFeedback("");
    try {
      const res = await fetch("/api/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id || "usr_amine_owner" }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback("✅ Nouvelle commande renouvelée avec succès !");
        fetchOrders();
      } else {
        setFeedback(`❌ ${data.error}`);
      }
    } catch (e: any) {
      setFeedback(`❌ ${e.message}`);
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour au tableau de bord</span>
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-emerald-800" />
              <span>Historique de Commandes</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Suivi des livraisons partout au Maroc et réassort en 1 clic.
            </p>
          </div>

          <button
            onClick={handleReorder}
            disabled={reordering || orders.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${reordering ? "animate-spin" : ""}`} />
            <span>{reordering ? "Renouvellement..." : "Répéter ma dernière commande"}</span>
          </button>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-sm">
            {feedback}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">Chargement des commandes...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
            <Package className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="font-bold text-sm text-stone-900">Aucune commande enregistrée</h3>
            <p className="text-xs text-stone-500">
              Découvrez notre sélection de croquettes, antiparasitaires et médailles ZAYA.
            </p>
            <Link
              href="/shop"
              className="inline-block px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
            >
              Visiter la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-stone-900">
                        {ord.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ord.deliveryStatus}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500">
                      Passée le {new Date(ord.createdAt).toLocaleDateString("fr-FR")} • Paiement : {ord.paymentMethod}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-semibold text-stone-500">Total payé</div>
                    <div className="font-extrabold text-base text-stone-900">
                      {formatPrice(ord.totalMAD)}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {(ord.items || []).map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-1 text-stone-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-900">{item.quantity}x</span>
                        <span>{item.product?.nameFr || "Produit ZAYA"}</span>
                      </div>
                      <span className="font-semibold text-stone-900">
                        {formatPrice(item.totalPriceMAD)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping info */}
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>
                      Livraison à : <strong>{ord.deliveryAddress}, {ord.city}</strong> (Tél: {ord.phone})
                    </span>
                  </div>

                  {ord.trackingNumber && (
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/60 px-2.5 py-1 rounded-lg">
                      Suivi : {ord.trackingNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
