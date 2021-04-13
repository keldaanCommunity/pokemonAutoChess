import {GameObjects} from 'phaser';
import DpsContainer from './dps-container';

export default class DpsMeterContainer extends GameObjects.Container {
  constructor(scene, x, y, player) {
    super(scene, x, y);

    this.textStyle = {
      fontSize: '20px',
      fontFamily: "Verdana",
      color: 'white',
      align: 'center'
    };
    this.maxDamage = 0;
    this.player = player;
    scene.add.existing(this);
  }

  changePlayer(player) {
    this.player = player;
    this.removeAll(true);

    player.simulation.dpsMeter.forEach((dps, key) => {
      this.addDps(dps);
    });
  }

  addDps(dps) {
    //console.log('add dps',dps.name);
    this.add(new DpsContainer(this.scene, 0, 70*this.length, dps.id, dps.name, dps.damage));
  }

  removeDps(dps) {
    //console.log('remove dps', dps.name);
    this.remove(this.getFirst('id', dps.id), true);
  }

  changeDps(dps, change) {
    //console.log('change dps', dps.name);
    if (change.field == 'damage') {
      const child = this.getFirst('id', dps.id);
      if(child){
        child.damage = change.value;
        child.damageText.setText(change.value);
      }

      if (this.maxDamage < change.value) {
        this.maxDamage = Math.max(change.value, this.maxDamage);
        this.updateDps();
      }
    }
  }

  updateDps() {
    const self = this;
    this.iterate(function(child) {
      child.updateDps(self.maxDamage);
    });
  }
}
