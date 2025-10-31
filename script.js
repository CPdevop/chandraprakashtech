// ===================================
// PARTICLE CANVAS ANIMATION
// ===================================

class ParticleCanvas {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.mousePosition = { x: null, y: null };
        this.maxDistance = 150;

        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            this.mousePosition.x = null;
            this.mousePosition.y = null;
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Mouse interaction
            if (this.mousePosition.x !== null) {
                const dx = this.mousePosition.x - particle.x;
                const dy = this.mousePosition.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx -= (dx / distance) * force * 0.1;
                    particle.vy -= (dy / distance) * force * 0.1;
                }
            }

            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }

    drawParticles() {
        const theme = document.documentElement.getAttribute('data-theme');
        const particleColor = theme === 'dark' ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.4)';
        const lineColor = theme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)';

        this.particles.forEach((particle, i) => {
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particleColor;
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[j].x - particle.x;
                const dy = this.particles[j].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = lineColor;
                    this.ctx.lineWidth = (1 - distance / this.maxDistance) * 0.5;
                    this.ctx.stroke();
                }
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// NAVIGATION
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
        this.themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }
}

// ===================================
// ANIMATED COUNTERS
// ===================================

class AnimatedCounters {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;

        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCounters();
                    this.hasAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }
}

// ===================================
// SKILL RADAR CHART
// ===================================

class SkillRadar {
    constructor() {
        this.canvas = document.getElementById('skillRadar');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.skills = [
            { name: 'SQL', value: 95 },
            { name: 'PySpark', value: 90 },
            { name: 'Data Quality', value: 92 },
            { name: 'Python', value: 88 },
            { name: 'Databricks', value: 85 },
            { name: 'ETL', value: 87 }
        ];

        this.setupCanvas();
        this.setupObserver();
    }

    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.draw();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.canvas);
    }

    draw() {
        const centerX = this.canvas.width / (window.devicePixelRatio || 1) / 2;
        const centerY = this.canvas.height / (window.devicePixelRatio || 1) / 2;
        const maxRadius = Math.min(centerX, centerY) - 60;
        const angleStep = (Math.PI * 2) / this.skills.length;

        // Draw grid
        this.ctx.strokeStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--card-border').trim();
        this.ctx.lineWidth = 1;

        for (let i = 1; i <= 5; i++) {
            this.ctx.beginPath();
            const radius = (maxRadius / 5) * i;
            for (let j = 0; j <= this.skills.length; j++) {
                const angle = angleStep * j - Math.PI / 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                if (j === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }

        // Draw axes
        this.skills.forEach((skill, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const x = centerX + Math.cos(angle) * maxRadius;
            const y = centerY + Math.sin(angle) * maxRadius;

            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();

            // Draw labels
            const labelX = centerX + Math.cos(angle) * (maxRadius + 30);
            const labelY = centerY + Math.sin(angle) * (maxRadius + 30);
            this.ctx.fillStyle = getComputedStyle(document.documentElement)
                .getPropertyValue('--text-primary').trim();
            this.ctx.font = '12px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(skill.name, labelX, labelY);
        });

        // Draw skill values
        this.ctx.beginPath();
        this.skills.forEach((skill, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const radius = (skill.value / 100) * maxRadius;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(16, 185, 129, 1)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw points
        this.skills.forEach((skill, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const radius = (skill.value / 100) * maxRadius;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(16, 185, 129, 1)';
            this.ctx.fill();
        });
    }
}

// ===================================
// SKILL PROGRESS BARS
// ===================================

class SkillProgressBars {
    constructor() {
        this.progressBars = document.querySelectorAll('.skill-progress');
        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('data-width');
                    progressBar.style.width = width + '%';
                }
            });
        }, { threshold: 0.5 });

        this.progressBars.forEach(bar => observer.observe(bar));
    }
}

// ===================================
// PROJECT FILTERS
// ===================================

