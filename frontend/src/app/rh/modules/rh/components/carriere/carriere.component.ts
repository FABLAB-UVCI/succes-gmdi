import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RhService } from '../../../../core/services/rh.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast.component';

type Tab = 'recrutement' | 'affectation' | 'promotion' | 'mutation' | 'depart';

@Component({
  selector: 'app-carriere',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  template: `
<div class="nav">
  @for (t of tabs; track t.id) {
    <div class="ni" [class.act]="activeTab() === t.id" (click)="activeTab.set(t.id)">
      <i class="ti {{ t.icon }}"></i>{{ t.label }}
    </div>
  }
</div>

<!-- ── Recrutement ─────────────────────────────────────────────────────── -->
@if (activeTab() === 'recrutement') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-user-plus"></i>Ouverture d'un poste / concours</h3></div>
    <app-toast [visible]="toast.get('c')?.visible ?? false" [message]="toast.get('c')?.message ?? ''" [type]="toast.get('c')?.type ?? 'success'" />
    <div class="pb">
      <div class="fr">
        <div class="fg"><div class="fl">Intitulé du poste <span class="req">*</span></div><input class="fi" [(ngModel)]="rc.poste" placeholder="Ex: Agent de saisie État Civil"></div>
        <div class="fg"><div class="fl">Direction <span class="req">*</span></div>
          <select class="fsel" [(ngModel)]="rc.direction">
            <option value="">-- Choisir --</option>
            @for (d of directions; track d) { <option>{{ d }}</option> }
          </select>
        </div>
      </div>
      <div class="fr3">
        <div class="fg"><div class="fl">Nombre de postes <span class="req">*</span></div><input class="fi" type="number" [(ngModel)]="rc.nbPostes" placeholder="Ex: 3" min="1"></div>
        <div class="fg"><div class="fl">Type de recrutement</div>
          <select class="fsel" [(ngModel)]="rc.type">
            <option value="concours">Concours</option>
            <option value="direct">Recrutement direct</option>
            <option value="stage">Stage</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Date de clôture <span class="req">*</span></div><input class="fi" type="date" [(ngModel)]="rc.cloture"></div>
      </div>
      <div class="fr">
        <div class="fg"><div class="fl">Diplôme requis</div>
          <select class="fsel" [(ngModel)]="rc.diplome">
            <option>BAC</option><option>BTS / DUT</option><option>Licence</option><option>Master</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Salaire proposé (FCFA)</div><input class="fi" type="number" [(ngModel)]="rc.salaire" placeholder="Ex: 180000"></div>
      </div>
      <div class="fa">
        <button class="bp" (click)="ouvrirPoste()"><i class="ti ti-speakerphone"></i>Publier l'annonce</button>
      </div>
      <div class="fs" style="margin-top:.75rem">Recrutements en cours</div>
      <table class="tbl">
        <thead><tr><th>Poste</th><th>Direction</th><th>Postes</th><th>Type</th><th>Clôture</th><th>Candidatures</th><th>Statut</th></tr></thead>
        <tbody>
          @for (r of rh.recrutements(); track r.id) {
            <tr>
              <td class="bold">{{ r.poste }}</td>
              <td>{{ r.direction }}</td>
              <td>{{ r.nbPostes }}</td>
              <td><span class="chip cgo">{{ r.type }}</span></td>
              <td>{{ r.cloture || '—' }}</td>
              <td>{{ r.candidatures }}</td>
              <td><span class="chip" [ngClass]="chipRecr(r.statut)">{{ r.statut }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
}

<!-- ── Affectation ─────────────────────────────────────────────────────── -->
@if (activeTab() === 'affectation') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-arrows-transfer-up"></i>Affectation d'un agent</h3></div>
    <app-toast [visible]="toast.get('aff')?.visible ?? false" [message]="toast.get('aff')?.message ?? ''" [type]="toast.get('aff')?.type ?? 'success'" />
    <div class="pb">
      <div class="fr">
        <div class="fg"><div class="fl">Matricule de l'agent <span class="req">*</span></div><input class="fi" [(ngModel)]="aff.matricule" placeholder="Ex: EC-001"></div>
        <div class="fg"><div class="fl">Nom et prénoms</div><input class="fi" [(ngModel)]="aff.nom" placeholder="Auto-rempli après recherche"></div>
      </div>
      <div class="fr">
        <div class="fg"><div class="fl">Direction actuelle</div><input class="fi" [(ngModel)]="aff.dirActuelle" placeholder="Direction actuelle" readonly style="color:var(--color-text-secondary)"></div>
        <div class="fg"><div class="fl">Nouvelle direction <span class="req">*</span></div>
          <select class="fsel" [(ngModel)]="aff.dirNouvelle">
            <option value="">-- Choisir --</option>
            @for (d of directions; track d) { <option>{{ d }}</option> }
          </select>
        </div>
      </div>
      <div class="fr">
        <div class="fg"><div class="fl">Nouveau poste <span class="req">*</span></div><input class="fi" [(ngModel)]="aff.poste" placeholder="Intitulé du nouveau poste"></div>
        <div class="fg"><div class="fl">Date d'effet <span class="req">*</span></div><input class="fi" type="date" [(ngModel)]="aff.dateEffet"></div>
      </div>
      <div class="fr"><div class="fg" style="grid-column:span 2"><div class="fl">Motif de l'affectation</div><input class="fi" [(ngModel)]="aff.motif" placeholder="Ex: Renfort équipe, réorganisation..."></div></div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="validerAffectation()"><i class="ti ti-check"></i>Valider l'affectation</button></div>
    </div>
  </div>
}

<!-- ── Promotion ───────────────────────────────────────────────────────── -->
@if (activeTab() === 'promotion') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-trending-up"></i>Promotion d'un agent</h3></div>
    <app-toast [visible]="toast.get('prom')?.visible ?? false" [message]="toast.get('prom')?.message ?? ''" [type]="toast.get('prom')?.type ?? 'success'" />
    <div class="pb">
      <div class="fr">
        <div class="fg"><div class="fl">Matricule de l'agent <span class="req">*</span></div><input class="fi" [(ngModel)]="prom.matricule" placeholder="Ex: FIN-001"></div>
        <div class="fg"><div class="fl">Nom et prénoms</div><input class="fi" [(ngModel)]="prom.nom" placeholder="Nom de l'agent"></div>
      </div>
      <div class="fr">
        <div class="fg"><div class="fl">Grade actuel</div><input class="fi" [(ngModel)]="prom.gradeActuel" placeholder="Grade actuel"></div>
        <div class="fg"><div class="fl">Nouveau grade <span class="req">*</span></div><input class="fi" [(ngModel)]="prom.gradeNouveau" placeholder="Nouveau grade"></div>
      </div>
      <div class="fr">
        <div class="fg"><div class="fl">Ancien salaire (FCFA)</div><input class="fi" type="number" [(ngModel)]="prom.salActuel" placeholder="Salaire actuel"></div>
        <div class="fg"><div class="fl">Nouveau salaire (FCFA) <span class="req">*</span></div><input class="fi" type="number" [(ngModel)]="prom.salNouveau" placeholder="Nouveau salaire"></div>
      </div>
      <div class="fr">
        <div class="fg"><div class="fl">Date d'effet <span class="req">*</span></div><input class="fi" type="date" [(ngModel)]="prom.dateEffet"></div>
        <div class="fg"><div class="fl">Type de promotion</div>
          <select class="fsel" [(ngModel)]="prom.type">
            <option>Avancement à l'ancienneté</option>
            <option>Avancement au mérite</option>
            <option>Promotion exceptionnelle</option>
          </select>
        </div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="validerPromotion()"><i class="ti ti-trending-up"></i>Valider la promotion</button></div>
    </div>
  </div>
}

<!-- ── Mutation ────────────────────────────────────────────────────────── -->
@if (activeTab() === 'mutation') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-transfer"></i>Mutation d'un agent</h3></div>
    <app-toast [visible]="toast.get('mut')?.visible ?? false" [message]="toast.get('mut')?.message ?? ''" [type]="toast.get('mut')?.type ?? 'success'" />
    <div class="pb">
      <div class="fr">
        <div class="fg"><div class="fl">Matricule <span class="req">*</span></div><input class="fi" [(ngModel)]="mut.matricule" placeholder="Matricule de l'agent"></div>
        <div class="fg"><div class="fl">Nom et prénoms</div><input class="fi" [(ngModel)]="mut.nom" placeholder="Nom de l'agent"></div>
      </div>
      <div class="fr">
        <div class="fg"><div class="fl">Service d'origine</div><input class="fi" [(ngModel)]="mut.origine" placeholder="Ex: Mairie de Cocody"></div>
        <div class="fg"><div class="fl">Service d'accueil <span class="req">*</span></div><input class="fi" [(ngModel)]="mut.destination" placeholder="Ex: Mairie de Yopougon"></div>
      </div>
      <div class="fr">
        <div class="fg"><div class="fl">Date de mutation <span class="req">*</span></div><input class="fi" type="date" [(ngModel)]="mut.date"></div>
        <div class="fg"><div class="fl">Motif</div>
          <select class="fsel" [(ngModel)]="mut.motif">
            <option>Rapprochement familial</option><option>Nécessité de service</option>
            <option>Demande personnelle</option><option>Sanction disciplinaire</option>
          </select>
        </div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="validerMutation()"><i class="ti ti-check"></i>Valider la mutation</button></div>
    </div>
  </div>
}

<!-- Départ -->
@if (activeTab() === 'depart') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-door-exit"></i>Enregistrement de départ</h3></div>
    <app-toast [visible]="toast.get('dep')?.visible ?? false" [message]="toast.get('dep')?.message ?? ''" [type]="toast.get('dep')?.type ?? 'success'" />
    <div class="pb">
      <div class="fr">
        <div class="fg">
          <div class="fl">Matricule de l'agent <span class="req">*</span></div>
          <input class="fi" [(ngModel)]="depart.matricule" placeholder="Ex: EC-001">
        </div>
        <div class="fg">
          <div class="fl">Nom et prénoms</div>
          <input class="fi" [(ngModel)]="depart.nom" placeholder="Auto-rempli après recherche">
        </div>
      </div>

      <div class="fr">
        <div class="fg">
          <div class="fl">Cause du départ <span class="req">*</span></div>
          <select class="fsel" [(ngModel)]="depart.cause">
            <option value="" disabled selected>-- Sélectionnez une cause --</option>
            <optgroup label="Départ volontaire">
              <option value="demission">Démission</option>
              <option value="retraite">Retraite</option>
              <option value="retraite_anticipee">Retraite anticipée</option>
              <option value="abandon_poste">Abandon de poste</option>
              <option value="mutation_externe">Mutation externe (autre administration)</option>
            </optgroup>
            <optgroup label="Départ involontaire">
              <option value="licenciement">Licenciement</option>
              <option value="renvoi">Renvoi disciplinaire</option>
              <option value="fin_contrat">Fin de contrat (CDD non renouvelé)</option>
              <option value="fin_stage">Fin de stage non validé</option>
              <option value="suppression_poste">Suppression de poste</option>
              <option value="inaptitude">Inaptitude médicale</option>
            </optgroup>
            <optgroup label="Départ exceptionnel">
              <option value="deces">Décès de l'agent</option>
              <option value="invalidite">Invalidité</option>
              <option value="detachement">Détachement définitif</option>
              <option value="disponibilite">Mise en disponibilité prolongée</option>
            </optgroup>
          </select>
        </div>
        <div class="fg">
          <div class="fl">Date de départ <span class="req">*</span></div>
          <input class="fi" type="date" [(ngModel)]="depart.date">
        </div>
      </div>

      <div class="fr">
        <div class="fg">
          <div class="fl">Date de dernière présence</div>
          <input class="fi" type="date" [(ngModel)]="depart.dernierePresence">
        </div>
        <div class="fg">
          <div class="fl">Dernier salaire (FCFA)</div>
          <input class="fi" type="number" [(ngModel)]="depart.dernierSalaire" placeholder="Ex: 350000">
        </div>
      </div>

      <div class="fr">
        <div class="fg" style="grid-column: span 2">
          <div class="fl">Observations / Motif détaillé</div>
          <textarea class="fi" rows="3" [(ngModel)]="depart.observations" placeholder="Précisez le motif du départ..."></textarea>
        </div>
      </div>

      <div class="fr">
        <div class="fg">
          <div class="fl">Documents à fournir</div>
          <input class="fi" type="file" accept=".pdf,.jpg,.jpeg,.png" (change)="onDepartFileSelected($event)">
          @if (depart.pieceJointe) {
            <small style="color: green;">✓ Document chargé: {{ depart.pieceJointe.name }}</small>
          }
        </div>
      </div>

      <div class="fa">
        <button class="bs" (click)="resetDepart()"><i class="ti ti-x"></i>Effacer</button>
        <button class="bp" (click)="validerDepart()"><i class="ti ti-check"></i>Valider le départ</button>
      </div>

      <!-- Historique des départs -->
      <div class="fs" style="margin-top: 1rem;">Historique des départs récents</div>
      <table class="tbl">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Agent</th>
            <th>Cause</th>
            <th>Date de départ</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (d of rh.departs(); track d.id) {
            <tr>
              <td class="mono">{{ d.matricule }}</td>
              <td><strong>{{ d.nom }}</strong></td>
              <td><span class="chip" [ngClass]="chipCause(d.cause)">{{ labelCause(d.cause) }}</span></td>
              <td>{{ d.date }}</td>
              <td><span class="chip" [ngClass]="d.statut === 'valide' ? 'cv' : 'cp'">{{ d.statut === 'valide' ? 'Validé' : 'En attente' }}</span></td>
              <td>
                <button class="bti" title="Voir détails" (click)="voirDetailsDepart(d)"><i class="ti ti-eye"></i></button>
                @if (d.statut !== 'valide') {
                  <button class="bti ok" title="Valider" (click)="rh.validerDepart(d.id).subscribe()"><i class="ti ti-check"></i></button>
                }
                <button class="bti" title="Supprimer" (click)="rh.supprimerDepart(d.id).subscribe()"><i class="ti ti-trash"></i></button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="empty">Aucun départ enregistré</td></tr>
          }
        </tbody>
      </table>
    </div>
  </div>

}

  `,
})
export class CarriereComponent {
  constructor(readonly rh: RhService, readonly toast: ToastService) {}

