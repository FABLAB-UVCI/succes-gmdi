-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 26 juin 2026 à 12:50
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
-- Base de données : `gmdi_etat_civil`
--

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `certificats`
--

CREATE TABLE `certificats` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `numero` varchar(255) NOT NULL,
  `type` enum('Naissance','Mariage','Décès','Résidence','Vie','Célibat') NOT NULL DEFAULT 'Naissance',
  `beneficiaire_nom` varchar(255) NOT NULL,
  `beneficiaire_prenom` varchar(255) DEFAULT NULL,
  `acte_reference` varchar(255) DEFAULT NULL,
  `demandeur_nom` varchar(255) DEFAULT NULL,
  `motif` varchar(255) DEFAULT NULL,
  `date_delivrance` date NOT NULL,
  `statut` enum('Délivré','En attente','Annulé') NOT NULL DEFAULT 'Délivré',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `certificats`
--

INSERT INTO `certificats` (`id`, `numero`, `type`, `beneficiaire_nom`, `beneficiaire_prenom`, `acte_reference`, `demandeur_nom`, `motif`, `date_delivrance`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'CI-CC-2026-C-000001', 'Résidence', 'Traoré', 'Paula', NULL, NULL, NULL, '2026-06-16', 'Délivré', '2026-06-16 00:32:18', '2026-06-16 00:32:18');

-- --------------------------------------------------------

--
-- Structure de la table `deces`
--

CREATE TABLE `deces` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `numero` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `date_deces` date NOT NULL,
  `heure_deces` time DEFAULT NULL,
  `lieu_deces` varchar(255) DEFAULT NULL,
  `commune` varchar(255) DEFAULT NULL,
  `cause_deces` varchar(255) DEFAULT NULL,
  `declarant_nom` varchar(255) DEFAULT NULL,
  `declarant_lien` varchar(255) DEFAULT NULL,
  `statut` enum('Validé','En attente','Rejeté') NOT NULL DEFAULT 'Validé',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `deces`
--

INSERT INTO `deces` (`id`, `numero`, `nom`, `prenom`, `date_naissance`, `date_deces`, `heure_deces`, `lieu_deces`, `commune`, `cause_deces`, `declarant_nom`, `declarant_lien`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'CI-CC-2026-D-000001', 'KOUADIO', 'Jean Marc', '1976-04-25', '2009-07-28', '01:01:00', 'CHU Treichville', 'Cocody', 'Insuffisance rénal', 'Tristan', NULL, 'Validé', '2026-06-16 00:27:21', '2026-06-16 00:27:21');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
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
  `attempts` tinyint(3) UNSIGNED NOT NULL,
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
-- Structure de la table `mariages`
--

CREATE TABLE `mariages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `numero` varchar(255) NOT NULL,
  `epoux_nom` varchar(255) NOT NULL,
  `epoux_prenom` varchar(255) NOT NULL,
  `epoux_date_naissance` date DEFAULT NULL,
  `epoux_nationalite` varchar(255) DEFAULT NULL,
  `epoux_profession` varchar(255) DEFAULT NULL,
  `epouse_nom` varchar(255) NOT NULL,
  `epouse_prenom` varchar(255) NOT NULL,
  `epouse_date_naissance` date DEFAULT NULL,
  `epouse_nationalite` varchar(255) DEFAULT NULL,
  `epouse_profession` varchar(255) DEFAULT NULL,
  `date_mariage` date NOT NULL,
  `lieu_mariage` varchar(255) DEFAULT NULL,
  `commune` varchar(255) DEFAULT NULL,
  `regime_matrimonial` enum('Communauté de biens','Séparation de biens','Polygamie') NOT NULL DEFAULT 'Séparation de biens',
  `temoin1_nom` varchar(255) DEFAULT NULL,
  `temoin2_nom` varchar(255) DEFAULT NULL,
  `statut` enum('Validé','En attente','Rejeté') NOT NULL DEFAULT 'Validé',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `mariages`
--

INSERT INTO `mariages` (`id`, `numero`, `epoux_nom`, `epoux_prenom`, `epoux_date_naissance`, `epoux_nationalite`, `epoux_profession`, `epouse_nom`, `epouse_prenom`, `epouse_date_naissance`, `epouse_nationalite`, `epouse_profession`, `date_mariage`, `lieu_mariage`, `commune`, `regime_matrimonial`, `temoin1_nom`, `temoin2_nom`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'CI-CC-2026-M-000001', 'Konan Jean', '', NULL, 'Ivoirienne', 'Professeur', 'Kone Jeanne', '', NULL, 'Ivoirienne', 'Comptable', '1976-02-24', 'Maire de Cocody', NULL, 'Communauté de biens', 'Kone Tristan', 'Christ Tirhaka', 'Validé', '2026-06-16 00:34:11', '2026-06-16 00:34:11');

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
(4, '2025_01_01_000010_create_naissances_table', 1),
(5, '2025_01_01_000011_create_mariages_table', 1),
(6, '2025_01_01_000012_create_deces_table', 1),
(7, '2025_01_01_000013_create_certificats_table', 1),
(8, '2026_06_15_233401_create_personal_access_tokens_table', 2);

-- --------------------------------------------------------

--
-- Structure de la table `naissances`
--

CREATE TABLE `naissances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `numero` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `date_naissance` date NOT NULL,
  `heure_naissance` time DEFAULT NULL,
  `sexe` enum('Masculin','Féminin') DEFAULT NULL,
  `lieu_naissance` varchar(255) DEFAULT NULL,
  `commune` varchar(255) DEFAULT NULL,
  `pere_nom` varchar(255) DEFAULT NULL,
  `pere_profession` varchar(255) DEFAULT NULL,
  `pere_nationalite` varchar(255) DEFAULT NULL,
  `mere_nom` varchar(255) DEFAULT NULL,
  `mere_profession` varchar(255) DEFAULT NULL,
  `mere_nationalite` varchar(255) DEFAULT NULL,
  `type` enum('Déclaration','Jugement','Adoption') NOT NULL DEFAULT 'Déclaration',
  `tribunal` varchar(255) DEFAULT NULL,
  `date_jugement` date DEFAULT NULL,
  `statut` enum('Validé','En attente','Rejeté') NOT NULL DEFAULT 'Validé',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `naissances`
