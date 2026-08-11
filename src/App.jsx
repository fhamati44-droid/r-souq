import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { LanguageProvider } from '@/lib/LanguageContext';
import { CartProvider } from '@/lib/CartContext';
import { Toaster as SonnerToaster } from 'sonner';

// Landing
import Landing from './pages/Landing';
import ContactUs from './pages/ContactUs';
import TermsOfUse from './pages/TermsOfUse';
import ReturnPolicy from './pages/ReturnPolicy';
import AboutUs from './pages/AboutUs';
import Blog from './pages/Blog';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';

// Seller pages
import SellerRegister from './pages/seller/Register';
import SellerDashboard from './pages/seller/Dashboard';

// Shop pages (shopper)
import ShopHome from './pages/shop/ShopHome';
import StoresList from './pages/shop/StoresList';
import StoreDetail from './pages/shop/StoreDetail';
import ShopProductDetail from './pages/shop/ProductDetail';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<ShopHome />} />
      <Route path="/landing" element={<Landing />} />

      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminDashboard />} />

      {/* Seller routes */}
      <Route path="/seller/register" element={<SellerRegister />} />
      <Route path="/seller/dashboard" element={<SellerDashboard />} />

      {/* Shopper routes */}
      <Route path="/shop" element={<ShopHome />} />
      <Route path="/shop/stores" element={<StoresList />} />
      <Route path="/shop/store/:id" element={<StoreDetail />} />
      <Route path="/shop/product/:id" element={<ShopProductDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />

      <Route path="/contact" element={<ContactUs />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/return-policy" element={<ReturnPolicy />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<Blog />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LanguageProvider>
          <CartProvider>
            <Router>
              <AuthenticatedApp />
            </Router>
            <Toaster />
            <SonnerToaster position="top-center" richColors />
          </CartProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;