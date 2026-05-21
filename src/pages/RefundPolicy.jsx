import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  const sections = [
    {
      title: 'حالات الاسترجاع',
      content: `يمكن طلب استرجاع في الحالات التالية:
• وصول منتج خاطئ
• وصول منتج تالف
• اختلاف المنتج بشكل واضح عن الوصف
• عدم استلام الطلب`,
    },
    {
      title: 'مدة طلب الاسترجاع',
      content: `يجب تقديم طلب الاسترجاع خلال 7 أيام من تاريخ الاستلام.`,
    },
    {
      title: 'الحالات غير القابلة للاسترجاع',
      content: `لا يشمل الاسترجاع:
• المنتجات المستخدمة
• المنتجات المخصصة
• المنتجات الرقمية
• سوء استخدام المنتج من قبل العميل
• تكاليف الشحن

قد يتم خصم تكاليف الشحن من مبلغ الاسترجاع إلا إذا كان الخطأ من التاجر أو المنصة.`,
    },
    {
      title: 'النزاعات البنكية و Chargebacks',
      content: `يُنصح بالتواصل مع دعم Rsouq قبل فتح نزاع بنكي أو طلب Chargeback.
وقد يؤدي إساءة استخدام عمليات الـ Chargeback إلى إغلاق الحساب.`,
    },
    {
      title: 'عملية الاسترجاع',
      content: `1. تقديم طلب الاسترجاع عبر الموقع
2. الموافقة من فريق الدعم
3. إرسال المنتج إلى مركز الاسترجاع
4. تحقق من حالة المنتج
5. معالجة استرجاع المبلغ`,
    },
    {
      title: 'استرجاع المبلغ',
      content: `سيتم استرجاع المبلغ عادة خلال 7-14 يوم عمل بعد استلام المنتج المرجع والتحقق من حالته.
سيتم تحويل المبلغ إلى نفس طريقة الدفع الأصلية.`,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl" style={{ background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 40%, #e8eaf6 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #9c27b0, #7b2d8b)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #673ab7, #512da8)' }} />
      <div className="max-w-3xl mx-auto px-6 py-16 relative z-10 bg-white rounded-2xl shadow-lg m-4 sm:m-0 sm:rounded-none sm:shadow-none">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-10 pb-4 border-b-2 border-slate-200">سياسة الاسترجاع</h1>
        <div className="space-y-8">
          {sections.map((sec, i) => (
            <div key={i}>
              <h2 className="text-lg font-extrabold text-slate-800 mb-3">{sec.title}</h2>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{sec.content}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 text-sm text-slate-500">
          هل تريد استرجاع منتج؟{' '}
          <Link to="/contact" className="text-blue-600 hover:underline font-semibold">
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}