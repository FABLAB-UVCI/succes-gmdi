import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatrimoineService } from '../../../../core/services/patrimoine.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FcfaPipe } from '../../../../core/pipes/fcfa.pipe';

type Tab = 'terrains' | 'batiments' | 'marches' | 'centres';

@Component({
  selector: 'app-immobilier',
  standalone: true,
  imports: [CommonModule, FormsModule, FcfaPipe],
  template: `
<div class="nav">
  @for (t of tabs; track t.id) {
    <div class="ni" [class.on]="activeTab() === t.id" (click)="activeTab.set(t.id)">
      <i class="ti {{ t.icon }}"></i>{{ t.label }}
    </div>
  }
</div>

<!-- ── Terrains ───────────────────────────────────────────────────────── -->
@if (activeTab() === 'terrains') {
  <div class="card">
    <div class="ch">
      <h3><i class="ti ti-trees"></i>Terrains communaux</h3>
      <button class="bs" (click)="pat.exportLocal(pat.terrains(), 'terrains')"><i class="ti ti-download"></i>Exporter</button>
    </div>
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#C9A84C">{{ terStats().total }}</div><div class="kl">Terrains enregistrés</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">{{ terStats().superficie | number:'1.0-0' }} m²</div><div class="kl">Superficie totale</div></div>
        <div class="kc"><div class="kv" style="color:#003366">{{ terStats().valeur | fcfa }}</div><div class="kl">Valeur estimée</div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">{{ terStats().sansTitre }}</div><div class="kl">Sans titre foncier</div></div>
      </div>
      @if (toast.get('ter')?.visible) { <div class="toast on"><i class="ti ti-check"></i>{{ toast.get('ter')?.message }}</div> }
      <div class="sl">Enregistrer un terrain</div>
      <div class="row3">
        <div class="fg"><div class="lbl">Localisation <span class="req">*</span></div><input [(ngModel)]="ter.localisation" placeholder="Ex: Quartier Nord-Est, lot 45"></div>
        <div class="fg"><div class="lbl">Superficie (m²) <span class="req">*</span></div><input type="number" [(ngModel)]="ter.superficie" placeholder="Ex: 8000"></div>
        <div class="fg"><div class="lbl">Valeur estimée (FCFA)</div><input type="number" [(ngModel)]="ter.valeur" placeholder="Ex: 320000000"></div>
      </div>
      <div class="row3">
        <div class="fg"><div class="lbl">N° titre foncier</div><input [(ngModel)]="ter.titreFoncier" placeholder="Ex: TF-2002-045"></div>
        <div class="fg"><div class="lbl">Usage prévu</div>
          <select [(ngModel)]="ter.usage">
            <option>Réserve foncière</option><option>Projet infrastructure</option>
            <option>Zone agricole</option><option>Espace vert</option><option>Voirie</option>
          </select>
        </div>
        <div class="fg"><div class="lbl">Date d'acquisition</div><input type="date" [(ngModel)]="ter.dateAcquisition"></div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="enregistrerTerrain()"><i class="ti ti-check"></i>Enregistrer le terrain</button></div>
      <div class="sl" style="margin-top:.75rem">Registre des terrains</div>
      <div style="overflow-x:auto">
        <table class="tbl"><thead><tr><th>Localisation</th><th>Superficie</th><th>Valeur (FCFA)</th><th>Usage prévu</th><th>Titre foncier</th><th>Statut</th></tr></thead>
        <tbody>
          @for (t of pat.terrains(); track t.id) {
            <tr>
              <td class="bold">{{ t.localisation }}</td>
              <td class="right">{{ t.superficie | number:'1.0-0' }} m²</td>
              <td class="right">{{ t.valeur | fcfa }}</td>
              <td>{{ t.usage }}</td>
              <td class="mono">{{ t.titreFoncier || '—' }}</td>
              <td><span class="chip ci">{{ t.statut }}</span></td>
            </tr>
          }
          @empty {
            <tr><td colspan="6" style="text-align:center;padding:1.5rem;font-style:italic;font-size:12px;color:var(--color-text-secondary)">Aucun terrain enregistré</td></tr>
          }
        </tbody></table>
      </div>
    </div>
  </div>
}

<!-- ── Bâtiments ──────────────────────────────────────────────────────── -->
@if (activeTab() === 'batiments') {
  <div class="card">
    <div class="ch">
      <h3><i class="ti ti-building"></i>Bâtiments communaux</h3>
      <button class="bs" (click)="pat.exportLocal(pat.batiments(), 'batiments')"><i class="ti ti-download"></i>Exporter</button>
    </div>
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#C9A84C">{{ batStats().total }}</div><div class="kl">Bâtiments communaux</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">{{ batStats().bon }}</div><div class="kl">Bon état</div><div class="bar"><div [style.width]="batStats().pct + '%'" style="background:#009A44"></div></div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">{{ batStats().moyen }}</div><div class="kl">État moyen</div></div>
        <div class="kc"><div class="kv" style="color:#E24B4A">{{ batStats().degrade }}</div><div class="kl">Dégradé</div></div>
      </div>
      @if (toast.get('bat')?.visible) { <div class="toast on"><i class="ti ti-check"></i>{{ toast.get('bat')?.message }}</div> }
      <div class="sl">Enregistrer un bâtiment</div>
      <div class="row3">
        <div class="fg"><div class="lbl">Nom du bâtiment <span class="req">*</span></div><input [(ngModel)]="bat.nom" placeholder="Ex: Hôtel de Ville"></div>
        <div class="fg"><div class="lbl">Superficie (m²)</div><input type="number" [(ngModel)]="bat.superficie" placeholder="Ex: 1200"></div>
        <div class="fg"><div class="lbl">Valeur actuelle (FCFA)</div><input type="number" [(ngModel)]="bat.valeurActuelle" placeholder="Ex: 920000000"></div>
      </div>
      <div class="row3">
        <div class="fg"><div class="lbl">Affectation</div><input [(ngModel)]="bat.affectation" placeholder="Ex: Administration"></div>
        <div class="fg"><div class="lbl">État</div>
          <select [(ngModel)]="bat.etat"><option value="bon">Bon</option><option value="moyen">Moyen</option><option value="degrade">Dégradé</option></select>
        </div>
        <div class="fg"><div class="lbl">Dernière inspection</div><input type="date" [(ngModel)]="bat.derniereInspection"></div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="enregistrerBatiment()"><i class="ti ti-check"></i>Enregistrer le bâtiment</button></div>
      <div class="sl" style="margin-top:.75rem">Registre des bâtiments</div>
      <div style="overflow-x:auto">
        <table class="tbl" style="table-layout:fixed;min-width:580px">
          <thead><tr>
            <th style="width:26%">Bâtiment</th><th style="width:12%">Superficie</th>
            <th style="width:18%">Valeur actuelle (FCFA)</th><th style="width:16%">Affectation</th>
            <th style="width:10%">État</th><th style="width:10%">Inspection</th>
          </tr></thead>
          <tbody>
            @for (b of pat.batiments(); track b.id) {
              <tr>
                <td class="bold">{{ b.nom }}</td>
                <td>{{ b.superficie | number:'1.0-0' }} m²</td>
                <td class="right bold">{{ b.valeurActuelle | fcfa }}</td>
                <td>{{ b.affectation || '—' }}</td>
                <td><span class="chip" [ngClass]="chipEtat(b.etat)">{{ etatLabel(b.etat) }}</span></td>
                <td>{{ b.derniereInspection || '—' }}</td>
              </tr>
            }
            @empty {
              <tr><td colspan="6" style="text-align:center;padding:1.5rem;font-style:italic;font-size:12px;color:var(--color-text-secondary)">Aucun bâtiment enregistré</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>
}

<!-- ── Marchés ────────────────────────────────────────────────────────── -->
@if (activeTab() === 'marches') {
  <div class="card">
    <div class="ch">
      <h3><i class="ti ti-basket"></i>Marchés municipaux</h3>
      <button class="bs" (click)="pat.exportLocal(pat.marches(), 'marches')"><i class="ti ti-download"></i>Exporter</button>
    </div>
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#C9A84C">{{ marStats().total }}</div><div class="kl">Marchés communaux</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">{{ marStats().actifs }}</div><div class="kl">En activité</div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">{{ marStats().rehab }}</div><div class="kl">En réhabilitation</div></div>
        <div class="kc"><div class="kv" style="color:#003366">{{ marStats().revenus | fcfa }}</div><div class="kl">Revenus mensuels</div></div>
      </div>
      @if (toast.get('mar')?.visible) { <div class="toast on"><i class="ti ti-check"></i>{{ toast.get('mar')?.message }}</div> }
      <div class="sl">Enregistrer un marché</div>
      <div class="row3">
        <div class="fg"><div class="lbl">Nom du marché <span class="req">*</span></div><input [(ngModel)]="mar.nom" placeholder="Ex: Marché Municipal Central"></div>
        <div class="fg"><div class="lbl">Superficie (m²)</div><input type="number" [(ngModel)]="mar.superficie" placeholder="Ex: 3500"></div>
        <div class="fg"><div class="lbl">Nombre de boutiques</div><input type="number" [(ngModel)]="mar.nombreBoutiques" placeholder="Ex: 247"></div>
      </div>
      <div class="row2">
        <div class="fg"><div class="lbl">Loyer moyen / boutique (FCFA)</div><input type="number" [(ngModel)]="mar.loyerMoyenBoutique" placeholder="Ex: 50000"></div>
        <div class="fg"><div class="lbl">Statut</div>
          <select [(ngModel)]="mar.statut"><option value="actif">Actif</option><option value="rehabilitation">En réhabilitation</option><option value="ferme">Fermé</option></select>
        </div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="enregistrerMarche()"><i class="ti ti-check"></i>Enregistrer le marché</button></div>
      <div class="sl" style="margin-top:.75rem">Registre des marchés</div>
      <table class="tbl"><thead><tr><th>Marché</th><th>Superficie</th><th>Boutiques</th><th>Loyer moyen/boutique</th><th>Revenus mensuels</th><th>Statut</th></tr></thead>
      <tbody>
        @for (m of pat.marches(); track m.id) {
          <tr>
            <td class="bold">{{ m.nom }}</td>
            <td>{{ m.superficie | number:'1.0-0' }} m²</td>
            <td>{{ m.nombreBoutiques }}</td>
            <td class="right">{{ m.loyerMoyenBoutique | fcfa }}</td>
            <td class="right bold" style="color:#009A44">{{ m.revenusMensuels | fcfa }}</td>
            <td><span class="chip" [ngClass]="chipMarche(m.statut)">{{ m.statut }}</span></td>
          </tr>
        }
        @empty {
          <tr><td colspan="6" style="text-align:center;padding:1.5rem;font-style:italic;font-size:12px;color:var(--color-text-secondary)">Aucun marché enregistré</td></tr>
        }
      </tbody></table>
    </div>
  </div>
}

<!-- ── Centres communautaires ─────────────────────────────────────────── -->
@if (activeTab() === 'centres') {
  <div class="card">
    <div class="ch">
      <h3><i class="ti ti-heart-handshake"></i>Centres communautaires</h3>
      <button class="bs" (click)="pat.exportLocal(pat.centres(), 'centres')"><i class="ti ti-download"></i>Exporter</button>
    </div>
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#C9A84C">{{ cenStats().total }}</div><div class="kl">Centres communautaires</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">{{ cenStats().operationnels }}</div><div class="kl">Opérationnels</div></div>
        <div class="kc"><div class="kv" style="color:#185FA5">{{ cenStats().capacite }}</div><div class="kl">Capacité totale (pers.)</div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">{{ cenStats().travaux }}</div><div class="kl">En travaux</div></div>
      </div>
      @if (toast.get('cen')?.visible) { <div class="toast on"><i class="ti ti-check"></i>{{ toast.get('cen')?.message }}</div> }
      <div class="sl">Enregistrer un centre</div>
      <div class="row3">
        <div class="fg"><div class="lbl">Nom du centre <span class="req">*</span></div><input [(ngModel)]="cen.nom" placeholder="Ex: Centre Culturel Municipal"></div>
        <div class="fg"><div class="lbl">Quartier</div><input [(ngModel)]="cen.quartier" placeholder="Ex: Cocody Centre"></div>
        <div class="fg"><div class="lbl">Capacité (personnes)</div><input type="number" [(ngModel)]="cen.capacite" placeholder="Ex: 450"></div>
      </div>
      <div class="row2">
        <div class="fg"><div class="lbl">Services offerts</div><input [(ngModel)]="cen.services" placeholder="Ex: Culture, expositions, concerts"></div>
        <div class="fg"><div class="lbl">Statut</div>
          <select [(ngModel)]="cen.statut"><option value="operationnel">Opérationnel</option><option value="travaux">En travaux</option></select>
        </div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="enregistrerCentre()"><i class="ti ti-check"></i>Enregistrer le centre</button></div>
      <div class="sl" style="margin-top:.75rem">Registre des centres</div>
      <table class="tbl"><thead><tr><th>Centre</th><th>Quartier</th><th>Capacité</th><th>Services offerts</th><th>État</th></tr></thead>
      <tbody>
        @for (c of pat.centres(); track c.id) {
          <tr>
            <td class="bold">{{ c.nom }}</td>
            <td>{{ c.quartier || '—' }}</td>
            <td>{{ c.capacite }}</td>
            <td>{{ c.services || '—' }}</td>
            <td><span class="chip" [ngClass]="c.statut === 'operationnel' ? 'cv' : 'ce'">{{ c.statut === 'operationnel' ? 'Opérationnel' : 'Travaux' }}</span></td>
          </tr>
        }
        @empty {
          <tr><td colspan="5" style="text-align:center;padding:1.5rem;font-style:italic;font-size:12px;color:var(--color-text-secondary)">Aucun centre enregistré</td></tr>
        }
      </tbody></table>
    </div>
  </div>
}
  `,
})
export class ImmobilierComponent implements OnInit {
  readonly pat   = inject(PatrimoineService);
  readonly toast = inject(ToastService);

