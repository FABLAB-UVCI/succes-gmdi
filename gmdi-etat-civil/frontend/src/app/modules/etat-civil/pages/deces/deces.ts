import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-deces',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deces.html',
  styleUrls: ['./deces.css']
})
export class DecesComponent implements OnInit {
  currentTab = signal('decl');
  toastMsg = signal('');
  showToast = signal(false);
  deces = signal<any[]>([]);

  decesForm = { nom: '', prenom: '', dob: '', date: '', heure: '', lieu: '', commune: '', cause: '', declarant: '', lien: '' };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDeces().subscribe({ next: d => this.deces.set(d), error: () => {} });
  }

  switchTab(tab: string) { this.currentTab.set(tab); }

  notify(msg: string) {
    this.toastMsg.set(msg); this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3500);
  }

  enregistrerDeces() {
    const f = this.decesForm;
    if (!f.nom || !f.date || !f.lieu) { this.notify('Nom, date et lieu requis'); return; }
    this.api.createDeces({
      nom: f.nom, prenom: f.prenom,
      date_naissance: f.dob || null,
      date_deces: f.date, heure_deces: f.heure,
      lieu_deces: f.lieu, commune: f.commune,
      cause_deces: f.cause,
      declarant_nom: f.declarant, declarant_lien: f.lien
    }).subscribe({
      next: res => {
        this.deces.update(l => [res, ...l]);
        this.notify(`Acte de décès enregistré — N° ${res.numero}`);
        this.decesForm = { nom: '', prenom: '', dob: '', date: '', heure: '', lieu: '', commune: '', cause: '', declarant: '', lien: '' };
      },
      error: () => this.notify("Erreur lors de l'enregistrement")
    });
  }
}
