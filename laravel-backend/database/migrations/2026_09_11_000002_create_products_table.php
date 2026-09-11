<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->index();
            $table->enum('gender', ['Kişi', 'Qadın', 'Uniseks'])->default('Uniseks')->index();
            $table->decimal('price', 10, 2)->index();
            $table->decimal('original_price', 10, 2)->nullable();
            $table->text('description');
            $table->string('composition')->nullable();
            $table->json('sizes');
            $table->json('colors');
            $table->json('images');
            $table->integer('stock')->default(0);
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->integer('reviews_count')->default(0);
            $table->boolean('is_featured')->default(false)->index();
            $table->json('tags')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
