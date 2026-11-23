import Phaser, { type GameObjects } from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const SPIN_DURATION = 650
const FIRST_STRIKE_START = 150
const STRIKE_STAGGER = 260
const STRIKE_TRAVEL = 170
const IMPACT_DURATION = 180
const DUST_DURATION = 390
const SPIN_SCALE = 0.8
const STRIKE_STARTS = [FIRST_STRIKE_START, FIRST_STRIKE_START + STRIKE_STAGGER]
const DURATION = STRIKE_STARTS[1] + STRIKE_TRAVEL + DUST_DURATION + 40
const clamp = (value: number) => Phaser.Math.Clamp(value, 0, 1)

type DustPuff = {
  graphics: GameObjects.Graphics
  x: number
  y: number
  driftX: number
  driftY: number
  size: number
  delay: number
  duration: number
  rotation: number
  spin: number
}

function createDustPuff(scene: Phaser.Scene, parent: GameObjects.Container) {
  const graphics = scene.add.graphics().setVisible(false)
  parent.add(graphics)
  const phase = Math.random() * Math.PI * 2
  const outline = Array.from({ length: 32 }, (_, vertex) => {
    const angle = (vertex / 32) * Math.PI * 2
    const radius =
      0.85 +
      Math.sin(angle * 5 + phase) * 0.13 +
      Math.cos(angle * 3 - phase) * 0.1
    return new Phaser.Math.Vector2(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.74
    )
  })

  graphics.fillStyle(0x9c8354, 0.86)
  graphics.fillPoints(outline, true)
  graphics.fillStyle(0xd9c38b, 1)
  graphics.fillPoints(
    outline.map(
      (point) => new Phaser.Math.Vector2(point.x * 0.92, point.y * 0.9 - 0.1)
    ),
    true
  )
  graphics.fillStyle(0xf6e6b5, 0.8)
  graphics.fillPoints(
    outline.map(
      (point) =>
        new Phaser.Math.Vector2(point.x * 0.64 - 0.14, point.y * 0.5 - 0.25)
    ),
    true
  )
  graphics.fillStyle(0xb69b66, 0.55)
  graphics.fillPoints(
    outline.map(
      (point) =>
        new Phaser.Math.Vector2(point.x * 0.42 + 0.31, point.y * 0.38 + 0.13)
    ),
    true
  )
  return graphics
}

function drawDust(puffs: DustPuff[], elapsed: number) {
  for (const puff of puffs) {
    const age = elapsed - puff.delay
    if (age < 0 || age >= puff.duration) {
      puff.graphics.setVisible(false)
      continue
    }

    const progress = age / puff.duration
    const growth = 0.42 + progress * 0.65
    puff.graphics
      .setVisible(true)
      .setPosition(
        puff.x + puff.driftX * progress,
        puff.y + puff.driftY * progress - progress * progress * 9
      )
      .setRotation(puff.rotation + puff.spin * progress)
      .setScale(puff.size * growth)
      .setAlpha(clamp(age / 32) * clamp((puff.duration - age) / 160) * 0.8)
  }
}

function createIronFist(scene: Phaser.Scene, parent: GameObjects.Container) {
  const graphics = scene.add.graphics().setVisible(false)
  parent.add(graphics)
  const rim = Array.from({ length: 6 }, (_, index) => {
    const angle = Math.PI / 6 + (index * Math.PI) / 3
    return new Phaser.Math.Vector2(Math.cos(angle) * 19, Math.sin(angle) * 23)
  })
  const rear = rim.map((point) => new Phaser.Math.Vector2(point.x - 9, point.y))

  graphics.fillStyle(0x5d5c5d, 1)
  graphics.fillRect(-34, -6, 21, 12)
  graphics.fillStyle(0xbebebe, 1)
  graphics.fillRect(-34, -5, 21, 6)
  graphics.fillStyle(0xeaeaea, 1)
  graphics.fillRect(-32, -4, 18, 2)
  graphics.fillStyle(0x1c1c1c, 1)
  graphics.fillPoints(rear, true)
  for (let index = 0; index < rim.length; index++) {
    const next = (index + 1) % rim.length
    graphics.fillStyle([0x2d2c2c, 0x1c1c1c, 0x3c383d][index % 3], 1)
    graphics.fillPoints([rear[index], rear[next], rim[next], rim[index]], true)
  }
  graphics.fillStyle(0x3c383d, 1)
  graphics.fillPoints(rim, true)
  graphics.lineStyle(1.5, 0x838383, 1)
  graphics.beginPath()
  graphics.moveTo(rim[3].x, rim[3].y)
  graphics.lineTo(rim[4].x, rim[4].y)
  graphics.lineTo(rim[5].x, rim[5].y)
  graphics.strokePath()
  graphics.fillStyle(0x1c1c1c, 1)
  graphics.fillEllipse(3, 0, 25, 33)
  graphics.fillStyle(0x838383, 1)
  graphics.fillEllipse(6, 0, 24, 30)
  graphics.fillStyle(0xbebebe, 1)
  graphics.fillEllipse(8, -2, 20, 25)
  graphics.fillStyle(0xeaeaea, 1)
  graphics.fillEllipse(9, -6, 13, 11)
  graphics.lineStyle(1.5, 0x5d5c5d, 0.9)
  graphics.lineBetween(1, 8, 15, 8)
  return graphics
}

