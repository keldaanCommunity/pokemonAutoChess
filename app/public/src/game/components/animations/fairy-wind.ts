import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type {
  AbilityAnimation,
  AbilityAnimationArgs
} from "../../../../../types/Animation"
import { distanceE } from "../../../../../utils/distance"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getBoardBounds, isBoardCellObject } from "./helpers"

const GATHER_DURATION = 180
const MAX_STAGGER = 250
const TRAVEL_DURATION = 520
const ARRIVAL_DURATION = 240
const DURATION =
  GATHER_DURATION + MAX_STAGGER + TRAVEL_DURATION + ARRIVAL_DURATION

type WindPath = {
  x: number
  y: number
  controlX: number
  controlY: number
  normalX: number
  normalY: number
  launch: number
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))

function drawStar(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  color: number,
  alpha: number
) {
  if (alpha <= 0) return
  const point = (px: number, py: number) => new Phaser.Math.Vector2(px, py)
  graphics.fillStyle(color, alpha)
  graphics.fillPoints(
    [
      point(x, y - size),
      point(x + size * 0.3, y - size * 0.3),
      point(x + size, y),
      point(x + size * 0.3, y + size * 0.3),
      point(x, y + size),
      point(x - size * 0.3, y + size * 0.3),
      point(x - size, y),
      point(x - size * 0.3, y - size * 0.3)
    ],
    true
  )
}

