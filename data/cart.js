let cart = []; 

export function addToCart(productId, quantity) {
    const existItem = cart.find(item => item.productId === productId);

    if (existItem) {
        existItem.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }

    console.log(cart);
}
