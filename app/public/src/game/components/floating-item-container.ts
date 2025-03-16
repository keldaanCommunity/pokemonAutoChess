import { GameObjects } from "phaser"
import { Item } from "../../../../types/enum/Item"
import GameScene from "../scenes/game-scene"
import { DEPTH } from "../depths"
import ItemDetail from "./item-detail"
import { preference } from "../../preferences"
import MinigameManager from "./minigame-manager"

export class FloatingItemContainer extends GameObjects.Container {
  manager: MinigameManager
  name: Item
  circle: GameObjects.Ellipse
  sprite: GameObjects.Image
  id: string
  detail: ItemDetail | undefined
  mouseoutTimeout: NodeJS.Timeout | null = null

  constructor(
    manager: MinigameManager,
    id: string,
    x: number,
    y: number,
    item: Item
  ) {
    super(manager.scene, x, y)
    this.manager = manager
    this.name = item
    this.id = id
    this.circle = new GameObjects.Ellipse(
      manager.scene,
      0,
      0,
      40,
      40,
      0x61738a,
      1
    )
    this.circle.setStrokeStyle(1, 0xffffff, 0.7)
    this.add(this.circle)
    this.sprite = new GameObjects.Image(
      manager.scene,
      0,
      0,
      "item",
      this.name + ".png"
    )
    this.sprite.setScale(0.32)
    this.add(this.sprite)
    this.setDepth(DEPTH.INANIMATE_OBJECTS)

    this.setSize(40, 40)
    this.setInteractive()
      .on("pointerover", (pointer: Phaser.Input.Pointer) => {
        this.onPointerOver(pointer)
      })
      .on("pointerout", () => this.onPointerOut())
      .on(
        "pointerdown",
        (
          pointer: Phaser.Input.Pointer,
          _x: number,
          _y: number,
          event: Phaser.Types.Input.EventData
        ) => {
          this.onPointerDown(pointer, event)
        }
      )

    this.scene.add.existing(this)
  }

  onGrab(playerId) {
    const currentPlayerId: string = (this.scene as GameScene).uid!
    if (playerId === currentPlayerId) {
      this.circle.setStrokeStyle(2, 0x4cff00, 1)
      this.circle.setFillStyle(0x61738a, 1)
    } else if (playerId == "") {
      this.circle.setStrokeStyle(1, 0xffffff, 0.7)
      this.circle.setFillStyle(0x61738a, 1)
    } else {
      this.circle.setStrokeStyle(2, 0xcf0000, 0.7)
      this.circle.setFillStyle(0x61738a, 0.7)
    }
  }

  openDetail() {
    this.manager.closeDetails() // close other open item tooltips

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
          this.mouseoutTimeout = setTimeout(() => {
            if (this.detail?.visible) {
              this.closeDetail()
            }
          }, 0)
        }
      })

      this.add(this.detail)
    }

    this.detail.setVisible(true)
  }

  closeDetail() {
    this.detail?.setVisible(false)
  }

  onPointerOver(pointer) {
    if (preference("showDetailsOnHover") && !this.detail?.visible) {
      this.mouseoutTimeout && clearTimeout(this.mouseoutTimeout)
      this.openDetail()
    }
  }

  onPointerOut() {
    if (preference("showDetailsOnHover")) {
      this.mouseoutTimeout = setTimeout(() => {
        if (this.detail?.visible) {
          this.closeDetail()
        }
      }, 0)
    }
  }

  onPointerDown(
    pointer: Phaser.Input.Pointer,
    event: Phaser.Types.Input.EventData
  ) {
    //this.parentContainer.bringToTop(this)
    event.stopPropagation()
    if (pointer.rightButtonDown() && !preference("showDetailsOnHover")) {
      if (!this.detail?.visible) {
        this.openDetail()
      } else {
        this.closeDetail()
      }
    }
  }
}
