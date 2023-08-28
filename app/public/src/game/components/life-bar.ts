import { Team } from "../../../../types/enum/Game"
import Bar from "./bar"

const ALLY_COLOR = "#76c442"
const ENEMY_COLOR = "#e76e55"

export default class LifeBar extends Bar {
  shieldProgress: HTMLDivElement
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    max: number,
    maxShield: number,
    team: Team,
    flip: boolean
  ) {
    super(
      scene,
      x,
      y,
      width,
      7,
      max,
      max,
      team === (flip ? 1 : 0) ? ALLY_COLOR : ENEMY_COLOR
    )

    this.shieldProgress = document.createElement("div")
    this.shieldProgress.className = "progress-bar"
    this.shieldProgress.ariaRoleDescription = "progressbar"
    this.shieldProgress.ariaValueNow = maxShield.toString()
    this.shieldProgress.ariaValueMin = "0"
    this.shieldProgress.ariaValueMax = maxShield.toString()
    this.shieldProgress.style.backgroundColor = "#696969"
    this.wrap.style.borderBottom = "none"
    this.dom.appendChild(this.shieldProgress)
  }

  setShieldAmount(value: number) {
    this.shieldProgress.ariaValueNow = value.toString()
    this.shieldProgress.style.width = `${(value * 100) / this.max}%`
  }

  setTeam(team: number, flip: boolean) {
    this.color = team === (flip ? 1 : 0) ? ALLY_COLOR : ENEMY_COLOR
    if (this.progress) {
      this.progress.style.backgroundColor = this.color
    }
  }
}
