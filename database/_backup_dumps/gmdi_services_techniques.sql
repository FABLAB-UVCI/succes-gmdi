-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 26 juin 2026 à 12:52
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
-- Base de données : `gmdi_services_techniques`
--

-- --------------------------------------------------------

--
-- Structure de la table `batiment_communals`
--

CREATE TABLE `batiment_communals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(200) NOT NULL,
  `type` enum('mairie','ecole','centre_social','marche','autre') NOT NULL,
  `adresse` varchar(250) NOT NULL,
  `superficie` double NOT NULL,
  `annee_construction` smallint(5) UNSIGNED DEFAULT NULL,
  `etat` enum('bon','moyen','degrade') NOT NULL DEFAULT 'bon',
  `responsable` varchar(200) DEFAULT NULL,
  `date_derniere_inspection` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `batiment_communals`
--

INSERT INTO `batiment_communals` (`id`, `nom`, `type`, `adresse`, `superficie`, `annee_construction`, `etat`, `responsable`, `date_derniere_inspection`, `created_at`, `updated_at`) VALUES
(1, 'Hôtel de Ville', 'mairie', 'Avenue Principale — Centre', 1200, 1995, 'bon', 'N\'GORAN Koffi', NULL, '2026-06-16 09:33:35', '2026-06-16 09:33:35'),
(2, 'Annexe Mairie Yopougon', 'mairie', 'Quartier Selmer, Yopougon', 450, 2008, 'moyen', 'KONE Adama', NULL, '2026-06-16 09:33:35', '2026-06-16 09:33:35'),
(3, 'École Primaire Cocody 12', 'ecole', 'Rue des Palmiers, Cocody', 800, 1985, 'moyen', NULL, NULL, '2026-06-16 09:33:35', '2026-06-16 09:33:35'),
(4, 'École Primaire Abobo Centre', 'ecole', 'Av. Félix Houphouët, Abobo', 650, 1978, 'degrade', NULL, NULL, '2026-06-16 09:33:35', '2026-06-16 09:33:35'),
(5, 'Centre Social Adjamé', 'centre_social', 'Quartier Saint-Michel, Adjamé', 350, 2001, 'bon', NULL, NULL, '2026-06-16 09:33:35', '2026-06-16 09:33:35'),
(6, 'Marché Municipal Central', 'marche', 'Quartier Centre-Ville', 3500, 1988, 'moyen', 'YAPI Marcel', NULL, '2026-06-16 09:33:35', '2026-06-16 09:33:35'),
(7, 'Marché de Treichville', 'marche', 'Avenue 13, Treichville', 2100, 1975, 'degrade', NULL, NULL, '2026-06-16 09:33:35', '2026-06-16 09:33:35');

-- --------------------------------------------------------

--
-- Structure de la table `bon_travails`
--

CREATE TABLE `bon_travails` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(25) NOT NULL,
  `demande_ref` varchar(25) DEFAULT NULL,
  `description` varchar(500) NOT NULL,
  `service` varchar(100) NOT NULL,
  `equipe` varchar(200) NOT NULL,
  `chef` varchar(200) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `materiaux` varchar(400) DEFAULT NULL,
  `statut` enum('planifie','en_cours','termine','suspendu') NOT NULL DEFAULT 'planifie',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `bon_travails`
--

INSERT INTO `bon_travails` (`id`, `reference`, `demande_ref`, `description`, `service`, `equipe`, `chef`, `date_debut`, `date_fin`, `materiaux`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'BT-2025-000003', 'DI-2025-000024', 'Rebouchage nid de poule carrefour Marché', 'Voirie', 'Brigade Voirie Nord', 'N\'GORAN Koffi', '2025-05-21', NULL, 'Bitume 300kg, Sable fin 2m³', 'en_cours', '2026-06-16 09:34:00', '2026-06-16 09:34:00'),
(2, 'BT-2025-000004', 'DI-2025-000023', 'Remplacement câbles et lampes ECL-002', 'Éclairage public', 'Brigade Éclairage', 'DIABY Sékou', '2025-05-22', NULL, 'Câble électrique 50m, LED 250W x3', 'en_cours', '2026-06-16 09:34:00', '2026-06-16 09:34:00');

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
-- Structure de la table `caniveaux`
--

CREATE TABLE `caniveaux` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `localisation` varchar(200) NOT NULL,
  `quartier` varchar(150) NOT NULL,
  `longueur` double NOT NULL,
  `etat` enum('bon','colmate','degrade') NOT NULL DEFAULT 'bon',
  `date_dernier_nettoyage` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `caniveaux`
--

INSERT INTO `caniveaux` (`id`, `localisation`, `quartier`, `longueur`, `etat`, `date_dernier_nettoyage`, `created_at`, `updated_at`) VALUES
(1, 'Av. de la Paix côté gauche', 'Centre', 1400, 'bon', '2025-04-10', '2026-06-16 09:33:35', '2026-06-16 09:33:35'),
(2, 'Rue du Marché — section Treichville', 'Treichville', 400, 'colmate', NULL, '2026-06-16 09:33:35', '2026-06-16 09:33:35'),
(3, 'Lotissement 15 côté Nord', 'Yopougon', 650, 'degrade', NULL, '2026-06-16 09:33:35', '2026-06-16 09:33:35'),
(4, 'Bd Indépendance km 3', 'Adjamé', 900, 'bon', '2025-03-20', '2026-06-16 09:33:35', '2026-06-16 09:33:35');

-- --------------------------------------------------------

--
-- Structure de la table `collecte_dechets`
--

CREATE TABLE `collecte_dechets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `zone` varchar(200) NOT NULL,
  `frequence` varchar(50) NOT NULL DEFAULT 'Hebdomadaire',
  `prochaine_collecte` date NOT NULL,
  `tonnage` double DEFAULT NULL,
  `statut` enum('planifie','effectue','manque') NOT NULL DEFAULT 'planifie',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `demande_interventions`
