import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Store, ShoppingBag, Star, Zap, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import HeroSlider from '@/components/landing/HeroSlider';

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
      <nav className="sticky top-0 z-50 backdrop-blur shadow-md" style={{ background: '#6a1b9a', borderBottom: '2px solid #9c27b0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-white">R souq</span>
            <span className="text-3xl">🚚</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/shop" className="hidden sm:block">
              <Button variant="ghost" className="rounded-full gap-2 text-white hover:bg-white/20">
                <ShoppingBag className="w-4 h-4" /> تسوق الآن
              </Button>
            </Link>
            <Link to="/seller/register" className="hidden sm:block">
              <Button className="rounded-full gap-2 bg-white font-bold" style={{ color: '#7b2d8b' }}>
                <Store className="w-4 h-4" /> افتح متجرك
              </Button>
            </Link>
            <button
              onClick={() => base44.auth.redirectToLogin('/seller/dashboard')}
              className="rounded-full text-sm border border-white/40 text-white hover:bg-white/20 px-4 py-2 transition"
            >دخول البائع</button>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <HeroSlider />

      {/* CTA Bar */}
      <div style={{ background: '#7b2d8b' }} className="py-5">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4">
          <p className="text-white font-bold text-lg">🚀 افتح متجرك الإلكتروني في دقائق</p>
          <div className="flex gap-3">
            <Link to="/seller/register">
              <Button size="sm" className="rounded-full bg-white font-bold gap-1" style={{ color: '#7b2d8b' }}>
                <Store className="w-4 h-4" /> ابدأ كبائع
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="sm" variant="outline" className="rounded-full border-white/50 text-white hover:bg-white/10 gap-1">
                <ShoppingBag className="w-4 h-4" /> تسوق الآن
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="bg-white border-b border-purple-100 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: '5,000+', l: 'بائع نشط' },
            { n: '200,000+', l: 'منتج معروض' },
            { n: '1M+', l: 'متسوق' },
            { n: '98%', l: 'رضا العملاء' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-extrabold" style={{ color: '#7b2d8b' }}>{s.n}</p>
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
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#f3e5f5' }}>
                  <item.icon className="w-7 h-7" style={{ color: '#7b2d8b' }} />
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
                className={`relative rounded-3xl border-2 p-8 ${plan.popular ? 'shadow-xl' : 'border-slate-200'}`}
                style={plan.popular ? { borderColor: '#7b2d8b', boxShadow: '0 10px 40px rgba(123,45,139,0.15)' } : {}}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-white px-4 py-1 rounded-full text-xs font-bold" style={{ background: '#7b2d8b' }}>الأكثر شعبية</span>
                )}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-extrabold">{plan.name}</h3>
                <div className="mt-3 mb-6">
                  <span className="text-4xl font-extrabold" style={{ color: '#7b2d8b' }}>{plan.price}</span>
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
                  <Button className="w-full rounded-full font-bold" variant={plan.popular ? 'default' : 'outline'} style={plan.popular ? { background: '#7b2d8b' } : {}}>
                    ابدأ الآن
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign CTA */}
      <section className="py-16 border-y" style={{ background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 100%)', borderColor: '#ce93d8' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#e1bee7' }}>
            <TrendingUp className="w-8 h-8" style={{ color: '#7b2d8b' }} />
          </div>
          <h2 className="text-2xl font-extrabold mb-3">روّج متجرك بحملة إعلانية</h2>
          <p className="text-muted-foreground mb-6">افتح متجرك، أضف منتجاتك، وابدأ البيع لملايين المتسوقين — كل هذا في مكان واحد!</p>
          <Link to="/seller/dashboard">
            <Button className="rounded-full font-bold px-8 gap-2" style={{ background: '#7b2d8b' }}>
              <Zap className="w-4 h-4" /> ابدأ حملتك الآن
            </Button>
          </Link>
        </div>
      </section>

      <footer className="text-white py-10 text-center" style={{ background: '#4a1260' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Store className="w-5 h-5" style={{ color: '#ce93d8' }} />
          <span className="font-bold text-lg">سوق بلس</span>
        </div>
        <p className="text-slate-400 text-sm">© 2026 سوق بلس. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}