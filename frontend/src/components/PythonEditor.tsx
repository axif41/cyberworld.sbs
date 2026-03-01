import { useState, useRef } from 'react';
import { Play, Loader2, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePyodide } from '../hooks/usePyodide';

const DEFAULT_CODE = `# Welcome to CyberWorld Python Editor!
# Write your Python code here and click Run

print("Hello, CyberWorld!")

# Try some Python basics
name = "Student"
course = "Python Programming"
print(f"Welcome {name} to {course}!")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print("Squares:", squares)

# Function
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(8):
    print(f"fib({i}) = {fibonacci(i)}")
`;

export default function PythonEditor() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isLoading, isReady, error, output, runPython, clearOutput, loadPyodide } = usePyodide();

  const handleRun = async () => {
    if (!isReady) {
      await loadPyodide();
      return;
    }
    await runPython(code);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleRun();
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Editor header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <span className="font-mono text-sm text-neon-green">python_editor.py</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={clearOutput}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-7 px-2"
          >
            <Trash2 size={12} />
          </Button>
          <Button
            onClick={handleRun}
            disabled={isLoading}
            size="sm"
            className={`h-7 px-3 text-xs font-cyber ${isReady ? 'cyber-btn-primary' : 'cyber-btn-outline'}`}
          >
            {isLoading ? (
              <><Loader2 size={12} className="animate-spin mr-1" /> Loading Python...</>
            ) : isReady ? (
              <><Play size={12} className="mr-1" /> Run (Ctrl+Enter)</>
            ) : (
              <><Download size={12} className="mr-1" /> Load Python</>
            )}
          </Button>
        </div>
      </div>

      {/* Code editor */}
      <div className="flex-1 rounded-lg overflow-hidden border border-cyber-border bg-cyber-darker">
        <div className="flex items-center gap-1.5 px-4 py-2 bg-cyber-panel border-b border-cyber-border">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs text-muted-foreground font-mono">Python 3.x — Pyodide Runtime</span>
        </div>
        <div className="flex">
          {/* Line numbers */}
          <div className="select-none px-3 py-3 text-right text-xs font-mono text-muted-foreground/40 bg-cyber-darker border-r border-cyber-border min-w-[3rem]">
            {code.split('\n').map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-3 bg-transparent text-neon-green font-mono text-xs leading-6 resize-none outline-none min-h-[200px]"
            spellCheck={false}
            style={{ tabSize: 4 }}
          />
        </div>
      </div>

      {/* Output terminal */}
      <div className="rounded-lg border border-cyber-border bg-cyber-darker overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-cyber-panel border-b border-cyber-border">
          <span className="text-xs font-mono text-neon-green">▶ Output</span>
          {output.length > 0 && (
            <button onClick={clearOutput} className="text-xs text-muted-foreground hover:text-foreground">
              clear
            </button>
          )}
        </div>
        <div className="p-4 min-h-[100px] max-h-[200px] overflow-y-auto font-mono text-xs">
          {error && (
            <p className="text-destructive">{error}</p>
          )}
          {output.length === 0 && !error ? (
            <p className="text-muted-foreground/50">
              {isReady ? 'Run your code to see output here...' : 'Click "Load Python" to initialize the runtime'}
            </p>
          ) : (
            output.map((line, i) => (
              <div
                key={i}
                className={line.startsWith('[stderr]') || line.startsWith('Error:') ? 'text-destructive' : 'text-neon-green'}
              >
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
