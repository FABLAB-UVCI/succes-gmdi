import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatrimoineService } from '../../../../core/services/patrimoine.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FcfaPipe } from '../../../../core/pipes/fcfa.pipe';
import { Bien } from '../../../../core/models/patrimoine.models';

// ═══════════════════════════════════════════════════════════════════════════
//  AFFECTATION
// ═══════════════════════════════════════════════════════════════════════════
@Component({
  selector: 'app-affectation',
  standalone: true,
  imports: [CommonModule, FormsModule, FcfaPipe],
  template: `
<div class="nav">
  <div class="ni" [class.on]="activeTab() === 'attrib'" (click)="activeTab.set('attrib')"><i class="ti ti-arrows-transfer-up"></i>Attribution aux services</div>
  <div class="ni" [class.on]="activeTab() === 'historique'" (click)="chargerHistorique()"><i class="ti ti-history"></i>Historique des mouvements</div>
</div>

@if (activeTab() === 'attrib') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-arrows-transfer-up"></i>Attribution d'un bien à un service</h3></div>
    @if (toast.get('af')?.visible) { <div class="toast on"><i class="ti ti-check"></i>{{ toast.get('af')?.message }}</div> }
    <div class="pb">
      <div class="sl">Identifier le bien</div>
      <div class="row2">
        <div class="fg"><div class="lbl">Référence du bien <span class="req">*</span></div><input [(ngModel)]="f.reference" placeholder="Ex: PAT-VEH-001"></div>
        <div class="fg" style="justify-content:flex-end;flex-direction:row;padding-top:14px;align-items:center;gap:6px">
          <button class="bs" [disabled]="searching()" (click)="rechercherBien()"><i class="ti ti-search"></i>Rechercher</button>
        </div>
      </div>
      @if (bienTrouve()) {
        <div style="background:var(--color-background-secondary);border-radius:7px;padding:.65rem .85rem;margin-bottom:8px;font-size:12px">
          <strong>{{ bienTrouve()!.designation }}</strong> <span class="chip cgo" style="margin-left:6px">{{ bienTrouve()!.categorie }}</span><br>
          <span style="color:var(--color-text-secondary)">Affectation actuelle : <strong>{{ bienTrouve()!.affectation }}</strong> — Statut : {{ bienTrouve()!.statut }} — Valeur : {{ bienTrouve()!.valeurActuelle | fcfa }}</span>
        </div>
      }
      @if (bienNonTrouve()) {
        <div style="color:#E24B4A;font-size:12px;margin-bottom:8px;padding:.5rem .85rem;background:#fcebeb;border-radius:6px">Référence non trouvée dans l'inventaire</div>
      }
      <div class="sl">Nouvelle affectation</div>
      <div class="row2">
        <div class="fg"><div class="lbl">Service / Direction <span class="req">*</span></div>
          <select [(ngModel)]="f.direction">
            <option value="">-- Choisir --</option>
            @for (d of directions; track d) { <option>{{ d }}</option> }
          </select>
        </div>
        <div class="fg"><div class="lbl">Responsable du bien</div><input [(ngModel)]="f.responsable" placeholder="Nom du responsable"></div>
      </div>
      <div class="row2">
        <div class="fg"><div class="lbl">Date d'effet <span class="req">*</span></div><input type="date" [(ngModel)]="f.dateEffet"></div>
        <div class="fg"><div class="lbl">Motif</div><input [(ngModel)]="f.motif" placeholder="Ex: Renfort, réorganisation..."></div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="validerAffectation()"><i class="ti ti-check"></i>Valider l'affectation</button></div>
    </div>
  </div>
}

@if (activeTab() === 'historique') {
  <div class="card">
    <div class="ch">
      <h3><i class="ti ti-history"></i>Historique des mouvements patrimoniaux</h3>
      <button class="bs" (click)="pat.exportLocal(pat.mouvements(), 'historique_affectations')"><i class="ti ti-download"></i>Exporter</button>
    </div>
    <div style="overflow-x:auto">
      <table class="tbl"><thead><tr>
        <th>Date</th><th>Référence</th><th>Bien</th><th>De</th><th>Vers</th><th>Responsable</th><th>Motif</th>
      </tr></thead>
      <tbody>
        @for (m of pat.mouvements(); track m.id) {
          <tr>
            <td>{{ m.date }}</td>
            <td class="mono">{{ m.reference }}</td>
            <td class="bold">{{ m.bien }}</td>
            <td style="color:var(--color-text-secondary)">{{ m.origine }}</td>
            <td style="color:#009A44;font-weight:500">{{ m.destination }}</td>
            <td>{{ m.responsable }}</td>
            <td style="font-size:11px;color:var(--color-text-secondary)">{{ m.motif }}</td>
          </tr>
        }
        @empty {
          <tr><td colspan="7" style="text-align:center;padding:2rem;font-style:italic;font-size:12px;color:var(--color-text-secondary)">Aucun mouvement enregistré</td></tr>
        }
      </tbody></table>
    </div>
  </div>
}
  `,
})
export class AffectationComponent implements OnInit {
  readonly pat   = inject(PatrimoineService);
  readonly toast = inject(ToastService);

