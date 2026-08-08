import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Shield, Package, HeartHandshake, BarChart3, Play, Phone,
  ArrowLeft, ChevronLeft, User, LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import LeadForm from '@/components/landing/LeadForm';
import FAQ from '@/components/landing/FAQ';
import Testimonials from '@/components/landing/Testimonials';

const LOGO_URL = 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/e5966bc5d_WhatsAppImage2026-05-05at110058AM1.jpeg';

const FEATURES = [
  { icon: Shield, title: 'شفافية وأمان كامل', desc: 'جميع الاتفاقيات والمدفوعات تتم حصراً عبر الحسابات الرسمية للشركة، مما يضمن حقوقك القانونية والمالية.' },
  { icon: Package, title: 'إدارة تشغيلية شاملة', desc: 'نتكفل بالتخزين، التجهيز، الشحن، وكافة الخدمات اللوجستية — لتتفرغ أنت للإدارة الاستراتيجية لأعمالك.' },
  { icon: HeartHandshake, title: 'تواجد ومتابعة محلية', desc: 'فريق متواجد داخل المملكة لمتابعة أعمالك خطوة بخطوة، مع دعم مباشر وسريع عند الحاجة.' },
  { icon: BarChart3, title: 'متابعة الأداء والنمو', desc: 'لوحة تحكم شفافة تمكّنك من متابعة المبيعات والأرباح والنتائج بوضوح تام في أي وقت.' },
];

const STEPS = [
  { num: '1', title: 'تسجيل البيانات', desc: 'املأ نموذج التسجيل ببياناتك الأساسية لتصل مباشرةً لفريق تطوير الأعمال.' },
  { num: '2', title: 'التواصل والتنسيق', desc: 'يتواصل معك فريقنا خلال 24 ساعة لترتيب جلسة استشارية رسمية ومناقشة التفاصيل.' },
  { num: '3', title: 'تجهيز المتجر والمنتجات', desc: 'نبدأ بإعداد متجرك الإلكتروني وتوفير المنتجات وتجهيز كافة العمليات التشغيلية.' },
  { num: '4', title: 'الانطلاق ومتابعة الأرباح', desc: 'تنطلق أعمالك رسمياً مع متابعة مستمرة وتقارير دورية لضمان تحقيق أفضل النتائج.' },
];

