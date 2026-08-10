<?php

namespace Database\Seeders;

use App\Modules\EtatCivil\Models\Mariage;
use App\Modules\Finances\Models\Depense;
use App\Modules\Patrimoine\Models\Bien;
use App\Modules\Rh\Models\Agent;
use Illuminate\Database\Seeder;

/**
 * Données de démonstration pour les modules qui étaient vides (Patrimoine,
 * RH, Mariages, Dépenses) — utile pour les démos/soutenances où chaque
 * module doit montrer quelque chose de concret. Rejouable sans doublon :
 * chaque bloc vérifie l'absence de données avant d'insérer.
 */
class DemoDataSeeder extends Seeder
{
    private const BIEN_PREFIX = [
        'mobilier'     => 'MOB',
        'informatique' => 'INF',
        'vehicule'     => 'VEH',
        'equipement'   => 'EQP',
        'immobilier'   => 'IMM',
        'terrain'      => 'TER',
    ];

    public function run(): void
    {
        $this->seedBiens();
        $this->seedAgents();
        $this->seedMariages();
        $this->seedDepenses();
    }

    private function seedBiens(): void
    {
        if (Bien::count() > 0) {
            return;
        }

        $biens = [
            ['categorie' => 'vehicule', 'designation' => 'Toyota Land Cruiser — Véhicule du Maire', 'localisation' => 'Garage municipal, Cocody', 'affectation' => 'Cabinet du Maire', 'statut' => 'disponible', 'etat' => 'bon', 'valeur_acquisition' => 28000000, 'taux_amortissement' => 20, 'date_acquisition' => '2023-03-10'],
            ['categorie' => 'vehicule', 'designation' => 'Camion benne — Collecte des ordures', 'localisation' => 'Dépôt Services Techniques', 'affectation' => 'Services Techniques', 'statut' => 'disponible', 'etat' => 'moyen', 'valeur_acquisition' => 19500000, 'taux_amortissement' => 20, 'date_acquisition' => '2021-06-22'],
            ['categorie' => 'informatique', 'designation' => 'Serveur applicatif principal (Dell PowerEdge)', 'localisation' => 'Salle serveur, Hôtel de ville', 'affectation' => 'Direction des Systèmes d\'Information', 'statut' => 'disponible', 'etat' => 'bon', 'valeur_acquisition' => 4200000, 'taux_amortissement' => 33, 'date_acquisition' => '2024-01-15'],
            ['categorie' => 'informatique', 'designation' => 'Lot de 12 ordinateurs de bureau — Guichets État civil', 'localisation' => 'Guichet État civil', 'affectation' => 'État civil', 'statut' => 'disponible', 'etat' => 'bon', 'valeur_acquisition' => 7200000, 'taux_amortissement' => 33, 'date_acquisition' => '2023-09-01'],
            ['categorie' => 'mobilier', 'designation' => 'Mobilier de bureau — Salle du Conseil municipal', 'localisation' => 'Hôtel de ville, 2e étage', 'affectation' => 'Secrétariat général', 'statut' => 'disponible', 'etat' => 'bon', 'valeur_acquisition' => 3500000, 'taux_amortissement' => 10, 'date_acquisition' => '2022-11-05'],
            ['categorie' => 'equipement', 'designation' => 'Groupe électrogène 100 kVA', 'localisation' => 'Hôtel de ville, sous-sol', 'affectation' => 'Services Techniques', 'statut' => 'maintenance', 'etat' => 'moyen', 'valeur_acquisition' => 9800000, 'taux_amortissement' => 15, 'date_acquisition' => '2020-04-18'],
            ['categorie' => 'immobilier', 'designation' => 'Centre culturel municipal', 'localisation' => 'Quartier Angré, Cocody', 'affectation' => 'Communication & Culture', 'statut' => 'disponible', 'etat' => 'bon', 'valeur_acquisition' => 85000000, 'taux_amortissement' => 5, 'date_acquisition' => '2018-07-01'],
            ['categorie' => 'terrain', 'designation' => 'Réserve foncière — Extension cimetière communal', 'localisation' => 'Route de Bingerville', 'affectation' => 'Urbanisme', 'statut' => 'disponible', 'etat' => 'bon', 'valeur_acquisition' => 42000000, 'taux_amortissement' => 0, 'date_acquisition' => '2019-02-14'],
        ];

        foreach ($biens as $b) {
            $prefix = self::BIEN_PREFIX[$b['categorie']] ?? 'GEN';
            Bien::create(array_merge($b, [
                'reference' => Bien::nextReference($b['categorie'], $prefix),
                'valeur_actuelle' => $b['valeur_acquisition'],
                'qr_code' => 'QR-' . strtoupper(uniqid()),
            ]));
        }
    }

