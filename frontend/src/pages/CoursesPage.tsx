import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Search, ChevronRight, Clock, BookOpen, Users, Star } from 'lucide-react';

const courses = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description:
      'Master HTML, CSS, JavaScript, React and modern UI frameworks to build stunning web interfaces.',
    image: '/assets/generated/course-frontend.dim_600x300.png',
    duration: '12 weeks',
    modules: 24,
    students: 3200,
    rating: 4.8,
    level: 'Beginner',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    color: 'border-blue-200 hover:border-blue-400',
    badge: 'bg-blue-50 text-blue-700',
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Learn Node.js, Python, databases, REST APIs and server-side architecture.',
    image: '/assets/generated/course-backend.dim_600x300.png',
    duration: '14 weeks',
    modules: 28,
    students: 2800,
    rating: 4.7,
    level: 'Intermediate',
    tags: ['Node.js', 'Python', 'SQL', 'APIs'],
    color: 'border-purple-200 hover:border-purple-400',
    badge: 'bg-purple-50 text-purple-700',
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    description:
      'Combine frontend and backend skills to build complete, production-ready applications.',
    image: '/assets/generated/course-fullstack.dim_600x300.png',
    duration: '20 weeks',
    modules: 40,
    students: 4100,
    rating: 4.9,
    level: 'Intermediate',
    tags: ['React', 'Node.js', 'MongoDB', 'DevOps'],
    color: 'border-cw-green-200 hover:border-cw-green-400',
    badge: 'bg-cw-green-50 text-cw-green-700',
  },
  {
    id: 'cybersecurity',
    title: 'Cyber Security',
    description:
      'Protect systems and networks from digital attacks. Learn defense strategies and security protocols.',
    image: '/assets/generated/course-cybersecurity.dim_600x300.png',
    duration: '16 weeks',
    modules: 32,
    students: 2100,
    rating: 4.8,
    level: 'Intermediate',
    tags: ['Network Security', 'Cryptography', 'OWASP', 'Firewalls'],
    color: 'border-red-200 hover:border-red-400',
    badge: 'bg-red-50 text-red-700',
  },
  {
    id: 'ethicalhacking',
    title: 'Ethical Hacking',
    description:
      'Learn penetration testing, vulnerability assessment and security auditing techniques.',
    image: '/assets/generated/course-ethicalhacking.dim_600x300.png',
    duration: '18 weeks',
    modules: 36,
    students: 1900,
    rating: 4.9,
    level: 'Advanced',
    tags: ['Kali Linux', 'Metasploit', 'Nmap', 'CTF'],
    color: 'border-orange-200 hover:border-orange-400',
    badge: 'bg-orange-50 text-orange-700',
  },
];

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchLevel = levelFilter === 'All' || c.level === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-cw-green-50/40 to-white">
      {/* Header */}
      <div className="bg-white border-b border-cw-green-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <span className="inline-block px-3 py-1 bg-cw-green-100 text-cw-green-700 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">
            Learning Tracks
          </span>
          <h1 className="font-heading text-4xl font-bold text-gray-800 mb-3">
            Explore Our Courses
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Five comprehensive tracks designed by industry experts to take you from beginner to
            professional.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-cw-green-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cw-green-300 focus:border-cw-green-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  levelFilter === level
                    ? 'bg-cw-green-600 text-white shadow-green-sm'
                    : 'bg-white text-gray-600 border border-cw-green-200 hover:bg-cw-green-50 hover:text-cw-green-700'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Link
              key={course.id}
              to="/courses/$courseId"
              params={{ courseId: course.id }}
              className={`group bg-white rounded-2xl border-2 ${course.color} shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${course.badge}`}>
                    {course.level}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={13} className="fill-amber-400" />
                    <span className="text-xs font-medium text-gray-600">{course.rating}</span>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {course.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen size={12} />
                    {course.modules} modules
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    {course.students.toLocaleString()}
                  </div>
                </div>

                <div className="mt-4 flex items-center text-cw-green-600 text-sm font-semibold">
                  Start Learning
                  <ChevronRight
                    size={16}
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No courses found matching your search.</p>
            <button
              onClick={() => {
                setSearch('');
                setLevelFilter('All');
              }}
              className="mt-4 text-cw-green-600 hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
