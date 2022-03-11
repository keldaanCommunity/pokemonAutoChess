import {Schema, type} from '@colyseus/schema';

export default class DpsHeal extends Schema {
  @type('string') id: string;
  @type('string') name: string;
  @type('uint16') heal = 0;
  @type('uint16') shield = 0;

  constructor(id: string, name: string) {
    super();
    this.id = id;
    this.name = name;
  }

  changeHeal(heal: number, shield: number) {
    if (this.heal != heal) {
      this.heal = heal;
    }
    if (this.shield != shield) {
      this.shield = shield;
    }
  }
}