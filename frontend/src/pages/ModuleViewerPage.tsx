import { useState, useEffect } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle, Terminal as TerminalIcon, Code2 } from 'lucide-react';
import { getCourseById, getModuleById } from '../data/coursesData';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import SlideViewer from '../components/SlideViewer';
import PythonEditor from '../components/PythonEditor';
import LinuxTerminal from '../components/LinuxTerminal';

function getCompletedKey(courseId: string, userId: string) {
  return `cw_completed_${courseId}_${userId}`;
}

function getCompletedModules(courseId: string, userId: string): string[] {
  try {
    const raw = localStorage.getItem(getCompletedKey(courseId, userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function markModuleComplete(courseId: string, moduleId: string, userId: string) {
  const key = getCompletedKey(courseId, userId);
  const completed = getCompletedModules(courseId, userId);
  if (!completed.includes(moduleId)) {
    localStorage.setItem(key, JSON.stringify([...completed, moduleId]));
  }
}

export default function ModuleViewerPage() {
  const { courseId, moduleId } = useParams({ from: '/courses/$courseId/modules/$moduleId' });
  const { identity } = useInternetIdentity();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTool, setShowTool] = useState(false);

  const course = getCourseById(courseId);
  const module = getModuleById(courseId, moduleId);
  const userId = identity?.getPrincipal().toString() || 'guest';

  useEffect(() => {
    if (module) {
      const completed = getCompletedModules(courseId, userId);
      setIsCompleted(completed.includes(moduleId));
    }
  }, [courseId, moduleId, userId, module]);

  const handleComplete = () => {
    markModuleComplete(courseId, moduleId, userId);
    setIsCompleted(true);
  };

  if (!course || !module) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-cyber text-2xl text-destructive mb-4">Module Not Found</h1>
        <Link to="/courses" className="cyber-btn-outline inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm">
          <ArrowLeft size={14} /> Back to Courses
        </Link>
      </div>
    );
  }

  const showLinux = module.codeType === 'linux' ||
    course.id === 'cybersecurity' ||
    course.id === 'ethicalhacking';
  const showPython = module.codeType === 'python';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link to="/courses" className="hover:text-neon-cyan transition-colors">Courses</Link>
        <span>/</span>
        <Link to="/courses/$courseId" params={{ courseId }} className="hover:text-neon-cyan transition-colors">
          {course.shortTitle}
        </Link>
        <span>/</span>
        <span className="text-foreground">{module.title}</span>
      </div>

      {/* Module header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{course.icon}</span>
            <h1 className="font-cyber text-2xl md:text-3xl font-bold text-foreground">{module.title}</h1>
            {isCompleted && (
              <span className="flex items-center gap-1 text-neon-green text-sm font-mono">
                <CheckCircle size={16} /> Completed
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{module.description}</p>
        </div>
        <Link
          to="/courses/$courseId"
          params={{ courseId }}
          className="flex-shrink-0 cyber-btn-outline flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
        >
          <ArrowLeft size={14} /> Course
        </Link>
      </div>

      {/* Main layout */}
      <div className={`grid gap-6 ${(showLinux || showPython) ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
        {/* Slide viewer */}
        <div className="cyber-card rounded-xl p-6 min-h-[500px] flex flex-col">
          <SlideViewer
            slides={module.slides}
            moduleTitle={module.title}
            onComplete={handleComplete}
            isCompleted={isCompleted}
          />
        </div>

        {/* Tool panel */}
        {(showLinux || showPython) && (
          <div className="flex flex-col gap-4">
            {/* Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTool(!showTool)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-cyber transition-all ${
                  showTool
                    ? 'bg-neon-green/10 border border-neon-green/50 text-neon-green'
                    : 'cyber-btn-outline'
                }`}
              >
                {showLinux ? <TerminalIcon size={14} /> : <Code2 size={14} />}
                {showLinux ? 'Linux Terminal' : 'Python Editor'}
                {showTool ? ' (Active)' : ' (Click to Open)'}
              </button>
            </div>

            {showTool && (
              <div className="flex-1 min-h-[400px]">
                {showLinux ? <LinuxTerminal /> : <PythonEditor />}
              </div>
            )}

            {!showTool && (
              <div
                className="cyber-card rounded-xl p-8 text-center cursor-pointer hover:border-neon-green/50 transition-all"
                onClick={() => setShowTool(true)}
              >
                {showLinux ? (
                  <>
                    <TerminalIcon size={32} className="text-neon-green mx-auto mb-3" />
                    <p className="font-cyber text-sm text-neon-green mb-1">Linux Terminal</p>
                    <p className="text-muted-foreground text-xs">Practice Linux commands in a simulated environment</p>
                  </>
                ) : (
                  <>
                    <Code2 size={32} className="text-neon-cyan mx-auto mb-3" />
                    <p className="font-cyber text-sm text-neon-cyan mb-1">Python Editor</p>
                    <p className="text-muted-foreground text-xs">Write and run Python code in your browser</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Module navigation */}
      <div className="mt-8 flex items-center justify-between">
        {(() => {
          const idx = course.modules.findIndex(m => m.id === moduleId);
          const prev = idx > 0 ? course.modules[idx - 1] : null;
          const next = idx < course.modules.length - 1 ? course.modules[idx + 1] : null;
          return (
            <>
              {prev ? (
                <Link
                  to="/courses/$courseId/modules/$moduleId"
                  params={{ courseId, moduleId: prev.id }}
                  className="cyber-btn-outline flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                >
                  <ArrowLeft size={14} /> {prev.title}
                </Link>
              ) : <div />}
              {next ? (
                <Link
                  to="/courses/$courseId/modules/$moduleId"
                  params={{ courseId, moduleId: next.id }}
                  className="cyber-btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                >
                  {next.title} <ArrowLeft size={14} className="rotate-180" />
                </Link>
              ) : (
                <Link
                  to="/courses/$courseId"
                  params={{ courseId }}
                  className="cyber-btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                >
                  Back to Course <ArrowLeft size={14} className="rotate-180" />
                </Link>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
