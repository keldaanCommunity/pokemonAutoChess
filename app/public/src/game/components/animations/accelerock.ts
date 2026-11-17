import Phaser, { type GameObjects } from "phaser"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { randomBetween } from "../../../../../utils/random"
import { DEPTH } from "../../depths"
import { followDashMovement } from "./helpers"

export const accelerockAnimation: AbilityAnimation = (args) => {
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
    fillFan(wake, 0x725234, 0.86, [
      [3, -9],
      [-12, -14],
      [-25, -22],
      [-39, -13],
      [-56, -20],
      [-50, -5],
      [-67, 3],
      [-49, 11],
      [-37, 21],
      [-24, 12],
      [-8, 15],
      [4, 7]
    ])
    fillFan(wake, 0xc69b69, 0.96, [
      [4, -5],
      [-10, -9],
      [-21, -15],
      [-34, -9],
      [-48, -12],
      [-40, -2],
      [-53, 4],
      [-38, 9],
      [-27, 15],
      [-17, 8],
      [-5, 9],
      [5, 4]
    ])
    wake.fillStyle(0xf0d4a3, 0.9)
    wake.fillTriangle(-8, -4, -28, -12, -19, -4)
    wake.fillTriangle(-25, 7, -47, 3, -34, 11)
    scene.abilitiesVfxGroup?.add(wake)
    scene.tweens.add({
      targets: wake,
      alpha: 0,
      scaleX: 1.15,
      scaleY: 1.2,
      duration: 320,
      ease: Phaser.Math.Easing.Quadratic.Out,
      onComplete: () => wake.destroy()
    })

    for (let i = 0; i < 3; i++) {
      const chip = scene.add
        .graphics()
        .setPosition(
          x - Math.cos(angle) * randomBetween(8, 20),
          y + randomBetween(-12, 12)
        )
        .setDepth(DEPTH.PROJECTILE)
        .setRotation(angle + randomBetween(-0.7, 0.7))
      chip.fillStyle(i === 0 ? 0x49301e : 0x795332, 1)
      chip.fillTriangle(0, -11, -13, -5, -6, 6)
      chip.fillStyle(0xe0b874, 1)
      chip.fillTriangle(-6, 6, -13, -5, -20, 7)
      scene.abilitiesVfxGroup?.add(chip)
      scene.tweens.add({
        targets: chip,
        x: chip.x - Math.cos(angle) * randomBetween(14, 26),
        y: chip.y + randomBetween(-14, 14),
        rotation: chip.rotation + randomBetween(-0.8, 0.8),
        alpha: 0,
        scale: 0.5,
        duration: randomBetween(220, 320),
        ease: Phaser.Math.Easing.Quadratic.Out,
        onComplete: () => chip.destroy()
      })
    }
  }

  followDashMovement(args, spawnTrail)
}
