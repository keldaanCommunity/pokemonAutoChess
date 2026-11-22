import Phaser from "phaser"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { distanceE } from "../../../../../utils/distance"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getSurgeAllies } from "./helpers"

const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function addMistyCue(
  scene: AbilityAnimationArgs["scene"],
  x: number,
  y: number,
  delay: number,
  isCaster: boolean,
  phase: number
) {
  const duration = isCaster ? 900 : 780
  const back = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setScale(1.6)
  const front = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.PROJECTILE)
    .setScale(1.6)
  scene.abilitiesVfxGroup?.add(back)
  scene.abilitiesVfxGroup?.add(front)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: 1,
    duration: duration * 1.5,
    delay,
    onUpdate: (counter) => {
      if (!back.active || !front.active) return
      const time = counter.progress * duration
      const bloom = Phaser.Math.Easing.Sine.Out(clamp(time / 180))
      const fadeIn = Phaser.Math.Easing.Sine.InOut(clamp(time / 240))
      const alpha = fadeIn * clamp((duration - time) / 240) * 1.4
      const width = (isCaster ? 64 : 53) * (0.72 + bloom * 0.28)
      back.clear()
      front.clear()

      back.fillStyle(0x7565bb, alpha * 0.23)
      back.fillEllipse(0, 9, width, width * 0.36)
      back.fillStyle(0x89d7e5, alpha * 0.26)
      back.fillEllipse(-5, 7, width * 0.75, width * 0.25)
      back.fillStyle(0xf4c8f3, alpha * 0.2)
      back.fillEllipse(6, 6, width * 0.5, width * 0.18)

      const puffCount = isCaster ? 8 : 6
      for (let puff = 0; puff < puffCount; puff++) {
        const progress = (time / 680 + puff / puffCount) % 1
        const angle = phase + puff * 2.4 + time * 0.0015
        const puffX = Math.cos(angle) * (13 + progress * 16)
        const puffY = 4 - progress * (isCaster ? 52 : 38)
        const puffAlpha = alpha * Math.sin(Math.PI * progress)
        const layer = puff % 2 === 0 ? back : front
        layer.fillStyle(puff % 3 === 0 ? 0xb7eaf0 : 0xd7b5ee, puffAlpha * 0.14)
        layer.fillEllipse(puffX, puffY, 24 + progress * 9, 10 + progress * 5)
        layer.fillStyle(0xf5d9fa, puffAlpha * 0.14)
        layer.fillEllipse(puffX - 2, puffY - 1, 13 + progress * 5, 6)
      }

      if (isCaster) {
        for (let ribbon = 0; ribbon < 2; ribbon++) {
          const points: Phaser.Math.Vector2[] = []
          for (let i = 0; i <= 16; i++) {
            const progress = i / 16
            const angle =
              progress * Math.PI * 2 + time * 0.004 + ribbon * Math.PI
            points.push(
              new Phaser.Math.Vector2(
                Math.sin(angle) * (24 - progress * 5),
                2 - progress * 55 + Math.cos(angle) * 5
              )
            )
          }
          const layer = ribbon === 0 ? back : front
          layer.lineStyle(3, ribbon === 0 ? 0xa88be1 : 0xf3bce9, alpha * 0.38)
          layer.strokePoints(points, false)
          layer.lineStyle(1, 0xd7f7fa, alpha * 0.65)
          layer.strokePoints(points, false)
        }
      }

      const sparkleCount = isCaster ? 5 : 3
      for (let sparkle = 0; sparkle < sparkleCount; sparkle++) {
        const progress = (time / 580 + sparkle / sparkleCount) % 1
        const angle = phase + sparkle * 2.4
        const sparkleX = Math.cos(angle) * (15 + progress * 12)
        const sparkleY = -8 - progress * (isCaster ? 55 : 42)
        const sparkleAlpha = clamp(alpha * Math.sin(Math.PI * progress) * 0.85)
        const size = 1.8 + (sparkle % 2) * 0.7
        front.lineStyle(1.2, 0xe7fbff, sparkleAlpha)
        front.lineBetween(sparkleX - size, sparkleY, sparkleX + size, sparkleY)
        front.lineBetween(sparkleX, sparkleY - size, sparkleX, sparkleY + size)
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

export const mistySurgeAnimation: AbilityAnimation = ({
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
  addMistyCue(scene, casterX, casterY, baseDelay, true, 0)

  getSurgeAllies(data, positionX, positionY).forEach((ally, index) => {
    const [allyX, allyY] = transformEntityCoordinates(ally.x, ally.y, flip)
    const wave = Math.min(
      160,
      distanceE(positionX, positionY, ally.x, ally.y) * 22
    )
    addMistyCue(
      scene,
      allyX,
      allyY,
      baseDelay + 110 + wave,
      false,
      index * 0.48
    )
  })
}
