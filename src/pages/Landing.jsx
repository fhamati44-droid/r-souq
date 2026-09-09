import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Shield, Package, HeartHandshake, BarChart3, Play, GraduationCap,
  ArrowLeft, ChevronLeft, User, LogOut, Sparkles } from
'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import LeadForm from '@/components/landing/LeadForm';
import FAQ from '@/components/landing/FAQ';
import Testimonials from '@/components/landing/Testimonials';
import FacilityGallery from '@/components/landing/FacilityGallery';
import Ecosystem from '@/components/landing/Ecosystem';
import PhoneMockup from '@/components/landing/PhoneMockup';

const LOGO_URL = 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/e5966bc5d_WhatsAppImage2026-05-05at110058AM1.jpeg';
const CONSULTANT_IMG = 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/ab374614f_775279432_1571479978007436_1399348346080758088_n.jpg';

const GRAD_CTA = 'linear-gradient(135deg, #C4349C, #872A8E)';
const C = {
  bg: '#160B19',
  bg2: '#241028',
  bg3: '#1C0C20',
  purple: '#7A287F',
  magenta: '#C4349C',
  accent: '#E34CB7',
  pink: '#F07AC9',
  text2: '#D8CDD9',
  muted: '#9D8E9F',
  light: '#F8F5F8'
};

const FEATURES = [
{ icon: Shield, title: 'شفافية وأمان كامل', desc: 'جميع الاتفاقيات والمدفوعات تتم حصراً عبر الحسابات الرسمية للشركة، مما يضمن حقوقك القانونية والمالية.' },
{ icon: Package, title: 'إدارة تشغيلية شاملة', desc: 'نتكفل بالتخزين، التجهيز، الشحن، وكافة الخدمات اللوجستية — لتتفرغ أنت للإدارة الاستراتيجية لأعمالك.' },
{ icon: HeartHandshake, title: 'تواجد ومتابعة محلية', desc: 'فريق متواجد داخل المملكة لمتابعة أعمالك خطوة بخطوة، مع دعم مباشر وسريع عند الحاجة.' },
{ icon: BarChart3, title: 'متابعة الأداء والنمو', desc: 'لوحة تحكم شفافة تمكّنك من متابعة المبيعات والأرباح والنتائج بوضوح تام في أي وقت.' }];


const STEPS = [
{ num: '01', title: 'تسجيل البيانات', desc: 'املأ نموذج التسجيل ببياناتك الأساسية لتصل مباشرةً لفريق تطوير الأعمال.' },
{ num: '02', title: 'التواصل والتنسيق', desc: 'يتواصل معك فريقنا خلال 24 ساعة لترتيب جلسة استشارية رسمية ومناقشة التفاصيل.' },
{ num: '03', title: 'تجهيز المتجر والمنتجات', desc: 'نبدأ بإعداد متجرك الإلكتروني وتوفير المنتجات وتجهيز كافة العمليات التشغيلية.' },
{ num: '04', title: 'الانطلاق ومتابعة الأرباح', desc: 'تنطلق أعمالك رسمياً مع متابعة مستمرة وتقارير دورية لضمان تحقيق أفضل النتائج.' }];


