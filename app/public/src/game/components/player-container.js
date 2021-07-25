import {GameObjects} from 'phaser';
import PlayerPortraitContainer from './player-portrait-container';

export default class PlayerContainer extends GameObjects.Container {
  constructor(scene, x, y, players) {
    super(scene, x, y);
    this.players = players;

    this.players.forEach((player, key) => {
      this.addPlayer(player);
    });

    scene.add.existing(this);
  }

  addPlayer(player) {
    this.add(new PlayerPortraitContainer(this.scene, 0, 102 * player.rank, player));
  }

  removePlayer(id) {
    this.remove(this.getFirst('id', id), true);
  }

  onLifeChange(id, value) {
    this.getFirst('id', id).onLifeChange(value);
  }

  onRankChange(id, value){
    this.getFirst('id',id).onRankChange(value);
  }

  onMoneyChange(id, value) {
    this.getFirst('id', id).onMoneyChange(value);
  }

  onLevelChange(id, value) {
    this.getFirst('id', id).onLevelChange(value);
  }
}
