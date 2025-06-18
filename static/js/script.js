/**
 * EcoAlerte - Main JavaScript File
 * Handles general site functionality, animations, and interactions
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('EcoAlerte initialized');
    
    // Initialize all components
    initializeCounters();
    initializeScrollAnimations();
    initializeNavigation();
    initializeTooltips();
    initializeModals();
    
    // Start hero animations
    startHeroAnimations();
});

/**
 * Initialize animated counters
 */
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Animate individual counter
 */
function animateCounter(counter) {
    const target = parseFloat(counter.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on target value
        if (target < 10) {
            counter.textContent = current.toFixed(1);
        } else {
            counter.textContent = Math.floor(current);
        }
    }, 16);
}

/**
 * Initialize scroll animations
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.stat-card, .feature-card, .action-card, .info-card, .fun-fact-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Close mobile menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize modals
 */
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function () {
            const autoFocus = modal.querySelector('[autofocus]');
            if (autoFocus) {
                autoFocus.focus();
            }
        });
    });
}

/**
 * Start hero section animations
 */
function startHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-content h1, .hero-content p, .hero-buttons');
    
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200 + 300);
    });
}

/**
 * Utility functions
 */
const EcoUtils = {
    /**
     * Format large numbers with K, M suffixes
     */
    formatNumber: function(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    /**
     * Debounce function for performance
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Get current page name
     */
    getCurrentPage: function() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index';
        return page.replace('.html', '');
    },

    /**
     * Show notification
     */
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    },

    /**
     * Copy text to clipboard
     */
    copyToClipboard: function(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            return new Promise((resolve, reject) => {
                if (document.execCommand('copy')) {
                    textArea.remove();
                    resolve();
                } else {
                    textArea.remove();
                    reject();
                }
            });
        }
    }
};

/**
 * Environmental data and facts
 */
const EcoData = {
    facts: [
        "Un arbre adulte peut absorber jusqu'à 22 kg de CO2 par an",
        "Les océans absorbent environ 30% du CO2 produit par l'humanité",
        "Une ampoule LED consomme 80% moins d'énergie qu'une ampoule incandescente",
        "Le recyclage d'une tonne de papier permet d'économiser 17 arbres",
        "Un français produit en moyenne 590 kg de déchets par an"
    ],
    
    tips: [
        "Éteignez les appareils en veille pour économiser jusqu'à 10% sur votre facture électrique",
        "Privilégiez les douches aux bains : vous économiserez jusqu'à 100 litres d'eau",
        "Compostez vos déchets organiques : ils représentent 30% de nos poubelles",
        "Utilisez des sacs réutilisables : ils remplacent jusqu'à 1000 sacs plastiques",
        "Mangez local et de saison pour réduire l'empreinte carbone de votre alimentation"
    ]
};

/**
 * Add CSS class for scrolled navbar
 */
const style = document.createElement('style');
style.textContent = `
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98) !important;
        backdrop-filter: blur(20px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);

/**
 * Performance monitoring
 */
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`EcoAlerte loaded in ${loadTime}ms`);
    });
}

/**
 * Service Worker registration (if available)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Future: implement service worker for offline functionality
        console.log('Service Worker support detected');
    });
}

// Export utilities for global use
window.EcoUtils = EcoUtils;
window.EcoData = EcoData;
