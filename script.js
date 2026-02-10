// DOM Elements
const themeToggle = document.getElementById('theme-icon');
const hackerThemeToggle = document.getElementById('theme-toggle-hacker');
const lightDarkThemeToggle = document.getElementById('theme-toggle-lightdark');
const matrixCanvas = document.getElementById('matrix-rain');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const skillBars = document.querySelectorAll('.skill-progress');
const contactForm = document.querySelector('.contact-form');

let matrixAnimationId = null;
let matrixCtx = null;
let matrixColumns = [];
let matrixFontSize = 16;
let matrixLastFrameAt = 0;
let matrixChars = null;
let matrixReduceMotion = false;

function initMatrixChars() {
    matrixChars = (
        'アイウエオカキクケコサシスセソタチツテトナニヌネノ' +
        'ハヒフヘホマミムメモヤユヨラリルレロワヲン' +
        'pasindukumarasinghe' +
        'pasindukumarasinghe' 
    ).split('');
}

function resizeMatrixCanvas() {
    if (!matrixCanvas) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    matrixCanvas.width = Math.floor(window.innerWidth * dpr);
    matrixCanvas.height = Math.floor(window.innerHeight * dpr);
    matrixCanvas.style.width = window.innerWidth + 'px';
    matrixCanvas.style.height = window.innerHeight + 'px';

    matrixCtx = matrixCanvas.getContext('2d');
    if (!matrixCtx) return;
    matrixCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    matrixFontSize = window.innerWidth < 480 ? 14 : 16;
    const cols = Math.ceil(window.innerWidth / matrixFontSize);
    matrixColumns = new Array(cols).fill(0).map(() => ({
        y: Math.floor(Math.random() * window.innerHeight),
        speed: matrixFontSize * (0.6 + Math.random() * 1.6)
    }));
}

