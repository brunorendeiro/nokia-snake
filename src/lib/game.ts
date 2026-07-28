export const COLS = 22
export const ROWS = 14
export const START_SPEED_MS = 160
export const MIN_SPEED_MS = 70
export const SPEED_STEP_MS = 4

export type Point = { x: number; y: number }
export type Direction = 'up' | 'down' | 'left' | 'right'

const deltas: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

export function isOpposite(a: Direction, b: Direction): boolean {
  return deltas[a].x === -deltas[b].x && deltas[a].y === -deltas[b].y
}

export function createInitialSnake(): Point[] {
  const y = Math.floor(ROWS / 2)
  const x = Math.floor(COLS / 2)
  return [
    { x, y },
    { x: x - 1, y },
    { x: x - 2, y },
  ]
}

export function randomEmptyCell(snake: Point[]): Point {
  const occupied = new Set(snake.map(p => `${p.x},${p.y}`))
  let cell: Point
  do {
    cell = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
  } while (occupied.has(`${cell.x},${cell.y}`))
  return cell
}

export type StepResult = {
  snake: Point[]
  ate: boolean
  dead: boolean
}

export function step(snake: Point[], direction: Direction, food: Point): StepResult {
  const head = snake[0]
  const delta = deltas[direction]
  const nextHead: Point = { x: head.x + delta.x, y: head.y + delta.y }

  if (nextHead.x < 0 || nextHead.x >= COLS || nextHead.y < 0 || nextHead.y >= ROWS) {
    return { snake, ate: false, dead: true }
  }

  const ate = nextHead.x === food.x && nextHead.y === food.y
  const body = ate ? snake : snake.slice(0, -1)

  const hitsSelf = body.some(segment => segment.x === nextHead.x && segment.y === nextHead.y)
  if (hitsSelf) {
    return { snake, ate: false, dead: true }
  }

  return { snake: [nextHead, ...body], ate, dead: false }
}

export function speedForScore(score: number): number {
  return Math.max(MIN_SPEED_MS, START_SPEED_MS - score * SPEED_STEP_MS)
}
