import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistiques.html',
  styleUrls: ['./statistiques.css']
})
export class StatistiquesComponent implements OnInit {
  stats = signal<any>(null);
  loadError = signal(false);
  mois = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.chargerStatistiques();
  }

  chargerStatistiques(): void {
    this.loadError.set(false);
    this.api.getStatistiques().subscribe({
      next: d => this.stats.set(d),
      error: () => this.loadError.set(true)
    });
  }

  get totaux() { return this.stats()?.totaux ?? { naissances: 0, mariages: 0, deces: 0, certificats: 0 }; }
  get mensuelNaissances() { return this.stats()?.mensuel?.naissances ?? Array(12).fill(0); }
  get mensuelMariages() { return this.stats()?.mensuel?.mariages ?? Array(12).fill(0); }
  get mensuelDeces() { return this.stats()?.mensuel?.deces ?? Array(12).fill(0); }

  getBarHeight(val: number, arr: number[]): string {
    const max = Math.max(...arr, 1);
    return Math.round((val / max) * 100) + '%';
  }
}
