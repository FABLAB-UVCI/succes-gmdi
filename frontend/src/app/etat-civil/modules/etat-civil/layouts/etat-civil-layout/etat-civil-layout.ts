import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { TopbarComponent } from '../../components/topbar/topbar';

@Component({
  selector: 'app-etat-civil-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './etat-civil-layout.html',
  styleUrl: './etat-civil-layout.css'
})
export class EtatCivilLayoutComponent {
  sidebarOpen = signal(false);
  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  closeSidebar()  { this.sidebarOpen.set(false); }

  qrOpen   = signal(false);
  qrValue  = '';
  qrResult = signal('');
  openQr()  { this.qrOpen.set(true); this.qrValue = ''; this.qrResult.set(''); }
  closeQr() { this.qrOpen.set(false); }
  verifierQR() {
    if (!this.qrValue.trim()) return;
    this.qrResult.set(`✓ Acte trouvé : ${this.qrValue.trim()}`);
  }
}
