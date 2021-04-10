import {GameObjects} from 'phaser';
import ShopPortraitContainer from './shop-portrait-container';
import RefreshButton from '../components/refresh-button';
import LevelUpButton from '../components/levelup-button';
import LockButton from '../components/lock-button';
import PokemonFactory from '../../../../models/pokemon-factory';

export default class ShopContainer extends GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.portraits = [null, null, null, null, null];
    this.dashboardZone = new GameObjects.Zone(scene, 0, 0, 150);
    this.dashboardZone.setRectangleDropZone(1400, 150);
    this.dashboardZone.setName('sell-zone');
    this.add(this.dashboardZone);
    this.levelUpButton = new LevelUpButton(scene, 0, 58, window.state.players[_client.auth._id].experienceManager);
    this.add(new RefreshButton(scene, 0, -8));
    this.add(this.levelUpButton);
    this.lockButton = new LockButton(scene, -135, -8);
    this.add(this.lockButton);
    this.buildShopPortraits();
    scene.add.existing(this);
  }

  buildShopPortraits() {
    const player = window.state.players[_client.auth._id];
    this.addPortrait(player.shop[0], 0);
    this.addPortrait(player.shop[1], 1);
    this.addPortrait(player.shop[2], 2);
    this.addPortrait(player.shop[3], 3);
    this.addPortrait(player.shop[4], 4);
  }

  addPortrait(pokemon, index) {
    if (this.portraits[index]) {
      this.remove(this.portraits[index], true);
      this.portraits[index] = null;
    }
    if(pokemon){
      const pkm = PokemonFactory.createPokemonFromName(pokemon);
      const portrait = new ShopPortraitContainer(this.scene, 130 + index * 210, 0, pkm);
      portrait.positionInShop = index;
      this.portraits[index] = portrait;
      this.add(portrait);
    }
    // console.log('add portrait', pokemon, this.length);
  }

  removePortrait(index) {
    this.remove(this.portraits[index], true);
    // this.remove(this.getFirst('positionInShop', index),true);
    // console.log(this.length);
  }
}
