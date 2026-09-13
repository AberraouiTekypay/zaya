"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import TagCard from "@/components/TagCard";
import LostModeBanner from "@/components/LostModeBanner";
import AddRecordModal from "@/components/AddRecordModal";
import {
  HeartPulse,
  Wifi,
  Calendar,
  ShieldCheck,
  Scale,
  FileText,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  ShoppingBag,
} from "lucide-react";

export default function PetProfilePage() {
  const params = useParams();
  const petId = params?.id as string;
  const { user } = useAuth();

  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tag" | "health" | "reminders" | "shop">("tag");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  useEffect(() => {
    if (petId) {
      loadPet();
    }
  }, [petId]);

  const loadPet = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pets/${petId}`);
      const data = await res.json();
      if (data.success) {
        setPet(data.pet);
      }
    } catch (e) {
      console.error("Failed to load pet", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-8 text-stone-500 text-xs">
        Chargement du dossier médical ZAYA...
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-stone-100 p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Animal non trouvé</h2>
        <Link href="/app" className="text-xs font-semibold text-emerald-800 underline">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à mes animaux</span>
        </Link>

        {/* Pet Header Overview Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden ring-4 ring-stone-100 shadow-md shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    pet.photoUrl ||
                    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80"
                  }
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    {pet.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700">
                    {pet.species === "CAT" ? "Chat" : "Chien"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 font-medium">
                  {pet.breed || "Race non spécifiée"} • {pet.sex === "FEMALE" ? "Femelle" : "Mâle"}
                  {pet.color ? ` • ${pet.color}` : ""}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-500 font-mono">
                  <span>Puce : {pet.microchipNumber || "Non renseignée"}</span>
                  {pet.tag && <span>• Tag : {pet.tag.code}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                onClick={() => setIsRecordModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un soin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lost Pet Mode Banner */}
        <LostModeBanner
          petId={pet.id}
          petName={pet.name}
          isLost={pet.isLost}
          lostNotes={pet.lostNotes}
          tagToken={pet.tag?.token}
          onStatusChange={loadPet}
        />

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 gap-2 sm:gap-4 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab("tag")}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "tag"
                ? "border-emerald-800 text-emerald-950 font-extrabold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>Médaille NFC & QR</span>
          </button>

          <button
            onClick={() => setActiveTab("health")}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "health"
                ? "border-emerald-800 text-emerald-950 font-extrabold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Carnet de Santé ({pet.healthRecords?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("reminders")}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "reminders"
                ? "border-emerald-800 text-emerald-950 font-extrabold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Rappels ({pet.reminders?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("shop")}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "shop"
                ? "border-emerald-800 text-emerald-950 font-extrabold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Boutique pour {pet.name}</span>
          </button>
        </div>

        {/* Tab 1: NFC Tag & QR */}
        {activeTab === "tag" && (
          <div className="space-y-6">
            {pet.tag ? (
              <TagCard tag={pet.tag} petName={pet.name} isLost={pet.isLost} />
            ) : (
              <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
                <Wifi className="w-8 h-8 text-stone-400 mx-auto" />
                <h3 className="font-bold text-sm text-stone-900">Aucune médaille ZAYA associée</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Associez votre médaille physique ou commandez-en une pour activer la protection connectée.
                </p>
                <Link
                  href="/shop/medaille-zaya-nfc-inox"
                  className="inline-block px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
                >
                  Commander la médaille ZAYA
                </Link>
              </div>
            )}

            {/* Emergency Contacts & Notes Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
              <h3 className="font-bold text-sm text-stone-900">Coordonnées d'Urgence</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="font-semibold text-stone-500">Contact d'urgence alternatif</div>
                  <div className="font-bold text-stone-900 mt-0.5">
                    {pet.emergencyContact || "Non renseigné"}
                  </div>
                  <div className="text-stone-600 mt-0.5">{pet.emergencyPhone || ""}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="font-semibold text-stone-500">Clinique Vétérinaire Référente</div>
                  <div className="font-bold text-stone-900 mt-0.5">
                    {pet.vet ? pet.vet.clinicName : "Clinique Vétérinaire d'Anfa (Casablanca)"}
                  </div>
                  <div className="text-stone-600 mt-0.5">
                    {pet.vet ? pet.vet.phone : "+212 522 36 40 00"}
                  </div>
                </div>
              </div>

              {pet.notes && (
                <div className="pt-2">
                  <div className="text-xs font-semibold text-stone-500 mb-1">Notes et particularités</div>
                  <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100 leading-relaxed">
                    {pet.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Health Records & Weight */}
        {activeTab === "health" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900">
                Historique des soins ({pet.healthRecords?.length || 0})
              </h3>
              <button
                onClick={() => setIsRecordModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouveau soin</span>
              </button>
            </div>

            {(!pet.healthRecords || pet.healthRecords.length === 0) ? (
              <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center text-xs text-stone-400">
                Aucun soin enregistré pour le moment.
              </div>
            ) : (
              <div className="space-y-3">
                {pet.healthRecords.map((rec: any) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {rec.type}
                        </span>
                        <h4 className="font-bold text-sm text-stone-900">{rec.title}</h4>
                      </div>
                      {rec.description && (
                        <p className="text-xs text-stone-600">{rec.description}</p>
                      )}
                      <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-3 pt-0.5">
                        <span>Fait le : {new Date(rec.dateAdministered).toLocaleDateString("fr-FR")}</span>
                        {rec.providerName && <span>• Par : {rec.providerName}</span>}
                        {rec.batchNumber && <span>• N° lot : {rec.batchNumber}</span>}
                      </div>
                    </div>

                    {rec.nextDueDate && (
                      <div className="text-right shrink-0 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <div className="text-[10px] uppercase font-bold text-stone-500">
                          Prochaine échéance
                        </div>
                        <div className="text-xs font-extrabold text-emerald-900">
                          {new Date(rec.nextDueDate).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Weights strip */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span>Courbe & Historique de Poids</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(pet.weights || []).map((w: any) => (
                  <div key={w.id} className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                    <div className="font-black text-lg text-stone-900">{w.weightKg} kg</div>
                    <div className="text-stone-500 text-[11px]">
                      {new Date(w.recordedAt).toLocaleDateString("fr-FR")}
                    </div>
                    {w.notes && <div className="text-[10px] text-stone-600 mt-1">{w.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reminders */}
        {activeTab === "reminders" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-900">
              Rappels programmés pour {pet.name} ({pet.reminders?.length || 0})
            </h3>
            <div className="space-y-3">
              {(pet.reminders || []).map((rem: any) => (
                <div
                  key={rem.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {rem.type}
                      </span>
                      <h4 className="font-bold text-xs text-stone-900">{rem.title}</h4>
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>Échéance : {new Date(rem.dueDate).toLocaleDateString("fr-FR")}</span>
                      {rem.recurrence !== "NONE" && <span>• Répétition : {rem.recurrence}</span>}
                    </div>
                    {rem.notes && <p className="text-[11px] text-stone-600 mt-1">{rem.notes}</p>}
                  </div>

                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Actif
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Shop for this Pet */}
        {activeTab === "shop" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Sélection d'alimentation & soins adaptée à {pet.name}
                </h3>
                <p className="text-xs text-stone-500">
                  Basée sur la race ({pet.breed || "Standard"}) et l'espèce ({pet.species}).
                </p>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>Boutique complète</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pet.species === "CAT" ? (
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
                  <div className="space-y-1 max-w-[220px]">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Idéal {pet.breed || "Chat"}
                    </span>
                    <h4 className="font-bold text-xs text-stone-900">
                      Royal Canin British Shorthair 4kg
                    </h4>
                    <div className="text-xs font-extrabold text-stone-900">349 MAD</div>
                  </div>
                  <Link
                    href="/shop/royal-canin-british-shorthair-4kg"
                    className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    Commander
                  </Link>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
                  <div className="space-y-1 max-w-[220px]">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Idéal Chien
                    </span>
                    <h4 className="font-bold text-xs text-stone-900">
                      Royal Canin Medium Adult 15kg
                    </h4>
                    <div className="text-xs font-extrabold text-stone-900">680 MAD</div>
                  </div>
                  <Link
                    href="/shop/royal-canin-medium-adult-15kg"
                    className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    Commander
                  </Link>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
                <div className="space-y-1 max-w-[220px]">
                  <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Antiparasitaire
                  </span>
                  <h4 className="font-bold text-xs text-stone-900">
                    {pet.species === "CAT" ? "Frontline Combo Chat (3 pipettes)" : "Bravecto Chien 10-20kg (1 comprimé)"}
                  </h4>
                  <div className="text-xs font-extrabold text-stone-900">
                    {pet.species === "CAT" ? "189 MAD" : "320 MAD"}
                  </div>
                </div>
                <Link
                  href={pet.species === "CAT" ? "/shop" : "/shop/bravecto-comprime-chien-10-20kg"}
                  className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Commander
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        petId={pet.id}
        petName={pet.name}
        onRecordAdded={loadPet}
      />
    </div>
  );
}
