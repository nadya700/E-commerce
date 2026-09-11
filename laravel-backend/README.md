# MAVI BOUTIQUE - LARAVEL 11 REST API BACKEND
## Task 4: E-Commerce Website Backend Arxitekturası

Bu qovluq (`laravel-backend/`) **Mavi Boutique** onlayn geyim mağazasının **PHP Laravel 11** arxitekturası üzrə hazırlanmış tam REST API backend kodlarını ehtiva edir.

---

### 🚀 Tələblər
- **PHP**: 8.2 və ya daha yuxarı
- **Composer**: 2.x
- **Verilənlər Bazası**: SQLite (default), MySQL və ya PostgreSQL

---

### 🛠️ Quraşdırma və İşə Salma (Setup Instructions)

```bash
# 1. Backend qovluğuna daxil olun
cd laravel-backend

# 2. Asılılıqları (dependencies) quraşdırın
composer install

# 3. .env faylını yaradın
cp .env.example .env

# 4. Tətbiq açarını (Application Key) generasiya edin
php artisan key:generate

# 5. Verilənlər bazasını yaradın və ilkin məlumatları (Seeders) köçürün
# (SQLite istifadə edilirsə: touch database/database.sqlite)
php artisan migrate --seed

# 6. Lokal serveri işə salın
php artisan serve
```
Server standart olaraq `http://127.0.0.1:8000` ünvanında işə düşəcək.

---

### 📂 Layihə Strukturu

```
laravel-backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── Controller.php
│   │       └── Api/
│   │           ├── AuthController.php       # İstifadəçi qeydiyyatı, giriş və Sanctum token
│   │           ├── ProductController.php    # Məhsul siyahısı, axtarış, filtr və CRUD
│   │           ├── CartController.php       # Səbət əməliyyatları (əlavə etmə, say dəyişmə)
│   │           └── OrderController.php      # Sifarişin rəsmiləşdirilməsi və status
│   └── Models/
│       ├── User.php                         # Müştəri və Admin istifadəçi modeli
│       ├── Product.php                      # Geyim məhsulları modeli
│       ├── Order.php                        # Sifariş modeli
│       ├── OrderItem.php                    # Sifariş sətirləri modeli
│       └── CartItem.php                     # Səbət elementləri modeli
├── config/
│   └── cors.php                             # Frontend (React Vite) üçün CORS tənzimləmələri
├── database/
│   ├── migrations/
│   │   ├── 2026_09_11_000001_create_users_table.php
│   │   ├── 2026_09_11_000002_create_products_table.php
│   │   ├── 2026_09_11_000003_create_orders_table.php
│   │   ├── 2026_09_11_000004_create_order_items_table.php
│   │   └── 2026_09_11_000005_create_cart_items_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php                   # Test admin və müştəri hesabları
│       └── ProductSeeder.php                # 8 ədəd mavi geyim kolleksiyası
├── routes/
│   └── api.php                              # Bütün REST API marşrutları (v1)
└── composer.json
```

---

### 🌐 REST API Endpoints

| Metod | Endpoint | Təsvir | Giriş / İcazə |
|---|---|---|---|
| **GET** | `/api/v1/products` | Məhsulların siyahılanması, axtarış və dinamik filtrlər | Hər kəs |
| **GET** | `/api/v1/products/{slug}` | Seçilmiş məhsulun təfərrüatları | Hər kəs |
| **GET** | `/api/v1/categories` | Mövcud kateqoriyalar siyahısı | Hər kəs |
| **POST** | `/api/v1/auth/register` | Yeni istifadəçi qeydiyyatı | Hər kəs |
| **POST** | `/api/v1/auth/login` | Sistemə daxil olmaq və Sanctum Bearer Token almaq | Hər kəs |
| **GET** | `/api/v1/cart` | Səbətdəki məhsulların siyahısı və yekun məbləğ | Hər kəs (Sessiya/Token) |
| **POST** | `/api/v1/cart/items` | Səbətə yeni məhsul, ölçü və rəng əlavə etmək | Hər kəs |
| **PUT** | `/api/v1/cart/items/{id}` | Səbətdəki məhsul sayını artırmaq / azaltmaq | Hər kəs |
| **DELETE** | `/api/v1/cart/items/{id}` | Məhsulu səbətdən silmək | Hər kəs |
| **GET** | `/api/v1/auth/me` | Cari autentifikasiya olunmuş istifadəçi | `Bearer Token` |
| **GET** | `/api/v1/orders` | İstifadəçinin sifariş tarixçəsi | `Bearer Token` |
| **POST** | `/api/v1/orders/checkout` | Sifarişin rəsmiləşdirilməsi (Pessimistic Lock & Stok çıxışı) | `Bearer Token` |
| **POST** | `/api/v1/products` | Yeni məhsul əlavə etmək | `Admin` |
| **PUT** | `/api/v1/products/{id}` | Məhsul məlumatlarını və stok sayını yeniləmək | `Admin` |
| **DELETE** | `/api/v1/products/{id}` | Məhsulu silmək | `Admin` |
| **PATCH** | `/api/v1/orders/{id}/status` | Sifariş statusunu dəyişmək (`pending`, `shipped` və s.) | `Admin` |

---

### 🔑 Test İstifadəçi Məlumatları (Seed Data)

- **Admin Hesabı:**
  - E-poçt: `admin@mavi.az`
  - Şifrə: `admin123456`
  - Rol: `admin`

- **Müştəri Hesabı:**
  - E-poçt: `aydan@example.com`
  - Şifrə: `password123`
  - Rol: `customer`
