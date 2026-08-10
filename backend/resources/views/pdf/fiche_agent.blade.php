<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Fiche agent — {{ $agent->matricule }}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Helvetica', Arial, sans-serif; color: #16233a; margin: 0; padding: 30px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #003366; padding-bottom: 14px; margin-bottom: 20px; }
    .header .title { font-size: 20px; font-weight: bold; color: #003366; margin: 0 0 4px; }
    .header .sub { font-size: 11px; color: #555; margin: 0; }
    .header .ref { text-align: right; font-size: 13px; font-weight: bold; color: #F77F00; }
    .section-title { font-size: 12px; font-weight: bold; color: #003366; text-transform: uppercase; letter-spacing: .4px; margin: 18px 0 8px; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px; }
    table.data { width: 100%; border-collapse: collapse; font-size: 12px; }
    table.data td { padding: 5px 4px; vertical-align: top; }
    table.data td.label { width: 38%; color: #666; }
    table.data td.value { font-weight: bold; color: #16233a; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 10px; font-weight: bold; background: #eef4fb; color: #003366; }
    .footer { position: absolute; bottom: 25px; left: 30px; right: 30px; font-size: 9.5px; color: #888; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <p class="title">Fiche agent</p>
      <p class="sub">Module Ressources Humaines — E-Mairie</p>
    </div>
    <div class="ref">{{ $agent->matricule }}</div>
  </div>

  <div class="section-title">Identité</div>
  <table class="data">
    <tr><td class="label">Nom complet</td><td class="value">{{ $agent->nom_complet }}</td></tr>
    <tr><td class="label">Genre</td><td class="value">{{ $agent->genre === 'F' ? 'Féminin' : 'Masculin' }}</td></tr>
    <tr><td class="label">Date de naissance</td><td class="value">{{ $agent->date_naissance?->format('d/m/Y') ?? 'Non renseignée' }}</td></tr>
    <tr><td class="label">Situation familiale</td><td class="value">{{ $agent->situation_familiale ?? 'Non renseignée' }}</td></tr>
    <tr><td class="label">Téléphone</td><td class="value">{{ $agent->telephone }}</td></tr>
    <tr><td class="label">Email</td><td class="value">{{ $agent->email }}</td></tr>
  </table>

  <div class="section-title">Poste &amp; carrière</div>
  <table class="data">
    <tr><td class="label">Poste</td><td class="value">{{ $agent->poste }}</td></tr>
    <tr><td class="label">Direction</td><td class="value">{{ $agent->direction }}</td></tr>
    <tr><td class="label">Type de contrat</td><td class="value">{{ ucfirst($agent->type_contrat) }}</td></tr>
    <tr><td class="label">Catégorie</td><td class="value">{{ $agent->categorie }}</td></tr>
    <tr><td class="label">Grade</td><td class="value">{{ $agent->grade }}</td></tr>
    @if ($agent->specialite)
      <tr><td class="label">Spécialité</td><td class="value">{{ $agent->specialite }}</td></tr>
    @endif
    @if ($agent->diplome)
      <tr><td class="label">Diplôme</td><td class="value">{{ $agent->diplome }}</td></tr>
    @endif
    <tr><td class="label">Date d'embauche</td><td class="value">{{ $agent->date_embauche?->format('d/m/Y') ?? 'Non renseignée' }}</td></tr>
    <tr><td class="label">Statut</td><td class="value"><span class="badge">{{ ucfirst($agent->statut) }}</span></td></tr>
  </table>

  <div class="section-title">Rémunération &amp; congés</div>
  <table class="data">
    <tr><td class="label">Salaire brut</td><td class="value">{{ number_format($agent->salaire_brut, 0, ',', ' ') }} FCFA</td></tr>
    <tr><td class="label">Congés restants</td><td class="value">{{ $agent->conges_restants }} jour(s)</td></tr>
  </table>

  <div class="footer">
    Fiche générée le {{ now()->format('d/m/Y à H:i') }} — document interne de gestion des ressources humaines.
  </div>
</body>
</html>
