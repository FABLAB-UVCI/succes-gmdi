import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface MenuItem {
  type: 'section' | 'item';
  label: string;
  route?: string;
  icon?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  constructor(private router: Router) {}

  menuItems: MenuItem[] = [
    { type: 'section', label: 'État Civil' },
    { type: 'item', route: 'naissances',   label: 'Naissances',      icon: 'ti ti-baby-carriage' },
    { type: 'item', route: 'mariages',     label: 'Mariages',        icon: 'ti ti-heart' },
    { type: 'item', route: 'deces',        label: 'Décès',           icon: 'ti ti-ribbon-health' },
    { type: 'item', route: 'certificats',  label: 'Certificats',     icon: 'ti ti-certificate' },
    { type: 'item', route: 'statistiques', label: 'Statistiques',    icon: 'ti ti-chart-bar' },
    { type: 'section', label: 'Actions' },
    { type: 'item', route: 'recherche',    label: 'Rechercher acte', icon: 'ti ti-search' },
  ];

  navigate(item: MenuItem) {
    if (item.route) {
      this.router.navigate(['/etat-civil', item.route]);
    }
  }

  isActive(route?: string): boolean {
    return !!route && this.router.url.includes(route);
  }
}
