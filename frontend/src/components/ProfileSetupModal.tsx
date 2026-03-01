import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRegisterUser } from '../hooks/useQueries';
import { Terminal, Loader2, User } from 'lucide-react';

interface ProfileSetupModalProps {
  open: boolean;
}

const COURSE_TRACKS = [
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'backend', label: 'Backend Developer' },
  { value: 'fullstack', label: 'Full Stack Developer' },
  { value: 'cybersecurity', label: 'Cyber Security' },
  { value: 'ethicalhacking', label: 'Ethical Hacking' },
];

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    displayName: '',
    courseTrack: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerUser = useRegisterUser();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.username.trim()) newErrors.username = 'Username is required';
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) newErrors.username = '3-20 chars, letters/numbers/underscore only';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.displayName.trim()) newErrors.displayName = 'Display name is required';
    if (!form.courseTrack) newErrors.courseTrack = 'Please select a course track';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await registerUser.mutateAsync(form);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="bg-cyber-panel border-neon-cyan/30 max-w-md w-full"
        style={{ boxShadow: '0 0 40px oklch(0.72 0.2 195 / 0.2)' }}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded bg-neon-cyan/10 border border-neon-cyan/30">
              <Terminal size={20} className="text-neon-cyan" />
            </div>
            <div>
              <DialogTitle className="font-cyber text-neon-cyan text-lg">
                INITIALIZE PROFILE
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Set up your CyberWorld student profile
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-sm font-medium flex items-center gap-1">
              <User size={12} /> Username
            </Label>
            <Input
              value={form.username}
              onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="cyber_student"
              className="cyber-input"
            />
            {errors.username && <p className="text-destructive text-xs">{errors.username}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-sm font-medium">Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="student@cyberworld.sbs"
              className="cyber-input"
            />
            {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-sm font-medium">Display Name</Label>
            <Input
              value={form.displayName}
              onChange={(e) => setForm(f => ({ ...f, displayName: e.target.value }))}
              placeholder="Your Name"
              className="cyber-input"
            />
            {errors.displayName && <p className="text-destructive text-xs">{errors.displayName}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground/80 text-sm font-medium">Course Track</Label>
            <Select
              value={form.courseTrack}
              onValueChange={(v) => setForm(f => ({ ...f, courseTrack: v }))}
            >
              <SelectTrigger className="cyber-input">
                <SelectValue placeholder="Select your learning path" />
              </SelectTrigger>
              <SelectContent className="bg-cyber-panel border-cyber-border">
                {COURSE_TRACKS.map(track => (
                  <SelectItem
                    key={track.value}
                    value={track.value}
                    className="text-foreground hover:bg-neon-cyan/10 focus:bg-neon-cyan/10"
                  >
                    {track.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.courseTrack && <p className="text-destructive text-xs">{errors.courseTrack}</p>}
          </div>

          {registerUser.isError && (
            <p className="text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded p-2">
              {registerUser.error instanceof Error ? registerUser.error.message : 'Registration failed'}
            </p>
          )}

          <Button
            type="submit"
            disabled={registerUser.isPending}
            className="w-full cyber-btn-primary h-10"
          >
            {registerUser.isPending ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> Initializing...</>
            ) : (
              'INITIALIZE PROFILE'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
