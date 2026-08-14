import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const PEOPLE = [
  {
    name: 'أحمد قشطة',
    role: 'ممثل تطوير الأعمال والشراكات — Rsouq في المملكة العربية السعودية',
    location: 'السعودية',
    photo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/9060414e4_WhatsAppImage2026-08-07at1221272.jpg',
    quote: 'هدفنا ليس مجرد تقديم متجر إلكتروني، بل بناء شراكة استثمارية حقيقية قائمة على الشفافية والنتائج الملموسة.',
  },
  {
    name: 'ناديا سليمان',
    role: 'مديرة موارد بشرية وعلاقات عامة — Rsouq',
    location: 'السعودية',
    photo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/fbff28971_WhatsAppImage2026-08-07at1221271.jpeg',
    quote: 'نهتم بأدق التفاصيل ونؤمن أن الخدمة المميزة هي أساس بناء الثقة مع شركائنا، لأن نجاح شراكتنا يبدأ من اهتمامنا بك وبعملائك.',
  },
  {
    name: 'فادي حماتي',
    role: 'شريك ومؤسس — Rsouq',
    location: 'السعودية',
    photo: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/2160f2c3e_WhatsAppImage2026-08-07at122127.jpeg',
    quote: 'التجارة قبل كل شيء علاقة بين الناس، وعشان كذا إحنا معكم قلبًا وقالبًا، نهتم بنجاحكم، ونساندكم في كل خطوة، ونبني معكم شراكة أساسها الثقة والاستمرارية.',
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
            <div className="absolute -inset-3 rounded-full blur-2xl opacity-30 rsouq-glow-magenta" />
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 shadow-xl" style={{ borderColor: '#C4349C' }}>
              <img
                src={person.photo}
                alt={person.name}
                className="w-full h-full object-cover"
              />
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
              <Quote className="w-10 h-10 mb-4" style={{ color: '#C4349C' }} />
              <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed mb-5">
                «{person.quote}»
              </p>
              <div className="border-t pt-4" style={{ borderColor: '#e9ddec' }}>
                <p className="font-extrabold text-slate-900">{person.name}</p>
                <p className="text-sm text-slate-500">{person.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3 mt-6">
            {PEOPLE.map((p, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition ${i === active ? 'shadow-md scale-105' : 'opacity-60 hover:opacity-100'}`}
                style={{ borderColor: i === active ? '#C4349C' : '#e2d5e6' }}
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