<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            ['name' => 'Laptop Gaming', 'price' => 15000000, 'description' => 'Laptop high-end untuk gaming'],
            ['name' => 'Smartphone Android', 'price' => 5000000, 'description' => 'HP dengan kamera bagus'],
            ['name' => 'Headphone Wireless', 'price' => 1000000, 'description' => 'Headphone noise cancelling'],
            ['name' => 'Mouse Gaming', 'price' => 500000, 'description' => 'Mouse ergonomis'],
            ['name' => 'Keyboard Mechanical', 'price' => 800000, 'description' => 'Keyboard RGB'],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}