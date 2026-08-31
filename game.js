export const BOARD_SIZE = 18;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const INITIAL_SNAKE = [
  { x: 9, y: 9 },
  { x: 8, y: 9 },
  { x: 7, y: 9 },
];

export function sameCell(a, b) {
  return Boolean(a && b && a.x === b.x && a.y === b.y);
}

export function spawnFood(snake, random = Math.random, size = BOARD_SIZE) {
  const openCells = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const cell = { x, y };
      if (!snake.some((segment) => sameCell(segment, cell))) openCells.push(cell);
    }
  }
  return openCells.length ? openCells[Math.floor(random() * openCells.length)] : null;
}

export function createGame(random = Math.random) {
  const snake = INITIAL_SNAKE.map((segment) => ({ ...segment }));
  return {
    snake,
    direction: DIRECTIONS.right,
    nextDirection: DIRECTIONS.right,
    food: spawnFood(snake, random),
    score: 0,
    running: true,
    over: false,
    won: false,
  };
}

export function setDirection(game, direction) {
  const next = DIRECTIONS[direction];
  if (!next) return game;
  const current = game.direction;
  if (current.x + next.x === 0 && current.y + next.y === 0) return game;
  return { ...game, nextDirection: next };
}

export function tick(game, random = Math.random, size = BOARD_SIZE) {
  if (!game.running || game.over) return game;

  const direction = game.nextDirection;
  const head = game.snake[0];
  const nextHead = { x: head.x + direction.x, y: head.y + direction.y };
  const eatsFood = sameCell(nextHead, game.food);
  const bodyToCheck = eatsFood ? game.snake : game.snake.slice(0, -1);
  const hitWall = nextHead.x < 0 || nextHead.x >= size || nextHead.y < 0 || nextHead.y >= size;
  const hitSelf = bodyToCheck.some((segment) => sameCell(segment, nextHead));

  if (hitWall || hitSelf) return { ...game, direction, running: false, over: true };

  const snake = [nextHead, ...game.snake];
  if (!eatsFood) snake.pop();
  const food = eatsFood ? spawnFood(snake, random, size) : game.food;
  return {
    ...game,
    snake,
    direction,
    food,
    score: game.score + (eatsFood ? 1 : 0),
    running: food !== null,
    over: food === null,
    won: food === null,
  };
}
