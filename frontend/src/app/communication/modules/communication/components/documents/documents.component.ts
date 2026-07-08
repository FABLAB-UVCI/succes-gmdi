import { Component, signal, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunicationService } from '../../../../core/services/communication.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'photos' | 'videos' | 'archives';

@Component({
  selector: 'app-documents',
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

<!-- ── Photos ─────────────────────────────────────────────────────────── -->
@if (active()==='photos') {
  <div class="ph"><div class="pt"><i class="ti ti-photo"></i>Médiathèque photos</div></div>
  @if (toast.get('ph')?.visible) { <div class="show" [ngClass]="toast.get('ph')?.type==='error' ? 'error-toast' : 'success-toast'" style="margin:.5rem 1rem"><i class="ti" [ngClass]="toast.get('ph')?.type==='error' ? 'ti-alert-circle' : 'ti-check'"></i>{{toast.get('ph')?.message}}</div> }
  <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
    <div class="fsec">Ajouter une photo</div>
    <div class="form-grid-3">
      <div class="fg"><div class="fl">Titre / Légende <span style="color:#e63946">*</span></div><input class="fi" [(ngModel)]="fPh.titre" placeholder="Ex: Inauguration marché — Mai 2025"></div>
      <div class="fg"><div class="fl">Catégorie</div>
        <select class="fs" [(ngModel)]="fPh.categorie">
          <option>Événements</option><option>Travaux</option><option>Rencontres officielles</option><option>Vie municipale</option><option>Archives</option>
        </select>
      </div>
      <div class="fg"><div class="fl">Date de prise de vue</div><input class="fi" type="date" [(ngModel)]="fPh.date"></div>
    </div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Photographe</div><input class="fi" [(ngModel)]="fPh.photographe" placeholder="Nom du photographe ou service"></div>
      <div class="fg"><div class="fl">Droits d'utilisation</div>
        <select class="fs" [(ngModel)]="fPh.droits">
          <option>Usage interne uniquement</option><option>Presse et communication</option><option>Réseaux sociaux</option><option>Tous usages</option>
        </select>
      </div>
    </div>
    <div class="fg" style="margin-bottom:8px">
      <div class="fl">Upload de photos <span style="color:#e63946">*</span></div>
      <input #photoInput class="fi" type="file" accept="image/png,image/jpeg,image/webp" multiple (change)="onPhotosSelected($event)" style="padding:6px 10px;height:auto">
      <div style="font-size:10.5px;color:var(--color-text-secondary);margin-top:2px">Formats acceptés : JPG, PNG, WEBP — 5 Mo max par fichier</div>
      @if (selectedPhotos.length) {
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
          @for (f of selectedPhotos; track f.name) {
            <span class="chip cv" style="gap:6px"><i class="ti ti-photo"></i>{{f.name}}
              <i class="ti ti-x" style="cursor:pointer" (click)="removePhoto(f)"></i>
            </span>
          }
        </div>
      }
    </div>
    <div class="fa"><button class="btn-p" [disabled]="saving()" (click)="ajouterPhoto()"><i class="ti ti-upload"></i>Enregistrer dans la médiathèque</button></div>
  </div>
  <div style="padding:.75rem 1rem">
    <div class="fsec" style="margin-top:0">Photos récentes</div>
    @for (d of photos(); track d.id) {
      <div class="doc-card">
        @if (d.url) {
          <img [src]="d.url" alt="{{d.titre}}" class="doc-thumb">
        } @else {
          <div class="doc-ico" style="background:#E1306C1a"><i class="ti ti-photo" style="color:#E1306C"></i></div>
        }
        <div class="doc-body">
          <div class="doc-nom">{{d.titre}}</div>
          <div class="doc-meta">{{d.categorie}} — {{d.date}}{{d.auteur ? ' — ' + d.auteur : ''}}</div>
        </div>
        @if (d.url) {
          <a class="btn-s sm" [href]="d.url" target="_blank" rel="noopener"><i class="ti ti-download"></i></a>
        }
      </div>
    }
    @empty { <div class="empty-row">Aucune photo enregistrée</div> }
  </div>
}

<!-- ── Vidéos ─────────────────────────────────────────────────────────── -->
@if (active()==='videos') {
  <div class="ph"><div class="pt"><i class="ti ti-video"></i>Médiathèque vidéos</div></div>
  @if (toast.get('vid')?.visible) { <div class="show" [ngClass]="toast.get('vid')?.type==='error' ? 'error-toast' : 'success-toast'" style="margin:.5rem 1rem"><i class="ti" [ngClass]="toast.get('vid')?.type==='error' ? 'ti-alert-circle' : 'ti-check'"></i>{{toast.get('vid')?.message}}</div> }
  <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
    <div class="fsec">Ajouter une vidéo</div>
    <div class="form-grid-3">
      <div class="fg"><div class="fl">Titre <span style="color:#e63946">*</span></div><input class="fi" [(ngModel)]="fVid.titre" placeholder="Ex: Conseil municipal — Mai 2025"></div>
      <div class="fg"><div class="fl">Catégorie</div>
        <select class="fs" [(ngModel)]="fVid.categorie">
          <option>Séance du Conseil</option><option>Inauguration</option><option>Sensibilisation</option><option>Interview</option><option>Reportage</option>
        </select>
      </div>
      <div class="fg"><div class="fl">Durée</div><input class="fi" [(ngModel)]="fVid.duree" placeholder="Ex: 12 min 45 s"></div>
    </div>
    <div class="form-grid">
      <div class="fg"><div class="fl">URL ou référence fichier</div><input class="fi" [(ngModel)]="fVid.url" placeholder="https://youtube.com/... ou VIDEOS/2025-05-24.mp4"></div>
      <div class="fg"><div class="fl">Date</div><input class="fi" type="date" [(ngModel)]="fVid.date"></div>
    </div>
    <div class="fa"><button class="btn-p" [disabled]="saving()" (click)="ajouterVideo()"><i class="ti ti-upload"></i>Enregistrer</button></div>
  </div>
  <div style="padding:.75rem 1rem">
    <div class="fsec" style="margin-top:0">Vidéos récentes</div>
    @for (d of videos(); track d.id) {
      <div class="doc-card">
        <div class="doc-ico" style="background:#185FA51a"><i class="ti ti-video" style="color:#185FA5"></i></div>
        <div class="doc-body">
          <div class="doc-nom">{{d.titre}}</div>
          <div class="doc-meta">{{d.categorie}} — {{d.date}}</div>
        </div>
        @if (d.url) {
          <a class="btn-s sm" [href]="d.url" target="_blank" rel="noopener"><i class="ti ti-download"></i></a>
        }
      </div>
    }
    @empty { <div class="empty-row">Aucune vidéo enregistrée</div> }
  </div>
}

<!-- ── Archives ────────────────────────────────────────────────────────── -->
@if (active()==='archives') {
  <div class="ph">
    <div class="pt"><i class="ti ti-archive"></i>Archives documentaires</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:.75rem 1rem;border-bottom:.5px solid var(--color-border-tertiary)">
    <div class="mini-kpi"><span class="mk-v" style="color:#F77F00">1 248</span><span class="mk-l">Documents archivés</span></div>
    <div class="mini-kpi"><span class="mk-v" style="color:#E1306C">{{photos().length}}</span><span class="mk-l">Photos</span></div>
    <div class="mini-kpi"><span class="mk-v" style="color:#185FA5">{{videos().length}}</span><span class="mk-l">Vidéos</span></div>
    <div class="mini-kpi"><span class="mk-v" style="color:#009A44">838</span><span class="mk-l">Documents PDF / Office</span></div>
  </div>
  <div style="padding:6px 8px;border-bottom:.5px solid var(--color-border-tertiary);display:flex;gap:8px">
    <input class="fi" style="max-width:200px" [(ngModel)]="searchArc" placeholder="Rechercher dans les archives...">
    <select class="fs" style="max-width:150px" [(ngModel)]="filtreArc" (ngModelChange)="com.loadDocuments({type:filtreArc})">
      <option value="">Tous types</option><option value="photo">Photos</option><option value="video">Vidéos</option><option value="pdf">Documents PDF</option>
    </select>
  </div>
  <div style="padding:.75rem 1rem">
    @for (d of filteredDocuments(); track d.id) {
      <div class="doc-card">
        <div class="doc-ico" [style.background]="docColor(d.type)+'1a'" [style.color]="docColor(d.type)"><i class="ti {{docIcon(d.type)}}"></i></div>
        <div class="doc-body">
          <div class="doc-nom">{{d.titre}}</div>
          <div class="doc-meta">
            <span class="chip cm" style="font-size:9px;padding:1px 5px">{{docLabel(d.type)}}</span> — {{d.categorie}} — {{d.date}}
          </div>
        </div>
        @if (d.url) {
          <a class="btn-s sm" [href]="d.url" target="_blank" rel="noopener"><i class="ti ti-download"></i></a>
        }
      </div>
    }
    @empty { <div class="empty-row">Aucun document archivé</div> }
  </div>
}
</div>

<style>
.doc-card { border:.5px solid var(--color-border-tertiary);border-radius:7px;padding:.65rem .85rem;margin-bottom:.4rem;display:flex;align-items:center;gap:.75rem }
.doc-ico { width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0 }
.doc-thumb { width:32px;height:32px;border-radius:6px;object-fit:cover;flex-shrink:0 }
.doc-nom { font-size:12px;font-weight:500;color:var(--color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis }
.doc-meta { font-size:11px;color:var(--color-text-secondary) }
.doc-body { flex:1;min-width:0 }
</style>
  `
})
export class DocumentsComponent implements OnInit {
  readonly com   = inject(CommunicationService);
  readonly toast = inject(ToastService);
  active  = signal<Tab>('photos');
  saving  = signal(false);
  searchArc = ''; filtreArc = '';
  fPh  = { titre:'', categorie:'Événements', date:'', photographe:'', droits:'Usage interne uniquement' };
  fVid = { titre:'', categorie:'Séance du Conseil', duree:'', url:'', date:'' };
  selectedPhotos: File[] = [];
  @ViewChild('photoInput') photoInput?: ElementRef<HTMLInputElement>;

  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly MAX_SIZE = 5 * 1024 * 1024;

  photos  = () => this.com.documents().filter(d => d.type === 'photo');
  videos  = () => this.com.documents().filter(d => d.type === 'video');

  filteredDocuments() {
    const q = this.searchArc.toLowerCase().trim();
    return this.com.documents().filter(d =>
      !q || d.titre.toLowerCase().includes(q) || (d.categorie ?? '').toLowerCase().includes(q)
    );
  }

  tabs = [
    { id: 'photos' as Tab,   label: 'Photos',   icon: 'ti-photo' },
    { id: 'videos' as Tab,   label: 'Vidéos',   icon: 'ti-video' },
    { id: 'archives' as Tab, label: 'Archives', icon: 'ti-archive' },
  ];

  ngOnInit(): void { this.com.loadDocuments(); }

  onPhotosSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    for (const f of files) {
      if (!this.ALLOWED_TYPES.includes(f.type)) { this.toast.showError('ph', `Format non supporté : ${f.name}`); continue; }
      if (f.size > this.MAX_SIZE) { this.toast.showError('ph', `Fichier trop volumineux (max 5 Mo) : ${f.name}`); continue; }
      this.selectedPhotos.push(f);
    }
    input.value = '';
  }

  removePhoto(f: File): void {
    this.selectedPhotos = this.selectedPhotos.filter(x => x !== f);
  }

  ajouterPhoto(): void {
    if (!this.fPh.titre) { this.toast.showError('ph', 'Titre obligatoire'); return; }
    if (!this.selectedPhotos.length) { this.toast.showError('ph', 'Sélectionnez au moins une photo'); return; }
    this.saving.set(true);
    const fd = new FormData();
    fd.append('titre', this.fPh.titre);
    fd.append('type', 'photo');
    fd.append('categorie', this.fPh.categorie);
    fd.append('date', this.fPh.date || new Date().toISOString().slice(0,10));
    fd.append('auteur', this.fPh.photographe);
    fd.append('droits', this.fPh.droits);
    for (const f of this.selectedPhotos) fd.append('photos[]', f);
    this.com.ajouterPhotos(fd).subscribe({
      next: (docs) => {
        this.toast.show('ph', `${docs.length} photo(s) enregistrée(s) — ${this.fPh.titre}`);
        this.saving.set(false);
        this.fPh = { titre:'', categorie:'Événements', date:'', photographe:'', droits:'Usage interne uniquement' };
        this.selectedPhotos = [];
        if (this.photoInput) this.photoInput.nativeElement.value = '';
      },
      error: (err) => { this.saving.set(false); this.toast.showError('ph', err?.error?.message || 'Une erreur est survenue.'); }
    });
  }

  ajouterVideo(): void {
    if (!this.fVid.titre) { this.toast.showError('vid', 'Titre obligatoire'); return; }
    this.saving.set(true);
    this.com.ajouterDocument({ titre: this.fVid.titre, type: 'video', categorie: this.fVid.categorie, date: this.fVid.date || new Date().toISOString().slice(0,10), url: this.fVid.url }).subscribe({
      next: () => { this.toast.show('vid', 'Vidéo enregistrée — '+this.fVid.titre); this.saving.set(false); this.fVid = { titre:'', categorie:'Séance du Conseil', duree:'', url:'', date:'' }; },
      error: (err) => { this.saving.set(false); this.toast.showError('vid', err?.error?.message || 'Une erreur est survenue.'); }
    });
  }

  docColor(t: string): string { return { photo:'#E1306C', video:'#185FA5', pdf:'#003366', arrete:'#C9A84C', deliberation:'#C9A84C' }[t] ?? '#888'; }
  docIcon(t: string): string  { return { photo:'ti-photo', video:'ti-video', pdf:'ti-file-text', arrete:'ti-file-certificate', deliberation:'ti-file-certificate' }[t] ?? 'ti-file'; }
  docLabel(t: string): string { return { photo:'Photo', video:'Vidéo', pdf:'Document PDF', arrete:'Arrêté', deliberation:'Délibération' }[t] ?? t; }
}