  activeTab = signal<Tab>('terrains');
  saving    = signal(false);

  tabs = [
    { id: 'terrains' as Tab, label: 'Terrains',              icon: 'ti-trees'          },
    { id: 'batiments' as Tab, label: 'Bâtiments',            icon: 'ti-building'        },
    { id: 'marches' as Tab, label: 'Marchés',                icon: 'ti-basket'          },
    { id: 'centres' as Tab, label: 'Centres communautaires', icon: 'ti-heart-handshake' },
  ];

  ter = { localisation: '', superficie: null as number|null, valeur: null as number|null, titreFoncier: '', usage: 'Réserve foncière', dateAcquisition: '' };
  bat = { nom: '', superficie: null as number|null, valeurActuelle: null as number|null, affectation: '', etat: 'bon', derniereInspection: '' };
  mar = { nom: '', superficie: null as number|null, nombreBoutiques: null as number|null, loyerMoyenBoutique: null as number|null, statut: 'actif' };
  cen = { nom: '', quartier: '', capacite: null as number|null, services: '', statut: 'operationnel' };

  terStats = computed(() => {
    const t = this.pat.terrains();
    return {
      total: t.length,
      superficie: t.reduce((s, x) => s + (x.superficie || 0), 0),
      valeur: t.reduce((s, x) => s + (x.valeur || 0), 0),
      sansTitre: t.filter(x => !x.titreFoncier).length,
    };
  });

