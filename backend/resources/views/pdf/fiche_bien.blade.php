<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Fiche patrimoniale — {{ $bien->reference }}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Helvetica', Arial, sans-serif; color: #1a2e22; margin: 0; padding: 30px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #004D20; padding-bottom: 14px; margin-bottom: 20px; }
    .header .title { font-size: 20px; font-weight: bold; color: #004D20; margin: 0 0 4px; }
    .header .sub { font-size: 11px; color: #555; margin: 0; }
    .header .ref { text-align: right; font-size: 13px; font-weight: bold; color: #F5A623; }
    .section-title { font-size: 12px; font-weight: bold; color: #004D20; text-transform: uppercase; letter-spacing: .4px; margin: 18px 0 8px; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px; }
    table.data { width: 100%; border-collapse: collapse; font-size: 12px; }
    table.data td { padding: 5px 4px; vertical-align: top; }
    table.data td.label { width: 38%; color: #666; }
    table.data td.value { font-weight: bold; color: #1a2e22; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 10px; font-weight: bold; background: #eef7f0; color: #004D20; }
    .qr-box { text-align: center; margin-top: 20px; }
    .footer { position: absolute; bottom: 25px; left: 30px; right: 30px; font-size: 9.5px; color: #888; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <p class="title">Fiche patrimoniale</p>
      <p class="sub">Module Patrimoine — E-Mairie</p>
    </div>
    <div class="ref">{{ $bien->reference }}</div>
  </div>

  <div class="section-title">Identification</div>
  <table class="data">
    <tr><td class="label">Désignation</td><td class="value">{{ $bien->designation }}</td></tr>
    <tr><td class="label">Catégorie</td><td class="value">{{ $bien->categorie }}</td></tr>
    <tr><td class="label">Localisation</td><td class="value">{{ $bien->localisation }}</td></tr>
    <tr><td class="label">Affectation</td><td class="value">{{ $bien->affectation }}</td></tr>
    <tr><td class="label">Statut</td><td class="value"><span class="badge">{{ $bien->statut }}</span></td></tr>
    <tr><td class="label">État</td><td class="value">{{ $bien->etat }}</td></tr>
    @if ($bien->superficie)
      <tr><td class="label">Superficie</td><td class="value">{{ $bien->superficie }} m²</td></tr>
    @endif
  </table>

  <div class="section-title">Valeur &amp; amortissement</div>
  <table class="data">
    <tr><td class="label">Date d'acquisition</td><td class="value">{{ $bien->date_acquisition?->format('d/m/Y') ?? 'Non renseignée' }}</td></tr>
    <tr><td class="label">Valeur d'acquisition</td><td class="value">{{ number_format($bien->valeur_acquisition, 0, ',', ' ') }} FCFA</td></tr>
    <tr><td class="label">Taux d'amortissement</td><td class="value">{{ $bien->taux_amortissement }} % / an</td></tr>
    <tr><td class="label">Valeur nette comptable</td><td class="value">{{ number_format($bien->valeur_actuelle_calculee ?? $bien->valeur_actuelle, 0, ',', ' ') }} FCFA</td></tr>
  </table>

  <div class="qr-box">
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&data={{ $bien->qr_code ?? $bien->reference }}" alt="QR code" width="110" height="110">
    <p style="font-size:10px;color:#666;margin-top:6px;">Code : {{ $bien->qr_code ?? $bien->reference }}</p>
  </div>

  <div class="footer">
    Fiche générée le {{ now()->format('d/m/Y à H:i') }} — document interne de gestion patrimoniale, sans valeur d'acte officiel.
  </div>
</body>
</html>
