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
-- Base de données : `gmdi_patrimoine`
--

-- --------------------------------------------------------

--
-- Structure de la table `amortissements`
--

CREATE TABLE `amortissements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bien` varchar(200) NOT NULL,
  `valeur_acquisition` decimal(15,2) NOT NULL DEFAULT 0.00,
  `taux_annuel` int(11) NOT NULL DEFAULT 0,
  `annee_debut` int(11) NOT NULL,
  `amortissement_cumule` decimal(15,2) NOT NULL DEFAULT 0.00,
  `valeur_nette_comptable` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `amortissements`
--

INSERT INTO `amortissements` (`id`, `bien`, `valeur_acquisition`, `taux_annuel`, `annee_debut`, `amortissement_cumule`, `valeur_nette_comptable`, `created_at`, `updated_at`) VALUES
(1, 'Toyota Land Cruiser 200', 45000000.00, 20, 2020, 27000000.00, 18000000.00, '2026-06-18 13:51:07', '2026-06-18 13:51:07'),
(2, 'Groupe électrogène 250 KVA', 18000000.00, 10, 2019, 10800000.00, 7200000.00, '2026-06-18 13:51:07', '2026-06-18 13:51:07'),
(3, 'Parc informatique Conseil', 8500000.00, 33, 2022, 8500000.00, 0.00, '2026-06-18 13:51:07', '2026-06-18 13:51:07'),
(4, 'Mobilier bureau DG', 3200000.00, 20, 2020, 1600000.00, 1600000.00, '2026-06-18 13:51:07', '2026-06-18 13:51:07'),
(5, 'Hôtel de Ville', 850000000.00, 2, 1995, 34000000.00, 816000000.00, '2026-06-18 13:51:07', '2026-06-18 13:51:07'),
(6, 'Marché Municipal Central', 420000000.00, 2, 1988, 75000000.00, 345000000.00, '2026-06-18 13:51:07', '2026-06-18 13:51:07');

-- --------------------------------------------------------

--
-- Structure de la table `biens`
--

