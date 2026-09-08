import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ArrowLeft, GraduationCap, BookOpen } from 'lucide-react';
import AcademyNav from '@/components/academy/AcademyNav';
import { base44 } from '@/api/base44Client';

const PURPLE = '#7A287F';
const GRAD = 'linear-gradient(135deg, #7A287F, #C4349C)';

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
                <div className="w-36 h-36 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-4">
                  <GraduationCap className="w-14 h-14 text-slate-300" />
                </div>
                <h1 className="text-xl font-extrabold text-slate-800">—</h1>
                <p className="text-sm text-slate-500">المستشار التدريبي</p>
              </div>

              <div className="sm:col-span-2">
                <h2 className="text-lg font-extrabold text-slate-800 mb-1">المسمى المهني</h2>
                <p className="text-slate-500 text-sm mb-5">سيتم تحديث الاسم الكامل والمسمى المهني والنبذة التعريفية قريباً بمجرد تزويدنا بالبيانات الرسمية.</p>

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
              <div className="rounded-2xl border border-dashed border-slate-200 p-5 bg-[#FCFAFC]">
                <p className="text-xs text-slate-400 mb-1">شعار الشريك التدريبي</p>
                <div className="h-24 flex items-center justify-center text-slate-400 text-sm">يُرفع الشعار قريباً</div>
              </div>
              <p className="text-xs text-slate-400 mt-4">ملاحظة: المعلومات المعروضة مؤقتة ولا يتم اختراع أي بيانات. سيتم تحديثها فور تزويدنا ببيانات المستشار الرسمية وشعاره.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}