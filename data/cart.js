let cart = [];
let products = [];
let cartDate = '';

const cartDetails = document.querySelector('.order-details-container');
const totalPriceEl = document.querySelector('.order-total-price'); 
const cartQuantity = document.querySelector('.cart-quantity');
const cartDetailsContainer = document.querySelector('.order-details-container');
// Select the specific sub-element for the date value
const orderDateElement = document.querySelector('.cart-date-value');

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
    // save cart updated date
    updateCartDate();

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
    localStorage.setItem('cartDate', cartDate); // save date as string
}

function loadCart() {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    const savedDate = localStorage.getItem('cartDate');
    if (savedCart) cart = savedCart;
    if (savedDate) cartDate = savedDate;
}

function updateCartDate() {
    const date = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    cartDate = date.toLocaleDateString('en-GB', options);
}

function getProductById(productId) {
    return products.find(product => product.id === productId);
}

// Render cart
function renderCart() {
    if (!cartDetails || !totalPriceEl) return;
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

    cartDetails.innerHTML = orderItemsHTML;

    // Only update the inner date text, preserving the "Cart Added" label
    if (orderDateElement) {
        orderDateElement.innerHTML = cartDate || ".....";
    }

    totalPriceEl.textContent = `$${(totalCents / 100).toFixed(2)}`;
}

// remove item form the cart
// find item from cart with id
// remove it and update total cart quantity
if (cartDetailsContainer) {
  cartDetailsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-remove-item');
    if (!btn) return;

    const productId = btn.dataset.productId;
    removeFromCart(productId);

    cartQuantity.innerHTML = getCartQuantity();
  });
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);

    if (cart.length > 0) {
        updateCartDate();
    } else {
        cartDate = '.....';
    }

    saveCart();
    renderCart();
}

// get the cart item list.
// generate list id
// put it in a cart in a order list as object
// to manipulate and check in orders.js


function placeOrder() {
    if (cart.length === 0) return;

    // load the exisinging order
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const orderId = `ORD-${Date.now()}`;

    let totalCents = 0;

    // cart order
    const orderItems = cart.map(item => {
        const product = getProductById(item.productId);

        const itemTotal = product.priceCents * item.quantity;

        totalCents += itemTotal;

        return {
            productId: product.id,
            name: product.name,
            priceCents: product.priceCents,
            quantity: item.quantity,
            image: product.image
        };
    });

    const order = {
        id: orderId,
        date: cartDate,
        item: orderItems,
        totalCents
    };

    savedOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(savedOrders));

    console.log(savedOrders);

    // clear cart
    cart = [];
    cartDate = '......'
    saveCart();
    renderCart();
    cartQuantity.innerHTML = 0;
}

document.querySelector('.btn-place-order')?.addEventListener('click', placeOrder);
