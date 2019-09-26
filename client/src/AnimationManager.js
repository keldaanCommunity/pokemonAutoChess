export default class AnimationManager{
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
  for (var i = 0; i < orientations.length; i++) {
    var orientation = orientations[i];
    //moving sprites
    this.game.anims.create({
        key: index + "_0_" + orientation,
        frames:  this.game.anims.generateFrameNames(index, {frames: [0,1,2], prefix: index + "_0_" + orientation + "_"}),
        frameRate: 10,
        repeat: -1
    });
    // physical attack
    this.game.anims.create({
        key: index + "_1_" + orientation,
        frames:  this.game.anims.generateFrameNames(index, {frames: [0,1,2], prefix: index + "_1_" + orientation + "_"}),
        frameRate: 10,
        repeat: 0
    });
    // special attack
    this.game.anims.create({
        key: index + "_2_" + orientation,
        frames:  this.game.anims.generateFrameNames(index, {frames: [0], prefix: index + "_2_" + orientation + "_"}),
        frameRate: 2,
        repeat: 0
    });
    // hurt sprite
    this.game.anims.create({
        key: index + "_3_" + orientation,
        frames:  this.game.anims.generateFrameNames(index, {frames: [0], prefix: index + "_3_" + orientation + "_"}),
        frameRate: 2,
        repeat: 0
    });
    // sleep sprite
    this.game.anims.create({
        key: index + "_4_" + orientation,
        frames:  this.game.anims.generateFrameNames(index, {frames: [0,1], prefix: index + "_4_" + orientation + "_"}),
        frameRate: 2,
        repeat: -1
    });
    // idle sprite
    this.game.anims.create({
        key: index + "_5_" + orientation,
        frames:  this.game.anims.generateFrameNames(index, {frames: [0,2], prefix: index + "_0_" + orientation + "_"}),
        frameRate: 1,
        repeat: -1
    });
  }
  }
}