function isBoardCell(x: number, y: number) {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    x < BOARD_WIDTH &&
    y >= 0 &&
    y < BOARD_HEIGHT
  )
}

function drawEllipseArc(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  startAngle: number,
  endAngle: number,
  color: number,
  alpha: number,
  width: number
) {
  graphics.lineStyle(width, color, alpha)
  graphics.beginPath()
  for (let step = 0; step <= 20; step++) {
    const angle = startAngle + ((endAngle - startAngle) * step) / 20
    const pointX = x + Math.cos(angle) * radiusX
    const pointY = y + Math.sin(angle) * radiusY
    if (step === 0) graphics.moveTo(pointX, pointY)
    else graphics.lineTo(pointX, pointY)
  }
  graphics.strokePath()
}

function drawSpin(
  ground: GameObjects.Graphics,
  behind: GameObjects.Graphics,
  front: GameObjects.Graphics,
  casterX: number,
  casterY: number,
  elapsed: number
) {
  if (elapsed < 0 || elapsed >= SPIN_DURATION) return

  const progress = elapsed / SPIN_DURATION
  const alpha = clamp(elapsed / 24) * (1 - progress) ** 0.75
  const centerY = casterY - 24
  const rotation = elapsed * 0.019
  const radiusX = (112 + Math.sin(progress * Math.PI) * 10) * SPIN_SCALE
  const radiusY = (48 + Math.sin(progress * Math.PI) * 5) * SPIN_SCALE

  ground.fillStyle(0xc9a960, alpha * 0.14)
  ground.fillEllipse(casterX, casterY + 7, radiusX * 1.85, radiusY * 1.4)
  drawEllipseArc(
    ground,
    casterX,
    casterY + 7,
    radiusX * 0.92,
    radiusY * 0.68,
    Math.PI * 0.1 + rotation,
    Math.PI * 1.55 + rotation,
    0xe7d5a5,
    alpha * 0.8,
    6
  )

  const drawBand = (
    graphics: GameObjects.Graphics,
    radius: number,
    height: number,
    start: number,
    opacity: number
  ) => {
    drawEllipseArc(
      graphics,
      casterX,
      centerY,
      radius,
      height,
      start,
      start + Math.PI * 1.18,
      0x30363c,
      opacity * 0.85,
      18
    )
    drawEllipseArc(
      graphics,
      casterX,
      centerY,
      radius,
      height,
      start,
      start + Math.PI * 1.18,
      0xc5cbd0,
      opacity * 0.92,
      12
    )
    drawEllipseArc(
      graphics,
      casterX,
      centerY,
      radius,
      height,
      start,
      start + Math.PI * 1.18,
      0xffffff,
      opacity,
      3
    )
  }

  behind.fillStyle(0xb9c2ca, alpha * 0.18)
  behind.fillEllipse(casterX, centerY + 2, radiusX * 2, radiusY * 2)
  drawBand(behind, radiusX, radiusY, rotation + Math.PI * 0.15, alpha * 0.8)
  drawBand(front, radiusX, radiusY, rotation + Math.PI * 1.1, alpha * 0.96)
  drawBand(
    front,
    radiusX * 0.78,
    radiusY * 0.82,
    -rotation * 0.75 + Math.PI * 0.2,
    alpha * 0.58
  )
  drawEllipseArc(
    front,
    casterX,
    centerY,
    radiusX * 0.76,
    radiusY * 0.78,
    rotation + Math.PI * 1.18,
    rotation + Math.PI * 1.76,
    0xc49b42,
    alpha * 0.95,
    4
  )

  for (let spark = 0; spark < 4; spark++) {
    const angle = rotation + spark * Math.PI * 0.57
    const x = casterX + Math.cos(angle) * radiusX * 0.82
    const y = centerY + Math.sin(angle) * radiusY * 0.85
    const length = spark % 2 === 0 ? 13 : 8
    front.lineStyle(2, spark % 2 === 0 ? 0xffedb5 : 0xffffff, alpha * 0.8)
    front.lineBetween(
      x,
      y,
      x + Math.cos(angle) * length,
      y + Math.sin(angle) * length
    )
  }
}