  activeTab = signal<Tab>('recrutement');
  saving = signal(false);

  tabs = [
    { id: 'recrutement' as Tab, label: 'Recrutement', icon: 'ti-user-plus' },
    { id: 'affectation' as Tab, label: 'Affectation',  icon: 'ti-arrows-transfer-up' },
    { id: 'promotion'   as Tab, label: 'Promotion',    icon: 'ti-trending-up' },
    { id: 'mutation'    as Tab, label: 'Mutation',     icon: 'ti-transfer' },
    { id: 'depart'      as Tab, label: 'Départ',       icon: 'ti-door-exit' }
  ];

  directions = ['Direction État Civil','Direction Finances','DRH','Services Techniques','Direction Urbanisme'];

  rc = { poste:'', direction:'', nbPostes:1, type:'concours', cloture:'', diplome:'Licence', salaire: null as number|null };
  aff = { matricule:'', nom:'', dirActuelle:'', dirNouvelle:'', poste:'', dateEffet:'', motif:'' };
  prom = { matricule:'', nom:'', gradeActuel:'', gradeNouveau:'', salActuel: null as number|null, salNouveau: null as number|null, dateEffet:'', type:'Avancement à l\'ancienneté' };
  mut = { matricule:'', nom:'', origine:'', destination:'', date:'', motif:'Rapprochement familial' };

