<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe — E-Mairie</title>
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
    .btn-container { text-align: center; margin: 2rem 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #F77F00, #cc6600); color: #fff; text-decoration: none; padding: 0.9rem 2.5rem; border-radius: 10px; font-weight: 800; font-size: 1rem; letter-spacing: 0.3px; box-shadow: 0 4px 15px rgba(247,127,0,0.4); }
    .warning { background: #fff8e1; border-left: 4px solid #F77F00; border-radius: 8px; padding: 1rem 1.2rem; color: #7a5c3a; font-size: 0.85rem; margin-bottom: 1.2rem; }
    .link-fallback { word-break: break-all; color: #009A44; font-size: 0.8rem; background: #f0fdf4; padding: 0.8rem; border-radius: 8px; }
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
        Vous avez demandé la réinitialisation de votre mot de passe pour votre compte sur la plateforme <strong>E-Mairie</strong>.
        Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :
      </p>

      <div class="btn-container">
        <a href="{{ $resetUrl }}" class="btn">🔐 Réinitialiser mon mot de passe</a>
      </div>

      <div class="warning">
        ⚠️ <strong>Important :</strong> Ce lien est valable pendant <strong>60 minutes</strong> uniquement.
        Si vous n'avez pas fait cette demande, ignorez cet email — votre mot de passe ne sera pas modifié.
      </div>

      <p class="text">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
      <div class="link-fallback">{{ $resetUrl }}</div>
    </div>

    <div class="footer">
      <p>© {{ date('Y') }} <span class="footer-brand">E-Mairie</span> — Plateforme Municipale Digitale Intégrée</p>
      <p style="margin-top: 4px;">Cet email a été envoyé automatiquement, ne pas répondre.</p>
    </div>
  </div>
</body>
</html>
