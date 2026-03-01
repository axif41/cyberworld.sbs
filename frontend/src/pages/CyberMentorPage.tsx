import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import { Send, Trash2, Bot, User, Paperclip, Mic, MicOff, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getCyberMentorResponse, getRandomGreeting, type ChatMessage } from '../hooks/useCyberMentorKnowledge';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

// Simple markdown renderer
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let keyCounter = 0;
  const nextKey = () => `md-${keyCounter++}`;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={nextKey()} className="my-2 rounded-lg overflow-hidden border border-cyber-border">
          {lang && (
            <div className="bg-cyber-code-header px-3 py-1 text-xs text-cyber-muted font-mono">
              {lang}
            </div>
          )}
          <pre className="bg-cyber-code p-3 overflow-x-auto text-sm font-mono text-cyber-code-text">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={nextKey()} className="text-lg font-bold text-cyber-primary mt-3 mb-1">
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={nextKey()} className="text-base font-semibold text-cyber-accent mt-2 mb-1">
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // Table
    if (line.includes('|') && lines[i + 1]?.includes('---')) {
      const headers = line.split('|').filter(c => c.trim()).map(c => c.trim());
      i += 2; // skip header and separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(lines[i].split('|').filter(c => c.trim()).map(c => c.trim()));
        i++;
      }
      elements.push(
        <div key={nextKey()} className="my-2 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-cyber-table-header">
                {headers.map((h, idx) => (
                  <th key={idx} className="border border-cyber-border px-3 py-1 text-left font-semibold text-cyber-primary">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ridx) => (
                <tr key={ridx} className={ridx % 2 === 0 ? 'bg-cyber-table-row' : 'bg-cyber-table-row-alt'}>
                  {row.map((cell, cidx) => (
                    <td key={cidx} className="border border-cyber-border px-3 py-1 text-cyber-text">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={nextKey()} className="border-l-4 border-cyber-primary pl-3 my-2 text-cyber-muted italic text-sm">
          {renderInline(line.slice(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Bullet list
    if (line.match(/^[-*•] /)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*•] /)) {
        listItems.push(lines[i].replace(/^[-*•] /, ''));
        i++;
      }
      elements.push(
        <ul key={nextKey()} className="list-disc list-inside my-1 space-y-0.5 text-sm text-cyber-text">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      elements.push(
        <ol key={nextKey()} className="list-decimal list-inside my-1 space-y-0.5 text-sm text-cyber-text">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={nextKey()} className="text-sm text-cyber-text my-0.5 leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function renderInline(text: string): React.ReactNode {
  // Bold
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-cyber-primary">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-cyber-code px-1 py-0.5 rounded text-xs font-mono text-cyber-accent">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

const SUGGESTED_QUESTIONS = [
  "What is ethical hacking?",
  "How does SQL injection work?",
  "Explain cryptography basics",
  "What is the OWASP Top 10?",
  "How do I start learning cybersecurity?",
  "What certifications should I get?",
  "Explain XSS attacks",
  "How does phishing work?",
  "What is a CTF competition?",
  "How do I learn Python for hacking?",
];

export default function CyberMentorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    isListening,
    transcript,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Initialize with greeting
  useEffect(() => {
    const greeting = getRandomGreeting();
    setMessages([
      {
        id: 'greeting',
        role: 'assistant',
        content: greeting,
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Sync speech transcript to input
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (text: string, imageUrl?: string) => {
    const trimmed = text.trim();
    if (!trimmed && !imageUrl) return;

    // Stop listening if active
    if (isListening) {
      stopListening();
      resetTranscript();
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      imageUrl: imageUrl || undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachedImage(null);
    setIsTyping(true);

    // Simulate typing delay for natural feel
    const delay = 600 + Math.random() * 800;

    setTimeout(() => {
      let responseText: string;

      if (imageUrl && !trimmed) {
        responseText = `I can see you've shared an image! 🖼️ I'm not able to analyze images directly, but feel free to **describe what you see** and I'll help you with your question.\n\nFor example, you could describe:\n- A screenshot of an error message\n- A network diagram\n- Code you want me to explain\n- A security alert or warning\n\nWhat would you like to know? 😊`;
      } else if (imageUrl && trimmed) {
        // Has both image and text — answer the text question, acknowledge image
        const textResponse = getCyberMentorResponse(trimmed);
        responseText = `*(I noticed you shared an image — I can't analyze it directly, but here's my answer to your question!)*\n\n${textResponse}`;
      } else {
        responseText = getCyberMentorResponse(trimmed);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, delay);
  }, [isListening, stopListening, resetTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue, attachedImage || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue, attachedImage || undefined);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleClearChat = () => {
    const greeting = getRandomGreeting();
    setMessages([
      {
        id: `greeting-${Date.now()}`,
        role: 'assistant',
        content: greeting,
        timestamp: new Date(),
      },
    ]);
    setInputValue('');
    setAttachedImage(null);
  };

  const handleImageAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachedImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be selected again
    e.target.value = '';
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setInputValue('');
      startListening();
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-cyber-bg">
        {/* Header */}
        <div className="bg-white border-b border-cyber-border shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-cyber-muted hover:text-cyber-primary transition-colors text-sm flex items-center gap-1">
                Home <ChevronRight className="w-3 h-3" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="/assets/generated/cybermentor-avatar.dim_256x256.png"
                    alt="CyberMentor"
                    className="w-10 h-10 rounded-full object-cover border-2 border-cyber-primary"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-cyber-dark">CyberMentor AI</h1>
                  <p className="text-xs text-green-600 font-medium">● Online — Ready to help</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-cyber-muted hover:text-red-500 gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-4" style={{ height: 'calc(100vh - 140px)' }}>
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-cyber-border shadow-sm p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {message.role === 'assistant' ? (
                    <img
                      src="/assets/generated/cybermentor-avatar.dim_256x256.png"
                      alt="CyberMentor"
                      className="w-8 h-8 rounded-full object-cover border border-cyber-primary"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cyber-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-cyber-primary text-white rounded-tr-sm'
                      : 'bg-cyber-bubble border border-cyber-border rounded-tl-sm'
                  }`}
                >
                  {/* Image attachment */}
                  {message.imageUrl && (
                    <div className="mb-2">
                      <img
                        src={message.imageUrl}
                        alt="Attached"
                        className="max-w-full max-h-48 rounded-lg object-contain border border-white/20"
                      />
                    </div>
                  )}
                  {/* Text content */}
                  {message.content && (
                    message.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="prose-cyber">
                        {renderMarkdown(message.content)}
                      </div>
                    )
                  )}
                  <p className={`text-xs mt-1.5 ${message.role === 'user' ? 'text-white/60 text-right' : 'text-cyber-muted'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <img
                  src="/assets/generated/cybermentor-avatar.dim_256x256.png"
                  alt="CyberMentor"
                  className="w-8 h-8 rounded-full object-cover border border-cyber-primary flex-shrink-0"
                />
                <div className="bg-cyber-bubble border border-cyber-border rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-2 h-2 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.slice(0, 6).map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="text-xs bg-white border border-cyber-border text-cyber-dark hover:bg-cyber-primary hover:text-white hover:border-cyber-primary transition-all px-3 py-1.5 rounded-full"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="bg-white rounded-2xl border border-cyber-border shadow-sm p-3">
            {/* Image preview */}
            {attachedImage && (
              <div className="mb-2 relative inline-block">
                <img
                  src={attachedImage}
                  alt="Preview"
                  className="h-20 w-auto rounded-lg border border-cyber-border object-contain"
                />
                <button
                  onClick={() => setAttachedImage(null)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Recording indicator */}
            {isListening && (
              <div className="mb-2 flex items-center gap-2 text-red-500 text-xs font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Listening... speak your question
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening... speak now 🎤" : "Ask CyberMentor anything about cybersecurity, hacking, or web dev..."}
                className="flex-1 min-h-[44px] max-h-32 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm p-0 bg-transparent"
                rows={1}
              />

              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Image attach button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleImageAttach}
                      className="w-9 h-9 text-cyber-muted hover:text-cyber-primary hover:bg-cyber-bg"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach image</TooltipContent>
                </Tooltip>

                {/* Mic button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleMicToggle}
                      disabled={!isSpeechSupported}
                      className={`w-9 h-9 transition-colors ${
                        isListening
                          ? 'text-red-500 bg-red-50 hover:bg-red-100'
                          : 'text-cyber-muted hover:text-cyber-primary hover:bg-cyber-bg'
                      } disabled:opacity-40`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!isSpeechSupported
                      ? 'Voice input not supported in this browser'
                      : isListening
                      ? 'Stop listening'
                      : 'Start voice input'}
                  </TooltipContent>
                </Tooltip>

                {/* Send button */}
                <Button
                  type="submit"
                  size="icon"
                  disabled={isTyping || (!inputValue.trim() && !attachedImage)}
                  className="w-9 h-9 bg-cyber-primary hover:bg-cyber-primary-dark text-white rounded-xl disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
