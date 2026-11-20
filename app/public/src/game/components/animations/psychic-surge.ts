import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { distanceE } from "../../../../../utils/distance"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const CASTER_DURATION = 900
const ALLY_DURATION = 780
const MAX_ALLIES = 48
const ORB_COLORS = [0x55e9f4, 0xffe34d, 0xf45be6]

const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function isBoardCell(cell: unknown): cell is { x: number; y: number } {
  if (!cell || typeof cell !== "object" || !("x" in cell && "y" in cell)) {
    return false
  }
  const { x, y } = cell
  return (
    typeof x === "number" &&
    Number.isInteger(x) &&
    typeof y === "number" &&
    Number.isInteger(y) &&
    x >= 0 &&
    x < BOARD_WIDTH &&
    y >= 0 &&
    y < BOARD_HEIGHT
  )
}

function getAllies(
  data: AbilityAnimationArgs["data"],
  casterX: number,
  casterY: number
) {
  const cells: unknown = data.allies
  if (!Array.isArray(cells)) return []

  const seen = new Set<number>()
  const allies: { x: number; y: number }[] = []
  for (const cell of cells.slice(0, BOARD_WIDTH * BOARD_HEIGHT)) {
    if (!isBoardCell(cell) || (cell.x === casterX && cell.y === casterY)) {
      continue
    }
    const key = cell.y * BOARD_WIDTH + cell.x
    if (seen.has(key)) continue
    seen.add(key)
    allies.push({ x: cell.x, y: cell.y })
    if (allies.length >= MAX_ALLIES) break
  }
  return allies
}

function drawOrb(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  radius: number,
  color: number,
  alpha: number,
  time: number,
  phase: number
) {
  graphics.fillStyle(color, alpha * 0.11)
  graphics.fillCircle(x, y, radius * 2.2)
  graphics.fillStyle(color, alpha * 0.38)
  graphics.fillCircle(x, y, radius * 1.3)
  graphics.fillStyle(color, alpha * 0.76)
  graphics.fillCircle(x, y, radius * 0.82)

  const outline: Phaser.Math.Vector2[] = []
  for (let point = 0; point <= 20; point++) {
    const angle = (point / 20) * Math.PI * 2
    const ripple =
      Math.sin(angle * 3 + time * 0.018 + phase) * radius * 0.13 +
      Math.sin(angle * 5 - time * 0.012 + phase) * radius * 0.06
    const distance = radius * 1.18 + ripple
    outline.push(
      new Phaser.Math.Vector2(
        x + Math.cos(angle) * distance,
        y + Math.sin(angle) * distance
      )
    )
  }
  graphics.lineStyle(1.5, color, alpha * 0.95)
  graphics.strokePoints(outline, false)

  graphics.fillStyle(0xffffff, alpha * 0.8)
  graphics.fillCircle(x - radius * 0.28, y - radius * 0.32, radius * 0.18)
}

function drawSparkle(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  alpha: number
) {
  graphics.lineStyle(1.2, 0xe9e0ff, alpha)
  graphics.lineBetween(x - size, y, x + size, y)
  graphics.lineBetween(x, y - size, x, y + size)
  graphics.fillStyle(0xffffff, alpha * 0.8)
  graphics.fillCircle(x, y, size * 0.3)
}

