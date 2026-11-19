import Phaser from "phaser"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { AbilityAnimation } from "../../../../../types/Animation"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { distanceE } from "../../../../../utils/distance"
import { transformEntityCoordinates } from "../../../pages/utils/utils"
import { DEPTH } from "../../depths"

const CASTER_DURATION = 900
const ALLY_DURATION = 780
const ALLY_SCALE = 1.7
const MAX_ALLIES = 48
const GROUND_Y = 8

type WeatherPalette = {
  cloud: number
  primary: number
  highlight: number
  weather: "normal" | "sun" | "rain" | "snow"
}

const PALETTES: Record<string, WeatherPalette> = {
  [Pkm.CASTFORM]: {
    cloud: 0xb9c4cb,
    primary: 0xe7f0f3,
    highlight: 0xffffff,
    weather: "normal"
  },
  [Pkm.CASTFORM_SUN]: {
    cloud: 0xffd57a,
    primary: 0xffae35,
    highlight: 0xfff1b3,
    weather: "sun"
  },
  [Pkm.CASTFORM_RAIN]: {
    cloud: 0x638d9e,
    primary: 0x59c9ee,
    highlight: 0xcdf8ff,
    weather: "rain"
  },
  [Pkm.CASTFORM_HAIL]: {
    cloud: 0x83cdbc,
    primary: 0x9be9d8,
    highlight: 0xe1ffff,
    weather: "snow"
  }
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))

function drawWeatherMote(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  color: number,
  alpha: number,
  weather: WeatherPalette["weather"]
) {
  if (weather === "sun") {
    graphics.fillStyle(color, alpha)
    graphics.fillCircle(x, y, size * 0.55)
    graphics.lineStyle(1.4, color, alpha * 0.8)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2
      graphics.lineBetween(
        x + Math.cos(angle) * size,
        y + Math.sin(angle) * size,
        x + Math.cos(angle) * size * 1.7,
        y + Math.sin(angle) * size * 1.7
      )
    }
    return
  }

  if (weather === "rain") {
    graphics.lineStyle(1.7, color, alpha)
    graphics.lineBetween(x - size * 0.3, y - size, x + size * 0.3, y + size)
    graphics.fillStyle(color, alpha)
    graphics.fillCircle(x + size * 0.3, y + size, size * 0.38)
    return
  }

  if (weather === "snow") {
    graphics.fillStyle(color, alpha)
    graphics.fillPoints(
      [
        new Phaser.Math.Vector2(x, y - size),
        new Phaser.Math.Vector2(x + size * 0.45, y),
        new Phaser.Math.Vector2(x, y + size),
        new Phaser.Math.Vector2(x - size * 0.45, y)
      ],
      true
    )
    return
  }

  graphics.fillStyle(color, alpha)
  graphics.fillCircle(x, y, size * 0.65)
}

function getAllies(
  data: { [key: string]: any },
  casterX: number,
  casterY: number
) {
  if (!Array.isArray(data.allies)) return []

  const seen = new Set<number>()
  const allies: { x: number; y: number }[] = []
  for (const cell of data.allies) {
    if (
      !Number.isInteger(cell?.x) ||
      !Number.isInteger(cell?.y) ||
      cell.x < 0 ||
      cell.x >= BOARD_WIDTH ||
      cell.y < 0 ||
      cell.y >= BOARD_HEIGHT ||
      (cell.x === casterX && cell.y === casterY)
    ) {
      continue
    }
    const key = cell.y * BOARD_WIDTH + cell.x
    if (seen.has(key)) continue
    seen.add(key)
    allies.push({ x: cell.x, y: cell.y })
    if (allies.length >= MAX_ALLIES) break
  }
  return allies
}

