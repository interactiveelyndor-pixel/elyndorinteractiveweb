/**
 * Elyndor Interactive - Immersive Effects Engine v2
 * Particles, cursor trail, 3D card tilt, glitch text, cinematic reveals,
 * intro screen, typewriter, counter stats, page transitions, ambient sound
 */

(function () {
    'use strict';

    /* =========================================================
       1. INTERACTIVE PARTICLE CANVAS
    ========================================================= */
    function initParticles() {
        // Disable particles on mobile for better performance
        if (window.innerWidth <= 768) return;
        const canvas = document.createElement('canvas');
        canvas.id = 'particleCanvas';
        canvas.style.cssText = `
            position: fixed; top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none; z-index: 0;
            opacity: 0.55;
        `;
        document.body.prepend(canvas);

        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        let mouse = { x: W / 2, y: H / 2 };

        window.addEventListener('resize', () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        });
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        const PARTICLE_COUNT = 80;
        const particles = [];

        class Particle {
            constructor() { this.reset(true); }
            reset(init = false) {
                this.x = Math.random() * W;
                this.y = init ? Math.random() * H : H + 10;
                this.size = Math.random() * 1.8 + 0.4;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = -(Math.random() * 0.6 + 0.2);
                this.life = 1;
                this.decay = Math.random() * 0.003 + 0.001;
                this.color = Math.random() > 0.5
                    ? `rgba(212, 175, 55, ${this.life})`
                    : `rgba(180, 30, 30, ${this.life})`;
            }
            update() {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    this.speedX += (dx / dist) * 0.015;
                    this.speedY += (dy / dist) * 0.015;
                }
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
                if (this.life <= 0 || this.y < -10) this.reset();
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.life);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 6;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* =========================================================
       2. CUSTOM CURSOR + GLOWING TRAIL
    ========================================================= */
    function initCursor() {
        // Disable on mobile for better performance
        if (window.innerWidth <= 768) return;
        
        // Check if custom cursor is disabled via preference
        if (localStorage.getItem('disableCustomCursor')) return;

        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed; width: 10px; height: 10px;
            background: #d4af37; border-radius: 50%;
            pointer-events: none; z-index: 10000;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px #d4af37, 0 0 20px #d4af37;
            mix-blend-mode: screen; transition: background 0.3s;
        `;
        const ring = document.createElement('div');
        ring.style.cssText = `
            position: fixed; width: 36px; height: 36px;
            border: 1.5px solid rgba(212,175,55,0.6);
            border-radius: 50%; pointer-events: none;
            z-index: 9999; transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, border-color 0.3s;
        `;

        document.body.appendChild(ring);
        document.body.appendChild(dot);
        document.body.style.cursor = 'none';

        let mx = 0, my = 0, rx = 0, ry = 0;
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
        });

        (function followRing() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            requestAnimationFrame(followRing);
        })();

        document.querySelectorAll('a, button, .game-card, .cta-button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                ring.style.width = '60px';
                ring.style.height = '60px';
                ring.style.borderColor = 'rgba(212,175,55,0.9)';
            });
            el.addEventListener('mouseleave', () => {
                ring.style.width = '36px';
                ring.style.height = '36px';
                ring.style.borderColor = 'rgba(212,175,55,0.6)';
            });
        });
    }

    /* =========================================================
       3. MOUSE-TRACKED 3D TILT ON GAME CARDS
    ========================================================= */
    function initCardTilt() {
        // Disable 3D tilt on mobile devices
        if (window.innerWidth <= 768) return;
        const cards = document.querySelectorAll('.game-card');
        cards.forEach(card => {
            card.style.transformStyle = 'preserve-3d';
            card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
            card.style.willChange = 'transform';

            // Add cinematic overlay element
            if (!card.querySelector('.game-card-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'game-card-overlay';
                overlay.innerHTML = `
                    <div class="game-card-overlay-tag">Elyndor Original</div>
                    <div class="game-card-overlay-cta">▶ Play Now</div>
                `;
                card.appendChild(overlay);
            }

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                card.style.transform = `perspective(800px) rotateX(${-dy * 12}deg) rotateY(${dx * 15}deg) scale(1.04)`;
                card.style.boxShadow = `${-dx * 20}px ${dy * 20}px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.15)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
                card.style.boxShadow = '';
            });
        });
    }

    /* =========================================================
       4. GLITCH / SCRAMBLE TEXT REVEAL ON HERO TITLE
    ========================================================= */
    function initGlitchText() {
        const path = window.location.pathname;
        const isHome = path === '/' || path.endsWith('index.html') || path === '';
        if (isHome) return;

        const h1 = document.querySelector('#hero h1') || document.querySelector('h1.fade-in');
        if (!h1) return;

        const original = h1.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let iteration = 0;
        const speed = 3;

        const interval = setInterval(() => {
            h1.textContent = original.split('').map((char, i) => {
                if (char === ' ') return ' ';
                if (i < Math.floor(iteration / speed)) return original[i];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            iteration++;
            if (iteration >= original.length * speed) {
                clearInterval(interval);
                h1.textContent = original;
            }
        }, 30);
    }

    /* =========================================================
       5. CINEMATIC SCROLL REVEALS
    ========================================================= */
    function initCinematicReveals() {
        const style = document.createElement('style');
        style.textContent = `
            .cinematic-hidden {
                opacity: 0; filter: blur(8px);
                transform: translateY(40px) scale(0.97);
                transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1),
                            filter 0.9s cubic-bezier(0.22,1,0.36,1),
                            transform 0.9s cubic-bezier(0.22,1,0.36,1);
            }
            .cinematic-visible {
                opacity: 1 !important; filter: blur(0px) !important;
                transform: translateY(0) scale(1) !important;
            }
        `;
        document.head.appendChild(style);

        const targets = document.querySelectorAll(
            '.game-card, .service-col, .team-card, .game-list-item, .vision-text, h2, .stat-item'
        );
        targets.forEach((el, i) => {
            el.classList.add('cinematic-hidden');
            el.style.transitionDelay = `${(i % 4) * 0.1}s`;
        });

        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('cinematic-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(el => io.observe(el));
    }

    /* =========================================================
       6. CINEMATIC INTRO / LOADING SCREEN
    ========================================================= */
    function initIntroScreen() {
        const intro = document.getElementById('introScreen');
        if (!intro) return;

        // Only show intro once per browser session
        if (sessionStorage.getItem('introSeen')) {
            intro.style.display = 'none';
            return;
        }

        // Dismiss after loading bar animation (~2.2s)
        setTimeout(() => {
            intro.classList.add('hidden');
            sessionStorage.setItem('introSeen', '1');
        }, 2200);
    }

    /* =========================================================
       7. TYPEWRITER EFFECT
    ========================================================= */
    function initTypewriter() {
        const el = document.querySelector('[data-typewriter]');
        if (!el) return;

        const text = el.getAttribute('data-typewriter');
        const prefix = '- ';
        el.textContent = prefix;

        let i = 0;
        // Delay so intro screen clears first
        setTimeout(() => {
            const interval = setInterval(() => {
                if (i < text.length) {
                    el.textContent = prefix + text.slice(0, ++i);
                } else {
                    clearInterval(interval);
                    // Blinking cursor at end
                    el.innerHTML = prefix + text + '<span style="animation: blink 1s step-end infinite; border-right: 2px solid #d4af37; margin-left:2px;">&nbsp;</span>';
                    const bStyle = document.createElement('style');
                    bStyle.textContent = '@keyframes blink { 50% { opacity: 0; } }';
                    document.head.appendChild(bStyle);
                }
            }, 55);
        }, 2500);
    }

    /* =========================================================
       8. ANIMATED COUNTER STATS
    ========================================================= */
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;

        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                const duration = 1800;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    el.textContent = target >= 1000
                        ? current.toLocaleString()
                        : current;
                    if (progress < 1) requestAnimationFrame(update);
                    else el.textContent = target >= 1000 ? target.toLocaleString() : target;
                }
                requestAnimationFrame(update);
                io.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(c => io.observe(c));
    }

    /* =========================================================
       9. SMOOTH PAGE TRANSITIONS
    ========================================================= */
    function initPageTransitions() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'pageTransition';
        document.body.appendChild(overlay);

        // Fade in on arrive
        window.addEventListener('pageshow', () => {
            overlay.classList.remove('active');
        });

        // Intercept internal navigation links
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
            link.addEventListener('click', e => {
                e.preventDefault();
                overlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 380);
            });
        });
    }

    /* =========================================================
       10. AMBIENT SOUND TOGGLE
    ========================================================= */
    function initAmbientSound() {
        // Use Web Audio API to create a subtle, looping ambient drone
        let audioCtx = null;
        let gainNode = null;
        let playing = false;

        const btn = document.createElement('button');
        btn.id = 'ambientToggle';
        btn.title = 'Toggle ambient sound';
        btn.innerHTML = '🔇';
        btn.style.cssText = `
            position: fixed; bottom: 2rem; right: 2rem;
            background: rgba(212,175,55,0.1);
            border: 1px solid rgba(212,175,55,0.4);
            color: #d4af37; font-size: 1.1rem;
            width: 44px; height: 44px; border-radius: 50%;
            cursor: pointer; z-index: 5000;
            transition: background 0.3s, transform 0.2s;
            display: flex; align-items: center; justify-content: center;
        `;
        btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(212,175,55,0.25)');
        btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(212,175,55,0.1)');
        document.body.appendChild(btn);

        function createAmbient() {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioCtx.createGain();
            gainNode.gain.value = 0;
            gainNode.connect(audioCtx.destination);

            // Layer two detuned oscillators for a warm drone
            [55, 110].forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = freq + i * 0.3;
                const g = audioCtx.createGain();
                g.gain.value = 0.08;
                osc.connect(g);
                g.connect(gainNode);
                osc.start();
            });
        }

        btn.addEventListener('click', () => {
            if (!audioCtx) createAmbient();
            if (!playing) {
                gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 1.5);
                btn.innerHTML = '🔊';
                playing = true;
            } else {
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
                btn.innerHTML = '🔇';
                playing = false;
            }
        });

        // Hover sound using short tone burst
        document.querySelectorAll('a, button, .game-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (!playing) return;
                const ctx = audioCtx;
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.frequency.value = 880;
                o.type = 'sine';
                g.gain.setValueAtTime(0.04, ctx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
                o.connect(g); g.connect(ctx.destination);
                o.start(); o.stop(ctx.currentTime + 0.12);
            });
        });
    }

    /* =========================================================
       INIT ALL
    ========================================================= */
    document.addEventListener('DOMContentLoaded', () => {
        initIntroScreen();
        initParticles();
        initCursor();
        initCardTilt();
        initGlitchText();
        initCinematicReveals();
        initTypewriter();
        initCounters();
        initPageTransitions();
        initAmbientSound();
    });

})();
