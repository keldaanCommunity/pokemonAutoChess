import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const CHARGE_DURATION = 180
const IMPACT_DURATION = 420
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

type ImpactPuff = {
  x: number
  y: number
  driftX: number
  driftY: number
  width: number
  height: number
  delay: number
  color: number
  outline: { x: number; y: number }[]
  texture: { x: number; y: number; size: number; color: number }[]
}

type ImpactRock = {
  dx: number
  dy: number
  size: number
  rotation: number
  spin: number
  delay: number
  color: number
}

function isBoardCell(x: number, y: number) {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    x < BOARD_WIDTH &&
    y >= 0 &&
    y < BOARD_HEIGHT
  )
}

function drawCharge(
  behind: GameObjects.Graphics,
  front: GameObjects.Graphics,
  x: number,
  y: number,
  directionX: number,
  directionY: number,
  elapsed: number
) {
  const fadeIn = clamp(elapsed / 55)
  const fadeOut = clamp((CHARGE_DURATION + 120 - elapsed) / 120)
  const alpha = fadeIn * fadeOut
  const pulse = 1 + Math.sin(elapsed * 0.035) * 0.06
  const centerY = y - 20

  behind.clear()
  front.clear()
  if (alpha <= 0) return

  behind.fillStyle(0xff8a12, alpha * 0.28)
  behind.fillEllipse(x, centerY, 94 * pulse, 100 * pulse)
  behind.fillStyle(0xffd329, alpha * 0.24)
  behind.fillEllipse(x, centerY, 72 * pulse, 82 * pulse)
  behind.lineStyle(4, 0xffaa18, alpha * 0.85)
  behind.strokeEllipse(x, centerY, 76 * pulse, 86 * pulse)

  front.fillStyle(0xffd943, alpha * 0.16)
  front.fillEllipse(x, centerY, 55 * pulse, 66 * pulse)
  front.lineStyle(3, 0xffff9a, alpha * 0.96)
  front.strokeEllipse(x, centerY, 55 * pulse, 66 * pulse)
  const chargeX = x + directionX * 21
  const chargeY = centerY + directionY * 21
  const chargeSize = 0.65 + 0.35 * clamp(elapsed / CHARGE_DURATION)
  front.fillStyle(0xff8e15, alpha * 0.46)
  front.fillCircle(chargeX, chargeY, 23 * chargeSize)
  front.fillStyle(0xffdf35, alpha * 0.85)
  front.fillCircle(chargeX, chargeY, 16 * chargeSize)
  front.fillStyle(0xffffde, alpha * 0.94)
  front.fillCircle(chargeX, chargeY, 9 * chargeSize)

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + elapsed * 0.003
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)
    const inner = (27 + (i % 2) * 5) * pulse
    const outer = (43 + (i % 3) * 7) * pulse
    const width = i % 3 === 0 ? 4 : 2.5
    front.fillStyle(i % 4 === 0 ? 0xed5410 : 0xffdc37, alpha * 0.9)
    front.fillTriangle(
      x + dx * inner - dy * width,
      centerY + dy * inner + dx * width,
      x + dx * outer,
      centerY + dy * outer,
      x + dx * inner + dy * width,
      centerY + dy * inner - dx * width
    )
    const sparkDistance = outer + 6 - clamp(elapsed / CHARGE_DURATION) * 12
    front.fillStyle(0xffffb0, alpha * 0.96)
    front.fillCircle(
      x + dx * sparkDistance,
      centerY + dy * sparkDistance,
      i % 2 === 0 ? 3 : 2
    )
  }
}

function drawProjectile(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  directionX: number,
  directionY: number,
  traveled: number
) {
  const normalX = -directionY
  const normalY = directionX
  const trail = Math.min(68, traveled)
  const tailX = x - directionX * trail
  const tailY = y - directionY * trail

  for (const layer of [
    { width: 25, color: 0xff8a12, alpha: 0.42 },
    { width: 18, color: 0xffd020, alpha: 0.78 },
    { width: 9, color: 0xffff8b, alpha: 0.92 }
  ]) {
    graphics.fillStyle(layer.color, layer.alpha)
    graphics.fillTriangle(
      x + normalX * layer.width,
      y + normalY * layer.width,
      tailX,
      tailY,
      x - normalX * layer.width,
      y - normalY * layer.width
    )
  }

  graphics.fillStyle(0xff8f15, 0.53)
  graphics.fillCircle(x, y, 30)
  for (let ray = 0; ray < 10; ray++) {
    const angle = (ray * Math.PI * 2) / 10 + 0.15
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)
    const length = ray % 2 === 0 ? 37 : 27
    graphics.fillStyle(ray % 2 === 0 ? 0xffc126 : 0xffe64f, 0.94)
    graphics.fillTriangle(
      x + dx * 14 - dy * 5,
      y + dy * 14 + dx * 5,
      x + dx * length,
      y + dy * length,
      x + dx * 14 + dy * 5,
      y + dy * 14 - dx * 5
    )
  }
  graphics.fillStyle(0xffd62b, 0.98)
  graphics.fillCircle(x, y, 22)
  graphics.fillStyle(0xffff9a, 0.98)
  graphics.fillCircle(x, y, 16)
  graphics.fillStyle(0xffffff, 0.98)
  graphics.fillCircle(x, y, 10)
}

