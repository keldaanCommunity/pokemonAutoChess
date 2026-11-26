import type { AbilityAnimationArgs } from "../../../../../types/Animation"
import { Orientation } from "../../../../../types/enum/Game"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

export function tidalWaveAnimation(args: AbilityAnimationArgs) {
  const { scene, targetY, orientation, flip } = args
  const down = orientation === Orientation.DOWN
  const startCoords = transformEntityCoordinates(3.6, -4, flip)
  const endCoords = transformEntityCoordinates(3.6, 10, flip)
  const wave = scene.add
    .sprite(
      startCoords[0],
      startCoords[1],
      "abilities",
      `TIDAL_WAVE/00${targetY}.png` // targetY is used to store the tidal wave level
    )
    .setOrigin(0.5, 0.5)
    .setDepth(DEPTH.ABILITY_MINOR)
    .setScale(3)
    .setAlpha(0)
    .setRotation(down ? Math.PI : 0)
  scene.tweens.add({
    targets: wave,
    x: endCoords[0],
    y: endCoords[1],
    ease: "linear",
    duration: 1800,
    onComplete: () => {
      wave.destroy()
    },
    onUpdate: (tween) => {
      if (tween.progress < 0.2) {
        wave.setAlpha(tween.progress * 5)
      } else if (tween.progress > 0.8) {
        wave.setAlpha((1 - tween.progress) * 5)
      }
    }
  })
  scene.abilitiesVfxGroup?.add(wave)
}
