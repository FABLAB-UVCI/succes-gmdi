-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 26 juin 2026 à 12:51
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gmdi_finances`
--

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `comptes_gl`
--

CREATE TABLE `comptes_gl` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `compte` varchar(20) NOT NULL,
  `intitule` varchar(255) NOT NULL,
  `debit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `credit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `solde` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `depenses`
--

CREATE TABLE `depenses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(255) NOT NULL,
  `objet` varchar(255) NOT NULL,
  `fournisseur` varchar(255) NOT NULL,
  `montant` decimal(15,2) NOT NULL,
  `chapitre` enum('recettes','personnel','fonctionnement','investissement') NOT NULL,
  `article` varchar(255) NOT NULL,
  `date_engagement` date NOT NULL,
  `description` text DEFAULT NULL,
  `statut` enum('en_attente','valide','engage','paye') NOT NULL DEFAULT 'en_attente',
  `date_paiement` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `depenses`
--

INSERT INTO `depenses` (`id`, `reference`, `objet`, `fournisseur`, `montant`, `chapitre`, `article`, `date_engagement`, `description`, `statut`, `date_paiement`, `created_at`, `updated_at`) VALUES
(1, 'DEP-2026-0143', 'Nourriture', 'KFC', 75000.00, 'personnel', 'Repas', '2017-05-24', 'Rien à signaler', 'en_attente', NULL, '2026-06-23 15:12:51', '2026-06-23 15:12:51');

-- --------------------------------------------------------

--
-- Structure de la table `ecritures_comptables`
--

CREATE TABLE `ecritures_comptables` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `numero` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `journal` varchar(50) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `compte` varchar(20) NOT NULL,
  `debit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `credit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `piece` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `lignes_budget`
--

CREATE TABLE `lignes_budget` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `chapitre` enum('recettes','personnel','fonctionnement','investissement') NOT NULL,
  `article` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `montant_previsionnel` decimal(15,2) NOT NULL DEFAULT 0.00,
  `montant_consomme` decimal(15,2) NOT NULL DEFAULT 0.00,
  `statut` enum('provisoire','approuve','rejete') NOT NULL DEFAULT 'provisoire',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `lignes_budget`
--

