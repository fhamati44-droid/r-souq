import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Truck } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* Contact Section */}
      <div className="max-w-3xl mx-auto px-6 py-20 text-right">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-8">اتصل بنا</h1>
        <div className="space-y-4 text-slate-600">
          <p>
            للتواصل معنا عبر البريد الإلكتروني:{' '}
            <a href="mailto:support@rsouq.com" className="text-blue-600 hover:underline">support@rsouq.com</a>
          </p>
          <p>
            للتواصل معنا عبر الواتس:{' '}
            <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">اضغط هنا</a>
          </p>
          <p className="text-blue-600">سنكون سعداء بالتواصل معكم والإجابة عن أسئلتكم.</p>
        </div>
      </div>

      {/* Divider + Logo */}
      <div className="border-t border-slate-200 py-10 flex items-center justify-center gap-3 text-slate-700">
        <Truck className="w-8 h-8" />
        <span className="text-xl font-extrabold">R souq</span>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 py-10 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-8 text-right text-sm">
          {/* اتصل بنا */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4">اتصل بنا</h3>
            <ul className="space-y-2">
              <li><a href="mailto:support@rsouq.com" className="text-blue-600 hover:underline">اتصل بنا</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">الأسئلة المتكررة</a></li>
            </ul>
          </div>
          {/* الشروط والسياسات */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4">الشروط والسياسات</h3>
            <ul className="space-y-2">
              <li><a href="/terms" className="text-blue-600 hover:underline">شروط الاستخدام</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">سياسة الاستبدال والاسترجاع</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">سياسة الخصوصية</a></li>
            </ul>
          </div>
          {/* عن المتجر */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4">عن المتجر</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">عن المتجر</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">طرق الدفع</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">الشحن والتسليم</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}