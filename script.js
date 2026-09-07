/**
 * Elyndor Interactive - Core Script (High-Performance)
 * Zero scroll listeners, zero mousemove recalculations, instant responsiveness.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ===== 1. SMOOTH SCROLLING FOR IN-PAGE ANCHORS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ===== 2. HERO VIDEO GPU OPTIMIZATION (Pause when off-screen) =====
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo && 'IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(() => {});
                } else {
                    heroVideo.pause();
                }
            });
        }, { threshold: 0.1 });
        videoObserver.observe(heroVideo);
    }

    // ===== 3. ANIMATED COUNTER STATS (Passive Observer) =====
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                if (isNaN(target)) return;

                const duration = 1200;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    el.textContent = target >= 1000 ? current.toLocaleString() : current;
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target >= 1000 ? target.toLocaleString() : target;
                    }
                }
                requestAnimationFrame(update);
                counterObserver.unobserve(el);
            });
        }, { threshold: 0.3 });

        counters.forEach(c => counterObserver.observe(c));
    }

    // ===== 4. MOBILE NAVIGATION HAMBURGER MENU =====
    function setupMobileMenu() {
        const nav = document.querySelector('nav');
        const navLinks = document.querySelector('.nav-links');
        let burger = document.querySelector('.mobile-toggle');

        if (window.innerWidth <= 768 && !burger && nav && navLinks) {
            burger = document.createElement('div');
            burger.className = 'mobile-toggle';
            burger.setAttribute('role', 'button');
            burger.setAttribute('aria-label', 'Toggle navigation menu');
            burger.setAttribute('aria-expanded', 'false');
            burger.setAttribute('aria-controls', 'nav-links');
            burger.innerHTML = '<span></span><span></span><span></span>';
            navLinks.id = 'nav-links';
            nav.appendChild(burger);

            burger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const isExpanded = navLinks.classList.contains('active');
                burger.setAttribute('aria-expanded', isExpanded);

                const spans = burger.querySelectorAll('span');
                burger.classList.toggle('toggle');

                if (burger.classList.contains('toggle')) {
                    spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        } else if (window.innerWidth > 768 && burger) {
            burger.remove();
        }
    }

    setupMobileMenu();
    window.addEventListener('resize', setupMobileMenu, { passive: true });

    // ===== 5. NEWSLETTER FORM HANDLING =====
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');
            if (!email || !button) return;
            const originalText = button.textContent;

            if (email.value) {
                if (!email.value.includes('@')) {
                    button.textContent = '✗ Invalid email';
                    button.style.color = '#d4af37';
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.color = 'var(--color-accent)';
                    }, 2000);
                    return;
                }

                const subscribedEmails = JSON.parse(localStorage.getItem('subscribedEmails') || '[]');
                if (!subscribedEmails.includes(email.value)) {
                    subscribedEmails.push(email.value);
                    localStorage.setItem('subscribedEmails', JSON.stringify(subscribedEmails));
                }

                button.textContent = '✓ Subscribed!';
                button.style.color = '#4CAF50';
                email.value = '';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.color = 'var(--color-accent)';
                }, 2000);
            }
        });
    });

    // ===== 6. HERO SLIDER (Only initialized if multiple slides exist) =====
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length > 1) {
        let currentSlide = 0;
        let slideInterval;
        const intervalTime = 6000;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            if (slides[index]) slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function startSlideTimer() {
            stopSlideTimer();
            slideInterval = setInterval(nextSlide, intervalTime);
        }

        function stopSlideTimer() {
            if (slideInterval) clearInterval(slideInterval);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideTo = parseInt(e.target.getAttribute('data-slide-to'), 10);
                if (!isNaN(slideTo)) {
                    showSlide(slideTo);
                    startSlideTimer();
                }
            });
        });

        startSlideTimer();
    }
});
