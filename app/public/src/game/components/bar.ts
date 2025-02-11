import { GameObjects } from "phaser"

export default class Bar extends GameObjects.DOMElement {
  max: number
  color: string
  progress: HTMLDivElement
  dom: HTMLDivElement
  wrap: HTMLDivElement
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    max: number,
    value: number,
    color: string
  ) {
    super(scene, x, y)
    this.max = max
    this.color = color
    this.wrap = document.createElement("div")
    this.dom = document.createElement("div")
    this.dom.className = "progress"
    this.dom.style.width = `${width}px`
    this.dom.style.height = `${height - 2}px`
    this.wrap.style.margin = "0px"
    this.wrap.style.border = "var(--border-thin)"
    this.wrap.style.borderRadius = "5px"
    this.progress = document.createElement("div")
    this.progress.className = "progress-bar"
    this.progress.ariaRoleDescription = "progressbar"
    this.progress.ariaValueNow = value.toString()
    this.progress.ariaValueMin = "0"
    this.progress.ariaValueMax = max.toString()
    this.progress.style.width = "100%"
    this.progress.style.backgroundColor = color
    this.progress.style.height = `${height - 2}px!important`
    this.dom.appendChild(this.progress)
    this.wrap.appendChild(this.dom)
    this.setElement(this.wrap)
  }

  setAmount(value: number) {
    this.progress.ariaValueNow = value.toString()
    this.progress.style.width = `${(value * 100) / this.max}%`
  }

  setMaxAmount(newMax: number) {
    this.max = newMax
    this.progress.ariaValueMax = newMax.toString()
    this.setAmount(parseFloat(this.progress.ariaValueNow ?? "0"))
  }
}
