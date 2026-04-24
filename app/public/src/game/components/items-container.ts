import { ArraySchema, SetSchema } from "@colyseus/schema"
import { GameObjects } from "phaser"
import Player from "../../../../models/colyseus-models/player"
import {
  Berries,
  Dishes,
  Item,
  ShinyItems,
  SpecialItems,
  TMs,
  Tools,
  Wands,
  WeatherRocks
} from "../../../../types/enum/Item"
import { isIn } from "../../../../utils/array"
import { values } from "../../../../utils/schemas"
import { DEPTH } from "../depths"
import GameScene from "../scenes/game-scene"
import ItemContainer from "./item-container"

export default class ItemsContainer extends GameObjects.Container {
  scene: GameScene
  pokemonId: string | null
  playerId: string
  items: Item[] = []

  constructor(
    scene: GameScene,
    inventory: SetSchema<Item> | ArraySchema<Item>,
    x: number,
    y: number,
    pokemonId: string | null,
    playerId: string
  ) {
    super(scene, x, y)
    this.scene = scene
    this.pokemonId = pokemonId
    this.playerId = playerId
    this.setDepth(DEPTH.POKEMON_ITEM)
    scene.add.existing(this)
    this.render(inventory)
  }

  render(inventory: SetSchema<Item> | ArraySchema<Item>) {
    this.removeAll(true)

    const itemSize = this.pokemonId === null ? 70 : 25
    const ITEMS_PER_COLUMN = 6
    const items = values(inventory)

    this.items = []
    items
      .sort((a, b) => this.getOrderPriority(b) - this.getOrderPriority(a))
      .forEach((item, i) => {
        this.items.push(item)
        const x = -1 * itemSize * Math.floor(i / ITEMS_PER_COLUMN)
        const y = (i % ITEMS_PER_COLUMN) * itemSize
        this.add(
          new ItemContainer(
            this.scene,
            x,
            y,
            item,
            this.pokemonId,
            this.playerId
          )
        )
      })
  }

  getOrderPriority(item: Item): number {
    if (isIn(SpecialItems, item)) return 10
    if (isIn(WeatherRocks, item)) return 3
    if (isIn(TMs, item)) return 5
    if (isIn(Wands, item)) return 4
    if (isIn(ShinyItems, item)) return 2
    if (isIn(Tools, item)) return 1
    if (isIn(Dishes, item)) return -1
    if (isIn(Berries, item)) return -2
    return 0
  }

  closeTooltips() {
    for (let i = 0; i < this.list.length; i++) {
      const it = <ItemContainer>this.list[i]
      it.closeDetail()
    }
  }

  setPlayer(player: Player) {
    this.playerId = player.id
    this.render(player.items)
  }

  updateCount(item: Item, count: number) {
    for (let i = 0; i < this.list.length; i++) {
      const it = <ItemContainer>this.list[i]
      if (it.name === item) {
        it.updateCount(count)
      }
    }
  }
}
