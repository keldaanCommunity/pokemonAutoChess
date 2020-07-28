import { GameObjects, Game } from "phaser";
import ShopPortraitContainer from "./shop-portrait-container";
import RefreshButton from "../components/refresh-button";
import LevelUpButton from "../components/levelup-button";
import LockButton from "../components/lock-button";

export default class ShopContainer extends GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.dashboardZone = new GameObjects.Zone(scene, 530, 30,  150);
    this.dashboardZone.setRectangleDropZone(1400, 150);
    this.dashboardZone.setName("sell-zone");
    this.add(this.dashboardZone);
    this.portraits = [];
    this.levelUpButton = new LevelUpButton(scene, 0, 58, window.state.players[window.sessionId].experienceManager);
    this.add(new RefreshButton(scene, 0, -8));
    this.add(this.levelUpButton);
    this.lockButton = new LockButton(scene,-135,-8);
    this.add(this.lockButton);
    this.buildShopPortraits();
    scene.add.existing(this);
  }

  buildShopPortraits() {
    let player = window.state.players[window.sessionId];
    let i = 0;
    for (let id in player.shop) {
      let pokemon = player.shop[id];
      let portrait = new ShopPortraitContainer(this.scene, 130 + i * 210, 0, pokemon);
      this.portraits.push(portrait);
      this.add(portrait);
      i += 1;
    }
  }

  updatePortraits() {
    this.remove(this.portraits);
    this.portraits = [];
    this.buildShopPortraits();
  }
}