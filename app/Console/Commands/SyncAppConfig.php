<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SyncAppConfig extends Command
{
    protected $signature = 'config:sync-app';

    protected $description = 'Sync AppConfig.js ke config/app_config.php';

    public function handle()
    {
        $jsPath = resource_path('js/config/app.js'); // sesuaikan path AppConfig.js-mu
        $phpPath = config_path('app_config.php');

        if (!File::exists($jsPath)) {
            $this->error('File AppConfig.js tidak ditemukan di ' . $jsPath);
            return 1;
        }

        $jsContent = File::get($jsPath);

        // Parse sederhana (extract key: value dari object JS)
        preg_match_all("/\s*([a-zA-Z0-9_]+)\s*:\s*'([^']*)'|,?\s*\"([^\"]*)\"/", $jsContent, $matches);

        $config = [];
        for ($i = 0; $i < count($matches[1]); $i++) {
            $key = $matches[1][$i];
            $value = $matches[2][$i] ?: $matches[3][$i];
            if ($key) {
                $config[$key] = $value;
            }
        }

        // Default jika tidak ada
        $default = [
            'appName' => 'Toko Online UAS',
            'shortName' => 'UAS Toko',
            'navbarTitle' => 'UAS_NAMA_KAMU',
            'logoUrl' => 'https://static.vecteezy.com/system/resources/previews/053/716/761/non_2x/minimalist-shopping-cart-icon-on-a-transparent-background-perfect-for-illustrating-ecommerce-retail-or-online-shopping-concepts-png.png',
            'description' => 'Toko Online Modern untuk UAS Laravel + React',
        ];

        $config = array_merge($default, $config);

        $phpContent = "<?php\n\nreturn " . var_export($config, true) . ";\n";

        File::put($phpPath, $phpContent);

        $this->info('AppConfig berhasil disync ke config/app_config.php');
        $this->info('Sekarang ubah di AppConfig.js, lalu jalankan: php artisan config:sync-app');

        return 0;
    }
}