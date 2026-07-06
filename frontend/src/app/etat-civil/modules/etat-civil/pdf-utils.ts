import QRCode from 'qrcode';

/**
 * Code de vérification déterministe dérivé du numéro d'acte :
 * un même acte ré-imprimé garde le même code.
 */
export function codeVerification(numero: string): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let h1 = 0x811c9dc5;
  for (let i = 0; i < numero.length; i++) {
    h1 ^= numero.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193) >>> 0;
  }
  let out = '';
  let h = h1;
  for (let i = 0; i < 16; i++) {
    out += alphabet[h % alphabet.length];
    h = Math.imul(h, 0x01000193) >>> 0;
    h ^= (h1 >> (i % 24)) & 0xff;
    if (i % 4 === 3 && i < 15) out += '-';
  }
  return out;
}

/**
 * Génère le QR code de vérification propre à un acte (data URL PNG),
 * embarqué dans le document imprimé — plus d'image statique.
 */
export async function qrVerification(numero: string, typeActe: string, nomComplet: string): Promise<string> {
  const contenu =
    `https://etatcivil.gouv.ci/verification?acte=${encodeURIComponent(numero)}` +
    `&type=${encodeURIComponent(typeActe)}` +
    `&titulaire=${encodeURIComponent(nomComplet)}` +
    `&code=${encodeURIComponent(codeVerification(numero))}`;
  return QRCode.toDataURL(contenu, { width: 224, margin: 1, errorCorrectionLevel: 'M' });
}

/** Formate une date (ISO yyyy-mm-dd ou dd/mm/yyyy) en date longue française. */
export function formatDateFr(d?: string): string {
  if (!d) return '—';
  let date: Date | null = null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
  const fr = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(d);
  if (iso) date = new Date(+iso[1], +iso[2] - 1, +iso[3]);
  else if (fr) date = new Date(+fr[3], +fr[2] - 1, +fr[1]);
  if (!date || isNaN(date.getTime())) return d;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

/** Formate une heure "HH:mm" en "HH heures mm minutes". */
export function formatHeureFr(h?: string): string {
  if (!h) return '—';
  const m = /^(\d{1,2}):(\d{2})/.exec(h);
  if (!m) return h;
  return `${m[1].padStart(2, '0')} heures ${m[2]} minutes`;
}

/** Ouvre la fenêtre d'impression avec le HTML du document. */
export function openPrintWindow(html: string): void {
  const win = window.open('', '_blank', 'width=900,height=700');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
