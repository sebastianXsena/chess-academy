// ============================================================
// === MODALES DE PIEZAS ===
// ============================================================

export function initModals() {
  window.openPieceModal = function (pieceName) {
    const modalId = pieceName + '-modal';
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closePieceModal = function () {
    document.querySelectorAll('.modal').forEach(modal => {
      if (!modal.id.includes('cart')) {
        modal.classList.add('hidden');
      }
    });
    document.body.style.overflow = '';
  };
}
