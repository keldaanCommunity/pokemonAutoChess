import Phaser, { type GameObjects } from "phaser"
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH
} from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const DURATION = 680
const SHELL_HOLD = 240
const BURST_DURATION = DURATION - SHELL_HOLD
const SHELL_SHADOW = 0x674f9f
const SHELL_MIDTONE = 0xa77fcf
const SHELL_HIGHLIGHT = 0xcfa7f7
const SHELL_OUTLINE = 0x000000
const HALO_GOLD = 0xe7c56e
const CLAMP = Phaser.Math.Clamp

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

function drawShellSurface(graphics: GameObjects.Graphics) {
  const width = CELL_WIDTH * 0.94
  const height = CELL_HEIGHT * 0.78

  graphics.fillStyle(SHELL_SHADOW, 0.98)
  graphics.fillEllipse(0, -12, width, height)
  graphics.fillStyle(SHELL_MIDTONE, 0.96)
  graphics.fillEllipse(0, -17, width * 0.82, height * 0.7)
  graphics.fillStyle(SHELL_MIDTONE, 0.9)
  graphics.fillEllipse(0, 3, width * 0.94, height * 0.42)

  graphics.lineStyle(2.5, SHELL_OUTLINE, 0.95)
  graphics.strokeEllipse(0, -12, width, height)

  graphics.lineStyle(1.5, SHELL_HIGHLIGHT, 0.85)
  graphics.beginPath()
  graphics.moveTo(-width * 0.34, -22)
  graphics.lineTo(-width * 0.18, -33)
  graphics.lineTo(0, -36)
  graphics.lineTo(width * 0.2, -31)
  graphics.strokePath()
}

function drawShellSeam(graphics: GameObjects.Graphics) {
  const width = CELL_WIDTH * 0.94
  graphics.lineStyle(2.5, SHELL_OUTLINE, 0.92)
  graphics.beginPath()
  for (let step = 0; step <= 24; step++) {
    const progress = step / 24
    const x = (progress - 0.5) * width * 0.91
    const y = 2 + Math.sin(progress * Math.PI * 6) * 3.2
    if (step === 0) graphics.moveTo(x, y)
    else graphics.lineTo(x, y)
  }
  graphics.strokePath()
}

