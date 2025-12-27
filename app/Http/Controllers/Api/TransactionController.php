<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function checkout()
    {
        $user = Auth::user();
        $cart = $user->cart?->load('items.product');

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Keranjang kosong'], 400);
        }

        $total = $cart->items->sum(fn($item) => $item->quantity * $item->product->price);

        return DB::transaction(function () use ($user, $cart, $total) {
            // Buat transaksi
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'total_price' => $total,
                'status' => 'completed'
            ]);

            // Pindahkan cart items ke transaction items
            foreach ($cart->items as $item) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price  // snapshot harga saat ini
                ]);
            }

            // Kosongkan keranjang
            $cart->items()->delete();

            $transaction->load('items.product');

            return response()->json([
                'message' => 'Checkout berhasil!',
                'transaction' => $transaction,
                'total' => $total
            ], 201);
        });
    }

    // Lihat riwayat transaksi
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            // Admin lihat semua transaksi
            $transactions = Transaction::with('user', 'items.product')->latest()->get();
        } else {
            // User biasa hanya lihat milik sendiri
            $transactions = $user->transactions()->with('items.product')->latest()->get();
        }

        return response()->json($transactions);
    }

    // Lihat detail satu transaksi (opsional)
    public function show(Transaction $transaction)
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $transaction->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $transaction->load('items.product', 'user');
        return $transaction;
    }

    public function print(Transaction $transaction)
{
    $user = Auth::user();

    if ($user->role !== 'admin' && $transaction->user_id !== $user->id) {
        abort(403);
    }

    $pdf = PDF::loadView('pdf.transaction', ['transaction' => $transaction->load('items.product', 'user')]);

    return $pdf->download('bukti-transaksi-' . $transaction->id . '.pdf');
}
}