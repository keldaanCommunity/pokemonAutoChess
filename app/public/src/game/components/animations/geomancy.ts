import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

export const GEOMANCY_DURATION = 2100
const COLORS = [
  0xff6a86, 0xffb74e, 0xf3ed63, 0x7adf70, 0x59dce1, 0x657cff, 0xd178ec
]
const PILLARS = [
  { x: -67, y: 6, height: 145, width: 15, front: false },
  { x: -39, y: -15, height: 122, width: 9, front: false },
  { x: 43, y: -16, height: 135, width: 10, front: false },
  { x: 69, y: 7, height: 155, width: 16, front: false },
  { x: -44, y: 23, height: 105, width: 7, front: true },
  { x: 46, y: 23, height: 110, width: 7, front: true }
]
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

function drawPillarLayer(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number,
  alpha: number,
  canvas: boolean
) {
  const fadeHeight = height / 2
  const top = y - height
  if (canvas) {
    const segments = 32
    for (let segment = 0; segment < segments; segment++) {
      graphics.fillStyle(color, alpha * ((segment + 0.5) / segments))
      graphics.fillRect(
        x - width / 2,
        top + (segment * fadeHeight) / segments,
        width,
        fadeHeight / segments
      )
    }
  } else {
    graphics.fillGradientStyle(color, color, color, color, 0, 0, alpha, alpha)
    graphics.fillRect(x - width / 2, top, width, fadeHeight)
  }
  graphics.fillStyle(color, alpha)
  graphics.fillRect(x - width / 2, top + fadeHeight, width, height - fadeHeight)
}

function drawLeaf(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  angle: number,
  size: number,
  color: number,
  alpha: number
) {
  const dx = Math.cos(angle) * size
  const dy = Math.sin(angle) * size
  const nx = -dy * 0.38
  const ny = dx * 0.38
  graphics.fillStyle(color, alpha)
  graphics.fillTriangle(x - dx, y - dy, x + nx, y + ny, x + dx, y + dy)
  graphics.fillTriangle(x - dx, y - dy, x - nx, y - ny, x + dx, y + dy)
  graphics.lineStyle(1, 0xffffff, alpha * 0.35)
  graphics.lineBetween(
    x - dx * 0.65,
    y - dy * 0.65,
    x + dx * 0.65,
    y + dy * 0.65
  )
}

function drawRing(
  graphics: GameObjects.Graphics,
  radiusX: number,
  radiusY: number,
  y: number,
  front: boolean,
  color: number,
  alpha: number,
  width: number
) {
  graphics.lineStyle(width, color, alpha)
  graphics.beginPath()
  for (let step = 0; step <= 24; step++) {
    const angle = (front ? 0 : Math.PI) + (step / 24) * Math.PI
    const x = Math.cos(angle) * radiusX
    const pointY = y + Math.sin(angle) * radiusY
    if (step === 0) graphics.moveTo(x, pointY)
    else graphics.lineTo(x, pointY)
  }
  graphics.strokePath()
}

export const geomancyAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay
}) => {
  if (
    !Number.isInteger(positionX) ||
    !Number.isInteger(positionY) ||
    positionX < 0 ||
    positionX >= BOARD_WIDTH ||
    positionY < 0 ||
    positionY >= BOARD_HEIGHT
  )
    return

  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const back = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const front = scene.add.graphics({ x, y }).setDepth(DEPTH.BOOST_FRONT)
  const visuals = [back, front]
  visuals.forEach((visual) => scene.abilitiesVfxGroup?.add(visual))

  const tween = scene.tweens.addCounter({
    from: 0,
    to: GEOMANCY_DURATION,
    duration: GEOMANCY_DURATION,
    delay: Math.max(0, delay ?? 0),
    onUpdate: (counter) => {
      if (!back.active || !front.active) return
      const time = counter.getValue() ?? 0
      back.clear()
      front.clear()

      const pillarAlpha = clamp(time / 180) * clamp((1050 - time) / 480)
      for (const pillar of PILLARS) {
        if (pillarAlpha === 0) break
        const graphics = pillar.front ? front : back
        const canvas = scene.renderer.type === Phaser.CANVAS
        drawPillarLayer(
          graphics,
          pillar.x,
          pillar.y,
          pillar.width * 2,
          pillar.height,
          0xd9f8ff,
          pillarAlpha * 0.13,
          canvas
        )
        drawPillarLayer(
          graphics,
          pillar.x,
          pillar.y,
          pillar.width * 0.6,
          pillar.height,
          0xffffff,
          pillarAlpha * 0.68,
          canvas
        )
        graphics.fillStyle(0xfff7df, pillarAlpha * 0.35)
        graphics.fillEllipse(pillar.x, pillar.y, pillar.width * 2.4, 8)
        graphics.lineStyle(1.5, 0xffb9c9, pillarAlpha * 0.65)
        graphics.strokeEllipse(pillar.x, pillar.y, pillar.width * 3.2, 12)
      }

      const ringAlpha =
        clamp((time - 390) / 350) * clamp((GEOMANCY_DURATION - time) / 450)
      for (let ring = 0; ring < 4; ring++) {
        const radiusX = 67 - ring * 7 + Math.sin(time * 0.004 + ring) * 2
        const radiusY = 20 - ring * 2
        const ringY = 4 - ring * 8
        const color = ring % 2 === 0 ? 0xffbd83 : 0xffa4c4
        const width = 2.4 - ring * 0.25
        drawRing(
          back,
          radiusX,
          radiusY,
          ringY,
          false,
          color,
          ringAlpha * 0.65,
          width
        )
        drawRing(
          front,
          radiusX,
          radiusY,
          ringY,
          true,
          color,
          ringAlpha * 0.8,
          width
        )
      }

      const leafAlpha =
        clamp(time / 240) * clamp((GEOMANCY_DURATION - time) / 400)
      for (let leaf = 0; leaf < 30; leaf++) {
        const offset = leaf < 24 ? leaf : (leaf - 24) * 4 + 1.5
        const angle = (offset / 24) * Math.PI * 2 + time * 0.0025
        const radius = 48 + (leaf % 4) * 9
        const leafX = Math.cos(angle) * radius
        const leafY =
          -22 - ((leaf * 37 + time * 0.035) % 98) + Math.sin(angle) * 12
        const isFront = Math.sin(angle) > 0
        drawLeaf(
          isFront ? front : back,
          leafX,
          leafY,
          angle + leaf * 0.7 + time * 0.002,
          4 + (leaf % 3),
          COLORS[leaf % COLORS.length],
          leafAlpha * (isFront ? 0.9 : 0.75)
        )
      }
    },
    onComplete: () => visuals.forEach((visual) => visual.destroy())
  })

  visuals.forEach((visual) =>
    visual.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  )
}
