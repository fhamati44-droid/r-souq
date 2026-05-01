import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowRight, Package, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['clothing','electronics','home','sports','beauty','books','toys','food','general'];
const CAT_LABELS = { clothing:'ملابس', electronics:'إلكترونيات', home:'منزل', sports:'رياضة', beauty:'جمال', books:'كتب', toys:'ألعاب', food:'طعام', general:'عام' };

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [store, setStore] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', original_price: '', cost_price: '',
    category: 'general', brand: '', stock: '', images: [], tags: '', is_active: true,
  });

  useEffect(() => {
    const init = async () => {
      const user = await base44.auth.me();
      const stores = await base44.entities.Store.filter({ owner_email: user.email });
      if (!stores.length) { navigate('/seller/register'); return; }
      setStore(stores[0]);

      if (isEdit) {
        const product = await base44.entities.Product.filter({ id });
        if (product.length) {
          const p = product[0];
          setForm({ ...p, tags: (p.tags || []).join(', '), price: p.price?.toString(), original_price: p.original_price?.toString() || '', cost_price: p.cost_price?.toString() || '', stock: p.stock?.toString() });
        }
      }
    };
    init();
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, images: [...f.images, file_url] }));
    setUploading(false);
    toast.success('تم رفع الصورة');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error('أدخل اسم المنتج والسعر'); return; }
    setLoading(true);
    const data = {
      ...form,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      cost_price: form.cost_price ? parseFloat(form.cost_price) : null,
      stock: parseInt(form.stock) || 0,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      store_id: store?.id,
      store_name: store?.store_name,
      owner_email: store?.owner_email,
    };

    if (isEdit) {
      await base44.entities.Product.update(id, data);
      toast.success('تم تحديث المنتج');
    } else {
      await base44.entities.Product.create(data);
      toast.success('تم إضافة المنتج 🎉');
    }
    navigate('/seller/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/seller/dashboard" className="text-muted-foreground hover:text-foreground">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-violet-600" />
          </div>
          <h1 className="text-xl font-extrabold">{isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
            <h2 className="font-bold">المعلومات الأساسية</h2>
            <div>
              <Label>اسم المنتج *</Label>
              <Input className="mt-1 rounded-xl" value={form.name} onChange={e => set('name', e.target.value)} placeholder="أدخل اسم المنتج" required />
            </div>
            <div>
              <Label>وصف المنتج</Label>
              <textarea className="w-full mt-1 px-3 py-2 rounded-xl border border-input text-sm resize-none h-24" value={form.description} onChange={e => set('description', e.target.value)} placeholder="اكتب وصفاً للمنتج..." />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>القسم</Label>
                <select className="w-full mt-1 h-10 px-3 rounded-xl border border-input bg-background text-sm" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select>
              </div>
              <div>
                <Label>العلامة التجارية</Label>
                <Input className="mt-1 rounded-xl" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="اختياري" />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
            <h2 className="font-bold">التسعير</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>سعر البيع * (ر.س)</Label>
                <Input className="mt-1 rounded-xl" type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" required />
              </div>
              <div>
                <Label>السعر قبل الخصم (ر.س)</Label>
                <Input className="mt-1 rounded-xl" type="number" step="0.01" min="0" value={form.original_price} onChange={e => set('original_price', e.target.value)} placeholder="اختياري" />
              </div>
              <div>
                <Label>سعر التكلفة (ر.س)</Label>
                <Input className="mt-1 rounded-xl" type="number" step="0.01" min="0" value={form.cost_price} onChange={e => set('cost_price', e.target.value)} placeholder="خاص بك" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">💡 سعر التكلفة خاص بك لا يظهر للمتسوقين</p>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
            <h2 className="font-bold">المخزون</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>الكمية المتوفرة</Label>
                <Input className="mt-1 rounded-xl" type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label>الوسوم (مفصولة بفاصلة)</Label>
                <Input className="mt-1 rounded-xl" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="جديد, مميز, خصم" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="font-bold mb-4">صور المنتج</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                  <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                </div>
              ))}
              <label className={`w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-violet-400 transition ${uploading ? 'opacity-50' : ''}`}>
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">{uploading ? '...' : 'رفع'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            <div>
              <Label>أو أدخل رابط صورة</Label>
              <div className="flex gap-2 mt-1">
                <Input className="rounded-xl flex-1" placeholder="https://..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (e.target.value) { set('images', [...form.images, e.target.value]); e.target.value = ''; } }}} />
                <Button type="button" variant="outline" className="rounded-xl shrink-0" onClick={(e) => { const input = e.target.closest('div').querySelector('input'); if (input?.value) { set('images', [...form.images, input.value]); input.value = ''; } }}>إضافة</Button>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="font-semibold">حالة المنتج</p>
              <p className="text-sm text-muted-foreground">{form.is_active ? 'ظاهر للمتسوقين' : 'مخفي'}</p>
            </div>
            <button type="button" onClick={() => set('is_active', !form.is_active)} className={`relative w-12 h-6 rounded-full transition-all ${form.is_active ? 'bg-violet-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.is_active ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-base">
            {loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
          </Button>
        </form>
      </div>
    </div>
  );
}