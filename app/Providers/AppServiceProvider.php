<?php

namespace App\Providers;

use App\Services\LicenseService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
         if (! app()->runningInConsole()) {
        if (! LicenseService::isValid()) {
            abort(403, 'License not installed');
        }
    }
    }
}