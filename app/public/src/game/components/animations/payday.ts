import Phaser, { type GameObjects } from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { drawGoldCoin, isBoardCell } from "./helpers"

const LEAD_IN = 85
const FLIGHT = 300
const CONTACT = LEAD_IN + FLIGHT
const SCATTER = 450
const TAU = Math.PI * 2
const { Clamp, Linear } = Phaser.Math

function drawGlint(graphics: GameObjects.Graphics, size: number) {
  graphics.fillStyle(0xffca38, 0.25)
  graphics.fillCircle(0, 0, size * 0.55)
  graphics.fillStyle(0xffdf62, 0.9)
  graphics.fillTriangle(0, -size, size * 0.22, 0, 0, size)
  graphics.fillTriangle(0, -size, -size * 0.22, 0, 0, size)
  graphics.fillTriangle(-size * 0.72, 0, 0, -size * 0.22, size * 0.72, 0)
  graphics.fillTriangle(-size * 0.72, 0, 0, size * 0.22, size * 0.72, 0)
  graphics.fillStyle(0xfff9cd)
  graphics.fillCircle(0, 0, size * 0.17)
}

export const paydayAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  delay = 0
}) => {
  if (!isBoardCell(positionX, positionY) || !isBoardCell(targetX, targetY)) {
    return
  }

  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [endX, targetCenterY] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const angle = Math.atan2(targetCenterY - casterY, endX - casterX)
  const startX = casterX + Math.cos(angle) * 18
  const startY = casterY - 10 + Math.sin(angle) * 18
  const endY = targetCenterY - 7
  const arc = Clamp(Math.hypot(endX - startX, endY - startY) * 0.12, 12, 42)
  const tilt = Math.cos(angle) * 0.28

  const effect = scene.add.container(0, 0).setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(effect)
  const layer = () => {
    const graphics = scene.add.graphics().setAlpha(0)
    effect.add(graphics)
    return graphics
  }

  const launch = layer().setPosition(startX, startY)
  drawGlint(launch, 18)
  const projectile = layer()
  projectile.fillStyle(0x9c4807, 0.95).fillEllipse(3, 0, 31, 48)
  projectile.fillStyle(0xffbf22).fillEllipse(0, 0, 31, 48)
  projectile.fillStyle(0xffe362).fillEllipse(-2, -2, 24, 42)
  for (let y = -15; y <= 15; y += 6) {
    const halfWidth = 13 * Math.sqrt(1 - (y / 22) ** 2)
    projectile.lineStyle(2.4, 0xf89a14)
    projectile.lineBetween(-halfWidth, y + 1, halfWidth, y)
    projectile.lineStyle(1.1, 0xfff6a0)
    projectile.lineBetween(-halfWidth, y - 1, halfWidth, y - 2)
  }
  projectile.lineStyle(1.7, 0xfff4a0).strokeEllipse(0, 0, 31, 48)

  const trail = Array.from({ length: 5 }, (_, i) => {
    const glint = layer()
    drawGlint(glint, i % 2 === 0 ? 8 : 5)
    return glint
  })

  const impact = layer().setPosition(endX, endY)
  drawGlint(impact, 34)
  for (let i = 0; i < 7; i++) {
    const a = angle + (i * TAU) / 7
    const length = i % 2 === 0 ? 42 : 27
    const x = Math.cos(a)
    const y = Math.sin(a)
    impact.fillStyle(0xffd24f, 0.85)
    impact.fillTriangle(
      x * 8 + y * 4,
      y * 8 - x * 4,
      x * length,
      y * length,
      x * 8 - y * 4,
      y * 8 + x * 4
    )
  }

  const coins = Array.from({ length: 22 }, (_, i) => {
    const coin = layer()
    drawGoldCoin(coin)
    const a = (i * TAU) / 22 + Math.random() * 0.24
    const reach = 33 + Math.random() * 43
    return {
      coin,
      dx: Math.cos(a) * reach,
      dy: Math.sin(a) * reach * 0.55,
      lift: 24 + Math.random() * 29,
      size: 0.7 + Math.random() * 0.55,
      spin: (i % 2 === 0 ? 1 : -1) * (2 + Math.random() * 3),
      phase: i * 0.85
    }
  })

  const flightX = (t: number) => Linear(startX, endX, t)
  const flightY = (t: number) => Linear(startY, endY, t) - arc * 4 * t * (1 - t)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: CONTACT + SCATTER,
    duration: CONTACT + SCATTER,
    delay,
    onUpdate: (counter) => {
      if (!effect.active) return
      const time = counter.getValue() ?? 0
      const travel = Clamp((time - LEAD_IN) / FLIGHT, 0, 1)
      const charge = Clamp(time / LEAD_IN, 0, 1)
      launch.setAlpha(Math.sin(Math.PI * charge)).setScale(0.5 + charge * 0.6)

      const turn = Math.abs(Math.cos(travel * TAU * 1.65))
      const size = Linear(0.46, 1, charge)
      projectile
        .setPosition(flightX(travel), flightY(travel))
        .setScale(size * (0.25 + 0.75 * turn), size)
        .setRotation(tilt + Math.sin(travel * TAU) * 0.22)
        .setAlpha(time < CONTACT ? Clamp(charge * 2, 0, 1) : 0)

      for (const [i, glint] of trail.entries()) {
        const lag = (i + 1) * 0.045
        const t = travel - lag
        glint
          .setPosition(
            flightX(t),
            flightY(t) + (i % 2 === 0 ? -1 : 1) * (9 + i * 2)
          )
          .setAlpha(time < CONTACT && t > 0 ? 0.85 - i * 0.12 : 0)
      }

      if (time < CONTACT) return

      const elapsed = time - CONTACT
      const flash = Clamp(elapsed / 110, 0, 1)
      impact.setAlpha((1 - flash) ** 2).setScale(0.52 + flash * 0.85)

      const fall = elapsed / SCATTER
      const spread = 1 - (1 - fall) ** 2
      for (const { coin, dx, dy, lift, size, spin, phase } of coins) {
        const spinWidth =
          0.24 + 0.76 * Math.abs(Math.cos(phase + spin * 2 * fall))
        coin
          .setPosition(
            endX + dx * spread,
            endY + dy * spread - lift * 4 * fall * (1 - fall) + 32 * fall ** 2
          )
          .setRotation(phase + spin * fall)
          .setScale(size * spinWidth, size)
          .setAlpha(1 - Clamp((fall - 0.49) / 0.51, 0, 1))
      }
    },
    onComplete: () => effect.destroy()
  })
  effect.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
