-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 26 juin 2026 à 12:49
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
-- Base de données : `gmdi_communication`
--

-- --------------------------------------------------------

--
-- Structure de la table `actualites`
--

CREATE TABLE `actualites` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` enum('communique','annonce','evenement') NOT NULL,
  `titre` varchar(250) NOT NULL,
  `contenu` text NOT NULL,
  `auteur` varchar(150) NOT NULL DEFAULT 'Service Communication',
  `date` date NOT NULL,
  `statut` enum('publie','brouillon') NOT NULL DEFAULT 'brouillon',
  `categorie` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `actualites`
--

INSERT INTO `actualites` (`id`, `type`, `titre`, `contenu`, `auteur`, `date`, `statut`, `categorie`, `created_at`, `updated_at`) VALUES
(1, 'evenement', 'Ouverture du nouveau marché municipal', 'Le Maire a inauguré le nouveau marché ce samedi 24 mai en présence des élus locaux et des commerçants.', 'Service Communication', '2025-05-24', 'publie', 'evenement', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(2, 'annonce', 'Campagne de vaccination — Saison des pluies', 'La mairie organise en partenariat avec le Ministère de la Santé une campagne de vaccination gratuite les 10 et 11 juin 2025.', 'Service Communication', '2025-05-20', 'publie', 'sante', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(3, 'communique', 'Budget rectificatif 2025 adopté', 'Le Conseil Municipal a adopté lors de sa séance du 15 mai le budget rectificatif 2025 à l\'unanimité.', 'Service Communication', '2025-05-16', 'publie', 'institution', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(4, 'annonce', 'Travaux voirie secteur nord — Perturbations', 'Des travaux de réfection sont prévus du 1er au 30 juin dans le secteur nord.', 'Services Techniques', '2025-05-28', 'publie', 'travaux', '2026-06-16 20:06:17', '2026-06-16 20:28:07'),
(5, 'communique', 'La commune de San Pedro', 'Construction d\'un parc d\'attraction', 'Service Communication', '2026-02-23', 'publie', NULL, '2026-06-25 15:02:03', '2026-06-25 15:02:03'),
(6, 'annonce', 'Collecte de fond', 'Ils passeront chercher les cotisations!', 'Service Communication', '2026-06-25', 'publie', 'Recrutement', '2026-06-25 15:03:10', '2026-06-25 15:03:10'),
(7, 'evenement', 'Fête de génération', 'Manger, boire et s\'amuser | Lieu: Parc Dominique Ouattara | 15:00 – 18:00 | Public: Tous les citoyens', 'Mairie', '2026-06-26', 'publie', NULL, '2026-06-25 15:04:37', '2026-06-25 15:04:37');

-- --------------------------------------------------------

--
-- Structure de la table `articles_presse`
--

CREATE TABLE `articles_presse` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `media` varchar(100) NOT NULL,
  `titre` varchar(300) NOT NULL,
  `type` enum('TV','Radio','Presse écrite','Web') NOT NULL,
  `tonalite` enum('Positive','Neutre','Mitigée','Négative') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `articles_presse`
--

INSERT INTO `articles_presse` (`id`, `date`, `media`, `titre`, `type`, `tonalite`, `created_at`, `updated_at`) VALUES
(1, '2025-05-24', 'RTI 1', 'La commune inaugure son nouveau marché municipal', 'TV', 'Positive', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(2, '2025-05-23', 'Fraternité Matin', 'Budget rectificatif 2025 adopté par le Conseil', 'Presse écrite', 'Neutre', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(3, '2025-05-21', 'NCI', 'Collecte des ordures : les points noirs identifiés', 'TV', 'Mitigée', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(4, '2025-05-18', 'Radio Nationale', 'Interview du Maire — Bilan travaux voirie', 'Radio', 'Positive', '2026-06-16 20:06:17', '2026-06-16 20:06:17');

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
-- Structure de la table `campagne_sms`
--

CREATE TABLE `campagne_sms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(200) NOT NULL,
  `type` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `destinataires` varchar(100) NOT NULL,
  `nb_destinataires` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `date_envoi` date NOT NULL,
  `statut` enum('envoye','programme','echec') NOT NULL DEFAULT 'programme',
  `taux_livraison` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `campagne_sms`
--

