<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Səbətdəki məhsulları gətirir
     */
    public function getCart(Request $request)
    {
        $userId = $request->user()?->id;
        $sessionId = $request->header('X-Session-ID', $request->ip());

        $items = CartItem::with('product')
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->get();

        $subtotal = $items->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        $shippingFee = $subtotal >= 80 || $subtotal === 0 ? 0 : 4.00;

        return response()->json([
            'status' => 'success',
            'data' => [
                'items' => $items,
                'items_count' => $items->sum('quantity'),
                'subtotal' => round($subtotal, 2),
                'shipping_fee' => $shippingFee,
                'free_shipping_eligible' => $subtotal >= 80,
                'total' => round($subtotal + $shippingFee, 2),
            ]
        ]);
    }

    /**
     * Səbətə yeni məhsul əlavə edir
     */
    public function addItem(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'required|string',
            'color' => 'required|array',
            'color.name' => 'required|string',
            'color.hex' => 'required|string',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->stock < $validated['quantity']) {
            return response()->json([
                'status' => 'error',
                'message' => 'Təəssüf ki, anbarda kifayət qədər məhsul yoxdur. Mövcud say: ' . $product->stock
            ], 422);
        }

        $userId = $request->user()?->id;
        $sessionId = $request->header('X-Session-ID', $request->ip());

        $existing = CartItem::where('product_id', $validated['product_id'])
            ->where('size', $validated['size'])
            ->where('color->name', $validated['color']['name'])
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->first();

        if ($existing) {
            $newQuantity = $existing->quantity + $validated['quantity'];
            if ($product->stock < $newQuantity) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Anbardakı maksimum miqdar aşıldı.'
                ], 422);
            }
            $existing->update(['quantity' => $newQuantity]);
            $item = $existing;
        } else {
            $item = CartItem::create([
                'user_id' => $userId,
                'session_id' => $userId ? null : $sessionId,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'size' => $validated['size'],
                'color' => $validated['color'],
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Məhsul səbətə əlavə edildi',
            'data' => $item->load('product')
        ], 201);
    }

    /**
     * Səbətdəki məhsul sayını yeniləyir
     */
    public function updateItem(Request $request, CartItem $item)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product = $item->product;
        if ($product->stock < $validated['quantity']) {
            return response()->json([
                'status' => 'error',
                'message' => 'Maksimum mövcud qalıq: ' . $product->stock
            ], 422);
        }

        $item->update(['quantity' => $validated['quantity']]);

        return response()->json([
            'status' => 'success',
            'message' => 'Səbət yeniləndi',
            'data' => $item->load('product')
        ]);
    }

    /**
     * Məhsulu səbətdən silir
     */
    public function removeItem(CartItem $item)
    {
        $item->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Məhsul səbətdən çıxarıldı'
        ]);
    }

    /**
     * Bütün səbəti təmizləyir
     */
    public function clearCart(Request $request)
    {
        $userId = $request->user()?->id;
        $sessionId = $request->header('X-Session-ID', $request->ip());

        CartItem::when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Səbət tamamilə təmizləndi'
        ]);
    }
}
