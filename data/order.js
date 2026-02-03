// load orders
const orders = JSON.parse(localStorage.getItem('orders')) || [];

// sort orders by last added
orders.sort((a, b) => new Date(b.date) - new Date(a.date));

const ordersGrid = document.querySelector(".orders-grid");

if (document.querySelector('.orders-grid')) {
    renderOrders();
}



function renderOrders() {
    if (!ordersGrid) return;

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
                ${renderOrderItems(order.item, order.id)}
        </div>
        `;
    });
    ordersGrid.innerHTML = ordersHtml;
}

function renderOrderItems(items, orderId) {
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
                 <a href="tracking.html?orderId=${orderId}&productId=${item.productId}">
\
                    <button class="track-package-button button-secondary">
                        Track package
                    </button>
                </a>
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

// tracking
function initTracking() {
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get('orderId');
    const productId = url.searchParams.get('productId');

    if (!orderId || !productId) return;

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const item = order.item.find(i => i.productId == productId);
    if (!item) return;

    console.log('Order:', order);
    console.log('Tracked item:', item);

    console.log(item.image)

    // porduct info 
    const productInfos = document.querySelectorAll('.product-info');

    if (productInfos.length >= 2) {
        productInfos[0].textContent = item.name;
        productInfos[1].textContent = `Quantity: ${item.quantity}`;
    }


    // img
    const img = document.querySelector('.product-image');

    if (img) {
        img.src = item.image;
        img.alt = item.name;
    }

    // delivery date
    const orderDate = new Date(order.date);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 3);

    const deliveryDateEl = document.querySelector('.delivery-date');

    if (deliveryDateEl) {
        deliveryDateEl.textContent = `Arriving on ${deliveryDate.toDateString()}`;
    }

}


initTracking();