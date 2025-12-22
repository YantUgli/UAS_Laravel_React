<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class LicenseService
{
     public static function isValid(): bool
    {
        if (! Storage::exists('license.json')) {
            return false;
        }

        $data = json_decode(Storage::get('license.json'), true);

        return isset($data['license_key'], $data['machine_id']);
    }
}