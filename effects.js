/**
 * Elyndor Interactive - Effects (Cleaned)
 * Only keeps: intro screen, scroll reveals, counters, page transitions
 */

(function () {
    'use strict';

    /* =========================================================
       1. CINEMATIC SCROLL REVEALS
    ========================================================= */
    function initCinematicReveals() {
        const style = document.createElement('style');
        style.textContent = `
            .cinematic-hidden {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease,
                            transform 0.5s ease;
            }
            .cinematic-visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);

        const targets = document.querySelectorAll(
            '.game-card, .service-col, .team-card, .game-list-item, .vision-text, h2, .stat-item'
        );
        targets.forEach((el, i) => {
            el.classList.add('cinematic-hidden');
            el.style.transitionDelay = `${(i % 4) * 0.06}s`;
        });

        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('cinematic-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

        targets.forEach(el => io.observe(el));
    }

    /* =========================================================
       2. CINEMATIC INTRO / LOADING SCREEN
    ========================================================= */
    function initIntroScreen() {
        const intro = document.getElementById('introScreen');
        if (!intro) return;

        if (sessionStorage.getItem('introSeen')) {
            intro.style.display = 'none';
            return;
        }

        setTimeout(() => {
            intro.classList.add('hidden');
            sessionStorage.setItem('introSeen', '1');
        }, 2200);
    }

    /* =========================================================
       3. ANIMATED COUNTER STATS
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
       4. SMOOTH PAGE TRANSITIONS
    ========================================================= */
    function initPageTransitions() {
        const overlay = document.createElement('div');
        overlay.id = 'pageTransition';
        document.body.appendChild(overlay);

        window.addEventListener('pageshow', () => {
            overlay.classList.remove('active');
        });

        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http') || href.startsWith('tel')) return;
            link.addEventListener('click', e => {
                e.preventDefault();
                overlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 200);
            });
        });
    }

    /* =========================================================
       INIT
    ========================================================= */
    document.addEventListener('DOMContentLoaded', () => {
        initIntroScreen();
        initCinematicReveals();
        initCounters();
        initPageTransitions();
    });

})();
