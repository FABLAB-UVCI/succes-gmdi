import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);
  currentYear = new Date().getFullYear();

  constructor(private auth: AuthService, private router: Router) {
    if (auth.isLoggedIn()) router.navigate(['/etat-civil']);
  }

  login() {
    if (!this.email || !this.password) {
      this.error.set('Veuillez renseigner vos identifiants.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/etat-civil']),
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Identifiants incorrects. Veuillez réessayer.');
      }
    });
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }
}
