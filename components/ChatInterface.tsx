import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2, Copy, Check, Sparkles } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";

interface Suggestion {
  title: string;
  content: string;
  reasoning: string;
}

interface Message {
  role: 'user' | 'model';
  text?: string;
  suggestions?: Suggestion[];
}

interface ChatInterfaceProps {
  currentPrompt: string;
  isVisible?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentPrompt, isVisible }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure layout is updated before scrolling
      setTimeout(scrollToBottom, 50);
    }
  }, [isVisible]);

  const initializeChat = () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSession.current = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A short, catchy title for this variation (e.g., 'Cinematic & Moody')" },
              content: { type: Type.STRING, description: "The full, refined prompt text ready for generation" },
              reasoning: { type: Type.STRING, description: "Brief explanation of why this improves the prompt" }
            },
            required: ['title', 'content', 'reasoning']
          }
        },
        systemInstruction: "You are an expert prompt engineer using PromptArchitect. Your goal is to provide 3 distinct, high-quality variations of the user's prompt based on their request. Analyze the user's input and the current prompt context. Provide options that range from subtle refinements to creative reimaginings. Ensure the output is a valid JSON array."
      }
    });
  };

  useEffect(() => {
    if (!chatSession.current) {
      initializeChat();
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!chatSession.current) initializeChat();
    if (!chatSession.current) return;

    const userMsg = input;
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    try {
      const messageToSend = `[Current Prompt Context]:\n"""${currentPrompt}"""\n\n[User Request]:\n${userMsg}`;
      
      const resultStream = await chatSession.current.sendMessageStream({ message: messageToSend });
      
      // Placeholder for the model's turn while streaming
      setMessages(prev => [...prev, { role: 'model', text: "" }]);

      let fullText = "";
      for await (const chunk of resultStream) {
        const text = (chunk as GenerateContentResponse).text || "";
        fullText += text;
      }

      try {
        const suggestions = JSON.parse(fullText) as Suggestion[];
        setMessages(prev => {
          const newHistory = [...prev];
          const lastMsg = newHistory[newHistory.length - 1];
          lastMsg.suggestions = suggestions;
          lastMsg.text = undefined; // Clear raw text since we have structured data
          return newHistory;
        });
      } catch (e) {
        console.error("JSON Parse error:", e);
        // Fallback to raw text if JSON parsing fails
        setMessages(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].text = fullText;
          return newHistory;
        });
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const newHistory = [...prev];
        // Remove the placeholder if it failed completely, or update it
        if (newHistory[newHistory.length - 1].role === 'model') {
           newHistory[newHistory.length - 1].text = "Unable to generate options. Please try again.";
        }
        return newHistory;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    initializeChat();
  };

  return (
    <div className="flex flex-col h-full bg-dark-900/50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-12 px-4 animate-fadeIn">
            <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-500/20">
              <Sparkles className="text-brand-400" size={32} />
            </div>
            <h3 className="text-slate-200 font-semibold text-base mb-2">AI Prompt Assistant</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
              Ask me to refine your prompt, add detail, or change the style. I'll provide you with ready-to-use options.
            </p>
          </div>
        )}
        
        {messages.map((msg, msgIdx) => (
          <div key={msgIdx} className={`animate-fadeIn`}>
            {/* User Message */}
            {msg.role === 'user' && (
              <div className="flex gap-3 flex-row-reverse mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-900/20">
                  <User size={14} className="text-white" />
                </div>
                <div className="bg-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed shadow-md max-w-[85%]">
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            )}

            {/* Model Message (Options) */}
            {msg.role === 'model' && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center border border-dark-600 mt-1">
                  <Bot size={14} className="text-brand-300" />
                </div>
                
                <div className="flex-1 space-y-3 w-full min-w-0">
                  {msg.suggestions ? (
                    msg.suggestions.map((option, optIdx) => {
                      const uniqueId = `${msgIdx}-${optIdx}`;
                      return (
                        <div 
                          key={optIdx} 
                          className="bg-dark-800 border border-dark-700 rounded-xl p-4 hover:border-brand-500/30 hover:bg-dark-800/80 transition-all group shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-2 gap-4">
                            <h4 className="text-brand-300 font-medium text-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                              {option.title}
                            </h4>
                            <button 
                              onClick={() => handleCopy(option.content, uniqueId)}
                              className={`p-1.5 rounded-md transition-all ${
                                copiedIndex === uniqueId 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-dark-700 text-slate-400 hover:text-white hover:bg-brand-600'
                              }`}
                              title="Copy prompt"
                            >
                              {copiedIndex === uniqueId ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                          
                          <div className="bg-dark-900/50 rounded-lg p-3 mb-2 border border-dark-800/50">
                            <p className="text-slate-300 text-xs font-mono leading-relaxed whitespace-pre-wrap">
                              {option.content}
                            </p>
                          </div>
                          
                          <p className="text-slate-500 text-xs italic pl-1 border-l-2 border-dark-700">
                            {option.reasoning}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    // Fallback or loading text
                    msg.text && (
                      <div className="bg-dark-800 text-slate-300 rounded-2xl rounded-tl-sm px-4 py-3 text-sm border border-dark-700">
                        {msg.text}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center border border-dark-600">
              <Loader2 size={14} className="text-brand-300 animate-spin" />
            </div>
            <div className="space-y-3 w-full max-w-[85%]">
               <div className="h-24 bg-dark-800 rounded-xl border border-dark-700"></div>
               <div className="h-24 bg-dark-800 rounded-xl border border-dark-700 opacity-60"></div>
               <div className="h-24 bg-dark-800 rounded-xl border border-dark-700 opacity-30"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-dark-700 bg-dark-800 z-10">
        <div className="relative flex items-end gap-2">
          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-900/10 rounded-xl transition-colors mb-0.5"
              title="Clear chat history"
            >
              <Trash2 size={18} />
            </button>
          )}
          <div className="relative flex-1 group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for more detail, a darker mood, or a different style..."
              className="w-full bg-dark-900 border border-dark-600 text-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 block pl-4 pr-12 py-3 resize-none scrollbar-hide transition-all"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 bottom-2 p-2 bg-brand-600 hover:bg-brand-500 disabled:bg-dark-700 disabled:text-slate-500 text-white rounded-lg transition-all duration-200 shadow-lg shadow-brand-900/20"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};