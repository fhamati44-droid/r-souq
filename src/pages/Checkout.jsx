import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle, CreditCard, Wallet, Banknote, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    shipping_address: '', shipping_city: '', shipping_country: '',
    payment_method: 'credit_card',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.shipping_address) {
      toast.error('يرجى تعبئة الحقول المطلوبة');
      return;
    }
    setLoading(true);
    const orderNum = 'ORD-' + Date.now().toString().slice(-8);
    await base44.entities.Order.create({
      ...form,
      order_number: orderNum,
      items: cartItems.map(i => ({
        product_id: i.product_id,
        product_name: i.product_name,
        product_image: i.product_image,
        quantity: i.quantity,
        price: i.price,
      })),
      total_amount: cartTotal,
      status: 'pending',
      tracking_number: 'TRK-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    clearCart();
    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50" dir="rtl">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-extrabold mb-2">تم تأكيد طلبك! 🎉</h2>
          <p className="text-muted-foreground mb-8">يمكنك تتبع طلبك من صفحة الطلبات</p>
          <Button onClick={() => navigate('/orders')} className="rounded-full px-8 bg-violet-600">طلباتي</Button>
        </motion.div>
      </div>
    );
  }

  const payMethods = [
    { value: 'credit_card', label: 'بطاقة ائتمان', icon: CreditCard },
    { value: 'paypal', label: 'PayPal', icon: Wallet },
    { value: 'cash_on_delivery', label: 'الدفع عند الاستلام', icon: Banknote },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/cart" className="text-muted-foreground hover:text-foreground"><ArrowRight className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-extrabold">إتمام الطلب</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Shipping */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="font-bold text-lg mb-4">معلومات الشحن</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>الاسم الكامل *</Label>
                    <Input className="mt-1 rounded-xl" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} required />
                  </div>
                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <Input className="mt-1 rounded-xl" type="email" value={form.customer_email} onChange={e => set('customer_email', e.target.value)} />
                  </div>
                  <div>
                    <Label>الهاتف</Label>
                    <Input className="mt-1 rounded-xl" value={form.customer_phone} onChange={e => set('customer_phone', e.target.value)} />
                  </div>
                  <div>
                    <Label>المدينة</Label>
                    <Input className="mt-1 rounded-xl" value={form.shipping_city} onChange={e => set('shipping_city', e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>العنوان *</Label>
                    <Input className="mt-1 rounded-xl" value={form.shipping_address} onChange={e => set('shipping_address', e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="font-bold text-lg mb-4">طريقة الدفع</h2>
                <div className="grid grid-cols-3 gap-3">
                  {payMethods.map(m => (
                    <button key={m.value} type="button" onClick={() => set('payment_method', m.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${form.payment_method === m.value ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-violet-300'}`}>
                      <m.icon className={`w-6 h-6 ${form.payment_method === m.value ? 'text-violet-600' : 'text-muted-foreground'}`} />
                      <span className="text-xs font-medium text-center">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit sticky top-6">
              <h2 className="font-bold text-lg mb-4">ملخص الطلب</h2>
              <div className="space-y-2 mb-4">
                {cartItems.map(item => (
                  <div key={item.product_id} className="flex items-center gap-2 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-1 font-medium">{item.product_name}</p>
                      <p className="text-muted-foreground">×{item.quantity}</p>
                    </div>
                    <p className="font-semibold shrink-0">{(item.price * item.quantity).toFixed(2)} ر.س</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span className="text-green-600 font-semibold">مجاني</span>
                </div>
                <div className="flex justify-between font-extrabold text-base">
                  <span>الإجمالي</span>
                  <span className="text-violet-600">{cartTotal.toFixed(2)} ر.س</span>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full mt-5 h-12 rounded-full font-bold text-base bg-violet-600 hover:bg-violet-700">
                {loading ? 'جاري الطلب...' : 'تأكيد الطلب'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}