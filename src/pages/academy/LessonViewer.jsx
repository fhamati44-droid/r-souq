import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import AcademyNav from '@/components/academy/AcademyNav';
import { Loader2, ArrowLeft, ArrowRight, Lock, CheckCircle2, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

const PURPLE = '#7A287F';
const GRAD = 'linear-gradient(135deg, #7A287F, #C4349C)';

function embedUrl(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return url;
}

export default function LessonViewer() {
  const { lessonId } = useParams();
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [marking, setMarking] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    document.title = 'درس | أكاديمية R SOUQ';
    (async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) { base44.auth.redirectToLogin(`/academy/lesson/${lessonId}`); return; }
        const me = await base44.auth.me();
        const l = await base44.entities.AcademyLesson.get(lessonId);
        setLesson(l);
        const mod = await base44.entities.AcademyModule.get(l.module_id);
        const c = await base44.entities.AcademyCourse.get(mod.course_id);
        setCourse(c);
        const ens = await base44.entities.AcademyEnrollment.filter({ user_id: me.id, course_id: c.id });
        const en = ens[0] || null;
        setEnrollment(en);
        if (!en && !l.is_preview) { setLocked(true); setLoading(false); return; }
        const mods = await base44.entities.AcademyModule.filter({ course_id: c.id });
        const moduleIds = mods.map((m) => m.id);
        const all = await base44.entities.AcademyLesson.list();
        const ls = all.filter((x) => moduleIds.includes(x.module_id)).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        setAllLessons(ls);
        if (en) {
          const prog = await base44.entities.AcademyLessonProgress.filter({ enrollment_id: en.id });
          setProgress(prog);
        }
      } catch (e) {
        toast.error('تعذّر تحميل الدرس');
      }
      setLoading(false);
    })();
  }, [lessonId]);

  const isCompleted = () => progress.some((p) => p.lesson_id === lesson.id && p.completed);

  const markComplete = async () => {
    if (!enrollment) { toast.error('يجب التسجيل في الدورة أولاً'); return; }
    if (isCompleted()) { goNext(); return; }
    setMarking(true);
    try {
      const existing = progress.find((p) => p.lesson_id === lesson.id);
      if (existing) {
        await base44.entities.AcademyLessonProgress.update(existing.id, { completed: true, completed_at: new Date().toISOString() });
      } else {
        const created = await base44.entities.AcademyLessonProgress.create({ enrollment_id: enrollment.id, lesson_id: lesson.id, completed: true, completed_at: new Date().toISOString() });
        setProgress((p) => [...p, created]);
      }
      const completedSet = new Set([...progress.filter((p) => p.completed).map((p) => p.lesson_id), lesson.id]);
      const total = allLessons.length;
      const done = allLessons.filter((ll) => completedSet.has(ll.id)).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      await base44.entities.AcademyEnrollment.update(enrollment.id, {
        progress_percentage: pct,
        enrollment_status: pct >= 100 ? 'completed' : 'active',
        completed_at: pct >= 100 ? new Date().toISOString() : enrollment.completed_at,
      });
      setProgress((p) => p.map((x) => (x.lesson_id === lesson.id ? { ...x, completed: true } : x)));
      toast.success('تم إنجاز الدرس');
      setTimeout(goNext, 400);
    } catch (e) {
      toast.error('حدث خطأ أثناء الحفظ');
    }
    setMarking(false);
  };

  const goNext = () => {
    const idx = allLessons.findIndex((l) => l.id === lesson.id);
    const next = allLessons[idx + 1];
    if (next) window.location.href = `/academy/lesson/${next.id}`;
    else toast('أكملت جميع دروس هذه الدورة 🎉');
  };
  const goPrev = () => {
    const idx = allLessons.findIndex((l) => l.id === lesson.id);
    const prev = allLessons[idx - 1];
    if (prev) window.location.href = `/academy/lesson/${prev.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F8]" dir="rtl">
        <AcademyNav />
        <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin" style={{ color: PURPLE }} /></div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="min-h-screen bg-[#F8F5F8]" dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic','Tajawal','Cairo',sans-serif" }}>
        <AcademyNav />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(122,40,127,0.1)' }}>
            <Lock className="w-8 h-8" style={{ color: PURPLE }} />
          </div>
          <h1 className="text-xl font-extrabold text-slate-800 mb-2">هذا الدرس متاح للمسجّلين فقط</h1>
          <p className="text-slate-500 mb-6">سجّل في الدورة للوصول إلى جميع الدروس والمهام.</p>
          <Link to="/academy" className="inline-flex items-center gap-2 h-12 px-6 rounded-xl font-bold text-sm text-white shadow-md" style={{ background: GRAD }}>
            العودة للأكاديمية <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#F8F5F8]" dir="rtl">
        <AcademyNav />
        <div className="text-center py-32 text-slate-500">الدرس غير موجود</div>
      </div>
    );
  }

  const embed = embedUrl(lesson.video_url);
  const idx = allLessons.findIndex((l) => l.id === lesson.id);

  return (
    <div className="min-h-screen bg-[#F8F5F8]" dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic','Tajawal','Cairo',sans-serif" }}>
      <AcademyNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/academy/dashboard" className="inline-flex items-center gap-1.5 text-sm font-bold mb-4" style={{ color: PURPLE }}>
          <ArrowLeft className="w-4 h-4 rotate-180" /> العودة للوحة المتدرب
        </Link>

        <p className="text-xs text-slate-400 mb-1">{course?.title}</p>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-5">{lesson.title}</h1>

        {/* Video */}
        <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white mb-6">
          {embed ? (
            <div className="aspect-video">
              <iframe src={embed} title={lesson.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
            </div>
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center text-slate-400">
              <PlayCircle className="w-12 h-12 mb-2" />
              <p className="text-sm">لا يوجد فيديو لهذا الدرس</p>
            </div>
          )}
        </div>

        {/* Content */}
        {lesson.lesson_content && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5 prose-sm max-w-none text-slate-700 leading-relaxed">
            <ReactMarkdown>{lesson.lesson_content}</ReactMarkdown>
          </div>
        )}

        {/* Task */}
        {lesson.task && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
            <h3 className="font-extrabold text-slate-800 mb-2 flex items-center gap-2">
              <ClipboardListWrapper /> المهمة العملية
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{lesson.task}</p>
          </div>
        )}

        {/* Complete action */}
        <div className="flex items-center justify-between gap-3 bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center gap-2 text-sm">
            {isCompleted() ? (
              <span className="flex items-center gap-1.5 font-bold text-emerald-600"><CheckCircle2 className="w-5 h-5" /> تم إنجاز هذا الدرس</span>
            ) : (
              <span className="text-slate-500">أنهيت الدرس؟ سجّله كمكتمل</span>
            )}
          </div>
          <button onClick={markComplete} disabled={marking}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl font-bold text-sm text-white shadow-md transition disabled:opacity-60" style={{ background: GRAD }}>
            {marking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {isCompleted() ? 'الدرس التالي' : 'تحديد كمكتمل'}
          </button>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={goPrev} disabled={idx <= 0}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 disabled:opacity-40">
            <ArrowRight className="w-4 h-4" /> الدرس السابق
          </button>
          <button onClick={goNext} disabled={idx >= allLessons.length - 1}
            className="inline-flex items-center gap-1.5 text-sm font-bold disabled:opacity-40" style={{ color: PURPLE }}>
            الدرس التالي <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ClipboardListWrapper() {
  // tiny inline to avoid extra import collision
  return <span className="inline-block w-1.5 h-4 rounded align-middle ml-1" style={{ background: PURPLE }} />;
}