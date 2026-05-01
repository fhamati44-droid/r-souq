import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import { SlidersHorizontal, LayoutGrid, List, Search, X } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const categories = ['clothing', 'electronics', 'home', 'sports', 'beauty', 'books', 'toys', 'food'];

const categoryEmojis = { clothing: '👗', electronics: '📱', home: '🏠', sports: '⚽', beauty: '💄', books: '📚', toys: '🎮', food: '🍕' };

export default function Products() {
  const { t, dir } = useLang();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setSelectedCat(cat);
  }, []);

  useEffect(() => {
    base44.entities.Product.list('-created_date', 200).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...products];
    // Category filter
    if (selectedCat !== 'all') result = result.filter(p => p.category === selectedCat);
    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => {
        const names = Object.values(p.name || {}).join(' ').toLowerCase();
        return names.includes(q) || (p.brand || '').toLowerCase().includes(q);
      });
    }
    // Sort
    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    setFiltered(result);
  }, [products, selectedCat, search, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-[105px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                placeholder={t.search}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`w-full h-9 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${dir === 'rtl' ? 'pr-9 pl-9' : 'pl-9 pr-9'}`}
              />
              {search && (
                <button onClick={() => setSearch('')} className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 h-9 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t.sort_newest}</SelectItem>
                <SelectItem value="price_asc">{t.sort_price_asc}</SelectItem>
                <SelectItem value="price_desc">{t.sort_price_desc}</SelectItem>
                <SelectItem value="rating">{t.sort_rating}</SelectItem>
              </SelectContent>
            </Select>

            {/* View toggle */}
            <div className="flex items-center bg-muted rounded-full p-0.5">
              <button onClick={() => setView('grid')} className={`p-1.5 rounded-full transition ${view === 'grid' ? 'bg-white shadow' : ''}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-1.5 rounded-full transition ${view === 'list' ? 'bg-white shadow' : ''}`}>
                <List className="w-4 h-4" />
              </button>
            </div>

            <span className="text-sm text-muted-foreground ml-auto">
              {filtered.length} {t.items}
            </span>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCat('all')}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCat === 'all' ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
            >
              {t.all}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${selectedCat === cat ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
              >
                <span>{categoryEmojis[cat]}</span> {t[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1'}`}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-2xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-lg font-bold">{dir === 'rtl' ? 'لا توجد نتائج' : 'No results found'}</h3>
            <p className="text-muted-foreground mt-2">{dir === 'rtl' ? 'جرب كلمات بحث مختلفة' : 'Try different search terms'}</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} />)}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}