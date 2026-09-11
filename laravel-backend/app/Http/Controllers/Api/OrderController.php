<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * İstifadəçinin sifariş tarixçəsi (Step 4)
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items.product'])
            ->latest()
            ->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * Sifarişin təfərrüatları
     */
    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['status' => 'error', 'message' => 'Giriş qadağandır'], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $order->load(['items.product', 'user'])
        ]);
    }

    /**
     * Sifarişin rəsmiləşdirilməsi (Checkout)
     */
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'required|string',
            'items.*.color' => 'required|array',
            'items.*.color.name' => 'required|string',
            'shipping_address' => 'required|array',
            'shipping_address.full_name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|max:30',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.address' => 'required|string|max:500',
            'shipping_address.notes' => 'nullable|string|max:500',
            'payment_method' => 'required|in:card,cash',
            'promo_code' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $subtotal = 0;
            $itemsToProcess = [];

            // Stok yoxlanışı və məhsul qiyməti kilidi (Pessimistic Locking)
            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    return response()->json([
                        'status' => 'error',
                        'message' => "\"{$product->name}\" üçün tələb olunan say qədər stok yoxdur. Mövcud: {$product->stock}"
                    ], 422);
                }

                $subtotal += $product->price * $item['quantity'];

                $itemsToProcess[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'size' => $item['size'],
                    'color' => $item['color'],
                ];
            }

            // Promokod yoxlanışı
            $discount = 0;
            if (!empty($validated['promo_code']) && strtoupper($validated['promo_code']) === 'MAVI10') {
                $discount = round($subtotal * 0.10, 2);
            }

            $shippingFee = ($subtotal - $discount) >= 80 ? 0 : 4.00;
            $total = ($subtotal - $discount) + $shippingFee;

            // Sifariş qeydini yaratmaq
            $order = Order::create([
                'user_id' => $request->user()->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(6)) . '-' . rand(100, 999),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'shipping_address' => $validated['shipping_address'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_method'] === 'card' ? 'paid' : 'pending_delivery',
                'customer_notes' => $validated['shipping_address']['notes'] ?? null,
            ]);

            // Sifariş sətirlərini və stok çıxışını qeyd etmək
            foreach ($itemsToProcess as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'size' => $item['size'],
                    'color' => $item['color'],
                ]);

                // Anbardan çıxarış
                $item['product']->decrement('stock', $item['quantity']);
            }

            // İstifadəçinin səbətini təmizləmək
            CartItem::where('user_id', $request->user()->id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Sifarişiniz uğurla rəsmiləşdirildi və qəbul olundu!',
                'data' => $order->load('items.product')
            ], 201);
        });
    }

    /**
     * Sifariş statusunun yenilənməsi (Admin)
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'status' => 'success',
            'message' => "Sifariş statusu '{$validated['status']}' olaraq yeniləndi",
            'data' => $order
        ]);
    }

    /**
     * Admin Paneli üçün ümumi statistika
     */
    public function adminStats()
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total');
        $pendingOrders = Order::where('status', 'pending')->count();
        $lowStockProducts = Product::where('stock', '<', 10)->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_orders' => $totalOrders,
                'total_revenue' => round($totalRevenue, 2),
                'pending_orders' => $pendingOrders,
                'low_stock_products' => $lowStockProducts,
            ]
        ]);
    }
}