function quadraticPoint(
  startX: number,
  startY: number,
  controlX: number,
  controlY: number,
  endX: number,
  endY: number,
  progress: number
) {
  const inverse = 1 - progress
  return {
    x:
      inverse * inverse * startX +
      2 * inverse * progress * controlX +
      progress * progress * endX,
    y:
      inverse * inverse * startY +
      2 * inverse * progress * controlY +
      progress * progress * endY
  }
}

function drawRibbon(
  graphics: GameObjects.Graphics,
  startX: number,
  startY: number,
  controlX: number,
  controlY: number,
  endX: number,
  endY: number,
  progress: number,
  width: number,
  color: number,
  alpha: number
) {
  if (progress <= 0) return

  const tail = Math.max(0, progress - 0.48)
  const points: Phaser.Math.Vector2[] = []
  for (const side of [1, -1]) {
    for (let step = 0; step <= 10; step++) {
      const localProgress = step / 10
      const t =
        side === 1
          ? tail + (progress - tail) * localProgress
          : progress - (progress - tail) * localProgress
      const point = quadraticPoint(
        startX,
        startY,
        controlX,
        controlY,
        endX,
        endY,
        t
      )
      const tangentX =
        2 * (1 - t) * (controlX - startX) + 2 * t * (endX - controlX)
      const tangentY =
        2 * (1 - t) * (controlY - startY) + 2 * t * (endY - controlY)
      const tangentLength = Math.hypot(tangentX, tangentY) || 1
      const taper = Math.sin(Math.PI * localProgress) ** 0.7
      const offset = (side === 1 ? 1 : -1) * width * taper
      points.push(
        new Phaser.Math.Vector2(
          point.x - (tangentY / tangentLength) * offset,
          point.y + (tangentX / tangentLength) * offset
        )
      )
    }
  }

  graphics.fillStyle(color, alpha)
  graphics.fillPoints(points, true)
}

function drawStrike(
  graphics: GameObjects.Graphics,
  fist: GameObjects.Graphics,
  casterX: number,
  casterY: number,
  hitX: number,
  hitY: number,
  directionX: number,
  directionY: number,
  index: number,
  elapsed: number
) {
  fist.setVisible(false)
  if (elapsed < 0 || elapsed >= STRIKE_TRAVEL) return

  const progress = Phaser.Math.Easing.Cubic.Out(elapsed / STRIKE_TRAVEL)
  const side = index === 0 ? -1 : 1
  const normalX = -directionY
  const normalY = directionX
  const startX = casterX + directionX * 15 + normalX * side * 13
  const startY = casterY - 14 + directionY * 15 + normalY * side * 13
  const endX = hitX
  const endY = hitY
  const controlX = (startX + endX) / 2 + normalX * side * 27
  const controlY = (startY + endY) / 2 + normalY * side * 27
  const alpha = clamp(elapsed / 22)

  drawRibbon(
    graphics,
    startX,
    startY,
    controlX,
    controlY,
    endX,
    endY,
    progress,
    9,
    0x343b43,
    alpha * 0.38
  )
  drawRibbon(
    graphics,
    startX,
    startY,
    controlX,
    controlY,
    endX,
    endY,
    progress,
    5,
    0xcbd3da,
    alpha * 0.6
  )
  drawRibbon(
    graphics,
    startX,
    startY,
    controlX,
    controlY,
    endX,
    endY,
    progress,
    1.5,
    0xffffff,
    alpha * 0.78
  )

  const tip = quadraticPoint(
    startX,
    startY,
    controlX,
    controlY,
    endX,
    endY,
    progress
  )
  const tangentX =
    2 * (1 - progress) * (controlX - startX) + 2 * progress * (endX - controlX)
  const tangentY =
    2 * (1 - progress) * (controlY - startY) + 2 * progress * (endY - controlY)
  const length = Math.hypot(tangentX, tangentY) || 1
  fist
    .setVisible(true)
    .setPosition(
      tip.x - (tangentX / length) * 19,
      tip.y - (tangentY / length) * 19
    )
    .setRotation(Math.atan2(tangentY, tangentX))
    .setScale(1, 0.92 + Math.sin(elapsed * 0.055 + index) * 0.1)
    .setAlpha(alpha)
}

