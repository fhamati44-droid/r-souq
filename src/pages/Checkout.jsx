import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/CartContext';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { cartItems: items, cartTotal: total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_country: 'السعودية',
    payment_method: 'credit_card',
    notes: '',
  });
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const setCard_ = (k, v) => setCard(c => ({ ...c, [k]: v }));
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const placeOrder = async () => {
    if (!form.customer_name || !form.customer_phone || !form.shipping_address) {
      toast.error('يرجى تعبئة الحقول المطلوبة');
      return;
    }
    setLoading(true);
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    await base44.entities.Order.create({
      ...form,
      order_number: orderNumber,
      items: items.map(i => ({ product_id: i.product_id, product_name: i.product_name, product_image: i.product_image, quantity: i.quantity, price: i.price })),
      total_amount: total,
      status: 'pending',
    });
    clearCart();
    toast.success('✅ تم تقديم طلبك بنجاح!');
    navigate('/orders');
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">السلة فارغة</p>
          <Link to="/shop"><Button className="rounded-full bg-violet-600">تسوق الآن</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-3 sticky top-0 z-30">
        <Link to="/cart" className="p-1.5 rounded-lg hover:bg-slate-100 transition">
          <ArrowRight className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="font-bold">إتمام الطلب</h1>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Steps */}
        <div className="flex items-center gap-2 justify-center">
          {[{n:1,l:'البيانات'},{n:2,l:'الدفع'},{n:3,l:'المراجعة'}].map((s,i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= s.n ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{s.n}</div>
              <span className={`text-xs hidden sm:block ${step >= s.n ? 'text-violet-600 font-semibold' : 'text-muted-foreground'}`}>{s.l}</span>
              {i < 2 && <div className={`w-8 h-0.5 ${step > s.n ? 'bg-violet-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <h2 className="font-bold text-lg">بيانات الشحن</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><label className="text-sm font-medium">الاسم *</label><Input className="mt-1 rounded-xl" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} /></div>
              <div><label className="text-sm font-medium">الجوال *</label><Input className="mt-1 rounded-xl" value={form.customer_phone} onChange={e => set('customer_phone', e.target.value)} /></div>
              <div><label className="text-sm font-medium">البريد الإلكتروني</label><Input className="mt-1 rounded-xl" type="email" value={form.customer_email} onChange={e => set('customer_email', e.target.value)} /></div>
              <div><label className="text-sm font-medium">المدينة *</label><Input className="mt-1 rounded-xl" value={form.shipping_city} onChange={e => set('shipping_city', e.target.value)} /></div>
              <div className="sm:col-span-2"><label className="text-sm font-medium">العنوان *</label><Input className="mt-1 rounded-xl" value={form.shipping_address} onChange={e => set('shipping_address', e.target.value)} /></div>
            </div>
            <Button onClick={() => setStep(2)} className="w-full rounded-full bg-violet-600 font-bold">التالي</Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <h2 className="font-bold text-lg">طريقة الدفع</h2>
            {[{id:'credit_card',label:'💳 بطاقة فيزا / ماستركارد'}].map(pm => (
              <label key={pm.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${form.payment_method === pm.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}>
                <input type="radio" name="payment" value={pm.id} checked={form.payment_method === pm.id} onChange={() => set('payment_method', pm.id)} className="accent-violet-600" />
                <span className="font-medium">{pm.label}</span>
              </label>
            ))}

            {form.payment_method === 'credit_card' && (
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-slate-700">بيانات البطاقة</p>
                  <div className="flex gap-1">
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-bold">VISA</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold">MC</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">رقم البطاقة</label>
                  <input
                    className="w-full mt-1 h-10 px-3 rounded-xl border border-slate-200 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-violet-300"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={card.number}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '').slice(0,16);
                      setCard_('number', v.replace(/(.{4})/g, '$1 ').trim());
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">اسم حامل البطاقة</label>
                  <input className="w-full mt-1 h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="الاسم كما هو على البطاقة" value={card.name} onChange={e => setCard_('name', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600">تاريخ الانتهاء</label>
                    <input
                      className="w-full mt-1 h-10 px-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-300"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={card.expiry}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g,'').slice(0,4);
                        if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
                        setCard_('expiry', v);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">CVV</label>
                    <input className="w-full mt-1 h-10 px-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="***" maxLength={3} value={card.cvv} onChange={e => setCard_('cvv', e.target.value.replace(/\D/g,'').slice(0,3))} />
                  </div>
                </div>
                <p className="text-xs text-slate-400 text-center">🔒 بيانات مشفرة وآمنة</p>
              </div>
            )}

            <textarea className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none h-16" placeholder="ملاحظات الطلب (اختياري)" value={form.notes} onChange={e => set('notes', e.target.value)} />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-full">رجوع</Button>
              <Button
                onClick={() => {
                  if (form.payment_method === 'credit_card' && (!card.number || !card.name || !card.expiry || !card.cvv)) {
                    toast.error('يرجى تعبئة بيانات البطاقة كاملة');
                    return;
                  }
                  setStep(3);
                }}
                className="flex-1 rounded-full bg-violet-600 font-bold"
              >التالي</Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
              <h2 className="font-bold">مراجعة الطلب</h2>
              {items.map(item => (
                <div key={item.product_id} className="flex items-center gap-3">
                  <img src={item.product_image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=60&h=60&fit=crop'} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1"><p className="text-sm font-semibold">{typeof item.product_name === 'object' ? (item.product_name?.ar || item.product_name?.en || '') : item.product_name}</p><p className="text-xs text-muted-foreground">x{item.quantity}</p></div>
                  <p className="font-bold text-sm">{(item.price * item.quantity).toFixed(2)} ر.س</p>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-3 flex justify-between font-extrabold">
                <span>الإجمالي</span>
                <span className="text-violet-700">{total.toFixed(2)} ر.س</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 rounded-full">رجوع</Button>
              <Button onClick={placeOrder} disabled={loading} className="flex-1 rounded-full bg-violet-600 font-bold gap-2">
                <CheckCircle className="w-4 h-4" /> {loading ? 'جاري التأكيد...' : 'تأكيد الطلب'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}