import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getImpactCells } from "./helpers"

const DURATION = 1000
const TRAVEL = 220
const RAY_STAGGER = 30
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

export const originPulseAnimation: AbilityAnimation = (args) => {
  const { scene, positionX, positionY, targetY, flip } = args
  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const centerY = casterY - 25
  const validRow =
    Number.isInteger(targetY) && targetY >= 0 && targetY < BOARD_HEIGHT
  const rays = validRow
    ? Array.from({ length: BOARD_WIDTH }, (_, index) => {
        const angle = (index / BOARD_WIDTH) * Math.PI * 2 - Math.PI / 2
        const [endX, endY] = transformEntityCoordinates(index, targetY, flip)
        return {
          x: casterX + Math.cos(angle) * 33,
          y: centerY + Math.sin(angle) * 23,
          endX,
          endY: endY - 20
        }
      })
    : []
  const impacts = validRow
    ? getImpactCells(args.data).map((cell) => {
        const [x, y] = transformEntityCoordinates(cell.x, cell.y, flip)
        return { x, y: y - 20, delay: cell.x * RAY_STAGGER }
      })
    : []

  const container = scene.add.container(0, 0).setDepth(DEPTH.PROJECTILE)
  scene.abilitiesVfxGroup?.add(container)
  const graphics = scene.add.graphics()
  container.add(graphics)

  const draw = (elapsed: number) => {
    if (!graphics.active) return
    graphics.clear()
    for (const [index, ray] of rays.entries()) {
      const rayTime = elapsed - index * RAY_STAGGER
      const travel = clamp(rayTime / TRAVEL)
      const rayAlpha = clamp(rayTime / 35) * (1 - clamp((rayTime - 450) / 230))
      const x = ray.x + (ray.endX - ray.x) * travel
      const y = ray.y + (ray.endY - ray.y) * travel
      for (const layer of [
        { width: 14, color: 0x159dff, alpha: 0.28 },
        { width: 8, color: 0x46dfff, alpha: 0.8 },
        { width: 3, color: 0xe9ffff, alpha: 0.98 }
      ]) {
        graphics.lineStyle(layer.width, layer.color, layer.alpha * rayAlpha)
        graphics.lineBetween(ray.x, ray.y, x, y)
      }
    }

    for (let i = 0; i < BOARD_WIDTH; i++) {
      const bubbleTime = elapsed - i * RAY_STAGGER
      const bubbleAlpha =
        clamp(bubbleTime / 80) * (1 - clamp((bubbleTime - 400) / 260))
      const angle = (i / BOARD_WIDTH) * Math.PI * 2 - Math.PI / 2
      const x = casterX + Math.cos(angle) * 33
      const y = centerY + Math.sin(angle) * 23
      const radius =
        1.4 * (10 + (i % 3) * 2) * (0.65 + 0.35 * clamp(bubbleTime / 100))
      graphics.fillStyle(0x56cfff, bubbleAlpha * 0.2)
      graphics.fillCircle(x, y, radius)
      graphics.lineStyle(2.1, 0xbaf5ff, bubbleAlpha * 0.75)
      graphics.strokeCircle(x, y, radius)
      graphics.fillStyle(0x4bddff, bubbleAlpha * 0.55)
      graphics.fillCircle(x, y, radius * 0.5)
      graphics.fillStyle(0xffffff, bubbleAlpha * 0.95)
      graphics.fillCircle(x, y, radius * 0.25)
    }

    for (const impact of impacts) {
      const impactTime = elapsed - impact.delay - TRAVEL
      const burst = clamp(impactTime / 100)
      const impactAlpha = burst * (1 - clamp((impactTime - 100) / 300))
      if (impactAlpha > 0) {
        graphics.fillStyle(0x22bfff, impactAlpha * 0.35)
        graphics.fillEllipse(impact.x, impact.y, 52 * burst, 38 * burst)
        graphics.fillStyle(0xc9faff, impactAlpha * 0.8)
        graphics.fillEllipse(impact.x, impact.y, 27 * burst, 22 * burst)
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2 + 0.3
          const inner = 11 * burst
          const outer = (25 + (i % 3) * 5) * burst
          const dx = Math.cos(angle)
          const dy = Math.sin(angle)
          graphics.fillStyle(i % 2 ? 0x62e6ff : 0xb9f9ff, impactAlpha * 0.9)
          graphics.fillTriangle(
            impact.x + dx * inner - dy * 5,
            impact.y + dy * inner + dx * 5,
            impact.x + dx * outer,
            impact.y + dy * outer,
            impact.x + dx * inner + dy * 5,
            impact.y + dy * inner - dx * 5
          )
          graphics.lineStyle(2.5, 0x9df5ff, impactAlpha * 0.85)
          graphics.beginPath()
          graphics.arc(
            impact.x,
            impact.y,
            (18 + i * 2) * burst,
            angle + 0.2,
            angle + 0.8
          )
          graphics.strokePath()
        }
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2 + 0.2
          const distance = 15 + burst * (17 + (i % 3) * 5)
          const x = impact.x + Math.cos(angle) * distance
          const y = impact.y + Math.sin(angle) * distance * 0.75
          graphics.fillStyle(i % 2 ? 0x59dfff : 0xe4ffff, impactAlpha * 0.9)
          graphics.fillEllipse(x, y, 4 + (i % 3) * 2, 8 + (i % 2) * 3)
        }
      }
    }
  }

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, args.delay ?? 0),
    onUpdate: (counter) => draw(counter.getValue() ?? 0),
    onComplete: () => container.destroy()
  })
  container.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  draw(0)
}
