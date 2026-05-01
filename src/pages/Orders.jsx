import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import { format } from 'date-fns';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import OrderStatusTracker from '@/components/shop/OrderStatusTracker';
import { motion, AnimatePresence } from 'framer-motion';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const { t } = useLang();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      base44.entities.Order.filter({ customer_email: user.email }, '-created_date').then(data => {
        setOrders(data);
        setLoading(false);
      });
    }).catch(() => {
      base44.entities.Order.list('-created_date', 50).then(data => {
        setOrders(data);
        setLoading(false);
      });
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
        <Package className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold">{t.orders_title}</h2>
      <p className="text-muted-foreground">{t.cart_empty_desc}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold mb-8">{t.orders_title}</h1>
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden">
              {/* Order header */}
              <button
                className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition text-start"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">#{order.order_number}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.created_date && format(new Date(order.created_date), 'dd/MM/yyyy')}
                    </p>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                      {t[order.status]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-extrabold text-primary">{t.currency} {order.total_amount?.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{order.items?.length || 0} {t.items}</p>
                  </div>
                  {expanded === order.id ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                </div>
              </button>

              {/* Expanded details */}
              <AnimatePresence>
                {expanded === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="p-5 space-y-5">
                      {/* Tracker */}
                      <OrderStatusTracker status={order.status} />

                      {/* Tracking info */}
                      {order.tracking_number && (
                        <div className="bg-muted/50 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs mb-1">{t.tracking_number}</p>
                            <p className="font-bold font-mono">{order.tracking_number}</p>
                          </div>
                          {order.estimated_delivery && (
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">{t.estimated_delivery}</p>
                              <p className="font-bold">{format(new Date(order.estimated_delivery), 'dd/MM/yyyy')}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <img src={item.product_image || ''} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" onError={e => e.target.style.display = 'none'} />
                            <div className="flex-1">
                              <p className="font-medium line-clamp-1">{item.product_name}</p>
                              <p className="text-muted-foreground">×{item.quantity} × {t.currency} {item.price?.toFixed(2)}</p>
                            </div>
                            <p className="font-bold">{t.currency} {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Shipping */}
                      {order.shipping_address && (
                        <div className="text-sm text-muted-foreground">
                          📍 {order.shipping_address}{order.shipping_city ? `, ${order.shipping_city}` : ''}{order.shipping_country ? `, ${order.shipping_country}` : ''}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}