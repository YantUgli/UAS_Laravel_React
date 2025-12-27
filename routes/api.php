<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Get Product
Route::get('/products', [ProductController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {

    // Hanya admin yang boleh CRUD produk
    Route::middleware('admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    });

    // Cart routes - semua user yang login
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/add', [CartController::class, 'add']);
        Route::post('/remove', [CartController::class, 'remove']);
        Route::post('/clear', [CartController::class, 'clear']);
    });

    // Transaction routes
    Route::post('/checkout', [TransactionController::class, 'checkout']);
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);
    Route::get('transactions/{transaction}/print', [TransactionController::class, 'print']);

    // Bonus: endpoint user info
    Route::get('/user', fn(Request $request) => $request->user());
});