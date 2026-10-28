import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw, Loader2, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

const DEFAULT_GREETING: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  content: 'Ciao! I am your ZESTO AI concierge, running locally on Qwen 3.5. How can I help you explore our artisan restaurants, track orders, or manage your kitchen today?',
  timestamp: new Date()
};

const SUGGESTED_QUESTIONS = [
  'What pizzas are available at Forno al Fuoco?',
  'How do I track my active order?',
  'How do restaurant owners manage incoming orders?'
];

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_GREETING]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    // Format message history for Ollama API payload
    const ollamaMessages = newHistory
      .filter(m => !m.isError)
      .map(m => ({
        role: m.role,
        content: m.content
      }));

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'qwen3.5:4b',
          messages: [
            {
              role: 'system',
              content: 'You are ZESTO AI, an intelligent, charming, and helpful assistant for ZESTO - a high-end multi-tenant restaurant ordering platform. Help customers browse menus, explore artisan dishes like Neapolitan wood-fired pizzas, check orders, and help restaurateurs navigate their KDS kitchen dashboard.'
            },
            ...ollamaMessages
          ],
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const replyContent = data.message?.content || data.response || 'I could not generate a response. Please try again.';

      setMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: replyContent,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      // Prompt specification: display exact assistant chat bubble with:
      // "⚠️ Local Ollama is offline. Make sure 'ollama serve' is running on port 11434."
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "⚠️ Local Ollama is offline. Make sure 'ollama serve' is running on port 11434.",
          timestamp: new Date(),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([DEFAULT_GREETING]);
  };

  return (
    <>
      {/* Floating Chat Drawer Container */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="ZESTO AI Chat Window"
          className="fixed bottom-22 right-6 z-50 w-80 sm:w-96 h-[460px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {/* Header */}
          <div className="bg-[#202124] text-white px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E53935] flex items-center justify-center text-white shadow">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight text-white leading-tight">
                    ZESTO AI (Qwen 3.5)
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" title="Port 11434 Ready" />
                </div>
                <p className="text-[11px] text-gray-300 font-mono">
                  ollama / qwen3.5:4b
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                title="Reset conversation"
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Reset conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-white">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#E53935] text-white rounded-2xl rounded-tr-xs shadow-sm font-medium'
                        : msg.isError
                        ? 'bg-amber-50 border border-amber-200 text-[#202124] rounded-2xl rounded-tl-xs'
                        : 'bg-[#F5F5F5] border border-gray-200 text-[#202124] rounded-2xl rounded-tl-xs'
                    }`}
                  >
                    {msg.isError && (
                      <div className="flex items-start gap-1.5 mb-1 font-semibold text-[#E53935] text-xs">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>Connection Notice</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}

            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-[#F5F5F5] border border-gray-200 px-3.5 py-2.5 rounded-2xl rounded-tl-xs text-xs text-[#202124] flex items-center gap-2 shadow-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E53935]" />
                  <span className="font-medium animate-pulse">Thinking...</span>
                </div>
              </div>
            )}

            {/* Starter prompts if only greeting */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#E53935]" /> Suggested prompts
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTED_QUESTIONS.map((question, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(question)}
                      className="text-left text-xs bg-[#F5F5F5] hover:bg-gray-200 text-[#202124] px-3 py-2 rounded-xl transition-colors border border-gray-200 flex items-center justify-between group"
                    >
                      <span className="truncate">{question}</span>
                      <span className="text-[#E53935] text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0">Ask &rarr;</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about dishes, orders, or KDS..."
                disabled={isLoading}
                className="flex-1 bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#202124] placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#E53935] focus:border-transparent transition"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 sm:px-3 sm:py-2 bg-[#E53935] hover:bg-[#d32f2f] disabled:opacity-40 disabled:hover:bg-[#E53935] text-white rounded-xl transition flex items-center justify-center shadow-xs"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-400">
              <span>Local Ollama: localhost:11434</span>
              <span>Model: qwen3.5:4b</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#E53935] hover:bg-[#d32f2f] text-white px-4 py-3 rounded-full shadow-xl flex items-center gap-2 font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-[#E53935]/30"
        aria-label="Ask ZESTO AI"
      >
        <Bot className="w-5 h-5" />
        <span>Ask ZESTO AI</span>
        <span className="w-2 h-2 rounded-full bg-white opacity-80 animate-ping ml-0.5" />
      </button>
    </>
  );
};
