<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class PrintProductController extends Controller
{
    public function print()
    {
        $products = Product::all();
        $pdf = Pdf::loadView('print.products', compact('products'));
        return $pdf->download('daftar-produk.pdf');
    }
}