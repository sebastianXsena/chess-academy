// ============================================================
// === UTILIDADES Y EVENTOS GLOBALES ===
// ============================================================

export function initGlobalEvents() {
  // Cerrar modales al hacer clic fuera
  window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
      if (event.target.id === 'cart-modal') {
        window.closeCart();
      } else {
        window.closePieceModal();
      }
    }
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      window.closePieceModal();
      window.closeCart();
    }
  });
}