export const forecastAnimation: AbilityAnimation = ({
  scene,
  positionX,
  positionY,
  flip,
  delay,
  data
}) => {
  const baseDelay = Math.max(0, delay ?? 0)
  const palette = PALETTES[data?.form] ?? PALETTES[Pkm.CASTFORM]
  const [x, y] = transformEntityCoordinates(positionX, positionY, flip)
  const casterBack = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
    .setScale(1.25)
  const casterFront = scene.add
    .graphics({ x, y })
    .setDepth(DEPTH.PROJECTILE)
    .setScale(1.25)
  scene.abilitiesVfxGroup?.add(casterBack)
  scene.abilitiesVfxGroup?.add(casterFront)

  scene.tweens.addCounter({
    from: 0,
    to: 1,
    duration: CASTER_DURATION,
    delay: baseDelay,
    onUpdate: (tween) => {
      if (!casterBack.active || !casterFront.active) return
      const t = tween.progress * CASTER_DURATION
      casterBack.clear()
      casterFront.clear()

      const gather = clamp(t / 180) * clamp((760 - t) / 220)
      if (gather > 0) {
        const swell = 0.82 + clamp(t / 360) * 0.18
        casterBack.fillStyle(palette.cloud, gather * 0.2)
        casterBack.fillEllipse(0, -35, 44 * swell, 27 * swell)
        casterFront.fillStyle(palette.cloud, gather * 0.24)
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2 + t * 0.002
          const wobble = Math.sin(t * 0.008 + i) * 2
          casterFront.fillEllipse(
            Math.cos(angle) * 12 + wobble,
            -37 + Math.sin(angle) * 4,
            20 * swell,
            17 * swell
          )
        }
      }

      const ringAlpha = clamp((t - 180) / 100) * clamp((790 - t) / 260)
      if (ringAlpha > 0) {
        const progress = clamp((t - 180) / 520)
        const radius = 18 + progress * 42
        casterBack.lineStyle(3, palette.primary, ringAlpha * 0.55)
        casterBack.strokeEllipse(0, GROUND_Y, radius * 2, radius * 0.65)
        casterBack.lineStyle(1.5, palette.highlight, ringAlpha * 0.7)
        casterBack.strokeEllipse(0, GROUND_Y, radius * 1.72, radius * 0.52)
      }

      const moteAlpha = clamp((t - 130) / 120) * clamp((850 - t) / 200)
      if (moteAlpha > 0) {
        for (let i = 0; i < 6; i++) {
          const angle = t * 0.006 + (i / 6) * Math.PI * 2
          const radius = 25 + (i % 2) * 7
          drawWeatherMote(
            casterFront,
            Math.cos(angle) * radius,
            -38 + Math.sin(angle) * 10,
            2.2 + (i % 2) * 0.7,
            i % 2 ? palette.highlight : palette.primary,
            moteAlpha * 0.85,
            palette.weather
          )
        }
      }

      const flash = clamp((t - 380) / 100) * clamp((740 - t) / 220)
      if (flash > 0) {
        casterFront.fillStyle(palette.highlight, flash * 0.18)
        casterFront.fillCircle(0, -38, 15 + flash * 7)
      }
    },
    onComplete: () => {
      if (casterBack.active) casterBack.destroy()
      if (casterFront.active) casterFront.destroy()
    }
  })

  for (const ally of getAllies(data, positionX, positionY)) {
    const [allyX, allyY] = transformEntityCoordinates(ally.x, ally.y, flip)
    const allyBack = scene.add
      .graphics({ x: allyX, y: allyY })
      .setDepth(DEPTH.ABILITY_BELOW_POKEMON)
      .setScale(ALLY_SCALE)
    const allyFront = scene.add
      .graphics({ x: allyX, y: allyY })
      .setDepth(DEPTH.PROJECTILE)
      .setScale(ALLY_SCALE)
    scene.abilitiesVfxGroup?.add(allyBack)
    scene.abilitiesVfxGroup?.add(allyFront)

    const wave = Math.min(
      160,
      distanceE(positionX, positionY, ally.x, ally.y) * 22
    )
    scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: ALLY_DURATION,
      delay: baseDelay + 110 + wave,
      onUpdate: (tween) => {
        if (!allyBack.active || !allyFront.active) return
        const t = tween.progress * ALLY_DURATION
        allyBack.clear()
        allyFront.clear()

        const fade = clamp((ALLY_DURATION - t) / 260)
        const column = clamp(t / 130) * clamp((620 - t) / 250)
        if (column > 0) {
          allyBack.fillStyle(palette.primary, column * 0.32)
          allyBack.fillEllipse(0, -14, 27, 44)
          allyFront.fillStyle(palette.highlight, column * 0.28)
          allyFront.fillEllipse(0, -20, 13, 35)
        }

        for (let i = 0; i < 2; i++) {
          const progress = clamp((t - i * 180) / 600)
          if (progress >= 1) continue
          const radius = 12 + progress * 25
          const alpha = (1 - progress) * fade
          allyBack.lineStyle(3.5, palette.primary, alpha * 0.9)
          allyBack.strokeEllipse(0, GROUND_Y, radius * 2, radius * 0.66)
          allyBack.lineStyle(2, palette.highlight, alpha)
          allyBack.strokeEllipse(0, GROUND_Y, radius * 1.65, radius * 0.52)
        }

        for (let i = 0; i < 6; i++) {
          const progress = clamp((t - i * 55) / 580)
          if (progress >= 1) continue
          const angle = (i / 6) * Math.PI * 2
          drawWeatherMote(
            allyFront,
            Math.cos(angle) * 13,
            -27 - progress * 26 + Math.sin(angle) * 4,
            3.3,
            i % 2 ? palette.highlight : palette.primary,
            Math.sin(Math.PI * progress) * fade,
            palette.weather
          )
        }
      },
      onComplete: () => {
        if (allyBack.active) allyBack.destroy()
        if (allyFront.active) allyFront.destroy()
      }
    })
  }
}
