"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/i18n/context";
import { formatPrice } from "@/lib/country";
import { useCart } from "@/lib/cart-context";
import {
  ShoppingBag,
  Filter,
  Star,
  RotateCcw,
  Sparkles,
  Check,
  Tag,
  ArrowRight,
} from "lucide-react";

export default function ShopPage() {
  const { t, locale } = useTranslation();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSpecies]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.set("categoryId", selectedCategory);
      if (selectedSpecies !== "ALL") params.set("targetSpecies", selectedSpecies);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        if (data.categories) setCategories(data.categories);
      }
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1, false);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Marketplace ZAYA • Livraison partout au Maroc</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {t("shop.title")}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            {t("shop.subtitle")}
          </p>
        </div>

        {/* Filters bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs font-semibold">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
                selectedCategory === "all"
                  ? "bg-emerald-800 text-white font-bold"
                  : "bg-stone-50 text-stone-700 hover:bg-stone-100"
              }`}
            >
              Tous les produits
            </button>
            <button
              onClick={() => setSelectedCategory("cat_alim")}
              className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
                selectedCategory === "cat_alim"
                  ? "bg-emerald-800 text-white font-bold"
                  : "bg-stone-50 text-stone-700 hover:bg-stone-100"
              }`}
            >
              Alimentation & Croquettes
            </button>
            <button
              onClick={() => setSelectedCategory("cat_sante")}
              className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
                selectedCategory === "cat_sante"
                  ? "bg-emerald-800 text-white font-bold"
                  : "bg-stone-50 text-stone-700 hover:bg-stone-100"
              }`}
            >
              Santé & Antiparasitaires
            </button>
            <button
              onClick={() => setSelectedCategory("cat_hygiene")}
              className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
                selectedCategory === "cat_hygiene"
                  ? "bg-emerald-800 text-white font-bold"
                  : "bg-stone-50 text-stone-700 hover:bg-stone-100"
              }`}
            >
              Hygiène & Litières
            </button>
            <button
              onClick={() => setSelectedCategory("cat_accessoires")}
              className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
                selectedCategory === "cat_accessoires"
                  ? "bg-emerald-800 text-white font-bold"
                  : "bg-stone-50 text-stone-700 hover:bg-stone-100"
              }`}
            >
              Médailles ZAYA & Accessoires
            </button>
          </div>

          {/* Species Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-stone-500 font-semibold">Espèce :</span>
            <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-semibold">
              <button
                onClick={() => setSelectedSpecies("ALL")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedSpecies === "ALL" ? "bg-white shadow-sm text-stone-900 font-bold" : "text-stone-600"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setSelectedSpecies("DOG")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedSpecies === "DOG" ? "bg-white shadow-sm text-stone-900 font-bold" : "text-stone-600"
                }`}
              >
                Chiens
              </button>
              <button
                onClick={() => setSelectedSpecies("CAT")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedSpecies === "CAT" ? "bg-white shadow-sm text-stone-900 font-bold" : "text-stone-600"
                }`}
              >
                Chats
              </button>
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        {loading ? (
          <div className="p-16 text-center text-xs text-stone-500">Chargement des produits...</div>
        ) : products.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white text-center text-stone-500 text-xs">
            Aucun produit ne correspond à ces critères.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((prod) => {
              const isAdded = addedId === prod.id;

              return (
                <div
                  key={prod.id}
                  className="rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
                >
                  <Link href={`/shop/${prod.slug}`} className="block p-5 space-y-4">
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prod.imageUrl}
                        alt={prod.nameFr}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {prod.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-emerald-800 text-white text-[10px] font-bold shadow-sm">
                          {prod.badge}
                        </span>
                      )}
                      {prod.isRecurringEligible && (
                        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-amber-500/90 text-stone-950 text-[10px] font-black backdrop-blur-xs flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" />
                          -5% en abonnement
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span>{prod.category?.nameFr || "Animalerie"}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{prod.rating || 4.9}</span>
                          <span className="text-stone-400">({prod.reviewsCount || 30})</span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-sm text-stone-900 line-clamp-2 leading-snug">
                        {prod.nameFr}
                      </h3>

                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {prod.descriptionFr}
                      </p>
                    </div>
                  </Link>

                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <div className="font-black text-lg text-stone-900">
                          {formatPrice(prod.priceMAD, locale)}
                        </div>
                        {prod.compareAtPriceMAD && (
                          <div className="text-[11px] text-stone-400 line-through">
                            {formatPrice(prod.compareAtPriceMAD, locale)}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAdd(prod, e)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isAdded
                            ? "bg-emerald-700 text-white"
                            : "bg-stone-900 hover:bg-stone-800 text-white"
                        }`}
                      >
                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                        <span>{isAdded ? "Ajouté !" : "Ajouter"}</span>
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
