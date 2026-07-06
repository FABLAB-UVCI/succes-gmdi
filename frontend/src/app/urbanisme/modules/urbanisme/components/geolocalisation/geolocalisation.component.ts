import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UrbanismeService } from '../../../../core/services/urbanisme.service';
import { ToastService } from '../../../../core/services/toast.service';
import { TypeEquipement } from '../../../../core/models/urbanisme.models';

const CATEGORIES: { val: TypeEquipement | ''; label: string; icon: string; color: string }[] = [
  { val: '',              label: 'Tous',              icon: 'ti-map-pin',             color: '#F47920' },
  { val: 'ecole',         label: 'Écoles',            icon: 'ti-school',              color: '#185FA5' },
  { val: 'sante',         label: 'Centres santé',     icon: 'ti-heart-rate-monitor',  color: '#e63946' },
  { val: 'marche',        label: 'Marchés',           icon: 'ti-shopping-cart',       color: '#F77F00' },
  { val: 'espace_vert',   label: 'Espaces verts',     icon: 'ti-trees',               color: '#009A44' },
  { val: 'sport',         label: 'Sport',             icon: 'ti-ball-football',       color: '#F47920' },
  { val: 'securite',      label: 'Sécurité',          icon: 'ti-shield',              color: '#6b7280' },
  { val: 'commissariat',  label: 'Commissariats',     icon: 'ti-building-community',  color: '#374151' },
  { val: 'gendarmerie',   label: 'Gendarmeries',      icon: 'ti-badge',               color: '#1e3a5f' },
  { val: 'eaux_forets',   label: 'Eaux & Forêts',     icon: 'ti-leaf',                color: '#2d6a4f' },
];

