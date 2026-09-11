import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductFilters } from './components/ProductFilters';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminModal } from './components/AdminModal';
import { LaravelModal } from './components/LaravelModal';
import { UserAccountModal } from './components/UserAccountModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { INITIAL_PRODUCTS } from './data/products';
import { Product, CartItem, Order, UserProfile, FilterState, OrderStatus, ShippingAddress } from './types';
import { Code2, SlidersHorizontal, ShoppingBag, ShieldCheck, Truck, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  // Core Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      productId: 2,
      product: INITIAL_PRODUCTS[1],
      selectedSize: 'L',
      selectedColor: { name: 'Kobalt Mavi', hex: '#2563eb' },
      quantity: 1,
    }
  ]);
  const [wishlist, setWishlist] = useState<number[]>([1, 4]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Orders State (seeded with one order for demonstration)
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-101',
      orderNumber: 'ORD-94281',
      createdAt: '11 Sentyabr 2026, 14:20',
      items: [
        {
          id: 'item-1',
          productId: 1,
          product: INITIAL_PRODUCTS[0],
          selectedSize: 'M',
          selectedColor: { name: 'Kral Mavisi', hex: '#1e40af' },
          quantity: 1,
        }
      ],
      subtotal: 189.99,
      discount: 0,
      shippingFee: 0,
      total: 189.99,
      status: 'processing',
      shippingAddress: {
        fullName: 'Aydan Şərifova',
        phone: '+994 50 123 45 67',
        city: 'Bakı',
        address: 'Nizami küç. 45, mənzil 12',
      },
      paymentMethod: 'card',
      userEmail: 'aydan@example.com',
    }
  ]);

  // Current User
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-1',
    name: 'Aydan Şərifova',
    email: 'aydan@example.com',
    phone: '+994 50 123 45 67',
    role: 'customer',
  });

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    gender: '',
    minPrice: 0,
    maxPrice: 250,
    selectedSize: '',
    selectedColor: '',
    sortBy: 'featured',
  });

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLaravelOpen, setIsLaravelOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'error', text: string) => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: string,
    color: { name: string; hex: string },
    qty: number = 1
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random()}`,
          productId: product.id,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: qty,
        };
        return [...prevCart, newItem];
      }
    });

    addToast('success', `${product.name} (${size}) səbətə əlavə edildi!`);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    addToast('info', 'Məhsul səbətdən silindi.');
  };

  const handleApplyPromo = (code: string) => {
    if (code === 'MAVI10' || code === 'YENI2026') {
      setDiscountPercent(10);
      addToast('success', '10% endirim promokodu aktivləşdirildi!');
      return true;
    }
    return false;
  };

  // Wishlist operations
  const handleToggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        addToast('info', 'Məhsul bəyənilənlərdən çıxarıldı.');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('success', 'Məhsul bəyənilənlərə əlavə olundu ❤️');
        return [...prev, productId];
      }
    });
  };

  // Checkout & Order Placement
  const handlePlaceOrder = (orderData: {
    shippingAddress: ShippingAddress;
    paymentMethod: 'card' | 'cash';
    userEmail: string;
  }): Order => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const shippingFee = subtotal >= 80 ? 0 : 4.0;
    const total = subtotal - discountAmount + shippingFee;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toLocaleDateString('az-AZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...cart],
      subtotal,
      discount: discountAmount,
      shippingFee,
      total,
      status: 'pending',
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      userEmail: orderData.userEmail,
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const item = cart.find((c) => c.productId === p.id);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Clear cart
    setCart([]);
    setDiscountPercent(0);

    addToast('success', `Sifariş № ${newOrder.orderNumber} qəbul olundu!`);
    return newOrder;
  };

  // Admin Actions
  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const nextId = Math.max(...products.map((p) => p.id), 0) + 1;
    const created: Product = { ...newProd, id: nextId };
    setProducts((prev) => [created, ...prev]);
    addToast('success', `Yeni məhsul "${created.name}" əlavə edildi!`);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addToast('success', `Məhsul "${updated.name}" yeniləndi.`);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Məhsul sistemdən silindi.');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    addToast('info', `Sifariş statusu "${status}" olaraq dəyişdirildi.`);
  };

  // Filtered Products Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (filters.category !== 'all' && p.category !== filters.category) {
          return false;
        }
        // Gender
        if (filters.gender && p.gender !== filters.gender && p.gender !== 'Uniseks') {
          return false;
        }
        // Price
        if (p.price > filters.maxPrice) {
          return false;
        }
        // Size
        if (filters.selectedSize && !p.sizes.includes(filters.selectedSize)) {
          return false;
        }
        // Color
        if (
          filters.selectedColor &&
          !p.colors.some((c) => c.name.toLowerCase().includes(filters.selectedColor.toLowerCase()))
        ) {
          return false;
        }
        // Search query
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return 0; // featured default
      });
  }, [products, filters]);

  const totalCartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        cartCount={totalCartItemsCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLaravel={() => setIsLaravelOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        currentUser={currentUser}
        searchQuery={filters.search}
        onSearchChange={(q) => setFilters((f) => ({ ...f, search: q }))}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => setFilters((f) => ({ ...f, category: cat }))}
      />

      {/* Hero Banner with Blue Aesthetic and Gender Shortcuts */}
      <HeroBanner
        selectedGender={filters.gender}
        onSelectGender={(g) => setFilters((f) => ({ ...f, gender: g }))}
      />

      {/* Main Catalog View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Active Filter Indicators Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-blue-950 tracking-tight">
              {filters.category === 'all'
                ? 'Bütün Mavi Geyim Kolleksiyası'
                : `${filters.category} Kolleksiyası`}
            </h2>
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} məhsul
            </span>
          </div>

          {/* Quick shortcuts and active pills */}
          <div className="flex items-center gap-2 text-xs">
            {filters.gender && (
              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                Cins: {filters.gender}
                <button
                  onClick={() => setFilters((f) => ({ ...f, gender: '' }))}
                  className="hover:text-blue-950 font-bold"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.selectedSize && (
              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                Ölçü: {filters.selectedSize}
                <button
                  onClick={() => setFilters((f) => ({ ...f, selectedSize: '' }))}
                  className="hover:text-blue-950 font-bold"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.search && (
              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                "{filters.search}"
                <button
                  onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                  className="hover:text-blue-950 font-bold"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Layout: Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filters Sidebar */}
          <aside className="lg:col-span-3">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              onReset={() =>
                setFilters({
                  search: '',
                  category: 'all',
                  gender: '',
                  minPrice: 0,
                  maxPrice: 250,
                  selectedSize: '',
                  selectedColor: '',
                  sortBy: 'featured',
                })
              }
              totalProducts={filteredProducts.length}
            />

            {/* Laravel Assignment Info Card */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Code2 className="w-4 h-4" />
                <span>Task 4 - E-Commerce Website</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bu mağaza üçün tələb olunan bütün <strong>PHP Laravel 11</strong> arxitekturası (Controller, Model, Migration, Route və Seeders) hazırdır.
              </p>
              <button
                onClick={() => setIsLaravelOpen(true)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Laravel Kodlarını İncələ</span>
              </button>
            </div>
          </aside>

          {/* Right Product Grid */}
          <section className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-blue-100 p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Seçilmiş filtrlərə uyğun məhsul tapılmadı</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Axtarış sözünü dəyişməyi və ya filtrləri sıfırlamağı yoxlayın.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setFilters({
                      search: '',
                      category: 'all',
                      gender: '',
                      minPrice: 0,
                      maxPrice: 250,
                      selectedSize: '',
                      selectedColor: '',
                      sortBy: 'featured',
                    })
                  }
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  Filtrləri Sıfırla
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onAddToCart={(p, size, color) => handleAddToCart(p, size, color, 1)}
                    isWishlisted={wishlist.includes(prod.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Floating Action Bar for Laravel Hub & Admin Mode */}
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsLaravelOpen(true)}
          className="bg-slate-900/90 hover:bg-slate-950 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border border-slate-700 flex items-center gap-2 hover:scale-105 transition-all"
          title="Laravel 11 PHP kodları və miqrasiyaları"
        >
          <Code2 className="w-4 h-4 text-blue-400" />
          <span>PHP Laravel Backend Kodları</span>
        </button>

        <button
          onClick={() => setIsAdminOpen(true)}
          className="bg-blue-600/90 hover:bg-blue-700 text-white text-xs font-bold px-3 py-3 rounded-2xl shadow-xl backdrop-blur-md border border-blue-500 flex items-center gap-1.5 hover:scale-105 transition-all"
          title="Məhsul və Sifariş İdarəetməsi"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Admin Panel</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-blue-950 mt-16 pt-12 pb-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-extrabold text-lg">
                <Layers className="w-5 h-5 text-blue-500" />
                <span>MAVI.AZ BOUTIQUE</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Mavi tonların füsunkar zərifliyi və keyfiyyətli parçalardan hazırlanmış eksklüziv geyim kolleksiyası.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Kolleksiyalar</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-blue-400">Kral Mavi Yun Paltolar</a></li>
                <li><a href="#" className="hover:text-blue-400">Kobalt Pambıq Köynəklər</a></li>
                <li><a href="#" className="hover:text-blue-400">İndiqo Vintage Denim</a></li>
                <li><a href="#" className="hover:text-blue-400">Safir İpək Donlar</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Müştəri Xidmətləri</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-blue-400">Çatdırılma və Qaytarılma</a></li>
                <li><a href="#" className="hover:text-blue-400">Ölçü Cədvəli Bələdçisi</a></li>
                <li><a href="#" className="hover:text-blue-400">Sifariş İzləmə</a></li>
                <li><a href="#" className="hover:text-blue-400">Qapıda Nağd Ödəniş Qaydaları</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Task 4 Full-Stack</h4>
              <p className="text-slate-400 text-xs mb-3">
                Bu platforma Task 4 E-Commerce spesifikasiyası üzrə tam REST API və Laravel 11 arxitekturası ilə hazırlanmışdır.
              </p>
              <button
                onClick={() => setIsLaravelOpen(true)}
                className="text-blue-400 hover:text-blue-300 underline text-xs font-semibold"
              >
                Bütün PHP Laravel fayllarını yüklə
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <p>© 2026 MAVI Geyim Mağazası. Bütün hüquqlar qorunur.</p>
            <div className="flex items-center gap-4">
              <span>Gizlilik Siyasəti</span>
              <span>•</span>
              <span>İstifadə Şərtləri</span>
              <span>•</span>
              <span>Bakı, Azərbaycan</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, size, color, qty) => handleAddToCart(p, size, color, qty)}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        discount={discountPercent}
        onApplyPromo={handleApplyPromo}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={cart.reduce((s, i) => s + i.product.price * i.quantity, 0)}
        discount={discountPercent}
        shippingFee={cart.reduce((s, i) => s + i.product.price * i.quantity, 0) >= 80 ? 0 : 4.0}
        total={Math.max(
          0,
          cart.reduce((s, i) => s + i.product.price * i.quantity, 0) * (1 - discountPercent / 100) +
            (cart.reduce((s, i) => s + i.product.price * i.quantity, 0) >= 80 ? 0 : 4.0)
        )}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* 4. Admin Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* 5. Laravel Code Viewer Modal */}
      <LaravelModal
        isOpen={isLaravelOpen}
        onClose={() => setIsLaravelOpen(false)}
      />

      {/* 6. User Account Modal */}
      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        orders={orders}
        onSwitchRole={(newRole) => {
          setCurrentUser((u) => ({ ...u, role: newRole }));
          addToast('info', `İstifadəçi rolu "${newRole}" olaraq yeniləndi.`);
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
