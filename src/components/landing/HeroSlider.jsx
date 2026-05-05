import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/f9c3929aa_WhatsAppImage2026-05-05at110058AM1.jpg',
  },
  {
    id: 2,
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

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={slides[current].image}
          alt="hero"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full object-contain"
        />
      </AnimatePresence>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/30 hover:bg-white/60 flex items-center justify-center text-white backdrop-blur-sm transition">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/30 hover:bg-white/60 flex items-center justify-center text-white backdrop-blur-sm transition">
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}