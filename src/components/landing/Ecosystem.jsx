import { motion } from 'framer-motion';
import { Package, Store, Warehouse, Truck, Megaphone, ClipboardList, ShoppingCart, Headphones } from 'lucide-react';

const LOGO_URL = 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/e5966bc5d_WhatsAppImage2026-05-05at110058AM1.jpeg';

const TOP = [
  { icon: Package, label: 'المنتجات' },
  { icon: Store, label: 'الموردون' },
  { icon: Warehouse, label: 'التخزين' },
  { icon: Truck, label: 'الشحن' },
];

const BOTTOM = [
  { icon: Megaphone, label: 'التسويق' },
  { icon: ClipboardList, label: 'إدارة التشغيل' },
  { icon: ShoppingCart, label: 'الطلبات' },
  { icon: Headphones, label: 'الدعم' },
];

function EcosystemCard({ item, i, side }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06 }}
      className="rsouq-card-glass rounded-2xl p-5 text-center hover:-translate-y-1 transition-transform"
      style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.25)' }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
        style={{ background: 'linear-gradient(135deg, rgba(122,40,127,0.35), rgba(196,52,156,0.25))', border: '1px solid rgba(196,52,156,0.3)' }}
      >
        <item.icon className="w-6 h-6 text-white" />
      </div>
      <p className="font-bold text-sm text-white">{item.label}</p>
    </motion.div>
  );
}

export default function Ecosystem() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6" dir="rtl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TOP.map((item, i) => (
          <EcosystemCard key={item.label} item={item} i={i} side="top" />
        ))}
      </div>

      {/* central hub */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="my-6 mx-auto max-w-xl rounded-3xl px-6 py-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #7A287F, #C4349C)', boxShadow: '0 20px 60px rgba(122,40,127,0.45)' }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex items-center justify-center gap-3">
          <img src={LOGO_URL} alt="R SOUQ" className="h-11 w-11 rounded-xl object-cover border-2 border-white/40" />
          <div className="text-right">
            <p className="text-white font-extrabold text-lg leading-none">R SOUQ</p>
            <p className="text-white/80 text-xs mt-1">المنظومة المتكاملة حول متجرك</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {BOTTOM.map((item, i) => (
          <EcosystemCard key={item.label} item={item} i={i} side="bottom" />
        ))}
      </div>
    </div>
  );
}