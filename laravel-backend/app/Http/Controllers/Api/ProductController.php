<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Siyahılama, Axtarış və Dinamik Filtrlər (Step 1)
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Kateqoriya filtri
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Cinsiyyət filtri (Kişi, Qadın, Uniseks)
        if ($request->filled('gender')) {
            $query->where(function ($q) use ($request) {
                $q->where('gender', $request->gender)
                  ->orWhere('gender', 'Uniseks');
            });
        }

        // Açar söz ilə axtarış (ad, təsvir, teqlər)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('composition', 'like', "%{$search}%");
            });
        }

        // Qiymət aralığı
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->max_price);
        }

        // Ölçü filtri (JSON array axtarışı)
        if ($request->filled('size')) {
            $query->whereJsonContains('sizes', $request->size);
        }

        // Sıralama
        $sort = $request->get('sort_by', 'featured');
        switch ($sort) {
            case 'price-asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price-desc':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'newest':
                $query->latest();
                break;
            default:
                $query->orderByDesc('is_featured')->latest();
                break;
        }

        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }

    /**
     * Mövcud kateqoriyalar siyahısı
     */
    public function categories()
    {
        $categories = Product::select('category')->distinct()->pluck('category');

        return response()->json([
            'status' => 'success',
            'data' => $categories
        ]);
    }

    /**
     * Tək bir məhsulun təfərrüatları
     */
    public function show(Product $product)
    {
        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }

    /**
     * Yeni məhsul əlavə etmək (Step 2 - Admin CRUD)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'gender' => 'required|in:Kişi,Qadın,Uniseks',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|gt:price',
            'description' => 'required|string',
            'composition' => 'nullable|string|max:255',
            'stock' => 'required|integer|min:0',
            'sizes' => 'required|array|min:1',
            'colors' => 'required|array|min:1',
            'images' => 'required|array|min:1',
            'is_featured' => 'boolean',
            'tags' => 'nullable|array',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . rand(1000, 9999);
        $validated['rating'] = 5.0;
        $validated['reviews_count'] = 0;

        $product = Product::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Məhsul uğurla əlavə edildi',
            'data' => $product
        ], 201);
    }

    /**
     * Məhsulu redaktə etmək (Step 2 - Admin CRUD)
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string',
            'gender' => 'sometimes|required|in:Kişi,Qadın,Uniseks',
            'price' => 'sometimes|required|numeric|min:0',
            'original_price' => 'nullable|numeric',
            'stock' => 'sometimes|required|integer|min:0',
            'description' => 'sometimes|required|string',
            'sizes' => 'sometimes|required|array',
            'colors' => 'sometimes|required|array',
            'images' => 'sometimes|required|array',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . rand(1000, 9999);
        }

        $product->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Məhsul məlumatları uğurla yeniləndi',
            'data' => $product
        ]);
    }

    /**
     * Məhsulu silmək (Step 2 - Admin CRUD)
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Məhsul uğurla bazadan silindi'
        ]);
    }
}
