// ===================================
// SIMPLE NAVIGATION
// ===================================

class Navigation {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');

        this.setupScrollListener();
        this.setupSmoothScroll();
    }

    setupScrollListener() {
        window.addEventListener('scroll', () => {
            // Add scrolled class to nav
            if (window.scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }

            // Highlight active section
            this.highlightActiveSection();
        });
    }

    highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===================================
// THEME TOGGLE
// ===================================

class ThemeToggle {
    constructor() {
        this.toggleBtn = document.getElementById('themeToggle');
        if (!this.toggleBtn) return;

        this.themeIcon = this.toggleBtn.querySelector('.theme-icon');
        this.currentTheme = localStorage.getItem('theme') || 'light';

        this.init();
        this.setupEventListener();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateIcon();
    }

    setupEventListener() {
        this.toggleBtn.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            localStorage.setItem('theme', this.currentTheme);
            this.updateIcon();
        });
    }

    updateIcon() {
        if (this.themeIcon) {
            this.themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }
}

// ===================================
// INITIALIZE ALL COMPONENTS
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    new Navigation();
    new ThemeToggle();

    console.log('%c👨‍💻 Portfolio by Chandraprakash Jha', 'color: #10b981; font-size: 18px; font-weight: bold;');
    console.log('%c🚀 Data Engineer | Analytics Engineer | ETL Developer', 'color: #06b6d4; font-size: 14px;');
});
