<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reçu de paiement</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Times New Roman', Times, serif; background: #ffffff; margin: 0; padding: 0; }
    .document-container { width: 100%; height: 100%; padding: 20px; box-sizing: border-box; position: relative; }
    .border-ornament { border: 4px double #F77F00; position: absolute; top: 5px; left: 5px; right: 5px; bottom: 5px; pointer-events: none; }
    .watermark { position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); font-size: 4rem; font-weight: bold; color: rgba(180,180,180,0.15); white-space: nowrap; pointer-events: none; z-index: 0; }
    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .header-left { width: 25%; text-align: center; vertical-align: top; font-size: 11px; text-transform: uppercase; font-weight: bold; }
    .header-center { width: 50%; text-align: center; vertical-align: top; }
    .header-right { width: 25%; text-align: center; vertical-align: top; }
    .republique { font-size: 16px; font-weight: bold; letter-spacing: 1px; margin-bottom: 2px; }
    .devise { font-size: 11px; font-style: italic; margin-bottom: 15px; }
    .ministere { font-size: 12px; font-weight: bold; line-height: 1.3; margin-bottom: 15px; }
    .numero-acte { font-size: 13px; font-weight: bold; margin-bottom: 10px; }
    .timbre-numerique { width: 120px; height: 120px; border: 2px solid #009A44; border-radius: 50%; margin: 0 auto 5px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 9px; color: #009A44; font-weight: bold; text-align: center; padding: 5px; }
    .title-section { text-align: center; margin: 25px 0 15px; }
    .main-title { color: #003366; font-size: 24px; font-weight: bold; letter-spacing: 1px; margin: 0 0 5px 0; }
    .subtitle { font-size: 12px; font-style: italic; margin-bottom: 15px; }
    .intro-text { font-size: 12px; text-align: justify; line-height: 1.5; margin-bottom: 20px; padding: 0 10px; }
    .content-container { width: 100%; border-collapse: collapse; }
    .left-data-column { width: 62%; vertical-align: top; }
    .right-meta-column { width: 35%; vertical-align: top; padding-left: 20px; text-align: center; }
    .section-title { color: #003366; font-size: 13px; font-weight: bold; margin: 15px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px; }
    .data-table td { padding: 3px 0; vertical-align: top; }
    .label-cell { width: 40%; color: #333; }
    .separator-cell { width: 5%; text-align: center; }
    .value-cell { width: 55%; font-weight: bold; }
    .montant-box { border: 2px solid #009A44; border-radius: 8px; padding: 14px; text-align: center; background: #f0fdf4; margin-bottom: 15px; }
    .montant-val { color: #009A44; font-size: 22px; font-weight: bold; }
    .qr-verification-box { border: 1px solid #003366; border-radius: 8px; padding: 12px; text-align: center; font-size: 10px; background-color: #fff; width: 100%; }
    .qr-title { font-weight: bold; color: #003366; margin-bottom: 8px; font-size: 11px; }
    .qr-code-verif { font-weight: bold; color: #2b5797; margin: 5px 0; }
    .footer-legal-notice { position: absolute; bottom: 10px; left: 40px; right: 40px; border: 1px solid #003366; padding: 10px; font-size: 10px; text-align: center; line-height: 1.4; background-color: #fff; }
    .footer-pedagogic { margin-top: 5px; font-weight: bold; color: #003366; }
  </style>
</head>
<body>
  @php
    $don = $demarche->donnees ?? [];
    $montant = $don['montant'] ?? null;
    $typeTaxe = $don['type_taxe'] ?? ($demarche->type_demarche ?? 'Paiement');
    $modePaiement = $don['mode_paiement'] ?? 'Non renseigné';
  @endphp
  <div class="document-container">
    <div class="border-ornament"></div>
    <div class="watermark">EXEMPLE DOCUMENT FICTIF</div>

    <table class="header-table">
      <tr>
        <td class="header-left">RÉPUBLIQUE<br>DE CÔTE D'IVOIRE</td>
        <td class="header-center">
          <div class="republique">RÉPUBLIQUE DE CÔTE D'IVOIRE</div>
          <div class="devise">Union – Discipline – Travail</div>
          <div class="ministere">DIRECTION DES FINANCES LOCALES</div>
          <div style="font-size:11px; font-weight:bold;">RÉGIE DE RECETTES COMMUNALES</div>
        </td>
        <td class="header-right">
          <div class="numero-acte">N° {{ $demarche->reference }}</div>
          <div class="timbre-numerique">TIMBRE<br>NUMÉRIQUE<br>OFFICIEL</div>
        </td>
      </tr>
    </table>

    <div class="title-section">
      <h1 class="main-title">REÇU DE PAIEMENT</h1>
      <div class="subtitle">{{ $typeTaxe }}</div>
    </div>

    <div class="intro-text">Le Receveur Municipal certifie avoir reçu du contribuable ci-dessous désigné le règlement suivant, enregistré dans le système de gestion municipale digitale intégrée (GMDI).</div>

    <table class="content-container">
      <tr>
        <td class="left-data-column">
          <div class="montant-box">
            <div style="font-size:11px; color:#555;">MONTANT RÉGLÉ</div>
            <div class="montant-val">{{ $montant !== null ? number_format((float)$montant, 0, ',', ' ') . ' FCFA' : 'Non renseigné' }}</div>
          </div>

          <div class="section-title">Détails du paiement</div>
          <table class="data-table">
            <tr><td class="label-cell">Contribuable</td><td class="separator-cell">:</td><td class="value-cell">{{ $demarche->user->name ?? 'Non renseigné' }}</td></tr>
            <tr><td class="label-cell">Nature</td><td class="separator-cell">:</td><td class="value-cell">{{ $typeTaxe }}</td></tr>
            <tr><td class="label-cell">Mode de paiement</td><td class="separator-cell">:</td><td class="value-cell">{{ $modePaiement }}</td></tr>
            <tr><td class="label-cell">Référence</td><td class="separator-cell">:</td><td class="value-cell">{{ $demarche->reference }}</td></tr>
            <tr><td class="label-cell">Date de paiement</td><td class="separator-cell">:</td><td class="value-cell">{{ date('d/m/Y') }}</td></tr>
          </table>
        </td>

        <td class="right-meta-column">
          <br><br>
          <div class="qr-verification-box">
            <div class="qr-title">VÉRIFICATION EN LIGNE</div>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=112x112&data={{ $demarche->reference }}" alt="QR code" width="112" height="112">
            <div style="line-height:1.3; color:#333; margin-bottom:5px; font-size:10px;">Scannez ce QR code pour vérifier l'authenticité de ce reçu.</div>
            <div class="qr-code-verif">Code : {{ strtoupper(substr(md5($demarche->reference), 0, 8)) }}</div>
          </div>
        </td>
      </tr>
    </table>

    <div class="footer-legal-notice">
      Le présent reçu est délivré par système électronique sécurisé et comporte un timbre numérique officiel. Conservez-le comme preuve de paiement.
      <div class="footer-pedagogic">EXEMPLE – DOCUMENT FICTIF – À DES FINS PÉDAGOGIQUES UNIQUEMENT</div>
    </div>
  </div>
</body>
</html>
