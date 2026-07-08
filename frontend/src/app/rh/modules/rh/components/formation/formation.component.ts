import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RhService } from '../../../../core/services/rh.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast.component';
import { FcfaPipe } from '../../../../shared/pipes/fcfa.pipe';

type Tab = 'plan' | 'eval' | 'certif';

// Interface pour les critères d'évaluation
interface CritereEval {
  id: string;
  nom: string;
  description: string;
  note: number; // 0-4
  coefficient: number;
}

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent, FcfaPipe],
  template: `
<div class="nav">
  @for (t of tabs; track t.id) {
    <div class="ni" [class.act]="activeTab() === t.id" (click)="activeTab.set(t.id)">
      <i class="ti {{ t.icon }}"></i>{{ t.label }}
    </div>
  }
</div>

<!-- ── Plan de formation ───────────────────────────────────────────────── -->
@if (activeTab() === 'plan') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-list-check"></i>Plan de formation 2025</h3></div>
    <app-toast [visible]="toast.get('f')?.visible ?? false" [message]="toast.get('f')?.message ?? ''" [type]="toast.get('f')?.type ?? 'success'" />
    <div class="pb">
      <div class="fs">Nouvelle formation</div>
      
      <div class="fr">
        <div class="fg">
          <div class="fl">Intitulé de la formation <span class="req">*</span></div>
          <input class="fi" [(ngModel)]="fo.titre" placeholder="Ex: Formation GMDI — État Civil">
        </div>
        <div class="fg">
          <div class="fl">Organisme formateur <span class="req">*</span></div>
          <input class="fi" [(ngModel)]="fo.organisme" placeholder="Ex: DSI Mairie / CGECI">
        </div>
      </div>
      
      <div class="fr">
        <div class="fg" style="grid-column:span 2">
          <div class="fl">Nom du formateur <span class="req">*</span></div>
          <input class="fi" [(ngModel)]="fo.formateur" placeholder="Ex: M. KOUADIO Jean, Mme TRAORÉ Aminata...">
        </div>
      </div>
      
      <div class="fr3">
        <div class="fg">
          <div class="fl">Date de début <span class="req">*</span></div>
          <input class="fi" type="date" [(ngModel)]="fo.dateDebut">
        </div>
        <div class="fg">
          <div class="fl">Date de fin <span class="req">*</span></div>
          <input class="fi" type="date" [(ngModel)]="fo.dateFin">
        </div>
        <div class="fg">
          <div class="fl">Coût (FCFA)</div>
          <input class="fi" type="number" [(ngModel)]="fo.cout" placeholder="0 si interne">
        </div>
      </div>
      
      <div class="fr">
        <div class="fg" style="grid-column:span 2">
          <div class="fl">Agents inscrits (matricules séparés par virgule)</div>
          <input class="fi" [(ngModel)]="fo.agents" placeholder="Ex: EC-001, RH-002, ST-001">
        </div>
      </div>
      
      <div class="fa">
        <button class="bp" (click)="planifier()"><i class="ti ti-check"></i>Planifier la formation</button>
      </div>

      <div class="fs" style="margin-top:.75rem">Formations planifiées</div>
      <table class="tbl">
        <thead>
          <tr>
            <th>Formation</th>
            <th>Organisme</th>
            <th>Formateur</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Agents</th>
            <th>Coût</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          @for (f of rh.formations(); track f.id) {
            <tr>
              <td class="bold">{{ f.titre }}</td>
              <td>{{ f.organisme }}</td>
              <td>{{ f.formateur || '—' }}</td>
              <td>{{ f.dateDebut }}</td>
              <td>{{ f.dateFin }}</td>
              <td>{{ f.agents }}</td>
              <td class="right">{{ f.cout > 0 ? (f.cout | fcfa) : 'Interne' }}</td>
              <td><span class="chip cb">{{ f.statut }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
}

<!-- ── Évaluations avec grille de critères ───────────────────────────────── -->
@if (activeTab() === 'eval') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-star"></i>Grille d'évaluation des agents</h3></div>
    <app-toast [visible]="toast.get('ev')?.visible ?? false" [message]="toast.get('ev')?.message ?? ''" [type]="toast.get('ev')?.type ?? 'success'" />
    <div class="pb">
      
      <!-- Informations de l'agent -->
      <div class="fs">👤 Informations de l'agent</div>
      <div class="fr3">
        <div class="fg">
          <div class="fl">Matricule de l'agent <span class="req">*</span></div>
          <input class="fi" [(ngModel)]="ev.matricule" placeholder="Ex: EC-001" (blur)="chargerAgent()">
        </div>
        <div class="fg">
          <div class="fl">Nom et prénoms</div>
          <input class="fi" [(ngModel)]="ev.nomAgent" placeholder="Auto-rempli" readonly style="background:#f8f9fa">
        </div>
        <div class="fg">
          <div class="fl">Évaluateur</div>
          <input class="fi" [(ngModel)]="ev.evaluateur" placeholder="Nom du supérieur hiérarchique">
        </div>
      </div>

      <!-- Grille des critères d'évaluation -->
      <div class="fs">📋 Critères d'évaluation</div>
      <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
        
        <!-- En-tête de la grille -->
        <div style="display: grid; grid-template-columns: 2fr 3fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr; gap: 0.5rem; margin-bottom: 0.75rem; font-size: 0.7rem; font-weight: 600; color: #003366; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem;">
          <div>Critère</div>
          <div>Description</div>
          <div style="text-align: center;">À éviter<br>(0)</div>
          <div style="text-align: center;">Insuffisant<br>(1)</div>
          <div style="text-align: center;">Satisfaisant<br>(2)</div>
          <div style="text-align: center;">Bien<br>(3)</div>
          <div style="text-align: center;">Excellent<br>(4)</div>
        </div>

        <!-- Ligne: Assiduité -->
        <div style="display: grid; grid-template-columns: 2fr 3fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr; gap: 0.5rem; margin-bottom: 0.75rem; align-items: center;">
          <div><strong>Assiduité</strong></div>
          <div style="font-size: 0.7rem; color: #6c757d;">Présence régulière et ponctualité</div>
          @for (note of [0,1,2,3,4]; track note) {
            <div style="text-align: center;">
              <input type="radio" name="assiduite" [value]="note" (change)="ev.assiduite = note" style="transform: scale(1.2); cursor: pointer;">
            </div>
          }
        </div>

        <!-- Ligne: Propreté / Tenue -->
        <div style="display: grid; grid-template-columns: 2fr 3fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr; gap: 0.5rem; margin-bottom: 0.75rem; align-items: center;">
          <div><strong>Propreté / Tenue</strong></div>
          <div style="font-size: 0.7rem; color: #6c757d;">Tenue professionnelle et hygiène</div>
          @for (note of [0,1,2,3,4]; track note) {
            <div style="text-align: center;">
              <input type="radio" name="proprete" [value]="note" (change)="ev.proprete = note" style="transform: scale(1.2); cursor: pointer;">
            </div>
          }
        </div>

        <!-- Ligne: Ponctualité -->
        <div style="display: grid; grid-template-columns: 2fr 3fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr; gap: 0.5rem; margin-bottom: 0.75rem; align-items: center;">
          <div><strong>Ponctualité</strong></div>
          <div style="font-size: 0.7rem; color: #6c757d;">Respect des horaires d'arrivée et départ</div>
          @for (note of [0,1,2,3,4]; track note) {
            <div style="text-align: center;">
              <input type="radio" name="ponctualite" [value]="note" (change)="ev.ponctualite = note" style="transform: scale(1.2); cursor: pointer;">
            </div>
          }
        </div>

        <!-- Ligne: Qualité du travail -->
        <div style="display: grid; grid-template-columns: 2fr 3fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr; gap: 0.5rem; margin-bottom: 0.75rem; align-items: center;">
          <div><strong>Qualité du travail</strong></div>
          <div style="font-size: 0.7rem; color: #6c757d;">Précision, soin et absence d'erreurs</div>
          @for (note of [0,1,2,3,4]; track note) {
            <div style="text-align: center;">
              <input type="radio" name="qualite" [value]="note" (change)="ev.qualite = note" style="transform: scale(1.2); cursor: pointer;">
            </div>
          }
        </div>

        <!-- Ligne: Productivité -->
        <div style="display: grid; grid-template-columns: 2fr 3fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr; gap: 0.5rem; margin-bottom: 0.75rem; align-items: center;">
          <div><strong>Productivité</strong></div>
          <div style="font-size: 0.7rem; color: #6c757d;">Rendement et respect des délais</div>
          @for (note of [0,1,2,3,4]; track note) {
            <div style="text-align: center;">
              <input type="radio" name="productivite" [value]="note" (change)="ev.productivite = note" style="transform: scale(1.2); cursor: pointer;">
            </div>
          }
        </div>

        <!-- Ligne: Initiative -->
        <div style="display: grid; grid-template-columns: 2fr 3fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr; gap: 0.5rem; margin-bottom: 0.75rem; align-items: center;">
          <div><strong>Initiative</strong></div>
          <div style="font-size: 0.7rem; color: #6c757d;">Proactivité et propositions d'amélioration</div>
          @for (note of [0,1,2,3,4]; track note) {
            <div style="text-align: center;">
              <input type="radio" name="initiative" [value]="note" (change)="ev.initiative = note" style="transform: scale(1.2); cursor: pointer;">
            </div>
          }
        </div>

        <!-- Ligne: Relation avec collègues -->
        <div style="display: grid; grid-template-columns: 2fr 3fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr; gap: 0.5rem; margin-bottom: 0.75rem; align-items: center;">
          <div><strong>Relation avec collègues</strong></div>
          <div style="font-size: 0.7rem; color: #6c757d;">Esprit d'équipe et entraide</div>
          @for (note of [0,1,2,3,4]; track note) {
            <div style="text-align: center;">
              <input type="radio" name="relation" [value]="note" (change)="ev.relation = note" style="transform: scale(1.2); cursor: pointer;">
            </div>
          }
        </div>

        <!-- Ligne: Relation avec hiérarchie -->
        <div style="display: grid; grid-template-columns: 2fr 3fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr; gap: 0.5rem; margin-bottom: 0.75rem; align-items: center;">
          <div><strong>Relation avec hiérarchie</strong></div>
          <div style="font-size: 0.7rem; color: #6c757d;">Respect et communication avec supérieurs</div>
          @for (note of [0,1,2,3,4]; track note) {
            <div style="text-align: center;">
              <input type="radio" name="hierarchie" [value]="note" (change)="ev.hierarchie = note" style="transform: scale(1.2); cursor: pointer;">
            </div>
          }
        </div>

        <!-- Ligne: Respect des règles -->
        <div style="display: grid; grid-template-columns: 2fr 3fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr; gap: 0.5rem; margin-bottom: 0.75rem; align-items: center;">
          <div><strong>Respect des règles</strong></div>
          <div style="font-size: 0.7rem; color: #6c757d;">Conformité aux procédures internes</div>
          @for (note of [0,1,2,3,4]; track note) {
            <div style="text-align: center;">
              <input type="radio" name="regles" [value]="note" (change)="ev.regles = note" style="transform: scale(1.2); cursor: pointer;">
            </div>
          }
        </div>
      </div>

      <!-- Résumé et mention calculée automatiquement -->
      <div class="fs">📊 Résultat de l'évaluation</div>
      <div style="background: linear-gradient(135deg, #f0f2f5, #ffffff); border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1rem;">
          <div style="text-align: center;">
            <div style="font-size: 0.7rem; color: #6c757d;">Note totale</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: #003366;">{{ noteTotale }}/40</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 0.7rem; color: #6c757d;">Note moyenne</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: #003366;">{{ noteMoyenne }}/4</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 0.7rem; color: #6c757d;">Pourcentage</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: #003366;">{{ pourcentage }}%</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 0.7rem; color: #6c757d;">Mention</div>
            <div style="font-size: 1.3rem; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 8px; background: {{ mentionColor }}; color: white;">
              {{ mention }}
            </div>
          </div>
        </div>
        
        <!-- Barre de progression -->
        <div class="kb" style="height: 8px; border-radius: 4px;">
          <div style="width: {{ pourcentage }}%; background: {{ mentionColor }}; height: 100%; border-radius: 4px;"></div>
        </div>
      </div>

      <!-- Commentaires -->
      <div class="fr">
        <div class="fg" style="grid-column:span 2">
          <div class="fl">Commentaires supplémentaires</div>
          <textarea class="fi" rows="3" [(ngModel)]="ev.commentaires" placeholder="Observations du supérieur hiérarchique..."></textarea>
        </div>
      </div>

      <!-- Boutons -->
      <div class="fa">
        <button class="bs" (click)="resetEval()"><i class="ti ti-x"></i>Réinitialiser</button>
        <button class="bp" (click)="enregistrerEval()"><i class="ti ti-check"></i>Enregistrer l'évaluation</button>
      </div>

      <!-- Historique des évaluations -->
      <div class="fs" style="margin-top: 1rem;">📜 Historique des évaluations</div>
      <table class="tbl">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Date</th>
            <th>Note totale</th>
            <th>Mention</th>
            <th>Évaluateur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (e of evaluationsListe; track e.id) {
            <tr>
              <td class="bold">{{ e.agent }}</td>
              <td>{{ e.date }}</td>
              <td>{{ e.noteTotale }}/40</td>
              <td><span class="chip" [style.background]="e.couleurMention" [style.color]="'white'">{{ e.mention }}</span></td>
              <td>{{ e.evaluateur }}</td>
              <td><button class="bti" title="Voir détails"><i class="ti ti-eye"></i></button></td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="empty">Aucune évaluation enregistrée</td></tr>
          }
        </tbody>
      </table>
    </div>
  </div>
}

<!-- ── Certifications ──────────────────────────────────────────────────── -->
@if (activeTab() === 'certif') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-certificate"></i>Certifications et attestations</h3></div>
    <app-toast [visible]="toast.get('cf')?.visible ?? false" [message]="toast.get('cf')?.message ?? ''" [type]="toast.get('cf')?.type ?? 'success'" />
    <div class="pb">
      <div class="fr">
        <div class="fg"><div class="fl">Matricule <span class="req">*</span></div><input class="fi" [(ngModel)]="cf.matricule" placeholder="Matricule de l'agent"></div>
        <div class="fg"><div class="fl">Type de certification</div>
          <select class="fsel" [(ngModel)]="cf.type">
            <option>Attestation de travail</option>
            <option>Certificat de formation</option>
            <option>Attestation d'assiduité</option>
            <option>Certificat de bonne conduite</option>
            <option>Autre</option>
          </select>
        </div>
      </div>
      <div class="fr">
        <div class="fg"><div class="fl">Date d'émission</div><input class="fi" type="date" [(ngModel)]="cf.dateEmission"></div>
        <div class="fg"><div class="fl">Destination</div><input class="fi" [(ngModel)]="cf.destination" placeholder="Ex: Ambassade, Banque, Université..."></div>
      </div>
      <div class="fa"><button class="bp" (click)="emettreAttestation()"><i class="ti ti-certificate"></i>Émettre l'attestation</button></div>
    </div>
  </div>
}
  `,
})
export class FormationComponent {
  constructor(readonly rh: RhService, readonly toast: ToastService) {}

