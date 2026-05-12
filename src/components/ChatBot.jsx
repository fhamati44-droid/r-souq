import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Initialize conversation when opened
  useEffect(() => {
    if (!open) return;
    if (conversation) return;
    setLoading(true);
    base44.agents.createConversation({
      agent_name: 'sales_agent',
      metadata: { name: 'محادثة جديدة' }
    }).then(conv => {
      setConversation(conv);
      setLoading(false);
    });
  }, [open]);

  // Subscribe to updates
  useEffect(() => {
    if (!conversation?.id) return;
    const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  }, [conversation?.id]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !conversation || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    await base44.agents.addMessage(conversation, { role: 'user', content: text });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const lastIsAssistant = messages.length > 0 && messages[messages.length - 1]?.role === 'assistant';
  const isTyping = sending || (!lastIsAssistant && messages.some(m => m.role === 'user'));

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
            style={{ background: 'linear-gradient(135deg, #7b2d8b, #9c27b0)' }}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-6 z-50 w-80 sm:w-96 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            style={{ height: '520px', background: '#fff' }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-3 text-white" style={{ background: 'linear-gradient(135deg, #7b2d8b, #9c27b0)' }}>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">مساعد R souq</p>
                <p className="text-xs text-white/70">متاح الآن 🟢</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-white/20 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {loading && (
                <div className="flex items-center gap-2 justify-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
                  <span className="text-sm text-slate-400">جاري التحميل...</span>
                </div>
              )}

              {messages.filter(m => m.role === 'user' || m.role === 'assistant').map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 ml-2 mt-1" style={{ background: '#ede7f6' }}>
                      <Bot className="w-4 h-4" style={{ color: '#7b2d8b' }} />
                    </div>
                  )}
                  <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-tr-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                  }`} style={msg.role === 'user' ? { background: '#7b2d8b' } : {}}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                        components={{
                          p: ({ children }) => <p className="my-0.5">{children}</p>,
                          a: ({ children, ...props }) => <a {...props} className="text-violet-600 underline" target="_blank">{children}</a>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {sending && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: '#ede7f6' }}>
                    <Bot className="w-4 h-4" style={{ color: '#7b2d8b' }} />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3 py-2 flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Seller CTA */}
            <div className="px-3 py-2 border-t border-slate-100" style={{ background: '#faf5ff' }}>
              <a href="/seller/register" className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl text-white w-full justify-center transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                🚀 ابدأ متجرك الآن وكسب أموالاً من البيع!
              </a>
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-slate-100 bg-white flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="اكتب رسالتك..."
                className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-violet-400 transition"
                disabled={!conversation || sending}
                dir="auto"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !conversation || sending}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition disabled:opacity-40"
                style={{ background: '#7b2d8b' }}
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}