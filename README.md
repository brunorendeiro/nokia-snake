# Nokia Snake

Um clone do jogo Snake clássico dos telemóveis Nokia (3310/3210), pensado
primeiro para telemóvel: ecrã LCD verde, D-pad tátil grande e swipe direto no
ecrã, além de setas/WASD no desktop.

## Ideia

- Mecânica clássica: sem wraparound — bater na parede ou em ti mesmo termina o
  jogo, tal como no Nokia original.
- Velocidade aumenta ligeiramente a cada maçã comida.
- Recorde pessoal guardado no `localStorage` do browser.
- Instalável como app (PWA) diretamente do browser, funciona offline depois da
  primeira visita.
- Interface disponível em português (PT-PT), inglês e alemão.
- 100% client-side, sem backend, sem login.

## Executar

```bash
npm install
npm run dev
```

Abrir <http://127.0.0.1:5193>.

## Validar

```bash
npm run check
npm run build
```

## Gerar ícones PWA

```bash
npm run gen-icons
```

Gera `public/icon-64.png`, `public/icon-192.png` e `public/icon-512.png` a
partir de um pequeno padrão pixel-art definido em `scripts/gen-icons.mjs` (sem
depender de nenhuma biblioteca de imagem externa).

## Ideias para evoluir

- Obstáculos ou modo "sem paredes" (wraparound) como variante opcional.
- Tabela de recordes partilhável (ex.: link com pontuação).
- Efeitos sonoros retro (beep ao comer, beep ao morrer).

O README deve ser atualizado quando o conceito, as funcionalidades ou as
prioridades mudarem.

## Nota técnica — Google Analytics

O Analytics só é carregado depois de o utilizador aceitar os cookies. A função
`gtag` deve enviar o objeto nativo `arguments` para `dataLayer`:

```js
function gtag() {
  dataLayer.push(arguments)
}
```

Não substituir por `dataLayer.push(args)` com um rest parameter (`...args`):
apesar de o script da Google carregar, o comando `config` e o `page_view` podem
não ser processados.
