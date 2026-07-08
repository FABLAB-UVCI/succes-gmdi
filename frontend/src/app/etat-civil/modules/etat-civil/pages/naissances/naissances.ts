import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TOUTES_COMMUNES } from '../../../../communes.ci';
import { ApiService } from '../../../../services/api.service';
import { PrintService } from '../../../../services/print.service';
import { qrVerification, codeVerification, formatDateFr, formatHeureFr, openPrintWindow } from '../../pdf-utils';
import { genererActeMariagePDF } from '../mariages/mariages';
import { genererActeDecesPDF } from '../deces/deces';

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

  constructor(private api: ApiService, private printService: PrintService) { }

  ngOnInit() {
    this.api.getNaissances().subscribe({
      next: (data) => this.naissancesDB = data,
      error: () => { }
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
    pPrenom: '',
    pProf: '',
    pNat: '',
    piecePere: null as File | null,

    mNom: '',
    mPrenom: '',
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

  submitAttemptedAdoption = signal(false);

  enregistrerAdoption() {
    this.submitAttemptedAdoption.set(true);
    const f = this.adoptionForm;
    if (!f.enfantNom || !f.adoptantPereNom || !f.adoptantMereNom || !f.dateJugement) {
      this.showToast.emit("Veuillez renseigner tous les champs obligatoires (*)");
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
        this.submitAttemptedAdoption.set(false);
      },
      error: (err) => this.showToast.emit(err?.error?.message || "Erreur lors de l'enregistrement de l'adoption")
    });
  }

  duplicataForm = {
    type: 'naissance',
    recherche: '',
    dem: '',
    motif: ''
  };

  duplicataResults = signal<any[]>([]);
  duplicataSearched = signal(false);

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

  submitAttemptedNaissance = signal(false);

  enregistrerNaissance(): void {
    this.submitAttemptedNaissance.set(true);
    const f = this.naissanceForm;
    if (!f.nom || !f.prenom || !f.date || !f.sexe || !f.commune || !f.pNom || !f.pPrenom || !f.mNom || !f.mPrenom) {
      this.showToast.emit('Veuillez remplir les champs obligatoires (*)');
      return;
    }

    const pereNomComplet = `${f.pNom} ${f.pPrenom}`.trim();
    const mereNomComplet = `${f.mNom} ${f.mPrenom}`.trim();

    const payload = {
      nom: f.nom,
      prenom: f.prenom,
      date_naissance: f.date,
      heure_naissance: f.heure,
      sexe: f.sexe,
      lieu_naissance: f.lieu,
      commune: f.commune,
      pere_nom: pereNomComplet,
      pere_profession: f.pProf,
      pere_nationalite: f.pNat,
      mere_nom: mereNomComplet,
      mere_profession: f.mProf,
      mere_nationalite: f.mNat,
    };

    this.api.createNaissance(payload).subscribe({
      next: (res) => {
        this.naissancesDB = [res, ...this.naissancesDB];
        this.showToast.emit('Naissance enregistrée avec succès — N° ' + res.numero);
        genererExtraitNaissancePDF({
          numero: res.numero,
          nom: f.nom, prenom: f.prenom,
          dateNaissance: f.date, heureNaissance: f.heure,
          sexe: f.sexe, lieuNaissance: f.lieu, commune: f.commune,
          pereNom: pereNomComplet, pereProf: f.pProf, pereNat: f.pNat,
          mereNom: mereNomComplet, mereProf: f.mProf, mereNat: f.mNat,
        });
        this.resetForm('naissance');
        this.submitAttemptedNaissance.set(false);
      },
      error: (err) => this.showToast.emit(err?.error?.message || 'Erreur lors de l\'enregistrement')
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

  submitAttemptedJugement = signal(false);

  enregistrerJugement() {
    this.submitAttemptedJugement.set(true);
    if (!this.jugementForm.nom || !this.jugementForm.date) {
      this.showToast.emit("Nom et date requis (*)");
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
        this.submitAttemptedJugement.set(false);
      },
      error: (err) => this.showToast.emit(err?.error?.message || "Erreur lors de l'enregistrement du jugement")
    });
  }

  resetRechercheDuplicata(): void {
    this.duplicataResults.set([]);
    this.duplicataSearched.set(false);
  }

  rechercherDuplicata(): void {
    const q = this.duplicataForm.recherche.trim();
    if (!q) {
      this.showToast.emit('Saisissez un nom ou un numéro d\'acte');
      return;
    }
    const type = this.duplicataForm.type;

    if (type === 'mariage') {
      this.api.getMariages(q).subscribe({
        next: rows => {
          this.duplicataResults.set(rows.map(m => ({
            id: m.id, numero: m.numero,
            nomComplet: `${m.epoux} & ${m.epouse}`,
            date: m.dateMariage, type: 'Mariage', raw: m
          })));
          this.duplicataSearched.set(true);
        },
        error: () => this.showToast.emit('Erreur lors de la recherche')
      });
    } else if (type === 'deces') {
      this.api.getDeces(q).subscribe({
        next: rows => {
          this.duplicataResults.set(rows.map(d => ({
            id: d.id, numero: d.numero,
            nomComplet: d.nomComplet,
            date: d.dateDeces, type: 'Décès', raw: d
          })));
          this.duplicataSearched.set(true);
        },
        error: () => this.showToast.emit('Erreur lors de la recherche')
      });
    } else {
      const typeAttendu = type === 'jugement' ? 'Jugement' : type === 'adoption' ? 'Adoption' : 'Déclaration';
      this.api.getNaissances(q).subscribe({
        next: rows => {
          this.duplicataResults.set(rows
            .filter(n => (n.type ?? 'Déclaration') === typeAttendu)
            .map(n => ({
              id: n.id, numero: n.numero,
              nomComplet: n.nomComplet,
              date: n.dateNaissance, type: n.type ?? 'Déclaration', raw: n
            })));
          this.duplicataSearched.set(true);
        },
        error: () => this.showToast.emit('Erreur lors de la recherche')
      });
    }
  }

  imprimerDuplicata(r: any): void {
    const item = r.raw;
    if (r.type === 'Mariage') {
      genererActeMariagePDF({
        numero: item.numero, epoux: item.epoux, epouse: item.epouse,
        dateMariage: item.dateMariage, lieu: item.lieu, commune: item.commune,
        regime: item.regime,
        epouxProf: item.epouxProf, epouxNat: item.epouxNat,
        epouseProf: item.epouseProf, epouseNat: item.epouseNat,
        temoin1: item.temoin1, temoin1Prof: item.temoin1Prof,
        temoin2: item.temoin2, temoin2Prof: item.temoin2Prof
      });
    } else if (r.type === 'Décès') {
      genererActeDecesPDF({
        numero: item.numero, nom: item.nom ?? '', prenom: item.prenom ?? '',
        dob: item.dateNaissance, dateDeces: item.dateDeces, heureDeces: item.heureDeces,
        lieuDeces: item.lieu, commune: item.commune,
        causeDeces: item.cause, declarant: item.declarant, lien: item.lien
      });
    } else if (r.type === 'Adoption') {
      genererActeAdoptionPDF({
        numero: item.numero,
        nom: item.nom ?? item.nomComplet?.split(' ')[0] ?? '',
        prenom: item.prenom ?? item.nomComplet?.split(' ').slice(1).join(' ') ?? '',
        dateNaissance: item.dateNaissance ?? '',
        lieuNaissance: item.lieu ?? '',
        commune: item.commune ?? '',
        pereNom: item.pereNom ?? '', pereProf: item.pereProf ?? '', pereNat: item.pereNat ?? '',
        mereNom: item.mereNom ?? '', mereProf: item.mereProf ?? '', mereNat: item.mereNat ?? '',
        tribunal: item.tribunal ?? '', dateJugement: item.dateJugement ?? ''
      });
    } else {
      genererExtraitNaissancePDF({
        numero: item.numero,
        nom: item.nom ?? item.nomComplet?.split(' ')[0] ?? '',
        prenom: item.prenom ?? item.nomComplet?.split(' ').slice(1).join(' ') ?? '',
        dateNaissance: item.dateNaissance ?? '',
        heureNaissance: item.heureNaissance ?? '',
        sexe: item.sexe ?? '',
        lieuNaissance: item.lieu ?? '',
        commune: item.commune ?? '',
        pereNom: item.pereNom ?? '', pereProf: item.pereProf ?? '', pereNat: item.pereNat ?? '',
        mereNom: item.mereNom ?? '', mereProf: item.mereProf ?? '', mereNat: item.mereNat ?? ''
      });
    }
    this.showToast.emit(`Duplicata délivré — N° ${r.numero}`);
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
    if (!item) return;

    if ((item.type ?? type) === 'Adoption') {
      genererActeAdoptionPDF({
        numero: item.numero,
        nom: item.nom ?? item.nomComplet?.split(' ')[0] ?? '',
        prenom: item.prenom ?? item.nomComplet?.split(' ').slice(1).join(' ') ?? '',
        dateNaissance: item.dateNaissance ?? '',
        lieuNaissance: item.lieu ?? '',
        commune: item.commune ?? '',
        pereNom: item.pereNom ?? '', pereProf: item.pereProf ?? '', pereNat: item.pereNat ?? '',
        mereNom: item.mereNom ?? '', mereProf: item.mereProf ?? '', mereNat: item.mereNat ?? '',
        tribunal: item.tribunal ?? '', dateJugement: item.dateJugement ?? ''
      });
      return;
    }

    genererExtraitNaissancePDF({
      numero: item.numero,
      nom: item.nom ?? item.nomComplet?.split(' ')[0] ?? '',
      prenom: item.prenom ?? item.nomComplet?.split(' ').slice(1).join(' ') ?? '',
      dateNaissance: item.dateNaissance ?? '',
      heureNaissance: item.heureNaissance ?? '',
      sexe: item.sexe ?? '',
      lieuNaissance: item.lieu ?? '',
      commune: item.commune ?? '',
      pereNom: item.pereNom ?? '',
      pereProf: item.pereProf ?? '',
      pereNat: item.pereNat ?? '',
      mereNom: item.mereNom ?? '',
      mereProf: item.mereProf ?? '',
      mereNat: item.mereNat ?? '',
    });
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
        pPrenom: '',
        pProf: '',
        pNat: '',
        piecePere: null,
        mNom: '',
        mPrenom: '',
        mProf: '',
        mNat: '',
        pieceMere: null
      };
    }
  }

  imprimerDocument(html: string, nomDocument: string = 'Extrait-Acte-Naissance'): void {
    this.printService.printDocument(html, nomDocument);
    this.showToast.emit('Document ouvert pour impression...');
  }

  telechargerPDF(html: string, nomFichier: string = 'extrait-acte-naissance'): void {
    this.printService.downloadAsPDF(html, nomFichier);
    this.showToast.emit('Préparation du téléchargement PDF...');
  }
}

