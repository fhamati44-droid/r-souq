import { CheckCircle, Clock, Package, Truck, Home, XCircle } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const stepIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: Home,
};

export default function OrderStatusTracker({ status }) {
  const { t, dir } = useLang();

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
        <XCircle className="w-6 h-6 text-red-500 shrink-0" />
        <div>
          <p className="font-semibold text-red-700">{t.cancelled}</p>
        </div>
      </div>
    );
  }

  const currentIdx = statusSteps.indexOf(status);

  return (
    <div className="py-4">
      <div className={`flex items-start justify-between relative ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        {/* Progress line */}
        <div className={`absolute top-5 left-0 right-0 h-0.5 bg-muted ${dir === 'rtl' ? 'right-0' : 'left-0'}`}>
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentIdx / (statusSteps.length - 1)) * 100}%` }}
          />
        </div>

        {statusSteps.map((step, idx) => {
          const Icon = stepIcons[step];
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step} className={`flex flex-col items-center gap-2 z-10 ${dir === 'rtl' ? 'flex-col' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDone
                  ? isCurrent
                    ? 'bg-primary text-white ring-4 ring-primary/30 scale-110'
                    : 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium text-center max-w-16 leading-tight ${isDone ? 'text-primary' : 'text-muted-foreground'}`}>
                {t[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}