function drawMatrixFrame(ts) {
    if (!matrixCtx || !matrixCanvas) return;

    const frameInterval = 1000 / 30;
    if (ts - matrixLastFrameAt < frameInterval) {
        matrixAnimationId = window.requestAnimationFrame(drawMatrixFrame);
        return;
    }
    matrixLastFrameAt = ts;

    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    matrixCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    matrixCtx.font = `${matrixFontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
    matrixCtx.textBaseline = 'top';

    for (let i = 0; i < matrixColumns.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * matrixFontSize;
        const col = matrixColumns[i];
        const y = col.y;

        matrixCtx.fillStyle = 'rgba(209, 250, 229, 0.90)';
        matrixCtx.fillText(text, x, y);

        matrixCtx.fillStyle = 'rgba(34, 197, 94, 0.85)';
        const trailY = y - matrixFontSize * 1.4;
        if (trailY >= 0) {
            const trailChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            matrixCtx.fillText(trailChar, x, trailY);
        }

        if (y > window.innerHeight && Math.random() > 0.985) {
            col.y = 0;
            col.speed = matrixFontSize * (0.6 + Math.random() * 1.6);
        } else {
            col.y = y + col.speed;
        }
    }

    matrixAnimationId = window.requestAnimationFrame(drawMatrixFrame);
}

function startMatrixRain() {
    if (!matrixCanvas) return;
    if (matrixAnimationId !== null) return;

    if (matrixReduceMotion) return;

    if (!matrixChars) initMatrixChars();
    resizeMatrixCanvas();
    matrixLastFrameAt = 0;
    matrixAnimationId = window.requestAnimationFrame(drawMatrixFrame);
}

function stopMatrixRain() {
    if (matrixAnimationId !== null) {
        window.cancelAnimationFrame(matrixAnimationId);
        matrixAnimationId = null;
    }
    if (matrixCtx && matrixCanvas) {
        matrixCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}

// Theme Toggle Functionality
function initTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function toggleHackerTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'hacker' ? 'dark' : 'hacker';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function handleThemeToggleKeydown(e, onActivate) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
    }
}

function updateThemeIcon(theme) {
    if (theme === 'hacker') {
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
        if (hackerThemeToggle) hackerThemeToggle.classList.add('active');
        if (lightDarkThemeToggle) lightDarkThemeToggle.classList.remove('active');
        startMatrixRain();
        return;
    }

    if (theme === 'dark') {
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
    } else {
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
    }

    if (hackerThemeToggle) hackerThemeToggle.classList.remove('active');
    if (lightDarkThemeToggle) lightDarkThemeToggle.classList.add('active');
    stopMatrixRain();
}

// Mobile Navigation Toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// Smooth Scrolling for Navigation Links
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        closeMobileMenu();
    }
}

// Animate Skill Bars on Scroll
function animateSkillBars() {
    const triggerBottom = window.innerHeight * 0.8;
    
    skillBars.forEach(skillBar => {
        const barTop = skillBar.getBoundingClientRect().top;
        const progress = skillBar.getAttribute('data-progress');
        
        if (barTop < triggerBottom) {
            skillBar.style.width = progress + '%';
        }
    });
}

// Navbar Background on Scroll
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Active Navigation Link Highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Contact Form Handling
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
    }

    const endpoint = contactForm.getAttribute('action');
    const method = (contactForm.getAttribute('method') || 'POST').toUpperCase();

    fetch(endpoint, {
        method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(async (response) => {
            if (response.ok) {
                showNotification('Message sent successfully! I will get back to you soon.', 'success');
                contactForm.reset();
                return;
            }

            let errorMessage = 'Something went wrong. Please try again later.';
            try {
                const data = await response.json();
                if (data && data.errors && data.errors.length) {
                    errorMessage = data.errors.map(err => err.message).join(', ');
                }
            } catch (_) {
                // ignore
            }
            showNotification(errorMessage, 'error');
        })
        .catch(() => {
            showNotification('Network error. Please check your connection and try again.', 'error');
        })
        .finally(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else {
        notification.style.backgroundColor = '#3b82f6';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Scroll Reveal Animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Add reveal class to elements for animation
function addRevealClasses() {
    const elementsToReveal = [
        '.about-content',
        '.education-card',
        '.skill-card',
        '.project-card',
        '.contact-info',
        '.contact-form'
    ];
    
    elementsToReveal.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('reveal');
        });
    });
}

// Typing Effect for Hero Title
function typeWriter() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }
    
    setTimeout(type, 500);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    matrixReduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    initTheme();
    
    // Add reveal classes
    addRevealClasses();
    
    // Start typing effect
    typeWriter();
    
    // Initial animations
    animateSkillBars();
    revealOnScroll();

    // Navbar initial state
    updateNavbar();
    updateActiveNavLink();
    
    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    if (hackerThemeToggle) {
        hackerThemeToggle.addEventListener('click', toggleHackerTheme);
        hackerThemeToggle.addEventListener('keydown', (e) => handleThemeToggleKeydown(e, toggleHackerTheme));
    }
    if (lightDarkThemeToggle) {
        lightDarkThemeToggle.addEventListener('keydown', (e) => handleThemeToggleKeydown(e, toggleTheme));
    }
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Scroll events
    window.addEventListener('scroll', function() {
        updateNavbar();
        updateActiveNavLink();
        animateSkillBars();
        revealOnScroll();
    });
    
    // Window resize
    window.addEventListener('resize', function() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }

        if (document.documentElement.getAttribute('data-theme') === 'hacker') {
            resizeMatrixCanvas();
        }
    });
});

// Add CSS for reveal animation
const revealCSS = `
.reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
}

.reveal.active {
    opacity: 1;
    transform: translateY(0);
}

.nav-link.active {
    color: var(--primary-color) !important;
}

.nav-link.active::after {
    width: 100% !important;
}
`;

// Inject reveal CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = revealCSS;
document.head.appendChild(styleSheet);

// Project card hover effects
function addProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize project card effects
addProjectCardEffects();

// Add parallax effect to hero section
function parallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = hero.style.backgroundPositionY || '0';
        const speed = 0.5;
        
        hero.style.backgroundPositionY = -(scrolled * speed) + 'px';
    });
}

// Initialize parallax effect
parallaxEffect();

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Loading animation CSS
const loadingCSS = `
body {
    opacity: 0;
    transition: opacity 0.5s ease;
}

body.loaded {
    opacity: 1;
}
`;

const loadingStyleSheet = document.createElement('style');
loadingStyleSheet.textContent = loadingCSS;
document.head.appendChild(loadingStyleSheet);
