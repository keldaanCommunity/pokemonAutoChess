import { GameObjects } from "phaser"
import { DEPTH } from "../depths"
import { Team } from "../../../../types/enum/Game"
import "./life-bar.css"

export default class LifeBar extends GameObjects.DOMElement {
  maxLife: number
  life: number
  shield: number
  wrap: HTMLDivElement
  lifeBar: HTMLDivElement
  lifeAmount: HTMLDivElement
  shieldAmount: HTMLDivElement
  
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
    super(scene, x, y)
    
    this.maxLife = maxLife
    this.life = life
    this.shield = shield
    
    this.wrap = document.createElement("div")
    this.wrap.classList.add("life-bar-wrapper", team === (flip ? 1 : 0) ? "ally" : "enemy")
    this.lifeBar = document.createElement("div")
    this.lifeBar.classList.add("life-bar")
    this.lifeAmount = document.createElement("div")
    this.lifeAmount.classList.add("life-amount")
    this.shieldAmount = document.createElement("div")
    this.shieldAmount.classList.add("shield-amount")
    this.wrap.appendChild(this.lifeBar)
    this.lifeBar.replaceChildren(this.lifeAmount, this.shieldAmount)
    
    this.setElement(this.wrap)
    this.setDepth(DEPTH.POKEMON_HP_BAR)
    this.draw()
  }
  
  draw() {
    const total = Math.max(this.maxLife, this.life + this.shield)  // if life + shield exceeds maxLife, the amount of segments should expand accordingly
    const lifePercentage = (this.life / total) * 100
    const shieldPercentage = (this.shield / total) * 100
    
    this.lifeAmount.style.width = `${lifePercentage}%`
    this.shieldAmount.style.width = `${shieldPercentage}%`
  }
  
  setLife(value: number) {
    this.life = value
    this.draw()
  }
  
  setShield(value: number) {
    this.shield = value
    this.draw()
  }

  setMaxLife(value: number) {
    this.maxLife = value
    this.draw()
  }

  setTeam(team: number, flip: boolean) {
    if (team === (flip ? 1 : 0)) {
      this.wrap.classList.remove("enemy")
      this.wrap.classList.add("ally")
    } else {
      this.wrap.classList.remove("ally")
      this.wrap.classList.add("enemy")
    }
  }
}
