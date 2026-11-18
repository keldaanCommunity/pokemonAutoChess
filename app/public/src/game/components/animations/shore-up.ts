import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

export const shoreUpAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay
}) => {
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const back = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add.graphics({ x, y }).setDepth(DEPTH.PROJECTILE)
  scene.abilitiesVfxGroup?.add(back)
  scene.abilitiesVfxGroup?.add(front)

  const duration = 1400
  const clamp = (value: number) => Math.max(0, Math.min(1, value))
  scene.tweens.addCounter({
    from: 0,
    to: 1,
    duration,
    delay: Math.max(0, delay ?? 0),
    onUpdate: (tween) => {
      if (!back.active || !front.active) return
      const time = tween.progress * duration
      back.clear()
      front.clear()

      const groundAlpha = clamp(time / 160) * clamp((1150 - time) / 300)
      back.fillStyle(0xd8a568, groundAlpha * 0.28)
      back.fillEllipse(0, 7, 88, 34)

      const gathering = clamp(time / 310)
      const gatheringAlpha = clamp(time / 100) * clamp((500 - time) / 190)
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI * 2) / 10 + gathering * 0.4
        const radius = 52 - gathering * 19
        back.fillStyle(i % 2 ? 0xf0d49d : 0xc99761, gatheringAlpha * 0.8)
        back.fillEllipse(
          Math.cos(angle) * radius,
          7 + Math.sin(angle) * radius * 0.4,
          7,
          4
        )
      }

      const stormAlpha = clamp((time - 200) / 180) * clamp((990 - time) / 260)
      if (stormAlpha > 0) {
        const rotation = (time - 200) * 0.008
        for (let ribbon = 0; ribbon < 6; ribbon++) {
          const height = 8 - ribbon * 9
          const radius = 43 - ribbon * 2
          const start = rotation + ribbon * 2.4
          for (let segment = 0; segment < 14; segment++) {
            const a = start + (segment / 14) * 2.2
            const b = start + ((segment + 1) / 14) * 2.2
            const layer = Math.sin((a + b) / 2) >= 0 ? front : back
            const taper = Math.sin((Math.PI * (segment + 0.5)) / 14)
            layer.lineStyle(
              1 + taper * 3,
              ribbon % 2 ? 0xe7bd85 : 0xf6d8a4,
              stormAlpha * (0.4 + taper * 0.35)
            )
            layer.beginPath()
            layer.moveTo(Math.cos(a) * radius, height + Math.sin(a) * 9)
            layer.lineTo(Math.cos(b) * radius, height + Math.sin(b) * 9)
            layer.strokePath()
          }
        }
        for (let i = 0; i < 12; i++) {
          const angle = rotation * 0.8 + (i * Math.PI * 2) / 12
          const layer = Math.sin(angle) >= 0 ? front : back
          const height = 7 - ((i * 13 + time * 0.035) % 46)
          layer.fillStyle(i % 2 ? 0xffd69a : 0xb98251, stormAlpha * 0.75)
          layer.fillEllipse(Math.cos(angle) * 44, height, 4, 3)
        }
      }

      const healing = clamp(time / 410)
      const healingAlpha = clamp((600 - time) / 300)
      if (healingAlpha > 0) {
        const radius = 10 + healing * 23
        front.fillStyle(0x9fffc5, healingAlpha * 0.16)
        front.fillCircle(0, -13, 14 + healing * 8)
        front.lineStyle(2, 0xbfff7d, healingAlpha * 0.8)
        front.strokeCircle(0, -13, radius)
        front.lineStyle(1, 0x7dffcf, healingAlpha * 0.7)
        front.strokeCircle(0, -13, radius * 0.68)
        front.fillStyle(0xe4fff0, healingAlpha * 0.7)
        front.fillCircle(0, -13, 5 * (1 - healing * 0.55))

        for (let i = 0; i < 7; i++) {
          const angle = (i * Math.PI * 2) / 7 + 0.35
          const distance = 25 + healing * 16
          const sx = Math.cos(angle) * distance
          const sy = -13 + Math.sin(angle) * distance * 0.8 - healing * 5
          const size = 3 + (i % 3)
          front.fillStyle(i % 2 ? 0xb8ff9a : 0x8cffe1, healingAlpha * 0.9)
          front.beginPath()
          front.moveTo(sx, sy - size)
          front.lineTo(sx + size * 0.3, sy - size * 0.3)
          front.lineTo(sx + size, sy)
          front.lineTo(sx + size * 0.3, sy + size * 0.3)
          front.lineTo(sx, sy + size)
          front.lineTo(sx - size * 0.3, sy + size * 0.3)
          front.lineTo(sx - size, sy)
          front.lineTo(sx - size * 0.3, sy - size * 0.3)
          front.closePath()
          front.fillPath()
        }
      }
    },
    onComplete: () => {
      if (back.active) back.destroy()
      if (front.active) front.destroy()
    }
  })
}
