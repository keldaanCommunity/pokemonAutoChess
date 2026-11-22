import Phaser from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { randomBetween, shuffleArray } from "../../../../../utils/random"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { addAbilitySprite } from "./helpers"

export const aquaSwirlAnimation: AbilityAnimation = ({
  scene,
  ability,
  ap,
  positionX,
  positionY,
  flip
}) => {
  const impactOffsets = shuffleArray([
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [0, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
  ])
  const [centerX] = transformEntityCoordinates(positionX, positionY, flip)

  for (let i = 0; i < 18; i++) {
    const [offsetX, offsetY] = impactOffsets[i % impactOffsets.length]
    const [impactX, impactY] = transformEntityCoordinates(
      positionX + offsetX,
      positionY + offsetY,
      flip
    )
    const landingX = impactX + randomBetween(-10, 10)
    const landingY = impactY + randomBetween(-10, 10)
    const startX =
      landingX +
      (impactX - centerX) * randomBetween(0.35, 0.65) +
      randomBetween(-12, 12)
    const startY = landingY - randomBetween(130, 200)
    const rotation = randomBetween(0, Math.PI * 2)

    scene.time.delayedCall(i * 140 + randomBetween(0, 70), () => {
      const droplet = addAbilitySprite(scene, ability, ap, [startX, startY], {
        scale: 2,
        rotation,
        depth: DEPTH.ABILITY,
        destroyOnComplete: false
      })
      if (!droplet) return

      scene.tweens.add({
        targets: droplet,
        x: landingX,
        y: landingY,
        duration: randomBetween(350, 550),
        ease: Phaser.Math.Easing.Quadratic.In,
        onComplete: () => {
          droplet.destroy()
          addAbilitySprite(scene, "RING_PINK", ap, [landingX, landingY], {
            scale: 2,
            depth: DEPTH.ABILITY_GROUND_LEVEL
          })
        }
      })
    })
  }
}
