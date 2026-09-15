import React from 'react';

const brand = {
  dark: '#15112A',
  purple: '#6D4CFF',
  violet: '#8B5CF6',
  gold: '#F4B740',
  soft: '#F7F4FF',
};

const packages = [
  { price: '50,000', name: 'START' },
  { price: '100,000', name: 'GROWTH' },
  { price: '160,000', name: 'SCALE' },
];

const built = [
  'RSouq Brand',
  'RSouq.com',
  'Marketplace Platform',
  'CRM & Automation',
  'Sales Funnel',
  'Supplier Model',
];

const budget = [
  ['40,000', 'Marketing & Customer Acquisition'],
  ['25,000', 'Sales & Saudi Operations'],
  ['15,000', 'Suppliers & Partnerships'],
  ['10,000', 'Technology & Automation'],
  ['10,000', 'Legal / Admin / Reserve'],
];

const milestones = [
  ['10%', '100,000 ر.س', 'استثمار نقدي عند الدخول'],
  ['12.5%', '+2.5%', 'بعد 12 شهراً من المشاركة الفعلية'],
  ['15%', '+2.5%', 'بعد 24 شهراً من المشاركة الفعلية'],
  ['20%', '+5%', '10 عملاء مدفوعين + 1,000,000 ر.س عقود محصلة'],
  ['25%', '+5%', '20 عميلاً + 2,000,000 ر.س + هامش إجمالي ≥30%'],
];

