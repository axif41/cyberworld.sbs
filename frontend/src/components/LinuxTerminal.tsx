import { useState, useRef, useEffect } from 'react';
import { executeCommand, createInitialTerminalState, type TerminalState } from '../utils/terminalCommands';
import { Terminal } from 'lucide-react';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
  prompt?: string;
}

export default function LinuxTerminal() {
  const [termState, setTermState] = useState<TerminalState>(createInitialTerminalState());
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', content: 'CyberWorld Linux Terminal v1.0 — Kali GNU/Linux 2024.1' },
    { type: 'system', content: 'Type "help" for available commands. This is a simulated environment.' },
    { type: 'system', content: '' },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const getPrompt = (state: TerminalState) => {
    const cwd = state.cwd === '/home/student' ? '~' : state.cwd;
    return `student@cyberworld:${cwd}$`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const prompt = getPrompt(termState);
    const newLines: TerminalLine[] = [
      ...lines,
      { type: 'input', content: input, prompt }
    ];

    const { output, newState } = executeCommand(input, termState);

    if (output === '\x1b[CLEAR]') {
      setLines([{ type: 'system', content: 'Terminal cleared.' }]);
    } else if (output) {
      const outputLines = output.split('\n').map(line => ({
        type: 'output' as const,
        content: line
      }));
      setLines([...newLines, ...outputLines]);
    } else {
      setLines(newLines);
    }

    setTermState(newState);
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const history = termState.history;
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      if (history[history.length - 1 - newIndex]) {
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? '' : termState.history[termState.history.length - 1 - newIndex] || '');
    }
  };

  return (
    <div
      className="flex flex-col h-full rounded-lg overflow-hidden border border-neon-green/30"
      style={{ boxShadow: '0 0 20px oklch(0.82 0.22 155 / 0.1)' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-cyber-darker border-b border-neon-green/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <Terminal size={14} className="text-neon-green ml-2" />
        <span className="text-xs font-mono text-neon-green">student@cyberworld — bash</span>
      </div>

      {/* Terminal output */}
      <div className="flex-1 p-4 overflow-y-auto bg-cyber-darker font-mono text-xs leading-5 min-h-[250px] max-h-[400px]">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all">
            {line.type === 'input' ? (
              <span>
                <span className="text-neon-green">{line.prompt} </span>
                <span className="text-foreground">{line.content}</span>
              </span>
            ) : line.type === 'system' ? (
              <span className="text-neon-cyan/70">{line.content}</span>
            ) : line.type === 'error' ? (
              <span className="text-destructive">{line.content}</span>
            ) : (
              <span className="text-foreground/80">{line.content}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input line */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-2 bg-cyber-darker border-t border-neon-green/20">
        <span className="text-neon-green font-mono text-xs whitespace-nowrap flex-shrink-0">
          {getPrompt(termState)}
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-foreground font-mono text-xs outline-none caret-neon-green"
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
