import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ArrowLeft, GraduationCap, BookOpen } from 'lucide-react';
import AcademyNav from '@/components/academy/AcademyNav';
import { base44 } from '@/api/base44Client';

const PURPLE = '#7A287F';
const GRAD = 'linear-gradient(135deg, #7A287F, #C4349C)';
const CONSULTANT_IMG = 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/ab374614f_775279432_1571479978007436_1399348346080758088_n.jpg';

const EXPERTISE = ['(تُحدّد لاحقاً)', '(تُحدّد لاحقاً)', '(تُحدّد لاحقاً)'];
const PROGRAMS = ['مسار ابدأ تجارتك', 'برنامج تاجر R SOUQ'];

export default function Instructor() {
  useEffect(() => {
    document.title = 'المستشار التدريبي | أكاديمية R SOUQ';
  }, []);

  const openInsta = () => {
    base44.analytics.track({ eventName: 'instructor_instagram_clicked' });
    window.open('https://www.instagram.com/bebright06/', '_blank', 'noopener');
  };

  return (
    <div className="min-h-screen bg-[#F8F5F8]" dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic','Tajawal','Cairo',sans-serif" }}>
      <AcademyNav />
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/academy" className="inline-flex items-center gap-1.5 text-sm font-bold mb-6" style={{ color: PURPLE }}>
            <ArrowLeft className="w-4 h-4 rotate-180" /> العودة للأكاديمية
          </Link>

          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            <div className="p-6 sm:p-8 grid sm:grid-cols-3 gap-6">
              <div className="sm:col-span-1 flex flex-col items-center text-center">
                <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center mb-4">
                  <img src={CONSULTANT_IMG} alt="المستشار محمد خليل العطية" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-xl font-extrabold text-slate-800">محمد خليل العطية</h1>
                <p className="text-sm text-slate-500">المستشار التدريبي</p>
              </div>

              <div className="sm:col-span-2">
                <h2 className="text-lg font-extrabold text-slate-800 mb-1">مستشار تجارة إلكترونية</h2>
                <p className="text-slate-500 text-sm mb-5">المستشار التدريبي والاستشاري لأكاديمية R SOUQ — يقود البرنامج التعليمي العملي من الفكرة وحتى أول طلب في المتجر.</p>

                <h3 className="font-bold text-slate-700 mb-2">مجالات الخبرة</h3>
                <div className="flex flex-wrap gap-2 mb-5">
                  {EXPERTISE.map((e, i) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'rgba(122,40,127,0.08)', color: PURPLE }}>{e}</span>
                  ))}
                </div>

                <h3 className="font-bold text-slate-700 mb-2">البرامج التي يقدمها</h3>
                <ul className="space-y-2 mb-6">
                  {PROGRAMS.map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600"><BookOpen className="w-4 h-4" style={{ color: PURPLE }} /> {p}</li>
                  ))}
                </ul>

                <button onClick={openInsta} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl font-bold text-sm text-white transition hover:-translate-y-0.5" style={{ background: GRAD }}>
                  <Instagram className="w-4 h-4" /> حساب Instagram
                </button>
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-8">
              <div className="rounded-2xl border border-slate-200 p-5 bg-[#FCFAFC]">
                <p className="text-xs text-slate-400 mb-1">الشعار التعريفي للمستشار</p>
                <img src={CONSULTANT_IMG} alt="محمد خليل العطية" className="w-full max-w-xs mx-auto rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}