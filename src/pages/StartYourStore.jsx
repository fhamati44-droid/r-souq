import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import {
  ArrowLeft, CheckCircle, XCircle, Rocket, Store, Boxes, ShoppingCart,
  Truck, GraduationCap, LineChart, Palette, ClipboardList, Target,
  Clock, Shield, HeartHandshake, Sparkles,
} from 'lucide-react';
import FitnessForm from '@/components/start/FitnessForm';

const PURPLE = '#7A287F';
const MAGENTA = '#C4349C';
const GRAD = 'linear-gradient(135deg, #7A287F, #C4349C)';
const LOGO_URL = 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/e5966bc5d_WhatsAppImage2026-05-05at110058AM1.jpeg';

const SUITABLE = [
  { icon: Rocket, title: 'راغب بالدخول لأول مرة', desc: 'شخص يريد دخول التجارة الإلكترونية لأول مرة.' },
  { icon: Store, title: 'تاجر يريد الانتقال أونلاين', desc: 'تاجر يريد الانتقال إلى البيع أونلاين.' },
  { icon: Boxes, title: 'صاحب منتجات', desc: 'صاحب منتجات يبحث عن قناة بيع جديدة.' },
  { icon: Target, title: 'رائد أعمال', desc: 'رائد أعمال يريد مشروعاً منظماً وقابلاً للنمو.' },
];

const NOT_SUITABLE = [
  'تبحث عن ربح سريع من دون عمل.',
  'لا تستطيع تخصيص وقت للتعلم والمتابعة.',
  'تتوقع نتائج مضمونة.',
  'لا تريد المشاركة في التسويق والمبيعات.',
];

const WHAT_YOU_GET = [
  { icon: Store, title: 'تجهيز المتجر', desc: 'إعداد متجرك الإلكتروني داخل منظومة R SOUQ.' },
  { icon: Palette, title: 'اختيار الهوية والتخصص', desc: 'تحديد هوية المتجر ومجاله بدقة.' },
  { icon: Boxes, title: 'الوصول إلى المنتجات والموردين', desc: 'منتجات وموردون جاهزون للعمل.' },
  { icon: ClipboardList, title: 'إعداد المنتجات والأسعار', desc: 'تجهيز المنتجات وتسعيرها بشكل احترافي.' },
  { icon: ShoppingCart, title: 'إدارة الطلبات', desc: 'أدوات لإدارة الطلبات ومتابعتها.' },
  { icon: Truck, title: 'حلول التشغيل والشحن', desc: 'دعم تشغيلي ولوجستي داخل السعودية.' },
  { icon: GraduationCap, title: 'التدريب عبر أكاديمية R SOUQ', desc: 'برنامج عملي يربط المعرفة بالتطبيق.' },
  { icon: LineChart, title: 'المتابعة وتحليل الأداء', desc: 'متابعة الأرقام وتحسين النتائج.' },
];

const RSOUQ_ROLE = [
  'تجهيز البنية التقنية.',
  'توفير الأدوات والمنتجات.',
  'دعم العمليات والطلبات.',
  'التدريب والمتابعة.',
  'تحسين تجربة المتجر.',
];
const MERCHANT_ROLE = [
  'المشاركة في اختيار المجال.',
  'التعلم وتنفيذ المهام.',
  'التسويق وجذب العملاء.',
  'متابعة المبيعات.',
  'اتخاذ القرارات التجارية.',
];

const STEPS = [
  'اختبار الملاءمة.',
  'جلسة استشارية.',
  'اختيار المسار المناسب.',
  'الاتفاق والتفعيل.',
  'التدريب في أكاديمية R SOUQ.',
  'تجهيز المتجر والمنتجات.',
  'إطلاق المتجر.',
  'المتابعة والتحسين.',
];

