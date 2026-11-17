import Phaser from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

export const futureSightSplashAnimation: AbilityAnimation = ({
  scene,
  targetX,
  targetY,
  flip
}) => {
  if (targetX < 0 || targetY < 0) return
  const [x, y] = transformEntityCoordinates(targetX, targetY, flip)
  const splash = scene.add
    .container(x, y - 16)
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setScale(0.625)
  scene.abilitiesVfxGroup?.add(splash)

  const glow = scene.add.ellipse(0, 0, 46, 38, 0xbb70ef, 0.35)
  const ring = scene.add.graphics()
  ring.lineStyle(3, 0xe7b8ff, 0.85)
  ring.strokeEllipse(0, 0, 42, 30)
  splash.add([glow, ring])

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6
    const spark = scene.add.star(
      Math.cos(angle) * 12,
      Math.sin(angle) * 9,
      4,
      1,
      4,
      i % 2 === 0 ? 0x9bf4ff : 0xf5d5ff
    )
    splash.add(spark)
    scene.tweens.add({
      targets: spark,
      x: Math.cos(angle) * 30,
      y: Math.sin(angle) * 23,
      alpha: 0,
      duration: 350,
      ease: Phaser.Math.Easing.Quadratic.Out
    })
  }

  scene.tweens.chain({
    targets: splash,
    tweens: [
      { scale: 1.25, duration: 120, ease: Phaser.Math.Easing.Quadratic.Out },
      {
        scale: 1.5,
        alpha: 0,
        duration: 300,
        ease: Phaser.Math.Easing.Quadratic.Out
      }
    ],
    onComplete: () => splash.destroy()
  })
}
