import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: 'المعلومات التي نقوم بجمعها',
      content: `قد تجمع Rsouq:
• الاسم
• البريد الإلكتروني
• رقم الهاتف
• بيانات الفوترة
• عنوان الشحن
• معلومات الجهاز والمتصفح
• معلومات حسابات التجار
• معلومات الدفع

يتم معالجة المدفوعات بشكل آمن عبر مزودي خدمات الدفع مثل Stripe.
ولا تقوم Rsouq بتخزين بيانات البطاقات البنكية الكاملة على خوادمها.`,
    },
    {
      title: 'كيف نستخدم المعلومات؟',
      content: `نستخدم البيانات من أجل:
• معالجة الطلبات
• التحقق من حسابات التجار
• تحسين أداء المنصة
• منع الاحتيال
• التواصل مع المستخدمين`,
    },
    {
      title: 'حماية البيانات',
      content: `نطبق إجراءات أمنية مناسبة لحماية بيانات المستخدمين من الوصول غير المصرح به والتعديل والكشف.`,
    },
    {
      title: 'خدمات الأطراف الثالثة',
      content: `قد تستخدم Rsouq خدمات خارجية من أجل:
• معالجة الدفع
• الشحن
• التحليلات
• الدعم الفني`,
    },
    {
      title: 'حقوقك',
      content: `لديك الحق في:
• الوصول إلى بيانات حسابك
• طلب تصحيح البيانات غير الدقيقة
• طلب حذف حسابك وبياناتك الشخصية
• الاعتراض على معالجة بيانات معينة`,
    },
    {
      title: 'التغييرات على هذه السياسة',
      content: `قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سيتم إخطارك بأي تغييرات مادية من خلال البريد الإلكتروني أو إشعار بارز على الموقع.`,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl" style={{ background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 40%, #e8eaf6 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #9c27b0, #7b2d8b)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #673ab7, #512da8)' }} />
      <div className="max-w-3xl mx-auto px-6 py-16 relative z-10 bg-white rounded-2xl shadow-lg m-4 sm:m-0 sm:rounded-none sm:shadow-none">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-10 pb-4 border-b-2 border-slate-200">سياسة الخصوصية</h1>
        <div className="space-y-8">
          {sections.map((sec, i) => (
            <div key={i}>
              <h2 className="text-lg font-extrabold text-slate-800 mb-3">{sec.title}</h2>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{sec.content}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 text-sm text-slate-500">
          لديك أسئلة حول خصوصيتك؟{' '}
          <Link to="/contact" className="text-blue-600 hover:underline font-semibold">
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}