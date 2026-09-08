import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AcademyNav from '@/components/academy/AcademyNav';
import { Loader2, PlayCircle, CheckCircle2, ClipboardList, ArrowLeft, Award, BarChart3, BookOpen } from 'lucide-react';

const PURPLE = '#7A287F';
const GRAD = 'linear-gradient(135deg, #7A287F, #C4349C)';

function sortLessons(list) {
  return [...list].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    document.title = 'لوحة المتدرب | أكاديمية R SOUQ';
    (async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) { base44.auth.redirectToLogin('/academy/dashboard'); return; }
        const me = await base44.auth.me();
        const ens = await base44.entities.AcademyEnrollment.filter({ user_id: me.id }, '-enrolled_at', 50);
        setEnrollments(ens);
        if (ens.length === 0) { setLoading(false); return; }
        const coursesData = (await Promise.all(ens.map((e) => base44.entities.AcademyCourse.get(e.course_id).catch(() => null)))).filter(Boolean);
        setCourses(coursesData);
        const courseIds = coursesData.map((c) => c.id);
        const mods = (await Promise.all(courseIds.map((id) => base44.entities.AcademyModule.filter({ course_id: id })))).flat();
        setModules(mods);
        const moduleIds = mods.map((m) => m.id);
        const allLessons = await base44.entities.AcademyLesson.list();
        setLessons(allLessons.filter((l) => moduleIds.includes(l.module_id)));
        const prog = (await Promise.all(ens.map((e) => base44.entities.AcademyLessonProgress.filter({ enrollment_id: e.id })))).flat();
        setProgress(prog);
      } catch (e) {
        /* ignore */
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F8]" dir="rtl">
        <AcademyNav />
        <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin" style={{ color: PURPLE }} /></div>
      </div>
    );
  }

  const moduleToCourse = {};
  modules.forEach((m) => { moduleToCourse[m.id] = m.course_id; });
  const lessonsOf = (cid) => sortLessons(lessons.filter((l) => moduleToCourse[l.module_id] === cid));
  const completedIds = (eid) => new Set(progress.filter((p) => p.enrollment_id === eid && p.completed).map((p) => p.lesson_id));

  // overall metrics
  let totalDone = 0, totalLessons = 0, totalTasks = 0;
  let firstNext = null;
  enrollments.forEach((e) => {
    const ls = lessonsOf(e.course_id);
    const done = completedIds(e.id);
    totalLessons += ls.length;
    totalDone += ls.filter((l) => done.has(l.id)).length;
    totalTasks += ls.filter((l) => l.task && !done.has(l.id)).length;
    const next = ls.find((l) => !done.has(l.id));
    if (next && !firstNext) firstNext = { lesson: next, enrollment: e };
  });
  const overallPct = totalLessons ? Math.round((totalDone / totalLessons) * 100) : 0;
  const programStatus = enrollments.length === 0 ? '—' : enrollments.some((e) => e.enrollment_status === 'completed' || (e.progress_percentage || 0) >= 100) ? 'مكتمل' : 'قيد التقدّم';

  if (enrollments.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F5F8]" dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic','Tajawal','Cairo',sans-serif" }}>
        <AcademyNav />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">لا توجد دورات مُسجّلة بعد</h1>
          <p className="text-slate-500 mb-6">تصفّح الأكاديمية وابدأ مسارك التعليمي للتسجيل في الدورات.</p>
          <Link to="/academy" className="inline-flex items-center gap-2 h-12 px-6 rounded-xl font-bold text-sm text-white shadow-md" style={{ background: GRAD }}>
            تصفّح الأكاديمية <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F8]" dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic','Tajawal','Cairo',sans-serif" }}>
      <AcademyNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-6">لوحة المتدرب</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BarChart3} label="نسبة التقدّم" value={`${overallPct}%`} />
          <StatCard icon={CheckCircle2} label="الدروس المكتملة" value={`${totalDone} / ${totalLessons}`} />
          <StatCard icon={ClipboardList} label="المهام المفتوحة" value={`${totalTasks}`} />
          <StatCard icon={Award} label="حالة البرنامج" value={programStatus} />
        </div>

        {/* Continue from last lesson */}
        {firstNext && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: PURPLE }}>الاستمرار من آخر درس</p>
              <p className="font-extrabold text-slate-800">{firstNext.lesson.title}</p>
              <p className="text-sm text-slate-500">تابع من حيث توقفت</p>
            </div>
            <Link to={`/academy/lesson/${firstNext.lesson.id}`} className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl font-bold text-sm text-white shrink-0" style={{ background: GRAD }}>
              <PlayCircle className="w-4 h-4" /> متابعة الدرس
            </Link>
          </div>
        )}

        {/* My courses */}
        <h2 className="text-lg font-extrabold text-slate-800 mb-4">دوراتي</h2>
        <div className="space-y-4">
          {enrollments.map((e) => {
            const course = courses.find((c) => c.id === e.course_id);
            if (!course) return null;
            const ls = lessonsOf(e.course_id);
            const done = completedIds(e.id);
            const doneCount = ls.filter((l) => done.has(l.id)).length;
            const pct = ls.length ? Math.round((doneCount / ls.length) * 100) : 0;
            const next = ls.find((l) => !done.has(l.id));
            return (
              <div key={e.id} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-800">{course.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{ls.length} درس • {doneCount} مكتمل</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: PURPLE }}>{pct}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: GRAD }} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-500">
                    {next ? <>الدرس التالي: <span className="font-bold text-slate-700">{next.title}</span></> : <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> مكتمل</span>}
                  </div>
                  {next ? (
                    <Link to={`/academy/lesson/${next.id}`} className="inline-flex items-center gap-1.5 text-sm font-bold h-9 px-4 rounded-lg text-white shrink-0" style={{ background: GRAD }}>
                      <PlayCircle className="w-4 h-4" /> ابدأ
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600"><Award className="w-4 h-4" /> شهادة</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Open tasks */}
        {totalTasks > 0 && (
          <>
            <h2 className="text-lg font-extrabold text-slate-800 mt-8 mb-4">المهام المفتوحة</h2>
            <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50">
              {enrollments.map((e) => {
                const course = courses.find((c) => c.id === e.course_id);
                const ls = lessonsOf(e.course_id);
                const done = completedIds(e.id);
                const tasks = ls.filter((l) => l.task && !done.has(l.id));
                return tasks.map((l) => (
                  <Link key={l.id} to={`/academy/lesson/${l.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{l.title}</p>
                      <p className="text-xs text-slate-400">{course?.title}</p>
                    </div>
                    <ClipboardList className="w-4 h-4" style={{ color: PURPLE }} />
                  </Link>
                ));
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(122,40,127,0.1)' }}>
        <Icon className="w-5 h-5" style={{ color: PURPLE }} />
      </div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-extrabold text-slate-800">{value}</p>
    </div>
  );
}