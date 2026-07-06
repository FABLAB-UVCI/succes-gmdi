// src/app/features/budget/budget.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FinancesService } from '../../core/services/finances.service';
import { ToastService } from '../../core/services/toast.service';
import { FcfaPipe } from '../../shared/pipes/fcfa.pipe';
import { Chapitre } from '../../core/models/finances.models';

type BudgetTab = 'elaboration' | 'execution' | 'previsionnel' | 'revision';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [FormsModule, NgClass, FcfaPipe],
  template: `
    <!-- Nav tabs -->
    <div class="nav">
      @for (tab of tabs; track tab.id) {
        <div class="ni" [class.active]="activeTab() === tab.id" (click)="setTab(tab.id)">
          <i [class]="'ti ' + tab.icon"></i>{{ tab.label }}
        </div>
      }
    </div>

    <!-- ═══ ÉLABORATION ═══ -->
    @if (activeTab() === 'elaboration') {
      <div class="card">
        <div class="ch"><h3><i class="ti ti-file-plus"></i>Élaboration d'une ligne budgétaire</h3></div>
        @if (toastMsg()) {
          <div class="alert-ok show"><i class="ti ti-check"></i>{{ toastMsg() }}</div>
        }
        <div class="pb">
          <div class="fr3">
            <div class="fg">
              <div class="fl">Exercice <span class="req">*</span></div>
              <select class="fsel" [(ngModel)]="form.exercice">
                <option>2025</option><option>2026</option>
              </select>
            </div>
            <div class="fg">
              <div class="fl">Type <span class="req">*</span></div>
              <select class="fsel" [(ngModel)]="form.type">
                <option value="previsionnel">Budget primitif</option>
                <option value="rectificatif">Budget rectificatif</option>
              </select>
            </div>
            <div class="fg">
              <div class="fl">Chapitre <span class="req">*</span></div>
              <select class="fsel" [(ngModel)]="form.chapitre">
                <option value="">-- Choisir --</option>
                <option value="recettes">Recettes</option>
                <option value="personnel">Personnel</option>
                <option value="fonctionnement">Fonctionnement</option>
                <option value="investissement">Investissement</option>
                <option value="dette">Dette</option>
              </select>
            </div>
          </div>
          <div class="fr">
            <div class="fg">
              <div class="fl">Article <span class="req">*</span></div>
              <input class="fi" type="text" [(ngModel)]="form.article" placeholder="Ex: taxes_communales">
            </div>
            <div class="fg">
              <div class="fl">Désignation <span class="req">*</span></div>
              <input class="fi" type="text" [(ngModel)]="form.designation" placeholder="Ex: Taxes communales 2025">
            </div>
          </div>
          <div class="fr">
            <div class="fg">
              <div class="fl">Montant prévisionnel (FCFA) <span class="req">*</span></div>
              <input class="fi" type="number" [(ngModel)]="form.montant" placeholder="Ex: 50000000">
            </div>
            <div class="fg">
              <div class="fl">Montant engagé (FCFA)</div>
              <input class="fi" type="number" [(ngModel)]="form.engage" placeholder="Optionnel">
            </div>
          </div>
          <div class="fa">
            <button class="bs" (click)="resetForm()"><i class="ti ti-x"></i>Effacer</button>
            <button class="bp" (click)="ajouterLigne()"><i class="ti ti-check"></i>Ajouter la ligne</button>
          </div>
        </div>
      </div>
    }

    <!-- ═══ EXÉCUTION ═══ -->
    @if (activeTab() === 'execution') {
      <div class="card">
        <div class="ch">
          <h3><i class="ti ti-chart-bar"></i>Exécution budgétaire — 2025</h3>
          <button class="bs" (click)="svc.exportJSON(svc.lignesBudget(),'execution_budgetaire')">
            <i class="ti ti-download"></i>Exporter
          </button>
        </div>
        <div class="pb">
          <div class="kpi4">
            <div class="kcard">
              <div class="kv" style="color:#009A44">202 500 000</div>
              <div class="kl">Recettes réalisées (FCFA)</div><div class="ks">/ 520 000 000 prévues</div>
              <div class="kb"><div style="width:39%;background:#009A44"></div></div>
            </div>
            <div class="kcard">
              <div class="kv" style="color:#F77F00">87 500 000</div>
              <div class="kl">Dépenses réalisées (FCFA)</div><div class="ks">/ 280 000 000 prévues</div>
              <div class="kb"><div style="width:31%;background:#F77F00"></div></div>
            </div>
            <div class="kcard">
              <div class="kv" style="color:#185FA5">39%</div>
              <div class="kl">Taux d'exécution recettes</div><div class="ks">Jan–Mai 2025</div>
              <div class="kb"><div style="width:39%;background:#185FA5"></div></div>
            </div>
            <div class="kcard">
              <div class="kv" style="color:#009A44">115 000 000</div>
              <div class="kl">Excédent budgétaire (FCFA)</div><div class="ks">Recettes – Dépenses</div>
            </div>
          </div>
          <div class="fl" style="margin-bottom:6px">Évolution mensuelle recettes vs dépenses (FCFA M)</div>
          <div class="chbars">
            @for (m of moisData; track m.label) {
              <div style="display:flex;flex-direction:column;align-items:center;flex:1;gap:2px">
                <div style="display:flex;align-items:flex-end;gap:2px;width:100%">
                  <div [style.height.px]="barHeight(m.rec)" style="flex:1;background:#009A44;border-radius:2px 2px 0 0;opacity:.8"></div>
                  <div [style.height.px]="barHeight(m.dep)" style="flex:1;background:#F77F00;border-radius:2px 2px 0 0;opacity:.8"></div>
                </div>
                <span style="font-size:9px;color:var(--color-text-secondary)">{{ m.label }}</span>
              </div>
            }
          </div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px;display:flex;gap:12px">
            <span><span style="display:inline-block;width:10px;height:10px;background:#009A44;border-radius:2px;margin-right:4px"></span>Recettes</span>
            <span><span style="display:inline-block;width:10px;height:10px;background:#F77F00;border-radius:2px;margin-right:4px"></span>Dépenses</span>
          </div>
        </div>
      </div>
    }

    <!-- ═══ PRÉVISIONNEL ═══ -->
    @if (activeTab() === 'previsionnel') {
      <div class="card">
        <div class="ch">
          <h3><i class="ti ti-list"></i>Budget prévisionnel 2025</h3>
          <button class="bs" (click)="svc.exportJSON(svc.lignesBudget(),'budget_previsionnel')">
            <i class="ti ti-download"></i>Exporter JSON
          </button>
        </div>
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead>
              <tr>
                <th>Chapitre</th><th>Article</th><th>Désignation</th>
                <th>Prévisionnel</th><th>Réalisé</th><th>Taux</th><th>Statut</th>
              </tr>
            </thead>
            <tbody>
              @for (l of svc.lignesBudget(); track l.id) {
                <tr>
                  <td><span class="chip" [ngClass]="chapClass(l.chapitre)">{{ l.chapitre }}</span></td>
                  <td class="mono">{{ l.article }}</td>
                  <td class="bold">{{ l.designation }}</td>
                  <td class="right">{{ l.montantPrevisionnel | fcfa }}</td>
                  <td class="right">{{ l.montantConsomme | fcfa }}</td>
                  <td>
                    <div class="mbw">
                      <div class="mbf"
                        [style.width.%]="svc.pct(l.montantConsomme, l.montantPrevisionnel)"
                        [style.background]="svc.pct(l.montantConsomme, l.montantPrevisionnel) > 90 ? '#E24B4A' : '#009A44'">
                      </div>
                    </div>
                    <span style="font-size:10px">{{ svc.pct(l.montantConsomme, l.montantPrevisionnel) }}%</span>
                  </td>
                  <td><span class="chip" [class.cv]="l.statut==='approuve'" [class.cp]="l.statut!=='approuve'">{{ l.statut }}</span></td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">TOTAL</td>
                <td class="right">{{ totalPrev() | fcfa }}</td>
                <td class="right">{{ totalReal() | fcfa }}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    }

    <!-- ═══ RÉVISIONS ═══ -->
    @if (activeTab() === 'revision') {
      <div class="card">
        <div class="ch"><h3><i class="ti ti-edit"></i>Révision budgétaire</h3></div>
        <div class="pb">
          <div class="fr3">
            <div class="fg">
              <div class="fl">Chapitre <span class="req">*</span></div>
              <select class="fsel" [(ngModel)]="rev.chapitre">
                <option value="fonctionnement">Fonctionnement</option>
                <option value="investissement">Investissement</option>
                <option value="personnel">Personnel</option>
              </select>
            </div>
            <div class="fg">
              <div class="fl">Montant initial (FCFA)</div>
              <input class="fi" type="number" [(ngModel)]="rev.initial" placeholder="Montant original">
            </div>
            <div class="fg">
              <div class="fl">Nouveau montant (FCFA) <span class="req">*</span></div>
              <input class="fi" type="number" [(ngModel)]="rev.nouveau" placeholder="Montant révisé">
            </div>
          </div>
          <div class="fr">
            <div class="fg" style="grid-column:span 2">
              <div class="fl">Motif de la révision <span class="req">*</span></div>
              <input class="fi" type="text" [(ngModel)]="rev.motif" placeholder="Expliquer la raison de la révision budgétaire">
            </div>
          </div>
          <div class="fa">
            <button class="bp" (click)="soumettreRevision()"><i class="ti ti-check"></i>Soumettre la révision</button>
          </div>
        </div>
      </div>
    }
  `
})
export class BudgetComponent {
  svc   = inject(FinancesService);
  toast = inject(ToastService);

