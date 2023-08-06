import DraggableObject from "./draggable-object"
import { GameObjects } from "phaser"
import ItemDetail from "./item-detail"
import { Item } from "../../../../types/enum/Item"
import ItemsContainer from "./items-container"
import { getGameScene } from "../../pages/game"

export default class ItemContainer extends DraggableObject {
  detail: ItemDetail
  persistDetails: boolean
  sprite: GameObjects.Image
  tempDetail: ItemDetail | undefined
  tempSprite: GameObjects.Image | undefined
  countText: GameObjects.Text | undefined
  circle?: GameObjects.Ellipse
  name: Item
  parentContainer: ItemsContainer
  scene: Phaser.Scene
  pokemonId: string | null
  playerId: string

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
    this.scene = scene
    this.pokemonId = pokemonId
    this.playerId = playerId
    this.circle = new GameObjects.Ellipse(
      scene,
      0,
      0,
      itemSize,
      itemSize,
      0x61738a,
      1
    )
    if (pokemonId === null) {
      this.circle.setStrokeStyle(
        2,
        playerId === currentPlayerUid ? 0x000000 : 0x666666,
        1
      )
      this.circle.setAlpha(playerId === currentPlayerUid ? 1 : 0.7)
    }
    this.add(this.circle)
    this.sprite = new GameObjects.Image(scene, 0, 0, "item", item).setScale(
      pokemonId === null ? 2 : 1
    )
    this.detail = new ItemDetail(scene, 0, 0, item)
    this.detail.setDepth(100)
    this.detail.setPosition(
      this.detail.width * 0.5 + 40,
      this.detail.height * 0.5 + 40
    )
    this.detail.setVisible(false)
    this.name = item
    this.add(this.sprite)
    this.add(this.detail)

    this.setInteractive()
    this.setDropZone(true)
    this.draggable = this.pokemonId === null
    this.persistDetails = false
  }

  setDropZone(value: boolean) {
    if (this.input) {
      this.input.dropZone = value
    }
  }

  onPointerOver() {
    super.onPointerOver()

    if (!this.persistDetails) {
      if (this.draggable) {
        this.circle?.setFillStyle(0x68829e)
      }

      if (!this.detail.visible) {
        this.openDetail()
      }
    }

    this.setDropZone(false)
  }

  onPointerOut() {
    super.onPointerOut()

    if (!this.dragDisabled) {
      this.setDropZone(true)
    }

    if (!this.persistDetails) {
      if (this.draggable) {
        this.circle?.setFillStyle(0x61738a)
      }

      if (this.detail.visible) {
        this.closeDetail()
      }
    }
  }

  onPointerDown(pointer: Phaser.Input.Pointer) {
    super.onPointerDown(pointer)
    this.parentContainer.bringToTop(this)

    // right click should open/close details
    if (pointer.rightButtonDown()) {
      this.togglePersistDetails()
      this.toggleVisibility()
    } else if (this.detail.visible) {
      if (this.persistDetails) {
        this.togglePersistDetails()
      }
      this.closeDetail()
    }
  }

  onPointerUp() {
    super.onPointerUp()
    this.setDropZone(false)
  }

  openDetail() {
    if (this.parentContainer.visible) {
      this.parentContainer.closeDetails() // close other open item tooltips
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

    this.detail.setVisible(false)
  }

  toggleVisibility() {
    if (!this.persistDetails) {
      if (this.detail.visible) {
        this.closeDetail()
      } else {
        this.openDetail()
      }
    }
  }

  togglePersistDetails() {
    const shouldPersist = !this.persistDetails
    this.persistDetails = shouldPersist

    this.circle?.setFillStyle(shouldPersist ? 0x32a852 : 0x61738a)
  }

  showTempDetail(item: Item) {
    this.detail.setVisible(false)
    this.sprite.setVisible(false)
    this.tempSprite = new GameObjects.Image(
      this.scene,
      0,
      0,
      "item",
      item
    ).setScale(this.pokemonId === null ? 2 : 1)
    this.tempDetail = new ItemDetail(this.scene, 0, 0, item)
    this.tempDetail.setDepth(100)
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
        fontFamily: "brandonGrotesque",
        color: "#FFFFFF",
        align: "center",
        strokeThickness: 2,
        stroke: "#000000"
      }
      this.countText = this.scene.add.existing(
        new GameObjects.Text(
          this.scene,
          this.detail.width * 0.5 + 10,
          this.detail.height * 0.5 - 15,
          value.toString(),
          textStyle
        )
      )
      this.add(this.countText)
      this.countText.setAlign("left")
    } else {
      this.countText.setText(value.toString())
    }
  }
}
