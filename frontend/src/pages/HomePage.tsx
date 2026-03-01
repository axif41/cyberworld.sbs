import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  Shield,
  Code,
  Globe,
  Terminal,
  Award,
  Users,
  ChevronRight,
  BookOpen,
  Zap,
  Star,
} from 'lucide-react';

const courses = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'Master HTML, CSS, JavaScript, React and modern UI frameworks.',
    icon: Code,
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-100 hover:border-blue-300',
    image: '/assets/generated/course-frontend.dim_600x300.png',
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Learn Node.js, Python, databases, APIs and server architecture.',
    icon: Terminal,
    color: 'bg-purple-50 text-purple-600',
    border: 'border-purple-100 hover:border-purple-300',
    image: '/assets/generated/course-backend.dim_600x300.png',
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    description: 'Combine frontend and backend skills to build complete applications.',
    icon: Globe,
    color: 'bg-cw-green-50 text-cw-green-600',
    border: 'border-cw-green-100 hover:border-cw-green-300',
    image: '/assets/generated/course-fullstack.dim_600x300.png',
  },
  {
    id: 'cybersecurity',
    title: 'Cyber Security',
    description: 'Protect systems and networks from digital attacks and vulnerabilities.',
    icon: Shield,
    color: 'bg-red-50 text-red-600',
    border: 'border-red-100 hover:border-red-300',
    image: '/assets/generated/course-cybersecurity.dim_600x300.png',
  },
  {
    id: 'ethicalhacking',
    title: 'Ethical Hacking',
    description: 'Learn penetration testing, vulnerability assessment and security auditing.',
    icon: Zap,
    color: 'bg-orange-50 text-orange-600',
    border: 'border-orange-100 hover:border-orange-300',
    image: '/assets/generated/course-ethicalhacking.dim_600x300.png',
  },
];

const stats = [
  { label: 'Students Enrolled', value: '12,000+', icon: Users },
  { label: 'Course Modules', value: '200+', icon: BookOpen },
  { label: 'Certificates Issued', value: '5,000+', icon: Award },
  { label: 'Expert Mentors', value: '50+', icon: Star },
];

const features = [
  {
    icon: '🤖',
    title: 'CyberMentor AI',
    description: 'Get instant, detailed answers to your tech questions from our advanced AI mentor.',
  },
  {
    icon: '🐍',
    title: 'In-Browser Python',
    description: 'Run Python code directly in your browser with our integrated Pyodide terminal.',
  },
  {
    icon: '🐧',
    title: 'Linux Terminal',
    description: 'Practice Linux commands in a safe, simulated environment without any setup.',
  },
  {
    icon: '📜',
    title: 'Certificates',
    description: 'Earn verifiable certificates upon completing each course track.',
  },
  {
    icon: '💬',
    title: 'Community Doubts',
    description: 'Post questions and get answers from peers and mentors in the community.',
  },
  {
    icon: '🚀',
    title: 'Project Showcase',
    description: 'Share your projects and get feedback from the CyberWorld community.',
  },
];

export default function HomePage() {
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    setLogoLoaded(true);
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Logo */}
          <div
            className={`flex justify-center mb-8 transition-all duration-700 ${
              logoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cw-green-200/40 blur-2xl scale-150 animate-pulse-ring" />
              <img
                src="/assets/image.png"
                alt="CyberWorld Logo"
                className="relative h-32 w-32 object-contain drop-shadow-xl animate-float"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/assets/generated/cyberworld-logo.dim_400x120.png';
                }}
              />
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-gradient-green">Cyber</span>
            <span className="text-cw-green-800">World</span>
          </h1>
          <p className="text-xl sm:text-2xl text-cw-green-700 font-medium mb-3">
            Learn. Build. Secure. Innovate.
          </p>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto mb-4">
            The premier platform for aspiring developers and cybersecurity professionals. Master
            in-demand skills with hands-on projects, AI mentorship, and a thriving community.
          </p>

          {/* Founder credit */}
          <p className="text-sm text-cw-green-600 font-medium mb-8">
            🌟 Founded by <span className="font-bold text-cw-green-700">Asif Parwez</span> · ESTD 2026
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cw-green-600 hover:bg-cw-green-700 text-white font-semibold rounded-xl shadow-green-md transition-all duration-200 hover:shadow-green-lg hover:-translate-y-0.5"
            >
              <BookOpen size={20} />
              Explore Courses
              <ChevronRight size={18} />
            </Link>
            <Link
              to="/mentor"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-cw-green-50 text-cw-green-700 font-semibold rounded-xl border-2 border-cw-green-200 shadow-card transition-all duration-200 hover:border-cw-green-400 hover:-translate-y-0.5"
            >
              🤖 Ask CyberMentor
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 bg-white/80 backdrop-blur-sm border-y border-cw-green-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-cw-green-50 rounded-lg">
                    <stat.icon size={20} className="text-cw-green-600" />
                  </div>
                </div>
                <p className="font-heading text-2xl font-bold text-cw-green-700">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-white to-cw-green-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-cw-green-100 text-cw-green-700 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">
              Course Tracks
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Five comprehensive tracks designed to take you from beginner to professional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to="/courses/$courseId"
                params={{ courseId: course.id }}
                className={`group bg-white rounded-2xl border-2 ${course.border} shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
              >
                <div className="h-36 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className={`inline-flex p-2 rounded-lg ${course.color} mb-3`}>
                    <course.icon size={18} />
                  </div>
                  <h3 className="font-heading font-semibold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{course.description}</p>
                  <div className="mt-4 flex items-center text-cw-green-600 text-sm font-medium">
                    Start Learning{' '}
                    <ChevronRight
                      size={16}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cw-green-600 hover:bg-cw-green-700 text-white font-semibold rounded-xl shadow-green-sm transition-all duration-200"
            >
              View All Courses <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-cw-green-100 text-cw-green-700 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">
              Platform Features
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Everything You Need to Succeed
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-cw-green-50/50 rounded-2xl border border-cw-green-100 hover:bg-cw-green-50 hover:border-cw-green-200 transition-all duration-200"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-heading font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-cw-green-600 to-cw-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-cw-green-100 text-lg mb-8">
            Join thousands of students already learning on CyberWorld.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cw-green-700 font-bold rounded-xl hover:bg-cw-green-50 transition-all duration-200 shadow-lg"
            >
              Get Started Free <ChevronRight size={18} />
            </Link>
            <Link
              to="/mentor"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cw-green-500/30 text-white font-semibold rounded-xl border border-white/30 hover:bg-cw-green-500/50 transition-all duration-200"
            >
              🤖 Try CyberMentor AI
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
