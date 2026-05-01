import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useLang } from '@/lib/LanguageContext';

export default function ShopLayout() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (query) navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={handleSearch} />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p className="font-bold text-foreground text-base mb-1">🛍️ ShopZone</p>
          <p>© 2026 ShopZone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}