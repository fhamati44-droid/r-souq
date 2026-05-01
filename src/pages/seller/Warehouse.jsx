import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Plus, Check, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CATS = [
  { id: 'all', label: 'الكل', emoji: '🛍️' },
  { id: 'clothing', label: 'ملابس', emoji: '👗' },
  { id: 'electronics', label: 'إلكترونيات', emoji: '📱' },
  { id: 'home', label: 'منزل', emoji: '🏠' },
  { id: 'sports', label: 'رياضة', emoji: '⚽' },
  { id: 'beauty', label: 'جمال', emoji: '💄' },
  { id: 'books', label: 'كتب', emoji: '📚' },
  { id: 'toys', label: 'ألعاب', emoji: '🎮' },
  { id: 'food', label: 'طعام', emoji: '🍕' },
  { id: 'general', label: 'عام', emoji: '🏪' },
];

export default function Warehouse({ store, wallet, onWalletUpdate, onBack }) {
  const [warehouseItems, setWarehouseItems] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  // Price editor state
  const [editingItem, setEditingItem] = useState(null);
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('10');

  useEffect(() => {
    const load = async () => {
      const [items, myProds] = await Promise.all([
        base44.entities.WarehouseProduct.filter({ is_active: true }),
        base44.entities.Product.filter({ store_id: store.id }),
      ]);
      setWarehouseItems(items);
      setMyProducts(myProds);
      setLoading(false);
    };
    load();
  }, [store.id]);

  const myProductWarehouseIds = myProducts.map(p => p.warehouse_product_id).filter(Boolean);

  const filtered = warehouseItems.filter(item => {
    const matchCat = category === 'all' || item.category === category;
    const matchSearch = !search || item.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAddDialog = (item) => {
    setEditingItem(item);
    setSellingPrice(item.suggested_price ? item.suggested_price.toString() : '');
    setStock('10');
  };

  const confirmAdd = async () => {
    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      toast.error('أدخل سعر البيع');
      return;
    }
    const currentBalance = wallet?.balance || 0;
    if (currentBalance < LISTING_FEE) {
      toast.error(`رصيدك غير كافٍ! تحتاج ${LISTING_FEE} ر.س لإضافة منتج. اشحن رصيدك من تبويب "المحفظة"`);
      setEditingItem(null);
      return;
    }
    setAddingId(editingItem.id);
    await base44.entities.Product.create({
      name: editingItem.name,
      description: editingItem.description,
      category: editingItem.category,
      images: editingItem.images || [],
      brand: editingItem.brand || '',
      price: parseFloat(sellingPrice),
      cost_price: editingItem.cost_price || 0,
      stock: parseInt(stock) || 10,
      is_active: true,
      store_id: store.id,
      store_name: store.store_name,
      owner_email: store.owner_email,
      warehouse_product_id: editingItem.id,
    });

    // Deduct balance
    const newBalance = currentBalance - LISTING_FEE;
    if (wallet?.id) {
      await base44.entities.SellerWallet.update(wallet.id, {
        balance: newBalance,
        total_spent: (wallet.total_spent || 0) + LISTING_FEE,
      });
      onWalletUpdate({ ...wallet, balance: newBalance, total_spent: (wallet.total_spent || 0) + LISTING_FEE });
    }
    await base44.entities.WalletTransaction.create({
      owner_email: store.owner_email,
      store_id: store.id,
      type: 'product_add',
      amount: LISTING_FEE,
      description: `إضافة منتج: ${editingItem.name}`,
      status: 'confirmed',
    });

    const updated = await base44.entities.Product.filter({ store_id: store.id });
    setMyProducts(updated);
    setEditingItem(null);
    setAddingId(null);
    toast.success(`✅ تم إضافة "${editingItem.name}" لمتجرك (خُصم ${LISTING_FEE} ر.س)`);
  };

  const LISTING_FEE = 10;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl">مخزن المنتجات</h2>
            <p className="text-sm text-muted-foreground">رسوم إضافة منتج: {LISTING_FEE} ر.س</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl text-sm font-bold ${(wallet?.balance || 0) >= LISTING_FEE ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          💰 {(wallet?.balance || 0).toFixed(0)} ر.س
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="pr-10 rounded-xl bg-white"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {CATS.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${category === cat.id ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300'}`}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>لا توجد منتجات في هذا القسم</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((item) => {
            const isAdded = myProductWarehouseIds.includes(item.id);
            return (
              <motion.div key={item.id} whileHover={{ y: -2 }} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  <img
                    src={item.images?.[0] || `https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=300&fit=crop`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm line-clamp-2 mb-1">{item.name}</p>
                  {item.suggested_price && (
                    <p className="text-xs text-muted-foreground mb-2">سعر مقترح: {item.suggested_price} ر.س</p>
                  )}
                  {isAdded ? (
                    <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 rounded-xl p-2 justify-center">
                      <Check className="w-4 h-4" /> مضاف لمتجرك
                    </div>
                  ) : (
                    <button
                      onClick={() => openAddDialog(item)}
                      className="w-full flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold py-2 rounded-xl transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> أضف لمتجري
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Price Dialog */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingItem(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
              onClick={e => e.stopPropagation()}
              dir="rtl"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={editingItem.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=80&h=80&fit=crop'}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold">{editingItem.name}</h3>
                  {editingItem.cost_price && (
                    <p className="text-xs text-muted-foreground">سعر التكلفة: {editingItem.cost_price} ر.س</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold block mb-1">سعر البيع (ر.س) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={sellingPrice}
                    onChange={e => setSellingPrice(e.target.value)}
                    placeholder={`مقترح: ${editingItem.suggested_price || 0} ر.س`}
                    className="rounded-xl text-lg font-bold"
                    autoFocus
                  />
                  {editingItem.suggested_price && sellingPrice && (
                    <p className={`text-xs mt-1 ${parseFloat(sellingPrice) > editingItem.suggested_price ? 'text-green-600' : 'text-amber-600'}`}>
                      {parseFloat(sellingPrice) > editingItem.suggested_price
                        ? `ربح: ${(parseFloat(sellingPrice) - (editingItem.cost_price || 0)).toFixed(2)} ر.س للقطعة 🎉`
                        : 'السعر أقل من المقترح'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1">الكمية</label>
                  <Input
                    type="number"
                    min="1"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditingItem(null)}>إلغاء</Button>
                <Button
                  className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 font-bold"
                  onClick={confirmAdd}
                  disabled={addingId === editingItem.id}
                >
                  {addingId === editingItem.id ? '...' : 'إضافة للمتجر'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}