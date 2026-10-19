/**
 * UN-CHK (Université numérique Cheikh Hamidou KANE)
 * Homepage Interactivity & Micro-animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Search Overlay Open & Close
    // ----------------------------------------------------
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchOverlay.classList.toggle('active');
            if (searchOverlay.classList.contains('active')) {
                searchInput.focus();
            }
        });
    }

    if (searchClose && searchOverlay) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }

    // Close search on click outside
    document.addEventListener('click', (e) => {
        if (searchOverlay && searchOverlay.classList.contains('active') && !searchOverlay.contains(e.target) && e.target !== searchBtn) {
            searchOverlay.classList.remove('active');
        }
    });

    // ----------------------------------------------------
    // 2. Mobile Menu Navigation Toggle
    // ----------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-active');
            mobileMenuBtn.classList.toggle('is-open');
        });

        // Dropdown toggle on mobile
        const dropdownItems = mainNav.querySelectorAll('.has-dropdown');
        dropdownItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    item.classList.toggle('open-sub');
                }
            });
        });
    }

    // ----------------------------------------------------
    // 3. Hero Carousel Full-Width Multi-Slide Navigation
    // ----------------------------------------------------
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');
    let currentSlide = 0;
    let autoSlideTimer = null;

    const showSlide = (index) => {
        if (!slides.length) return;
        currentSlide = (index + slides.length) % slides.length;

        // Met à jour les slides actives
        slides.forEach((slide, idx) => {
            if (idx === currentSlide) {
                slide.classList.add('active-slide');
            } else {
                slide.classList.remove('active-slide');
            }
        });

        // Met à jour les points de pagination
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active-dot');
            } else {
                dot.classList.remove('active-dot');
            }
        });
    };

    // Clic sur les points de pagination
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(idx);
            resetAutoSlide();
        });
    });

    // Flèches Précédente / Suivante
    if (heroPrev) {
        heroPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(currentSlide - 1);
            resetAutoSlide();
        });
    }

    if (heroNext) {
        heroNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(currentSlide + 1);
            resetAutoSlide();
        });
    }

    // Défilement automatique toutes les 5 secondes
    const startAutoSlide = () => {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
        if (slides.length > 1) {
            autoSlideTimer = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);
        }
    };

    const resetAutoSlide = () => {
        startAutoSlide();
    };

    startAutoSlide();

    // Pause au survol
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            if (autoSlideTimer) clearInterval(autoSlideTimer);
        });
        heroSection.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }

    // ----------------------------------------------------
    // 4. Smooth Back to Top
    // ----------------------------------------------------
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ----------------------------------------------------
    // 5. Language Switcher Toggle
    // ----------------------------------------------------
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        let currentLang = 'FR';
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'FR' ? 'EN' : 'FR';
            langToggle.setAttribute('title', `Langue actuelle: ${currentLang}`);
            langToggle.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                langToggle.style.transform = 'none';
            }, 300);
        });
    }

    // ----------------------------------------------------
    // 6. Number Counter Animation for Statistics
    // ----------------------------------------------------
    const statCards = document.querySelectorAll('.stat-big-number');
    let animated = false;

    const runCounterAnimation = () => {
        statCards.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            if (!isNaN(target)) {
                let start = 0;
                const duration = 1200;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const value = Math.floor(progress * target);
                    
                    if (target === 1) {
                        stat.textContent = `${value}ère`;
                    } else {
                        stat.textContent = value;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = target === 1 ? '1ère' : target;
                    }
                };

                requestAnimationFrame(updateCount);
            }
        });
    };

    const statsSection = document.getElementById('en-chiffres');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    runCounterAnimation();
                }
            });
        }, { threshold: 0.2 });

        observer.observe(statsSection);
    }
});
