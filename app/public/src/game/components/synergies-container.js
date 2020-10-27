import {GameObjects} from 'phaser';
import SynergyContainer from './synergy-container';
import {TYPE} from '../../../../models/enum';

export default class SynergiesContainer extends GameObjects.Container {
  constructor(scene, x, y, player) {
    super(scene, x, y);
    let cy = 0;
    let cx = 0;
    this.player = player;
    this.types = Object.keys(TYPE);
    this.types.forEach((type) => {
      this.add(new SynergyContainer(scene, cx, 62 * cy, type));
      cy += 1;
      if (cy > 11) {
        cy = 0;
        cx = 110;
      }
    });
    this.setDepth(100);
    scene.add.existing(this);
  }

  updateSynergy(field, value) {
    
    this.getFirst('type', field).updateSynergy(value);
  }

  changePlayer(player){
    this.player = player;
    let synergies = Object.keys(player.synergies);
    synergies.forEach(synergy =>{
      if(this.types.includes(synergy)){
        this.updateSynergy(synergy, player.synergies[synergy]);
      }
    });
  }
}
