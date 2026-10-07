import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Leaf, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';

const suggestions = [
  'What is our current carbon footprint?',
  'How can we reduce water consumption?',
  'Explain the LCA methodology',
  'What does the AI recommend for energy?',
];

const responses: Record<string, string> = {
  carbon: 'Your current carbon footprint is 1,340 tCO₂e/month — down 26% from January. The largest contributor is Scope 1 emissions (58%), mainly from the processing plant and boiler. Expanding solar capacity and shifting boiler load to off-peak hours could cut another 8–10%.',
  water: 'Water consumption is at 8,600 L/day, down 31% year-over-year. Recycling now accounts for 28% of intake. Expanding the treatment loop to route processing plant discharge through the tank could raise recycling to 41% and save ~1,400 L/day.',
  energy: 'Energy use is 760 kWh, down 22% YoY. Solar contributes 23%. The AI recommends retrofitting crusher motors with variable frequency drives (12–15% savings) and shifting boiler operation to 23:00–05:00 to reduce grid carbon intensity by 18%.',
  lca: 'Life Cycle Assessment (LCA) evaluates the environmental impact of a product or process across its entire life cycle — from raw material extraction to disposal. GreenLoop tracks Scope 1 (direct), Scope 2 (electricity), and Scope 3 (supply chain) emissions, plus water and energy footprints, to give a complete sustainability picture.',
  report: 'Your most recent report is the August Monthly LCA Report (RPT-2026-084, 4.2 MB, Ready). You can download it from the Reports page. The Q3 Energy Efficiency Report is scheduled for September 30.',
  predict: 'AI predictions indicate crusher bearing failure in ~11 days based on vibration trends. The emission stack filter is overdue for replacement (installed 142 days ago, rated 120). Proactive maintenance on both is recommended to avoid unplanned downtime.',
  default: "I'm GreenAI, your sustainability assistant. I can help with carbon analysis, water management, energy optimization, LCA methodology, reports, and AI predictions. Try asking about any of these topics!",
};

function getResponse(input: string): string {
  const q = input.toLowerCase();
  if (q.includes('carbon') || q.includes('co2') || q.includes('emission')) return responses.carbon;
  if (q.includes('water') || q.includes('recycl')) return responses.water;
  if (q.includes('energy') || q.includes('power') || q.includes('solar')) return responses.energy;
  if (q.includes('lca') || q.includes('life cycle') || q.includes('methodology')) return responses.lca;
  if (q.includes('report') || q.includes('download')) return responses.report;
  if (q.includes('predict') || q.includes('maintenance') || q.includes('risk')) return responses.predict;
  return responses.default;
}

const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export function GreenAIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'assistant', content: "Hi! I'm GreenAI, your AI sustainability assistant. Ask me about carbon, water, energy, LCA, reports, or predictions.", time: now() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content, time: now() };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const aiMsg: ChatMessage = { id: `a-${Date.now()}`, role: 'assistant', content: getResponse(content), time: now() };
      setMessages((p) => [...p, aiMsg]);
      setTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute right-0 top-0 h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary-foreground" />
          </span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 flex h-[500px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b bg-gradient-to-r from-primary/10 to-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="flex items-center gap-1.5 text-sm font-bold">
                  GreenAI
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Online · AI Assistant
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto scrollbar-thin p-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div className={cn(
                    'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm',
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm',
                  )}>
                    <p className="leading-relaxed">{m.content}</p>
                    <p className={cn('mt-1 text-[10px]', m.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground')}>{m.time}</p>
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl bg-muted px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="h-2 w-2 rounded-full bg-muted-foreground/50"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 border-t p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask GreenAI…"
                className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <Button size="icon" className="h-10 w-10 shrink-0" onClick={() => send()} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
