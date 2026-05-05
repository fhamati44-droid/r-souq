import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'شغلك أونلاين؟',
    subtitle: 'خلّيه يحقق لك دخل إضافي',
    image: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/f9c3929aa_WhatsAppImage2026-05-05at110058AM1.jpg',
  },
  {
    id: 2,
    title: 'شغلك الأونلاين؟',
    subtitle: 'خلّيه يشتغل لحاله',
    image: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/e5e45b606_WhatsAppImage2026-05-05at110058AM.jpg',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent(c => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7b2d8b 0%, #9c27b0 40%, #6a1b9a 100%)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full object-cover"
            style={{ maxHeight: '420px', objectPosition: 'center' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition backdrop-blur-sm"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition backdrop-blur-sm"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-6 h-3 bg-white' : 'w-3 h-3 bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
}