@Component({
  selector: 'app-geolocalisation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="panel">
  <div class="ph">
    <div class="pt"><i class="ti ti-map-pins"></i>Géolocalisation des équipements publics</div>
    <button class="btn-s" (click)="showAdd.set(!showAdd())"><i class="ti ti-plus"></i>Ajouter établissement</button>
  </div>

  <!-- Formulaire ajout ─────────────────────────────────────────────────── -->
  @if (showAdd()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="fsec">Nouvel établissement public</div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Nom de l'établissement</div><input class="fi" [(ngModel)]="fEq.nom" placeholder="Ex: École Primaire Cocody 12"></div>
        <div class="fg"><div class="fl">Type</div>
          <select class="fs" [(ngModel)]="fEq.type">
            @for (c of categories.slice(1); track c.val) {
              <option [value]="c.val">{{c.label}}</option>
            }
          </select>
        </div>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Adresse</div><input class="fi" [(ngModel)]="fEq.adresse"></div>
        <div class="fg"><div class="fl">Quartier</div><input class="fi" [(ngModel)]="fEq.quartier"></div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Latitude</div><input class="fi" type="number" step="0.000001" [(ngModel)]="fEq.lat" placeholder="5.3600"></div>
        <div class="fg"><div class="fl">Longitude</div><input class="fi" type="number" step="0.000001" [(ngModel)]="fEq.lng" placeholder="-4.0083"></div>
        <div class="fg"><div class="fl">Capacité</div><input class="fi" type="number" [(ngModel)]="fEq.capacite" placeholder="Ex: 600"></div>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Responsable</div><input class="fi" [(ngModel)]="fEq.responsable"></div>
        <div class="fg"><div class="fl">État</div>
          <select class="fs" [(ngModel)]="fEq.etat">
            <option value="bon">Bon</option><option value="moyen">Moyen</option><option value="degrade">Dégradé</option>
          </select>
        </div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAdd.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="ajouterEquipement()">
          @if (saving()) { <i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Enregistrement… }
          @else { <i class="ti ti-map-pin-plus"></i>Géolocaliser }
        </button>
      </div>
    </div>
  }

  <!-- Filtres par catégorie ────────────────────────────────────────────── -->
  <div style="padding:.75rem 1rem;border-bottom:.5px solid var(--color-border-tertiary);display:flex;gap:6px;flex-wrap:wrap">
    @for (c of categories; track c.val) {
      <button
        class="btn-s"
        [style.border-color]="filtreType===c.val ? c.color : ''"
        [style.color]="filtreType===c.val ? c.color : ''"
        [style.background]="filtreType===c.val ? c.color+'15' : ''"
        (click)="filtreType=c.val"
      >
        <i class="ti {{c.icon}}"></i>
        {{c.label}}
        <span style="font-size:10px;font-weight:600">({{countCat(c.val)}})</span>
      </button>
    }
  </div>

  <!-- Carte + Liste côte à côte ────────────────────────────────────────── -->
  <div style="display:grid;grid-template-columns:1fr 1fr;height:420px">

    <!-- Carte points ──────────────────────────────────────────────────── -->
    <div class="sig-map" style="border-radius:0;border-right:.5px solid var(--color-border-tertiary)">
      <div class="sig-bg">
        <div class="sig-grid"></div>
        @for (eq of equipementsFiltres(); track eq.id) {
          <div
            class="sig-pin"
            [style.left.%]="coordToX(eq.coordonnees?.lng ?? 0)"
            [style.top.%]="coordToY(eq.coordonnees?.lat ?? 0)"
            [style.color]="colorType(eq.type)"
            [class.sel]="selected()===eq.id"
            (click)="selected.set(eq.id)"
            [title]="eq.nom"
          >
            <i class="ti {{iconType(eq.type)}}" style="font-size:16px"></i>
          </div>
        }
        @if (equipementsFiltres().length === 0) {
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:12px">
            <div style="text-align:center"><i class="ti ti-map-pin-off" style="font-size:28px;display:block;margin-bottom:6px"></i>Aucun établissement dans cette catégorie</div>
          </div>
        }
        <div style="position:absolute;bottom:6px;right:6px;font-size:10px;color:#999">SIG — Commune</div>
      </div>
    </div>

    <!-- Détail sélectionné ou liste ──────────────────────────────────── -->
    <div style="overflow-y:auto">
      @if (equipementSelectionne()) {
        @let eq = equipementSelectionne()!;
        <div style="padding:1rem">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div style="width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px" [style.background]="colorType(eq.type)+'20'" [style.color]="colorType(eq.type)">
              <i class="ti {{iconType(eq.type)}}"></i>
            </div>
            <div>
              <div style="font-weight:500;font-size:13px">{{eq.nom}}</div>
              <div style="font-size:11px;color:var(--color-text-secondary)">{{labelType(eq.type)}}</div>
            </div>
          </div>
          <div class="detail-grid">
            <div class="detail-item"><div class="detail-label">Adresse</div><div class="detail-val">{{eq.adresse}}</div></div>
            <div class="detail-item"><div class="detail-label">Quartier</div><div class="detail-val">{{eq.quartier}}</div></div>
            @if (eq.capacite) {
              <div class="detail-item"><div class="detail-label">Capacité</div><div class="detail-val">{{eq.capacite | number}}</div></div>
            }
            <div class="detail-item"><div class="detail-label">État</div><div class="detail-val"><span class="chip" [ngClass]="chipEtat(eq.etat??eq.statut)">{{eq.etat??eq.statut}}</span></div></div>
            @if (eq.responsable) {
              <div class="detail-item"><div class="detail-label">Responsable</div><div class="detail-val">{{eq.responsable}}</div></div>
            }
            <div class="detail-item"><div class="detail-label">Coordonnées</div><div class="detail-val mono-td" style="font-size:11px">{{eq.coordonnees?.lat | number:'1.4-6'}}, {{eq.coordonnees?.lng | number:'1.4-6'}}</div></div>
          </div>
          <button class="btn-s" style="margin-top:10px;font-size:11px" (click)="selected.set('')">
            <i class="ti ti-x"></i>Fermer
          </button>
        </div>
      } @else {
        <div style="padding:.5rem 0">
          @for (eq of equipementsFiltres(); track eq.id) {
            <div
              class="equip-item"
              (click)="selected.set(eq.id)"
              [class.sel-item]="selected()===eq.id"
            >
              <i class="ti {{iconType(eq.type)}}" [style.color]="colorType(eq.type)"></i>
              <div>
                <div style="font-size:12px;font-weight:500">{{eq.nom}}</div>
                <div style="font-size:11px;color:var(--color-text-secondary)">{{eq.quartier}} · {{labelType(eq.type)}}</div>
              </div>
              <span class="chip" [ngClass]="chipEtat(eq.etat ?? eq.statut)" style="margin-left:auto">{{eq.etat ?? eq.statut}}</span>
            </div>
          }
          @empty {
            <div style="text-align:center;padding:2rem;color:var(--color-text-secondary);font-size:12px">
              Aucun établissement
            </div>
          }
        </div>
      }
    </div>
  </div>

  @if (toast.get('geo')?.visible) {
    <div class="success-toast show" style="margin:8px 1rem"><i class="ti ti-check"></i>{{toast.get('geo')?.message}}</div>
  }
</div>

<style>
.detail-grid  { display:grid;grid-template-columns:1fr 1fr;gap:8px }
.detail-item  { background:var(--color-background-secondary);border-radius:6px;padding:8px 10px }
.detail-label { font-size:10px;color:var(--color-text-secondary);font-weight:500;margin-bottom:2px }
.detail-val   { font-size:12px;font-weight:500 }
.equip-item   { display:flex;align-items:center;gap:10px;padding:10px 1rem;cursor:pointer;border-bottom:.5px solid var(--color-border-tertiary);transition:background .1s }
.equip-item:hover, .equip-item.sel-item { background:var(--color-background-secondary) }
.equip-item i { font-size:18px;flex-shrink:0 }
.sig-pin.sel  { transform:translate(-50%,-50%) scale(1.4);z-index:10 }
</style>
  `
})
export class GeolocalisationComponent implements OnInit {
  readonly urb   = inject(UrbanismeService);
  readonly toast = inject(ToastService);
  saving   = signal(false);
  showAdd  = signal(false);
  selected = signal('');
  filtreType: TypeEquipement | '' = '';
  categories = CATEGORIES;
  fEq = { nom:'', type:'ecole' as TypeEquipement, adresse:'', quartier:'', lat:5.3599, lng:-4.0082, capacite:0, responsable:'', etat:'bon' };

  // Bornes GPS approximatives pour la commune (Abidjan)
  private readonly LAT_MIN = 5.30; private readonly LAT_MAX = 5.42;
  private readonly LNG_MIN = -4.07; private readonly LNG_MAX = -3.96;

  equipementsFiltres = computed(() =>
    this.filtreType ? this.urb.equipements().filter(e => e.type === this.filtreType) : this.urb.equipements()
  );

  equipementSelectionne = computed(() =>
    this.selected() ? this.urb.equipements().find(e => e.id === this.selected()) : undefined
  );

  ngOnInit(): void { this.urb.loadEquipements(); }

  countCat(t: string): number { return t ? this.urb.equipements().filter(e => e.type === t).length : this.urb.equipements().length; }

  coordToX(lng: number): number { return Math.max(2, Math.min(96, ((lng - this.LNG_MIN) / (this.LNG_MAX - this.LNG_MIN)) * 100)); }
  coordToY(lat: number): number { return Math.max(2, Math.min(96, ((this.LAT_MAX - lat) / (this.LAT_MAX - this.LAT_MIN)) * 100)); }

  ajouterEquipement(): void {
    if (!this.fEq.nom || !this.fEq.adresse) { this.toast.show('geo', 'Nom et adresse obligatoires'); return; }
    this.saving.set(true);
    this.urb.ajouterEquipement({
      nom: this.fEq.nom, type: this.fEq.type, adresse: this.fEq.adresse, quartier: this.fEq.quartier,
      coordonnees: { lat: this.fEq.lat, lng: this.fEq.lng },
      capacite: this.fEq.capacite ? String(this.fEq.capacite) : undefined, responsable: this.fEq.responsable, etat: this.fEq.etat as any
    }).subscribe({
      next: () => { this.toast.show('geo', `Établissement géolocalisé — ${this.fEq.nom}`); this.saving.set(false); this.showAdd.set(false); },
      error: () => this.saving.set(false)
    });
  }

  iconType(t: string): string  {
    return {
      ecole:'ti-school', sante:'ti-heart-rate-monitor', marche:'ti-shopping-cart',
      espace_vert:'ti-trees', sport:'ti-ball-football', culte:'ti-building-church',
      securite:'ti-shield', commissariat:'ti-building-community', gendarmerie:'ti-badge',
      eaux_forets:'ti-leaf', autre:'ti-building'
    }[t] ?? 'ti-map-pin';
  }
  colorType(t: string): string {
    return {
      ecole:'#185FA5', sante:'#e63946', marche:'#F77F00', espace_vert:'#009A44',
      sport:'#F47920', culte:'#6b7280', securite:'#374151',
      commissariat:'#374151', gendarmerie:'#1e3a5f', eaux_forets:'#2d6a4f', autre:'#9ca3af'
    }[t] ?? '#F47920';
  }
  labelType(t: string): string { return CATEGORIES.find(c => c.val === t)?.label ?? t; }
  chipEtat(e: string): string  { return { bon:'cv', moyen:'cp', degrade:'ce' }[e] ?? 'cp'; }
}
