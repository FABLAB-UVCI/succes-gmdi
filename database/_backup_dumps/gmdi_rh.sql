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
-- Base de données : `gmdi_rh`
--

-- --------------------------------------------------------

--
-- Structure de la table `absences`
--

CREATE TABLE `absences` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `matricule` varchar(255) NOT NULL,
  `agent` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `motif` varchar(255) NOT NULL,
  `justifie` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `absences`
--

INSERT INTO `absences` (`id`, `matricule`, `agent`, `date`, `motif`, `justifie`, `created_at`, `updated_at`) VALUES
(1, 'ST-002', 'YAPI Kouadio', '2025-05-23', 'Maladie non justifiée', 0, '2026-06-16 01:46:02', '2026-06-16 01:46:02'),
(2, 'URB-002', 'GBANÉ Awa', '2025-05-24', 'Certificat médical', 1, '2026-06-16 01:46:02', '2026-06-16 01:46:02');

-- --------------------------------------------------------

--
-- Structure de la table `agents`
--

CREATE TABLE `agents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `matricule` varchar(255) NOT NULL,
  `nom_complet` varchar(255) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `poste` varchar(255) NOT NULL,
  `direction` varchar(255) NOT NULL,
  `type_contrat` enum('fonctionnaire','contractuel','stage') NOT NULL,
  `categorie` enum('A','B','C','Stagiaire') NOT NULL,
  `specialite` varchar(255) DEFAULT NULL,
  `grade` varchar(255) NOT NULL,
  `date_embauche` date NOT NULL,
  `date_naissance` date NOT NULL,
  `genre` enum('M','F') NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `statut` enum('actif','conge','suspendu') NOT NULL DEFAULT 'actif',
  `salaire_brut` decimal(12,2) NOT NULL DEFAULT 0.00,
  `conges_restants` int(11) NOT NULL DEFAULT 30,
  `situation_familiale` varchar(255) DEFAULT NULL,
  `diplome` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `agents`
--

INSERT INTO `agents` (`id`, `matricule`, `nom_complet`, `nom`, `prenom`, `poste`, `direction`, `type_contrat`, `categorie`, `specialite`, `grade`, `date_embauche`, `date_naissance`, `genre`, `telephone`, `email`, `statut`, `salaire_brut`, `conges_restants`, `situation_familiale`, `diplome`, `created_at`, `updated_at`) VALUES
(1, 'EC-001', 'TRAORÉ Adjoa', NULL, NULL, 'Chef Service État Civil', 'Direction État Civil', 'fonctionnaire', 'A', NULL, 'Administrateur Principal', '2010-03-01', '1978-06-12', 'F', '+225 07 00 00 00 10', 'chef.etatcivil@mairie.ci', 'actif', 450000.00, 22, 'Marié(e)', 'Master', '2026-06-16 01:46:02', '2026-06-16 01:46:02'),
(2, 'FIN-001', 'BAMBA Lassina', NULL, NULL, 'Directeur Financier', 'Direction Finances', 'fonctionnaire', 'A', NULL, 'Administrateur Hors Classe', '2008-09-15', '1975-02-28', 'M', '+225 07 00 00 00 20', 'chef.finances@mairie.ci', 'actif', 580000.00, 18, 'Marié(e)', 'Master', '2026-06-16 01:46:02', '2026-06-16 01:46:02'),
(3, 'RH-002', 'DIOMANDÉ Karim', NULL, NULL, 'Gestionnaire RH', 'DRH', 'fonctionnaire', 'B', NULL, 'Attaché Principal', '2015-01-05', '1985-08-19', 'M', '+225 07 00 00 00 31', 'rh.agent@mairie.ci', 'conge', 280000.00, 5, 'Célibataire', 'Licence', '2026-06-16 01:46:02', '2026-06-16 01:46:02'),
(4, 'ST-002', 'YAPI Kouadio Fernand', NULL, NULL, 'Chef Équipe Voirie', 'Services Techniques', 'fonctionnaire', 'C', NULL, 'Technicien', '2012-06-20', '1982-11-04', 'M', '+225 07 00 00 00 40', 'voirie@mairie.ci', 'actif', 210000.00, 28, 'Marié(e)', 'BTS / DUT', '2026-06-16 01:46:02', '2026-06-16 01:46:02'),
(5, 'URB-002', 'GBANÉ Awa', NULL, NULL, 'Instructrice Permis', 'Direction Urbanisme', 'contractuel', 'B', NULL, 'Attaché', '2018-04-10', '1990-03-22', 'F', '+225 07 00 00 00 50', 'permis@mairie.ci', 'actif', 260000.00, 15, 'Célibataire', 'Licence', '2026-06-16 01:46:02', '2026-06-16 01:46:02'),
(6, 'STG-001', 'KOUAMÉ Brice', NULL, NULL, 'Stagiaire Informatique', 'DSI', 'stage', 'Stagiaire', NULL, 'Stagiaire', '2025-04-01', '2001-07-15', 'M', '+225 07 11 22 33 44', 'stagiaire@mairie.ci', 'actif', 50000.00, 0, 'Célibataire', 'BTS / DUT', '2026-06-16 01:46:02', '2026-06-16 01:46:02'),
(7, 'EC-024', 'KONAN JEAN', 'KONAN', 'JEAN', 'Agent de saisie', 'Direction Patrimoine', 'fonctionnaire', 'A', 'Communication digitale', 'Chef de projet', '1976-02-24', '2009-08-20', 'M', '0576489309', 'atseyannis@gmail.com', 'actif', 290000.00, 30, 'Célibataire', 'Doctorat', '2026-06-16 01:57:15', '2026-06-16 01:57:15');

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
-- Structure de la table `conges`
--

CREATE TABLE `conges` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `matricule` varchar(255) NOT NULL,
  `agent` varchar(255) NOT NULL,
  `type` enum('annuel','maladie','maternite','paternite','deces','autre') NOT NULL,
  `date_debut` date NOT NULL,
  `duree` int(11) NOT NULL,
  `motif` varchar(255) DEFAULT NULL,
  `piece_jointe` varchar(255) DEFAULT NULL,
  `statut` enum('soumis','approuve','refuse','en_cours') NOT NULL DEFAULT 'soumis',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `conges`
--

INSERT INTO `conges` (`id`, `matricule`, `agent`, `type`, `date_debut`, `duree`, `motif`, `piece_jointe`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'RH-002', 'DIOMANDÉ Karim', 'annuel', '2025-05-20', 14, NULL, NULL, 'approuve', '2026-06-16 01:46:02', '2026-06-16 01:46:02'),
(2, 'EC-001', 'TRAORÉ Adjoa', 'maladie', '2025-06-02', 3, NULL, NULL, 'soumis', '2026-06-16 01:46:02', '2026-06-16 01:46:02'),
(3, 'ST-002', 'YAPI Kouadio', 'paternite', '2025-07-01', 10, NULL, NULL, 'en_cours', '2026-06-16 01:46:02', '2026-06-16 01:46:02');

-- --------------------------------------------------------

--
-- Structure de la table `departs`
--

CREATE TABLE `departs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `matricule` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `cause` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `derniere_presence` date DEFAULT NULL,
  `dernier_salaire` decimal(12,2) DEFAULT NULL,
  `observations` text DEFAULT NULL,
  `statut` enum('valide','attente') NOT NULL DEFAULT 'attente',
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
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `formations`
--

