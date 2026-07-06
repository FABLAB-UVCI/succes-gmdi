<?php

namespace App\Modules\EtatCivil\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\EtatCivil\Models\Certificat;
use App\Modules\EtatCivil\Models\Deces;
use App\Modules\EtatCivil\Models\Mariage;
use App\Modules\EtatCivil\Models\Naissance;
use Illuminate\Http\Request;

class StatistiquesController extends Controller
{
    public function index()
    {
        $year = date('Y');

        return response()->json([
            'totaux' => [
                'naissances' => Naissance::count(),
                'mariages' => Mariage::count(),
                'deces' => Deces::count(),
                'certificats' => Certificat::count(),
            ],
            'annee' => [
                'naissances' => Naissance::whereYear('created_at', $year)->count(),
                'mariages' => Mariage::whereYear('created_at', $year)->count(),
                'deces' => Deces::whereYear('created_at', $year)->count(),
                'certificats' => Certificat::whereYear('created_at', $year)->count(),
            ],
            'mensuel' => [
                'naissances' => $this->parMois(Naissance::class),
                'mariages' => $this->parMois(Mariage::class),
                'deces' => $this->parMois(Deces::class),
            ],
        ]);
    }

    private function parMois(string $model): array
    {
        $result = array_fill(1, 12, 0);
        $data = $model::selectRaw('MONTH(created_at) as mois, COUNT(*) as total')
            ->whereYear('created_at', date('Y'))
            ->groupBy('mois')
            ->pluck('total', 'mois');

        foreach ($data as $mois => $total) {
            $result[$mois] = $total;
        }

        return array_values($result);
    }
}
