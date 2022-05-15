import Bar from './bar'

export default class LifeBar extends Bar {
  shieldProgress: HTMLDivElement
  constructor(scene: Phaser.Scene, x: number, y: number, width: number, max: number, maxShield: number, team: number) {
    super(scene, x, y, width, 7, max, max, team === 1 ? '#e76e55': '#76c442')

    this.shieldProgress = document.createElement('div')
    this.shieldProgress.className = 'progress-bar'
    this.shieldProgress.ariaRoleDescription = 'progressbar'
    this.shieldProgress.ariaValueNow = maxShield.toString()
    this.shieldProgress.ariaValueMin = '0'
    this.shieldProgress.ariaValueMax = maxShield.toString()
    this.shieldProgress.style.backgroundColor = '#696969'
    this.wrap.style.borderBottom = 'none'
    this.dom.appendChild(this.shieldProgress)
  }

  setShieldAmount(value: number) {
    this.shieldProgress.ariaValueNow = value.toString()
    this.shieldProgress.style.width = `${value * 100 / this.max}%`
  }
}