export const fairyWindAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay,
  data
}: AbilityAnimationArgs) => {
  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const { left, right, top, bottom } = getBoardBounds(flip, 8)
  const startX = Phaser.Math.Clamp(casterX, left, right)
  const startY = Phaser.Math.Clamp(casterY - 18, top, bottom)
  const paths: WindPath[] = []
  const cells: unknown = data?.allies
  const seen = new Set([positionX + positionY * BOARD_WIDTH])

  if (Array.isArray(cells)) {
    for (const cell of cells.slice(0, BOARD_WIDTH * BOARD_HEIGHT)) {
      if (!isBoardCellObject(cell)) continue
      const key = cell.x + cell.y * BOARD_WIDTH
      if (seen.has(key)) continue
      seen.add(key)

      const [allyX, allyY] = transformEntityCoordinates(cell.x, cell.y, flip)
      const endX = Phaser.Math.Clamp(allyX, left, right)
      const endY = Phaser.Math.Clamp(allyY - 18, top, bottom)
      const dx = endX - startX
      const dy = endY - startY
      const length = Math.hypot(dx, dy) || 1
      const normalX = -dy / length
      const normalY = dx / length
      const distance = distanceE(positionX, positionY, cell.x, cell.y)
      const bend =
        Math.min(122, 55 + distance * 8) * (paths.length % 2 ? -1 : 1)

      paths.push({
        x: endX,
        y: endY,
        controlX: Phaser.Math.Clamp(
          startX + dx * 0.5 + normalX * bend,
          left,
          right
        ),
        controlY: Phaser.Math.Clamp(
          startY + dy * 0.5 + normalY * bend,
          top,
          bottom
        ),
        normalX,
        normalY,
        launch: GATHER_DURATION + Math.min(MAX_STAGGER, distance * 28)
      })
    }
  }

  const mist = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const glints = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  scene.abilitiesVfxGroup?.add(mist)
  scene.abilitiesVfxGroup?.add(glints)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay ?? 0),
    onUpdate: (counter) => {
      if (!mist.active || !glints.active) return
      const time = counter.getValue() ?? 0
      mist.clear()
      glints.clear()

      const gather = clamp(time / 60) * clamp((GATHER_DURATION - time) / 90)
      if (gather > 0) {
        mist.fillStyle(0x73e8dc, gather * 0.2)
        mist.fillEllipse(startX, startY, 86, 48)
        mist.lineStyle(4, 0xa2fff1, gather * 0.6)
        mist.strokeEllipse(startX, startY, 74, 36)
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2 + time * 0.008
          drawStar(
            glints,
            startX + Math.cos(angle) * 38,
            startY + Math.sin(angle) * 20,
            9,
            i % 2 ? 0xf6c8ff : 0xfff4a8,
            gather * 0.8
          )
        }
      }

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i]
        const age = time - path.launch
        if (age <= 0) continue

        const progress = clamp(age / TRAVEL_DURATION)
        const head = Phaser.Math.Easing.Sine.Out(progress)
        const tail = Math.max(0, head - 0.62)
        const fade =
          clamp(age / 55) *
          clamp((TRAVEL_DURATION + ARRIVAL_DURATION - age) / ARRIVAL_DURATION)
        const pointAt = (t: number, offset = 0) => {
          const spread = Math.sin(Math.PI * t) * offset
          return {
            x:
              Phaser.Math.Interpolation.QuadraticBezier(
                t,
                startX,
                path.controlX,
                path.x
              ) +
              path.normalX * spread,
            y:
              Phaser.Math.Interpolation.QuadraticBezier(
                t,
                startY,
                path.controlY,
                path.y
              ) +
              path.normalY * spread
          }
        }
        const drawRibbon = (
          graphics: Phaser.GameObjects.Graphics,
          offset: number,
          width: number,
          color: number,
          alpha: number
        ) => {
          if (fade <= 0 || head <= tail) return
          const taperedLength = (head - tail) * 0.3
          const taperSteps = 8
          for (let step = 0; step < taperSteps; step++) {
            const from = pointAt(
              tail + (taperedLength * step) / taperSteps,
              offset
            )
            const to = pointAt(
              tail + (taperedLength * (step + 1)) / taperSteps,
              offset
            )
            const strength = (step + 0.5) / taperSteps
            graphics.lineStyle(width * strength, color, alpha * fade * strength)
            graphics.beginPath()
            graphics.moveTo(from.x, from.y)
            graphics.lineTo(to.x, to.y)
            graphics.strokePath()
          }

          const steps = 10
          const bodyStart = tail + taperedLength
          const from = pointAt(bodyStart, offset)
          graphics.lineStyle(width, color, alpha * fade)
          graphics.beginPath()
          graphics.moveTo(from.x, from.y)
          for (let step = 1; step <= steps; step++) {
            const t = bodyStart + ((head - bodyStart) * step) / steps
            const point = pointAt(t, offset)
            graphics.lineTo(point.x, point.y)
          }
          graphics.strokePath()
        }

        drawRibbon(mist, -12, 18, 0xffa7e8, 0.28)
        drawRibbon(mist, 0, 24, 0x68e8db, 0.26)
        drawRibbon(mist, 12, 12, 0xd8fff7, 0.34)
        drawRibbon(glints, 0, 5, 0xf1fffb, 0.64)
        drawRibbon(glints, -12, 3, 0xffc7f1, 0.52)

        for (let sparkle = 0; sparkle < 2; sparkle++) {
          const sparkleT = head - sparkle * 0.22
          if (sparkleT <= 0 || sparkleT < tail) continue
          const point = pointAt(sparkleT, sparkle ? -5 : 4)
          drawStar(
            glints,
            point.x,
            point.y,
            sparkle ? 7 : 10,
            (i + sparkle) % 2 ? 0xf5c5ff : 0xfff4a8,
            fade * (sparkle ? 0.7 : 0.95)
          )
        }

        const arrival = age - TRAVEL_DURATION
        const arrivalAlpha =
          clamp(arrival / 35) * clamp((ARRIVAL_DURATION - arrival) / 100)
        if (arrivalAlpha > 0) {
          const pulse = Math.sin(Math.PI * clamp(arrival / ARRIVAL_DURATION))
          mist.fillStyle(0x72ebdd, arrivalAlpha * 0.2)
          mist.fillEllipse(path.x, path.y, 58 + pulse * 24, 30 + pulse * 14)
          mist.fillStyle(0xe4fff9, arrivalAlpha * 0.13)
          mist.fillEllipse(path.x, path.y, 34 + pulse * 14, 18 + pulse * 8)
          for (let sparkle = 0; sparkle < 3; sparkle++) {
            drawStar(
              glints,
              path.x + (sparkle - 1) * 9,
              path.y -
                5 -
                clamp(arrival / ARRIVAL_DURATION) * (12 + sparkle * 3),
              9 + (sparkle % 2) * 3,
              sparkle === 1 ? 0xfff4a8 : 0xc5fff7,
              arrivalAlpha * (sparkle === 1 ? 0.9 : 0.7)
            )
          }
        }
      }
    },
    onComplete: () => {
      mist.destroy()
      glints.destroy()
    }
  })

  mist.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  glints.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
