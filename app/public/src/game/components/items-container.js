import {GameObjects} from 'phaser';
import ItemContainer from './item-container';

export default class ItemsContainer extends GameObjects.Container{
    constructor(scene, x, y) {
        super(scene,x,y);
        scene.add.existing(this);
        this.placement = {
            'item0': {
                x:0,
                y:0
            },
            'item1': {
                x:68,
                y:0
            },
            'item2': {
                x:136,
                y:0
            },
            'item3': {
                x:0,
                y:68
            },
            'item4': {
                x:68,
                y:68
            },
            'item5': {
                x:136,
                y:68
            },
            'item6': {
                x:0,
                y:136
            },
            'item7': {
                x:68,
                y:136
            },
            'item8': {
                x:136,
                y:136
            }
        }
    }
    
    changeStuff(field, value){
        if(value == ''){
            this.removeItem(field);
        }
        else{
            switch (field) {
                case 'item0':
                    this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item0'));
                    break;
                case 'item1':
                    this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item1'));
                    break;
                case 'item2':
                    this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item2'));
                    break;
                case 'item3':
                    this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item3'));
                    break;
                case 'item4':
                    this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item4'));
                    break;
                case 'item5':
                    this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item5'));
                    break;
                case 'item6':
                    this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item6'));
                    break;
                case 'item7':
                    this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item7'));
                    break;
                case 'item8':
                    this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item8'));
                    break;
            }
        }

    }
    
    removeItem(field) {
        let itemContainer = this.getFirst('place',field);
        this.remove(itemContainer);
    }

    updateItem(field){
        let name = this.getFirst('place',field).name;
        this.removeItem(field);
        this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, name, true, field));
    }        
}