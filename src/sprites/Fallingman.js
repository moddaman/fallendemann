import Phaser from 'phaser'


export default class extends Phaser.Sprite {
  
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.animations.add('left', [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 11, true);
    this.animations.add('right', [8, 7, 6, 5, 4, 3, 2, 1, 0], 10, true);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    this.anchor.setTo(0.5)
  }
  
  update () {
    this.body.velocity.x = 0;
    if(this.leftKey.isDown) {
      this.body.velocity.x = -300;
      this.animations.play('left');
    }
    else if(this.rightKey.isDown) {
      this.body.velocity.x = 300;
      this.animations.play('right');
    } else {
      this.animations.stop();

    }
    this.body.velocity.y = 100;

  }
}
