// ============================================================
// === FORMULARIO DE CONTACTO ===
// ============================================================

export function initContactForm() {
  window.handleFormSubmit = function (event) {
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

    window.showToast(`✓ Mensaje enviado, ${name}. Te responderemos pronto.`);
  };
}