    private function seedAgents(): void
    {
        if (Agent::count() > 0) {
            return;
        }

        $agents = [
            ['nom' => 'Kouassi', 'prenom' => 'Adjoua Marie', 'poste' => 'Officier d\'état civil', 'direction' => 'État civil', 'type_contrat' => 'fonctionnaire', 'categorie' => 'A', 'grade' => 'Attaché principal', 'genre' => 'F', 'date_naissance' => '1985-04-12', 'date_embauche' => '2012-09-01', 'telephone' => '0707010203', 'email' => 'a.kouassi@emairie.ci', 'salaire_brut' => 450000, 'situation_familiale' => 'Mariée', 'diplome' => 'Master Droit public'],
            ['nom' => 'Yao', 'prenom' => 'Konan Serge', 'poste' => 'Comptable public', 'direction' => 'Finances', 'type_contrat' => 'fonctionnaire', 'categorie' => 'A', 'grade' => 'Attaché', 'genre' => 'M', 'date_naissance' => '1988-11-03', 'date_embauche' => '2015-02-16', 'telephone' => '0707010204', 'email' => 'k.yao@emairie.ci', 'salaire_brut' => 420000, 'situation_familiale' => 'Marié', 'diplome' => 'Licence Comptabilité'],
            ['nom' => 'Traoré', 'prenom' => 'Fatoumata', 'poste' => 'Responsable Ressources Humaines', 'direction' => 'Ressources Humaines', 'type_contrat' => 'fonctionnaire', 'categorie' => 'A', 'grade' => 'Administrateur', 'genre' => 'F', 'date_naissance' => '1980-01-27', 'date_embauche' => '2008-05-19', 'telephone' => '0707010205', 'email' => 'f.traore@emairie.ci', 'salaire_brut' => 520000, 'situation_familiale' => 'Mariée', 'diplome' => 'Master GRH'],
            ['nom' => 'N\'Guessan', 'prenom' => 'Yves Patrick', 'poste' => 'Technicien voirie', 'direction' => 'Services Techniques', 'type_contrat' => 'contractuel', 'categorie' => 'B', 'grade' => 'Technicien supérieur', 'genre' => 'M', 'date_naissance' => '1992-07-08', 'date_embauche' => '2019-03-11', 'telephone' => '0707010206', 'email' => 'y.nguessan@emairie.ci', 'salaire_brut' => 280000, 'situation_familiale' => 'Célibataire', 'diplome' => 'BTS Génie civil'],
            ['nom' => 'Coulibaly', 'prenom' => 'Aminata', 'poste' => 'Agent d\'accueil', 'direction' => 'Communication', 'type_contrat' => 'contractuel', 'categorie' => 'C', 'grade' => 'Agent d\'exécution', 'genre' => 'F', 'date_naissance' => '1996-09-22', 'date_embauche' => '2021-10-04', 'telephone' => '0707010207', 'email' => 'a.coulibaly@emairie.ci', 'salaire_brut' => 180000, 'situation_familiale' => 'Célibataire', 'diplome' => 'BAC'],
            ['nom' => 'Diabaté', 'prenom' => 'Moussa', 'poste' => 'Chargé d\'urbanisme', 'direction' => 'Urbanisme', 'type_contrat' => 'fonctionnaire', 'categorie' => 'A', 'grade' => 'Attaché', 'genre' => 'M', 'date_naissance' => '1987-02-14', 'date_embauche' => '2014-01-20', 'telephone' => '0707010208', 'email' => 'm.diabate@emairie.ci', 'salaire_brut' => 400000, 'situation_familiale' => 'Marié', 'diplome' => 'Master Urbanisme'],
            ['nom' => 'Bamba', 'prenom' => 'Ismaël', 'poste' => 'Stagiaire — Systèmes d\'information', 'direction' => 'Ressources Humaines', 'type_contrat' => 'stage', 'categorie' => 'Stagiaire', 'grade' => 'Stagiaire', 'genre' => 'M', 'date_naissance' => '2001-05-30', 'date_embauche' => '2026-06-01', 'telephone' => '0707010209', 'email' => 'i.bamba@emairie.ci', 'salaire_brut' => 75000, 'situation_familiale' => 'Célibataire', 'diplome' => 'Licence Informatique'],
        ];

        foreach ($agents as $i => $a) {
            Agent::create(array_merge($a, [
                'matricule' => 'AG-' . date('Y') . '-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'nom_complet' => $a['prenom'] . ' ' . $a['nom'],
                'statut' => 'actif',
                'conges_restants' => 30,
            ]));
        }
    }