function drawImpact(
  graphics: GameObjects.Graphics,
  x: number,
  y: number,
  elapsed: number,
  directionX: number,
  directionY: number,
  index: number
) {
  if (elapsed < 0 || elapsed >= IMPACT_DURATION) return

  const progress = elapsed / IMPACT_DURATION
  const alpha = (1 - progress) ** 1.2
  const flash = clamp((120 - elapsed) / 95) * alpha
  const offset = index === 0 ? 0.18 : -0.12

  graphics.fillStyle(0x9ca5ae, alpha * 0.3)
  graphics.fillEllipse(x, y, 42 + progress * 24, 30 + progress * 18)
  graphics.lineStyle(3.5, 0xf1f4f6, alpha * 0.96)
  graphics.strokeEllipse(x, y, 32 + progress * 30, 22 + progress * 24)
  graphics.fillStyle(0xffe6a3, flash * 0.92)
  graphics.fillCircle(x, y, 8 + flash * 6)
  graphics.fillStyle(0xffffff, flash)
  graphics.fillCircle(x, y, 4.5 + flash * 3.5)

  const aimAngle = Math.atan2(directionY, directionX)
  const rayOffsets = [-2.7, -2.05, -1.55, -0.95, -0.3, 0.3, 1.05]
  for (let ray = 0; ray < rayOffsets.length; ray++) {
    const angle = aimAngle + (rayOffsets[ray] ?? 0) + offset
    const inner = 5 + progress * 4
    const outer = 38 + progress * (ray % 2 === 0 ? 18 : 10)
    const width = ray % 2 === 0 ? 4 : 3
    graphics.fillStyle(ray % 3 === 0 ? 0xffffff : 0xf2c75c, flash * 0.9)
    graphics.fillTriangle(
      x + Math.cos(angle) * inner - Math.sin(angle) * width,
      y + Math.sin(angle) * inner + Math.cos(angle) * width,
      x + Math.cos(angle) * outer,
      y + Math.sin(angle) * outer,
      x + Math.cos(angle) * inner + Math.sin(angle) * width,
      y + Math.sin(angle) * inner - Math.cos(angle) * width
    )
  }

  for (let spark = 0; spark < 6; spark++) {
    const angle =
      offset + (spark * Math.PI * 2) / 6 + (index === 0 ? 0.2 : 0.55)
    const distance = 9 + progress * (spark % 2 === 0 ? 20 : 14)
    const sparkX = x + Math.cos(angle) * distance
    const sparkY = y + Math.sin(angle) * distance
    const size = (spark % 2 === 0 ? 5 : 3.4) * alpha
    graphics.fillStyle(spark % 3 === 0 ? 0xffffff : 0xf2c75c, alpha)
    graphics.fillTriangle(
      sparkX,
      sparkY - size,
      sparkX + size * 0.48,
      sparkY,
      sparkX - size * 0.48,
      sparkY
    )
    graphics.fillTriangle(
      sparkX,
      sparkY + size,
      sparkX + size * 0.48,
      sparkY,
      sparkX - size * 0.48,
      sparkY
    )
  }
}

