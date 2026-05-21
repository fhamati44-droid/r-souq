import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Truck, Shield } from 'lucide-react';

const FEATURES = [
  { icon: ShoppingBag, label: 'منتجات متنوعة', desc: 'مجموعة واسعة من المنتجات ذات الجودة العالية' },
  { icon: Star, label: 'أسعار تنافسية', desc: 'أفضل الأسعار التي لن تجدها في أي مكان آخر' },
  { icon: Shield, label: 'تسوق آمن', desc: 'عملية شراء آمنة وموثوقة بالكامل' },
  { icon: Truck, label: 'شحن مريح', desc: 'تسهيلات كاملة في الشحن والتوصيل' },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl" style={{ background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 40%, #e8eaf6 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #9c27b0, #7b2d8b)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #673ab7, #512da8)' }} />
      <div className="max-w-4xl mx-auto px-6 py-16 relative z-10 bg-white rounded-2xl shadow-lg m-4 sm:m-0 sm:rounded-none sm:shadow-none">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2 pb-4 border-b-2 border-slate-200">
          من نحن
        </h1>
        
        <h2 className="text-2xl font-extrabold text-slate-800 mt-8 mb-4">مرحباً بكم في Rsouq</h2>
        
        <p className="text-slate-600 text-base leading-loose mb-4">
          Rsouq هي منصة تجارة إلكترونية حديثة متعددة التجار، تتيح للتجار فتح متاجرهم الخاصة داخل المنصة، وشراء البضائع والمخزون من خلال النظام، ثم بيع المنتجات للعملاء عبر نظام متكامل للشحن وإدارة الطلبات.
        </p>
        
        <p className="text-slate-600 text-base leading-loose mb-6">
          تجمع المنصة بين:
        </p>
        
        <ul className="list-disc list-inside text-slate-600 text-base mb-6 space-y-2">
          <li>متاجر إلكترونية للتجار</li>
          <li>إدارة المنتجات والمخزون</li>
          <li>أنظمة الطلبات والدفع</li>
          <li>الشحن والتوصيل</li>
          <li>إدارة عمليات البيع</li>
        </ul>

        <p className="text-slate-600 text-base leading-loose mb-8">
          <strong>هدفنا</strong> هو تسهيل التجارة الإلكترونية وتمكين التجار من التركيز على البيع بينما تتولى Rsouq البنية التحتية والتشغيل والخدمات اللوجستية.
        </p>

        <h2 className="text-2xl font-extrabold text-slate-800 mt-10 mb-4">كيف تعمل Rsouq؟</h2>

        <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">للتجار</h3>
        <ol className="list-decimal list-inside text-slate-600 text-base mb-6 space-y-2">
          <li>إنشاء حساب تاجر</li>
          <li>دفع رسوم فتح أو تفعيل المتجر</li>
          <li>شراء البضائع أو الرصيد الداخلي الخاص بالمخزون</li>
          <li>إضافة المنتجات إلى المتجر</li>
          <li>التسويق وبيع المنتجات للعملاء</li>
          <li>الحصول على الأرباح بناءً على المبيعات المكتملة</li>
        </ol>

        <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">للعملاء</h3>
        <ol className="list-decimal list-inside text-slate-600 text-base mb-8 space-y-2">
          <li>تصفح المنتجات داخل المنصة</li>
          <li>إضافة المنتجات إلى سلة المشتريات</li>
          <li>الدفع بشكل آمن عبر وسائل الدفع المتاحة</li>
          <li>استلام المنتجات عبر شركات الشحن المعتمدة</li>
        </ol>

        <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">من هو البائع؟</h3>
        <p className="text-slate-600 text-base leading-loose mb-4">
          قد تكون المنتجات:
        </p>
        <ul className="list-disc list-inside text-slate-600 text-base mb-8 space-y-2">
          <li>مُدارة مباشرة من قبل Rsouq</li>
          <li>أو مقدمة من تجار معتمدين</li>
          <li>أو ضمن نظام مخزون وشركاء توريد تابعين للمنصة</li>
        </ul>

        <p className="text-slate-600 text-base leading-loose mb-8">
          وتحتفظ Rsouq بحق مراجعة أو حذف أي منتج أو نشاط مخالف لسياسات المنصة.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-10 mt-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f3e5f5' }}>
                <f.icon className="w-5 h-5" style={{ color: '#7b2d8b' }} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">{f.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-200 text-sm text-slate-500">
          هل لديك سؤال؟{' '}
          <Link to="/contact" className="text-blue-600 hover:underline font-semibold">
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}