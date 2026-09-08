import { Link, useLocation } from 'react-router-dom';

const PURPLE = '#7A287F';
const GRAD = 'linear-gradient(135deg, #7A287F, #C4349C)';
const LOGO_URL = 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/e5966bc5d_WhatsAppImage2026-05-05at110058AM1.jpeg';

export default function AcademyNav() {
  const loc = useLocation();
  const links = [
    { to: '/academy', label: 'الأكاديمية' },
    { to: '/academy/instructor', label: 'المستشار' },
    { to: '/academy/dashboard', label: 'لوحتي' },
  ];
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={LOGO_URL} alt="R SOUQ" className="h-10 w-10 rounded-xl object-contain" />
          <div className="leading-none">
            <p className="text-lg font-extrabold text-slate-800">R SOUQ</p>
            <p className="text-[10px] text-slate-400">الأكاديمية</p>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={loc.pathname === l.to ? 'text-slate-900' : 'hover:text-slate-900 transition'}>
              {l.label}
            </Link>
          ))}
          <Link to="/shop" className="hover:text-slate-900 transition">تسوّق</Link>
        </div>
        <Link to="/start-your-store" className="rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5" style={{ background: GRAD }}>
          افتح متجرك
        </Link>
      </div>
    </nav>
  );
}