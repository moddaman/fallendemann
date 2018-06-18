  var game = new Phaser.Game(1000, 1000, Phaser.AUTO, '', { preload: preload, create: create, update: update });

  var platforms;
  var player;
  var player1Bullets;
  var gameOver = false;
  var thing;
  var roofGroup;
  var floorGroup;
  var starttime;
  var start = Date.now();
  var lastObject = Date.now();

  function preload() {
    game.load.image('ground', 'assets/platform.png');
    game.load.spritesheet('dude', 'assets/tester.png', 57, 69);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  }

  class APlayer {
    constructor(name, x) {
      this.name = name;
      this.character = game.add.sprite(game.world.width - 400, game.world.height - 400, 'dude');
    }

    move() {
      this.character.body.velocity.x = 0;
      if (this.leftKey.isDown)
      {
        this.goLeft();
        this.lastKey = 'left';
      }
      else if (this.rightKey.isDown)
      {
        this.goRight();
        this.lastKey = 'right';
      }
      else
      {
        this.character.animations.stop();
      }
      var hit = game.physics.arcade.collide(this.character, platforms);
      var hitroof = game.physics.arcade.collide(this.character, roofGroup);
      var hitFloor = game.physics.arcade.collide(this.character, floorGroup);

      if(hitroof || hitFloor) {
        this.character.x = game.world.width - 400;
        this.character.y =  game.world.height - 400
        start = Date.now();
      }
      this.updateTimer();
      if (this.upKey.isDown && this.character.body.touching.down && hit)
      {
        this.character.body.velocity.y = -200;
      }
    }

    updateTimer() {
      var millis = Date.now() - start;
      this.textArea.text = Math.floor(millis/1000);
    }

    goRight() {
      this.character.body.velocity.x = 300;
      this.character.animations.play('right');
    }

    goLeft() {
      this.character.body.velocity.x = -300;
      this.character.animations.play('left');
    }

    get lastKey() {
      return this._lastKey;
    }
    set lastKey(value) {
      this._lastKey = value;
    }

    get health() {
      return this._health;
    }
    set health(value) {
      this._health = value;
    }

    get character() {
      return this._character;
    }
    set character(value) {
      this._character = value;
    }
    get name() {
      return this._name;
    }
    set name(value) {
      this._name = value;
    }
    get leftKey() {
      return this._leftKey;
    }
    set leftKey(value) {
      this._leftKey = value;
    }
    get rightKey() {
      return this._rightKey;
    }
    set rightKey(value) {
      this._rightKey = value;
    }
    get upKey() {
      return this._upKey;
    }
    set upKey(value) {
      this._upKey = value;
    }
    get shootKey() {
      return this._shootKey;
    }
    set shootKey(value) {
      this._shootKey = value;
    }
    get textArea() {
      return this._textArea;
    }
    set textArea(value) {
      this._textArea = value;
    }
  }


  
  function CreatePlayer(name, x) {
    var chara = new APlayer(name, x);
    game.physics.arcade.enable(chara.character);
    chara.character.body.gravity.y = 500;
    chara.character.body.collideWorldBounds = true;
    chara.character.animations.add('left', [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 11, true);
    chara.character.animations.add('right', [8, 7, 6, 5, 4, 3, 2, 1, 0], 10, true);
    return chara;
  }

  function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    
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
    
    platforms = game.add.group();
    platforms.enableBody = true;
    var ledge = platforms.create(100, 500, 'ground');
    ledge.scale.setTo(0.5, 0.5);
    platforms.addAll('body.velocity.y', -20)
    platforms.allowGravity = false;
    player = CreatePlayer('per', 96);
    player.textArea = game.add.text(16, 16, '0', { fontSize: '32px', fill: '#f46e42' });

    player.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    player.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    player.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    player.shootKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.W, Phaser.Keyboard.A, Phaser.Keyboard.D, Phaser.Keyboard.E  ]);

  }

  function killPlatform (platform, roof) {
    platform.kill();
  }

  function update() {
    var timepast = Math.floor((Date.now() - start));
    var seconds = Math.floor(timepast / 1000) ;

    if(timepast % 42 === 0) {
        var x = Math.floor((Math.random() * game.world.width) + 1);
        var ledge = platforms.create(x, game.world.height, 'ground');
        ledge.scale.setTo(((Math.random() * 0.5) + 0.2),0.5);
        platforms.allowGravity = false;
    }
    platforms.setAll('body.velocity.y', (seconds + 150) * -1);
    platforms.setAll('body.velocity.x', 0);
    game.physics.arcade.collide(platforms, roofGroup, killPlatform, null, this);
    player.move();
  }
