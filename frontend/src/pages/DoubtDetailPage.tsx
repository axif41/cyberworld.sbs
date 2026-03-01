import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, MessageCircle, CheckCircle, Send, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCommentsForPost, useAddComment, useGetPostsForUser, useCreatePost } from '../hooks/useQueries';
import { type Post } from '../backend';
import { Principal } from '@dfinity/principal';

interface DoubtData {
  type: 'doubt';
  title: string;
  description: string;
  course: string;
  resolved: boolean;
  authorName: string;
}

function parseDoubt(post: Post): DoubtData | null {
  try {
    const data = JSON.parse(post.content);
    if (data.type === 'doubt') return data as DoubtData;
    return null;
  } catch {
    return null;
  }
}

function formatTime(timestamp: bigint): string {
  const date = new Date(Number(timestamp / BigInt(1_000_000)));
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const DEMO_PRINCIPAL = Principal.fromText('2vxsx-fae');

export default function DoubtDetailPage() {
  const { doubtId } = useParams({ from: '/doubts/$doubtId' });
  const { identity } = useInternetIdentity();
  const [replyText, setReplyText] = useState('');

  const { data: demoPosts = [] } = useGetPostsForUser(DEMO_PRINCIPAL);
  const currentPrincipal = identity ? identity.getPrincipal() : null;
  const { data: myPosts = [] } = useGetPostsForUser(currentPrincipal);

  const allPosts = [...demoPosts, ...myPosts].filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
  const post = allPosts.find(p => p.id === doubtId);
  const doubtData = post ? parseDoubt(post) : null;

  const { data: comments = [], isLoading: commentsLoading, refetch: refetchComments } = useGetCommentsForPost(doubtId);
  const addComment = useAddComment();
  const createPost = useCreatePost();

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !identity) return;
    await addComment.mutateAsync({ postId: doubtId, content: replyText });
    setReplyText('');
    refetchComments();
  };

  const handleMarkResolved = async () => {
    if (!post || !doubtData || !identity) return;
    const updated: DoubtData = { ...doubtData, resolved: true };
    await createPost.mutateAsync(JSON.stringify(updated));
  };

  if (!post || !doubtData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-cyber text-2xl text-destructive mb-4">Doubt Not Found</h1>
        <Link to="/doubts" className="cyber-btn-outline inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm">
          <ArrowLeft size={14} /> Back to Doubts
        </Link>
      </div>
    );
  }

  const isAuthor = identity && post.authorId.toString() === identity.getPrincipal().toString();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/doubts" className="hover:text-neon-cyan transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> Doubts
        </Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{doubtData.title}</span>
      </div>

      {/* Main doubt */}
      <div className="cyber-card rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            {doubtData.resolved ? (
              <CheckCircle size={20} className="text-neon-green flex-shrink-0" />
            ) : (
              <MessageCircle size={20} className="text-neon-cyan flex-shrink-0" />
            )}
            <h1 className="font-cyber text-xl font-bold text-foreground">{doubtData.title}</h1>
          </div>
          {doubtData.resolved && (
            <span className="flex-shrink-0 text-xs px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green font-mono">
              ✓ Resolved
            </span>
          )}
        </div>

        <p className="text-foreground/80 leading-relaxed mb-4">{doubtData.description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-cyber-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono">{doubtData.authorName}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={10} /> {formatTime(post.timestamp)}
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded border border-cyber-border font-mono">{doubtData.course}</span>
          </div>
          {isAuthor && !doubtData.resolved && (
            <Button
              onClick={handleMarkResolved}
              disabled={createPost.isPending}
              size="sm"
              className="text-xs cyber-btn-outline border-neon-green/50 text-neon-green hover:bg-neon-green/10"
            >
              <CheckCircle size={12} className="mr-1" /> Mark Resolved
            </Button>
          )}
        </div>
      </div>

      {/* Replies */}
      <div className="mb-6">
        <h2 className="font-cyber text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <MessageCircle size={16} className="text-neon-cyan" />
          Replies ({comments.length})
        </h2>

        {commentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-neon-cyan" />
          </div>
        ) : comments.length === 0 ? (
          <div className="cyber-card rounded-xl p-6 text-center">
            <p className="text-muted-foreground text-sm">No replies yet. Be the first to help!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="cyber-card rounded-xl p-4">
                <p className="text-foreground/80 text-sm leading-relaxed mb-3">{comment.content}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{comment.authorId.toString().slice(0, 8)}...</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> {formatTime(comment.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply form */}
      {identity ? (
        <div className="cyber-card rounded-xl p-5">
          <h3 className="font-cyber text-sm font-bold text-neon-cyan mb-3">Post a Reply</h3>
          <form onSubmit={handleReply} className="space-y-3">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Share your knowledge or ask for clarification..."
              className="cyber-input min-h-[100px]"
              required
            />
            <Button
              type="submit"
              disabled={addComment.isPending || !replyText.trim()}
              className="cyber-btn-primary flex items-center gap-2"
            >
              {addComment.isPending ? (
                <><Loader2 size={14} className="animate-spin" /> Posting...</>
              ) : (
                <><Send size={14} /> Post Reply</>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <div className="cyber-card rounded-xl p-5 text-center">
          <p className="text-muted-foreground text-sm">Login to post a reply</p>
        </div>
      )}
    </div>
  );
}