function drawImpact(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number,
  puffs: ImpactPuff[],
  rocks: ImpactRock[]
) {
  const progress = clamp(elapsed / IMPACT_DURATION)
  const flash = clamp((115 - elapsed) / 70)

  for (const puff of puffs) {
    const age = elapsed - puff.delay
    if (age < 0) continue
    const growth = 0.45 + 0.55 * clamp(age / 110)
    const alpha = clamp(age / 28) * clamp((IMPACT_DURATION - elapsed) / 180)
    const px = x + puff.x + puff.driftX * progress
    const py = y + puff.y + puff.driftY * progress
    const width = puff.width * growth
    const height = puff.height * growth
    graphics.fillStyle(puff.color, alpha * 0.75)
    graphics.beginPath()
    puff.outline.forEach((point, index) => {
      const pointX = px + point.x * width
      const pointY = py + point.y * height
      if (index === 0) graphics.moveTo(pointX, pointY)
      else graphics.lineTo(pointX, pointY)
    })
    graphics.closePath()
    graphics.fillPath()
    for (const mark of puff.texture) {
      const markX = px + mark.x * width
      const markY = py + mark.y * height
      graphics.fillStyle(mark.color, alpha * 0.46)
      graphics.fillEllipse(markX, markY, width * mark.size, height * mark.size)
      graphics.fillEllipse(
        markX + width * mark.size * 0.27,
        markY - height * mark.size * 0.22,
        width * mark.size * 0.6,
        height * mark.size * 0.7
      )
    }
  }

  for (const rock of rocks) {
    const age = elapsed - rock.delay
    if (age < 0) continue
    const time = clamp(age / (IMPACT_DURATION - rock.delay))
    const travel = 1 - (1 - time) ** 2
    const alpha = clamp(age / 25) * clamp((IMPACT_DURATION - elapsed) / 100)
    const px = x + rock.dx * travel
    const py = y + rock.dy * travel + 20 * travel * travel
    const angle = rock.rotation + rock.spin * travel
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const point = (localX: number, localY: number) => ({
      x: px + (localX * cos - localY * sin) * rock.size,
      y: py + (localX * sin + localY * cos) * rock.size
    })
    const a = point(-1, -0.15)
    const b = point(-0.45, -1)
    const c = point(0.7, -0.8)
    const d = point(1, 0.3)
    const e = point(-0.2, 0.9)
    const center = point(0.1, -0.05)

    graphics.fillStyle(rock.color, alpha * 0.98)
    graphics.beginPath()
    graphics.moveTo(a.x, a.y)
    graphics.lineTo(b.x, b.y)
    graphics.lineTo(c.x, c.y)
    graphics.lineTo(d.x, d.y)
    graphics.lineTo(e.x, e.y)
    graphics.closePath()
    graphics.fillPath()
    graphics.fillStyle(0xc89560, alpha * 0.85)
    graphics.fillTriangle(b.x, b.y, c.x, c.y, center.x, center.y)
    graphics.fillStyle(0x39271f, alpha * 0.7)
    graphics.fillTriangle(center.x, center.y, d.x, d.y, e.x, e.y)
  }

  graphics.fillStyle(0xffa51b, flash * 0.65)
  graphics.fillCircle(x, y, 30)
  graphics.fillStyle(0xffffb1, flash * 0.9)
  graphics.fillCircle(x, y, 19)
  graphics.fillStyle(0xffffff, flash)
  graphics.fillCircle(x, y, 10)
}