export default function Landing() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        try {
          const me = await base44.auth.me();
          setUser(me);
        } catch (e) {/* ignore */}
      }
      setAuthChecked(true);
    });
  }, []);

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const SectionHeading = ({ eyebrow, title, desc, light = false }) =>
  <div className="text-center mb-12 max-w-2xl mx-auto">
      {eyebrow &&
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-4"
      style={{
        background: light ? 'rgba(122,40,127,0.08)' : 'rgba(196,52,156,0.12)',
        color: C.magenta,
        border: `1px solid ${light ? 'rgba(122,40,127,0.15)' : 'rgba(196,52,156,0.25)'}`
      }}>
      
          <Sparkles className="w-3.5 h-3.5" /> {eyebrow}
        </span>
    }
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3" style={{ color: light ? '#1a0d1e' : '#fff' }}>
        {title}
      </h2>
      <p style={{ color: light ? '#6b5a6e' : C.text2 }} className="leading-relaxed">{desc}</p>
    </div>;


  return (
    <div className="min-h-screen" dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', 'Cairo', sans-serif", background: C.bg, color: '#fff' }}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ background: 'rgba(22,11,25,0.85)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="R SOUQ" className="h-10 w-10 object-contain rounded-xl" />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight" style={{ color: '#fff' }}>R SOUQ</span>
              <span className="text-[10px] font-medium" style={{ color: C.muted }}>rsouq.com</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm font-semibold" style={{ color: C.text2 }}>
            <a href="#features" className="hover:text-white transition">المميزات</a>
            <a href="#how" className="hover:text-white transition">كيف نعمل</a>
            <a href="#ecosystem" className="hover:text-white transition">المنظومة</a>
            <a href="#academy" className="hover:text-white transition">الأكاديمية</a>
            <a href="#proof" className="hover:text-white transition">المصداقية</a>
            <a href="#faq" className="hover:text-white transition">الأسئلة الشائعة</a>
          </div>

          <div className="flex items-center gap-2">
            {authChecked && user &&
            <div className="hidden sm:flex items-center gap-2">
                <Link to="/seller/dashboard">
                  <Button size="sm" variant="ghost" className="rounded-full gap-1.5 font-bold" style={{ color: C.text2 }}>
                    <User className="w-3.5 h-3.5" /> {user.full_name?.split(' ')[0] || 'لوحتي'}
                  </Button>
                </Link>
                <button onClick={() => base44.auth.logout('/')} className="p-2 rounded-full hover:bg-white/5 transition" style={{ color: C.muted }}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            }
            <button
              onClick={scrollToForm}
              className="rounded-xl font-bold px-5 py-2.5 text-sm text-white shadow-md transition hover:-translate-y-0.5"
              style={{ background: GRAD_CTA }}>
              
              احجز استشارتك
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: C.bg }}>
        {/* ambient glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #C4349C, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #7A287F, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* text */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(196,52,156,0.12)', color: C.pink, border: '1px solid rgba(196,52,156,0.25)' }}>
                
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.magenta }} />
                منظومة تجارة إلكترونية متكاملة في السعودية
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.25] mb-5" style={{ color: '#fff' }}>
                تبغى تدخل التجارة الإلكترونية؟
                <br />
                <span style={{ color: C.magenta }}>لا تبدأ</span> <span style={{ color: '#fff' }}>من الصفر.</span>
              </h1>

              <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl" style={{ color: C.text2 }}>
                منظومة تشغيلية متكاملة تدير متجرك من التوريد وحتى الشحن والتسويق — بتواجد ومتابعة محلية داخل المملكة.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-9">
                <button
                  onClick={scrollToForm}
                  className="px-7 py-3.5 rounded-xl text-white font-bold text-sm shadow-lg transition hover:-translate-y-0.5 flex items-center gap-2"
                  style={{ background: GRAD_CTA, minHeight: '52px' }}>
                  
                  ابدأ الآن <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveVideo('https://www.youtube.com/embed/Q8wtEIMebaI?autoplay=1')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm transition hover:bg-white/5 flex items-center gap-2"
                  style={{ border: '1px solid rgba(196,52,156,0.4)', color: '#fff', minHeight: '52px' }}>
                  
                  <Play className="w-4 h-4" style={{ color: C.magenta }} /> شاهد كيف نعمل
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: C.text2 }}>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" style={{ color: C.magenta }} />
                  <span className="font-semibold">عقود رسمية</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5" style={{ color: C.magenta }} />
                  <span className="font-semibold">دعم محلي</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: C.magenta }} />
                  <span className="font-semibold">شفافية كاملة</span>
                </div>
              </div>
            </motion.div>

            {/* phone mockup */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="flex justify-center">
              <PhoneMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Lead Form band ── */}
      <section className="relative overflow-hidden pb-16 lg:pb-20" style={{ background: C.bg }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #7A287F, transparent 70%)' }} />
        <div className="max-w-lg mx-auto px-4 sm:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <LeadForm />
          </motion.div>
        </div>
      </section>

      {/* ── Value Proposition (light) ── */}
      <section id="features" className="py-20 lg:py-28" style={{ background: C.light }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl overflow-hidden shadow-xl mb-14" style={{ border: '1px solid #e9ddec' }}>
            <img
              src="https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/4daf86c3b_ChatGPTImageAug7202602_19_33PM.png"
              alt="مكاتب R SOUQ - فريق العمل"
              className="w-full h-52 sm:h-64 lg:h-72 object-cover" />
            
          </div>
          <SectionHeading
            light
            eyebrow="لماذا R SOUQ"
            title="لماذا تختار R SOUQ؟"
            desc="منظومة موثوقة تجمع بين الخبرة التشغيلية والتواجد المحلي لضمان نجاح استثمارك" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 hover:-translate-y-1 transition-all text-center shadow-sm hover:shadow-lg"
              style={{ border: '1px solid #efe4f1' }}>
              
                <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, rgba(122,40,127,0.12), rgba(196,52,156,0.12))' }}>
                
                  <f.icon className="w-7 h-7" style={{ color: C.purple }} />
                </div>
                <h3 className="font-extrabold text-slate-800 mb-2 text-base">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── How It Works (dark) ── */}
      <section id="how" className="py-20 lg:py-28 relative" style={{ background: C.bg3 }}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #C4349C, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <SectionHeading
            eyebrow="كيف نعمل"
            title="كيف نعمل؟"
            desc="أربع خطوات بسيطة تفصلك عن انطلاق متجرك الإلكتروني" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-12 right-0 left-0 h-px -z-0" style={{ background: 'linear-gradient(to left, transparent, rgba(196,52,156,0.4), transparent)' }} />
            {STEPS.map((s, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl p-6 text-center z-10 hover:-translate-y-1 transition-all rsouq-card-glass">
              
                <div
                className="absolute -top-5 right-1/2 translate-x-1/2 text-3xl font-extrabold"
                style={{ color: 'rgba(196,52,156,0.25)' }}>
                
                  {s.num}
                </div>
                <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 mt-3 text-white font-extrabold shadow-lg"
                style={{ background: GRAD_CTA }}>
                
                  {i + 1}
                </div>
                <h3 className="font-extrabold text-white mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>{s.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── Ecosystem (dark) ── */}
      <section id="ecosystem" className="py-20 lg:py-28 relative" style={{ background: C.bg }}>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #7A287F, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <SectionHeading
            eyebrow="منظومة R SOUQ"
            title="أكثر من مجرد موقع — منظومة متكاملة"
            desc="R SOUQ ليست أداة لإنشاء المتاجر فقط، بل منظومة كاملة تدور حول نجاح متجرك" />
          
          <Ecosystem />
        </div>
      </section>

      {/* ── Academy (dark) ── */}
      <section id="academy" className="py-20 lg:py-28 relative" style={{ background: C.bg3 }}>
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #C4349C, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-5" style={{ background: 'rgba(196,52,156,0.12)', color: C.pink, border: '1px solid rgba(196,52,156,0.25)' }}>
                <GraduationCap className="w-3.5 h-3.5" /> أكاديمية R SOUQ
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2" style={{ color: '#fff' }}>
                أكاديمية روّاد الأعمال
              </h2>
              <p className="text-lg font-bold mb-4" style={{ color: C.magenta }}>من الفكرة إلى أول طلب</p>
              <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: C.text2 }}>
                برنامج تعليمي عملي يأخذك من الفكرة وحتى أول طلب في متجرك — بقيادة مستشار متخصص في التجارة الإلكترونية داخل السوق السعودي.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/academy" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-sm shadow-lg transition hover:-translate-y-0.5" style={{ background: GRAD_CTA, minHeight: '52px' }}>
                  الأكاديمية <ArrowLeft className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setActiveVideo('https://www.youtube.com/embed/2d5MCLMJy48?autoplay=1')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition hover:bg-white/5"
                  style={{ border: '1px solid rgba(196,52,156,0.4)', color: '#fff', minHeight: '52px' }}>
                  
                  <Play className="w-4 h-4" style={{ color: C.magenta }} /> شاهد كلام المستشار
                </button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex justify-center">
              <div className="rsouq-card-glass rounded-3xl p-5 w-full max-w-xs" style={{ boxShadow: '0 30px 80px rgba(122,40,127,0.35)' }}>
                <div className="rounded-2xl overflow-hidden mb-4 bg-white">
                  <img src={CONSULTANT_IMG} alt="المستشار محمد خليل العطية" className="w-full object-contain" loading="lazy" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold mb-1" style={{ color: C.magenta }}>المستشار التدريبي</p>
                  <h3 className="text-lg font-extrabold text-white mb-1">محمد خليل العطية</h3>
                  
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Social Proof (light) ── */}
      <section id="proof" className="py-20 lg:py-28" style={{ background: C.light }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading
            light
            eyebrow="المصداقية"
            title="المصداقية والتواجد المحلي"
            desc="فريق متواجد داخل المملكة يبني شراكة حقيقية معك" />
          
          <Testimonials />

          <div className="mt-16">
            <h3 className="text-center text-lg font-extrabold text-slate-800 mb-2">منشآتنا الحقيقية على أرض الواقع</h3>
            <p className="text-center text-slate-500 text-sm mb-7">صور من مكاتبنا ومستودعاتنا داخل المملكة</p>
            <FacilityGallery />
          </div>
        </div>
      </section>

      {/* ── FAQ (dark) ── */}
      <section id="faq" className="py-20 lg:py-28 relative" style={{ background: C.bg3 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #C4349C, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <SectionHeading
            eyebrow="الأسئلة الشائعة"
            title="كل ما تحتاج معرفته"
            desc="إجابات واضحة قبل بدء شراكتك معنا" />
          
          <FAQ />
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 lg:py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7A287F 0%, #C4349C 60%, #872A8E 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">جاهز لبدء شراكتك الاستثمارية؟</h2>
          <p className="text-white/85 mb-8">سجّل بياناتك الآن واحجز جلستك الاستشارية المجانية مع فريق R SOUQ</p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-white font-extrabold px-8 py-3.5 rounded-xl text-sm transition shadow-xl hover:-translate-y-0.5"
            style={{ color: C.purple }}>
            
            سجّل الآن <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 text-center" style={{ background: '#0E0612' }}>
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
          <p className="text-slate-600 text-xs">جميع الحقوق محفوظة لـ R SOUQ / TOYLII LLC</p>
        </div>
      </footer>

      {/* ── Sticky Mobile CTA ── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 p-3" style={{ background: 'rgba(22,11,25,0.95)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={scrollToForm}
          className="w-full h-12 rounded-xl text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2"
          style={{ background: GRAD_CTA }}>
          
          سجّل الآن واطلب استشارتك <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <div className="md:hidden h-20" />

      {/* ── Video Modal ── */}
      {activeVideo &&
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setActiveVideo(null)}>
        
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button
            onClick={() => setActiveVideo(null)}
            className="absolute -top-10 left-0 text-white hover:opacity-80 transition flex items-center gap-1 text-sm font-semibold">
            
              إغلاق <span className="text-xl">×</span>
            </button>
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden">
              <iframe
              src={activeVideo}
              title="فيديو R SOUQ"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
            
            </div>
          </div>
        </div>
      }
    </div>);

}