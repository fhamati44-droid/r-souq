import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'تسوق بكل سهولة',
    subtitle: 'آلاف المنتجات بأسعار منافسة',
    items: [
      {
        src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop',
        alt: 'تسوق',
        className: 'bottom-0 right-[5%] w-40 sm:w-56',
        delay: 0.1,
        float: true,
      },
      {
        src: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=280&h=340&fit=crop',
        alt: 'شاشة',
        className: 'bottom-0 right-[25%] w-44 sm:w-64',
        delay: 0.2,
        float: false,
      },
      {
        src: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=220&h=260&fit=crop',
        alt: 'حقيبة',
        className: 'bottom-0 left-[5%] w-32 sm:w-48',
        delay: 0.3,
        float: true,
      },
    ],
    clouds: [
      { className: 'top-[10%] left-[15%] w-20 sm:w-28 opacity-60', delay: 0 },
      { className: 'top-[5%] left-[45%] w-28 sm:w-36 opacity-80', delay: 0.5 },
      { className: 'top-[8%] right-[10%] w-24 sm:w-32 opacity-50', delay: 1 },
    ],
  },
  {
    id: 2,
    title: 'توصيل سريع لبابك',
    subtitle: 'اطلب الآن واستلم في أسرع وقت',
    items: [
      {
        src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=280&h=280&fit=crop',
        alt: 'شحن',
        className: 'bottom-0 right-[5%] w-44 sm:w-60',
        delay: 0.1,
        float: false,
      },
      {
        src: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=200&h=260&fit=crop',
        alt: 'منتجات',
        className: 'bottom-0 right-[35%] w-32 sm:w-44',
        delay: 0.2,
        float: true,
      },
      {
        src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=220&h=280&fit=crop',
        alt: 'رياضة',
        className: 'bottom-0 left-[5%] w-36 sm:w-52',
        delay: 0.3,
        float: true,
      },
    ],
    clouds: [
      { className: 'top-[12%] left-[10%] w-24 sm:w-32 opacity-50', delay: 0.3 },
      { className: 'top-[6%] left-[50%] w-20 sm:w-28 opacity-70', delay: 0.8 },
      { className: 'top-[10%] right-[15%] w-28 sm:w-36 opacity-60', delay: 0 },
    ],
  },
];

const CloudSVG = ({ className, delay }) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay, duration: 1 }}
  >
    <motion.div
      animate={{ x: [0, 8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <svg viewBox="0 0 100 60" className="w-full drop-shadow-sm">
        <ellipse cx="50" cy="45" rx="45" ry="20" fill="white" opacity="0.85" />
        <ellipse cx="35" cy="38" rx="25" ry="18" fill="white" opacity="0.9" />
        <ellipse cx="60" cy="35" rx="20" ry="16" fill="white" opacity="0.85" />
      </svg>
    </motion.div>
  </motion.div>
);

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
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7b2d8b 0%, #9c27b0 40%, #6a1b9a 100%)', minHeight: '420px' }}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />

      {/* Clouds */}
      <AnimatePresence mode="wait">
        <motion.div key={`clouds-${current}`} className="absolute inset-0">
          {slide.clouds.map((cloud, i) => (
            <CloudSVG key={i} className={cloud.className} delay={cloud.delay} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 h-full" style={{ minHeight: '420px' }}>
        {/* Text */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6 sm:right-10 text-right z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-3">{slide.title}</h2>
              <p className="text-white/80 text-base sm:text-xl font-medium">{slide.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`items-${current}`}
            className="absolute inset-0"
          >
            {slide.items.map((item, i) => (
              <motion.div
                key={i}
                className={`absolute ${item.className}`}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ delay: item.delay, duration: 0.6, ease: 'easeOut' }}
              >
                {item.float ? (
                  <motion.img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

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