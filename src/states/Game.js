/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Fallingman from '../sprites/Fallingman'

var start = Date.now();
var platforms;
var roofGroup;
var floorGroup;
var scoreText = 0
var score;

export default class extends Phaser.State {
  init() { }
  preload() { }
  create() {

    score = this.add.text(10, 10, scoreText, {
      font: '30px Arial',
      fill: '#77BFA3',
      smoothed: false
    })

    score.padding.set(100, 40)
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.W, Phaser.Keyboard.A, Phaser.Keyboard.D, Phaser.Keyboard.E]);

    roofGroup = game.add.group();
    roofGroup.enableBody = true;
    var roof = roofGroup.create(0, 0, 'ground');
    roof.scale.setTo(3, 0.001);
    roof.body.immovable = true;

    floorGroup = game.add.group();
    floorGroup.enableBody = true;
    var floor = floorGroup.create(0, game.world.height - 1, 'ground');
    floor.scale.setTo(3, 0.001);
    floor.body.immovable = true;

    this.platforms = game.add.group();
    this.platforms.enableBody = true;
    var ledge = this.platforms.create(100, 500, 'ground');
    ledge.scale.setTo(0.5, 0.5);
    this.platforms.addAll('body.velocity.y', -200)
    this.platforms.allowGravity = false;


    this.fallingman = new Fallingman({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'fallingman'
    })

    this.game.add.existing(this.fallingman)

  }

  killPlatform(platform, roof) {
    platform.kill();
  }

  reset(player, floor) {
    start = Date.now();
    player.x = game.world.width - 400;
    player.y = game.world.height - 400
  }

  update() {
    var seconds = Math.floor((new Date().getTime() - start) / 1000);
    score.text = seconds;
    var r = Math.floor((Math.random() * 100) + 1)


    if (this.platforms.children.slice(-1)[0].position.y < (game.world.height / 2)) {
      var ledgeWidth = (Math.random() * 0.5);
      var x = Math.floor((Math.random() * (game.world.width - ledgeWidth) + 1));
      var ledge = this.platforms.create(x, game.world.height, 'ground');
      ledge.scale.setTo((ledgeWidth + 0.2), 0.5);
      ledge.body.immovable = true;
      this.platforms.allowGravity = false;
      ledge.body.velocity.y = (200 + (seconds * (Math.random() * 3))) * -1;
    }
    game.physics.arcade.collide(this.platforms, roofGroup, this.killPlatform, null, this);
    game.physics.arcade.collide(this.fallingman, floorGroup, this.reset, null, this);
    game.physics.arcade.collide(this.fallingman, roofGroup, this.reset, null, this);
    game.physics.arcade.collide(this.fallingman, this.platforms);
  }

  render() {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.fallingman, 32, 32)
    }
  }
}
