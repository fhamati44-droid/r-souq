import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  LayoutDashboard, Store, Users, Package, ShoppingBag,
  ShieldCheck, Zap, LogOut, Menu, X, TrendingUp, DollarSign,
  Clock, CheckCircle, XCircle, AlertTriangle, ChevronRight,
  Search, Eye, MoreVertical, Warehouse, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const NAV = [
  { path: '/admin', label: 'الرئيسية', icon: LayoutDashboard, exact: true },
  { path: '/admin/payments', label: 'المدفوعات المعلقة', icon: DollarSign },
  { path: '/admin/kyc', label: 'طلبات KYC', icon: ShieldCheck },
  { path: '/admin/stores', label: 'المتاجر', icon: Store },
  { path: '/admin/sellers', label: 'البائعون', icon: Users },
  { path: '/admin/products', label: 'المنتجات', icon: Package },
  { path: '/admin/orders', label: 'الطلبات', icon: ShoppingBag },
  { path: '/admin/warehouse', label: 'المخزن', icon: Warehouse },
];

function Sidebar({ open, setOpen }) {
  const location = useLocation();
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed top-0 right-0 h-full w-64 bg-slate-900 text-white z-40 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-sm">سوق بلس</p>
            <p className="text-xs text-slate-400">لوحة الإدارة</p>
          </div>
          <button className="lg:hidden mr-auto text-slate-400" onClick={() => setOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV.map(item => {
            const active = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path) && item.path !== '/admin';
            const isHome = item.exact && location.pathname === '/admin';
            const isActive = isHome || active;
            return (
              <Link key={item.path} to={item.path} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <LogOut className="w-4 h-4" /> العودة للموقع
          </Link>
        </div>
      </aside>
    </>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user.role !== 'admin') {
        navigate('/');
      } else {
        setIsAdmin(true);
      }
    });
  }, []);

  if (isAdmin === null) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="lg:mr-64">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-3 sticky top-0 z-20">
          <button className="lg:hidden text-slate-600" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <span className="text-xs bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-semibold">Admin Panel</span>
        </header>

        <main className="p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/payments" element={<PendingPaymentsPage />} />
            <Route path="/kyc" element={<KYCPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/sellers" element={<SellersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/warehouse" element={<WarehouseMgmtPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function OverviewPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingKyc, setPendingKyc] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);

  useEffect(() => {
    Promise.all([
      base44.entities.Store.list('-created_date', 200),
      base44.entities.Order.list('-created_date', 100),
      base44.entities.Product.list('-created_date', 200),
      base44.entities.SellerKYC.filter({ status: 'pending' }),
      base44.entities.WalletTransaction.filter({ status: 'pending' }),
    ]).then(([stores, orders, products, kycs, pendingTxs]) => {
      const revenue = orders.reduce((s, o) => s + (o.total_amount || 0), 0);
      setStats({
        stores: stores.length,
        orders: orders.length,
        products: products.length,
        revenue,
        activeStores: stores.filter(s => s.status === 'active').length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
      });
      setRecentOrders(orders.slice(0, 8));
      setPendingKyc(kycs.length);
      setPendingPayments(pendingTxs.length);
    });
  }, []);

  if (!stats) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground mt-1">مرحباً! إليك ملخص المنصة</p>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {pendingPayments > 0 && (
          <Link to="/admin/payments">
            <div className="bg-red-50 border border-red-300 rounded-2xl p-4 flex items-center gap-3 hover:bg-red-100 transition cursor-pointer">
              <DollarSign className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm font-semibold text-red-800">يوجد {pendingPayments} دفعة معلقة تحتاج موافقة</p>
              <ChevronRight className="w-4 h-4 text-red-600 mr-auto" />
            </div>
          </Link>
        )}
        {pendingKyc > 0 && (
          <Link to="/admin/kyc">
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center gap-3 hover:bg-amber-100 transition cursor-pointer">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm font-semibold text-amber-800">يوجد {pendingKyc} طلب KYC بانتظار المراجعة</p>
              <ChevronRight className="w-4 h-4 text-amber-600 mr-auto" />
            </div>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الإيرادات', value: `${stats.revenue.toFixed(0)} ر.س`, icon: DollarSign, color: 'text-green-600 bg-green-100' },
          { label: 'المتاجر النشطة', value: stats.activeStores, icon: Store, color: 'text-violet-600 bg-violet-100' },
          { label: 'إجمالي الطلبات', value: stats.orders, icon: ShoppingBag, color: 'text-blue-600 bg-blue-100' },
          { label: 'المنتجات', value: stats.products, icon: Package, color: 'text-orange-600 bg-orange-100' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-800">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold">أحدث الطلبات</h2>
          <Link to="/admin/orders" className="text-xs text-violet-600 font-semibold hover:underline">عرض الكل</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentOrders.map(o => (
            <OrderRow key={o.id} order={o} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── KYC Page ─────────────────────────────────────────────────────────────────
function KYCPage() {
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.SellerKYC.list('-created_date', 100).then(data => {
      setKycs(data);
      setLoading(false);
    });
  }, []);

  const approve = async (kyc) => {
    await base44.entities.SellerKYC.update(kyc.id, { status: 'approved' });
    setKycs(prev => prev.map(k => k.id === kyc.id ? { ...k, status: 'approved' } : k));
    setSelected(null);
    toast.success('✅ تم قبول الطلب');
  };

  const reject = async (kyc, reason) => {
    await base44.entities.SellerKYC.update(kyc.id, { status: 'rejected', rejection_reason: reason });
    setKycs(prev => prev.map(k => k.id === kyc.id ? { ...k, status: 'rejected', rejection_reason: reason } : k));
    setSelected(null);
    toast.success('تم رفض الطلب');
  };

  const filtered = kycs.filter(k => k.status === filter);
  const counts = { pending: kycs.filter(k => k.status === 'pending').length, approved: kycs.filter(k => k.status === 'approved').length, rejected: kycs.filter(k => k.status === 'rejected').length };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-slate-800">طلبات التحقق (KYC)</h1>

      <div className="flex gap-2">
        {[['pending','قيد المراجعة','bg-amber-100 text-amber-700'],['approved','مقبول','bg-green-100 text-green-700'],['rejected','مرفوض','bg-red-100 text-red-700']].map(([val,lbl,cls]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition border-2 ${filter === val ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-600 hover:border-violet-300'}`}>
            {lbl} <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${cls}`}>{counts[val]}</span>
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">لا توجد طلبات</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map(kyc => (
                <div key={kyc.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0 font-bold text-violet-600">
                    {kyc.full_name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{kyc.full_name}</p>
                    <p className="text-xs text-muted-foreground">{kyc.owner_email} | {kyc.national_id}</p>
                    <p className="text-xs text-muted-foreground">{kyc.phone} | {kyc.country}</p>
                  </div>
                  <StatusBadge status={kyc.status} />
                  <Button size="sm" variant="outline" className="rounded-xl text-xs" onClick={() => setSelected(kyc)}>
                    <Eye className="w-3.5 h-3.5 ml-1" /> مراجعة
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selected && <KYCModal kyc={selected} onClose={() => setSelected(null)} onApprove={approve} onReject={reject} />}
    </div>
  );
}

function KYCModal({ kyc, onClose, onApprove, onReject }) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showReject, setShowReject] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg">مراجعة طلب KYC</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoRow label="الاسم" value={kyc.full_name} />
            <InfoRow label="رقم الهوية" value={kyc.national_id} />
            <InfoRow label="الجوال" value={kyc.phone} />
            <InfoRow label="الدولة" value={kyc.country} />
            <InfoRow label="البريد" value={kyc.owner_email} />
            <InfoRow label="الحالة" value={<StatusBadge status={kyc.status} />} />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">الوثائق المرفوعة</p>
            <div className="grid grid-cols-3 gap-2">
              {[['وجه الهوية (أمام)', kyc.id_front_url], ['وجه الهوية (خلف)', kyc.id_back_url], ['سيلفي', kyc.selfie_url]].map(([lbl, url]) => (
                <a key={lbl} href={url} target="_blank" rel="noopener noreferrer" className="block">
                  <img src={url} alt={lbl} className="w-full h-24 object-cover rounded-xl border border-slate-200 hover:opacity-80 transition" onError={e => e.target.src = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=120&fit=crop'} />
                  <p className="text-xs text-center text-muted-foreground mt-1">{lbl}</p>
                </a>
              ))}
            </div>
          </div>
          {kyc.rejection_reason && (
            <div className="bg-red-50 rounded-xl p-3 text-sm text-red-700">
              <p className="font-semibold mb-1">سبب الرفض السابق:</p>
              <p>{kyc.rejection_reason}</p>
            </div>
          )}
          {showReject ? (
            <div className="space-y-2">
              <textarea className="w-full h-24 px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none" placeholder="سبب الرفض..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={() => onReject(kyc, rejectionReason)} variant="destructive" className="flex-1 rounded-xl">تأكيد الرفض</Button>
                <Button onClick={() => setShowReject(false)} variant="outline" className="rounded-xl">إلغاء</Button>
              </div>
            </div>
          ) : kyc.status === 'pending' ? (
            <div className="flex gap-3 pt-2">
              <Button onClick={() => onApprove(kyc)} className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 gap-2"><CheckCircle className="w-4 h-4" /> قبول</Button>
              <Button onClick={() => setShowReject(true)} variant="destructive" className="flex-1 rounded-xl gap-2"><XCircle className="w-4 h-4" /> رفض</Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Stores Page ───────────────────────────────────────────────────────────────
function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    base44.entities.Store.list('-created_date', 200).then(data => { setStores(data); setLoading(false); });
  }, []);

  const toggleStatus = async (store) => {
    const newStatus = store.status === 'active' ? 'suspended' : 'active';
    await base44.entities.Store.update(store.id, { status: newStatus });
    setStores(prev => prev.map(s => s.id === store.id ? { ...s, status: newStatus } : s));
    toast.success('تم التحديث');
  };

  const filtered = stores.filter(s =>
    !search || s.store_name?.toLowerCase().includes(search.toLowerCase()) || s.owner_email?.includes(search)
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-800">المتاجر ({stores.length})</h1>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="h-9 pr-9 pl-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 w-52" />
        </div>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-right px-5 py-3 font-semibold text-muted-foreground">المتجر</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">الباقة</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">انتهاء الاشتراك</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">الحالة</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(store => (
                <tr key={store.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3">
                    <p className="font-semibold">{store.store_name}</p>
                    <p className="text-xs text-muted-foreground">{store.owner_email}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">{store.subscription_plan}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{store.subscription_expires || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={store.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(store)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition ${store.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {store.status === 'active' ? 'تعليق' : 'تفعيل'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Sellers Page ──────────────────────────────────────────────────────────────
function SellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editWallet, setEditWallet] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadSellers = () => {
    Promise.all([
      base44.entities.SellerKYC.list('-created_date', 200),
      base44.entities.Store.list('-created_date', 200),
      base44.entities.SellerWallet.list('-created_date', 200),
    ]).then(([kycs, stores, wallets]) => {
      const merged = kycs.map(k => ({
        ...k,
        store: stores.find(s => s.owner_email === k.owner_email),
        wallet: wallets.find(w => w.owner_email === k.owner_email),
      }));
      setSellers(merged);
      setLoading(false);
    });
  };

  useEffect(() => { loadSellers(); }, []);

  // Delete seller: removes KYC, store, wallet, products, transactions
  const deleteSeller = async (seller) => {
    setProcessing(true);
    const email = seller.owner_email;
    // Delete KYC
    await base44.entities.SellerKYC.delete(seller.id);
    // Delete store and its products
    if (seller.store) {
      const products = await base44.entities.Product.filter({ store_id: seller.store.id });
      await Promise.all(products.map(p => base44.entities.Product.delete(p.id)));
      await base44.entities.Store.delete(seller.store.id);
    }
    // Delete wallet and transactions
    if (seller.wallet) {
      const txs = await base44.entities.WalletTransaction.filter({ owner_email: email });
      await Promise.all(txs.map(t => base44.entities.WalletTransaction.delete(t.id)));
      await base44.entities.SellerWallet.delete(seller.wallet.id);
    }
    setSellers(prev => prev.filter(s => s.id !== seller.id));
    setConfirmDelete(null);
    setProcessing(false);
    toast.success('✅ تم حذف البائع وجميع بياناته');
  };

  // Edit wallet balance directly
  const saveWalletBalance = async () => {
    if (!editWallet || newBalance === '') return;
    setProcessing(true);
    const amount = parseFloat(newBalance);
    await base44.entities.SellerWallet.update(editWallet.wallet.id, { balance: amount });
    setSellers(prev => prev.map(s => s.id === editWallet.id ? { ...s, wallet: { ...s.wallet, balance: amount } } : s));
    setEditWallet(null);
    setNewBalance('');
    setProcessing(false);
    toast.success('✅ تم تحديث الرصيد');
  };

  const filtered = sellers.filter(s =>
    !search || s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.owner_email?.includes(search)
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-800">البائعون ({sellers.length})</h1>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="h-9 pr-9 pl-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 w-52" />
        </div>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="grid gap-3">
          {filtered.map(seller => (
            <div key={seller.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center font-bold text-violet-600 text-lg shrink-0">
                {seller.full_name?.[0] || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold">{seller.full_name}</p>
                  <StatusBadge status={seller.status} />
                </div>
                <p className="text-xs text-muted-foreground">{seller.owner_email}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {seller.store && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">🏪 {seller.store.store_name}</span>}
                  {seller.wallet && (
                    <button
                      onClick={() => { setEditWallet(seller); setNewBalance(seller.wallet.balance?.toString() || '0'); }}
                      className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full hover:bg-green-100 transition"
                    >
                      💰 {seller.wallet.balance?.toFixed(0)} ر.س ✏️
                    </button>
                  )}
                  <span className="text-xs text-muted-foreground">🪪 {seller.national_id}</span>
                </div>
              </div>
              <button
                onClick={() => setConfirmDelete(seller)}
                className="text-xs px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition shrink-0"
              >
                🗑 حذف
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="font-bold text-lg text-center mb-2">تأكيد حذف البائع</h3>
            <p className="text-sm text-muted-foreground text-center mb-1">سيتم حذف جميع بيانات البائع:</p>
            <p className="font-bold text-center text-sm mb-1">{confirmDelete.full_name}</p>
            <p className="text-xs text-muted-foreground text-center mb-4">{confirmDelete.owner_email}</p>
            <div className="bg-red-50 rounded-xl p-3 text-xs text-red-700 mb-5 space-y-1">
              <p>⚠️ سيتم حذف: بيانات KYC، المتجر، المنتجات، المحفظة، المعاملات</p>
              <p className="font-bold">هذا الإجراء لا يمكن التراجع عنه!</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setConfirmDelete(null)}>إلغاء</Button>
              <Button variant="destructive" className="flex-1 rounded-xl gap-1" disabled={processing} onClick={() => deleteSeller(confirmDelete)}>
                {processing ? 'جاري الحذف...' : <><XCircle className="w-4 h-4" /> تأكيد الحذف</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Wallet Balance Modal */}
      {editWallet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditWallet(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-1">تعديل رصيد المحفظة</h3>
            <p className="text-sm text-muted-foreground mb-4">{editWallet.full_name} — {editWallet.owner_email}</p>
            <label className="text-sm font-semibold block mb-2">الرصيد الجديد (ر.س)</label>
            <input
              type="number"
              value={newBalance}
              onChange={e => setNewBalance(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 border-violet-300 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-violet-400 mb-4"
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditWallet(null)}>إلغاء</Button>
              <Button className="flex-1 rounded-xl bg-violet-600" disabled={processing} onClick={saveWalletBalance}>
                {processing ? 'جاري الحفظ...' : 'حفظ الرصيد'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Products Page ─────────────────────────────────────────────────────────────
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    base44.entities.Product.list('-created_date', 200).then(data => { setProducts(data); setLoading(false); });
  }, []);

  const toggleProduct = async (p) => {
    await base44.entities.Product.update(p.id, { is_active: !p.is_active });
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x));
    toast.success('تم التحديث');
  };

  const deleteProduct = async (id) => {
    await base44.entities.Product.delete(id);
    setProducts(prev => prev.filter(x => x.id !== id));
    toast.success('تم الحذف');
  };

  const filtered = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.store_name?.includes(search)
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-800">المنتجات ({products.length})</h1>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="h-9 pr-9 pl-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 w-52" />
        </div>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map(p => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-3">
                <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=60&h=60&fit=crop'} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{typeof p.name === 'object' ? (p.name?.ar || p.name?.en || '') : p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.store_name} | {p.price} ر.س</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{p.is_active ? 'نشط' : 'مخفي'}</span>
                <button onClick={() => toggleProduct(p)} className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-600">تبديل</button>
                <button onClick={() => deleteProduct(p.id)} className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Orders Page ───────────────────────────────────────────────────────────────
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    base44.entities.Order.list('-created_date', 200).then(data => { setOrders(data); setLoading(false); });
  }, []);

  const updateStatus = async (order, status) => {
    await base44.entities.Order.update(order.id, { status });
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status } : o));
    toast.success('تم تحديث حالة الطلب');
  };

  const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled'];
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-slate-800">الطلبات ({orders.length})</h1>
      <div className="flex gap-2 flex-wrap">
        {[['all','الكل'],['pending','معلق'],['confirmed','مؤكد'],['shipped','مشحون'],['delivered','مسلّم'],['cancelled','ملغي']].map(([val,lbl]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${filter === val ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300'}`}>
            {lbl}
          </button>
        ))}
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map(o => (
              <div key={o.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">#{o.order_number}</p>
                  <p className="text-xs text-muted-foreground">{o.customer_name} | {o.items?.length} منتج | {o.total_amount?.toFixed(2)} ر.س</p>
                </div>
                <select
                  value={o.status}
                  onChange={e => updateStatus(o, e.target.value)}
                  className="text-xs px-2 py-1 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-300"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Warehouse Mgmt ────────────────────────────────────────────────────────────
function WarehouseMgmtPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: 'general', cost_price: '', suggested_price: '', brand: '', images: [] });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    base44.entities.WarehouseProduct.list('-created_date', 200).then(data => { setItems(data); setLoading(false); });
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (!form.name || !form.cost_price || !form.suggested_price) { toast.error('أكمل الحقول المطلوبة'); return; }
    setSaving(true);
    const item = await base44.entities.WarehouseProduct.create({
      ...form,
      cost_price: parseFloat(form.cost_price),
      suggested_price: parseFloat(form.suggested_price),
      is_active: true,
    });
    setItems(prev => [item, ...prev]);
    setShowAdd(false);
    setForm({ name: '', description: '', category: 'general', cost_price: '', suggested_price: '', brand: '', images: [] });
    toast.success('تم إضافة المنتج للمخزن');
    setSaving(false);
  };

  const toggleItem = async (item) => {
    await base44.entities.WarehouseProduct.update(item.id, { is_active: !item.is_active });
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, is_active: !x.is_active } : x));
  };

  const deleteItem = async (id) => {
    await base44.entities.WarehouseProduct.delete(id);
    setItems(prev => prev.filter(x => x.id !== id));
    toast.success('تم الحذف');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-800">إدارة المخزن ({items.length})</h1>
        <Button onClick={() => setShowAdd(true)} className="rounded-xl bg-violet-600 gap-2 text-sm">+ إضافة منتج</Button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">إضافة منتج للمخزن</h3>
              <button onClick={() => setShowAdd(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={addItem} className="space-y-3" dir="rtl">
              <input className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm" placeholder="اسم المنتج *" value={form.name} onChange={e => set('name', e.target.value)} required />
              <textarea className="w-full h-20 px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none" placeholder="الوصف" value={form.description} onChange={e => set('description', e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input className="h-10 px-3 rounded-xl border border-slate-200 text-sm" type="number" placeholder="سعر التكلفة *" value={form.cost_price} onChange={e => set('cost_price', e.target.value)} required />
                <input className="h-10 px-3 rounded-xl border border-slate-200 text-sm" type="number" placeholder="السعر المقترح *" value={form.suggested_price} onChange={e => set('suggested_price', e.target.value)} required />
              </div>
              <input className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm" placeholder="الماركة / البراند" value={form.brand} onChange={e => set('brand', e.target.value)} />
              <input className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm" placeholder="رابط الصورة (URL)" onChange={e => set('images', e.target.value ? [e.target.value] : [])} />
              <select className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm" value={form.category} onChange={e => set('category', e.target.value)}>
                {['clothing','electronics','home','sports','beauty','books','toys','food','general'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving} className="flex-1 rounded-xl bg-violet-600">{saving ? 'جاري الحفظ...' : 'إضافة'}</Button>
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setShowAdd(false)}>إلغاء</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {items.map(item => (
              <div key={item.id} className="px-5 py-3 flex items-center gap-3">
                <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=60&h=60&fit=crop'} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{typeof item.name === 'object' ? (item.name?.ar || item.name?.en || '') : item.name}</p>
                  <p className="text-xs text-muted-foreground">التكلفة: {item.cost_price} ر.س | المقترح: {item.suggested_price} ر.س | {item.category}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{item.is_active ? 'نشط' : 'مخفي'}</span>
                <button onClick={() => toggleItem(item)} className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-600">تبديل</button>
                <button onClick={() => deleteItem(item.id)} className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pending Payments Page ─────────────────────────────────────────────────────
function PendingPaymentsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    base44.entities.WalletTransaction.filter({ status: 'pending' }, '-created_date', 100).then(data => {
      setTransactions(data);
      setLoading(false);
    });
  }, []);

  const confirmPayment = async (tx) => {
    setProcessing(tx.id);
    if (tx.type === 'subscription') {
      // Activate the store
      const stores = await base44.entities.Store.filter({ owner_email: tx.owner_email, status: 'pending_payment' });
      if (stores.length > 0) {
        const store = stores[0];
        const isPremium = store.subscription_plan === 'premium';
        await base44.entities.Store.update(store.id, {
          status: 'active',
          is_featured: isPremium,
        });
        // Update subscription to paid
        const subs = await base44.entities.StoreSubscription.filter({ store_id: store.id, status: 'pending' });
        if (subs.length > 0) {
          await base44.entities.StoreSubscription.update(subs[0].id, { status: 'paid' });
        }
      }
    } else if (tx.type === 'deposit') {
      // Add balance to wallet
      const wallets = await base44.entities.SellerWallet.filter({ owner_email: tx.owner_email });
      if (wallets.length > 0) {
        const wallet = wallets[0];
        await base44.entities.SellerWallet.update(wallet.id, {
          balance: (wallet.balance || 0) + tx.amount,
          total_deposited: (wallet.total_deposited || 0) + tx.amount,
        });
      }
    }
    await base44.entities.WalletTransaction.update(tx.id, { status: 'confirmed', description: tx.description?.replace(' - في انتظار التحقق', '') });
    setTransactions(prev => prev.filter(t => t.id !== tx.id));
    toast.success(`✅ تم تأكيد الدفع وتفعيل ${tx.type === 'subscription' ? 'المتجر' : 'الرصيد'}`);
    setProcessing(null);
  };

  const rejectPayment = async (tx) => {
    setProcessing(tx.id);
    await base44.entities.WalletTransaction.update(tx.id, { status: 'failed' });
    setTransactions(prev => prev.filter(t => t.id !== tx.id));
    toast.success('تم رفض المعاملة');
    setProcessing(null);
  };

  const typeLabels = { subscription: 'اشتراك متجر', deposit: 'شحن رصيد', product_add: 'إضافة منتج', campaign: 'حملة إعلانية' };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">المدفوعات المعلقة</h1>
        <p className="text-sm text-muted-foreground mt-1">راجع TX Hash وتأكد من الدفع قبل الموافقة</p>
      </div>

      {loading ? <LoadingSpinner /> : transactions.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-100">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-muted-foreground font-semibold">لا توجد مدفوعات معلقة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{tx.owner_email}</span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{typeLabels[tx.type] || tx.type}</span>
                    <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">{tx.amount} ر.س</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tx.description}</p>
                  <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">العملة:</span>
                      <span className="font-bold">{tx.crypto_currency}</span>
                      <span className="text-muted-foreground">المبلغ:</span>
                      <span className="font-bold font-mono">{tx.crypto_amount}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-muted-foreground shrink-0">TX Hash:</span>
                      <span className="font-mono text-violet-700 break-all">{tx.tx_hash}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="rounded-xl bg-green-600 hover:bg-green-700 gap-1 text-xs"
                    disabled={processing === tx.id}
                    onClick={() => confirmPayment(tx)}
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> تأكيد
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-xl gap-1 text-xs"
                    disabled={processing === tx.id}
                    onClick={() => rejectPayment(tx)}
                  >
                    <XCircle className="w-3.5 h-3.5" /> رفض
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared Components ─────────────────────────────────────────────────────────
function OrderRow({ order }) {
  const colors = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
  const labels = { pending: 'معلق', confirmed: 'مؤكد', processing: 'معالجة', shipped: 'مشحون', delivered: 'مسلّم', cancelled: 'ملغي' };
  return (
    <div className="px-5 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">#{order.order_number}</p>
        <p className="text-xs text-muted-foreground truncate">{order.customer_name}</p>
      </div>
      <p className="font-extrabold text-violet-700 text-sm">{order.total_amount?.toFixed(2)} ر.س</p>
      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${colors[order.status] || 'bg-slate-100 text-slate-500'}`}>{labels[order.status] || order.status}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-100 text-green-700',
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    pending_payment: 'bg-amber-100 text-amber-700',
    suspended: 'bg-red-100 text-red-700',
    rejected: 'bg-red-100 text-red-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
  };
  const labels = { active: 'نشط', approved: 'مقبول', pending: 'معلق', pending_payment: 'بانتظار الدفع', suspended: 'موقوف', rejected: 'مرفوض', delivered: 'مسلّم', cancelled: 'ملغي', shipped: 'مشحون', confirmed: 'مؤكد', processing: 'معالجة' };
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${map[status] || 'bg-slate-100 text-slate-500'}`}>{labels[status] || status}</span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-2.5">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );
}