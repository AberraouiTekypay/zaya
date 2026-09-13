import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data-service";
import ProductPurchaseSection from "./ProductPurchaseSection";
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Store,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour au catalogue</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Product Photo */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative w-full h-80 sm:h-[420px] rounded-3xl overflow-hidden bg-stone-100 ring-1 ring-stone-200/70 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.nameFr}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-700" />
                  <span>
                    Vendu & expédié par : <strong>{product.merchant?.storeName || "Boutique Officielle ZAYA"}</strong>
                  </span>
                </div>
                <span className="text-emerald-700 font-bold">Agréé</span>
              </div>
            </div>

            {/* Right: Product Purchase & Details */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {product.category?.nameFr || "Animalerie"}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating}</span>
                    <span className="text-stone-400">({product.reviewsCount} avis certifiés)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
                  {product.nameFr}
                </h1>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
                  {product.descriptionFr}
                </p>
              </div>

              {/* Purchase Options Client Component */}
              <ProductPurchaseSection product={product} />

              {/* Guarantees */}
              <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Livraison 24h/48h partout au Maroc</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Paiement à la livraison accepté</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Produit 100% authentique certifié</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