  activeTab = signal<BudgetTab>('elaboration');
  toastMsg  = signal('');

  tabs = [
    { id: 'elaboration' as BudgetTab, label: 'Élaboration',          icon: 'ti-file-plus' },
    { id: 'execution'   as BudgetTab, label: 'Exécution budgétaire', icon: 'ti-chart-bar' },
    { id: 'previsionnel'as BudgetTab, label: 'Budget prévisionnel',  icon: 'ti-list' },
    { id: 'revision'    as BudgetTab, label: 'Révisions',            icon: 'ti-edit' },
  ];

  form = { exercice:'2025', type:'previsionnel', chapitre:'' as Chapitre | '', article:'', designation:'', montant:null as number|null, engage:null as number|null };
  rev  = { chapitre:'fonctionnement', initial:null as number|null, nouveau:null as number|null, motif:'' };

  moisData = [
    { label:'Jan', rec:38200000, dep:15000000 },
    { label:'Fév', rec:41500000, dep:17200000 },
    { label:'Mar', rec:39800000, dep:16800000 },
    { label:'Avr', rec:44100000, dep:18500000 },
    { label:'Mai', rec:48600000, dep:20000000 },
  ];

  maxRec = Math.max(...this.moisData.map(m => m.rec));
  barHeight(v: number): number { return Math.round(v / this.maxRec * 60); }

