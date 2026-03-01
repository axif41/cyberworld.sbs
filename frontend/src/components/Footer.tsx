import { Heart, Globe, Mail } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'cyberworld-app'
  );

  return (
    <footer className="bg-white border-t border-cw-green-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
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
              <span className="font-heading font-bold text-xl text-cw-green-700">
                Cyber<span className="text-cw-green-500">World</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Empowering the next generation of tech professionals with world-class education in
              cybersecurity, development, and beyond.
            </p>
            <p className="mt-3 text-sm font-medium text-cw-green-700">
              Founded by <span className="font-semibold">Asif Parwez</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">ESTD 2026</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/courses' as const, label: 'Courses' },
                { to: '/mentor' as const, label: 'CyberMentor AI' },
                { to: '/projects' as const, label: 'Projects' },
                { to: '/doubts' as const, label: 'Community' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 hover:text-cw-green-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              Contact
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Globe size={14} className="text-cw-green-500" />
                cyberworld.edu
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Mail size={14} className="text-cw-green-500" />
                info@cyberworld.edu
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cw-green-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {year} CyberWorld. All rights reserved. Founded by{' '}
            <span className="text-cw-green-600 font-medium">Asif Parwez</span>.
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            Built with{' '}
            <Heart size={12} className="text-cw-green-500 fill-cw-green-500 mx-0.5" />
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cw-green-600 hover:underline font-medium ml-1"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
