export interface FileSystemNode {
  type: 'file' | 'dir';
  content?: string;
  children?: Record<string, FileSystemNode>;
}

export interface TerminalState {
  cwd: string;
  filesystem: FileSystemNode;
  history: string[];
}

const initialFilesystem: FileSystemNode = {
  type: 'dir',
  children: {
    home: {
      type: 'dir',
      children: {
        student: {
          type: 'dir',
          children: {
            Desktop: { type: 'dir', children: {} },
            Documents: {
              type: 'dir',
              children: {
                'notes.txt': { type: 'file', content: 'CyberWorld Security Notes\n========================\nAlways patch your systems!\nUse strong passwords.\nEnable MFA everywhere.' },
                'readme.md': { type: 'file', content: '# Welcome to CyberWorld Linux Terminal\n\nThis is a simulated Linux environment for learning.\nTry commands like: ls, cd, cat, pwd, whoami' }
              }
            },
            Downloads: { type: 'dir', children: {} },
            '.bashrc': { type: 'file', content: '# .bashrc\nexport PATH=$PATH:/usr/local/bin\nalias ll="ls -la"\nalias grep="grep --color=auto"' },
            '.ssh': {
              type: 'dir',
              children: {
                'known_hosts': { type: 'file', content: '# SSH known hosts file\n192.168.1.1 ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAB...' }
              }
            }
          }
        }
      }
    },
    etc: {
      type: 'dir',
      children: {
        'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nstudent:x:1000:1000:CyberWorld Student,,,:/home/student:/bin/bash' },
        'hosts': { type: 'file', content: '127.0.0.1\tlocalhost\n127.0.1.1\tcyberworld\n::1\t\tlocalhost ip6-localhost ip6-loopback' },
        'os-release': { type: 'file', content: 'NAME="Kali GNU/Linux"\nVERSION="2024.1"\nID=kali\nID_LIKE=debian\nPRETTY_NAME="Kali GNU/Linux 2024.1"\nVERSION_ID="2024.1"' },
        'network': { type: 'dir', children: {} }
      }
    },
    var: {
      type: 'dir',
      children: {
        log: {
          type: 'dir',
          children: {
            'syslog': { type: 'file', content: 'Mar  1 10:00:01 cyberworld kernel: Linux version 6.6.0-kali1-amd64\nMar  1 10:00:02 cyberworld systemd[1]: Started System Logging Service.\nMar  1 10:00:05 cyberworld sshd[1234]: Server listening on 0.0.0.0 port 22.' },
            'auth.log': { type: 'file', content: 'Mar  1 10:05:01 cyberworld sshd[1234]: Accepted password for student from 192.168.1.100 port 54321 ssh2\nMar  1 10:05:01 cyberworld sshd[1234]: pam_unix(sshd:session): session opened for user student' }
          }
        }
      }
    },
    usr: {
      type: 'dir',
      children: {
        bin: { type: 'dir', children: {} },
        local: { type: 'dir', children: { bin: { type: 'dir', children: {} } } }
      }
    },
    tmp: { type: 'dir', children: {} }
  }
};

function getNode(fs: FileSystemNode, path: string): FileSystemNode | null {
  if (path === '/') return fs;
  const parts = path.split('/').filter(Boolean);
  let current: FileSystemNode = fs;
  for (const part of parts) {
    if (current.type !== 'dir' || !current.children?.[part]) return null;
    current = current.children[part];
  }
  return current;
}

function resolvePath(cwd: string, target: string): string {
  if (target.startsWith('/')) return normalizePath(target);
  if (target === '~') return '/home/student';
  if (target.startsWith('~/')) return normalizePath('/home/student/' + target.slice(2));
  return normalizePath(cwd + '/' + target);
}

function normalizePath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '..') resolved.pop();
    else if (part !== '.') resolved.push(part);
  }
  return '/' + resolved.join('/');
}

function getBasename(path: string): string {
  return path.split('/').filter(Boolean).pop() || '/';
}

