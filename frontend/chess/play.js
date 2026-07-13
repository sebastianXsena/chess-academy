// Variables globales para el juego
let board = null;
let game = null;

function initChessBoard() {
  // Inicializa solo una vez
  if (board !== null) {
    board.resize(); // Ajusta el tamaño al mostrar de nuevo la vista
    return;
  }

  // Comprobar si las librerías cargaron
  if (typeof Chess === 'undefined' || typeof Chessboard === 'undefined') {
    console.error('Librerías de ajedrez no cargadas');
    return;
  }

  // Instancia del juego (lógica y reglas)
  game = new Chess();

  function onDragStart(source, piece, position, orientation) {
    // Evitar mover si el juego terminó
    if (game.game_over()) return false;

    // Solo mover piezas de quien tiene el turno
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  }

  function onDrop(source, target) {
    // Validar el movimiento
    const move = game.move({
      from: source,
      to: target,
      promotion: 'q' // Promoción automática a Reina por ahora
    });

    // Si el movimiento es inválido, retroceder la pieza
    if (move === null) return 'snapback';
  }

  // Actualizar la posición visual después de que termine el arrastre
  // (necesario para enroque, captura al paso, promoción)
  function onSnapEnd() {
    board.position(game.fen());
  }

  const config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    // Usar imágenes públicas de Wikipedia/Lichess
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
  };

  board = Chessboard('myBoard', config);
}

// Función expuesta al HTML para reiniciar la partida
function resetChessBoard() {
  if (game && board) {
    game.reset();
    board.start();
  }
}

// Si la ventana cambia de tamaño, adaptar el tablero
window.addEventListener('resize', () => {
  if (board) {
    board.resize();
  }
});
