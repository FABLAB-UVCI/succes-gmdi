import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../communication/core/services/auth.service';

interface NotifItem {
  id: number;
  titre: string;
  message: string;
  type: string;
  icone: string;
  lu: boolean;
  demarche_id: number | null;
  date: string;
}

@Component({
  selector: 'app-citoyen-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dash">
      <!-- Bandeau tricolore -->
      <div class="ivoire-banner">
        <div class="band orange-band"></div>
        <div class="band white-band"></div>
        <div class="band green-band"></div>
      </div>

      <!-- Hero notifications -->
      <div class="hero-notif">
        <div class="hero-left">
          <div class="hero-ico"><i class="ti ti-bell-ringing"></i></div>
          <div>
            <h1 class="hero-title">Centre de Notifications</h1>
            <p class="hero-sub">Suivez en temps réel l'avancement de vos démarches</p>
          </div>
        </div>
        <div class="notif-counter">
          <span class="counter-val">{{ nonLues() }}</span>
          <span class="counter-lbl">Non lues</span>
        </div>
      </div>

      <!-- Actions -->
      @if (nonLues() > 0) {
        <div class="actions-bar">
          <button class="btn-read-all" (click)="markAllRead()">
            <i class="ti ti-checks"></i> Tout marquer comme lu
          </button>
        </div>
      }

      <!-- Liste -->
      <section class="section">
        <div class="section-head">
          <h2 class="section-title"><i class="ti ti-list-check"></i> Toutes les notifications</h2>
          <div class="divider-flag"><span class="df-o"></span><span class="df-w"></span><span class="df-g"></span></div>
        </div>

        @if (loading()) {
          <div class="loading">
            <i class="ti ti-loader-2 spin"></i> Chargement des notifications…
          </div>
        } @else if (notifications().length === 0) {
          <div class="empty">
            <div class="empty-ico">🔔</div>
            <p>Aucune notification pour le moment.</p>
            <p class="empty-sub">Vous serez notifié dès qu'une de vos démarches avance.</p>
          </div>
        } @else {
          <div class="notifications-list">
            @for (n of notifications(); track n.id) {
              <div class="notif-item" [class.unread]="!n.lu" (click)="markRead(n)">
                @if (!n.lu) { <span class="unread-dot"></span> }
                <div class="n-icon" [ngClass]="getIconClass(n.type)">
                  <i [class]="n.icone || getDefaultIcon(n.type)"></i>
                </div>
                <div class="n-body">
                  <h4>{{ n.titre }}</h4>
                  <p>{{ n.message }}</p>
                  <span class="n-time"><i class="ti ti-clock"></i> {{ n.date }}</span>
                </div>
              </div>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .dash { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
    .ivoire-banner { display: flex; height: 8px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .band { flex: 1; }
    .orange-band { background: #F77F00; }
    .white-band { background: #e8edf5; }
    .green-band { background: #009A44; }

    .hero-notif {
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
      background: linear-gradient(135deg, #003366 0%, #004fa3 60%, #009A44 100%);
      border-radius: 16px; padding: 1.8rem 2.5rem;
      box-shadow: 0 8px 30px rgba(0,51,102,.3);
    }
    .hero-left { display: flex; align-items: center; gap: 1.2rem; }
    .hero-ico {
      width: 60px; height: 60px; border-radius: 50%;
      background: rgba(247,127,0,0.3); border: 2px solid rgba(247,127,0,0.6);
      color: #F77F00; font-size: 1.8rem;
      display: flex; align-items: center; justify-content: center;
      animation: bellShake 3s ease-in-out infinite;
    }
    @keyframes bellShake {
      0%, 100% { transform: rotate(0deg); }
      20% { transform: rotate(15deg); }
      40% { transform: rotate(-15deg); }
      60% { transform: rotate(8deg); }
      80% { transform: rotate(-8deg); }
    }
    .hero-title { color: #fff; font-size: 1.5rem; font-weight: 800; margin: 0 0 .3rem; }
    .hero-sub { color: rgba(255,255,255,.7); font-size: .85rem; margin: 0; }
    .notif-counter {
      display: flex; flex-direction: column; align-items: center;
      background: rgba(247,127,0,0.25); border: 2px solid rgba(247,127,0,0.5);
      border-radius: 12px; padding: .8rem 1.5rem;
    }
    .counter-val { color: #F77F00; font-size: 2rem; font-weight: 900; line-height: 1; }
    .counter-lbl { color: rgba(255,255,255,.8); font-size: .75rem; font-weight: 600; margin-top: .2rem; }

    .actions-bar { display: flex; justify-content: flex-end; }
    .btn-read-all {
      display: inline-flex; align-items: center; gap: .5rem;
      padding: .6rem 1.2rem; background: #009A44; color: #fff;
      border: none; border-radius: 8px; font-weight: 700; font-size: .85rem;
      cursor: pointer; transition: all .2s;
    }
    .btn-read-all:hover { background: #007a36; transform: translateY(-1px); }

    .section { background: #fff; border-radius: 14px; padding: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,.05); border-top: 4px solid #F77F00; }
    .section-head { margin-bottom: 1.5rem; }
    .section-title { font-size: 1.1rem; font-weight: 800; color: #003366; margin: 0 0 .6rem; display: flex; align-items: center; gap: 0.5rem; }
    .divider-flag { display: flex; height: 3px; border-radius: 3px; overflow: hidden; width: 80px; }
    .df-o { flex: 1; background: #F77F00; } .df-w { flex: 1; background: #e2e8f0; } .df-g { flex: 1; background: #009A44; }

    .loading { text-align: center; padding: 3rem; color: #7a5c3a; font-size: .95rem; display: flex; align-items: center; justify-content: center; gap: .5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 1s linear infinite; }

    .empty { text-align: center; padding: 3rem; color: #7a5c3a; }
    .empty-ico { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
    .empty-sub { font-size: .8rem; color: #94a3b8; }

    .notifications-list { display: flex; flex-direction: column; gap: 1rem; }
    .notif-item {
      position: relative; display: flex; gap: 1.2rem; align-items: flex-start;
      padding: 1.2rem 1.5rem; border: 2px solid #e8edf5; border-radius: 12px;
      background: #fafbfc; transition: all 0.25s; cursor: pointer;
    }
    .notif-item:hover { background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.07); transform: translateY(-2px); }
    .notif-item.unread { background: #fff9f0; border-color: #ffd199; border-left: 5px solid #F77F00; }
    .unread-dot {
      position: absolute; top: 1rem; right: 1rem;
      width: 10px; height: 10px; border-radius: 50%;
      background: #F77F00; animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 3px rgba(247,127,0,.2); }
      50% { box-shadow: 0 0 0 7px rgba(247,127,0,.05); }
    }
    .n-icon { width: 48px; height: 48px; flex-shrink: 0; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
    .n-icon.success { background: #dcfce7; color: #16a34a; }
    .n-icon.warning { background: #fef3c7; color: #d97706; }
    .n-icon.danger  { background: #fef2f2; color: #e11d48; }
    .n-icon.info    { background: #e0f2fe; color: #0284c7; }
    .n-body h4 { margin: 0 0 .35rem; font-size: .95rem; color: #003366; font-weight: 800; }
    .n-body p { margin: 0 0 .6rem; font-size: .87rem; color: #475569; line-height: 1.5; }
    .n-time { font-size: .75rem; color: #94a3b8; font-weight: 600; display: flex; align-items: center; gap: .3rem; }
  `]
})
export class CitoyenNotificationsComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  notifications = signal<NotifItem[]>([]);
  nonLues       = signal(0);
  loading       = signal(true);

  private get headers() {
    const token = localStorage.getItem('E-Mairie_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading.set(true);
    this.http.get<any>('/api/notifications', { headers: this.headers }).subscribe({
      next: (res) => {
        this.notifications.set(res.data ?? []);
        this.nonLues.set(res.non_lues ?? 0);
        this.loading.set(false);
      },
      error: () => {
        // En cas d'erreur réseau, afficher des notifications demo
        this.notifications.set([
          { id: 1, titre: 'Bienvenue sur E-Mairie 🇨🇮', message: 'Votre compte citoyen a été créé. Bienvenue sur la plateforme numérique de votre commune.', type: 'success', icone: 'ti ti-flag', lu: false, demarche_id: null, date: 'Il y a 3 jours' },
        ]);
        this.nonLues.set(1);
        this.loading.set(false);
      }
    });
  }

  markRead(n: NotifItem) {
    if (n.lu) return;
    this.http.put<any>(`/api/notifications/${n.id}/read`, {}, { headers: this.headers }).subscribe({
      next: () => {
        this.notifications.update(list => list.map(item => item.id === n.id ? { ...item, lu: true } : item));
        this.nonLues.update(v => Math.max(0, v - 1));
      }
    });
  }

  markAllRead() {
    this.http.put<any>('/api/notifications/read-all', {}, { headers: this.headers }).subscribe({
      next: () => {
        this.notifications.update(list => list.map(item => ({ ...item, lu: true })));
        this.nonLues.set(0);
      }
    });
  }

  getIconClass(type: string): string {
    const map: Record<string, string> = { success: 'success', warning: 'warning', danger: 'danger', info: 'info' };
    return map[type] ?? 'info';
  }

  getDefaultIcon(type: string): string {
    const map: Record<string, string> = { success: 'ti ti-circle-check', warning: 'ti ti-alert-circle', danger: 'ti ti-x-circle', info: 'ti ti-info-circle' };
    return map[type] ?? 'ti ti-bell';
  }
}
