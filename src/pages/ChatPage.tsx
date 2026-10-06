import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Lightbulb,
  Shield,
  BookOpen,
  Compass,
  ArrowRight,
  ExternalLink,
  Radio
} from 'lucide-react';

export const ChatPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string>(() => {
    return `equora-vf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'equora',
      text: `Hi! How you doing??\n\nWe can chat about gender roles in classroom activities, representation in books and lessons, or ideas for student-led equality projects.`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [agentSource, setAgentSource] = useState<'voiceflow' | 'gemini'>('voiceflow');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const suggestedPrompts = [
    'Gender roles in classroom activities',
    'Representation in school books',
    'Ideas for student-led equality projects',
    'Can you explain gender bias simply?',
    'How do I talk to my teacher about curriculum bias?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Clean up audio speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Fetch initial welcome message from Voiceflow on mount
  useEffect(() => {
    const initVoiceflow = async () => {
      try {
        const res = await fetch('/api/chat/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.reply) {
            setMessages([
              {
                id: 'welcome-init',
                sender: 'equora',
                text: data.reply,
                timestamp: 'Just now',
              },
            ]);
            if (data.source === 'voiceflow') {
              setAgentSource('voiceflow');
            }
          }
        }
      } catch (err) {
        console.warn('Voiceflow init notice:', err);
      }
    };

    initVoiceflow();
  }, [sessionId]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          sessionId,
          history: messages.slice(-6),
        }),
      });

      if (!res.ok) throw new Error('Network error during chat inquiry.');

      const data = await res.json();
      if (data.source === 'voiceflow') {
        setAgentSource('voiceflow');
      }

      const botMsg: ChatMessage = {
        id: `equora-${Date.now()}`,
        sender: 'equora',
        text: data.reply || "I'm here to help explore gender representation in textbooks. Could you provide a bit more detail?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (_err) {
      // Intelligent fallback
      const lower = textToSend.toLowerCase();
      let fallbackText = `Recognizing bias is an ongoing skill. When you encounter a passage or activity, ask: "Would this role or decision feel different if the student's gender were switched?" That simple question helps reveal unspoken assumptions.`;

      if (lower.includes('stereotype') || lower.includes('gender role')) {
        fallbackText = `A **gender stereotype** is an oversimplified generalization about how girls or boys should act or what roles they can take.\n\nIn classrooms, rotating leadership, technical responsibilities, and creative tasks ensures all students have equal access to learning opportunities.`;
      } else if (lower.includes('project') || lower.includes('ideas')) {
        fallbackText = `Here are great ideas for student-led equality projects:\n\n1. **Textbook Audit:** Review a chapter together and tally male vs. female representation in examples.\n2. **Inclusive Classroom Jobs:** Create a weekly job rotation chart so everyone shares technical and organizing tasks equally.\n3. **Spotlight Hallway Display:** Feature underrepresented scientists, mathematicians, and writers from diverse backgrounds.`;
      }

      const botFallback: ChatMessage = {
        id: `equora-${Date.now()}`,
        sender: 'equora',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botFallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleToggleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanSpeech = text
      .replace(/[*_#`]/g, '')
      .replace(/•/g, '')
      .replace(/\n+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const resetChat = async () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);

    const newId = `equora-vf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setSessionId(newId);

    try {
      const res = await fetch('/api/chat/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: newId }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages([
          {
            id: `welcome-${Date.now()}`,
            sender: 'equora',
            text: data.reply || `Hi! How you doing??\n\nWe can chat about gender roles in classroom activities, representation in books and lessons, or ideas for student-led equality projects.`,
            timestamp: 'Just now',
          },
        ]);
        return;
      }
    } catch (_e) {
      // Ignore
    }

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'equora',
        text: `Hi! How you doing??\n\nWe can chat about gender roles in classroom activities, representation in books and lessons, or ideas for student-led equality projects.`,
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 pb-24">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-semibold">
              Interactive Dialogue Space
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Voiceflow Chatbot Integrated
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0D192E] tracking-tight">
            EQUORA Learning Guide
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            Chat directly with your Voiceflow educational assistant exploring classroom gender roles, book representation, and student equality projects.
          </p>
        </div>

        <button
          type="button"
          onClick={resetChat}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-black px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white/70 hover:bg-slate-50 backdrop-blur-md shadow-2xs transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New session</span>
        </button>
      </div>

      {/* Suggested Inquiries / Prompt Kickstarters */}
      <div className="space-y-2">
        <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Suggested Topics (Click to ask your Voiceflow agent directly)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FFF5F0] text-slate-700 hover:text-[#0D192E] border border-slate-200 hover:border-peach-300 transition-all shadow-2xs text-left flex items-center gap-1.5"
            >
              <span>{p}</span>
              <ArrowRight className="w-3 h-3 text-slate-400 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Primary Chat Conversation Stage */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[580px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FAF7F2]/40">
          {messages.map((msg) => {
            const isEquora = msg.sender === 'equora';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isEquora ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar Badge */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-semibold shadow-2xs ${
                    isEquora
                      ? 'bg-gradient-to-br from-[#FFD8CC] to-[#FECDD3] text-[#0D192E]'
                      : 'bg-[#0D192E] text-white'
                  }`}
                >
                  {isEquora ? <Bot className="w-4 h-4 text-[#F97059]" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble & Actions */}
                <div className="space-y-1.5 max-w-[85%] sm:max-w-[90%]">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isEquora
                        ? 'bg-white text-slate-800 border border-slate-200/80 shadow-xs'
                        : 'bg-[#0D192E] text-white shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div className="flex items-center gap-3 px-1 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>

                    {isEquora && (
                      <div className="flex items-center gap-2">
                        {/* Audio Narrator Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(msg.text, msg.id)}
                          className={`transition-colors flex items-center gap-1 ${
                            speakingId === msg.id ? 'text-[#2563EB] font-semibold' : 'hover:text-slate-600'
                          }`}
                          title="Listen to audio reading"
                        >
                          {speakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3 h-3 text-[#2563EB] animate-pulse" />
                              <span>Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>Read Aloud</span>
                            </>
                          )}
                        </button>

                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="hover:text-slate-600 transition-colors flex items-center gap-1"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-600 font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <span className="inline-flex items-center gap-1 text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          Voiceflow AI
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-md mr-auto animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-[#FFD8CC] text-[#0D192E] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#F97059] animate-spin" />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 font-medium text-slate-600">Voiceflow agent is responding...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <div className="relative flex items-end gap-2 bg-[#FAF7F2] rounded-2xl p-2 border border-slate-200/80 focus-within:border-[#2563EB] focus-within:bg-white transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about gender roles, textbook representation, or equality projects..."
              rows={2}
              className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 p-2 resize-none"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-3 text-white bg-[#0D192E] hover:bg-[#1E293B] disabled:opacity-40 rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center"
              title="Send Message (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="px-2 pt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Press Enter to send, Shift + Enter for new line</span>
            <span className="flex items-center gap-1 text-slate-500">
              <Shield className="w-3 h-3 text-emerald-500" /> Connected to Voiceflow Dialog Agent
            </span>
          </div>
        </div>
      </div>

      {/* Educational Guidance Footer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
        <div className="p-4 rounded-2xl backdrop-blur-md bg-white/70 border border-white/80 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0D192E]">
            <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Nuanced Curriculum</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Explores historical context and multiple perspectives rather than binary accusations.
          </p>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-md bg-white/70 border border-white/80 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0D192E]">
            <Compass className="w-3.5 h-3.5 text-[#F97059]" />
            <span>Classroom Actionable</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Get practical rephrasings and discussion prompts you can share with your classmates and teachers.
          </p>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-md bg-white/70 border border-white/80 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0D192E]">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Student Privacy First</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Safe, strictly educational, and never retains personal student identification.
          </p>
        </div>
      </div>
    </div>
  );
};