  ouvrirPoste(): void {
    if (!this.rc.poste || !this.rc.direction || !this.rc.cloture) {
      this.toast.showError('c', 'Poste, direction et date de clôture obligatoires'); return;
    }
    this.rh.ouvrirPoste({ poste: this.rc.poste, direction: this.rc.direction, nbPostes: this.rc.nbPostes, type: this.rc.type as any, cloture: this.rc.cloture }).subscribe({
      next: () => {
        this.toast.show('c', `Annonce publiée — ${this.rc.poste} (${this.rc.direction})`);
        this.rc = { poste:'', direction:'', nbPostes:1, type:'concours', cloture:'', diplome:'Licence', salaire: null };
      },
      error: () => this.toast.showError('c', 'Erreur lors de la création du poste'),
    });
  }

  validerAffectation(): void {
    if (!this.aff.matricule || !this.aff.dirNouvelle || !this.aff.poste || !this.aff.dateEffet) {
      this.toast.showError('aff', 'Matricule, nouveau poste, nouvelle direction et date d\'effet obligatoires'); return;
    }
    const agent = this.rh.findAgent(this.aff.matricule);
    if (!agent) { this.toast.showError('aff', `Agent introuvable — ${this.aff.matricule}`); return; }
    this.saving.set(true);
    this.rh.modifierAgent(agent.id, { direction: this.aff.dirNouvelle, poste: this.aff.poste }).subscribe({
      next: () => {
        this.toast.show('aff', `Affectation enregistrée — ${this.aff.matricule} → ${this.aff.dirNouvelle}`);
        this.saving.set(false);
        this.aff = { matricule:'', nom:'', dirActuelle:'', dirNouvelle:'', poste:'', dateEffet:'', motif:'' };
      },
      error: () => { this.toast.showError('aff', 'Erreur lors de l\'affectation'); this.saving.set(false); },
    });
  }

