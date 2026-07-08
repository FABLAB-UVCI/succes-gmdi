import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatrimoineService } from '../../../../core/services/patrimoine.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FcfaPipe } from '../../../../core/pipes/fcfa.pipe';

type Tab = 'tous' | 'mobilier' | 'informatique' | 'vehicule' | 'equipement' | 'nouveau';

const CAT_COLORS: Record<string, string> = { immobilier:'#003366', vehicule:'#185FA5', equipement:'#F77F00', informatique:'#C9A84C', mobilier:'#888780', terrain:'#009A44' };
const CAT_ICONS:  Record<string, string> = { immobilier:'ti-building', vehicule:'ti-car', equipement:'ti-settings', informatique:'ti-device-desktop', mobilier:'ti-armchair', terrain:'ti-trees' };
const STAT_CHIP:  Record<string, string> = { occupe:'ci', disponible:'cv', loue:'cg', en_maintenance:'cw' };

@Component({
  selector: 'app-inventaire',
  standalone: true,
  imports: [CommonModule, FormsModule, FcfaPipe],
  template: `
<div class="nav">
  @for (t of tabs; track t.id) {
    <div class="ni" [class.on]="activeTab() === t.id" (click)="navigate(t.id)">
      <i class="ti {{ t.icon }}"></i>{{ t.label }}
    </div>
  }
</div>

<!-- ── Tous les biens ─────────────────────────────────────────────────── -->
@if (activeTab() === 'tous') {
  <div class="card">
    <div class="ch">
      <h3><i class="ti ti-clipboard-list"></i>Inventaire général des biens</h3>
      <div class="ha">
        <button class="bs" (click)="exportLocal()"><i class="ti ti-download"></i>Exporter JSON</button>
        <button class="bd"><i class="ti ti-printer"></i>Imprimer</button>
      </div>
    </div>
    <div class="tf">
      <input type="text" [ngModel]="filtreSearch()" (ngModelChange)="filtreSearch.set($event)" placeholder="Rechercher désignation, référence...">
      <select [ngModel]="filtreCategorie()" (ngModelChange)="filtreCategorie.set($event)">
        <option value="">Toutes catégories</option>
        @for (c of categories; track c.v) { <option [value]="c.v">{{ c.l }}</option> }
      </select>
      <select [ngModel]="filtreStatut()" (ngModelChange)="filtreStatut.set($event)">
        <option value="">Tous statuts</option>
        <option value="occupe">Occupé</option><option value="disponible">Disponible</option>
        <option value="loue">Loué</option><option value="en_maintenance">Maintenance</option>
      </select>
      <span class="rc">{{ biensFiltres().length }} bien(s)</span>
    </div>
    <div style="overflow-x:auto">
      <table class="tbl" style="table-layout:fixed;min-width:640px">
        <thead><tr>
          <th style="width:14%">Référence</th><th style="width:28%">Désignation</th>
          <th style="width:12%">Catégorie</th><th style="width:16%">Valeur actuelle</th>
          <th style="width:18%">Affectation</th><th style="width:10%">Statut</th><th style="width:2%"></th>
        </tr></thead>
        <tbody>
          @if (pat.loadingBiens()) {
            <tr><td colspan="7" style="text-align:center;padding:1.5rem;font-size:12px;color:var(--color-text-secondary)">Chargement…</td></tr>
          }
          @for (b of biensFiltres(); track b.id) {
            <tr>
              <td class="mono">{{ b.reference }}</td>
              <td>
                <div style="display:flex;align-items:center;gap:6px">
                  <div [style.background]="catColor(b.categorie) + '1a'" style="width:24px;height:24px;border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <i class="ti {{ catIcon(b.categorie) }}" [style.color]="catColor(b.categorie)" style="font-size:12px"></i>
                  </div>
                  <span class="bold">{{ b.designation }}</span>
                </div>
              </td>
              <td><span class="chip cgo">{{ b.categorie }}</span></td>
              <td class="right bold">{{ b.valeurActuelle | fcfa }}</td>
              <td style="font-size:11px;color:var(--color-text-secondary)">{{ b.affectation }}</td>
              <td><span class="chip" [ngClass]="chipStatut(b.statut)">{{ b.statut }}</span></td>
              <td>
                <button class="bti bl" (click)="voirFiche(b.id)" title="Voir fiche + QR">
                  <i class="ti ti-qrcode"></i>
                </button>
              </td>
            </tr>
          }
          @empty {
            <tr><td colspan="7" style="text-align:center;padding:2rem;font-style:italic;font-size:12px;color:var(--color-text-secondary)">Aucun bien trouvé</td></tr>
          }
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">Valeur nette totale</td>
            <td class="right" style="color:#C9A84C">{{ totalValeur() | fcfa }}</td>
            <td colspan="3"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
}

<!-- ── Mobilier ───────────────────────────────────────────────────────── -->
@if (activeTab() === 'mobilier') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-armchair"></i>Mobilier de bureau</h3></div>
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#C9A84C">48</div><div class="kl">Articles mobilier</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">38</div><div class="kl">En bon état</div><div class="bar"><div style="width:79%;background:#009A44"></div></div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">8</div><div class="kl">Usagé</div></div>
        <div class="kc"><div class="kv" style="color:#E24B4A">2</div><div class="kl">Hors service</div></div>
      </div>
      @if (toast.get('mob')?.visible) { <div class="toast on"><i class="ti ti-check"></i>{{ toast.get('mob')?.message }}</div> }
      <div class="sl">Enregistrer du mobilier</div>
      <div class="row3">
        <div class="fg"><div class="lbl">Désignation <span class="req">*</span></div><input [(ngModel)]="mob.designation" placeholder="Ex: Bureau direction chêne"></div>
        <div class="fg"><div class="lbl">Quantité</div><input type="number" [(ngModel)]="mob.quantite" placeholder="Ex: 4" min="1"></div>
        <div class="fg"><div class="lbl">Valeur unitaire (FCFA)</div><input type="number" [(ngModel)]="mob.valeurUnitaire" placeholder="Ex: 250000"></div>
      </div>
      <div class="row3">
        <div class="fg"><div class="lbl">Localisation <span class="req">*</span></div><input [(ngModel)]="mob.localisation" placeholder="Ex: HdV — Salle de réunion"></div>
        <div class="fg"><div class="lbl">Date d'acquisition</div><input type="date" [(ngModel)]="mob.dateAcquisition"></div>
        <div class="fg"><div class="lbl">État</div>
          <select [(ngModel)]="mob.etat"><option value="neuf">Neuf</option><option value="bon">Bon</option><option value="use">Usagé</option><option value="hs">Hors service</option></select>
        </div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="enregMobilier()"><i class="ti ti-check"></i>Enregistrer</button></div>
      <div class="sl" style="margin-top:.75rem">Registre mobilier</div>
      <table class="tbl"><thead><tr><th>Désignation</th><th>Localisation</th><th>Valeur</th><th>Affectation</th><th>Statut</th></tr></thead>
      <tbody>
        @for (b of biensParCategorie('mobilier'); track b.id) {
          <tr>
            <td class="bold">{{ b.designation }}</td>
            <td>{{ b.localisation }}</td>
            <td class="right bold">{{ b.valeurActuelle | fcfa }}</td>
            <td style="font-size:11px">{{ b.affectation }}</td>
            <td><span class="chip" [ngClass]="chipStatut(b.statut)">{{ b.statut }}</span></td>
          </tr>
        }
        @empty {
          <tr><td colspan="5" style="text-align:center;padding:1.5rem;font-style:italic;font-size:12px;color:var(--color-text-secondary)">Aucun mobilier enregistré</td></tr>
        }
      </tbody></table>
    </div>
  </div>
}

<!-- ── Informatique ───────────────────────────────────────────────────── -->
@if (activeTab() === 'informatique') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-device-desktop"></i>Parc informatique</h3></div>
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#C9A84C">94</div><div class="kl">Unités informatiques</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">76</div><div class="kl">En service</div><div class="bar"><div style="width:81%;background:#009A44"></div></div></div>
        <div class="kc"><div class="kv" style="color:#E24B4A">12</div><div class="kl">Obsolètes</div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">6</div><div class="kl">En réparation</div></div>
      </div>
      @if (toast.get('inf')?.visible) { <div class="toast on"><i class="ti ti-check"></i>{{ toast.get('inf')?.message }}</div> }
      <div class="sl">Enregistrer du matériel informatique</div>
      <div class="row3">
        <div class="fg"><div class="lbl">Type de matériel <span class="req">*</span></div>
          <select [(ngModel)]="inf.type">
            <option value="">-- Choisir --</option>
            @for (t of typesInfo; track t) { <option>{{ t }}</option> }
          </select>
        </div>
        <div class="fg"><div class="lbl">Marque / Modèle</div><input [(ngModel)]="inf.modele" placeholder="Ex: HP EliteDesk 800 G5"></div>
        <div class="fg"><div class="lbl">N° de série</div><input [(ngModel)]="inf.serie" placeholder="Ex: SN-2022-08374"></div>
      </div>
      <div class="row3">
        <div class="fg"><div class="lbl">Affectation <span class="req">*</span></div><input [(ngModel)]="inf.affectation" placeholder="Ex: État Civil — poste 3"></div>
        <div class="fg"><div class="lbl">Valeur d'achat (FCFA)</div><input type="number" [(ngModel)]="inf.valeur" placeholder="Ex: 450000"></div>
        <div class="fg"><div class="lbl">Date d'acquisition</div><input type="date" [(ngModel)]="inf.dateAcquisition"></div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="enregInformatique()"><i class="ti ti-check"></i>Enregistrer</button></div>
      <div class="sl" style="margin-top:.75rem">Registre informatique</div>
      <table class="tbl"><thead><tr><th>Désignation</th><th>Affectation</th><th>Valeur (FCFA)</th><th>Statut</th></tr></thead>
      <tbody>
        @for (b of biensParCategorie('informatique'); track b.id) {
          <tr>
            <td class="bold">{{ b.designation }}</td>
            <td style="font-size:11px">{{ b.affectation }}</td>
            <td class="right">{{ b.valeurActuelle | fcfa }}</td>
            <td><span class="chip" [ngClass]="chipStatut(b.statut)">{{ b.statut }}</span></td>
          </tr>
        }
        @empty {
          <tr><td colspan="4" style="text-align:center;padding:1.5rem;font-style:italic;font-size:12px;color:var(--color-text-secondary)">Aucun matériel informatique enregistré</td></tr>
        }
      </tbody></table>
    </div>
  </div>
}

<!-- ── Véhicules ──────────────────────────────────────────────────────── -->
@if (activeTab() === 'vehicule') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-car"></i>Parc automobile municipal</h3>
      <button class="bs" (click)="pat.exportLocal(pat.vehicules(), 'vehicules')"><i class="ti ti-download"></i>Exporter</button>
    </div>
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#C9A84C">8</div><div class="kl">Véhicules au total</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">6</div><div class="kl">En service</div><div class="bar"><div style="width:75%;background:#009A44"></div></div></div>
        <div class="kc"><div class="kv" style="color:#E24B4A">1</div><div class="kl">En panne</div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">1</div><div class="kl">En maintenance</div></div>
      </div>
      @if (toast.get('veh')?.visible) { <div class="toast on"><i class="ti ti-check"></i>{{ toast.get('veh')?.message }}</div> }
      <div class="sl">Enregistrer un véhicule</div>
      <div class="row3">
        <div class="fg"><div class="lbl">Marque / Modèle <span class="req">*</span></div><input [(ngModel)]="veh.modele" placeholder="Ex: Toyota Land Cruiser 200"></div>
        <div class="fg"><div class="lbl">N° immatriculation <span class="req">*</span></div><input [(ngModel)]="veh.immatriculation" placeholder="Ex: CI 1234 AB"></div>
        <div class="fg"><div class="lbl">Kilométrage actuel</div><input type="number" [(ngModel)]="veh.kilometrage" placeholder="Ex: 45000"></div>
      </div>
      <div class="row4">
        <div class="fg"><div class="lbl">Affectation <span class="req">*</span></div><input [(ngModel)]="veh.affectation" placeholder="Ex: Cabinet du Maire"></div>
        <div class="fg"><div class="lbl">Valeur (FCFA)</div><input type="number" [(ngModel)]="veh.valeur" placeholder="Ex: 45000000"></div>
        <div class="fg"><div class="lbl">Fin assurance</div><input type="date" [(ngModel)]="veh.finAssurance"></div>
        <div class="fg"><div class="lbl">Fin visite technique</div><input type="date" [(ngModel)]="veh.finVT"></div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="enregVehicule()"><i class="ti ti-check"></i>Enregistrer</button></div>
      <div class="sl" style="margin-top:.75rem">Registre des véhicules</div>
      <div style="overflow-x:auto">
        <table class="tbl" style="table-layout:fixed;min-width:620px">
          <thead><tr>
            <th style="width:24%">Véhicule</th><th style="width:14%">Immatriculation</th>
            <th style="width:14%">Kilométrage</th><th style="width:16%">Affectation</th>
            <th style="width:12%">Assurance</th><th style="width:12%">Visite tech.</th><th style="width:8%">Statut</th>
          </tr></thead>
          <tbody>
            @for (v of pat.vehicules(); track v.id) {
              <tr>
                <td class="bold">{{ v.modele }}</td>
                <td class="mono">{{ v.immatriculation }}</td>
                <td class="right">{{ v.kilometrage | number:'1.0-0' }} km</td>
                <td style="font-size:11px">{{ v.affectation }}</td>
                <td [style.color]="assExpire(v.finAssurance) ? '#E24B4A' : '#009A44'">{{ v.finAssurance }}</td>
                <td [style.color]="assExpire(v.finVisiteTechnique) ? '#E24B4A' : '#009A44'">{{ v.finVisiteTechnique }}</td>
                <td><span class="chip" [ngClass]="v.statut === 'occupe' ? 'ci' : 'cw'">{{ v.statut === 'occupe' ? 'Service' : 'Maint.' }}</span></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>
}

<!-- ── Équipements ────────────────────────────────────────────────────── -->
@if (activeTab() === 'equipement') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-settings"></i>Équipements techniques</h3></div>
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#C9A84C">36</div><div class="kl">Équipements enregistrés</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">28</div><div class="kl">Opérationnels</div><div class="bar"><div style="width:78%;background:#009A44"></div></div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">5</div><div class="kl">En maintenance</div></div>
        <div class="kc"><div class="kv" style="color:#E24B4A">3</div><div class="kl">Hors service</div></div>
      </div>
      @if (toast.get('eqp')?.visible) { <div class="toast on"><i class="ti ti-check"></i>{{ toast.get('eqp')?.message }}</div> }
      <div class="sl">Enregistrer un équipement</div>
      <div class="row3">
        <div class="fg"><div class="lbl">Désignation <span class="req">*</span></div><input [(ngModel)]="eqp.designation" placeholder="Ex: Groupe électrogène 250 KVA"></div>
        <div class="fg"><div class="lbl">Marque / Référence</div><input [(ngModel)]="eqp.marque" placeholder="Ex: Caterpillar XE250"></div>
        <div class="fg"><div class="lbl">N° de série</div><input [(ngModel)]="eqp.serie" placeholder="Ex: CAT-2019-00892"></div>
      </div>
      <div class="row3">
        <div class="fg"><div class="lbl">Localisation <span class="req">*</span></div><input [(ngModel)]="eqp.localisation" placeholder="Ex: HdV — local technique"></div>
        <div class="fg"><div class="lbl">Valeur d'achat (FCFA)</div><input type="number" [(ngModel)]="eqp.valeur" placeholder="Ex: 18000000"></div>
        <div class="fg"><div class="lbl">Date d'acquisition</div><input type="date" [(ngModel)]="eqp.dateAcquisition"></div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="enregEquipement()"><i class="ti ti-check"></i>Enregistrer</button></div>
      <div class="sl" style="margin-top:.75rem">Registre équipements</div>
      <table class="tbl"><thead><tr><th>Désignation</th><th>Localisation</th><th>Valeur (FCFA)</th><th>Statut</th></tr></thead>
      <tbody>
        @for (b of biensParCategorie('equipement'); track b.id) {
          <tr>
            <td class="bold">{{ b.designation }}</td>
            <td>{{ b.localisation }}</td>
            <td class="right">{{ b.valeurActuelle | fcfa }}</td>
            <td><span class="chip" [ngClass]="chipStatut(b.statut)">{{ b.statut }}</span></td>
          </tr>
        }
        @empty {
          <tr><td colspan="4" style="text-align:center;padding:1.5rem;font-style:italic;font-size:12px;color:var(--color-text-secondary)">Aucun équipement enregistré</td></tr>
        }
      </tbody></table>
    </div>
  </div>
}

<!-- ── Nouveau bien ───────────────────────────────────────────────────── -->
@if (activeTab() === 'nouveau') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-plus"></i>Enregistrer un nouveau bien</h3></div>
    @if (toast.get('nv')?.visible) { <div class="toast on"><i class="ti ti-check"></i>{{ toast.get('nv')?.message }}</div> }
    <div class="pb">
      <div class="sl">Identification</div>
      <div class="row3">
        <div class="fg"><div class="lbl">Catégorie <span class="req">*</span></div>
          <select [(ngModel)]="nv.categorie">
            <option value="">-- Choisir --</option>
            @for (c of categories; track c.v) { <option [value]="c.v">{{ c.l }}</option> }
          </select>
        </div>
        <div class="fg"><div class="lbl">Désignation <span class="req">*</span></div><input [(ngModel)]="nv.designation" placeholder="Nom du bien"></div>
        <div class="fg"><div class="lbl">Localisation <span class="req">*</span></div><input [(ngModel)]="nv.localisation" placeholder="Où se trouve ce bien ?"></div>
      </div>
      <div class="sl">Valeur et acquisition</div>
      <div class="row4">
        <div class="fg"><div class="lbl">Valeur d'acquisition (FCFA) <span class="req">*</span></div><input type="number" [(ngModel)]="nv.valeur" placeholder="Ex: 5000000"></div>
        <div class="fg"><div class="lbl">Date d'acquisition <span class="req">*</span></div><input type="date" [(ngModel)]="nv.dateAcquisition"></div>
        <div class="fg"><div class="lbl">Affectation <span class="req">*</span></div><input [(ngModel)]="nv.affectation" placeholder="Service utilisateur"></div>
        <div class="fg"><div class="lbl">Taux amortissement (%/an)</div><input type="number" [(ngModel)]="nv.tauxAmort" placeholder="Ex: 20" min="0" max="100"></div>
      </div>
      <div class="fa">
        <button class="bs" (click)="resetNouveauBien()"><i class="ti ti-x"></i>Effacer</button>
        <button class="bp" [disabled]="saving()" (click)="enregistrerBien()"><i class="ti ti-check"></i>Enregistrer et générer QR code</button>
      </div>
    </div>
  </div>
}
  `,
})
export class InventaireComponent implements OnInit {
  readonly pat   = inject(PatrimoineService);
  readonly toast = inject(ToastService);

