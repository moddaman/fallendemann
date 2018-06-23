/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Fallingman from '../sprites/Fallingman'

var start = Date.now();
var platforms;
var roofGroup;
var floorGroup;


export default class extends Phaser.State {
  init() { }
  preload() { }
  create() {
    const bannerText = '404'
    
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    })

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.W, Phaser.Keyboard.A, Phaser.Keyboard.D, Phaser.Keyboard.E  ]);
    
    roofGroup = game.add.group();
    roofGroup.enableBody = true;
    var roof = roofGroup.create(0,0, 'ground');
    roof.scale.setTo(2,0.1);
    roof.body.immovable = true;

    floorGroup = game.add.group();
    floorGroup.enableBody = true;
    var floor = floorGroup.create(0,game.world.height - 2, 'ground');
    floor.scale.setTo(2,1);
    floor.body.immovable = true;

    this.platforms = game.add.group();
    this.platforms.enableBody = true;
    var ledge = this.platforms.create(100, 500, 'ground');
    ledge.scale.setTo(0.5, 0.5);
    this.platforms.addAll('body.velocity.y', -20)
    this.platforms.allowGravity = false;


    this.fallingman = new Fallingman({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'fallingman'
    })

    this.game.add.existing(this.fallingman)

  }

  killPlatform (platform, roof) {
      platform.kill();
  }

  reset (player, floor) {
    start = Date.now();
    player.x = game.world.width - 400;
    player.y =  game.world.height - 400
  }

  update() {
    var timepast = Math.floor((Date.now() - start));
    var seconds = Math.floor(timepast / 1000) ;
    var random = Math.floor(Math.random() * 10);
    if(random > 8 && this.platforms.countLiving() < 5) {
      var x = Math.floor((Math.random() * game.world.width) + 1);
      var ledge = this.platforms.create(x, game.world.height, 'ground');
      ledge.scale.setTo(((Math.random() * 0.5) + 0.2),0.5);
      ledge.body.immovable = true;
      this.platforms.allowGravity = false;
     }
     this.platforms.setAll('body.velocity.y', -150)
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
