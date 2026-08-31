import { BOARD_SIZE, createGame, setDirection, sameCell, tick } from './game.js';

const board = document.querySelector('#board');
const score = document.querySelector('#score');
const status = document.querySelector('#status');
const pauseButton = document.querySelector('#pause');
const restartButton = document.querySelector('#restart');
const keyDirections = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };

let game = createGame();
let timerId;

function render() {
  board.replaceChildren();
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (sameCell({ x, y }, game.food)) cell.classList.add('food');
      if (game.snake.some((segment) => sameCell({ x, y }, segment))) cell.classList.add('snake');
      if (sameCell({ x, y }, game.snake[0])) cell.classList.add('head');
      board.append(cell);
    }
  }
  score.textContent = game.score;
  pauseButton.disabled = game.over;
  pauseButton.textContent = game.over ? 'Game Over' : game.running ? 'Pause' : 'Resume';
  status.textContent = game.won ? 'You filled the board. Restart to play again.' : game.over ? 'Game over. Restart to play again.' : game.running ? 'Use arrow keys or WASD to move.' : 'Paused.';
}

function advance() {
  game = tick(game);
  render();
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(advance, 130);
}

function changeDirection(direction) {
  game = setDirection(game, direction);
}

document.addEventListener('keydown', (event) => {
  const direction = keyDirections[event.key] || keyDirections[event.key.toLowerCase()];
  if (!direction) return;
  event.preventDefault();
  changeDirection(direction);
});

document.querySelectorAll('[data-direction]').forEach((button) => {
  button.addEventListener('click', () => changeDirection(button.dataset.direction));
});

pauseButton.addEventListener('click', () => {
  if (game.over) return;
  game = { ...game, running: !game.running };
  render();
});

restartButton.addEventListener('click', () => {
  game = createGame();
  render();
});

render();
startTimer();