const MAN_PAGES: Record<string, string> = {
  ls: 'LS(1)\n\nNAME\n       ls - list directory contents\n\nSYNOPSIS\n       ls [OPTION]... [FILE]...\n\nDESCRIPTION\n       List information about the FILEs (the current directory by default).\n\n       -a     do not ignore entries starting with .\n       -l     use a long listing format\n       -h     with -l, print sizes in human readable format',
  cd: 'CD(1)\n\nNAME\n       cd - change the shell working directory\n\nSYNOPSIS\n       cd [dir]\n\nDESCRIPTION\n       Change the current directory to dir. The default dir is the value of the HOME shell variable.',
  cat: 'CAT(1)\n\nNAME\n       cat - concatenate files and print on the standard output\n\nSYNOPSIS\n       cat [OPTION]... [FILE]...\n\nDESCRIPTION\n       Concatenate FILE(s) to standard output.',
  pwd: 'PWD(1)\n\nNAME\n       pwd - print name of current/working directory\n\nSYNOPSIS\n       pwd\n\nDESCRIPTION\n       Print the full filename of the current working directory.',
  echo: 'ECHO(1)\n\nNAME\n       echo - display a line of text\n\nSYNOPSIS\n       echo [STRING]...\n\nDESCRIPTION\n       Echo the STRING(s) to standard output.',
  mkdir: 'MKDIR(1)\n\nNAME\n       mkdir - make directories\n\nSYNOPSIS\n       mkdir [OPTION]... DIRECTORY...\n\nDESCRIPTION\n       Create the DIRECTORY(ies), if they do not already exist.',
  rm: 'RM(1)\n\nNAME\n       rm - remove files or directories\n\nSYNOPSIS\n       rm [OPTION]... [FILE]...\n\nDESCRIPTION\n       Remove (unlink) the FILE(s).\n\n       -r, -R  remove directories and their contents recursively\n       -f      ignore nonexistent files, never prompt',
  whoami: 'WHOAMI(1)\n\nNAME\n       whoami - print effective userid\n\nSYNOPSIS\n       whoami\n\nDESCRIPTION\n       Print the user name associated with the current effective user ID.',
  ifconfig: 'IFCONFIG(8)\n\nNAME\n       ifconfig - configure a network interface\n\nSYNOPSIS\n       ifconfig [interface]\n\nDESCRIPTION\n       Ifconfig is used to configure the kernel-resident network interfaces.',
  ping: 'PING(8)\n\nNAME\n       ping - send ICMP ECHO_REQUEST to network hosts\n\nSYNOPSIS\n       ping [-c count] destination\n\nDESCRIPTION\n       ping uses the ICMP protocol\'s mandatory ECHO_REQUEST datagram to elicit an ICMP ECHO_RESPONSE from a host.',
  nmap: 'NMAP(1)\n\nNAME\n       nmap - Network exploration tool and security / port scanner\n\nSYNOPSIS\n       nmap [Scan Type...] [Options] {target specification}\n\nDESCRIPTION\n       Nmap ("Network Mapper") is an open source tool for network exploration and security auditing.',
};

