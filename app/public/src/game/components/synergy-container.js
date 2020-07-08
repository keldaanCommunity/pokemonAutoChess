import { GameObjects } from "phaser";

export default class SynergyContainer extends GameObjects.Container {
  constructor(scene, x, y, type) {
    super(scene, x, y);
    this.textStyle = {
        fontSize: "30px",
        fontFamily: "Verdana",
        color: "white",
        align: "center"
      };
    this.type = type;
    this.background = new GameObjects.Rectangle(scene,50,25,100,50, 0x304050);
    this.add(this.background);
    this.synergyCount = new GameObjects.Text(scene, 70, 10,"", this.textStyle);
    this.add(this.synergyCount);
    this.add(new GameObjects.Image(scene, 20, 25, "types", type));
    scene.add.existing(this);
   }

    updateSynergy(value){
        if(value == 0){
            this.background.setFillStyle(0x304050);
            this.synergyCount.setText("");
        }
        else{
            this.background.setFillStyle(0x686d7d);
            this.synergyCount.setText(value);
        }
    }

}