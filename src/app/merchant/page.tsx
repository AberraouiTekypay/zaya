"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/country";
import {
  Store,
  DollarSign,
  PackageCheck,
  Clock,
  Plus,
  Truck,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
} from "lucide-react";

export default function MerchantPortalPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMerchantData();
  }, [user]);

  const fetchMerchantData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders?userId=usr_amine_owner"),
      ]);

      const prodData = await prodRes.json();
      const ordData = await ordRes.json();

      if (prodData.products) setProducts(prodData.products);
      if (ordData.orders) setOrders(ordData.orders);
    } catch (e) {
      console.error("Failed to load merchant data", e);
    } finally {
      setLoading(false);
    }
  };

  const totalGMV = orders.reduce((sum, o) => sum + o.totalMAD, 0);

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Portail Marchand & Animaleries
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  Atlas Pet Boutique Casablanca
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600">
                Gestion des ventes, des prix en Dirhams (MAD) et des expéditions récurrentes.
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Voir la boutique publique</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Financial & Operational KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
              <span>Chiffre d'affaires</span>
            </div>
            <div className="text-3xl font-black text-emerald-900">{formatPrice(totalGMV || 453)}</div>
            <div className="text-[11px] text-stone-500 font-medium">Revenus bruts générés</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Commandes totales</span>
            </div>
            <div className="text-3xl font-black text-stone-900">{orders.length || 1}</div>
            <div className="text-[11px] text-emerald-700 font-semibold">100% traitées à temps</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>À expédier</span>
            </div>
            <div className="text-3xl font-black text-amber-900">0</div>
            <div className="text-[11px] text-stone-500 font-medium">Colis en préparation</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-700" />
              <span>Articles actifs</span>
            </div>
            <div className="text-3xl font-black text-stone-900">{products.length}</div>
            <div className="text-[11px] text-stone-500 font-medium">Alimentation & Soins</div>
          </div>
        </div>

        {/* Products Management Strip */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-stone-900">Catalogue Produits & Tarification MAD</h2>
              <p className="text-xs text-stone-500">Mise à jour des stocks et des tarifs en temps réel.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-500 font-bold uppercase text-[10px]">
                  <th className="pb-3">Produit</th>
                  <th className="pb-3">Catégorie</th>
                  <th className="pb-3">Prix Vente</th>
                  <th className="pb-3">Abonnement Récurrent</th>
                  <th className="pb-3">Stock Dispo</th>
                  <th className="pb-3 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 font-bold text-stone-900 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.imageUrl} alt={p.nameFr} className="w-full h-full object-cover" />
                      </div>
                      <span className="line-clamp-1 max-w-xs">{p.nameFr}</span>
                    </td>
                    <td className="py-3 text-stone-600">{p.category?.nameFr}</td>
                    <td className="py-3 font-extrabold text-stone-900">{formatPrice(p.priceMAD)}</td>
                    <td className="py-3">
                      {p.isRecurringEligible ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                          Éligible (-5%)
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[10px]">Achat unique</span>
                      )}
                    </td>
                    <td className="py-3 font-mono font-bold text-stone-700">{p.stock} unités</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        En ligne
                      </span>
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