export function executeCommand(
  input: string,
  state: TerminalState
): { output: string; newState: TerminalState } {
  const trimmed = input.trim();
  if (!trimmed) return { output: '', newState: state };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const newState: TerminalState = {
    ...state,
    history: [...state.history, input],
    filesystem: JSON.parse(JSON.stringify(state.filesystem))
  };

  switch (cmd) {
    case 'pwd':
      return { output: state.cwd, newState };

    case 'whoami':
      return { output: 'student', newState };

    case 'ls': {
      const flags = args.filter(a => a.startsWith('-')).join('');
      const target = args.find(a => !a.startsWith('-')) || state.cwd;
      const path = resolvePath(state.cwd, target);
      const node = getNode(state.filesystem, path);
      if (!node) return { output: `ls: cannot access '${target}': No such file or directory`, newState };
      if (node.type === 'file') return { output: getBasename(path), newState };
      const children = node.children || {};
      const entries = Object.entries(children);
      const showHidden = flags.includes('a');
      const longFormat = flags.includes('l');
      const filtered = showHidden ? entries : entries.filter(([name]) => !name.startsWith('.'));
      if (longFormat) {
        const lines = ['total ' + filtered.length * 4];
        filtered.forEach(([name, n]) => {
          const isDir = n.type === 'dir';
          const perm = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
          const size = isDir ? '4096' : String((n.content?.length || 0) + 100);
          lines.push(`${perm}  1 student student ${size.padStart(6)} Mar  1 10:00 ${isDir ? '\x1b[34m' + name + '\x1b[0m' : name}`);
        });
        return { output: lines.join('\n'), newState };
      }
      const names = filtered.map(([name, n]) => n.type === 'dir' ? name + '/' : name);
      return { output: names.join('  '), newState };
    }

    case 'cd': {
      const target = args[0] || '~';
      const path = resolvePath(state.cwd, target);
      const node = getNode(state.filesystem, path);
      if (!node) return { output: `cd: ${target}: No such file or directory`, newState };
      if (node.type !== 'dir') return { output: `cd: ${target}: Not a directory`, newState };
      return { output: '', newState: { ...newState, cwd: path } };
    }

    case 'cat': {
      if (!args[0]) return { output: 'cat: missing operand', newState };
      const path = resolvePath(state.cwd, args[0]);
      const node = getNode(state.filesystem, path);
      if (!node) return { output: `cat: ${args[0]}: No such file or directory`, newState };
      if (node.type === 'dir') return { output: `cat: ${args[0]}: Is a directory`, newState };
      return { output: node.content || '', newState };
    }

    case 'echo': {
      const text = args.join(' ').replace(/^["']|["']$/g, '');
      return { output: text, newState };
    }

    case 'mkdir': {
      if (!args[0]) return { output: 'mkdir: missing operand', newState };
      const path = resolvePath(state.cwd, args[0]);
      const parentPath = path.split('/').slice(0, -1).join('/') || '/';
      const dirName = getBasename(path);
      const parent = getNode(newState.filesystem, parentPath);
      if (!parent || parent.type !== 'dir') return { output: `mkdir: cannot create directory '${args[0]}': No such file or directory`, newState };
      if (parent.children?.[dirName]) return { output: `mkdir: cannot create directory '${args[0]}': File exists`, newState };
      parent.children = parent.children || {};
      parent.children[dirName] = { type: 'dir', children: {} };
      return { output: '', newState };
    }

    case 'rm': {
      if (!args.length) return { output: 'rm: missing operand', newState };
      const target = args.find(a => !a.startsWith('-')) || '';
      if (!target) return { output: 'rm: missing operand', newState };
      const path = resolvePath(state.cwd, target);
      const parentPath = path.split('/').slice(0, -1).join('/') || '/';
      const name = getBasename(path);
      const parent = getNode(newState.filesystem, parentPath);
      if (!parent || !parent.children?.[name]) return { output: `rm: cannot remove '${target}': No such file or directory`, newState };
      const node = parent.children[name];
      if (node.type === 'dir' && !args.includes('-r') && !args.includes('-rf')) {
        return { output: `rm: cannot remove '${target}': Is a directory`, newState };
      }
      delete parent.children[name];
      return { output: '', newState };
    }

    case 'touch': {
      if (!args[0]) return { output: 'touch: missing file operand', newState };
      const path = resolvePath(state.cwd, args[0]);
      const parentPath = path.split('/').slice(0, -1).join('/') || '/';
      const fileName = getBasename(path);
      const parent = getNode(newState.filesystem, parentPath);
      if (!parent || parent.type !== 'dir') return { output: `touch: cannot touch '${args[0]}': No such file or directory`, newState };
      parent.children = parent.children || {};
      if (!parent.children[fileName]) {
        parent.children[fileName] = { type: 'file', content: '' };
      }
      return { output: '', newState };
    }

    case 'ifconfig': {
      const output = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)
        RX packets 12543  bytes 15234567 (14.5 MiB)
        TX packets 8921  bytes 1234567 (1.1 MiB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 1024  bytes 98765 (96.4 KiB)
        TX packets 1024  bytes 98765 (96.4 KiB)`;
      return { output, newState };
    }

    case 'ping': {
      const host = args.find(a => !a.startsWith('-')) || 'localhost';
      const count = args.includes('-c') ? parseInt(args[args.indexOf('-c') + 1]) || 4 : 4;
      const ip = host === 'localhost' ? '127.0.0.1' : `${Math.floor(Math.random() * 200 + 50)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const lines = [`PING ${host} (${ip}) 56(84) bytes of data.`];
      for (let i = 0; i < Math.min(count, 4); i++) {
        const time = (Math.random() * 20 + 1).toFixed(3);
        lines.push(`64 bytes from ${ip}: icmp_seq=${i + 1} ttl=64 time=${time} ms`);
      }
      lines.push(`\n--- ${host} ping statistics ---`);
      lines.push(`${Math.min(count, 4)} packets transmitted, ${Math.min(count, 4)} received, 0% packet loss`);
      return { output: lines.join('\n'), newState };
    }

    case 'man': {
      if (!args[0]) return { output: 'What manual page do you want?', newState };
      const page = MAN_PAGES[args[0].toLowerCase()];
      if (!page) return { output: `No manual entry for ${args[0]}`, newState };
      return { output: page, newState };
    }

    case 'uname': {
      if (args.includes('-a')) {
        return { output: 'Linux cyberworld 6.6.0-kali1-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.6.9-1kali1 (2024-01-08) x86_64 GNU/Linux', newState };
      }
      return { output: 'Linux', newState };
    }

    case 'id':
      return { output: 'uid=1000(student) gid=1000(student) groups=1000(student),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev)', newState };

    case 'ps': {
      const output = `  PID TTY          TIME CMD
    1 ?        00:00:01 systemd
  234 ?        00:00:00 sshd
  456 pts/0    00:00:00 bash
  789 pts/0    00:00:00 ps`;
      return { output, newState };
    }

    case 'history': {
      const lines = state.history.map((cmd, i) => `  ${String(i + 1).padStart(3)}  ${cmd}`);
      return { output: lines.join('\n') || 'No history', newState };
    }

    case 'clear':
      return { output: '\x1b[CLEAR]', newState };

    case 'help':
      return {
        output: `Available commands:
  ls [-la]     - List directory contents
  cd [dir]     - Change directory
  pwd          - Print working directory
  cat [file]   - Display file contents
  echo [text]  - Print text
  mkdir [dir]  - Create directory
  rm [-r] [f]  - Remove files/directories
  touch [file] - Create empty file
  whoami       - Print current user
  id           - Print user identity
  ifconfig     - Network interface info
  ping [host]  - Ping a host
  ps           - List processes
  uname [-a]   - System information
  history      - Command history
  man [cmd]    - Manual pages
  clear        - Clear terminal
  help         - Show this help`,
        newState
      };

    default:
      return {
        output: `bash: ${cmd}: command not found\nType 'help' for available commands`,
        newState
      };
  }
}

export function createInitialTerminalState(): TerminalState {
  return {
    cwd: '/home/student',
    filesystem: JSON.parse(JSON.stringify(initialFilesystem)),
    history: []
  };
}
