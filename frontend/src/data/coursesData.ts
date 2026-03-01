export interface Slide {
  title: string;
  content: string;
  type: 'intro' | 'concept' | 'code' | 'list' | 'summary';
  code?: string;
  language?: string;
  bullets?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  hasCode?: boolean;
  codeType?: 'python' | 'javascript' | 'html' | 'linux' | 'none';
  slides: Slide[];
}

export interface Course {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  image: string;
  color: string;
  icon: string;
  level: string;
  duration: string;
  modules: Module[];
  skills: string[];
}

export const COURSES: Course[] = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    shortTitle: 'Frontend',
    description: 'Master HTML, CSS, JavaScript, React and build stunning web interfaces.',
    longDescription: 'Become a professional Frontend Developer by mastering the core technologies of the web. Learn HTML5, CSS3, JavaScript ES6+, React, and modern tooling to build responsive, accessible, and performant web applications.',
    image: '/assets/generated/course-frontend.dim_600x300.png',
    color: 'neon-cyan',
    icon: '⚡',
    level: 'Beginner to Advanced',
    duration: '6 months',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'TypeScript', 'Tailwind CSS', 'Git'],
    modules: [
      {
        id: 'html-basics',
        title: 'HTML5 Fundamentals',
        description: 'Learn the building blocks of the web with semantic HTML5.',
        duration: '2 weeks',
        hasCode: true,
        codeType: 'html',
        slides: [
          {
            title: 'Welcome to HTML5',
            type: 'intro',
            content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. HTML5 is the latest version, introducing semantic elements, multimedia support, and powerful APIs.',
            bullets: ['HTML defines the structure of web content', 'HTML5 introduced semantic elements like <header>, <nav>, <main>', 'Every web page starts with <!DOCTYPE html>', 'HTML works alongside CSS (styling) and JavaScript (behavior)']
          },
          {
            title: 'Document Structure',
            type: 'code',
            content: 'Every HTML document follows a standard structure. The DOCTYPE declaration tells the browser which version of HTML to use.',
            code: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n    <p>This is my first web page.</p>\n  </body>\n</html>`,
            language: 'html'
          },
          {
            title: 'Semantic HTML Elements',
            type: 'list',
            content: 'Semantic HTML elements clearly describe their meaning to both the browser and the developer.',
            bullets: ['<header> - Introductory content or navigation', '<nav> - Navigation links', '<main> - Main content of the document', '<article> - Self-contained content', '<section> - Thematic grouping of content', '<aside> - Content tangentially related to main', '<footer> - Footer for a section or page', '<figure> & <figcaption> - Images with captions']
          },
          {
            title: 'Forms and Input',
            type: 'code',
            content: 'HTML forms allow users to input data. HTML5 introduced many new input types for better user experience.',
            code: `<form action="/submit" method="POST">\n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email" required>\n  \n  <label for="password">Password:</label>\n  <input type="password" id="password" name="password">\n  \n  <label for="course">Course:</label>\n  <select id="course" name="course">\n    <option value="frontend">Frontend</option>\n    <option value="backend">Backend</option>\n  </select>\n  \n  <button type="submit">Register</button>\n</form>`,
            language: 'html'
          },
          {
            title: 'HTML5 APIs Overview',
            type: 'summary',
            content: 'HTML5 introduced powerful browser APIs that enable rich web applications.',
            bullets: ['Canvas API - Draw graphics with JavaScript', 'Web Storage API - localStorage and sessionStorage', 'Geolocation API - Get user location', 'Drag and Drop API - Native drag-and-drop', 'WebSockets - Real-time communication', 'Service Workers - Offline capabilities', 'Web Workers - Background processing']
          }
        ]
      },
      {
        id: 'css-mastery',
        title: 'CSS3 & Modern Styling',
        description: 'Master CSS3, Flexbox, Grid, animations, and responsive design.',
        duration: '3 weeks',
        hasCode: true,
        codeType: 'html',
        slides: [
          {
            title: 'CSS Box Model',
            type: 'concept',
            content: 'Every HTML element is a rectangular box. The CSS box model describes how these boxes are sized and spaced.',
            bullets: ['Content - The actual content (text, images)', 'Padding - Space between content and border', 'Border - A line around the padding', 'Margin - Space outside the border', 'box-sizing: border-box makes sizing intuitive']
          },
          {
            title: 'Flexbox Layout',
            type: 'code',
            content: 'Flexbox is a one-dimensional layout method for arranging items in rows or columns.',
            code: `.container {\n  display: flex;\n  justify-content: space-between; /* horizontal alignment */\n  align-items: center;           /* vertical alignment */\n  flex-wrap: wrap;               /* allow wrapping */\n  gap: 1rem;                     /* space between items */\n}\n\n.item {\n  flex: 1;          /* grow to fill space */\n  min-width: 200px; /* minimum width */\n}`,
            language: 'css'
          },
          {
            title: 'CSS Grid Layout',
            type: 'code',
            content: 'CSS Grid is a two-dimensional layout system for creating complex web layouts.',
            code: `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: auto;\n  gap: 20px;\n}\n\n/* Responsive grid */\n@media (max-width: 768px) {\n  .grid-container {\n    grid-template-columns: 1fr;\n  }\n}`,
            language: 'css'
          },
          {
            title: 'CSS Animations',
            type: 'code',
            content: 'CSS animations allow you to animate transitions between CSS styles.',
            code: `@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n\n.animated-element {\n  animation: fadeIn 0.5s ease-out forwards;\n}\n\n/* Hover transition */\n.button {\n  transition: all 0.3s ease;\n}\n.button:hover {\n  transform: scale(1.05);\n  box-shadow: 0 10px 30px rgba(0,0,0,0.2);\n}`,
            language: 'css'
          }
        ]
      },
      {
        id: 'javascript-es6',
        title: 'JavaScript ES6+',
        description: 'Modern JavaScript with ES6+ features, async/await, and DOM manipulation.',
        duration: '4 weeks',
        hasCode: true,
        codeType: 'javascript',
        slides: [
          {
            title: 'ES6+ Features Overview',
            type: 'intro',
            content: 'ES6 (ECMAScript 2015) and later versions introduced many powerful features that make JavaScript more expressive and easier to work with.',
            bullets: ['let and const - Block-scoped variables', 'Arrow functions - Concise function syntax', 'Template literals - String interpolation', 'Destructuring - Extract values from arrays/objects', 'Spread/Rest operators - Flexible function arguments', 'Modules - import/export syntax', 'Promises & async/await - Asynchronous programming']
          },
          {
            title: 'Arrow Functions & Destructuring',
            type: 'code',
            content: 'Arrow functions provide a concise syntax and lexical this binding.',
            code: `// Arrow functions\nconst add = (a, b) => a + b;\nconst greet = name => \`Hello, \${name}!\`;\n\n// Destructuring\nconst { name, age, city = 'Unknown' } = user;\nconst [first, second, ...rest] = array;\n\n// Spread operator\nconst merged = { ...obj1, ...obj2 };\nconst combined = [...arr1, ...arr2];\n\n// Default parameters\nconst createUser = (name, role = 'student') => ({ name, role });`,
            language: 'javascript'
          },
          {
            title: 'Promises & Async/Await',
            type: 'code',
            content: 'Async/await makes asynchronous code look and behave like synchronous code.',
            code: `// Promise\nfetch('/api/data')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));\n\n// Async/Await (cleaner)\nasync function fetchData() {\n  try {\n    const response = await fetch('/api/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n\n// Parallel requests\nconst [users, posts] = await Promise.all([\n  fetchUsers(),\n  fetchPosts()\n]);`,
            language: 'javascript'
          }
        ]
      },
      {
        id: 'react-fundamentals',
        title: 'React Fundamentals',
        description: 'Build dynamic UIs with React components, hooks, and state management.',
        duration: '5 weeks',
        hasCode: true,
        codeType: 'javascript',
        slides: [
          {
            title: 'React Core Concepts',
            type: 'intro',
            content: 'React is a JavaScript library for building user interfaces. It uses a component-based architecture and a virtual DOM for efficient updates.',
            bullets: ['Components - Reusable UI building blocks', 'JSX - JavaScript XML syntax', 'Props - Data passed to components', 'State - Component-internal data', 'Virtual DOM - Efficient rendering', 'Hooks - Functions for state and side effects', 'One-way data flow - Predictable state management']
          },
          {
            title: 'React Hooks',
            type: 'code',
            content: 'Hooks let you use state and other React features in functional components.',
            code: `import { useState, useEffect, useCallback } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  const [data, setData] = useState(null);\n\n  useEffect(() => {\n    // Runs after every render\n    document.title = \`Count: \${count}\`;\n    \n    // Cleanup function\n    return () => { document.title = 'App'; };\n  }, [count]); // Only re-run when count changes\n\n  const increment = useCallback(() => {\n    setCount(prev => prev + 1);\n  }, []);\n\n  return <button onClick={increment}>Count: {count}</button>;\n}`,
            language: 'javascript'
          }
        ]
      }
    ]
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    shortTitle: 'Backend',
    description: 'Build robust server-side applications with Node.js, databases, and APIs.',
    longDescription: 'Master backend development with Node.js, Express, databases (SQL & NoSQL), REST APIs, authentication, and deployment. Learn to build scalable, secure server-side applications.',
    image: '/assets/generated/course-backend.dim_600x300.png',
    color: 'neon-green',
    icon: '🖥️',
    level: 'Intermediate',
    duration: '6 months',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST APIs', 'JWT', 'Docker'],
    modules: [
      {
        id: 'nodejs-intro',
        title: 'Node.js Fundamentals',
        description: 'Learn server-side JavaScript with Node.js runtime.',
        duration: '3 weeks',
        hasCode: true,
        codeType: 'javascript',
        slides: [
          {
            title: 'What is Node.js?',
            type: 'intro',
            content: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine. It allows you to run JavaScript on the server side, enabling full-stack JavaScript development.',
            bullets: ['Event-driven, non-blocking I/O model', 'Single-threaded with event loop', 'NPM - largest package ecosystem', 'Perfect for real-time applications', 'Used by Netflix, LinkedIn, Uber, NASA']
          },
          {
            title: 'Node.js Core Modules',
            type: 'code',
            content: 'Node.js comes with built-in modules for common tasks.',
            code: `const fs = require('fs');\nconst path = require('path');\nconst http = require('http');\nconst os = require('os');\n\n// File system operations\nfs.readFile('data.txt', 'utf8', (err, data) => {\n  if (err) throw err;\n  console.log(data);\n});\n\n// Create HTTP server\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'text/plain' });\n  res.end('Hello from Node.js!');\n});\n\nserver.listen(3000, () => console.log('Server running on port 3000'));`,
            language: 'javascript'
          }
        ]
      },
      {
        id: 'express-apis',
        title: 'Express.js & REST APIs',
        description: 'Build RESTful APIs with Express.js framework.',
        duration: '4 weeks',
        hasCode: true,
        codeType: 'javascript',
        slides: [
          {
            title: 'REST API Design Principles',
            type: 'concept',
            content: 'REST (Representational State Transfer) is an architectural style for designing networked applications.',
            bullets: ['GET - Retrieve resources', 'POST - Create new resources', 'PUT/PATCH - Update resources', 'DELETE - Remove resources', 'Stateless - Each request is independent', 'Use HTTP status codes correctly', 'Version your APIs (/api/v1/)']
          },
          {
            title: 'Express.js Setup',
            type: 'code',
            content: 'Express.js is a minimal and flexible Node.js web application framework.',
            code: `const express = require('express');\nconst app = express();\n\napp.use(express.json());\n\n// Routes\napp.get('/api/users', async (req, res) => {\n  try {\n    const users = await User.findAll();\n    res.json({ success: true, data: users });\n  } catch (error) {\n    res.status(500).json({ success: false, error: error.message });\n  }\n});\n\napp.post('/api/users', async (req, res) => {\n  const { name, email } = req.body;\n  const user = await User.create({ name, email });\n  res.status(201).json({ success: true, data: user });\n});\n\napp.listen(3000, () => console.log('API running on port 3000'));`,
            language: 'javascript'
          }
        ]
      },
      {
        id: 'databases',
        title: 'Databases: SQL & NoSQL',
        description: 'Master PostgreSQL and MongoDB for data persistence.',
        duration: '4 weeks',
        hasCode: true,
        codeType: 'javascript',
        slides: [
          {
            title: 'SQL vs NoSQL',
            type: 'concept',
            content: 'Choosing the right database depends on your data structure and application requirements.',
            bullets: ['SQL (Relational): Structured data, ACID compliance, complex queries', 'NoSQL (Document): Flexible schema, horizontal scaling, JSON-like documents', 'PostgreSQL: Advanced SQL features, JSON support, excellent performance', 'MongoDB: Document-oriented, flexible schema, great for hierarchical data', 'Redis: In-memory, key-value store, perfect for caching and sessions']
          }
        ]
      }
    ]
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    shortTitle: 'Full Stack',
    description: 'Combine frontend and backend skills to build complete web applications.',
    longDescription: 'Become a complete Full Stack Developer by mastering both frontend and backend technologies. Learn to architect, build, and deploy complete web applications from scratch.',
    image: '/assets/generated/course-fullstack.dim_600x300.png',
    color: 'neon-purple',
    icon: '🔮',
    level: 'Intermediate to Advanced',
    duration: '9 months',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript', 'GraphQL'],
    modules: [
      {
        id: 'fullstack-architecture',
        title: 'Full Stack Architecture',
        description: 'Understand how frontend and backend work together.',
        duration: '2 weeks',
        hasCode: false,
        codeType: 'none',
        slides: [
          {
            title: 'Full Stack Architecture Overview',
            type: 'intro',
            content: 'A full stack application consists of multiple layers working together to deliver a complete user experience.',
            bullets: ['Client Layer - Browser, mobile app (React, Vue, Angular)', 'API Layer - REST or GraphQL endpoints (Express, FastAPI)', 'Business Logic Layer - Application rules and processing', 'Data Layer - Databases, caches, file storage', 'Infrastructure Layer - Servers, CDN, cloud services']
          },
          {
            title: 'MERN Stack',
            type: 'concept',
            content: 'MERN is a popular full stack combination: MongoDB, Express, React, Node.js.',
            bullets: ['MongoDB - NoSQL database for flexible data storage', 'Express.js - Backend web framework for Node.js', 'React - Frontend library for building UIs', 'Node.js - JavaScript runtime for server-side code', 'All JavaScript - One language across the entire stack', 'Large ecosystem and community support']
          }
        ]
      },
      {
        id: 'deployment',
        title: 'Deployment & DevOps',
        description: 'Deploy applications to production with Docker and cloud platforms.',
        duration: '3 weeks',
        hasCode: true,
        codeType: 'linux',
        slides: [
          {
            title: 'Docker Fundamentals',
            type: 'concept',
            content: 'Docker allows you to package applications and their dependencies into containers for consistent deployment.',
            bullets: ['Containers - Lightweight, portable application packages', 'Images - Templates for creating containers', 'Dockerfile - Instructions for building images', 'Docker Compose - Multi-container applications', 'Registry - Store and share Docker images', 'Kubernetes - Container orchestration at scale']
          },
          {
            title: 'CI/CD Pipeline',
            type: 'list',
            content: 'Continuous Integration and Continuous Deployment automate the software delivery process.',
            bullets: ['Code Push → Trigger CI pipeline', 'Run automated tests (unit, integration, e2e)', 'Build Docker image', 'Push to container registry', 'Deploy to staging environment', 'Run smoke tests', 'Deploy to production', 'Monitor and alert']
          }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cyber Security',
    shortTitle: 'Cyber Security',
    description: 'Learn to protect systems, networks, and data from digital attacks.',
    longDescription: 'Master the fundamentals of cybersecurity including network security, cryptography, vulnerability assessment, incident response, and security best practices for modern systems.',
    image: '/assets/generated/course-cybersecurity.dim_600x300.png',
    color: 'neon-green',
    icon: '🛡️',
    level: 'Intermediate',
    duration: '8 months',
    skills: ['Network Security', 'Cryptography', 'Linux', 'Firewalls', 'SIEM', 'Incident Response', 'Compliance'],
    modules: [
      {
        id: 'security-fundamentals',
        title: 'Security Fundamentals',
        description: 'Core concepts of information security and the CIA triad.',
        duration: '2 weeks',
        hasCode: true,
        codeType: 'linux',
        slides: [
          {
            title: 'The CIA Triad',
            type: 'intro',
            content: 'The CIA Triad is the foundation of information security. Every security decision should be evaluated against these three principles.',
            bullets: ['Confidentiality - Only authorized users can access data', 'Integrity - Data is accurate and has not been tampered with', 'Availability - Systems and data are accessible when needed', 'Authentication - Verifying identity of users/systems', 'Authorization - Controlling what authenticated users can do', 'Non-repudiation - Cannot deny performing an action']
          },
          {
            title: 'Common Attack Vectors',
            type: 'list',
            content: 'Understanding how attackers operate is essential for building effective defenses.',
            bullets: ['Phishing - Social engineering via email/messages', 'SQL Injection - Malicious SQL in input fields', 'XSS (Cross-Site Scripting) - Injecting scripts into web pages', 'CSRF - Forging requests from authenticated users', 'Man-in-the-Middle - Intercepting communications', 'DDoS - Overwhelming systems with traffic', 'Zero-Day Exploits - Unknown vulnerabilities', 'Ransomware - Encrypting data for ransom']
          },
          {
            title: 'Defense in Depth',
            type: 'concept',
            content: 'Defense in Depth is a security strategy that uses multiple layers of security controls.',
            bullets: ['Physical Security - Secure physical access to hardware', 'Network Security - Firewalls, IDS/IPS, VPNs', 'Host Security - OS hardening, antivirus, EDR', 'Application Security - Secure coding, WAF, SAST/DAST', 'Data Security - Encryption, DLP, access controls', 'Identity Security - MFA, PAM, zero trust']
          }
        ]
      },
      {
        id: 'network-security',
        title: 'Network Security',
        description: 'Secure networks with firewalls, IDS/IPS, and VPNs.',
        duration: '4 weeks',
        hasCode: true,
        codeType: 'linux',
        slides: [
          {
            title: 'Network Security Fundamentals',
            type: 'intro',
            content: 'Network security involves protecting the usability and integrity of your network and data.',
            bullets: ['OSI Model - 7 layers of network communication', 'TCP/IP - Core internet protocols', 'Firewalls - Filter network traffic by rules', 'IDS/IPS - Detect and prevent intrusions', 'VPN - Encrypted tunnels for secure communication', 'DMZ - Demilitarized zone for public-facing services', 'Network segmentation - Isolate sensitive systems']
          },
          {
            title: 'Linux Network Commands',
            type: 'code',
            content: 'Essential Linux commands for network security analysis.',
            code: `# Check network interfaces\nifconfig -a\nip addr show\n\n# Check open ports\nnetstat -tulpn\nss -tulpn\n\n# Scan network (nmap)\nnmap -sV -p 1-1000 192.168.1.0/24\n\n# Check firewall rules\niptables -L -n -v\n\n# Capture packets\ntcpdump -i eth0 -n port 80\n\n# Check DNS\nnslookup google.com\ndig google.com`,
            language: 'bash'
          }
        ]
      },
      {
        id: 'cryptography',
        title: 'Cryptography Basics',
        description: 'Understand encryption, hashing, and PKI.',
        duration: '3 weeks',
        hasCode: true,
        codeType: 'linux',
        slides: [
          {
            title: 'Cryptography Fundamentals',
            type: 'intro',
            content: 'Cryptography is the practice of securing information by transforming it into an unreadable format.',
            bullets: ['Symmetric Encryption - Same key for encrypt/decrypt (AES)', 'Asymmetric Encryption - Public/private key pairs (RSA)', 'Hashing - One-way transformation (SHA-256, bcrypt)', 'Digital Signatures - Verify authenticity and integrity', 'PKI - Public Key Infrastructure for certificate management', 'TLS/SSL - Secure communication over networks']
          }
        ]
      }
    ]
  },
  {
    id: 'ethicalhacking',
    title: 'Ethical Hacking',
    shortTitle: 'Ethical Hacking',
    description: 'Learn penetration testing, vulnerability assessment, and ethical hacking techniques.',
    longDescription: 'Master ethical hacking and penetration testing. Learn to think like an attacker to better defend systems. Covers reconnaissance, exploitation, post-exploitation, and reporting.',
    image: '/assets/generated/course-ethicalhacking.dim_600x300.png',
    color: 'neon-green',
    icon: '💀',
    level: 'Advanced',
    duration: '10 months',
    skills: ['Kali Linux', 'Metasploit', 'Burp Suite', 'Nmap', 'Wireshark', 'Python', 'OSINT'],
    modules: [
      {
        id: 'ethical-hacking-intro',
        title: 'Introduction to Ethical Hacking',
        description: 'Understand the legal and ethical framework of penetration testing.',
        duration: '1 week',
        hasCode: true,
        codeType: 'linux',
        slides: [
          {
            title: 'What is Ethical Hacking?',
            type: 'intro',
            content: 'Ethical hacking (penetration testing) is the practice of testing computer systems, networks, or applications to find security vulnerabilities that a malicious hacker could exploit.',
            bullets: ['Always get written permission before testing', 'Stay within the defined scope', 'Report all findings to the client', 'Do not access data beyond what is necessary', 'Protect confidential information', 'CEH, OSCP, GPEN are key certifications']
          },
          {
            title: 'Penetration Testing Phases',
            type: 'list',
            content: 'A structured penetration test follows defined phases to ensure comprehensive coverage.',
            bullets: ['1. Reconnaissance - Gather information about the target', '2. Scanning - Identify open ports and services', '3. Enumeration - Extract detailed information', '4. Vulnerability Assessment - Find security weaknesses', '5. Exploitation - Attempt to exploit vulnerabilities', '6. Post-Exploitation - Maintain access, pivot', '7. Reporting - Document findings and recommendations']
          }
        ]
      },
      {
        id: 'reconnaissance',
        title: 'Reconnaissance & OSINT',
        description: 'Gather intelligence using passive and active reconnaissance techniques.',
        duration: '3 weeks',
        hasCode: true,
        codeType: 'linux',
        slides: [
          {
            title: 'Passive Reconnaissance',
            type: 'concept',
            content: 'Passive reconnaissance involves gathering information without directly interacting with the target system.',
            bullets: ['WHOIS lookups - Domain registration info', 'DNS enumeration - Subdomains, mail servers', 'Google Dorking - Advanced search operators', 'Shodan - Search engine for internet-connected devices', 'LinkedIn/Social Media - Employee information', 'Job postings - Technology stack clues', 'Wayback Machine - Historical website data']
          },
          {
            title: 'Active Reconnaissance with Nmap',
            type: 'code',
            content: 'Nmap is the most powerful network scanning tool used by security professionals.',
            code: `# Basic host discovery\nnmap -sn 192.168.1.0/24\n\n# Port scan with service detection\nnmap -sV -sC -p- target.com\n\n# OS detection\nnmap -O target.com\n\n# Aggressive scan\nnmap -A -T4 target.com\n\n# Scan specific ports\nnmap -p 22,80,443,3306 target.com\n\n# Save output\nnmap -oA scan_results target.com`,
            language: 'bash'
          }
        ]
      },
      {
        id: 'web-hacking',
        title: 'Web Application Hacking',
        description: 'Find and exploit web vulnerabilities: SQLi, XSS, CSRF, and more.',
        duration: '5 weeks',
        hasCode: true,
        codeType: 'linux',
        slides: [
          {
            title: 'OWASP Top 10',
            type: 'list',
            content: 'The OWASP Top 10 represents the most critical web application security risks.',
            bullets: ['A01: Broken Access Control', 'A02: Cryptographic Failures', 'A03: Injection (SQL, NoSQL, OS)', 'A04: Insecure Design', 'A05: Security Misconfiguration', 'A06: Vulnerable Components', 'A07: Authentication Failures', 'A08: Software & Data Integrity Failures', 'A09: Security Logging Failures', 'A10: Server-Side Request Forgery (SSRF)']
          },
          {
            title: 'SQL Injection',
            type: 'code',
            content: 'SQL injection is one of the most dangerous web vulnerabilities. Always use parameterized queries!',
            code: `# Testing for SQL injection\n# Vulnerable URL: /user?id=1\n\n# Basic test\ncurl "http://target.com/user?id=1'"\n\n# Boolean-based\ncurl "http://target.com/user?id=1 AND 1=1"\ncurl "http://target.com/user?id=1 AND 1=2"\n\n# Using sqlmap (automated)\nsqlmap -u "http://target.com/user?id=1" --dbs\nsqlmap -u "http://target.com/user?id=1" -D dbname --tables\n\n# Prevention: Use parameterized queries!\n# BAD:  "SELECT * FROM users WHERE id=" + userId\n# GOOD: "SELECT * FROM users WHERE id=?" with [userId]`,
            language: 'bash'
          }
        ]
      }
    ]
  }
];

export function getCourseById(id: string): Course | undefined {
  return COURSES.find(c => c.id === id);
}

export function getModuleById(courseId: string, moduleId: string): Module | undefined {
  const course = getCourseById(courseId);
  return course?.modules.find(m => m.id === moduleId);
}
