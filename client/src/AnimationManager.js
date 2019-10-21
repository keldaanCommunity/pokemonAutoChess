export default class AnimationManager
{
  constructor(game)
  {
    this.game = game;
  }

  createAnimations(index)
  {
  /*
    0 : down
    1 : down left
    2 : left
    3 : up left
    4 : up
    */
  var orientations = ["0","1","2","3","4"];
  for (var i = 0; i < orientations.length; i++) 
  {
      var orientation = orientations[i];
      //moving sprites
      this.game.anims.create({
          key: index + "_0_" + orientation,
          frames:  this.game.anims.generateFrameNames(index, {frames: [0,1,2], prefix: index + "_0_" + orientation + "_"}),
          frameRate: 6,
          repeat: -1
      });
      // physical attack
      this.game.anims.create({
          key: index + "_1_" + orientation,
          frames:  this.game.anims.generateFrameNames(index, {frames: [0,1,2], prefix: index + "_1_" + orientation + "_"}),
          frameRate: 6,
          repeat: -1
      });
      // special attack
      this.game.anims.create({
          key: index + "_2_" + orientation,
          frames:  this.game.anims.generateFrameNames(index, {frames: [0], prefix: index + "_2_" + orientation + "_"}),
          frameRate: 6,
          repeat: -1
      });
      // hurt sprite
      this.game.anims.create({
          key: index + "_3_" + orientation,
          frames:  this.game.anims.generateFrameNames(index, {frames: [0], prefix: index + "_3_" + orientation + "_"}),
          frameRate: 6,
          repeat: -1
      });
      // sleep sprite
      this.game.anims.create({
          key: index + "_4_" + orientation,
          frames:  this.game.anims.generateFrameNames(index, {frames: [0,1], prefix: index + "_4_" + orientation + "_"}),
          frameRate: 6,
          repeat: -1
      });
      // idle sprite
      this.game.anims.create({
          key: index + "_5_" + orientation,
          frames:  this.game.anims.generateFrameNames(index, {frames: [0,2], prefix: index + "_0_" + orientation + "_"}),
          frameRate: 6,
          repeat: -1
      });
    }
  }

  displayEntity(entity)
    {
        let orientation = this.getOrientation(1, 1);
        if(entity.orientation != orientation)
        {
            entity.orientation = orientation;
            let key = this.getSpriteKey(entity);
            this.playAnimation(entity, key);
        }
    }


    playAnimation(entity, spriteKey)
    {
      
        let flipxTable = {"down":false, "downleft":false, "left":false, "upleft":false, "up":false, "upright":true, "right":true, "downright":true};
        entity.flipX = flipxTable[entity.orientation];
        
        entity.anims.play(spriteKey);
    }


    getSpriteKey(entity)
    {
        let orientationTable = 
        {
        "down": 0,
        "downleft": 1,
        "left": 2,
        "upleft": 3,
        "up": 4,
        "upright": 3,
        "right": 2,
        "downright":1
        };
        let key = "";
        key += entity.index;
        key += "_";
        key += "0";
        key += "_";
        key += orientationTable[entity.orientation];
        return key;
    }

    getOrientation(vx, vy) 
    {
        let angle = Math.atan2(vy, vx);
        if(angle < 0){
            angle += 2 * Math.PI;
        }
        let angleSeparation = Math.PI / 8;
        let orientation;

        if(angle < angleSeparation)
        {
            orientation = "right";
        }
        else if(angle < angleSeparation * 3)
        {
            orientation = "downright";
        }
        else if(angle < angleSeparation * 5)
        {
            orientation = "down";
        }
        else if(angle < angleSeparation * 7)
        {
            orientation = "downleft";
        }
        else if(angle < angleSeparation * 9)
        {
            orientation = "left";
        }
        else if(angle < angleSeparation * 11)
        {
            orientation = "upleft";
        }
        else if(angle < angleSeparation * 13)
        {
            orientation = "up";
        }
        else if(angle < angleSeparation * 15)
        {
            orientation = "upright";
        }
        else{
            orientation = "right";
        }
        
        return orientation;
    }
}