  activeTab = signal<Tab>('plan');

  tabs = [
    { id: 'plan'   as Tab, label: 'Plan de formation', icon: 'ti-list-check'  },
    { id: 'eval'   as Tab, label: 'Évaluations',        icon: 'ti-star'        },
    { id: 'certif' as Tab, label: 'Certifications',     icon: 'ti-certificate' },
  ];

  // Plan de formation
  fo = { titre: '', organisme: '', formateur: '', dateDebut: '', dateFin: '', cout: 0, agents: '' };

  // Évaluations - Grille de critères
  ev = {
    matricule: '',
    nomAgent: '',
    evaluateur: '',
    assiduite: 0,
    proprete: 0,
    ponctualite: 0,
    qualite: 0,
    productivite: 0,
    initiative: 0,
    relation: 0,
    hierarchie: 0,
    regles: 0,
    commentaires: ''
  };

  // Liste des évaluations enregistrées
  evaluationsListe: any[] = [];

  // Certifications
  cf = { matricule: '', type: 'Attestation de travail', dateEmission: '', destination: '' };

  // Computed properties pour le calcul automatique
  get noteTotale(): number {
    return this.ev.assiduite + this.ev.proprete + this.ev.ponctualite + 
           this.ev.qualite + this.ev.productivite + this.ev.initiative + 
           this.ev.relation + this.ev.hierarchie + this.ev.regles;
  }

