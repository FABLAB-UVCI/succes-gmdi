import { Component, signal, OnInit, inject } from '@angular/core';
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
        <div class="kc"><div class="kv" style="color:#C9A84C">12</div><div class="kl">Terrains enregistrés</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">2 340 000 m²</div><div class="kl">Superficie totale</div></div>
        <div class="kc"><div class="kv" style="color:#003366">980 000 000</div><div class="kl">Valeur estimée (FCFA)</div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">4</div><div class="kl">Sans titre foncier</div></div>
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
    <div class="ch"><h3><i class="ti ti-building"></i>Bâtiments communaux</h3></div>
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#C9A84C">24</div><div class="kl">Bâtiments communaux</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">16</div><div class="kl">Bon état</div><div class="bar"><div style="width:67%;background:#009A44"></div></div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">6</div><div class="kl">État moyen</div></div>
        <div class="kc"><div class="kv" style="color:#E24B4A">2</div><div class="kl">Dégradé</div></div>
      </div>
      <div style="overflow-x:auto">
        <table class="tbl" style="table-layout:fixed;min-width:580px">
          <thead><tr>
            <th style="width:26%">Bâtiment</th><th style="width:12%">Superficie</th>
            <th style="width:18%">Valeur actuelle (FCFA)</th><th style="width:16%">Affectation</th>
            <th style="width:10%">État</th><th style="width:10%">Inspection</th><th style="width:8%"></th>
          </tr></thead>
          <tbody>
            <tr><td class="bold">Hôtel de Ville</td><td>1 200 m²</td><td class="right bold">920 000 000</td><td>Administration</td><td><span class="chip cv">Bon</span></td><td>10/03/2025</td><td><button class="bti bl"><i class="ti ti-eye"></i></button></td></tr>
            <tr><td class="bold">École Primaire Cocody</td><td>800 m²</td><td class="right bold">280 000 000</td><td>Éducation</td><td><span class="chip cw">Moyen</span></td><td>20/11/2024</td><td><button class="bti bl"><i class="ti ti-eye"></i></button></td></tr>
            <tr><td class="bold">Centre de Santé</td><td>450 m²</td><td class="right bold">180 000 000</td><td>Santé</td><td><span class="chip cv">Bon</span></td><td>15/01/2025</td><td><button class="bti bl"><i class="ti ti-eye"></i></button></td></tr>
            <tr><td class="bold">École Maternelle Yopougon</td><td>360 m²</td><td class="right bold">95 000 000</td><td>Éducation</td><td><span class="chip cv">Bon</span></td><td>28/02/2025</td><td><button class="bti bl"><i class="ti ti-eye"></i></button></td></tr>
            <tr><td class="bold">Centre Social Abobo</td><td>620 m²</td><td class="right bold">85 000 000</td><td>Action sociale</td><td><span class="chip ce">Dégradé</span></td><td>12/06/2024</td><td><button class="bti wn"><i class="ti ti-alert-triangle"></i></button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
}

<!-- ── Marchés ────────────────────────────────────────────────────────── -->
@if (activeTab() === 'marches') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-basket"></i>Marchés municipaux</h3></div>
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#C9A84C">4</div><div class="kl">Marchés communaux</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">3</div><div class="kl">En activité</div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">1</div><div class="kl">En réhabilitation</div></div>
        <div class="kc"><div class="kv" style="color:#003366">12 500 000</div><div class="kl">Revenus mensuels (FCFA)</div></div>
      </div>
      <table class="tbl"><thead><tr><th>Marché</th><th>Superficie</th><th>Boutiques</th><th>Loyer moyen/boutique</th><th>Revenus mensuels</th><th>Statut</th></tr></thead>
      <tbody>
        <tr><td class="bold">Marché Municipal Central</td><td>3 500 m²</td><td>247</td><td class="right">50 000</td><td class="right bold" style="color:#009A44">12 350 000</td><td><span class="chip cv">Actif</span></td></tr>
        <tr><td class="bold">Marché de Gros Abobo</td><td>2 800 m²</td><td>182</td><td class="right">35 000</td><td class="right bold" style="color:#009A44">6 370 000</td><td><span class="chip cv">Actif</span></td></tr>
        <tr><td class="bold">Marché Artisanal Cocody</td><td>1 200 m²</td><td>88</td><td class="right">28 000</td><td class="right bold" style="color:#009A44">2 464 000</td><td><span class="chip cv">Actif</span></td></tr>
        <tr><td class="bold">Marché Bétail Port-Bouët</td><td>5 000 m²</td><td>0</td><td class="right">—</td><td class="right bold" style="color:#F77F00">0</td><td><span class="chip cw">Réhabilitation</span></td></tr>
      </tbody></table>
    </div>
  </div>
}

<!-- ── Centres communautaires ─────────────────────────────────────────── -->
@if (activeTab() === 'centres') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-heart-handshake"></i>Centres communautaires</h3></div>
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#C9A84C">6</div><div class="kl">Centres communautaires</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">5</div><div class="kl">Opérationnels</div></div>
        <div class="kc"><div class="kv" style="color:#185FA5">1 240</div><div class="kl">Capacité totale (pers.)</div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">1</div><div class="kl">En travaux</div></div>
      </div>
      <table class="tbl"><thead><tr><th>Centre</th><th>Quartier</th><th>Capacité</th><th>Services offerts</th><th>État</th></tr></thead>
      <tbody>
        <tr><td class="bold">Centre Culturel Municipal</td><td>Cocody Centre</td><td>450</td><td>Culture, expositions, concerts</td><td><span class="chip cv">Opérationnel</span></td></tr>
        <tr><td class="bold">Centre Social Abobo</td><td>Abobo Est</td><td>200</td><td>Aide sociale, formations</td><td><span class="chip ce">Travaux</span></td></tr>
        <tr><td class="bold">Maison des Femmes</td><td>Yopougon</td><td>150</td><td>Alphabétisation, microfinance</td><td><span class="chip cv">Opérationnel</span></td></tr>
        <tr><td class="bold">Centre Jeunesse</td><td>Adjamé</td><td>280</td><td>Sport, informatique, loisirs</td><td><span class="chip cv">Opérationnel</span></td></tr>
        <tr><td class="bold">Espace Senior</td><td>Marcory</td><td>80</td><td>Activités, soins, rencontres</td><td><span class="chip cv">Opérationnel</span></td></tr>
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

  ngOnInit(): void { this.pat.loadTerrains(); }

  enregistrerTerrain(): void {
    if (!this.ter.localisation || !this.ter.superficie) { this.toast.show('ter', 'Localisation et superficie sont obligatoires'); return; }
    this.saving.set(true);
    this.pat.enregistrerTerrain({ localisation: this.ter.localisation, superficie: this.ter.superficie!, valeur: this.ter.valeur ?? undefined, usage: this.ter.usage, titreFoncier: this.ter.titreFoncier || undefined, dateAcquisition: this.ter.dateAcquisition || undefined }).subscribe({
      next: () => { this.toast.show('ter', `Terrain enregistré — ${this.ter.localisation}`); this.saving.set(false); this.ter = { localisation: '', superficie: null, valeur: null, titreFoncier: '', usage: 'Réserve foncière', dateAcquisition: '' }; },
      error: () => this.saving.set(false),
    });
  }
}
