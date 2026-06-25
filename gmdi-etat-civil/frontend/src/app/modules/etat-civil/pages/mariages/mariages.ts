import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-mariages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mariages.html',
  styleUrls: ['./mariages.css']
})
export class MariagesComponent implements OnInit {
  currentTab = signal('bans');
  toastMsg = signal('');
  showToast = signal(false);
  mariages = signal<any[]>([]);

  bansForm = { epoux: '', epouse: '', pub: '', mar: '' };
  mariageForm = {
    epNom: '', epProf: '', epNat: 'Ivoirienne',
    esNom: '', esProf: '', esNat: 'Ivoirienne',
    date: '', lieu: '', regime: 'Communauté de biens',
    temoin1: '', temoin2: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getMariages().subscribe({ next: d => this.mariages.set(d), error: () => {} });
  }

  switchTab(tab: string) { this.currentTab.set(tab); }

  notify(msg: string) {
    this.toastMsg.set(msg); this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3500);
  }

  publierBans() {
    if (!this.bansForm.epoux || !this.bansForm.epouse) { this.notify('Noms requis'); return; }
    this.notify(`Bans publiés pour ${this.bansForm.epoux} & ${this.bansForm.epouse}`);
    this.bansForm = { epoux: '', epouse: '', pub: '', mar: '' };
  }

  enregistrerMariage() {
    const f = this.mariageForm;
    if (!f.epNom || !f.esNom || !f.date) { this.notify('Époux, épouse et date requis'); return; }
    this.api.createMariage({
      epoux_nom: f.epNom, epoux_prenom: '', epoux_profession: f.epProf, epoux_nationalite: f.epNat,
      epouse_nom: f.esNom, epouse_prenom: '', epouse_profession: f.esProf, epouse_nationalite: f.esNat,
      date_mariage: f.date, lieu_mariage: f.lieu, regime_matrimonial: f.regime,
      temoin1_nom: f.temoin1, temoin2_nom: f.temoin2
    }).subscribe({
      next: res => {
        this.mariages.update(l => [res, ...l]);
        this.notify(`Mariage enregistré — N° ${res.numero}`);
        this.mariageForm = { epNom: '', epProf: '', epNat: 'Ivoirienne', esNom: '', esProf: '', esNat: 'Ivoirienne', date: '', lieu: '', regime: 'Communauté de biens', temoin1: '', temoin2: '' };
      },
      error: () => this.notify("Erreur lors de l'enregistrement")
    });
  }
}
