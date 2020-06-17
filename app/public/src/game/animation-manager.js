export default class AnimationManager {
  constructor(game) {
    this.game = game;
    this.orientationTable = {
      "DOWN": 0,
      "DOWNLEFT": 1,
      "LEFT": 2,
      "UPLEFT": 3,
      "UP": 4,
      "UPRIGHT": 3,
      "RIGHT": 2,
      "DOWNRIGHT": 1
    };

    this.actionTable ={
      "MOVING":0,
      "ATTACKING":1
    }

    this.flipxTable = {
      "DOWNRIGHT": false,
      "DOWNLEFT": false,
      "LEFT": false,
      "UPLEFT": false,
      "UP": false,
      "UPRIGHT": true,
      "RIGHT": true,
      "DOWNRIGHT": true
    };

    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(num => {
      this.createAnimations(num);
    });
    this.createGrassAnimation();
  }

  createGrassAnimation(){
    this.game.anims.create({
      key: `grass`,
      frames: this.game.anims.generateFrameNames("attacks", {start:0, end:10, zeroPad: 3, prefix: "GRASS/" }),
      frameRate: 8,
      repeat: -1
    });
  }

  createAnimations(index) {
    /*
      0 : down
      1 : down left
      2 : left
      3 : up left
      4 : up
      */
    ["0", "1", "2", "3", "4"].forEach(orientation => {
      this.game.anims.create({
        key: `${index}/0/${orientation}`,
        frames: this.game.anims.generateFrameNames("pokemons", { frames: [0, 1, 2], prefix: index + "/0/" + orientation + "/" }),
        frameRate: 4,
        repeat: -1
      });
      // attack
      this.game.anims.create({
        key: `${index}/1/${orientation}`,
        frames: this.game.anims.generateFrameNames("pokemons", { frames: [0, 1, 2], prefix: index + "/1/" + orientation + "/" }).concat(
          this.game.anims.generateFrameNames("pokemons", { frames: [0, 1, 2], prefix: index + "/0/" + orientation + "/" })
        ),
        duration: 1000,
        repeat: -1,
      });
    });
  }

  animatePokemon(entity) {
    let key = this.getSpriteKey(entity);
    this.playAnimation(entity, key);
  }

  playAnimation(entity, spriteKey) {
    entity.flipX = this.flipxTable[entity.orientation];
    entity.first.anims.play(spriteKey);
  }

  getSpriteKey(entity) {
    return `${entity.index}/${this.actionTable[entity.action]}/${this.orientationTable[entity.orientation]}`;
  }

}