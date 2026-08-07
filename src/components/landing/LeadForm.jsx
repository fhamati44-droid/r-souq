import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const INTEREST_OPTIONS = [
  { value: 'new_investor', label: 'مستثمر جديد' },
  { value: 'existing_merchant', label: 'تاجر حالي' },
  { value: 'supplier', label: 'مورد / صاحب منتجات' },
];

export default function LeadForm() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !interest) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }
    if (!/^\d{8,12}$/.test(phone.replace(/\s/g, ''))) {
      toast.error('يرجى إدخال رقم جوال صحيح');
      return;
    }
    setSubmitting(true);
    try {
      await base44.entities.Lead.create({
        full_name: fullName.trim(),
        phone: `+966${phone.trim()}`,
        interest_type: interest,
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
          onClick={() => { setDone(false); setFullName(''); setPhone(''); setInterest(''); }}
          className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition"
        >
          إرسال طلب آخر
        </button>
      </div>
    );
  }

  return (
    <div id="lead-form" className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden" dir="rtl">
      <div className="px-6 py-4 text-white text-center" style={{ background: 'linear-gradient(135deg, #6a1b9a, #7b2d8b)' }}>
        <h3 className="text-lg font-extrabold">سجّل بياناتك لبدء استشارتك المجانية</h3>
        <p className="text-white/80 text-xs mt-1">املأ النموذج وسنتواصل معك خلال 24 ساعة</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-12 rounded-xl text-white font-bold text-sm transition hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #6a1b9a, #7b2d8b)' }}
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> جاري الإرسال...</>
          ) : (
            'احجز جلستك الاستشارية الآن'
          )}
        </button>
        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" />
          جميع تعاملاتك آمنة وتتم عبر القنوات الرسمية حصراً
        </p>
      </form>
    </div>
  );
}