// ============================================================
// === TABLERO DE AJEDREZ ANIMADO ===
// ============================================================

export function initChessBoard() {
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
}
