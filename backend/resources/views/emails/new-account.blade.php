<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre compte E-Mairie</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f6fb; font-family: 'Segoe UI', Arial, sans-serif; }
    .container { max-width: 580px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #F77F00 0%, #cc6600 40%, #009A44 100%); padding: 2.5rem 2rem; text-align: center; }
    .flag-strip { display: flex; height: 5px; margin-top: 1.5rem; }
    .f-o { flex: 1; background: #F77F00; }
    .f-w { flex: 1; background: #fff; }
    .f-v { flex: 1; background: #009A44; }
    .logo { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .header h1 { color: #fff; font-size: 1.5rem; font-weight: 800; margin: 0; letter-spacing: 0.5px; text-shadow: 0 2px 6px rgba(0,0,0,0.2); }
    .header p { color: rgba(255,255,255,0.85); font-size: 0.85rem; margin: 0.3rem 0 0; }
    .body { padding: 2.5rem 2rem; }
    .greeting { font-size: 1.1rem; color: #003366; font-weight: 700; margin-bottom: 1rem; }
    .text { color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.2rem; }
    .creds { background: #f0f7ff; border: 1.5px solid #cfe3ff; border-radius: 10px; padding: 1.2rem 1.4rem; margin: 1.5rem 0; }
    .creds-row { display: flex; justify-content: space-between; padding: .4rem 0; font-size: .92rem; }
    .creds-label { color: #64748b; font-weight: 600; }
    .creds-value { color: #003366; font-weight: 800; font-family: monospace; }
    .btn-container { text-align: center; margin: 2rem 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #F77F00, #cc6600); color: #fff; text-decoration: none; padding: 0.9rem 2.5rem; border-radius: 10px; font-weight: 800; font-size: 1rem; letter-spacing: 0.3px; box-shadow: 0 4px 15px rgba(247,127,0,0.4); }
    .warning { background: #fff8e1; border-left: 4px solid #F77F00; border-radius: 8px; padding: 1rem 1.2rem; color: #7a5c3a; font-size: 0.85rem; margin-bottom: 1.2rem; }
    .footer { background: #f8fafc; padding: 1.5rem 2rem; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #94a3b8; font-size: 0.78rem; margin: 0; }
    .footer-brand { color: #003366; font-weight: 800; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🇨🇮</div>
      <h1>E-Mairie — Portail Municipal</h1>
      <p>République de Côte d'Ivoire</p>
      <div class="flag-strip">
        <div class="f-o"></div><div class="f-w"></div><div class="f-v"></div>
      </div>
    </div>

    <div class="body">
      <div class="greeting">Bonjour {{ $user->name }},</div>

      <p class="text">
        Un compte professionnel vient d'être créé pour vous sur la plateforme <strong>E-Mairie</strong>
        ({{ $roleLabel }}{{ $moduleLabel ? ' — '.$moduleLabel : '' }}). Voici vos identifiants de connexion :
      </p>

      <div class="creds">
        <div class="creds-row"><span class="creds-label">Email</span><span class="creds-value">{{ $user->email }}</span></div>
        <div class="creds-row"><span class="creds-label">Mot de passe</span><span class="creds-value">{{ $password }}</span></div>
      </div>

      <div class="btn-container">
        <a href="{{ $loginUrl }}" class="btn">Se connecter</a>
      </div>

      <div class="warning">
        ⚠️ <strong>Important :</strong> Utilisez le lien <em>« Accès Professionnel »</em> sur la page d'accueil pour vous connecter,
        et conservez ce mot de passe en lieu sûr.
      </div>
    </div>

    <div class="footer">
      <p>© {{ date('Y') }} <span class="footer-brand">E-Mairie</span> — Plateforme Municipale Digitale Intégrée</p>
      <p style="margin-top: 4px;">Cet email a été envoyé automatiquement, ne pas répondre.</p>
    </div>
  </div>
</body>
</html>
