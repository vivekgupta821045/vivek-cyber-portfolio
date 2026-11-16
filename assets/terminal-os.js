/**
 * MR. ROBOT / KALI TERMINAL OS ENGINE
 * - Draggable & Resizable Unix Terminal Window
 * - Interactive CLI with 15+ Commands & Cyber Tools (Nmap, Metasploit, CTF Decrypt)
 * - Web Audio API Sci-Fi Sound Synthesizer
 * - Real-Time Simulated Cyber Threat Telemetry Streamer
 */

(function () {
    // -------------------------------------------------------------------------
    // 1. WEB AUDIO API CYBER SOUND SYNTHESIZER
    // -------------------------------------------------------------------------
    let audioCtx = null;
    let isSoundMuted = false;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    window.playCyberSound = function (type) {
        if (isSoundMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        switch (type) {
            case 'key':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600 + Math.random() * 200, now);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            case 'beep':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.setValueAtTime(1320, now + 0.04);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;

            case 'alarm':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.linearRampToValueAtTime(880, now + 0.2);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
                break;

            case 'shieldOn':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(750, now + 0.35);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                break;

            case 'shieldOff':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(750, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
                break;

            case 'exploit':
                // Digital white noise burst
                const bufferSize = ctx.sampleRate * 0.15;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(1200, now);
                noise.connect(filter);
                filter.connect(gain);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                noise.start(now);
                break;

            case 'success':
                // Triad chord
                [523.25, 659.25, 783.99].forEach((freq, idx) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.type = 'sine';
                    o.frequency.setValueAtTime(freq, now + idx * 0.06);
                    g.gain.setValueAtTime(0.06, now + idx * 0.06);
                    g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.start(now + idx * 0.06);
                    o.stop(now + idx * 0.06 + 0.3);
                });
                break;
        }
    };

    // -------------------------------------------------------------------------
    // 2. DRAGGABLE & RESIZABLE TERMINAL WINDOW
    // -------------------------------------------------------------------------
    const termWin = document.getElementById('terminalWindow');
    const termBar = document.getElementById('termDragHandle');
    const termBody = document.getElementById('termOutput');
    const termInput = document.getElementById('termCliInput');
    const openTermBtn = document.getElementById('openTerminalBtn');

    if (termWin && termBar) {
        let isDraggingTerm = false;
        let termOffset = { x: 0, y: 0 };

        termBar.addEventListener('mousedown', e => {
            if (e.target.classList.contains('tdot')) return;
            isDraggingTerm = true;
            const rect = termWin.getBoundingClientRect();
            termOffset.x = e.clientX - rect.left;
            termOffset.y = e.clientY - rect.top;
        });

        window.addEventListener('mousemove', e => {
            if (!isDraggingTerm) return;
            let newX = e.clientX - termOffset.x;
            let newY = e.clientY - termOffset.y;

            // Constrain within screen
            newX = Math.max(10, Math.min(window.innerWidth - termWin.offsetWidth - 10, newX));
            newY = Math.max(50, Math.min(window.innerHeight - termWin.offsetHeight - 10, newY));

            termWin.style.left = newX + 'px';
            termWin.style.top = newY + 'px';
            termWin.style.right = 'auto';
            termWin.style.bottom = 'auto';
        });

        window.addEventListener('mouseup', () => {
            isDraggingTerm = false;
        });

        // Window Controls
        const btnClose = document.getElementById('termBtnClose');
        const btnMin = document.getElementById('termBtnMin');
        const btnMax = document.getElementById('termBtnMax');

        if (btnClose) {
            btnClose.addEventListener('click', () => {
                termWin.classList.add('minimized');
                if (openTermBtn) openTermBtn.classList.remove('active');
            });
        }

        if (btnMin) {
            btnMin.addEventListener('click', () => {
                termWin.classList.add('minimized');
                if (openTermBtn) openTermBtn.classList.remove('active');
            });
        }

        if (btnMax) {
            btnMax.addEventListener('click', () => {
                termWin.classList.toggle('fullscreen');
            });
        }

        if (openTermBtn) {
            openTermBtn.addEventListener('click', () => {
                const isMin = termWin.classList.contains('minimized');
                if (isMin) {
                    termWin.classList.remove('minimized');
                    openTermBtn.classList.add('active');
                    termInput.focus();
                } else {
                    termWin.classList.add('minimized');
                    openTermBtn.classList.remove('active');
                }
            });
        }
    }

    // -------------------------------------------------------------------------
    // 3. INTERACTIVE CLI COMMAND ENGINE
    // -------------------------------------------------------------------------
    const commandHistory = [];
    let historyIndex = -1;

    const COMMANDS = {
        help: () => `
[ VIVEK SEC-OS :: CYBER COMMAND MENU ]
======================================================
  whoami         - Operator credentials, dossier & clearance level
  skills         - Capabilities matrix across Security & Engineering
  projects       - Interactive list of deployed applications
  scan <target>  - Run simulated Nmap reconnaissance & CVE scan
  exploit        - Execute Metasploit penetration testing module
  cat flag.txt   - Capture The Flag (CTF) cryptographic cipher
  theme <mode>   - Switch theme: 'theme teal' or 'theme red'
  shield <on|off>- Deploy or disarm 3D holographic cyber defense shield
  threats        - Stream live cyber threat intercepts & honeypot logs
  audio <on|off> - Toggle synthesized cyber sound effects
  matrix         - Toggle Matrix digital rain overlay intensity
  clear          - Wipe the terminal output buffer
======================================================
Tip: Use UP/DOWN arrows for history, TAB to auto-complete.`,

        whoami: () => `
[ OPERATOR DOSSIER ]
------------------------------------------------------
  NAME         : Vivek Gupta
  CODENAME     : VK-0417 // SecOps
  ROLE         : Cybersecurity Enthusiast & Full-Stack Developer
  DEGREE       : B.Tech Computer Science Engineering
  INSTITUTE    : Arka Jain University (2023 - Present)
  CLEARANCE    : LEVEL 4 (Top Secret / DEFCON 1 Ready)
  SPECIALTY    : Web Sec, Penetration Testing, Real-Time Node.js & Socket.IO
  LOCATION     : India (Coordinates: 28.6139° N, 77.2090° E)
  STATUS       : ONLINE ● Open to Internships & Collaborations
------------------------------------------------------`,

        skills: () => `
[ CAPABILITIES & ARSENAL ]
------------------------------------------------------
  [SEC] Web App Security & OWASP Top 10   : [====================] 88%
  [DEV] Node.js / Express Architecture   : [=================== ] 85%
  [DEV] Advanced Java & OOP Systems       : [==================  ] 80%
  [SEC] Network Protocols & Packet Tracer : [==================  ] 82%
  [DAT] MongoDB & Scalable NoSQL Store   : [================    ] 75%
  [DAT] MySQL Relational DB & Triggers    : [================    ] 75%
  [RT ] Socket.IO Real-Time Engine        : [=================== ] 86%
  [OPS] Git, Linux / Kali, CI/CD Deploy   : [====================] 90%
------------------------------------------------------`,

        projects: () => `
[ DEPLOYED APPLICATIONS ]
------------------------------------------------------
  1. Real-Time Chat & User Tracking System
     Stack: Node.js, Socket.IO, MongoDB, HTML5
     URL  : https://vivekgupta821045.github.io/Real-Time-Chat-and-User-Tracking-System/
  
  2. Medislot Healthcare Appointment Engine
     Stack: Node.js, Express, MySQL, REST APIs
     Focus: Secure patient data scheduling & HIPAA-aware endpoints

  3. Cyber Security Operations Portfolio
     Stack: Three.js 3D WebGL, Holographic Glass, Hacker CLI
     Features: 3D Earth, Attack Arcs, Kali OS, Floating AI Companion

  4. Library Management Core (Desktop)
     Stack: Java, MySQL JDBC, Transaction Security
------------------------------------------------------`,

        scan: (target) => {
            target = target || 'target.corp';
            return `
[+] Starting Nmap 7.94 Reconnaissance Scan on [${target}]...
[+] Scanning 1,000 standard ports with TCP SYN stealth stealth mode...
[+] [========================================] 100% COMPLETE

PORT      STATE  SERVICE       VERSION
-------------------------------------------------------
22/tcp    open   ssh           OpenSSH 9.2p1 (Debian)
80/tcp    open   http          Node.js Express Engine
443/tcp   open   ssl/https     Nginx 1.24 (TLSv1.3 AES-256-GCM)
3000/tcp  open   realtime-chat Socket.IO v4.7.2
27017/tcp open   mongodb       MongoDB Enterprise (Hardened)

[✓] Security Audit:
    - No unpatched remote code execution vulnerabilities found.
    - Rate limiter active (DDoS mitigation: ENABLED).
    - SSL Certificate: Valid (Issued by Let's Encrypt Authority X3).
    - Threat Risk Score: 0/100 (SECURE)`;
        },

        exploit: () => {
            if (window.playCyberSound) window.playCyberSound('exploit');
            return `
[!] Metasploit Framework Console (MSF 6.3.4)
[*] Loading exploit module: exploit/multi/http/jwt_token_bypass...
[*] Target host acquired: 127.0.0.1:3000
[*] Crafting cryptographic forged HMAC payload...
[*] Sending stage (1,492 bytes) to target...
[+] Meterpreter session 1 opened (127.0.0.1:4444 -> 127.0.0.1:58210)
[+] SYSTEM INTEGRITY COMPROMISED: Sandboxed virtual terminal spawned.
[✓] Simulation completed successfully. No actual target damaged.`;
        },

        'cat flag.txt': () => {
            if (window.playCyberSound) window.playCyberSound('success');
            return `
[ CTF CHALLENGE #404 DECRYPTED ]
------------------------------------------------------
Ciphertext : VklWRUtfR1VQVEFfe0NZQjNSX000U1QzUl8yMDI2fQ==
Algorithm  : Base64 Decoding + SHA-256 Hash Checksum
Result     : FLAG{V1V3K_GUPT4_CYB3R_M4ST3R_2026}
Points     : +500 PTS
Status     : CAPTURED ✔
------------------------------------------------------`;
        },

        flag: () => COMMANDS['cat flag.txt'](),

        threats: () => `
[ LIVE THREAT INTELLIGENCE STREAM ]
------------------------------------------------------
  [14:22:01] 185.220.101.4  -> NYC:443      [SYN FLOOD - MITIGATED]
  [14:22:04] 45.142.120.8   -> FRA:22       [SSH BRUTEFORCE BLOCKED]
  [14:22:08] 103.251.167.20 -> DEL:80       [SQLi DETECTED & QUARANTINED]
  [14:22:12] 91.240.118.154 -> SGP:3000     [DIR TRAVERSAL REJECTED]
  [14:22:15] 194.26.29.112  -> TYO:443      [DDOS PACKET DUMP DROP]
------------------------------------------------------`,

        theme: (arg) => {
            if (arg === 'red' || arg === 'defcon') {
                if (window.setCyberTheme) window.setCyberTheme('red');
                return `[!] DEFCON 1 RED ALERT THEME ACTIVATED. Telemetry HUD adjusted.`;
            } else if (arg === 'teal' || arg === 'green' || arg === 'cyber') {
                if (window.setCyberTheme) window.setCyberTheme('teal');
                return `[✓] CYBER TEAL MONITORING THEME ACTIVATED. Nominal state restored.`;
            }
            return `Usage: theme teal  OR  theme red`;
        },

        shield: (arg) => {
            if (arg === 'on') {
                if (window.toggleCyberShield) window.toggleCyberShield(true);
                return `[✓] 3D Holographic Cyber Shield: ARMED & ACTIVE.`;
            } else if (arg === 'off') {
                if (window.toggleCyberShield) window.toggleCyberShield(false);
                return `[!] 3D Holographic Cyber Shield: DISARMED.`;
            }
            const active = window.toggleCyberShield ? window.toggleCyberShield() : false;
            return active ? `[✓] Shield ARMED.` : `[!] Shield DISARMED.`;
        },

        audio: (arg) => {
            if (arg === 'off' || arg === 'mute') {
                isSoundMuted = true;
                return `[✓] Cyber audio muted.`;
            } else if (arg === 'on') {
                isSoundMuted = false;
                if (window.playCyberSound) window.playCyberSound('beep');
                return `[✓] Cyber audio synthesized online.`;
            }
            isSoundMuted = !isSoundMuted;
            return isSoundMuted ? `[✓] Audio MUTED.` : `[✓] Audio UNMUTED.`;
        },

        matrix: () => {
            const m = document.getElementById('matrix');
            if (m) {
                const cur = parseFloat(m.style.opacity || '0.12');
                const next = cur > 0.2 ? 0.08 : 0.28;
                m.style.opacity = next;
                return `[✓] Matrix rain intensity set to ${Math.round(next * 100)}%.`;
            }
            return `[!] Matrix canvas not found.`;
        },

        clear: () => {
            if (termBody) termBody.innerHTML = '';
            return null;
        }
    };

    function appendOutput(html, type = '') {
        if (!termBody) return;
        const line = document.createElement('div');
        line.className = 'term-out-line ' + type;
        line.innerHTML = html;
        termBody.appendChild(line);
        termBody.scrollTop = termBody.scrollHeight;
    }

    function processCommand(rawInput) {
        const clean = rawInput.trim();
        if (!clean) return;

        commandHistory.push(clean);
        historyIndex = commandHistory.length;

        // Print entered command
        appendOutput(`<span class="term-input-prompt">vivek@sec-kali:~$</span> ${escapeHtml(clean)}`);

        if (window.playCyberSound) window.playCyberSound('key');

        const parts = clean.split(' ');
        const cmd = parts[0].toLowerCase();
        const arg = parts.slice(1).join(' ');

        // Check command matching
        if (COMMANDS[clean.toLowerCase()]) {
            const out = COMMANDS[clean.toLowerCase()](arg);
            if (out) appendOutput(out, 'success');
        } else if (COMMANDS[cmd]) {
            const out = COMMANDS[cmd](arg);
            if (out) appendOutput(out, 'cyan');
        } else {
            appendOutput(`zsh: command not found: ${clean}. Type 'help' for available tools.`, 'danger');
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    if (termInput) {
        termInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                processCommand(termInput.value);
                termInput.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    termInput.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    termInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    termInput.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const cur = termInput.value.toLowerCase().trim();
                const match = Object.keys(COMMANDS).find(c => c.startsWith(cur));
                if (match) termInput.value = match;
            } else {
                if (window.playCyberSound && Math.random() > 0.4) {
                    window.playCyberSound('key');
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // 4. REAL-TIME SIMULATED CYBER THREAT TELEMETRY FEED (IMAGE 2 HUD)
    // -------------------------------------------------------------------------
    const THREAT_LOGS = [
        { src: '185.220.101.4', dst: 'NYC:443', type: 'SYN FLOOD', status: 'BLOCKED' },
        { src: '45.142.120.8', dst: 'FRA:22', type: 'SSH BRUTE', status: 'BLOCKED' },
        { src: '103.251.167.20', dst: 'DEL:80', type: 'SQL INJECTION', status: 'QUARANTINED' },
        { src: '91.240.118.154', dst: 'SGP:3000', type: 'JWT BYPASS', status: 'DROPPED' },
        { src: '194.26.29.112', dst: 'TYO:443', type: 'API FUZZING', status: 'MITIGATED' },
        { src: '198.51.100.44', dst: 'LON:8443', type: 'XSS REFLECTED', status: 'FILTERED' },
        { src: '203.0.113.89', dst: 'SAO:443', type: 'ZERO-DAY PROBE', status: 'ISOLATED' }
    ];

    let threatCounter = 3137;
    const countEl = document.getElementById('threatCounterVal');
    const hudFeedEl = document.getElementById('hudThreatFeed');

    function emitThreatPulse() {
        threatCounter += Math.floor(Math.random() * 3) + 1;
        if (countEl) countEl.textContent = threatCounter.toLocaleString();

        const taskbarThreatEl = document.getElementById('taskbarThreatCount');
        if (taskbarThreatEl) taskbarThreatEl.textContent = threatCounter.toLocaleString() + ' THREATS';

        if (hudFeedEl) {
            const rand = THREAT_LOGS[Math.floor(Math.random() * THREAT_LOGS.length)];
            const time = new Date().toTimeString().split(' ')[0];
            const row = document.createElement('div');
            row.className = 'hud-feed-row blocked';
            row.innerHTML = `<span>[${time}] ${rand.type}</span><b>${rand.status}</b>`;
            hudFeedEl.prepend(row);
            if (hudFeedEl.children.length > 5) {
                hudFeedEl.removeChild(hudFeedEl.lastChild);
            }
        }

        // Randomize bar chart heights
        const bars = document.querySelectorAll('.hud-bar');
        bars.forEach(bar => {
            const h = 20 + Math.floor(Math.random() * 80);
            bar.style.height = h + '%';
        });
    }

    setInterval(emitThreatPulse, 3200);

    // Initial greeting in terminal
    appendOutput(`[ VIVEK GUPTA :: SECURITY OPERATIONS TERMINAL v4.2 ]`, 'success');
    appendOutput(`Kernel: Linux 6.8.0-kali-amd64 | Operator: VK-0417 | Status: ARMED`, 'cyan');
    appendOutput(`Type <span style="color:var(--accent);font-weight:700;">'help'</span> to inspect available cyber tools & commands.`, 'dim');
})();