--

CREATE TABLE `demande_interventions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(25) NOT NULL,
  `type_service` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `localisation` varchar(250) NOT NULL,
  `demandeur` varchar(200) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `date_depot` date NOT NULL,
  `priorite` enum('normale','haute','urgente') NOT NULL DEFAULT 'normale',
  `statut` enum('ouverte','assignee','en_cours','terminee','cloturee') NOT NULL DEFAULT 'ouverte',
  `assigne_a` varchar(200) DEFAULT NULL,
  `date_assignation` date DEFAULT NULL,
  `date_resolution` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `demande_interventions`
--

INSERT INTO `demande_interventions` (`id`, `reference`, `type_service`, `description`, `localisation`, `demandeur`, `telephone`, `date_depot`, `priorite`, `statut`, `assigne_a`, `date_assignation`, `date_resolution`, `created_at`, `updated_at`) VALUES
(1, 'DI-2025-000024', 'voirie', 'Nid de poule dangereux à hauteur du carrefour principal', 'Rue du Marché — Carrefour Central', 'KOUA Amédée', '07 11 22 33', '2025-05-20', 'urgente', 'cloturee', 'N\'GORAN Koffi', NULL, '2026-06-16', '2026-06-16 09:33:35', '2026-06-16 14:25:12'),
(2, 'DI-2025-000023', 'eclairage', 'Éclairage public absent depuis une semaine sur 300m', 'Rue du Commerce — section Est', 'Association Riverains Plateau', NULL, '2025-05-18', 'haute', 'cloturee', NULL, NULL, '2026-06-25', '2026-06-16 09:33:35', '2026-06-25 23:41:45'),
(3, 'DI-2025-000022', 'eau', 'Caniveau colmaté causing inondations récurrentes', 'Lotissement 15 — entrée', 'BAMBA Salif', NULL, '2025-05-15', 'haute', 'assignee', 'KOUAMÉ Jean', '2026-06-25', NULL, '2026-06-16 09:33:35', '2026-06-25 23:41:41'),
(4, 'DI-2025-000021', 'batiment', 'Toiture école endommagée — infiltrations d\'eau', 'École Primaire Abobo Centre', 'Directeur Établissement', NULL, '2025-05-10', 'urgente', 'cloturee', NULL, NULL, '2025-05-22', '2026-06-16 09:34:00', '2026-06-16 09:34:00'),
(5, 'DI-2026-000005', 'eclairage', 'Problème de lumière synakass-ci 2', 'Rue G11', 'Kacou Jean', '0707080945', '2026-06-16', 'haute', 'cloturee', 'KOUAMÉ Jean', '2026-06-18', '2026-06-18', '2026-06-16 14:16:07', '2026-06-18 11:21:46');

-- --------------------------------------------------------

--
-- Structure de la table `entretien_voiries`
--

CREATE TABLE `entretien_voiries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `route` varchar(200) NOT NULL,
  `type_entretien` varchar(150) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `equipe` varchar(200) NOT NULL,
  `cout_estime` decimal(12,2) NOT NULL DEFAULT 0.00,
  `cout_reel` decimal(12,2) DEFAULT NULL,
  `statut` enum('planifie','en_cours','termine','suspendu') NOT NULL DEFAULT 'planifie',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `equipes`