  activeTab       = signal<Tab>('tous');
  saving          = signal(false);
  filtreSearch    = signal('');
  filtreCategorie = signal('');
  filtreStatut    = signal('');

  tabs = [
    { id: 'tous'         as Tab, label: 'Tous les biens', icon: 'ti-list'          },
    { id: 'mobilier'     as Tab, label: 'Mobilier',        icon: 'ti-armchair'      },
    { id: 'informatique' as Tab, label: 'Informatique',    icon: 'ti-device-desktop'},
    { id: 'vehicule'     as Tab, label: 'Véhicules',       icon: 'ti-car'           },
    { id: 'equipement'   as Tab, label: 'Équipements',     icon: 'ti-settings'      },
    { id: 'nouveau'      as Tab, label: 'Nouveau bien',    icon: 'ti-plus'          },
  ];

  categories = [
    { v: 'mobilier', l: 'Mobilier' }, { v: 'informatique', l: 'Informatique' },
    { v: 'vehicule', l: 'Véhicule' }, { v: 'equipement', l: 'Équipement' },
    { v: 'immobilier', l: 'Immobilier' }, { v: 'terrain', l: 'Terrain' },
  ];

  typesInfo = ['Ordinateur de bureau','Ordinateur portable','Imprimante','Serveur','Tablette','Vidéoprojecteur','Écran','Scanner'];

