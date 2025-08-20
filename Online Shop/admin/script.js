// Utility functions for localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Render products in the admin panel
function renderProducts() {
    const products = getProducts();
    const list = document.getElementById('products-list');
    list.innerHTML = '';
    products.forEach((product, idx) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="slider-wrapper">
                <img src="${product.images[0] || ''}" alt="${product.name}" />
            </div>
            <h3>${product.name}</h3>
            <div class="price">Price: $${product.price}</div>
            <button class="delete-btn" data-idx="${idx}">Delete</button>
        `;
        list.appendChild(card);
    });
}

// Add product event
document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const price = document.getElementById('product-price').value.trim();
    const images = document.getElementById('product-image').value.split(',');
    if (!name || !price || images.length === 0) return;
    const products = getProducts();
    products.push({ name, price, images });
    saveProducts(products);
    renderProducts();
    this.reset();
});

// Delete product event
document.getElementById('products-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const idx = +e.target.dataset.idx;
        const products = getProducts();
        products.splice(idx, 1);
        saveProducts(products);
        renderProducts();
    }
});

// Initial render
renderProducts();