import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Lock, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const INTEREST_OPTIONS = [
  { value: 'new_investor', label: 'مستثمر جديد' },
  { value: 'existing_merchant', label: 'تاجر حالي' },
  { value: 'supplier', label: 'مورد / صاحب منتجات' },
];

const TOTAL_STEPS = 5; // 0:info, 1:experience, 2:management, 3:goal, 4:budget

export default function LeadForm() {
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [hasExperience, setHasExperience] = useState('');
  const [experienceDetails, setExperienceDetails] = useState('');
  const [management, setManagement] = useState('');
  const [goal, setGoal] = useState('');
  const [budget, setBudget] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const canNext = () => {
    if (step === 0) return fullName.trim() && phone.trim() && interest;
    if (step === 1) return hasExperience;
    if (step === 2) return management;
    if (step === 3) return goal;
    if (step === 4) return budget;
    return false;
  };

  const next = () => {
    if (!canNext()) {
      toast.error('يرجى الإجابة قبل المتابعة');
      return;
    }
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else handleSubmit();
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!/^\d{8,12}$/.test(phone.replace(/\s/g, ''))) {
      toast.error('يرجى إدخال رقم جوال صحيح');
      setStep(0);
      return;
    }
    setSubmitting(true);
    try {
      const notes = [
        `خبرة سابقة: ${hasExperience === 'yes' ? 'نعم' : 'لا'}`,
        experienceDetails ? `تفاصيل الخبرة: ${experienceDetails}` : null,
        `الإدارة: ${management === 'self' ? 'أدير المتجر بنفسي' : 'أحتاج فريق'}`,
        `الهدف: ${goal === 'additional_income' ? 'دخل إضافي' : goal === 'main_project' ? 'مشروع أساسي' : 'توسيع نشاط'}`,
        `الميزانية: ${budget === '50k' ? '50,000 ريال' : budget === '100k' ? '100,000 ريال' : '100k - 160K ريال'}`,
      ].filter(Boolean).join('\n');

      await base44.entities.Lead.create({
        full_name: fullName.trim(),
        phone: `+966${phone.trim()}`,
        interest_type: interest,
        has_experience: hasExperience,
        experience_details: experienceDetails.trim() || undefined,
        management_preference: management,
        investment_goal: goal,
        budget_range: budget,
        notes,
      });
      // Meta Pixel: fire Lead conversion event for ad optimization
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: 'Landing Lead Form',
          interest_type: interest,
          budget_range: budget,
        });
      }
      // Google Tag Manager: push lead event to dataLayer
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'rsouq_lead',
          interest_type: interest,
          budget_range: budget,
        });
      }
      setDone(true);
      toast.success('تم استلام بياناتك بنجاح! سنتواصل معك خلال 24 ساعة.');
    } catch (err) {
      toast.error('حدث خطأ أثناء الإرسال، حاول مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rsouq-card-glass rounded-3xl shadow-2xl p-8 text-center" dir="rtl" style={{ boxShadow: '0 30px 80px rgba(122,40,127,0.35)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #C4349C, #7A287F)' }}>
          <CheckCircle className="w-9 h-9 text-white" />
        </div>
        <h3 className="text-xl font-extrabold text-white mb-2">تم استلام طلبك!</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          شكراً لك يا {fullName.split(' ')[0]}. سيتواصل معك فريق تطوير الأعمال في R SOUQ خلال 24 ساعة لترتيب جلستك الاستشارية المجانية.
        </p>
        <button
          onClick={() => {
            setDone(false); setStep(0); setFullName(''); setPhone('');
            setInterest(''); setHasExperience(''); setExperienceDetails('');
            setManagement(''); setGoal(''); setBudget('');
          }}
          className="text-sm font-semibold text-pink-300 hover:text-pink-200 transition"
        >
          إرسال طلب آخر
        </button>
      </div>
    );
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div
      id="lead-form"
      className="rsouq-card-glass rounded-3xl shadow-2xl overflow-hidden"
      dir="rtl"
      style={{ boxShadow: '0 30px 80px rgba(122,40,127,0.35)' }}
    >
      <div className="px-6 py-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #C4349C, #7A287F)' }}>
        <h3 className="text-lg font-extrabold">سجّل بياناتك لبدء استشارتك المجانية</h3>
        <p className="text-white/80 text-xs mt-1">استبيان سريع من 5 خطوات</p>
        <div className="mt-3 h-1.5 w-full bg-white/25 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-white/70 text-[10px] mt-1.5">الخطوة {step + 1} من {TOTAL_STEPS}</p>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-200 mb-1.5 block">الاسم الكامل</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: أحمد محمد القحطاني"
                    className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-slate-500 transition focus:outline-none focus:ring-2"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-200 mb-1.5 block">رقم الجوال</label>
                  <div className="flex items-stretch">
                    <span className="flex items-center px-3 rounded-r-xl border border-l-0 text-sm font-bold text-slate-300" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                      +966
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="5XXXXXXXX"
                      dir="ltr"
                      className="flex-1 h-11 px-4 rounded-l-xl text-sm text-white placeholder:text-slate-500 text-left transition focus:outline-none focus:ring-2"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-200 mb-1.5 block">نوع الاستثمار / الاهتمام</label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl text-sm text-white transition focus:outline-none focus:ring-2"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <option value="" style={{ color: '#000' }}>اختر نوع الاستثمار...</option>
                    {INTEREST_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} style={{ color: '#000' }}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-white text-center leading-relaxed">
                  هل لديك خبرة سابقة في هذا المجال؟
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[{ v: 'yes', l: 'نعم' }, { v: 'no', l: 'لا' }].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setHasExperience(opt.v)}
                      className="h-14 rounded-xl font-bold text-sm transition"
                      style={
                        hasExperience === opt.v
                          ? { background: 'rgba(196,52,156,0.18)', border: '2px solid #C4349C', color: '#F07AC9' }
                          : { border: '2px solid rgba(255,255,255,0.12)', color: '#D8CDD9' }
                      }
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-200 mb-1.5 block">
                    تفاصيل الخبرة <span className="text-slate-500 font-normal">(اختياري)</span>
                  </label>
                  <textarea
                    value={experienceDetails}
                    onChange={(e) => setExperienceDetails(e.target.value)}
                    placeholder="اكتب باختصار عن خبرتك السابقة..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-slate-500 transition resize-none focus:outline-none focus:ring-2"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-white text-center leading-relaxed">
                  هل ترغب بإدارة الأمر بنفسك؟
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { v: 'self', l: 'أدير المتجر بنفسي', d: 'أتحمل مسؤولية التشغيل اليومي' },
                    { v: 'team', l: 'أحتاج فريق', d: 'أفضّل أن يتولى فريق R SOUQ الإدارة' },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setManagement(opt.v)}
                      className="rounded-xl p-4 text-right transition"
                      style={
                        management === opt.v
                          ? { background: 'rgba(196,52,156,0.18)', border: '2px solid #C4349C' }
                          : { border: '2px solid rgba(255,255,255,0.12)' }
                      }
                    >
                      <p className={`font-bold text-sm ${management === opt.v ? 'text-pink-300' : 'text-slate-200'}`}>{opt.l}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.d}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-white text-center leading-relaxed">
                  ما هو هدفك الأساسي من الاستثمار في المتجر؟
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { v: 'additional_income', l: 'دخل إضافي' },
                    { v: 'main_project', l: 'مشروع أساسي' },
                    { v: 'expand', l: 'توسيع نشاط' },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setGoal(opt.v)}
                      className="h-14 rounded-xl font-bold text-sm transition"
                      style={
                        goal === opt.v
                          ? { background: 'rgba(196,52,156,0.18)', border: '2px solid #C4349C', color: '#F07AC9' }
                          : { border: '2px solid rgba(255,255,255,0.12)', color: '#D8CDD9' }
                      }
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-white text-center leading-relaxed">
                  ما هي الميزانية المتاحة لديك؟
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { v: '50k', l: '50,000 ريال' },
                    { v: '100k', l: '100,000 ريال' },
                    { v: '100k_160k', l: '100K - 160K ريال' },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setBudget(opt.v)}
                      className="h-14 rounded-xl font-bold text-sm transition"
                      style={
                        budget === opt.v
                          ? { background: 'rgba(196,52,156,0.18)', border: '2px solid #C4349C', color: '#F07AC9' }
                          : { border: '2px solid rgba(255,255,255,0.12)', color: '#D8CDD9' }
                      }
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3 mt-6">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              disabled={submitting}
              className="h-12 px-5 rounded-xl font-bold text-sm transition flex items-center gap-1.5"
              style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#D8CDD9' }}
            >
              <ArrowRight className="w-4 h-4" /> رجوع
            </button>
          )}
          <button
            type="button"
            onClick={next}
            disabled={submitting}
            className="flex-1 h-12 rounded-xl text-white font-bold text-sm transition hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #C4349C, #7A287F)' }}
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> جاري الإرسال...</>
            ) : step === TOTAL_STEPS - 1 ? (
              'إرسال الطلب'
            ) : (
              <>التالي <ArrowLeft className="w-4 h-4" /></>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 mt-4">
          <Lock className="w-3 h-3" />
          جميع تعاملاتك آمنة وتتم عبر القنوات الرسمية حصراً
        </p>
      </div>
    </div>
  );
}