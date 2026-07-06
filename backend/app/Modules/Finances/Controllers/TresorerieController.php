<?php

namespace App\Modules\Finances\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Finances\Models\MouvementBanque;
use App\Modules\Finances\Models\MouvementCaisse;

class TresorerieController extends Controller
{
    public function mouvementsCaisse()
    {
        return response()->json(MouvementCaisse::orderByDesc('date')->get());
    }

    public function mouvementsBanque()
    {
        return response()->json(MouvementBanque::orderByDesc('date')->get());
    }
}
