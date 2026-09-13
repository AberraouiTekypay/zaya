"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { BellRing, Calendar, CheckCircle2, Plus, ArrowLeft, Filter } from "lucide-react";

export default function RemindersPage() {
  const { user } = useAuth();
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

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
      console.error("Failed to load reminders", e);
    } finally {
      setLoading(false);
    }
  };

  const allReminders = pets.flatMap((p) =>
    (p.reminders || []).map((r: any) => ({
      ...r,
      petId: p.id,
      petName: p.name,
      petSpecies: p.species,
      petPhoto: p.photoUrl,
    }))
  );

  const filteredReminders =
    selectedPetId === "all"
      ? allReminders
      : allReminders.filter((r) => r.petId === selectedPetId);

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
              <BellRing className="w-6 h-6 text-emerald-800" />
              <span>Rappels de Soins & Traitements</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Synchronisation des vaccins, vermifuges, antiparasitaires et réassorts de nourriture.
            </p>
          </div>

          {/* Pet filter selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 shadow-sm focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">Tous mes animaux</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species === "CAT" ? "Chat" : "Chien"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">Chargement des rappels...</div>
        ) : filteredReminders.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-stone-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
            <h3 className="font-bold text-sm text-stone-900">Aucun rappel en attente</h3>
            <p className="text-xs text-stone-500">
              Tous les soins de vos animaux sont à jour !
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReminders.map((rem) => {
              const isVaccine = rem.type === "VACCINATION";
              const isFood = rem.type === "FOOD_REORDER";

              return (
                <div
                  key={rem.id}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-stone-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          rem.petPhoto ||
                          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80"
                        }
                        alt={rem.petName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {rem.petName}
                        </span>
                        <h4 className="font-bold text-sm text-stone-900">{rem.title}</h4>
                      </div>
                      <div className="text-xs text-stone-500 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          Échéance : <strong>{new Date(rem.dueDate).toLocaleDateString("fr-FR")}</strong>
                        </span>
                        {rem.recurrence !== "NONE" && <span>• Répétition : {rem.recurrence}</span>}
                      </div>
                      {rem.notes && <p className="text-xs text-stone-600 mt-1">{rem.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isFood ? (
                      <Link
                        href="/shop"
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition"
                      >
                        Recommander
                      </Link>
                    ) : (
                      <Link
                        href={`/app/pets/${rem.petId}`}
                        className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition"
                      >
                        Voir carnet
                      </Link>
                    )}
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
