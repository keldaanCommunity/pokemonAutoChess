import {GameObjects} from 'phaser';
import { ItemDescription, ItemName } from '../../../../types/strings/Item';
import {ItemRecipe} from '../../../../types/Config';

export default class ItemDetail extends GameObjects.DOMElement {
  dom: HTMLDivElement;
  constructor(scene: Phaser.Scene, x: number, y: number, name: string) {
    super(scene, x, y);
    this.dom = document.createElement('div');
    this.dom.className = 'nes-container';
    this.dom.style.padding = '10px';
    this.dom.style.backgroundColor = 'rgba(255,255,255,.7)';
    this.dom.style.maxWidth = '400px';
    this.dom.style.minHeight = '200px';
    this.dom.innerHTML = `
      <div style='display:flex; align-items:baseline; justify-content: space-around'>
        <img style='width:40px; height:40px; image-rendering: pixelated' src='assets/item/${name}.png'/>
        <h5>${ItemName[name]}</h5>
      </div>
      <p>${ItemDescription[name]}</p>
      <div style='display:flex; justify-content:space-between'>
      ${Object.keys(ItemRecipe).reduce((prev, item, idx)=>{
        const recipe: string[] = ItemRecipe[item];
        let content = '';
        if(recipe[0] == name){
          content += '<div style="display:flex; flex-flow: column; justify-content:space-between;"><img style="height:18px; width:18px;" src="assets/item/'+ recipe[1] +'.png"/><p style="margin-bottom:0px">=</p><img style="height:18px; width:18px;" src="assets/item/'+ item +'.png"/></div>';
        }
        else if(recipe[1] == name){
          content += '<div style="display:flex; flex-flow: column; justify-content:space-between;"><img style="height:18px; width:18px;" src="assets/item/'+ recipe[0] +'.png"/><p style="margin-bottom:0px">=</p><img style="height:18px; width:18px;" src="assets/item/'+ item +'.png"/></div>';
        }
        return prev + content;
      }, '')}
      </div>
    `;
    this.setElement(this.dom);
  }
}
