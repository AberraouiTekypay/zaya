import QRCode from "qrcode";

export async function generateQRCodeDataUrl(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: {
        dark: "#0f3a2f", // ZAYA emerald primary color
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return "";
  }
}

export function getPublicScanUrl(token: string, baseUrl?: string): string {
  const host = baseUrl || (typeof window !== "undefined" ? window.location.origin : "https://zaya.ma");
  return `${host}/p/${token}`;
}
