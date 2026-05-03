import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, Clock, XCircle, Upload, User, Phone, CreditCard, Globe, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function KYCGate({ children }) {
  const [kycStatus, setKycStatus] = useState(null); // null=loading, 'none'=not submitted, 'pending'|'approved'|'rejected'
  const [kyc, setKyc] = useState(null);

  useEffect(() => {
    const check = async () => {
      const user = await base44.auth.me();
      const records = await base44.entities.SellerKYC.filter({ owner_email: user.email });
      if (records.length === 0) {
        setKycStatus('none');
      } else {
        setKyc(records[0]);
        setKycStatus(records[0].status);
      }
    };
    check();
  }, []);

  if (kycStatus === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (kycStatus === 'approved') {
    return children;
  }

  if (kycStatus === 'pending') {
    return <KYCPendingScreen kyc={kyc} />;
  }

  if (kycStatus === 'rejected') {
    return <KYCRejectedScreen kyc={kyc} onResubmit={() => setKycStatus('none')} />;
  }

  // not submitted
  return <KYCForm onSubmitted={(record) => { setKyc(record); setKycStatus('pending'); }} />;
}

function KYCForm({ onSubmitted }) {
  const [form, setForm] = useState({ full_name: '', national_id: '', phone: '', country: 'SA' });
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const uploadFile = async (file) => {
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    return file_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.national_id || !form.phone) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (!idFront || !idBack || !selfie) {
      toast.error('يرجى رفع صور الهوية والأوراق الثبوتية');
      return;
    }
    setLoading(true);
    const user = await base44.auth.me();
    const [frontUrl, backUrl, selfieUrl] = await Promise.all([
      uploadFile(idFront),
      uploadFile(idBack),
      uploadFile(selfie),
    ]);
    const record = await base44.entities.SellerKYC.create({
      owner_email: user.email,
      full_name: form.full_name,
      national_id: form.national_id,
      phone: form.phone,
      country: form.country,
      id_front_url: frontUrl,
      id_back_url: backUrl,
      selfie_url: selfieUrl,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    });
    toast.success('تم إرسال طلب التحقق بنجاح!');
    onSubmitted(record);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-2xl font-extrabold mb-1">التحقق من الهوية (KYC)</h1>
          <p className="text-muted-foreground text-sm">لحماية المنصة، نحتاج التحقق من هويتك قبل الوصول للوحة البائع</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Info */}
          <div className="space-y-3">
            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">المعلومات الشخصية</h2>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pr-10 rounded-xl"
                placeholder="الاسم الكامل *"
                value={form.full_name}
                onChange={e => set('full_name', e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pr-10 rounded-xl"
                placeholder="رقم الهوية الوطنية / الإقامة *"
                value={form.national_id}
                onChange={e => set('national_id', e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pr-10 rounded-xl"
                placeholder="رقم الجوال *"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                className="w-full h-9 pr-10 pl-3 rounded-xl border border-input bg-transparent text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.country}
                onChange={e => set('country', e.target.value)}
              >
                <option value="SA">🇸🇦 المملكة العربية السعودية</option>
                <option value="AE">🇦🇪 الإمارات</option>
                <option value="KW">🇰🇼 الكويت</option>
                <option value="QA">🇶🇦 قطر</option>
                <option value="BH">🇧🇭 البحرين</option>
                <option value="OM">🇴🇲 عُمان</option>
                <option value="JO">🇯🇴 الأردن</option>
                <option value="EG">🇪🇬 مصر</option>
                <option value="OTHER">🌍 أخرى</option>
              </select>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-3">
            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">المستندات المطلوبة</h2>
            <FileUploadBox
              label="وجه الهوية (الأمام)"
              icon="🪪"
              file={idFront}
              onChange={setIdFront}
            />
            <FileUploadBox
              label="وجه الهوية (الخلف)"
              icon="🪪"
              file={idBack}
              onChange={setIdBack}
            />
            <FileUploadBox
              label="أوراق ثبوتية"
              icon="📄"
              file={selfie}
              onChange={setSelfie}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            ⏱️ سيتم مراجعة طلبك خلال 24-48 ساعة. بياناتك محمية ومشفرة.
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full font-bold text-base bg-violet-600 hover:bg-violet-700"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال طلب التحقق'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

function FileUploadBox({ label, icon, file, onChange }) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-violet-400 cursor-pointer transition group">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => onChange(e.target.files[0])}
      />
      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center text-xl shrink-0 transition">
        {file ? '✅' : icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground truncate">
          {file ? file.name : 'انقر لرفع الصورة'}
        </p>
      </div>
      <Upload className="w-4 h-4 text-muted-foreground shrink-0" />
    </label>
  );
}

function KYCPendingScreen({ kyc }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center"
      >
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-amber-500" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2">طلبك قيد المراجعة</h1>
        <p className="text-muted-foreground mb-6">
          تم استلام طلب التحقق الخاص بك وهو الآن قيد المراجعة من قِبل فريقنا. سيستغرق ذلك من 24 إلى 48 ساعة.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-right space-y-1">
          <p className="text-sm font-semibold text-amber-800">تفاصيل الطلب</p>
          <p className="text-xs text-amber-700">الاسم: {kyc?.full_name}</p>
          <p className="text-xs text-amber-700">رقم الهوية: {kyc?.national_id?.slice(0, -3) + '***'}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-5">سنرسل لك إشعاراً عند الموافقة. في حال وجود استفسار تواصل مع الدعم.</p>
      </motion.div>
    </div>
  );
}

function KYCRejectedScreen({ kyc, onResubmit }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2">تم رفض الطلب</h1>
        <p className="text-muted-foreground mb-4">للأسف تم رفض طلب التحقق الخاص بك.</p>
        {kyc?.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-right mb-6">
            <p className="text-sm font-semibold text-red-700 mb-1">سبب الرفض:</p>
            <p className="text-sm text-red-600">{kyc.rejection_reason}</p>
          </div>
        )}
        <Button onClick={onResubmit} className="w-full rounded-full bg-violet-600 font-bold">
          إعادة التقديم
        </Button>
      </motion.div>
    </div>
  );
}