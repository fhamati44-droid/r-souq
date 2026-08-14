import { motion } from 'framer-motion';
import { ShieldCheck, Warehouse, Boxes, Headset } from 'lucide-react';

const IMAGES = [
  {
    src: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/b63720855_0fa13420-c0d8-4aee-85e2-18e57c29eedf.png',
    title: 'مكاتب الاستقبال',
    desc: 'بيئة عمل احترافية تعكس هويتنا',
    Icon: Headset,
  },
  {
    src: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/1cedc16ee_WhatsAppImage2026-06-18at1022092.jpg',
    title: 'مستودعات التخزين والتجهيز',
    desc: 'مساحات تخزين مؤمّنة ومجهزة بالكامل',
    Icon: Warehouse,
  },
  {
    src: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/0f2eada5a_WhatsAppImage2026-06-18at1022091.jpg',
    title: 'منظومة التنظيم واللوجستيات',
    desc: 'تنظيم دقيق يضمن جاهزية كل طلب',
    Icon: Boxes,
  },
  {
    src: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/a42fb4fee_WhatsAppImage2026-06-18at102209.jpg',
    title: 'الدعم والجودة',
    desc: 'فريق متابع لسلامة وجودة كل شحنة',
    Icon: ShieldCheck,
  },
];

export default function FacilityGallery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" dir="rtl">
      {IMAGES.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
          style={{ border: '1px solid #e9ddec' }}
        >
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={img.src}
              alt={img.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(22,11,25,0.85), rgba(22,11,25,0.05) 60%, transparent)' }} />
          <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
              style={{ background: 'linear-gradient(135deg, #C4349C, #7A287F)' }}
            >
              <img.Icon className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-extrabold text-sm">{img.title}</h4>
            <p className="text-white/80 text-xs mt-0.5">{img.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}