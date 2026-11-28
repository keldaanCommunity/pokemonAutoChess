import Phaser from "phaser"
import { CELL_HEIGHT } from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { distanceC } from "../../../../../utils/distance"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import type PokemonSprite from "../pokemon-sprite"
import {
  getSpriteVerticalAnchors,
  interpolateColor,
  isBoardCell
} from "./helpers"

// Timeline (ms)
const WISH_DURATION = 380
const LAUNCH = 250
const TRAVEL_DURATION = 600
const ARRIVAL = LAUNCH + TRAVEL_DURATION
const TAIL_CATCH_UP = 200
const BUBBLE_DURATION = 300
const BURST_DURATION = 480
const SHED_LIFETIME = 450
const DUST_LIFETIME = 600
const DURATION = ARRIVAL + DUST_LIFETIME

const PATH_SAMPLES = 64
const TRAIL_LENGTH = 0.45
// Fallbacks when no sprite is found at the cell
const CASTER_HEAD_OFFSET = 36
const TARGET_BODY_OFFSET = 10

// Palette: cyan near the star, pale yellow at the end of the trail,
// gold for the wish itself
const STAR_CORE = 0xffffff
const STAR_RIM = 0x8ff3ff
const TRAIL_HEAD = 0x5ce8ff
const TRAIL_TAIL = 0xf2f59a
const GOLD = 0xffd447
const GOLD_LIGHT = 0xfff3b0
const DUST = 0x9fe9ff
const BUBBLE_FILL = 0xbfefff
const BUBBLE_RIM = 0xe8fbff

type Point = { x: number; y: number }

type Sparkle = {
  x: number
  y: number
  start: number
  size: number
  drift: number
  color: number
}

type Dust = {
  x: number
  y: number
  start: number
  vx: number
  fall: number
  size: number
}

type WishPath = {
  points: Point[]
  end: Point
  shed: Sparkle[]
  dust: Dust[]
  burst: { angle: number; distance: number; size: number; color: number }[]
}

const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)
const { Linear: lerp, FloatBetween: randomFloat } = Phaser.Math

function findSprite(sprites: PokemonSprite[], x: number, y: number) {
  return sprites.find((sprite) => {
    return sprite.positionX === x && sprite.positionY === y
  })
}

function drawTwinkle(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  color: number,
  alpha: number
) {
  if (alpha <= 0 || size <= 0) return
  const point = (px: number, py: number) => new Phaser.Math.Vector2(px, py)
  const waist = size * 0.22
  graphics.fillStyle(color, alpha)
  graphics.fillPoints(
    [
      point(x, y - size),
      point(x + waist, y - waist),
      point(x + size, y),
      point(x + waist, y + waist),
      point(x, y + size),
      point(x - waist, y + waist),
      point(x - size, y),
      point(x - waist, y - waist)
    ],
    true
  )
  graphics.fillStyle(0xffffff, alpha * 0.9)
  graphics.fillCircle(x, y, Math.max(0.8, size * 0.16))
}

function drawStar(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  alpha: number
) {
  if (alpha <= 0) return
  const points: Phaser.Math.Vector2[] = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.45
    const angle = rotation - Math.PI / 2 + (i * Math.PI) / 5
    points.push(
      new Phaser.Math.Vector2(x + Math.cos(angle) * r, y + Math.sin(angle) * r)
    )
  }
  graphics.fillStyle(STAR_RIM, alpha * 0.28)
  graphics.fillCircle(x, y, radius * 2.2)
  graphics.fillStyle(STAR_RIM, alpha * 0.45)
  graphics.fillCircle(x, y, radius * 1.4)
  graphics.lineStyle(2.5, STAR_RIM, alpha)
  graphics.strokePoints(points, true)
  graphics.fillStyle(STAR_CORE, alpha)
  graphics.fillPoints(points, true)
}