  validerPromotion(): void {
    if (!this.prom.matricule || !this.prom.gradeNouveau || !this.prom.salNouveau || !this.prom.dateEffet) {
      this.toast.showError('prom', 'Matricule, nouveau grade, nouveau salaire et date d\'effet obligatoires'); return;
    }
    const agent = this.rh.findAgent(this.prom.matricule);
    if (!agent) { this.toast.showError('prom', `Agent introuvable — ${this.prom.matricule}`); return; }
    this.saving.set(true);
    this.rh.modifierAgent(agent.id, { grade: this.prom.gradeNouveau, salaireBrut: Number(this.prom.salNouveau) }).subscribe({
      next: () => {
        this.toast.show('prom', `Promotion enregistrée — ${this.prom.matricule} → ${this.prom.gradeNouveau}`);
        this.saving.set(false);
        this.prom = { matricule:'', nom:'', gradeActuel:'', gradeNouveau:'', salActuel: null, salNouveau: null, dateEffet:'', type:'Avancement à l\'ancienneté' };
      },
      error: () => { this.toast.showError('prom', 'Erreur lors de la promotion'); this.saving.set(false); },
    });
  }

  validerMutation(): void {
    if (!this.mut.matricule || !this.mut.destination || !this.mut.date) {
      this.toast.showError('mut', 'Matricule, structure d\'accueil et date obligatoires'); return;
    }
    const agent = this.rh.findAgent(this.mut.matricule);
    if (!agent) { this.toast.showError('mut', `Agent introuvable — ${this.mut.matricule}`); return; }
    this.saving.set(true);
    this.rh.modifierAgent(agent.id, { direction: this.mut.destination }).subscribe({
      next: () => {
        this.toast.show('mut', `Mutation enregistrée — ${this.mut.matricule} → ${this.mut.destination}`);
        this.saving.set(false);
        this.mut = { matricule:'', nom:'', origine:'', destination:'', date:'', motif:'Rapprochement familial' };
      },
      error: () => { this.toast.showError('mut', 'Erreur lors de la mutation'); this.saving.set(false); },
    });
  }

