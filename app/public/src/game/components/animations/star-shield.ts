import type { AbilityAnimation } from "../../../../../types/Animation"
import { Orientation } from "../../../../../types/enum/Game"
import { OrientationVector } from "../../../../../utils/orientation"
import { parabolicProjectile } from "./helpers"

export const starShieldAnimation: AbilityAnimation = (args) => {
  for (const direction of Object.values(Orientation)) {
    const directionVector = OrientationVector[direction]
    const burstArgs = {
      ...args,
      positionX: args.targetX,
      positionY: args.targetY,
      targetX: args.targetX + directionVector[0],
      targetY: args.targetY + directionVector[1]
    }

    parabolicProjectile({
      duration: 500,
      scale: 2,
      peakHeight: 48
    })(burstArgs)
  }
}
