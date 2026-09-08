import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, BookOpen, CheckCircle, Lock, Sparkles } from 'lucide-react';
import AcademyNav from '@/components/academy/AcademyNav';
import { base44 } from '@/api/base44Client';

const PURPLE = '#7A287F';
const GRAD = 'linear-gradient(135deg, #7A287F, #C4349C)';
const LOGO_URL = 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/e5966bc5d_WhatsAppImage2026-05-05at110058AM1.jpeg';

const TRACK1 = {
  title: 'ابدأ تجارتك',
  desc: 'مخصص للمبتدئين الذين يريدون فهم التجارة الإلكترونية ومعرفة إذا كان المجال مناسباً لهم.',
  items: ['مقدمة في التجارة الإلكترونية', 'فهم نموذج العمل', 'اختيار المجال', 'أساسيات المنتجات والأسعار', 'اختبار جاهزية المتدرب'],
  cta: 'ابدأ مجاناً',
  free: true,
};
const TRACK2 = {
  title: 'برنامج تاجر R SOUQ',
  desc: 'مخصص للتجار الذين انضموا إلى منظومة R SOUQ.',
  items: [
    'أساسيات التجارة الإلكترونية في السعودية', 'اختيار السوق والعميل المستهدف', 'اختيار المنتجات والتسعير',
    'بناء هوية المتجر', 'صناعة المحتوى', 'الإعلانات وجذب العملاء', 'إدارة العملاء وخدمة ما بعد البيع',
    'قراءة الأرقام والأرباح', 'الأنظمة والسياسات', 'خطة إطلاق المتجر خلال 30 يوماً',
  ],
  cta: 'اكتشف برنامج التاجر',
  free: false,
};

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Academy() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'أكاديمية التجارة الإلكترونية في السعودية | R SOUQ';
    base44.analytics.track({ eventName: 'academy_viewed' });
    base44.entities.AcademyCourse.filter({ status: 'published' }, '-created_date', 20)
      .then((c) => setCourses(c)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5F8]" dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic','Tajawal','Cairo',sans-serif" }}>
      <AcademyNav />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#fbf7fb,#f3eaf5)' }}>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle,#C4349C,transparent 70%)' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center relative">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(122,40,127,0.1)', color: PURPLE }}>
            <GraduationCap className="w-3.5 h-3.5" /> أكاديمية R SOUQ
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 leading-[1.3] mb-4">
            أكاديمية R SOUQ للتجارة الإلكترونية
          </h1>
          <p className="text-lg font-bold mb-3" style={{ color: PURPLE }}>من المعرفة إلى متجر حقيقي يبيع</p>
          <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            أكاديمية عملية تساعد رواد الأعمال والتجار على فهم التجارة الإلكترونية، اختيار المنتجات، بناء المتجر، إطلاق الحملات وإدارة المبيعات داخل السوق السعودي.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/academy/dashboard" className="h-12 px-7 rounded-xl text-white font-bold text-sm shadow-lg transition hover:-translate-y-0.5 flex items-center gap-2" style={{ background: GRAD }}>
              ابدأ رحلتك التعليمية <ArrowLeft className="w-4 h-4" />
            </Link>
            <button onClick={() => scrollTo('program')} className="h-12 px-6 rounded-xl font-bold text-sm transition border bg-white hover:bg-slate-50 flex items-center gap-2" style={{ borderColor: PURPLE, color: PURPLE }}>
              تعرّف على البرنامج
            </button>
          </div>
        </div>
      </section>

      {/* Program intro */}
      <section id="program" className="py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-4" style={{ background: 'rgba(122,40,127,0.08)', color: PURPLE }}>
            <Sparkles className="w-3.5 h-3.5" /> البرنامج
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-4">تعرّف على البرنامج</h2>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
            برنامج عملي مقسّم إلى مسارين: مسار تعريفي مجاني للمبتدئين، وبرنامج متكامل للتجار المنضمين إلى المنظومة.
          </p>
        </div>
      </section>

      {/* Tracks */}
      <section className="pb-20 lg:pb-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-6">
          {[TRACK1, TRACK2].map((t, i) => (
            <div key={i} className="rounded-3xl border border-slate-100 p-6 sm:p-8 bg-[#FCFAFC] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-extrabold text-slate-800">{t.title}</h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={t.free ? { background: 'rgba(34,139,87,0.1)', color: '#1f7a4d' } : { background: 'rgba(122,40,127,0.1)', color: PURPLE }}>
                  {t.free ? 'مجاني' : 'للتجار'}
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">{t.desc}</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {t.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: PURPLE }} /> {it}
                  </li>
                ))}
              </ul>
              {t.free ? (
                <Link to="/academy/dashboard" className="h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white shadow-md transition hover:-translate-y-0.5" style={{ background: GRAD }}>
                  {t.cta} <ArrowLeft className="w-4 h-4" />
                </Link>
              ) : (
                <Link to="/academy/dashboard" className="h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition border-2" style={{ borderColor: PURPLE, color: PURPLE }}>
                  <Lock className="w-4 h-4" /> {t.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Published courses */}
      <section className="py-16 bg-[#F8F5F8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2 text-center">الدورات المتاحة</h2>
          <p className="text-slate-500 text-center mb-8">دورات عملية يتم إطلاقها تدريجياً</p>
          {loading ? (
            <div className="flex justify-center"><div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 bg-white">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 text-sm">لا توجد دورات منشورة حالياً. يتم إطلاق الدورات تدريجياً — تابعنا.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((c) => (
                <Link key={c.id} to="/academy/dashboard" onClick={() => base44.analytics.track({ eventName: 'academy_course_viewed', properties: { course_id: c.id } })} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:-translate-y-1 transition hover:shadow-lg">
                  {c.image && <img src={c.image} alt={c.title} loading="lazy" className="w-full h-40 object-cover" />}
                  <div className="p-5">
                    <h3 className="font-extrabold text-slate-800 mb-1">{c.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{c.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partner / instructor */}
      <section id="partner" className="py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-slate-100 p-8 sm:p-10 grid md:grid-cols-2 gap-8 items-center" style={{ background: '#FCFAFC' }}>
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-4" style={{ background: 'rgba(122,40,127,0.08)', color: PURPLE }}>
                الشريك التدريبي والاستشاري
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-4">خبرة محلية تدعم رحلة التاجر</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                بالتعاون مع مستشار سعودي متخصص، تقدم أكاديمية R SOUQ برنامجاً عملياً يربط بين المعرفة، التطبيق، وإطلاق متجر حقيقي داخل المنظومة.
              </p>
              <Link to="/academy/instructor" className="inline-flex items-center gap-2 h-12 px-6 rounded-xl font-bold text-sm text-white shadow-md transition hover:-translate-y-0.5" style={{ background: GRAD }}>
                تعرّف على المستشار <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center text-center px-4">
                <span className="text-sm text-slate-400">شعار الشريك التدريبي<br />(يُرفع قريباً)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16" style={{ background: GRAD }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">جاهز تبدأ تتعلم؟</h2>
          <p className="text-white/85 mb-8">ابدأ رحلتك التعليمية في أكاديمية R SOUQ اليوم.</p>
          <Link to="/academy/dashboard" className="inline-flex items-center gap-2 bg-white font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-xl hover:-translate-y-0.5 transition" style={{ color: PURPLE }}>
            ابدأ رحلتك التعليمية <ArrowLeft className="w-4 h-4" />
          </Link>
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
            <Link to="/academy" className="text-slate-400 hover:text-white transition">الأكاديمية</Link>
            <Link to="/about" className="text-slate-400 hover:text-white transition">من نحن</Link>
            <Link to="/contact" className="text-slate-400 hover:text-white transition">تواصل معنا</Link>
          </div>
          <p className="text-slate-600 text-xs">جميع الحقوق محفوظة لـ R SOUQ / TOYLII LLC</p>
        </div>
      </footer>
    </div>
  );
}