document.addEventListener('DOMContentLoaded', () => {
    // ===== 1. SCROLL PROGRESS BAR (GPU Hardware Composited) =====
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed; top: 0; left: 0; height: 3px;
        background-color: #d4af37; z-index: 2000; width: 100%;
        transform-origin: left; transform: scaleX(0);
        will-change: transform; pointer-events: none;
    `;
    document.body.appendChild(progressBar);

    let scrollTicking = false;
    let maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    window.addEventListener('resize', () => {
        maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    }, { passive: true });

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
                progressBar.style.transform = `scaleX(${progress})`;
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // ===== 2. SMOOTH SCROLLING FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ===== 3. SCROLL ANIMATIONS WITH INTERSECTION OBSERVER =====
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(section => observer.observe(section));

    // ===== 4. HERO PARALLAX EFFECT (Desktop Only, Throttled) =====
    if (window.innerWidth > 768) {
        const hero = document.querySelector('#hero') || document.querySelector('.page-hero');
        if (hero) {
            let heroTicking = false;
            let mx = 0, my = 0;
            window.addEventListener('mousemove', (e) => {
                mx = e.clientX / window.innerWidth;
                my = e.clientY / window.innerHeight;
                if (!heroTicking) {
                    requestAnimationFrame(() => {
                        // Only calculate and repaint if hero is within view
                        if (window.scrollY < window.innerHeight) {
                            hero.style.backgroundPosition = `${50 + mx * 2}% ${50 + my * 2}%`;
                        }
                        heroTicking = false;
                    });
                    heroTicking = true;
                }
            }, { passive: true });
        }
    }

    // ===== 5. MOBILE NAVIGATION HAMBURGER MENU =====
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



    // ===== 7. NEWSLETTER FORM HANDLING =====
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');
            const originalText = button.textContent;

            if (email && email.value) {
                // Validate email format
                if (!email.value.includes('@')) {
                    button.textContent = '✗ Invalid email';
                    button.style.color = '#d4af37';
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.color = 'var(--color-accent)';
                    }, 2000);
                    return;
                }

                // Store newsletter subscription
                const subscribedEmails = JSON.parse(localStorage.getItem('subscribedEmails') || '[]');
                if (!subscribedEmails.includes(email.value)) {
                    subscribedEmails.push(email.value);
                    localStorage.setItem('subscribedEmails', JSON.stringify(subscribedEmails));
                }

                // Show success message
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

    // ===== 8. HERO SLIDER FUNCTIONALITY =====
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 6000; // Switch slide every 6 seconds

    function showSlide(index) {
        if (slides.length === 0) return;
        
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Activate selected slide and dot if they exist
        if (slides[index]) slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        if (slides.length <= 1) return;
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startSlideTimer() {
        stopSlideTimer();
        if (slides.length > 1) {
            slideInterval = setInterval(nextSlide, intervalTime);
        }
    }

    function stopSlideTimer() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // Set up click events for dots
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = parseInt(e.target.getAttribute('data-slide-to'), 10);
            if (!isNaN(slideTo)) {
                showSlide(slideTo);
                startSlideTimer(); // Reset timer on click
            }
        });
    });

    // Initialize slider auto-play only if multiple slides exist
    if (slides.length > 1) {
        startSlideTimer();
    }
});
