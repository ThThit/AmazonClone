const ordersGrid = document.querySelector(".orders-grid");

// load cart quantity
// import { getCartQuantity } from './data/cart.js';

// cartQuantity.innerHTML = getCartQuantity();


// load orders
const orders = JSON.parse(localStorage.getItem('orders')) || [];

// sort orders by last added
orders.sort((a, b) => new Date(b.date) - new Date(a.date));

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
        const status = getDeliveryStatus(order.date)
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
                        <!-- order status  -->
                        <div class="order-status">
                            <div class="order-head-label">Status:</div>
                            <div class="${status === 'Delivered' ? 'delivered' : 'in-transit'}">${status}</div>
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

function getDeliveryStatus(orderDate) {
    const orderTime = new Date(orderDate).getTime();
    const now = Date.now();

    const diffDate = (now - orderTime) / (1000 * 60 * 60 * 24);

    return diffDate >= 3 ? "Delivered" : "In Transit";
}