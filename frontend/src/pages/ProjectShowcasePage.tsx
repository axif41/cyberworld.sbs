import { useState } from 'react';
import { Heart, ExternalLink, Plus, Loader2, X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetPostsForUser, useCreatePost, useLikePost } from '../hooks/useQueries';
import { type Post } from '../backend';
import { Principal } from '@dfinity/principal';

// We use the backend's Post type for projects, encoding project data as JSON in content
interface ProjectData {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  authorName: string;
}

function parseProject(post: Post): ProjectData | null {
  try {
    return JSON.parse(post.content) as ProjectData;
  } catch {
    return null;
  }
}

// Demo principal for fetching all posts — we use a known principal
const DEMO_PRINCIPAL = Principal.fromText('2vxsx-fae');

export default function ProjectShowcasePage() {
  const { identity } = useInternetIdentity();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', tags: '', demoUrl: '' });
  const [tagInput, setTagInput] = useState('');

  const { data: posts = [], isLoading, refetch } = useGetPostsForUser(DEMO_PRINCIPAL);
  const createPost = useCreatePost();
  const likePost = useLikePost();

  // Also fetch current user's posts
  const currentPrincipal = identity ? identity.getPrincipal() : null;
  const { data: myPosts = [] } = useGetPostsForUser(currentPrincipal);

  // Combine and deduplicate
  const allPosts = [...posts, ...myPosts].filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
  const projects = allPosts
    .map(p => ({ post: p, data: parseProject(p) }))
    .filter(({ data }) => data !== null)
    .sort((a, b) => Number(b.post.timestamp - a.post.timestamp));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const projectData: ProjectData = {
      title: form.title,
      description: form.description,
      tags,
      demoUrl: form.demoUrl || undefined,
      authorName: identity.getPrincipal().toString().slice(0, 8) + '...',
    };
    await createPost.mutateAsync(JSON.stringify(projectData));
    setForm({ title: '', description: '', tags: '', demoUrl: '' });
    setShowModal(false);
    refetch();
  };

  const handleAppreciate = async (postId: string) => {
    if (!identity) return;
    await likePost.mutateAsync(postId);
    refetch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-10 gap-4">
        <div>
          <h1 className="font-cyber text-4xl font-black mb-2">
            <span className="neon-text-cyan">PROJECT</span>{' '}
            <span className="neon-text-green">SHOWCASE</span>
          </h1>
          <p className="text-muted-foreground">Share your projects and appreciate fellow students' work</p>
        </div>
        {identity && (
          <Button
            onClick={() => setShowModal(true)}
            className="cyber-btn-primary flex items-center gap-2 flex-shrink-0"
          >
            <Plus size={16} /> Post Project
          </Button>
        )}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-neon-cyan" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="font-cyber text-xl text-muted-foreground mb-2">No Projects Yet</h2>
          <p className="text-muted-foreground text-sm mb-6">Be the first to share your project!</p>
          {identity && (
            <Button onClick={() => setShowModal(true)} className="cyber-btn-primary">
              <Plus size={14} className="mr-2" /> Post First Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(({ post, data }) => (
            <div key={post.id} className="cyber-card rounded-xl p-5 flex flex-col gap-4">
              <div>
                <h3 className="font-cyber text-base font-bold text-foreground mb-1 group-hover:text-neon-cyan">
                  {data!.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                  {data!.description}
                </p>
              </div>

              {/* Tags */}
              {data!.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {data!.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full border border-neon-cyan/30 text-neon-cyan bg-neon-cyan/5 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-cyber-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
                    <span className="text-xs text-neon-green font-mono">
                      {data!.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{data!.authorName}</span>
                </div>

                <div className="flex items-center gap-2">
                  {data!.demoUrl && (
                    <a
                      href={data!.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neon-cyan hover:text-neon-green transition-colors flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> Demo
                    </a>
                  )}
                  <button
                    onClick={() => handleAppreciate(post.id)}
                    disabled={!identity || likePost.isPending}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    <Heart size={14} />
                    <span>Appreciate</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Project Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-cyber-panel border-neon-cyan/30 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-cyber text-neon-cyan">POST YOUR PROJECT</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-foreground/80">Project Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="My Awesome Project"
                className="cyber-input"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-foreground/80">Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe your project, what it does, and what you learned..."
                className="cyber-input min-h-[100px]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-foreground/80 flex items-center gap-1">
                <Tag size={12} /> Tech Stack Tags (comma-separated)
              </Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="React, Node.js, MongoDB, Docker"
                className="cyber-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-foreground/80">Demo URL (optional)</Label>
              <Input
                value={form.demoUrl}
                onChange={(e) => setForm(f => ({ ...f, demoUrl: e.target.value }))}
                placeholder="https://myproject.com"
                className="cyber-input"
                type="url"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 cyber-btn-outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createPost.isPending}
                className="flex-1 cyber-btn-primary"
              >
                {createPost.isPending ? <><Loader2 size={14} className="animate-spin mr-2" /> Posting...</> : 'Post Project'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
