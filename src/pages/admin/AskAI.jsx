import { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SITE_CONTEXT = `
أنت مساعد ذكي متخصص في منصة "R souq" — منصة تجارة إلكترونية عربية.

## ما هي منصة R souq؟
منصة متكاملة للتجارة الإلكترونية تتيح للبائعين فتح متاجر إلكترونية وبيع المنتجات بنظام Dropshipping.

## كيف تعمل المنصة؟
1. **البائع (Seller)**: يسجّل ويفتح متجره — يختار خطة اشتراك (Basic 375 ر.س / Pro 699 ر.س / Premium 1499 ر.س)
2. **مخزن المنتجات**: البائع يتصفح منتجات المنصة، يشوف سعر التكلفة، ويحدد سعر بيعه الخاص — والفرق ربحه
3. **المشتري (Shopper)**: يتصفح المتاجر والمنتجات، يضيف للسلة، ويكمل الشراء
4. **الشحن**: المنصة تتولى الشحن مباشرة بعد كل طلب

## الكيانات (قاعدة البيانات):
- **Store**: بيانات المتجر (اسم، وصف، لوغو، باقة، حالة: pending_payment/active/suspended)
- **Product**: المنتجات داخل المتاجر (اسم، سعر، سعر تكلفة، صور، مخزون)
- **WarehouseProduct**: منتجات المستودع التي يختار منها البائعون
- **Order**: الطلبات (العميل، المنتجات، المبلغ، الحالة: pending/confirmed/processing/shipped/delivered/cancelled)
- **SellerKYC**: التحقق من هوية البائع (هوية، سيلفي — حالة: pending/approved/rejected)
- **SellerWallet**: محفظة البائع (رصيد، إجمالي الإيداع والصرف)
- **WalletTransaction**: سجل المعاملات المالية (إيداع، اشتراك، إضافة منتج، حملة)
- **StoreSubscription**: اشتراكات المتاجر
- **Campaign**: الحملات الإعلانية للمتاجر
- **CartItem**: عناصر السلة للمشترين
- **Review**: تقييمات المنتجات

## صفحات المنصة:
- **/** — الصفحة الرئيسية للتسوق (ShopHome)
- **/landing** — صفحة تسويقية للبائعين
- **/seller/register** — تسجيل بائع جديد (3 خطوات: اختيار الباقة، بيانات المتجر، الدفع بالكريبتو)
- **/seller/dashboard** — لوحة تحكم البائع (إدارة منتجاته، طلباته، محفظته، المخزن)
- **/admin/** — لوحة الأدمن (متاجر، بائعون، KYC، مدفوعات، طلبات، مخزن، استيراد)
- **/shop** — تصفح المتاجر والمنتجات
- **/cart** — سلة التسوق
- **/checkout** — إتمام الشراء

## نظام الدفع:
- البائعون يدفعون بالعملات الرقمية (USDT/BTC/ETH)
- الأدمن يراجع TX Hash يدوياً ويوافق أو يرفض

## ميزات خاصة:
- Sales Agent (chatbot) على الموقع يساعد الزوار
- استيراد منتجات من مصادر خارجية عبر API في لوحة الأدمن
- نظام KYC للتحقق من هوية البائعين
- حملات إعلانية للمتاجر
- دعم 3 لغات: عربي، إنجليزي، ألماني

أجب دائماً بالعربية بأسلوب واضح ومختصر. إذا سُئلت عن شيء لا تعرفه عن الموقع، قل ذلك بصراحة.
`;

export default function AskAI() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'مرحباً! أنا مساعدك الذكي وعارف كل تفاصيل موقع R souq. اسألني عن أي شيء — البنية التقنية، كيف يعمل النظام، الكيانات، الصفحات... أو أي استفسار تاني!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Build conversation history for context
    const history = newMessages.slice(-10).map(m =>
      `${m.role === 'user' ? 'المستخدم' : 'المساعد'}: ${m.content}`
    ).join('\n\n');

    const prompt = `${SITE_CONTEXT}

## المحادثة:
${history}

المساعد:`;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude_sonnet_4_6',
    });

    setMessages(prev => [...prev, { role: 'assistant', content: res }]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-800">اسأل AI عن الموقع</h2>
            <p className="text-xs text-muted-foreground">يعرف كل تفاصيل R souq — بنية، كيانات، صفحات</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([{ role: 'assistant', content: 'تمت إعادة المحادثة! كيف أقدر أساعدك؟' }])}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-red-500 transition"
          title="مسح المحادثة"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested questions */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            'كيف يعمل نظام الـ Dropshipping؟',
            'شو هي الكيانات اللي في قاعدة البيانات؟',
            'كيف يسجّل البائع ويفتح متجره؟',
            'شو الصفحات الموجودة في الموقع؟',
            'كيف يعمل نظام الدفع؟',
          ].map(q => (
            <button key={q} onClick={() => { setInput(q); }}
              className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-full hover:bg-violet-100 transition">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-gradient-to-br from-violet-500 to-indigo-600'}`}>
              {msg.role === 'user'
                ? <User className="w-4 h-4 text-slate-600" />
                : <Bot className="w-4 h-4 text-white" />
              }
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-sm' : 'bg-white border border-slate-100 shadow-sm rounded-tl-sm'}`}>
              {msg.role === 'assistant'
                ? <ReactMarkdown className="prose prose-sm max-w-none prose-slate [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{msg.content}</ReactMarkdown>
                : msg.content
              }
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
              <span className="text-sm">يفكّر...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اسأل عن أي شيء في الموقع..."
          rows={1}
          className="flex-1 resize-none px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 max-h-32"
          style={{ minHeight: '48px' }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="p-3 rounded-2xl bg-violet-600 text-white hover:bg-violet-700 transition disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}