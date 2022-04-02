import {GameObjects} from 'phaser';
import {ITEM_NAME, ITEM_DESCRIPTION} from '../../../../models/enum';

export default class ItemDetail extends GameObjects.DOMElement {
  dom: HTMLDivElement;
  constructor(scene: Phaser.Scene, x: number, y: number, name: string) {
    super(scene, x, y);
    this.dom = document.createElement('div');
    this.dom.className = 'nes-container';
    this.dom.style.backgroundColor = 'rgba(255,255,255,.7)';
    this.dom.style.width = '300px';
    this.dom.innerHTML = `
      <div style='display:flex'>
        <img style='width:40px; height:40px; image-rendering: pixelated' src='assets/item/${name}.png'/>
        <h5>${ITEM_NAME[name]}</h5>
      </div>
      <p>${ITEM_DESCRIPTION[name]}</p>
    `;
    this.setElement(this.dom);
  }
}
