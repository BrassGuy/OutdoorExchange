// Sample product data
const products = [
    {
        id: 1,
        name: "Premium Hunting Jacket",
        price: 249.99,
        image: "images/fieldjackets.png",
        category: "jackets"
    },
    {
        id: 2,
        name: "Outdoor Pants",
        price: 129.99,
        image: "images/fieldpants.png",
        category: "pants"
    },
    {
        id: 3,
        name: "Hunting Boots",
        price: 179.99,
        image: "images/fieldboots.png",
        category: "boots"
    }
];

// Function to load featured products
function loadFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Function to handle mobile menu
function setupMobileMenu() {
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-button';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('.main-nav .container');
    if (nav) {
        nav.insertBefore(menuButton, nav.firstChild);
        
        menuButton.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
}

// Function to handle cart functionality
function setupCart() {
    const cartButtons = document.querySelectorAll('.add-to-cart');
    cartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            const product = products.find(p => p.id === parseInt(productId));
            if (product) {
                // Inform visitors this is a demo store
                alert('This is a sample website for demonstration purposes. Purchasing items is disabled.');
                // Here you would typically update a cart state or send to a backend
            }
        });
    });
}

// Function to handle search functionality
function setupSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    if (!searchToggle) return;

    searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchOverlay();
    });

    function openSearchOverlay() {
        // Avoid multiple overlays
        if (document.querySelector('.search-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'search-overlay';
        overlay.innerHTML = `
            <div class="search-box">
                <input type="text" class="search-input" placeholder="Search products..." aria-label="Search products" />
                <button class="search-close" aria-label="Close search"><i class="fas fa-times"></i></button>
            </div>`;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        const input = overlay.querySelector('.search-input');
        const closeBtn = overlay.querySelector('.search-close');

        input.focus();

        input.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter') {
                const term = input.value.trim();
                if (term) {
                    window.location.href = `shop.html?search=${encodeURIComponent(term)}`;
                }
            }
        });

        const closeOverlay = () => {
            overlay.remove();
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (evt) => {
            if (evt.target === overlay) {
                closeOverlay();
            }
        });
    }
}

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

mobileMenuToggle?.addEventListener('click', toggleMobileMenu);
mobileMenuClose?.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenu?.classList.contains('active') && 
        !mobileMenu.contains(e.target) && 
        !mobileMenuToggle.contains(e.target)) {
        toggleMobileMenu();
    }
});

// Dropdown Menus
const dropdowns = document.querySelectorAll('.nav-item.dropdown');

dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Desktop hover
    dropdown.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 768) {
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
        }
    });
    
    dropdown.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 768) {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(10px)';
        }
    });
    
    // Mobile click
    link.addEventListener('click', (e) => {
        if (window.innerWidth < 768) {
            e.preventDefault();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        }
    });
});

// Announcement Slider
const announcementSlider = document.querySelector('.announcement-slider');
if (announcementSlider) {
    const slides = announcementSlider.querySelectorAll('.announcement-slide');
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].style.opacity = '0';
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].style.opacity = '1';
    }
    
    setInterval(nextSlide, 5000);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (mobileMenu?.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
});

// Shrinking Header Effect
const header = document.querySelector('.main-header');
const heroTitleLarge = document.querySelector('.hero-title-large');
const heroContent = document.querySelector('.hero-content');
let lastScroll = 0;

// Flip Card Interactions for Touch Devices
function setupFlipCards() {
    const flipContainers = document.querySelectorAll('.flip-container');
    
    flipContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            // Only handle clicks on touch devices (no hover support)
            if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
                // If the tap is on a link (e.g., the "Shop Now" button), allow the link to work normally
                if (e.target.closest('a')) {
                    return; // do not toggle card or prevent default navigation
                }
                e.preventDefault();
                this.classList.toggle('active');
                
                // Close other active flip cards
                flipContainers.forEach(otherContainer => {
                    if (otherContainer !== this) {
                        otherContainer.classList.remove('active');
                    }
                });
            }
        });
        
        // Close flip card when clicking outside
        document.addEventListener('click', function(e) {
            if (!container.contains(e.target) && container.classList.contains('active')) {
                container.classList.remove('active');
            }
        });
    });
}

// Make hero content visible as soon as DOM is ready (no long delay)
document.addEventListener('DOMContentLoaded', () => {
    if (heroContent) {
        heroContent.classList.add('visible');
    }
});

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const scrollThreshold = 50;
    
    // Handle header background and logo visibility
    if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
        if (heroTitleLarge) {
            heroTitleLarge.classList.add('shrinking');
        }
    } else {
        header.classList.remove('scrolled');
        if (heroTitleLarge) {
            heroTitleLarge.classList.remove('shrinking');
        }
    }
    
    lastScroll = currentScroll;
});

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Only set src if data-src exists, otherwise the image already has its src
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            // Only set src if data-src exists, otherwise the image already has its src
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            img.classList.add('loaded');
        });
    }
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        try {
            const response = await fetch(newsletterForm.action, {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                alert('Thank you for subscribing!');
                newsletterForm.reset();
            } else {
                throw new Error('Subscription failed');
            }
        } catch (error) {
            alert('Sorry, there was an error. Please try again later.');
        }
    });
}

// Add to Cart Animation
const addToCartButtons = document.querySelectorAll('.btn-primary');
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = parseInt(cartCount.textContent) + 1;
            cartCount.classList.add('bump');
            setTimeout(() => cartCount.classList.remove('bump'), 300);
        }
    });
});

// Video Modal Functionality
function setupVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    const videoModalClose = document.querySelector('.video-modal-close');
    const videoModalOverlay = document.querySelector('.video-modal-overlay');
    const watchStoryButton = document.querySelector('a[href="#video"]');

    // Sample video URL - replace with your actual video URL
    const videoUrl = 'https://www.youtube.com/watch?v=Se5NjX-cM5I';

    // Function to open modal
    function openVideoModal() {
        videoFrame.src = videoUrl;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function to close modal
    function closeVideoModal() {
        videoFrame.src = '';
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners
    if (watchStoryButton) {
        watchStoryButton.addEventListener('click', (e) => {
            e.preventDefault();
            openVideoModal();
        });
    }

    if (videoModalClose) {
        videoModalClose.addEventListener('click', closeVideoModal);
    }

    if (videoModalOverlay) {
        videoModalOverlay.addEventListener('click', closeVideoModal);
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    // Handle video CTA button
    const videoCTA = document.querySelector('.video-cta');
    if (videoCTA) {
        videoCTA.addEventListener('click', (e) => {
            e.preventDefault();
            closeVideoModal();
            // Smooth scroll to shop section
            const shopSection = document.querySelector('#shop');
            if (shopSection) {
                shopSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Function to warn users that this is a sample store
function setupSampleStoreWarning() {
    const sampleLinks = document.querySelectorAll('a[href="#cart"], a[href="#account"]');
    sampleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Prevent default navigation or hash change
            e.preventDefault();
            alert('This is a sample website for demonstration purposes. Purchasing items or creating an account is disabled.');
        });
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    setupMobileMenu();
    setupCart();
    setupSearch();
    setupFlipCards();
    setupVideoModal();
    setupSampleStoreWarning();
}); 
