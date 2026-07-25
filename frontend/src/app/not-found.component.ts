import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <!-- Bandeau tricolore fixe en haut -->
      <div class="flag-top">
        <span class="ft-o"></span><span class="ft-w"></span><span class="ft-v"></span>
      </div>

      <div class="content">
        <!-- Animation 404 -->
        <div class="code-block">
          <span class="digit orange">4</span>
          <span class="digit flag-emoji">🇨🇮</span>
          <span class="digit green">4</span>
        </div>

        <h1 class="title">Page introuvable</h1>
        <p class="subtitle">
          La page que vous cherchez n'existe pas ou a été déplacée.<br>
          Revenez à l'accueil pour continuer votre démarche.
        </p>

        <!-- Carte actions -->
        <div class="actions-card">
          <a class="btn-home" routerLink="/">
            <i class="ti ti-home"></i> Retour à l'accueil
          </a>
          <a class="btn-citoyen" routerLink="/citoyen">
            <i class="ti ti-user"></i> Mon espace citoyen
          </a>
        </div>

        <!-- Info rapide -->
        <div class="help-row">
          <div class="help-item">
            <i class="ti ti-file-description"></i>
            <span>Démarches en ligne</span>
          </div>
          <div class="help-item">
            <i class="ti ti-building"></i>
            <span>Services municipaux</span>
          </div>
          <div class="help-item">
            <i class="ti ti-shield-check"></i>
            <span>Accès sécurisé</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-flag">
          <span class="ff-o"></span><span class="ff-w"></span><span class="ff-v"></span>
        </div>
        <div class="footer-text">🇨🇮 E-Mairie — Plateforme Municipale Digitale Intégrée · UVCI FabLab</div>
      </footer>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: linear-gradient(160deg, #FFF8EE 0%, #ffffff 50%, #f0fdf4 100%);
      font-family: 'Inter', system-ui, sans-serif;
      padding: 2rem 1rem 5rem;
      position: relative;
    }

    /* Bandeau tricolore haut */
    .flag-top { position: fixed; top: 0; left: 0; right: 0; display: flex; height: 6px; z-index: 100; }
    .ft-o { flex: 1; background: #F77F00; }
    .ft-w { flex: 1; background: #fff; border-top: 1px solid #e2e8f0; }
    .ft-v { flex: 1; background: #009A44; }

    .content { text-align: center; max-width: 560px; width: 100%; }

    /* Chiffres 404 animés */
    .code-block {
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      margin-bottom: 2rem;
      animation: floatUp 0.8s ease-out both;
    }
    @keyframes floatUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .digit {
      font-size: 8rem; font-weight: 900; line-height: 1;
      text-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }
    .flag-emoji { font-size: 7rem; animation: spin 6s ease-in-out infinite alternate; }
    @keyframes spin {
      from { transform: rotate(-8deg) scale(0.95); }
      to   { transform: rotate(8deg) scale(1.05); }
    }
    .orange { color: #F77F00; }
    .green  { color: #009A44; }

    .title {
      font-size: 2rem; font-weight: 800; color: #003366; margin: 0 0 1rem;
      animation: floatUp 0.8s 0.1s ease-out both;
    }
    .subtitle {
      color: #7a5c3a; font-size: 1rem; line-height: 1.6; margin: 0 0 2.5rem;
      animation: floatUp 0.8s 0.2s ease-out both;
    }

    /* Boutons */
    .actions-card {
      display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
      margin-bottom: 2.5rem;
      animation: floatUp 0.8s 0.3s ease-out both;
    }
    .btn-home, .btn-citoyen {
      display: inline-flex; align-items: center; gap: .5rem;
      padding: .85rem 1.8rem; border-radius: 12px;
      font-weight: 800; font-size: .95rem; text-decoration: none;
      transition: all .2s; cursor: pointer;
    }
    .btn-home {
      background: linear-gradient(135deg, #F77F00, #cc6600);
      color: #fff; box-shadow: 0 4px 15px rgba(247,127,0,.35);
    }
    .btn-home:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(247,127,0,.5); }
    .btn-citoyen {
      background: #fff; color: #009A44;
      border: 2px solid #009A44;
    }
    .btn-citoyen:hover { background: #009A44; color: #fff; transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,154,68,.3); }

    /* Aide rapide */
    .help-row {
      display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;
      animation: floatUp 0.8s 0.4s ease-out both;
    }
    .help-item {
      display: flex; align-items: center; gap: .4rem;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 30px;
      padding: .5rem 1rem; font-size: .82rem; color: #475569; font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,.04);
    }
    .help-item i { color: #F77F00; font-size: 1rem; }

    /* Footer */
    .footer { position: fixed; bottom: 0; left: 0; right: 0; }
    .footer-flag { display: flex; height: 5px; }
    .ff-o { flex: 1; background: #F77F00; }
    .ff-w { flex: 1; background: #fff; border: 1px solid #e2e8f0; }
    .ff-v { flex: 1; background: #009A44; }
    .footer-text {
      background: #fff; text-align: center; padding: .65rem 1rem;
      font-size: .75rem; color: #7a8aaa;
      border-top: 1px solid #e2e8f0;
    }
  `]
})
export class NotFoundComponent {}
