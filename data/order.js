const ordersGrid = document.querySelector(".orders-grid");

// load cart quantity
// import { getCartQuantity } from './data/cart.js';

// cartQuantity.innerHTML = getCartQuantity();


// load orders
const orders = JSON.parse(localStorage.getItem('orders')) || [];

// const orders = [];
console.log(orders);
renderOrders();


function renderOrders() {
    if (orders.length === 0) {
        ordersGrid.innerHTML = `<p>No orders yet.</p>`;
        return;
    }

    let ordersHtml = '';

    orders.forEach(order => {
        ordersHtml += `
        <div class="order-container">
                <div class="order-header">
                    <!-- head left -->
                    <div class="order-head-left">
                        <!-- order date -->
                        <div class="order-date">
                            <div class="order-head-label">Order Placed: </div>
                            <div>${order.date}</div>
                        </div>
                        <!-- total price -->
                        <div class="order-toal">
                            <div class="order-head-label">Total: </div>
                            <div class="order-total-price">
                             $${(order.totalCents / 100).toFixed(2)}
                             </div>
                        </div>
                    </div>
                    <!-- order right  -->
                    <div class="order-head-right">
                        <div class="order-head-label">Order ID: </div>
                        <div>${order.id}</div>
                    </div>
                </div>
            ${renderOrderItems(order.item)}
        </div>
        `;
    });
    ordersGrid.innerHTML = ordersHtml;
}

function renderOrderItems(items) {
    let itemsHtml = '';

    items.forEach(item => {
        itemsHtml += `
        <div class="order-details-grid">
            <div class="product-image-container">
                <img src="${item.image}" alt="${item.name}">
            </div>

            <div class="product-details">
                <div class="product-name">
                    ${item.name}
                </div>

                <div class="product-price">
                        $${(item.priceCents / 100).toFixed(2)} × ${item.quantity}
                </div>

                <div class="product-quantity">
                    Quantity: ${item.quantity}
                </div>
            </div>

            <div class="product-actions">
                <!-- <a href="tracking.html?orderId=123&productId=456"> -->
                    <button class="track-package-button button-secondary">
                        Track package
                    </button>
            </div>
        </div>
        `
    });
    return itemsHtml;
}