  activeTab = signal<'attrib' | 'historique'>('attrib');
  saving    = signal(false);
  searching = signal(false);
  bienTrouve   = signal<Bien | null>(null);
  bienNonTrouve = signal(false);

  f = { reference: '', direction: '', responsable: '', dateEffet: '', motif: '' };

  directions = ['Cabinet du Maire','Direction Générale','Direction État Civil','Direction Finances','DRH','Direction Urbanisme','Services Techniques','Direction Communication','Direction Patrimoine'];

  ngOnInit(): void { this.pat.loadMouvements(); }

  rechercherBien(): void {
    if (!this.f.reference) return;
    this.searching.set(true); this.bienTrouve.set(null); this.bienNonTrouve.set(false);
    this.pat.rechercherBien(this.f.reference).subscribe({
      next: b => { this.bienTrouve.set(b); this.searching.set(false); },
      error: () => { this.bienNonTrouve.set(true); this.searching.set(false); },
    });
  }

  validerAffectation(): void {
    if (!this.f.reference || !this.f.direction || !this.f.dateEffet) { this.toast.show('af', 'Référence, direction et date sont obligatoires'); return; }
    this.saving.set(true);
    this.pat.affecter({ reference: this.f.reference, direction: this.f.direction, responsable: this.f.responsable || undefined, dateEffet: this.f.dateEffet, motif: this.f.motif || undefined }).subscribe({
      next: m => { this.toast.show('af', `Affectation enregistrée — ${this.f.reference} → ${this.f.direction}`); this.saving.set(false); this.bienTrouve.set(null); this.bienNonTrouve.set(false); this.f = { reference: '', direction: '', responsable: '', dateEffet: '', motif: '' }; },
      error: () => this.saving.set(false),
    });
  }

  chargerHistorique(): void { this.activeTab.set('historique'); this.pat.loadMouvements(); }
}

