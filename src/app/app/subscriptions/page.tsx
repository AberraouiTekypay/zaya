"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/country";
import {
  RotateCcw,
  PauseCircle,
  PlayCircle,
  XCircle,
  Calendar,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/subscriptions?userId=${user?.id || "usr_amine_owner"}`);
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.subscriptions);
      }
    } catch (e) {
      console.error("Failed to load subscriptions", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(data.message || "Abonnement mis à jour.");
        setTimeout(() => setFeedback(""), 3000);
        fetchSubscriptions();
      }
    } catch (e) {
      console.error("Failed to update status", e);
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
              <RotateCcw className="w-6 h-6 text-emerald-800" />
              <span>Abonnements Récurrents & Réassort</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Livraisons programmées de croquettes et soins avec 5% de réduction continue.
            </p>
          </div>

          <Link
            href="/shop"
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
          >
            Souscrire un abonnement
          </Link>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-sm">
            {feedback}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">Chargement des abonnements...</div>
        ) : subscriptions.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
            <RotateCcw className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="font-bold text-sm text-stone-900">Aucun abonnement récurrent actif</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Évitez les ruptures de croquettes en activant la livraison mensuelle automatique.
            </p>
            <Link
              href="/shop"
              className="inline-block px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
            >
              Découvrir les produits éligibles
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => {
              const isActive = sub.status === "ACTIVE";

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 ring-2 ring-stone-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            sub.product?.imageUrl ||
                            "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&auto=format&fit=crop&q=80"
                          }
                          alt={sub.product?.nameFr}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            {isActive ? "Actif • Récurrent" : "En pause"}
                          </span>
                          <span className="text-xs font-semibold text-stone-500">
                            Pour {sub.pet?.name || "votre compagnon"}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-stone-900">
                          {sub.product?.nameFr || "Croquettes Premium"}
                        </h4>
                        <div className="text-xs text-stone-600 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>Fréquence : tous les {sub.intervalDays} jours</span>
                          <span>• Prochaine livraison : {new Date(sub.nextDeliveryDate).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-stone-500 font-semibold">Prix par livraison</div>
                      <div className="font-black text-lg text-emerald-900">
                        {formatPrice(sub.unitPriceMAD)}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Pause, Resume, Cancel */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-stone-500 text-[11px]">
                      Adresse : {sub.deliveryAddress}, {sub.city} (Tél: {sub.phone})
                    </span>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <button
                          onClick={() => handleUpdateStatus(sub.id, "PAUSED")}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold flex items-center gap-1.5 transition"
                        >
                          <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Mettre en pause</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(sub.id, "ACTIVE")}
                          className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 transition"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Réactiver</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleUpdateStatus(sub.id, "CANCELLED")}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-1.5 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Résilier</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
