import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UrbanismeService } from '../../../../core/services/urbanisme.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'lotissements' | 'amenagements' | 'chantiers';

@Component({
  selector: 'app-projets',
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

<!-- ── Lotissements ───────────────────────────────────────────────────── -->
@if (active()==='lotissements') {
  <div class="ph">
    <div class="pt"><i class="ti ti-layout-distribute-horizontal"></i>Lotissements</div>
    <button class="btn-s" (click)="showAddL.set(!showAddL())"><i class="ti ti-plus"></i>Nouveau</button>
  </div>
  @if (showAddL()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="fsec">Nouveau lotissement</div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Dénomination</div><input class="fi" [(ngModel)]="fLot.denomination" placeholder="Ex: Résidence Les Cocotiers"></div>
        <div class="fg"><div class="fl">Promoteur</div><input class="fi" [(ngModel)]="fLot.promoteur"></div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Localisation</div><input class="fi" [(ngModel)]="fLot.localisation"></div>
        <div class="fg"><div class="fl">Superficie (ha)</div><input class="fi" type="number" [(ngModel)]="fLot.superficie"></div>
        <div class="fg"><div class="fl">Nombre de lots</div><input class="fi" type="number" [(ngModel)]="fLot.nombreLots"></div>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Date d'approbation</div><input class="fi" type="date" [(ngModel)]="fLot.dateApprob"></div>
        <div class="fg"><div class="fl">Statut</div>
          <select class="fs" [(ngModel)]="fLot.statut">
            <option value="etude">En étude</option><option value="approuve">Approuvé</option>
            <option value="en_cours">En cours</option><option value="termine">Terminé</option>
          </select>
        </div>
      </div>
      <div class="fsec"><i class="ti ti-files" style="font-size:11px;margin-right:4px"></i>Documents du projet</div>
      <div class="form-grid">
        <div class="fg">
          <div class="fl">Joindre un document (Plan, PDF…)</div>
          <input type="file" class="fi-file" accept=".pdf,.jpg,.jpeg,.png,.dwg" (change)="onFileLot($event)">
          @if (fileLot) { <div class="file-name"><i class="ti ti-file-check" style="font-size:11px"></i> {{fileLot}}</div> }
        </div>
        <div class="fg">
          <div class="fl">Document complémentaire</div>
          <input type="file" class="fi-file" accept=".pdf,.jpg,.jpeg,.png,.dwg" (change)="onFileLot2($event)">
          @if (fileLot2) { <div class="file-name"><i class="ti ti-file-check" style="font-size:11px"></i> {{fileLot2}}</div> }
        </div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddL.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="ajouterLotissement()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Référence</th><th>Dénomination</th><th>Promoteur</th><th>Localisation</th><th>Superficie</th><th>Lots</th><th>Disponibles</th><th>Statut</th></tr></thead>
      <tbody>
        @for (l of urb.lotissements(); track l.id) {
          <tr>
            <td class="mono-td">{{l.reference}}</td>
            <td style="font-weight:500">{{l.denomination}}</td>
            <td>{{l.promoteur}}</td>
            <td>{{l.localisation}}</td>
            <td>{{l.superficie | number}} ha</td>
            <td>{{l.nombreLots | number}}</td>
            <td>
              <span [style.color]="(l.lotsDisponibles??0) > 0 ? '#009A44' : '#e63946'" style="font-weight:500">
                {{l.lotsDisponibles ?? '—'}}
              </span>
            </td>
            <td><span class="chip" [ngClass]="chipProjet(l.statut)">{{l.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="8" class="empty-row">Aucun lotissement enregistré</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Aménagements urbains ───────────────────────────────────────────── -->
@if (active()==='amenagements') {
  <div class="ph">
    <div class="pt"><i class="ti ti-building-arch"></i>Aménagements urbains</div>
    <button class="btn-s" (click)="showAddA.set(!showAddA())"><i class="ti ti-plus"></i>Nouveau</button>
  </div>
  @if (showAddA()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Intitulé du projet</div><input class="fi" [(ngModel)]="fAm.intitule" placeholder="Ex: Réaménagement Rue du Commerce"></div>
        <div class="fg"><div class="fl">Type</div>
          <select class="fs" [(ngModel)]="fAm.type">
            <option>Voirie</option><option>Espace public</option><option>Marché</option>
            <option>Espace vert</option><option>Infrastructure sportive</option><option>Zone résidentielle</option>
          </select>
        </div>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Localisation</div><input class="fi" [(ngModel)]="fAm.localisation"></div>
        <div class="fg"><div class="fl">Budget (FCFA)</div><input class="fi" type="number" [(ngModel)]="fAm.budget"></div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Financeur</div><input class="fi" [(ngModel)]="fAm.financeur" placeholder="État, Mairie, Banque…"></div>
        <div class="fg"><div class="fl">Date début</div><input class="fi" type="date" [(ngModel)]="fAm.dateDebut"></div>
        <div class="fg"><div class="fl">Date fin prévue</div><input class="fi" type="date" [(ngModel)]="fAm.dateFin"></div>
      </div>
      <div class="fsec"><i class="ti ti-files" style="font-size:11px;margin-right:4px"></i>Documents du projet</div>
      <div class="form-grid">
        <div class="fg">
          <div class="fl">Joindre un document</div>
          <input type="file" class="fi-file" accept=".pdf,.jpg,.jpeg,.png,.dwg" (change)="onFileAm($event)">
          @if (fileAm) { <div class="file-name"><i class="ti ti-file-check" style="font-size:11px"></i> {{fileAm}}</div> }
        </div>
        <div class="fg">
          <div class="fl">Document complémentaire</div>
          <input type="file" class="fi-file" accept=".pdf,.jpg,.jpeg,.png,.dwg" (change)="onFileAm2($event)">
          @if (fileAm2) { <div class="file-name"><i class="ti ti-file-check" style="font-size:11px"></i> {{fileAm2}}</div> }
        </div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddA.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="ajouterAmenagement()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Intitulé</th><th>Type</th><th>Localisation</th><th>Budget</th><th>Financeur</th><th>Début</th><th>Avancement</th><th>Statut</th></tr></thead>
      <tbody>
        @for (a of urb.amenagements(); track a.id) {
          <tr>
            <td style="font-weight:500">{{a.intitule}}</td>
            <td>{{a.type}}</td>
            <td>{{a.localisation}}</td>
            <td>{{a.budget | number}} FCFA</td>
            <td>{{a.financeur || '—'}}</td>
            <td>{{a.dateDebut || '—'}}</td>
            <td>
              <div style="display:flex;align-items:center;gap:6px">
                <div style="width:60px;height:4px;background:#e5e7eb;border-radius:2px">
                  <div style="height:4px;border-radius:2px;background:#F47920" [style.width.%]="a.tauxAvancement"></div>
                </div>
                <span style="font-size:11px">{{a.tauxAvancement}}%</span>
              </div>
            </td>
            <td><span class="chip" [ngClass]="chipProjet(a.statut)">{{a.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="8" class="empty-row">Aucun aménagement enregistré</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Suivi des chantiers ────────────────────────────────────────────── -->
@if (active()==='chantiers') {
  <div class="ph">
    <div class="pt"><i class="ti ti-crane"></i>Suivi des chantiers actifs</div>
    <button class="btn-s" (click)="showAddC.set(!showAddC())"><i class="ti ti-plus"></i>Nouveau chantier</button>
  </div>
  @if (showAddC()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Projet lié</div><input class="fi" [(ngModel)]="fCh.projet" placeholder="Nom du projet"></div>
        <div class="fg"><div class="fl">Entrepreneur</div><input class="fi" [(ngModel)]="fCh.entrepreneur" placeholder="Entreprise prestataire"></div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Ouverture chantier</div><input class="fi" type="date" [(ngModel)]="fCh.dateOuverture"></div>
        <div class="fg"><div class="fl">Date fin prévue</div><input class="fi" type="date" [(ngModel)]="fCh.datePrevueFin"></div>
        <div class="fg"><div class="fl">Avancement (%)</div><input class="fi" type="number" min="0" max="100" [(ngModel)]="fCh.tauxAvancement"></div>
      </div>
      <div class="fg" style="margin-bottom:8px"><div class="fl">Observations</div>
        <textarea class="fi" style="height:52px;resize:none;padding-top:6px" [(ngModel)]="fCh.observations"></textarea>
      </div>
      <div class="fsec"><i class="ti ti-files" style="font-size:11px;margin-right:4px"></i>Documents du chantier</div>
      <div class="form-grid">
        <div class="fg">
          <div class="fl">Joindre un document (PV, rapport…)</div>
          <input type="file" class="fi-file" accept=".pdf,.jpg,.jpeg,.png" (change)="onFileCh($event)">
          @if (fileCh) { <div class="file-name"><i class="ti ti-file-check" style="font-size:11px"></i> {{fileCh}}</div> }
        </div>
        <div class="fg">
          <div class="fl">Document complémentaire</div>
          <input type="file" class="fi-file" accept=".pdf,.jpg,.jpeg,.png" (change)="onFileCh2($event)">
          @if (fileCh2) { <div class="file-name"><i class="ti ti-file-check" style="font-size:11px"></i> {{fileCh2}}</div> }
        </div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddC.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="ajouterChantier()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Projet</th><th>Entrepreneur</th><th>Ouverture</th><th>Fin prévue</th><th>Avancement</th><th>Dernière visite</th><th>Statut</th></tr></thead>
      <tbody>
        @for (c of urb.chantiers(); track c.id) {
          <tr>
            <td style="font-weight:500">{{c.projet}}</td>
            <td>{{c.entrepreneur}}</td>
            <td>{{c.dateOuverture}}</td>
            <td [class.date-retard]="c.statut==='retard'">{{c.datePrevueFin}}</td>
            <td>
              <div style="display:flex;align-items:center;gap:6px">
                <div style="width:60px;height:4px;background:#e5e7eb;border-radius:2px">
                  <div style="height:4px;border-radius:2px" [style.background]="(c.tauxAvancement??c.avancement)>=100?'#009A44':c.statut==='retard'?'#e63946':'#F47920'" [style.width.%]="c.tauxAvancement??c.avancement"></div>
                </div>
                <span style="font-size:11px;font-weight:500">{{c.tauxAvancement??c.avancement}}%</span>
              </div>
            </td>
            <td>{{c.derniereVisite || '—'}}</td>
            <td><span class="chip" [ngClass]="chipChantier(c.statut)">{{c.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="7" class="empty-row">Aucun chantier en cours</td></tr> }
      </tbody>
    </table>
  </div>
}
@if (toast.get('proj')?.visible) {
  <div class="success-toast show" style="margin:8px 1rem"><i class="ti ti-check"></i>{{toast.get('proj')?.message}}</div>
}
</div>
  `
})
export class ProjetsComponent implements OnInit {
  readonly urb   = inject(UrbanismeService);
  readonly toast = inject(ToastService);
  active = signal<Tab>('lotissements');
  saving = signal(false);
  showAddL = signal(false);
  showAddA = signal(false);
  showAddC = signal(false);
  fileLot = ''; fileLot2 = '';
  fileAm  = ''; fileAm2  = '';
  fileCh  = ''; fileCh2  = '';
  fLot = { denomination:'', promoteur:'', localisation:'', superficie:0, nombreLots:0, dateApprob:'', statut:'etude' };
  fAm  = { intitule:'', type:'Voirie', localisation:'', budget:0, financeur:'', dateDebut:'', dateFin:'' };
  fCh  = { projet:'', entrepreneur:'', dateOuverture:'', datePrevueFin:'', tauxAvancement:0, observations:'' };

  tabs = [
    { id: 'lotissements' as Tab, label: 'Lotissements',    icon: 'ti-layout-distribute-horizontal' },
    { id: 'amenagements' as Tab, label: 'Aménagements',    icon: 'ti-building-arch' },
    { id: 'chantiers' as Tab,    label: 'Suivi chantiers', icon: 'ti-crane' },
  ];

  ngOnInit(): void { this.urb.loadLotissements(); this.urb.loadAmenagements(); this.urb.loadChantiers(); }

  onFileLot(e: Event): void  { this.fileLot  = (e.target as HTMLInputElement).files?.[0]?.name ?? ''; }
  onFileLot2(e: Event): void { this.fileLot2 = (e.target as HTMLInputElement).files?.[0]?.name ?? ''; }
  onFileAm(e: Event): void   { this.fileAm   = (e.target as HTMLInputElement).files?.[0]?.name ?? ''; }
  onFileAm2(e: Event): void  { this.fileAm2  = (e.target as HTMLInputElement).files?.[0]?.name ?? ''; }
  onFileCh(e: Event): void   { this.fileCh   = (e.target as HTMLInputElement).files?.[0]?.name ?? ''; }
  onFileCh2(e: Event): void  { this.fileCh2  = (e.target as HTMLInputElement).files?.[0]?.name ?? ''; }

  ajouterLotissement(): void {
    if (!this.fLot.denomination || !this.fLot.promoteur || !this.fLot.localisation) { this.toast.showError('proj', 'Dénomination, promoteur et localisation obligatoires'); return; }
    this.saving.set(true);
    this.urb.ajouterLotissement(this.fLot).subscribe({
      next: l => { this.toast.show('proj', `Lotissement enregistré — ${l.reference}`); this.saving.set(false); this.showAddL.set(false); this.fLot = { denomination:'', promoteur:'', localisation:'', superficie:0, nombreLots:0, dateApprob:'', statut:'etude' }; this.fileLot = ''; this.fileLot2 = ''; },
      error: () => this.saving.set(false)
    });
  }

  ajouterAmenagement(): void {
    if (!this.fAm.intitule || !this.fAm.localisation || !this.fAm.budget) { this.toast.showError('proj', "Intitulé, localisation et budget obligatoires"); return; }
    this.saving.set(true);
    this.urb.ajouterAmenagement({ ...this.fAm, tauxAvancement: 0 }).subscribe({
      next: () => { this.toast.show('proj', 'Aménagement enregistré'); this.saving.set(false); this.showAddA.set(false); this.fileAm = ''; this.fileAm2 = ''; },
      error: () => this.saving.set(false)
    });
  }

  ajouterChantier(): void {
    if (!this.fCh.projet || !this.fCh.entrepreneur) { this.toast.showError('proj', 'Projet et entrepreneur obligatoires'); return; }
    this.saving.set(true);
    this.urb.ajouterChantier(this.fCh).subscribe({
      next: () => { this.toast.show('proj', 'Chantier enregistré'); this.saving.set(false); this.showAddC.set(false); this.fileCh = ''; this.fileCh2 = ''; },
      error: () => this.saving.set(false)
    });
  }

  chipProjet(s: string): string   { return { etude:'cm', approuve:'cp', en_cours:'cv', termine:'cn', suspendu:'ce' }[s] ?? 'cm'; }
  chipChantier(s: string): string { return { actif:'cv', arrete:'ce', termine:'cn', retard:'ce' }[s] ?? 'cp'; }
}