// ═══════════════════════════════════════════════════════════════════════════
//  MAINTENANCE
// ═══════════════════════════════════════════════════════════════════════════
@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, FcfaPipe],
  template: `
<div class="nav">
  <div class="ni" [class.on]="activeTab() === 'entretien'" (click)="activeTab.set('entretien')"><i class="ti ti-calendar-check"></i>Entretien des biens</div>
  <div class="ni" [class.on]="activeTab() === 'reparations'" (click)="activeTab.set('reparations')"><i class="ti ti-wrench"></i>Réparations</div>
</div>

@if (activeTab() === 'entretien') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-calendar-check"></i>Programme d'entretien préventif</h3></div>
    @if (toast.get('ent')?.visible) { <div class="toast on"><i class="ti ti-check"></i>{{ toast.get('ent')?.message }}</div> }
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#C9A84C">28</div><div class="kl">Opérations planifiées</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">21</div><div class="kl">Effectuées</div><div class="bar"><div style="width:75%;background:#009A44"></div></div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">5</div><div class="kl">En cours</div></div>
        <div class="kc"><div class="kv" style="color:#E24B4A">2</div><div class="kl">En retard</div></div>
      </div>
      <div class="sl">Planifier un entretien</div>
      <div class="row2">
        <div class="fg"><div class="lbl">Bien concerné <span class="req">*</span></div><input [(ngModel)]="ent.bien" placeholder="Référence ou désignation du bien"></div>
        <div class="fg"><div class="lbl">Type d'entretien <span class="req">*</span></div>
          <select [(ngModel)]="ent.type">
            <option value="">-- Choisir --</option>
            @for (t of typesEntretien; track t) { <option>{{ t }}</option> }
          </select>
        </div>
      </div>
      <div class="row3">
        <div class="fg"><div class="lbl">Date prévue <span class="req">*</span></div><input type="date" [(ngModel)]="ent.date"></div>
        <div class="fg"><div class="lbl">Périodicité</div>
          <select [(ngModel)]="ent.periodicite"><option>Mensuelle</option><option>Trimestrielle</option><option>Semestrielle</option><option>Annuelle</option></select>
        </div>
        <div class="fg"><div class="lbl">Coût estimé (FCFA)</div><input type="number" [(ngModel)]="ent.cout" placeholder="Ex: 180000"></div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="planifierEntretien()"><i class="ti ti-check"></i>Planifier</button></div>
      <div class="sl" style="margin-top:.75rem">Planning du mois</div>
      <div style="overflow-x:auto">
        <table class="tbl"><thead><tr><th>Bien</th><th>Type</th><th>Date prévue</th><th>Périodicité</th><th>Coût (FCFA)</th><th>Statut</th><th></th></tr></thead>
        <tbody>
          @for (e of pat.entretiens(); track e.id) {
            <tr>
              <td class="bold">{{ e.bien }}</td>
              <td>{{ e.typeEntretien }}</td>
              <td>{{ e.datePrevue }}</td>
              <td><span class="chip ci">{{ e.periodicite }}</span></td>
              <td class="right">{{ e.coutEstime | fcfa }}</td>
              <td><span class="chip" [ngClass]="e.statut === 'urgent' ? 'ce' : 'ci'">{{ e.statut }}</span></td>
              <td>
                @if (e.statut !== 'effectue') {
                  <button class="bti ok" (click)="pat.validerEntretien(e.id)" title="Marquer effectué"><i class="ti ti-check"></i></button>
                }
              </td>
            </tr>
          }
          @empty {
            <tr><td colspan="7" style="text-align:center;padding:1.5rem;font-style:italic;font-size:12px;color:var(--color-text-secondary)">Aucun entretien planifié</td></tr>
          }
        </tbody></table>
      </div>
    </div>
  </div>
}

@if (activeTab() === 'reparations') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-wrench"></i>Réparations et interventions correctives</h3></div>
    @if (toast.get('rep')?.visible) { <div class="toast on"><i class="ti ti-check"></i>{{ toast.get('rep')?.message }}</div> }
    <div class="pb">
      <div class="kg" style="margin-bottom:.75rem">
        <div class="kc"><div class="kv" style="color:#E24B4A">3</div><div class="kl">Urgences actives</div></div>
        <div class="kc"><div class="kv" style="color:#F77F00">7</div><div class="kl">En cours</div></div>
        <div class="kc"><div class="kv" style="color:#009A44">15</div><div class="kl">Résolues ce mois</div></div>
        <div class="kc"><div class="kv" style="color:#185FA5">850 000</div><div class="kl">Coût moyen (FCFA)</div></div>
      </div>
      <div class="sl">Déclarer une réparation</div>
      <div class="row2">
        <div class="fg"><div class="lbl">Bien à réparer <span class="req">*</span></div><input [(ngModel)]="rep.bien" placeholder="Référence ou désignation"></div>
        <div class="fg"><div class="lbl">Description du problème <span class="req">*</span></div><input [(ngModel)]="rep.description" placeholder="Symptôme ou panne constatée"></div>
      </div>
      <div class="row3">
        <div class="fg"><div class="lbl">Priorité</div>
          <select [(ngModel)]="rep.priorite"><option value="normale">Normale</option><option value="haute">Haute</option><option value="urgente">Urgente</option></select>
        </div>
        <div class="fg"><div class="lbl">Prestataire / Technicien</div><input [(ngModel)]="rep.prestataire" placeholder="Nom ou entreprise"></div>
        <div class="fg"><div class="lbl">Coût estimé (FCFA)</div><input type="number" [(ngModel)]="rep.cout" placeholder="Ex: 950000"></div>
      </div>
      <div class="fa"><button class="bp" [disabled]="saving()" (click)="declarerReparation()"><i class="ti ti-alert-triangle"></i>Déclarer la réparation</button></div>
      <div class="sl" style="margin-top:.75rem">Réparations en cours</div>
      <div style="overflow-x:auto">
        <table class="tbl"><thead><tr><th>Bien</th><th>Problème</th><th>Priorité</th><th>Prestataire</th><th>Coût (FCFA)</th><th>Statut</th><th></th></tr></thead>
        <tbody>
          @for (r of pat.reparations(); track r.id) {
            <tr>
              <td class="bold">{{ r.bien }}</td>
              <td>{{ r.description }}</td>
              <td><span class="chip" [ngClass]="chipPrio(r.priorite)">{{ r.priorite }}</span></td>
              <td>{{ r.prestataire }}</td>
              <td class="right">{{ r.coutEstime | fcfa }}</td>
              <td><span class="chip cw">{{ r.statut }}</span></td>
              <td><button class="bti ok" (click)="pat.resoudreReparation(r.id)" title="Résoudre"><i class="ti ti-check"></i></button></td>
            </tr>
          }
          @empty {
            <tr><td colspan="7" style="text-align:center;padding:1.5rem;font-style:italic;font-size:12px;color:var(--color-text-secondary)">Aucune réparation déclarée</td></tr>
          }
        </tbody></table>
      </div>
    </div>
  </div>
}
  `,
})
export class MaintenanceComponent implements OnInit {
  readonly pat   = inject(PatrimoineService);
  readonly toast = inject(ToastService);

