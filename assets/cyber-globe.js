/**
 * CYBER EARTH & ATTACK MATRIX 3D ENGINE (Three.js)
 * High-performance WebGL 3D Cyber Globe with:
 * - 7,000+ Land Matrix Particle Cloud
 * - Animated 3D Attack Vector Bezier Arcs with Traveling Data Packets
 * - Radiating Threat Target Rings
 * - Orbital Defense Satellites & Rings
 * - Geodesic Holographic Cyber Shield Mesh
 * - Scroll-linked 3D Camera / Rotation
 * - Mouse Parallax & Free-Orbit Drag Controls
 * - Dual Mode: Cyber Teal (Image 1) & DEFCON 1 Red Alert (Image 2)
 */

(function () {
    const wrap = document.getElementById('globe-canvas-wrap');
    if (!wrap) return;

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded. Waiting...');
        return;
    }

    const GLOBE_RADIUS = 125;
    let scene, camera, renderer;
    let globeGroup, pointsMesh, coreMesh, wireMesh, shieldMesh, atmosphereMesh;
    let attackCurves = [];
    let pulseParticles = [];
    let hotspotRings = [];
    let orbitalRings = [];
    let currentTheme = 'teal';
    let isShieldActive = false;

    // Mouse & Drag State
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };
    let userRotation = { x: 0.2, y: -0.8 };
    let scrollProgress = 0;

    // Colors
    const PALETTES = {
        teal: {
            points: 0x39ff9d,
            pointsAlt: 0x00d8f6,
            core: 0x020706,
            wire: 0x0b261d,
            arc: 0x00d8f6,
            pulse: 0x39ff9d,
            ring: 0x39ff9d,
            shield: 0x00d8f6,
            atmosphere: 0x00f5a0
        },
        red: {
            points: 0xff2a5f,
            pointsAlt: 0xff7b00,
            core: 0x0c0204,
            wire: 0x330a13,
            arc: 0xff2a5f,
            pulse: 0xffe600,
            ring: 0xff2a5f,
            shield: 0xff2a5f,
            atmosphere: 0xff2a5f
        }
    };

    function init() {
        // Scene setup
        scene = new THREE.Scene();

        // Camera setup
        const aspect = wrap.clientWidth / wrap.clientHeight;
        camera = new THREE.PerspectiveCamera(45, aspect, 1, 2000);
        camera.position.set(0, 0, 360);

        // WebGL Renderer with Alpha
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(wrap.clientWidth, wrap.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        wrap.appendChild(renderer.domElement);

        globeGroup = new THREE.Group();
        scene.add(globeGroup);

        buildCoreSphere();
        buildContinentParticles();
        buildAtmosphere();
        buildOrbitalRings();
        buildAttackVectors();
        buildCyberShield();

        setupEventListeners();
        animate();
    }

    // Helper: Generate procedural radial glow texture for dots
    function createDotTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.35, 'rgba(100,255,200,0.85)');
        grad.addColorStop(0.7, 'rgba(0,200,255,0.3)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    // 1. Dark Glass Core & Subtle Wireframe
    function buildCoreSphere() {
        const p = PALETTES[currentTheme];
        const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.99, 48, 48);
        const coreMat = new THREE.MeshBasicMaterial({
            color: p.core,
            transparent: true,
            opacity: 0.94
        });
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        globeGroup.add(coreMesh);

        // Longitude / Latitude subtle grid
        const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(GLOBE_RADIUS * 0.995, 24, 24));
        const wireMat = new THREE.LineBasicMaterial({
            color: p.wire,
            transparent: true,
            opacity: 0.35
        });
        wireMesh = new THREE.LineSegments(wireGeo, wireMat);
        globeGroup.add(wireMesh);
    }

    // 2. Continents Dot Cloud (7,187 high-precision points)
    function buildContinentParticles() {
        const p = PALETTES[currentTheme];
        const data = window.GLOBE_DATA;
        if (!data || !data.points) return;

        const pts = data.points;
        const count = pts.length;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color1 = new THREE.Color(p.points);
        const color2 = new THREE.Color(p.pointsAlt);

        for (let i = 0; i < count; i++) {
            const pt = pts[i];
            const r = GLOBE_RADIUS * 1.008;
            positions[i * 3] = pt[0] * r;
            positions[i * 3 + 1] = pt[1] * r;
            positions[i * 3 + 2] = pt[2] * r;

            // Gradient mix between primary & secondary
            const mixRatio = Math.sin(pt[1] * 3.0) * 0.5 + 0.5;
            const c = color1.clone().lerp(color2, mixRatio * 0.4);
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 2.8,
            map: createDotTexture(),
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.95
        });

        pointsMesh = new THREE.Points(geo, mat);
        globeGroup.add(pointsMesh);
    }

    // 3. Atmosphere Rim Glow
    function buildAtmosphere() {
        const p = PALETTES[currentTheme];
        const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.16, 48, 48);
        const atmosMat = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                uniform vec3 glowColor;
                void main() {
                    float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
                    gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.75;
                }
            `,
            uniforms: {
                glowColor: { value: new THREE.Color(p.atmosphere) }
            },
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });
        atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
        globeGroup.add(atmosphereMesh);
    }

    // 4. Orbital Satellites & Defense Rings
    function buildOrbitalRings() {
        const p = PALETTES[currentTheme];
        const ringDefs = [
            { radius: GLOBE_RADIUS * 1.34, rotX: 0.45, rotZ: 0.25, speed: 0.003 },
            { radius: GLOBE_RADIUS * 1.52, rotX: -0.6, rotZ: -0.3, speed: -0.002 }
        ];

        ringDefs.forEach((def, index) => {
            const curve = new THREE.EllipseCurve(0, 0, def.radius, def.radius, 0, 2 * Math.PI, false, 0);
            const pts = curve.getPoints(90);
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            const mat = new THREE.LineBasicMaterial({
                color: p.arc,
                transparent: true,
                opacity: 0.35,
                blending: THREE.AdditiveBlending
            });
            const ringLine = new THREE.LineLoop(geo, mat);
            ringLine.rotation.x = def.rotX;
            ringLine.rotation.z = def.rotZ;

            // Satellite node
            const satGeo = new THREE.SphereGeometry(2.0, 12, 12);
            const satMat = new THREE.MeshBasicMaterial({ color: p.pulse });
            const sat = new THREE.Mesh(satGeo, satMat);
            ringLine.add(sat);

            globeGroup.add(ringLine);
            orbitalRings.push({ line: ringLine, sat: sat, radius: def.radius, angle: index * 2.0, speed: def.speed });
        });
    }

    // 5. 3D Attack Vector Bezier Arcs (Image 1 & 2)
    function buildAttackVectors() {
        const p = PALETTES[currentTheme];
        const cities = window.GLOBE_DATA ? window.GLOBE_DATA.cities : null;
        if (!cities) return;

        // Clean existing
        attackCurves.forEach(item => globeGroup.remove(item.mesh));
        pulseParticles.forEach(p => globeGroup.remove(p.mesh));
        hotspotRings.forEach(r => globeGroup.remove(r.mesh));
        attackCurves = [];
        pulseParticles = [];
        hotspotRings = [];

        const cityKeys = Object.keys(cities);
        const pairs = [
            ["New York", "Frankfurt"],
            ["San Francisco", "Tokyo"],
            ["London", "Delhi/Mumbai"],
            ["Tokyo", "Singapore"],
            ["Frankfurt", "Delhi/Mumbai"],
            ["Delhi/Mumbai", "Tokyo"],
            ["Sydney", "San Francisco"],
            ["Sao Paulo", "London"],
            ["Dubai", "Frankfurt"],
            ["Seoul", "New York"]
        ];

        pairs.forEach((pair, idx) => {
            const c1 = cities[pair[0]];
            const c2 = cities[pair[1]];
            if (!c1 || !c2) return;

            const p1 = new THREE.Vector3(c1.pos[0], c1.pos[1], c1.pos[2]).multiplyScalar(GLOBE_RADIUS);
            const p2 = new THREE.Vector3(c2.pos[0], c2.pos[1], c2.pos[2]).multiplyScalar(GLOBE_RADIUS);

            // Compute arc mid point in 3D
            const mid = p1.clone().add(p2).multiplyScalar(0.5);
            const dist = p1.distanceTo(p2);
            const elevation = GLOBE_RADIUS + dist * 0.42;
            mid.normalize().multiplyScalar(elevation);

            const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
            const curvePts = curve.getPoints(50);
            const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
            const curveMat = new THREE.LineBasicMaterial({
                color: p.arc,
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending
            });
            const line = new THREE.Line(curveGeo, curveMat);
            globeGroup.add(line);
            attackCurves.push({ mesh: line, curve: curve });

            // Traveling Pulse Packet
            const pulseGeo = new THREE.SphereGeometry(2.2, 12, 12);
            const pulseMat = new THREE.MeshBasicMaterial({
                color: p.pulse,
                blending: THREE.AdditiveBlending
            });
            const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
            globeGroup.add(pulseMesh);

            pulseParticles.push({
                mesh: pulseMesh,
                curve: curve,
                t: (idx * 0.13) % 1.0,
                speed: 0.005 + (idx % 3) * 0.002
            });

            // Target Node Ripper Ring at Destination
            const ringGeo = new THREE.RingGeometry(1.2, 2.4, 24);
            const ringMat = new THREE.MeshBasicMaterial({
                color: p.ring,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.copy(p2);
            ring.lookAt(new THREE.Vector3(0, 0, 0));
            globeGroup.add(ring);

            hotspotRings.push({
                mesh: ring,
                basePos: p2.clone(),
                scale: 1.0,
                speed: 0.03 + (idx % 4) * 0.01
            });
        });
    }

    // 6. Holographic Geodesic Cyber Shield Mesh
    function buildCyberShield() {
        const p = PALETTES[currentTheme];
        const shieldGeo = new THREE.IcosahedronGeometry(GLOBE_RADIUS * 1.28, 2);
        const shieldMat = new THREE.MeshBasicMaterial({
            color: p.shield,
            wireframe: true,
            transparent: true,
            opacity: 0.0, // hidden until activated
            blending: THREE.AdditiveBlending
        });
        shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        globeGroup.add(shieldMesh);
    }

    // Public method: Toggle Shield
    window.toggleCyberShield = function (forceState) {
        if (typeof forceState === 'boolean') {
            isShieldActive = forceState;
        } else {
            isShieldActive = !isShieldActive;
        }

        if (shieldMesh) {
            shieldMesh.material.opacity = isShieldActive ? 0.45 : 0.0;
        }

        const btn = document.getElementById('shieldToggleBtn');
        if (btn) {
            btn.classList.toggle('active', isShieldActive);
            btn.innerHTML = isShieldActive ? '🛡️ SHIELD: ARMED' : '🛡️ DEPLOY SHIELD';
        }

        // Play audio feedback
        if (window.playCyberSound) {
            window.playCyberSound(isShieldActive ? 'shieldOn' : 'shieldOff');
        }

        return isShieldActive;
    };

    // Public method: Set Theme Mode (Teal vs DEFCON 1 Red)
    window.setCyberTheme = function (theme) {
        if (theme !== 'teal' && theme !== 'red') return;
        currentTheme = theme;
        document.body.classList.toggle('defcon-mode', theme === 'red');

        const p = PALETTES[theme];

        if (coreMesh) coreMesh.material.color.setHex(p.core);
        if (wireMesh) wireMesh.material.color.setHex(p.wire);
        if (atmosphereMesh) atmosphereMesh.material.uniforms.glowColor.value.setHex(p.atmosphere);
        if (shieldMesh) shieldMesh.material.color.setHex(p.shield);

        if (pointsMesh) {
            const count = pointsMesh.geometry.attributes.position.count;
            const colors = pointsMesh.geometry.attributes.color.array;
            const color1 = new THREE.Color(p.points);
            const color2 = new THREE.Color(p.pointsAlt);
            const pts = window.GLOBE_DATA.points;

            for (let i = 0; i < count; i++) {
                const pt = pts[i];
                const mixRatio = Math.sin(pt[1] * 3.0) * 0.5 + 0.5;
                const c = color1.clone().lerp(color2, mixRatio * 0.4);
                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;
            }
            pointsMesh.geometry.attributes.color.needsUpdate = true;
        }

        // Rebuild arcs with updated palette
        buildAttackVectors();

        // Update Theme Button
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.innerHTML = theme === 'red' ? '🚨 DEFCON 1: RED' : '🌐 TEAL CYBER';
        }

        if (window.playCyberSound) {
            window.playCyberSound(theme === 'red' ? 'alarm' : 'beep');
        }
    };

    // Event Listeners
    function setupEventListeners() {
        window.addEventListener('resize', onWindowResize);

        // Mouse Parallax
        window.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouse.targetX = x * 0.35;
            mouse.targetY = y * 0.35;
        });

        // 360° Drag Rotation on Globe Canvas
        const dom = renderer.domElement;
        dom.addEventListener('mousedown', e => {
            isDragging = true;
            prevMousePos = { x: e.clientX, y: e.clientY };
            dragVelocity = { x: 0, y: 0 };
        });

        window.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const deltaX = e.clientX - prevMousePos.x;
            const deltaY = e.clientY - prevMousePos.y;
            dragVelocity.x = deltaX * 0.005;
            dragVelocity.y = deltaY * 0.005;
            userRotation.y += dragVelocity.x;
            userRotation.x += dragVelocity.y;
            prevMousePos = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Scroll listener for camera and 3D angle transitions
        window.addEventListener('scroll', () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        });
    }

    function onWindowResize() {
        if (!wrap || !renderer || !camera) return;
        camera.aspect = wrap.clientWidth / wrap.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    }

    // Animation Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // 1. Mouse Lerp
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Drag inertia
        if (!isDragging) {
            userRotation.y += 0.0018; // auto orbit
            dragVelocity.x *= 0.95;
            dragVelocity.y *= 0.95;
            userRotation.y += dragVelocity.x;
            userRotation.x += dragVelocity.y;
        }

        // Clamp vertical rotation
        userRotation.x = Math.max(-1.1, Math.min(1.1, userRotation.x));

        // 2. Scroll-Linked Dynamic Camera Position & Angle
        // In Hero: Offset to right side on desktop
        const isDesktop = window.innerWidth > 1024;
        const targetGlobeX = isDesktop ? (scrollProgress < 0.25 ? 65 : (scrollProgress < 0.55 ? 0 : 50)) : 0;
        const targetGlobeY = scrollProgress < 0.25 ? 0 : (scrollProgress < 0.55 ? -10 : 0);
        const targetCamZ = scrollProgress < 0.25 ? 350 : (scrollProgress < 0.55 ? 290 : 360);

        globeGroup.position.x += (targetGlobeX - globeGroup.position.x) * 0.05;
        globeGroup.position.y += (targetGlobeY - globeGroup.position.y) * 0.05;
        camera.position.z += (targetCamZ - camera.position.z) * 0.05;

        // Apply Rotations
        globeGroup.rotation.y = userRotation.y + mouse.x * 0.3;
        globeGroup.rotation.x = userRotation.x + mouse.y * 0.3;

        // 3. Animate Orbital Rings
        orbitalRings.forEach(item => {
            item.angle += item.speed;
            const x = Math.cos(item.angle) * item.radius;
            const y = Math.sin(item.angle) * item.radius;
            item.sat.position.set(x, y, 0);
        });

        // 4. Animate Traveling Data Packets along 3D Bezier Arcs
        pulseParticles.forEach(p => {
            p.t += p.speed;
            if (p.t > 1.0) p.t = 0;
            const pos = p.curve.getPoint(p.t);
            p.mesh.position.copy(pos);
        });

        // 5. Animate Target Ripple Rings
        hotspotRings.forEach(r => {
            r.scale += r.speed;
            if (r.scale > 3.5) r.scale = 1.0;
            r.mesh.scale.set(r.scale, r.scale, r.scale);
            r.mesh.material.opacity = Math.max(0, 1.0 - (r.scale - 1.0) / 2.5);
        });

        // 6. Animate Shield Mesh (breathing pulse and counter-rotation)
        if (shieldMesh && isShieldActive) {
            shieldMesh.rotation.y -= 0.004;
            shieldMesh.rotation.x += 0.002;
            const shieldScale = 1.0 + Math.sin(time * 3.0) * 0.03;
            shieldMesh.scale.set(shieldScale, shieldScale, shieldScale);
        }

        renderer.render(scene, camera);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