export const doubleIronBashAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  targetX,
  targetY,
  flip,
  delay = 0
}) => {
  if (
    !isBoardCell(positionX, positionY) ||
    !isBoardCell(targetX, targetY) ||
    (positionX === targetX && positionY === targetY)
  ) {
    return
  }

  const [casterX, casterY] = transformEntityCoordinates(
    positionX,
    positionY,
    flip
  )
  const [targetScreenX, targetScreenY] = transformEntityCoordinates(
    targetX,
    targetY,
    flip
  )
  const dx = targetScreenX - casterX
  const dy = targetScreenY - casterY
  const distance = Math.hypot(dx, dy)
  if (distance === 0) return

  const directionX = dx / distance
  const directionY = dy / distance
  const hitX = targetScreenX - directionX * 4
  const hitY = targetScreenY - directionY * 4
  const ground = scene.add.graphics().setDepth(DEPTH.ABILITY_GROUND_LEVEL)
  const behind = scene.add.graphics().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const dustBack = scene.add.container().setDepth(DEPTH.ABILITY_BELOW_POKEMON)
  const dustFront = scene.add.container().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const front = scene.add.graphics().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const fists = scene.add.container().setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const visuals = [ground, behind, dustBack, dustFront, fists, front]
  visuals.forEach((visual) => scene.abilitiesVfxGroup?.add(visual))
  const projectiles = STRIKE_STARTS.map(() => createIronFist(scene, fists))
  const casterDust: DustPuff[] = Array.from({ length: 16 }, (_, index) => {
    const angle = index * 2.4 + (Math.random() - 0.5) * 0.6
    const radius = 52 + Math.random() * 14
    return {
      graphics: createDustPuff(
        scene,
        Math.sin(angle) < 0 ? dustBack : dustFront
      ),
      x: casterX + Math.cos(angle) * radius,
      y: casterY + 9 + Math.sin(angle) * radius * 0.36,
      driftX: Math.cos(angle + 0.6) * (16 + Math.random() * 11),
      driftY: Math.sin(angle + 0.6) * (9 + Math.random() * 7),
      size: 23 + Math.random() * 10,
      delay: 35 + index * 22 + Math.random() * 15,
      duration: 300 + Math.random() * 65,
      rotation: (Math.random() - 0.5) * 0.6,
      spin: (Math.random() - 0.5) * 0.5
    }
  })
  const impactDust = STRIKE_STARTS.flatMap((start) =>
    Array.from({ length: 9 }, (_, index): DustPuff => {
      const angle = index * 2.4 + (Math.random() - 0.5) * 0.7
      const radialX = Math.cos(angle)
      const radialY = Math.sin(angle)
      return {
        graphics: createDustPuff(scene, radialY < 0 ? dustBack : dustFront),
        x: hitX + radialX * (5 + Math.random() * 7),
        y: hitY + radialY * 7 + 7,
        driftX: radialX * (20 + Math.random() * 17) + directionX * 10,
        driftY: radialY * (13 + Math.random() * 11) + directionY * 5,
        size: 18 + Math.random() * 10,
        delay: start + STRIKE_TRAVEL + Math.random() * 35,
        duration: DUST_DURATION,
        rotation: (Math.random() - 0.5) * 0.6,
        spin: (Math.random() - 0.5) * 0.6
      }
    })
  )
  const puffs = [...casterDust, ...impactDust]

  const timeline = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay),
    onUpdate: (counter) => {
      if (visuals.some((visual) => !visual.active)) return

      const elapsed = counter.getValue() ?? 0
      ground.clear()
      behind.clear()
      front.clear()
      drawSpin(ground, behind, front, casterX, casterY, elapsed)
      drawDust(puffs, elapsed)

      STRIKE_STARTS.forEach((start, index) => {
        const strikeElapsed = elapsed - start
        drawStrike(
          front,
          projectiles[index],
          casterX,
          casterY,
          hitX,
          hitY,
          directionX,
          directionY,
          index,
          strikeElapsed
        )
        drawImpact(
          front,
          hitX,
          hitY,
          strikeElapsed - STRIKE_TRAVEL,
          directionX,
          directionY,
          index
        )
      })
    },
    onComplete: () => {
      visuals.forEach((visual) => visual.destroy())
    }
  })

  visuals.forEach((visual) =>
    visual.once(Phaser.GameObjects.Events.DESTROY, () => timeline.stop())
  )
}
