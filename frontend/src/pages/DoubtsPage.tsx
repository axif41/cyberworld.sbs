import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus, Search, MessageSquare, ThumbsUp, Clock, Tag } from 'lucide-react';

interface Doubt {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  upvotes: number;
  replies: number;
  timestamp: string;
  solved: boolean;
}

const sampleDoubts: Doubt[] = [
  {
    id: '1',
    title: 'How does useEffect cleanup work in React?',
    description:
      'I am confused about when the cleanup function in useEffect runs. Can someone explain with examples?',
    author: 'Rahul Kumar',
    category: 'Frontend',
    tags: ['React', 'Hooks', 'JavaScript'],
    upvotes: 24,
    replies: 8,
    timestamp: '2 hours ago',
    solved: true,
  },
  {
    id: '2',
    title: 'SQL Injection prevention in Node.js',
    description:
      'What are the best practices to prevent SQL injection attacks when using MySQL with Node.js?',
    author: 'Priya Singh',
    category: 'Cyber Security',
    tags: ['SQL', 'Node.js', 'Security'],
    upvotes: 18,
    replies: 5,
    timestamp: '5 hours ago',
    solved: false,
  },
  {
    id: '3',
    title: 'Difference between TCP and UDP protocols',
    description:
      'Can someone explain the key differences between TCP and UDP and when to use each?',
    author: 'Ahmed Ali',
    category: 'Networking',
    tags: ['TCP', 'UDP', 'Networking'],
    upvotes: 31,
    replies: 12,
    timestamp: '1 day ago',
    solved: true,
  },
  {
    id: '4',
    title: 'How to set up Metasploit on Kali Linux?',
    description:
      'I am new to ethical hacking and need help setting up Metasploit framework on Kali Linux.',
    author: 'Vikram Sharma',
    category: 'Ethical Hacking',
    tags: ['Metasploit', 'Kali Linux', 'Pentest'],
    upvotes: 15,
    replies: 7,
    timestamp: '2 days ago',
    solved: false,
  },
];

const categories = [
  'All',
  'Frontend',
  'Backend',
  'Cyber Security',
  'Ethical Hacking',
  'Networking',
  'Linux',
];

export default function DoubtsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [newDoubt, setNewDoubt] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    tags: '',
  });

  const filtered = sampleDoubts.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || d.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-cw-green-50/40 to-white">
      {/* Header */}
      <div className="bg-white border-b border-cw-green-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-gray-800 mb-1">
                Community Doubts
              </h1>
              <p className="text-gray-500 text-sm">Ask questions, share knowledge, grow together.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-2.5 bg-cw-green-600 hover:bg-cw-green-700 text-white font-semibold rounded-xl shadow-green-sm transition-all"
            >
              <Plus size={18} />
              Ask a Doubt
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-cw-green-200 shadow-card p-6 mb-8">
            <h2 className="font-heading font-semibold text-gray-800 mb-4">Post Your Doubt</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title of your doubt..."
                value={newDoubt.title}
                onChange={(e) => setNewDoubt({ ...newDoubt, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-cw-green-200 bg-cw-green-50/30 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cw-green-300"
              />
              <textarea
                placeholder="Describe your doubt in detail..."
                value={newDoubt.description}
                onChange={(e) => setNewDoubt({ ...newDoubt, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-cw-green-200 bg-cw-green-50/30 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cw-green-300 resize-none"
              />
              <div className="flex gap-4">
                <select
                  value={newDoubt.category}
                  onChange={(e) => setNewDoubt({ ...newDoubt, category: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl border border-cw-green-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cw-green-300"
                >
                  {categories.slice(1).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={newDoubt.tags}
                  onChange={(e) => setNewDoubt({ ...newDoubt, tags: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl border border-cw-green-200 bg-cw-green-50/30 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cw-green-300"
                />
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 bg-cw-green-600 hover:bg-cw-green-700 text-white font-semibold rounded-xl text-sm transition-all">
                  Post Doubt
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doubts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-cw-green-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cw-green-300"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-cw-green-600 text-white'
                    : 'bg-white text-gray-600 border border-cw-green-200 hover:bg-cw-green-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Doubts List */}
        <div className="space-y-4">
          {filtered.map((doubt) => (
            <Link
              key={doubt.id}
              to="/doubts/$doubtId"
              params={{ doubtId: doubt.id }}
              className="block bg-white rounded-2xl border border-cw-green-100 shadow-card hover:shadow-card-hover hover:border-cw-green-200 transition-all duration-200 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {doubt.solved && (
                      <span className="text-xs px-2 py-0.5 bg-cw-green-100 text-cw-green-700 rounded-full font-medium">
                        ✓ Solved
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      {doubt.category}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-gray-800 mb-1 hover:text-cw-green-700 transition-colors">
                    {doubt.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{doubt.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {doubt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 text-xs px-2 py-0.5 bg-cw-green-50 text-cw-green-600 rounded-full border border-cw-green-100"
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={12} />
                      {doubt.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} />
                      {doubt.replies}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} />
                    {doubt.timestamp}
                  </div>
                  <p className="text-xs text-gray-400">by {doubt.author}</p>
                </div>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400">No doubts found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
