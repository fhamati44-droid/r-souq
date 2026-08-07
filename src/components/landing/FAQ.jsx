import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'هل أحتاج إلى خبرة سابقة في التجارة الإلكترونية؟',
    a: 'لا، R SOUQ تتولى إدارة كافة التفاصيل التشغيلية والتسويقية نيابةً عنك. فريقنا المتخصص يهتم بالتوريد، التخزين، الشحن، والتسويق، لتتفرغ أنت لمتابعة الأرباح واتخاذ القرارات الاستثمارية.',
  },
  {
    q: 'كيف يتم توقيع العقود والمدفوعات؟',
    a: 'تتم العقود والمدفوعات رسمياً عبر القنوات المعتمدة لـ R SOUQ وشركة TOYLII LLC، مما يضمن الشفافية الكاملة والأمان القانوني لجميع الأطراف.',
  },
  {
    q: 'ما هي الخطوة التالية بعد تسجيل البيانات؟',
    a: 'بعد استلام بياناتك، يتواصل معك فريق تطوير الأعمال خلال 24 ساعة لترتيب اجتماع عمل رسمي، يُعرض فيه نموذج الشراكة بالتفصيل ويتم الإجابة على جميع استفساراتك.',
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right transition hover:bg-slate-50"
      >
        <span className="font-bold text-slate-800 text-sm">{item.q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: '#7b2d8b' }} />
      </button>
      {isOpen && (
        <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="space-y-3 max-w-3xl mx-auto" dir="rtl">
      {FAQ_ITEMS.map((item, i) => (
        <FAQItem
          key={i}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </div>
  );
}