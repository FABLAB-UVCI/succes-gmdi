import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesTechniquesService } from '../../../../core/services/services-techniques.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'caniveaux' | 'drainage' | 'dechets';

@Component({
  selector: 'app-eau-assainissement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="tabs">
  @for (t of tabs; track t.id) {
    <div class="tab" [class.act]="active()===t.id" (click)="active.set(t.id)">
      <i class="ti {{t.icon}}"></i>{{t.label}}
    </div>
  }
</div>
<div class="panel notop">

<!-- ── Caniveaux ──────────────────────────────────────────────────────── -->
@if (active()==='caniveaux') {
  <div class="ph">
    <div class="pt"><i class="ti ti-droplet"></i>Réseau de caniveaux</div>
    <button class="btn-s" (click)="showAdd.set(!showAdd())"><i class="ti ti-plus"></i>Enregistrer</button>
  </div>
  @if (showAdd()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Localisation</div><input class="fi" [(ngModel)]="fCan.localisation" placeholder="Ex: Av. Félix Houphouët"></div>
        <div class="fg"><div class="fl">Quartier</div><input class="fi" [(ngModel)]="fCan.quartier"></div>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Longueur (m)</div><input class="fi" type="number" [(ngModel)]="fCan.longueur"></div>
        <div class="fg"><div class="fl">État</div>
          <select class="fs" [(ngModel)]="fCan.etat">
            <option value="bon">Bon</option><option value="colmate">Colmaté</option><option value="degrade">Dégradé</option>
          </select>
        </div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAdd.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" (click)="ajouterCaniveau()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div style="padding:6px 8px;border-bottom:.5px solid var(--color-border-tertiary)">
    <select class="fs" style="max-width:150px" [(ngModel)]="fltEtat" (ngModelChange)="st.loadCaniveaux({etat:fltEtat})">
      <option value="">Tous états</option><option value="bon">Bon</option><option value="colmate">Colmaté</option><option value="degrade">Dégradé</option>
    </select>
  </div>
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Localisation</th><th>Quartier</th><th>Longueur</th><th>État</th><th>Dernier nettoyage</th><th>Action</th></tr></thead>
      <tbody>
        @for (c of st.caniveaux(); track c.id) {
          <tr>
            <td style="font-weight:500">{{c.localisation}}</td>
            <td>{{c.quartier}}</td>
            <td>{{c.longueur | number}} m</td>
            <td><span class="chip" [ngClass]="chipEtat(c.etat)">{{c.etat}}</span></td>
            <td>{{c.dateDernierNettoyage || '—'}}</td>
            <td>
              <button class="btn-s" style="padding:3px 8px;font-size:11px" (click)="toast.show('eau','Nettoyage enregistré')">
                <i class="ti ti-wash"></i>Nettoyage
              </button>
            </td>
          </tr>
        }
        @empty { <tr><td colspan="6" class="empty-row">Aucun caniveau enregistré</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Drainage ────────────────────────────────────────────────────────── -->
@if (active()==='drainage') {
  <div class="ph">
    <div class="pt"><i class="ti ti-waves"></i>Gestion du drainage</div>
    <button class="btn-s" (click)="showDrain.set(!showDrain())"><i class="ti ti-plus"></i>Intervention</button>
  </div>
  @if (showDrain()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Localisation</div><input class="fi" [(ngModel)]="fDrain.localisation" placeholder="Zone concernée"></div>
        <div class="fg"><div class="fl">Type d'intervention</div>
          <select class="fs" [(ngModel)]="fDrain.type">
            <option value="curage">Curage</option><option value="debouchage">Débouchage</option><option value="reparation">Réparation</option><option value="construction">Construction</option>
          </select>
        </div>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Date d'intervention</div><input class="fi" type="date" [(ngModel)]="fDrain.date"></div>
        <div class="fg"><div class="fl">Équipe</div><input class="fi" [(ngModel)]="fDrain.equipe" placeholder="Ex: Brigade Assainissement"></div>
      </div>
      <div class="fg" style="margin-bottom:8px"><div class="fl">Observations</div>
        <textarea class="fi" style="height:52px;resize:none;padding-top:6px" [(ngModel)]="fDrain.obs"></textarea>
      </div>
      <div class="fg" style="margin-bottom:8px">
        <div class="fl">Photos <span style="opacity:.6;font-weight:400">(optionnel)</span></div>
        <label class="upload-zone" [class.has-files]="drainPhotos.length>0">
          <input type="file" accept="image/*" multiple style="display:none" (change)="onDrainPhoto($event)">
          <i class="ti ti-camera-plus"></i>
          <span>{{drainPhotos.length ? drainPhotos.length+' photo(s) sélectionnée(s)' : 'Joindre des photos du site de drainage'}}</span>
        </label>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showDrain.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" (click)="ajouterIntervention()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Localisation</th><th>Type</th><th>Date</th><th>Équipe</th><th>Statut</th><th>Observations</th></tr></thead>
      <tbody>
        @for (d of st.drainage(); track d.id) {
          <tr>
            <td style="font-weight:500">{{d.localisation}}</td>
            <td>{{d.type}}</td>
            <td>{{d.dateIntervention}}</td>
            <td>{{d.equipe}}</td>
            <td><span class="chip" [ngClass]="chipStatut(d.statut)">{{d.statut}}</span></td>
            <td style="font-size:11px;color:var(--color-text-secondary)">{{d.observations || '—'}}</td>
          </tr>
        }
        @empty { <tr><td colspan="6" class="empty-row">Aucune intervention drainage</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Gestion des déchets ─────────────────────────────────────────────── -->
@if (active()==='dechets') {
  <div class="ph">
    <div class="pt"><i class="ti ti-recycle"></i>Collecte des déchets</div>
    <button class="btn-s" (click)="showDechet.set(!showDechet())"><i class="ti ti-plus"></i>Planifier</button>
  </div>
  @if (showDechet()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Zone de collecte</div><input class="fi" [(ngModel)]="fDechet.zone" placeholder="Ex: Quartier Anono"></div>
        <div class="fg"><div class="fl">Fréquence</div>
          <select class="fs" [(ngModel)]="fDechet.frequence">
            <option>Quotidienne</option><option>Hebdomadaire</option><option>Bihebdomadaire</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Prochaine collecte</div><input class="fi" type="date" [(ngModel)]="fDechet.prochaine"></div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showDechet.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" (click)="ajouterCollecte()"><i class="ti ti-check"></i>Planifier</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Zone</th><th>Fréquence</th><th>Prochaine collecte</th><th>Tonnage</th><th>Statut</th><th>Action</th></tr></thead>
      <tbody>
        @for (c of st.collectes(); track c.id) {
          <tr>
            <td style="font-weight:500">{{c.zone}}</td>
            <td>{{c.frequence}}</td>
            <td>{{c.prochaineCollecte}}</td>
            <td>{{c.tonnage ? (c.tonnage | number) + ' t' : '—'}}</td>
            <td><span class="chip" [ngClass]="chipCollecte(c.statut)">{{c.statut}}</span></td>
            <td>
              @if (c.statut !== 'effectue') {
                <button class="btn-s" style="padding:3px 8px;font-size:11px" (click)="st.marquerCollecteEffectuee(c.id); toast.show('eau','Collecte marquée effectuée')">
                  <i class="ti ti-check"></i>Effectuée
                </button>
              }
            </td>
          </tr>
        }
        @empty { <tr><td colspan="6" class="empty-row">Aucune collecte planifiée</td></tr> }
      </tbody>
    </table>
  </div>
}
@if (toast.get('eau')?.visible) {
  <div class="success-toast show" style="margin:8px 1rem"><i class="ti ti-check"></i>{{toast.get('eau')?.message}}</div>
}
</div>
  `
})
export class EauAssainissementComponent implements OnInit {
  readonly st    = inject(ServicesTechniquesService);
  readonly toast = inject(ToastService);
  active = signal<Tab>('caniveaux');
  showAdd    = signal(false);
  showDrain  = signal(false);
  showDechet = signal(false);
  fltEtat = '';
  fCan   = { localisation: '', quartier: '', longueur: 0, etat: 'bon' };
  fDrain = { localisation: '', type: 'curage', date: '', equipe: '', obs: '' };
  fDechet = { zone: '', frequence: 'Hebdomadaire', prochaine: '' };
  drainPhotos: File[] = [];

  tabs = [
    { id: 'caniveaux' as Tab, label: 'Caniveaux',       icon: 'ti-droplet' },
    { id: 'drainage' as Tab,  label: 'Drainage',         icon: 'ti-waves' },
    { id: 'dechets' as Tab,   label: 'Gestion déchets',  icon: 'ti-recycle' },
  ];

  ngOnInit(): void { this.st.loadCaniveaux(); this.st.loadCollectes(); }

  ajouterCaniveau(): void {
    if (!this.fCan.localisation || !this.fCan.quartier || !this.fCan.longueur) {
      this.toast.showError('eau', 'Localisation, quartier et longueur obligatoires'); return;
    }
    this.st.ajouterCaniveau(this.fCan).subscribe({
      next: () => {
        this.toast.show('eau', `Caniveau enregistré — ${this.fCan.localisation}`);
        this.showAdd.set(false);
        this.fCan = { localisation:'', quartier:'', longueur:0, etat:'bon' };
      },
      error: () => {},
    });
  }

  ajouterIntervention(): void {
    if (!this.fDrain.localisation || !this.fDrain.date || !this.fDrain.equipe) {
      this.toast.showError('eau', 'Localisation, équipe et date obligatoires'); return;
    }
    this.st.ajouterDrainage({ localisation: this.fDrain.localisation, type: this.fDrain.type, dateIntervention: this.fDrain.date, equipe: this.fDrain.equipe, observations: this.fDrain.obs || undefined }).subscribe({
      next: () => {
        this.toast.show('eau', 'Intervention de drainage enregistrée');
        this.showDrain.set(false);
        this.fDrain = { localisation:'', type:'curage', date:'', equipe:'', obs:'' };
      },
      error: () => {},
    });
  }

  ajouterCollecte(): void {
    if (!this.fDechet.zone || !this.fDechet.prochaine) { this.toast.showError('eau', 'Zone et prochaine collecte obligatoires'); return; }
    this.st.ajouterCollecte({ zone: this.fDechet.zone, frequence: this.fDechet.frequence, prochaineCollecte: this.fDechet.prochaine }).subscribe({
      next: () => {
        this.toast.show('eau', `Collecte planifiée — ${this.fDechet.zone}`);
        this.showDechet.set(false);
        this.fDechet = { zone:'', frequence:'Hebdomadaire', prochaine:'' };
      },
      error: () => {},
    });
  }

  onDrainPhoto(e: Event) { const f = (e.target as HTMLInputElement).files; if (f) this.drainPhotos = Array.from(f); }

  chipEtat(e: string): string       { return { bon:'cv', colmate:'cp', degrade:'ce' }[e] ?? 'cp'; }
  chipStatut(s: string): string     { return { planifie:'cm', en_cours:'cp', termine:'cv', suspendu:'ce' }[s] ?? 'cp'; }
  chipCollecte(s: string): string   { return { planifie:'cm', effectue:'cv', manque:'ce' }[s] ?? 'cm'; }
}
