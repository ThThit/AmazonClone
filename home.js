const productsGrid = document.querySelector('.products-grid');
const searchInput = document.getElementById('searchBar');   

let allProducts = [];

fetch('./backend/products.json')
  .then(response => response.json())
    .then(products => {
        allProducts = products;
        console.log(products); //product array
        renderProducts(allProducts);
})
  .catch(error => {
    console.error('Error loading products:', error);
  });

searchInput.addEventListener('input', () => {
    const keyWord = searchInput.value.toLowerCase().trim();

    const filteredProducts = allProducts.filter(product => {
        return (
            product.name.toLowerCase().includes(keyWord) || product.keywords?.some(k => k.toLowerCase().includes(keyWord))
        )
    })

    renderProducts(filteredProducts);
});

function renderProducts(products) {
    let productsHTML = '';
    products.forEach(product => {
        productsHTML += `
        <div class="product-container">
                <!-- product image -->
                <div class="image-container">
                    <img src="${product.image}" alt="" class="product-image">
                </div>

                <div class="product-name limit-2lines">
                    ${product.name}
                </div>

                <!-- product rating container -->
                <div class="rating-container">
                    <img class="rating-stars" src="./Images/ratings/rating-${product.rating.stars * 10}.png">
                    <div class="rating-count link-primary">
                        ${product.rating.count}
                    </div>
                </div>

                <!-- price -->
                <div class="product-price">
                    $${(product.priceCents / 100).toFixed(2)}
                </div>

                <!-- quantity -->
                <div class="product-quantity-container">
                    <select>
                        <option selected value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>

                <div class="product-spacer"></div>

                <div class="add-to-cart">
                    <img src="./Images/icons/checkmark.png" alt="Add to cart">
                    Added
                </div>

                <button class="button-primary add-to-cart-button">
                    Add to Cart
                </button>
            </div>
        `;
    });

    productsGrid.innerHTML = productsHTML;
}