CREATE TABLE `formations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titre` varchar(255) NOT NULL,
  `organisme` varchar(255) NOT NULL,
  `formateur` varchar(255) DEFAULT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `agents` text DEFAULT NULL,
  `cout` decimal(12,2) NOT NULL DEFAULT 0.00,
  `statut` enum('programme','en_cours','termine') NOT NULL DEFAULT 'programme',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `formations`
--

INSERT INTO `formations` (`id`, `titre`, `organisme`, `formateur`, `date_debut`, `date_fin`, `agents`, `cout`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Formation GMDI — Module État Civil', 'DSI Mairie', NULL, '2025-06-10', '2025-06-12', 'EC-001, RH-002', 0.00, 'programme', '2026-06-16 01:46:02', '2026-06-16 01:46:02'),
(2, 'Gestion financière des collectivités', 'CGECI', NULL, '2025-07-01', '2025-07-05', 'FIN-001', 250000.00, 'programme', '2026-06-16 01:46:02', '2026-06-16 01:46:02');

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
(4, '2026_06_16_013330_create_personal_access_tokens_table', 1),
(5, '2026_06_16_013337_create_agents_table', 1),
(6, '2026_06_16_013338_create_conges_table', 1),
(7, '2026_06_16_013339_create_absences_table', 1),
(8, '2026_06_16_013339_create_recrutements_table', 1),
(9, '2026_06_16_013340_create_formations_table', 1),
(10, '2026_06_16_013341_create_departs_table', 1);

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
(1, 'App\\Models\\User', 1, 'rh-app', '5ea7997336775de1c46826d813dbd145b17b1c1cf072de47d44a3ee0f1b208e1', '[\"*\"]', NULL, NULL, '2026-06-16 01:46:11', '2026-06-16 01:46:11'),
(2, 'App\\Models\\User', 1, 'rh-app', '832053ea0e72df42a5fb445fa5d002d290a6c9df986f7c2dbb01ddb35b899112', '[\"*\"]', '2026-06-16 01:46:25', NULL, '2026-06-16 01:46:25', '2026-06-16 01:46:25'),
(3, 'App\\Models\\User', 1, 'rh-app', 'd49084b6ffff0a6bbcc3e3772bbb46efeb625a93808255bf1fb5ca67a4401019', '[\"*\"]', '2026-06-16 12:27:02', NULL, '2026-06-16 01:54:29', '2026-06-16 12:27:02'),
(5, 'App\\Models\\User', 1, 'rh-app', '794ff19257063ce74fcd04e0e54b1fe368896f3a2fa7cbce53d36ef0823beac6', '[\"*\"]', '2026-06-16 08:37:00', NULL, '2026-06-16 08:31:08', '2026-06-16 08:37:00'),
(7, 'App\\Models\\User', 1, 'rh-app', '10f687f16714c03b2c197c1825b9a0c367258f1137465ec61eb9b5aeb34117ab', '[\"*\"]', '2026-06-18 10:45:08', NULL, '2026-06-18 10:45:04', '2026-06-18 10:45:08'),
(8, 'App\\Models\\User', 1, 'rh-app', '25a4db3d6082b1ece53b8e94462236a6b49a9ff932fe80f58cbfc3354c927d6e', '[\"*\"]', '2026-06-18 10:45:27', NULL, '2026-06-18 10:45:23', '2026-06-18 10:45:27'),
(9, 'App\\Models\\User', 1, 'rh-app', '898c8b1d7e3051f9366314b5b9307be7ecb586abbf88a1a62bcc34fd1d1adc7b', '[\"*\"]', '2026-06-18 17:01:54', NULL, '2026-06-18 17:01:48', '2026-06-18 17:01:54'),
(10, 'App\\Models\\User', 1, 'rh-app', '1f9d891e965bda37643f0c2a9af8a11fee179ea56fb84357bdb2018664063744', '[\"*\"]', NULL, NULL, '2026-06-25 05:05:20', '2026-06-25 05:05:20'),
(11, 'App\\Models\\User', 1, 'rh-app', '8c0499cd2bf3093365f72968f901f8cf171113adee76f557806e5642c6fd3cd4', '[\"*\"]', NULL, NULL, '2026-06-25 05:08:07', '2026-06-25 05:08:07'),
(12, 'App\\Models\\User', 1, 'rh-app', '1bb09065e8e036efdc97473ddcc671849f84000ad541a55862141778ca7af96b', '[\"*\"]', NULL, NULL, '2026-06-25 05:09:19', '2026-06-25 05:09:19'),
(13, 'App\\Models\\User', 1, 'rh-app', '1f185669c1a7552644539a5693bf6a1333209275050682df48f7e09f0f8b557f', '[\"*\"]', NULL, NULL, '2026-06-25 10:25:43', '2026-06-25 10:25:43');

-- --------------------------------------------------------

--
-- Structure de la table `recrutements`
--

CREATE TABLE `recrutements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `poste` varchar(255) NOT NULL,
  `direction` varchar(255) NOT NULL,
  `nb_postes` int(11) NOT NULL,
  `type` enum('concours','direct','stage') NOT NULL,
  `cloture` date NOT NULL,
  `candidatures` int(11) NOT NULL DEFAULT 0,
  `statut` enum('en_cours','termine','annule') NOT NULL DEFAULT 'en_cours',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `recrutements`
--

INSERT INTO `recrutements` (`id`, `poste`, `direction`, `nb_postes`, `type`, `cloture`, `candidatures`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Agent de saisie État Civil', 'Direction État Civil', 2, 'concours', '2025-05-31', 14, 'en_cours', '2026-06-16 01:46:02', '2026-06-16 01:46:02'),
(2, 'Technicien Voirie', 'Services Techniques', 3, 'direct', '2025-04-30', 28, 'termine', '2026-06-16 01:46:02', '2026-06-16 01:46:02'),
(3, 'Agent de saisie', 'Direction Finances', 1, 'concours', '2009-03-24', 0, 'en_cours', '2026-06-16 01:57:55', '2026-06-16 01:57:55'),
(4, 'Agent de saisie', 'Direction Finances', 1, 'concours', '2027-05-24', 0, 'en_cours', '2026-06-16 08:35:35', '2026-06-16 08:35:35');

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
('6ImZST1YeOd8D2VpV2XMTDeQWEJdjXK2y1XfAHao', NULL, '127.0.0.1', 'PostmanRuntime/7.54.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid1BLZ2paNko4blhWRHFEYmt2SG1jS0RTZGJzT2NXbU1kWmw4cEJEWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781599616),
('7VX8tW2pSWKvmUeprbn7w8v804qUxdnQTSrhd8Fe', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTGtDa0l5aG9zNFNmaE9tcldNWEt4QjM5bmRNeW9WYlNzRndkNWhJYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781598930),
('8zWhpZRF6ZZxop0vDjAL1NTkBRDHKVzatR5gCWIX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.124.2 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidnpXUng0NUg4Qlk2ZlIyTlFoVFJoNVBOb2dyYlE1anFQY2xTWFhWaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781682222),
('CaEno8PyvfOU3DefEb4wPSyoEFsqpP8yblSWAck4', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.124.2 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTHRsSndmNzB5NDFBVlJiUnJZN09OUDVVRmV3VnRzWGZ0bWI4VjMzMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781612795),
('dFHqIT4JObnNfra8HdazjncQFrQNKloiD5l1l4hX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.124.2 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidmhidU12QVhJMXJVTWcwMDZUUWNwSENPelRwMXRpS2xFWVZXVzhrVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781648305),
('Em84FcYLzyrNR6x2T106Gt92lRhdS0Q0ZhHNO2GV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.124.2 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicjVHUk5jdUlYeHNLQVNPa3ZNWDRxMjdoeFBIbmlGT0s3WFVCYlB3UiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781574772),
('mDgnd2CTM3Jf4V8Gq6V6sR8dovDH2PNsgT9uQ9J0', NULL, '::1', 'curl/8.18.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUTZDSWNuQk1XWHJHWjRqcW9YVE1WbHVQSnZOTWVqT2Y5V2JXbVFHVyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1782364073),
('vqLfSPiZEJkhhp9iedYo7t3f0WjqTgqdfiBaAM9y', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.0 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT2ZZemhMdDUzSVBxQ3phN2c0VFVJY0RNdmU3b3pLVGlwS1ZYaUFzaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781802043),
('vQNdsTdf8ap9jnZ5cy17XaguW3OwoW3zg0zWfz8c', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.124.2 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRldpT3pYSm1ZeXdXWkQwZ2JNQjREM0l4cVBnUU9uMEVsOGVnbGdMMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1781779443);

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
(1, 'Mariam Ouattara', 'drh@mairie.ci', NULL, '$2y$12$XaODILyAR6TicQFQIngnc.f1xnm0GUfozjyjkYyYLbgf8n74HSy4e', 'drh', NULL, '2026-06-16 01:46:02', '2026-06-16 01:46:02');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `absences`
--
ALTER TABLE `absences`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `agents_matricule_unique` (`matricule`),
  ADD UNIQUE KEY `agents_email_unique` (`email`);

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
-- Index pour la table `conges`
--
ALTER TABLE `conges`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `departs`
--
ALTER TABLE `departs`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `formations`
--
ALTER TABLE `formations`
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
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
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
-- Index pour la table `recrutements`
--
ALTER TABLE `recrutements`
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
-- AUTO_INCREMENT pour la table `absences`
--
ALTER TABLE `absences`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `agents`
--
ALTER TABLE `agents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `conges`
--
ALTER TABLE `conges`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `departs`
--
ALTER TABLE `departs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `formations`
--
ALTER TABLE `formations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `recrutements`
--
ALTER TABLE `recrutements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