  mob    = { designation: '', quantite: null as number|null, valeurUnitaire: null as number|null, localisation: '', dateAcquisition: '', etat: 'bon' };
  inf    = { type: '', modele: '', serie: '', affectation: '', valeur: null as number|null, dateAcquisition: '' };
  veh    = { modele: '', immatriculation: '', kilometrage: null as number|null, affectation: '', valeur: null as number|null, finAssurance: '', finVT: '' };
  eqp    = { designation: '', marque: '', serie: '', localisation: '', valeur: null as number|null, dateAcquisition: '' };
  nv     = { categorie: '', designation: '', localisation: '', valeur: null as number|null, dateAcquisition: '', affectation: '', tauxAmort: null as number|null };

  biensFiltres = computed(() => this.pat.filtrerBiens(this.filtreSearch(), this.filtreCategorie(), this.filtreStatut()));
  totalValeur  = computed(() => this.biensFiltres().reduce((s, b) => s + b.valeurActuelle, 0));

  ngOnInit(): void { this.pat.loadBiens(); this.pat.loadVehicules(); }

  navigate(tab: Tab): void {
    this.activeTab.set(tab);
    if (tab === 'vehicule') { this.pat.loadVehicules(); return; }
    // Pour "tous" ou les sous-catégories on recharge les biens sans filtre ou avec filtre
    const cat = (tab === 'mobilier' || tab === 'informatique' || tab === 'equipement') ? tab : undefined;
    this.pat.loadBiens(cat ? { categorie: cat } : {});
  }


