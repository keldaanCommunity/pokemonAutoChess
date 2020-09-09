import {GameObjects} from 'phaser';
import ItemContainer from './item-container';

export default class ItemsContainer extends GameObjects.Container{
    constructor(scene, x, y) {
        super(scene,x,y);
        this.items = new Array(9);
        scene.add.existing(this);
    }

    addItem(item, index){
        console.log(`ìtem ${item.name} at ${index}`);
        let itemContainer = new ItemContainer(this.scene, index * 25, 0, item, true);
        this.items[index] = itemContainer;
        this.add(itemContainer);
    }

    removeItem(index){
        if(this.items[index]){
            this.items[index].destroy();
        }
    }
}