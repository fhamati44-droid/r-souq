import { Search, ShoppingCart, Home, LayoutGrid, Heart, User } from 'lucide-react';

const PRODUCTS = [
  { img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', name: 'سماعات لاسلكية', price: '189 ر.س' },
  { img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', name: 'ساعة ذكية', price: '245 ر.س' },
  { img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', name: 'حذاء رياضي', price: '320 ر.س' },
  { img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', name: 'حقيبة جلد', price: '175 ر.س' },
];

const NAV_ICONS = [Home, LayoutGrid, ShoppingCart, Heart, User];

export default function PhoneMockup() {
  return (
    <div className="relative mx-auto" dir="rtl">
      {/* ambient glow */}
      <div className="absolute -inset-8 rounded-[4rem] blur-3xl opacity-50 pointer-events-none rsouq-glow-magenta" />
      <div className="relative animate-float">
        {/* phone frame */}
        <div
          className="relative w-[290px] sm:w-[330px] mx-auto rounded-[2.8rem] p-3 shadow-2xl"
          style={{ background: 'linear-gradient(160deg, #2a1030, #160B19)', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          {/* notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl z-20" style={{ background: '#160B19' }} />
          {/* screen */}
          <div className="relative rounded-[2.2rem] overflow-hidden h-[580px] sm:h-[620px]" style={{ background: '#F8F5F8' }}>
            {/* status bar */}
            <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[10px] font-bold text-slate-800">
              <span>9:41</span>
              <span>●●●</span>
            </div>
            {/* app header */}
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm font-extrabold" style={{ color: '#7A287F' }}>R SOUQ</span>
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <Search className="w-3.5 h-3.5" style={{ color: '#7A287F' }} />
                </div>
                <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <ShoppingCart className="w-3.5 h-3.5" style={{ color: '#7A287F' }} />
                </div>
              </div>
            </div>
            {/* search bar */}
            <div className="px-4 pb-2">
              <div className="h-8 rounded-full bg-white shadow-sm flex items-center px-3 text-[10px] text-slate-400 gap-1.5">
                <Search className="w-3 h-3" /> ابحث عن منتج...
              </div>
            </div>
            {/* promo banner */}
            <div
              className="mx-4 mb-3 rounded-2xl p-3 text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #7A287F, #C4349C)' }}
            >
              <p className="text-[11px] font-extrabold leading-tight">تسوّق أونلاين<br />بأسعار منافسة</p>
              <p className="text-[8px] text-white/80 mt-1">شحن سريع داخل المملكة</p>
              <div className="absolute -left-2 -bottom-3 w-16 h-16 rounded-full bg-white/15" />
            </div>
            {/* category chips */}
            <div className="px-4 flex gap-1.5 mb-3 overflow-hidden">
              {['إلكترونيات', 'أزياء', 'منزل', 'رياضة'].map((c) => (
                <span key={c} className="text-[9px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(122,40,127,0.1)', color: '#7A287F' }}>
                  {c}
                </span>
              ))}
            </div>
            {/* product grid */}
            <div className="px-4 grid grid-cols-2 gap-2">
              {PRODUCTS.map((p) => (
                <div key={p.name} className="rounded-xl bg-white shadow-sm overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-1.5">
                    <p className="text-[9px] font-bold text-slate-800 truncate">{p.name}</p>
                    <p className="text-[10px] font-extrabold" style={{ color: '#C4349C' }}>{p.price}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* bottom nav */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-white border-t border-slate-100 flex items-center justify-around px-2">
              {NAV_ICONS.map((Icon, i) => (
                <Icon key={i} className="w-4 h-4" style={i === 0 ? { color: '#7A287F' } : { color: '#cbd5e1' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}