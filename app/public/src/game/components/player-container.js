import {GameObjects} from 'phaser';
import PlayerPortraitContainer from './player-portrait-container';

export default class PlayerContainer extends GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    for (const id in window.state.players) {
      this.addPlayer(window.state.players[id]);
    }
    scene.add.existing(this);
  }

  addPlayer(player) {
    this.add(new PlayerPortraitContainer(this.scene, 0, 102 * this.length, player));
  }

  removePlayer(id) {
    this.remove(this.getFirst('id', id));
  }

  onLifeChange(id, value) {
    this.getFirst('id', id).onLifeChange(value);
  }

  onMoneyChange(id, value) {
    this.getFirst('id', id).onMoneyChange(value);
  }

  onLevelChange(id, value) {
    this.getFirst('id', id).onLevelChange(value);
  }
}
