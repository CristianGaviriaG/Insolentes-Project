/**
 * NAVBAR SYSTEM - Modular & Clean
 * Handles: Auto-hide on scroll, responsive hamburger menu, smooth animations
 * Dependencies: navbar.css
 */

class NavbarController {
    constructor() {
        this.navbar = null;
        this.hamburger = null;
        this.navMenu = null;
        this.overlay = null;
        this.lastScroll = 0;
        this.isScrolling = false;
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.findElements();
        this.createOverlay();
        this.bindEvents();
        this.setActiveLink();
        console.log('✅ Navbar system initialized');
    }
    
    findElements() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.querySelector('.navbar nav');
        
        if (!this.navbar) {
            console.error('❌ Navbar element not found');
            return;
        }
        
        if (!this.hamburger || !this.navMenu) {
            console.warn('⚠️ Mobile menu elements not found');
        }
    }
    
    createOverlay() {
        // Create overlay for mobile menu
        this.overlay = document.createElement('div');
        this.overlay.className = 'navbar-overlay';
        document.body.appendChild(this.overlay);
    }
    
    bindEvents() {
        // Scroll events for auto-hide
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Mobile menu events
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeMobileMenu());
        }

        // Close menu on link click (mobile)
        if (this.navMenu) {
            this.navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });
        }

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;
        const scrollDifference = currentScroll - this.lastScroll;
        
        // Add scrolled class for enhanced backdrop blur effect
        if (currentScroll > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Auto-hide logic
        if (currentScroll <= 100) {
            // Near top - always show
            this.navbar.classList.remove('navbar-hidden');
        } else if (scrollDifference < -2) {  // Very sensitive threshold for scroll up
            // Scrolling up - ALWAYS show
            this.navbar.classList.remove('navbar-hidden');
        } else if (scrollDifference > 5 && currentScroll > 200) {
            // Scrolling down significantly - hide if menu not open
            if (!this.isMenuOpen) {
                this.navbar.classList.add('navbar-hidden');
            }
        }
        
        this.lastScroll = currentScroll;
    }
    
    
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMenuOpen = true;
        this.hamburger.classList.add('open');
        this.navMenu.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Prevent navbar from hiding when menu is open
        this.navbar.classList.remove('navbar-hidden');
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.hamburger.classList.remove('open');
        this.navMenu.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 900 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }
    
    setActiveLink() {
        // Set active link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = this.navMenu?.querySelectorAll('a') || [];
        
        links.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === '#inicio')) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize navbar system
const navbarSystem = new NavbarController();