export const headSmashAnimation: AbilityAnimation = (args) => {
  const { scene, positionX, positionY, targetX, targetY, flip } = args
  if (!isBoardCell(positionX, positionY)) return

  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const hasTarget =
    isBoardCell(targetX, targetY) &&
    (targetX !== positionX || targetY !== positionY)
  const [targetScreenX, targetScreenY] = hasTarget
    ? transformEntityCoordinates(targetX, targetY, flip)
    : [casterX, casterY]
  const casterCenterY = casterY - 20
  const targetCenterY = targetScreenY - 20
  const aimX = targetScreenX - casterX
  const aimY = targetCenterY - casterCenterY
  const aimLength = Math.hypot(aimX, aimY)
  const aimDirectionX = aimLength > 0 ? aimX / aimLength : 1
  const aimDirectionY = aimLength > 0 ? aimY / aimLength : 0
  const startX = casterX + (hasTarget ? aimDirectionX * 16 : 0)
  const startY = casterCenterY + (hasTarget ? aimDirectionY * 16 : 0)
  const endX = targetScreenX
  const endY = targetScreenY
  const dx = endX - startX
  const dy = endY - startY
  const distance = Math.hypot(dx, dy)
  const directionX = distance > 0 ? dx / distance : 1
  const directionY = distance > 0 ? dy / distance : 0
  const travelDuration = Phaser.Math.Clamp((aimLength - 30) * 2.7, 240, 350)
  const impactStart = CHARGE_DURATION + travelDuration
  const totalDuration = hasTarget
    ? impactStart + IMPACT_DURATION
    : CHARGE_DURATION + 120

  const puffs: ImpactPuff[] = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.55
    const distance = 12 + Math.random() * 25
    const variation = (index: number) => {
      const value =
        Math.sin(index * 12.9898 + angle * 78.233 + distance) * 43758
      return value - Math.floor(value)
    }
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance * 0.7,
      driftX: Math.cos(angle) * (18 + Math.random() * 22),
      driftY: Math.sin(angle) * (10 + Math.random() * 18) - Math.random() * 12,
      width: 30 + Math.random() * 25,
      height: 24 + Math.random() * 20,
      delay: Math.random() * 55,
      color: [0xa83c15, 0xd1490c, 0xe76a13, 0xb42b12][i % 4],
      outline: Array.from({ length: 16 }, (_, vertex) => {
        const theta = (vertex / 16) * Math.PI * 2
        const radius = 0.38 + variation(vertex) * 0.12
        return { x: Math.cos(theta) * radius, y: Math.sin(theta) * radius }
      }),
      texture: Array.from({ length: 3 }, (_, mark) => ({
        x: (variation(20 + mark * 3) - 0.5) * 0.48,
        y: (variation(21 + mark * 3) - 0.5) * 0.48,
        size: 0.12 + variation(22 + mark * 3) * 0.14,
        color: mark === 0 ? 0xffb03a : mark === 1 ? 0x8c2110 : 0xf58a28
      }))
    }
  })
  const rocks: ImpactRock[] = Array.from({ length: 11 }, (_, i) => {
    const angle = (i / 11) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
    const distance = 55 + Math.random() * 45
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance * 0.65 - 18,
      size: 4 + Math.random() * 5,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 4,
      delay: Math.random() * 45,
      color: i % 2 === 0 ? 0x684431 : 0x866044
    }
  })

  const chargeBehind = scene.add
    .graphics()
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const chargeFront = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const projectileAndImpact = scene.add
    .graphics()
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(chargeBehind)
  scene.abilitiesVfxGroup?.add(chargeFront)
  scene.abilitiesVfxGroup?.add(projectileAndImpact)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: totalDuration,
    duration: totalDuration,
    delay: Math.max(0, args.delay ?? 0),
    onUpdate: (counter) => {
      if (
        !chargeBehind.active ||
        !chargeFront.active ||
        !projectileAndImpact.active
      ) {
        return
      }

      const elapsed = counter.getValue() ?? 0
      drawCharge(
        chargeBehind,
        chargeFront,
        casterX,
        casterY,
        aimDirectionX,
        aimDirectionY,
        elapsed
      )
      projectileAndImpact.clear()

      if (hasTarget && elapsed >= CHARGE_DURATION && elapsed < impactStart) {
        const progress = (elapsed - CHARGE_DURATION) / travelDuration
        const easedProgress = Phaser.Math.Easing.Cubic.Out(progress)
        const x = startX + dx * easedProgress
        const y = startY + dy * easedProgress
        drawProjectile(
          projectileAndImpact,
          x,
          y,
          directionX,
          directionY,
          distance * easedProgress
        )
      } else if (hasTarget && elapsed >= impactStart) {
        drawImpact(
          projectileAndImpact,
          endX,
          endY,
          elapsed - impactStart,
          puffs,
          rocks
        )
      }
    },
    onComplete: () => {
      chargeBehind.destroy()
      chargeFront.destroy()
      projectileAndImpact.destroy()
    }
  })

  chargeBehind.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  chargeFront.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  projectileAndImpact.once(Phaser.GameObjects.Events.DESTROY, () =>
    tween.stop()
  )
}