--

CREATE TABLE `equipes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(200) NOT NULL,
  `chef` varchar(200) NOT NULL,
  `membres` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `bon_en_cours` varchar(25) DEFAULT NULL,
  `localisation` varchar(200) DEFAULT NULL,
  `statut` enum('disponible','en_intervention','repos') NOT NULL DEFAULT 'disponible',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `equipes`
--

INSERT INTO `equipes` (`id`, `nom`, `chef`, `membres`, `bon_en_cours`, `localisation`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Brigade Voirie Nord', 'N\'GORAN Koffi', 6, 'BT-2025-000003', 'Rue du Marché', 'en_intervention', '2026-06-16 09:34:00', '2026-06-16 09:34:00'),
(2, 'Brigade Éclairage', 'DIABY Sékou', 4, 'BT-2025-000004', 'Carrefour Yopougon', 'en_intervention', '2026-06-16 09:34:00', '2026-06-16 09:34:00'),
(3, 'Brigade Assainissement', 'DOSSO Abdoulaye', 5, NULL, NULL, 'disponible', '2026-06-16 09:34:00', '2026-06-16 09:34:00'),
(4, 'Brigade Bâtiments', 'KOUASSI Jean', 7, NULL, NULL, 'repos', '2026-06-16 09:34:00', '2026-06-16 09:34:00');

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
-- Structure de la table `intervention_drainages`
--

CREATE TABLE `intervention_drainages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `localisation` varchar(200) NOT NULL,
  `type` enum('curage','debouchage','reparation','construction') NOT NULL,
  `date_intervention` date NOT NULL,
  `equipe` varchar(200) NOT NULL,
  `statut` enum('planifie','en_cours','termine','suspendu') NOT NULL DEFAULT 'planifie',
  `observations` varchar(400) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
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
-- Structure de la table `lampadaires`
--

CREATE TABLE `lampadaires` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(20) NOT NULL,
  `localisation` varchar(200) NOT NULL,
  `quartier` varchar(150) NOT NULL,
  `type_lampe` varchar(100) NOT NULL,
  `puissance` smallint(5) UNSIGNED DEFAULT NULL,
  `statut` enum('fonctionnel','en_panne','en_maintenance') NOT NULL DEFAULT 'fonctionnel',
  `date_posee` date DEFAULT NULL,
  `date_dernier_controle` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `lampadaires`
--

INSERT INTO `lampadaires` (`id`, `reference`, `localisation`, `quartier`, `type_lampe`, `puissance`, `statut`, `date_posee`, `date_dernier_controle`, `created_at`, `updated_at`) VALUES
(1, 'ECL-001', 'Av. de la Paix — Carrefour Mairie', 'Centre', 'LED', 150, 'fonctionnel', '2022-06-01', NULL, '2026-06-16 09:32:48', '2026-06-16 09:32:48'),
(2, 'ECL-002', 'Rue du Commerce N°45', 'Plateau', 'Sodium', 250, 'en_panne', '2019-03-15', NULL, '2026-06-16 09:32:48', '2026-06-16 09:32:48'),
(3, 'ECL-003', 'Bd Indépendance — Point km 2', 'Adjamé', 'LED', 150, 'fonctionnel', '2023-01-10', NULL, '2026-06-16 09:32:48', '2026-06-16 09:32:48'),
(4, 'ECL-004', 'Marché Central — Entrée Nord', 'Treichville', 'LED', 200, 'fonctionnel', '2023-08-20', NULL, '2026-06-16 09:32:48', '2026-06-16 09:32:48'),
(5, 'ECL-005', 'Carrefour Yopougon Selmer', 'Yopougon', 'Sodium', 250, 'en_maintenance', NULL, NULL, '2026-06-16 09:32:48', '2026-06-16 09:32:48');

-- --------------------------------------------------------

--
-- Structure de la table `maintenance_correctives`
--

