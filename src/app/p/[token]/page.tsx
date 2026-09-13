import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPetByTagToken } from "@/lib/data-service";
import FinderAlertForm from "./FinderAlertForm";
import {
  Phone,
  MessageCircle,
  AlertTriangle,
  ShieldCheck,
  Heart,
  MapPin,
  Stethoscope,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PublicScanPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const profile = await getPetByTagToken(token, "fr");

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto space-y-4">
        {/* Top ZAYA Branding Header */}
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-base shadow-sm">
              Z
            </div>
            <span className="font-extrabold text-lg tracking-tight text-stone-900">
              ZAYA
            </span>
          </Link>
          <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Fiche Officielle Vérifiée
          </span>
        </div>

        {/* Main Pet Status Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden">
          {/* Lost vs Safe Status Header Banner */}
          <div
            className={`p-4 text-center transition-colors ${
              profile.isLost
                ? "bg-rose-600 text-white animate-pulse"
                : "bg-emerald-800 text-white"
            }`}
          >
            <div className="flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wide">
              {profile.isLost ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-300" />
                  <span>🚨 CET ANIMAL EST DÉCLARÉ PERDU</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  <span>Cet animal est en sécurité</span>
                </>
              )}
            </div>
            {profile.isLost && (
              <p className="text-xs text-rose-100 font-medium mt-1">
                Le propriétaire recherche activement cet animal. Merci pour votre aide précieuse !
              </p>
            )}
          </div>

          {/* Pet Photo & Identity Information */}
          <div className="p-6 text-center space-y-4">
            <div className="relative w-36 h-36 mx-auto rounded-3xl overflow-hidden ring-4 ring-stone-100 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  profile.photoUrl ||
                  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80"
                }
                alt={profile.petName}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                  {profile.petName}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-stone-100 text-stone-700">
                  {profile.species === "CAT" ? "Chat" : "Chien"}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                {profile.breed || "Race non spécifiée"}
                {profile.approxAge ? ` • Âge : ~${profile.approxAge}` : ""}
                {profile.color ? ` • Robe : ${profile.color}` : ""}
              </p>
            </div>

            {/* Lost notes from owner */}
            {profile.isLost && profile.lostNotes && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left leading-relaxed">
                <div className="font-bold text-amber-950 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Message du propriétaire :
                </div>
                « {profile.lostNotes} »
              </div>
            )}

            {/* Emergency Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={`tel:${profile.ownerContact.phone}`}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-800/20 transition transform active:scale-98"
              >
                <Phone className="w-4 h-4" />
                <span>Appeler le propriétaire ({profile.ownerContact.name})</span>
              </a>

              <a
                href={profile.ownerContact.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition transform active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Envoyer un WhatsApp au propriétaire</span>
              </a>

              {profile.emergencyContact && profile.emergencyContact.phone && (
                <a
                  href={`tel:${profile.emergencyContact.phone}`}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  <span>Contact alternatif : {profile.emergencyContact.name}</span>
                </a>
              )}

              {profile.vetClinic && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-600 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-left">
                    <Stethoscope className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <div className="font-semibold text-stone-900">{profile.vetClinic.clinicName}</div>
                      <div className="text-[10px] text-stone-500">{profile.vetClinic.city}</div>
                    </div>
                  </div>
                  <a
                    href={`tel:${profile.vetClinic.phone}`}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Appeler
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Finder Alert Form (No login required) */}
          <div className="border-t border-stone-100 p-6 bg-stone-50/70">
            <FinderAlertForm token={token} petName={profile.petName} />
          </div>
        </div>

        {/* Security & Privacy Notice */}
        <div className="p-4 rounded-2xl bg-white/70 border border-stone-200/80 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-700">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Confidentialité et Protection ZAYA</span>
          </div>
          <p className="text-[11px] text-stone-500 leading-normal">
            L'adresse de domicile exacte et les dossiers médicaux confidentiels ne sont jamais divulgués
            sur cette page publique.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-center pt-2 text-[11px] text-stone-400">
          Plateforme ZAYA • Technologie NFC & QR Code pour animaux au Maroc
        </div>
      </div>
    </div>
  );
}
