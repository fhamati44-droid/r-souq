import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const TOTAL_STEPS = 5;
const PURPLE = '#7A287F';
const MAGENTA = '#C4349C';
const GRAD = 'linear-gradient(135deg, #7A287F, #C4349C)';
const STEP_LABELS = ['المعلومات الأساسية', 'الوضع الحالي', 'الأهداف', 'القدرة على البدء', 'التأكيد'];

const CURRENT_STORE_OPTS = [
  { v: 'no', l: 'لا، ليس لدي متجر' },
  { v: 'physical', l: 'نعم، متجر فعلي' },
  { v: 'online', l: 'نعم، متجر أونلاين' },
];
const HAS_PRODUCTS_OPTS = [
  { v: 'no', l: 'لا، لا أملك منتجات' },
  { v: 'some', l: 'أملك بعض المنتجات' },
  { v: 'yes', l: 'نعم، أملك منتجات جاهزة' },
];
const EXPERIENCE_OPTS = [
  { v: 'none', l: 'لا خبرة سابقة' },
  { v: 'some', l: 'خبرة بسيطة' },
  { v: 'experienced', l: 'خبرة جيدة' },
];
const WEEKLY_OPTS = [
  { v: 'under_5', l: 'أقل من 5 ساعات' },
  { v: '5_10', l: '5 - 10 ساعات' },
  { v: '10_20', l: '10 - 20 ساعة' },
  { v: '20_plus', l: 'أكثر من 20 ساعة' },
];
const BUDGET_OPTS = [
  { v: 'under_10k', l: 'أقل من 10,000 ريال' },
  { v: '10k_25k', l: '10,000 - 25,000 ريال' },
  { v: '25k_50k', l: '25,000 - 50,000 ريال' },
  { v: '50k_plus', l: 'أكثر من 50,000 ريال' },
];
const START_OPTS = [
  { v: 'immediately', l: 'فوراً' },
  { v: '1_month', l: 'خلال شهر' },
  { v: '1_3_months', l: '1 - 3 أشهر' },
  { v: 'later', l: 'لاحقاً' },
];
const DECISION_OPTS = [
  { v: 'yes', l: 'نعم، أنا صاحب القرار' },
  { v: 'partner', l: 'بمشاركة شريك' },
  { v: 'no', l: 'لا، أحتاج موافقة' },
];

function getUTM() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get('utm_source') || '',
    utm_medium: p.get('utm_medium') || '',
    utm_campaign: p.get('utm_campaign') || '',
    utm_content: p.get('utm_content') || '',
    utm_term: p.get('utm_term') || '',
  };
}

const inputCls =
  'w-full h-11 px-4 rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-violet-400 border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400';

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function OptionButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-14 w-full rounded-xl font-bold text-sm transition text-right px-4"
      style={
        active
          ? { background: 'rgba(122,40,127,0.08)', border: `2px solid ${PURPLE}`, color: PURPLE }
          : { border: '2px solid #e5e1e8', color: '#4a4149', background: '#fff' }
      }
    >
      {label}
    </button>
  );
}

function OptionGrid({ opts, value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {opts.map((o) => (
        <OptionButton key={o.v} active={value === o.v} onClick={() => onChange(o.v)} label={o.l} />
      ))}
    </div>
  );
}

