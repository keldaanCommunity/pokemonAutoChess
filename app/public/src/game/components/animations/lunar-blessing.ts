import Phaser from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { distanceE } from "../../../../../utils/distance"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

type Layer = Phaser.GameObjects.Graphics

const CASTER_DURATION = 1700
const ALLY_DURATION = 1400
const CASTER_SCALE = 1.3
const ALLY_SCALE = 1.7
const ALLY_START = 450
const GROUND_Y = 8

const clamp = (value: number) => Math.max(0, Math.min(1, value))

function drawCrescent(
  g: Layer,
  cx: number,
  cy: number,
  radius: number,
  rotation: number,
  color: number,
  alpha: number
) {
  const innerOffset = radius * 0.4
  const innerRadius = radius * 0.95
  const cosEnd =
    (radius * radius + innerOffset * innerOffset - innerRadius * innerRadius) /
    (2 * radius * innerOffset)
  const outerEnd = Math.acos(cosEnd)
  const innerEnd = Math.atan2(
    radius * Math.sin(outerEnd),
    radius * cosEnd - innerOffset
  )
  const steps = 14
  const points: Phaser.Math.Vector2[] = []
  const place = (x: number, y: number) => {
    const cos = Math.cos(rotation)
    const sin = Math.sin(rotation)
    points.push(
      new Phaser.Math.Vector2(cx + x * cos - y * sin, cy + x * sin + y * cos)
    )
  }
  for (let i = 0; i <= steps; i++) {
    const a = outerEnd + (i / steps) * (Math.PI * 2 - 2 * outerEnd)
    place(Math.cos(a) * radius, Math.sin(a) * radius)
  }
  for (let i = 0; i <= steps; i++) {
    const a =
      Math.PI * 2 - innerEnd - (i / steps) * (Math.PI * 2 - 2 * innerEnd)
    place(innerOffset + Math.cos(a) * innerRadius, Math.sin(a) * innerRadius)
  }
  g.fillStyle(color, alpha * 0.12)
  g.fillCircle(cx, cy, radius * 1.25)
  g.fillStyle(color, alpha)
  g.fillPoints(points, true)
}

function drawSparkle(
  g: Layer,
  x: number,
  y: number,
  size: number,
  color: number,
  alpha: number
) {
  g.fillStyle(color, alpha)
  const v = (px: number, py: number) => new Phaser.Math.Vector2(px, py)
  g.fillPoints(
    [
      v(x, y - size),
      v(x + size * 0.3, y - size * 0.3),
      v(x + size, y),
      v(x + size * 0.3, y + size * 0.3),
      v(x, y + size),
      v(x - size * 0.3, y + size * 0.3),
      v(x - size, y),
      v(x - size * 0.3, y - size * 0.3)
    ],
    true
  )
}

function drawOrbit(
  back: Layer,
  front: Layer,
  time: number,
  alpha: number,
  orbit: {
    rx: number
    ry: number
    tilt: number
    speed: number
    phase: number
    color: number
    length: number
    width: number
  }
) {
  const segments = 16
  const head = orbit.phase + time * orbit.speed
  const cosTilt = Math.cos(orbit.tilt)
  const sinTilt = Math.sin(orbit.tilt)
  const point = (a: number) => {
    const px = Math.cos(a) * orbit.rx
    const py = Math.sin(a) * orbit.ry
    return {
      x: px * cosTilt - py * sinTilt,
      y: -16 + px * sinTilt + py * cosTilt
    }
  }
  for (let i = 0; i < segments; i++) {
    const a = head - (i / segments) * orbit.length
    const b = head - ((i + 1) / segments) * orbit.length
    const taper = 1 - i / segments
    const layer = Math.sin((a + b) / 2) >= 0 ? front : back
    const from = point(a)
    const to = point(b)
    layer.lineStyle(
      0.8 + taper * orbit.width,
      orbit.color,
      alpha * (layer === front ? 0.5 : 0.85) * taper
    )
    layer.beginPath()
    layer.moveTo(from.x, from.y)
    layer.lineTo(to.x, to.y)
    layer.strokePath()
  }
}

const ORBITS = [
  {
    rx: 48,
    ry: 13,
    tilt: -0.45,
    speed: 0.0058,
    phase: 0,
    color: 0xffffff,
    length: 2.2,
    width: 3.5
  },
  {
    rx: 44,
    ry: 12,
    tilt: 0.5,
    speed: -0.0064,
    phase: 2.5,
    color: 0x8ff0ff,
    length: 2,
    width: 2.5
  },
  {
    rx: 15,
    ry: 46,
    tilt: 0.12,
    speed: 0.0072,
    phase: 1,
    color: 0xff9be3,
    length: 1.8,
    width: 2
  },
  {
    rx: 13,
    ry: 40,
    tilt: -0.2,
    speed: -0.0068,
    phase: 4,
    color: 0x9ff4ff,
    length: 1.6,
    width: 2
  }
]

