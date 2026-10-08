// Pergolombre - Global Scripts
document.addEventListener('DOMContentLoaded', function () {
    // ---------------------------------------------------------
    // 1. Mobile Navigation & Dropdown Drawer
    // ---------------------------------------------------------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.querySelector('.navbar-wrapper');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isActive = navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            if (isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
                window.dispatchEvent(new Event('scroll'));
            }
        });

        // Toggle dropdown sub-menu when clicking arrow area
        navMenu.querySelectorAll('.nav-arrow-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const parentItem = this.closest('.nav-item');
                if (parentItem) {
                    const isOpen = parentItem.classList.toggle('open');
                    this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

                    // Accordion: close other open dropdowns
                    navMenu.querySelectorAll('.nav-item.open').forEach(otherItem => {
                        if (otherItem !== parentItem) {
                            otherItem.classList.remove('open');
                            const otherBtn = otherItem.querySelector('.nav-arrow-btn');
                            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
            });
        });

        // Close menu when clicking any link
        navMenu.querySelectorAll('.nav-link, .nav-dropdown-link, .btn-contact, .nav-phone').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                navMenu.querySelectorAll('.nav-item.open').forEach(item => {
                    item.classList.remove('open');
                    const btn = item.querySelector('.nav-arrow-btn');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
                window.dispatchEvent(new Event('scroll'));
            });
        });

        // Close menu when tapping/clicking outside
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                navMenu.querySelectorAll('.nav-item.open').forEach(item => {
                    item.classList.remove('open');
                    const btn = item.querySelector('.nav-arrow-btn');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
                window.dispatchEvent(new Event('scroll'));
            }
        });
    }

    // ---------------------------------------------------------
    // 2. Sticky Navbar Progressive Scroll Transition (Desktop & Mobile)
    // ---------------------------------------------------------
    function initNavbarScroll() {
        if (!navbar) return;

        const navLinks = navbar.querySelectorAll('.nav-link');
        const phoneNumber = navbar.querySelector('.phone-number');
        const phoneIcon = navbar.querySelector('.phone-icon');
        const logoImg = navbar.querySelector('.logo-img');
        const btnContact = navbar.querySelector('.btn-contact');

        let isTicking = false;

        function resetNavbarStyles() {
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
            navbar.style.webkitBackdropFilter = '';
            navbar.style.boxShadow = '';
            navbar.style.borderBottom = '';
            navbar.classList.remove('navbar-scrolled');

            if (logoImg) logoImg.style.filter = '';

            const toggleSpans = navbar.querySelectorAll('.nav-toggle span');
            toggleSpans.forEach(s => s.style.backgroundColor = '');

            if (navToggle) {
                navToggle.style.backgroundColor = '';
                navToggle.style.borderColor = '';
            }

            navLinks.forEach(link => {
                link.style.color = '';
            });
            if (phoneNumber) phoneNumber.style.color = '';
            if (phoneIcon) phoneIcon.style.filter = '';
            if (btnContact) {
                btnContact.style.backgroundColor = '';
                btnContact.style.color = '';
            }
            const indicator = navbar.querySelector('.nav-indicator-line');
            if (indicator) indicator.style.backgroundColor = '';
        }

        function updateNavbar() {
            isTicking = false;

            const isMobile = window.innerWidth <= 992;
            if (isMobile) {
                // User requested to remove scroll color changes on mobile for now:
                // Keep mobile navbar solidly brand red, with white logo and white toggle
                resetNavbarStyles();
                return;
            }

            // Find current page's hero/header element (Desktop)
            const hero = document.querySelector('.hero-section, .pergola-hero-section, .electricite-hero-section, .portfolio-hero-section, .pergola-intro-section, .apropos-story-section, section:first-of-type');
            const heroHeight = hero ? Math.max(hero.offsetHeight, 280) : 400;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || window.scrollY || 0;

            const startScroll = 15;
            const endScroll = Math.max(heroHeight - 60, 140);
            const progress = Math.min(Math.max((scrollY - startScroll) / (endScroll - startScroll), 0), 1);

            if (progress <= 0) {
                resetNavbarStyles();
                return;
            }

            if (progress >= 0.7) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }

            // Interpolate background from Brand Red (224, 3, 59, 1) to Frosted Translucent (255, 255, 255, 0.88)
            const r = Math.round(224 + (255 - 224) * progress);
            const g = Math.round(3 + (255 - 3) * progress);
            const b = Math.round(59 + (255 - 59) * progress);
            const alpha = (1 - (1 - 0.88) * progress).toFixed(3);

            navbar.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            navbar.style.backdropFilter = progress > 0.05 ? `blur(${(14 * progress).toFixed(1)}px)` : 'none';
            navbar.style.webkitBackdropFilter = progress > 0.05 ? `blur(${(14 * progress).toFixed(1)}px)` : 'none';
            navbar.style.boxShadow = `0 4px 20px rgba(0, 0, 0, ${(0.12 - 0.05 * progress).toFixed(3)})`;
            navbar.style.borderBottom = progress > 0.1 ? `1px solid rgba(0, 0, 0, ${(0.08 * progress).toFixed(3)})` : 'none';

            // Logo transitions to black on desktop
            if (logoImg) logoImg.style.filter = `brightness(${(1 - progress).toFixed(3)})`;

            // Desktop elements transition
            const textVal = Math.round(255 - (255 - 17) * progress);
            const textColor = `rgb(${textVal}, ${textVal}, ${textVal})`;

            navLinks.forEach(link => {
                link.style.color = textColor;
            });

            if (phoneNumber) phoneNumber.style.color = textColor;
            if (phoneIcon) phoneIcon.style.filter = `brightness(${(1 - progress).toFixed(3)})`;

            const indicator = navbar.querySelector('.nav-indicator-line');
            if (indicator) {
                const indR = Math.round(255 - (255 - 224) * progress);
                const indG = Math.round(255 - (255 - 3) * progress);
                const indB = Math.round(255 - (255 - 59) * progress);
                indicator.style.backgroundColor = `rgb(${indR}, ${indG}, ${indB})`;
            }

            if (btnContact) {
                const btnR = Math.round(255 - (255 - 224) * progress);
                const btnG = Math.round(255 - (255 - 3) * progress);
                const btnB = Math.round(255 - (255 - 59) * progress);
                const btnTextVal = Math.round(24 + (255 - 24) * progress);
                btnContact.style.backgroundColor = `rgb(${btnR}, ${btnG}, ${btnB})`;
                btnContact.style.color = `rgb(${btnTextVal}, ${btnTextVal}, ${btnTextVal})`;
            }
        }

        function requestUpdate() {
            if (!isTicking) {
                window.requestAnimationFrame(updateNavbar);
                isTicking = true;
            }
        }

        window.addEventListener('scroll', requestUpdate, { passive: true });
        document.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate, { passive: true });

        // Initial check on page load
        updateNavbar();
    }

    // ---------------------------------------------------------
    // 3. Subtle Scroll-Reveal Animations (Desktop & Mobile)
    // ---------------------------------------------------------
    function initScrollReveal() {
        const selectors = [
            '.section-header',
            '.elec-section-header',
            '.contact-header',
            '.service-card',
            '.work-card',
            '.process-card',
            '.zone-card',
            '.faq-item',
            '.pergola-card-red',
            '.pergola-image-wrapper',
            '.benefits-label-container',
            '.benefits-gallery',
            '.benefits-content',
            '.model-card',
            '.option-card',
            '.why-feature-item',
            '.why-worker-img',
            '.elec-card',
            '.elec-conformite-image-wrap',
            '.elec-conformite-content',
            '.emergency-card',
            '.fact-item',
            '.footer-cta',
            '.partners-section',
            '.portfolio-etape-card',
            '.galerie-item'
        ];

        const elementsToObserve = [];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                // Strict exclusion: never touch elements that already possess continuous animations or interactive tracks
                if (el.closest('.guarantees-track') ||
                    el.closest('.testimonials-track') ||
                    el.closest('.image-comparison-slider') ||
                    el.closest('.nav-menu')) {
                    return;
                }

                if (!el.classList.contains('scroll-reveal')) {
                    el.classList.add('scroll-reveal');
                    elementsToObserve.push(el);
                }
            });
        });

        // Add subtle delay stagger to grid siblings
        const grids = document.querySelectorAll('.services-grid, .works-grid, .elec-cards-grid, .models-grid, .options-grid, .why-choose-grid, .apropos-stats-grid, .faq-container, .galerie-grid');
        grids.forEach(grid => {
            const items = grid.querySelectorAll('.scroll-reveal');
            items.forEach((item, idx) => {
                const delayClass = `reveal-delay-${(idx % 4) + 1}`;
                item.classList.add(delayClass);
            });
        });

        if (!('IntersectionObserver' in window)) {
            elementsToObserve.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const isMobile = window.innerWidth <= 992;
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);

                    // Once entrance reveal animation completes, cleanly remove temporary classes
                    // so all cards regain 100% native hover responsiveness without delay or override
                    setTimeout(() => {
                        entry.target.classList.remove('scroll-reveal', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4');
                    }, 850);
                }
            });
        }, {
            threshold: isMobile ? 0.05 : 0.08,
            rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -40px 0px'
        });

        elementsToObserve.forEach(el => observer.observe(el));

        // After initial page load entrance completes, clear animation fill-modes from interactive hero buttons
        setTimeout(() => {
            document.querySelectorAll('.btn-left, .btn-right, .btn-center, .btn-outline, .btn-primary').forEach(btn => {
                btn.style.animation = 'none';
            });
        }, 1100);
    }

    // ---------------------------------------------------------
    // 4. Desktop Sliding Nav Indicator Line (Option 2)
    //    Tracks the active page and follows cursor hover.
    //    Strictly isolated to desktop (width > 992px).
    // ---------------------------------------------------------
    function initDesktopNavIndicator() {
        if (window.innerWidth <= 992) return;

        const navLinksList = document.querySelector('.navbar-wrapper .nav-links');
        if (!navLinksList) return;

        let indicator = navLinksList.querySelector('.nav-indicator-line');
        if (!indicator) {
            indicator = document.createElement('span');
            indicator.className = 'nav-indicator-line';
            navLinksList.appendChild(indicator);
        }

        const navItems = navLinksList.querySelectorAll('.nav-item');
        // Find active link
        let activeLink = navLinksList.querySelector('.nav-link-active');
        if (!activeLink) {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            const matchingLink = navLinksList.querySelector(`a[href="${currentPath}"]`);
            if (matchingLink) activeLink = matchingLink;
        }

        function updateIndicator(targetElement) {
            if (!targetElement) {
                indicator.style.opacity = '0';
                return;
            }
            const targetRect = targetElement.getBoundingClientRect();
            const listRect = navLinksList.getBoundingClientRect();

            const left = targetRect.left - listRect.left;
            const width = targetRect.width;

            indicator.style.left = `${left}px`;
            indicator.style.width = `${width}px`;
            indicator.style.opacity = '1';
        }

        // Position on active link on load
        if (activeLink) {
            // Delay slightly to ensure fonts and layout dimensions are fully calculated
            requestAnimationFrame(() => updateIndicator(activeLink));
        } else {
            indicator.style.opacity = '0';
        }

        // Follow hover on nav items
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (!link) return;
            item.addEventListener('mouseenter', () => updateIndicator(link));
        });

        // Reset to active link on mouse leave
        navLinksList.addEventListener('mouseleave', () => {
            if (activeLink) {
                updateIndicator(activeLink);
            } else {
                indicator.style.opacity = '0';
            }
        });

        // Reposition on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 992) {
                indicator.style.opacity = '0';
            } else if (activeLink) {
                updateIndicator(activeLink);
            }
        }, { passive: true });
    }

    // Initialize features
    initNavbarScroll();
    initScrollReveal();
    initDesktopNavIndicator();
});
