import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Code2, List, BookOpen, Lightbulb, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Slide } from '../data/coursesData';

interface SlideViewerProps {
  slides: Slide[];
  moduleTitle: string;
  onComplete?: () => void;
  isCompleted?: boolean;
}

const typeIcons = {
  intro: Star,
  concept: Lightbulb,
  code: Code2,
  list: List,
  summary: BookOpen,
};

const typeColors = {
  intro: 'text-neon-cyan',
  concept: 'text-yellow-400',
  code: 'text-neon-green',
  list: 'text-purple-400',
  summary: 'text-orange-400',
};

export default function SlideViewer({ slides, moduleTitle, onComplete, isCompleted }: SlideViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = useCallback(() => {
    setCurrentIndex(i => Math.min(i + 1, slides.length - 1));
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(i => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  const slide = slides[currentIndex];
  const TypeIcon = typeIcons[slide.type] || BookOpen;
  const typeColor = typeColors[slide.type] || 'text-neon-cyan';
  const isLast = currentIndex === slides.length - 1;

  return (
    <div className="flex flex-col h-full">
      {/* Slide header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <TypeIcon size={16} className={typeColor} />
          <span className={`text-xs font-mono uppercase tracking-wider ${typeColor}`}>
            {slide.type}
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-cyber-border rounded-full mb-6">
        <div
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-green rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Slide content */}
      <div className="flex-1 neon-border rounded-lg p-6 bg-cyber-panel/50 overflow-y-auto animate-slide-in-up">
        <h2 className="font-cyber text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
          {slide.title}
        </h2>

        <p className="text-foreground/80 leading-relaxed mb-4 text-sm md:text-base">
          {slide.content}
        </p>

        {slide.bullets && slide.bullets.length > 0 && (
          <ul className="space-y-2 mt-4">
            {slide.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="text-neon-cyan mt-0.5 flex-shrink-0">▸</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {slide.code && (
          <div className="mt-4 rounded-lg overflow-hidden border border-cyber-border">
            <div className="flex items-center justify-between px-4 py-2 bg-cyber-darker border-b border-cyber-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">{slide.language || 'code'}</span>
            </div>
            <pre className="p-4 bg-cyber-darker overflow-x-auto text-xs md:text-sm">
              <code className="terminal-text whitespace-pre">{slide.code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 gap-3">
        <Button
          onClick={goPrev}
          disabled={currentIndex === 0}
          variant="outline"
          className="cyber-btn-outline flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>

        <div className="flex gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-neon-cyan w-4' : 'bg-cyber-border hover:bg-neon-cyan/50'
              }`}
            />
          ))}
        </div>

        {isLast ? (
          <Button
            onClick={onComplete}
            disabled={isCompleted}
            className={`flex items-center gap-2 ${isCompleted ? 'opacity-60' : 'cyber-btn-primary'}`}
          >
            {isCompleted ? '✓ Completed' : 'Mark Complete'}
          </Button>
        ) : (
          <Button
            onClick={goNext}
            className="cyber-btn-primary flex items-center gap-2"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
