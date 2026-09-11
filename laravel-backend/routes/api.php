<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Task 4: E-Commerce REST API Routes - Mavi Boutique
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // -------------------------------------------------------------------------
    // Step 1: Product Catalog & Public Exploration
    // -------------------------------------------------------------------------
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product:slug}', [ProductController::class, 'show']);
    Route::get('/categories', [ProductController::class, 'categories']);

    // -------------------------------------------------------------------------
    // User Authentication & Sanctum Token Management
    // -------------------------------------------------------------------------
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // -------------------------------------------------------------------------
    // Step 3: Shopping Cart (Guest session or User token)
    // -------------------------------------------------------------------------
    Route::get('/cart', [CartController::class, 'getCart']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::put('/cart/items/{item}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{item}', [CartController::class, 'removeItem']);
    Route::delete('/cart/clear', [CartController::class, 'clearCart']);

    // -------------------------------------------------------------------------
    // Authenticated User Endpoints
    // -------------------------------------------------------------------------
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Step 4: Orders & Order Placement (Checkout)
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders/checkout', [OrderController::class, 'checkout']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::get('/orders/{order}/invoice', [OrderController::class, 'invoice']);

        // Step 2: Product & Order Management (Admin only)
        Route::middleware('can:manage-products')->group(function () {
            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{product}', [ProductController::class, 'update']);
            Route::delete('/products/{product}', [ProductController::class, 'destroy']);
            
            // Admin Order Status Update
            Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
            Route::get('/admin/stats', [OrderController::class, 'adminStats']);
        });
    });
});
