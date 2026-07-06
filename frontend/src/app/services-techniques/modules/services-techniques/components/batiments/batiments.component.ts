import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesTechniquesService } from '../../../../core/services/services-techniques.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'liste' | 'travaux' | 'nouveau';
const TYPES = [
  { val: 'mairie',        label: 'Mairie / Annexe',    icon: 'ti-building-community' },
  { val: 'ecole',         label: 'École',               icon: 'ti-school' },
  { val: 'centre_social', label: 'Centre social',       icon: 'ti-heart-handshake' },
  { val: 'marche',        label: 'Marché',              icon: 'ti-shopping-cart' },
  { val: 'autre',         label: 'Autre',               icon: 'ti-building' },
];

@Component({
  selector: 'app-batiments',
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

<!-- ── Liste bâtiments ────────────────────────────────────────────────── -->
@if (active()==='liste') {
  <div class="ph">
    <div class="pt"><i class="ti ti-building"></i>Bâtiments communaux</div>
    <div style="display:flex;gap:8px">
      <select class="fs" style="max-width:140px" [(ngModel)]="fltType" (ngModelChange)="st.loadBatiments({type:fltType})">
        <option value="">Tous types</option>
        @for (ty of types; track ty.val) { <option [value]="ty.val">{{ty.label}}</option> }
      </select>
    </div>
  </div>

  <!-- Cartes par type ──────────────────────────────────────────────────── -->
  <div style="padding:.75rem 1rem;display:grid;grid-template-columns:repeat(5,1fr);gap:8px">
    @for (ty of types; track ty.val) {
      <div class="type-card" [class.act]="fltType===ty.val" (click)="fltType=ty.val; st.loadBatiments({type:ty.val})">
        <i class="ti {{ty.icon}}" style="font-size:20px;color:#003366;margin-bottom:4px"></i>
        <div style="font-size:11px;font-weight:500;color:var(--color-text-primary)">{{ty.label}}</div>
        <div style="font-size:18px;font-weight:500;color:#F77F00">{{countType(ty.val)}}</div>
      </div>
    }
  </div>

  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Nom</th><th>Type</th><th>Adresse</th><th>Superficie</th><th>État</th><th>Responsable</th><th>Dernière inspection</th></tr></thead>
      <tbody>
        @for (b of st.batiments(); track b.id) {
          <tr>
            <td style="font-weight:500">{{b.nom}}</td>
            <td>{{labelType(b.type)}}</td>
            <td>{{b.adresse}}</td>
            <td>{{b.superficie | number}} m²</td>
            <td><span class="chip" [ngClass]="chipEtat(b.etat)">{{b.etat}}</span></td>
            <td>{{b.responsable || '—'}}</td>
            <td>{{b.dateDerniereInspection || 'Non renseigné'}}</td>
          </tr>
        }
        @empty { <tr><td colspan="7" class="empty-row">Aucun bâtiment enregistré</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Travaux ─────────────────────────────────────────────────────────── -->
@if (active()==='travaux') {
  <div class="ph">
    <div class="pt"><i class="ti ti-hammer"></i>Travaux sur bâtiments</div>
    <button class="btn-s" (click)="showAddTrav.set(!showAddTrav())"><i class="ti ti-plus"></i>Nouveau</button>
  </div>
  @if (showAddTrav()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Bâtiment concerné</div><input class="fi" [(ngModel)]="fTrav.batiment" placeholder="Nom du bâtiment"></div>
        <div class="fg"><div class="fl">Type de travaux</div>
          <select class="fs" [(ngModel)]="fTrav.type">
            <option value="reparation">Réparation</option><option value="renovation">Rénovation</option><option value="construction">Construction</option><option value="entretien">Entretien</option>
          </select>
        </div>
      </div>
      <div class="fg" style="margin-bottom:8px"><div class="fl">Description</div>
        <textarea class="fi" style="height:60px;resize:none;padding-top:6px" [(ngModel)]="fTrav.description"></textarea>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Date début</div><input class="fi" type="date" [(ngModel)]="fTrav.dateDebut"></div>
        <div class="fg"><div class="fl">Coût estimé (FCFA)</div><input class="fi" type="number" [(ngModel)]="fTrav.cout"></div>
        <div class="fg"><div class="fl">Prestataire</div><input class="fi" [(ngModel)]="fTrav.prestataire"></div>
      </div>
      <div class="fg" style="margin-bottom:8px">
        <div class="fl">Photos des travaux <span style="opacity:.6;font-weight:400">(optionnel)</span></div>
        <label class="upload-zone" [class.has-files]="travPhotos.length>0">
          <input type="file" accept="image/*" multiple style="display:none" (change)="onTravPhoto($event)">
          <i class="ti ti-camera-plus"></i>
          <span>{{travPhotos.length ? travPhotos.length+' photo(s) sélectionnée(s)' : 'Joindre des photos (avant travaux, chantier…)'}}</span>
        </label>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddTrav.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="ajouterTravaux()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Bâtiment</th><th>Type</th><th>Description</th><th>Début</th><th>Coût estimé</th><th>Prestataire</th><th>Statut</th></tr></thead>
      <tbody>
        @for (t of st.travaux(); track t.id) {
          <tr>
            <td style="font-weight:500">{{t.batiment}}</td>
            <td><span class="chip cm">{{t.type}}</span></td>
            <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{t.description}}</td>
            <td>{{t.dateDebut}}</td>
            <td>{{t.coutEstime | number}} FCFA</td>
            <td>{{t.prestataire || '—'}}</td>
            <td><span class="chip" [ngClass]="chipStatut(t.statut)">{{t.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="7" class="empty-row">Aucun travaux enregistré</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Nouveau bâtiment ───────────────────────────────────────────────── -->
@if (active()==='nouveau') {
  <div class="ph"><div class="pt"><i class="ti ti-building-plus"></i>Enregistrer un bâtiment</div></div>
  <div class="pb">
    <div class="fsec">Identification</div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Nom du bâtiment</div><input class="fi" [(ngModel)]="fBat.nom" placeholder="Ex: École Primaire Cocody 12"></div>
      <div class="fg"><div class="fl">Type</div>
        <select class="fs" [(ngModel)]="fBat.type">
          @for (ty of types; track ty.val) { <option [value]="ty.val">{{ty.label}}</option> }
        </select>
      </div>
    </div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Adresse</div><input class="fi" [(ngModel)]="fBat.adresse"></div>
      <div class="fg"><div class="fl">Responsable</div><input class="fi" [(ngModel)]="fBat.responsable"></div>
    </div>
    <div class="form-grid-3">
      <div class="fg"><div class="fl">Superficie (m²)</div><input class="fi" type="number" [(ngModel)]="fBat.superficie"></div>
      <div class="fg"><div class="fl">Année construction</div><input class="fi" type="number" [(ngModel)]="fBat.annee"></div>
      <div class="fg"><div class="fl">État actuel</div>
        <select class="fs" [(ngModel)]="fBat.etat">
          <option value="bon">Bon</option><option value="moyen">Moyen</option><option value="degrade">Dégradé</option>
        </select>
      </div>
    </div>
    <div class="fsec">Photos</div>
    <div class="fg" style="margin-bottom:12px">
      <div class="fl">Photos du bâtiment <span style="opacity:.6;font-weight:400">(optionnel)</span></div>
      <label class="upload-zone" [class.has-files]="batPhotos.length>0">
        <input type="file" accept="image/*" multiple style="display:none" (change)="onBatPhoto($event)">
        <i class="ti ti-camera-plus"></i>
        <span>{{batPhotos.length ? batPhotos.length+' photo(s) sélectionnée(s)' : 'Ajouter des photos du bâtiment (façade, intérieur…)'}}</span>
      </label>
    </div>
    <div class="fa">
      <button class="btn-p" [disabled]="saving()" (click)="ajouterBatiment()">
        @if (saving()) { <i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Enregistrement… }
        @else { <i class="ti ti-check"></i>Enregistrer le bâtiment }
      </button>
    </div>
    @if (toast.get('bat')?.visible) {
      <div class="success-toast show" style="margin-top:8px"><i class="ti ti-check"></i>{{toast.get('bat')?.message}}</div>
    }
  </div>
}
</div>
  `
})
export class BatimentsComponent implements OnInit {
  readonly st    = inject(ServicesTechniquesService);
  readonly toast = inject(ToastService);
  active   = signal<Tab>('liste');
  saving   = signal(false);
  showAddTrav = signal(false);
  fltType = '';
  types = TYPES;
  fBat  = { nom:'', type:'mairie', adresse:'', responsable:'', superficie:0, annee:0, etat:'bon' };
  fTrav = { batiment:'', type:'reparation', description:'', dateDebut:'', cout:0, prestataire:'' };
  batPhotos:  File[] = [];
  travPhotos: File[] = [];

  tabs = [
    { id: 'liste' as Tab,    label: 'Tous les bâtiments', icon: 'ti-building' },
    { id: 'travaux' as Tab,  label: 'Travaux',             icon: 'ti-hammer' },
    { id: 'nouveau' as Tab,  label: 'Enregistrer',         icon: 'ti-building-plus' },
  ];

  ngOnInit(): void { this.st.loadBatiments(); this.st.loadTravauxBatiments(); }

  countType(t: string): number { return this.st.batiments().filter(b => b.type === t).length; }
  labelType(t: string): string { return TYPES.find(x => x.val === t)?.label ?? t; }

  ajouterBatiment(): void {
    if (!this.fBat.nom || !this.fBat.adresse) { this.toast.show('bat', 'Nom et adresse obligatoires'); return; }
    this.saving.set(true);
    this.st.batiments.update(l => [...l, { id: String(Date.now()), nom: this.fBat.nom, type: this.fBat.type as any, adresse: this.fBat.adresse, superficie: this.fBat.superficie, etat: this.fBat.etat as any, responsable: this.fBat.responsable }]);
    this.toast.show('bat', `Bâtiment enregistré — ${this.fBat.nom}`);
    this.saving.set(false);
    this.fBat = { nom:'', type:'mairie', adresse:'', responsable:'', superficie:0, annee:0, etat:'bon' };
    this.active.set('liste');
  }

  ajouterTravaux(): void {
    if (!this.fTrav.batiment || !this.fTrav.dateDebut) { this.toast.show('bat', 'Bâtiment et date obligatoires'); return; }
    this.saving.set(true);
    this.st.travaux.update(l => [...l, { id: String(Date.now()), batiment: this.fTrav.batiment, type: this.fTrav.type as any, description: this.fTrav.description, dateDebut: this.fTrav.dateDebut, coutEstime: this.fTrav.cout, prestataire: this.fTrav.prestataire, statut: 'planifie' as any }]);
    this.toast.show('bat', `Travaux enregistrés — ${this.fTrav.batiment}`);
    this.saving.set(false);
    this.showAddTrav.set(false);
    this.fTrav = { batiment:'', type:'reparation', description:'', dateDebut:'', cout:0, prestataire:'' };
  }

  onBatPhoto(e: Event)  { const f = (e.target as HTMLInputElement).files; if (f) this.batPhotos  = Array.from(f); }
  onTravPhoto(e: Event) { const f = (e.target as HTMLInputElement).files; if (f) this.travPhotos = Array.from(f); }

  chipEtat(e: string): string   { return { bon:'cv', moyen:'cp', degrade:'ce' }[e] ?? 'cp'; }
  chipStatut(s: string): string { return { planifie:'cm', en_cours:'cp', termine:'cv', suspendu:'ce' }[s] ?? 'cp'; }
}
