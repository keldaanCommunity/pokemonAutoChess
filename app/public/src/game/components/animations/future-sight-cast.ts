import Phaser from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

export const futureSightCastAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip
}) => {
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const vision = scene.add
    .container(x, y - 20)
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setScale(0.65)
    .setAlpha(0)
  scene.abilitiesVfxGroup?.add(vision)

  const glow = scene.add.ellipse(0, 0, 100, 100, 0x9c5aff, 0.18)
  const halo = scene.add.graphics()
  halo.lineStyle(3, 0xd9a5ff, 0.8)
  halo.strokeCircle(0, 0, 35)
  halo.lineStyle(1, 0xffffff, 0.8)
  halo.strokeCircle(0, 0, 39)
  const orbit = scene.add.graphics()
  orbit.lineStyle(3, 0x8feaff, 0.85)
  orbit.strokeEllipse(0, 0, 106, 34)
  orbit.lineStyle(2, 0xf5c1ff, 0.8)
  orbit.strokeEllipse(0, 0, 94, 58)
  vision.add([glow, halo, orbit])

  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8
    const light = scene.add
      .star(Math.cos(angle) * 55, Math.sin(angle) * 42, 4, 1, 4, 0xe7d2ff)
      .setAlpha(0.9)
    vision.add(light)
    scene.tweens.add({
      targets: light,
      x: Math.cos(angle) * 18,
      y: Math.sin(angle) * 15,
      alpha: 0,
      scale: 0.3,
      duration: 650,
      ease: Phaser.Math.Easing.Quadratic.In
    })
  }

  scene.tweens.add({
    targets: orbit,
    angle: 115,
    duration: 800,
    ease: Phaser.Math.Easing.Sine.InOut
  })
  scene.tweens.chain({
    targets: vision,
    tweens: [
      {
        scale: 1,
        alpha: 1,
        duration: 180,
        ease: Phaser.Math.Easing.Quadratic.Out
      },
      {
        scale: 0.75,
        alpha: 0,
        delay: 300,
        duration: 320,
        ease: Phaser.Math.Easing.Quadratic.In
      }
    ],
    onComplete: () => vision.destroy()
  })
}