class ProjectFilters {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter projects
                this.filterProjects(filter);
            });
        });
    }

    filterProjects(filter) {
        this.projectCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// ===================================
// PROJECT CARD FLIP
// ===================================

class ProjectCardFlip {
    constructor() {
        this.setupFlipButtons();
    }

    setupFlipButtons() {
        document.querySelectorAll('.flip-card-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.project-card');
                card.classList.toggle('flipped');
            });
        });
    }
}

// ===================================
// CONTACT FORM
// ===================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.successMessage = document.getElementById('formSuccess');

        this.setupEventListener();
    }

    setupEventListener() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validate
            let isValid = true;

            if (name === '') {
                this.showError('nameError', 'Name is required');
                isValid = false;
            } else {
                this.clearError('nameError');
            }

            if (email === '') {
                this.showError('emailError', 'Email is required');
                isValid = false;
            } else if (!this.isValidEmail(email)) {
                this.showError('emailError', 'Please enter a valid email');
                isValid = false;
            } else {
                this.clearError('emailError');
            }

            if (message === '') {
                this.showError('messageError', 'Message is required');
                isValid = false;
            } else {
                this.clearError('messageError');
            }

            if (isValid) {
                // Hide form, show success message
                this.form.style.display = 'none';
                this.successMessage.classList.remove('hidden');

                // Show toast
                showToast('Message sent successfully! I\'ll get back to you soon.', 'success');

                // Reset form after 3 seconds
                setTimeout(() => {
                    this.form.reset();
                    this.form.style.display = 'flex';
                    this.successMessage.classList.add('hidden');
                }, 3000);
            }
        });
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
    }

    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = '';
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// ===================================
// BACK TO TOP BUTTON
// ===================================

class BackToTop {
    constructor() {
        this.btn = document.getElementById('backToTop');
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.btn.classList.remove('hidden');
            } else {
                this.btn.classList.add('hidden');
            }
        });

        this.btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===================================
// TOAST NOTIFICATIONS
// ===================================

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? '✓' : '✗';
    toast.innerHTML = `
        <span style="font-size: 20px;">${icon}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

class ScrollAnimations {
    constructor() {
        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all glass cards
        document.querySelectorAll('.glass-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
}

// ===================================
// TYPING EFFECT
// ===================================

class TypingEffect {
    constructor() {
        this.element = document.querySelector('.typing-text');
        if (!this.element) return;

        this.text = this.element.textContent;
        this.element.textContent = '';
        this.index = 0;
        this.type();
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), 100);
        }
    }
}

// ===================================
// INITIALIZE ALL COMPONENTS
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ParticleCanvas();
    new Navigation();
    new ThemeToggle();
    new AnimatedCounters();
    new SkillRadar();
    new SkillProgressBars();
    new ProjectFilters();
    new ProjectCardFlip();
    new ContactForm();
    new BackToTop();
    new ScrollAnimations();
    new TypingEffect();

    // Show welcome toast
    setTimeout(() => {
        showToast('👋 Welcome! Explore my Data Quality Engineering portfolio.', 'success');
    }, 1000);
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy load images (if you add images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

// Focus trap for modals (if needed later)
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// Keyboard navigation for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.querySelector('.flip-card-btn').click();
        }
    });
});

// ===================================
// SMOOTH SCROLL POLYFILL FOR SAFARI
// ===================================

if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const targetPosition = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    smoothScrollPolyfill();
}

// ===================================
// EASTER EGG: KONAMI CODE
// ===================================

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            showToast('🎮 Konami Code Activated! Data Quality Level: EXPERT MODE!', 'success');
            document.body.style.animation = 'rainbow 3s linear infinite';
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// ===================================
// LOG CREDITS
// ===================================

console.log('%c👨‍💻 Portfolio by Chandraprakash Jha', 'color: #10b981; font-size: 20px; font-weight: bold;');
console.log('%c🚀 Data Quality Engineer | SQL · Python · PySpark · Databricks', 'color: #06b6d4; font-size: 14px;');
console.log('%c📧 Available for immediate hire!', 'color: #10b981; font-size: 14px;');