  private errMsg(err: any): string {
    return err?.error?.message ?? (err?.error?.errors ? (Object.values(err.error.errors) as string[][]).flat().join(' — ') : 'Erreur serveur');
  }

  enregMobilier(): void {
    if (!this.mob.designation || !this.mob.localisation) { this.toast.showError('Champs manquants', 'Désignation et localisation obligatoires'); return; }
    this.saving.set(true);
    this.pat.enregistrerMobilier({ designation: this.mob.designation, quantite: this.mob.quantite ?? undefined, valeurUnitaire: this.mob.valeurUnitaire ?? undefined, localisation: this.mob.localisation, dateAcquisition: this.mob.dateAcquisition || undefined, etat: this.mob.etat }).subscribe({
      next: () => { this.toast.show('mob', `Mobilier enregistré — ${this.mob.designation}`); this.saving.set(false); this.mob = { designation: '', quantite: null, valeurUnitaire: null, localisation: '', dateAcquisition: '', etat: 'bon' }; },
      error: (err) => { this.toast.showError('Erreur', this.errMsg(err)); this.saving.set(false); },
    });
  }

  enregInformatique(): void {
    if (!this.inf.type || !this.inf.affectation) { this.toast.showError('Champs manquants', 'Type et affectation obligatoires'); return; }
    this.saving.set(true);
    this.pat.enregistrerInformatique({ type: this.inf.type, modele: this.inf.modele, serie: this.inf.serie, affectation: this.inf.affectation, valeur: this.inf.valeur ?? undefined, dateAcquisition: this.inf.dateAcquisition || undefined }).subscribe({
      next: () => { this.toast.show('inf', `Matériel enregistré — ${this.inf.type} → ${this.inf.affectation}`); this.saving.set(false); this.inf = { type: '', modele: '', serie: '', affectation: '', valeur: null, dateAcquisition: '' }; },
      error: (err) => { this.toast.showError('Erreur', this.errMsg(err)); this.saving.set(false); },
    });
  }

