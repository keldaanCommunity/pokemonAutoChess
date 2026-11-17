import Phaser, { type GameObjects } from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { randomBetween } from "../../../../../utils/random"
import { DEPTH } from "../../depths"
import { followDashMovement } from "./helpers"

export const aquaJetAnimation: AbilityAnimation = (args) => {
  const { scene } = args
  const fillFan = (
    graphics: GameObjects.Graphics,
    color: number,
    alpha: number,
    edgePoints: [number, number][]
  ) => {
    graphics.fillStyle(color, alpha)
    for (let i = 0; i < edgePoints.length; i++) {
      const current = edgePoints[i]
      const next = edgePoints[(i + 1) % edgePoints.length]
      if (!current || !next) continue
      graphics.fillTriangle(12, 0, current[0], current[1], next[0], next[1])
    }
  }

  const spawnTrail = (x: number, y: number, angle: number) => {
    const wake = scene.add
      .graphics()
      .setPosition(x, y + 5)
      .setRotation(angle)
      .setDepth(DEPTH.HIT_FX_BELOW_POKEMON)
      .setAlpha(0.95)
    fillFan(wake, 0x087dc4, 0.62, [
      [3, -8],
      [-9, -15],
      [-20, -12],
      [-31, -22],
      [-39, -10],
      [-54, -15],
      [-47, -3],
      [-62, 4],
      [-45, 10],
      [-35, 20],
      [-23, 12],
      [-12, 17],
      [5, 7]
    ])
    fillFan(wake, 0x22c9ed, 0.82, [
      [5, -4],
      [-8, -9],
      [-19, -8],
      [-29, -15],
      [-37, -6],
      [-47, -9],
      [-41, -1],
      [-53, 4],
      [-40, 7],
      [-31, 14],
      [-20, 8],
      [-10, 11],
      [5, 4]
    ])
    wake.fillStyle(0xd8ffff, 0.92)
    wake.fillTriangle(-7, -5, -26, -13, -19, -4)
    wake.fillTriangle(-24, 7, -44, 2, -33, 11)
    scene.abilitiesVfxGroup?.add(wake)
    scene.tweens.add({
      targets: wake,
      alpha: 0,
      scaleX: 1.15,
      scaleY: 1.2,
      duration: 260,
      ease: Phaser.Math.Easing.Quadratic.Out,
      onComplete: () => wake.destroy()
    })

    for (let i = 0; i < 3; i++) {
      const spray = scene.add
        .ellipse(
          x - Math.cos(angle) * randomBetween(8, 24),
          y + randomBetween(-15, 15),
          randomBetween(5, 9),
          randomBetween(8, 14),
          i === 0 ? 0xe7ffff : 0x63eaff,
          0.88
        )
        .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
        .setRotation(angle + randomBetween(-0.9, 0.9))
      scene.abilitiesVfxGroup?.add(spray)
      scene.tweens.add({
        targets: spray,
        x: spray.x + randomBetween(-15, 15),
        y: spray.y + randomBetween(-20, 20),
        alpha: 0,
        scale: 0.35,
        duration: randomBetween(180, 260),
        ease: Phaser.Math.Easing.Quadratic.Out,
        onComplete: () => spray.destroy()
      })
    }
  }

  followDashMovement(args, spawnTrail)
}
