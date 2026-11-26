/**
 * ULTRA-SLICK 3D HOLOGRAPHIC VIP BADGE & AI COMPANION (Image 3 Replica)
 * - 3D Realistic Parallax Physics, Dynamic Holographic Rainbow Foil & Specular Glare
 * - 3D Flip Card to Inspect Back Side (Magnetic Strip + Biometric Fingerprint Scanner)
 * - Floating "CyberBot AI" Companion with Holographic HUD Ring & Interactive Dialogues
 */

(function () {
    // -------------------------------------------------------------------------
    // 1. 3D HOLOGRAPHIC VIP BADGE PHYSICS & INTERACTIVITY
    // -------------------------------------------------------------------------
    const badgeContainer = document.getElementById('vipBadgeContainer');
    const badgeWrap = document.getElementById('badgeStageWrap');

    if (badgeContainer && badgeWrap) {
        let isBadgeFlipped = false;

        // 3D Parallax Tilt with Cursor
        badgeWrap.addEventListener('mousemove', e => {
            if (isBadgeFlipped) return; // keep back face steady or tilt gently
            const rect = badgeContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -18; // max 18 deg
            const rotateY = ((x - centerX) / centerX) * 18;

            badgeContainer.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

            // Update CSS variables for specular glare and holographic foil angle
            const mousePercentX = (x / rect.width) * 100;
            const mousePercentY = (y / rect.height) * 100;
            badgeContainer.style.setProperty('--mouse-x', `${mousePercentX.toFixed(1)}%`);
            badgeContainer.style.setProperty('--mouse-y', `${mousePercentY.toFixed(1)}%`);

            const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
            badgeContainer.style.setProperty('--foil-deg', `${angle.toFixed(1)}deg`);
        });

        badgeWrap.addEventListener('mouseleave', () => {
            if (!isBadgeFlipped) {
                badgeContainer.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            }
        });

        // 3D Flip Toggle
        window.flipVipBadge = function () {
            isBadgeFlipped = !isBadgeFlipped;
            badgeContainer.classList.toggle('flipped', isBadgeFlipped);
            if (isBadgeFlipped) {
                badgeContainer.style.transform = 'perspective(1200px) rotateY(180deg)';
            } else {
                badgeContainer.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
            }
            if (window.playCyberSound) window.playCyberSound('beep');
        };

        const flipBtn = document.getElementById('badgeFlipBtn');
        if (flipBtn) flipBtn.addEventListener('click', window.flipVipBadge);

        // Biometric Fingerprint Scanner Authentication
        const fpBox = document.getElementById('fpScanner');
        const fpStatus = document.getElementById('fpStatus');
        let scanTimer = null;

        if (fpBox && fpStatus) {
            fpBox.addEventListener('mousedown', () => {
                fpBox.classList.add('scanning');
                fpStatus.textContent = 'SCANNING BIOMETRICS...';
                fpStatus.style.color = 'var(--cyan)';
                if (window.playCyberSound) window.playCyberSound('alarm');

                scanTimer = setTimeout(() => {
                    fpStatus.textContent = 'CLEARANCE GRANTED ✔';
                    fpStatus.style.color = 'var(--accent)';
                    if (window.playCyberSound) window.playCyberSound('success');
                }, 1600);
            });

            window.addEventListener('mouseup', () => {
                if (scanTimer) {
                    clearTimeout(scanTimer);
                    scanTimer = null;
                }
                fpBox.classList.remove('scanning');
                if (fpStatus.textContent !== 'CLEARANCE GRANTED ✔') {
                    fpStatus.textContent = 'HOLD TO AUTHENTICATE';
                    fpStatus.style.color = 'var(--text-muted)';
                }
            });
        }

        if (qrFrame) {
            qrFrame.addEventListener('click', () => {
                window.open('https://wa.me/918210457599', '_blank', 'noopener');
                triggerVcardAlert("OPENING SEC-PROFILE ↗");
            });
        }
    }
    // -------------------------------------------------------------------------
    // 2. ULTRA-SLICK 3D FLOATING AI COMPANION ("CyberBot AI" - Image 3)
    // -------------------------------------------------------------------------
    const botWidget = document.getElementById('aiCompanionWidget');
    const botAvatar = document.getElementById('aiBotAvatar');
    const speechBubble = document.getElementById('aiSpeechBubble');
    const bubbleText = document.getElementById('aiBubbleText');
    const bubbleClose = document.getElementById('aiBubbleClose');

    const DIALOGUES = {
        greet: "Greetings, Operator! I am CyberBot AI, Vivek's autonomous defense co-pilot. All perimeter defenses are operational.",
        whoami: "Vivek Gupta is a cybersecurity enthusiast and full-stack developer focusing on offensive/defensive web security, real-time architectures, and Java systems.",
        shield: "Holographic Cyber Shield Protocol activated! A geodesic barrier now envelops the 3D core.",
        defcon1: "RED ALERT! DEFCON 1 engaged. Real-time intrusion vectors are highlighted across the global attack map.",
        scan: "Initiating remote reconnaissance scan... Terminal is executing port probing modules.",
        skills: "Vivek's primary arsenal: Java, Node.js, Socket.IO, MongoDB, MySQL, Linux/Kali, and OWASP Top 10 security mitigation."
    };

    function setAiDialogue(text) {
        if (!bubbleText || !speechBubble) return;
        speechBubble.classList.remove('collapsed');
        bubbleText.textContent = '';
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                bubbleText.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 18);
            }
        }
        typeChar();
        if (window.playCyberSound) window.playCyberSound('beep');
    }

    if (botAvatar) {
        botAvatar.addEventListener('click', () => {
            if (speechBubble) {
                const isCollapsed = speechBubble.classList.contains('collapsed');
                if (isCollapsed) {
                    setAiDialogue(DIALOGUES.greet);
                } else {
                    speechBubble.classList.add('collapsed');
                }
            }
        });
    }

    if (bubbleClose) {
        bubbleClose.addEventListener('click', () => {
            if (speechBubble) speechBubble.classList.add('collapsed');
        });
    }

    // AI Companion Prompt Chips
    window.askAiCompanion = function (topic) {
        if (topic === 'whoami') {
            setAiDialogue(DIALOGUES.whoami);
        } else if (topic === 'skills') {
            setAiDialogue(DIALOGUES.skills);
        } else if (topic === 'shield') {
            setAiDialogue(DIALOGUES.shield);
            if (window.toggleCyberShield) window.toggleCyberShield(true);
        } else if (topic === 'defcon1') {
            setAiDialogue(DIALOGUES.defcon1);
            if (window.setCyberTheme) window.setCyberTheme('red');
        } else if (topic === 'scan') {
            setAiDialogue(DIALOGUES.scan);
            // Open terminal and type scan
            const termWin = document.getElementById('terminalWindow');
            if (termWin) termWin.classList.remove('minimized');
            const termInput = document.getElementById('termCliInput');
            if (termInput) {
                termInput.value = 'scan target.corp';
                const event = new KeyboardEvent('keydown', { key: 'Enter' });
                termInput.dispatchEvent(event);
            }
        }
    };

    // Initial warm greeting after boot sequence
    setTimeout(() => {
        setAiDialogue(DIALOGUES.greet);
    }, 2800);
})();