  totalPrev = computed(() => this.svc.lignesBudget().reduce((s, l) => s + l.montantPrevisionnel, 0));
  totalReal = computed(() => this.svc.lignesBudget().reduce((s, l) => s + l.montantConsomme, 0));

  setTab(t: BudgetTab): void { this.activeTab.set(t); }

  chapClass(c: string): string {
    const map: Record<string, string> = { recettes:'cv', personnel:'cb', investissement:'cg', fonctionnement:'cp', dette:'cr' };
    return map[c] || 'cp';
  }

  ajouterLigne(): void {
    if (!this.form.chapitre || !this.form.article || !this.form.designation || !this.form.montant) {
      this.showToast('Veuillez remplir tous les champs obligatoires'); return;
    }
    this.svc.ajouterLigneBudget({
      chapitre: this.form.chapitre as Chapitre,
      article: this.form.article,
      designation: this.form.designation,
      montantPrevisionnel: this.form.montant
    });
    this.showToast('Ligne budgétaire ajoutée — ' + this.form.designation);
    this.resetForm();
  }

  soumettreRevision(): void {
    if (!this.rev.motif) { alert('Motif obligatoire'); return; }
    this.toast.show('Révision budgétaire soumise pour approbation');
    this.rev.motif = '';
  }

  resetForm(): void {
    this.form = { exercice:'2025', type:'previsionnel', chapitre:'', article:'', designation:'', montant:null, engage:null };
  }

  private showToast(msg: string): void {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(''), 3500);
  }
}
