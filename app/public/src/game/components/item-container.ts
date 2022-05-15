import Button from './button'
import { GameObjects } from 'phaser'
import ItemDetail from './item-detail'
import { Item } from '../../../../types/enum/Item'

export default class ItemContainer extends Button {
  detail: ItemDetail
  sprite: GameObjects.Image
  tempDetail: ItemDetail | undefined
  tempSprite: GameObjects.Image | undefined
  name: Item

  scene: Phaser.Scene
  dragable: boolean
  constructor(scene: Phaser.Scene, x: number, y: number, item: Item, dragable: boolean) {
    super(scene, x, y, dragable ? 70: 25, dragable ? 70: 25)
    this.scene = scene
    this.dragable = dragable
    if (this.dragable) {
      this.add(new GameObjects.Ellipse(scene, 0, 0, 70, 70, 0xffffff, 0.7).setStrokeStyle(3, 0x000000, 1))
    } else {
      this.add(new GameObjects.Ellipse(scene, 0, 0, 25, 25, 0xffffff, 0.7))
    }
    this.sprite = new GameObjects.Image(scene, 0, 0, 'item', item).setScale(this.dragable ? 2:1, this.dragable? 2:1)
    this.detail = new ItemDetail(scene, 0, 0, item)
    this.detail.setPosition(this.detail.width * 0.5 + 40, this.detail.height * 0.5 + 40)
    this.detail.setVisible(false)
    this.name = item
    this.add(this.sprite)
    this.add(this.detail)

    this.setInteractive()
    this.input.dropZone = true

    if (this.dragable) {
      scene.input.setDraggable(this)
    }
  }

  enterButtonHoverState() {
    //this.openDetail()
    this.input.dropZone = false
  }

  enterButtonRestState() {
    this.input.dropZone = true
  }

  enterButtonActiveState(pointer: Phaser.Input.Pointer){
    this.parentContainer.bringToTop(this)
    if(pointer.rightButtonDown()){
      if (!this.detail.visible) {
        this.openDetail()
        this.input.dropZone = false
      }
      else{
        this.closeDetail()
        this.input.dropZone = true
      }
    }
  }


  openDetail(){
    if(this.parentContainer.visible){
        this.detail.setVisible(true)
    }
  }
  
  closeDetail(){
    if(this.tempDetail || this.tempSprite){
      this.sprite.setVisible(true)
      if(this.tempDetail){
        this.tempDetail.destroy()
      }
      if(this.tempSprite){
        this.tempSprite.destroy()
      }
    }
    this.detail.setVisible(false)
  }

  showTempDetail(item: string){
    this.detail.setVisible(false)
    this.sprite.setVisible(false)
    this.tempSprite = new GameObjects.Image(this.scene, 0, 0, 'item', item).setScale(this.dragable ? 2:1, this.dragable? 2:1)
    this.tempDetail = new ItemDetail(this.scene, 0, 0, item)
    this.tempDetail.setPosition(this.tempDetail.width * 0.5 + 40, this.tempDetail.height * 0.5 + 40)
    this.add(this.tempSprite)
    this.add(this.tempDetail)
    this.tempDetail.setVisible(true)
  }
}
