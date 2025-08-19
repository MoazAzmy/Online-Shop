// Utility: Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Format price (EGP)
function formatPrice(price) {
    return price + " ج.م";
}

// Group cart items by name, size, and image
function groupCartItems(cart) {
    const grouped = [];
    cart.forEach(item => {
        const key = item.name + '|' + (item.size || '-') + '|' + (item.image || (item.images && item.images[0]) || '');
        let found = grouped.find(g => g._key === key);
        if (found) {
            found.quantity += item.quantity || 1;
            found._indexes.push(item._cartIndex);
        } else {
            const newItem = Object.assign({}, item);
            newItem.quantity = item.quantity || 1;
            newItem._key = key;
            newItem._indexes = [item._cartIndex];
            grouped.push(newItem);
        }
    });
    return grouped;
}

// Render cart summary in checkout
function renderCartSummary() {
    let cart = getCart();
    // Attach original index for each item for removal
    cart.forEach((item, idx) => item._cartIndex = idx);

    const cartList = document.querySelector('.cart-list');
    const totalsDivs = document.querySelectorAll('.totals > div span:last-child');
    let subtotal = 0;

    cartList.innerHTML = '';

    if (cart.length === 0) {
        cartList.innerHTML = '<li class="cart-item"><div class="info">لا توجد منتجات في السلة</div></li>';
        if (totalsDivs[0]) totalsDivs[0].textContent = "0 ج.م";
        if (totalsDivs[2]) totalsDivs[2].textContent = "0 ج.م";
        if (totalsDivs[3]) totalsDivs[3].innerHTML = "<strong>0 ج.م</strong>";
        return;
    }

    // Group items
    const groupedCart = groupCartItems(cart);

    groupedCart.forEach((item, idx) => {
        const price = parseFloat(item.price) * (item.quantity || 1);
        subtotal += price;
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <img src="${item.image || (item.images && item.images[0]) || 'https://via.placeholder.com/64'}" alt="${item.name}">
            <div class="info">
                <strong>${item.name}</strong>
                <span class="muted">مقاس: ${item.size || '-'} · كمية: 
                    <button class="decrease-btn" data-key="${item._key}" title="إنقاص">-</button>
                    <span class="cart-qty">${item.quantity}</span>
                    <button class="increase-btn" data-key="${item._key}" title="زيادة">+</button>
                </span>
            </div>
            <div class="price">${formatPrice(price)}</div>
            <button class="remove-btn" data-key="${item._key}" title="حذف" style="margin-right:10px;background:transparent;border:none;color:#e74c3c;font-size:22px;cursor:pointer;">×</button>
        `;
        cartList.appendChild(li);
    });

    // Shipping calculation
    let shipping = 0;
    const expressRadio = document.querySelector('input[name="shipping"][value="express"]');
    if (expressRadio && expressRadio.checked) {
        shipping = 100;
    }

    // Update totals
    let total = subtotal + shipping;
    if (totalsDivs[0]) totalsDivs[0].textContent = formatPrice(subtotal);
    if (totalsDivs[1]) totalsDivs[1].textContent = shipping === 0 ? "مجاني" : formatPrice(shipping);
    document.getElementById("grand-total").textContent = total +' ج.م'; 
}

// Handle increase, decrease, and remove actions
document.addEventListener('click', function(e) {
    // Increase quantity
    if (e.target.classList.contains('increase-btn')) {
        const key = e.target.getAttribute('data-key');
        let cart = getCart();
        // Find first matching item and duplicate it (simulate adding one more)
        const idx = cart.findIndex(item => {
            const k = item.name + '|' + (item.size || '-') + '|' + (item.image || (item.images && item.images[0]) || '');
            return k === key;
        });
        if (idx !== -1) {
            // Add another instance of the same product
            cart.push(Object.assign({}, cart[idx]));
            setCart(cart);
            renderCartSummary();
        }
    }
    // Decrease quantity
    if (e.target.classList.contains('decrease-btn')) {
        const key = e.target.getAttribute('data-key');
        let cart = getCart();
        // Remove one instance of this product
        const idx = cart.findIndex(item => {
            const k = item.name + '|' + (item.size || '-') + '|' + (item.image || (item.images && item.images[0]) || '');
            return k === key;
        });
        if (idx !== -1) {
            cart.splice(idx, 1);
            setCart(cart);
            renderCartSummary();
        }
    }
    // Remove all of this product
    if (e.target.classList.contains('remove-btn')) {
        const key = e.target.getAttribute('data-key');
        let cart = getCart();
        cart = cart.filter(item => {
            const k = item.name + '|' + (item.size || '-') + '|' + (item.image || (item.images && item.images[0]) || '');
            return k !== key;
        });
        setCart(cart);
        renderCartSummary();
    }
});

// Listen for shipping option change to update totals
document.addEventListener('DOMContentLoaded', function() {
    renderCartSummary();
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', renderCartSummary);
    });
});