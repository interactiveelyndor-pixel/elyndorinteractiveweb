document.addEventListener('DOMContentLoaded', () => {
    // ===== 1. SCROLL PROGRESS BAR =====
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed; top: 0; left: 0; height: 3px;
        background-color: #d4af37; z-index: 2000; width: 0%;
        transition: width 0.1s;
    `;
    document.body.appendChild(progressBar);

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }, 10);
    });

    // ===== 2. SMOOTH SCROLLING FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
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

    // ===== 4. HERO PARALLAX EFFECT (Desktop Only) =====
    if (window.innerWidth > 768) {
        const hero = document.querySelector('#hero') || document.querySelector('.page-hero');
        if (hero) {
            document.addEventListener('mousemove', (e) => {
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;
                hero.style.backgroundPosition = `${50 + x * 2}% ${50 + y * 2}%`;
            });
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
    window.addEventListener('resize', setupMobileMenu);

    // ===== 6. GAME GRID AUTO-SCROLL ON HOVER (Desktop Only) =====
    if (window.innerWidth > 768) {
        const gameGrids = document.querySelectorAll('.game-grid');
        gameGrids.forEach(grid => {
            let mouseX = 0;
            let scrollInterval;

            grid.addEventListener('mouseenter', () => startAutoScroll());
            grid.addEventListener('mouseleave', () => stopAutoScroll());
            grid.addEventListener('mousemove', (e) => {
                const rect = grid.getBoundingClientRect();
                mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            });

            function startAutoScroll() {
                if (scrollInterval) clearInterval(scrollInterval);
                scrollInterval = setInterval(() => {
                    if (Math.abs(mouseX) > 0.3) {
                        const speed = (Math.abs(mouseX) - 0.3) * 15;
                        grid.scrollLeft += (mouseX > 0 ? speed : -speed);
                    }
                }, 16);
            }

            function stopAutoScroll() {
                if (scrollInterval) clearInterval(scrollInterval);
            }
        });
    }

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
});
