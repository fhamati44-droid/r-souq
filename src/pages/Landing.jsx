import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Store, ShoppingBag, Star, Zap, TrendingUp, CheckCircle, LogIn, LogOut, User, ArrowLeft, Play, Package, Truck, Settings, Globe, DollarSign, Users, MapPin, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import HeroSlider from '@/components/landing/HeroSlider';

const plans = [
  { name: 'أساسي', nameEn: 'Basic', price: 49, period: 'شهرياً', color: 'from-slate-500 to-slate-700', features: ['حتى 50 منتج', 'لوحة تحكم بسيطة', 'دعم عبر البريد', 'صفحة متجر'] },
  { name: 'احترافي', nameEn: 'Pro', price: 99, period: 'شهرياً', color: 'from-violet-500 to-indigo-600', popular: true, features: ['حتى 200 منتج', 'إحصائيات المبيعات', 'دعم أولوية', 'تخصيص المتجر', 'ظهور في نتائج البحث'] },
  { name: 'مميز', nameEn: 'Premium', price: 199, period: 'شهرياً', color: 'from-amber-500 to-orange-600', features: ['منتجات غير محدودة', 'حملات إعلانية', 'إبراز المتجر', 'دعم VIP 24/7', 'أولوية في الصفحة الرئيسية'] },
];

const features = [
  { icon: DollarSign, title: 'دخل إضافي', desc: 'زد أرباحك ونمّ مشاريعك' },
  { icon: ShoppingBag, title: 'تسوق ذكي', desc: 'منتجات مختارة وبأفضل الأسعار' },
  { icon: Truck, title: 'شحن سريع وآمن', desc: 'توصيل في الوقت المحدد لعملائك' },
  { icon: Settings, title: 'إدارة متكاملة', desc: 'نظام سهل لإدارة طلباتك وعملياتك' },
  { icon: Globe, title: 'سهولة تامة', desc: 'كل شيء منظم لتوفير وقتك وجهدك' },
];

