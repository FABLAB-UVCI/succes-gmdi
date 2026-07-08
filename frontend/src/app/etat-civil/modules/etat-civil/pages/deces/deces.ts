import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { PrintService } from '../../../../services/print.service';
import { qrVerification, codeVerification, formatDateFr, openPrintWindow } from '../../pdf-utils';

@Component({
  selector: 'app-deces',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deces.html',
  styleUrls: ['./deces.css']
})
export class DecesComponent implements OnInit {
  currentTab = signal('decl');
  toastMsg = signal('');
  showToast = signal(false);
  deces = signal<any[]>([]);

  decesForm: { nom: string; prenom: string; dob: string; date: string; heure: string; lieu: string; commune: string; cause: string; declarant: string; lien: string; cniDefunt: File | null; certificatDeces: File | null; cniDeclarant: File | null } = { nom: '', prenom: '', dob: '', date: '', heure: '', lieu: '', commune: '', cause: '', declarant: '', lien: '', cniDefunt: null, certificatDeces: null, cniDeclarant: null };

  constructor(private api: ApiService, private printService: PrintService) {}

  ngOnInit() {
    this.api.getDeces().subscribe({ next: d => this.deces.set(d), error: () => {} });
  }

  switchTab(tab: string) { this.currentTab.set(tab); }

  notify(msg: string) {
    this.toastMsg.set(msg); this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3500);
  }

  onCniDefuntSelected(e: Event) { this.decesForm.cniDefunt = (e.target as HTMLInputElement).files?.[0] ?? null; }
  onCertificatDecesSelected(e: Event) { this.decesForm.certificatDeces = (e.target as HTMLInputElement).files?.[0] ?? null; }
  onCniDeclarantSelected(e: Event) { this.decesForm.cniDeclarant = (e.target as HTMLInputElement).files?.[0] ?? null; }

  submitAttempted = signal(false);

  enregistrerDeces() {
    this.submitAttempted.set(true);
    const f = this.decesForm;
    if (!f.nom || !f.prenom || !f.date || !f.lieu) { this.notify('Veuillez remplir les champs obligatoires (*)'); return; }
    this.api.createDeces({
      nom: f.nom, prenom: f.prenom,
      date_naissance: f.dob || null,
      date_deces: f.date, heure_deces: f.heure,
      lieu_deces: f.lieu, commune: f.commune,
      cause_deces: f.cause,
      declarant_nom: f.declarant, declarant_lien: f.lien
    }).subscribe({
      next: res => {
        this.deces.update(l => [res, ...l]);
        this.notify(`Acte de décès enregistré — N° ${res.numero}`);
        genererActeDecesPDF({
          numero: res.numero,
          nom: f.nom, prenom: f.prenom, dob: f.dob,
          dateDeces: f.date, heureDeces: f.heure,
          lieuDeces: f.lieu, commune: f.commune,
          causeDeces: f.cause, declarant: f.declarant, lien: f.lien
        });
        this.decesForm = { nom: '', prenom: '', dob: '', date: '', heure: '', lieu: '', commune: '', cause: '', declarant: '', lien: '', cniDefunt: null, certificatDeces: null, cniDeclarant: null };
        this.submitAttempted.set(false);
      },
      error: (err) => this.notify(err?.error?.message || "Erreur lors de l'enregistrement")
    });
  }

  imprimer(d: any): void {
    genererActeDecesPDF({
      numero: d.numero,
      nom: d.nom ?? (d.nomComplet ?? '').trim().split(' ')[0] ?? '',
      prenom: d.prenom ?? (d.nomComplet ?? '').trim().split(' ').slice(1).join(' '),
      dob: d.dateNaissance,
      dateDeces: d.dateDeces,
      heureDeces: d.heureDeces,
      lieuDeces: d.lieu,
      commune: d.commune,
      causeDeces: d.cause,
      declarant: d.declarant,
      lien: d.lien
    });
  }
}

