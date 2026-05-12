import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Download, CheckCircle, Loader2, Package, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function CJImport() {
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState({});
  const [importedIds, setImportedIds] = useState(new Set());
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedAll, setSelectedAll] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);

  const search = async (p = 1) => {
    if (!keyword.trim()) return;
    setLoading(true);
    setPage(p);
    const res = await base44.functions.invoke('cjProducts', { action: 'search', keyword, page: p, size: 20 });
    setProducts(res.data.products || []);
    setTotal(res.data.total || 0);
    setLoading(false);
  };

  const importProduct = async (product) => {
    setImporting(prev => ({ ...prev, [product.id]: true }));
    const res = await base44.functions.invoke('cjProducts', { action: 'import', product });
    if (res.data.success) {
      setImportedIds(prev => new Set([...prev, product.id]));
      toast.success('✅ تم استيراد المنتج للمستودع');
    } else {
      toast.info(res.data.message || 'المنتج موجود مسبقاً');
      setImportedIds(prev => new Set([...prev, product.id]));
    }
    setImporting(prev => ({ ...prev, [product.id]: false }));
  };

  const importAll = async () => {
    if (!products.length) return;
    setBulkImporting(true);
    const res = await base44.functions.invoke('cjProducts', { action: 'importBulk', products });
    toast.success(`✅ تم استيراد ${res.data.imported} منتج، ${res.data.skipped} موجود مسبقاً`);
    setImportedIds(prev => new Set([...prev, ...products.map(p => p.id)]));
    setBulkImporting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <img src="https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/f2fc9bc96_download11.png"
            alt="CJ" className="h-10 object-contain" />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">استيراد منتجات CJ Dropshipping</h1>
            <p className="text-sm text-slate-500">ابحث عن منتجات وأضفها لمستودع المنصة</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
          <div className="flex gap-3">
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search(1)}
              placeholder="ابحث عن منتج... (مثال: hoodie, phone case, watch)"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 transition"
            />
            <Button onClick={() => search(1)} disabled={loading || !keyword.trim()}
              className="rounded-xl font-bold px-6" style={{ background: '#7b2d8b' }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              بحث
            </Button>
          </div>
          {total > 0 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <p className="text-sm text-slate-500">تم العثور على <span className="font-bold text-violet-700">{total.toLocaleString()}</span> منتج</p>
              <Button onClick={importAll} disabled={bulkImporting} variant="outline"
                className="text-sm rounded-xl border-violet-300 text-violet-700 hover:bg-violet-50">
                {bulkImporting ? <Loader2 className="w-3.5 h-3.5 animate-spin ml-1" /> : <Download className="w-3.5 h-3.5 ml-1" />}
                استيراد الكل ({products.length})
              </Button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-bold text-slate-500">ابحث عن منتجات CJ Dropshipping</p>
            <p className="text-sm text-slate-400 mt-1">اكتب اسم المنتج بالإنجليزية وابحث</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map(product => {
                const isImported = importedIds.has(product.id);
                const isImporting = importing[product.id];
                return (
                  <div key={product.id} className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all ${isImported ? 'border-green-300 bg-green-50/30' : 'border-slate-100'}`}>
                    <div className="relative">
                      <img src={product.bigImage} alt={product.nameEn}
                        className="w-full h-44 object-cover" />
                      {isImported && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                      )}
                      {product.addMarkStatus === 1 && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">شحن مجاني</span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-slate-700 line-clamp-2 mb-2 leading-snug min-h-[2.5rem]">{product.nameEn}</p>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs text-slate-400">سعر CJ</p>
                          <p className="font-extrabold text-sm text-violet-700">${product.nowPrice || product.sellPrice}</p>
                        </div>
                        {product.threeCategoryName && (
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full truncate max-w-[80px]">{product.threeCategoryName}</span>
                        )}
                      </div>
                      <button
                        onClick={() => !isImported && importProduct(product)}
                        disabled={isImporting || isImported}
                        className={`w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                          isImported
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'text-white hover:opacity-90'
                        }`}
                        style={!isImported ? { background: '#7b2d8b' } : {}}>
                        {isImporting ? (
                          <><Loader2 className="w-3 h-3 animate-spin" /> جاري الاستيراد</>
                        ) : isImported ? (
                          <><CheckCircle className="w-3 h-3" /> تم الاستيراد</>
                        ) : (
                          <><Download className="w-3 h-3" /> أضف للمستودع</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button variant="outline" onClick={() => search(page - 1)} disabled={page === 1 || loading} className="rounded-xl">
                السابق
              </Button>
              <span className="text-sm text-slate-600 font-semibold">صفحة {page}</span>
              <Button variant="outline" onClick={() => search(page + 1)} disabled={loading} className="rounded-xl">
                التالي
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}