CREATE TABLE `biens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(30) NOT NULL,
  `designation` varchar(200) NOT NULL,
  `categorie` varchar(50) NOT NULL,
  `localisation` varchar(200) NOT NULL,
  `superficie` decimal(15,2) DEFAULT NULL,
  `valeur_acquisition` decimal(15,2) NOT NULL DEFAULT 0.00,
  `valeur_actuelle` decimal(15,2) NOT NULL DEFAULT 0.00,
  `date_acquisition` date NOT NULL,
  `affectation` varchar(200) DEFAULT NULL,
  `statut` varchar(30) NOT NULL DEFAULT 'disponible',
  `taux_amortissement` int(11) NOT NULL DEFAULT 0,
  `qr_code` varchar(80) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `biens`
--

INSERT INTO `biens` (`id`, `reference`, `designation`, `categorie`, `localisation`, `superficie`, `valeur_acquisition`, `valeur_actuelle`, `date_acquisition`, `affectation`, `statut`, `taux_amortissement`, `qr_code`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'PAT-IMM-001', 'Hôtel de Ville', 'immobilier', 'Avenue Principale', 1200.00, 850000000.00, 920000000.00, '1995-01-01', 'Administration communale', 'occupe', 2, 'QR-PAT-IMM-001', '2026-06-18 13:51:07', '2026-06-18 13:51:07', NULL),
(2, 'PAT-VEH-001', 'Toyota Land Cruiser 200', 'vehicule', 'Garage communal', NULL, 45000000.00, 32000000.00, '2020-07-15', 'Cabinet du Maire', 'occupe', 20, 'QR-PAT-VEH-001', '2026-06-18 13:51:07', '2026-06-18 13:51:07', NULL),
(3, 'PAT-EQP-001', 'Groupe électrogène 250 KVA', 'equipement', 'HdV — local technique', NULL, 18000000.00, 12000000.00, '2019-03-20', 'Alimentation secours HdV', 'en_maintenance', 10, 'QR-PAT-EQP-001', '2026-06-18 13:51:07', '2026-06-18 13:51:07', NULL),
(4, 'PAT-TER-001', 'Terrain futur complexe sportif', 'terrain', 'Quartier Nord-Est', 8000.00, 320000000.00, 450000000.00, '2002-05-10', 'Projet complexe sportif', 'disponible', 0, 'QR-PAT-TER-001', '2026-06-18 13:51:07', '2026-06-18 13:51:07', NULL),
(5, 'PAT-IMM-002', 'Marché Municipal Central', 'immobilier', 'Quartier Centre-Ville', 3500.00, 420000000.00, 510000000.00, '1988-01-01', 'Activités commerciales', 'loue', 2, 'QR-PAT-IMM-002', '2026-06-18 13:51:07', '2026-06-18 13:51:07', NULL),
(6, 'PAT-INF-001', 'Parc informatique Salle Conseil', 'informatique', 'HdV — Salle du Conseil', NULL, 8500000.00, 5000000.00, '2022-01-10', 'Salle du Conseil Municipal', 'occupe', 33, 'QR-PAT-INF-001', '2026-06-18 13:51:07', '2026-06-18 13:51:07', NULL),
(7, 'PAT-MOB-001', 'Mobilier bureau direction générale', 'mobilier', 'HdV — Direction Générale', NULL, 3200000.00, 2000000.00, '2020-03-01', 'Direction Générale', 'occupe', 20, 'QR-PAT-MOB-001', '2026-06-18 13:51:07', '2026-06-18 13:51:07', NULL),
(8, 'PAT-TER-002', 'Terrain — Yopougon', 'terrain', 'Yopougon', 8000.00, 546789.00, 546789.00, '1976-08-24', 'Réserve foncière', 'disponible', 0, 'QR-PAT-TER-002', '2026-06-18 13:53:27', '2026-06-18 13:53:27', NULL);

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
-- Structure de la table `entretiens`
--

CREATE TABLE `entretiens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bien` varchar(200) NOT NULL,
  `type_entretien` varchar(150) NOT NULL,
  `date_prevue` date NOT NULL,
  `date_realise` date DEFAULT NULL,
  `periodicite` varchar(30) DEFAULT NULL,
  `cout_estime` decimal(15,2) DEFAULT NULL,
  `statut` varchar(30) NOT NULL DEFAULT 'programme',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `entretiens`
--

INSERT INTO `entretiens` (`id`, `bien`, `type_entretien`, `date_prevue`, `date_realise`, `periodicite`, `cout_estime`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Toyota Land Cruiser 200', 'Vidange + révision', '2025-06-15', NULL, 'Trimestrielle', 180000.00, 'programme', '2026-06-18 13:51:07', '2026-06-18 13:51:07'),
(2, 'Groupe électrogène 250 KVA', 'Inspection générale', '2025-05-27', NULL, 'Mensuelle', 95000.00, 'urgent', '2026-06-18 13:51:07', '2026-06-18 13:51:07'),
(3, 'Camion benne N°1', 'Contrôle technique', '2025-06-01', NULL, 'Semestrielle', 250000.00, 'programme', '2026-06-18 13:51:07', '2026-06-18 13:51:07');

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
(4, '2026_06_15_134438_create_personal_access_tokens_table', 1),
(5, '2026_06_15_141125_create_permission_tables', 1),
(6, '2026_06_18_100000_create_patrimoine_tables', 1);

-- --------------------------------------------------------

--
-- Structure de la table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(2, 'App\\Models\\User', 2),
(3, 'App\\Models\\User', 3);

-- --------------------------------------------------------

--
-- Structure de la table `mouvements_affectations`
--

CREATE TABLE `mouvements_affectations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `reference` varchar(30) NOT NULL,
  `bien` varchar(200) NOT NULL,
  `origine` varchar(200) DEFAULT NULL,
  `destination` varchar(200) NOT NULL,
  `responsable` varchar(200) DEFAULT NULL,
  `motif` varchar(255) DEFAULT NULL,
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
-- Structure de la table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'biens.view', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(2, 'biens.create', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(3, 'biens.update', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(4, 'biens.delete', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(5, 'vehicules.view', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(6, 'vehicules.create', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(7, 'vehicules.update', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(8, 'terrains.view', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(9, 'terrains.create', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(10, 'terrains.update', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(11, 'mobilier.view', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(12, 'mobilier.create', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(13, 'informatique.view', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(14, 'informatique.create', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(15, 'equipements.view', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(16, 'equipements.create', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(17, 'affectations.view', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(18, 'affectations.create', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(19, 'entretiens.view', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(20, 'entretiens.create', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(21, 'entretiens.validate', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(22, 'reparations.view', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(23, 'reparations.create', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(24, 'reparations.resolve', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(25, 'amortissements.view', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(26, 'stats.view', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(27, 'stats.export', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06');

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

-- --------------------------------------------------------

--
-- Structure de la table `reparations`
--

CREATE TABLE `reparations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bien` varchar(200) NOT NULL,
  `description` varchar(500) NOT NULL,
  `priorite` varchar(20) NOT NULL DEFAULT 'normale',
  `prestataire` varchar(200) DEFAULT NULL,
  `cout_estime` decimal(15,2) DEFAULT NULL,
  `cout_reel` decimal(15,2) DEFAULT NULL,
  `statut` varchar(30) NOT NULL DEFAULT 'en_cours',
  `date_declaration` date DEFAULT NULL,
  `date_resolue` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reparations`
--

INSERT INTO `reparations` (`id`, `bien`, `description`, `priorite`, `prestataire`, `cout_estime`, `cout_reel`, `statut`, `date_declaration`, `date_resolue`, `created_at`, `updated_at`) VALUES
(1, 'Groupe électrogène 250 KVA', 'Panne démarreur', 'urgente', 'DIABATÉ Moussa', 95000.00, NULL, 'en_cours', NULL, NULL, '2026-06-18 13:51:07', '2026-06-18 13:51:07'),
(2, 'Camion benne N°2', 'Fuite hydraulique circuit freinage', 'haute', 'KOFFI Marcel', 120000.00, NULL, 'en_cours', NULL, NULL, '2026-06-18 13:51:07', '2026-06-18 13:51:07');

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'chef_patrimoine', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(2, 'agent_patrimoine', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(3, 'admin', 'sanctum', '2026-06-18 13:51:06', '2026-06-18 13:51:06');

-- --------------------------------------------------------

--
-- Structure de la table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(2, 3),
(3, 1),
(3, 2),
(3, 3),
(4, 1),
(4, 3),
(5, 1),
(5, 2),
(5, 3),
(6, 1),
(6, 2),
(6, 3),
(7, 1),
(7, 2),
(7, 3),
(8, 1),
(8, 2),
(8, 3),
(9, 1),
(9, 2),
(9, 3),
(10, 1),
(10, 2),
(10, 3),
(11, 1),
(11, 2),
(11, 3),
(12, 1),
(12, 2),
(12, 3),
(13, 1),
(13, 2),
(13, 3),
(14, 1),
(14, 2),
(14, 3),
(15, 1),
(15, 2),
(15, 3),
(16, 1),
(16, 2),
(16, 3),
(17, 1),
(17, 2),
(17, 3),
(18, 1),
(18, 2),
(18, 3),
(19, 1),
(19, 2),
(19, 3),
(20, 1),
(20, 2),
(20, 3),
(21, 1),
(21, 2),
(21, 3),
(22, 1),
(22, 2),
(22, 3),
(23, 1),
(23, 2),
(23, 3),
(24, 1),
(24, 2),
(24, 3),
(25, 1),
(25, 2),
(25, 3),
(26, 1),
(26, 2),
(26, 3),
(27, 1),
(27, 3);

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
('DEvos27hWNw9tv3KGbqakC9NWSFH35wG3ZQuaa2j', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.124.2 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRDJPaW84eE5HZDdqWnRJVFRkNGllbnN3RU9aNWl4NTFwUm40ZWd0aCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781790712);

-- --------------------------------------------------------

--
-- Structure de la table `terrains`
--

CREATE TABLE `terrains` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `localisation` varchar(200) NOT NULL,
  `superficie` decimal(15,2) DEFAULT NULL,
  `valeur` decimal(15,2) DEFAULT NULL,
  `usage` varchar(100) DEFAULT NULL,
  `titre_foncier` varchar(50) DEFAULT NULL,
  `date_acquisition` date DEFAULT NULL,
  `statut` varchar(30) NOT NULL DEFAULT 'Reserve',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `terrains`
--

INSERT INTO `terrains` (`id`, `localisation`, `superficie`, `valeur`, `usage`, `titre_foncier`, `date_acquisition`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Quartier Nord-Est', 8000.00, 450000000.00, 'Projet complexe sportif', 'TF-2002-045', NULL, 'Reserve', '2026-06-18 13:51:07', '2026-06-18 13:51:07'),
(2, 'Zone industrielle Port-Bouët', 12000.00, 380000000.00, 'Projet infrastructure', 'TF-1998-012', NULL, 'Reserve', '2026-06-18 13:51:07', '2026-06-18 13:51:07'),
(3, 'Av. Principale — parking mairie', 2500.00, 150000000.00, 'Voirie / stationnement', 'TF-2005-088', NULL, 'Occupé', '2026-06-18 13:51:07', '2026-06-18 13:51:07'),
(4, 'Yopougon', 8000.00, 546789.00, 'Réserve foncière', 'TF-2002-045', '1976-08-24', 'Reserve', '2026-06-18 13:53:27', '2026-06-18 13:53:27');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(30) NOT NULL DEFAULT 'gestionnaire',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `role`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'N\'GUESSAN Kouamé', 'patrimoine@mairie.ci', 'chef_patrimoine', NULL, '$2y$12$KP7QGbQ40MDrP1nVUSMGiuK4egjdCH0BKbf4iRXrBbMFWR0dK.kpO', NULL, '2026-06-18 13:51:06', '2026-06-18 13:51:06'),
(2, 'KONÉ Adama', 'agent.pat@mairie.ci', 'agent_patrimoine', NULL, '$2y$12$ZwKM32EzxOIevUFt1cjvmOT2ITHq7vdFgdq7uvcNf7t.s2qhQIRqW', NULL, '2026-06-18 13:51:07', '2026-06-18 13:51:07'),
(3, 'Admin GMDI', 'admin@mairie.ci', 'admin', NULL, '$2y$12$alr6mJiHDLzjh5QTJJMEJeeIvLwoaY5Y5YoEnY3IWnTXxiAyDmu6W', NULL, '2026-06-18 13:51:07', '2026-06-18 13:51:07');

-- --------------------------------------------------------

--
-- Structure de la table `vehicules`
--

CREATE TABLE `vehicules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `modele` varchar(200) NOT NULL,
  `immatriculation` varchar(30) NOT NULL,
  `kilometrage` int(11) DEFAULT 0,
  `affectation` varchar(200) DEFAULT NULL,
  `valeur` decimal(15,2) DEFAULT NULL,
  `fin_assurance` date DEFAULT NULL,
  `fin_visite_technique` date DEFAULT NULL,
  `statut` varchar(30) NOT NULL DEFAULT 'occupe',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `amortissements`
--
ALTER TABLE `amortissements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `amortissements_bien_index` (`bien`);

--
-- Index pour la table `biens`
--
ALTER TABLE `biens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `biens_reference_unique` (`reference`);

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
-- Index pour la table `entretiens`
--
ALTER TABLE `entretiens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entretiens_bien_index` (`bien`);

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
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Index pour la table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Index pour la table `mouvements_affectations`
--
ALTER TABLE `mouvements_affectations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mouvements_affectations_reference_index` (`reference`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Index pour la table `reparations`
--
ALTER TABLE `reparations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reparations_bien_index` (`bien`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Index pour la table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `terrains`
--
ALTER TABLE `terrains`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Index pour la table `vehicules`
--
ALTER TABLE `vehicules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vehicules_immatriculation_unique` (`immatriculation`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `amortissements`
--
ALTER TABLE `amortissements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `biens`
--
ALTER TABLE `biens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `entretiens`
--
ALTER TABLE `entretiens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `mouvements_affectations`
--
ALTER TABLE `mouvements_affectations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `reparations`
--
ALTER TABLE `reparations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `terrains`
--
ALTER TABLE `terrains`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `vehicules`
--
ALTER TABLE `vehicules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