  enregVehicule(): void {
    if (!this.veh.modele || !this.veh.immatriculation || !this.veh.affectation) { this.toast.showError('Champs manquants', 'Modèle, immatriculation et affectation obligatoires'); return; }
    this.saving.set(true);
    this.pat.enregistrerVehicule({ modele: this.veh.modele, immatriculation: this.veh.immatriculation, kilometrage: this.veh.kilometrage ?? undefined, affectation: this.veh.affectation, valeur: this.veh.valeur ?? undefined, finAssurance: this.veh.finAssurance || undefined, finVisiteTechnique: this.veh.finVT || undefined }).subscribe({
      next: v => {
        this.toast.show('veh', `Véhicule enregistré — ${v.modele} — ${v.immatriculation}`);
        this.saving.set(false);
        this.veh = { modele: '', immatriculation: '', kilometrage: null, affectation: '', valeur: null, finAssurance: '', finVT: '' };
        this.pat.loadVehicules();
      },
      error: (err) => { this.toast.showError('Erreur', this.errMsg(err)); this.saving.set(false); },
    });
  }

  enregEquipement(): void {
    if (!this.eqp.designation || !this.eqp.localisation) { this.toast.showError('Champs manquants', 'Désignation et localisation obligatoires'); return; }
    this.saving.set(true);
    this.pat.enregistrerEquipement({ designation: this.eqp.designation, marque: this.eqp.marque, serie: this.eqp.serie, localisation: this.eqp.localisation, valeur: this.eqp.valeur ?? undefined, dateAcquisition: this.eqp.dateAcquisition || undefined }).subscribe({
      next: () => { this.toast.show('eqp', `Équipement enregistré — ${this.eqp.designation}`); this.saving.set(false); this.eqp = { designation: '', marque: '', serie: '', localisation: '', valeur: null, dateAcquisition: '' }; },
      error: (err) => { this.toast.showError('Erreur', this.errMsg(err)); this.saving.set(false); },
    });
  }

