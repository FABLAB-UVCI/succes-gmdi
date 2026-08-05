<?php

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    // CORS_ALLOWED_ORIGINS: liste d'origines séparées par des virgules (ex.
    // https://mairie.example.com,https://admin.example.com). Par défaut ('*'
    // non défini), reste ouvert pour ne pas casser le développement local ;
    // à restreindre au(x) domaine(s) réel(s) du frontend une fois déployé.
    'allowed_origins' => array_filter(array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', '*')))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
