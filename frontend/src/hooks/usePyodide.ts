import { useState, useRef, useCallback } from 'react';

declare global {
  interface Window {
    loadPyodide: (options?: { indexURL?: string; stdout?: (text: string) => void; stderr?: (text: string) => void }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (text: string) => void }) => void;
  setStderr: (options: { batched: (text: string) => void }) => void;
}

interface UsePyodideReturn {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  output: string[];
  runPython: (code: string) => Promise<void>;
  clearOutput: () => void;
  loadPyodide: () => Promise<void>;
}

export function usePyodide(): UsePyodideReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const pyodideRef = useRef<PyodideInterface | null>(null);
  const outputRef = useRef<string[]>([]);

  const loadPyodideRuntime = useCallback(async () => {
    if (pyodideRef.current || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      // Load Pyodide script if not already loaded
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide script'));
          document.head.appendChild(script);
        });
      }

      outputRef.current = [];
      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.4/full/',
      });

      pyodide.setStdout({
        batched: (text: string) => {
          outputRef.current = [...outputRef.current, text];
          setOutput([...outputRef.current]);
        }
      });

      pyodide.setStderr({
        batched: (text: string) => {
          outputRef.current = [...outputRef.current, `[stderr] ${text}`];
          setOutput([...outputRef.current]);
        }
      });

      pyodideRef.current = pyodide;
      setIsReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Python runtime');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const runPython = useCallback(async (code: string) => {
    if (!pyodideRef.current) {
      setError('Python runtime not loaded. Click "Load Python" first.');
      return;
    }

    outputRef.current = [];
    setOutput([]);
    setError(null);

    try {
      await pyodideRef.current.runPythonAsync(code);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      outputRef.current = [...outputRef.current, `Error: ${errMsg}`];
      setOutput([...outputRef.current]);
    }
  }, []);

  const clearOutput = useCallback(() => {
    outputRef.current = [];
    setOutput([]);
  }, []);

  return {
    isLoading,
    isReady,
    error,
    output,
    runPython,
    clearOutput,
    loadPyodide: loadPyodideRuntime
  };
}
