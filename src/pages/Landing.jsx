import { Link } from 'react-router-dom';
import { Store, ShoppingBag, Star, Zap, Shield, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'أساسي',
    nameEn: 'Basic',
    price: 49,
    period: 'شهرياً',
    color: 'from-slate-500 to-slate-700',
    features: ['حتى 50 منتج', 'لوحة تحكم بسيطة', 'دعم عبر البريد', 'صفحة متجر'],
  },
  {
    name: 'احترافي',
    nameEn: 'Pro',
    price: 99,
    period: 'شهرياً',
    color: 'from-violet-500 to-indigo-600',
    popular: true,
    features: ['حتى 200 منتج', 'إحصائيات المبيعات', 'دعم أولوية', 'تخصيص المتجر', 'ظهور في نتائج البحث'],
  },
  {
    name: 'مميز',
    nameEn: 'Premium',
    price: 199,
    period: 'شهرياً',
    color: 'from-amber-500 to-orange-600',
    features: ['منتجات غير محدودة', 'حملات إعلانية', 'إبراز المتجر', 'دعم VIP 24/7', 'أولوية في الصفحة الرئيسية'],
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              سوق بلس
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/shop" className="hidden sm:block">
              <Button variant="ghost" className="rounded-full gap-2">
                <ShoppingBag className="w-4 h-4" /> تسوق الآن
              </Button>
            </Link>
            <Link to="/seller/register" className="hidden sm:block">
              <Button className="rounded-full gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90">
                <Store className="w-4 h-4" /> افتح متجرك
              </Button>
            </Link>
            <Link to="/seller/dashboard">
              <Button variant="outline" className="rounded-full text-sm">دخول البائع</Button>
            </Link>

          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white overflow-hidden py-24">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-6">
              🚀 المنصة الأولى للتجارة الإلكترونية
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              افتح متجرك الإلكتروني<br />
              <span className="text-yellow-300">في دقائق</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
              انضم لآلاف البائعين الناجحين. أنشئ متجرك، أضف منتجاتك، وابدأ البيع فوراً
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/seller/register">
                <Button size="lg" className="rounded-full bg-white text-violet-700 hover:bg-white/90 font-bold px-10 shadow-xl text-base gap-2">
                  <Store className="w-5 h-5" /> ابدأ كبائع
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline" className="rounded-full border-white/40 text-white hover:bg-white/10 font-semibold px-10 text-base gap-2">
                  <ShoppingBag className="w-5 h-5" /> تصفح المنتجات
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: '5,000+', l: 'بائع نشط' },
            { n: '200,000+', l: 'منتج معروض' },
            { n: '1M+', l: 'متسوق' },
            { n: '98%', l: 'رضا العملاء' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-extrabold text-violet-600">{s.n}</p>
              <p className="text-muted-foreground text-sm mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-center mb-14">كيف يعمل؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Store, step: '01', title: 'سجّل وادفع الاشتراك', desc: 'اختر الباقة المناسبة وادفع رسوم إنشاء المتجر الشهرية' },
              { icon: Zap, step: '02', title: 'أضف منتجاتك', desc: 'أضف منتجاتك من المخزن وحدد أسعارك بحرية كاملة' },
              { icon: TrendingUp, step: '03', title: 'ابدأ البيع', desc: 'تلقّ الطلبات وروّج متجرك بحملات إعلانية مدفوعة' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-violet-600" />
                </div>
                <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">{item.step}</span>
                <h3 className="text-lg font-bold mt-2 mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-center mb-3">باقات الاشتراك</h2>
          <p className="text-center text-muted-foreground mb-14">اختر الباقة المناسبة لحجم تجارتك</p>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl border-2 p-8 ${plan.popular ? 'border-violet-500 shadow-xl shadow-violet-100' : 'border-slate-200'}`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-4 py-1 rounded-full text-xs font-bold">الأكثر شعبية</span>
                )}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-extrabold">{plan.name}</h3>
                <div className="mt-3 mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground"> ر.س / {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={`/seller/register?plan=${plan.nameEn.toLowerCase()}`}>
                  <Button className={`w-full rounded-full font-bold ${plan.popular ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                    ابدأ الآن
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign CTA */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50 border-y border-amber-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <TrendingUp className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-extrabold mb-3">روّج متجرك بحملة إعلانية</h2>
          <p className="text-muted-foreground mb-6">ادفع رسوم الحملة واحصل على إبراز مميز في الصفحة الرئيسية وأعلى نتائج البحث</p>
          <Link to="/seller/dashboard">
            <Button className="rounded-full bg-amber-500 hover:bg-amber-600 font-bold px-8 gap-2">
              <Zap className="w-4 h-4" /> ابدأ حملتك الآن
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Store className="w-5 h-5 text-violet-400" />
          <span className="font-bold text-lg">سوق بلس</span>
        </div>
        <p className="text-slate-400 text-sm">© 2026 سوق بلس. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}