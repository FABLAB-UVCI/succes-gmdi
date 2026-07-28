<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificat</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Times New Roman', Times, serif; background: #ffffff; margin: 0; padding: 0; }
    .document-container { width: 100%; height: 100%; padding: 20px; box-sizing: border-box; position: relative; }
    .border-ornament { border: 4px double #1e5c33; position: absolute; top: 5px; left: 5px; right: 5px; bottom: 5px; pointer-events: none; }
    .watermark { position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); font-size: 4rem; font-weight: bold; color: rgba(180,180,180,0.15); white-space: nowrap; pointer-events: none; z-index: 0; }
    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .header-left { width: 25%; text-align: center; vertical-align: top; font-size: 11px; text-transform: uppercase; font-weight: bold; }
    .header-center { width: 50%; text-align: center; vertical-align: top; }
    .header-right { width: 25%; text-align: center; vertical-align: top; }
    .republique { font-size: 16px; font-weight: bold; letter-spacing: 1px; margin-bottom: 2px; }
    .devise { font-size: 11px; font-style: italic; margin-bottom: 15px; }
    .ministere { font-size: 12px; font-weight: bold; line-height: 1.3; margin-bottom: 15px; }
    .administration { font-size: 11px; font-weight: bold; line-height: 1.3; }
    .numero-acte { font-size: 13px; font-weight: bold; margin-bottom: 10px; }
    .timbre-numerique { width: 120px; height: 120px; border: 2px solid #2b5797; border-radius: 50%; margin: 0 auto 5px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 9px; color: #2b5797; font-weight: bold; text-align: center; padding: 5px; }
    .title-section { text-align: center; margin: 25px 0 15px; }
    .main-title { color: #1e5c33; font-size: 24px; font-weight: bold; letter-spacing: 1px; margin: 0 0 5px 0; }
    .subtitle { font-size: 12px; font-style: italic; margin-bottom: 15px; }
    .intro-text { font-size: 12px; text-align: justify; line-height: 1.5; margin-bottom: 20px; padding: 0 10px; }
    .content-container { width: 100%; border-collapse: collapse; }
    .left-data-column { width: 62%; vertical-align: top; }
    .right-meta-column { width: 35%; vertical-align: top; padding-left: 20px; text-align: center; }
    .section-title { color: #1e5c33; font-size: 13px; font-weight: bold; margin: 15px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px; }
    .data-table td { padding: 3px 0; vertical-align: top; }
    .label-cell { width: 40%; color: #333; }
    .separator-cell { width: 5%; text-align: center; }
    .value-cell { width: 55%; font-weight: bold; text-transform: uppercase; }
    .value-cell.mixed { text-transform: none; }
    .qr-verification-box { border: 1px solid #1e5c33; border-radius: 8px; padding: 12px; text-align: center; font-size: 10px; background-color: #fff; width: 100%; }
    .qr-title { font-weight: bold; color: #1e5c33; margin-bottom: 8px; font-size: 11px; }
    .qr-code-verif { font-weight: bold; color: #2b5797; margin: 5px 0; }
    .footer-legal-notice { position: absolute; bottom: 10px; left: 40px; right: 40px; border: 1px solid #1e5c33; padding: 10px; font-size: 10px; text-align: center; line-height: 1.4; background-color: #fff; }
    .footer-pedagogic { margin-top: 5px; font-weight: bold; color: #1e5c33; }
  </style>
</head>
<body>
  @php
    $don = $demarche->donnees ?? [];
    $nomComplet = trim(($don['nom'] ?? '') . ' ' . ($don['prenom'] ?? ''));
    $type = $certifType ?? 'Célibat';
    if ($type === 'Résidence') {
      $mainTitle = 'CERTIFICAT DE RÉSIDENCE';
      $subtitle = "(Article 108 du Code des Personnes et de la Famille)";
      $intro = "L'Officier de l'État Civil soussigné certifie qu'il résulte des vérifications effectuées que {$nomComplet} réside effectivement à l'adresse mentionnée ci-dessous.";
    } elseif ($type === 'Vie') {
      $mainTitle = 'CERTIFICAT DE VIE INDIVIDUELLE';
      $subtitle = "(Article 100 du Code des Personnes et de la Famille)";
      $intro = "L'Officier de l'État Civil soussigné certifie qu'il résulte des vérifications effectuées que {$nomComplet} est en vie à la date de délivrance du présent certificat.";
    } else {
      $mainTitle = 'CERTIFICAT DE CÉLIBAT';
      $subtitle = "(Article 100 du Code des Personnes et de la Famille)";
      $intro = "L'Officier de l'État Civil soussigné certifie qu'il résulte des registres de l'état civil qu'à ce jour, {$nomComplet} n'a contracté aucun mariage.";
    }
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
          <div class="ministere">MINISTÈRE DE LA JUSTICE<br>ET DES DROITS DE L'HOMME</div>
          <div class="administration">DIRECTION GÉNÉRALE DES AFFAIRES CIVILES<br>ET DU SCEAU</div>
          <br>
          <div class="administration" style="font-weight:normal;">
            <strong>COMMUNE DE {{ strtoupper($don['commune'] ?? 'COCODY') }}</strong><br>
            DÉPARTEMENT D'ABIDJAN
          </div>
        </td>
        <td class="header-right">
          <div class="numero-acte">N° {{ $demarche->reference }}</div>
          <div class="timbre-numerique">TIMBRE<br>NUMÉRIQUE<br>OFFICIEL</div>
        </td>
      </tr>
    </table>

    <div class="title-section">
      <h1 class="main-title">{{ $mainTitle }}</h1>
      <div class="subtitle">{{ $subtitle }}</div>
    </div>

    <div class="intro-text">{{ $intro }}</div>

    <table class="content-container">
      <tr>
        <td class="left-data-column">
          <div class="section-title">Détails du certificat</div>
          <table class="data-table">
            <tr><td class="label-cell">Nom</td><td class="separator-cell">:</td><td class="value-cell">{{ $don['nom'] ?? '.......................' }}</td></tr>
            <tr><td class="label-cell">Prénoms</td><td class="separator-cell">:</td><td class="value-cell">{{ $don['prenom'] ?? '.......................' }}</td></tr>
            @if ($type === 'Résidence')
              <tr><td class="label-cell">Adresse</td><td class="separator-cell">:</td><td class="value-cell mixed">{{ $don['adresse'] ?? 'Non renseignée' }}</td></tr>
              <tr><td class="label-cell">Quartier</td><td class="separator-cell">:</td><td class="value-cell mixed">{{ $don['quartier'] ?? 'Non renseigné' }}</td></tr>
              <tr><td class="label-cell">Commune</td><td class="separator-cell">:</td><td class="value-cell mixed">{{ $don['commune'] ?? 'Non renseignée' }}</td></tr>
            @else
              <tr><td class="label-cell">Date de naissance</td><td class="separator-cell">:</td><td class="value-cell mixed">{{ $don['date_naissance'] ?? 'Non renseignée' }}</td></tr>
              @if ($type === 'Célibat')
                <tr><td class="label-cell">Profession</td><td class="separator-cell">:</td><td class="value-cell mixed">{{ $don['profession'] ?? 'Non renseignée' }}</td></tr>
                <tr><td class="label-cell">Référence acte de naissance</td><td class="separator-cell">:</td><td class="value-cell mixed">{{ $don['acte_reference'] ?? 'Néant' }}</td></tr>
              @endif
            @endif
          </table>

          <div class="section-title">Mentions</div>
          <table class="data-table">
            <tr><td class="label-cell">Officier de l'état civil</td><td class="separator-cell">:</td><td class="value-cell">Kouassi N'Guessan Jean-Baptiste</td></tr>
            <tr><td class="label-cell">Date de délivrance</td><td class="separator-cell">:</td><td class="value-cell mixed">{{ date('d/m/Y') }}</td></tr>
            <tr><td class="label-cell">N° du certificat</td><td class="separator-cell">:</td><td class="value-cell mixed">{{ $demarche->reference }}</td></tr>
            <tr><td class="label-cell">Observations</td><td class="separator-cell">:</td><td class="value-cell mixed">Néant</td></tr>
          </table>
        </td>

        <td class="right-meta-column">
          <br><br>
          <div class="qr-verification-box">
            <div class="qr-title">VÉRIFICATION EN LIGNE</div>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=112x112&data={{ $demarche->reference }}" alt="QR code" width="112" height="112">
            <div style="line-height:1.3; color:#333; margin-bottom:5px; font-size:10px;">Scannez ce QR code pour vérifier l'authenticité de ce document.</div>
            <div class="qr-code-verif">Code : {{ strtoupper(substr(md5($demarche->reference), 0, 8)) }}</div>
          </div>
        </td>
      </tr>
    </table>

    <table style="width:100%; margin-top:20px;">
      <tr>
        <td style="width:50%; text-align:center;">
          <div style="width:100px; height:100px; border-radius:50%; border:2px dashed #ccc; display:inline-block; line-height:100px; color:#ccc; font-size:10px;">SCEAU</div>
        </td>
        <td style="width:50%; text-align:center; font-size:12px;">
          <div>Fait à {{ $don['commune'] ?? 'Cocody' }}, le {{ date('d/m/Y') }}</div>
          <div style="font-style:italic; margin:10px 0;">L'Officier de l'État Civil</div>
          <div style="margin-top:40px; border-top:1px dashed #000; display:inline-block; padding-top:5px; width:150px;">Signature</div>
        </td>
      </tr>
    </table>

    <div class="footer-legal-notice">
      Le présent certificat est délivré par système électronique sécurisé et comporte un timbre numérique officiel. Il a la même valeur probante que l'original conformément aux dispositions de l'ordonnance n° 2019-312 du 20 mars 2019.
      <div class="footer-pedagogic">EXEMPLE – DOCUMENT FICTIF – À DES FINS PÉDAGOGIQUES UNIQUEMENT</div>
    </div>
  </div>
</body>
</html>
