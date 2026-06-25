// components/kpi-cards/kpi-cards.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface KpiData {
  value: number;
  label: string;
  color: string;
  icon: string;
  iconBg: string;
  barColor: string;
}

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-cards.html',
  styleUrls: ['./kpi-cards.css']
})
export class KpiCardsComponent {
  @Input() naissances = 742;
  @Input() mariages = 318;
  @Input() adoptions = 2;
  @Input() deces = 184;
  @Input() certificats = 124;

  getKpis(): KpiData[] {
    return [
      { 
        value: this.naissances, 
        label: 'Naissances ce mois', 
        color: '#F77F00', 
        icon: 'fas fa-baby-carriage', 
        iconBg: 'rgba(247,127,0,0.1)',
        barColor: '#F77F00'
      },
      { 
        value: this.mariages, 
        label: 'Mariages ce mois', 
        color: '#185FA5', 
        icon: 'fas fa-heart', 
        iconBg: 'rgba(24,95,165,0.1)',
        barColor: '#185FA5'
      },
      { 
        value: this.adoptions, 
        label: 'Adoptions ce mois', 
        color: '#E91E63', 
        icon: 'fas fa-handshake', 
        iconBg: 'rgba(233,30,99,0.1)',
        barColor: '#E91E63'
      },
      { 
        value: this.deces, 
        label: 'Décès ce mois', 
        color: '#888780', 
        icon: 'fas fa-cross', 
        iconBg: 'rgba(136,135,128,0.1)',
        barColor: '#888780'
      },
      { 
        value: this.certificats, 
        label: 'Certificats délivrés', 
        color: '#009A44', 
        icon: 'fas fa-certificate', 
        iconBg: 'rgba(0,154,68,0.1)',
        barColor: '#009A44'
      }
    ];
  }
}