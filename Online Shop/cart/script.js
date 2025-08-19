// --- Utility functions ---
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function getProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}
function getView(){
    return JSON.parse(localStorage.getItem('view') || '[]');
}
function setView(view){
    localStorage.setItem('view',JSON.stringify(view));
}

function renderMainCartProduct() {
    const view = getView();
    if (view.length === 0) {
        document.querySelector('.product_details').style.display = 'none';
        document.getElementById('related-products').innerHTML = "<p>Your cart is empty.</p>";
        return;
    }
    const product = view[view.length - 1]; // Show last added product

    // Name, price, rating (dummy), etc.
    document.getElementById('product_name').textContent = product.name;
    document.getElementById('price').textContent = "Price: $" + product.price;

    // Rating (dummy value)
    const ratingValue = 4.5;
    document.getElementById('rating-value').textContent = ratingValue;
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star${i <= Math.floor(ratingValue) ? ' full' : ''}">&#9733;</span>`;
    }
    document.getElementById('stars').innerHTML = stars;

    // Set size and quantity
    document.getElementById('size').value = "M";
    document.getElementById('quantity').value = 1;

    // Slideshow for images
    const images = product.images ? product.images : [product.image];
    renderSlideshow(images);
}

// --- Slideshow logic ---
function renderSlideshow(images) {
    const slideshow = document.getElementById('slideshow-container');
    slideshow.innerHTML = '';
    images.forEach((img, idx) => {
        const slide = document.createElement('div');
        slide.className = 'mySlides';
        slide.style.display = idx === 0 ? 'block' : 'none';
        slide.innerHTML = `<img src="${img}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;border:1px solid #222;background:#fff;">`;
        slideshow.appendChild(slide);
    });
    // Prev/Next buttons
    const prev = document.createElement('a');
    prev.className = 'prev';
    prev.innerHTML = '&#10094;';
    prev.onclick = () => plusSlides(-1, images.length);
    slideshow.appendChild(prev);

    const next = document.createElement('a');
    next.className = 'next';
    next.innerHTML = '&#10095;';
    next.onclick = () => plusSlides(1, images.length);
    slideshow.appendChild(next);

    window.currentSlideIdx = 0;
    window.totalSlides = images.length;
}

function plusSlides(n, total) {
    showSlides((window.currentSlideIdx + n + total) % total, total);
}
function showSlides(n, total) {
    const slides = document.getElementsByClassName('mySlides');
    if (!slides.length) return;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[n].style.display = 'block';
    window.currentSlideIdx = n;
}

// --- Add to cart (update quantity/size) ---
function addToCart() {
    const view = getView();
    const cart = getCart();
    const product = view[view.length - 1];
    product.size = document.getElementById('size').value;
    product.quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    cart.push(product);
    setCart(cart);
    alert('Cart updated!');
    console.log(cart);
    console.log(view);
    console.log(getProducts());
};

// --- Render related/other products ---
function renderRelatedProducts() {
    const products = getProducts();
    const view = getView();
    const relatedDiv = document.getElementById('related-products');
    relatedDiv.innerHTML = '';
    // Exclude the main cart product (by name and image)
    const main = view.length ? view[view.length - 1] : null;
    products.forEach((product, idx) => {
        if (main && product.name === main.name && main.price === product.price) return;
        const div = document.createElement('div');
        div.className = 'product';
        div.style = "border:1px solid #222;border-radius:8px;padding:10px;width:160px;background:#fff;text-align:center;cursor:pointer;transition:box-shadow 0.2s;";
        div.innerHTML = `
            <img src="${product.images && product.images[0] ? product.images[0] : ''}" alt="${product.name}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;border:1px solid #222;background:#fff;">
            <h4 style="margin:10px 0 5px 0;color:#111;">${product.name}</h4>
            <p style="color:#111;">$${product.price}</p>
        `;
        // Make product clickable: clicking it adds it to cart and reloads the view
        div.addEventListener('click', function() {
            // Add this product to cart and show as main
            const view = getView();
            // Default to size M and quantity 1
            const viewItem = {
                name: product.name,
                price: product.price,
                images: product.images,
                image: product.images && product.images[0] ? product.images[0] : '',
                size: "M",
                quantity: 1
            };
            view.push(viewItem);
            setView(view);
            // Reload page to show this product as main
            window.location.reload();
        });
        div.addEventListener('mouseover', function() {
            div.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        });
        div.addEventListener('mouseout', function() {
            div.style.boxShadow = "";
        });
        relatedDiv.appendChild(div);
    });
}

// --- On page load ---
document.addEventListener('DOMContentLoaded', function() {
  renderMainCartProduct();
  renderRelatedProducts();
});