import { Link } from 'react-router-dom';

export default function TermsOfUse() {
  const sections = [
    {
      title: '1. قبول الشروط',
      content: `باستخدام منصة Rsouq، فإنك توافق على الالتزام بهذه الشروط والأحكام وجميع القوانين المعمول بها.`,
    },
    {
      title: '2. خدمات المنصة',
      content: `توفر Rsouq:
• إنشاء المتاجر
• إدارة المنتجات
• أنظمة شراء المخزون
• معالجة الطلبات
• خدمات الدفع
• الشحن والتوصيل`,
    },
    {
      title: '3. مسؤوليات التاجر',
      content: `يلتزم التاجر بما يلي:
• تقديم معلومات صحيحة ودقيقة
• بيع منتجات قانونية فقط
• عدم بيع منتجات مقلدة أو ممنوعة
• احترام حقوق الملكية الفكرية
• التعامل المهني مع العملاء`,
    },
    {
      title: '4. المنتجات الممنوعة',
      content: `يُمنع بيع:
• المنتجات المقلدة
• الأسلحة
• المواد غير القانونية
• المنتجات الإباحية
• منتجات المقامرة
• المنتجات المخالفة لحقوق النشر
• أي منتجات مخالفة للقوانين

ويحق لـ Rsouq تعليق أو إغلاق أي حساب مخالف.`,
    },
    {
      title: '5. الرسوم والدفعات',
      content: `قد يتم فرض:
• رسوم فتح متجر
• رسوم اشتراك
• عمولات على المبيعات
• رسوم خدمات إضافية

جميع الرسوم غير قابلة للاسترداد إلا إذا تم توضيح غير ذلك.`,
    },
    {
      title: '6. حقوق المنصة',
      content: `يحق لـ Rsouq:
• تعليق الحسابات
• إزالة المنتجات
• مراجعة العمليات المالية
• طلب التحقق من الهوية
• رفض أي نشاط مشبوه`,
    },
    {
      title: '7. حدود المسؤولية',
      content: `لا تتحمل Rsouq مسؤولية:
• الأضرار غير المباشرة
• خسائر التاجر
• تأخير الشحن الناتج عن أطراف خارجية
• سوء استخدام المنتجات من قبل العملاء`,
    },
    {
      title: '8. حل النزاعات',
      content: `يجب محاولة حل النزاعات بين العميل والتاجر عبر فريق الدعم أولًا.
وتحتفظ Rsouq بحق التدخل عند الحاجة.`,
    },
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-10 pb-4 border-b-2 border-slate-200">الشروط والأحكام</h1>
        <div className="space-y-8">
          {sections.map((sec, i) => (
            <div key={i}>
              <h2 className="text-lg font-extrabold text-slate-800 mb-3">{sec.title}</h2>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{sec.content}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 text-sm text-slate-500">
          لديك أسئلة؟{' '}
          <Link to="/contact" className="text-blue-600 hover:underline font-semibold">
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}