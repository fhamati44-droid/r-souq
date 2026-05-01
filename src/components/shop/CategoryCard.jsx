import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/LanguageContext';

const categoryConfig = {
  clothing: { emoji: '👗', gradient: 'from-pink-400 to-rose-500', bg: 'from-pink-50 to-rose-100' },
  electronics: { emoji: '📱', gradient: 'from-blue-400 to-indigo-500', bg: 'from-blue-50 to-indigo-100' },
  home: { emoji: '🏠', gradient: 'from-amber-400 to-orange-500', bg: 'from-amber-50 to-orange-100' },
  sports: { emoji: '⚽', gradient: 'from-green-400 to-emerald-500', bg: 'from-green-50 to-emerald-100' },
  beauty: { emoji: '💄', gradient: 'from-purple-400 to-pink-500', bg: 'from-purple-50 to-pink-100' },
  books: { emoji: '📚', gradient: 'from-teal-400 to-cyan-500', bg: 'from-teal-50 to-cyan-100' },
  toys: { emoji: '🎮', gradient: 'from-yellow-400 to-amber-500', bg: 'from-yellow-50 to-amber-100' },
  food: { emoji: '🍕', gradient: 'from-red-400 to-orange-500', bg: 'from-red-50 to-orange-100' },
};

export default function CategoryCard({ category, count, index }) {
  const { t } = useLang();
  const config = categoryConfig[category] || categoryConfig.clothing;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={`/products?category=${category}`}
        className={`flex flex-col items-center gap-3 p-5 bg-gradient-to-br ${config.bg} rounded-2xl border border-white/80 shadow-sm hover:shadow-md transition-all group`}
      >
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
          {config.emoji}
        </div>
        <div className="text-center">
          <p className="font-bold text-sm text-foreground">{t[category] || category}</p>
          {count !== undefined && (
            <p className="text-xs text-muted-foreground mt-0.5">{count} {t.items}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}