const PARTNERS = [
  { name: 'Alibaba', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/ec3c62eb0_download.jpg' },
  { name: 'DHgate', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/683ccf2ef_download1.jpg' },
  { name: 'Taobao', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/455f7deef_download2.jpg' },
  { name: 'Tmall', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/5c2af63ab_download3.jpg' },
  { name: 'Temu', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/53838fc7a_download4.jpg' },
  { name: 'Wish', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/7c9335087_download5.jpg' },
  { name: 'Banggood', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/488fcee5f_download6.png' },
  { name: 'LightInTheBox', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/cdd0e32b5_download7.png' },
  { name: 'Joom', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/0a7acff19_download8.png' },
  { name: 'Gearbest', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/1b06b8f15_download9.png' },
  { name: 'Tomtop', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/a8a833ee7_download10.png' },
  { name: 'Geekbuying', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/f2fc9bc96_download11.png' },
  { name: 'Shein', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/ce6e89e22_download12.png' },
  { name: 'CJ Dropshipping', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/735ff015c_download13.png' },
  { name: 'Doba', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/185884d1a_download14.png' },
  { name: 'Spocket', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/1b8476f5a_download15.png' },
  { name: 'Trendyol', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/1a57716fe_download5.png' },
  { name: 'Hepsiburada', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/688514d54_download4.png' },
  { name: 'n11', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/b751a774d_download3.png' },
  { name: 'Turkishexporter', logo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/546a65601_download2.png' },
];

const stats = [
  { icon: Users, value: '+10,000', label: 'عميل نشط' },
  { icon: Package, value: '+50,000', label: 'طلب تم تنفيذه' },
  { icon: MapPin, value: '+5', label: 'دول نخدمها' },
  { icon: Shield, value: '99%', label: 'رضا العملاء' },
];

export default function Landing() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
      }
      setAuthChecked(true);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/e5966bc5d_WhatsAppImage2026-05-05at110058AM1.jpeg" alt="truck" className="h-9 w-9 object-contain rounded-lg" />
            <span className="text-xl font-extrabold" style={{ color: '#6a1b9a' }}>R souq</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-purple-700 transition">الرئيسية</a>
            <a href="#features" className="hover:text-purple-700 transition">خدماتنا</a>
            <a href="#pricing" className="hover:text-purple-700 transition">الأسعار</a>
            <Link to="/shop" className="hover:text-purple-700 transition">المتاجر</Link>
            <a href="#" className="hover:text-purple-700 transition">من نحن</a>
            <Link to="/contact" className="hover:text-purple-700 transition">تواصل معنا</Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            {authChecked && (
              user ? (
                <div className="flex items-center gap-2">
                  <Link to="/seller/dashboard">
                    <Button size="sm" className="rounded-full gap-1.5 font-bold" style={{ background: '#7b2d8b' }}>
                      <User className="w-3.5 h-3.5" /> {user.full_name?.split(' ')[0] || 'لوحتي'}
                    </Button>
                  </Link>
                  <button onClick={() => base44.auth.logout('/')} className="p-2 rounded-full hover:bg-slate-100 transition text-slate-500" title="خروج">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => base44.auth.redirectToLogin('/seller/dashboard')}
                  className="rounded-full font-bold px-5"
                  style={{ background: '#7b2d8b' }}
                >
                  ابدأ الآن
                </Button>
              )
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 pt-12 pb-0">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 items-end">
          {/* Text */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="pb-12 order-2 md:order-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full mb-5">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              شريكك في النجاح
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-3">
              شغلك أونلاين؟
            </h1>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5" style={{ color: '#f59e0b' }}>
              خلّيه يشتغل لحاله
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              نحن نهتم بالتسوق، الشحن، والإدارة<br />وأنت ركّز على البيع والنمو
            </p>
            <div className="flex flex-wrap gap-3">
              {user ? (
                <Link to="/seller/register">
                  <Button size="lg" className="rounded-full font-bold px-8 gap-2 shadow-lg" style={{ background: '#7b2d8b' }}>
                    ابدأ الآن <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin('/seller/register')}
                  className="inline-flex items-center gap-2 rounded-full font-bold px-8 py-3 text-white shadow-lg transition hover:opacity-90"
                  style={{ background: '#7b2d8b' }}
                >
                  ابدأ الآن <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <Link to="/shop">
                <Button size="lg" variant="outline" className="rounded-full font-bold px-6 gap-2 border-slate-300">
                  <Play className="w-4 h-4" /> شاهد كيف نعمل
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="order-1 md:order-2">
            <HeroSlider />
          </motion.div>
        </div>
      </section>

      {/* ── Partners Marquee ── */}
      <section className="py-10 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 mb-6 text-center">
          <h2 className="text-xl font-extrabold text-slate-800">شركاؤنا</h2>
          <p className="text-sm text-slate-500 mt-1">نتعامل مع أكبر 20 منصة عالمية لتوريد البضائع</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee gap-6" style={{ width: 'max-content' }}>
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div key={i} className="flex items-center justify-center px-5 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm shrink-0" style={{ minWidth: '140px', height: '80px' }}>
                <img src={p.logo} alt={p.name} style={{ maxHeight: '50px', maxWidth: '110px', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Bar ── */}
      <section id="features" className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: '#f3e5f5' }}>
                  <f.icon className="w-6 h-6" style={{ color: '#7b2d8b' }} />
                </div>
                <p className="font-bold text-sm text-slate-800">{f.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="py-10" style={{ background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#ede7f6' }}>
                  <s.icon className="w-5 h-5" style={{ color: '#7b2d8b' }} />
                </div>
                <div>
                  <p className="text-xl font-extrabold" style={{ color: '#6a1b9a' }}>{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-purple-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-100 rounded-full opacity-40 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold mb-3">كيف يعمل؟</h2>
            <p className="text-slate-500">ثلاث خطوات فقط لتبدأ رحلتك</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Store, step: '01', title: 'سجّل وادفع الاشتراك', desc: 'اختر الباقة المناسبة وادفع رسوم إنشاء المتجر الشهرية' },
              { icon: Zap, step: '02', title: 'أضف منتجاتك', desc: 'أضف منتجاتك من المخزن وحدد أسعارك بحرية كاملة' },
              { icon: TrendingUp, step: '03', title: 'ابدأ البيع', desc: 'تلقّ الطلبات وروّج متجرك بحملات إعلانية مدفوعة' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 shadow-sm border border-purple-100 text-center relative overflow-hidden">
                <div className="absolute top-3 left-4 text-6xl font-extrabold text-purple-50 select-none">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 relative" style={{ background: '#f3e5f5' }}>
                  <item.icon className="w-7 h-7" style={{ color: '#7b2d8b' }} />
                </div>
                <h3 className="text-lg font-bold mt-2 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-purple-50 rounded-full opacity-60 blur-3xl -translate-x-1/2" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold mb-3">باقات الاشتراك</h2>
            <p className="text-slate-500">اختر الباقة المناسبة لحجم تجارتك</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl border-2 p-8 bg-white ${plan.popular ? 'shadow-2xl' : 'border-slate-100 shadow-sm'}`}
                style={plan.popular ? { borderColor: '#7b2d8b', boxShadow: '0 10px 40px rgba(123,45,139,0.15)' } : {}}>
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-white px-4 py-1 rounded-full text-xs font-bold" style={{ background: '#7b2d8b' }}>الأكثر شعبية</span>
                )}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-extrabold">{plan.name}</h3>
                <div className="mt-3 mb-6">
                  <span className="text-4xl font-extrabold" style={{ color: '#7b2d8b' }}>{plan.price}</span>
                  <span className="text-slate-400"> ر.س / {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {f}
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

      {/* ── Campaign CTA ── */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #7b2d8b 50%, #9c27b0 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-white/10 backdrop-blur">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-3">روّج متجرك بحملة إعلانية</h2>
          <p className="text-white/70 mb-8">افتح متجرك، أضف منتجاتك، وابدأ البيع لملايين المتسوقين — كل هذا في مكان واحد!</p>
          <Link to="/seller/dashboard">
            <Button className="rounded-full font-bold px-10 py-6 text-base gap-2 bg-white hover:bg-white/90" style={{ color: '#7b2d8b' }}>
              <Zap className="w-5 h-5" /> ابدأ حملتك الآن
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 text-center" style={{ background: '#4a1260' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-9 h-9 flex items-center justify-center">
            <svg viewBox="0 0 64 48" fill="none" className="w-9 h-9">
              <rect x="2" y="14" width="36" height="24" rx="3" fill="white"/>
              <path d="M38 20 L38 38 L58 38 L58 26 L50 20 Z" fill="white"/>
              <path d="M40 21.5 L40 28 L54 28 L54 26 L48 21.5 Z" fill="#9c27b0" opacity="0.4"/>
              <circle cx="14" cy="38" r="5" fill="white" stroke="#9c27b0" strokeWidth="2"/>
              <circle cx="14" cy="38" r="2" fill="#9c27b0"/>
              <circle cx="48" cy="38" r="5" fill="white" stroke="#9c27b0" strokeWidth="2"/>
              <circle cx="48" cy="38" r="2" fill="#9c27b0"/>
            </svg>
          </div>
          <span className="font-extrabold text-lg text-white">R souq</span>
        </div>
        <div className="flex items-center justify-center gap-6 mb-4">
          <Link to="/shop" className="text-slate-400 hover:text-white text-sm transition">تسوق الآن</Link>
          <Link to="/seller/register" className="text-slate-400 hover:text-white text-sm transition">ابدأ كبائع</Link>
          <Link to="/seller/dashboard" className="text-slate-400 hover:text-white text-sm transition">لوحة التحكم</Link>
        </div>
        <p className="text-slate-500 text-sm">© 2026 R souq. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}