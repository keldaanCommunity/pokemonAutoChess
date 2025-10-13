import { GameObjects } from "phaser"
import { Team } from "../../../../types/enum/Game"
import { DEPTH } from "../depths"

export default class LifeBar extends GameObjects.Graphics {
  maxHp: number
  hp: number
  shield: number
  PP?: number
  maxPP?: number
  team: Team
  flip: boolean

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    maxLife: number,
    life: number,
    shield: number,
    team: Team,
    flip: boolean
  ) {
    super(scene, { x: x, y: y })

    this.maxHp = maxLife
    this.hp = life
    this.shield = shield
    this.team = team
    this.flip = flip

    this.setDepth(DEPTH.POKEMON_HP_BAR)
  }

  draw() {
    const barWidth = 70
    const innerBarWidth = barWidth - 2
    const lifeBarBgColor = 0x303030
    const ppBarBgColor = 0x282828
    const allyLifeColor = 0x76c442
    const enemyLifeColor = 0xe76e55
    const shieldColor = 0xe0e0e0
    const ppColor = 0x209cee
    const hpPerSegment = 25

    this.clear()
    this.clearMask()

    this.translateCanvas(-barWidth / 2, 0)

    // life bar
    this.fillStyle(0x000000)
    this.fillRoundedRect(0, 0, barWidth, this.maxPP === undefined ? 8 : 14, 2)

    // life and shield amount
    if (this.hp > 0) {
      const totalLife = Math.max(this.maxHp, this.hp + this.shield) // if life + shield exceeds maxLife, the amount of segments should expand accordingly
      const lifePercentage = this.hp / totalLife
      const shieldPercentage = this.shield / totalLife

      this.save()
      this.translateCanvas(1, 1)

      this.fillStyle(lifeBarBgColor, 1)
      this.fillRect(0, 0, innerBarWidth, 6)

      const color =
        this.team === (this.flip ? 1 : 0) ? allyLifeColor : enemyLifeColor
      this.fillStyle(color, 1)
      this.fillRect(0, 0, lifePercentage * innerBarWidth, 6)
      if (this.shield > 0) {
        this.fillStyle(shieldColor)
        this.fillRect(
          lifePercentage * innerBarWidth,
          0,
          shieldPercentage * 68,
          6
        )
      }

      // hp segmentation
      const segmentSize = (hpPerSegment / totalLife) * innerBarWidth
      const numberOfSegments = ((totalLife - 0.1) / hpPerSegment) >> 0 // -0.1 to remove final segment on perfect intervals
      this.lineStyle(1, lifeBarBgColor)
      this.beginPath()
      for (let i = 1; i <= numberOfSegments; i++) {
        this.moveTo(i * segmentSize, 0)
        this.lineTo(i * segmentSize, 4)
      }
      this.closePath()
      this.strokePath()

      this.restore()
    }

    // PP
    if (this.PP !== undefined && this.maxPP !== undefined) {
      const ppPercentage = this.PP / this.maxPP

      this.fillStyle(ppBarBgColor, 1)
      this.fillRect(1, 9, innerBarWidth, 3)

      this.fillStyle(ppColor)
      this.fillRect(1, 9, ppPercentage * innerBarWidth, 3)
    }
  }

  setHp(value: number) {
    this.scene.tweens.add({
      targets: this,
      life: value,
      duration: 150,
      onUpdate: this.draw.bind(this),
      ease: "Sine.easeOut"
    })
  }

  setShield(value: number) {
    this.scene.tweens.add({
      targets: this,
      shield: value,
      duration: 150,
      onUpdate: this.draw.bind(this),
      ease: "Sine.easeOut"
    })
  }

  setMaxHp(value: number) {
    this.maxHp = value
  }

  setPP(value: number) {
    this.scene.tweens.add({
      targets: this,
      PP: value,
      duration: 150,
      onUpdate: this.draw.bind(this),
      ease: "Sine.easeOut"
    })
  }

  setMaxPP(value: number) {
    this.maxPP = value
    if (this.PP === undefined) this.PP = 0
  }

  setTeam(team: number, flip: boolean) {
    this.team = team
    this.flip = flip
  }
}
