import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const PEOPLE = [
  {
    name: 'أحمد قشطة',
    role: 'ممثل تطوير الأعمال والشراكات — R SOUQ في المملكة العربية السعودية',
    location: 'السعودية',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    quote: 'هدفنا ليس مجرد تقديم متجر إلكتروني، بل بناء شراكة استثمارية حقيقية قائمة على الشفافية والنتائج الملموسة.',
  },
  {
    name: 'سارة العتيبي',
    role: 'مديرة العمليات اللوجستية — R SOUQ',
    location: 'السعودية',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
    quote: 'نهتم بأدق تفاصيل التشغيل والشحن لضمان وصول المنتجات لعملائك بكفاءة وفي الوقت المحدد.',
  },
  {
    name: 'خالد المنصور',
    role: 'مستشار استثماري — R SOUQ',
    location: 'السعودية',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    quote: 'النجاح في التجارة الإلكترونية يبدأ بقرار استثماري مدروس، ونحن هنا لرعاية هذا القرار حتى النتائج.',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const person = PEOPLE[active];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6" dir="rtl">
      <div className="grid md:grid-cols-5 gap-8 items-center">
        <motion.div
          key={`photo-${active}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-2 flex justify-center"
        >
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-100 shadow-xl">
              <img
                src={person.photo}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-xl shadow-lg px-3 py-2 border border-purple-100">
              <p className="text-xs font-bold" style={{ color: '#6a1b9a' }}>📍 {person.location}</p>
            </div>
          </div>
        </motion.div>
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`quote-${active}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
            >
              <Quote className="w-10 h-10 mb-4" style={{ color: '#d8b4fe' }} />
              <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed mb-5">
                «{person.quote}»
              </p>
              <div className="border-t border-slate-100 pt-4">
                <p className="font-extrabold text-slate-900">{person.name}</p>
                <p className="text-sm text-slate-500">{person.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* People selector */}
          <div className="flex items-center gap-3 mt-6">
            {PEOPLE.map((p, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition ${i === active ? 'border-violet-500 shadow-md scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'}`}
                aria-label={p.name}
              >
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}