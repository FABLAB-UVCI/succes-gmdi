import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TOUTES_COMMUNES } from '../../../../communes.ci';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-naissances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './naissances.html',
  styleUrls: ['./naissances.css']
})
export class NaissancesComponent implements OnInit {

  @Input() dbNaissances: any[] = [];
  @Output() updateNaissances = new EventEmitter<any>();
  @Output() showToast = new EventEmitter<string>();

  naissancesDB: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getNaissances().subscribe({
      next: (data) => this.naissancesDB = data,
      error: () => {}
    });
  }

  currentSection = signal('naissances');

  currentTabs = signal({
    naissances: 'decl'
  });

  communesList = TOUTES_COMMUNES;

  searchQuery = '';

  naissanceForm = {
    nom: '',
    prenom: '',
    date: '',
    heure: '',
    sexe: '',
    lieu: '',
    commune: 'Cocody',

    pNom: '',
    pProf: '',
    pNat: '',
    piecePere: null as File | null,

    mNom: '',
    mProf: '',
    mNat: '',
    pieceMere: null as File | null
  };

  // Liste des tribunaux
  tribunauxList = [
    'TPI Abengourou',
    'TPI Abidjan (Plateau)',
    'TPI Abidjan-Yopougon',
    'TPI Aboisso',
    'TPI Bondoukou',
    'TPI Bouaké',
    'TPI Bouna',
    'TPI Boundiali',
    'TPI Daloa',
    'TPI Dimbokro',
    'TPI Divo',
    'TPI Ferkessédougou',
    'TPI Gagnoa',
    'TPI Guiglo',
    'TPI Katiola',
    'TPI Korhogo',
    'TPI Man',
    'TPI Odienné',
    'TPI San-Pédro',
    'TPI Sassandra',
    'TPI Séguéla',
    'TPI Soubré',
    'TPI Touba',
    'TPI Toumodi'
  ];

  jugementForm = {
    nom: '',
    lieu: '',
    date: '',
    trib: 'TPI Abidjan (Plateau)',
    jdate: '',
    pieceIdentite: null as File | null
  };

  adoptionForm = {
    enfantNom: '', 
    enfantDateNaissance: '',
    enfantLieuNaissance: '',
    // Père adoptant
    adoptantPereNom: '',
    adoptantPereProf: '',
    adoptantPereNat: 'Ivoirienne',
    piecePereAdoptant: null as File | null,
    // Mère adoptante
    adoptantMereNom: '',
    adoptantMereProf: '',
    adoptantMereNat: 'Ivoirienne',
    pieceMereAdoptante: null as File | null,
    // Jugement
    tribunal: 'TPI Abidjan (Plateau)',
    dateJugement: '',
    typeAdoption: 'Pleine',
    pieceJugement: null as File | null
  };

  // Méthodes pour l'adoption
  onAdoptionPereFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.adoptionForm.piecePereAdoptant = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(input.files[0].type)) {
        this.showToast.emit("Format non supporté. Utilisez JPG, PNG ou PDF.");
        this.adoptionForm.piecePereAdoptant = null;
        return;
      }
      this.showToast.emit(`✓ Pièce d'identité du père adoptant chargée: ${input.files[0].name}`);
    }
  }

  onAdoptionMereFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.adoptionForm.pieceMereAdoptante = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(input.files[0].type)) {
        this.showToast.emit("Format non supporté. Utilisez JPG, PNG ou PDF.");
        this.adoptionForm.pieceMereAdoptante = null;
        return;
      }
      this.showToast.emit(`✓ Pièce d'identité de la mère adoptante chargée: ${input.files[0].name}`);
    }
  }

  onAdoptionJugementFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.adoptionForm.pieceJugement = input.files[0];
      if (input.files[0].type !== 'application/pdf') {
        this.showToast.emit("Format non supporté. Utilisez PDF.");
        this.adoptionForm.pieceJugement = null;
        return;
      }
      this.showToast.emit(`✓ Jugement chargé: ${input.files[0].name}`);
    }
  }

  resetAdoptionForm() {
    this.adoptionForm = { 
      enfantNom: '', 
      enfantDateNaissance: '',
      enfantLieuNaissance: '',
      adoptantPereNom: '',
      adoptantPereProf: '',
      adoptantPereNat: 'Ivoirienne',
      piecePereAdoptant: null,
      adoptantMereNom: '',
      adoptantMereProf: '',
      adoptantMereNat: 'Ivoirienne',
      pieceMereAdoptante: null,
      tribunal: 'TPI Abidjan (Plateau)',
      dateJugement: '',
      typeAdoption: 'Pleine',
      pieceJugement: null
    };
    this.showToast.emit("Formulaire d'adoption réinitialisé");
  }

  enregistrerAdoption() {
    const f = this.adoptionForm;
    if (!f.enfantNom || !f.adoptantPereNom || !f.adoptantMereNom || !f.dateJugement) {
      this.showToast.emit("Veuillez renseigner tous les champs obligatoires");
      return;
    }

    const parts = f.enfantNom.trim().split(' ');
    const payload = {
      nom: parts[0],
      prenom: parts.slice(1).join(' ') || '',
      date_naissance: f.enfantDateNaissance || null,
      lieu_naissance: f.enfantLieuNaissance,
      pere_nom: f.adoptantPereNom,
      pere_profession: f.adoptantPereProf,
      pere_nationalite: f.adoptantPereNat,
      mere_nom: f.adoptantMereNom,
      mere_profession: f.adoptantMereProf,
      mere_nationalite: f.adoptantMereNat,
      tribunal: f.tribunal,
      date_jugement: f.dateJugement,
      type: 'Adoption',
    };

    this.api.createNaissance(payload).subscribe({
      next: (res) => {
        this.naissancesDB = [res, ...this.naissancesDB];
        this.showToast.emit(`Adoption enregistrée pour ${f.enfantNom} — N° ${res.numero}`);
        this.resetAdoptionForm();
      },
      error: () => this.showToast.emit("Erreur lors de l'enregistrement de l'adoption")
    });
  }

  duplicataForm = {
    type: 'naissance',
    num: '',
    dem: '',
    motif: ''
  };

  switchTab(section: string, tab: string): void {
    this.currentTabs.update(tabs => ({
      ...tabs,
      [section]: tab
    }));
  }

  onPereFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.naissanceForm.piecePere = input.files[0];
    }
  }

  onMereFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.naissanceForm.pieceMere = input.files[0];
    }
  }

  filteredNaissances() {
    const source = this.naissancesDB.length ? this.naissancesDB : this.dbNaissances;
    if (!this.searchQuery.trim()) return source;
    const search = this.searchQuery.toLowerCase();
    return source.filter(item =>
      item.nomComplet?.toLowerCase().includes(search) ||
      item.numero?.toLowerCase().includes(search)
    );
  }

  enregistrerNaissance(): void {
    if (!this.naissanceForm.nom || !this.naissanceForm.prenom || !this.naissanceForm.date) {
      this.showToast.emit('Veuillez remplir les champs obligatoires');
      return;
    }

    const payload = {
      nom: this.naissanceForm.nom,
      prenom: this.naissanceForm.prenom,
      date_naissance: this.naissanceForm.date,
      heure_naissance: this.naissanceForm.heure,
      sexe: this.naissanceForm.sexe,
      lieu_naissance: this.naissanceForm.lieu,
      commune: this.naissanceForm.commune,
      pere_nom: this.naissanceForm.pNom,
      pere_profession: this.naissanceForm.pProf,
      pere_nationalite: this.naissanceForm.pNat,
      mere_nom: this.naissanceForm.mNom,
      mere_profession: this.naissanceForm.mProf,
      mere_nationalite: this.naissanceForm.mNat,
    };

    this.api.createNaissance(payload).subscribe({
      next: (res) => {
        this.naissancesDB = [res, ...this.naissancesDB];
        this.showToast.emit('Naissance enregistrée avec succès — N° ' + res.numero);
        const f = this.naissanceForm;
        this.genererPDF({
          numero: res.numero,
          nom: f.nom, prenom: f.prenom,
          dateNaissance: f.date, heureNaissance: f.heure,
          sexe: f.sexe, lieuNaissance: f.lieu, commune: f.commune,
          pereNom: f.pNom, pereProf: f.pProf, pereNat: f.pNat,
          mereName: f.mNom, mereProf: f.mProf, mereNat: f.mNat,
        });
        this.resetForm('naissance');
      },
      error: () => this.showToast.emit('Erreur lors de l\'enregistrement')
    });
  }

  // Méthode pour gérer l'upload du fichier
  onJugementFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.jugementForm.pieceIdentite = input.files[0];
      
      // Vérification du type de fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(input.files[0].type)) {
        this.showToast.emit("Format non supporté. Utilisez JPG, PNG ou PDF.");
        this.jugementForm.pieceIdentite = null;
        return;
      }
      
      this.showToast.emit(`✓ Pièce d'identité chargée: ${input.files[0].name}`);
    }
  }

  enregistrerJugement() {
    if (!this.jugementForm.nom || !this.jugementForm.date) {
      this.showToast.emit("Nom et date requis");
      return;
    }

    if (!this.jugementForm.pieceIdentite) {
      const ok = window.confirm("Aucune pièce d'identité n'a été chargée. Voulez-vous continuer quand même ?");
      if (!ok) return;
    }

    const payload = {
      nom: this.jugementForm.nom,
      prenom: '',
      date_naissance: this.jugementForm.date,
      lieu_naissance: this.jugementForm.lieu,
      tribunal: this.jugementForm.trib,
      date_jugement: this.jugementForm.jdate || null,
      type: 'Jugement',
    };

    this.api.createNaissance(payload).subscribe({
      next: (res) => {
        this.naissancesDB = [res, ...this.naissancesDB];
        this.showToast.emit(`Jugement supplétif transcrit sous le N° ${res.numero}`);
        this.jugementForm = { nom: '', date: '', lieu: '', trib: 'TPI Abidjan (Plateau)', jdate: '', pieceIdentite: null };
      },
      error: () => this.showToast.emit("Erreur lors de l'enregistrement du jugement")
    });
  }

  delivrerDuplicata(): void {
    console.log('Duplicata demandé', this.duplicataForm);
    this.showToast.emit('Duplicata généré');
  }

  exportJSON(type: string): void {

    const data = JSON.stringify(this.dbNaissances, null, 2);

    const blob = new Blob(
      [data],
      { type: 'application/json' }
    );

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = `${type}.json`;

    a.click();

    window.URL.revokeObjectURL(url);
  }

  imprimer(type: string, numero: string): void {
    const item = this.naissancesDB.find(n => n.numero === numero);
    if (item) {
      this.genererPDF({
        numero: item.numero,
        nom: item.nomComplet?.split(' ')[0] ?? '',
        prenom: item.nomComplet?.split(' ').slice(1).join(' ') ?? '',
        dateNaissance: item.dateNaissance ?? '',
        heureNaissance: '',
        sexe: '',
        lieuNaissance: item.lieu ?? '',
        commune: item.commune ?? '',
        pereNom: item.pereNom ?? '',
        mereName: item.mereNom ?? '',
      });
    }
  }

  genererPDF(data: {
    numero: string; nom: string; prenom: string;
    dateNaissance: string; heureNaissance: string; sexe: string;
    lieuNaissance: string; commune: string; pereNom: string; mereName: string;
    pereProf?: string; mereProf?: string; pereNat?: string; mereNat?: string;
  }): void {
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Acte de Naissance — ${data.numero}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 11pt; color: #000; background: #fff; }
  .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 18mm 20mm 14mm; }

  /* ── EN-TÊTE ── */
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6mm; }
  .header-left, .header-right { text-align: center; font-size: 9pt; line-height: 1.5; width: 45mm; }
  .header-center { text-align: center; flex: 1; }
  .republic { font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
  .motto { font-size: 9pt; font-style: italic; color: #333; }
  .ministry { font-size: 8.5pt; margin-top: 2mm; font-weight: bold; text-transform: uppercase; }
  .sub-ministry { font-size: 8pt; color: #444; }

  /* ── BANDE TRICOLORE ── */
  .flag-bar { height: 5px; background: linear-gradient(90deg, #F77F00 33.3%, #fff 33.3% 66.6%, #009A44 66.6%); margin: 3mm 0; border: 0.5px solid #ccc; }

  /* ── COMMUNE & INFOS ── */
  .commune-box { text-align: center; margin: 3mm 0 5mm; }
  .commune-title { font-size: 9pt; text-transform: uppercase; }
  .commune-name { font-size: 12pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #000; display: inline-block; padding: 0 10mm; margin-top: 1mm; }

  /* ── TITRE PRINCIPAL ── */
  .doc-title { text-align: center; margin: 5mm 0 4mm; }
  .doc-title h1 { font-size: 17pt; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border: 2px solid #000; display: inline-block; padding: 3mm 10mm; }
  .doc-number { font-size: 10pt; margin-top: 3mm; }

  /* ── CORPS ── */
  .body-text { line-height: 1.9; font-size: 10.5pt; text-align: justify; margin: 4mm 0; }
  .body-text .field { border-bottom: 1px solid #333; display: inline-block; min-width: 50mm; padding: 0 1mm; font-weight: bold; }
  .body-text .label { font-style: italic; }

  /* ── SECTIONS ── */
  .section-title { font-size: 10pt; font-weight: bold; text-transform: uppercase; border-left: 3px solid #F77F00; padding-left: 3mm; margin: 5mm 0 2mm; letter-spacing: 0.5px; }

  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1mm 6mm; margin: 2mm 0 4mm; }
  .info-row { display: flex; align-items: baseline; gap: 2mm; font-size: 10pt; border-bottom: 0.5px dotted #aaa; padding: 1.5mm 0; }
  .info-label { font-size: 9pt; color: #555; white-space: nowrap; min-width: 38mm; }
  .info-value { font-weight: bold; flex: 1; }

  /* ── MENTIONS ── */
  .mentions { font-size: 8.5pt; color: #555; border: 0.5px solid #ccc; padding: 3mm 4mm; margin: 4mm 0; background: #fafafa; }

  /* ── SIGNATURES ── */
  .signatures { display: flex; justify-content: space-between; margin-top: 12mm; }
  .sig-block { text-align: center; width: 55mm; }
  .sig-title { font-size: 9pt; font-weight: bold; text-transform: uppercase; margin-bottom: 1mm; }
  .sig-sub { font-size: 8pt; color: #555; }
  .sig-line { border-bottom: 1px solid #000; height: 16mm; margin: 2mm 0; }
  .sig-name { font-size: 9pt; }

  /* ── PIED ── */
  .footer { border-top: 1.5px solid #000; margin-top: 8mm; padding-top: 3mm; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-left { font-size: 8pt; color: #555; }
  .footer-right { font-size: 8pt; text-align: right; color: #555; }
  .qr-placeholder { width: 20mm; height: 20mm; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 6pt; color: #999; text-align: center; line-height: 1.3; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { padding: 12mm 16mm 10mm; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- EN-TÊTE -->
  <div class="header">
    <div class="header-left">
      <div style="font-size:8pt">REPUBLIQUE DE</div>
      <div style="font-weight:bold;font-size:10pt">CÔTE D'IVOIRE</div>
      <div style="font-size:8pt;color:#555">Union — Discipline — Travail</div>
      <div style="margin-top:4mm;font-size:8pt;font-weight:bold">MINISTÈRE DE L'INTÉRIEUR</div>
      <div style="font-size:7.5pt;color:#444">Direction Générale<br>de la Décentralisation<br>et du Développement Local</div>
    </div>
    <div class="header-center">
      <div class="flag-bar"></div>
      <div class="commune-box">
        <div class="commune-title">Commune de</div>
        <div class="commune-name">${data.commune || '___________________'}</div>
      </div>
      <div style="font-size:8pt;color:#666;margin-top:2mm">SERVICE DE L'ÉTAT CIVIL</div>
    </div>
    <div class="header-right">
      <div class="qr-placeholder">QR<br>${data.numero}</div>
      <div style="font-size:7pt;color:#888;margin-top:1mm">Vérification<br>en ligne</div>
    </div>
  </div>

  <div class="flag-bar"></div>

  <!-- TITRE -->
  <div class="doc-title">
    <h1>Acte de Naissance</h1>
    <div class="doc-number">N° <strong>${data.numero}</strong></div>
  </div>

  <!-- CORPS RÉDIGÉ -->
  <div class="body-text">
    L'an deux mille vingt-cinq et le <span class="field">${data.dateNaissance}</span>
    ${data.heureNaissance ? `à <span class="field">${data.heureNaissance}</span>` : ''},
    par devant nous, Officier de l'État Civil de la Commune de <span class="field">${data.commune || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</span>,
    est comparu(e) le déclarant soussigné qui nous a présenté un enfant de sexe
    <span class="field">${data.sexe || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</span>
    né(e) le <span class="field">${data.dateNaissance}</span>
    à <span class="field">${data.lieuNaissance || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</span>
    et auquel il a été donné les prénoms et noms de :
  </div>

  <!-- NOM ENFANT EN GRAND -->
  <div style="text-align:center;margin:4mm 0;padding:3mm;border:1.5px solid #000;">
    <div style="font-size:7pt;letter-spacing:2px;color:#555;text-transform:uppercase;margin-bottom:1mm">Nom et prénoms de l'enfant</div>
    <div style="font-size:16pt;font-weight:bold;text-transform:uppercase;letter-spacing:2px">${data.nom} ${data.prenom}</div>
  </div>

  <!-- INFORMATIONS DE L'ENFANT -->
  <div class="section-title">Informations de l'enfant</div>
  <div class="info-grid">
    <div class="info-row"><span class="info-label">Nom de famille :</span><span class="info-value">${data.nom}</span></div>
    <div class="info-row"><span class="info-label">Prénoms :</span><span class="info-value">${data.prenom}</span></div>
    <div class="info-row"><span class="info-label">Date de naissance :</span><span class="info-value">${data.dateNaissance}</span></div>
    <div class="info-row"><span class="info-label">Heure de naissance :</span><span class="info-value">${data.heureNaissance || '—'}</span></div>
    <div class="info-row"><span class="info-label">Sexe :</span><span class="info-value">${data.sexe || '—'}</span></div>
    <div class="info-row"><span class="info-label">Lieu de naissance :</span><span class="info-value">${data.lieuNaissance || '—'}</span></div>
    <div class="info-row"><span class="info-label">Commune :</span><span class="info-value">${data.commune || '—'}</span></div>
  </div>

  <!-- PÈRE -->
  <div class="section-title">Informations du père</div>
  <div class="info-grid">
    <div class="info-row"><span class="info-label">Nom et prénoms :</span><span class="info-value">${data.pereNom || '—'}</span></div>
    <div class="info-row"><span class="info-label">Profession :</span><span class="info-value">${data.pereProf || '—'}</span></div>
    <div class="info-row"><span class="info-label">Nationalité :</span><span class="info-value">${data.pereNat || 'Ivoirienne'}</span></div>
  </div>

  <!-- MÈRE -->
  <div class="section-title">Informations de la mère</div>
  <div class="info-grid">
    <div class="info-row"><span class="info-label">Nom et prénoms :</span><span class="info-value">${data.mereName || '—'}</span></div>
    <div class="info-row"><span class="info-label">Profession :</span><span class="info-value">${data.mereProf || '—'}</span></div>
    <div class="info-row"><span class="info-label">Nationalité :</span><span class="info-value">${data.mereNat || 'Ivoirienne'}</span></div>
  </div>

  <!-- MENTIONS LÉGALES -->
  <div class="mentions">
    <strong>Mentions marginales :</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <br><br>
    Dont acte a été dressé en présence des témoins soussignés et après lecture faite, les parties ont signé avec nous.
  </div>

  <!-- SIGNATURES -->
  <div class="signatures">
    <div class="sig-block">
      <div class="sig-title">Le Père / Déclarant</div>
      <div class="sig-line"></div>
      <div class="sig-name">${data.pereNom || '&nbsp;'}</div>
    </div>
    <div class="sig-block">
      <div class="sig-title">La Mère</div>
      <div class="sig-line"></div>
      <div class="sig-name">${data.mereName || '&nbsp;'}</div>
    </div>
    <div class="sig-block">
      <div class="sig-title">L'Officier d'État Civil</div>
      <div class="sig-sub">Commune de ${data.commune || '___'}</div>
      <div class="sig-line"></div>
      <div style="margin-top:1mm;font-size:8pt">Lu et approuvé</div>
    </div>
  </div>

  <!-- PIED DE PAGE -->
  <div class="footer">
    <div class="footer-left">
      <div>Délivré le : ${today}</div>
      <div>Réf. GMDI/EC/${data.numero}</div>
      <div style="margin-top:1mm;font-size:7.5pt;color:#888">Ce document est établi conformément à la loi n°83-799<br>du 02 août 1983 portant état civil en Côte d'Ivoire.</div>
    </div>
    <div class="footer-right">
      <div style="font-size:7.5pt;color:#888">GMDI — Gestion Modernisée des Documents d'Identité</div>
      <div style="font-size:7pt;color:#aaa;margin-top:1mm">Document généré électroniquement — Valable avec cachet officiel</div>
    </div>
  </div>

</div>
<script>window.onload = function(){ window.print(); }</script>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=900,height=700');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  resetForm(type: string): void {

    if (type === 'naissance') {

      this.naissanceForm = {
        nom: '',
        prenom: '',
        date: '',
        heure: '',
        sexe: '',
        lieu: '',
        commune: '',

        pNom: '',
        pProf: '',
        pNat: '',
        piecePere: null,

        mNom: '',
        mProf: '',
        mNat: '',
        pieceMere: null
      };
    }
  }
}