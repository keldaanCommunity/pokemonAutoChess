import { GameObjects, Game } from "phaser";
import ShopPortraitContainer from "./shop-portrait-container";
import RefreshButton from "../components/refresh-button";
import LevelUpButton from "../components/levelup-button";

export default class ShopContainer extends GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.dashboard = new GameObjects.Rectangle(scene, 530, 30, 1280, 150, 0x304050);
    this.dashboardZone = new GameObjects.Zone(scene, 530, 30, this.dashboard.width, this.dashboard.height);
    this.dashboardZone.setRectangleDropZone(this.dashboard.width, this.dashboard.height);
    this.dashboardZone.setName("sell-zone");
    this.add(this.dashboard);
    this.add(this.dashboardZone);
    this.portraits = [];
    this.levelUpButton = new LevelUpButton(scene, 0, 58, window.state.players[window.sessionId].experienceManager);
    this.add(new RefreshButton(scene, 0, -8));
    this.add(this.levelUpButton);
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