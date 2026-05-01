import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Store, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CryptoPayment from '@/components/seller/CryptoPayment';

const plans = [
  { id: 'basic', name: 'أساسي', price: 49, maxProducts: 50, color: 'from-slate-500 to-slate-700', features: ['50 منتج', 'صفحة متجر', 'دعم بريد'] },
  { id: 'pro', name: 'احترافي', price: 99, maxProducts: 200, color: 'from-violet-500 to-indigo-600', popular: true, features: ['200 منتج', 'إحصائيات', 'دعم أولوية', 'ظهور في البحث'] },
  { id: 'premium', name: 'مميز', price: 199, maxProducts: 9999, color: 'from-amber-500 to-orange-600', features: ['منتجات لا محدودة', 'حملات إعلانية', 'إبراز متجر', 'دعم VIP'] },
];

export default function SellerRegister() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const defaultPlan = urlParams.get('plan') || 'pro';

  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ store_name: '', store_description: '', category: 'general', phone: '', location: '' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const plan = plans.find(p => p.id === selectedPlan);

  const handleCryptoConfirm = async ({ crypto, cryptoAmount, txHash }) => {
    if (!form.store_name) { toast.error('أدخل اسم المتجر'); return; }
    setLoading(true);
    const user = await base44.auth.me();
    const today = new Date();
    const expires = new Date(today);
    expires.setMonth(expires.getMonth() + 1);

    const store = await base44.entities.Store.create({
      ...form,
      owner_email: user.email,
      owner_name: user.full_name,
      status: 'active',
      subscription_plan: selectedPlan,
      subscription_expires: expires.toISOString().split('T')[0],
      is_featured: selectedPlan === 'premium',
      rating: 0,
      total_sales: 0,
    });

    // Create wallet with initial balance
    await base44.entities.SellerWallet.create({
      owner_email: user.email,
      store_id: store.id,
      balance: 0,
      total_deposited: 0,
      total_spent: plan.price,
    });

    // Record subscription transaction
    await base44.entities.WalletTransaction.create({
      owner_email: user.email,
      store_id: store.id,
      type: 'subscription',
      amount: plan.price,
      description: `اشتراك باقة ${plan.name}`,
      crypto_currency: crypto.name,
      crypto_amount: cryptoAmount,
      tx_hash: txHash,
      status: 'confirmed',
    });

    await base44.entities.StoreSubscription.create({
      store_id: store.id,
      owner_email: user.email,
      plan: selectedPlan,
      amount_paid: plan.price,
      status: 'paid',
      valid_from: today.toISOString().split('T')[0],
      valid_until: expires.toISOString().split('T')[0],
    });

    toast.success('تم إنشاء متجرك بنجاح! 🎉');
    navigate('/seller/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2">أنشئ متجرك</h1>
          <p className="text-muted-foreground">ابدأ رحلتك كبائع ناجح</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[{ n: 1, l: 'اختر الباقة' }, { n: 2, l: 'معلومات المتجر' }, { n: 3, l: 'الدفع' }].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.n ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{s.n}</div>
              <span className={`text-sm hidden sm:block ${step >= s.n ? 'text-violet-600 font-semibold' : 'text-muted-foreground'}`}>{s.l}</span>
              {i < 2 && <div className={`w-10 h-0.5 ${step > s.n ? 'bg-violet-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Choose Plan */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {plans.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`relative rounded-2xl p-6 border-2 text-right transition-all ${selectedPlan === p.id ? 'border-violet-500 bg-white shadow-lg shadow-violet-100' : 'border-slate-200 bg-white hover:border-violet-300'}`}
                >
                  {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs px-3 py-0.5 rounded-full">الأشهر</span>}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-3`}>
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-2xl font-extrabold text-violet-600 mt-1">{p.price} <span className="text-sm text-muted-foreground font-normal">ر.س/شهر</span></p>
                  <ul className="mt-4 space-y-1.5">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className={`mt-5 w-full py-2.5 rounded-full text-sm font-bold text-center transition-all ${selectedPlan === p.id ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}>
                    ابدأ الآن
                  </div>
                  {selectedPlan === p.id && <div className="absolute top-3 left-3 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center"><CheckCircle className="w-3 h-3 text-white" /></div>}
                </button>
              ))}
            </div>
            <div className="text-center">
              <Button onClick={() => setStep(2)} className="rounded-full px-10 bg-gradient-to-r from-violet-600 to-indigo-600 gap-2 font-bold">
                التالي <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Store Info */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="font-bold text-xl mb-6">معلومات متجرك</h2>
              <div className="space-y-5">
                <div>
                  <Label>اسم المتجر *</Label>
                  <Input className="mt-1 rounded-xl" value={form.store_name} onChange={e => set('store_name', e.target.value)} placeholder="مثال: متجر الإلكترونيات الذكية" />
                </div>
                <div>
                  <Label>وصف المتجر</Label>
                  <Input className="mt-1 rounded-xl" value={form.store_description} onChange={e => set('store_description', e.target.value)} placeholder="اكتب وصفاً موجزاً لمتجرك" />
                </div>
                <div>
                  <Label>قسم المتجر</Label>
                  <select className="w-full mt-1 h-10 px-3 rounded-xl border border-input bg-background text-sm" value={form.category} onChange={e => set('category', e.target.value)}>
                    {['clothing','electronics','home','sports','beauty','books','toys','food','general'].map(c => (
                      <option key={c} value={c}>{c === 'clothing' ? 'ملابس' : c === 'electronics' ? 'إلكترونيات' : c === 'home' ? 'منزل' : c === 'sports' ? 'رياضة' : c === 'beauty' ? 'جمال' : c === 'books' ? 'كتب' : c === 'toys' ? 'ألعاب' : c === 'food' ? 'طعام' : 'عام'}</option>
                    ))}
                  </select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>رقم الهاتف</Label>
                    <Input className="mt-1 rounded-xl" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+966 5XX XXX XXXX" />
                  </div>
                  <div>
                    <Label>الموقع / المدينة</Label>
                    <Input className="mt-1 rounded-xl" value={form.location} onChange={e => set('location', e.target.value)} placeholder="الرياض، جدة..." />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setStep(1)} className="rounded-full flex-1">رجوع</Button>
                <Button onClick={() => setStep(3)} className="rounded-full flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 gap-2 font-bold">
                  التالي <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Crypto Payment */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-lg">₿</span>
                </div>
                <div>
                  <h2 className="font-bold text-xl">الدفع بالعملات الرقمية</h2>
                  <p className="text-sm text-muted-foreground">ادفع رسوم الاشتراك لفتح متجرك</p>
                </div>
              </div>
              <CryptoPayment
                amountSAR={plan.price}
                onConfirm={handleCryptoConfirm}
                onCancel={() => setStep(2)}
                loading={loading}
              />
            </div>
          </motion.div>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          لديك متجر بالفعل؟ <Link to="/seller/dashboard" className="text-violet-600 font-semibold hover:underline">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}