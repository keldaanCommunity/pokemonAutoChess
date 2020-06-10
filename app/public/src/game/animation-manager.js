export default class AnimationManager {
  constructor(game) {
    this.game = game;
  }

  createAnimations(index) {
    /*
      0 : down
      1 : down left
      2 : left
      3 : up left
      4 : up
      */
    var orientations = ["0", "1", "2", "3", "4"];
    for (var i = 0; i < orientations.length; i++) {
      var orientation = orientations[i];
      //moving sprites
      this.game.anims.create({
        key: index + "_0_" + orientation,
        frames: this.game.anims.generateFrameNames(index, { frames: [0, 1, 2], prefix: index + "_0_" + orientation + "_" }),
        frameRate: 4,
        repeat: -1
      });
      // physical attack
      this.game.anims.create({
        key: index + "_1_" + orientation,
        frames: this.game.anims.generateFrameNames(index, { frames: [0, 1, 2], prefix: index + "_1_" + orientation + "_" }),
        frameRate: 6,
        repeat: -1
      });
      // special attack
      this.game.anims.create({
        key: index + "_2_" + orientation,
        frames: this.game.anims.generateFrameNames(index, { frames: [0], prefix: index + "_2_" + orientation + "_" }),
        frameRate: 6,
        repeat: -1
      });
      // hurt sprite
      this.game.anims.create({
        key: index + "_3_" + orientation,
        frames: this.game.anims.generateFrameNames(index, { frames: [0], prefix: index + "_3_" + orientation + "_" }),
        frameRate: 6,
        repeat: -1
      });
      // sleep sprite
      this.game.anims.create({
        key: index + "_4_" + orientation,
        frames: this.game.anims.generateFrameNames(index, { frames: [0, 1], prefix: index + "_4_" + orientation + "_" }),
        frameRate: 6,
        repeat: -1
      });
      // idle sprite
      this.game.anims.create({
        key: index + "_5_" + orientation,
        frames: this.game.anims.generateFrameNames(index, { frames: [0, 2], prefix: index + "_0_" + orientation + "_" }),
        frameRate: 6,
        repeat: -1
      });
    }
  }

  animateSprite(entity) {
    let key = this.getSpriteKey(entity);
    this.playAnimation(entity, key);
  }

  playAnimation(entity, spriteKey) {
    let flipxTable = {
      "DOWNRIGHT": false,
      "DOWNLEFT": false,
      "LEFT": false,
      "UPLEFT": false,
      "UP": false,
      "UPRIGHT": true,
      "RIGHT": true,
      "DOWNRIGHT": true
    };
    entity.flipX = flipxTable[entity.orientation];
    entity.anims.play(spriteKey);
  }

  getSpriteKey(entity) {
    
    let orientationTable = {
      "DOWN": 0,
      "DOWNLEFT": 1,
      "LEFT": 2,
      "UPLEFT": 3,
      "UP": 4,
      "UPRIGHT": 3,
      "RIGHT": 2,
      "DOWNRIGHT": 1
    };
    let key = "";
    key += entity.index;
    key += "_";
    key += "0";
    key += "_";
    key += orientationTable[entity.orientation];
    return key;
  }

}