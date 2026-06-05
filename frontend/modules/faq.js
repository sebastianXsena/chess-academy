// ============================================================
// === FAQ ===
// ============================================================

export function initFaq() {
  window.toggleFaq = function (button) {
    const answer = button.nextElementSibling;
    const isActive = button.classList.contains('active');

    // Cerrar todos
    document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
    document.querySelectorAll('.faq-question').forEach(b => b.classList.remove('active'));

    if (!isActive) {
      answer.classList.remove('hidden');
      button.classList.add('active');
    }
  };
}
