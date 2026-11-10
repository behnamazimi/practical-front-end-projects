
// Selecionando os elementos do HTML
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#status');
const restartButton = document.querySelector('#restart');

// Variáveis do jogo
let currentPlayer = 'x';
let gameActive = true;

// Combinações de vitória
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6]
];

// Função para realizar uma jogada
function handleCellClick(index) {

  if (!gameActive) {
    return;
  }

  if (
    cells[index].classList.contains('x') ||
    cells[index].classList.contains('o')
  ) {
    return;
  }

  cells[index].classList.add(currentPlayer);

  // Verifica vitória
  if (checkWinner()) {
    return;
  }

  // Verifica empate
  if (checkDraw()) {
    return;
  }

  // Alterna o jogador
  changePlayer();
}

// Função para verificar vitória
function checkWinner() {

  for (let condition of winningConditions) {

    const [a, b, c] = condition;

    if (
      cells[a].classList.contains(currentPlayer) &&
      cells[b].classList.contains(currentPlayer) &&
      cells[c].classList.contains(currentPlayer)
    ) {

      gameActive = false;

      statusText.textContent =
        `Jogador ${currentPlayer.toUpperCase()} venceu!`;

      return true;
    }
  }

  return false;
}

// Função para verificar empate
function checkDraw() {

  const allCellsFilled = Array.from(cells).every(cell =>
    cell.classList.contains('x') ||
    cell.classList.contains('o')
  );

  if (allCellsFilled) {

    gameActive = false;

    statusText.textContent = 'EMPATE!';

    return true;
  }

  return false;
}

// Função para alternar os jogadores
function changePlayer() {

  currentPlayer = currentPlayer === 'x' ? 'o' : 'x';

  statusText.textContent =
    `Vez do jogador: ${currentPlayer.toUpperCase()}`;
}

// Identificando os cliques nas células
cells.forEach((cell, index) => {

  cell.addEventListener('click', () => {
    handleCellClick(index);
  });

});

// Função para reiniciar o jogo
function restartGame() {

  currentPlayer = 'x';
  gameActive = true;

  cells.forEach(cell => {
    cell.classList.remove('x', 'o');
  });

  statusText.textContent = 'Vez do jogador: X';
}

// Evento do botão de reiniciar
restartButton.addEventListener('click', restartGame);