// ============================================================
// === CARRITO ===
// ============================================================

let cart = [];

export function initCart() {
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.openCart = openCart;
  window.closeCart = closeCart;
  window.checkout = checkout;
}

function addToCart(courseName, price) {
  // Evitar duplicados
  const exists = cart.find(item => item.name === courseName);
  if (exists) {
    window.showToast(`"${courseName}" ya está en tu carrito`);
    openCart();
    return;
  }
  cart.push({ name: courseName, price });
  updateCartDisplay();
  updateCartCount();
  window.showToast(`✓ "${courseName}" agregado al carrito`);
  openCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = cart.length;
}

function updateCartDisplay() {
  const cartItemsDiv = document.getElementById('cart-items');
  cartItemsDiv.innerHTML = '';

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p style="text-align:center; padding: 2rem 0; color: var(--color-text-dim);">Tu carrito está vacío 🛒</p>';
    updateCartTotal();
    return;
  }

  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div>
        <span class="cart-item-name">${item.name}</span>
      </div>
      <div style="display: flex; gap: 0.75rem; align-items: center;">
        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
        <button onclick="removeFromCart(${index})"
          style="background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25);
                 color: #f87171; cursor: pointer; font-size: 1rem; width:28px; height:28px;
                 border-radius:50%; display:flex; align-items:center; justify-content:center;
                 transition: all 0.2s ease;"
          onmouseover="this.style.background='rgba(239,68,68,0.25)'"
          onmouseout="this.style.background='rgba(239,68,68,0.12)'"
        >×</button>
      </div>
    `;
    cartItemsDiv.appendChild(cartItem);
  });

  updateCartTotal();
}

function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

function openCart() {
  document.getElementById('cart-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function checkout() {
  if (cart.length === 0) {
    window.showToast('Tu carrito está vacío');
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  // Iniciar proceso de pago
  window.initPayment(total, cart);
  closeCart();
}
