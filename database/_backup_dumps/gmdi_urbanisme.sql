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
-- Base de données : `gmdi_urbanisme`
--

-- --------------------------------------------------------

--
-- Structure de la table `amenagement_urbains`
--

CREATE TABLE `amenagement_urbains` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `intitule` varchar(200) NOT NULL,
  `type` varchar(100) NOT NULL,
  `localisation` varchar(250) NOT NULL,
  `superficie` float DEFAULT NULL,
  `budget` decimal(15,2) NOT NULL DEFAULT 0.00,
  `financeur` varchar(150) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `taux_avancement` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `statut` enum('etude','approuve','en_cours','termine','suspendu') NOT NULL DEFAULT 'etude',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `amenagement_urbains`
--

INSERT INTO `amenagement_urbains` (`id`, `intitule`, `type`, `localisation`, `superficie`, `budget`, `financeur`, `date_debut`, `date_fin`, `taux_avancement`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Reamenagement Marche d Adjame', 'Marche', 'Adjame Centre', NULL, 450000000.00, 'Etat + Mairie', '2025-03-01', '2026-06-30', 22, 'en_cours', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(2, 'Jardin Municipal Deux Plateaux', 'Espace vert', 'Cocody Deux Plateaux', NULL, 120000000.00, 'Mairie d Abidjan', '2025-06-01', NULL, 0, 'approuve', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(3, 'Extension Voirie Yopougon Sect.9', 'Voirie', 'Yopougon Secteur 9', NULL, 280000000.00, 'Fonds BID', NULL, NULL, 0, 'etude', '2026-06-18 23:41:57', '2026-06-18 23:41:57');

-- --------------------------------------------------------

--
-- Structure de la table `couche_voiries`
--

CREATE TABLE `couche_voiries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(200) NOT NULL,
  `type` enum('principale','secondaire','piste') NOT NULL,
  `longueur` float NOT NULL,
  `etat` enum('bon','moyen','degrade') NOT NULL DEFAULT 'bon',
  `quartier` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `couche_voiries`
--

INSERT INTO `couche_voiries` (`id`, `nom`, `type`, `longueur`, `etat`, `quartier`, `created_at`, `updated_at`) VALUES
(1, 'Boulevard Valery Giscard d Estaing', 'principale', 8.4, 'bon', 'Cocody', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(2, 'Avenue General de Gaulle', 'principale', 3.2, 'bon', 'Plateau', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(3, 'Rue du Commerce', 'secondaire', 1.8, 'moyen', 'Plateau', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(4, 'Boulevard de Marseille', 'principale', 5.6, 'moyen', 'Treichville', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(5, 'Route de l Aeroport', 'principale', 12, 'bon', 'Yopougon', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(6, 'Voie de desserte Yopougon Selmer', 'secondaire', 2.3, 'degrade', 'Yopougon', '2026-06-18 23:41:57', '2026-06-18 23:41:57');

-- --------------------------------------------------------

--
-- Structure de la table `equipement_publics`
--

CREATE TABLE `equipement_publics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(200) NOT NULL,
  `type` enum('ecole','sante','marche','espace_vert','sport','culte','securite','commissariat','gendarmerie','eaux_forets','autre') NOT NULL DEFAULT 'autre',
  `adresse` varchar(250) NOT NULL,
  `quartier` varchar(150) NOT NULL,
  `lat` decimal(10,6) NOT NULL,
  `lng` decimal(10,6) NOT NULL,
  `capacite` int(10) UNSIGNED DEFAULT NULL,
  `etat` enum('bon','moyen','degrade') NOT NULL DEFAULT 'bon',
  `responsable` varchar(200) DEFAULT NULL,
  `annee_construction` smallint(5) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `equipement_publics`
--

INSERT INTO `equipement_publics` (`id`, `nom`, `type`, `adresse`, `quartier`, `lat`, `lng`, `capacite`, `etat`, `responsable`, `annee_construction`, `created_at`, `updated_at`) VALUES
(1, 'Ecole Primaire Publique Cocody 12', 'ecole', 'Rue des Pins, Cocody', 'Cocody', 5.372000, -3.978000, 600, 'bon', 'Directeur KOUASSI', NULL, '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(2, 'Ecole Primaire Publique Adjame Centre', 'ecole', 'Av. 21, Adjame', 'Adjame', 5.365000, -4.018000, 450, 'moyen', NULL, NULL, '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(3, 'Lycee Municipal de Treichville', 'ecole', 'Avenue 13, Treichville', 'Treichville', 5.298000, -4.015000, 1200, 'bon', 'Proviseur BETE', NULL, '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(4, 'Centre de Sante Urbain Yopougon', 'sante', 'Boulevard de la Paix, Yopougon', 'Yopougon', 5.332000, -4.066000, 150, 'bon', 'Dr. DIALLO', NULL, '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(5, 'Polyclinique Plateau Nord', 'sante', 'Rue du Docteur Crozet, Plateau', 'Plateau', 5.355500, -4.003800, 200, 'bon', NULL, NULL, '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(6, 'Marche Municipal d Adjame', 'marche', 'Carrefour Williamsville', 'Adjame', 5.366000, -4.020000, NULL, 'moyen', 'KONE Directeur', NULL, '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(7, 'Marche de Treichville', 'marche', 'Avenue 13, Treichville', 'Treichville', 5.299500, -4.016500, NULL, 'degrade', NULL, NULL, '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(8, 'Jardin du Plateau', 'espace_vert', 'Boulevard de la Republique, Plateau', 'Plateau', 5.354000, -4.005500, 5000, 'bon', NULL, NULL, '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(9, 'Espace vert Riviera Golf', 'espace_vert', 'Riviera Golf, Cocody', 'Cocody', 5.380000, -3.970000, NULL, 'bon', NULL, NULL, '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(10, 'Stade Municipal Yopougon', 'sport', 'Quartier Yopougon SIDECI', 'Yopougon', 5.335000, -4.070000, 8000, 'moyen', NULL, NULL, '2026-06-18 23:41:57', '2026-06-18 23:41:57');

-- --------------------------------------------------------

--
-- Structure de la table `lotissements`
--

CREATE TABLE `lotissements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(20) NOT NULL,
  `denomination` varchar(200) NOT NULL,
  `promoteur` varchar(200) NOT NULL,
  `localisation` varchar(250) NOT NULL,
  `superficie` float NOT NULL,
  `nombre_lots` smallint(5) UNSIGNED NOT NULL,
  `lots_disponibles` smallint(5) UNSIGNED DEFAULT NULL,
  `date_approb` date DEFAULT NULL,
  `statut` enum('etude','approuve','en_cours','termine','suspendu') NOT NULL DEFAULT 'etude',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `lotissements`
--

INSERT INTO `lotissements` (`id`, `reference`, `denomination`, `promoteur`, `localisation`, `superficie`, `nombre_lots`, `lots_disponibles`, `date_approb`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'LOT-2024-001', 'Residence Les Cocotiers', 'SIMCI SA', 'Cocody Angre Prolongement', 12.5, 85, 12, '2024-02-10', 'en_cours', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(2, 'LOT-2025-002', 'Cite Verte Yopougon', 'PROMO-INVEST CI', 'Yopougon Attie Nord', 8.2, 60, 28, '2025-01-20', 'approuve', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(3, 'LOT-2025-003', 'Villa Park Abobo', 'GROUPE HABITAT AFRIQUE', 'Abobo Sud Extension', 15, 120, 120, NULL, 'etude', '2026-06-18 23:41:57', '2026-06-18 23:41:57');

-- --------------------------------------------------------

--
-- Structure de la table `lots`
--

CREATE TABLE `lots` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(30) NOT NULL,
  `lotissement` varchar(200) NOT NULL,
  `numero` smallint(5) UNSIGNED DEFAULT NULL,
  `superficie` float NOT NULL,
  `usage` varchar(100) DEFAULT NULL,
  `prix` decimal(15,2) DEFAULT NULL,
  `attributaire` varchar(200) DEFAULT NULL,
  `attribue_a` varchar(200) DEFAULT NULL,
  `date_attribution` date DEFAULT NULL,
  `statut` enum('disponible','attribue','construit') NOT NULL DEFAULT 'disponible',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `lots`
--

INSERT INTO `lots` (`id`, `reference`, `lotissement`, `numero`, `superficie`, `usage`, `prix`, `attributaire`, `attribue_a`, `date_attribution`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'LOT-A-001', 'Residence Les Cocotiers', NULL, 320, NULL, NULL, 'COULIBALY Aminata', NULL, '2025-02-15', 'attribue', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(2, 'LOT-A-002', 'Residence Les Cocotiers', NULL, 280, NULL, NULL, NULL, NULL, NULL, 'disponible', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(3, 'LOT-B-001', 'Cite Verte Yopougon', NULL, 350, NULL, NULL, 'TRAORE Saliou', NULL, NULL, 'construit', '2026-06-18 23:41:57', '2026-06-18 23:41:57');

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
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_01_01_000001_add_role_to_users_table', 2),
(6, '2025_01_01_000001_add_role_to_users_table', 2),
(7, '2025_01_01_000002_create_parcelles_table', 2),
(8, '2025_01_01_000003_create_lots_table', 2),
(9, '2025_01_01_000004_create_titre_fonciers_table', 2),
(10, '2025_01_01_000005_create_reserve_administratives_table', 2),
(11, '2025_01_01_000006_create_permis_table', 2),
(12, '2025_01_01_000007_create_quartiers_table', 2),
(13, '2025_01_01_000008_create_couche_voiries_table', 2),
(14, '2025_01_01_000009_create_reseau_electriques_table', 2),
(15, '2025_01_01_000010_create_reseau_hydrauliques_table', 2),
(16, '2025_01_01_000011_create_lotissements_table', 2),
(17, '2025_01_01_000012_create_amenagement_urbains_table', 2),
(18, '2025_01_01_000013_create_suivi_chantiers_table', 2),
(19, '2025_01_01_000014_create_equipement_publics_table', 2),
(20, '2026_06_18_235058_create_permission_tables', 3),
(21, '2026_06_18_235058_create_personal_access_tokens_table', 3),
(22, '0001_01_01_000001_create_personal_access_tokens_table', 4),
(23, '2025_06_01_000001_add_missing_columns', 5),
(24, '2025_06_23_000001_add_gps_and_new_fields', 6);

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
-- Structure de la table `parcelles`
--

CREATE TABLE `parcelles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(25) NOT NULL,
  `proprietaire` varchar(200) NOT NULL,
  `localisation` varchar(250) NOT NULL,
  `quartier` varchar(150) NOT NULL,
  `superficie` float NOT NULL,
  `usage` varchar(100) DEFAULT NULL,
  `titre_foncier` varchar(60) DEFAULT NULL,
  `statut` enum('libre','occupe','litige','reserve') NOT NULL DEFAULT 'libre',
  `lat` decimal(10,6) DEFAULT NULL,
  `lng` decimal(10,6) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `parcelles`
--

INSERT INTO `parcelles` (`id`, `reference`, `proprietaire`, `localisation`, `quartier`, `superficie`, `usage`, `titre_foncier`, `statut`, `lat`, `lng`, `created_at`, `updated_at`) VALUES
(1, 'URB-PAR-2025-0001', 'KONAN Rodrigue', 'Lot 15 Ilot A, Cocody Riviera', 'Cocody', 400, 'Residentiel', 'TF-CI-ABJ-2024-01234', 'occupe', 5.371100, -3.979300, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(2, 'URB-PAR-2025-0002', 'SOCIETE IMMOBILIERE ABIDJANAISE', 'Carre 7-B, Zone Industrielle Yopougon', 'Yopougon', 2500, 'Commercial', NULL, 'occupe', 5.333300, -4.066700, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(3, 'URB-PAR-2025-0003', 'Etat de Cote d\'Ivoire', 'Parcelle administrative secteur 3', 'Plateau', 1200, 'Administratif', NULL, 'reserve', 5.354400, -4.004700, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(4, 'URB-PAR-2025-0004', 'YAO Marcelline', 'Residence Bonoumin Lot 22', 'Cocody', 350, 'Residentiel', NULL, 'libre', 5.372000, -3.978000, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(5, 'URB-PAR-2025-0005', 'KOUAME Fernand', 'Avenue 13 Treichville, Lot 8', 'Treichville', 280, 'Commercial', NULL, 'litige', 5.300000, -4.016700, '2026-06-18 23:41:22', '2026-06-18 23:41:22');

-- --------------------------------------------------------

--
-- Structure de la table `permis`
--

CREATE TABLE `permis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(25) NOT NULL,
  `type` enum('construire','demolir','certificat','occupation') NOT NULL,
  `demandeur` varchar(200) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `numero_piece` varchar(100) DEFAULT NULL COMMENT 'N° pièce identité (permis démolir)',
  `type_piece` enum('cni','passeport','sejour','autre') DEFAULT NULL,
  `lat` decimal(10,6) DEFAULT NULL COMMENT 'Latitude GPS du projet',
  `lng` decimal(10,6) DEFAULT NULL COMMENT 'Longitude GPS du projet',
  `localisation` varchar(250) NOT NULL,
  `quartier` varchar(150) NOT NULL,
  `ilot` varchar(50) DEFAULT NULL COMMENT 'Numéro îlot',
  `lot` varchar(50) DEFAULT NULL COMMENT 'Numéro lot',
  `section` varchar(50) DEFAULT NULL COMMENT 'Section cadastrale',
  `nombre_etages` tinyint(3) UNSIGNED DEFAULT NULL,
  `cout_estime` decimal(15,2) DEFAULT NULL,
  `surface_plancher` decimal(10,2) DEFAULT NULL,
  `date_depot` date NOT NULL,
  `date_instruction` date DEFAULT NULL,
  `date_decision` date DEFAULT NULL,
  `date_expiration` date DEFAULT NULL,
  `statut` enum('depose','instruction','accorde','refuse','expire') NOT NULL DEFAULT 'depose',
  `motif_refus` varchar(500) DEFAULT NULL,
  `agent` varchar(200) DEFAULT NULL,
  `instructeur` varchar(200) DEFAULT NULL,
  `observations` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `permis`
--

INSERT INTO `permis` (`id`, `reference`, `type`, `demandeur`, `telephone`, `numero_piece`, `type_piece`, `lat`, `lng`, `localisation`, `quartier`, `ilot`, `lot`, `section`, `nombre_etages`, `cout_estime`, `surface_plancher`, `date_depot`, `date_instruction`, `date_decision`, `date_expiration`, `statut`, `motif_refus`, `agent`, `instructeur`, `observations`, `created_at`, `updated_at`) VALUES
(1, 'PC-2025-000024', 'construire', 'KONAN Rodrigue', '07 11 22 33', NULL, NULL, NULL, NULL, 'Lot 15 Ilot A, Cocody Riviera', 'Cocody', NULL, NULL, NULL, NULL, NULL, 180.00, '2025-05-10', NULL, '2026-06-25', '2028-06-25', 'accorde', NULL, 'YAO Marcelline', NULL, NULL, '2026-06-18 23:41:22', '2026-06-25 23:38:49'),
(2, 'PC-2025-000023', 'construire', 'DIALLO Moussa', NULL, NULL, NULL, NULL, NULL, 'Residence Les Palmiers, Yopougon', 'Yopougon', NULL, NULL, NULL, NULL, NULL, 220.00, '2025-05-08', NULL, '2025-05-20', '2027-05-20', 'accorde', NULL, 'YAO Marcelline', NULL, NULL, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(3, 'PD-2025-000005', 'demolir', 'BETE Investissements', NULL, NULL, NULL, NULL, NULL, 'Av. General de Gaulle, Plateau', 'Plateau', NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-22', NULL, NULL, NULL, 'depose', NULL, NULL, NULL, NULL, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(4, 'CU-2025-000041', 'certificat', 'HOLDING IMMOBILIERE CI', NULL, NULL, NULL, NULL, NULL, 'Zone Extension Cocody Angre', 'Cocody', NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-15', NULL, '2025-05-25', '2025-11-25', 'accorde', NULL, NULL, NULL, NULL, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(5, 'AO-2025-000012', 'occupation', 'TELECOMS IVOIRE SA', NULL, NULL, NULL, NULL, NULL, 'Carrefour Deux Plateaux Vallons', 'Cocody', NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-12', NULL, '2025-04-05', NULL, 'refuse', NULL, NULL, NULL, 'Zone residentielle protegee - antenne refusee', '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(6, 'PC-2026-000003', 'construire', 'Konan Jean', NULL, NULL, NULL, NULL, NULL, 'Riviera 4', 'Non précisé', NULL, NULL, NULL, NULL, NULL, 17693.00, '2026-06-19', NULL, '2026-06-23', '2028-06-23', 'accorde', NULL, NULL, NULL, 'Type : construire', '2026-06-19 08:31:31', '2026-06-23 15:55:00');

-- --------------------------------------------------------

--
-- Structure de la table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL DEFAULT 'sanctum',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'foncier.view', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(2, 'foncier.create', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(3, 'foncier.update', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(4, 'permis.view', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(5, 'permis.create', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(6, 'permis.update', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(7, 'permis.decider', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(8, 'sig.view', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(9, 'sig.create', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(10, 'sig.update', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(11, 'projets.view', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(12, 'projets.create', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(13, 'projets.update', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(14, 'equipements.view', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(15, 'equipements.create', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(16, 'equipements.update', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(17, 'stats.view', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(18, 'stats.export', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15');

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
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
(14, 'App\\Models\\User', 4, 'gmdi-urb-token', '662578effb77abd1c53aa12b08b9a0e077ac1c3d4828939934385577d4b103d7', '[\"*\"]', NULL, '2026-06-25 18:25:49', '2026-06-25 10:25:49', '2026-06-25 10:25:49');

-- --------------------------------------------------------

--
-- Structure de la table `quartiers`
--

CREATE TABLE `quartiers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(150) NOT NULL,
  `code` varchar(20) NOT NULL,
  `superficie` float NOT NULL,
  `population` int(10) UNSIGNED DEFAULT NULL,
  `chef` varchar(200) DEFAULT NULL,
  `lat` decimal(10,6) DEFAULT NULL,
  `lng` decimal(10,6) DEFAULT NULL,
  `nombre_parcelles` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `quartiers`
--

INSERT INTO `quartiers` (`id`, `nom`, `code`, `superficie`, `population`, `chef`, `lat`, `lng`, `nombre_parcelles`, `created_at`, `updated_at`) VALUES
(1, 'Plateau', 'PLT-01', 320, 45000, 'DIALLO Moussa', 5.354400, -4.004700, 1850, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(2, 'Cocody', 'COC-02', 1850, 135000, 'N\'GORAN Simeon', 5.371100, -3.979300, 4200, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(3, 'Adjame', 'ADJ-03', 580, 325000, 'KONE Aboubacar', 5.366700, -4.016700, 3100, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(4, 'Yopougon', 'YOP-04', 2340, 1060000, 'BAMBA Souleymane', 5.333300, -4.066700, 8500, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(5, 'Treichville', 'TRE-05', 280, 150000, 'AHOUSSOU Paul', 5.300000, -4.016700, 2300, '2026-06-18 23:41:22', '2026-06-18 23:41:22');

-- --------------------------------------------------------

--
-- Structure de la table `reseau_electriques`
--

CREATE TABLE `reseau_electriques` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `zone` varchar(150) NOT NULL,
  `type` enum('HT','MT','BT') NOT NULL,
  `longueur` float NOT NULL,
  `taux_couverture` tinyint(3) UNSIGNED NOT NULL,
  `operateur` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reseau_electriques`
--

INSERT INTO `reseau_electriques` (`id`, `zone`, `type`, `longueur`, `taux_couverture`, `operateur`, `created_at`, `updated_at`) VALUES
(1, 'Plateau & Cocody', 'HT', 45.2, 98, 'CIE', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(2, 'Adjame & Treichville', 'MT', 38.5, 94, 'CIE', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(3, 'Yopougon Centre', 'MT', 62.8, 88, 'CIE', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(4, 'Yopougon Peripherie', 'BT', 28.4, 71, 'CIE', '2026-06-18 23:41:57', '2026-06-18 23:41:57');

-- --------------------------------------------------------

--
-- Structure de la table `reseau_hydrauliques`
--

CREATE TABLE `reseau_hydrauliques` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `zone` varchar(150) NOT NULL,
  `type` enum('adduction','assainissement','irrigation') NOT NULL,
  `longueur` float NOT NULL,
  `taux_couverture` tinyint(3) UNSIGNED NOT NULL,
  `statut` enum('operationnel','en_travaux','hors_service') NOT NULL DEFAULT 'operationnel',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reseau_hydrauliques`
--

INSERT INTO `reseau_hydrauliques` (`id`, `zone`, `type`, `longueur`, `taux_couverture`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Plateau & Cocody', 'adduction', 38.2, 96, 'operationnel', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(2, 'Adjame & Treichville', 'assainissement', 42.1, 88, 'operationnel', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(3, 'Yopougon Centre', 'adduction', 55.6, 79, 'operationnel', '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(4, 'Yopougon Secteur 9', 'adduction', 15.3, 52, 'en_travaux', '2026-06-18 23:41:57', '2026-06-18 23:41:57');

-- --------------------------------------------------------

--
-- Structure de la table `reserve_administratives`
--

CREATE TABLE `reserve_administratives` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `denomination` varchar(200) NOT NULL,
  `usage` varchar(200) NOT NULL,
  `superficie` float NOT NULL,
  `localisation` varchar(250) NOT NULL,
  `lat` decimal(10,6) DEFAULT NULL COMMENT 'Latitude GPS',
  `lng` decimal(10,6) DEFAULT NULL COMMENT 'Longitude GPS',
  `statut` enum('reserve','affecte','libere') NOT NULL DEFAULT 'reserve',
  `administration` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reserve_administratives`
--

INSERT INTO `reserve_administratives` (`id`, `denomination`, `usage`, `superficie`, `localisation`, `lat`, `lng`, `statut`, `administration`, `created_at`, `updated_at`) VALUES
(1, 'Site Ecole Primaire Nouveau Quartier', 'Ecole', 3000, 'Secteur 12, Yopougon Nord', NULL, NULL, 'reserve', 'Ministere de l Education', '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(2, 'Espace Vert Boulevard Lagunaire', 'Espace vert', 8500, 'Bord de lagune, Plateau', NULL, NULL, 'affecte', 'Mairie d Abidjan', '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(3, 'Site Marche de Proximite Adjame Nord', 'Marche', 5000, 'Quartier Williamsville', NULL, NULL, 'reserve', 'Mairie d Abidjan', '2026-06-18 23:41:22', '2026-06-18 23:41:22');

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL DEFAULT 'sanctum',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'responsable_urbanisme', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(2, 'agent_urbanisme', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(3, 'instructeur', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15'),
(4, 'admin', 'sanctum', '2026-06-18 23:40:15', '2026-06-18 23:40:15');

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
(1, 4),
(2, 1),
(2, 2),
(2, 4),
(3, 1),
(3, 2),
(3, 4),
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(5, 1),
(5, 2),
(5, 4),
(6, 1),
(6, 2),
(6, 3),
(6, 4),
(7, 1),
(7, 3),
(7, 4),
(8, 1),
(8, 2),
(8, 4),
(9, 1),
(9, 2),
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
(13, 4),
(14, 1),
(14, 2),
(14, 4),
(15, 1),
(15, 2),
(15, 4),
(16, 1),
(16, 2),
(16, 4),
(17, 1),
(17, 2),
(17, 3),
(17, 4),
(18, 1),
(18, 4);

-- --------------------------------------------------------

--
-- Structure de la table `suivi_chantiers`
--

CREATE TABLE `suivi_chantiers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `projet` varchar(200) NOT NULL,
  `entrepreneur` varchar(200) NOT NULL,
  `date_ouverture` date NOT NULL,
  `date_prevue_fin` date NOT NULL,
  `taux_avancement` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `derniere_visite` date DEFAULT NULL,
  `date_visite` date DEFAULT NULL,
  `statut` enum('actif','arrete','termine','retard') NOT NULL DEFAULT 'actif',
  `observations` varchar(500) DEFAULT NULL,
  `recommandations` text DEFAULT NULL,
  `controleur` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `suivi_chantiers`
--

INSERT INTO `suivi_chantiers` (`id`, `projet`, `entrepreneur`, `date_ouverture`, `date_prevue_fin`, `taux_avancement`, `derniere_visite`, `date_visite`, `statut`, `observations`, `recommandations`, `controleur`, `created_at`, `updated_at`) VALUES
(1, 'Reamenagement Marche d Adjame', 'ENTREPRISE GENERALE CI', '2025-03-15', '2026-06-30', 22, '2025-05-28', NULL, 'actif', 'Fondations terminees, gros oeuvre debute', NULL, NULL, '2026-06-18 23:41:57', '2026-06-18 23:41:57'),
(2, 'Rehabilitation Voie CKB Yopougon', 'ROUTES & TRAVAUX IVOIRE', '2025-01-10', '2025-04-30', 68, '2025-05-15', NULL, 'retard', 'Retard de 3 semaines du aux pluies', NULL, NULL, '2026-06-18 23:41:57', '2026-06-18 23:41:57');

-- --------------------------------------------------------

--
-- Structure de la table `titre_fonciers`
--

CREATE TABLE `titre_fonciers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `numero` varchar(60) NOT NULL,
  `type` enum('TF','ACD','CU','autre') NOT NULL,
  `proprietaire` varchar(200) NOT NULL,
  `superficie` float NOT NULL,
  `localisation` varchar(250) NOT NULL,
  `lat` decimal(10,6) DEFAULT NULL COMMENT 'Latitude GPS',
  `lng` decimal(10,6) DEFAULT NULL COMMENT 'Longitude GPS',
  `date_delivrance` date DEFAULT NULL,
  `date_expiration` date DEFAULT NULL,
  `statut` enum('valide','expire','litige','en_cours') NOT NULL DEFAULT 'valide',
  `observation` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `titre_fonciers`
--

INSERT INTO `titre_fonciers` (`id`, `numero`, `type`, `proprietaire`, `superficie`, `localisation`, `lat`, `lng`, `date_delivrance`, `date_expiration`, `statut`, `observation`, `created_at`, `updated_at`) VALUES
(1, 'TF-CI-ABJ-2024-01234', 'TF', 'KONAN Rodrigue', 400, 'Lot 15 Ilot A, Cocody', NULL, NULL, '2024-03-15', NULL, 'valide', NULL, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(2, 'ACD-CI-ABJ-2023-00456', 'ACD', 'SOCIETE IMMOBILIERE ABIDJANAISE', 2500, 'Zone Industrielle Yopougon', NULL, NULL, '2023-07-20', NULL, 'valide', NULL, '2026-06-18 23:41:22', '2026-06-18 23:41:22'),
(3, 'TF-CI-ABJ-2020-00089', 'TF', 'HERITIERS KOUAME', 280, 'Av. 13 Treichville', NULL, NULL, '2020-01-10', NULL, 'litige', NULL, '2026-06-18 23:41:22', '2026-06-18 23:41:22');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('responsable_urbanisme','agent_urbanisme','instructeur','admin') NOT NULL DEFAULT 'agent_urbanisme',
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `role`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'KONAN Rodrigue', 'urb@mairie.ci', 'responsable_urbanisme', '$2y$12$AVYos.RA.A1Lt1YhJ2FYvu6wQGWoQUvaUwnK4Y40CrE4/xR/gynhe', NULL, '2026-06-18 23:42:36', '2026-06-18 23:42:36'),
(2, 'BAMBA N\'Guessan', 'agent.urb@mairie.ci', 'agent_urbanisme', '$2y$12$4s.cP1w4PuyT0CzbHNhqnuZa/ctPybtAr1qnAKDZ2jvoKp9cZB0VC', NULL, '2026-06-18 23:42:37', '2026-06-18 23:42:37'),
(3, 'YAO Marcelline', 'instr.urb@mairie.ci', 'instructeur', '$2y$12$tAlUfDi4AfGh6.KgJ6n43.dXuPxOn8cRrSDBJwijWzaOdCCL.bATC', NULL, '2026-06-18 23:42:37', '2026-06-18 23:42:37'),
(4, 'Admin GMDI', 'admin@mairie.ci', 'admin', '$2y$12$tWU2tvXMi52rC6VYJcRqs.fpj7qQfZb0N8lNwFdUrxMnt1s0omay2', NULL, '2026-06-18 23:42:37', '2026-06-18 23:42:37');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `amenagement_urbains`
--
ALTER TABLE `amenagement_urbains`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `couche_voiries`
--
ALTER TABLE `couche_voiries`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `equipement_publics`
--
ALTER TABLE `equipement_publics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type_q` (`type`,`quartier`);

--
-- Index pour la table `lotissements`
--
ALTER TABLE `lotissements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`);

--
-- Index pour la table `lots`
--
ALTER TABLE `lots`
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
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`);

--
-- Index pour la table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`);

--
-- Index pour la table `parcelles`
--
ALTER TABLE `parcelles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`),
  ADD KEY `idx_q_s` (`quartier`,`statut`);

--
-- Index pour la table `permis`
--
ALTER TABLE `permis`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`),
  ADD KEY `idx_type_statut` (`type`,`statut`);

--
-- Index pour la table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `perm_unique` (`name`,`guard_name`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `pat_idx` (`tokenable_type`,`tokenable_id`);

--
-- Index pour la table `quartiers`
--
ALTER TABLE `quartiers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Index pour la table `reseau_electriques`
--
ALTER TABLE `reseau_electriques`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `reseau_hydrauliques`
--
ALTER TABLE `reseau_hydrauliques`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `reserve_administratives`
--
ALTER TABLE `reserve_administratives`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_unique` (`name`,`guard_name`);

--
-- Index pour la table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Index pour la table `suivi_chantiers`
--
ALTER TABLE `suivi_chantiers`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `titre_fonciers`
--
ALTER TABLE `titre_fonciers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero` (`numero`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `amenagement_urbains`
--
ALTER TABLE `amenagement_urbains`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `couche_voiries`
--
ALTER TABLE `couche_voiries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `equipement_publics`
--
ALTER TABLE `equipement_publics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `lotissements`
--
ALTER TABLE `lotissements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `lots`
--
ALTER TABLE `lots`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `parcelles`
--
ALTER TABLE `parcelles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `permis`
--
ALTER TABLE `permis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `quartiers`
--
ALTER TABLE `quartiers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `reseau_electriques`
--
ALTER TABLE `reseau_electriques`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `reseau_hydrauliques`
--
ALTER TABLE `reseau_hydrauliques`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `reserve_administratives`
--
ALTER TABLE `reserve_administratives`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `suivi_chantiers`
--
ALTER TABLE `suivi_chantiers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `titre_fonciers`
--
ALTER TABLE `titre_fonciers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  ADD CONSTRAINT `model_has_permissions_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