  activeTab = signal<'entretien' | 'reparations'>('entretien');
  saving    = signal(false);

  typesEntretien = ['Vidange + révision','Contrôle technique','Nettoyage général','Inspection bâtiment','Mise à jour logiciels','Lubrification équipements','Remplacement filtres'];

  ent = { bien: '', type: '', date: '', periodicite: 'Trimestrielle', cout: null as number|null };
  rep = { bien: '', description: '', priorite: 'normale', prestataire: '', cout: null as number|null };

  ngOnInit(): void { this.pat.loadEntretiens(); this.pat.loadReparations(); }

  planifierEntretien(): void {
    if (!this.ent.bien || !this.ent.type || !this.ent.date) { this.toast.show('ent', 'Bien, type et date sont obligatoires'); return; }
    this.saving.set(true);
    this.pat.planifierEntretien({ bien: this.ent.bien, typeEntretien: this.ent.type, datePrevue: this.ent.date, periodicite: this.ent.periodicite, coutEstime: this.ent.cout ?? undefined }).subscribe({
      next: () => { this.toast.show('ent', `Entretien planifié — ${this.ent.bien}`); this.saving.set(false); this.ent = { bien: '', type: '', date: '', periodicite: 'Trimestrielle', cout: null }; },
      error: () => this.saving.set(false),
    });
  }

  declarerReparation(): void {
    if (!this.rep.bien || !this.rep.description) { this.toast.show('rep', 'Bien et description du problème sont obligatoires'); return; }
    this.saving.set(true);
    this.pat.declarerReparation({ bien: this.rep.bien, description: this.rep.description, priorite: this.rep.priorite, prestataire: this.rep.prestataire || undefined, coutEstime: this.rep.cout ?? undefined }).subscribe({
      next: () => { this.toast.show('rep', `Réparation déclarée — ${this.rep.bien}`); this.saving.set(false); this.rep = { bien: '', description: '', priorite: 'normale', prestataire: '', cout: null }; },
      error: () => this.saving.set(false),
    });
  }

