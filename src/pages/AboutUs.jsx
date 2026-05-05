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
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-6 pb-4 border-b border-slate-200">
          عن المتجر
        </h1>

        <p className="text-slate-600 text-base leading-loose mb-4">
          هذا المتجر بوابتك الجديدة للتسوق إلكترونياً بشكل سهل وبسيط.
        </p>
        <p className="text-slate-600 text-base leading-loose mb-10">
          نوفر لك منتجات متعددة ذات جودة عالية لتختار منها الأفضل وبسعر تنافسي لن تجده في أي مكان آخر. التسوق معنا عملية ممتعة وآمنة. ونوفر لك كل ما تحتاجه من التسهيلات سواء في اختيار المنتج أو في عملية الدفع أو في عملية الشحن.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-10">
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