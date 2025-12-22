<?php

namespace App\Console\Commands;

use App\Services\MachineIdService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class InstallLicense extends Command
{
   protected $signature = 'license:install {key}';
    protected $description = 'Install and activate license';

    public function handle()
    {
        $licenseKey = $this->argument('key');
        $machineId  = MachineIdService::generate();
        // dd($licenseKey, $machineId);
        if (Storage::exists('license.json')) {
            $this->error('License already installed.');
            return;
        }

      $response = Http::withHeaders([
    'X-API-KEY' => config('license.api_key'),
    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept' => 'application/json',
])
->post(config('license.server_url') . '/api/validate', [
    'license_key' => $licenseKey,
    'machine_id' => $machineId,
    'ip' => 'cli',
]);

if (! $response->successful()) {
    $this->error($response->json('message') ?? 'Activation failed');
    return;
}

        Storage::put('license.json', json_encode([
            'license_key'     => $licenseKey,
            'machine_id'      => $machineId,
            'activated_at'    => now(),
            'last_checked_at' => now(),
        ], JSON_PRETTY_PRINT));

        $this->info('License activated successfully.');
    }
}