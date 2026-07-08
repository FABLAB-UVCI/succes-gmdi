<?php

namespace Tests\Unit;

use Illuminate\Support\Str;
use PHPUnit\Framework\TestCase;

class StrCompatibilityTest extends TestCase
{
    public function test_studly_works_for_simple_values(): void
    {
        $this->assertSame('Database', Str::studly('database'));
    }
}
