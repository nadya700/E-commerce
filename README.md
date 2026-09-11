# 🌊 MAVI BOUTIQUE - FULL-STACK E-COMMERCE
## Task 4: E-Commerce Website (React 18 + Tailwind CSS + PHP Laravel 11 Backend)

Bu layihə **Task 4: E-Commerce Website** tapşırığının bütün tələblərinə uyğun olaraq hazırlanmış tam funksional, mavi tonlarda zərif dizaynlı geyim mağazası platformasıdır.

Layihə iki əsas hissədən ibarətdir:
1. **Frontend (İstifadəçi İnterfeysi)**: React 18, TypeScript, Tailwind CSS, Lucide Icons (`/src`, `/index.html`)
2. **Backend (REST API Arxitekturası)**: PHP Laravel 11, Sanctum Auth, Eloquent ORM, Migrations & Seeders (`/laravel-backend/`)

---

### 🌟 Tapşırıq Modulları (Task 4 Modules)

- **Step 1: Məhsul Kataloqu və Axtarış / Filtrlər**:
  - Kateqoriyalar üzrə filtrasiya (Köynəklər, Pencəklər, Donlar, Sviterlər, Şalvarlar, Ayaqqabılar, Aksessuarlar).
  - Cinsiyyət filtrləri (Kişi, Qadın, Uniseks).
  - Canlı axtarış, dinamik qiymət aralığı slayderi, ölçü və rəng seçimi.
  - Sürətli baxış (Quick View) və bəyənmə siyahısı (Wishlist).

- **Step 2: Məhsul İdarəetməsi (Admin CRUD)**:
  - Admin panelində məhsul əlavə etmə, mövcud məhsulları redaktə etmə və silmə.
  - Anbar qalıqlarına (stok sayına) nəzarət.
  - Canlı REST API sorğu/cavab simulyatoru (`GET`, `POST`, `PUT`, `DELETE`).

- **Step 3: Alış-Veriş Səbəti (Shopping Cart)**:
  - Ölçü və rəng variantları ilə səbətə əlavə etmə.
  - Dinamik say artımı/azalması, silmə və səbəti təmizləmə.
  - 80 ₼ üzəri pulsuz çatdırılma tərəzisi və promokod sistemi (`MAVI10` - 10% endirim).

- **Step 4: Sifarişlər və Hesab İdarəetməsi (Order Management & Account)**:
  - Çatdırılma ünvanı və əlaqə forması.
  - Ödəniş seçimi: Onlayn bank kartı və ya qapıda nağd/posterminal.
  - Unikal sifariş nömrəsi (`ORD-XXXXX`), status addımları (*Qəbul edildi ➔ Hazırlanır ➔ Kuryerdə ➔ Çatdırıldı*).
  - Müştəri profili və sifariş tarixçəsi pəncərəsi.

---

### 📂 GitHub Repozitoriya Strukturu

```
.
├── src/                                # React 18 + Tailwind Frontend
│   ├── components/                     # Modullar və interfeys komponentləri
│   │   ├── Navbar.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductDetailModal.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CheckoutModal.tsx
│   │   ├── AdminModal.tsx
│   │   ├── UserAccountModal.tsx
│   │   └── LaravelModal.tsx
│   ├── data/                           # Məhsullar və ilkin məlumatlar
│   ├── types.ts                        # TypeScript interfeysləri
│   └── App.tsx                         # Əsas tətbiq komponenti
├── laravel-backend/                    # PHP Laravel 11 Backend Arxitekturası
│   ├── app/
│   │   ├── Http/Controllers/Api/       # Product, Cart, Order, Auth Controllers
│   │   └── Models/                     # Product, Order, OrderItem, CartItem, User
│   ├── database/
│   │   ├── migrations/                 # Verilənlər bazası cədvəl strukturları
│   │   └── seeders/                    # İlkin kolleksiya və istifadəçi toxumları
│   ├── routes/
│   │   └── api.php                     # REST API v1 marşrutları
│   ├── composer.json                   # PHP paketləri və Laravel 11 sazlaması
│   └── README.md                       # Backend quraşdırma bələdçisi
├── package.json                        # Frontend npm asılılıqları
└── README.md                           # Ümumi layihə təlimatı
```

---

### 🚀 İşə Salma Qaydaları

#### 1. Frontend (React + Vite)
```bash
npm install
npm run dev
```
Tətbiq `http://localhost:3000` ünvanında açılacaq.

#### 2. Backend (Laravel 11)
```bash
cd laravel-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
Backend API `http://127.0.0.1:8000` ünvanında işləyəcək.