function drawBurst(graphics: GameObjects.Graphics, elapsed: number) {
  graphics.clear()
  const progress = CLAMP(elapsed / BURST_DURATION, 0, 1)
  const fade = (1 - progress) ** 1.3
  const flash = CLAMP(1 - elapsed / 135, 0, 1)
  const radiusX = CELL_WIDTH * (0.28 + progress * 1.12)
  const radiusY = CELL_HEIGHT * (0.28 + progress * 1.12)

  graphics.fillStyle(SHELL_MIDTONE, flash * 0.72)
  graphics.fillEllipse(
    0,
    -12,
    CELL_WIDTH * (0.95 + flash * 0.55),
    CELL_HEIGHT * (0.86 + flash * 0.5)
  )
  graphics.fillStyle(SHELL_HIGHLIGHT, flash * 0.95)
  graphics.fillCircle(0, -12, CELL_WIDTH * (0.13 + flash * 0.1))

  graphics.lineStyle(7, HALO_GOLD, fade * 0.18)
  graphics.strokeEllipse(0, -12, radiusX * 2, radiusY * 2)
  graphics.lineStyle(3, HALO_GOLD, fade * 0.7)
  graphics.strokeEllipse(0, -12, radiusX * 2, radiusY * 2)

  for (let index = 0; index < 12; index++) {
    const angle = (index / 12) * Math.PI * 2 + 0.12
    const directionX = Math.cos(angle)
    const directionY = Math.sin(angle)
    const inner = 8 + progress * 12
    const outer =
      CELL_WIDTH * (0.34 + progress * (index % 3 === 0 ? 0.9 : 0.68))
    const width = index % 2 === 0 ? 7 : 4
    graphics.fillStyle(
      index % 3 === 0 ? SHELL_HIGHLIGHT : SHELL_MIDTONE,
      fade * 0.82
    )
    graphics.fillTriangle(
      directionX * inner - directionY * width,
      -12 + directionY * inner + directionX * width,
      directionX * outer,
      -12 + directionY * outer,
      directionX * inner + directionY * width,
      -12 + directionY * inner - directionX * width
    )
  }

  for (let index = 0; index < 10; index++) {
    const angle = (index / 10) * Math.PI * 2 + 0.27
    const distance =
      CELL_WIDTH * (0.18 + progress * (0.65 + (index % 3) * 0.18))
    const centerX = Math.cos(angle) * distance
    const centerY =
      -12 + Math.sin(angle) * distance * (CELL_HEIGHT / CELL_WIDTH)
    const shardAngle = angle + progress * (index % 2 === 0 ? 2 : -2)
    const axisX = Math.cos(shardAngle)
    const axisY = Math.sin(shardAngle) * (CELL_HEIGHT / CELL_WIDTH)
    const normalX = -Math.sin(shardAngle)
    const normalY = Math.cos(shardAngle) * (CELL_HEIGHT / CELL_WIDTH)
    const length = CELL_WIDTH * (0.2 + (index % 3) * 0.035)
    const width = CELL_WIDTH * (0.09 + (index % 2) * 0.025)
    const tipX = centerX + axisX * length
    const tipY = centerY + axisY * length
    const baseX = centerX - axisX * length * 0.75
    const baseY = centerY - axisY * length * 0.75
    const sideOneX = centerX + axisX * length * 0.2 + normalX * width
    const sideOneY = centerY + axisY * length * 0.2 + normalY * width
    const sideTwoX = centerX + axisX * length * 0.1 - normalX * width * 0.75
    const sideTwoY = centerY + axisY * length * 0.1 - normalY * width * 0.75

    graphics.fillStyle(index % 3 === 0 ? SHELL_HIGHLIGHT : SHELL_MIDTONE, fade)
    graphics.fillTriangle(tipX, tipY, sideOneX, sideOneY, baseX, baseY)
    graphics.fillTriangle(tipX, tipY, baseX, baseY, sideTwoX, sideTwoY)
    graphics.lineStyle(1.5, SHELL_OUTLINE, fade * 0.9)
    graphics.beginPath()
    graphics.moveTo(tipX, tipY)
    graphics.lineTo(sideOneX, sideOneY)
    graphics.lineTo(baseX, baseY)
    graphics.lineTo(sideTwoX, sideTwoY)
    graphics.closePath()
    graphics.strokePath()
  }

  const sparkleAlpha = fade * (0.45 + flash * 0.55)
  for (let index = 0; index < 8; index++) {
    const angle = (index / 8) * Math.PI * 2 + 0.4
    const distance = CELL_WIDTH * (0.3 + progress * 1.08)
    const x = Math.cos(angle) * distance
    const y = -12 + Math.sin(angle) * distance * (CELL_HEIGHT / CELL_WIDTH)
    const size = index % 2 === 0 ? 4 : 2.5
    graphics.fillStyle(SHELL_HIGHLIGHT, sparkleAlpha)
    graphics.fillCircle(x, y, size)
  }
}

export const shellSmashAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay
}) => {
  if (!isBoardCell(positionX, positionY)) return

  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const shell = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.HIT_FX_ABOVE_POKEMON)
  const seam = scene.add.graphics({ x, y }).setDepth(DEPTH.BOOST_FRONT)
  const burst = scene.add.graphics({ x, y }).setDepth(DEPTH.BOOST_FRONT)
  drawShellSurface(shell)
  drawShellSeam(seam)
  scene.abilitiesVfxGroup?.add(shell)
  scene.abilitiesVfxGroup?.add(seam)
  scene.abilitiesVfxGroup?.add(burst)

  const tween = scene.tweens.addCounter({
    from: 0,
    to: DURATION,
    duration: DURATION,
    delay: Math.max(0, delay ?? 0),
    onUpdate: (counter) => {
      if (!shell.active || !seam.active || !burst.active) return

      const time = counter.getValue() ?? 0
      if (time < SHELL_HOLD) {
        const pulse = 0.9 + Math.sin((time / SHELL_HOLD) * Math.PI) * 0.1
        shell.setAlpha(pulse)
        seam.setAlpha(pulse)
        return
      }

      const explosionTime = time - SHELL_HOLD
      const shellFade = CLAMP(1 - explosionTime / 100, 0, 1)
      shell.setAlpha(shellFade)
      seam.setAlpha(shellFade)
      shell.setScale(1 + (1 - shellFade) * 0.14)
      seam.setScale(1 + (1 - shellFade) * 0.14)
      drawBurst(burst, explosionTime)
    },
    onComplete: () => {
      if (shell.active) shell.destroy()
      if (seam.active) seam.destroy()
      if (burst.active) burst.destroy()
    }
  })

  shell.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  seam.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
  burst.once(Phaser.GameObjects.Events.DESTROY, () => tween.stop())
}
