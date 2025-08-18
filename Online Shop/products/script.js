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
            <button class="view-product" data-idx="${idx}">View Product</button>
        `;
        container.appendChild(div);
    });
}
renderProducts();


document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-product')) {
        const idx = +e.target.dataset.idx;
        const products = getProducts();
        const product = products[idx];
        const viewItem = {
            name: product.name,
            price: product.price,
            images: product.images,
        };
        const view = JSON.parse(localStorage.getItem('view') || '[]');
        view.push(viewItem);
        localStorage.setItem('view', JSON.stringify(view));
        window.location.href = "/cart/Index.html";
      }
    });