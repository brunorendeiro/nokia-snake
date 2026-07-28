// One-off generator for PWA icons — no external image libs available in this environment,
// so we build minimal valid PNGs by hand (zlib deflate of raw RGBA scanlines).
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeData = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typeData), 0)
  return Buffer.concat([len, typeData, crc])
}

// Tiny pixel-art snake on an LCD-green background, drawn from an 8x8 grid pattern.
const GRID = [
  '00000000',
  '01111100',
  '01000100',
  '01110100',
  '00010100',
  '00011100',
  '00000020',
  '00000000',
]

function drawIcon(size, bg, snakeColor, foodColor) {
  const px = new Uint8Array(size * size * 4)
  const gridSize = GRID.length
  const cell = size / gridSize
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const gx = Math.min(gridSize - 1, Math.floor(x / cell))
      const gy = Math.min(gridSize - 1, Math.floor(y / cell))
      const symbol = GRID[gy][gx]
      const color = symbol === '1' ? snakeColor : symbol === '2' ? foodColor : bg
      const i = (y * size + x) * 4
      px[i] = color[0]; px[i + 1] = color[1]; px[i + 2] = color[2]; px[i + 3] = 255
    }
  }
  return px
}

function encodePng(size, pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const stride = size * 4
  const raw = Buffer.alloc((stride + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0 // filter: none
    Buffer.from(pixels.buffer, y * stride, stride).copy(raw, y * (stride + 1) + 1)
  }
  const idat = deflateSync(raw)

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const bg = [157, 181, 137] // Nokia LCD green
const snakeColor = [51, 66, 11] // dark olive
const foodColor = [122, 30, 30] // apple red

for (const size of [192, 512]) {
  const pixels = drawIcon(size, bg, snakeColor, foodColor)
  writeFileSync(new URL(`../public/icon-${size}.png`, import.meta.url), encodePng(size, pixels))
}

const favPixels = drawIcon(64, bg, snakeColor, foodColor)
writeFileSync(new URL('../public/icon-64.png', import.meta.url), encodePng(64, favPixels))

console.log('Icons generated.')
