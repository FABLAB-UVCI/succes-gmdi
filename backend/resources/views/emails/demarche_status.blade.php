<x-mail::message>
# Bonjour {{ $demarche->user->name ?? 'Citoyen' }},

Le statut de votre démarche portant la référence **{{ $demarche->reference }}** a été mis à jour.

Nouveau statut : **{{ strtoupper($demarche->statut) }}**

<x-mail::button :url="config('app.frontend_url') . '/citoyen'">
Accéder à mon espace
</x-mail::button>

Merci de votre confiance,<br>
L'équipe de {{ config('app.name') }}
</x-mail::message>
