import { useState } from 'react';
import { Award, Download, Share2, CheckCircle, Lock } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { COURSES } from '../data/coursesData';

interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  studentName: string;
  completionDate: string;
}

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

function generateCertId(courseId: string, userId: string): string {
  const hash = btoa(`${courseId}-${userId}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12).toUpperCase();
  return `CW-${hash}`;
}

export default function CertificatesPage() {
  const { identity } = useInternetIdentity();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  if (!identity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Lock size={48} className="text-muted-foreground mx-auto mb-4" />
        <h1 className="font-cyber text-2xl text-muted-foreground mb-2">Login Required</h1>
        <p className="text-muted-foreground text-sm">Please login to view your certificates</p>
      </div>
    );
  }

  const userId = identity.getPrincipal().toString();

  // Check which courses are fully completed
  const earnedCertificates: Certificate[] = COURSES
    .filter(course => {
      const completed = getCompletedModules(course.id, userId);
      return course.modules.length > 0 && completed.length >= course.modules.length;
    })
    .map(course => ({
      id: generateCertId(course.id, userId),
      courseId: course.id,
      courseName: course.title,
      studentName: userId.slice(0, 8) + '...',
      completionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/5 mb-4">
          <Award size={14} className="text-yellow-400" />
          <span className="text-yellow-400 text-xs font-mono tracking-widest uppercase">My Achievements</span>
        </div>
        <h1 className="font-cyber text-4xl font-black mb-4">
          <span className="neon-text-cyan">MY</span>{' '}
          <span className="text-yellow-400">CERTIFICATES</span>
        </h1>
        <p className="text-muted-foreground">
          Complete all modules in a course to earn your CyberWorld certificate
        </p>
      </div>

      {/* Progress overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
        {COURSES.map(course => {
          const completed = getCompletedModules(course.id, userId);
          const total = course.modules.length;
          const percent = total > 0 ? Math.round((completed.length / total) * 100) : 0;
          const isComplete = percent === 100;

          return (
            <div key={course.id} className={`cyber-card rounded-xl p-4 text-center ${isComplete ? 'border-yellow-400/50' : ''}`}>
              <div className="text-2xl mb-2">{course.icon}</div>
              <p className="font-cyber text-xs font-bold text-foreground mb-2 line-clamp-2">{course.shortTitle}</p>
              <div className="w-full h-1.5 bg-cyber-border rounded-full mb-1">
                <div
                  className={`h-full rounded-full transition-all ${isComplete ? 'bg-yellow-400' : 'bg-neon-cyan'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground font-mono">{completed.length}/{total}</p>
              {isComplete && (
                <div className="mt-2 flex items-center justify-center gap-1 text-yellow-400">
                  <CheckCircle size={12} />
                  <span className="text-xs font-mono">Earned!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Certificates */}
      {earnedCertificates.length === 0 ? (
        <div className="text-center py-16">
          <Award size={64} className="text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-cyber text-xl text-muted-foreground mb-2">No Certificates Yet</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Complete all modules in any course to earn your first CyberWorld certificate!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {earnedCertificates.map((cert) => (
            <div
              key={cert.id}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedCert(cert)}
              style={{ boxShadow: '0 0 30px oklch(0.8 0.18 80 / 0.2)' }}
            >
              <img
                src="/assets/generated/certificate-bg.dim_1200x800.png"
                alt="Certificate"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = 'none';
                  if (t.parentElement) t.parentElement.style.background = 'oklch(0.12 0.018 245)';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/95 via-cyber-dark/60 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={16} className="text-yellow-400" />
                  <span className="font-cyber text-xs text-yellow-400 font-bold">CERTIFICATE OF COMPLETION</span>
                </div>
                <h3 className="font-cyber text-lg font-bold text-white mb-1">{cert.courseName}</h3>
                <p className="text-white/60 text-xs font-mono mb-2">{cert.completionDate}</p>
                <p className="text-white/40 text-xs font-mono">ID: {cert.id}</p>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button className="p-1.5 rounded bg-cyber-dark/80 border border-cyber-border text-muted-foreground hover:text-neon-cyan">
                  <Share2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-dark/90 backdrop-blur-sm"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative max-w-2xl w-full rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 0 60px oklch(0.8 0.18 80 / 0.4)' }}
          >
            <img
              src="/assets/generated/certificate-bg.dim_1200x800.png"
              alt="Certificate"
              className="w-full"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = 'none';
                if (t.parentElement) t.parentElement.style.background = 'oklch(0.12 0.018 245)';
              }}
            />
            <div className="absolute inset-0 bg-cyber-dark/80 flex flex-col items-center justify-center text-center p-8">
              <img
                src="/assets/generated/cyberworld-logo.dim_400x120.png"
                alt="CyberWorld"
                className="h-10 w-auto mb-4"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <p className="text-yellow-400 font-mono text-xs tracking-widest uppercase mb-2">Certificate of Completion</p>
              <p className="text-muted-foreground text-sm mb-4">This certifies that</p>
              <p className="font-cyber text-2xl font-bold neon-text-cyan mb-2">{selectedCert.studentName}</p>
              <p className="text-muted-foreground text-sm mb-2">has successfully completed</p>
              <p className="font-cyber text-xl font-bold text-yellow-400 mb-4">{selectedCert.courseName}</p>
              <p className="text-muted-foreground text-xs mb-1">{selectedCert.completionDate}</p>
              <p className="text-muted-foreground text-xs font-mono">Certificate ID: {selectedCert.id}</p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="cyber-btn-outline px-4 py-2 rounded-lg text-sm"
                >
                  Close
                </button>
                <button className="cyber-btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm">
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