INSERT INTO `campagne_sms` (`id`, `nom`, `type`, `message`, `destinataires`, `nb_destinataires`, `date_envoi`, `statut`, `taux_livraison`, `created_at`, `updated_at`) VALUES
(1, 'Collecte ordures — Rappel', 'info', 'MAIRIE — Rappel : sortez vos poubelles le lundi avant 7h.', 'tous', 12500, '2025-05-25', 'envoye', 94, '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(2, 'Taxe résidence — Relance', 'fiscal', 'MAIRIE — Taxe résidence 2025 due avant le 30 juin. Paiement : Orange Money 1234 ou mairie.', 'contribuables', 8200, '2025-05-20', 'envoye', 91, '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(3, 'Alerte travaux Av. H-B', 'travaux', 'MAIRIE — Fermeture Av. Houphouët-Boigny du 28 au 30 mai. Emprunter itinéraires de déviation.', 'quartier', 3800, '2025-05-18', 'envoye', 97, '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(4, 'Campagne vaccination juin', 'sante', 'MAIRIE — Campagne vaccination gratuite 10-11 juin 2025. Centres de santé municipaux.', 'tous', 12500, '2025-06-01', 'programme', 0, '2026-06-16 20:06:17', '2026-06-16 20:06:17');

-- --------------------------------------------------------

--
-- Structure de la table `compte_reseaux`
--

CREATE TABLE `compte_reseaux` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `plateforme` enum('facebook','twitter','instagram','whatsapp') NOT NULL,
  `nom` varchar(150) NOT NULL,
  `handle` varchar(100) NOT NULL,
  `abonnes` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `publications` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `taux_engagement` decimal(4,1) NOT NULL DEFAULT 0.0,
  `porte_mois` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `dernier_post` varchar(250) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `compte_reseaux`
--

INSERT INTO `compte_reseaux` (`id`, `plateforme`, `nom`, `handle`, `abonnes`, `publications`, `taux_engagement`, `porte_mois`, `dernier_post`, `created_at`, `updated_at`) VALUES
(1, 'facebook', 'Mairie de la Commune', '@mairie.commune.ci', 4820, 248, 7.2, 12400, 'Inauguration marché — 24/05/2025 — 312 J\'aime', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(2, 'twitter', 'Mairie de la Commune', '@MairieCommuneCI', 2350, 420, 4.1, 5800, NULL, '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(3, 'instagram', 'Mairie de la Commune', '@mairie_commune_ci', 3940, 186, 9.4, 8200, NULL, '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(4, 'whatsapp', 'Info Mairie — Groupe officiel', '+225 07 00 00 00 60', 1690, 0, 92.0, 0, NULL, '2026-06-16 20:06:17', '2026-06-16 20:06:17');

-- --------------------------------------------------------

--
-- Structure de la table `consultation_publiques`
--

CREATE TABLE `consultation_publiques` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titre` varchar(250) NOT NULL,
  `theme` varchar(100) NOT NULL,
  `date_ouverture` date NOT NULL,
  `date_cloture` date NOT NULL,
  `participants` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `statut` enum('programme','actif','cloture') NOT NULL DEFAULT 'programme',
  `canaux` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `consultation_publiques`
--

INSERT INTO `consultation_publiques` (`id`, `titre`, `theme`, `date_ouverture`, `date_cloture`, `participants`, `statut`, `canaux`, `created_at`, `updated_at`) VALUES
(1, 'Avis sur le nouveau PLU', 'Urbanisme / Aménagement', '2025-05-15', '2025-06-15', 124, 'actif', 'En ligne + Physique', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(2, 'Budget participatif 2026', 'Budget / Finances', '2025-06-01', '2025-07-31', 0, 'programme', 'En ligne uniquement', '2026-06-16 20:06:17', '2026-06-16 20:06:17');

-- --------------------------------------------------------

--
-- Structure de la table `documents`
--

CREATE TABLE `documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titre` varchar(250) NOT NULL,
  `type` enum('photo','video','pdf','arrete','deliberation') NOT NULL,
  `categorie` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `auteur` varchar(150) DEFAULT NULL,
  `url` varchar(500) DEFAULT NULL,
  `droits` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `documents`
--

INSERT INTO `documents` (`id`, `titre`, `type`, `categorie`, `date`, `auteur`, `url`, `droits`, `created_at`, `updated_at`) VALUES
(1, 'Inauguration marché municipal', 'photo', 'Événements', '2025-05-24', 'Service Comm.', NULL, NULL, '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(2, 'Réunion Conseil Municipal mai', 'photo', 'Vie municipale', '2025-05-15', 'Service Comm.', NULL, NULL, '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(3, 'Travaux voirie secteur nord', 'photo', 'Travaux', '2025-05-10', 'Services Techniques', NULL, NULL, '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(4, 'Séance Conseil Municipal — 15 mai 2025', 'video', 'Séance du Conseil', '2025-05-15', NULL, NULL, NULL, '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(5, 'Inauguration marché — Reportage', 'video', 'Inauguration', '2025-05-24', NULL, NULL, NULL, '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(6, 'Délibération Conseil mai 2025', 'deliberation', 'Officiel', '2025-05-15', NULL, NULL, NULL, '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(7, 'Budget rectificatif 2025', 'pdf', 'Financier', '2025-05-10', NULL, NULL, NULL, '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(8, 'Arrêté n° ARR-2025-018', 'arrete', 'Juridique', '2025-05-22', NULL, NULL, NULL, '2026-06-16 20:06:17', '2026-06-16 20:06:17');

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
(4, '2025_01_01_000001_add_role_to_users_table', 1),
(5, '2025_01_01_000002_create_actualites_table', 1),
(6, '2025_01_01_000003_create_compte_reseaux_table', 1),
(7, '2025_01_01_000004_create_post_programmes_table', 1),
(8, '2025_01_01_000005_create_partenaires_table', 1),
(9, '2025_01_01_000006_create_articles_presse_table', 1),
(10, '2025_01_01_000007_create_documents_table', 1),
(11, '2025_01_01_000008_create_reclamations_table', 1),
(12, '2025_01_01_000009_create_suggestions_table', 1),
(13, '2025_01_01_000010_create_consultation_publiques_table', 1),
(14, '2025_01_01_000011_create_campagne_sms_table', 1),
(15, '2026_06_16_194936_create_permission_tables', 1),
(16, '2026_06_16_194936_create_personal_access_tokens_table', 1);

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
-- Structure de la table `partenaires`
--

CREATE TABLE `partenaires` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(200) NOT NULL,
  `type` varchar(100) NOT NULL,
  `domaine` varchar(150) NOT NULL,
  `contact` varchar(200) NOT NULL,
  `date_debut` date NOT NULL,
  `statut` enum('actif','inactif','suspendu') NOT NULL DEFAULT 'actif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `partenaires`
--

INSERT INTO `partenaires` (`id`, `nom`, `type`, `domaine`, `contact`, `date_debut`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'BNETD', 'Institution publique', 'Infrastructure et aménagement', 'Dir. Projets — 27 20 11 22', '2020-01-01', 'actif', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(2, 'UNICEF CI', 'Organisation internationale', 'Éducation, protection enfance', 'Rep. UNICEF — 27 20 33 44', '2019-06-01', 'actif', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(3, 'ONG Eau Pour Tous', 'ONG / Association', 'Eau potable zones rurales', 'Directrice — 07 88 99 00', '2023-03-15', 'actif', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(4, 'ONG Vie citoyenne', 'ONG / Association', 'Santé', '0705096874', '2026-05-24', 'actif', '2026-06-16 20:29:07', '2026-06-16 20:29:07');

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
(1, 'actualites.view', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(2, 'actualites.create', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(3, 'actualites.update', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(4, 'actualites.delete', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(5, 'reseaux.view', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(6, 'reseaux.create', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(7, 'reseaux.publier', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(8, 'relations.view', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(9, 'relations.create', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(10, 'documents.view', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(11, 'documents.create', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(12, 'reclamations.view', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(13, 'reclamations.create', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(14, 'reclamations.traiter', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(15, 'suggestions.view', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(16, 'suggestions.create', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(17, 'suggestions.transmettre', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(18, 'consultations.view', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(19, 'consultations.create', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(20, 'sms.view', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(21, 'sms.envoyer', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(22, 'sms.export', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(23, 'stats.view', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15');

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
-- Structure de la table `post_programmes`
--

CREATE TABLE `post_programmes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `contenu` text NOT NULL,
  `plateformes` varchar(100) NOT NULL,
  `responsable` varchar(150) NOT NULL DEFAULT 'Service Communication',
  `statut` enum('programme','publie','a_rediger','a_confirmer') NOT NULL DEFAULT 'programme',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `post_programmes`
--

INSERT INTO `post_programmes` (`id`, `date`, `contenu`, `plateformes`, `responsable`, `statut`, `created_at`, `updated_at`) VALUES
(1, '2025-06-02', 'Campagne vaccination — Sensibilisation', 'facebook,whatsapp', 'DIALLO F.', 'programme', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(2, '2025-06-05', 'Journée mondiale environnement', 'instagram,facebook', 'DIALLO F.', 'programme', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(3, '2025-06-10', 'Formation GMDI — Agents communaux', 'twitter', 'Comm.', 'programme', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(4, '2025-06-15', 'Bilan mensuel services municipaux', 'facebook,twitter,instagram,whatsapp', 'DIALLO F.', 'a_rediger', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(5, '2025-06-20', 'Inauguration parc de proximité', 'facebook,twitter,instagram,whatsapp', 'Comm.', 'a_confirmer', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(6, '2025-06-02', 'Campagne vaccination — Sensibilisation', 'facebook,whatsapp', 'DIALLO F.', 'programme', '2026-06-16 20:21:27', '2026-06-16 20:21:27'),
(7, '2025-06-05', 'Journée mondiale environnement', 'instagram,facebook', 'DIALLO F.', 'programme', '2026-06-16 20:21:27', '2026-06-16 20:21:27'),
(8, '2025-06-10', 'Formation GMDI — Agents communaux', 'twitter', 'Comm.', 'programme', '2026-06-16 20:21:27', '2026-06-16 20:21:27'),
(9, '2025-06-15', 'Bilan mensuel services municipaux', 'facebook,twitter,instagram,whatsapp', 'DIALLO F.', 'a_rediger', '2026-06-16 20:21:27', '2026-06-16 20:21:27'),
(10, '2025-06-20', 'Inauguration parc de proximité', 'facebook,twitter,instagram,whatsapp', 'Comm.', 'a_confirmer', '2026-06-16 20:21:27', '2026-06-16 20:21:27');

-- --------------------------------------------------------

--
-- Structure de la table `reclamations`
--

CREATE TABLE `reclamations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(20) NOT NULL,
  `objet` varchar(250) NOT NULL,
  `demandeur` varchar(200) NOT NULL,
  `service` varchar(100) NOT NULL,
  `canal` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `statut` enum('en_traitement','repondu','cloture') NOT NULL DEFAULT 'en_traitement',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reclamations`
--

INSERT INTO `reclamations` (`id`, `reference`, `objet`, `demandeur`, `service`, `canal`, `date`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'RCL-2025-042', 'Bruit excessif chantier nocturne', 'KOUAMÉ Sylvie', 'Services Techniques', 'guichet', '2025-05-23', 'repondu', '2026-06-16 20:06:17', '2026-06-16 20:30:32'),
(2, 'RCL-2025-041', 'Facture d\'eau incorrecte', 'AKA Martin', 'Finances', 'email', '2025-05-20', 'repondu', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(3, 'RCL-2025-040', 'Non délivrance d\'acte de naissance', 'TRAORÉ Bakary', 'État Civil', 'guichet', '2025-05-18', 'repondu', '2026-06-16 20:06:17', '2026-06-16 20:06:17');

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
(1, 'chef_communication', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(2, 'agent_communication', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(3, 'responsable_rs', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15'),
(4, 'admin', 'sanctum', '2026-06-16 20:06:15', '2026-06-16 20:06:15');

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
(3, 4),
(4, 1),
(4, 4),
(5, 1),
(5, 2),
(5, 3),
(5, 4),
(6, 1),
(6, 2),
(6, 3),
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
(17, 4),
(18, 1),
(18, 2),
(18, 4),
(19, 1),
(19, 2),
(19, 4),
(20, 1),
(20, 2),
(20, 4),
(21, 1),
(21, 2),
(21, 4),
(22, 1),
(22, 4),
(23, 1),
(23, 2),
(23, 3),
(23, 4);

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
-- Structure de la table `suggestions`
--

CREATE TABLE `suggestions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(20) NOT NULL,
  `objet` varchar(250) NOT NULL,
  `citoyen` varchar(150) NOT NULL DEFAULT 'Anonyme',
  `description` varchar(500) DEFAULT NULL,
  `date` date NOT NULL,
  `statut` enum('recu','en_etude','transmis','rejete') NOT NULL DEFAULT 'recu',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `suggestions`
--

INSERT INTO `suggestions` (`id`, `reference`, `objet`, `citoyen`, `description`, `date`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'SUG-2025-015', 'Installer des bancs publics Place République', 'AKA Martin', 'Il n\'y a aucun endroit pour s\'asseoir', '2025-05-20', 'transmis', '2026-06-16 20:06:17', '2026-06-16 20:06:17'),
(2, 'SUG-2025-014', 'Ouvrir un espace lecture à la médiathèque', 'BROU Akissi', 'Accès gratuit aux livres pour tous', '2025-05-18', 'en_etude', '2026-06-16 20:06:17', '2026-06-16 20:06:17');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('chef_communication','agent_communication','responsable_rs','admin') NOT NULL DEFAULT 'agent_communication',
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
(1, 'DIALLO Fatoumata', 'communication@mairie.ci', 'chef_communication', NULL, '$2y$12$XlOLbRMu1nVQDYO5hOYDDuhYXpqMY2iN3aBT18NaKkqM7D.re62UG', NULL, '2026-06-16 20:06:16', '2026-06-16 20:06:16'),
(2, 'KOUAMÉ Brice', 'agent.com@mairie.ci', 'agent_communication', NULL, '$2y$12$miaMSulBPnTgXauhawwoXuH9kRCyyrUNkXhY7cjWMtk4JHYwfbAD2', NULL, '2026-06-16 20:06:16', '2026-06-16 20:06:16'),
(3, 'YAO Prisca', 'rs@mairie.ci', 'responsable_rs', NULL, '$2y$12$sc.O.HTteGQxnFaAKxZyv.yBsYhgh62NdmRov9J113IF4QxMAuVsO', NULL, '2026-06-16 20:06:16', '2026-06-16 20:06:16'),
(4, 'Admin GMDI', 'admin@mairie.ci', 'admin', NULL, '$2y$12$EunEEISKScDo1KdfbeKwCe7VwBkGAEBGzSMy9eq5SvoQV.jSMWSNC', NULL, '2026-06-16 20:06:17', '2026-06-16 20:06:17');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `actualites`
--
ALTER TABLE `actualites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `actualites_type_statut_index` (`type`,`statut`),
  ADD KEY `actualites_date_index` (`date`);

--
-- Index pour la table `articles_presse`
--
ALTER TABLE `articles_presse`
  ADD PRIMARY KEY (`id`),
  ADD KEY `articles_presse_date_index` (`date`);

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
-- Index pour la table `campagne_sms`
--
ALTER TABLE `campagne_sms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `campagne_sms_statut_date_envoi_index` (`statut`,`date_envoi`);

--
-- Index pour la table `compte_reseaux`
--
ALTER TABLE `compte_reseaux`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `compte_reseaux_plateforme_unique` (`plateforme`);

--
-- Index pour la table `consultation_publiques`
--
ALTER TABLE `consultation_publiques`
  ADD PRIMARY KEY (`id`),
  ADD KEY `consultation_publiques_statut_index` (`statut`);

--
-- Index pour la table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `documents_type_date_index` (`type`,`date`);

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
-- Index pour la table `partenaires`
--
ALTER TABLE `partenaires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `partenaires_statut_index` (`statut`);

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
-- Index pour la table `post_programmes`
--
ALTER TABLE `post_programmes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_programmes_date_index` (`date`);

--
-- Index pour la table `reclamations`
--
ALTER TABLE `reclamations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reclamations_reference_unique` (`reference`),
  ADD KEY `reclamations_statut_date_index` (`statut`,`date`);

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
-- Index pour la table `suggestions`
--
ALTER TABLE `suggestions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `suggestions_reference_unique` (`reference`),
  ADD KEY `suggestions_statut_index` (`statut`);

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
-- AUTO_INCREMENT pour la table `actualites`
--
ALTER TABLE `actualites`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `articles_presse`
--
ALTER TABLE `articles_presse`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `campagne_sms`
--
ALTER TABLE `campagne_sms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `compte_reseaux`
--
ALTER TABLE `compte_reseaux`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `consultation_publiques`
--
ALTER TABLE `consultation_publiques`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `partenaires`
--
ALTER TABLE `partenaires`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `post_programmes`
--
ALTER TABLE `post_programmes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `reclamations`
--
ALTER TABLE `reclamations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `suggestions`
--
ALTER TABLE `suggestions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