    private function seedMariages(): void
    {
        if (Mariage::count() > 0) {
            return;
        }

        $mariages = [
            ['epoux_nom' => 'Kouadio', 'epoux_prenom' => 'Jean-Baptiste', 'epoux_profession' => 'Ingénieur', 'epouse_nom' => 'Assamoi', 'epouse_prenom' => 'Grace', 'epouse_profession' => 'Enseignante', 'date_mariage' => '2026-04-18', 'lieu_mariage' => 'Hôtel de ville', 'commune' => 'Cocody', 'regime_matrimonial' => 'Séparation de biens', 'temoin1_nom' => 'Kouassi Paul', 'temoin1_profession' => 'Commerçant', 'temoin2_nom' => 'Aka Régine', 'temoin2_profession' => 'Infirmière'],
            ['epoux_nom' => 'Ouattara', 'epoux_prenom' => 'Ibrahim', 'epoux_profession' => 'Chauffeur', 'epouse_nom' => 'Koné', 'epouse_prenom' => 'Aïchatou', 'epouse_profession' => 'Coiffeuse', 'date_mariage' => '2026-05-02', 'lieu_mariage' => 'Hôtel de ville', 'commune' => 'Cocody', 'regime_matrimonial' => 'Communauté de biens', 'temoin1_nom' => 'Diallo Sékou', 'temoin1_profession' => 'Agriculteur', 'temoin2_nom' => 'Bakayoko Awa', 'temoin2_profession' => 'Couturière'],
            ['epoux_nom' => 'Brou', 'epoux_prenom' => 'Michel', 'epoux_profession' => 'Comptable', 'epouse_nom' => 'Tanoh', 'epouse_prenom' => 'Delphine', 'epouse_profession' => 'Pharmacienne', 'date_mariage' => '2026-06-13', 'lieu_mariage' => 'Hôtel de ville', 'commune' => 'Cocody', 'regime_matrimonial' => 'Séparation de biens', 'temoin1_nom' => 'Yapi Bertin', 'temoin1_profession' => 'Enseignant', 'temoin2_nom' => 'N\'Da Solange', 'temoin2_profession' => 'Secrétaire'],
        ];

        foreach ($mariages as $i => $m) {
            Mariage::create(array_merge($m, [
                'numero' => 'CI-CC-' . date('Y') . '-M-' . str_pad(Mariage::count() + 1, 6, '0', STR_PAD_LEFT),
                'statut' => 'Validé',
            ]));
        }
    }

    private function seedDepenses(): void
    {
        if (Depense::count() > 0) {
            return;
        }

        $depenses = [
            ['objet' => 'Achat fournitures de bureau', 'fournisseur' => 'Papeterie Ivoire SA', 'montant' => 850000, 'chapitre' => 'fonctionnement', 'article' => 'Fournitures', 'date_engagement' => '2026-06-05', 'statut' => 'paye', 'date_paiement' => '2026-06-12'],
            ['objet' => 'Réparation véhicules municipaux', 'fournisseur' => 'Garage Central Abidjan', 'montant' => 2350000, 'chapitre' => 'fonctionnement', 'article' => 'Parc automobile', 'date_engagement' => '2026-06-20', 'statut' => 'paye', 'date_paiement' => '2026-06-28'],
            ['objet' => 'Réhabilitation éclairage public', 'fournisseur' => 'CIE — Compagnie Ivoirienne d\'Électricité', 'montant' => 4100000, 'chapitre' => 'investissement', 'article' => 'Éclairage public', 'date_engagement' => '2026-07-02', 'statut' => 'engage', 'date_paiement' => null],
            ['objet' => 'Organisation cérémonie de mariage collectif', 'fournisseur' => 'Traiteur Saveurs d\'Abidjan', 'montant' => 1200000, 'chapitre' => 'fonctionnement', 'article' => 'Événementiel', 'date_engagement' => '2026-07-10', 'statut' => 'engage', 'date_paiement' => null],
        ];

        foreach ($depenses as $d) {
            Depense::create($d);
        }
    }
}
