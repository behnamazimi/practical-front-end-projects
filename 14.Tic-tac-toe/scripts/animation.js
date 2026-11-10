const efeitoBackground = document.querySelector('.background-effect');

// Função para criar partículas em formato de X e O
function criarParticulas(x, y) {

  for (let i = 0; i < 15; i++) {

    const particula = document.createElement('span');

    particula.classList.add('particula');

    // Escolhe aleatoriamente entre X e O
    particula.textContent = Math.random() < 0.5 ? 'X' : 'O';

    // Posição inicial
    particula.style.left = x + '%';
    particula.style.top = y + '%';

    // Direção aleatória da explosão
    const direcaoX = (Math.random() - 0.5) * 160;
    const direcaoY = (Math.random() - 0.5) * 160;

    particula.style.setProperty('--x', direcaoX + 'px');
    particula.style.setProperty('--y', direcaoY + 'px');

    // Tamanhos variados
    particula.style.fontSize = (8 + Math.random() * 8) + 'px';

    efeitoBackground.appendChild(particula);

    // Remove a partícula após a animação
    particula.addEventListener('animationend', () => {
      particula.remove();
    });
  }
}

// Função para criar os símbolos e realizar a explosão
function criarSimbolo() {

  const simbolo = document.createElement('span');

  simbolo.classList.add('simbolo-explosao');

  // Escolhe X ou O aleatoriamente
  simbolo.textContent = Math.random() < 0.5 ? 'X' : 'O';

  // Define uma posição aleatória na tela
  const x = Math.random() * 95;
  const y = Math.random() * 95;

  simbolo.style.left = x + '%';
  simbolo.style.top = y + '%';

  efeitoBackground.appendChild(simbolo);

  // Quando o símbolo termina de aparecer, acontece a explosão
  simbolo.addEventListener('animationend', () => {

    criarParticulas(x, y);

    simbolo.remove();

  }, { once: true });

}

// Cria um novo símbolo a cada intervalo
setInterval(criarSimbolo, 800);
