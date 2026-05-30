import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Store, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CryptoPayment from '@/components/seller/CryptoPayment';

export default function SellerRegister() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [customAmount, setCustomAmount] = useState('');
  const [form, setForm] = useState({ store_name: '', store_description: '', category: 'general', phone: '', location: '' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const amount = parseFloat(customAmount) || 0;

  const prepareStoreAndWallet = async (user) => {
    const today = new Date();
    const expires = new Date(today);
    expires.setMonth(expires.getMonth() + 1);

    const existingStores = await base44.entities.Store.filter({ owner_email: user.email });
    let store;
    if (existingStores.length > 0) {
      store = existingStores[0];
    } else {
      store = await base44.entities.Store.create({
        ...form,
        owner_email: user.email,
        owner_name: user.full_name,
        status: 'pending_payment',
        subscription_plan: 'basic',
        subscription_expires: expires.toISOString().split('T')[0],
        is_featured: false,
        rating: 0,
        total_sales: 0,
      });
    }

    const existingWallets = await base44.entities.SellerWallet.filter({ owner_email: user.email });
    if (existingWallets.length === 0) {
      await base44.entities.SellerWallet.create({
        owner_email: user.email,
        store_id: store.id,
        balance: 0,
        total_deposited: 0,
        total_spent: 0,
      });
    }

    return { store, today, expires };
  };

  const handleStripePayment = async () => {
    if (!form.store_name) { toast.error('أدخل اسم المتجر'); return; }
    if (!amount || amount <= 0) { toast.error('أدخل مبلغ الاشتراك'); return; }
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) {
      toast.error('يجب تسجيل الدخول أولاً');
      base44.auth.redirectToLogin('/seller/register');
      return;
    }
    setLoading(true);
    const user = await base44.auth.me();
    await prepareStoreAndWallet(user);

    const res = await base44.functions.invoke('stripeCheckout', {
      action: 'create_subscription_checkout',
      planId: 'custom',
      planName: 'اشتراك متجر',
      planPrice: amount,
      storeData: form,
      successUrl: `${window.location.origin}/seller/dashboard?payment=success`,
      cancelUrl: `${window.location.origin}/seller/register?payment=cancelled`,
    });

    if (res.data?.url) {
      window.location.href = res.data.url;
      return;
    }
    toast.error('حدث خطأ، حاول مرة أخرى');
    setLoading(false);
  };

  const handleCryptoConfirm = async ({ crypto, cryptoAmount, txHash }) => {
    if (!form.store_name) { toast.error('أدخل اسم المتجر'); return; }
    if (!amount || amount <= 0) { toast.error('أدخل مبلغ الاشتراك'); return; }
    setLoading(true);

    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) {
      setLoading(false);
      toast.error('يجب تسجيل الدخول أولاً لإتمام عملية الدفع');
      base44.auth.redirectToLogin('/seller/register');
      return;
    }

    const user = await base44.auth.me();
    const { store, today, expires } = await prepareStoreAndWallet(user);

    await base44.entities.WalletTransaction.create({
      owner_email: user.email,
      store_id: store.id,
      type: 'subscription',
      amount,
      description: `اشتراك متجر - في انتظار التحقق`,
      crypto_currency: crypto.name,
      crypto_amount: cryptoAmount,
      tx_hash: txHash,
      status: 'pending',
    });

    await base44.entities.StoreSubscription.create({
      store_id: store.id,
      owner_email: user.email,
      plan: 'basic',
      amount_paid: amount,
      status: 'pending',
      valid_from: today.toISOString().split('T')[0],
      valid_until: expires.toISOString().split('T')[0],
      notes: `TX Hash: ${txHash} | ${crypto.name}: ${cryptoAmount}`,
    });

    toast.success('✅ تم إرسال طلبك! سيتم تفعيل متجرك بعد التحقق من الدفع');
    setLoading(false);
    navigate('/seller/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl" style={{ background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 40%, #e8eaf6 100%)' }}>
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #9c27b0, #7b2d8b)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #673ab7, #512da8)' }} />
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(#7b2d8b 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
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
          {[{ n: 1, l: 'معلومات المتجر' }, { n: 2, l: 'الدفع' }].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.n ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{s.n}</div>
              <span className={`text-sm hidden sm:block ${step >= s.n ? 'text-violet-600 font-semibold' : 'text-muted-foreground'}`}>{s.l}</span>
              {i < 1 && <div className={`w-10 h-0.5 ${step > s.n ? 'bg-violet-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Store Info */}
        {step === 1 && (
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
              <div className="mt-8">
                <Button onClick={() => { if (!form.store_name) { toast.error('أدخل اسم المتجر'); return; } setStep(2); }} className="rounded-full w-full bg-gradient-to-r from-violet-600 to-indigo-600 gap-2 font-bold">
                  التالي <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800 mb-5 text-right">
                ⚠️ تأكد من أنك <button onClick={() => base44.auth.redirectToLogin('/seller/register')} className="font-bold underline">مسجل الدخول</button> قبل إتمام الدفع.
              </div>

              <h2 className="font-bold text-xl mb-2">الدفع</h2>
              <p className="text-sm text-muted-foreground mb-5">سيحدد فريقنا الباقة المناسبة لك بناءً على المبلغ المدفوع</p>

              {/* Custom Amount */}
              <div className="mb-6">
                <Label>مبلغ الاشتراك (ر.س) *</Label>
                <Input
                  type="number"
                  min="1"
                  className="mt-1 rounded-xl text-lg font-bold text-violet-700 text-center h-12"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  placeholder="أدخل المبلغ..."
                />
                {amount > 0 && (
                  <p className="text-center mt-2 text-sm font-semibold text-violet-600">المبلغ: {amount.toLocaleString()} ر.س</p>
                )}
              </div>

              {/* Payment method tabs */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'stripe' ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-violet-300'}`}
                >
                  <span className="text-2xl">💳</span>
                  <span className="font-bold text-sm">بطاقة ائتمانية</span>
                  <span className="text-xs text-slate-400">Visa / Mastercard</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('crypto')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'crypto' ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-violet-300'}`}
                >
                  <span className="text-2xl">₿</span>
                  <span className="font-bold text-sm">عملات رقمية</span>
                  <span className="text-xs text-slate-400">USDT / BTC / ETH</span>
                </button>
              </div>

              {paymentMethod === 'stripe' && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800 flex items-center gap-2">
                    <span>🔒</span> دفع آمن عبر Stripe — ستُحوَّل لصفحة دفع آمنة
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-full flex-1">رجوع</Button>
                    <Button onClick={handleStripePayment} disabled={loading || !amount} className="rounded-full flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 font-bold gap-2">
                      {loading ? 'جاري التحويل...' : amount > 0 ? `ادفع ${amount.toLocaleString()} ر.س` : 'ادفع'}
                    </Button>
                  </div>
                </div>
              )}

              {paymentMethod === 'crypto' && (
                <CryptoPayment
                  amountSAR={amount || 0}
                  onConfirm={handleCryptoConfirm}
                  onCancel={() => setStep(1)}
                  loading={loading}
                />
              )}
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