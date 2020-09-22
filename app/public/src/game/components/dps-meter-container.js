import {GameObjects} from 'phaser';
import DpsContainer from './dps-container';

export default class DpsMeterContainer extends GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.textStyle = {
      fontSize: '20px',
      fontFamily: 'Verdana',
      color: 'white',
      align: 'center'
    };
    scene.add.existing(this);
  }

    addDps(dps){
        this.add(new DpsContainer(this.scene,0,100*this.length, dps.id, dps.name, dps.damage));
    }

    removeDps(dps){
        this.remove(this.getFirst('id', dps.id));
    }

    changeDps(dps, change){
        if(change.field == 'damage'){
            this.getFirst('id', dps.id).changeDamage(change.value);
        }
    }
}
