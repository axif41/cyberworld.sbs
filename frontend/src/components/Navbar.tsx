import { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import {
  Menu,
  X,
  BookOpen,
  MessageSquare,
  FolderOpen,
  HelpCircle,
  Award,
  User,
  LogOut,
  LogIn,
  Loader2,
} from 'lucide-react';

const navLinks = [
  { to: '/' as const, label: 'Home' },
  { to: '/courses' as const, label: 'Courses', icon: BookOpen },
  { to: '/mentor' as const, label: 'CyberMentor', icon: MessageSquare },
  { to: '/projects' as const, label: 'Projects', icon: FolderOpen },
  { to: '/doubts' as const, label: 'Doubts', icon: HelpCircle },
  { to: '/certificates' as const, label: 'Certificates', icon: Award },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-cw-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/assets/image.png"
              alt="CyberWorld Logo"
              className="h-10 w-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/assets/generated/cyberworld-logo.dim_400x120.png';
              }}
            />
            <span className="font-heading font-bold text-xl text-cw-green-700 hidden sm:block">
              Cyber<span className="text-cw-green-500">World</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-cw-green-100 text-cw-green-700 font-semibold'
                    : 'text-gray-600 hover:bg-cw-green-50 hover:text-cw-green-700'
                }`}
              >
                {Icon && <Icon size={14} />}
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Link
                to="/profile"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/profile')
                    ? 'bg-cw-green-100 text-cw-green-700 font-semibold'
                    : 'text-gray-600 hover:bg-cw-green-50 hover:text-cw-green-700'
                }`}
              >
                <User size={14} />
                Profile
              </Link>
            )}

            <button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isAuthenticated
                  ? 'border border-red-200 text-red-600 hover:bg-red-50'
                  : 'bg-cw-green-600 hover:bg-cw-green-700 text-white shadow-green-sm'
              } disabled:opacity-50`}
            >
              {isLoggingIn ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isAuthenticated ? (
                <LogOut size={14} />
              ) : (
                <LogIn size={14} />
              )}
              {isLoggingIn ? 'Connecting...' : isAuthenticated ? 'Logout' : 'Login'}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-cw-green-50 hover:text-cw-green-700 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-cw-green-100 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(to)
                    ? 'bg-cw-green-100 text-cw-green-700 font-semibold'
                    : 'text-gray-600 hover:bg-cw-green-50 hover:text-cw-green-700'
                }`}
              >
                {Icon && <Icon size={16} />}
                {label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-cw-green-50 hover:text-cw-green-700"
              >
                <User size={16} />
                Profile
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
