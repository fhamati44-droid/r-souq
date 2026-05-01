import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Store, Package, ShoppingBag, TrendingUp, Plus, Zap, Settings, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      const user = await base44.auth.me();
      const stores = await base44.entities.Store.filter({ owner_email: user.email });
      if (stores.length === 0) { navigate('/seller/register'); return; }
      const myStore = stores[0];
      setStore(myStore);
      const [prods, ords] = await Promise.all([
        base44.entities.Product.filter({ store_id: myStore.id }, '-created_date'),
        base44.entities.Order.list('-created_date', 50),
      ]);
      setProducts(prods);
      // filter orders that contain items from this store
      setOrders(ords.filter(o => o.items?.some(i => prods.find(p => p.id === i.product_id))));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );

  const totalRevenue = orders.reduce((s, o) => s + (o.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: TrendingUp },
    { id: 'products', label: 'المنتجات', icon: Package },
    { id: 'orders', label: 'الطلبات', icon: ShoppingBag },
    { id: 'campaign', label: 'الحملات', icon: Zap },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">{store?.store_name}</h1>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${store?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {store?.status === 'active' ? 'نشط' : 'موقوف'}
                </span>
                <span className="text-xs text-muted-foreground">{store?.subscription_plan}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/shop">
              <Button variant="outline" size="sm" className="rounded-full text-xs">عرض المتجر</Button>
            </Link>
            <Link to="/seller/products/new">
              <Button size="sm" className="rounded-full bg-violet-600 gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> منتج جديد
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? 'bg-violet-600 text-white shadow' : 'text-muted-foreground hover:text-foreground hover:bg-slate-100'}`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'المنتجات', value: products.length, icon: Package, color: 'from-blue-500 to-indigo-500' },
                { label: 'الطلبات', value: orders.length, icon: ShoppingBag, color: 'from-green-500 to-emerald-500' },
                { label: 'طلبات معلقة', value: pendingOrders, icon: AlertCircle, color: 'from-orange-500 to-amber-500' },
                { label: 'الإيرادات', value: `${totalRevenue.toFixed(0)} ر.س`, icon: TrendingUp, color: 'from-violet-500 to-purple-500' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-extrabold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Campaign Banner */}
            {!store?.is_featured && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold">روّج متجرك!</p>
                    <p className="text-sm text-muted-foreground">احصل على إبراز مميز في الصفحة الرئيسية</p>
                  </div>
                </div>
                <Button onClick={() => setTab('campaign')} className="rounded-full bg-amber-500 hover:bg-amber-600 shrink-0 gap-1">
                  <Zap className="w-4 h-4" /> ابدأ حملة
                </Button>
              </div>
            )}

            {/* Recent Products */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold">آخر المنتجات</h3>
                <button onClick={() => setTab('products')} className="text-violet-600 text-sm font-medium hover:underline">عرض الكل</button>
              </div>
              {products.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>لا توجد منتجات</p>
                  <Link to="/seller/products/new"><Button className="mt-3 rounded-full" size="sm">أضف منتجك الأول</Button></Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {products.slice(0, 5).map(p => (
                    <div key={p.id} className="px-5 py-3 flex items-center gap-3">
                      <img src={p.images?.[0] || ''} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" onError={e => e.target.style.display = 'none'} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">مخزون: {p.stock}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-violet-600">{p.price} ر.س</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{p.is_active ? 'نشط' : 'مخفي'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && <ProductsTab products={products} store={store} onRefresh={async () => {
          const prods = await base44.entities.Product.filter({ store_id: store.id }, '-created_date');
          setProducts(prods);
        }} />}

        {/* Orders Tab */}
        {tab === 'orders' && <OrdersTab orders={orders} />}

        {/* Campaign Tab */}
        {tab === 'campaign' && <CampaignTab store={store} onUpdate={setStore} />}

        {/* Settings Tab */}
        {tab === 'settings' && <SettingsTab store={store} onUpdate={setStore} />}
      </div>
    </div>
  );
}

function ProductsTab({ products, store, onRefresh }) {
  const navigate = useNavigate();

  const toggleActive = async (product) => {
    await base44.entities.Product.update(product.id, { is_active: !product.is_active });
    toast.success('تم التحديث');
    onRefresh();
  };

  const deleteProduct = async (id) => {
    await base44.entities.Product.delete(id);
    toast.success('تم الحذف');
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">منتجاتي ({products.length})</h2>
        <Link to="/seller/products/new">
          <Button className="rounded-full bg-violet-600 gap-1"><Plus className="w-4 h-4" /> منتج جديد</Button>
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-100">
          <Package className="w-14 h-14 mx-auto text-slate-300 mb-4" />
          <p className="text-muted-foreground mb-4">لم تضف أي منتجات بعد</p>
          <Link to="/seller/products/new"><Button className="rounded-full">أضف منتجك الأول</Button></Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {products.map(p => (
              <div key={p.id} className="px-5 py-4 flex items-center gap-4">
                <img src={p.images?.[0] || ''} alt="" className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop' }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">مخزون: {p.stock} | {p.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-extrabold text-violet-600">{p.price} ر.س</p>
                  {p.original_price && <p className="text-xs text-muted-foreground line-through">{p.original_price} ر.س</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleActive(p)} className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${p.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    {p.is_active ? 'نشط' : 'مخفي'}
                  </button>
                  <Link to={`/seller/products/edit/${p.id}`}>
                    <button className="text-xs px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200 font-medium">تعديل</button>
                  </Link>
                  <button onClick={() => deleteProduct(p.id)} className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 font-medium">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTab({ orders }) {
  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
  const statusLabels = { pending: 'معلق', confirmed: 'مؤكد', processing: 'قيد المعالجة', shipped: 'تم الشحن', delivered: 'تم التسليم', cancelled: 'ملغي' };

  if (orders.length === 0) return (
    <div className="bg-white rounded-2xl p-16 text-center border border-slate-100">
      <ShoppingBag className="w-14 h-14 mx-auto text-slate-300 mb-4" />
      <p className="text-muted-foreground">لا توجد طلبات بعد</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="divide-y divide-slate-100">
        {orders.map(o => (
          <div key={o.id} className="px-5 py-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-bold">#{o.order_number}</p>
              <p className="text-xs text-muted-foreground">{o.customer_name} | {o.items?.length} منتج</p>
            </div>
            <p className="font-extrabold text-violet-600">{o.total_amount?.toFixed(2)} ر.س</p>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[o.status]}`}>{statusLabels[o.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignTab({ store, onUpdate }) {
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);

  const campaigns = [
    { days: 7, price: 99, label: 'أسبوع', popular: false },
    { days: 30, price: 299, label: 'شهر', popular: true },
    { days: 90, price: 699, label: '3 أشهر', popular: false },
  ];

  const startCampaign = async (c) => {
    setLoading(true);
    const user = await base44.auth.me();
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + c.days);

    await base44.entities.Campaign.create({
      store_id: store.id,
      store_name: store.store_name,
      owner_email: user.email,
      budget: c.price,
      status: 'active',
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
    });

    await base44.entities.Store.update(store.id, {
      is_featured: true,
      featured_until: end.toISOString().split('T')[0],
    });

    onUpdate({ ...store, is_featured: true });
    toast.success('🎉 تم تفعيل حملتك الإعلانية! متجرك مبرز الآن');
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {store?.is_featured && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
          <Zap className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-bold text-green-800">متجرك مبرز حالياً! 🎉</p>
            <p className="text-sm text-green-600">يظهر متجرك في أعلى الصفحة الرئيسية وفي نتائج البحث</p>
          </div>
        </div>
      )}

      <h2 className="font-bold text-lg">باقات الإعلان</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {campaigns.map((c, i) => (
          <div key={i} className={`bg-white rounded-2xl p-6 border-2 text-right ${c.popular ? 'border-amber-400 shadow-amber-50 shadow-md' : 'border-slate-200'}`}>
            {c.popular && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold mb-3 inline-block">الأشهر</span>}
            <h3 className="text-xl font-bold mb-1">{c.label}</h3>
            <p className="text-3xl font-extrabold text-amber-600 mb-1">{c.price} <span className="text-base text-muted-foreground font-normal">ر.س</span></p>
            <p className="text-sm text-muted-foreground mb-4">إبراز لمدة {c.days} يوم</p>
            <ul className="space-y-1.5 mb-5 text-sm">
              <li className="flex gap-2 text-muted-foreground"><span className="text-green-500">✓</span> ظهور في أعلى الصفحة</li>
              <li className="flex gap-2 text-muted-foreground"><span className="text-green-500">✓</span> شارة "مميز"</li>
              <li className="flex gap-2 text-muted-foreground"><span className="text-green-500">✓</span> أولوية في البحث</li>
            </ul>
            <Button
              onClick={() => startCampaign(c)}
              disabled={loading}
              className={`w-full rounded-full font-bold ${c.popular ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
              variant={c.popular ? 'default' : 'outline'}
            >
              {loading ? '...' : 'ابدأ الحملة'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ store, onUpdate }) {
  const [form, setForm] = useState({ store_name: store?.store_name || '', store_description: store?.store_description || '', phone: store?.phone || '', location: store?.location || '' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setLoading(true);
    const updated = await base44.entities.Store.update(store.id, form);
    onUpdate({ ...store, ...form });
    toast.success('تم حفظ التغييرات');
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-xl">
      <h2 className="font-bold text-lg mb-5">إعدادات المتجر</h2>
      <div className="space-y-4">
        <div><label className="text-sm font-medium">اسم المتجر</label><input className="w-full mt-1 h-10 px-3 rounded-xl border border-input bg-background text-sm" value={form.store_name} onChange={e => set('store_name', e.target.value)} /></div>
        <div><label className="text-sm font-medium">وصف المتجر</label><textarea className="w-full mt-1 px-3 py-2 rounded-xl border border-input bg-background text-sm resize-none h-20" value={form.store_description} onChange={e => set('store_description', e.target.value)} /></div>
        <div><label className="text-sm font-medium">الهاتف</label><input className="w-full mt-1 h-10 px-3 rounded-xl border border-input bg-background text-sm" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
        <div><label className="text-sm font-medium">الموقع</label><input className="w-full mt-1 h-10 px-3 rounded-xl border border-input bg-background text-sm" value={form.location} onChange={e => set('location', e.target.value)} /></div>
      </div>
      <Button onClick={save} disabled={loading} className="mt-6 rounded-full bg-violet-600">
        {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </Button>
    </div>
  );
}