export const lunarBlessingAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay,
  data
}) => {
  const baseDelay = Math.max(0, delay ?? 0)
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)

  const back = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setScale(CASTER_SCALE)
  const front = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.PROJECTILE)
    .setScale(CASTER_SCALE)
  scene.abilitiesVfxGroup?.add(back)
  scene.abilitiesVfxGroup?.add(front)

  scene.tweens.addCounter({
    from: 0,
    to: 1,
    duration: CASTER_DURATION,
    delay: baseDelay,
    onUpdate: (tween) => {
      if (!back.active || !front.active) return
      const t = tween.progress * CASTER_DURATION
      back.clear()
      front.clear()

      const mistAlpha = clamp(t / 320) * clamp((1450 - t) / 500)
      if (mistAlpha > 0) {
        const swell = 0.7 + clamp(t / 400) * 0.3
        const blobs = [
          [0, -34, 30, 0x2a1f7a, 0.55],
          [-16, -26, 22, 0x4b2fb3, 0.5],
          [17, -30, 24, 0x3b2a9a, 0.5],
          [4, -46, 20, 0x6a45cc, 0.4],
          [-6, -14, 24, 0x5a3cc0, 0.35]
        ]
        blobs.forEach(([bx, by, br, color, a], i) => {
          const wobble = Math.sin(t * 0.004 + i * 1.7)
          back.fillStyle(color, mistAlpha * a)
          back.fillEllipse(
            bx + wobble * 3,
            by + Math.cos(t * 0.003 + i) * 3,
            br * 2 * swell,
            br * 1.8 * swell
          )
        })
        for (const [ex, ey] of [
          [-9, -36],
          [8, -34]
        ]) {
          back.fillStyle(0xffd6f4, mistAlpha * 0.85)
          back.fillCircle(ex, ey, 1.4)
        }
      }

      const baseAlpha = clamp(t / 200) * clamp((1500 - t) / 300)
      back.fillStyle(0x4fd8ff, baseAlpha * 0.18)
      back.fillEllipse(0, GROUND_Y, 92, 32)
      for (let i = 0; i < 3; i++) {
        const p = clamp((t - 150 - i * 170) / 800)
        if (p <= 0 || p >= 1) continue
        const a = Math.sin(Math.PI * p)
        const rx = 20 + p * 42 + i * 4
        const ry = rx * 0.32
        back.lineStyle(i === 1 ? 2.5 : 4, 0x59e6ff, a * 0.55)
        back.strokeEllipse(0, GROUND_Y, rx * 2, ry * 2)
        back.lineStyle(1.5, 0xffffff, a * 0.9)
        back.strokeEllipse(0, GROUND_Y, rx * 2 - 3, ry * 2 - 1.5)
        const spin = t * (i % 2 ? -0.006 : 0.006) + i * 2
        for (let k = 0; k < 8; k++) {
          const ang = spin + (k / 8) * 0.9
          back.fillStyle(0xffffff, a * 0.8 * (1 - k / 8))
          back.fillCircle(
            Math.cos(ang) * rx,
            GROUND_Y + Math.sin(ang) * ry,
            2.2 - k * 0.2
          )
        }
      }

      const orbitAlpha = clamp((t - 250) / 200) * clamp((1400 - t) / 350)
      if (orbitAlpha > 0) {
        const time = t - 250
        for (const orbit of ORBITS) {
          drawOrbit(back, front, time, orbitAlpha, orbit)
        }
        for (let i = 0; i < 2; i++) {
          const a = time * 0.005 * (i ? -1 : 1) + i * Math.PI
          const layer = Math.sin(a) >= 0 ? front : back
          drawCrescent(
            layer,
            Math.cos(a) * 44,
            -16 + Math.sin(a) * 12,
            5,
            a + Math.PI / 2,
            0xf4eeff,
            orbitAlpha * (layer === front ? 0.55 : 0.9)
          )
        }
      }

      const moonAlpha = clamp(t / 250) * clamp((1300 - t) / 350)
      if (moonAlpha > 0) {
        drawCrescent(
          back,
          -52,
          -52 - t * 0.008,
          8,
          -0.6,
          0xf4eeff,
          moonAlpha * 0.9
        )
        drawCrescent(
          back,
          54,
          -34 - t * 0.006,
          5,
          0.9,
          0xf4eeff,
          moonAlpha * 0.9
        )
      }

      const glow = clamp((t - 450) / 150) * clamp((1050 - t) / 400)
      if (glow > 0) {
        front.fillStyle(0xf6d8ff, glow * 0.18)
        front.fillCircle(0, -18, 24 + glow * 8)
        front.fillStyle(0xffffff, glow * 0.12)
        front.fillCircle(0, -18, 14)
      }

      const sparkAlpha = clamp((t - 500) / 150) * clamp((1600 - t) / 400)
      if (sparkAlpha > 0) {
        for (let i = 0; i < 8; i++) {
          const ang = i * 2.4
          const rise = ((t - 500) * 0.03 + i * 9) % 50
          drawSparkle(
            front,
            Math.cos(ang) * (16 + (i % 3) * 10),
            GROUND_Y - rise,
            2 + (i % 2),
            i % 2 ? 0x9ff4ff : 0xffffff,
            sparkAlpha * 0.8 * (1 - rise / 50)
          )
        }
      }
    },
    onComplete: () => {
      if (back.active) back.destroy()
      if (front.active) front.destroy()
    }
  })

  const allies: unknown = data?.allies
  if (!Array.isArray(allies)) return
  for (const ally of allies.slice(0, 48)) {
    if (
      !Number.isInteger(ally?.x) ||
      !Number.isInteger(ally?.y) ||
      ally.x < 0 ||
      ally.y < 0
    ) {
      continue
    }
    const [ax, ay] = transformEntityCoordinates(ally.x, ally.y, flip)
    const allyBack = scene.add
      .graphics({ x: ax, y: ay })
      .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      .setScale(ALLY_SCALE)
    const allyFront = scene.add
      .graphics({ x: ax, y: ay })
      .setDepth(DEPTH.PROJECTILE)
      .setScale(ALLY_SCALE)
    scene.abilitiesVfxGroup?.add(allyBack)
    scene.abilitiesVfxGroup?.add(allyFront)
    const wave = Math.min(
      150,
      distanceE(positionX, positionY, ally.x, ally.y) * 25
    )

    scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: ALLY_DURATION,
      delay: baseDelay + ALLY_START + wave,
      onUpdate: (tween) => {
        if (!allyBack.active || !allyFront.active) return
        const t = tween.progress * ALLY_DURATION
        allyBack.clear()
        allyFront.clear()

        const ring = clamp(t / 800)
        const fade = clamp((ALLY_DURATION - t) / 400)
        const column = clamp(t / 200) * clamp((900 - t) / 500)
        if (column > 0) {
          allyBack.fillStyle(0x59e6ff, column * 0.3)
          allyBack.fillEllipse(0, GROUND_Y - 22, 30, 58)
          allyBack.fillStyle(0xffffff, column * 0.25)
          allyBack.fillEllipse(0, GROUND_Y - 22, 16, 56)
          allyFront.fillStyle(0xbff6ff, column * 0.22)
          allyFront.fillEllipse(0, -12, 26, 40)
        }
        for (let k = 0; k < 2; k++) {
          const p = clamp((t - k * 220) / 700)
          if (p <= 0 || p >= 1) continue
          const rx = 10 + p * 24
          allyBack.fillStyle(0x4fd8ff, (1 - p) * 0.4)
          allyBack.fillEllipse(0, GROUND_Y, rx * 2, rx * 0.64)
          allyBack.lineStyle(4, 0x59e6ff, (1 - p) * 1)
          allyBack.strokeEllipse(0, GROUND_Y, rx * 2, rx * 0.64)
          allyBack.lineStyle(2, 0xffffff, 1 - p)
          allyBack.strokeEllipse(0, GROUND_Y, rx * 1.6, rx * 0.5)
        }
        if (ring >= 1 && fade > 0) {
          allyBack.fillStyle(0x4fd8ff, fade * 0.15)
          allyBack.fillEllipse(0, GROUND_Y, 50, 16)
        }

        const rise = clamp(t / 1100)
        const moonAlpha = Math.sin(Math.PI * rise)
        drawCrescent(
          allyFront,
          0,
          -36 - rise * 18,
          10,
          -0.5,
          0xffffff,
          Math.min(1, moonAlpha * 1.4)
        )

        for (let i = 0; i < 9; i++) {
          const p = clamp((t - i * 80) / 800)
          if (p <= 0 || p >= 1) continue
          drawSparkle(
            allyFront,
            (i - 4) * 6 + Math.sin(p * 5 + i) * 4,
            GROUND_Y - 4 - p * 46,
            3 + (i % 3),
            i % 2 ? 0x9ff4ff : 0xffffff,
            Math.min(1, Math.sin(Math.PI * p) * 1.3)
          )
        }
      },
      onComplete: () => {
        if (allyBack.active) allyBack.destroy()
        if (allyFront.active) allyFront.destroy()
      }
    })
  }
}