  chipRecr(s: string): string {
    return { en_cours: 'cb', termine: 'cv', annule: 'cr' }[s] ?? 'cp';
  }

  // Propriétés pour le départ
  depart = { 
    matricule: '', 
    nom: '', 
    cause: '', 
    date: '', 
    dernierePresence: '',
    dernierSalaire: null as number | null,
    observations: '',
    pieceJointe: null as File | null
  };

  // Méthodes pour le départ
  onDepartFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.depart.pieceJointe = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(input.files[0].type)) {
        this.toast.showError('dep', 'Format non supporté. Utilisez JPG, PNG ou PDF.');
        this.depart.pieceJointe = null;
        return;
      }
      this.toast.show('dep', `✓ Document chargé: ${input.files[0].name}`);
    }
  }

  resetDepart() {
    this.depart = { 
      matricule: '', 
      nom: '', 
      cause: '', 
      date: '', 
      dernierePresence: '',
      dernierSalaire: null,
      observations: '',
      pieceJointe: null
    };
  }

  voirDetailsDepart(depart: any) {
    // Affiche un message toast avec les détails
    this.toast.show('dep', `${depart.nom} (${depart.matricule}) - ${this.labelCause(depart.cause)} - le ${depart.date}`);
    
    // Vous pouvez aussi afficher plus de détails dans la console
    console.log('Détails du départ:', {
      matricule: depart.matricule,
      nom: depart.nom,
      cause: depart.cause,
      date: depart.date,
      dernierePresence: depart.dernierePresence,
      dernierSalaire: depart.dernierSalaire,
      observations: depart.observations,
      statut: depart.statut
    });
  }

  validerDepart() {
    if (!this.depart.matricule || !this.depart.cause || !this.depart.date) {
      this.toast.showError('dep', 'Matricule, cause et date de départ obligatoires');
      return;
    }
    
    this.rh.enregistrerDepart({
      matricule: this.depart.matricule,
      nom: this.depart.nom || 'Agent',
      cause: this.depart.cause,
      date: this.depart.date,
      derniere_presence: this.depart.dernierePresence,
      dernier_salaire: this.depart.dernierSalaire,
      observations: this.depart.observations,
    } as any).subscribe({
      next: () => {
        this.toast.show('dep', `Départ enregistré — ${this.depart.matricule} — ${this.labelCause(this.depart.cause)}`);
        this.resetDepart();
      },
      error: () => this.toast.showError('dep', 'Erreur lors de l\'enregistrement'),
    });
  }

  labelCause(cause: string): string {
    const causes: Record<string, string> = {
      'demission': 'Démission',
      'retraite': 'Retraite',
      'retraite_anticipee': 'Retraite anticipée',
      'abandon_poste': 'Abandon de poste',
      'mutation_externe': 'Mutation externe',
      'licenciement': 'Licenciement',
      'renvoi': 'Renvoi disciplinaire',
      'fin_contrat': 'Fin de contrat',
      'fin_stage': 'Fin de stage non validé',
      'suppression_poste': 'Suppression de poste',
      'inaptitude': 'Inaptitude médicale',
      'deces': 'Décès',
      'invalidite': 'Invalidité',
      'detachement': 'Détachement définitif',
      'disponibilite': 'Disponibilité prolongée'
    };
    return causes[cause] || cause;
  }

  chipCause(cause: string): string {
    const causesVolontaires = ['demission', 'retraite', 'retraite_anticipee'];
    const causesInvolontaires = ['licenciement', 'renvoi', 'fin_contrat', 'fin_stage', 'suppression_poste', 'inaptitude'];
    const causesExceptionnelles = ['deces', 'invalidite', 'detachement', 'disponibilite'];
    
    if (causesVolontaires.includes(cause)) return 'cgo';
    if (causesInvolontaires.includes(cause)) return 'cr';
    if (causesExceptionnelles.includes(cause)) return 'cb';
    return 'cv';
  }
}
