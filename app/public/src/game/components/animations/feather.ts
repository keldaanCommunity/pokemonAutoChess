import Phaser from "phaser"
import type { AbilityAnimationArgs } from "../../../../../types/Animation"
import { randomBetween } from "../../../../../utils/random"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const FeatherBaseAngles: Record<string, number> = {
  HEALTH_FEATHER: 0,
  MUSCLE_FEATHER: -30,
  RESIST_FEATHER: 30,
  GENIUS_FEATHER: -15,
  CLEVER_FEATHER: 15,
  SWIFT_FEATHER: 45,
  PRETTY_FEATHER: -45
}

export function featherAnimation(args: AbilityAnimationArgs) {
  const { scene, positionX, positionY, flip, ability } = args

  const frame = `FEATHER_DANCE/${ability}.png`
  if (
    !scene.textures.exists("abilities") ||
    !scene.textures.get("abilities").has(frame)
  ) {
    return
  }

  const destination = transformEntityCoordinates(positionX, positionY, flip)

  // Random drift direction: feather sways left or right as it falls
  const driftDir = Math.random() < 0.5 ? -1 : 1
  const driftWidth = randomBetween(25, 45)
  const startHeight = randomBetween(100, 160)
  const baseAngle = FeatherBaseAngles[ability] ?? 0

  const startX = destination[0] + driftDir * driftWidth * 1.5
  const startY = destination[1] - startHeight

  // Mid-air waypoint: drifted to opposite side, partway down
  const midX = destination[0] - driftDir * driftWidth * 0.5
  const midY = destination[1] - startHeight * 0.45

  // Final landing position with tiny random offset
  const landX = destination[0] + randomBetween(-6, 6)
  const landY = destination[1] + randomBetween(-4, 4)

  const feather = scene.add
    .image(startX, startY, "abilities", frame)
    .setOrigin(0.5, 0.5)
    .setDepth(DEPTH.ABILITY)
    .setAlpha(0)
    .setAngle(baseAngle)

  scene.abilitiesVfxGroup?.add(feather)

  scene.tweens.chain({
    targets: feather,
    tweens: [
      {
        // Phase 1: fade in, sway one direction while falling to mid-air
        x: midX,
        y: midY,
        alpha: 1,
        angle: baseAngle + driftDir * 35,
        ease: Phaser.Math.Easing.Sine.Out,
        duration: 500
      },
      {
        // Phase 2: sway back as it reaches the ground
        x: landX,
        y: landY,
        angle: baseAngle - driftDir * 20,
        ease: Phaser.Math.Easing.Quadratic.In,
        duration: 500
      },
      {
        // Phase 3: settle - tiny rock to a flat rest, slight scale-up on impact
        angle: baseAngle - driftDir * 5,
        ease: Phaser.Math.Easing.Back.Out,
        duration: 120
      },
      {
        // Phase 4: come to full rest (flatten back from impact squish)
        angle: baseAngle,
        ease: Phaser.Math.Easing.Sine.InOut,
        duration: 180
      },
      {
        // Phase 5: linger, then slowly fade away
        alpha: 0,
        scaleX: 0.6,
        scaleY: 0.6,
        ease: Phaser.Math.Easing.Sine.In,
        duration: 600,
        delay: 400
      }
    ],
    onComplete: () => {
      feather?.destroy()
    }
  })
}