// Cubic path sampled at equal arc length so the star moves at a steady pace
function buildPath(start: Point, end: Point, self: boolean, height: number) {
  const dx = end.x - start.x
  const c1 = self
    ? { x: start.x - 80, y: start.y - height }
    : { x: start.x + dx * 0.15, y: Math.min(start.y, end.y) - height }
  const c2 = self
    ? { x: end.x + 80, y: end.y - height }
    : { x: end.x - dx * 0.15, y: Math.min(start.y, end.y) - height }
  const raw: Point[] = []
  const lengths = [0]
  for (let i = 0; i <= PATH_SAMPLES * 4; i++) {
    const t = i / (PATH_SAMPLES * 4)
    const point = {
      x: Phaser.Math.Interpolation.CubicBezier(t, start.x, c1.x, c2.x, end.x),
      y: Phaser.Math.Interpolation.CubicBezier(t, start.y, c1.y, c2.y, end.y)
    }
    if (i > 0) {
      const previous = raw[i - 1]
      lengths.push(
        lengths[i - 1] + Math.hypot(point.x - previous.x, point.y - previous.y)
      )
    }
    raw.push(point)
  }
  const total = lengths[lengths.length - 1] || 1
  const points: Point[] = []
  let index = 0
  for (let i = 0; i <= PATH_SAMPLES; i++) {
    const target = (i / PATH_SAMPLES) * total
    while (index < lengths.length - 2 && lengths[index + 1] < target) index++
    const span = lengths[index + 1] - lengths[index] || 1
    const t = clamp((target - lengths[index]) / span)
    points.push({
      x: lerp(raw[index].x, raw[index + 1].x, t),
      y: lerp(raw[index].y, raw[index + 1].y, t)
    })
  }
  return points
}

function pointOnPath(points: Point[], u: number): Point {
  const position = clamp(u) * (points.length - 1)
  const index = Math.min(points.length - 2, Math.floor(position))
  const t = position - index
  return {
    x: lerp(points[index].x, points[index + 1].x, t),
    y: lerp(points[index].y, points[index + 1].y, t)
  }
}

// Launch gently, then fall faster onto the ally like a shooting star
const travelEase = (t: number) => Phaser.Math.Easing.Sine.InOut(clamp(t))