CREATE TABLE `maintenance_correctives` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `equipement` varchar(200) NOT NULL,
  `service` varchar(100) NOT NULL,
  `panne` varchar(400) NOT NULL,
  `priorite` enum('normale','haute','urgente') NOT NULL DEFAULT 'normale',
  `technicien` varchar(200) DEFAULT NULL,
  `date_signalement` date NOT NULL,
  `date_resolution` date DEFAULT NULL,
  `cout_reel` decimal(12,2) DEFAULT NULL,
  `statut` enum('signale','en_cours','resolu') NOT NULL DEFAULT 'signale',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `maintenance_correctives`
--

INSERT INTO `maintenance_correctives` (`id`, `equipement`, `service`, `panne`, `priorite`, `technicien`, `date_signalement`, `date_resolution`, `cout_reel`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Camion benne OM-347', 'Voirie', 'Fuite hydraulique circuit freinage — camion immobilisé', 'urgente', NULL, '2025-05-10', NULL, NULL, 'en_cours', '2026-06-16 09:34:00', '2026-06-16 09:34:00'),
(2, 'Groupe électrogène HdV', 'Bâtiments', 'Panne démarreur — groupe ne démarre plus', 'haute', 'KOUASSI Jean', '2025-05-08', '2025-05-12', 85000.00, 'resolu', '2026-06-16 09:34:00', '2026-06-16 09:34:00');

-- --------------------------------------------------------

--
-- Structure de la table `maintenance_eclairages`
--

CREATE TABLE `maintenance_eclairages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `zone` varchar(200) NOT NULL,
  `nb_lampadaires` smallint(5) UNSIGNED NOT NULL,
  `type_intervention` varchar(150) NOT NULL,
  `date_prevue` date NOT NULL,
  `technicien` varchar(200) NOT NULL,
  `statut` enum('programme','en_cours','effectue','en_retard') NOT NULL DEFAULT 'programme',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
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
(4, '2026_01_01_000001_add_role_to_users_table', 1),
(5, '2026_01_01_000002_create_routes_voirie_table', 1),
(6, '2026_01_01_000003_create_entretien_voiries_table', 1),
(7, '2026_01_01_000004_create_reparation_voiries_table', 1),
(8, '2026_01_01_000005_create_lampadaires_table', 1),
(9, '2026_01_01_000006_create_panne_eclairages_table', 1),
(10, '2026_01_01_000007_create_maintenance_eclairages_table', 1),
(11, '2026_01_01_000008_create_caniveaux_table', 1),
(12, '2026_01_01_000009_create_intervention_drainages_table', 1),
(13, '2026_01_01_000010_create_collecte_dechets_table', 1),
(14, '2026_01_01_000011_create_batiment_communals_table', 1),
(15, '2026_01_01_000012_create_travaux_batiments_table', 1),
(16, '2026_01_01_000013_create_demande_interventions_table', 1),
(17, '2026_01_01_000014_create_bon_travails_table', 1),
(18, '2026_01_01_000015_create_equipes_table', 1),
(19, '2026_01_01_000016_create_planning_maintenances_table', 1),
(20, '2026_01_01_000017_create_maintenance_correctives_table', 1),
(21, '2026_06_16_092647_create_permission_tables', 1),
(22, '2026_06_16_092648_create_personal_access_tokens_table', 1);

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
(3, 'App\\Models\\User', 3),
(4, 'App\\Models\\User', 4);

-- --------------------------------------------------------

--
-- Structure de la table `panne_eclairages`
--

CREATE TABLE `panne_eclairages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(25) NOT NULL,
  `localisation` varchar(200) NOT NULL,
  `description` varchar(300) NOT NULL,
  `date_signalement` date NOT NULL,
  `technicien` varchar(200) DEFAULT NULL,
  `date_resolution` date DEFAULT NULL,
  `statut` enum('signalee','en_intervention','resolue') NOT NULL DEFAULT 'signalee',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `panne_eclairages`
--

INSERT INTO `panne_eclairages` (`id`, `reference`, `localisation`, `description`, `date_signalement`, `technicien`, `date_resolution`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'PAN-2025-0012', 'Rue du Commerce N°45', 'Lampadaire éteint depuis 3 jours — câble arraché', '2025-05-18', NULL, NULL, 'signalee', '2026-06-16 09:32:48', '2026-06-16 09:32:48'),
(2, 'PAN-2025-0011', 'Carrefour Yopougon Selmer', 'Clignotement intermittent — ballast défectueux', '2025-05-15', 'DIABY Sékou', NULL, 'en_intervention', '2026-06-16 09:32:48', '2026-06-16 09:32:48');

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
(1, 'voirie.read', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(2, 'voirie.write', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(3, 'eclairage.read', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(4, 'eclairage.write', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(5, 'eau.read', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(6, 'eau.write', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(7, 'batiments.read', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(8, 'batiments.write', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(9, 'interventions.read', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(10, 'interventions.write', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(11, 'interventions.assign', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(12, 'interventions.close', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(13, 'maintenance.read', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(14, 'maintenance.write', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(15, 'stats.read', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(16, 'stats.export', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25');

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
(10, 'App\\Models\\User', 1, 'gmdi-st-token', '77763fb10418956e03dc3f3cd10260a520dfab3118c4d6b018b52c87ee9a6b9b', '[\"*\"]', '2026-06-18 11:21:59', '2026-06-18 19:21:20', '2026-06-18 11:21:20', '2026-06-18 11:21:59');

-- --------------------------------------------------------

--
-- Structure de la table `planning_maintenances`
--

CREATE TABLE `planning_maintenances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `equipement` varchar(200) NOT NULL,
  `service` varchar(100) NOT NULL,
  `type_maintenance` varchar(150) NOT NULL,
  `date_prevue` date NOT NULL,
  `periodicite` varchar(50) NOT NULL DEFAULT 'Trimestrielle',
  `responsable` varchar(200) NOT NULL,
  `cout_estime` decimal(12,2) DEFAULT NULL,
  `statut` enum('programme','en_cours','effectue','en_retard') NOT NULL DEFAULT 'programme',
  `date_realisation` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `planning_maintenances`
--

INSERT INTO `planning_maintenances` (`id`, `equipement`, `service`, `type_maintenance`, `date_prevue`, `periodicite`, `responsable`, `cout_estime`, `statut`, `date_realisation`, `created_at`, `updated_at`) VALUES
(1, 'Groupe électrogène HdV 250KVA', 'Bâtiments', 'Révision générale', '2025-06-15', 'Trimestrielle', 'DIABY Sékou', 95000.00, 'en_retard', NULL, '2026-06-16 09:34:00', '2026-06-16 14:15:12'),
(2, 'Camion benne OM-347', 'Voirie', 'Vidange + révision', '2025-06-01', 'Trimestrielle', 'N\'GORAN Koffi', 180000.00, 'en_retard', NULL, '2026-06-16 09:34:00', '2026-06-16 09:34:00'),
(3, 'Réseau éclairage Plateau', 'Éclairage public', 'Vérification câblage', '2025-07-10', 'Semestrielle', 'DIABY Sékou', 250000.00, 'en_retard', NULL, '2026-06-16 09:34:00', '2026-06-16 14:15:12'),
(4, 'Pompe curage caniveaux', 'Eau / Assainissement', 'Nettoyage filtres', '2025-05-20', 'Mensuelle', 'DOSSO Abdoulaye', 35000.00, 'effectue', NULL, '2026-06-16 09:34:00', '2026-06-16 09:34:00');

-- --------------------------------------------------------

--
-- Structure de la table `reparation_voiries`
--

CREATE TABLE `reparation_voiries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `route` varchar(200) NOT NULL,
  `description` varchar(500) NOT NULL,
  `priorite` enum('normale','haute','urgente') NOT NULL DEFAULT 'normale',
  `signale_par` varchar(200) NOT NULL,
  `date_signalement` date NOT NULL,
  `date_intervention` date DEFAULT NULL,
  `statut` enum('signalee','en_intervention','resolue') NOT NULL DEFAULT 'signalee',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reparation_voiries`
--

INSERT INTO `reparation_voiries` (`id`, `route`, `description`, `priorite`, `signale_par`, `date_signalement`, `date_intervention`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Rue du Marché', 'Nid de poule 1m² profond — danger pour véhicules', 'urgente', 'KOUA Amédée', '2025-05-20', '2025-05-21', 'en_intervention', '2026-06-16 09:34:00', '2026-06-16 09:34:00'),
(2, 'Voie desserte lotissement 15', 'Ravinement important suite aux pluies — voie impraticable', 'haute', 'Chef quartier', '2025-05-12', NULL, 'signalee', '2026-06-16 09:34:00', '2026-06-16 09:34:00');

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
(1, 'directeur_technique', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(2, 'chef_service', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(3, 'technicien', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25'),
(4, 'admin', 'sanctum', '2026-06-16 09:31:25', '2026-06-16 09:31:25');

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
(1, 4),
(2, 1),
(2, 2),
(2, 4),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(4, 1),
(4, 2),
(4, 4),
(5, 1),
(5, 2),
(5, 3),
(5, 4),
(6, 1),
(6, 2),
(6, 4),
(7, 1),
(7, 2),
(7, 3),
(7, 4),
(8, 1),
(8, 2),
(8, 4),
(9, 1),
(9, 2),
(9, 3),
(9, 4),
(10, 1),
(10, 2),
(10, 4),
(11, 1),
(11, 2),
(11, 4),
(12, 1),
(12, 2),
(12, 4),
(13, 1),
(13, 2),
(13, 3),
(13, 4),
(14, 1),
(14, 2),
(14, 4),
(15, 1),
(15, 2),
(15, 4),
(16, 1),
(16, 2),
(16, 4);

-- --------------------------------------------------------

--
-- Structure de la table `routes_voirie`
--

CREATE TABLE `routes_voirie` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(200) NOT NULL,
  `quartier` varchar(150) NOT NULL,
  `longueur` double NOT NULL,
  `type` enum('bitumee','laterite','piste') NOT NULL DEFAULT 'bitumee',
  `etat` enum('bon','moyen','degrade','critique') NOT NULL DEFAULT 'bon',
  `date_dernier_entretien` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `routes_voirie`
--

INSERT INTO `routes_voirie` (`id`, `nom`, `quartier`, `longueur`, `type`, `etat`, `date_dernier_entretien`, `created_at`, `updated_at`) VALUES
(1, 'Avenue de la Paix', 'Centre', 2800, 'bitumee', 'bon', '2025-03-15', '2026-06-16 09:32:48', '2026-06-16 09:32:48'),
(2, 'Rue du Commerce', 'Plateau', 1200, 'bitumee', 'moyen', '2024-11-10', '2026-06-16 09:32:48', '2026-06-16 09:32:48'),
(3, 'Boulevard de l\'Indépendance', 'Adjamé', 4500, 'bitumee', 'bon', '2025-01-20', '2026-06-16 09:32:48', '2026-06-16 09:32:48'),
(4, 'Rue du Marché', 'Treichville', 800, 'bitumee', 'degrade', '2024-06-05', '2026-06-16 09:32:48', '2026-06-16 09:32:48'),
(5, 'Voie de desserte lotissement 15', 'Yopougon', 650, 'laterite', 'critique', NULL, '2026-06-16 09:32:48', '2026-06-16 09:32:48'),
(6, 'Piste rurale secteur Nord', 'Abobo', 3200, 'piste', 'moyen', NULL, '2026-06-16 09:32:48', '2026-06-16 09:32:48');

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

-- --------------------------------------------------------

--
-- Structure de la table `travaux_batiments`
--

CREATE TABLE `travaux_batiments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `batiment` varchar(200) NOT NULL,
  `description` varchar(500) NOT NULL,
  `type` enum('reparation','renovation','construction','entretien') NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `cout_estime` decimal(12,2) NOT NULL DEFAULT 0.00,
  `prestataire` varchar(200) DEFAULT NULL,
  `statut` enum('planifie','en_cours','termine','suspendu') NOT NULL DEFAULT 'planifie',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('directeur_technique','chef_service','technicien','admin') NOT NULL DEFAULT 'technicien',
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
(1, 'Directeur ST', 'dst@mairie.ci', 'directeur_technique', NULL, '$2y$12$dJeORK7QyvvI/BqrXHRaa.FT0K3lcwl3TPRH9MkRoy3IaSX2SrGKm', NULL, '2026-06-16 09:32:25', '2026-06-16 09:32:25'),
(2, 'Chef Service', 'chef.st@mairie.ci', 'chef_service', NULL, '$2y$12$2wcdW7IQj6o1BlICCwcFfuekRjqhVLVKqJZpv3inlPDXiOZ9xZSsi', NULL, '2026-06-16 09:32:26', '2026-06-16 09:32:26'),
(3, 'Technicien ST', 'tech.st@mairie.ci', 'technicien', NULL, '$2y$12$c7Y4LTuP5tR4IKlylUn/AOv6tVYy4nMzqTo9sey6.Wk7iYW8p7cZ.', NULL, '2026-06-16 09:32:26', '2026-06-16 09:32:26'),
(4, 'Administrateur', 'admin@mairie.ci', 'admin', NULL, '$2y$12$wIp5PVtJb6Dq4LXxnzRtYeFVnS7XVW6LQ56qxWpU8f2sgjj9u9OXa', NULL, '2026-06-16 09:32:26', '2026-06-16 09:32:26');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `batiment_communals`
--
ALTER TABLE `batiment_communals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `batiment_communals_type_index` (`type`);

--
-- Index pour la table `bon_travails`
--
ALTER TABLE `bon_travails`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bon_travails_reference_unique` (`reference`),
  ADD KEY `bon_travails_statut_service_index` (`statut`,`service`);

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
-- Index pour la table `caniveaux`
--
ALTER TABLE `caniveaux`
  ADD PRIMARY KEY (`id`),
  ADD KEY `caniveaux_quartier_etat_index` (`quartier`,`etat`);

--
-- Index pour la table `collecte_dechets`
--
ALTER TABLE `collecte_dechets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collecte_dechets_prochaine_collecte_index` (`prochaine_collecte`);

--
-- Index pour la table `demande_interventions`
--
ALTER TABLE `demande_interventions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `demande_interventions_reference_unique` (`reference`),
  ADD KEY `demande_interventions_statut_priorite_index` (`statut`,`priorite`),
  ADD KEY `demande_interventions_type_service_index` (`type_service`);

--
-- Index pour la table `entretien_voiries`
--
ALTER TABLE `entretien_voiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entretien_voiries_statut_date_debut_index` (`statut`,`date_debut`);

--
-- Index pour la table `equipes`
--
ALTER TABLE `equipes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `intervention_drainages`
--
ALTER TABLE `intervention_drainages`
  ADD PRIMARY KEY (`id`);

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
-- Index pour la table `lampadaires`
--
ALTER TABLE `lampadaires`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lampadaires_reference_unique` (`reference`),
  ADD KEY `lampadaires_quartier_statut_index` (`quartier`,`statut`);

--
-- Index pour la table `maintenance_correctives`
--
ALTER TABLE `maintenance_correctives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `maintenance_correctives_statut_priorite_index` (`statut`,`priorite`);

--
-- Index pour la table `maintenance_eclairages`
--
ALTER TABLE `maintenance_eclairages`
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
-- Index pour la table `panne_eclairages`
--
ALTER TABLE `panne_eclairages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `panne_eclairages_reference_unique` (`reference`),
  ADD KEY `panne_eclairages_statut_index` (`statut`);

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
-- Index pour la table `planning_maintenances`
--
ALTER TABLE `planning_maintenances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `planning_maintenances_statut_date_prevue_index` (`statut`,`date_prevue`);

--
-- Index pour la table `reparation_voiries`
--
ALTER TABLE `reparation_voiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reparation_voiries_statut_priorite_index` (`statut`,`priorite`);

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
-- Index pour la table `routes_voirie`
--
ALTER TABLE `routes_voirie`
  ADD PRIMARY KEY (`id`),
  ADD KEY `routes_voirie_quartier_etat_index` (`quartier`,`etat`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `travaux_batiments`
--
ALTER TABLE `travaux_batiments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `travaux_batiments_batiment_statut_index` (`batiment`,`statut`);

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
-- AUTO_INCREMENT pour la table `batiment_communals`
--
ALTER TABLE `batiment_communals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `bon_travails`
--
ALTER TABLE `bon_travails`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `caniveaux`
--
ALTER TABLE `caniveaux`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `collecte_dechets`
--
ALTER TABLE `collecte_dechets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `demande_interventions`
--
ALTER TABLE `demande_interventions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `entretien_voiries`
--
ALTER TABLE `entretien_voiries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `equipes`
--
ALTER TABLE `equipes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `intervention_drainages`
--
ALTER TABLE `intervention_drainages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `lampadaires`
--
ALTER TABLE `lampadaires`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `maintenance_correctives`
--
ALTER TABLE `maintenance_correctives`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `maintenance_eclairages`
--
ALTER TABLE `maintenance_eclairages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `panne_eclairages`
--
ALTER TABLE `panne_eclairages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `planning_maintenances`
--
ALTER TABLE `planning_maintenances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `reparation_voiries`
--
ALTER TABLE `reparation_voiries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `routes_voirie`
--
ALTER TABLE `routes_voirie`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `travaux_batiments`
--
ALTER TABLE `travaux_batiments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
