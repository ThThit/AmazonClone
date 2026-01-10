let cart = []; 

export function addToCart(productId, name, quantity) {
    // find item in cart
    const existItem = cart.find(item => item.productId === productId);
    // if alreay cart increase quantity
    if (existItem) {
        existItem.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }

    console.log(cart);
    saveCart();
}

export function getCart() {
    return cart;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saveCart = JSON.parse(localStorage.getItem('cart'));
    if (saveCart) cart = saveCart;
}

loadCart();

function renderCart() {
    
}