export async function genererActeDecesPDF(data: {
  numero: string; nom: string; prenom: string; dob?: string;
  dateDeces: string; heureDeces?: string; lieuDeces?: string; commune?: string;
  causeDeces?: string; declarant?: string; lien?: string;
}): Promise<void> {
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const commune = data.commune || 'Cocody';
    const qr = await qrVerification(data.numero, 'Extrait de décès', `${data.nom} ${data.prenom}`.trim());
    const html =
      `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <base href="${document.baseURI}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Extrait d'Acte de Décès</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&family=Roboto:wght@400;700&display=swap');

        body {
            font-family: 'Times New Roman', Times, serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        .document-container {
            width: 210mm;
            height: 297mm;
            background-color: #ffffff;
            padding: 20mm;
            box-sizing: border-box;
            position: relative;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            overflow: hidden;
            page-break-after: always;
            margin: 0;
        }

        @media print {
            body {
                background-color: #ffffff;
                margin: 0;
                padding: 0;
            }

            .document-container {
                box-shadow: none;
                margin: 0;
                padding: 20mm;
                width: 100%;
                height: 100%;
                page-break-after: always;
            }
        }

        .border-ornament {
            border: 4px double #1e5c33;
            height: calc(100% - 10px);
            position: absolute;
            top: 5px;
            left: 5px;
            right: 5px;
            bottom: 5px;
            pointer-events: none;
            box-sizing: border-box;
        }

        .watermark {
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-25deg);
            font-size: 5rem;
            font-weight: bold;
            color: rgba(180, 180, 180, 0.18);
            white-space: nowrap;
            user-select: none;
            pointer-events: none;
            z-index: 1;
            font-family: 'Roboto', sans-serif;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .header-left {
            width: 25%;
            text-align: center;
            vertical-align: top;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: bold;
        }

        .logo-placeholder {
            width: 80px;
            height: 80px;
            border: 1px dashed #ccc;
            margin: 0 auto 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #777;
        }

        .header-center {
            width: 50%;
            text-align: center;
            vertical-align: top;
        }

        .republique {
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 1px;
            margin-bottom: 2px;
        }

        .devise {
            font-size: 11px;
            font-style: italic;
            margin-bottom: 15px;
        }

        .ministere {
            font-size: 12px;
            font-weight: bold;
            line-height: 1.3;
            margin-bottom: 15px;
        }

        .administration {
            font-size: 11px;
            font-weight: bold;
            line-height: 1.3;
        }

        .header-right {
            width: 25%;
            text-align: center;
            vertical-align: top;
        }

        .numero-acte {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .timbre-numerique {
            width: 120px;
            height: 120px;
            border: 2px solid #2b5797;
            border-radius: 50%;
            margin: 0 auto 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            color: #2b5797;
            font-family: 'Roboto', sans-serif;
            font-weight: bold;
            text-align: center;
            padding: 5px;
            box-sizing: border-box;
        }

        .certif-box {
            border: 1px solid #2b5797;
            border-radius: 4px;
            font-size: 9px;
            color: #2b5797;
            padding: 3px;
            text-transform: uppercase;
            font-weight: bold;
            display: inline-block;
            margin-top: 5px;
        }

        .title-section {
            text-align: center;
            margin: 25px 0 15px;
        }

        .main-title {
            color: #1e5c33;
            font-size: 26px;
            font-weight: bold;
            letter-spacing: 1px;
            margin: 0 0 5px 0;
        }

        .subtitle {
            font-size: 12px;
            font-style: italic;
            margin-bottom: 15px;
        }

        .intro-text {
            font-size: 12px;
            text-align: justify;
            line-height: 1.5;
            margin-bottom: 20px;
            padding: 0 10px;
        }

        .content-container {
            display: flex;
            justify-content: space-between;
            position: relative;
            z-index: 2;
        }

        .left-data-column {
            width: 62%;
        }

        .right-meta-column {
            width: 35%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .section-title {
            color: #1e5c33;
            font-size: 13px;
            font-weight: bold;
            border-bottom: 1px none #ccc;
            margin: 15px 0 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 10px;
        }

        .data-table td {
            padding: 3px 0;
            vertical-align: top;
        }

        .label-cell {
            width: 40%;
            color: #333;
        }

        .separator-cell {
            width: 5%;
            text-align: center;
        }

        .value-cell {
            width: 55%;
            font-weight: bold;
            text-transform: uppercase;
        }

        .value-cell.mixed {
            text-transform: none;
        }

        .commune-illustration {
            width: 100%;
            height: 110px;
            margin-bottom: 25px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: #777;
            text-align: center;
        }

        .qr-verification-box {
            border: 1px solid #1e5c33;
            border-radius: 8px;
            padding: 12px;
            text-align: center;
            font-size: 10px;
            font-family: 'Roboto', sans-serif;
            background-color: #fff;
            width: 90%;
            box-sizing: border-box;
        }

        .qr-title {
            font-weight: bold;
            color: #1e5c33;
            margin-bottom: 8px;
            font-size: 11px;
        }

        .qr-placeholder {
            width: 110px;
            height: 110px;
            border: 1px solid #000;
            margin: 0 auto 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }

        .qr-text {
            line-height: 1.3;
            color: #333;
            margin-bottom: 5px;
        }

        .qr-code-verif {
            font-weight: bold;
            color: #2b5797;
            margin: 5px 0;
        }

        .signature-section {
            display: flex;
            justify-content: end;
            align-items: center;
            margin-top: 20px;
            padding: 0 20px 62px;
            position: relative;
            z-index: 2;
        }

        .seal-placeholder {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #2b5797;
            text-align: center;
        }

        .signature-box {
            text-align: center;
            font-size: 12px;
            width: 220px;
        }

        .signature-title {
            font-style: italic;
        }

        .signature-line {
            height: 40px;
            border-bottom: 1px dashed #777;
        }

        .footer-legal-notice {
            position: absolute;
            bottom: -9px;
            left: 40px;
            right: 40px;
            border: 1px solid #1e5c33;
            padding: 10px;
            font-size: 10px;
            text-align: center;
            line-height: 1.4;
            background-color: #fff;
            z-index: 2;
        }

        .footer-pedagogic {
            margin-top: 5px;
            font-weight: bold;
            color: #1e5c33;
        }
    </style>
</head>
<body>
    <div class="document-container">
        <div class="border-ornament"></div>

        <div class="watermark">EXEMPLE DOCUMENT FICTIF</div>

        <table class="header-table">
            <tr>
                <td class="header-left">
                    <div class="logo-placeholder">
                     <img src="armoirie_0.jpg" alt="Description de l'image" width="82" height="82">
                    </div>
                    RÉPUBLIQUE<br>DE CÔTE D'IVOIRE
                </td>

                <td class="header-center">
                    <div class="republique">RÉPUBLIQUE DE CÔTE D'IVOIRE</div>
                    <div class="devise">Union – Discipline – Travail</div>

                    <div class="ministere">
                        MINISTÈRE DE LA JUSTICE<br>ET DES DROITS DE L'HOMME
                    </div>

                    <div class="administration">
                        DIRECTION GÉNÉRALE DES AFFAIRES CIVILES<br>ET DU SCEAU
                    </div>
                    <br>
                    <div class="administration" style="font-weight: normal;">
                        <strong>COMMUNE DE ${commune.toUpperCase()}</strong><br>
                        DÉPARTEMENT D'ABIDJAN
                    </div>
                </td>

                <td class="header-right">
                    <div class="numero-acte">N° ${data.numero}</div>
                    <div class="timbre-numerique">
                        <img src="timbre_numerique1.png" height="130" weight="130">
                    </div>
                    <div class="certif-box">Document Électronique<br>Certifié</div>
                </td>
            </tr>
        </table>

        <div class="title-section">
            <h1 class="main-title">EXTRAIT D'ACTE DE DÉCÈS</h1>
            <div class="subtitle">(Article 87 du Code des Personnes et de la Famille)</div>
        </div>

        <div class="intro-text">
            L'Officier de l'État Civil soussigné certifie qu'il résulte des registres des actes de décès de la Commune de ${commune}, que l'acte dont les éléments sont ci-dessous relatés, a été dressé.
        </div>

        <div class="content-container">

            <div class="left-data-column">

                <div class="section-title">Détails de l'acte</div>
                <table class="data-table">
                    <tr><td class="label-cell">Nom du défunt</td><td class="separator-cell">:</td><td class="value-cell">${data.nom}</td></tr>
                    <tr><td class="label-cell">Prénoms</td><td class="separator-cell">:</td><td class="value-cell">${data.prenom}</td></tr>
                    <tr><td class="label-cell">Date de naissance</td><td class="separator-cell">:</td><td class="value-cell mixed">${formatDateFr(data.dob)}</td></tr>
                    <tr><td class="label-cell">Date du décès</td><td class="separator-cell">:</td><td class="value-cell mixed">${formatDateFr(data.dateDeces)}</td></tr>
                    <tr><td class="label-cell">Heure du décès</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.heureDeces || 'Non renseignée'}</td></tr>
                    <tr><td class="label-cell">Lieu du décès</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.lieuDeces || 'Non renseigné'}</td></tr>
                    <tr><td class="label-cell">Commune</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.commune || 'Non renseignée'}</td></tr>
                    <tr><td class="label-cell">Cause du décès</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.causeDeces || 'Non renseignée'}</td></tr>
                </table>

                <div class="section-title">Déclaration</div>
                <table class="data-table">
                    <tr><td class="label-cell">Déclarant</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.declarant || 'Non renseigné'}</td></tr>
                    <tr><td class="label-cell">Lien avec le défunt</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.lien || 'Non renseigné'}</td></tr>
                    <tr><td class="label-cell">Date de déclaration</td><td class="separator-cell">:</td><td class="value-cell mixed">${today}</td></tr>
                </table>

                <div class="section-title">Mentions de l'acte</div>
                <table class="data-table">
                    <tr><td class="label-cell">Officier de l'état civil</td><td class="separator-cell">:</td><td class="value-cell">Kouassi N'Guessan Jean-Baptiste</td></tr>
                    <tr><td class="label-cell">Date de délivrance</td><td class="separator-cell">:</td><td class="value-cell mixed">${today}</td></tr>
                    <tr><td class="label-cell">N° de l'acte</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.numero}</td></tr>
                    <tr><td class="label-cell">Observations</td><td class="separator-cell">:</td><td class="value-cell mixed">Néant</td></tr>
                </table>

            </div>

            <div class="right-meta-column">

                <div class="commune-illustration">
                  <img src="Batiment_Mairie_Cocody.png" width="210" height="210">
                </div>

                <div class="qr-verification-box">
                    <div class="qr-title">VÉRIFICATION EN LIGNE</div>
                      <div class="qr-placeholder">
                        <img src="${qr}" alt="QR code de vérification" height="112" width="112">
                      </div>
                    <div class="qr-text">
                        Scannez ce QR code ou rendez-vous sur <strong>https://etatcivil.gouv.ci/verification</strong> pour vérifier l'authenticité de ce document.
                    </div>
                    <div class="qr-code-verif">Code de vérification : ${codeVerification(data.numero)}</div>
                    <div class="qr-text" style="font-weight: bold; margin-top: 5px;">
                        Ce document est signé et sécurisé numériquement.
                    </div>
                </div>

            </div>
        </div>

        <div class="signature-section">
            <img src="seau.png" alt="sceau" width="" height="" class="seal-placeholder">
            <div class="signature-box">
                <div>Fait à ${commune}, le ${today}</div>
                <div class="signature-title">L'Officier de l'État Civil</div>
                <div class="">
                <img src="Signature.png" alt="signature" width="150" height="60">
                <div>
            </div>
        </div>

        <div class="footer-legal-notice">
            Le présent extrait est délivré par système électronique sécurisé et comporte un timbre numérique officiel. Il a la même valeur probante que l'original conformément aux dispositions de l'ordonnance n° 2019-312 du 20 mars 2019 relative à la dématérialisation des actes et documents administratifs.
            <div class="footer-pedagogic">EXEMPLE – DOCUMENT FICTIF – À DES FINS PÉDAGOGIQUES UNIQUEMENT</div>
        </div>

    </div>

</body>
</html>
`;

    openPrintWindow(html);
}
