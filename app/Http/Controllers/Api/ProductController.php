<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(){
        return Product::latest()->get();
    }

    public function store(Request $request){
        $data = $request->validate([
            'name' => 'required',
            'price' => 'required|integer',
            'image' => 'nullable|image',
            'description' => 'nullable'
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        return Product::create($data);
    }

    public function update(Request $request, Product $product){
        $data = $request->all();

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);
        return $product;
    }

    public function destroy(Product $product){
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }
}