  get noteMoyenne(): number {
    return Number((this.noteTotale / 10).toFixed(1));
  }

  get pourcentage(): number {
    return Math.round((this.noteTotale / 40) * 100);
  }

  get mention(): string {
    const pourc = this.pourcentage;
    if (pourc >= 90) return 'Excellent ⭐⭐⭐';
    if (pourc >= 75) return 'Très bien ⭐⭐';
    if (pourc >= 60) return 'Bien ⭐';
    if (pourc >= 50) return 'Satisfaisant ✓';
    if (pourc >= 40) return 'Insuffisant ⚠️';
    return 'À améliorer ❌';
  }

  get mentionColor(): string {
    const pourc = this.pourcentage;
    if (pourc >= 90) return '#C9A84C';
    if (pourc >= 75) return '#009A44';
    if (pourc >= 60) return '#185FA5';
    if (pourc >= 50) return '#F77F00';
    if (pourc >= 40) return '#E24B4A';
    return '#6c757d';
  }

  // Charger les infos de l'agent automatiquement
  chargerAgent(): void {
    if (!this.ev.matricule) return;
    const agent = this.rh.findAgent(this.ev.matricule);
    if (agent) {
      this.ev.nomAgent = agent.nomComplet;
      this.toast.show('ev', `Agent trouvé: ${agent.nomComplet}`);
    } else {
      this.ev.nomAgent = '';
      this.toast.showError('ev', 'Agent non trouvé. Vérifiez le matricule.');
    }
  }

