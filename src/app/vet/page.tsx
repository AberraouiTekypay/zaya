"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import AddRecordModal from "@/components/AddRecordModal";
import {
  Stethoscope,
  HeartPulse,
  Wifi,
  Calendar,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  Phone,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function VetPortalPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPetForRecord, setSelectedPetForRecord] = useState<any>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [tagPetId, setTagPetId] = useState<string | null>(null);
  const [tagFeedback, setTagFeedback] = useState("");

  useEffect(() => {
    fetchVetDashboard();
  }, [user]);

  const fetchVetDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vet/dashboard?vetUserId=${user?.id || "usr_dr_bennani"}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (e) {
      console.error("Failed to load vet dashboard", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTag = async (pet: any) => {
    const defaultCode = `ZY-${pet.name.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`;
    try {
      const res = await fetch("/api/tags/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId: pet.id, tagCode: defaultCode }),
      });
      const resJson = await res.json();
      if (resJson.success) {
        setTagFeedback(`✅ Médaille ${resJson.tag.code} activée avec succès pour ${pet.name} !`);
        setTimeout(() => setTagFeedback(""), 4000);
        fetchVetDashboard();
      }
    } catch (e) {
      console.error("Failed to activate tag", e);
    }
  };

  const managedPets = data?.managedPets || [];
  const filteredPets = managedPets.filter((pet: any) => {
    const q = searchTerm.toLowerCase();
    return (
      pet.name.toLowerCase().includes(q) ||
      (pet.breed && pet.breed.toLowerCase().includes(q)) ||
      (pet.microchipNumber && pet.microchipNumber.toLowerCase().includes(q)) ||
      (pet.owner?.name && pet.owner.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-md">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Portail Praticien Vétérinaire
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Clinique Partenaire
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600">
                {data?.vet?.clinicName || "Clinique Vétérinaire d'Anfa (Casablanca)"} • Praticien référent ZAYA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs transition"
            >
              Basculer vers Espace Propriétaire
            </Link>
          </div>
        </div>

        {tagFeedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-950 font-semibold text-xs border border-emerald-300">
            {tagFeedback}
          </div>
        )}

        {/* 4 Quick Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>Patients suivis</span>
            </div>
            <div className="text-3xl font-black text-stone-900">{managedPets.length}</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Dossiers numériques actifs</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-amber-600" />
              <span>Vaccins à renouveler</span>
            </div>
            <div className="text-3xl font-black text-amber-900">3</div>
            <div className="text-[11px] text-stone-500 font-medium">Échéance dans les 30 jours</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Consultations du jour</span>
            </div>
            <div className="text-3xl font-black text-stone-900">4</div>
            <div className="text-[11px] text-stone-500 font-medium">Patients programmés</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-700" />
              <span>Médailles NFC liées</span>
            </div>
            <div className="text-3xl font-black text-emerald-900">{managedPets.filter((p: any) => p.tag).length}</div>
            <div className="text-[11px] text-stone-500 font-medium">Activées au comptoir</div>
          </div>
        </div>

        {/* Patients Table & Actions */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                Gestion des Patients & Carnets Vaccinaux
              </h2>
              <p className="text-xs text-stone-500">
                Recherchez un animal pour mettre à jour ses actes médicaux ou lui associer une médaille ZAYA.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom, puce, propriétaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-stone-400">Chargement des patients...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 text-stone-500 font-bold uppercase text-[10px]">
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Espèce / Race</th>
                    <th className="pb-3">Propriétaire</th>
                    <th className="pb-3">Puce / Médaille</th>
                    <th className="pb-3">Statut Médical</th>
                    <th className="pb-3 text-right">Actions Vétérinaire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredPets.map((pet: any) => (
                    <tr key={pet.id} className="hover:bg-stone-50/80 transition">
                      <td className="py-3.5 font-bold text-stone-900">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-stone-200 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                pet.photoUrl ||
                                "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80"
                              }
                              alt={pet.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{pet.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 text-stone-600">
                        <div>{pet.species === "CAT" ? "Chat" : "Chien"}</div>
                        <div className="text-[10px] text-stone-400">{pet.breed || "Standard"}</div>
                      </td>

                      <td className="py-3.5 text-stone-600">
                        <div className="font-semibold text-stone-800">{pet.owner?.name || "Client"}</div>
                        <div className="text-[10px] text-stone-400">{pet.owner?.phone}</div>
                      </td>

                      <td className="py-3.5 font-mono text-[11px]">
                        <div>{pet.microchipNumber || "Non pucé"}</div>
                        {pet.tag ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                            <Wifi className="w-3 h-3" /> {pet.tag.code}
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            Sans médaille
                          </span>
                        )}
                      </td>

                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" /> Suivi à jour
                        </span>
                      </td>

                      <td className="py-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPetForRecord(pet);
                            setIsRecordModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[11px] transition"
                        >
                          + Vaccin / Soin
                        </button>

                        {!pet.tag && (
                          <button
                            onClick={() => handleAssignTag(pet)}
                            className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-[11px] transition"
                          >
                            Activer tag
                          </button>
                        )}

                        <Link
                          href={`/app/pets/${pet.id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] transition inline-block"
                        >
                          Dossier
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedPetForRecord && (
        <AddRecordModal
          isOpen={isRecordModalOpen}
          onClose={() => {
            setIsRecordModalOpen(false);
            setSelectedPetForRecord(null);
          }}
          petId={selectedPetForRecord.id}
          petName={selectedPetForRecord.name}
          onRecordAdded={() => {
            fetchVetDashboard();
          }}
        />
      )}
    </div>
  );
}