  batStats = computed(() => {
    const b = this.pat.batiments();
    const total = b.length;
    const bon = b.filter(x => x.etat === 'bon').length;
    return { total, bon, moyen: b.filter(x => x.etat === 'moyen').length, degrade: b.filter(x => x.etat === 'degrade').length, pct: total ? Math.round(bon / total * 100) : 0 };
  });

  marStats = computed(() => {
    const m = this.pat.marches();
    return {
      total: m.length,
      actifs: m.filter(x => x.statut === 'actif').length,
      rehab: m.filter(x => x.statut === 'rehabilitation').length,
      revenus: m.reduce((s, x) => s + (x.revenusMensuels || 0), 0),
    };
  });

  cenStats = computed(() => {
    const c = this.pat.centres();
    return {
      total: c.length,
      operationnels: c.filter(x => x.statut === 'operationnel').length,
      travaux: c.filter(x => x.statut === 'travaux').length,
      capacite: c.reduce((s, x) => s + (x.capacite || 0), 0),
    };
  });

  ngOnInit(): void {
    this.pat.loadTerrains();
    this.pat.loadBatiments();
    this.pat.loadMarches();
    this.pat.loadCentres();
  }

  enregistrerTerrain(): void {
    if (!this.ter.localisation || !this.ter.superficie) { this.toast.show('ter', 'Localisation et superficie sont obligatoires'); return; }
    this.saving.set(true);
    this.pat.enregistrerTerrain({ localisation: this.ter.localisation, superficie: this.ter.superficie!, valeur: this.ter.valeur ?? undefined, usage: this.ter.usage, titreFoncier: this.ter.titreFoncier || undefined, dateAcquisition: this.ter.dateAcquisition || undefined }).subscribe({
      next: () => { this.toast.show('ter', `Terrain enregistré — ${this.ter.localisation}`); this.saving.set(false); this.ter = { localisation: '', superficie: null, valeur: null, titreFoncier: '', usage: 'Réserve foncière', dateAcquisition: '' }; },
      error: () => this.saving.set(false),
    });
  }

