import Button from './button';
import {GameObjects} from 'phaser';
import ItemDetail from './item-detail';

export default class ItemContainer extends Button{
    constructor(scene, x, y, item, dragable) {
        super(scene, x, y, 15, 15);
        this.objType = 'item';
        this.sprite = new GameObjects.Image(scene,0,0,'items', item.name);
        this.socle = new GameObjects.Image(scene,0,10,'socle').setScale(0.5,0.5);
        this.detail = new ItemDetail(scene, 15, 0, item.name);
        this.id = item.id;
        this.name = item.name;
        this.add(this.sprite);
        this.add(this.socle);
        this.add(this.detail);
        if (dragable) {
            scene.input.setDraggable(this);
        }
    }

    enterButtonHoverState() {
        this.detail.setScale(1,1);
    }

    enterButtonRestState() {
        this.detail.setScale(0,0);
    }
}