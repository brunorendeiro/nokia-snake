export type Locale = 'pt' | 'en' | 'de'

export const locales: { id: Locale; label: string }[] = [
  { id: 'pt', label: 'PT' },
  { id: 'en', label: 'EN' },
  { id: 'de', label: 'DE' },
]

export function detectLocale(): Locale {
  const stored = window.localStorage.getItem('nokia-snake-locale')
  if (stored === 'pt' || stored === 'en' || stored === 'de') return stored
  const browser = navigator.language.slice(0, 2).toLowerCase()
  if (browser === 'de') return 'de'
  if (browser === 'pt') return 'pt'
  return 'en'
}

type UiStrings = {
  title: string
  tagline: string
  intro: string
  startPrompt: string
  pausePrompt: string
  scoreLabel: string
  bestLabel: string
  gameOverTitle: string
  gameOverBody: (score: number) => string
  newBest: string
  playAgain: string
  pause: string
  resume: string
  howTo: string
  footer: string
  cookieBody: string
  cookieAccept: string
  cookieReject: string
}

export const ui: Record<Locale, UiStrings> = {
  pt: {
    title: 'Nokia Snake',
    tagline: 'A cobra clássica, agora no browser',
    intro: 'A mesma Snake do teu Nokia 3310 — come maçãs, cresce e não batas nas paredes nem em ti mesmo.',
    startPrompt: 'Toca ou prime uma seta para começar',
    pausePrompt: 'Em pausa',
    scoreLabel: 'PONTOS',
    bestLabel: 'MELHOR',
    gameOverTitle: 'Fim de jogo',
    gameOverBody: score => `Fizeste ${score} pontos.`,
    newBest: 'Novo recorde!',
    playAgain: 'Jogar outra vez',
    pause: 'Pausa',
    resume: 'Continuar',
    howTo: 'Setas ou D-pad para mover · desliza no ecrã no telemóvel',
    footer: 'Um clássico recriado por Bruno Rendeiro.',
    cookieBody: 'Uso o Google Analytics para perceber quantas pessoas visitam este projeto. Aceitas cookies analíticos?',
    cookieAccept: 'Aceitar',
    cookieReject: 'Recusar',
  },
  en: {
    title: 'Nokia Snake',
    tagline: 'The classic snake game, now in your browser',
    intro: 'The same Snake from your old Nokia 3310 — eat apples, grow, and don’t hit the walls or yourself.',
    startPrompt: 'Tap or press an arrow to start',
    pausePrompt: 'Paused',
    scoreLabel: 'SCORE',
    bestLabel: 'BEST',
    gameOverTitle: 'Game over',
    gameOverBody: score => `You scored ${score} points.`,
    newBest: 'New high score!',
    playAgain: 'Play again',
    pause: 'Pause',
    resume: 'Resume',
    howTo: 'Arrows or D-pad to move · swipe the screen on mobile',
    footer: 'A classic recreated by Bruno Rendeiro.',
    cookieBody: 'I use Google Analytics to understand how many people visit this project. Do you accept analytics cookies?',
    cookieAccept: 'Accept',
    cookieReject: 'Reject',
  },
  de: {
    title: 'Nokia Snake',
    tagline: 'Der Klassiker, jetzt im Browser',
    intro: 'Die gleiche Snake wie auf deinem alten Nokia 3310 — iss Äpfel, wachse, und stoße nicht gegen die Wand oder dich selbst.',
    startPrompt: 'Tippen oder einen Pfeil drücken, um zu starten',
    pausePrompt: 'Pausiert',
    scoreLabel: 'PUNKTE',
    bestLabel: 'BESTWERT',
    gameOverTitle: 'Spiel vorbei',
    gameOverBody: score => `Du hast ${score} Punkte erreicht.`,
    newBest: 'Neuer Rekord!',
    playAgain: 'Nochmal spielen',
    pause: 'Pause',
    resume: 'Weiter',
    howTo: 'Pfeiltasten oder D-Pad zum Bewegen · auf dem Handy einfach wischen',
    footer: 'Ein Klassiker, neu gebaut von Bruno Rendeiro.',
    cookieBody: 'Ich verwende Google Analytics, um zu verstehen, wie viele Menschen dieses Projekt besuchen. Akzeptierst du Analyse-Cookies?',
    cookieAccept: 'Akzeptieren',
    cookieReject: 'Ablehnen',
  },
}
