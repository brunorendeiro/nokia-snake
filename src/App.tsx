import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  COLS,
  ROWS,
  createInitialSnake,
  isOpposite,
  randomEmptyCell,
  speedForScore,
  step,
  type Direction,
  type Point,
} from './lib/game'
import { detectLocale, locales, ui, type Locale } from './i18n'
import { getStoredConsent, loadAnalytics } from './analytics'
import CookieConsent from './CookieConsent'

type Status = 'ready' | 'playing' | 'paused' | 'over'
type GameState = { snake: Point[]; direction: Direction; food: Point }
const BEST_KEY = 'nokia-snake-best'

function createInitialGame(): GameState {
  const snake = createInitialSnake()
  return { snake, direction: 'right', food: randomEmptyCell(snake) }
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => detectLocale())
  const [status, setStatus] = useState<Status>('ready')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => Number(window.localStorage.getItem(BEST_KEY)) || 0)
  const [renderState, setRenderState] = useState<GameState>(() => createInitialGame())

  const gameRef = useRef<GameState>(renderState)
  const nextDirectionRef = useRef<Direction>('right')
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const t = ui[locale]

  useEffect(() => {
    window.localStorage.setItem('nokia-snake-locale', locale)
    document.documentElement.setAttribute('lang', locale)
  }, [locale])

  useEffect(() => {
    if (getStoredConsent() === 'granted') loadAnalytics()
  }, [])

  useEffect(() => {
    if (status !== 'playing') return
    const id = window.setInterval(() => {
      const prev = gameRef.current
      const direction = isOpposite(nextDirectionRef.current, prev.direction) ? prev.direction : nextDirectionRef.current
      const result = step(prev.snake, direction, prev.food)

      if (result.dead) {
        setStatus('over')
        if (score > best) {
          setBest(score)
          window.localStorage.setItem(BEST_KEY, String(score))
        }
        return
      }

      let food = prev.food
      if (result.ate) {
        food = randomEmptyCell(result.snake)
        setScore(score + 1)
      }

      gameRef.current = { snake: result.snake, direction, food }
      setRenderState(gameRef.current)
    }, speedForScore(score))
    return () => window.clearInterval(id)
  }, [status, score, best])

  useEffect(() => {
    const keyMap: Record<string, Direction> = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      w: 'up', s: 'down', a: 'left', d: 'right',
      W: 'up', S: 'down', A: 'left', D: 'right',
    }
    function onKeyDown(event: KeyboardEvent) {
      const dir = keyMap[event.key]
      if (dir) {
        event.preventDefault()
        handleDirection(dir)
        return
      }
      if (event.key === ' ') {
        event.preventDefault()
        togglePause()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const cellMap = useMemo(() => {
    const map = new Map<string, 'head' | 'body' | 'food'>()
    renderState.snake.forEach((segment, index) => {
      map.set(`${segment.x},${segment.y}`, index === 0 ? 'head' : 'body')
    })
    map.set(`${renderState.food.x},${renderState.food.y}`, 'food')
    return map
  }, [renderState])

  function resetGame() {
    const next = createInitialGame()
    gameRef.current = next
    nextDirectionRef.current = 'right'
    setRenderState(next)
    setScore(0)
    setStatus('ready')
  }

  function handleDirection(direction: Direction) {
    if (status === 'over') return
    nextDirectionRef.current = direction
    if (status === 'ready' || status === 'paused') setStatus('playing')
  }

  function togglePause() {
    if (status === 'playing') setStatus('paused')
    else if (status === 'paused') setStatus('playing')
  }

  function handleTouchStart(event: React.TouchEvent) {
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchEnd(event: React.TouchEvent) {
    const start = touchStartRef.current
    if (!start) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    touchStartRef.current = null
    if (Math.max(absX, absY) < 24) {
      if (status === 'ready') handleDirection('right')
      return
    }
    if (absX > absY) handleDirection(dx > 0 ? 'right' : 'left')
    else handleDirection(dy > 0 ? 'down' : 'up')
  }

  const isNewBest = status === 'over' && score > 0 && score === best

  return <div className="app">
    <header className="topbar">
      <h1 className="brand">
        <span className="brand-mark">🐍</span>
        <div>
          <strong>{t.title}</strong>
          <small>{t.tagline}</small>
        </div>
      </h1>
      <div className="locale-switch" role="group" aria-label="Language">
        {locales.map(item => (
          <button key={item.id} className={locale === item.id ? 'active' : ''} onClick={() => setLocale(item.id)}>{item.label}</button>
        ))}
      </div>
    </header>

    <p className="intro">{t.intro}</p>

    <div className="phone">
      <div className="phone-brand">NOKIA</div>
      <div
        className="screen"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="screen-status">
          <span>{t.scoreLabel} {String(score).padStart(3, '0')}</span>
          <span>{t.bestLabel} {String(best).padStart(3, '0')}</span>
        </div>

        <div className="board" style={{ '--cols': COLS, '--rows': ROWS } as CSSProperties}>
          {Array.from({ length: ROWS * COLS }, (_, i) => {
            const x = i % COLS
            const y = Math.floor(i / COLS)
            const kind = cellMap.get(`${x},${y}`)
            return <div key={i} className={`cell ${kind ?? ''}`} />
          })}
        </div>

        {status !== 'playing' && (
          <div className="screen-overlay">
            {status === 'ready' && (
              <>
                <p>{t.startPrompt}</p>
                <button className="overlay-btn" onClick={() => handleDirection('right')}>▶</button>
              </>
            )}
            {status === 'paused' && <p>{t.pausePrompt}</p>}
            {status === 'over' && (
              <>
                <h3>{t.gameOverTitle}</h3>
                <p>{t.gameOverBody(score)}</p>
                {isNewBest && <p className="new-best">{t.newBest}</p>}
                <button className="overlay-btn" onClick={resetGame}>{t.playAgain}</button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="phone-keys">
        <div className="soft-keys">
          <button onClick={togglePause} disabled={status === 'ready' || status === 'over'}>
            {status === 'paused' ? t.resume : t.pause}
          </button>
          <button onClick={resetGame} aria-label={t.playAgain}>↻</button>
        </div>
        <div className="dpad">
          <button className="dpad-up" onPointerDown={() => handleDirection('up')} aria-label="up">▲</button>
          <button className="dpad-left" onPointerDown={() => handleDirection('left')} aria-label="left">◀</button>
          <div className="dpad-center" aria-hidden="true" />
          <button className="dpad-right" onPointerDown={() => handleDirection('right')} aria-label="right">▶</button>
          <button className="dpad-down" onPointerDown={() => handleDirection('down')} aria-label="down">▼</button>
        </div>
      </div>
    </div>

    <p className="how-to">{t.howTo}</p>

    <footer>
      <span>{t.footer}</span>
      <a href="https://vibe-portfolio-one.vercel.app/" target="_blank" rel="noreferrer">Created by Bruno Rendeiro</a>
      <span className="powered-badge">⚡ Powered by AI</span>
    </footer>
    <CookieConsent locale={locale} />
  </div>
}