  chipPrio(p: string): string { return { urgente: 'ce', haute: 'cw', normale: 'cv' }[p] ?? 'cv'; }
}

// ═══════════════════════════════════════════════════════════════════════════
//  AMORTISSEMENT
// ═══════════════════════════════════════════════════════════════════════════
@Component({
  selector: 'app-amortissement',
  standalone: true,
  imports: [CommonModule, FormsModule, FcfaPipe],
  template: `
<div class="card">
  <div class="ch">
    <h3><i class="ti ti-chart-line"></i>Tableau des amortissements — Valeur des actifs</h3>
    <button class="bs" (click)="pat.exportLocal(pat.amortissements(), 'amortissements')"><i class="ti ti-download"></i>Exporter JSON</button>
  </div>
  <div class="pb">
    <div class="kg" style="margin-bottom:.75rem">
      <div class="kc"><div class="kv" style="color:#003366">{{ pat.statsAmort().valeurAcquisitionTotale | fcfa }}</div><div class="kl">Valeur d'acquisition totale</div></div>
      <div class="kc"><div class="kv" style="color:#C9A84C">{{ pat.statsAmort().valeurNetteTotale | fcfa }}</div><div class="kl">Valeur nette comptable</div></div>
      <div class="kc"><div class="kv" style="color:#F77F00">{{ pat.statsAmort().amortissementsCumules | fcfa }}</div><div class="kl">Amortissements cumulés</div></div>
      <div class="kc"><div class="kv" style="color:#E24B4A">{{ pat.statsAmort().biensAmortis }}</div><div class="kl">Biens entièrement amortis</div></div>
    </div>

    <div class="sl">Simuler l'amortissement d'un bien</div>
    <div class="row3">
      <div class="fg"><div class="lbl">Valeur d'acquisition (FCFA)</div><input type="number" [(ngModel)]="sim.valeur" (ngModelChange)="simuler()" placeholder="Ex: 18000000"></div>
      <div class="fg"><div class="lbl">Taux annuel (%)</div><input type="number" [(ngModel)]="sim.taux" (ngModelChange)="simuler()" placeholder="Ex: 20" min="1" max="100"></div>
      <div class="fg"><div class="lbl">Années écoulées</div><input type="number" [(ngModel)]="sim.annees" (ngModelChange)="simuler()" placeholder="Ex: 3" min="0"></div>
    </div>
    @if (simResult()) {
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;background:var(--color-background-secondary);border-radius:7px;padding:.65rem .85rem;margin-bottom:8px">
        <div class="kc"><div class="kv" style="font-size:14px;color:#C9A84C">{{ simResult()!.valeur | fcfa }}</div><div class="kl">Valeur d'acquisition</div></div>
        <div class="kc"><div class="kv" style="font-size:14px;color:#F77F00">{{ simResult()!.cumul | fcfa }}</div><div class="kl">Amortissements cumulés</div></div>
        <div class="kc"><div class="kv" [style.color]="simResult()!.vnc === 0 ? '#E24B4A' : '#003366'" style="font-size:14px">{{ simResult()!.vnc | fcfa }}</div><div class="kl">Valeur nette comptable</div></div>
      </div>
    }

    <div class="sl" style="margin-top:.75rem">Tableau d'amortissement par bien</div>
    <div style="overflow-x:auto">
      <table class="tbl" style="table-layout:fixed;min-width:620px">
        <thead><tr>
          <th style="width:28%">Bien</th><th style="width:16%">Valeur acq.</th><th style="width:8%">Taux</th>
          <th style="width:10%">Début</th><th style="width:14%">Amort. cumulé</th><th style="width:14%">Valeur nette</th><th style="width:10%">Avancement</th>
        </tr></thead>
        <tbody>
          @for (a of pat.amortissements(); track a.id) {
            @let pct = avancement(a.amortissementCumule, a.valeurAcquisition);
            <tr>
              <td class="bold">{{ a.bien }}</td>
              <td class="right">{{ a.valeurAcquisition | fcfa }}</td>
              <td class="right">{{ a.tauxAnnuel }}%</td>
              <td>{{ a.anneeDebut }}</td>
              <td class="right" style="color:#F77F00">{{ a.amortissementCumule | fcfa }}</td>
              <td class="right bold" [style.color]="a.valeurNette === 0 ? '#E24B4A' : '#C9A84C'">{{ a.valeurNette | fcfa }}</td>
              <td>
                <div class="mb"><div [style.width]="pct + '%'" [style.background]="pct >= 100 ? '#E24B4A' : '#C9A84C'"></div></div>
                <span style="font-size:10px;color:var(--color-text-secondary)"> {{ pct }}%</span>
              </td>
            </tr>
          }
          @empty {
            <tr><td colspan="7" style="text-align:center;padding:1.5rem;font-style:italic;font-size:12px;color:var(--color-text-secondary)">Aucune ligne d'amortissement</td></tr>
          }
        </tbody>
      </table>
    </div>

    <div class="sl" style="margin-top:.75rem">Dépréciation annuelle par catégorie</div>
    <div style="overflow-x:auto;margin-bottom:1rem">
      <table class="tbl"><thead><tr><th>Catégorie</th><th>Valeur brute (FCFA)</th><th>Taux moyen amort.</th><th>Dépréciation annuelle</th><th>Valeur nette estimée</th></tr></thead>
      <tbody>
        <tr><td class="bold">Véhicules</td><td class="right">78 000 000</td><td class="right">20%</td><td class="right" style="color:#F77F00">15 600 000</td><td class="right bold">27 000 000</td></tr>
        <tr><td class="bold">Équipements</td><td class="right">30 000 000</td><td class="right">10%</td><td class="right" style="color:#F77F00">3 000 000</td><td class="right bold">18 000 000</td></tr>
        <tr><td class="bold">Informatique</td><td class="right">8 500 000</td><td class="right">33%</td><td class="right" style="color:#F77F00">2 805 000</td><td class="right bold">2 000 000</td></tr>
        <tr><td class="bold">Mobilier</td><td class="right">3 200 000</td><td class="right">20%</td><td class="right" style="color:#F77F00">640 000</td><td class="right bold">1 600 000</td></tr>
        <tr><td class="bold">Immobilier</td><td class="right">1 430 000 000</td><td class="right">2%</td><td class="right" style="color:#F77F00">28 600 000</td><td class="right bold">816 000 000</td></tr>
      </tbody></table>
    </div>
  </div>
</div>
  `,
})
export class AmortissementComponent implements OnInit {
  readonly pat = inject(PatrimoineService);