function addPsychicParticles(
  scene: AbilityAnimationArgs["scene"],
  x: number,
  y: number,
  delay: number,
  duration: number,
  isCaster: boolean,
  phase: number
) {
  const back = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setScale(isCaster ? 1.25 : 1.1)
  const front = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.PROJECTILE)
    .setScale(isCaster ? 1.25 : 1.1)
  scene.abilitiesVfxGroup?.add(back)
  scene.abilitiesVfxGroup?.add(front)

  const orbCount = isCaster ? 8 : 5
  const tween = scene.tweens.addCounter({
    from: 0,
    to: 1,
    duration,
    delay,
    onUpdate: (counter) => {
      if (!back.active || !front.active) return
      const time = counter.progress * duration
      const bloom = Phaser.Math.Easing.Sine.Out(clamp(time / 230))
      const fade = clamp((duration - time) / 220)
      const alpha = clamp(time / 100) * fade
      const swell = 0.92 + Math.sin(time * 0.006 + phase) * 0.08
      back.clear()
      front.clear()

      for (let wisp = 0; wisp < 6; wisp++) {
        const angle =
          phase + (wisp / 6) * Math.PI * 2 + time * (wisp % 2 ? 0.0014 : -0.001)
        const distance = 20 + (wisp % 3) * 8
        const puffX = Math.cos(angle) * distance
        const puffY =
          -10 + Math.sin(angle) * 11 + Math.sin(time * 0.008 + wisp) * 4
        const puffWidth = (20 + (wisp % 3) * 5) * swell
        const puffHeight = (11 + (wisp % 2) * 3) * swell
        const mist = wisp % 2 === 0 ? back : front
        mist.fillStyle(0x7967cf, alpha * 0.18)
        mist.fillEllipse(puffX, puffY, puffWidth * 1.6, puffHeight * 1.6)
        mist.fillStyle(0xa58bec, alpha * 0.24)
        mist.fillEllipse(puffX, puffY, puffWidth * 1.1, puffHeight * 1.1)
        mist.fillStyle(0xd4b0ff, alpha * 0.12)
        mist.fillEllipse(puffX, puffY, puffWidth * 0.65, puffHeight * 0.65)
      }

      for (let orb = 0; orb < orbCount; orb++) {
        const angle =
          phase +
          (orb / orbCount) * Math.PI * 2 +
          time * (orb % 2 === 0 ? 0.0025 : -0.002)
        const orbitX = 12 + bloom * (isCaster ? 25 : 18)
        const orbitY = 7 + bloom * (isCaster ? 17 : 13)
        const bob = Math.sin(time * 0.008 + orb * 1.6 + phase) * 3
        const orbX = Math.cos(angle) * orbitX
        const orbY = -24 + Math.sin(angle) * orbitY + bob
        const radius =
          (isCaster ? 6.5 : 5.5) + (orb % 3) * (isCaster ? 1.1 : 0.8)
        drawOrb(
          orb % 2 === 0 ? back : front,
          orbX,
          orbY,
          radius,
          ORB_COLORS[orb % ORB_COLORS.length],
          alpha * (isCaster ? 0.95 : 0.8),
          time,
          phase + orb
        )
      }

      const sparkleCount = isCaster ? 4 : 2
      for (let sparkle = 0; sparkle < sparkleCount; sparkle++) {
        const angle =
          phase + (sparkle / sparkleCount) * Math.PI * 2 - time * 0.003
        const radius = 34 + Math.sin(time * 0.006 + sparkle) * 4
        const sparkleAlpha =
          alpha * (0.55 + 0.3 * Math.sin(time * 0.01 + sparkle))
        drawSparkle(
          front,
          Math.cos(angle) * radius,
          -25 + Math.sin(angle) * radius * 0.58,
          isCaster ? 2.2 : 1.7,
          sparkleAlpha
        )
      }
    },
    onComplete: () => {
      if (back.active) back.destroy()
      if (front.active) front.destroy()
    }
  })

  back.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  front.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}

export const psychicSurgeAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay,
  data
}: AbilityAnimationArgs) => {
  const baseDelay = Math.max(0, delay ?? 0)
  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  addPsychicParticles(
    scene,
    casterX,
    casterY,
    baseDelay,
    CASTER_DURATION,
    true,
    0
  )

  getAllies(data, positionX, positionY).forEach((ally, index) => {
    const [allyX, allyY] = transformEntityCoordinates(ally.x, ally.y, flip)
    const wave = Math.min(
      160,
      distanceE(positionX, positionY, ally.x, ally.y) * 22
    )
    addPsychicParticles(
      scene,
      allyX,
      allyY,
      baseDelay + 110 + wave,
      ALLY_DURATION,
      false,
      index * 0.48
    )
  })
}