  // Réinitialiser le formulaire d'évaluation
  resetEval(): void {
    this.ev = {
      matricule: '',
      nomAgent: '',
      evaluateur: '',
      assiduite: 0,
      proprete: 0,
      ponctualite: 0,
      qualite: 0,
      productivite: 0,
      initiative: 0,
      relation: 0,
      hierarchie: 0,
      regles: 0,
      commentaires: ''
    };
    // Réinitialiser les radios
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => (radio as HTMLInputElement).checked = false);
  }

  // Enregistrer l'évaluation
  enregistrerEval(): void {
    if (!this.ev.matricule || !this.ev.nomAgent) {
      this.toast.showError('ev', 'Veuillez entrer un matricule valide');
      return;
    }

    const nouvelleEval = {
      id: Date.now().toString(),
      agent: this.ev.nomAgent,
      matricule: this.ev.matricule,
      date: new Date().toISOString().split('T')[0],
      noteTotale: this.noteTotale,
      noteMoyenne: this.noteMoyenne,
      pourcentage: this.pourcentage,
      mention: this.mention,
      couleurMention: this.mentionColor,
      evaluateur: this.ev.evaluateur || 'Non spécifié',
      commentaires: this.ev.commentaires,
      details: {
        assiduite: this.ev.assiduite,
        proprete: this.ev.proprete,
        ponctualite: this.ev.ponctualite,
        qualite: this.ev.qualite,
        productivite: this.ev.productivite,
        initiative: this.ev.initiative,
        relation: this.ev.relation,
        hierarchie: this.ev.hierarchie,
        regles: this.ev.regles
      }
    };

    this.evaluationsListe = [nouvelleEval, ...this.evaluationsListe];
    this.toast.show('ev', `Évaluation enregistrée — ${this.ev.nomAgent} — ${this.mention}`);
    this.resetEval();
  }

  // Planifier une formation
  planifier(): void {
    if (!this.fo.titre || !this.fo.organisme) { 
      this.toast.showError('f', 'Titre et organisme obligatoires'); 
      return; 
    }
    
    if (!this.fo.formateur) {
      this.toast.showError('f', 'Nom du formateur obligatoire');
      return;
    }
    
    this.rh.planifierFormation({
      titre: this.fo.titre,
      organisme: this.fo.organisme,
      formateur: this.fo.formateur,
      dateDebut: this.fo.dateDebut,
      dateFin: this.fo.dateFin,
      agents: this.fo.agents,
      cout: this.fo.cout || 0
    }).subscribe({
      next: () => this.toast.show('f', `Formation planifiée — ${this.fo.titre} (Formateur: ${this.fo.formateur})`),
      error: () => this.toast.showError('f', 'Erreur lors de la planification'),
    });
    
    this.fo = { 
      titre: '', 
      organisme: '', 
      formateur: '', 
      dateDebut: '', 
      dateFin: '', 
      cout: 0, 
      agents: '' 
    };
  }

  // Émettre une attestation
  emettreAttestation(): void {
    if (!this.cf.matricule) { 
      this.toast.showError('cf', 'Matricule obligatoire'); 
      return; 
    }
    this.toast.show('cf', `Attestation émise — ${this.cf.matricule} — ${this.cf.type}`);
  }
}