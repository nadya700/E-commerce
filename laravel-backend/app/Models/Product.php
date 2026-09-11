<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'gender',
        'price',
        'original_price',
        'description',
        'composition',
        'sizes',
        'colors',
        'images',
        'stock',
        'rating',
        'reviews_count',
        'is_featured',
        'tags',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'sizes' => 'array',
        'colors' => 'array',
        'images' => 'array',
        'tags' => 'array',
        'is_featured' => 'boolean',
        'stock' => 'integer',
        'rating' => 'decimal:2',
        'reviews_count' => 'integer',
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }
}