  biensParCategorie(cat: string) { return this.pat.biens().filter(b => b.categorie === cat); }

  enregistrerBien(): void {
    if (!this.nv.categorie || !this.nv.designation || !this.nv.localisation || !this.nv.valeur || !this.nv.dateAcquisition || !this.nv.affectation) {
      this.toast.showError('Champs manquants', 'Veuillez remplir tous les champs obligatoires'); return;
    }
    this.saving.set(true);
    this.pat.enregistrerBien({ categorie: this.nv.categorie, designation: this.nv.designation, localisation: this.nv.localisation, valeurAcquisition: this.nv.valeur!, dateAcquisition: this.nv.dateAcquisition, affectation: this.nv.affectation, tauxAmortissement: this.nv.tauxAmort ?? undefined }).subscribe({
      next: b => {
        this.toast.show('nv', `Bien enregistré — ${b.reference}`);
        this.saving.set(false);
        this.resetNouveauBien();
        this.pat.loadBiens({});
        this.activeTab.set('tous');
      },
      error: (err) => { this.toast.showError('Erreur', this.errMsg(err)); this.saving.set(false); },
    });
  }

  resetNouveauBien(): void { this.nv = { categorie: '', designation: '', localisation: '', valeur: null, dateAcquisition: '', affectation: '', tauxAmort: null }; }

  voirFiche(id: string): void { const b = this.pat.biens().find(x => x.id === id); if (b) alert(`Fiche patrimoniale\n\nRéférence : ${b.reference}\nQR Code    : ${b.qrCode ?? 'QR-' + b.reference}\nDésignation: ${b.designation}\nCatégorie  : ${b.categorie}\nLocalisation: ${b.localisation}\nAffectation: ${b.affectation}\nVal. acquisition: ${this.pat.formaterFCFA(b.valeurAcquisition)}\nValeur actuelle : ${this.pat.formaterFCFA(b.valeurActuelle)}\nDate acquisition: ${b.dateAcquisition}\nStatut : ${b.statut}`); }

  exportLocal(): void { this.pat.exportLocal(this.pat.biens(), 'inventaire_biens'); }

  assExpire(date: string): boolean { return !!date && date < '2025-06'; }

  catColor(c: string): string { return CAT_COLORS[c] ?? '#888'; }
  catIcon(c: string): string  { return CAT_ICONS[c] ?? 'ti-box'; }
  chipStatut(s: string): string { return STAT_CHIP[s] ?? 'ci'; }
}
