"use client";

import React, { useState } from "react";
import { X, Sparkles, Dog, Cat } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPetCreated: (pet: any) => void;
}

export default function AddPetModal({ isOpen, onClose, onPetCreated }: AddPetModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    species: "DOG",
    breed: "",
    birthDate: "",
    sex: "FEMALE",
    color: "",
    microchipNumber: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
    activateTag: true,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Le nom de l'animal est obligatoire.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ownerId: user?.id || "usr_amine_owner",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Erreur lors de la création");
      }

      onPetCreated(data.pet);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-stone-900">Ajouter un compagnon ZAYA</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Species Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Espèce</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, species: "DOG" })}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition ${
                  formData.species === "DOG"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                <Dog className="w-4 h-4" /> Chien
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, species: "CAT" })}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition ${
                  formData.species === "CAT"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                <Cat className="w-4 h-4" /> Chat
              </button>
            </div>
          </div>

          {/* Name & Breed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Nom de l'animal *</label>
              <input
                type="text"
                required
                placeholder="Ex: Rio, Simba, Nala..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Race</label>
              <input
                type="text"
                placeholder="Ex: Golden Retriever, Siamois..."
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Sex & Birth date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Sexe</label>
              <select
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="FEMALE">Femelle</option>
                <option value="MALE">Mâle</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date de naissance</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Microchip & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Numéro de puce électronique</label>
              <input
                type="text"
                placeholder="Ex: 604098100..."
                value={formData.microchipNumber}
                onChange={(e) => setFormData({ ...formData, microchipNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Couleur / Robe</label>
              <input
                type="text"
                placeholder="Ex: Fauve masqué noir"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Emergency contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Contact d'urgence (Nom)</label>
              <input
                type="text"
                placeholder="Ex: Proche, ami(e)..."
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Téléphone d'urgence</label>
              <input
                type="tel"
                placeholder="+212 6XX XX XX XX"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Tag Auto-provision */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-emerald-950">
                Générer et associer une Médaille ZAYA NFC + QR
              </div>
              <div className="text-[11px] text-emerald-800/80">
                Crée un jeton sécurisé et active l'URL publique de secours immédiatement.
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.activateTag}
              onChange={(e) => setFormData({ ...formData, activateTag: e.target.checked })}
              className="w-4 h-4 text-emerald-700 rounded border-stone-300 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
            >
              {loading ? "Création en cours..." : "Créer le profil animal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