export default function FitnessForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [currentStore, setCurrentStore] = useState('');
  const [hasProducts, setHasProducts] = useState('');
  const [experience, setExperience] = useState('');
  const [interestedCategory, setInterestedCategory] = useState('');
  const [reason, setReason] = useState('');
  const [weeklyAvailability, setWeeklyAvailability] = useState('');
  const [twelveMonthGoal, setTwelveMonthGoal] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [expectedStartDate, setExpectedStartDate] = useState('');
  const [decisionMaker, setDecisionMaker] = useState('');

  const isPhoneValid = (v) => /^\d{8,12}$/.test(v.replace(/\s/g, ''));
  const isEmailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const canNext = () => {
    if (step === 0)
      return fullName.trim() && isPhoneValid(phone) && isEmailValid(email) && city.trim();
    if (step === 1) return currentStore && hasProducts && experience;
    if (step === 2) return reason.trim() && weeklyAvailability && twelveMonthGoal.trim();
    if (step === 3) return budgetRange && expectedStartDate && decisionMaker;
    if (step === 4) return true;
    return false;
  };

  const fireStarted = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      base44.analytics.track({ eventName: 'merchant_application_started', properties: getUTM() });
    }
  };

  const next = () => {
    if (!canNext()) {
      toast.error('يرجى إكمال جميع الحقول المطلوبة');
      return;
    }
    fireStarted();
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else handleSubmit();
  };
  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const resetAll = () => {
    setDone(false);
    setStep(0);
    setFullName(''); setPhone(''); setEmail(''); setCity(''); setAge('');
    setCurrentStore(''); setHasProducts(''); setExperience(''); setInterestedCategory('');
    setReason(''); setWeeklyAvailability(''); setTwelveMonthGoal('');
    setBudgetRange(''); setExpectedStartDate(''); setDecisionMaker('');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await base44.entities.MerchantApplication.create({
        full_name: fullName.trim(),
        phone: `+966${phone.trim()}`.replace('+966+966', '+966'),
        email: email.trim(),
        city: city.trim(),
        age: age ? Number(age) : undefined,
        current_store: currentStore,
        has_products: hasProducts,
        experience,
        interested_category: interestedCategory.trim() || undefined,
        reason: reason.trim(),
        weekly_availability: weeklyAvailability,
        twelve_month_goal: twelveMonthGoal.trim(),
        budget_range: budgetRange,
        expected_start_date: expectedStartDate,
        decision_maker: decisionMaker,
        source: 'start_your_store',
        ...getUTM(),
        status: 'new',
      });
      base44.analytics.track({ eventName: 'merchant_application_completed', properties: getUTM() });
      setDone(true);
      toast.success('تم استلام طلبك بنجاح');
    } catch (err) {
      toast.error('حدث خطأ أثناء الإرسال، حاول مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center" dir="rtl">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: GRAD }}>
          <CheckCircle className="w-9 h-9 text-white" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-800 mb-2">شكراً لك</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
          سيقوم فريق تطوير الأعمال بمراجعة بياناتك والتواصل معك لتحديد الخطوة المناسبة.
        </p>
        <button onClick={resetAll} className="text-sm font-bold" style={{ color: PURPLE }}>
          إرسال طلب آخر
        </button>
      </div>
    );
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const labelOf = (opts, v) => (opts.find((o) => o.v === v) || {}).l || '—';

  return (
    <div id="fitness-form" className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden" dir="rtl">
      <div className="px-6 py-5 text-white text-center" style={{ background: GRAD }}>
        <h3 className="text-lg font-extrabold">اختبار الملاءمة</h3>
        <p className="text-white/85 text-xs mt-1">
          {STEP_LABELS[step]} — الخطوة {step + 1} من {TOTAL_STEPS}
        </p>
        <div className="mt-3 h-1.5 w-full bg-white/25 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
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
                <Field label="الاسم الكامل">
                  <input className={inputCls} type="text" value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: أحمد محمد القحطاني" />
                </Field>
                <Field label="رقم الجوال" hint="أدخل الرقم بدون المفتال الدولي">
                  <div className="flex items-stretch">
                    <span className="flex items-center px-3 rounded-r-xl border border-l-0 text-sm font-bold text-slate-600 bg-slate-50 border-slate-200">
                      +966
                    </span>
                    <input className="flex-1 h-11 px-4 rounded-l-xl text-sm text-left focus:outline-none focus:ring-2 focus:ring-violet-400 border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
                      dir="ltr" type="tel" value={phone}
                      onChange={(e) => setPhone(e.target.value)} placeholder="5XXXXXXXX" />
                  </div>
                </Field>
                <Field label="البريد الإلكتروني">
                  <input className={inputCls} dir="ltr" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="المدينة">
                    <input className={inputCls} type="text" value={city}
                      onChange={(e) => setCity(e.target.value)} placeholder="مثال: الرياض" />
                  </Field>
                  <Field label="العمر">
                    <input className={inputCls} type="number" min="14" max="100" value={age}
                      onChange={(e) => setAge(e.target.value)} placeholder="اختياري" />
                  </Field>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <Field label="هل لديك متجر حالياً؟">
                  <OptionGrid opts={CURRENT_STORE_OPTS} value={currentStore} onChange={setCurrentStore} />
                </Field>
                <Field label="هل لديك منتجات؟">
                  <OptionGrid opts={HAS_PRODUCTS_OPTS} value={hasProducts} onChange={setHasProducts} />
                </Field>
                <Field label="هل سبق لك العمل في التجارة الإلكترونية؟">
                  <OptionGrid opts={EXPERIENCE_OPTS} value={experience} onChange={setExperience} />
                </Field>
                <Field label="ما المجال الذي تهتم به؟">
                  <input className={inputCls} type="text" value={interestedCategory}
                    onChange={(e) => setInterestedCategory(e.target.value)}
                    placeholder="مثال: إلكترونيات، أزياء، منزل..." />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <Field label="لماذا تريد فتح متجر؟">
                  <textarea className={inputCls + ' h-auto py-3 resize-none'} rows="3" value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="اكتب باختصار عن هدفك من فتح المتجر..." />
                </Field>
                <Field label="كم من الوقت تستطيع تخصيصه للمشروع أسبوعياً؟">
                  <OptionGrid opts={WEEKLY_OPTS} value={weeklyAvailability} onChange={setWeeklyAvailability} />
                </Field>
                <Field label="ما النتيجة التي تريد تحقيقها خلال 12 شهراً؟">
                  <textarea className={inputCls + ' h-auto py-3 resize-none'} rows="3" value={twelveMonthGoal}
                    onChange={(e) => setTwelveMonthGoal(e.target.value)}
                    placeholder="مثال: متجر فعّال بمبيعات شهرية منتظمة..." />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <Field label="ما الميزانية التي تستطيع تخصيصها للمشروع؟">
                  <OptionGrid opts={BUDGET_OPTS} value={budgetRange} onChange={setBudgetRange} />
                </Field>
                <Field label="متى تريد البدء؟">
                  <OptionGrid opts={START_OPTS} value={expectedStartDate} onChange={setExpectedStartDate} />
                </Field>
                <Field label="هل أنت صاحب القرار؟">
                  <OptionGrid opts={DECISION_OPTS} value={decisionMaker} onChange={setDecisionMaker} />
                </Field>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h4 className="text-center text-base font-extrabold text-slate-800 mb-2">
                  راجع بياناتك قبل الإرسال
                </h4>
                <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 text-sm">
                  <SummaryRow k="الاسم" v={fullName} />
                  <SummaryRow k="الجوال" v={`+966${phone}`} />
                  <SummaryRow k="البريد" v={email} />
                  <SummaryRow k="المدينة" v={city} />
                  <SummaryRow k="المجال" v={interestedCategory || '—'} />
                  <SummaryRow k="الوضع الحالي" v={labelOf(CURRENT_STORE_OPTS, currentStore)} />
                  <SummaryRow k="الوقت الأسبوعي" v={labelOf(WEEKLY_OPTS, weeklyAvailability)} />
                  <SummaryRow k="الميزانية" v={labelOf(BUDGET_OPTS, budgetRange)} />
                  <SummaryRow k="البدء" v={labelOf(START_OPTS, expectedStartDate)} />
                </div>
                <p className="text-xs text-slate-500 text-center">
                  بتأكيدك، سيقوم فريق تطوير الأعمال بمراجعة طلبك والتواصل معك.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3 mt-6">
          {step > 0 && (
            <button type="button" onClick={back} disabled={submitting}
              className="h-12 px-5 rounded-xl font-bold text-sm transition border border-slate-200 text-slate-600">
              رجوع
            </button>
          )}
          <button type="button" onClick={next} disabled={submitting}
            className="flex-1 h-12 rounded-xl text-white font-bold text-sm transition hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
            style={{ background: GRAD }}>
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> جاري الإرسال...</>
            ) : step === TOTAL_STEPS - 1 ? (
              'احجز جلستك الاستشارية'
            ) : (
              <>التالي <ArrowLeft className="w-4 h-4" /></>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 mt-4">
          <Lock className="w-3 h-3" /> بياناتك آمنة ولن تُشارك مع أي طرف ثالث
        </p>
      </div>
    </div>
  );
}

function SummaryRow({ k, v }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-slate-500">{k}</span>
      <span className="font-bold text-slate-800 text-left" dir="auto">{v}</span>
    </div>
  );
}