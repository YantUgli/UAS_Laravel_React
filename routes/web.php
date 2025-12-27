<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\PrintProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
});

// Home
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/products', function () {
        return Inertia::render('Admin/Products');
    })->name('admin.products');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/cart', function () {
        return Inertia::render('Cart/Index');
    })->name('cart');

    Route::get('/transactions', function () {
        return Inertia::render('Transactions/Index');
    })->name('transactions');


     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Print Products
Route::get('/dashboard/print-products', [PrintProductController::class, 'print'])
    ->middleware('auth')
    ->name('dashboard.print.products');

require __DIR__.'/auth.php';