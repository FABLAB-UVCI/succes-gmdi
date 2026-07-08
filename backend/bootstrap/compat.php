<?php

if (!function_exists('mb_split')) {
    function mb_split(string $pattern, string $string, int $limit = -1): array
    {
        $regex = '/' . str_replace('/', '\\/', $pattern) . '/';
        $parts = preg_split($regex, $string, $limit);

        return $parts === false ? [] : $parts;
    }
}
