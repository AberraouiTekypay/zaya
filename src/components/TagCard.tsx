"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { generateQRCodeDataUrl, getPublicScanUrl } from "@/lib/qr";
import { QrCode, Wifi, ExternalLink, ShieldCheck, Copy, Check, Printer } from "lucide-react";

interface TagCardProps {
  tag: {
    code: string;
    token: string;
    status: string;
    scanCount?: number;
    lastScannedAt?: string | Date | null;
  };
  petName: string;
  isLost?: boolean;
}

export default function TagCard({ tag, petName, isLost }: TagCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const publicUrl = getPublicScanUrl(tag.token);

  useEffect(() => {
    generateQRCodeDataUrl(publicUrl).then((url) => setQrDataUrl(url));
  }, [publicUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Carte Médaille ZAYA - ${petName}</title>
          <style>
            body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f5f5f5; }
            .card { background: white; border: 2px solid #0f3a2f; border-radius: 16px; padding: 24px; text-align: center; width: 320px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            h2 { color: #0f3a2f; margin: 0 0 4px 0; font-size: 24px; font-weight: 800; }
            p { color: #666; font-size: 12px; margin: 4px 0 16px 0; }
            img { width: 220px; height: 220px; border-radius: 8px; }
            .code { font-family: monospace; font-size: 14px; font-weight: bold; background: #eef5f2; color: #0f3a2f; padding: 6px 12px; border-radius: 6px; display: inline-block; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>ZAYA</h2>
            <p>Médaille d'Identité Connectée pour <strong>${petName}</strong></p>
            <img src="${qrDataUrl}" alt="QR Code ZAYA" />
            <div class="code">${tag.code}</div>
            <p style="margin-top: 12px; font-size: 11px;">En cas de perte, scannez ce QR Code ou approchez votre smartphone (NFC).</p>
          </div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-900/30">
      {/* Decorative NFC background rings */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-emerald-500/10 pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border border-emerald-500/15 pointer-events-none" />
      <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full border border-emerald-500/20 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Tag details */}
        <div className="space-y-4 max-w-sm text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Wifi className="w-3.5 h-3.5" /> NFC Intégré (13.56 MHz)
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Étanche IP68
            </span>
            {isLost && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/30 text-amber-200 text-xs font-bold animate-pulse border border-amber-500/50">
                🚨 MODE PERDU ACTIF
              </span>
            )}
          </div>

          <div>
            <div className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Médaille Connectée ZAYA
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
              {petName}
            </h3>
            <div className="font-mono text-xs text-emerald-400 font-bold mt-1 tracking-wider">
              {tag.code}
            </div>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            Un simple contact avec un smartphone ou un scan du QR code ouvre immédiatement la fiche de secours de{" "}
            <strong>{petName}</strong> sans aucune application requise.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <Link
              href={`/p/${tag.token}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Tester le scan public
            </Link>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Lien copié !" : "Copier le lien"}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition"
              title="Imprimer la carte QR Code"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimer
            </button>
          </div>
        </div>

        {/* Right: Real QR Code Container */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white p-3 rounded-2xl shadow-2xl flex items-center justify-center border-4 border-emerald-800/60">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt={`QR Code ZAYA pour ${petName}`} className="w-full h-full object-contain" />
            ) : (
              <div className="text-stone-400 flex flex-col items-center gap-2">
                <QrCode className="w-10 h-10 animate-pulse text-emerald-700" />
                <span className="text-[10px]">Génération du QR Code...</span>
              </div>
            )}
          </div>
          <div className="text-[11px] text-stone-400 mt-2 flex items-center gap-1">
            <span>Scannez pour ouvrir</span>
            <span className="font-mono text-emerald-300">zaya.ma/p/{tag.token}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
