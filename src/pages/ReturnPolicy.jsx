import { Link } from 'react-router-dom';

const POINTS = [
  'الاستبدال والاسترجاع حق مضمون لكل عملائنا وهو يشمل جميع المنتجات التي نعرضها على متجرنا.',
  'جميع المنتجات المعروضة على متجرنا قابلة لسياسة الاستبدال والاسترجاع وفق الشروط والأحكام المنصوص عليها في هذه الصفحة.',
  'يمكن الإرجاع أو الاستبدال إذا كان المنتج بنفس حالته الأصلية عند الشراء ومغلفاً بالغلاف الأصلي.',
  'الاسترجاع خلال ثلاثة (3) أيام والاستبدال خلال سبعة (7) أيام من تاريخ الشراء.',
  'يرجى التواصل معنا عبر صفحة اتصل بنا أو عبر أرقامنا الهاتفية من أجل طلب الاسترجاع أو الاستبدال.',
  'يرجى تصوير المنتج وإرساله مع تحديد المدينة والعنوان ورقم الطلب ليتم استبداله بمنتج آخر في حالة كان المنتج فاسداً أو به عيب معين، أو لا يعمل وفق المتفق عليه.',
  'يتم استرجاع المبلغ للعميل كاملاً في حالة كان المنتج الذي توصّل به مختلفاً تماماً مع وصف المنتج في صفحة المنتج بموقعنا.',
  'لسنا مسؤولين عن أي توقعات لاستعمال المنتجات من طرف العميل لم نذكرها بصفحة المنتج بموقعنا.',
  'تُخصم 30% أو قيمة لا تقل عن 25 درهماً إذا كان العميل لا يريد المنتج وليس به عيب ولا أي مشكل يذكر.',
];

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl" style={{ background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 40%, #e8eaf6 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #9c27b0, #7b2d8b)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #673ab7, #512da8)' }} />
      <div className="max-w-3xl mx-auto px-6 py-16 relative z-10 bg-white rounded-2xl shadow-lg m-4 sm:m-0 sm:rounded-none sm:shadow-none">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-10 pb-4 border-b border-slate-200">
          سياسة الاستبدال والاسترجاع
        </h1>
        <ul className="space-y-4">
          {POINTS.map((point, i) => (
            <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
              <span className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ background: '#7b2d8b' }}>
                {i + 1}
              </span>
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-10 pt-6 border-t border-slate-200 text-sm text-slate-500">
          للاستفسار:{' '}
          <Link to="/contact" className="text-blue-600 hover:underline font-semibold">
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}