--

INSERT INTO `naissances` (`id`, `numero`, `nom`, `prenom`, `date_naissance`, `heure_naissance`, `sexe`, `lieu_naissance`, `commune`, `pere_nom`, `pere_profession`, `pere_nationalite`, `mere_nom`, `mere_profession`, `mere_nationalite`, `type`, `tribunal`, `date_jugement`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'CI-CC-2026-N-000001', 'Konan', 'Jean Michael', '2001-01-01', '01:01:00', 'Masculin', 'CHU Cocody', 'Cocody', 'KONAN JEAN', 'PROFESSEUR', 'IVOIRIENNE', 'KONAN JEANNE', 'COMPTABLE', 'IVOIRIENNE', 'Déclaration', NULL, NULL, 'Validé', '2026-06-16 00:06:52', '2026-06-16 00:06:52'),
(2, 'CI-CC-2026-N-000002', 'Salut', 'odjfh', '1987-08-24', '15:15:00', 'Masculin', 'CHU Cocody', 'Cocody', 'Hello', 'Comptable', 'Ivoirienne', 'Hola', 'Professeur', 'Ivoirienne', 'Déclaration', NULL, NULL, 'Validé', '2026-06-18 10:12:40', '2026-06-18 10:12:40'),
(3, 'CI-CC-2026-N-000003', 'jgjjk', 'dfhjk', '2009-09-23', '14:14:00', 'Masculin', 'COCODY', 'Cocody', 'KJF', 'JKHJ', 'KLJJ', 'SDDF', 'KLKJ', 'YHJJ', 'Déclaration', NULL, NULL, 'Validé', '2026-06-18 16:28:16', '2026-06-18 16:28:16');

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
(1, 'App\\Models\\User', 1, 'gmdi-token', '1f1730ffa9e34fd46f06d60c5ba9d8942064d553206968b48e455c4ac139ce31', '[\"*\"]', '2026-06-15 23:34:37', NULL, '2026-06-15 23:34:09', '2026-06-15 23:34:37'),
(2, 'App\\Models\\User', 1, 'gmdi-token', '0bc6b62fb44c815de40e9c4b412ca6ead13e77cfea5f03cee949d7e1263d4ae4', '[\"*\"]', '2026-06-16 00:43:20', NULL, '2026-06-16 00:05:24', '2026-06-16 00:43:20'),
(3, 'App\\Models\\User', 1, 'gmdi-token', 'ba2cc8b5a0a329366a5338a244edc85df8cdd401b2dff3408007a6f283c367ac', '[\"*\"]', '2026-06-16 21:26:13', NULL, '2026-06-16 01:05:57', '2026-06-16 21:26:13'),
(4, 'App\\Models\\User', 1, 'gmdi-token', 'dbeef5c4a1c7b78a3569b4167d1a593cd161376e51a7fccbc7a7a4a154c7bc87', '[\"*\"]', NULL, NULL, '2026-06-16 21:53:25', '2026-06-16 21:53:25'),
(5, 'App\\Models\\User', 1, 'gmdi-token', '52cb42ffcf6d968be2117fa11e5e4c1c16512ed3fcded4421b309b499a1669db', '[\"*\"]', NULL, NULL, '2026-06-16 21:54:21', '2026-06-16 21:54:21'),
(6, 'App\\Models\\User', 1, 'gmdi-token', '397b237673a6b294873dda84e06d415000a9e6534ec388c2e77dcd5d60b87160', '[\"*\"]', NULL, NULL, '2026-06-16 22:05:21', '2026-06-16 22:05:21'),
(7, 'App\\Models\\User', 1, 'gmdi-token', 'c29f6854e518e9fbcde451e954d4ca13f746ad9b1b5b0d1f761780e17997e6fe', '[\"*\"]', NULL, NULL, '2026-06-16 22:05:29', '2026-06-16 22:05:29'),
(8, 'App\\Models\\User', 1, 'gmdi-token', '32209d03bcc002464c7fb680b767d75c1f7f27270d2ebe662e81f84601b506bc', '[\"*\"]', NULL, NULL, '2026-06-16 22:05:41', '2026-06-16 22:05:41'),
(9, 'App\\Models\\User', 1, 'gmdi-token', 'dc1b5ab3d5377824c95cac7e1dd021f04ba9f6c5689e4d319c17d9896ca3bdcc', '[\"*\"]', NULL, NULL, '2026-06-16 22:08:39', '2026-06-16 22:08:39'),
(12, 'App\\Models\\User', 1, 'gmdi-token', 'a484e2c47b09463f8c7e44b98eaaaa3c814ab4ca9d115860487f232e6fcf5edb', '[\"*\"]', '2026-06-18 10:09:16', NULL, '2026-06-18 10:09:15', '2026-06-18 10:09:16'),
(15, 'App\\Models\\User', 1, 'gmdi-token', '86d9f5ff6622857a51f8dc27ebc771da66243d15b18af14774d7203f8845fc6f', '[\"*\"]', '2026-06-23 15:26:07', NULL, '2026-06-23 15:26:06', '2026-06-23 15:26:07'),
(16, 'App\\Models\\User', 1, 'gmdi-token', '100887d236de4d0a5aa31412cfce423e817bdf5cb8153e28af769d171914d55b', '[\"*\"]', NULL, NULL, '2026-06-25 05:05:21', '2026-06-25 05:05:21'),
(17, 'App\\Models\\User', 1, 'gmdi-token', '0cf411678cf993eaa2e84ca2757439c15a4d6a3399eaec0fb8d1c502871221ca', '[\"*\"]', NULL, NULL, '2026-06-25 05:08:00', '2026-06-25 05:08:00'),
(18, 'App\\Models\\User', 1, 'gmdi-token', 'e4bda4efba87d8af448b8a87ceb10644723c777bb70cc9b38c41006b15ec7722', '[\"*\"]', NULL, NULL, '2026-06-25 05:09:22', '2026-06-25 05:09:22'),
(19, 'App\\Models\\User', 1, 'gmdi-token', 'f6a68bd540700f5dd88f671387aba99cc4722ea00d6c1d4b389382464b3b62f5', '[\"*\"]', NULL, NULL, '2026-06-25 10:25:45', '2026-06-25 10:25:45');

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
('C20LljGHT4lIozXxwLHpxJL1Ud7ElPF9jNeKN35k', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMmVXS1ZvRVRidDEzdlF1MVp6R0VoUEkwMWJMRHdwRUFsUkcxQVR2RSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1782228257),
('jn0X03GQNVS4UU5RGVubUxroRzAB462Xe9EeoDDX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.124.2 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV1lJYm9lYTNHalkxdXRpa01kejA0VGdwNERGMFNFWHBhMW0yQXM3ZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781777307),
('ooB75Z6XjFIMyY2bM1wsIEWFABBKWDbqIFw2jFMq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.0 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWG1LWEVYcHJFQmVEWG1wNnJNZWNOVEZlbmt4c1pocWdDNnU0bEFhbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781804062),
('tYV1WbH5pa1QzephCcKUJxMChYBxjOBy6yq5PD1x', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.0 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZjlZSHp4MVNLc0RPaG1jZmxOTFhadnV5MGtWNHUxQWJDemlKVDllVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781871378);

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
  `role` varchar(255) NOT NULL DEFAULT 'agent',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Administrateur GMDI', 'admin@gmdi.ci', NULL, '$2y$12$1X69xwiOd4e8nVJakYr//eoien9OGhAH3G/JPWMmeNwFRJSV7k7UC', 'admin', NULL, '2026-06-15 23:28:09', '2026-06-15 23:28:09'),
(2, 'Agent État Civil', 'agent@gmdi.ci', NULL, '$2y$12$F38KxVnfL1T/ioyMKSSIl.GJ89RRmcLIkRNhalXHWjPt09I55W2zy', 'agent', NULL, '2026-06-15 23:28:09', '2026-06-15 23:28:09');

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
-- Index pour la table `certificats`
--
ALTER TABLE `certificats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `certificats_numero_unique` (`numero`);

--
-- Index pour la table `deces`
--
ALTER TABLE `deces`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `deces_numero_unique` (`numero`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

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
-- Index pour la table `mariages`
--
ALTER TABLE `mariages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mariages_numero_unique` (`numero`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `naissances`
--
ALTER TABLE `naissances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `naissances_numero_unique` (`numero`);

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
-- AUTO_INCREMENT pour la table `certificats`
--
ALTER TABLE `certificats`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `deces`
--
ALTER TABLE `deces`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- AUTO_INCREMENT pour la table `mariages`
--
ALTER TABLE `mariages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `naissances`
--
ALTER TABLE `naissances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