  sim = { valeur: null as number|null, taux: null as number|null, annees: null as number|null };
  simResult = signal<{ valeur: number; cumul: number; vnc: number } | null>(null);

  ngOnInit(): void { this.pat.loadAmortissements(); }

  simuler(): void {
    const { valeur, taux, annees } = this.sim;
    if (!valeur || !taux || annees == null) return;
    const cumul = Math.min(valeur, valeur * (taux / 100) * annees);
    const vnc   = Math.max(0, valeur - cumul);
    this.simResult.set({ valeur, cumul, vnc });
  }

  avancement(cumul: number, total: number): number {
    return Math.min(100, Math.round((cumul / Math.max(1, total)) * 100));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  RAPPORTS
// ═══════════════════════════════════════════════════════════════════════════
@Component({
  selector: 'app-rapports-patrimoine',
  standalone: true,
  imports: [CommonModule, FcfaPipe],
  template: `
<div class="card">
  <div class="ch"><h3><i class="ti ti-report"></i>Rapports patrimoniaux annuels</h3></div>
  <div class="pb">
    <div class="kg6" style="margin-bottom:1rem">
      <div class="kc"><div class="kv" style="color:#C9A84C">{{ pat.kpi().totalBiens }}</div><div class="kl">Biens inventoriés</div><div class="bar"><div style="width:43%;background:#C9A84C"></div></div><div class="ks2">Cible : 1 000 en 2025</div></div>
      <div class="kc"><div class="kv" style="color:#003366">2,0 Mrd</div><div class="kl">Valeur totale (FCFA)</div></div>
      <div class="kc"><div class="kv" style="color:#009A44">1,84 Mrd</div><div class="kl">Valeur nette comptable</div></div>
      <div class="kc"><div class="kv" style="color:#F77F00">157 M</div><div class="kl">Amort. cumulés</div></div>
      <div class="kc"><div class="kv" style="color:#185FA5">12,5 M</div><div class="kl">Loyers/mois (FCFA)</div></div>
      <div class="kc"><div class="kv" style="color:#009A44">96%</div><div class="kl">Biens géolocalisés</div><div class="bar"><div style="width:96%;background:#009A44"></div></div></div>
    </div>

    <div class="grid2" style="margin-bottom:1rem">
      <div>
        <div class="sl">Inventaire annuel — répartition par catégorie</div>
        <table class="tbl"><thead><tr><th>Catégorie</th><th>Nbre</th><th>Valeur (FCFA)</th><th>Part</th></tr></thead>
        <tbody>
          <tr><td class="bold">Immobilier</td><td>24</td><td class="right">1 430 000 000</td><td><div class="mb"><div style="width:72%;background:#003366"></div></div> 72%</td></tr>
          <tr><td class="bold">Terrain</td><td>12</td><td class="right">450 000 000</td><td><div class="mb"><div style="width:22%;background:#009A44"></div></div> 22%</td></tr>
          <tr><td class="bold">Véhicule</td><td>8</td><td class="right">78 000 000</td><td><div class="mb"><div style="width:4%;background:#185FA5"></div></div> 4%</td></tr>
          <tr><td class="bold">Équipement</td><td>36</td><td class="right">30 000 000</td><td><div class="mb"><div style="width:2%;background:#F77F00"></div></div> 2%</td></tr>
          <tr><td class="bold">Informatique</td><td>94</td><td class="right">8 500 000</td><td><div class="mb"><div style="width:1%;background:#C9A84C"></div></div> &lt;1%</td></tr>
          <tr><td class="bold">Mobilier</td><td>258</td><td class="right">3 200 000</td><td><div class="mb"><div style="width:1%;background:#888780"></div></div> &lt;1%</td></tr>
        </tbody></table>
      </div>
      <div>
        <div class="sl">État du patrimoine — par statut</div>
        <table class="tbl"><thead><tr><th>Statut</th><th>Biens</th><th>Valeur</th></tr></thead>
        <tbody>
          <tr><td class="bold">Occupé — usage communal</td><td>280</td><td class="right">1 650 000 000</td></tr>
          <tr><td class="bold">Loué à des tiers</td><td>45</td><td class="right">210 000 000</td></tr>
          <tr><td class="bold">Disponible</td><td>82</td><td class="right">95 000 000</td></tr>
          <tr><td class="bold">En maintenance</td><td>25</td><td class="right">45 900 000</td></tr>
        </tbody>
        <tfoot><tr><td>TOTAL</td><td>432</td><td class="right" style="color:#C9A84C">2 000 900 000</td></tr></tfoot>
        </table>
      </div>
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="bs" (click)="pat.exportLocal({}, 'patrimoine_complet')"><i class="ti ti-download"></i>Exporter tout (JSON)</button>
      <button class="bd"><i class="ti ti-printer"></i>Inventaire annuel PDF</button>
      <button class="bd"><i class="ti ti-printer"></i>État du patrimoine</button>
      <button class="bd"><i class="ti ti-printer"></i>Valeur globale des actifs</button>
      <button class="bd"><i class="ti ti-printer"></i>Tableau amortissements</button>
    </div>
  </div>
</div>
  `,
})
export class RapportsPatrimoineComponent implements OnInit {
  readonly pat = inject(PatrimoineService);
  ngOnInit(): void { this.pat.loadStats(); }
}
