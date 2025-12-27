<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        $cart = Auth::user()->cart()->with('items.product')->first();

        if (!$cart) {
            return response()->json(['items' => [], 'total' => 0]);
        }

        $total = $cart->items->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return response()->json([
            'items' => $cart->items,
            'total' => $total
        ]);
    }

    // Tambah produk ke keranjang
   public function add(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity' => 'integer|min:1'
    ]);

    $user = Auth::user();
    $productId = $request->product_id;
    $addQuantity = $request->quantity; 

    // Dapatkan atau buat cart
    $cart = $user->cart ?? Cart::create(['user_id' => $user->id]);

    // Cari apakah item sudah ada di cart
    $cartItem = CartItem::where('cart_id', $cart->id)
                        ->where('product_id', $productId)
                        ->first();

    if ($cartItem) {
        $cartItem->increment('quantity', $addQuantity);
    } else {
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $productId,
            'quantity' => $addQuantity
        ]);
    }

    $cart->load('items.product');

    $total = $cart->items->sum(fn($item) => $item->quantity * $item->product->price);

    return response()->json([
        'message' => 'Produk ditambahkan ke keranjang',
        'cart' => $cart->items,
        'total' => $total
    ]);
}

    // Hapus item dari keranjang
    public function remove(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $user = Auth::user();
        $cart = $user->cart;

        if (!$cart) {
            return response()->json(['message' => 'Keranjang kosong'], 404);
        }

        CartItem::where('cart_id', $cart->id)
                ->where('product_id', $request->product_id)
                ->delete();

        $cart->load('items.product');

        $total = $cart->items->sum(fn($item) => $item->quantity * $item->product->price);

        return response()->json([
            'message' => 'Produk dihapus dari keranjang',
            'cart' => $cart->items,
            'total' => $total
        ]);
    }

    // Kosongkan seluruh keranjang (opsional)
    public function clear()
    {
        $user = Auth::user();
        if ($user->cart) {
            $user->cart->items()->delete();
        }

        return response()->json(['message' => 'Keranjang dikosongkan']);
    }
}