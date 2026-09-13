"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, DEMO_USERS } from "@/lib/auth-context";
import { formatPrice } from "@/lib/country";
import {
  SlidersHorizontal,
  Users,
  Wifi,
  AlertTriangle,
  Stethoscope,
  Store,
  ShoppingBag,
  DollarSign,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { switchUser } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/metrics");
      const json = await res.json();
      if (json.success) {
        setMetrics(json.metrics);
      }
    } catch (e) {
      console.error("Failed to load admin metrics", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold shadow-md">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Console Centrale d'Administration
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-xs font-bold">
                  Plateforme ZAYA
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600">
                Supervision globale de l'écosystème : animaux, médailles NFC, cliniques, commandes et sécurité.
              </p>
            </div>
          </div>
        </div>

        {/* 8 Platform KPIs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>Propriétaires</span>
            </div>
            <div className="text-2xl font-black text-stone-900">{metrics?.ownersCount || 2}</div>
            <div className="text-[11px] text-stone-400">Comptes validés</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Animaux enregistrés</span>
            </div>
            <div className="text-2xl font-black text-stone-900">{metrics?.petsCount || 3}</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Identités actives</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-700" />
              <span>Médailles NFC actives</span>
            </div>
            <div className="text-2xl font-black text-stone-900">{metrics?.activeTagsCount || 3}</div>
            <div className="text-[11px] text-stone-400">Tokens publics sécurisés</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Mode Perdu Actif</span>
            </div>
            <div className="text-2xl font-black text-amber-900">{metrics?.lostPetsCount || 1}</div>
            <div className="text-[11px] text-amber-700 font-semibold">En alerte de recherche</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
              <span>Cliniques Vétérinaires</span>
            </div>
            <div className="text-2xl font-black text-stone-900">{metrics?.vetsCount || 2}</div>
            <div className="text-[11px] text-stone-400">Casablanca & Rabat</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Animaleries & Marchands</span>
            </div>
            <div className="text-2xl font-black text-stone-900">{metrics?.merchantsCount || 1}</div>
            <div className="text-[11px] text-stone-400">Partenaires agréés</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
              <span>GMV / Ventes (MAD)</span>
            </div>
            <div className="text-2xl font-black text-emerald-900">
              {formatPrice(metrics?.gmvMAD || 453)}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">{metrics?.ordersCount || 1} commandes</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
              <span>Abonnements récurrents</span>
            </div>
            <div className="text-2xl font-black text-stone-900">
              {metrics?.activeSubscriptionsCount || 1}
            </div>
            <div className="text-[11px] text-stone-400">Livraisons 30 jours actives</div>
          </div>
        </div>

        {/* Persona Quick Switcher for Evaluation */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
          <h2 className="font-extrabold text-sm text-stone-900">
            Navigation Rapide & Test des Perspectives Utilisateurs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {DEMO_USERS.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{u.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-stone-200 text-stone-700">
                      {u.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    {u.city} • {u.clinicName || u.storeName || u.email}
                  </div>
                </div>

                <button
                  onClick={() => switchUser(u.id)}
                  className="w-full py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition"
                >
                  Basculer vers {u.name.split(" ")[0]}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Audit Logs Stream */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
          <h2 className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            <span>Journal de Sécurité & Traçabilité (Audit Logs)</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-500 font-bold uppercase text-[10px]">
                  <th className="pb-3">Horodatage</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Entité Cible</th>
                  <th className="pb-3">Détails Traçabilité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                {(metrics?.recentAuditLogs || []).map((log: any) => (
                  <tr key={log.id} className="hover:bg-stone-50 transition">
                    <td className="py-2.5 text-stone-500">
                      {new Date(log.createdAt).toLocaleTimeString("fr-FR")}
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 font-sans font-medium text-stone-700">{log.entity}</td>
                    <td className="py-2.5 text-stone-500 font-mono truncate max-w-md">
                      {log.details || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
