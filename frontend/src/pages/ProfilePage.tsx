import { Award, BookOpen, FolderOpen, Lock, Loader2, Mail, User, ExternalLink } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetPostsForUser } from '../hooks/useQueries';
import { COURSES } from '../data/coursesData';
import { type Post } from '../backend';
import { Link } from '@tanstack/react-router';

interface ProjectData {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  authorName: string;
}

function parseProject(post: Post): ProjectData | null {
  try {
    const data = JSON.parse(post.content) as Record<string, unknown>;
    if (typeof data.title === 'string' && typeof data.description === 'string' && !('type' in data)) {
      return data as unknown as ProjectData;
    }
    return null;
  } catch {
    return null;
  }
}

function getCompletedModules(courseId: string, userId: string): string[] {
  try {
    const raw = localStorage.getItem(`cw_completed_${courseId}_${userId}`);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function generateCertId(courseId: string, userId: string): string {
  const hash = btoa(`${courseId}-${userId}`)
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 12)
    .toUpperCase();
  return `CW-${hash}`;
}

const COURSE_TRACK_LABELS: Record<string, string> = {
  frontend: 'Frontend Developer',
  backend: 'Backend Developer',
  fullstack: 'Full Stack Developer',
  cybersecurity: 'Cyber Security',
  ethicalhacking: 'Ethical Hacking',
};

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  const userId = identity?.getPrincipal().toString() ?? '';
  const { data: myPosts = [] } = useGetPostsForUser(identity ? identity.getPrincipal() : null);

  const projects = myPosts
    .map((p) => ({ post: p, data: parseProject(p) }))
    .filter((item): item is { post: Post; data: ProjectData } => item.data !== null);

  const courseProgress = COURSES.map((course) => {
    const completed = getCompletedModules(course.id, userId);
    const total = course.modules.length;
    const percent = total > 0 ? Math.round((completed.length / total) * 100) : 0;
    return { course, completed: completed.length, total, percent };
  });

  const certificates = courseProgress
    .filter(({ completed, total }) => total > 0 && completed >= total)
    .map(({ course }) => ({
      id: generateCertId(course.id, userId),
      courseName: course.title,
      courseIcon: course.icon,
      courseId: course.id,
    }));

  if (!identity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Lock size={48} className="text-muted-foreground mx-auto mb-4" />
        <h1 className="font-cyber text-2xl text-muted-foreground mb-2">Login Required</h1>
        <p className="text-muted-foreground text-sm">Please login to view your profile</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <User size={48} className="text-muted-foreground mx-auto mb-4" />
        <h1 className="font-cyber text-2xl text-muted-foreground mb-2">Profile Not Set Up</h1>
        <p className="text-muted-foreground text-sm">Complete your profile setup to get started</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="cyber-card rounded-xl p-6 mb-8">
        <div className="flex items-start gap-6 flex-wrap">
          <div className="w-20 h-20 rounded-full bg-neon-cyan/10 border-2 border-neon-cyan/50 flex items-center justify-center flex-shrink-0 animate-pulse-neon">
            <span className="font-cyber text-2xl font-bold neon-text-cyan">
              {userProfile.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-cyber text-2xl font-bold text-foreground mb-1">
              {userProfile.displayName}
            </h1>
            <p className="text-muted-foreground text-sm font-mono mb-3">@{userProfile.username}</p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-neon-cyan" />
                {userProfile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-neon-green" />
                {COURSE_TRACK_LABELS[userProfile.courseTrack] ?? userProfile.courseTrack}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="cyber-card rounded-lg p-3 text-center min-w-[70px]">
              <div className="font-cyber text-xl font-bold neon-text-green">{certificates.length}</div>
              <div className="text-xs text-muted-foreground">Certs</div>
            </div>
            <div className="cyber-card rounded-lg p-3 text-center min-w-[70px]">
              <div className="font-cyber text-xl font-bold neon-text-cyan">{projects.length}</div>
              <div className="text-xs text-muted-foreground">Projects</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Progress */}
        <div>
          <h2 className="font-cyber text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-neon-cyan" /> Course Progress
          </h2>
          <div className="space-y-3">
            {courseProgress.map(({ course, completed, total, percent }) => (
              <Link
                key={course.id}
                to="/courses/$courseId"
                params={{ courseId: course.id }}
                className="cyber-card rounded-xl p-4 block hover:border-neon-cyan/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{course.icon}</span>
                    <span className="text-sm font-medium text-foreground">{course.shortTitle}</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {completed}/{total}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-cyber-border rounded-full">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percent === 100
                        ? 'bg-yellow-400'
                        : 'bg-gradient-to-r from-neon-cyan to-neon-green'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{percent}% complete</span>
                  {percent === 100 && (
                    <span className="text-xs text-yellow-400 font-mono flex items-center gap-1">
                      <Award size={10} /> Certified
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div>
          <h2 className="font-cyber text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Award size={16} className="text-yellow-400" /> Certificates
          </h2>
          {certificates.length === 0 ? (
            <div className="cyber-card rounded-xl p-6 text-center">
              <Award size={32} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Complete a course to earn certificates</p>
              <Link
                to="/certificates"
                className="text-xs text-neon-cyan hover:text-neon-green transition-colors mt-2 block"
              >
                View progress →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="cyber-card rounded-xl p-4"
                  style={{ borderColor: 'oklch(0.8 0.18 80 / 0.3)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-xl flex-shrink-0">
                      {cert.courseIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{cert.courseName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{cert.id}</p>
                    </div>
                    <Award size={16} className="text-yellow-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
              <Link
                to="/certificates"
                className="text-xs text-neon-cyan hover:text-neon-green transition-colors block text-center mt-2"
              >
                View all certificates →
              </Link>
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="lg:col-span-2">
          <h2 className="font-cyber text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <FolderOpen size={16} className="text-neon-green" /> My Projects
          </h2>
          {projects.length === 0 ? (
            <div className="cyber-card rounded-xl p-6 text-center">
              <FolderOpen size={32} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No projects posted yet</p>
              <Link
                to="/projects"
                className="text-xs text-neon-cyan hover:text-neon-green transition-colors mt-2 block"
              >
                Post your first project →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(({ post, data }) => (
                <div key={post.id} className="cyber-card rounded-xl p-4 flex flex-col gap-3">
                  <h3 className="font-cyber text-sm font-bold text-foreground">{data.title}</h3>
                  <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed flex-1">
                    {data.description}
                  </p>
                  {data.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {data.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded border border-neon-cyan/30 text-neon-cyan bg-neon-cyan/5 font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {data.demoUrl && (
                    <a
                      href={data.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neon-cyan hover:text-neon-green transition-colors flex items-center gap-1"
                    >
                      <ExternalLink size={10} /> View Demo
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
