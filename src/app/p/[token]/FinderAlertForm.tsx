"use client";

import React, { useState } from "react";
import { Send, CheckCircle, MapPin, Phone, User, MessageSquare } from "lucide-react";

export default function FinderAlertForm({
  token,
  petName,
}: {
  token: string;
  petName: string;
}) {
  const [formData, setFormData] = useState({
    finderName: "",
    finderPhone: "",
    location: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.finderPhone) {
      setError("Veuillez renseigner votre numéro de téléphone.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/finder-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Erreur d'envoi");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-300 text-center space-y-2 text-emerald-950">
        <CheckCircle className="w-8 h-8 text-emerald-700 mx-auto" />
        <h4 className="font-bold text-sm">Alerte transmise au propriétaire !</h4>
        <p className="text-xs text-emerald-800">
          Le propriétaire de {petName} a été notifié avec vos coordonnées. Merci infiniment pour votre geste précieux.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-left">
        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          Signaler que vous avez vu ou recueilli {petName}
        </h3>
        <p className="text-[11px] text-stone-500 mt-0.5">
          Transmettez vos coordonnées au maître en quelques secondes, sans créer de compte.
        </p>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Votre nom</label>
            <input
              type="text"
              placeholder="Ex: Yassine"
              value={formData.finderName}
              onChange={(e) => setFormData({ ...formData, finderName: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Votre téléphone *</label>
            <input
              type="tel"
              required
              placeholder="+212 6XX XX XX XX"
              value={formData.finderPhone}
              onChange={(e) => setFormData({ ...formData, finderPhone: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Quartier / Ville</label>
          <input
            type="text"
            placeholder="Ex: Maarif près du boulevard Zerktouni"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Remarque (optionnel)</label>
          <textarea
            rows={2}
            placeholder="Ex: 'L'animal est en sécurité avec moi, il a bu de l'eau'"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? "Envoi en cours..." : "Notifier le maître immédiatement"}</span>
        </button>
      </form>
    </div>
  );
}
