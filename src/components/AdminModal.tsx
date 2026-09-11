import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Package, 
  ClipboardList, 
  Terminal, 
  Check, 
  Save
} from 'lucide-react';
import { Product, Order, OrderStatus } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'api'>('products');

  // Form states for creating/editing product
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Product['category']>('Köynək');
  const [formGender, setFormGender] = useState<Product['gender']>('Uniseks');
  const [formPrice, setFormPrice] = useState('69.00');
  const [formStock, setFormStock] = useState('20');
  const [formDesc, setFormDesc] = useState('');
  const [formImg, setFormImg] = useState('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop');

  // API Tester states
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState<'get-products' | 'post-product' | 'get-orders' | 'post-checkout'>('get-products');

  if (!isOpen) return null;

  const openCreateForm = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Köynək');
    setFormGender('Uniseks');
    setFormPrice('55.00');
    setFormStock('25');
    setFormDesc('Yeni mavi kolleksiya geyimi.');
    setIsFormOpen(true);
  };

  const openEditForm = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormGender(p.gender);
    setFormPrice(p.price.toString());
    setFormStock(p.stock.toString());
    setFormDesc(p.description);
    setFormImg(p.images[0] || '');
    setIsFormOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: formName,
        category: formCategory,
        gender: formGender,
        price: parseFloat(formPrice) || 50,
        stock: parseInt(formStock, 10) || 10,
        description: formDesc,
        images: [formImg, ...editingProduct.images.slice(1)],
      });
    } else {
      onAddProduct({
        name: formName,
        slug: formName.toLowerCase().replace(/\\s+/g, '-'),
        category: formCategory,
        gender: formGender,
        price: parseFloat(formPrice) || 50,
        stock: parseInt(formStock, 10) || 10,
        description: formDesc,
        composition: '100% Pambıq / Yun',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Kral Mavi', hex: '#1e40af' },
          { name: 'Kobalt', hex: '#2563eb' }
        ],
        images: [formImg],
        rating: 5.0,
        reviewsCount: 1,
        isNew: true,
        tags: ['mavi', 'yeni'],
      });
    }
    setIsFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-blue-100 flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-blue-100 flex items-center justify-between bg-blue-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">İdarəetmə Paneli & Məhsul API-ləri</h2>
              <p className="text-xs text-blue-200">
                Task 4: Product Catalog, Shopping Cart, Orders & API Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Məhsul Kataloqu ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Sifarişlər ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'api'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>REST API Test Mərkəzi</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Mövcud Geyim Məhsulları</h3>
                  <p className="text-xs text-slate-500">Məhsulları redaktə edin, yenisini əlavə edin və ya silin.</p>
                </div>
                <button
                  onClick={openCreateForm}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Məhsul Əlavə Et</span>
                </button>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Məhsul</th>
                      <th className="p-3">Kateqoriya</th>
                      <th className="p-3">Cins</th>
                      <th className="p-3">Qiymət</th>
                      <th className="p-3">Stok</th>
                      <th className="p-3 text-right">Əməliyyat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-blue-50/40">
                        <td className="p-3 flex items-center gap-2.5">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-12 object-cover rounded-md bg-slate-100"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{p.name}</p>
                            <p className="text-[10px] text-slate-400">{p.sizes.join(', ')}</p>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-700">{p.category}</td>
                        <td className="p-3">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                            {p.gender}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-blue-900">{p.price.toFixed(2)} ₼</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              p.stock > 10
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.stock} ədəd
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => openEditForm(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Redaktə et"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Daxil Olmuş Sifarişlər</h3>
                <p className="text-xs text-slate-500">Müştəri sifarişlərinin statusunu dəyişin (Step 4 Workflow).</p>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-sm font-bold text-slate-700">Hələ heç bir sifariş daxil olmayıb</p>
                  <p className="text-xs text-slate-400 mt-1">Səbətə məhsul atıb sifarişi rəsmiləşdirərək sınaqdan keçirə bilərsiniz.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 rounded-2xl border border-blue-100 bg-white shadow-2xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div>
                          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md">
                            № {ord.orderNumber}
                          </span>
                          <span className="text-xs text-slate-500 ml-2">{ord.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-600">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="text-xs font-bold py-1 px-2.5 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-950 focus:ring-2 focus:ring-blue-600"
                          >
                            <option value="pending">Gözləmədə (Pending)</option>
                            <option value="processing">Hazırlanır (Processing)</option>
                            <option value="shipped">Kuryerdə / Yolda (Shipped)</option>
                            <option value="delivered">Çatdırıldı (Delivered)</option>
                            <option value="cancelled">İmtina edildi (Cancelled)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-slate-500 font-medium">Müştəri:</p>
                          <p className="font-bold text-slate-900">{ord.shippingAddress.fullName} ({ord.shippingAddress.phone})</p>
                          <p className="text-slate-600">{ord.shippingAddress.city}, {ord.shippingAddress.address}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-medium">Sifariş edilən məhsullar:</p>
                          <ul className="space-y-1">
                            {ord.items.map((i) => (
                              <li key={i.id} className="font-medium text-slate-800">
                                • {i.product.name} ({i.selectedSize}, {i.selectedColor.name}) × {i.quantity} ədəd
                              </li>
                            ))}
                          </ul>
                          <p className="text-right font-extrabold text-blue-900 pt-1">
                            Yekun: {ord.total.toFixed(2)} ₼
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REST API TESTER */}
          {activeTab === 'api' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Laravel REST API Simulyasiyası & Testləri</h3>
                <p className="text-xs text-slate-500">
                  Step 2 tələbinə uyğun olaraq geyim mağazasının API endpoint-lərini sınaqdan keçirin.
                </p>
              </div>

              {/* Endpoint buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'get-products', method: 'GET', path: '/api/v1/products', desc: 'Məhsulların siyahısı və filtrlər' },
                  { id: 'post-product', method: 'POST', path: '/api/v1/products', desc: 'Yeni məhsul yaratmaq (Admin)' },
                  { id: 'get-orders', method: 'GET', path: '/api/v1/orders', desc: 'İstifadəçinin sifarişləri' },
                  { id: 'post-checkout', method: 'POST', path: '/api/v1/orders/checkout', desc: 'Sifarişi tamamlamaq' },
                ].map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedApiEndpoint(ep.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                      selectedApiEndpoint === ep.id
                        ? 'bg-blue-900 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className={`px-1.5 py-0.5 rounded-sm text-[10px] font-bold ${
                      ep.method === 'GET' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {ep.method}
                    </span>
                    <span>{ep.path}</span>
                  </button>
                ))}
              </div>

              {/* API Response Viewer */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                  <span>Status: <strong className="text-emerald-400">200 OK</strong></span>
                  <span>Content-Type: application/json</span>
                </div>
                <pre className="text-blue-300 leading-relaxed">
                  {selectedApiEndpoint === 'get-products' && JSON.stringify({
                    status: 'success',
                    data: products.slice(0, 2).map((p) => ({
                      id: p.id,
                      name: p.name,
                      category: p.category,
                      price: p.price,
                      stock: p.stock,
                      sizes: p.sizes,
                      colors: p.colors,
                    })),
                    meta: { total: products.length, page: 1, per_page: 12 }
                  }, null, 2)}

                  {selectedApiEndpoint === 'post-product' && JSON.stringify({
                    status: 'success',
                    message: 'Məhsul uğurla əlavə edildi',
                    data: {
                      id: 99,
                      name: 'Mavi Zərif Kaşmir Şərf',
                      slug: 'mavi-zerif-kasmir-serf',
                      price: 45.00,
                      stock: 15,
                      category: 'Aksessuar',
                      created_at: new Date().toISOString()
                    }
                  }, null, 2)}

                  {selectedApiEndpoint === 'get-orders' && JSON.stringify({
                    status: 'success',
                    data: orders.map((o) => ({
                      order_number: o.orderNumber,
                      status: o.status,
                      total: o.total,
                      created_at: o.createdAt
                    }))
                  }, null, 2)}

                  {selectedApiEndpoint === 'post-checkout' && JSON.stringify({
                    status: 'success',
                    message: 'Sifarişiniz uğurla qəbul edildi!',
                    order_id: 'ORD-2026-8812',
                    status_code: 'pending',
                    tracking_url: 'https://mavi.az/orders/ORD-2026-8812'
                  }, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal for Creating / Editing Product */}
        {isFormOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-blue-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-bold text-sm text-slate-900">
                  {editingProduct ? 'Məhsulu Redaktə Et' : 'Yeni Məhsul Yarat'}
                </h4>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Məhsulun Adı</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kateqoriya</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Köynək">Köynək</option>
                      <option value="Pencək">Pencək</option>
                      <option value="Don">Don</option>
                      <option value="Sviter">Sviter</option>
                      <option value="Şalvar">Şalvar</option>
                      <option value="Ayaqqabı">Ayaqqabı</option>
                      <option value="Aksessuar">Aksessuar</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Cins</label>
                    <select
                      value={formGender}
                      onChange={(e) => setFormGender(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Kişi">Kişi</option>
                      <option value="Qadın">Qadın</option>
                      <option value="Uniseks">Uniseks</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Qiymət (AZN)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Stok Sayı</label>
                    <input
                      type="number"
                      required
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Şəkil URL</label>
                  <input
                    type="url"
                    required
                    value={formImg}
                    onChange={(e) => setFormImg(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Təsvir</label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Yadda Saxla</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
