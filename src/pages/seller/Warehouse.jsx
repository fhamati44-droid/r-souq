import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Package, Plus, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import CryptoPayment from '@/components/seller/CryptoPayment';

const PRODUCT_COST = 5; // cost to add a product

export default function WarehousePage({ store, wallet, onWalletUpdate, onBack }) {
  const [products, setProducts] = useState([]);
  const [myProductIds, setMyProductIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [customPrice, setCustomPrice] = useState('');

  useEffect(() => {
    Promise.all([
      base44.entities.WarehouseProduct.filter({ is_active: true }, '-created_date', 100),
      store ? base44.entities.Product.filter({ store_id: store.id }) : Promise.resolve([]),
    ]).then(([warehouseItems, myProds]) => {
      setProducts(warehouseItems);
      setMyProductIds(new Set(myProds.map(p => p.warehouse_product_id).filter(Boolean)));
      setLoading(false);
    });
  }, [store]);

  const handleAdd = (product) => {
    if (!wallet || wallet.balance < PRODUCT_COST) {
      setPendingProduct(product);
      setCustomPrice(product.suggested_price?.toString() || '');
      setShowPayment(true);
      return;
    }
    confirmAdd(product, wallet.balance - PRODUCT_COST);
  };

  const confirmAdd = async (product, newBalance) => {
    setAdding(product.id);
    const user = await base44.auth.me();
    await base44.entities.Product.create({
      warehouse_product_id: product.id,
      store_id: store.id,
      store_name: store.store_name,
      owner_email: user.email,
      name: product.name,
      description: product.description,
      category: product.category,
      images: product.images || [],
      price: parseFloat(customPrice) || product.suggested_price || 0,
      cost_price: product.cost_price,
      brand: product.brand,
      stock: 100,
      is_active: true,
    });
    if (onWalletUpdate && wallet) {
      await base44.entities.SellerWallet.update(wallet.id, {
        balance: newBalance,
        total_spent: (wallet.total_spent || 0) + PRODUCT_COST,
      });
      onWalletUpdate({ ...wallet, balance: newBalance, total_spent: (wallet.total_spent || 0) + PRODUCT_COST });
    }
    setMyProductIds(prev => new Set([...prev, product.id]));
    setAdding(null);
    setShowPayment(false);
    setPendingProduct(null);
    toast.success(`✅ تمت إضافة "${product.name}" لمتجرك`);
  };

  const handlePaymentConfirm = async ({ crypto, cryptoAmount, txHash }) => {
    const user = await base44.auth.me();
    await base44.entities.WalletTransaction.create({
      owner_email: store.owner_email,
      store_id: store.id,
      type: 'product_add',
      amount: PRODUCT_COST,
      description: `إضافة منتج: ${pendingProduct.name} - في انتظار التحقق`,
      crypto_currency: crypto.name,
      crypto_amount: cryptoAmount,
      tx_hash: txHash,
      status: 'pending',
    });
    setShowPayment(false);
    toast.success('⏳ تم إرسال طلب الدفع! سيتم إضافة المنتج بعد التحقق');
  };

  const filtered = products.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-extrabold text-lg">مخزن المنتجات</h2>
          <p className="text-sm text-muted-foreground">اختر المنتجات التي تريد بيعها في متجرك</p>
        </div>
        {wallet && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${wallet.balance < PRODUCT_COST ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-violet-50 text-violet-700'}`}>
            {wallet.balance < PRODUCT_COST && <AlertCircle className="w-4 h-4" />}
            💰 رصيدك: {(wallet.balance || 0).toFixed(2)} ر.س
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث في المخزن..."
          className="w-full h-10 pr-9 pl-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p>لا توجد منتجات في المخزن</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((product, i) => {
            const alreadyAdded = myProductIds.has(product.id);
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&h=150&fit=crop'}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3 space-y-2">
                  <p className="font-semibold text-sm truncate">{product.name}</p>
                  {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
                  <div className="text-xs text-muted-foreground">
                    <span>مقترح: </span>
                    <span className="font-bold text-violet-600">{product.suggested_price} ر.س</span>
                  </div>
                  {alreadyAdded ? (
                    <div className="w-full text-center text-xs bg-green-100 text-green-700 py-1.5 rounded-xl font-semibold">✓ مضاف</div>
                  ) : (
                    <button
                      onClick={() => handleAdd(product)}
                      disabled={adding === product.id}
                      className="w-full text-xs bg-violet-600 text-white py-1.5 rounded-xl font-semibold hover:bg-violet-700 transition disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {adding === product.id ? 'جاري الإضافة...' : <><Plus className="w-3 h-3" /> إضافة للمتجر ({PRODUCT_COST} ر.س)</>}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && pendingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPayment(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-2" dir="rtl">شحن رصيد لإضافة المنتج</h3>
            <p className="text-sm text-muted-foreground mb-4" dir="rtl">رصيدك غير كافٍ. ادفع {PRODUCT_COST} ر.س لإضافة "{pendingProduct.name}"</p>
            <CryptoPayment
              amountSAR={PRODUCT_COST}
              onConfirm={handlePaymentConfirm}
              onCancel={() => setShowPayment(false)}
              loading={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}