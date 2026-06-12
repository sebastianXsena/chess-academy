document.addEventListener('DOMContentLoaded', async function () {

  // ============================================================
  // === AUTH — Inicializar UI de autenticación ===
  // ============================================================
  if (typeof updateNavbarAuth === 'function') {
    await updateNavbarAuth();
  }
  // Actualizar contador de estudiantes en el hero (dinámico)
  if (typeof getStudentCount === 'function') {
    getStudentCount().then(count => {
      document.querySelectorAll('.stat-number[data-target="2800"]').forEach(el => {
        if (!el.dataset.animated) el.setAttribute('data-target', Math.max(count, 1));
      });
    }).catch(() => {});
  }

  // ============================================================
  // === NAVBAR: efecto scroll ===
  // ============================================================
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================================
  // === PARTÍCULAS DE FONDO ===
  // ============================================================
  const particlesContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 18;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 12 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.4 + 0.1};
    `;
    particlesContainer.appendChild(p);
  }

  // ============================================================
  // === TABLERO DE AJEDREZ ANIMADO ===
  // ============================================================
  const board = document.getElementById('chess-board');

  // Posiciones iniciales de las piezas (fila, col, pieza)
  const initialPieces = {
    '0-0': '♜', '0-1': '♞', '0-2': '♝', '0-3': '♛',
    '0-4': '♚', '0-5': '♝', '0-6': '♞', '0-7': '♜',
    '1-0': '♟', '1-1': '♟', '1-2': '♟', '1-3': '♟',
    '1-4': '♟', '1-5': '♟', '1-6': '♟', '1-7': '♟',
    '6-0': '♙', '6-1': '♙', '6-2': '♙', '6-3': '♙',
    '6-4': '♙', '6-5': '♙', '6-6': '♙', '6-7': '♙',
    '7-0': '♖', '7-1': '♘', '7-2': '♗', '7-3': '♕',
    '7-4': '♔', '7-5': '♗', '7-6': '♘', '7-7': '♖',
  };

  const cells = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement('div');
      const isLight = (row + col) % 2 === 0;
      cell.className = `chess-cell ${isLight ? 'light' : 'dark'}`;
      const piece = initialPieces[`${row}-${col}`];
      if (piece) {
        cell.textContent = piece;
        cell.style.color = (row < 2) ? 'rgba(255,255,255,0.7)' : 'rgba(201,164,74,0.9)';
        cell.style.textShadow = (row < 2)
          ? '0 1px 4px rgba(0,0,0,0.8)'
          : '0 2px 8px rgba(201,164,74,0.5)';
      }
      board.appendChild(cell);
      cells.push({ el: cell, row, col, piece: piece || null });
    }
  }

  // Secuencia de movimientos animados (apertura española simplificada)
  const moveSequence = [
    { from: [6, 4], to: [4, 4] }, // e4
    { from: [1, 4], to: [3, 4] }, // e5
    { from: [7, 6], to: [5, 5] }, // Nf3
    { from: [0, 1], to: [2, 2] }, // Nc6
    { from: [7, 5], to: [4, 2] }, // Bc4
    { from: [0, 5], to: [2, 3] }, // Bc5
    { from: [7, 3], to: [5, 3] }, // Qd3
    { from: [1, 3], to: [2, 3] }, // d6 (approx)
  ];

  let moveIndex = 0;
  let boardState = {};
  // init board state
  cells.forEach(c => {
    if (c.piece) boardState[`${c.row}-${c.col}`] = c.piece;
  });

  function getCellEl(row, col) {
    return cells.find(c => c.row === row && c.col === col)?.el;
  }

  function highlightCells(fromRow, fromCol, toRow, toCol) {
    cells.forEach(c => c.el.classList.remove('highlight'));
    getCellEl(fromRow, fromCol)?.classList.add('highlight');
    getCellEl(toRow, toCol)?.classList.add('highlight');
  }

  function executeMove(from, to) {
    const [fr, fc] = from;
    const [tr, tc] = to;
    const fromEl = getCellEl(fr, fc);
    const toEl = getCellEl(tr, tc);
    if (!fromEl || !toEl) return;

    const piece = fromEl.textContent;
    if (!piece) return;

    highlightCells(fr, fc, tr, tc);

    setTimeout(() => {
      toEl.textContent = piece;
      toEl.style.color = fromEl.style.color;
      toEl.style.textShadow = fromEl.style.textShadow;
      fromEl.textContent = '';
      fromEl.style.color = '';
      fromEl.style.textShadow = '';
      boardState[`${tr}-${tc}`] = piece;
      delete boardState[`${fr}-${fc}`];

      setTimeout(() => {
        cells.forEach(c => c.el.classList.remove('highlight'));
      }, 700);
    }, 300);
  }

  // Jugar movimientos en loop
  function playNextMove() {
    if (moveIndex >= moveSequence.length) {
      moveIndex = 0;
      // Reset board
      setTimeout(() => {
        cells.forEach(c => {
          const piece = initialPieces[`${c.row}-${c.col}`];
          c.el.textContent = piece || '';
          if (piece) {
            c.el.style.color = (c.row < 2) ? 'rgba(255,255,255,0.7)' : 'rgba(201,164,74,0.9)';
            c.el.style.textShadow = (c.row < 2)
              ? '0 1px 4px rgba(0,0,0,0.8)'
              : '0 2px 8px rgba(201,164,74,0.5)';
          } else {
            c.el.style.color = '';
            c.el.style.textShadow = '';
          }
          c.el.classList.remove('highlight');
        });
        boardState = {};
        Object.keys(initialPieces).forEach(k => { boardState[k] = initialPieces[k]; });
      }, 1500);
      return;
    }

    const move = moveSequence[moveIndex];
    executeMove(move.from, move.to);
    moveIndex++;
    setTimeout(playNextMove, 2200);
  }

  setTimeout(playNextMove, 2000);

  // ============================================================
  // === SCROLL REVEAL (Intersection Observer) ===
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => observer.observe(el));

  // ============================================================
  // === CONTADORES ANIMADOS ===
  // ============================================================
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const isPercent = el.closest('.hero-stat')?.querySelector('.stat-label')?.textContent.includes('%');

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (!isNaN(target) && !el.dataset.animated) {
          el.dataset.animated = 'true';
          animateCounter(el, target);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ============================================================
  // === MODALES DE PIEZAS ===
  // ============================================================
  function openPieceModal(pieceName) {
    const modalId = pieceName + '-modal';
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closePieceModal() {
    document.querySelectorAll('.modal').forEach(modal => {
      if (!modal.id.includes('cart')) {
        modal.classList.add('hidden');
      }
    });
    document.body.style.overflow = '';
  }

  // ============================================================
  // === CARRITO ===
  // ============================================================
  let cart = [];

  function addToCart(courseName, price) {
    // Evitar duplicados
    const exists = cart.find(item => item.name === courseName);
    if (exists) {
      showToast(`"${courseName}" ya está en tu carrito`);
      openCart();
      return;
    }
    cart.push({ name: courseName, price });
    updateCartDisplay();
    updateCartCount();
    showToast(`✓ "${courseName}" agregado al carrito`);
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
      showToast('Tu carrito está vacío');
      return;
    }
    closeCart();
    openPaymentModal();
  }

  // ============================================================
  // === PAGO WILLOPAY ===
  // ============================================================
  function openPaymentModal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('pay-amount-display').textContent = `$${total.toFixed(2)}`;
    document.getElementById('payment-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closePaymentModal() {
    document.getElementById('payment-modal').classList.add('hidden');
    document.body.style.overflow = '';
  }

  function loadTestData() {
    document.getElementById('pay-firstName').value = 'Juan';
    document.getElementById('pay-lastName').value = 'Pérez';
    document.getElementById('pay-documentId').value = '123456789';
    document.getElementById('pay-phone').value = '3001234567';
    document.getElementById('pay-email').value = 'test@email.com';
    document.getElementById('pay-cardNumber').value = '4242424242424242';
    document.getElementById('pay-expiryDate').value = '12/28';
    document.getElementById('pay-cvv').value = '123';
    showToast('⚡ Datos de prueba cargados');
  }

  function generateSessionId() {
    return `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  async function handlePaymentSubmit(event) {
    event.preventDefault();
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const btn = document.getElementById('btn-process-payment');
    const originalText = btn.innerHTML;
    
    const paymentData = {
      firstName: document.getElementById('pay-firstName').value,
      lastName: document.getElementById('pay-lastName').value,
      documentId: document.getElementById('pay-documentId').value,
      phone: document.getElementById('pay-phone').value,
      email: document.getElementById('pay-email').value,
      cardNumber: document.getElementById('pay-cardNumber').value.replace(/\s/g, ''),
      expiryDate: document.getElementById('pay-expiryDate').value,
      cvv: document.getElementById('pay-cvv').value,
      amount: total,
      sessionId: generateSessionId()
    };

    btn.innerHTML = '⏳ Procesando pago...';
    btn.disabled = true;

    try {
      const response = await fetch('https://unissued-unblenchingly-clarine.ngrok-free.dev/api/v1/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      
      const data = await response.json();
      
      if (data.status === 'APPROVED') {
        showToast('✅ ' + data.message);
        cart = []; // Vaciar carrito
        updateCartDisplay();
        updateCartCount();
        setTimeout(() => closePaymentModal(), 1500);
      } else {
        showToast('❌ ' + (data.message || 'Pago rechazado'));
      }
    } catch (error) {
      showToast('❌ Error de conexión con la pasarela de pago');
      console.error('Error:', error);
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }

  // ============================================================
  // === TOAST NOTIFICACIONES ===

  // ============================================================
  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 5rem;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: var(--color-surface2, #111827);
      border: 1px solid rgba(201,164,74,0.35);
      color: #fff;
      padding: 0.85rem 1.75rem;
      border-radius: 50px;
      font-family: 'Outfit', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 8px 30px rgba(0,0,0,0.4);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      white-space: nowrap;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
      });
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  }

  // ============================================================
  // === FAQ ===
  // ============================================================
  function toggleFaq(button) {
    const answer = button.nextElementSibling;
    const isActive = button.classList.contains('active');

    // Cerrar todos
    document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
    document.querySelectorAll('.faq-question').forEach(b => b.classList.remove('active'));

    if (!isActive) {
      answer.classList.remove('hidden');
      button.classList.add('active');
    }
  }

  // ============================================================
  // === FORMULARIO DE CONTACTO ===
  // ============================================================
  function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const btn = event.target.querySelector('button[type="submit"]');

    const originalText = btn.textContent;
    btn.textContent = '✓ ¡Mensaje enviado!';
    btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      event.target.reset();
    }, 3000);

    showToast(`✓ Mensaje enviado, ${name}. Te responderemos pronto.`);
  }

  // ============================================================
  // === SMOOTH SCROLL PARA NAV LINKS ===
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#carrito') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // === CERRAR MODALES AL HACER CLIC FUERA ===
  // ============================================================
  window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
      if (event.target.id === 'cart-modal') {
        closeCart();
      } else if (event.target.id === 'payment-modal') {
        closePaymentModal();
      } else {
        closePieceModal();
      }
    }
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePieceModal();
      closeCart();
      if (typeof closePaymentModal === 'function') closePaymentModal();
    }
  });

  // ============================================================
  // === EXPONER FUNCIONES GLOBALES ===
  // ============================================================
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.openCart = openCart;
  window.closeCart = closeCart;
  window.checkout = checkout;
  window.toggleFaq = toggleFaq;
  window.handleFormSubmit = handleFormSubmit;
  window.openPieceModal = openPieceModal;
  window.closePieceModal = closePieceModal;
  window.openPaymentModal = openPaymentModal;
  window.closePaymentModal = closePaymentModal;
  window.handlePaymentSubmit = handlePaymentSubmit;
  window.loadTestData = loadTestData;

  // ============================================================
  // === AUTH MODALES (funciones globales desde HTML) ===
  // ============================================================
  window.openLogin = function () {
    document.getElementById('login-modal').classList.remove('hidden');
    document.getElementById('register-modal').classList.add('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.openRegister = function () {
    document.getElementById('register-modal').classList.remove('hidden');
    document.getElementById('login-modal').classList.add('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeAuth = function () {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('register-modal').classList.add('hidden');
    document.body.style.overflow = '';
  };

  window.switchToRegister = function () {
    window.openLogin && document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('register-modal').classList.remove('hidden');
  };

  window.switchToLogin = function () {
    document.getElementById('register-modal').classList.add('hidden');
    document.getElementById('login-modal').classList.remove('hidden');
  };

  // Cerrar auth modales al click fuera
  ['login-modal', 'register-modal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (e.target === el) window.closeAuth();
      });
    }
  });

  window.handleLogin = async function (event) {
    event.preventDefault();
    const btn = document.getElementById('btn-login');
    const errDiv = document.getElementById('login-error');
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    btn.textContent = '⏳ Entrando...';
    btn.disabled = true;
    errDiv.style.display = 'none';

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Credenciales incorrectas');
      }

      const data = await response.json();
      localStorage.setItem('chessmaster_token', data.access_token);
      localStorage.setItem('chessmaster_user', JSON.stringify(data.user));

      // Todos los roles van al dashboard (que se adapta por rol internamente)
      window.location.href = 'dashboard.html';
    } catch (err) {
      errDiv.textContent = '❌ ' + (err.message.includes('Invalid') ? 'Email o contraseña incorrectos.' : err.message);
      errDiv.style.display = 'block';
      btn.textContent = 'Entrar →';
      btn.disabled = false;
    }
  };

  window.handleRegister = async function (event) {
    event.preventDefault();
    const btn = document.getElementById('btn-register');
    const errDiv = document.getElementById('register-error');

    // Obtener todos los valores y mapear al formato que espera la API
    const firstName = document.getElementById('reg-name').value;
    const lastName = document.getElementById('reg-apellido').value;
    const username = document.getElementById('reg-usuario').value;
    const email = document.getElementById('reg-email').value;
    const age = parseInt(document.getElementById('reg-edad').value, 10);
    const city = document.getElementById('reg-ciudad').value;
    const phone = document.getElementById('reg-telefono').value;
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;

    if (password !== passwordConfirm) {
      errDiv.style.color = '';
      errDiv.textContent = '❌ Las contraseñas no coinciden.';
      errDiv.style.display = 'block';
      return;
    }

    btn.textContent = '⏳ Creando cuenta...';
    btn.disabled = true;
    errDiv.style.display = 'none';

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, username, email, age, city, phone, password, passwordConfirm }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = Array.isArray(errorData.message) ? errorData.message.join(', ') : (errorData.message || 'Error al registrar');
        throw new Error(msg);
      }

      const data = await response.json();
      localStorage.setItem('chessmaster_token', data.access_token);
      localStorage.setItem('chessmaster_user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } catch (err) {
      errDiv.style.color = '';
      errDiv.textContent = '❌ ' + err.message;
      errDiv.style.display = 'block';
      btn.textContent = 'Crear Cuenta ♟';
      btn.disabled = false;
    }
  };
});

