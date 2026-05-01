import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Store, Package, ShoppingBag, TrendingUp, Plus, Zap, Settings, AlertCircle, Warehouse, Star, Wallet } from 'lucide-react';
import CryptoPayment from '@/components/seller/CryptoPayment';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import WarehousePage from './Warehouse';
import KYCGate from '@/components/seller/KYCGate';

export default function SellerDashboard() {
  return (
    <KYCGate>
      <SellerDashboardContent />
    </KYCGate>
  );
}

function SellerDashboardContent() {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('warehouse');

  useEffect(() => {
    const load = async () => {
      const user = await base44.auth.me();
      const stores = await base44.entities.Store.filter({ owner_email: user.email });
      if (stores.length === 0) { navigate('/seller/register'); return; }
      const myStore = stores[0];
      setStore(myStore);
      const [prods, ords, wallets] = await Promise.all([
        base44.entities.Product.filter({ store_id: myStore.id }, '-created_date'),
        base44.entities.Order.list('-created_date', 50),
        base44.entities.SellerWallet.filter({ owner_email: user.email }),
      ]);
      setProducts(prods);
      setOrders(ords.filter(o => o.items?.some(i => prods.find(p => p.id === i.product_id))));
      setWallet(wallets[0] || null);
      setLoading(false);
    };
    load();
  }, []);

  const refreshProducts = async () => {
    const prods = await base44.entities.Product.filter({ store_id: store.id }, '-created_date');
    setProducts(prods);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );

  const totalRevenue = orders.reduce((s, o) => s + (o.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const tabs = [
    { id: 'warehouse', label: 'مخزن المنتجات', icon: Warehouse },
    { id: 'products', label: 'منتجاتي', icon: Package },
    { id: 'orders', label: 'الطلبات', icon: ShoppingBag },
    { id: 'wallet', label: 'المحفظة', icon: Wallet },
    { id: 'campaign', label: 'الإعلانات', icon: Zap },
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
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">نشط</span>
                <span className="text-xs text-muted-foreground">{store?.subscription_plan}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/shop">
              <Button variant="outline" size="sm" className="rounded-full text-xs">عرض المتجر</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-3 sm:grid-cols-4 gap-4">
          {[
            { label: 'المنتجات', value: products.length, icon: '📦' },
            { label: 'الطلبات', value: orders.length, icon: '🛒' },
            { label: 'معلق', value: pendingOrders, icon: '⏳' },
            { label: 'الإيرادات', value: `${totalRevenue.toFixed(0)} ر.س`, icon: '💰' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-muted-foreground mb-0.5">{stat.icon} {stat.label}</p>
              <p className="font-extrabold text-violet-700">{stat.value}</p>
            </div>
          ))}
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
              {t.id === 'orders' && pendingOrders > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{pendingOrders}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'warehouse' && (
          <WarehousePage store={store} wallet={wallet} onWalletUpdate={setWallet} onBack={() => setTab('products')} />
        )}

        {tab === 'wallet' && (
          <WalletTab store={store} wallet={wallet} onWalletUpdate={setWallet} />
        )}

        {tab === 'products' && (
          <MyProductsTab products={products} store={store} onRefresh={refreshProducts} />
        )}

        {tab === 'orders' && <OrdersTab orders={orders} />}

        {tab === 'campaign' && <CampaignTab store={store} onUpdate={setStore} />}

        {tab === 'settings' && <SettingsTab store={store} onUpdate={setStore} />}
      </div>
    </div>
  );
}

function MyProductsTab({ products, store, onRefresh }) {
  const toggleActive = async (product) => {
    await base44.entities.Product.update(product.id, { is_active: !product.is_active });
    toast.success('تم التحديث');
    onRefresh();
  };

  const removeProduct = async (id) => {
    await base44.entities.Product.delete(id);
    toast.success('تم الحذف');
    onRefresh();
  };

  const updatePrice = async (product, newPrice) => {
    if (!newPrice || parseFloat(newPrice) <= 0) return;
    await base44.entities.Product.update(product.id, { price: parseFloat(newPrice) });
    toast.success('تم تحديث السعر');
    onRefresh();
  };

  if (products.length === 0) return (
    <div className="bg-white rounded-2xl p-16 text-center border border-slate-100">
      <Package className="w-14 h-14 mx-auto text-slate-300 mb-4" />
      <p className="text-muted-foreground mb-4">لم تضف أي منتجات بعد</p>
      <p className="text-sm text-muted-foreground mb-4">اذهب لـ "مخزن المنتجات" واختر ما تريد بيعه</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">منتجاتي في المتجر ({products.length})</h2>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {products.map(p => (
            <ProductRow key={p.id} product={p} onToggle={toggleActive} onRemove={removeProduct} onUpdatePrice={updatePrice} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductRow({ product, onToggle, onRemove, onUpdatePrice }) {
  const [editingPrice, setEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(product.price?.toString());

  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <img
        src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=80&h=80&fit=crop'}
        alt=""
        className="w-12 h-12 rounded-xl object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">مخزون: {product.stock}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {editingPrice ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={newPrice}
              onChange={e => setNewPrice(e.target.value)}
              className="w-20 h-7 px-2 rounded-lg border border-violet-300 text-sm font-bold text-center"
              autoFocus
            />
            <button
              onClick={() => { onUpdatePrice(product, newPrice); setEditingPrice(false); }}
              className="text-xs bg-violet-600 text-white px-2 py-1 rounded-lg"
            >✓</button>
            <button onClick={() => setEditingPrice(false)} className="text-xs text-slate-400">✕</button>
          </div>
        ) : (
          <button onClick={() => setEditingPrice(true)} className="font-extrabold text-violet-600 hover:bg-violet-50 px-2 py-1 rounded-lg transition text-sm">
            {product.price} ر.س
          </button>
        )}
        <button
          onClick={() => onToggle(product)}
          className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
        >
          {product.is_active ? 'نشط' : 'مخفي'}
        </button>
        <button onClick={() => onRemove(product.id)} className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 font-medium">حذف</button>
      </div>
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
  const [loading, setLoading] = useState(false);

  const campaigns = [
    { days: 7, price: 99, label: 'أسبوع' },
    { days: 30, price: 299, label: 'شهر', popular: true },
    { days: 90, price: 699, label: '3 أشهر' },
  ];

  const startCampaign = async (c) => {
    setLoading(true);
    const user = await base44.auth.me();
    const end = new Date();
    end.setDate(end.getDate() + c.days);
    await base44.entities.Campaign.create({
      store_id: store.id, store_name: store.store_name, owner_email: user.email,
      budget: c.price, status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
    });
    await base44.entities.Store.update(store.id, { is_featured: true, featured_until: end.toISOString().split('T')[0] });
    onUpdate({ ...store, is_featured: true });
    toast.success('🎉 تم تفعيل الحملة! متجرك مبرز الآن');
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      {store?.is_featured && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
          <Zap className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-bold text-green-800">متجرك مبرز حالياً! 🎉</p>
            <p className="text-sm text-green-600">يظهر في أعلى الصفحة الرئيسية</p>
          </div>
        </div>
      )}
      <h2 className="font-bold text-lg">باقات الإعلان</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {campaigns.map((c, i) => (
          <div key={i} className={`bg-white rounded-2xl p-6 border-2 text-right ${c.popular ? 'border-amber-400' : 'border-slate-200'}`}>
            {c.popular && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold mb-3 inline-block">الأشهر</span>}
            <h3 className="text-xl font-bold">{c.label}</h3>
            <p className="text-3xl font-extrabold text-amber-600">{c.price} <span className="text-base text-muted-foreground font-normal">ر.س</span></p>
            <p className="text-sm text-muted-foreground mb-4">{c.days} يوم إبراز</p>
            <Button onClick={() => startCampaign(c)} disabled={loading} className={`w-full rounded-full font-bold ${c.popular ? 'bg-amber-500 hover:bg-amber-600' : ''}`} variant={c.popular ? 'default' : 'outline'}>
              ابدأ الحملة
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function WalletTab({ store, wallet, onWalletUpdate }) {
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (store) {
      base44.entities.WalletTransaction.filter({ owner_email: store.owner_email }, '-created_date', 20).then(setTransactions);
    }
  }, [store]);

  const handleDeposit = async ({ crypto, cryptoAmount, txHash }) => {
    setLoading(true);
    const amount = parseFloat(depositAmount);
    const user = await base44.auth.me();

    // Create transaction as pending - admin must verify before balance is added
    await base44.entities.WalletTransaction.create({
      owner_email: store.owner_email,
      store_id: store.id,
      type: 'deposit',
      amount,
      description: `شحن رصيد - في انتظار التحقق`,
      crypto_currency: crypto.name,
      crypto_amount: cryptoAmount,
      tx_hash: txHash,
      status: 'pending',
    });

    const updated = await base44.entities.WalletTransaction.filter({ owner_email: store.owner_email }, '-created_date', 20);
    setTransactions(updated);
    setShowDeposit(false);
    setDepositAmount('');
    toast.success(`⏳ تم إرسال طلب الشحن! سيتم إضافة ${amount} ر.س لرصيدك بعد التحقق من الدفع`);
    setLoading(false);
  };

  const typeLabels = { deposit: 'شحن رصيد', subscription: 'اشتراك', product_add: 'إضافة منتج', campaign: 'حملة إعلانية' };
  const typeColors = { deposit: 'text-green-600', subscription: 'text-red-500', product_add: 'text-red-500', campaign: 'text-red-500' };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white">
        <p className="text-sm opacity-80 mb-1">رصيدك الحالي</p>
        <p className="text-4xl font-extrabold">{(wallet?.balance || 0).toFixed(2)} <span className="text-xl opacity-70">ر.س</span></p>
        <div className="flex items-center gap-4 mt-4 text-sm opacity-80">
          <span>إجمالي الشحن: {(wallet?.total_deposited || 0).toFixed(2)} ر.س</span>
          <span>المصروف: {(wallet?.total_spent || 0).toFixed(2)} ر.س</span>
        </div>
        <button
          onClick={() => setShowDeposit(true)}
          className="mt-4 bg-white text-violet-700 font-bold px-5 py-2 rounded-full text-sm hover:bg-white/90 transition"
        >
          + شحن رصيد بالعملات الرقمية
        </button>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeposit(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4" dir="rtl">شحن الرصيد</h3>
            {!depositAmount ? (
              <div dir="rtl" className="space-y-3">
                <label className="text-sm font-semibold block">المبلغ المراد شحنه (ر.س)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[100, 250, 500, 1000, 2000, 5000].map(a => (
                    <button key={a} onClick={() => setDepositAmount(a.toString())} className="py-3 rounded-xl border-2 border-slate-200 hover:border-violet-400 font-bold text-sm transition">
                      {a} ر.س
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="number" placeholder="مبلغ مخصص..." className="flex-1 h-10 px-3 rounded-xl border border-slate-200 text-sm" onKeyDown={e => { if (e.key === 'Enter' && e.target.value) setDepositAmount(e.target.value); }} />
                  <Button variant="outline" className="rounded-xl" onClick={() => { const i = document.querySelector('input[type=number]'); if (i?.value) setDepositAmount(i.value); }}>تأكيد</Button>
                </div>
                <Button variant="outline" className="w-full rounded-xl" onClick={() => setShowDeposit(false)}>إلغاء</Button>
              </div>
            ) : (
              <div>
                <CryptoPayment
                  amountSAR={parseFloat(depositAmount)}
                  onConfirm={handleDeposit}
                  onCancel={() => setDepositAmount('')}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold">سجل المعاملات</h3>
        </div>
        {transactions.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">لا توجد معاملات بعد</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map(tx => (
              <div key={tx.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{typeLabels[tx.type] || tx.type}</p>
                  <p className="text-xs text-muted-foreground">{tx.description}</p>
                  {tx.crypto_currency && <p className="text-xs text-muted-foreground font-mono">{tx.crypto_amount} {tx.crypto_currency}</p>}
                </div>
                <p className={`font-extrabold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.type === 'deposit' ? '+' : '-'}{tx.amount} ر.س
                </p>
              </div>
            ))}
          </div>
        )}
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
    await base44.entities.Store.update(store.id, form);
    onUpdate({ ...store, ...form });
    toast.success('تم حفظ التغييرات');
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-xl">
      <h2 className="font-bold text-lg mb-5">إعدادات المتجر</h2>
      <div className="space-y-4">
        <div><label className="text-sm font-medium">اسم المتجر</label><input className="w-full mt-1 h-10 px-3 rounded-xl border border-slate-200 text-sm" value={form.store_name} onChange={e => set('store_name', e.target.value)} /></div>
        <div><label className="text-sm font-medium">وصف المتجر</label><textarea className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none h-20" value={form.store_description} onChange={e => set('store_description', e.target.value)} /></div>
        <div><label className="text-sm font-medium">الهاتف</label><input className="w-full mt-1 h-10 px-3 rounded-xl border border-slate-200 text-sm" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
        <div><label className="text-sm font-medium">الموقع</label><input className="w-full mt-1 h-10 px-3 rounded-xl border border-slate-200 text-sm" value={form.location} onChange={e => set('location', e.target.value)} /></div>
      </div>
      <Button onClick={save} disabled={loading} className="mt-6 rounded-full bg-violet-600">{loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</Button>
    </div>
  );
}