import { useState } from 'react';
import { Copy, CheckCircle, Clock, Bitcoin, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const CRYPTOS = [
  {
    id: 'USDT_TRC20',
    name: 'USDT (TRC20)',
    symbol: 'USDT',
    network: 'Tron',
    icon: '💵',
    color: 'from-green-500 to-emerald-600',
    address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
    rate: 3.75, // 1 USDT = 3.75 SAR
  },
  {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin',
    icon: '₿',
    color: 'from-orange-500 to-amber-600',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    rate: 375000, // 1 BTC = 375,000 SAR
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'ERC20',
    icon: '⟠',
    color: 'from-blue-500 to-indigo-600',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    rate: 12000, // 1 ETH = 12,000 SAR
  },
  {
    id: 'USDT_BEP20',
    name: 'USDT (BEP20)',
    symbol: 'USDT',
    network: 'BNB Chain',
    icon: '🟡',
    color: 'from-yellow-500 to-amber-500',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    rate: 3.75,
  },
];

export default function CryptoPayment({ amountSAR, onConfirm, onCancel, loading }) {
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTOS[0]);
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [confirming, setConfirming] = useState(false);

  const cryptoAmount = (amountSAR / selectedCrypto.rate).toFixed(selectedCrypto.id === 'BTC' ? 6 : 2);

  const copyAddress = () => {
    navigator.clipboard.writeText(selectedCrypto.address);
    setCopied(true);
    toast.success('تم نسخ العنوان');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (!txHash.trim()) {
      toast.error('أدخل رقم معاملة التحويل (TX Hash)');
      return;
    }
    onConfirm({ crypto: selectedCrypto, cryptoAmount, txHash });
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Amount Summary */}
      <div className="bg-violet-50 rounded-2xl p-4 border border-violet-200 text-center">
        <p className="text-sm text-muted-foreground mb-1">المبلغ المطلوب</p>
        <p className="text-3xl font-extrabold text-violet-700">{amountSAR} ر.س</p>
        <p className="text-sm text-muted-foreground mt-1">≈ {cryptoAmount} {selectedCrypto.symbol}</p>
      </div>

      {/* Select Crypto */}
      <div>
        <p className="text-sm font-bold mb-3">اختر طريقة الدفع</p>
        <div className="grid grid-cols-2 gap-2">
          {CRYPTOS.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCrypto(c)}
              className={`p-3 rounded-xl border-2 text-right transition-all ${selectedCrypto.id === c.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-white hover:border-violet-300'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className="font-bold text-xs">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.network}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Details */}
      <AnimatePresence mode="wait">
        <motion.div key={selectedCrypto.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {/* QR / Address */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-muted-foreground">عنوان المحفظة ({selectedCrypto.network})</p>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> نشط
              </span>
            </div>
            <p className="font-mono text-xs text-slate-700 break-all bg-white rounded-xl p-3 border border-slate-200 mb-2">
              {selectedCrypto.address}
            </p>
            <button onClick={copyAddress} className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'}`}>
              {copied ? <><CheckCircle className="w-4 h-4" /> تم النسخ</> : <><Copy className="w-4 h-4" /> نسخ العنوان</>}
            </button>
          </div>

          {/* Amount to send */}
          <div className={`bg-gradient-to-r ${selectedCrypto.color} rounded-xl p-4 text-white`}>
            <p className="text-xs opacity-80 mb-1">المبلغ الذي يجب إرساله</p>
            <p className="text-2xl font-extrabold">{cryptoAmount} {selectedCrypto.symbol}</p>
            <p className="text-xs opacity-70 mt-1">على شبكة {selectedCrypto.network}</p>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
            <span className="text-amber-500 text-lg shrink-0">⚠️</span>
            <p className="text-xs text-amber-800">
              تأكد من إرسال العملة الصحيحة على الشبكة الصحيحة ({selectedCrypto.network}) فقط.
              أي إرسال خاطئ قد يؤدي لفقدان الأموال.
            </p>
          </div>

          {/* TX Hash */}
          <div>
            <label className="text-sm font-bold block mb-1.5">رقم التحويل (TX Hash) *</label>
            <input
              value={txHash}
              onChange={e => setTxHash(e.target.value)}
              placeholder="أدخل رقم معاملة التحويل بعد الإرسال..."
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> سيتم تفعيل حسابك خلال 5-30 دقيقة بعد التأكيد
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onCancel}>إلغاء</Button>
        )}
        <Button
          className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? 'جاري التحقق...' : 'تأكيد الدفع ✓'}
        </Button>
      </div>
    </div>
  );
}