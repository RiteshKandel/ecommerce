document.addEventListener('DOMContentLoaded', () => {
    // Redirect to auth.html if not logged in
    if (!localStorage.getItem('token')) {
        window.location.href = 'auth.html';
    }

    // Show logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.style.display = 'inline-block';
        logoutBtn.onclick = () => {
            localStorage.removeItem('token');
            window.location.href = 'auth.html';
        };
    }

    const spinner = document.getElementById('spinner');
    const list = document.getElementById('product-list');
    const modal = document.getElementById('product-modal');
    const closeModal = document.getElementById('close-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');

    function showSpinner() {
        if (spinner) spinner.style.display = 'block';
    }
    function hideSpinner() {
        if (spinner) spinner.style.display = 'none';
    }
    function showModal(product) {
        modalImg.src = product.imageUrl;
        modalTitle.textContent = product.name;
        modalDesc.textContent = product.description;
        modalPrice.textContent = `$${product.price}`;
        modal.style.display = 'flex';
    }
    function hideModal() {
        modal.style.display = 'none';
    }
    if (closeModal) closeModal.onclick = hideModal;
    window.onclick = function(event) {
        if (event.target === modal) hideModal();
    };

    let allProducts = [];
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) cartCount.textContent = cart.length;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function addToCart(product) {
        cart.push(product);
        saveCart();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }

    function renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        if (!cartItems || !cartTotal) return;
        if (!cart.length) {
            cartItems.innerHTML = '<div style="text-align:center;color:#888;">Your cart is empty.</div>';
            cartTotal.textContent = '';
            return;
        }
        let total = 0;
        cartItems.innerHTML = '';
        cart.forEach((item, i) => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.imageUrl}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <button class="remove-cart-btn">Remove</button>
            `;
            div.querySelector('.remove-cart-btn').onclick = () => removeFromCart(i);
            cartItems.appendChild(div);
        });
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    // Cart modal logic
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCartModal = document.getElementById('close-cart-modal');
    if (cartBtn && cartModal) {
        cartBtn.onclick = () => {
            renderCart();
            cartModal.style.display = 'flex';
        };
    }
    if (closeCartModal && cartModal) {
        closeCartModal.onclick = () => {
            cartModal.style.display = 'none';
        };
    }
    window.onclick = function(event) {
        if (event.target === cartModal) cartModal.style.display = 'none';
        if (event.target === modal) hideModal();
    };

    updateCartCount();

    function renderProducts(products) {
        const list = document.getElementById('product-list');
        list.innerHTML = '';
        if (!products.length) {
            list.innerHTML = '<div style="text-align:center;width:100%;font-size:1.2em;color:#888;">No products found.</div>';
            return;
        }
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <div class="price">$${product.price}</div>
                <button class="view-btn">View Details</button>
                <button class="add-cart-btn">Add to Cart</button>
            `;
            card.querySelector('.view-btn').onclick = (e) => {
                e.stopPropagation();
                showModal(product);
            };
            card.querySelector('.add-cart-btn').onclick = (e) => {
                e.stopPropagation();
                addToCart(product);
            };
            card.onclick = () => showModal(product);
            list.appendChild(card);
        });
    }

    function filterProducts(query) {
        query = query.trim().toLowerCase();
        if (!query) {
            renderProducts(allProducts);
            return;
        }
        const filtered = allProducts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
        renderProducts(filtered);
    }

    // Debounce helper
    function debounce(fn, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', debounce(e => {
            filterProducts(e.target.value);
        }, 200));
    }

    showSpinner();
    fetch('https://89a5-103-163-182-184.ngrok-free.app/api/products')
        .then(response => response.json())
        .then(products => {
            hideSpinner();
            allProducts = products;
            renderProducts(allProducts);
        })
        .catch(err => {
            hideSpinner();
            list.innerHTML = '<div style="text-align:center;width:100%;font-size:1.2em;color:#d32f2f;">Failed to load products. Please make sure your backend is running and CORS is configured.</div>';
        });

    // Profile modal logic
    const profileBtn = document.getElementById('profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeProfileModal = document.getElementById('close-profile-modal');
    const profileForm = document.getElementById('profile-form');
    const profileEmail = document.getElementById('profile-email');
    const profilePassword = document.getElementById('profile-password');
    const profileMsg = document.getElementById('profile-msg');

    function getCurrentEmail() {
        return localStorage.getItem('token');
    }

    function openProfileModal() {
        profileMsg.textContent = '';
        profilePassword.value = '';
        fetch(`https://89a5-103-163-182-184.ngrok-free.app/api/auth/profile?email=${encodeURIComponent(getCurrentEmail())}`)
            .then(res => res.json())
            .then(user => {
                profileEmail.value = user.email;
                profileModal.style.display = 'flex';
            });
    }
    if (profileBtn && profileModal) {
        profileBtn.onclick = openProfileModal;
    }
    if (closeProfileModal && profileModal) {
        closeProfileModal.onclick = () => {
            profileModal.style.display = 'none';
        };
    }
    window.onclick = function(event) {
        if (event.target === cartModal) cartModal.style.display = 'none';
        if (event.target === modal) hideModal();
        if (event.target === profileModal) profileModal.style.display = 'none';
    };
    if (profileForm) {
        profileForm.onsubmit = async (e) => {
            e.preventDefault();
            profileMsg.textContent = '';
            const oldEmail = getCurrentEmail();
            const newEmail = profileEmail.value.trim();
            const newPassword = profilePassword.value;
            if (!newEmail) {
                profileMsg.textContent = 'Email is required.';
                return;
            }
            try {
                const res = await fetch('https://89a5-103-163-182-184.ngrok-free.app/api/auth/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: oldEmail, newEmail, newPassword })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    localStorage.setItem('token', data.email);
                    profileMsg.textContent = 'Profile updated!';
                } else {
                    profileMsg.textContent = data.message || 'Update failed.';
                }
            } catch {
                profileMsg.textContent = 'Server error.';
            }
        };
    }

    // Checkout modal logic
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutModal = document.getElementById('close-checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutName = document.getElementById('checkout-name');
    const checkoutEmail = document.getElementById('checkout-email');
    const checkoutPhone = document.getElementById('checkout-phone');
    const checkoutAddress = document.getElementById('checkout-address');
    const checkoutPayment = document.getElementById('checkout-payment');
    const checkoutMsg = document.getElementById('checkout-msg');

    // eSewa test integration
    function payWithEsewa(amount, pid) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://rc.esewa.com.np/epay/main';
        form.target = '_self';
        // eSewa test params
        const params = {
            amt: amount,
            psc: 0,
            pdc: 0,
            txAmt: 0,
            tAmt: amount,
            pid: pid,
            scd: 'EPAYTEST',
            su: window.location.origin + '/ecommerce/frontend/esewa-success.html',
            fu: window.location.origin + '/ecommerce/frontend//esewa-fail.html'
        };
        for (const key in params) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = params[key];
            form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
    }

    if (checkoutBtn && checkoutModal) {
        checkoutBtn.onclick = () => {
            if (!cart.length) return;
            // Pre-fill email from profile
            checkoutEmail.value = localStorage.getItem('token') || '';
            checkoutName.value = '';
            checkoutPhone.value = '';
            checkoutAddress.value = '';
            checkoutPayment.value = 'esewa';
            checkoutMsg.textContent = '';
            checkoutModal.style.display = 'flex';
        };
    }
    if (closeCheckoutModal && checkoutModal) {
        closeCheckoutModal.onclick = () => {
            checkoutModal.style.display = 'none';
        };
    }
    window.onclick = function(event) {
        if (event.target === cartModal) cartModal.style.display = 'none';
        if (event.target === modal) hideModal();
        if (event.target === profileModal) profileModal.style.display = 'none';
        if (event.target === checkoutModal) checkoutModal.style.display = 'none';
    };
    if (checkoutForm) {
        checkoutForm.onsubmit = async (e) => {
            e.preventDefault();
            checkoutMsg.textContent = '';
            // Validate
            if (!checkoutName.value.trim() || !checkoutEmail.value.trim() || !checkoutPhone.value.trim() || !checkoutAddress.value.trim()) {
                checkoutMsg.textContent = 'Please fill in all fields.';
                return;
            }
            if (!/^\d{10,}$/.test(checkoutPhone.value.trim())) {
                checkoutMsg.textContent = 'Enter a valid phone number.';
                return;
            }
            // If eSewa selected, redirect to eSewa
            if (checkoutPayment.value === 'esewa') {
                let total = cart.reduce((sum, item) => sum + item.price, 0);
                const pid = 'ORDER_' + Date.now();
                // Save order info for eSewa success page
                localStorage.setItem('pendingEsewaOrder', JSON.stringify({
                    userEmail: checkoutEmail.value.trim(),
                    name: checkoutName.value.trim(),
                    phone: checkoutPhone.value.trim(),
                    address: checkoutAddress.value.trim(),
                    payment: checkoutPayment.value,
                    productsJson: JSON.stringify(cart),
                    pid: pid,
                    amount: total
                }));
                payWithEsewa(total, pid);
                return;
            }
            // Simulate order success for other payment methods
            checkoutMsg.textContent = 'Order placed successfully!';
            cart = [];
            saveCart();
            renderCart();
            setTimeout(() => {
                checkoutModal.style.display = 'none';
                cartModal.style.display = 'none';
            }, 1500);
            fetch('https://riteshkandel.github.io/ecommerce/frontend/index.html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: checkoutEmail.value.trim(),
                    name: checkoutName.value.trim(),
                    phone: checkoutPhone.value.trim(),
                    address: checkoutAddress.value.trim(),
                    payment: checkoutPayment.value,
                    productsJson: JSON.stringify(cart)
                })
            });
        };
    }

    // Orders modal logic
    const ordersBtn = document.getElementById('orders-btn');
    const ordersModal = document.getElementById('orders-modal');
    const closeOrdersModal = document.getElementById('close-orders-modal');
    const ordersList = document.getElementById('orders-list');

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleString();
    }

    function renderOrders(orders) {
        if (!orders.length) {
            ordersList.innerHTML = '<div style="text-align:center;color:#888;">No orders found.</div>';
            return;
        }
        ordersList.innerHTML = '';
        orders.forEach(order => {
            let products = [];
            try { products = JSON.parse(order.productsJson); } catch {}
            const div = document.createElement('div');
            div.className = 'order-item';
            div.innerHTML = `
                <div class="order-item-title">Order #${order.id}</div>
                <div class="order-item-date">${formatDate(order.date)}</div>
                <div><b>Name:</b> ${order.name}</div>
                <div><b>Phone:</b> ${order.phone}</div>
                <div><b>Address:</b> ${order.address}</div>
                <div><b>Payment:</b> ${order.payment}</div>
                <div><b>Products:</b></div>
                <ul class="order-item-products">
                    ${products.map(p => `<li>${p.name} ($${p.price})</li>`).join('')}
                </ul>
            `;
            ordersList.appendChild(div);
        });
    }

    if (ordersBtn && ordersModal) {
        ordersBtn.onclick = () => {
            ordersList.innerHTML = '<div style="text-align:center;color:#888;">Loading...</div>';
            ordersModal.style.display = 'flex';
            fetch(`https://89a5-103-163-182-184.ngrok-free.app/api/orders?email=${encodeURIComponent(localStorage.getItem('token'))}`)
                .then(res => res.json())
                .then(renderOrders)
                .catch(() => {
                    ordersList.innerHTML = '<div style="text-align:center;color:#d32f2f;">Failed to load orders.</div>';
                });
        };
    }
    if (closeOrdersModal && ordersModal) {
        closeOrdersModal.onclick = () => {
            ordersModal.style.display = 'none';
        };
    }
    document.addEventListener('mousedown', function(event) {
        if (ordersModal && ordersModal.style.display === 'flex' && event.target === ordersModal) {
            ordersModal.style.display = 'none';
        }
    });
    window.onclick = function(event) {
        if (event.target === cartModal) cartModal.style.display = 'none';
        if (event.target === modal) hideModal();
        if (event.target === profileModal) profileModal.style.display = 'none';
        if (event.target === checkoutModal) checkoutModal.style.display = 'none';
        if (event.target === ordersModal) ordersModal.style.display = 'none';
    };
}); 
