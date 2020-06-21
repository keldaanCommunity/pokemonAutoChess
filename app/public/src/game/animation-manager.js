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

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 74, 75, 76, 298, 183, 184, 41 ,42, 169, 179, 180, 181, 173, 35, 36, 174, 39, 40, 187, 188, 189, 273, 274, 275, 396, 397
    , 398].forEach(num => {
      this.createAnimations(num,"COMMON");
    });
    this.createAttacksAnimations();
  }

  createAttacksAnimations(){
    this.game.anims.create({
      key: `GRASS/range`,
      frames: this.game.anims.generateFrameNames("attacks", {start:0, end:10, zeroPad: 3, prefix: "GRASS/range/" }),
      frameRate: 8,
      repeat: -1
    });

    this.game.anims.create({
      key: `GRASS/melee`,
      frames: this.game.anims.generateFrameNames("attacks", {start:0, end:25, zeroPad: 3, prefix: "GRASS/melee/" }),
      frameRate: 10,
      repeat: -1
    });

    this.game.anims.create({
      key: `WATER/range`,
      frames: this.game.anims.generateFrameNames("attacks", {start:0, end:18, zeroPad: 3, prefix: "WATER/range/" }),
      frameRate: 8,
      repeat: -1
    });
    
    this.game.anims.create({
      key:`FIRE/melee`,
      frames: this.game.anims.generateFrameNames("attacks",{start:0, end:8, zeroPad: 3, prefix: "FIRE/melee/" }),
      frameRate:8,
      repeat: -1
  });

    this.game.anims.create({
      key:`ROCK/melee`,
      frames: this.game.anims.generateFrameNames("attacks",{start:0, end:10, zeroPad: 3, prefix: "ROCK/melee/" }),
      frameRate:8,
      repeat: -1
    })

    this.game.anims.create({
      key:`POISON/range`,
      frames: this.game.anims.generateFrameNames("attacks",{start:0, end:38, zeroPad: 3, prefix: "POISON/range/" }),
      frameRate:8,
      repeat: -1
    });

    this.game.anims.create({
      key:`ELECTRIC/range`,
      frames: this.game.anims.generateFrameNames("attacks",{start:0, end:5, zeroPad: 3, prefix: "ELECTRIC/range/" }),
      frameRate:8,
      repeat: -1
    });

    this.game.anims.create({
      key:`FAIRY/melee`,
      frames: this.game.anims.generateFrameNames("attacks",{start:0, end:25, zeroPad: 3, prefix: "FAIRY/melee/" }),
      frameRate:10,
      repeat: -1
    });

    this.game.anims.create({
      key:`FAIRY/range`,
      frames: this.game.anims.generateFrameNames("attacks",{start:0, end:13, zeroPad: 3, prefix: "FAIRY/range/" }),
      frameRate:8,
      repeat: -1
    });

    this.game.anims.create({
      key:`FLYING/melee`,
      frames: this.game.anims.generateFrameNames("attacks",{start:0, end:24, zeroPad: 3, prefix: "FLYING/melee/" }),
      frameRate:10,
      repeat: -1
    });

    this.game.anims.create({
      key:`FLYING/range`,
      frames: this.game.anims.generateFrameNames("attacks",{start:0, end:7, zeroPad: 3, prefix: "FLYING/range/" }),
      frameRate:8,
      repeat: -1
    });

    this.game.anims.create({
      key:`BUG/melee`,
      frames: this.game.anims.generateFrameNames("attacks",{start:0, end:15, zeroPad: 3, prefix: "BUG/melee/" }),
      frameRate:10,
      repeat: -1
    });
  }

  createAnimations(index, rarity) {
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
        frames: this.game.anims.generateFrameNames(`${rarity}`, { frames: [0, 1, 2], prefix: index + "/0/" + orientation + "/" }),
        frameRate: 4,
        repeat: -1
      });
      // attack
      this.game.anims.create({
        key: `${index}/1/${orientation}`,
        frames: this.game.anims.generateFrameNames(`${rarity}`, { frames: [0, 1, 2], prefix: index + "/1/" + orientation + "/" }).concat(
          this.game.anims.generateFrameNames(`${rarity}`, { frames: [0, 1, 2], prefix: index + "/0/" + orientation + "/" })
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