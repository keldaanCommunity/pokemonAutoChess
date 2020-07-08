import { GameObjects } from "phaser";
import SynergyContainer from "./synergy-container";


export default class SynergiesContainer extends GameObjects.Container {
  
  constructor(scene, x, y) {
    super(scene, x, y);
    let cy = 0;
    let cx = 0;
    this.types = ["NORMAL", "GRASS", "FIRE", "WATER", "ELECTRIC", "FIGHTING", "PSYCHIC", "DARK", "METAL", "GROUND", "POISON", "DRAGON", "FIELD", "MONSTER", "HUMAN", "AQUATIC", "BUG", "FLYING", "FLORA", "MINERAL", "AMORPH", "FAIRY"];
    this.add(new GameObjects.Rectangle(scene,125,325,300, 700, 0x304050));
    this.types.forEach(type => {
        this.add(new SynergyContainer(scene, cx, 60 * cy, type));
        cy += 1;
        if(cy > 10){
            cy = 0;
            cx = 150;
        }
    });
    
    scene.add.existing(this);
   }

    updateSynergy(field, value){
        this.getFirst('type', field).updateSynergy(value);
    }

}