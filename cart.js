// cart.js

let cart = [];

// Initialize cart from localStorage
function initCart() {
    const storedCart = localStorage.getItem('evolve_cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
    updateCartIcon();
    renderCart();
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    renderCart();
    showToast(`Added ${product.name} to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        renderCart();
    }
}

// Render Cart UI
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');

    if (!cartItemsContainer || !cartTotalPrice) return;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; margin-top: 50px; color: var(--text-muted);">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="cart-item-actions">
                        <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', parseInt(this.value))">
                        <span class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</span>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    cartTotalPrice.textContent = `$${getCartTotal().toFixed(2)}`;
}

// Get Cart Total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get Cart Count
function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Save cart to local storage and update UI
function saveCart() {
    localStorage.setItem('evolve_cart', JSON.stringify(cart));
    updateCartIcon();
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    renderCart();
}

// Update the cart icon number in navbar
function updateCartIcon() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const count = getCartCount();
    cartCounts.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'inline-block' : 'none';
    });
}

// UI Toggles
function toggleCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

function openQuickView(name, price, image, id) {
    document.getElementById('qv-name').textContent = name;
    document.getElementById('qv-price').textContent = `$${price.toFixed(2)}`;
    document.getElementById('qv-img').src = image;
    document.getElementById('qv-qty-input').value = 1;

    const addToCartBtn = document.getElementById('qv-add-to-cart-btn');
    addToCartBtn.onclick = function () {
        const qty = parseInt(document.getElementById('qv-qty-input').value) || 1;
        const product = { id, name, price, image };
        for (let i = 0; i < qty; i++) {
            addToCart(product);
        }
        closeQuickView();
    };

    document.getElementById('quick-view-overlay').classList.add('show');
    document.getElementById('quick-view-modal').classList.add('show');
}

function closeQuickView() {
    document.getElementById('quick-view-overlay').classList.remove('show');
    document.getElementById('quick-view-modal').classList.remove('show');
}

function openCheckoutModal() {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    clearCart();
    toggleCartSidebar();

    document.getElementById('checkout-overlay').classList.add('show');
    document.getElementById('checkout-modal').classList.add('show');
}

function closeCheckoutModal() {
    document.getElementById('checkout-overlay').classList.remove('show');
    document.getElementById('checkout-modal').classList.remove('show');
}

// Simple Toast Notification
function showToast(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        document.body.appendChild(toast);

        // Add minimal styling for toast injection dynamically
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: 'var(--primary-color)',
            color: 'var(--secondary-color)',
            padding: '15px 25px',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(100px)',
            opacity: '0',
            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            zIndex: '9999',
            fontFamily: 'var(--font-body)',
            fontWeight: '500'
        });
    }

    toast.textContent = message;

    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);

    // Animate out
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
    }, 3000);
}

// Attach event listeners when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initCart();

    // Dynamically attach quick view to collection products
    const productBoxes = document.querySelectorAll('.product-box');
    productBoxes.forEach((box, index) => {
        if (!box.hasAttribute('onclick')) {
            const img = box.querySelector('img');
            const title = box.querySelector('p');
            if (img && title) {
                // Generate a mock price based on the name for demonstration
                let mockPrice = 45.00;
                const nameText = title.textContent.toLowerCase();
                if (nameText.includes('white')) mockPrice = 29.99;
                else if (nameText.includes('black')) mockPrice = 34.99;
                else if (nameText.includes('dress') || nameText.includes('leather')) mockPrice = 89.99;

                box.onclick = function () {
                    openQuickView(title.textContent, mockPrice, img.src, 'prod_' + index);
                };
            }
        }
    });
});
