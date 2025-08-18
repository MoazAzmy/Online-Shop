// Get products from localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}

// Render products with image slider and add-to-cart
function renderProducts() {
    const products = getProducts();
    const container = document.querySelector('.products');
    if (!container) return;
    container.innerHTML = '';
    products.forEach((product, idx) => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <div class="slider-wrapper" data-idx="${idx}">
                <img src="${product.images[0] || ''}" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            <p class="price">Price: $${product.price}</p>
            <div class="sizes">
                <label><input type="radio" name="size-${idx}" value="S">S</label>
                <label><input type="radio" name="size-${idx}" value="M">M</label>
                <label><input type="radio" name="size-${idx}" value="L">L</label>
                <label><input type="radio" name="size-${idx}" value="XL">XL</label>
            </div>
            <div class="quantity">
                <label for="quantity-${idx}">Quantity:</label>
                <input type="number" id="quantity-${idx}" name="quantity-${idx}" min="1" max="10" value="1">
            </div>
            <button class="add-to-cart" data-idx="${idx}">View Product</button>
        `;
        container.appendChild(div);
    });
}
renderProducts();

// Add to cart logic
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const idx = +e.target.dataset.idx;
        const products = getProducts();
        const product = products[idx];
        // Get selected size
        const sizeInput = document.querySelector(`input[name="size-${idx}"]:checked`);
        const size = sizeInput ? sizeInput.value : null;
        // Get quantity
        const quantityInput = document.getElementById(`quantity-${idx}`);
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        if (!size) {
            alert('Please select a size.');
            return;
        }
        // Prepare cart item
        const cartItem = {
            name: product.name,
            price: product.price,
            image: product.images[0],
            size,
            quantity
        };
        // Get cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        // Redirect to cart page
        window.location.href = "/cart/Index.html";
      }
    });