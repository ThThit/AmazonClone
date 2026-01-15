let cart = [];
let products = [];

const orderDetails = document.querySelector('.order-details-container');
const totalPriceEl = document.querySelector('.order-total-price'); 
const cartQuantity = document.querySelector('.cart-quantity');
const orderDetailsContainer = document.querySelector('.order-details-container');

// Load cart from localStorage
loadCart();

cartQuantity.innerHTML = getCartQuantity();

// Load products FIRST, then render cart
fetch('./backend/products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    renderCart();
  });


export function addToCart(productId, quantity) {
    const existItem = cart.find(item => item.productId === productId);

    if (existItem) {
        existItem.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }

    saveCart();
    renderCart();
    return getCartQuantity();
}

export function getCart() {
    return cart;
}

export function getCartQuantity() {
    let total = 0; 
    cart.forEach(item => {
        total += item.quantity;
    });
    return total;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) cart = savedCart;
}

function getProductById(productId) {
    return products.find(product => product.id === productId);
}

// Render cart
function renderCart() {
    if (!orderDetails || !totalPriceEl) return;
    if (products.length === 0) return;

    let totalCents = 0;
    let orderItemsHTML = '';


    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (!product) return;

        const itemTotalCents = product.priceCents * item.quantity;
        totalCents += itemTotalCents;

        orderItemsHTML += `
        <div class="order-details-grid">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-details">
                <div class="product-name">
                    ${product.name}
                </div>

                <div class="product-price">
                    $${(product.priceCents / 100).toFixed(2)} x ${item.quantity} = $${((product.priceCents / 100) * item.quantity).toFixed(2) }
                </div>

                <div class="product-quantity">
                    Quantity: ${item.quantity}
                </div>
            </div>

            <div class="product-actions">
                <button class="btn-remove-item  button-secondary" data-product-id=${product.id}>
                    Remove Item
                </button>
            </div>
        </div>
        `;
    });

    orderDetails.innerHTML = orderItemsHTML;
    totalPriceEl.textContent = `$${(totalCents / 100).toFixed(2)}`
}

// remove item form the cart
// find item from cart with id
// remove it and update total cart quantity
if (orderDetailsContainer) {
  orderDetailsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-remove-item');
    if (!btn) return;

    const productId = btn.dataset.productId;
    removeFromCart(productId);

    cartQuantity.innerHTML = getCartQuantity();
  });
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    renderCart();
}
