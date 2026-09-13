"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle, ExternalLink, RefreshCw } from "lucide-react";

interface LostModeBannerProps {
  petId: string;
  petName: string;
  isLost: boolean;
  lostNotes?: string | null;
  tagToken?: string | null;
  onStatusChange?: (newStatus: boolean) => void;
  canManage?: boolean;
}

export default function LostModeBanner({
  petId,
  petName,
  isLost,
  lostNotes,
  tagToken,
  onStatusChange,
  canManage = true,
}: LostModeBannerProps) {
  const [loading, setLoading] = useState(false);
  const [localIsLost, setLocalIsLost] = useState(isLost);

  const toggleStatus = async () => {
    if (!canManage) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/pets/${petId}/lost-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isLost: !localIsLost,
          lostNotes: !localIsLost ? `Déclaré perdu le ${new Date().toLocaleDateString("fr-FR")}. Merci de contacter immédiatement le propriétaire.` : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLocalIsLost(!localIsLost);
        if (onStatusChange) onStatusChange(!localIsLost);
      }
    } catch (e) {
      console.error("Failed to toggle lost mode", e);
    } finally {
      setLoading(false);
    }
  };

  if (!localIsLost && !canManage) return null;

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
        localIsLost
          ? "bg-amber-500/10 border-amber-500/40 text-amber-950"
          : "bg-emerald-50 border-emerald-200 text-emerald-950"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              localIsLost ? "bg-amber-600 text-white animate-bounce" : "bg-emerald-700 text-white"
            }`}
          >
            {localIsLost ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm sm:text-base">
                {localIsLost ? `🚨 ${petName} est déclaré PERDU` : `✅ ${petName} est en sécurité`}
              </h4>
              <span
                className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                  localIsLost ? "bg-amber-200 text-amber-900" : "bg-emerald-200 text-emerald-900"
                }`}
              >
                {localIsLost ? "Alerte Active" : "Normal"}
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1 max-w-xl">
              {localIsLost
                ? lostNotes || "La fiche publique affiche une alerte clignotante avec boutons directs d'appel et WhatsApp pour le trouveur."
                : "La médaille fonctionne en mode normal. Vos coordonnées d'urgence restent protégées et consultables en cas de besoin."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {tagToken && (
            <Link
              href={`/p/${tagToken}`}
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Voir fiche publique
            </Link>
          )}

          {canManage && (
            <button
              onClick={toggleStatus}
              disabled={loading}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition disabled:opacity-50 ${
                localIsLost
                  ? "bg-emerald-700 hover:bg-emerald-600"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : localIsLost ? (
                "Marquer comme retrouvé ✅"
              ) : (
                "Activer le Mode Perdu 🚨"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
