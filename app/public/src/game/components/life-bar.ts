import { GameObjects } from "phaser"
import { DEPTH } from "../depths"
import { Team } from "../../../../types/enum/Game"
import "./life-bar.css"

export default class LifeBar extends GameObjects.DOMElement {
  maxLife: number
  life: number
  shield: number
  PP?: number
  maxPP?: number
  wrap: HTMLDivElement
  lifeBar: HTMLDivElement
  lifeAmount: HTMLDivElement
  shieldAmount: HTMLDivElement
  PPBar: HTMLDivElement
  PPAmount: HTMLDivElement
  
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
    this.PPBar = document.createElement("div")
    this.PPBar.classList.add("pp-bar")
    this.PPAmount = document.createElement("div")
    this.PPAmount.classList.add("pp-amount")
    this.wrap.replaceChildren(this.lifeBar, this.PPBar)
    this.lifeBar.replaceChildren(this.lifeAmount, this.shieldAmount)
    this.PPBar.replaceChildren(this.PPAmount)
    
    this.setElement(this.wrap)
    this.setDepth(DEPTH.POKEMON_HP_BAR)
    this.draw()
  }
  
  draw() {
    const totalLife = Math.max(this.maxLife, this.life + this.shield)  // if life + shield exceeds maxLife, the amount of segments should expand accordingly
    const lifePercentage = (this.life / totalLife) * 100
    const shieldPercentage = (this.shield / totalLife) * 100
    
    this.lifeAmount.style.width = `${lifePercentage}%`
    this.shieldAmount.style.width = `${shieldPercentage}%`
    
    if (this.PP !== undefined && this.maxPP !== undefined) {
      const PPPercentage = (this.PP / this.maxPP) * 100
      this.PPAmount.style.width = `${PPPercentage}%`
    }
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
  
  setPP(value: number) {
    this.PP = value
    if (this.maxPP === undefined) this.setMaxPP(value)
  }
  
  setMaxPP(value: number) {
    this.PP = 0
    this.maxPP = value
    this.PPBar.style.display = "flex"
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