export default function Landing() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        try {
          const me = await base44.auth.me();
          setUser(me);
        } catch (e) { /* ignore */ }
      }
      setAuthChecked(true);
    });
  }, []);

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl" style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="R SOUQ" className="h-10 w-10 object-contain rounded-xl" />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight" style={{ color: '#6a1b9a' }}>R SOUQ</span>
              <span className="text-[10px] text-slate-400 font-medium">rsouq.com</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-violet-700 transition">المميزات</a>
            <a href="#how" className="hover:text-violet-700 transition">كيف نعمل</a>
            <a href="#proof" className="hover:text-violet-700 transition">المصداقية</a>
            <a href="#faq" className="hover:text-violet-700 transition">الأسئلة الشائعة</a>
          </div>

          <div className="flex items-center gap-2">
            {authChecked && user && (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/seller/dashboard">
                  <Button size="sm" variant="ghost" className="rounded-full gap-1.5 font-bold text-slate-600">
                    <User className="w-3.5 h-3.5" /> {user.full_name?.split(' ')[0] || 'لوحتي'}
                  </Button>
                </Link>
                <button onClick={() => base44.auth.logout('/')} className="p-2 rounded-full hover:bg-slate-100 transition text-slate-500">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              onClick={scrollToForm}
              className="rounded-full font-bold px-5 py-2.5 text-sm text-white shadow-md transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6a1b9a, #7b2d8b)' }}
            >
              احجز استشارتك
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%)' }}>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full opacity-20 blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-300 rounded-full opacity-20 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20 relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Right side (content in RTL) */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-violet-700 px-3 py-1.5 rounded-full mb-5 shadow-sm border border-purple-100">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#7b2d8b' }} />
                منظومة تجارة إلكترونية متكاملة في السعودية
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                ابدأ البيع اليوم!
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-7 max-w-xl">
                منظومة تشغيلية متكاملة تدير متجرك من التوريد وحتى الشحن والتسويق — بتواجد ومتابعة محلية داخل المملكة.
              </p>

              {/* Video player */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-purple-100 group cursor-pointer max-w-xl" onClick={() => setVideoOpen(true)}>
                <img
                  src="https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/5b5ae0645_ChatGPTImageAug7202602_16_27PM.png"
                  alt="مكاتب R SOUQ - فريقنا يعمل على نجاحك"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-violet-700 fill-violet-700 mr-[-2px]" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 left-4 text-white">
                  <p className="font-bold text-sm">رسالة من فريق R SOUQ</p>
                  <p className="text-white/80 text-xs">شاهد كيف نبني شراكة استثمارية حقيقية</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-7 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" style={{ color: '#7b2d8b' }} />
                  <span className="font-semibold text-slate-700">عقود رسمية</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5" style={{ color: '#7b2d8b' }} />
                  <span className="font-semibold text-slate-700">دعم محلي</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: '#7b2d8b' }} />
                  <span className="font-semibold text-slate-700">شفافية كاملة</span>
                </div>
              </div>
            </motion.div>

            {/* Left side (Lead form) */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
              <LeadForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Value Proposition ── */}
      <section id="features" className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">لماذا تختار R SOUQ؟</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">منظومة موثوقة تجمع بين الخبرة التشغيلية والتواجد المحلي لضمان نجاح استثمارك</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-purple-200 transition-all text-center"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #f3e5f5, #ede7f6)' }}>
                  <f.icon className="w-7 h-7" style={{ color: '#7b2d8b' }} />
                </div>
                <h3 className="font-extrabold text-slate-800 mb-2 text-base">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">كيف نعمل؟</h2>
            <p className="text-slate-500">أربع خطوات بسيطة تفصلك عن انطلاق متجرك الإلكتروني</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-12 right-0 left-0 h-0.5 bg-purple-200 -z-0" />
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white rounded-2xl border border-slate-100 p-6 text-center z-10 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-extrabold text-lg shadow-lg" style={{ background: 'linear-gradient(135deg, #6a1b9a, #7b2d8b)' }}>
                  {s.num}
                </div>
                <h3 className="font-extrabold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Local Presence & Social Proof ── */}
      <section id="proof" className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">المصداقية والتواجد المحلي</h2>
            <p className="text-slate-500">فريق متواجد داخل المملكة يبني شراكة حقيقية معك</p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">الأسئلة الشائعة</h2>
            <p className="text-slate-500">كل ما تحتاج معرفته قبل بدء شراكتك معنا</p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-14 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #7b2d8b 50%, #9c27b0 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">جاهز لبدء شراكتك الاستثمارية؟</h2>
          <p className="text-white/80 mb-7">سجّل بياناتك الآن واحجز جلستك الاستشارية المجانية مع فريق R SOUQ</p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-white hover:bg-white/90 font-extrabold px-8 py-3.5 rounded-full text-sm transition shadow-xl"
            style={{ color: '#7b2d8b' }}
          >
            سجّل الآن <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 text-center" style={{ background: '#3b0d52' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <img src={LOGO_URL} alt="R SOUQ" className="h-9 w-9 object-contain rounded-lg" />
            <span className="font-extrabold text-lg text-white">R SOUQ</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-5 text-sm">
            <Link to="/privacy" className="text-slate-400 hover:text-white transition">سياسة الخصوصية</Link>
            <Link to="/terms" className="text-slate-400 hover:text-white transition">الشروط والأحكام</Link>
            <Link to="/contact" className="text-slate-400 hover:text-white transition">تواصل معنا</Link>
            <Link to="/shop" className="text-slate-400 hover:text-white transition">المتجر</Link>
          </div>
          <p className="text-slate-500 text-xs">جميع الحقوق محفوظة لـ R SOUQ / TOYLII LLC</p>
        </div>
      </footer>

      {/* ── Sticky Mobile CTA ── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] p-3">
        <button
          onClick={scrollToForm}
          className="w-full h-12 rounded-xl text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #6a1b9a, #7b2d8b)' }}
        >
          سجّل الآن واطلب استشارتك <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      {/* Spacer so content not hidden behind mobile bar */}
      <div className="md:hidden h-20" />

      {/* ── Video Modal ── */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute -top-10 left-0 text-white hover:opacity-80 transition flex items-center gap-1 text-sm font-semibold"
            >
              إغلاق <span className="text-xl">×</span>
            </button>
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/Q8wtEIMebaI?autoplay=1"
                title="فيديو تعريفي R SOUQ"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}