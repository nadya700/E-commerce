export interface LaravelFile {
  name: string;
  path: string;
  category: 'Routes' | 'Controllers' | 'Models' | 'Migrations' | 'Seeders' | 'Tests';
  description: string;
  code: string;
}

export const LARAVEL_PROJECT_FILES: LaravelFile[] = [
  {
    name: 'api.php',
    path: 'routes/api.php',
    category: 'Routes',
    description: 'Bütün e-ticarət API marşrutları (Məhsullar, Səbət, Sifarişlər, Autentifikasiya və Admin idarəetməsi)',
    code: `<?php

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\ProductController;
use App\\Http\\Controllers\\Api\\CartController;
use App\\Http\\Controllers\\Api\\OrderController;
use App\\Http\\Controllers\\Api\\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes - Mavi Geyim E-Commerce API
|--------------------------------------------------------------------------
*/

// İctimai Məhsul Marşrutları (Axtarış, Kateqoriya, Filtrləmə)
Route::prefix('v1')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product:slug}', [ProductController::class, 'show']);
    Route::get('/categories', [ProductController::class, 'categories']);

    // İstifadəçi Qeydiyyatı və Girişi (Sanctum Token)
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Qonaq və ya Sessiya Səbəti
    Route::get('/cart', [CartController::class, 'getCart']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::put('/cart/items/{item}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{item}', [CartController::class, 'removeItem']);

    // Qorunan Marşrutlar (Yalnız Giriş Etmiş İstifadəçilər)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Sifarişlərin İdarə Edilməsi
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders/checkout', [OrderController::class, 'checkout']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);

        // Admin & Menecer Səlahiyyətli Marşrutlar
        Route::middleware('can:manage-products')->group(function () {
            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{product}', [ProductController::class, 'update']);
            Route::delete('/products/{product}', [ProductController::class, 'destroy']);
            Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        });
    });
});
`,
  },
  {
    name: 'ProductController.php',
    path: 'app/Http/Controllers/Api/ProductController.php',
    category: 'Controllers',
    description: 'Məhsulların siyahılanması, axtarışı, filtrlənməsi və CRUD əməliyyatları',
    code: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Product;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Str;

class ProductController extends Controller
{
    /**
     * Məhsulları filtrləyərək və səhifələyərək gətirir.
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Kateqoriya üzrə filtr
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Cinsiyyət üzrə filtr (Kişi, Qadın, Uniseks)
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        // Axtarış açar sözü
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Qiymət aralığı
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sıralama
        $sort = $request->get('sort_by', 'newest');
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
            default:
                $query->latest();
                break;
        }

        $products = $query->paginate(12);

        return response()->json([
            'status' => 'success',
            'data' => $products
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
     * Yeni məhsul yaratmaq (Yalnız Admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'gender' => 'required|in:Kişi,Qadın,Uniseks',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|gt:price',
            'description' => 'required|string',
            'composition' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'sizes' => 'required|array',
            'colors' => 'required|array',
            'images' => 'required|array',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . rand(1000, 9999);
        $product = Product::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Məhsul uğurla əlavə edildi',
            'data' => $product
        ], 201);
    }

    /**
     * Məhsul məlumatlarını yeniləmək
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'description' => 'sometimes|required|string',
        ]);

        $product->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Məhsul yeniləndi',
            'data' => $product
        ]);
    }

    /**
     * Məhsulu silmək
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Məhsul bazadan silindi'
        ]);
    }
}
`,
  },
  {
    name: 'OrderController.php',
    path: 'app/Http/Controllers/Api/OrderController.php',
    category: 'Controllers',
    description: 'Sifarişin rəsmiləşdirilməsi, kuryer statusu və ödəniş axını',
    code: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Order;
use App\\Models\\OrderItem;
use App\\Models\\Product;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

class OrderController extends Controller
{
    /**
     * İstifadəçinin sifariş tarixçəsi
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items.product')
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * Sifarişi tamamlamaq (Checkout flow)
     */
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'required|string',
            'items.*.color' => 'required|string',
            'shipping_address' => 'required|array',
            'shipping_address.full_name' => 'required|string',
            'shipping_address.phone' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.address' => 'required|string',
            'payment_method' => 'required|in:card,cash',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $subtotal = 0;

            // Stok yoxlanışı və məbləğ hesablanması
            foreach ($validated['items'] as $itemData) {
                $product = Product::lockForUpdate()->findOrFail($itemData['product_id']);

                if ($product->stock < $itemData['quantity']) {
                    abort(422, "{$product->name} üçün kifayət qədər stok yoxdur!");
                }

                $subtotal += $product->price * $itemData['quantity'];
                $product->decrement('stock', $itemData['quantity']);
            }

            $shippingFee = $subtotal > 80 ? 0 : 4.00;
            $total = $subtotal + $shippingFee;

            $order = Order::create([
                'user_id' => $request->user()->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'shipping_address' => $validated['shipping_address'],
                'payment_method' => $validated['payment_method'],
            ]);

            foreach ($validated['items'] as $itemData) {
                $product = Product::find($itemData['product_id']);
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'price' => $product->price,
                    'quantity' => $itemData['quantity'],
                    'size' => $itemData['size'],
                    'color' => $itemData['color'],
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Sifarişiniz uğurla qəbul edildi!',
                'data' => $order->load('items.product')
            ], 201);
        });
    }

    /**
     * Sifariş statusunu dəyişmək (Admin)
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'status' => 'success',
            'message' => 'Sifariş statusu yeniləndi',
            'data' => $order
        ]);
    }
}
`,
  },
  {
    name: 'Product.php',
    path: 'app/Models/Product.php',
    category: 'Models',
    description: 'Geyim məhsulu üçün Eloquent Model və əlaqələri',
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

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
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
`,
  },
  {
    name: 'Order.php',
    path: 'app/Models/Order.php',
    category: 'Models',
    description: 'Sifarişlər üçün Eloquent Model',
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'subtotal',
        'shipping_fee',
        'total',
        'shipping_address',
        'payment_method',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'subtotal' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
`,
  },
  {
    name: 'create_products_table.php',
    path: 'database/migrations/2026_09_11_000001_create_products_table.php',
    category: 'Migrations',
    description: 'Məhsullar cədvəlinin verilənlər bazası miqrasiyası',
    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category'); // Köynək, Don, Pencək və s.
            $table->enum('gender', ['Kişi', 'Qadın', 'Uniseks'])->default('Uniseks');
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->text('description');
            $table->string('composition')->nullable();
            $table->json('sizes'); // ['XS', 'S', 'M', 'L']
            $table->json('colors'); // [{'name': 'Kobalt', 'hex': '#2563eb'}]
            $table->json('images');
            $table->integer('stock')->default(0);
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->integer('reviews_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->json('tags')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
`,
  },
  {
    name: 'ProductSeeder.php',
    path: 'database/seeders/ProductSeeder.php',
    category: 'Seeders',
    description: 'Mavi geyim kolleksiyasının ilkin məlumat bazası toxumu (Database Seeder)',
    code: `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use App\\Models\\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => 'Kral Mavi Yun Palto',
            'slug' => 'kral-mavi-yun-palto',
            'category' => 'Pencək',
            'gender' => 'Qadın',
            'price' => 189.99,
            'original_price' => 249.99,
            'description' => 'Zərif kəsimli, 100% təbii İtalyan yunundan hazırlanmış kral mavi uzun qış paltosu.',
            'composition' => '80% Yun, 20% Kaşmir',
            'sizes' => ['XS', 'S', 'M', 'L'],
            'colors' => [
                ['name' => 'Kral Mavisi', 'hex' => '#1e40af'],
                ['name' => 'Tünd Göy', 'hex' => '#0f172a']
            ],
            'images' => [
                'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop'
            ],
            'stock' => 14,
            'rating' => 4.9,
            'reviews_count' => 38,
            'is_featured' => true,
            'tags' => ['palto', 'yun', 'premium']
        ]);

        // Əlavə məhsul qeydləri...
    }
}
`,
  }
];
