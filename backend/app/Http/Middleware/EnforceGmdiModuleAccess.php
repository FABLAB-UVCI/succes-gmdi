<?php

namespace App\Http\Middleware;

use App\Support\GmdiAccess;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnforceGmdiModuleAccess
{
    /** @var list<string> */
    private const SKIP_PREFIXES = ['auth', 'public', 'demarches', 'admin', 'citoyen'];

    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return $next($request);
        }

        $parts = explode('/', trim($request->path(), '/'));
        $apiSegment = $parts[0] ?? '';
        if ($apiSegment !== 'api') {
            return $next($request);
        }

        $prefix = $parts[1] ?? '';
        if (in_array($prefix, self::SKIP_PREFIXES, true)) {
            return $next($request);
        }

        $module = GmdiAccess::resolveModuleFromPath($request->path());
        if ($module === null) {
            return $next($request);
        }

        if (! GmdiAccess::canAccessModule($request->user(), $module)) {
            return response()->json(['message' => 'Accès refusé à ce module.'], 403);
        }

        return $next($request);
    }
}
