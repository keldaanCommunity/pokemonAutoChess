import { SetSchema } from "@colyseus/schema"
import { GameObjects } from "phaser"
import ItemContainer from "./item-container"
import { Item } from "../../../../types/enum/Item"
import Player from "../../../../models/colyseus-models/player"

export default class ItemsContainer extends GameObjects.Container {
  pokemonId: string | null;
  playerId: string;

  constructor(
    scene: Phaser.Scene,
    inventory: SetSchema<Item>,
    x: number,
    y: number,
    pokemonId: string | null,
    playerId: string
  ) {
    super(scene, x, y)
   
    this.pokemonId = pokemonId
    this.playerId = playerId
    scene.add.existing(this)

    inventory.forEach((item) => {
      this.addItem(item)
    })
  }

  addItem(value: Item) {
    this.add(new ItemContainer(this.scene, 0, 0, value, this.pokemonId, this.playerId))
    this.updateItems()
  }

  removeItem(item: string) {
    const target = this.findItem(item)
    if (target) {
      this.remove(target, true)
      this.updateItems()
    } else {
      console.warn("no item found looking for", item)
    }
  }

  updateItems() {
    const itemSize = (this.pokemonId === null ? 80 : 25)
    for (let i = 0; i < this.list.length; i++) {
      const it = <ItemContainer>this.list[i]
      it.closeDetail()
      it.x = 0
      it.y = i * itemSize
    }
  }

  findItem(item: string) {
    return this.getFirst("name", item)
  }

  closeDetails(){
    for (let i = 0; i < this.list.length; i++) {
      const it = <ItemContainer>this.list[i]
      it.closeDetail()
    }
  }

  setPlayer(player: Player){
    this.playerId = player.id
    this.removeAll(true)
    player.items.forEach((item) => {
      this.addItem(item)
    })
  }

  updateCount(item: Item, count: number){
    for (let i = 0; i < this.list.length; i++) {
      const it = <ItemContainer>this.list[i]
      if(it.name === item){
        it.updateCount(count)
      }
    }
  }
}
