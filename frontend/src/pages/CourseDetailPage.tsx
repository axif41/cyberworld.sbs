import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Clock, BarChart2, CheckCircle, Play, Lock, Terminal, Code2 } from 'lucide-react';
import { getCourseById } from '../data/coursesData';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

// Local storage key for tracking completed modules
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

export default function CourseDetailPage() {
  const { courseId } = useParams({ from: '/courses/$courseId' });
  const { identity } = useInternetIdentity();
  const course = getCourseById(courseId);

  const userId = identity?.getPrincipal().toString() || 'guest';
  const completedModules = getCompletedModules(courseId, userId);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-cyber text-2xl text-destructive mb-4">Course Not Found</h1>
        <Link to="/courses" className="cyber-btn-outline inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm">
          <ArrowLeft size={14} /> Back to Courses
        </Link>
      </div>
    );
  }

  const completionPercent = course.modules.length > 0
    ? Math.round((completedModules.length / course.modules.length) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/courses" className="hover:text-neon-cyan transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> Courses
        </Link>
        <span>/</span>
        <span className="text-foreground">{course.title}</span>
      </div>

      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden mb-8 h-56 md:h-72">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.style.display = 'none';
            if (t.parentElement) t.parentElement.style.background = 'oklch(0.12 0.018 245)';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-dark/90 via-cyber-dark/60 to-transparent" />
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="text-4xl mb-2">{course.icon}</div>
          <h1 className="font-cyber text-3xl md:text-4xl font-black text-white mb-2">{course.title}</h1>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
            <span className="flex items-center gap-1"><BarChart2 size={12} /> {course.modules.length} modules</span>
            <span className="text-neon-cyan">{course.level}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="cyber-card rounded-xl p-6">
            <h2 className="font-cyber text-lg font-bold text-neon-cyan mb-3">About This Course</h2>
            <p className="text-muted-foreground leading-relaxed">{course.longDescription}</p>
          </div>

          {/* Progress */}
          {identity && (
            <div className="cyber-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-cyber text-lg font-bold text-neon-green">Your Progress</h2>
                <span className="text-neon-green font-mono text-sm">{completionPercent}%</span>
              </div>
              <div className="w-full h-2 bg-cyber-border rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs mt-2">
                {completedModules.length} of {course.modules.length} modules completed
              </p>
            </div>
          )}

          {/* Modules */}
          <div>
            <h2 className="font-cyber text-xl font-bold text-foreground mb-4">Course Modules</h2>
            <div className="space-y-3">
              {course.modules.map((mod, index) => {
                const isCompleted = completedModules.includes(mod.id);
                return (
                  <div key={mod.id} className="cyber-card rounded-xl p-4 group">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono border ${
                        isCompleted
                          ? 'bg-neon-green/10 border-neon-green/50 text-neon-green'
                          : 'bg-cyber-darker border-cyber-border text-muted-foreground'
                      }`}>
                        {isCompleted ? <CheckCircle size={14} /> : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground text-sm">{mod.title}</h3>
                          {mod.codeType === 'linux' && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-neon-green/10 border border-neon-green/30 text-neon-green font-mono">
                              <Terminal size={10} className="inline mr-1" />Linux
                            </span>
                          )}
                          {(mod.codeType === 'python' || mod.codeType === 'javascript') && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-mono">
                              <Code2 size={10} className="inline mr-1" />Code
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs mb-2">{mod.description}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                            <Clock size={10} /> {mod.duration}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {mod.slides.length} slides
                          </span>
                        </div>
                      </div>
                      <Link
                        to="/courses/$courseId/modules/$moduleId"
                        params={{ courseId: course.id, moduleId: mod.id }}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-cyber transition-all ${
                          isCompleted
                            ? 'text-neon-green border border-neon-green/30 hover:bg-neon-green/10'
                            : 'cyber-btn-primary'
                        }`}
                      >
                        {isCompleted ? (
                          <><CheckCircle size={12} /> Review</>
                        ) : (
                          <><Play size={12} /> Start</>
                        )}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          <div className="cyber-card rounded-xl p-5">
            <h3 className="font-cyber text-sm font-bold text-neon-cyan mb-3">Skills You'll Learn</h3>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-1 rounded border border-cyber-border text-muted-foreground bg-cyber-darker font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          {!identity ? (
            <div className="cyber-card rounded-xl p-5 text-center">
              <Lock size={24} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">Login to track your progress and earn certificates</p>
            </div>
          ) : completionPercent === 100 ? (
            <div className="neon-border-green rounded-xl p-5 text-center bg-neon-green/5">
              <CheckCircle size={24} className="text-neon-green mx-auto mb-2" />
              <p className="font-cyber text-sm text-neon-green font-bold">Course Complete!</p>
              <Link to="/certificates" className="text-xs text-muted-foreground hover:text-neon-cyan mt-1 block">
                View Certificate →
              </Link>
            </div>
          ) : null}

          {/* Start first module */}
          {course.modules.length > 0 && (
            <Link
              to="/courses/$courseId/modules/$moduleId"
              params={{ courseId: course.id, moduleId: course.modules[0].id }}
              className="cyber-btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm"
            >
              <Play size={14} />
              {completedModules.length > 0 ? 'Continue Learning' : 'Start Course'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
