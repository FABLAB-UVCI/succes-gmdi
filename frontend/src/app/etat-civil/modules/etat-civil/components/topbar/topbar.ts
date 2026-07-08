import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent {
  constructor(public auth: AuthService) {}

  userName = computed(() => this.auth.currentUser()?.name ?? 'Agent');
  userRole = computed(() => this.auth.currentUser()?.role ?? 'agent');
  userInitials = computed(() => {
    const name = this.auth.currentUser()?.name ?? 'A';
    return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  });

  logout() {
    this.auth.backToModules();
  }
}
