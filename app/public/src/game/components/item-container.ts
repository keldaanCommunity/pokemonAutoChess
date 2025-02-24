import { GameObjects } from "phaser"
import {
  ArtificialItems,
  Berries,
  Dishes,
  HMs,
  Item,
  ShinyItems,
  SpecialItems,
  TMs,
  WeatherRocks
} from "../../../../types/enum/Item"
import { getGameScene } from "../../pages/game"
import { preference } from "../../preferences"
import DraggableObject from "./draggable-object"
import ItemDetail from "./item-detail"
import ItemsContainer from "./items-container"
import { DEPTH } from "../depths"

export default class ItemContainer extends DraggableObject {
  detail: ItemDetail | undefined
  sprite: GameObjects.Image
  tempDetail: ItemDetail | undefined
  tempSprite: GameObjects.Image | undefined
  countText: GameObjects.Text | undefined
  circle?: GameObjects.Image
  name: Item
  scene: Phaser.Scene
  pokemonId: string | null
  playerId: string
  mouseoutTimeout: NodeJS.Timeout | null = null

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    item: Item,
    pokemonId: string | null,
    playerId: string
  ) {
    const currentPlayerUid = getGameScene()?.uid
    const itemSize = pokemonId === null ? 60 : 25
    super(scene, x, y, itemSize, itemSize, playerId !== currentPlayerUid)
    this.name = item
    this.scene = scene
    this.pokemonId = pokemonId
    this.playerId = playerId
    this.circle = scene.add.image(0, 0, "cell", this.cellIndex * 3)
    if (pokemonId) {
      this.circle.setFrame(this.cellIndex * 3 + 2).setScale(0.45)
    } else {
      this.circle.setFrame(
        this.cellIndex * 3 + (playerId === currentPlayerUid ? 0 : 2)
      )
    }
    this.add(this.circle)
    const spriteName = TMs.includes(item)
      ? "TM"
      : HMs.includes(item)
        ? "HM"
        : item
    this.sprite = new GameObjects.Image(
      scene,
      0,
      0,
      "item",
      spriteName + ".png"
    ).setScale(pokemonId === null ? 0.5 : 0.25)

    this.add(this.sprite)
    this.setInteractive()
    this.updateDropZone(true)
    this.draggable = this.pokemonId === null && playerId === currentPlayerUid
  }

  get cellIndex() {
    if (ShinyItems.includes(this.name)) return 1
    if (Berries.includes(this.name)) return 2
    if (ArtificialItems.includes(this.name)) return 3
    if (WeatherRocks.includes(this.name)) return 4
    if (SpecialItems.includes(this.name)) return 5
    if (TMs.includes(this.name) || HMs.includes(this.name)) return 6
    if ((Dishes.map((d) => d) as Item[]).includes(this.name)) return 7
    return 0
  }

  updateDropZone(value: boolean) {
    if (this.input) {
      this.input.dropZone = value
    }
  }

  onPointerOver(pointer) {
    super.onPointerOver(pointer)
    if (preference("showDetailsOnHover") && !this.detail?.visible) {
      this.mouseoutTimeout && clearTimeout(this.mouseoutTimeout)
      this.openDetail()
    }
    this.updateDropZone(false)
    if (this.draggable) {
      this.circle?.setFrame(this.cellIndex * 3 + 1)
    }
  }

  onPointerOut() {
    super.onPointerOut()
    if (!this.dragDisabled) {
      this.updateDropZone(true)
    }
    if (this.draggable) {
      this.circle?.setFrame(this.cellIndex * 3)
    }
    if (preference("showDetailsOnHover")) {
      this.mouseoutTimeout = setTimeout(
        () => {
          if (this.detail?.visible) {
            this.closeDetail()
          }
        },
        this.pokemonId === null ? 100 : 0
      )
    }
  }

  onPointerDown(
    pointer: Phaser.Input.Pointer,
    event: Phaser.Types.Input.EventData
  ) {
    super.onPointerDown(pointer, event)
    this.parentContainer.bringToTop(this)
    event.stopPropagation()
    if (pointer.rightButtonDown() && !preference("showDetailsOnHover")) {
      if (!this.detail?.visible) {
        this.openDetail()
        this.updateDropZone(false)
      } else {
        this.closeDetail()
        this.updateDropZone(true)
      }
    }
  }

  onPointerUp() {
    super.onPointerUp()
    this.updateDropZone(false)
  }

  openDetail() {
    if (this.parentContainer.visible) {
      ;(this.parentContainer as ItemsContainer).closeDetails() // close other open item tooltips

      if (this.detail === undefined) {
        this.detail = new ItemDetail(this.scene, 0, 0, this.name)
        this.detail.setDepth(DEPTH.TOOLTIP)
        this.detail.setPosition(
          this.detail.width * 0.5 + 40,
          this.detail.height * 0.5
        )
        this.detail.setVisible(false)
        this.detail.dom.addEventListener("mouseenter", () => {
          this.mouseoutTimeout && clearTimeout(this.mouseoutTimeout)
        })
        this.detail.dom.addEventListener("mouseleave", () => {
          if (preference("showDetailsOnHover")) {
            this.mouseoutTimeout = setTimeout(
              () => {
                if (this.detail?.visible) {
                  this.closeDetail()
                }
              },
              this.pokemonId === null ? 100 : 0
            )
          }
        })

        this.add(this.detail)
      }

      this.detail.setVisible(true)
    }
  }

  closeDetail() {
    if (this.tempDetail || this.tempSprite) {
      this.sprite.setVisible(true)
      if (this.tempDetail) {
        this.tempDetail.destroy()
      }
      if (this.tempSprite) {
        this.tempSprite.destroy()
      }
    }
    this.detail?.setVisible(false)
  }

  showTempDetail(item: Item) {
    this.detail?.setVisible(false)
    this.sprite.setVisible(false)
    this.tempSprite = new GameObjects.Image(
      this.scene,
      0,
      0,
      "item",
      item + ".png"
    ).setScale(this.pokemonId === null ? 0.5 : 0.25)
    this.tempDetail = new ItemDetail(this.scene, 0, 0, item)
    this.tempDetail.setDepth(DEPTH.TOOLTIP)
    this.tempDetail.setPosition(
      this.tempDetail.width * 0.5 + 40,
      this.tempDetail.height * 0.5 + 40
    )
    this.add(this.tempSprite)
    this.add(this.tempDetail)
    this.tempDetail.setVisible(true)
  }

  updateCount(value: number) {
    if (this.countText === undefined) {
      const textStyle = {
        fontSize: "16px",
        fontFamily: "Jost",
        color: "#FFFFFF",
        align: "center",
        strokeThickness: 2,
        stroke: "#000000"
      }
      this.countText = this.scene.add.existing(
        new GameObjects.Text(this.scene, 15, -12, value.toString(), textStyle)
      )
      this.add(this.countText)
      this.countText.setAlign("left")
    } else {
      this.countText.setText(value.toString())
    }
  }

  destroy(fromScene?: boolean | undefined): void {
    super.destroy(fromScene)
    this.closeDetail()
  }
}
