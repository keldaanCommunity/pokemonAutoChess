import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"
import { getBoardBounds, isBoardCell } from "./helpers"

export const precipiceBladesAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay,
  data
}) => {
  if (!isBoardCell(positionX, positionY)) return

  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const startDelay = Math.max(0, delay ?? 0)
  const glow = scene.add
    .ellipse(x, y, 56, 32, 0xf05a1a, 0.5)
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setScale(0.5)
    .setAlpha(0)
  scene.abilitiesVfxGroup?.add(glow)
  scene.tweens.chain({
    targets: glow,
    tweens: [
      { alpha: 0.8, scale: 1.2, duration: 100, delay: startDelay },
      { alpha: 0, scale: 1.8, duration: 180 }
    ],
    onComplete: () => glow.destroy()
  })

  const bounds = getBoardBounds(flip, 4)
  const ruptureDuration = 600
  const fadeDuration = 165
  const effectDuration = ruptureDuration + 35 + fadeDuration
  const minX = bounds.left - x
  const maxX = bounds.right - x
  const minY = bounds.top - y
  const maxY = bounds.bottom - y
  const point = (px: number, py: number): [number, number] => [
    Math.max(minX, Math.min(maxX, px)),
    Math.max(minY, Math.min(maxY, py))
  ]
  const diagonal = data?.diagonal === true
  const arms: [number, number][] = []
  if (diagonal) {
    for (const [sx, sy] of [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
    ]) {
      let steps = 0
      while (
        positionX + sx * (steps + 1) >= 0 &&
        positionX + sx * (steps + 1) < BOARD_WIDTH &&
        positionY + sy * (steps + 1) >= 0 &&
        positionY + sy * (steps + 1) < BOARD_HEIGHT
      )
        steps++
      if (steps === 0) continue
      const [ex, ey] = transformEntityCoordinates(
        positionX + sx * steps,
        positionY + sy * steps,
        flip
      )
      arms.push([ex - x, ey - y])
    }
  } else {
    arms.push([minX, 0], [maxX, 0], [0, minY], [0, maxY])
  }
  for (const [dx, dy] of arms) {
    const length = Math.hypot(dx, dy)
    if (length === 0) continue
    const nx = -dy / length
    const ny = dx / length
    const segments = Math.ceil(length / 32)
    const noise = (i: number, salt: number) => {
      const value = Math.sin(i * 127.1 + salt * 311.7 + dx + dy) * 43758.5453
      return value - Math.floor(value)
    }
    const centers = Array.from({ length: segments + 1 }, (_, i) => {
      const kink = i === 0 || i === segments ? 0 : (noise(i, 1) - 0.5) * 30
      const progress =
        i === 0 || i === segments
          ? i / segments
          : (i + (noise(i, 2) - 0.5) * 0.5) / segments
      return point(dx * progress + nx * kink, dy * progress + ny * kink)
    })
    for (let i = 0; i < segments; i++) {
      const revealTime =
        segments > 1 ? (i * ruptureDuration) / (segments - 1) : 0
      const cracks = scene.add
        .graphics({ x, y })
        .setDepth(DEPTH.ABILITY_GROUND_LEVEL)
        .setAlpha(0)
      scene.abilitiesVfxGroup?.add(cracks)
      const [ax, ay] = centers[i]
      const [bx, by] = centers[i + 1]
      if (noise(i, 6) > 0.2) {
        const [upperX, upperY] = point(
          ax + (bx - ax) * 0.42 + nx * (5 + noise(i, 7) * 5),
          ay + (by - ay) * 0.42 + ny * (5 + noise(i, 7) * 5)
        )
        const [lowerX, lowerY] = point(
          ax + (bx - ax) * 0.58 - nx * (5 + noise(i, 8) * 5),
          ay + (by - ay) * 0.58 - ny * (5 + noise(i, 8) * 5)
        )
        cracks.fillStyle(0x30201d, 0.95)
        cracks.lineStyle(2, 0x89614a, 0.8)
        cracks.beginPath()
        cracks.moveTo(ax, ay)
        cracks.lineTo(upperX, upperY)
        cracks.lineTo(bx, by)
        cracks.lineTo(lowerX, lowerY)
        cracks.closePath()
        cracks.fillPath()
        cracks.strokePath()
      }
      cracks.lineStyle(5, 0x392724, 0.95)
      cracks.beginPath()
      cracks.moveTo(ax, ay)
      cracks.lineTo(bx, by)
      cracks.strokePath()
      if (noise(i, 5) > 0.22) {
        cracks.lineStyle(2, 0xef8d45, 0.95)
        cracks.beginPath()
        cracks.moveTo(ax + (bx - ax) * 0.12, ay + (by - ay) * 0.12)
        cracks.lineTo(ax + (bx - ax) * 0.76, ay + (by - ay) * 0.76)
        cracks.strokePath()
      }
      if (i % 2 === 0) {
        const side = noise(i, 10) > 0.5 ? 1 : -1
        const baseX = (ax + bx) / 2
        const baseY = (ay + by) / 2
        const distance = 25 + noise(i, 11) * 15
        const [tipX, tipY] = point(
          baseX + nx * side * distance + (dx / length) * 10,
          baseY + ny * side * distance + (dy / length) * 10
        )
        const [midX, midY] = point(
          (baseX + tipX) / 2 - (dx / length) * 5,
          (baseY + tipY) / 2 - (dy / length) * 5
        )
        cracks.lineStyle(2, 0x50342b, 0.95)
        cracks.beginPath()
        cracks.moveTo(baseX, baseY)
        cracks.lineTo(midX, midY)
        cracks.lineTo(tipX, tipY)
        cracks.strokePath()
      }
      scene.tweens.chain({
        targets: cracks,
        tweens: [
          { alpha: 1, duration: 35, delay: startDelay + revealTime },
          {
            alpha: 0,
            duration: fadeDuration,
            delay: Math.max(0, ruptureDuration - revealTime)
          }
        ],
        onComplete: () => cracks.destroy()
      })

      if (
        i % 2 === 1 &&
        ax > minX + 30 &&
        ax < maxX - 30 &&
        ay > minY + 36 &&
        ay < maxY - 24
      ) {
        const dustOffset = noise(i, 9) * 45
        const dustSide = (noise(i, 12) - 0.5) * 16
        const dustX = x + ax + nx * dustSide
        const dustY = y + ay + ny * dustSide
        const dustFade = Math.min(
          300,
          effectDuration - revealTime - dustOffset - 90
        )
        const dust = scene.add
          .container(dustX, dustY)
          .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
          .setScale(0.5)
          .setAlpha(0)
        dust.add([
          scene.add.ellipse(-7, 0, 20, 12, 0xb69b7c, 0.6),
          scene.add.ellipse(4, -4, 23, 16, 0xcbb394, 0.6),
          scene.add.ellipse(11, 1, 17, 11, 0x9d8169, 0.6)
        ])
        scene.abilitiesVfxGroup?.add(dust)
        scene.tweens.chain({
          targets: dust,
          tweens: [
            {
              alpha: 0.8,
              scale: 1,
              duration: 90,
              delay: startDelay + revealTime + dustOffset
            },
            { alpha: 0, scale: 1.5, y: dustY - 14, duration: dustFade }
          ],
          onComplete: () => dust.destroy()
        })

        const ember = scene.add
          .ellipse(x + ax, y + ay, 4, 7, 0xffb04c, 0.9)
          .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
          .setAlpha(0)
        scene.abilitiesVfxGroup?.add(ember)
        scene.tweens.chain({
          targets: ember,
          tweens: [
            { alpha: 0.9, duration: 60, delay: startDelay + revealTime },
            {
              alpha: 0,
              y: y + ay - 25,
              duration: Math.min(260, effectDuration - revealTime - 60)
            }
          ],
          onComplete: () => ember.destroy()
        })
      }
    }
  }
  const targets: unknown = data?.targets
  if (!Array.isArray(targets)) return
  for (const target of targets) {
    if (
      !target ||
      typeof target !== "object" ||
      !isBoardCell(target.x, target.y) ||
      (target.x === positionX && target.y === positionY) ||
      (diagonal
        ? Math.abs(target.x - positionX) !== Math.abs(target.y - positionY)
        : target.x !== positionX && target.y !== positionY)
    )
      continue

    const [targetX, targetY] = transformEntityCoordinates(
      target.x,
      target.y,
      flip
    )
    const blades = scene.add
      .graphics({ x: targetX, y: targetY + 10 })
      .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      .setScale(1, 0.01)
      .setAlpha(0)
    blades.fillStyle(0x5c2b21, 0.5)
    blades.fillEllipse(0, 0, 76, 25)
    const facet = (color: number, points: [number, number][]) => {
      blades.fillStyle(color, 1)
      blades.beginPath()
      points.forEach(([px, py], index) => {
        if (index === 0) blades.moveTo(px, py)
        else blades.lineTo(px, py)
      })
      blades.closePath()
      blades.fillPath()
    }
    facet(0x352321, [
      [-39, 1],
      [-36, -18],
      [-39, -25],
      [-34, -42],
      [-27, -50],
      [-23, -35],
      [-16, -29],
      [-10, -5],
      [-8, 2]
    ])
    facet(0x6a3b2e, [
      [-36, -18],
      [-34, -42],
      [-27, -50],
      [-29, -23],
      [-20, -9],
      [-22, 1],
      [-39, 1]
    ])
    facet(0x95543a, [
      [-34, -42],
      [-27, -50],
      [-29, -23],
      [-36, -18]
    ])
    facet(0x352321, [
      [3, 3],
      [8, -20],
      [14, -27],
      [17, -45],
      [31, -65],
      [34, -46],
      [39, -38],
      [37, -23],
      [42, -11],
      [39, 2]
    ])
    facet(0x70402f, [
      [8, -20],
      [17, -45],
      [31, -65],
      [28, -35],
      [22, -12],
      [24, 2],
      [3, 3]
    ])
    facet(0xa55d3b, [
      [17, -45],
      [31, -65],
      [28, -35],
      [20, -27]
    ])
    facet(0x2d201e, [
      [-20, 2],
      [-23, -13],
      [-18, -30],
      [-19, -40],
      [-11, -57],
      [-9, -71],
      [4, -91],
      [8, -72],
      [15, -61],
      [13, -48],
      [21, -32],
      [18, -17],
      [23, 1],
      [6, 5]
    ])
    facet(0x754133, [
      [-23, -13],
      [-18, -30],
      [-19, -40],
      [-11, -57],
      [-9, -71],
      [4, -91],
      [-1, -60],
      [-8, -39],
      [-6, -19],
      [6, 5],
      [-20, 2]
    ])
    facet(0xb46a44, [
      [-11, -57],
      [-9, -71],
      [4, -91],
      [-1, -60],
      [-8, -39],
      [-16, -33]
    ])
    facet(0x50302a, [
      [-1, -60],
      [4, -91],
      [8, -72],
      [15, -61],
      [13, -48],
      [21, -32],
      [18, -17],
      [23, 1],
      [6, 5],
      [-6, -19],
      [-8, -39]
    ])
    blades.lineStyle(2, 0xff9a32, 0.9)
    blades.beginPath()
    blades.moveTo(-12, -3)
    blades.lineTo(-8, -15)
    blades.lineTo(-11, -21)
    blades.lineTo(-5, -32)
    blades.lineTo(-6, -40)
    blades.moveTo(1, -48)
    blades.lineTo(4, -56)
    blades.lineTo(1, -62)
    blades.moveTo(23, -3)
    blades.lineTo(27, -15)
    blades.lineTo(24, -20)
    blades.lineTo(28, -30)
    blades.moveTo(-29, -5)
    blades.lineTo(-26, -14)
    blades.lineTo(-29, -19)
    blades.strokePath()
    scene.abilitiesVfxGroup?.add(blades)
    scene.tweens.chain({
      targets: blades,
      tweens: [
        {
          alpha: 1,
          scaleY: 1,
          duration: 120,
          delay: startDelay + 130,
          ease: "Cubic.Out"
        },
        { alpha: 0, scaleY: 0.65, duration: 300, delay: 100 }
      ],
      onComplete: () => blades.destroy()
    })
  }
}
