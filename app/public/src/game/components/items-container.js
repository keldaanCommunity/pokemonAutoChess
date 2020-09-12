import {GameObjects} from 'phaser';
import ItemContainer from './item-container';

export default class ItemsContainer extends GameObjects.Container{
    constructor(scene, x, y, player) {
        super(scene,x,y);
        scene.add.existing(this);
    }

    onAddItem(item, id){
        this.add(new ItemContainer(this.scene, this.length * 30, 0, {'name':item.name, 'id':id}, true));
    }
    
    onRemoveItem(id) {
        this.remove(this.getFirst('id', id));
    }

    updateItem(id){
        let itemToRemove = this.getFirst('id',id);
        if(itemToRemove){
            let name = itemToRemove.name;
            this.remove(itemToRemove);
            this.add(new ItemContainer(this.scene, this.length * 30, 0, {'name':name, 'id':id}, true));
        }
    }        
}