const COLOR_TYPE = Object.freeze(
  {
      NORMAL:'0xada594',
      FIGHTING:'0xa55239',
      FLYING:'0x9cadf7',
      POISON:'0xb55aa5',
      GROUND:'0xd6b55a',
      ROCK:'0xbda55a',
      BUG:'0xadbd21',
      GHOST:'0x6363b5',
      STEEL:'0xadadc6',
      FIRE:'0xf75231',
      WATER:'0x399cff',
      GRASS:'0x7bce52',
      ELECTRIC:'0xffc631',
      PSYCHIC:'0xff73a5',
      ICE:'0x5acee7',
      DRAGON:'0x7b63e7',
      DARK:'0x735a4a',
      FAIRY:'0xf7b5f7'
  }
);

export default class ShopPortraitContainer extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, pokemon)
    {
        super(scene,x ,y);
        this.textStyle = 
        {
          fontSize: "30px",
          fontFamily: "Verdana",
          color: "white",
          align: "center"
        };

        this.add( new Phaser.GameObjects.Rectangle(scene, 60, 20, 250, 150,  COLOR_TYPE[pokemon.type]));
        this.add(new Phaser.GameObjects.Image(scene,0,0, pokemon.index,"portrait").setScale(3,3));
        this.add(new Phaser.GameObjects.Text(scene,-60,60, pokemon.name, this.textStyle));
    }
}