  enregistrerBatiment(): void {
    if (!this.bat.nom) { this.toast.show('bat', 'Le nom du bâtiment est obligatoire'); return; }
    this.saving.set(true);
    this.pat.enregistrerBatiment({ nom: this.bat.nom, superficie: this.bat.superficie ?? undefined, valeurActuelle: this.bat.valeurActuelle ?? undefined, affectation: this.bat.affectation || undefined, etat: this.bat.etat, derniereInspection: this.bat.derniereInspection || undefined }).subscribe({
      next: () => { this.toast.show('bat', `Bâtiment enregistré — ${this.bat.nom}`); this.saving.set(false); this.bat = { nom: '', superficie: null, valeurActuelle: null, affectation: '', etat: 'bon', derniereInspection: '' }; },
      error: () => this.saving.set(false),
    });
  }

  enregistrerMarche(): void {
    if (!this.mar.nom) { this.toast.show('mar', 'Le nom du marché est obligatoire'); return; }
    this.saving.set(true);
    this.pat.enregistrerMarche({ nom: this.mar.nom, superficie: this.mar.superficie ?? undefined, nombreBoutiques: this.mar.nombreBoutiques ?? undefined, loyerMoyenBoutique: this.mar.loyerMoyenBoutique ?? undefined, statut: this.mar.statut }).subscribe({
      next: () => { this.toast.show('mar', `Marché enregistré — ${this.mar.nom}`); this.saving.set(false); this.mar = { nom: '', superficie: null, nombreBoutiques: null, loyerMoyenBoutique: null, statut: 'actif' }; },
      error: () => this.saving.set(false),
    });
  }

  enregistrerCentre(): void {
    if (!this.cen.nom) { this.toast.show('cen', 'Le nom du centre est obligatoire'); return; }
    this.saving.set(true);
    this.pat.enregistrerCentre({ nom: this.cen.nom, quartier: this.cen.quartier || undefined, capacite: this.cen.capacite ?? undefined, services: this.cen.services || undefined, statut: this.cen.statut }).subscribe({
      next: () => { this.toast.show('cen', `Centre enregistré — ${this.cen.nom}`); this.saving.set(false); this.cen = { nom: '', quartier: '', capacite: null, services: '', statut: 'operationnel' }; },
      error: () => this.saving.set(false),
    });
  }

  chipEtat(e: string): string { return { bon: 'cv', moyen: 'cw', degrade: 'ce' }[e] ?? 'ci'; }
  etatLabel(e: string): string { return { bon: 'Bon', moyen: 'Moyen', degrade: 'Dégradé' }[e] ?? e; }
  chipMarche(s: string): string { return { actif: 'cv', rehabilitation: 'cw', ferme: 'ce' }[s] ?? 'ci'; }
}
