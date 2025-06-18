// Shop Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productsGrid = document.getElementById('products-grid');
    const resultsCount = document.getElementById('results-count');
    const sortSelect = document.getElementById('sort-select');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
    const mobileFilterModal = document.querySelector('.mobile-filter-modal');
    const mobileFilterClose = document.querySelector('.mobile-filter-close');
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    
    // Product cards
    let allProducts = Array.from(document.querySelectorAll('.product-card'));
    let filteredProducts = [...allProducts];
    
    // Initialize shop on page load
    init();
    
    function init() {
        // Check URL parameters for initial filter or search term
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        const searchParam = urlParams.get('search') ? urlParams.get('search').toLowerCase() : '';
        
        if (categoryParam) {
            // Set the corresponding filter checkbox
            const categoryCheckbox = document.querySelector(`input[name="category"][value="${categoryParam}"]`);
            if (categoryCheckbox) {
                categoryCheckbox.checked = true;
            }
        }
        
        // Store search term globally for filtering
        window.__SHOP_SEARCH_TERM__ = searchParam;
        
        // Apply initial filters
        applyFilters();
        
        // Set up event listeners
        setupEventListeners();
        
        // Setup mobile filter modal
        setupMobileFilters();
        
        // Create Quick View modal structure once
        createQuickViewModal();
    }
    
    function setupEventListeners() {
        // Filter checkboxes
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
        
        // Sort dropdown
        sortSelect.addEventListener('change', sortProducts);
        
        // Clear filters button
        clearFiltersBtn.addEventListener('click', clearAllFilters);
        
        // Mobile filter toggle
        if (mobileFilterToggle) {
            mobileFilterToggle.addEventListener('click', openMobileFilters);
        }
        
        // Mobile filter close
        if (mobileFilterClose) {
            mobileFilterClose.addEventListener('click', closeMobileFilters);
        }
        
        // Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', addToCart);
        });
        
        // Quick view buttons
        document.querySelectorAll('.quick-view').forEach(btn => {
            btn.addEventListener('click', quickView);
        });
    }
    
    function applyFilters() {
        const activeFilters = getActiveFilters();
        
        filteredProducts = allProducts.filter(product => {
            const baseMatch = matchesFilters(product, activeFilters);
            if (!baseMatch) return false;

            // Apply search term filter if provided
            if (window.__SHOP_SEARCH_TERM__ && window.__SHOP_SEARCH_TERM__.length > 0) {
                const productName = product.querySelector('h3')?.textContent.toLowerCase() || '';
                return productName.includes(window.__SHOP_SEARCH_TERM__);
            }
            return true;
        });
        
        displayProducts(filteredProducts);
        updateResultsCount(filteredProducts.length);
        sortProducts(); // Apply current sorting
    }
    
    function getActiveFilters() {
        const filters = {
            categories: [],
            prices: [],
            features: []
        };
        
        // Dynamically collect ALL filter checkboxes (desktop + cloned mobile ones)
        const allCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
        allCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const filterType = checkbox.name;
                const filterValue = checkbox.value;
                
                switch(filterType) {
                    case 'category':
                        filters.categories.push(filterValue);
                        break;
                    case 'price':
                        filters.prices.push(filterValue);
                        break;
                    case 'features':
                        filters.features.push(filterValue);
                        break;
                }
            }
        });
        
        return filters;
    }
    
    function matchesFilters(product, filters) {
        const productCategory = product.dataset.category;
        const productPrice = parseInt(product.dataset.price);
        const productFeatures = product.dataset.features ? product.dataset.features.split(',') : [];
        
        // Category filter
        if (filters.categories.length > 0 && !filters.categories.includes(productCategory)) {
            return false;
        }
        
        // Price filter
        if (filters.prices.length > 0) {
            const matchesPrice = filters.prices.some(priceRange => {
                switch(priceRange) {
                    case '0-100':
                        return productPrice < 100;
                    case '100-200':
                        return productPrice >= 100 && productPrice < 200;
                    case '200-300':
                        return productPrice >= 200 && productPrice < 300;
                    case '300+':
                        return productPrice >= 300;
                    default:
                        return false;
                }
            });
            
            if (!matchesPrice) {
                return false;
            }
        }
        
        // Features filter
        if (filters.features.length > 0) {
            const matchesFeatures = filters.features.some(feature => 
                productFeatures.includes(feature)
            );
            
            if (!matchesFeatures) {
                return false;
            }
        }
        
        return true;
    }
    
    function displayProducts(products) {
        // Hide all products first
        allProducts.forEach(product => {
            product.classList.add('hidden');
        });
        
        // Show filtered products
        products.forEach(product => {
            product.classList.remove('hidden');
        });
        
        // Show no results message if no products match
        showNoResults(products.length === 0);
    }
    
    function showNoResults(show) {
        let noResultsEl = document.querySelector('.no-results');
        
        if (show) {
            if (!noResultsEl) {
                noResultsEl = document.createElement('div');
                noResultsEl.className = 'no-results';
                noResultsEl.innerHTML = `
                    <h3>No products found</h3>
                    <p>Try adjusting your filters to see more results</p>
                    <button class="btn btn-primary" onclick="clearAllFilters()">Clear All Filters</button>
                `;
                productsGrid.appendChild(noResultsEl);
            }
        } else {
            if (noResultsEl) {
                noResultsEl.remove();
            }
        }
    }
    
    function sortProducts() {
        const sortValue = sortSelect.value;
        
        filteredProducts.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            const nameA = a.querySelector('h3').textContent;
            const nameB = b.querySelector('h3').textContent;
            
            switch(sortValue) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'name':
                    return nameA.localeCompare(nameB);
                case 'featured':
                default:
                    return 0; // Keep original order
            }
        });
        
        // Reorder DOM elements
        filteredProducts.forEach(product => {
            productsGrid.appendChild(product);
        });
    }
    
    function updateResultsCount(count) {
        resultsCount.textContent = `Showing ${count} product${count !== 1 ? 's' : ''}`;
    }
    
    function clearAllFilters() {
        // Clear ALL checkboxes, including those inside the mobile modal
        const allCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Update URL to remove category parameter
        const url = new URL(window.location);
        url.searchParams.delete('category');
        window.history.replaceState({}, '', url);
        
        applyFilters();
    }
    
    // Make clearAllFilters globally accessible for no-results button
    window.clearAllFilters = clearAllFilters;
    
    function setupMobileFilters() {
        if (!mobileFilterModal) return;
        
        const mobileFilterContent = mobileFilterModal.querySelector('.mobile-filter-content');
        const desktopFilters = document.querySelector('.shop-filters');
        
        // Clone desktop filters to mobile modal
        if (desktopFilters && mobileFilterContent) {
            mobileFilterContent.innerHTML = desktopFilters.innerHTML;
            
            // Update mobile filter checkboxes event listeners
            const mobileCheckboxes = mobileFilterContent.querySelectorAll('input[type="checkbox"]');
            mobileCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', applyFilters);
            });
            
            // Mobile clear filters
            const mobileClearBtn = mobileFilterModal.querySelector('.clear-filters-mobile');
            if (mobileClearBtn) {
                mobileClearBtn.addEventListener('click', () => {
                    clearAllFilters();
                    closeMobileFilters();
                });
            }
            
            // Mobile apply filters
            const mobileApplyBtn = mobileFilterModal.querySelector('.apply-filters-mobile');
            if (mobileApplyBtn) {
                mobileApplyBtn.addEventListener('click', () => {
                    applyFilters();
                    closeMobileFilters();
                });
            }
        }
    }
    
    function openMobileFilters() {
        if (mobileFilterModal) {
            mobileFilterModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeMobileFilters() {
        if (mobileFilterModal) {
            mobileFilterModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    function addToCart(event) {
        const button = event.target;
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        
        // Simple cart functionality - in a real app, this would integrate with a cart system
        button.textContent = 'Added!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.background = '';
        }, 2000);
        
        // Update cart count in header
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + 1;
        }
        
        // NEW: Inform visitors this is a demo store
        alert('This is a sample website for demonstration purposes. Purchasing items is disabled.');
        
        console.log(`Added to cart: ${productName} - ${productPrice}`);
    }
    
    function quickView(event) {
        const button = event.target;
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productDescription = productCard.querySelector('.product-description').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        const productImage = productCard.querySelector('img').src;
        
        // Populate Quick View modal
        const modal = document.getElementById('quick-view-modal');
        if (!modal) return;

        modal.querySelector('.quick-view-image img').src = productImage;
        modal.querySelector('.quick-view-name').textContent = productName;
        modal.querySelector('.quick-view-description').textContent = productDescription;
        modal.querySelector('.quick-view-price').textContent = productPrice;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log(`Quick view: ${productName}`);
    }
    
    function createQuickViewModal() {
        if (document.getElementById('quick-view-modal')) return; // already exists

        const modal = document.createElement('div');
        modal.id = 'quick-view-modal';
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="quick-view-content">
                <button class="quick-view-close" aria-label="Close">&times;</button>
                <div class="quick-view-body">
                    <div class="quick-view-image"><img src="" alt="Product Image"></div>
                    <div class="quick-view-details">
                        <h3 class="quick-view-name"></h3>
                        <p class="quick-view-description"></p>
                        <div class="quick-view-price"></div>
                        <p class="quick-view-disclaimer">This is a sample website created for demonstration only. In a real store you would find size &amp; color options, inventory status, customer reviews, and an Add&nbsp;to&nbsp;Cart button here.</p>
                    </div>
                </div>
            </div>`;

        document.body.appendChild(modal);

        // Close modal handlers
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        modal.querySelector('.quick-view-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        init();
    });
    
    // Close mobile filter modal when clicking outside
    if (mobileFilterModal) {
        mobileFilterModal.addEventListener('click', function(e) {
            if (e.target === mobileFilterModal) {
                closeMobileFilters();
            }
        });
    }
}); 