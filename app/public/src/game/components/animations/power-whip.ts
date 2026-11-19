import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { addAbilitySprite } from "./helpers"

const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

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

function drawLeaf(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  angle: number,
  size: number,
  color: number,
  alpha: number
) {
  const dx = Math.cos(angle) * size
  const dy = Math.sin(angle) * size
  graphics.fillStyle(color, alpha)
  graphics.fillTriangle(
    x - dx,
    y - dy,
    x + dy * 0.48,
    y - dx * 0.48,
    x + dx,
    y + dy
  )
  graphics.fillTriangle(
    x - dx,
    y - dy,
    x - dy * 0.48,
    y + dx * 0.48,
    x + dx,
    y + dy
  )
}

export const powerWhipAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  ap,
  delay = 0
}) => {
  if (!isBoardCell(positionX, positionY)) return

  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const hasTarget =
    isBoardCell(targetX, targetY) &&
    (targetX !== positionX || targetY !== positionY)
  const [endX, endY] = hasTarget
    ? transformEntityCoordinates(targetX, targetY, flip)
    : [casterX, casterY]
  const dx = endX - casterX
  const dy = endY - casterY
  const length = Math.hypot(dx, dy)
  const forwardX = hasTarget ? dx / length : 0
  const forwardY = hasTarget ? dy / length : 0
  const normalX = -forwardY
  const normalY = forwardX
  const turnRadius = 30
  const turnInset = 23
  const targetLift = 10
  const approachLength = length - turnInset
  const turnLength = Math.PI * turnRadius
  const pathLength = approachLength * 2 + turnLength
  const thornCount = Math.min(64, Math.max(14, Math.round(pathLength / 18)))
  const vineWidthScale = 0.55
  const thornBase = 13 * vineWidthScale

  const ground = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const vine = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const visuals = [ground, vine, front]
  visuals.forEach((visual) => scene.abilitiesVfxGroup?.add(visual))

  const duration = 1100
  const turnStart = 460
  const turnEnd = 650
  const contact = (turnStart + turnEnd) / 2
  let impactPlayed = false
  const tween = scene.tweens.addCounter({
    from: 0,
    to: duration,
    duration,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (visuals.some((visual) => !visual.active)) return
      const time = counter.getValue() ?? 0
      visuals.forEach((visual) => visual.clear())

      const aura = clamp(time / 130) * clamp((duration - time) / 300)
      ground.fillStyle(0x7dff36, aura * 0.24)
      ground.fillEllipse(casterX, casterY + 6, 105, 50)
      ground.lineStyle(3, 0xb5ff69, aura * 0.75)
      ground.strokeEllipse(casterX, casterY + 6, 96, 42)
      ground.lineStyle(2, 0x8bef38, aura * 0.8)
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI * 2) / 10
        const x = casterX + Math.cos(angle) * 44
        const y = casterY + 6 + Math.sin(angle) * 18
        ground.lineBetween(x, y, x + Math.cos(angle) * 4, y - 7 - (i % 3) * 3)
      }
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12 + time * 0.004
        const radius = 30 + (i % 3) * 7
        const x = casterX + Math.cos(angle) * radius
        const y = casterY - 12 + Math.sin(angle) * radius * 0.45 - (i % 3) * 8
        drawLeaf(
          front,
          x,
          y,
          angle + time * 0.003,
          5 + (i % 3),
          0x8bef38,
          aura * 0.85
        )
      }

      if (!hasTarget) return

      const head =
        approachLength * clamp((time - 140) / (turnStart - 140)) +
        turnLength * clamp((time - turnStart) / (turnEnd - turnStart)) +
        approachLength * clamp((time - turnEnd) / 315)
      // The leading tip keeps moving forward on one track while the tail
      // releases from the caster and follows it through the same turn.
      const tail = head * clamp((time - 505) / 535)
      const wavePoint = (distance: number) => {
        let along: number
        let across: number
        let lift: number
        if (
          distance > approachLength &&
          distance < approachLength + turnLength
        ) {
          const angle = (distance - approachLength) / turnRadius
          along = approachLength + Math.sin(angle) * turnRadius
          across = Math.cos(angle) * turnRadius
          lift = targetLift
        } else {
          const returning = distance >= approachLength + turnLength
          along = returning ? pathLength - distance : distance
          const t = along / approachLength
          const envelope = Math.sin(Math.PI * t) ** 2
          const blend = t * t * (3 - 2 * t)
          const lane = turnRadius * blend
          lift = targetLift * blend
          across =
            (returning ? -lane : lane) +
            Math.sin(t * Math.PI * (returning ? 3.5 : 5)) *
              (returning ? 15 : 22) *
              envelope
        }
        return {
          x: casterX + forwardX * along + normalX * across,
          y: casterY + forwardY * along + normalY * across - lift
        }
      }

      if (head > tail) {
        const segments = Math.min(
          112,
          Math.max(2, Math.ceil((head - tail) / 7))
        )
        const points = Array.from({ length: segments + 1 }, (_, i) =>
          wavePoint(Phaser.Math.Linear(tail, head, i / segments))
        )
        const tip = points[segments]
        for (const layer of [
          { width: 41, color: 0x94de5a, alpha: 0.17 },
          { width: 33, color: 0x316b00, alpha: 1 },
          { width: 25, color: 0x42ad00, alpha: 1 },
          { width: 12, color: 0x84bd5a, alpha: 0.72 }
        ]) {
          const width = layer.width * vineWidthScale
          vine.lineStyle(width, layer.color, layer.alpha)
          vine.beginPath()
          vine.moveTo(points[0].x, points[0].y)
          for (let i = 1; i <= segments; i++) {
            const point = points[i]
            vine.lineTo(point.x, point.y)
          }
          vine.strokePath()
          vine.fillStyle(layer.color, layer.alpha)
          vine.fillCircle(tip.x, tip.y, width / 2)
        }

        for (let fiber = 0; fiber < 4; fiber++) {
          vine.lineStyle(
            (fiber % 2 === 0 ? 2 : 1) * vineWidthScale,
            fiber % 2 === 0 ? 0x398c00 : 0xd6efa5,
            0.65
          )
          vine.beginPath()
          for (let i = 0; i <= segments; i++) {
            const point = points[i]
            const before = points[Math.max(0, i - 1)]
            const after = points[Math.min(segments, i + 1)]
            const angle = Math.atan2(after.y - before.y, after.x - before.x)
            const t = Phaser.Math.Linear(tail, head, i / segments) / pathLength
            const offset =
              ((fiber - 1.5) * 5 + Math.sin(t * 27 + fiber) * 2) *
              vineWidthScale
            const x = point.x - Math.sin(angle) * offset
            const y = point.y + Math.cos(angle) * offset
            if (i === 0) vine.moveTo(x, y)
            else vine.lineTo(x, y)
          }
          vine.strokePath()
        }

        const spacing = pathLength / thornCount
        for (let i = 0; i < thornCount; i++) {
          const distance = (i + 0.65) * spacing
          if (distance >= head) break
          if (distance <= tail) continue
          const growth = clamp(Math.min(head - distance, distance - tail) / 10)
          const { x, y } = wavePoint(distance)
          const before = wavePoint(distance - 2)
          const after = wavePoint(distance + 2)
          const angle = Math.atan2(after.y - before.y, after.x - before.x)
          const tx = Math.cos(angle)
          const ty = Math.sin(angle)
          const side = i % 2 === 0 ? 1 : -1
          const nx = -ty * side
          const ny = tx * side
          const baseX = x + nx * thornBase
          const baseY = y + ny * thornBase
          const tipOut = (18 + (i % 3) * 3) * growth
          const tipX = baseX + nx * tipOut - tx * 13 * growth
          const tipY = baseY + ny * tipOut - ty * 13 * growth
          const elbowX = baseX + nx * tipOut * 0.52 - tx * 3 * growth
          const elbowY = baseY + ny * tipOut * 0.52 - ty * 3 * growth
          vine.fillStyle(0x316b00)
          vine.fillTriangle(
            baseX - tx * 4,
            baseY - ty * 4,
            tipX,
            tipY,
            elbowX,
            elbowY
          )
          vine.fillTriangle(
            baseX - tx * 4,
            baseY - ty * 4,
            elbowX,
            elbowY,
            baseX + tx * 5,
            baseY + ty * 5
          )
          vine.lineStyle(1.2, 0x84bd5a, growth * 0.9)
          vine.lineBetween(baseX + tx * 4, baseY + ty * 4, elbowX, elbowY)
          vine.lineBetween(elbowX, elbowY, tipX, tipY)

          if (i % 8 !== 1 && i % 8 !== 6) continue
          const stemX = x - nx * (thornBase + 13 * growth)
          const stemY = y - ny * (thornBase + 13 * growth)
          vine.lineStyle(2, 0x398c00, growth)
          vine.lineBetween(x - nx * thornBase, y - ny * thornBase, stemX, stemY)
          for (const [turn, size, color] of [
            [0.85, 11, 0x94de5a],
            [2.05, 8, 0x5ab521]
          ]) {
            const leafAngle = angle - side * turn
            const leafX = stemX + Math.cos(leafAngle) * size * growth
            const leafY = stemY + Math.sin(leafAngle) * size * growth
            drawLeaf(vine, leafX, leafY, leafAngle, size * growth, color, 0.95)
            vine.lineStyle(1, 0xd6efa5, growth * 0.8)
            vine.lineBetween(stemX, stemY, leafX, leafY)
          }
        }
      }

      if (!impactPlayed && time >= contact) {
        impactPlayed = true
        const hit = wavePoint(approachLength + turnLength / 2)
        addAbilitySprite(scene, "POWER_WHIP", ap, [hit.x, hit.y], {
          scale: 2,
          depth: DEPTH.HIT_FX_ABOVE_POKEMON,
          animOptions: { duration: 230 }
        })
      }
    },
    onComplete: () => visuals.forEach((visual) => visual.destroy())
  })

  visuals.forEach((visual) => {
    visual.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  })
}