export const wishAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  delay,
  pokemonsOnBoard
}: AbilityAnimationArgs) => {
  const sprites = pokemonsOnBoard ?? []
  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const casterBox = getSpriteVerticalAnchors(
    findSprite(sprites, positionX, positionY)?.sprite
  )
  const casterHead = casterBox
    ? { x: casterBox.x, y: casterBox.top + 4 }
    : { x: casterX, y: casterY - CASTER_HEAD_OFFSET }

  const wishSparkles: Sparkle[] = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + randomFloat(-0.3, 0.3)
    const radius = randomFloat(16, 28)
    return {
      x: casterHead.x + Math.cos(angle) * radius,
      y: casterHead.y - 4 + Math.sin(angle) * radius * 0.7,
      start: randomFloat(0, 140),
      size: randomFloat(7, 11),
      drift: randomFloat(6, 12),
      color: i % 2 ? GOLD_LIGHT : GOLD
    }
  })

  const paths: WishPath[] = []
  const cell = { x: targetX, y: targetY }
  if (isBoardCell(targetX, targetY)) {
    const [allyX, allyY] = transformEntityCoordinates(cell.x, cell.y, flip)
    const allyBox = getSpriteVerticalAnchors(
      findSprite(sprites, cell.x, cell.y)?.sprite
    )
    const end = allyBox
      ? { x: allyBox.x, y: allyBox.center }
      : { x: allyX, y: allyY - TARGET_BODY_OFFSET }
    const self = cell.x === positionX && cell.y === positionY
    const distance = distanceC(positionX, positionY, cell.x, cell.y)
    const height = self
      ? CELL_HEIGHT * 1.5
      : CELL_HEIGHT * (0.9 + Math.min(distance, 6) * 0.12)
    const points = buildPath(casterHead, end, self, height)

    const shed: Sparkle[] = Array.from({ length: 12 }, (_, i) => {
      const u = (i + randomFloat(0.2, 0.8)) / 12
      const at = pointOnPath(points, u)
      return {
        x: at.x + randomFloat(-8, 8),
        y: at.y + randomFloat(-8, 8),
        start: LAUNCH + TRAVEL_DURATION * u,
        size: randomFloat(4.5, 8),
        drift: randomFloat(8, 16),
        color: [TRAIL_TAIL, TRAIL_HEAD, STAR_CORE][i % 3]
      }
    })

    const dust: Dust[] = Array.from({ length: 16 }, (_, i) => {
      const u = (i + randomFloat(0, 1)) / 16
      const at = pointOnPath(points, u)
      return {
        x: at.x + randomFloat(-6, 6),
        y: at.y + randomFloat(-4, 4),
        start: LAUNCH + TRAVEL_DURATION * u + randomFloat(40, 140),
        vx: randomFloat(-10, 10),
        fall: randomFloat(14, 26),
        size: randomFloat(1.2, 2.6)
      }
    })

    const burst = Array.from({ length: 10 }, (_, i) => ({
      angle: (i / 10) * Math.PI * 2 + randomFloat(-0.25, 0.25),
      distance: randomFloat(26, 40),
      size: randomFloat(5, 9),
      color: i % 3 === 0 ? TRAIL_HEAD : STAR_CORE
    }))

    paths.push({ points, end, shed, dust, burst })
  }

  const back = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(back)
  scene.abilitiesVfxGroup?.add(front)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay ?? 0),
    onUpdate: (counter) => {
      if (!back.active || !front.active) return
      const time = counter.getValue() ?? 0
      back.clear()
      front.clear()

      // 1. The wish: golden twinkles and a soft halo above the caster
      const halo = clamp(time / 120) * clamp((WISH_DURATION - time) / 180)
      if (halo > 0) {
        front.fillStyle(GOLD, halo * 0.22)
        front.fillEllipse(casterHead.x, casterHead.y - 6, 46, 26)
        front.fillStyle(GOLD_LIGHT, halo * 0.5)
        front.fillEllipse(casterHead.x, casterHead.y - 6, 20, 12)
      }
      for (const sparkle of wishSparkles) {
        const age = time - sparkle.start
        if (age <= 0 || age >= 260) continue
        const life = age / 260
        const twinkle = Math.sin(Math.PI * life)
        drawTwinkle(
          front,
          sparkle.x,
          sparkle.y - sparkle.drift * life,
          sparkle.size * (0.5 + 0.5 * twinkle),
          sparkle.color,
          twinkle * 0.95
        )
      }

      for (const path of paths) {
        const travel = (time - LAUNCH) / TRAVEL_DURATION
        const head = travelEase(travel)
        const catchUp = clamp((time - ARRIVAL) / TAIL_CATCH_UP)
        const tail = Math.max(
          0,
          head - TRAIL_LENGTH * (1 - Phaser.Math.Easing.Quadratic.Out(catchUp))
        )

        // 2. Shooting star and its tapered cyan to pale yellow trail
        if (travel > 0 && head - tail > 0.004) {
          const steps = 18
          for (let step = 0; step < steps; step++) {
            const t0 = step / steps
            const t1 = (step + 1) / steps
            const from = pointOnPath(path.points, lerp(tail, head, t0))
            const to = pointOnPath(path.points, lerp(tail, head, t1))
            const strength = (t0 + t1) / 2
            const color = interpolateColor(TRAIL_TAIL, TRAIL_HEAD, strength)
            const width = 1.5 + strength * 10
            front.lineStyle(width * 2.4, color, 0.12 + 0.12 * strength)
            front.lineBetween(from.x, from.y, to.x, to.y)
            front.lineStyle(width, color, 0.45 + 0.5 * strength)
            front.lineBetween(from.x, from.y, to.x, to.y)
            if (strength > 0.5) {
              front.lineStyle(width * 0.35, STAR_CORE, strength * 0.9)
              front.lineBetween(from.x, from.y, to.x, to.y)
            }
          }
        }
        if (travel > 0 && travel < 1) {
          const at = pointOnPath(path.points, head)
          drawStar(front, at.x, at.y, 9, time * 0.012, clamp(travel / 0.08))
        }

        for (const sparkle of path.shed) {
          const age = time - sparkle.start
          if (age <= 0 || age >= SHED_LIFETIME) continue
          const life = age / SHED_LIFETIME
          const twinkle = Math.sin(Math.PI * life)
          drawTwinkle(
            front,
            sparkle.x,
            sparkle.y + sparkle.drift * life,
            sparkle.size * (0.4 + 0.6 * twinkle),
            sparkle.color,
            twinkle * 0.9
          )
        }

        for (const dust of path.dust) {
          const age = time - dust.start
          if (age <= 0 || age >= DUST_LIFETIME) continue
          const life = age / DUST_LIFETIME
          front.fillStyle(DUST, 0.75 * clamp(age / 60) * (1 - life))
          front.fillCircle(
            dust.x + dust.vx * life,
            dust.y + dust.fall * life * life,
            dust.size
          )
        }

        // 3. The wish comes true: brief contact flash, bubble and burst
        const arrival = time - ARRIVAL
        if (arrival < 0) continue
        const { x, y } = path.end

        const flash = clamp(1 - arrival / 130)
        if (flash > 0) {
          front.fillStyle(STAR_CORE, flash * 0.85)
          front.fillCircle(x, y, 6 + 8 * (1 - flash))
          front.fillStyle(STAR_RIM, flash * 0.35)
          front.fillCircle(x, y, 14 + 10 * (1 - flash))
        }

        const bubbleLife = arrival / BUBBLE_DURATION
        if (bubbleLife < 1) {
          const grow = Phaser.Math.Easing.Back.Out(clamp(bubbleLife / 0.55))
          const fade = clamp(bubbleLife / 0.12) * clamp((1 - bubbleLife) / 0.4)
          const radiusX = 14 + 18 * grow
          const radiusY = radiusX * 0.95
          back.fillStyle(BUBBLE_FILL, fade * 0.22)
          back.fillEllipse(x, y, radiusX * 2, radiusY * 2)
          front.fillStyle(BUBBLE_FILL, fade * 0.1)
          front.fillEllipse(x, y, radiusX * 2, radiusY * 2)
          front.lineStyle(2, BUBBLE_RIM, fade * 0.7)
          front.strokeEllipse(x, y, radiusX * 2, radiusY * 2)
          front.lineStyle(3, STAR_CORE, fade * 0.55)
          front.beginPath()
          front.arc(
            x,
            y,
            radiusX * 0.72,
            Phaser.Math.DegToRad(200),
            Phaser.Math.DegToRad(250)
          )
          front.strokePath()
        }

        const burstLife = arrival / BURST_DURATION
        if (burstLife < 1) {
          const spread = Phaser.Math.Easing.Cubic.Out(burstLife)
          const fade = clamp((1 - burstLife) / 0.5)
          for (const sparkle of path.burst) {
            const twinkle = 0.6 + 0.4 * Math.sin(arrival * 0.03 + sparkle.angle)
            drawTwinkle(
              front,
              x + Math.cos(sparkle.angle) * sparkle.distance * spread,
              y + Math.sin(sparkle.angle) * sparkle.distance * spread * 0.8,
              sparkle.size * twinkle,
              sparkle.color,
              fade
            )
          }
        }
      }
    },
    onComplete: () => {
      back.destroy()
      front.destroy()
    }
  })

  back.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  front.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
