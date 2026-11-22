import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const DURATION = 850
const TAKEOFF = 100
const CONTACT = 260
const SIZE = 1.5
const MANA_SIZE = 1.25
const clamp = Phaser.Math.Clamp

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

export const highJumpKickAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  data,
  delay = 0
}) => {
  if (
    !isBoardCell(positionX, positionY) ||
    !isBoardCell(targetX, targetY) ||
    (positionX === targetX && positionY === targetY)
  ) {
    return
  }

  const [startX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [endX, targetYOnScreen] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const startY = casterY - 18
  const endY = targetYOnScreen
  const ppLost = data?.ppLost === true
  const ppGained = data?.ppGained === true
  const arcHeight = 55
  const point = (progress: number) => ({
    x: startX + (endX - startX) * progress,
    y:
      startY +
      (endY - startY) * progress -
      Math.sin(progress * Math.PI) * arcHeight
  })
  const haloBack = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const effect = scene.add.graphics().setDepth(DEPTH.ABILITY)
  scene.abilitiesVfxGroup?.add(haloBack)
  scene.abilitiesVfxGroup?.add(effect)

  const timeline = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (!effect.active || !haloBack.active) return
      const time = counter.getValue() ?? 0
      effect.clear()
      haloBack.clear()

      if (time < 520) {
        const alpha = clamp(time / 55, 0, 1) * clamp((520 - time) / 180, 0, 1)
        haloBack.lineStyle(3, 0xb87db6, alpha * 0.9)
        haloBack.beginPath()
        haloBack.arc(startX, casterY, 29, Math.PI, Math.PI * 2)
        haloBack.strokePath()
        effect.lineStyle(3, 0xffe7c7, alpha * 0.85)
        effect.beginPath()
        effect.arc(startX, casterY, 29, 0, Math.PI)
        effect.strokePath()
      }

      if (time < 180) {
        const alpha = clamp(time / 35, 0, 1) * clamp((180 - time) / 80, 0, 1)
        effect.lineStyle(3 * SIZE, 0xb87db6, alpha * 0.8)
        effect.beginPath()
        effect.arc(
          startX,
          startY + 3 * SIZE,
          18 * SIZE,
          Math.PI * 0.85,
          Math.PI * 1.8
        )
        effect.strokePath()
        effect.lineStyle(2 * SIZE, 0xffe7c7, alpha)
        effect.beginPath()
        effect.arc(
          startX,
          startY + 3 * SIZE,
          23 * SIZE,
          Math.PI * 0.95,
          Math.PI * 1.65
        )
        effect.strokePath()
      }

      if (time >= TAKEOFF && time < CONTACT) {
        const progress = (time - TAKEOFF) / (CONTACT - TAKEOFF)
        const head = point(progress)
        const tailProgress = Math.max(0, progress - 0.34)
        const segments = 10
        for (let i = 0; i < segments; i++) {
          const a = i / segments
          const b = (i + 1) / segments
          const from = point(tailProgress + (progress - tailProgress) * a)
          const to = point(tailProgress + (progress - tailProgress) * b)
          effect.lineStyle((2 + 9 * b) * SIZE, 0xad70a7, 0.3 + 0.45 * b)
          effect.lineBetween(from.x, from.y, to.x, to.y)
          effect.lineStyle((1 + 4 * b) * SIZE, 0xffe5bf, 0.55 + 0.4 * b)
          effect.lineBetween(from.x, from.y, to.x, to.y)
        }
        effect.fillStyle(0xfff3d9, 0.95)
        effect.fillCircle(head.x, head.y, 4 * SIZE)
      }

      if (time >= CONTACT) {
        const elapsed = time - CONTACT
        const impact = clamp(1 - elapsed / 190, 0, 1)
        const flash = clamp(1 - elapsed / 85, 0, 1)
        const expansion = elapsed * 0.09
        const angle = Math.atan2(endY - point(0.94).y, endX - point(0.94).x)

        if (impact > 0) {
          for (let i = 0; i < 9; i++) {
            const rayAngle = angle + (i * Math.PI * 2) / 9
            const dx = Math.cos(rayAngle)
            const dy = Math.sin(rayAngle)
            const length = ((i % 2 === 0 ? 31 : 21) + expansion) * SIZE
            const width = (i % 2 === 0 ? 4 : 3) * SIZE
            effect.fillStyle(i % 3 === 0 ? 0xffa43e : 0xffd66a, impact)
            effect.fillTriangle(
              endX - dy * width,
              endY + dx * width,
              endX + dx * length,
              endY + dy * length,
              endX + dy * width,
              endY - dx * width
            )
          }
          effect.fillStyle(0xfff7dc, flash)
          effect.fillCircle(endX, endY, (10 + elapsed * 0.025) * SIZE)
        }

        const sparkAlpha = clamp(1 - elapsed / 340, 0, 1)
        for (let i = 0; i < 6; i++) {
          const sparkAngle = angle + (i * Math.PI * 2) / 6 + 0.3
          const distance = (10 + elapsed * (0.08 + (i % 3) * 0.025)) * SIZE
          effect.fillStyle(i % 3 === 0 ? 0xc98bbd : 0xffc15e, sparkAlpha)
          effect.fillCircle(
            endX + Math.cos(sparkAngle) * distance,
            endY + Math.sin(sparkAngle) * distance,
            (1.5 + (i % 2)) * SIZE
          )
        }
      }

      if (ppLost && time >= 300 && time < 490) {
        const age = time - 300
        const alpha = clamp(age / 40, 0, 1) * clamp((190 - age) / 100, 0, 1)
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2 + 0.4
          const distance = (22 - age * 0.055) * MANA_SIZE
          const x = endX + Math.cos(angle) * distance
          const y = endY + Math.sin(angle) * distance
          effect.fillStyle(0x2266ec, alpha * 0.9)
          effect.fillCircle(x, y, 3 * MANA_SIZE)
          effect.fillStyle(0xc0ddff, alpha)
          effect.fillCircle(x, y, 1.5 * MANA_SIZE)
        }
      }

      if (ppLost && ppGained) {
        for (let i = 0; i < 3; i++) {
          const age = time - 350 - i * 45
          if (age < 0 || age > 230) continue
          const progress = age / 230
          const x = endX + (startX - endX) * progress
          const y =
            endY +
            (casterY - endY) * progress +
            Math.sin(progress * Math.PI) * 25
          const alpha = clamp(age / 35, 0, 1) * clamp((230 - age) / 30, 0, 1)
          effect.fillStyle(0x2266ec, alpha * 0.65)
          effect.fillCircle(x, y, 7 * MANA_SIZE)
          effect.fillStyle(0x51a6ff, alpha)
          effect.fillCircle(x, y, 3.5 * MANA_SIZE)
          effect.fillStyle(0xc0ddff, alpha)
          effect.fillCircle(x, y, 1.5 * MANA_SIZE)
        }
      }

      if (ppGained && time >= 640 && time < DURATION) {
        const age = time - 640
        const alpha = clamp(age / 35, 0, 1) * clamp((210 - age) / 150, 0, 1)
        haloBack.lineStyle(3 * MANA_SIZE, 0x2266ec, alpha * 0.85)
        haloBack.beginPath()
        haloBack.arc(startX, casterY, 29 * MANA_SIZE, Math.PI, Math.PI * 2)
        haloBack.strokePath()
        effect.lineStyle(3 * MANA_SIZE, 0x51a6ff, alpha * 0.9)
        effect.beginPath()
        effect.arc(startX, casterY, 29 * MANA_SIZE, 0, Math.PI)
        effect.strokePath()
      }
    },
    onComplete: () => {
      effect.destroy()
      haloBack.destroy()
    }
  })
  effect.once(Phaser.GameObjects.Events.DESTROY, () => timeline.stop())
  haloBack.once(Phaser.GameObjects.Events.DESTROY, () => timeline.stop())
}