export async function genererExtraitNaissancePDF(data: {
  numero: string; nom: string; prenom: string;
  dateNaissance: string; heureNaissance: string; sexe: string;
  lieuNaissance: string; commune: string; pereNom: string; mereNom: string;
  pereProf?: string; mereProf?: string; pereNat?: string; mereNat?: string;
}): Promise<void> {
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const commune = data.commune || 'Cocody';
  const qr = await qrVerification(data.numero, 'Extrait de naissance', `${data.nom} ${data.prenom}`.trim());
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <base href="${document.baseURI}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Extrait d'Acte de Naissance</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&family=Roboto:wght@400;700&display=swap');

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        /* Conteneur principal simulant le format A4 papier */
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

        /* Bordure ornementale verte autour du document */
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

        /* Filigrane en diagonale "EXEMPLE DOCUMENT FICTIF" */
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

        /* En-tête principal */
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

        /* Titre du document */
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

        /* Layout du contenu central (Données à gauche, Illustrations/QR à droite) */
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

        /* Sections de données */
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

        /* Style spécifique pour mélanger minuscules/majuscules selon l'image */
        .value-cell.mixed {
            text-transform: none;
        }

        /* Éléments de la colonne de droite */
        .commune-illustration {
            width: 100%;
            /*border: 1px dashed #ccc;*/
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

        /* Pied de page : Sceau et Signatures */
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
            border-bottom: 1px dashed #777; /* Emplacement signature manuelle */
        }

        /* Note légale en bas */
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
        <!-- Bordure décorative -->
        <div class="border-ornament"></div>

        <!-- Filigrane de fond -->
        <div class="watermark">EXEMPLE DOCUMENT FICTIF</div>

        <!-- En-tête -->
        <table class="header-table">
            <tr>
                <!-- Logo et République -->
                <td class="header-left">
                    <div class="logo-placeholder">
                     <img src="armoirie_0.jpg" alt="Description de l'image" width="82" height="82">
                    </div>
                    RÉPUBLIQUE<br>DE CÔTE D'IVOIRE
                </td>
                
                <!-- Bloc Administratif Central -->
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

                <!-- Timbre Numérique et N° d'acte -->
                <td class="header-right">
                    <div class="numero-acte">N° ${data.numero}</div>
                    <div class="timbre-numerique">   
                        
                       <!--<div>TIMBRE NUMÉRIQUE OFFICIEL</div>
                        <div style="margin: 5px 0;">TN-24-5F7K-9M2P</div>
                        <div>27/05/2024</div>-->

                        <img src="timbre_numerique1.png" height="130" weight="130">



                    </div>
                    <div class="certif-box">Document Électronique<br>Certifié</div>
                </td>
            </tr>
        </table>

        <!-- Titre Principal -->
        <div class="title-section">
            <h1 class="main-title">EXTRAIT D'ACTE DE NAISSANCE</h1>
            <div class="subtitle">(Article 100 du Code des Personnes et de la Famille)</div>
        </div>

        <div class="intro-text">
            L'Officier de l'État Civil soussigné certifie qu'il résulte des registres des actes de naissance de la Commune de ${commune}, que l'acte dont les éléments sont ci-dessous relatés, a été dressé.
        </div>

        <!-- Corps du document éclaté en deux colonnes (Données / Éléments Visuels) -->
        <div class="content-container">
            
            <!-- Colonne de Gauche : Informations Textuelles -->
            <div class="left-data-column">
                
                <div class="section-title">Détails de l'acte</div>
                <table class="data-table">
                    <tr>
                        <td class="label-cell">Nom de l'enfant</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell">${data.nom || '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Prénoms</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell">${data.prenom || '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Sexe</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell">${data.sexe || '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Date de naissance</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">${formatDateFr(data.dateNaissance) || '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Heure de naissance</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">${formatHeureFr(data.heureNaissance) || '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Lieu de naissance</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">${data.lieuNaissance || '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Commune de naissance</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">${commune || '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Pays</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">Côte d'Ivoire</td>
                    </tr>
                </table>

                <div class="section-title">Filiation</div>
                <table class="data-table">
                    <tr>
                        <td class="label-cell">Père</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell">${data.pereNom || '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Profession</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">${data.pereProf || '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Nationalité</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">${data.pereNat || 'Ivoirienne'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Mère</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell">${data.mereNom || '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Profession</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">${data.mereProf || '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Nationalité</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">${data.mereNat || 'Ivoirienne'}</td>
                    </tr>
                </table>

                <div class="section-title">Mentions de l'acte</div>
                <table class="data-table">
                    <tr>
                        <td class="label-cell">Date de déclaration</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">${today}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Déclarant</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">${data.pereNom ? data.pereNom.toUpperCase() + ' (Père)' : '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Officier de l'état civil</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell">Kouassi N'Guessan Jean-Baptiste</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Date de délivrance</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">${today}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">N° de l'acte</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">${data.numero || '.......................'}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Observations</td>
                        <td class="separator-cell">:</td>
                        <td class="value-cell mixed">Néant</td>
                    </tr>
                </table>

            </div>

            <!-- Colonne de Droite : Graphismes, QR Code & Validation -->
            <div class="right-meta-column">
                
                <!-- Illustration Mairie -->
                <div class="commune-illustration">
                  <img src="Batiment_Mairie_Cocody.png" width="210" height="210">
                </div>

                <!-- Box de Vérification QR Code -->
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

        <!-- Zone Signature et Sceau de fin -->
        <div class="signature-section">
            <!-- Sceau rond Officier d'État civil -->
            <img src="seau.png" alt="sceau" width="" height="" class="seal-placeholder">
            <!-- Bloc Signature Date -->
            <div class="signature-box">
                <div>Fait à ${commune}, le ${today}</div>
                <div class="signature-title">L'Officier de l'État Civil</div>
                <div class="">
                <img src="Signature.png" alt="signature" width="150" height="60">
                <div>
            </div>
        </div>

        <!-- Mentions légales en bas de page -->
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

export async function genererActeAdoptionPDF(data: {
  numero: string; nom: string; prenom: string;
  dateNaissance: string; lieuNaissance: string; commune: string;
  pereNom: string; mereNom: string;
  pereProf?: string; mereProf?: string; pereNat?: string; mereNat?: string;
  tribunal?: string; dateJugement?: string;
}): Promise<void> {
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const commune = data.commune || 'Cocody';
  const qr = await qrVerification(data.numero, "Acte d'adoption", `${data.nom} ${data.prenom}`.trim());
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <base href="${document.baseURI}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acte d'Adoption</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&family=Roboto:wght@400;700&display=swap');

        * { box-sizing: border-box; }

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
            body { background-color: #ffffff; margin: 0; padding: 0; }
            .document-container { box-shadow: none; margin: 0; padding: 20mm; width: 100%; height: 100%; page-break-after: always; }
        }

        .border-ornament {
            border: 4px double #1e5c33;
            height: calc(100% - 10px);
            position: absolute;
            top: 5px; left: 5px; right: 5px; bottom: 5px;
            pointer-events: none;
            box-sizing: border-box;
        }

        .watermark {
            position: absolute;
            top: 45%; left: 50%;
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

        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .header-left { width: 25%; text-align: center; vertical-align: top; font-size: 11px; text-transform: uppercase; font-weight: bold; }
        .logo-placeholder { width: 80px; height: 80px; border: 1px dashed #ccc; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #777; }
        .header-center { width: 50%; text-align: center; vertical-align: top; }
        .republique { font-size: 16px; font-weight: bold; letter-spacing: 1px; margin-bottom: 2px; }
        .devise { font-size: 11px; font-style: italic; margin-bottom: 15px; }
        .ministere { font-size: 12px; font-weight: bold; line-height: 1.3; margin-bottom: 15px; }
        .administration { font-size: 11px; font-weight: bold; line-height: 1.3; }
        .header-right { width: 25%; text-align: center; vertical-align: top; }
        .numero-acte { font-size: 13px; font-weight: bold; margin-bottom: 10px; }
        .timbre-numerique { width: 120px; height: 120px; border: 2px solid #2b5797; border-radius: 50%; margin: 0 auto 5px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 9px; color: #2b5797; font-family: 'Roboto', sans-serif; font-weight: bold; text-align: center; padding: 5px; box-sizing: border-box; }
        .certif-box { border: 1px solid #2b5797; border-radius: 4px; font-size: 9px; color: #2b5797; padding: 3px; text-transform: uppercase; font-weight: bold; display: inline-block; margin-top: 5px; }

        .title-section { text-align: center; margin: 25px 0 15px; }
        .main-title { color: #1e5c33; font-size: 26px; font-weight: bold; letter-spacing: 1px; margin: 0 0 5px 0; }
        .subtitle { font-size: 12px; font-style: italic; margin-bottom: 15px; }
        .intro-text { font-size: 12px; text-align: justify; line-height: 1.5; margin-bottom: 20px; padding: 0 10px; }

        .content-container { display: flex; justify-content: space-between; position: relative; z-index: 2; }
        .left-data-column { width: 62%; }
        .right-meta-column { width: 35%; display: flex; flex-direction: column; align-items: center; }

        .section-title { color: #1e5c33; font-size: 13px; font-weight: bold; border-bottom: 1px none #ccc; margin: 15px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px; }
        .data-table td { padding: 3px 0; vertical-align: top; }
        .label-cell { width: 40%; color: #333; }
        .separator-cell { width: 5%; text-align: center; }
        .value-cell { width: 55%; font-weight: bold; text-transform: uppercase; }
        .value-cell.mixed { text-transform: none; }

        .commune-illustration { width: 100%; height: 110px; margin-bottom: 25px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 11px; color: #777; text-align: center; }
        .qr-verification-box { border: 1px solid #1e5c33; border-radius: 8px; padding: 12px; text-align: center; font-size: 10px; font-family: 'Roboto', sans-serif; background-color: #fff; width: 90%; box-sizing: border-box; }
        .qr-title { font-weight: bold; color: #1e5c33; margin-bottom: 8px; font-size: 11px; }
        .qr-placeholder { width: 110px; height: 110px; border: 1px solid #000; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; font-size: 10px; }
        .qr-text { line-height: 1.3; color: #333; margin-bottom: 5px; }
        .qr-code-verif { font-weight: bold; color: #2b5797; margin: 5px 0; }

        .signature-section { display: flex; justify-content: end; align-items: center; margin-top: 20px; padding: 0 20px 62px; position: relative; z-index: 2; }
        .seal-placeholder { width: 140px; height: 140px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #2b5797; text-align: center; }
        .signature-box { text-align: center; font-size: 12px; width: 220px; }
        .signature-title { font-style: italic; }
        .signature-line { height: 40px; border-bottom: 1px dashed #777; }

        .footer-legal-notice { position: absolute; bottom: -9px; left: 40px; right: 40px; border: 1px solid #1e5c33; padding: 10px; font-size: 10px; text-align: center; line-height: 1.4; background-color: #fff; z-index: 2; }
        .footer-pedagogic { margin-top: 5px; font-weight: bold; color: #1e5c33; }
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
            <h1 class="main-title">ACTE D'ADOPTION</h1>
            <div class="subtitle">(Articles 296 et suivants du Code des Personnes et de la Famille)</div>
        </div>

        <div class="intro-text">
            L'Officier de l'État Civil soussigné certifie qu'il résulte des registres des actes de naissance de la Commune de ${commune}, en vertu du jugement d'adoption ci-dessous mentionné, que l'enfant désigné a été légalement adopté(e) par les personnes ci-après identifiées comme parents adoptifs.
        </div>

        <div class="content-container">
            <div class="left-data-column">

                <div class="section-title">Identité de l'enfant adopté(e)</div>
                <table class="data-table">
                    <tr><td class="label-cell">Nom</td><td class="separator-cell">:</td><td class="value-cell">${data.nom || '.......................'}</td></tr>
                    <tr><td class="label-cell">Prénoms</td><td class="separator-cell">:</td><td class="value-cell">${data.prenom || '.......................'}</td></tr>
                    <tr><td class="label-cell">Date de naissance</td><td class="separator-cell">:</td><td class="value-cell mixed">${formatDateFr(data.dateNaissance) || '.......................'}</td></tr>
                    <tr><td class="label-cell">Lieu de naissance</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.lieuNaissance || '.......................'}</td></tr>
                    <tr><td class="label-cell">Pays</td><td class="separator-cell">:</td><td class="value-cell mixed">Côte d'Ivoire</td></tr>
                </table>

                <div class="section-title">Parents adoptifs</div>
                <table class="data-table">
                    <tr><td class="label-cell">Père adoptif</td><td class="separator-cell">:</td><td class="value-cell">${data.pereNom || '.......................'}</td></tr>
                    <tr><td class="label-cell">Profession</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.pereProf || '.......................'}</td></tr>
                    <tr><td class="label-cell">Nationalité</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.pereNat || 'Ivoirienne'}</td></tr>
                    <tr><td class="label-cell">Mère adoptive</td><td class="separator-cell">:</td><td class="value-cell">${data.mereNom || '.......................'}</td></tr>
                    <tr><td class="label-cell">Profession</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.mereProf || '.......................'}</td></tr>
                    <tr><td class="label-cell">Nationalité</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.mereNat || 'Ivoirienne'}</td></tr>
                </table>

                <div class="section-title">Jugement d'adoption</div>
                <table class="data-table">
                    <tr><td class="label-cell">Tribunal</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.tribunal || '.......................'}</td></tr>
                    <tr><td class="label-cell">Date du jugement</td><td class="separator-cell">:</td><td class="value-cell mixed">${formatDateFr(data.dateJugement || '') || '.......................'}</td></tr>
                </table>

                <div class="section-title">Mentions de l'acte</div>
                <table class="data-table">
                    <tr><td class="label-cell">Officier de l'état civil</td><td class="separator-cell">:</td><td class="value-cell">Kouassi N'Guessan Jean-Baptiste</td></tr>
                    <tr><td class="label-cell">Date de délivrance</td><td class="separator-cell">:</td><td class="value-cell mixed">${today}</td></tr>
                    <tr><td class="label-cell">N° de l'acte</td><td class="separator-cell">:</td><td class="value-cell mixed">${data.numero || '.......................'}</td></tr>
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
            Le présent acte est délivré par système électronique sécurisé et comporte un timbre numérique officiel. Il a la même valeur probante que l'original conformément aux dispositions de l'ordonnance n° 2019-312 du 20 mars 2019 relative à la dématérialisation des actes et documents administratifs.
            <div class="footer-pedagogic">EXEMPLE – DOCUMENT FICTIF – À DES FINS PÉDAGOGIQUES UNIQUEMENT</div>
        </div>

    </div>

</body>
</html>
`;

    openPrintWindow(html);
}
