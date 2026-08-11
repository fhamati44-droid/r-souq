import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import CategoryCard from '@/components/shop/CategoryCard';

const categories = ['clothing', 'electronics', 'home', 'sports', 'beauty', 'books', 'toys', 'food'];

export default function Categories() {
  const { t } = useLang();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    // Count both real sellers' products AND the CJ Dropshipping cache per
    // category, so counts (and the /products?category=x pages they link to)
    // reflect what a shopper will actually see — not just real listings,
    // which are empty until real sellers start adding products.
    Promise.all([
      base44.entities.Product.list(),
      base44.entities.CJProductCache.list(),
    ]).then(([realProducts, cache]) => {
      const c = {};
      realProducts.forEach(p => { if (p.category) c[p.category] = (c[p.category] || 0) + 1; });
      cache.forEach(p => { if (p.category) c[p.category] = (c[p.category] || 0) + 1; });
      setCounts(c);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-extrabold mb-8">{t.categories_title}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <CategoryCard key={cat} category={cat} count={counts[cat] || 0} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
