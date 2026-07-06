import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesTechniquesService } from '../../../../core/services/services-techniques.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'demandes' | 'bons' | 'equipes';

@Component({
  selector: 'app-interventions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="tabs">
  @for (t of tabs; track t.id) {
    <div class="tab" [class.act]="active()===t.id" (click)="active.set(t.id)">
      <i class="ti {{t.icon}}"></i>{{t.label}}
      @if (t.id==='demandes' && enAttente() > 0) { <span class="badge">{{enAttente()}}</span> }
    </div>
  }
</div>
<div class="panel notop">

<!-- ── Demandes citoyennes ─────────────────────────────────────────────── -->
@if (active()==='demandes') {
  <div class="ph">
    <div class="pt"><i class="ti ti-message-circle"></i>Demandes d'intervention citoyennes</div>
    <button class="btn-p" (click)="showNouv.set(!showNouv())"><i class="ti ti-plus"></i>Nouvelle demande</button>
  </div>

  <!-- Filtres ─────────────────────────────────────────────────────────── -->
  <div style="padding:6px 8px;border-bottom:.5px solid var(--color-border-tertiary);display:flex;gap:8px">
    <select class="fs" style="max-width:130px" [(ngModel)]="flt.statut" (ngModelChange)="st.loadDemandes({statut:flt.statut})">
      <option value="">Tous statuts</option>
      <option value="ouverte">Ouverte</option><option value="assignee">Assignée</option>
      <option value="en_cours">En cours</option><option value="terminee">Terminée</option><option value="cloturee">Clôturée</option>
    </select>
    <select class="fs" style="max-width:130px" [(ngModel)]="flt.service" (ngModelChange)="st.loadDemandes({type_service:flt.service})">
      <option value="">Tous services</option>
      <option value="voirie">Voirie</option><option value="eclairage">Éclairage</option>
      <option value="eau">Eau/Assain.</option><option value="batiment">Bâtiments</option>
    </select>
    <select class="fs" style="max-width:120px" [(ngModel)]="flt.priorite" (ngModelChange)="st.loadDemandes({priorite:flt.priorite})">
      <option value="">Toutes priorités</option>
      <option value="urgente">Urgente</option><option value="haute">Haute</option><option value="normale">Normale</option>
    </select>
  </div>

  @if (showNouv()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="fsec">Nouvelle demande citoyenne</div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Service concerné</div>
          <select class="fs" [(ngModel)]="fDem.typeService">
            <option value="voirie">Voirie</option><option value="eclairage">Éclairage public</option>
            <option value="eau">Eau / Assainissement</option><option value="batiment">Bâtiment communal</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Priorité</div>
          <select class="fs" [(ngModel)]="fDem.priorite">
            <option value="normale">Normale</option><option value="haute">Haute</option><option value="urgente">Urgente</option>
          </select>
        </div>
      </div>
      <div class="fg" style="margin-bottom:8px"><div class="fl">Description du problème</div>
        <textarea class="fi" style="height:65px;resize:none;padding-top:6px" [(ngModel)]="fDem.description" placeholder="Décrivez le problème en détail..."></textarea>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Localisation précise</div><input class="fi" [(ngModel)]="fDem.localisation" placeholder="Rue, quartier, repère..."></div>
        <div class="fg"><div class="fl">Nom du demandeur</div><input class="fi" [(ngModel)]="fDem.demandeur" placeholder="Nom complet"></div>
      </div>
      <div class="fg" style="margin-bottom:8px"><div class="fl">Téléphone (optionnel)</div><input class="fi" [(ngModel)]="fDem.telephone" placeholder="07 XX XX XX XX"></div>
      <div class="fg" style="margin-bottom:8px">
        <div class="fl">Photos du problème <span style="opacity:.6;font-weight:400">(optionnel)</span></div>
        <label class="upload-zone" [class.has-files]="demPhotos.length>0">
          <input type="file" accept="image/*" multiple style="display:none" (change)="onDemPhoto($event)">
          <i class="ti ti-camera-plus"></i>
          <span>{{demPhotos.length ? demPhotos.length+' photo(s) sélectionnée(s)' : 'Joindre des photos illustrant le problème'}}</span>
        </label>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showNouv.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="creerDemande()">
          @if (saving()) { <i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Envoi… }
          @else { <i class="ti ti-send"></i>Soumettre la demande }
        </button>
      </div>
    </div>
  }

  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Référence</th><th>Service</th><th>Description</th><th>Localisation</th><th>Priorité</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody>
        @if (st.loadingDemandes()) {
          <tr><td colspan="8" style="text-align:center;padding:1.5rem;color:var(--color-text-secondary);font-size:12px">Chargement…</td></tr>
        }
        @for (d of st.demandes(); track d.id) {
          <tr>
            <td class="mono-td">{{d.reference}}</td>
            <td><span class="chip cm">{{d.typeService}}</span></td>
            <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" [title]="d.description">{{d.description}}</td>
            <td>{{d.localisation}}</td>
            <td><span class="chip" [ngClass]="chipPrio(d.priorite)">{{d.priorite}}</span></td>
            <td>{{d.dateDepot}}</td>
            <td><span class="chip" [ngClass]="chipDem(d.statut)">{{d.statut}}</span></td>
            <td style="display:flex;gap:4px">
              @if (d.statut==='ouverte') {
                <button class="btn-s" style="padding:3px 8px;font-size:11px" (click)="assigner(d.id)">
                  <i class="ti ti-user-check"></i>Assigner
                </button>
              }
              @if (d.statut==='en_cours'||d.statut==='assignee') {
                <button class="btn-s" style="padding:3px 8px;font-size:11px" (click)="cloturer(d.id)">
                  <i class="ti ti-check"></i>Clôturer
                </button>
              }
            </td>
          </tr>
        } @empty {
          @if (!st.loadingDemandes()) {
            <tr><td colspan="8" class="empty-row">Aucune demande</td></tr>
          }
        }
      </tbody>
    </table>
  </div>
}

<!-- ── Bons de travaux ─────────────────────────────────────────────────── -->
@if (active()==='bons') {
  <div class="ph">
    <div class="pt"><i class="ti ti-clipboard-list"></i>Bons de travaux</div>
    <button class="btn-s" (click)="showBon.set(!showBon())"><i class="ti ti-plus"></i>Créer bon</button>
  </div>
  @if (showBon()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Description des travaux</div><input class="fi" [(ngModel)]="fBon.description" placeholder="Nature des travaux"></div>
        <div class="fg"><div class="fl">Service</div>
          <select class="fs" [(ngModel)]="fBon.service">
            <option>Voirie</option><option>Éclairage public</option><option>Eau / Assainissement</option><option>Bâtiments</option>
          </select>
        </div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Équipe</div><input class="fi" [(ngModel)]="fBon.equipe" placeholder="Nom de l'équipe"></div>
        <div class="fg"><div class="fl">Chef d'équipe</div><input class="fi" [(ngModel)]="fBon.chef"></div>
        <div class="fg"><div class="fl">Date début</div><input class="fi" type="date" [(ngModel)]="fBon.dateDebut"></div>
      </div>
      <div class="fg" style="margin-bottom:8px"><div class="fl">Matériaux / équipements nécessaires</div>
        <input class="fi" [(ngModel)]="fBon.materiaux" placeholder="Ex: 2 sacs ciment, sable, gravier...">
      </div>
      <div class="fg" style="margin-bottom:8px"><div class="fl">Réf. demande liée (optionnel)</div>
        <input class="fi" [(ngModel)]="fBon.demandeRef" placeholder="Ex: DI-2025-001284">
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showBon.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="creerBon()"><i class="ti ti-check"></i>Émettre le bon</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>N° Bon</th><th>Description</th><th>Service</th><th>Équipe</th><th>Chef</th><th>Début</th><th>Statut</th></tr></thead>
      <tbody>
        @for (b of st.bons(); track b.id) {
          <tr>
            <td class="mono-td">{{b.reference}}</td>
            <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{b.description}}</td>
            <td>{{b.service}}</td>
            <td>{{b.equipe}}</td>
            <td>{{b.chef}}</td>
            <td>{{b.dateDebut}}</td>
            <td><span class="chip" [ngClass]="chipBon(b.statut)">{{b.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="7" class="empty-row">Aucun bon de travail émis</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Suivi des équipes ───────────────────────────────────────────────── -->
@if (active()==='equipes') {
  <div class="ph">
    <div class="pt"><i class="ti ti-users"></i>Suivi des équipes terrain</div>
  </div>
  <div style="padding:.75rem 1rem;display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
    @for (e of st.equipes(); track e.id) {
      <div class="equipe-card" [class.dispo]="e.statut==='disponible'" [class.actif]="e.statut==='en_intervention'">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div style="font-weight:500;font-size:13px">{{e.nom}}</div>
          <span class="chip" [ngClass]="chipEquipe(e.statut)">{{e.statut}}</span>
        </div>
        <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">
          <i class="ti ti-user" style="margin-right:4px"></i>Chef : {{e.chef}}
        </div>
        <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:4px">
          <i class="ti ti-users" style="margin-right:4px"></i>{{e.membres}} membres
        </div>
        @if (e.bonEnCours) {
          <div style="font-size:11px;color:#F77F00;margin-top:4px">
            <i class="ti ti-clipboard-list" style="margin-right:4px"></i>Bon en cours : {{e.bonEnCours}}
          </div>
        }
        @if (e.localisation) {
          <div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">
            <i class="ti ti-map-pin" style="margin-right:4px"></i>{{e.localisation}}
          </div>
        }
      </div>
    }
    @empty {
      <div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--color-text-secondary);font-size:12px">
        Aucune équipe enregistrée
      </div>
    }
  </div>
}

@if (toast.get('int')?.visible) {
  <div class="success-toast show" style="margin:8px 1rem"><i class="ti ti-check"></i>{{toast.get('int')?.message}}</div>
}
</div>
  `
})
export class InterventionsComponent implements OnInit {
  readonly st    = inject(ServicesTechniquesService);
  readonly toast = inject(ToastService);
  active  = signal<Tab>('demandes');
  saving  = signal(false);
  showNouv = signal(false);
  showBon  = signal(false);
  flt    = { statut: '', service: '', priorite: '' };
  fDem   = { typeService: 'voirie', description: '', localisation: '', demandeur: '', telephone: '', priorite: 'normale' };
  fBon   = { description: '', service: 'Voirie', equipe: '', chef: '', dateDebut: '', materiaux: '', demandeRef: '' };
  demPhotos: File[] = [];

  enAttente = computed(() => this.st.demandes().filter(d => d.statut === 'ouverte').length);

  tabs = [
    { id: 'demandes' as Tab, label: 'Demandes citoyennes', icon: 'ti-message-circle' },
    { id: 'bons' as Tab,     label: 'Bons de travaux',     icon: 'ti-clipboard-list' },
    { id: 'equipes' as Tab,  label: 'Suivi équipes',       icon: 'ti-users' },
  ];

  ngOnInit(): void { this.st.loadDemandes(); this.st.loadBons(); this.st.loadEquipes(); }

  creerDemande(): void {
    if (!this.fDem.description || !this.fDem.localisation || !this.fDem.demandeur) {
      this.toast.show('int', 'Description, localisation et demandeur obligatoires'); return;
    }
    this.saving.set(true);
    this.st.creerDemande(this.fDem).subscribe({
      next: d => { this.toast.show('int', `Demande enregistrée — ${d.reference}`); this.saving.set(false); this.showNouv.set(false); this.fDem = { typeService:'voirie', description:'', localisation:'', demandeur:'', telephone:'', priorite:'normale' }; },
      error: () => this.saving.set(false)
    });
  }

  creerBon(): void {
    if (!this.fBon.description || !this.fBon.equipe || !this.fBon.dateDebut) {
      this.toast.show('int', 'Description, équipe et date obligatoires'); return;
    }
    this.saving.set(true);
    this.st.creerBonTravail({ description: this.fBon.description, service: this.fBon.service, equipe: this.fBon.equipe, chef: this.fBon.chef, dateDebut: this.fBon.dateDebut, materiaux: this.fBon.materiaux, demandeRef: this.fBon.demandeRef }).subscribe({
      next: b => { this.toast.show('int', `Bon émis — ${b.reference}`); this.saving.set(false); this.showBon.set(false); this.fBon = { description:'', service:'Voirie', equipe:'', chef:'', dateDebut:'', materiaux:'', demandeRef:'' }; },
      error: () => this.saving.set(false)
    });
  }

  onDemPhoto(e: Event) { const f = (e.target as HTMLInputElement).files; if (f) this.demPhotos = Array.from(f); }

  assigner(id: string): void { this.st.assignerDemande(id, 'KOUAMÉ Jean'); this.toast.show('int', 'Demande assignée à KOUAMÉ Jean'); }
  cloturer(id: string): void { this.st.cloturerDemande(id); this.toast.show('int', 'Demande clôturée'); }

  chipPrio(p: string): string   { return { normale:'cv', haute:'cp', urgente:'ce' }[p] ?? 'cp'; }
  chipDem(s: string): string    { return { ouverte:'ce', assignee:'cm', en_cours:'cp', terminee:'cv', cloturee:'cn' }[s] ?? 'cm'; }
  chipBon(s: string): string    { return { planifie:'cm', en_cours:'cp', termine:'cv', suspendu:'ce' }[s] ?? 'cm'; }
  chipEquipe(s: string): string { return { disponible:'cv', en_intervention:'cp', repos:'cn' }[s] ?? 'cn'; }
}
