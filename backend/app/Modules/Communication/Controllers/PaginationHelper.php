<?php

namespace App\Modules\Communication\Controllers;

trait PaginationHelper
{
    private function meta($p): array
    {
        return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()];
    }
    private function links($p): array
    {
        return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()];
    }
}
