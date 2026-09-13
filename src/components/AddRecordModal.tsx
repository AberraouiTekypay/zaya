"use client";

import React, { useState } from "react";
import { X, HeartPulse } from "lucide-react";

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: string;
  petName: string;
  onRecordAdded: (record: any) => void;
}

export default function AddRecordModal({
  isOpen,
  onClose,
  petId,
  petName,
  onRecordAdded,
}: AddRecordModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    type: "VACCINATION",
    title: "",
    description: "",
    dateAdministered: new Date().toISOString().split("T")[0],
    nextDueDate: "",
    providerName: "Clinique Vétérinaire d'Anfa (Casablanca)",
    batchNumber: "",
    createReminderAuto: true,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      setError("L'intitulé du soin ou vaccin est requis.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/pets/${petId}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Erreur lors de l'ajout");
      }

      onRecordAdded(data.record);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-stone-900">
              Nouveau soin pour {petName}
            </h3>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Type d'acte</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="VACCINATION">Vaccination</option>
                <option value="FLEA_TICK">Anti-puces & Tiques</option>
                <option value="DEWORMING">Vermifuge</option>
                <option value="MEDICATION">Médicament / Prescription</option>
                <option value="CHECKUP">Bilan de santé annuel</option>
                <option value="SURGERY">Chirurgie / Stérilisation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Intitulé du soin / vaccin *</label>
              <input
                type="text"
                required
                placeholder="Ex: Purevax RCP + Rage"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date d'administration</label>
              <input
                type="date"
                required
                value={formData.dateAdministered}
                onChange={(e) => setFormData({ ...formData, dateAdministered: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Prochaine date d'échéance (Rappel)
              </label>
              <input
                type="date"
                value={formData.nextDueDate}
                onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Clinique / Vétérinaire</label>
              <input
                type="text"
                value={formData.providerName}
                onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">N° de lot / Référence</label>
              <input
                type="text"
                placeholder="Ex: MA-VACC-2026-99"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Notes / Instructions</label>
            <textarea
              rows={2}
              placeholder="Posologie, observations vétérinaires..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 text-xs text-emerald-900 flex items-center justify-between">
            <span>Programmer automatiquement un rappel pour la prochaine échéance</span>
            <input
              type="checkbox"
              checked={formData.createReminderAuto}
              onChange={(e) => setFormData({ ...formData, createReminderAuto: e.target.checked })}
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
              {loading ? "Enregistrement..." : "Enregistrer l'acte médical"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
