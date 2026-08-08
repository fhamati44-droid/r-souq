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
      <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 p-8 text-center" dir="rtl">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-9 h-9 text-green-600" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-800 mb-2">تم استلام طلبك!</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          شكراً لك يا {fullName.split(' ')[0]}. سيتواصل معك فريق تطوير الأعمال في R SOUQ خلال 24 ساعة لترتيب جلستك الاستشارية المجانية.
        </p>
        <button
          onClick={() => {
            setDone(false); setStep(0); setFullName(''); setPhone('');
            setInterest(''); setHasExperience(''); setExperienceDetails('');
            setManagement(''); setGoal(''); setBudget('');
          }}
          className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition"
        >
          إرسال طلب آخر
        </button>
      </div>
    );
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div id="lead-form" className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden" dir="rtl">
      <div className="px-6 py-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #6a1b9a, #7b2d8b)' }}>
        <h3 className="text-lg font-extrabold">سجّل بياناتك لبدء استشارتك المجانية</h3>
        <p className="text-white/80 text-xs mt-1">استبيان سريع من 5 خطوات</p>
        {/* Progress bar */}
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
            {/* STEP 0: Basic info */}
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">الاسم الكامل</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: أحمد محمد القحطاني"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">رقم الجوال</label>
                  <div className="flex items-stretch">
                    <span className="flex items-center px-3 rounded-r-xl border border-l-0 border-slate-200 bg-slate-50 text-sm font-bold text-slate-600">
                      +966
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="5XXXXXXXX"
                      dir="ltr"
                      className="flex-1 h-11 px-4 rounded-l-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition text-left"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">نوع الاستثمار / الاهتمام</label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition bg-white"
                  >
                    <option value="">اختر نوع الاستثمار...</option>
                    {INTEREST_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 1: Experience */}
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-slate-800 text-center leading-relaxed">
                  هل لديك خبرة سابقة في هذا المجال؟
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[{ v: 'yes', l: 'نعم' }, { v: 'no', l: 'لا' }].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setHasExperience(opt.v)}
                      className={`h-14 rounded-xl border-2 font-bold text-sm transition ${hasExperience === opt.v ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-600 hover:border-violet-300'}`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                    تفاصيل الخبرة <span className="text-slate-400 font-normal">(اختياري)</span>
                  </label>
                  <textarea
                    value={experienceDetails}
                    onChange={(e) => setExperienceDetails(e.target.value)}
                    placeholder="اكتب باختصار عن خبرتك السابقة..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Management */}
            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-slate-800 text-center leading-relaxed">
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
                      className={`rounded-xl border-2 p-4 text-right transition ${management === opt.v ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-violet-300'}`}
                    >
                      <p className={`font-bold text-sm ${management === opt.v ? 'text-violet-700' : 'text-slate-700'}`}>{opt.l}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{opt.d}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Goal */}
            {step === 3 && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-slate-800 text-center leading-relaxed">
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
                      className={`h-14 rounded-xl border-2 font-bold text-sm transition ${goal === opt.v ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-600 hover:border-violet-300'}`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Budget */}
            {step === 4 && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-slate-800 text-center leading-relaxed">
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
                      className={`h-14 rounded-xl border-2 font-bold text-sm transition ${budget === opt.v ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-600 hover:border-violet-300'}`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-3 mt-6">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              disabled={submitting}
              className="h-12 px-5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm transition hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" /> رجوع
            </button>
          )}
          <button
            type="button"
            onClick={next}
            disabled={submitting}
            className="flex-1 h-12 rounded-xl text-white font-bold text-sm transition hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6a1b9a, #7b2d8b)' }}
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

        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 mt-4">
          <Lock className="w-3 h-3" />
          جميع تعاملاتك آمنة وتتم عبر القنوات الرسمية حصراً
        </p>
      </div>
    </div>
  );
}