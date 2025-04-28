import { GameObjects } from "phaser"
import { DEPTH } from "../depths"
import { Team } from "../../../../types/enum/Game"

export default class LifeBar extends GameObjects.Graphics {
  maxLife: number
  life: number
  shield: number
  PP?: number
  maxPP?: number
  team: Team
  flip: boolean
  lifeDisplay: number
  shieldDisplay: number
  PPDisplay: number
  
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
    super(scene, { x: x - 35, y: y });
    
    this.maxLife = maxLife
    this.life = life
    this.shield = shield
    this.team = team
    this.flip = flip
    
    this.lifeDisplay = 1
    this.shieldDisplay = 1
    this.PPDisplay = 1
    
    this.setDepth(DEPTH.POKEMON_HP_BAR)
  }
  
  draw() {
    const barWidth = 70
    const innerBarWidth = barWidth - 2
    
    this.clear()
    this.clearMask()
    
    // life bar
    this.fillStyle(0x222222)
    this.fillRoundedRect(0, 0, barWidth, this.maxPP === undefined ? 8 : 14, 2)
    
    // life and shield amount
    if (this.life > 0) {
      const totalLife = Math.max(this.maxLife, this.life + this.shield)  // if life + shield exceeds maxLife, the amount of segments should expand accordingly
      const lifePercentage = this.life / totalLife
      const shieldPercentage = this.shield / totalLife
      
      this.save()
      this.translateCanvas(1, 1)
      const color = (this.team === (this.flip ? 1 : 0)) ? 0x76c442 : 0xe76e55
      this.fillStyle(color, 1)
      this.fillRect(0, 0, lifePercentage * innerBarWidth, 6)
      if (this.shield > 0) {
        this.fillStyle(0x969696)
        this.fillRect(lifePercentage * innerBarWidth, 0, shieldPercentage * 68, 5)
      }
      
      // hp segmentation
      const hpPerSegment = 30
      const segmentSize = (hpPerSegment / totalLife) * innerBarWidth
      const numberOfSegments = totalLife / hpPerSegment >> 0
      this.lineStyle(1, 0x222222)
      this.beginPath()
      for (let i = 1; i <= numberOfSegments; i++) {
        this.moveTo(i * segmentSize, 0)
        this.lineTo(i * segmentSize, 6)
      }
      this.closePath()
      this.strokePath()
      this.restore()
    }
    
    // PP
    if (this.PP !== undefined && this.maxPP !== undefined) {
      const PPPercentage = this.PP / this.maxPP
      this.fillStyle(0x209cee)
      this.fillRect(1, 9, PPPercentage * innerBarWidth, 3)
    }
    
  }
  
  setLife(value: number) {
    this.scene.tweens.add({
      targets: this,
      life: value,
      duration: 150,
      onUpdate: this.draw.bind(this),
      ease: 'Sine.easeOut'
    })
  }
  
  setShield(value: number) {
    this.scene.tweens.add({
      targets: this,
      shield: value,
      duration: 150,
      onUpdate: this.draw.bind(this),
      ease: 'Sine.easeOut'
    })
  }

  setMaxLife(value: number) {
    this.maxLife = value
  }
  
  setPP(value: number) {
    this.scene.tweens.add({
      targets: this,
      PP: value,
      duration: 150,
      onUpdate: this.draw.bind(this),
      ease: 'Sine.easeOut'
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