INSERT INTO `lignes_budget` (`id`, `chapitre`, `article`, `designation`, `montant_previsionnel`, `montant_consomme`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'fonctionnement', 'taxes_communales', 'Taxe communales 2025', 56490278.00, 0.00, 'provisoire', '2026-06-23 15:04:50', '2026-06-23 15:04:50'),
(2, 'recettes', 'Taxes_communales', 'Taxes communales 2026', 50000.00, 0.00, 'provisoire', '2026-06-25 15:07:16', '2026-06-25 15:07:16');

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_01_01_000001_create_recettes_table', 1),
(5, '2025_01_01_000002_create_depenses_table', 1),
(6, '2025_01_01_000003_create_lignes_budget_table', 1),
(7, '2025_01_01_000004_create_ecritures_comptables_table', 1),
(8, '2025_01_01_000005_create_comptes_gl_table', 1),
(9, '2025_01_01_000006_create_mouvements_caisse_table', 1),
(10, '2025_01_01_000007_create_mouvements_banque_table', 1),
(11, '2025_01_01_000008_create_recettes_par_service_table', 1),
(12, '2026_06_16_075115_add_role_to_users_table', 1),
(13, '2026_06_16_080616_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Structure de la table `mouvements_banque`
--

CREATE TABLE `mouvements_banque` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `debit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `credit` decimal(15,2) NOT NULL DEFAULT 0.00,
  `solde` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `mouvements_caisse`
--

CREATE TABLE `mouvements_caisse` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `type` enum('encaissement','decaissement') NOT NULL,
  `montant` decimal(15,2) NOT NULL,
  `solde_apres` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'gmdi-app', '9c3363a54509e699af5123332f243f8fdc2d7b6987384a25dad52778e3d0e082', '[\"*\"]', '2026-06-23 15:12:51', NULL, '2026-06-23 15:02:56', '2026-06-23 15:12:51'),
(3, 'App\\Models\\User', 1, 'gmdi-app', 'eea639a96f8b9e4c1e3109007226678371a44b5930d29fa7320f87388751fbdd', '[\"*\"]', NULL, NULL, '2026-06-25 05:05:48', '2026-06-25 05:05:48'),
(4, 'App\\Models\\User', 1, 'gmdi-app', '3a0af5c47de7f0130b26deef4871892db7b7ca6e2f795716efbaceb8ee8a3c3b', '[\"*\"]', NULL, NULL, '2026-06-25 05:07:55', '2026-06-25 05:07:55'),
(5, 'App\\Models\\User', 1, 'gmdi-app', '227c55f2fa6a2e6d7ea265612bd9ce69aad43322e4fcbc153e97f0d0422f5538', '[\"*\"]', NULL, NULL, '2026-06-25 05:09:17', '2026-06-25 05:09:17'),
(6, 'App\\Models\\User', 1, 'gmdi-app', '8491956fd29c23c7dbdee629a409941739a40d0336ef59747bf22dfd9d1d06d0', '[\"*\"]', NULL, NULL, '2026-06-25 10:25:41', '2026-06-25 10:25:41');

-- --------------------------------------------------------

--
-- Structure de la table `recettes`
--

CREATE TABLE `recettes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(255) NOT NULL,
  `contribuable` varchar(255) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `service_emetteur` varchar(255) DEFAULT NULL,
  `operateur` varchar(255) DEFAULT NULL,
  `numero_transaction` varchar(255) DEFAULT NULL,
  `type_taxe` varchar(255) NOT NULL,
  `montant` decimal(15,2) NOT NULL,
  `date_echeance` date NOT NULL,
  `mode_paiement` enum('especes','virement','mobile_money','cheque') NOT NULL,
  `statut` enum('en_attente','valide','paye','retard') NOT NULL DEFAULT 'en_attente',
  `date_paiement` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `recettes`
--

INSERT INTO `recettes` (`id`, `reference`, `contribuable`, `adresse`, `service_emetteur`, `operateur`, `numero_transaction`, `type_taxe`, `montant`, `date_echeance`, `mode_paiement`, `statut`, `date_paiement`, `created_at`, `updated_at`) VALUES
(1, 'TX-2026-10289', 'Ako Loic', 'Rue G11', 'finances', 'Wave', 'OM-2025-678', 'patente', 75000.00, '2007-09-23', 'virement', 'en_attente', NULL, '2026-06-23 15:03:41', '2026-06-23 15:03:41'),
(2, 'TX-2026-10290', 'SIPIM', 'RUE G13', 'marche', NULL, NULL, 'taxe_stationnement', 75000.00, '2025-06-25', 'especes', 'en_attente', NULL, '2026-06-25 15:08:26', '2026-06-25 15:08:26');

-- --------------------------------------------------------

--
-- Structure de la table `recettes_par_service`
--

CREATE TABLE `recettes_par_service` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `service` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `montant` decimal(15,2) NOT NULL DEFAULT 0.00,
  `pct` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('7y9wopHItyj52gashozTejeM3PllfvQkecrN4GA3', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'eyJfdG9rZW4iOiJOYVg1N3R0dFJ6aHZ5N0FVVjZqNEdLdWVCSVlpMGtVd1FBeGltT1U5IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1782250264),
('aQMjc00sEO32M0xj15wSMndgp4Ec1EVm9qUAETYv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'eyJfdG9rZW4iOiJSdG5KTzFIWVk5VzRzak9qZ2V3ZWtjemdxRXBnbVhLZUxoSWNIRXBYIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1782226893),
('yR3bhnkjjdvwkieQl7aY0eckT3CL5sINvrwUQtJd', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'eyJfdG9rZW4iOiJVR0w4VVBPdlEzRGdWTjhtSUVXREVkRTI4bEMzUGEwMEVicFBuUElNIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1782226894);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin GMDI', 'admin@gmdi.ci', NULL, '$2y$12$RsBUsf/e0Wp81uk2tcfRGeReRGJJzS2dGBQVLrQ2U.IfnzH2isMjC', 'admin', NULL, '2026-06-23 15:00:09', '2026-06-25 05:05:40');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Index pour la table `comptes_gl`
--
ALTER TABLE `comptes_gl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `comptes_gl_compte_unique` (`compte`);

--
-- Index pour la table `depenses`
--
ALTER TABLE `depenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `depenses_reference_unique` (`reference`);

--
-- Index pour la table `ecritures_comptables`
--
ALTER TABLE `ecritures_comptables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ecritures_comptables_numero_unique` (`numero`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `lignes_budget`
--
ALTER TABLE `lignes_budget`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `mouvements_banque`
--
ALTER TABLE `mouvements_banque`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `mouvements_caisse`
--
ALTER TABLE `mouvements_caisse`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Index pour la table `recettes`
--
ALTER TABLE `recettes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `recettes_reference_unique` (`reference`);

--
-- Index pour la table `recettes_par_service`
--
ALTER TABLE `recettes_par_service`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `comptes_gl`
--
ALTER TABLE `comptes_gl`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `depenses`
--
ALTER TABLE `depenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `ecritures_comptables`
--
ALTER TABLE `ecritures_comptables`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `lignes_budget`
--
ALTER TABLE `lignes_budget`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `mouvements_banque`
--
ALTER TABLE `mouvements_banque`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `mouvements_caisse`
--
ALTER TABLE `mouvements_caisse`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `recettes`
--
ALTER TABLE `recettes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `recettes_par_service`
--
ALTER TABLE `recettes_par_service`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
