"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/i18n/context";
import AddPetModal from "@/components/AddPetModal";
import LostModeBanner from "@/components/LostModeBanner";
import {
  Plus,
  Wifi,
  HeartPulse,
  RotateCcw,
  BellRing,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Calendar,
  Package,
} from "lucide-react";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { t, locale, dir } = useTranslation();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [reorderSuccess, setReorderSuccess] = useState(false);

  useEffect(() => {
    fetchPets();
  }, [user]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pets?ownerId=${user?.id || "usr_amine_owner"}`);
      const data = await res.json();
      if (data.success) {
        setPets(data.pets);
      }
    } catch (e) {
      console.error("Failed to load pets", e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReorder = async () => {
    setReordering(true);
    try {
      const res = await fetch("/api/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id || "usr_amine_owner" }),
      });
      const data = await res.json();
      if (data.success) {
        setReorderSuccess(true);
        setTimeout(() => setReorderSuccess(false), 4000);
      }
    } catch (e) {
      console.error("Reorder failed", e);
    } finally {
      setReordering(false);
    }
  };

  // Collect all upcoming reminders across owner's pets
  const allReminders = pets.flatMap((p) =>
    (p.reminders || []).map((r: any) => ({ ...r, petName: p.name, petSpecies: p.species }))
  );

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {t("ownerApp.welcome")}, {user?.name?.split(" ")[0]} 👋
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Espace Propriétaire
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Gérez l'identité connectée, le carnet de santé et le réassort de vos compagnons.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t("ownerApp.addPet")}</span>
            </button>
          </div>
        </div>

        {/* Any Active Lost Pet Alert Banner */}
        {pets.some((p) => p.isLost) && (
          <div className="space-y-3">
            {pets
              .filter((p) => p.isLost)
              .map((p) => (
                <LostModeBanner
                  key={p.id}
                  petId={p.id}
                  petName={p.name}
                  isLost={p.isLost}
                  lostNotes={p.lostNotes}
                  tagToken={p.tag?.token}
                  onStatusChange={fetchPets}
                />
              ))}
          </div>
        )}

        {/* Highlight 1: Smart Reorder Engine Alert Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-500 text-stone-950 font-black">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                    Réassort de croquettes prévu bientôt
                  </h3>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    Smart Reorder
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                  Selon le rythme de consommation habituel de <strong>Luna</strong> (sac de 4kg entamé il y a 23 jours),
                  le stock sera épuisé dans environ 7 jours.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleQuickReorder}
                disabled={reordering}
                className="px-4 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                {reordering ? "Validation..." : reorderSuccess ? "✅ Commande renouvelée !" : "Recommander en 1 clic (349 MAD)"}
              </button>
              <Link
                href="/shop"
                className="px-3 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-white transition"
              >
                Boutique
              </Link>
            </div>
          </div>
        </div>

        {/* Highlight 2: Upcoming Reminders Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <BellRing className="w-4 h-4 text-emerald-800" />
              <span>{t("ownerApp.urgentReminders")}</span>
            </h2>
            <Link
              href="/app/reminders"
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Voir tous les rappels</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allReminders.slice(0, 3).map((rem, idx) => (
              <div
                key={rem.id || idx}
                className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {rem.petName} ({rem.petSpecies === "CAT" ? "Chat" : "Chien"})
                  </span>
                  <h4 className="font-bold text-xs text-stone-900 mt-1">{rem.title}</h4>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>Échéance : {new Date(rem.dueDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-1 rounded bg-stone-100 text-stone-600 shrink-0">
                  {rem.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight 3: Pets Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900">
              Vos compagnons ({pets.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-stone-400 text-xs">
              Chargement des profils animaux...
            </div>
          ) : pets.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border-2 border-dashed border-stone-200 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-emerald-700 mx-auto" />
              <h3 className="font-bold text-base text-stone-900">Ajoutez votre premier animal</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Créez une identité numérique infalsifiable, associez une médaille ZAYA NFC et planifiez les soins.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition"
              >
                Créer un profil animal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Top */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-stone-100 shadow-sm shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              pet.photoUrl ||
                              (pet.species === "CAT"
                                ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80"
                                : "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80")
                            }
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-base text-stone-900">{pet.name}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                              {pet.species === "CAT" ? "Chat" : "Chien"}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 font-medium">
                            {pet.breed || "Race non spécifiée"}
                          </p>
                        </div>
                      </div>

                      {pet.isLost ? (
                        <span className="px-2 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black animate-pulse">
                          🚨 PERDU
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          Sécurisé
                        </span>
                      )}
                    </div>

                    {/* Tag preview */}
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-stone-600">Médaille NFC :</span>
                      </div>
                      <span className="font-mono text-emerald-800 font-bold">
                        {pet.tag?.code || "Non associée"}
                      </span>
                    </div>

                    {/* Microchip */}
                    <div className="text-[11px] text-stone-500 flex items-center justify-between px-1">
                      <span>Puce électronique :</span>
                      <span className="font-mono text-stone-700 font-medium">
                        {pet.microchipNumber || "Non renseignée"}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="px-5 py-3.5 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
                    <Link
                      href={`/app/pets/${pet.id}`}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <span>Consulter le dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {pet.tag?.token && (
                      <Link
                        href={`/p/${pet.tag.token}`}
                        target="_blank"
                        className="text-[11px] font-semibold text-stone-500 hover:text-stone-800"
                      >
                        Tester scan public →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddPetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPetCreated={(newPet) => setPets([newPet, ...pets])}
      />
    </div>
  );
}