function Slide({ n, children, dark = false }) {
  return (
    <section
      className={`relative min-h-screen snap-start px-6 py-8 md:px-16 md:py-12 flex flex-col justify-center overflow-hidden ${dark ? 'text-white' : 'text-slate-950'}`}
      style={{ background: dark ? `radial-gradient(circle at 20% 10%, ${brand.purple}55, transparent 34%), linear-gradient(135deg, ${brand.dark}, #070611)` : `linear-gradient(135deg, #ffffff, ${brand.soft})` }}
    >
      <div className="absolute top-6 left-6 text-xs tracking-[0.35em] opacity-50">{String(n).padStart(2, '0')} / 11</div>
      <div className="absolute top-6 right-6 font-black text-2xl tracking-tight">RSouq</div>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

function Tag({ children }) {
  return <div className="inline-flex rounded-full border border-violet-200 bg-white/70 px-4 py-2 text-sm font-bold text-violet-700 shadow-sm">{children}</div>;
}

function BigNumber({ value, label, dark = false }) {
  return (
    <div className={`rounded-[2rem] p-6 shadow-xl ${dark ? 'bg-white/10 border border-white/15' : 'bg-white border border-violet-100'}`}>
      <div className="text-5xl md:text-7xl font-black tracking-tight" style={{ color: dark ? brand.gold : brand.purple }}>{value}</div>
      <div className={`mt-3 text-lg font-bold ${dark ? 'text-white/80' : 'text-slate-700'}`}>{label}</div>
    </div>
  );
}

export default function InvestorPitch() {
  return (
    <main dir="rtl" className="snap-y snap-mandatory overflow-y-auto h-screen bg-white font-sans selection:bg-violet-200">
      <button
        onClick={() => window.print()}
        className="fixed bottom-5 left-5 z-50 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl print:hidden"
      >
        تصدير PDF
      </button>

      <Slide n={1} dark>
        <div className="grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Tag>Saudi Founding Partner Opportunity</Tag>
            <h1 className="mt-8 text-5xl md:text-8xl font-black leading-[1.02]">RSouq السعودية</h1>
            <p className="mt-6 max-w-2xl text-2xl md:text-3xl font-bold text-white/85">شراكة تأسيسية لبناء منظومة تجارة إلكترونية قابلة للتوسع.</p>
          </div>
          <div className="rounded-[2.5rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="rounded-[2rem] bg-white p-5 text-slate-950">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xl font-black text-violet-700">RSouq</span>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">Live Platform</span>
              </div>
              <div className="grid gap-3">
                {['متاجر', 'منتجات', 'طلبات', 'موردون'].map((x) => <div key={x} className="rounded-2xl bg-violet-50 px-5 py-4 text-lg font-extrabold">{x}</div>)}
              </div>
            </div>
          </div>
        </div>
      </Slide>

      <Slide n={2}>
        <h2 className="text-5xl md:text-7xl font-black leading-tight">المتجر وحده لا يصنع تجارة.</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {['المنتج', 'المورد', 'التسويق', 'التشغيل'].map((x, i) => (
            <div key={x} className="rounded-[2rem] bg-white p-7 text-center shadow-xl border border-violet-100">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-xl font-black text-violet-700">{i + 1}</div>
              <div className="text-2xl font-black">{x}</div>
            </div>
          ))}
        </div>
        <p className="mt-12 max-w-4xl text-3xl font-bold text-slate-700">التحدي الحقيقي ليس فتح متجر… بل بناء منظومة تعرف كيف تبيع وتعمل وتستمر.</p>
      </Slide>

      <Slide n={3}>
        <h2 className="text-5xl md:text-7xl font-black">هنا يأتي دور RSouq.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {['نبني المتجر', 'نربط المنتجات والموردين', 'نبني التسويق والمبيعات', 'نساعد في التشغيل والنمو'].map((x, i) => (
            <div key={x} className="relative rounded-[2rem] border border-violet-100 bg-white p-7 shadow-xl">
              <div className="text-5xl font-black text-violet-200">0{i + 1}</div>
              <div className="mt-6 text-2xl font-black leading-snug">{x}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-[2rem] bg-slate-950 p-8 text-center text-3xl font-black text-white">من فكرة تجارة إلكترونية إلى منظومة تشغيل متكاملة.</div>
      </Slide>

      <Slide n={4}>
        <h2 className="text-5xl md:text-7xl font-black">نموذج واضح. قابل للتوسع.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {packages.map((p) => (
            <div key={p.name} className="rounded-[2rem] bg-white p-8 text-center shadow-xl border border-violet-100">
              <div className="text-6xl font-black text-violet-700">{p.price}</div>
              <div className="mt-2 text-2xl font-black">ر.س</div>
              <div className="mt-6 rounded-full bg-violet-50 px-5 py-3 text-lg font-black text-violet-700">{p.name}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] border border-amber-200 bg-amber-50 p-7 text-center text-3xl font-black text-amber-700">+ 3,500 ر.س تهيئة وتدريب إلزامي</div>
        <p className="mt-8 text-center text-xl font-bold text-slate-600">اختيار المنتجات • المتجر • الموردون • التسويق • التشغيل</p>
      </Slide>

      <Slide n={5}>
        <h2 className="text-5xl md:text-7xl font-black">لسنا في مرحلة “فكرة”.</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {built.map((x) => (
            <div key={x} className="rounded-[2rem] bg-white p-6 shadow-xl border border-violet-100">
              <div className="mb-4 text-3xl font-black text-violet-700">✓</div>
              <div className="text-2xl font-black">{x}</div>
            </div>
          ))}
        </div>
        <p className="mt-12 text-3xl font-black text-slate-800">الأساس موجود. المرحلة القادمة هي بناء السوق السعودي بقوة.</p>
      </Slide>

      <Slide n={6}>
        <h2 className="text-5xl md:text-7xl font-black">لا نبحث عن موظف. نبحث عن شريك.</h2>
        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-violet-100">
            <h3 className="text-3xl font-black text-violet-700">RSouq</h3>
            <p className="mt-5 text-2xl font-bold leading-loose text-slate-700">Brand<br/>Technology<br/>Marketing<br/>Automation<br/>Product<br/>Know-how</p>
          </div>
          <div className="flex items-center justify-center text-6xl font-black text-violet-300">+</div>
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
            <h3 className="text-3xl font-black text-amber-300">Saudi Partner</h3>
            <p className="mt-5 text-2xl font-bold leading-loose text-white/80">Business Development<br/>Local Partnerships<br/>Sales<br/>Supplier Network<br/>Saudi Operations</p>
          </div>
        </div>
        <div className="mt-8 text-center text-3xl font-black">RSouq + Saudi Execution = Scale</div>
      </Slide>

      <Slide n={7} dark>
        <h2 className="text-5xl md:text-7xl font-black">ندخل معاً كشركاء.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-[1fr_1fr]">
          <BigNumber value="100,000 ر.س" label="الاستثمار الأولي" dark />
          <BigNumber value="10%" label="حصة أولية عند إتمام الاستثمار والاتفاق" dark />
        </div>
        <div className="mt-10 rounded-[2rem] border border-white/15 bg-white/10 p-8 text-center shadow-2xl">
          <div className="text-4xl md:text-6xl font-black text-amber-300">حتى 25%</div>
          <p className="mt-4 text-2xl font-bold text-white/85">10% مقابل الاستثمار + حتى 15% مقابل الالتزام والإنجاز.</p>
          <p className="mt-5 text-sm font-bold text-white/55">الـ 100,000 ر.س تُضخ في الشركة لتمويل النمو ولا تُدفع للمؤسس بشكل شخصي.</p>
        </div>
        <p className="mt-6 text-center text-sm text-white/55">Post-Money: 1,000,000 ر.س • Pre-Money: 900,000 ر.س — هيكل تفاوضي مقترح.</p>
      </Slide>

      <Slide n={8}>
        <h2 className="text-5xl md:text-7xl font-black">25% لا تُمنح. تُبنى.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {milestones.map(([pct, gain, text]) => (
            <div key={pct} className="rounded-[2rem] bg-white p-6 shadow-xl border border-violet-100">
              <div className="text-5xl font-black text-violet-700">{pct}</div>
              <div className="mt-2 text-xl font-black text-amber-600">{gain}</div>
              <div className="mt-5 text-lg font-bold leading-snug text-slate-700">{text}</div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm font-bold text-slate-500">جميع مراحل الـ Equity الإضافية تخضع للاتفاق النهائي، دور الشريك الفعلي، وعدم وجود إخلال جوهري بالتزاماته.</p>
      </Slide>

      <Slide n={9}>
        <h2 className="text-5xl md:text-7xl font-black">المال لن يجلس في البنك. سيذهب للنمو.</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {budget.map(([amount, label]) => (
            <div key={label} className="rounded-[2rem] bg-white p-6 shadow-xl border border-violet-100">
              <div className="text-4xl font-black text-violet-700">{amount}</div>
              <div className="mt-1 text-lg font-black">ر.س</div>
              <div className="mt-5 text-lg font-bold text-slate-700">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-[2rem] bg-slate-950 p-8 text-center text-3xl font-black text-white">ميزانية تشغيل أولية مقترحة: 100,000 ر.س</div>
      </Slide>

      <Slide n={10}>
        <h2 className="text-5xl md:text-7xl font-black">أول محطة: إثبات النموذج.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          <BigNumber value="10" label="عملاء مدفوعون" />
          <BigNumber value="1M ر.س" label="قيمة عقود محصلة" />
          <BigNumber value="≥30%" label="هامش إجمالي مستهدف" />
          <BigNumber value="12 شهر" label="المرحلة الأولى" />
        </div>
        <p className="mt-12 text-center text-4xl font-black text-slate-800">نقيس. نتعلم. نثبت النموذج. ثم نتوسع.</p>
      </Slide>

      <Slide n={11} dark>
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-black">لسنا نبحث عن مستثمر فقط.</h2>
          <p className="mt-8 text-4xl md:text-6xl font-black text-amber-300">نبحث عن شخص يقول: هذه شركتنا.</p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <BigNumber value="100,000 ر.س" label="استثمار" dark />
            <BigNumber value="10%" label="عند الدخول" dark />
            <BigNumber value="حتى 25%" label="بالإنجاز" dark />
          </div>
          <p className="mt-10 text-3xl font-black">Term Sheet → اتفاق الشركاء → خطة 90 يوم → Launch</p>
          <p className="mt-8 text-xl font-bold text-white/60">RSouq Saudi Arabia — Build it. Operate it. Scale it. Together.</p>
        </div>
      </Slide>
    </main>
  );
}
