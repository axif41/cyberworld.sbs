import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

// Simple markdown-like renderer
const renderContent = (content: string): React.ReactNode => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

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
        <div key={i} className="my-3">
          {lang && (
            <div className="bg-cw-green-700 text-white text-xs px-3 py-1 rounded-t-lg font-mono">
              {lang}
            </div>
          )}
          <pre className={`bg-gray-900 text-green-300 text-xs p-4 overflow-x-auto font-mono leading-relaxed ${lang ? 'rounded-b-lg' : 'rounded-lg'}`}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // H2 heading
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-base font-bold text-cw-green-800 mt-4 mb-2 font-heading">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3 heading
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-sm font-semibold text-cw-green-700 mt-3 mb-1 font-heading">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // H4 heading
    if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={i} className="text-sm font-semibold text-gray-700 mt-2 mb-1">
          {line.slice(5)}
        </h4>
      );
      i++;
      continue;
    }

    // Bullet point
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-none space-y-1 my-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-cw-green-500 mt-0.5 flex-shrink-0">▸</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={i} className="list-none space-y-1 my-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-cw-green-600 font-bold flex-shrink-0 w-5">{idx + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Horizontal rule
    if (line === '---') {
      elements.push(<hr key={i} className="border-cw-green-100 my-3" />);
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-1" />);
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p
        key={i}
        className="text-sm text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
    i++;
  }

  return <>{elements}</>;
};

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-cw-green-700 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, isStreaming }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-cw-green-600 text-white'
            : 'bg-white border-2 border-cw-green-200 text-cw-green-600'
        }`}
      >
        {isUser ? (
          <User size={16} />
        ) : (
          <img
            src="/assets/generated/cybermentor-avatar.dim_256x256.png"
            alt="CyberMentor"
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = 'none';
              t.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
            }}
          />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[80%] ${
          isUser
            ? 'bg-cw-green-600 text-white rounded-2xl rounded-tr-sm px-4 py-3'
            : 'bg-white border border-cw-green-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm'
        }`}
      >
        {isUser ? (
          <p className="text-sm text-white">{content}</p>
        ) : (
          <div>
            {renderContent(content)}
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-cw-green-500 ml-1 animate-pulse rounded-sm" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