const TRUST_POINTS = [
  { icon: Shield, label: 'عقود واتفاقيات واضحة' },
  { icon: GraduationCap, label: 'تدريب عملي' },
  { icon: HeartHandshake, label: 'متابعة مستمرة' },
  { icon: Sparkles, label: 'لا تحتاج إلى خبرة تقنية' },
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function SectionHeading({ eyebrow, title, desc }) {
  return (
    <div className="text-center mb-12 max-w-2xl mx-auto">
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-4"
          style={{ background: 'rgba(122,40,127,0.08)', color: PURPLE, border: '1px solid rgba(122,40,127,0.15)' }}>
          <Sparkles className="w-3.5 h-3.5" /> {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 mb-3">{title}</h2>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function StartYourStore() {
  useEffect(() => {
    document.title = 'افتح متجرك الإلكتروني في السعودية | R SOUQ';
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5F8]" dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', 'Cairo', sans-serif" }}>

      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="R SOUQ" className="h-10 w-10 rounded-xl object-contain" />
            <div className="leading-none">
              <p className="text-lg font-extrabold text-slate-800">R SOUQ</p>
              <p className="text-[10px] text-slate-400">افتح متجرك</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button onClick={() => scrollTo('who')} className="hover:text-slate-900 transition">هل أنت مناسب؟</button>
            <button onClick={() => scrollTo('what')} className="hover:text-slate-900 transition">ماذا تحصل؟</button>
            <button onClick={() => scrollTo('roles')} className="hover:text-slate-900 transition">المسؤوليات</button>
            <button onClick={() => scrollTo('how')} className="hover:text-slate-900 transition">كيف نعمل</button>
          </div>
          <button onClick={() => scrollTo('fitness-form')}
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5"
            style={{ background: GRAD }}>
            ابدأ اختبار الملاءمة
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fbf7fb 0%, #f3eaf5 100%)' }}>
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #C4349C, transparent 70%)' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center relative">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(122,40,127,0.1)', color: PURPLE }}>
            <Sparkles className="w-3.5 h-3.5" /> منظومة متكاملة لإطلاق المتاجر
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 leading-[1.3] mb-5 max-w-3xl mx-auto">
            ابدأ تجارتك الإلكترونية بمنظومة كاملة، <span style={{ color: PURPLE }}>مو بمجرد متجر</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            متجر إلكتروني، منتجات وموردون، تدريب عملي، تشغيل وشحن، ودعم محلي داخل السعودية — في مكان واحد.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-9">
            <button onClick={() => scrollTo('fitness-form')}
              className="h-12 px-7 rounded-xl text-white font-bold text-sm shadow-lg transition hover:-translate-y-0.5 flex items-center gap-2"
              style={{ background: GRAD }}>
              اكتشف إذا المشروع مناسب لك <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scrollTo('how')}
              className="h-12 px-6 rounded-xl font-bold text-sm transition border bg-white hover:bg-slate-50 flex items-center gap-2"
              style={{ borderColor: PURPLE, color: PURPLE }}>
              شاهد كيف تعمل المنظومة
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {TRUST_POINTS.map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-sm text-slate-600 font-semibold">
                <t.icon className="w-5 h-5" style={{ color: PURPLE }} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: هل منظومة R SOUQ مناسبة لك؟ */}
      <section id="who" className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="لمن تناسب المنظومة"
            title="هل منظومة R SOUQ مناسبة لك؟"
            desc="صُممت المنظومة لأنواع محددة من رواد الأعمال — تعرّف إذا كنت منهم"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {SUITABLE.map((s, i) => (
              <div key={i} className="rounded-2xl p-6 border border-slate-100 bg-[#FCFAFC] hover:-translate-y-1 transition-shadow hover:shadow-lg">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(122,40,127,0.1)' }}>
                  <s.icon className="w-6 h-6" style={{ color: PURPLE }} />
                </div>
                <h3 className="font-extrabold text-slate-800 mb-1.5">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto rounded-2xl border p-6 sm:p-8"
            style={{ borderColor: '#f3d9d9', background: '#fdf6f6' }}>
            <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5" style={{ color: '#c0534a' }} />
              قد لا تكون مناسبة لك إذا:
            </h3>
            <ul className="space-y-3">
              {NOT_SUITABLE.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#c0534a' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section: كل ما تحتاجه لإطلاق متجرك */}
      <section id="what" className="py-20 lg:py-28 bg-[#F8F5F8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="ماذا يحصل التاجر"
            title="كل ما تحتاجه لإطلاق متجرك"
            desc="من تجهيز المتجر حتى المتابعة — منظومة متكاملة في مكان واحد"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHAT_YOU_GET.map((w, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 hover:-translate-y-1 transition hover:shadow-lg">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(122,40,127,0.1)' }}>
                  <w.icon className="w-6 h-6" style={{ color: PURPLE }} />
                </div>
                <h3 className="font-extrabold text-slate-800 mb-1.5 text-sm">{w.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: توزيع المسؤوليات */}
      <section id="roles" className="py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="توزيع المسؤوليات"
            title="دور R SOUQ ودور التاجر"
            desc="شراكة واضحة المسؤوليات — نحن نهيّئ المنظومة، وأت تقود المبيعات والقرارات"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-slate-100 p-6 sm:p-7" style={{ background: '#FCFAFC' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GRAD }}>
                  <Store className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-extrabold text-slate-800">دور R SOUQ</h3>
              </div>
              <ul className="space-y-3">
                {RSOUQ_ROLE.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: PURPLE }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-100 p-6 sm:p-7 bg-white">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(122,40,127,0.12)' }}>
                  <Rocket className="w-5 h-5" style={{ color: PURPLE }} />
                </div>
                <h3 className="font-extrabold text-slate-800">دور التاجر</h3>
              </div>
              <ul className="space-y-3">
                {MERCHANT_ROLE.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: PURPLE }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section: مراحل العمل */}
      <section id="how" className="py-20 lg:py-28 bg-[#F8F5F8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="مراحل العمل"
            title="رحلتك من الفكرة إلى الإطلاق"
            desc="ثماني مراحل واضحة تفصلك عن إطلاق متجرك"
          />
          <div className="relative">
            <div className="absolute right-[23px] top-2 bottom-2 w-px" style={{ background: 'rgba(122,40,127,0.2)' }} />
            <div className="space-y-4">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold shrink-0 shadow-md"
                    style={{ background: GRAD }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-slate-100 px-5 py-4">
                    <p className="font-bold text-slate-800 text-sm">{s}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-slate-500 mt-10 max-w-xl mx-auto">
            لا نرسلك مباشرة إلى الدفع — البداية تمر باختبار الملاءمة والجلسة الاستشارية لضمان ملاءمة المشروع لك.
          </p>
        </div>
      </section>

      {/* Section: اختبار الملاءمة (form) */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3">ابدأ اختبار الملاءمة</h2>
            <p className="text-slate-500">أجب عن مجموعة أسئلة قصيرة لتعرّف إذا كانت منظومة R SOUQ مناسبة لك.</p>
          </div>
          <FitnessForm />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, #7A287F, #C4349C)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">جاهز تحوّل فكرتك إلى متجر حقيقي؟</h2>
          <p className="text-white/85 mb-8">ابدأ بخطوة بسيطة، أجب عن مجموعة أسئلة قصيرة وتعرّف إذا كانت منظومة R SOUQ مناسبة لك.</p>
          <button onClick={() => scrollTo('fitness-form')}
            className="inline-flex items-center gap-2 bg-white font-extrabold px-8 py-3.5 rounded-xl text-sm transition shadow-xl hover:-translate-y-0.5"
            style={{ color: PURPLE }}>
            ابدأ اختبار الملاءمة <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#160B19] text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <img src={LOGO_URL} alt="R SOUQ" className="h-9 w-9 rounded-lg object-contain" />
            <span className="font-extrabold text-lg text-white">R SOUQ</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-5 text-sm">
            <Link to="/shop" className="text-slate-400 hover:text-white transition">تسوّق</Link>
            <Link to="/start-your-store" className="text-slate-400 hover:text-white transition">افتح متجرك</Link>
            <Link to="/about" className="text-slate-400 hover:text-white transition">من نحن</Link>
            <Link to="/contact" className="text-slate-400 hover:text-white transition">تواصل معنا</Link>
            <Link to="/terms" className="text-slate-400 hover:text-white transition">الشروط</Link>
            <Link to="/privacy" className="text-slate-400 hover:text-white transition">الخصوصية</Link>
          </div>
          <p className="text-slate-600 text-xs">جميع الحقوق محفوظة لـ R SOUQ / TOYLII LLC</p>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-white/95 backdrop-blur border-t border-slate-100">
        <button onClick={() => scrollTo('fitness-form')}
          className="w-full h-12 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md"
          style={{ background: GRAD }}>
          ابدأ اختبار الملاءمة <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
      <div className="md:hidden h-20" />
    </div>
  );
}