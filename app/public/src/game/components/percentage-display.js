import {GameObjects} from 'phaser';
import {PROBABILITY} from '../../../../models/enum';

export default class PercentageDisplay extends GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.textStyle = {
      fontSize: '20px',
      fontFamily: "Verdana",
      color: 'white',
      align: 'center'
    };

    const COLOR_TYPE = Object.freeze({
        COMMON: 0x686d7d,
        UNCOMMON: 0x478a41,
        RARE: 0x5062ab,
        EPIC: 0x7b469c,
        LEGENDARY: 0xa6802e
    });

    this.percentages = [];
    
    Object.keys(COLOR_TYPE).forEach((rarity, index)=>{
        this.add(new GameObjects.Rectangle(scene,index * 80, 0, 80, 20, COLOR_TYPE[rarity], 1));
        let percentage = new GameObjects.Text(scene, index * 80  - 25, -12,`${PROBABILITY[1][index] * 100} %`, this.textStyle);
        this.percentages.push(percentage);
        this.add(percentage);
    });

    this.scene.add.existing(this);
  }

  updatePercentages(level){
    this.percentages.forEach((percentage, index)=>{
        percentage.setText(`${Math.floor(PROBABILITY[level][index] * 100)} %`);
    });
  }
}
