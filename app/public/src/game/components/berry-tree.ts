import { t } from "i18next"
import { GameObjects } from "phaser"
import { getRegionTint } from "../../../../config"
import Player from "../../../../models/colyseus-models/player"
import { Transfer } from "../../../../types"
import { preference } from "../../preferences"
import { DEPTH } from "../depths"
import type GameScene from "../scenes/game-scene"
import BoardManager from "./board-manager"
import ItemDetail from "./item-detail"

export class BerryTree extends GameObjects.Container {
  scene: GameScene
  manager: BoardManager
  index: number
  sprite: GameObjects.Sprite
  detail: ItemDetail | undefined
  mouseoutTimeout: NodeJS.Timeout | null = null
  player: Player

  constructor(manager: BoardManager, x: number, y: number, i: number) {
    super(manager.scene, x, y)
    this.scene = manager.scene
    this.manager = manager
    this.index = i
    this.player = manager.player
    const stage = this.player.berryTreesStages[i]
    const type = this.player.berryTreesType[i]

    this.sprite = new Phaser.GameObjects.Sprite(
      this.scene,
      0,
      0,
      "berry_trees",
      type + "_1"
    )
    this.add(this.sprite)
    this.setSize(72, 72)
    this.sprite
      .setDepth(DEPTH.INANIMATE_OBJECTS)
      .setScale(2, 2)
      .setOrigin(0.5, 1)
      .setTint(getRegionTint(this.scene.mapName, preference("colorblindMode")))
    if (stage === 0) {
      this.sprite.anims.play("CROP")
    } else {
      this.sprite.anims.play(`${type}_TREE_STEP_${stage}`)
    }

    this.sprite
      .setInteractive()
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

  openDetail() {
    this.scene.closeTooltips() // close other open tooltips

    if (this.detail === undefined) {
      const type = this.player.berryTreesType[this.index]
      this.detail = new ItemDetail(this.scene, 0, 0, type)
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

  onPointerOver(pointer: Phaser.Input.Pointer) {
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
    } else {
      if (this.player.id !== this.scene.uid) return
      const stage = this.player.berryTreesStages[this.index]
      if (this.scene.room && stage >= 3) {
        this.scene.room.send(Transfer.PICK_BERRY, this.index)
        this.manager.displayText(pointer.x, pointer.y, t("berry_gained"), true)
        this.sprite.play("CROP")
      } else {
        this.manager.displayText(pointer.x, pointer.y, t("berry_unripe"), true)
      }
    }
  }
}
