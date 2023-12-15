const DEFAULT_WIDTH = 1024
const DEFAULT_HEIGHT = 576
const MAX_WIDTH = 1536
const MAX_HEIGHT = 864
const SCALE_MODE = 'SMOOTH';

class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('background', 'images/backgroundMenu.png');
    this.load.image('star', 'images/coin-cihan.png')
    this.load.image('ground', 'images/brick.png')
    this.load.image('cihan', 'images/cihan.png')
    this.load.image('enemy', 'images/enemy.png')
    this.load.image('enemy2', 'images/enemy2.png')

  }

  create() {
    this.scene.start('MainScene')
  }
}

class MainScene extends Phaser.Scene {
  cursors
  player
  enemy
  enemy2

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {

    let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);

  let scaleX = this.cameras.main.width / bg.width;
  let scaleY = this.cameras.main.height / bg.height;
  let scale = Math.max(scaleX, scaleY);
  bg.setScale(scale).setScrollFactor(0);


    const world = {
      width: 2000,
      height: 864
    }
    
    this.enemy2 = this.physics.add.sprite(1000, 450, 'enemy2');
    this.enemy2.setCollideWorldBounds(true);
    this.enemy2.setVelocity(Phaser.Math.Between(-800, 800), 20);
    this.enemy2.allowGravity = false;
    this.enemy2.setScale(0.05);

    this.enemy = this.physics.add.sprite(1000, 450, 'enemy');
    this.enemy.setCollideWorldBounds(true);
    this.enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
    this.enemy.allowGravity = false;
    this.enemy.setScale(0.5);

    this.cameras.main.setBounds(0, 0, world.width, world.height)
    this.physics.world.setBounds(0, 0, world.width, world.height)

    let safeArea = this.add
      .rectangle(
        this.cameras.main.width / 2 - +this.game.config.width / 2,
        this.cameras.main.height - +this.game.config.height,
        +this.game.config.width,
        +this.game.config.height,
        0xff00ff,
        0
      )
      .setStrokeStyle(4, 0xff00ff, 0)
      .setOrigin(0)
      .setDepth(2)
      .setScrollFactor(0)
      let platforms = this.physics.add.staticGroup();

let platform1 = platforms.create(800, 500, 'ground').setDisplaySize(100, 50);
let platform2 = platforms.create(200, 300, 'ground').setDisplaySize(100, 50);
let platform3 = platforms.create(300, 300, 'ground').setDisplaySize(100, 50);
let platform4 = platforms.create(1100, 500, 'ground').setDisplaySize(100, 50);
let platform5 = platforms.create(650, 630, 'ground').setDisplaySize(100, 50);
let platform6 = platforms.create(900, 200, 'ground').setDisplaySize(100, 50);
let platform7 = platforms.create(0, 864, 'ground').setDisplaySize(100000, 50);


  
platform1.refreshBody();
platform2.refreshBody();
platform3.refreshBody();
platform4.refreshBody();
platform5.refreshBody();
platform6.refreshBody();
platform7.refreshBody();


    this.player = new Player(this, 450, 450)
      
    let stars = this.physics.add.group({
      key: 'star',
      repeat: 22,
      setXY: { x: 12, y: 0, stepX: 70 }
    })
    stars.children.iterate((child) => {
      child.setScale(0.2, 0.2);
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
      child.setInteractive().on('pointerdown', () => {
        console.log('star body', child.body)
        console.log('you hit a star')
      })
    })

    let score = 0

    let scoreText = this.add
      .text(16, 16, 'ECTS Gagnés: 0', { fontSize: '32px', fill: '#000' })
      .setOrigin(0)
      .setScrollFactor(0)

    const collectStar = (player, star) => {
      star.disableBody(true, true)
      score += 10
      scoreText.setText('ECTS Gagnés: ' + score)
      if (score >= 120) {
        this.victory();
      }
    }
    

      this.physics.add.collider(this.player, platforms, () => this.player.canJump = 2);
      this.physics.add.collider(stars, platforms)
      this.physics.add.collider(this.enemy, platforms);
      this.physics.add.collider(this.enemy2, platforms);
      this.physics.add.overlap(this.player, stars, collectStar)
      this.cursors = this.input.keyboard.createCursorKeys()
      this.cameras.main.startFollow(this.player, true)

      this.physics.add.collider(this.player, this.enemy, this.endGame, null, this);
      this.physics.add.collider(this.player, this.enemy2, this.endGame, null, this);


    const resize = () => {
      safeArea.x = this.cameras.main.width / 2 - +this.game.config.width / 2
      safeArea.y = this.cameras.main.height - +this.game.config.height

    }

    this.scale.on('resize', (gameSize, baseSize, displaySize, resolution) => {
      console.log('resize "this.scale.on"')
      this.cameras.resize(gameSize.width, gameSize.height)
      resize()
    })
    console.log('resize in scene')
    resize()
    
  }

  update() {
    this.player.update(this.cursors)
    if (this.enemy.body.touching.right || this.enemy.body.blocked.right) {
      this.enemy.setVelocityX(-200);
    } else if (this.enemy.body.touching.left || this.enemy.body.blocked.left) {
      this.enemy.setVelocityX(200);
    }
  }
  endGame() {
    this.physics.pause();
    this.player.setTint(0xff0000);
  
    let centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    let centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
  
    // create a semi-transparent black background
    let background = this.add.rectangle(centerX, centerY, this.game.config.width, 200, 0x000000);
    background.setAlpha(0.5);
    background.setDepth(1);  // so it covers everything else
  
    let gameOver = this.add.text(centerX, centerY, 'Cihan est mort', { fontSize: '64px', fill: '#ffffff' });
    gameOver.setOrigin(0.5);
    gameOver.setDepth(2);  // so it's visible on top of the background
  
    let replayButton = this.add.text(centerX, centerY + 70, 'Rejouer', { fontSize: '32px', fill: '#ffffff' });
    replayButton.setOrigin(0.5);
    replayButton.setInteractive();
    replayButton.setDepth(2);  // so it's visible on top of the background
    replayButton.on('pointerdown', () => {
      this.scene.restart(); // redémarre le jeu
    });
  }
  
  victory() {
    this.physics.pause();
  
    let centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    let centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
  
    // create a semi-transparent black background
    let background = this.add.rectangle(centerX, centerY, this.game.config.width, 200, 0x000000);
    background.setAlpha(0.5);
    background.setDepth(1);  // so it covers everything else
  
    let victoryText = this.add.text(centerX, centerY, 'Cihan a gagné', { fontSize: '64px', fill: '#ffffff' });
    victoryText.setOrigin(0.5);
    victoryText.setDepth(2);  // so it's visible on top of the background
  
    let replayButton = this.add.text(centerX, centerY + 70, 'Rejouer', { fontSize: '32px', fill: '#ffffff' });
    replayButton.setOrigin(0.5);
    replayButton.setInteractive();
    replayButton.setDepth(2);  // so it's visible on top of the background
    replayButton.on('pointerdown', () => {
      this.scene.restart(); // redémarre le jeu
    });
  }
  
}

const config = {
    backgroundColor: '#ffffff',
    parent: 'phaser-game',
    scale: {
        mode: Phaser.Scale.NONE,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
      },
    height: DEFAULT_HEIGHT,
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 1000},
            debug: false
        }
    },
    scene: [PreloadScene, MainScene]

}

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'cihan')
      scene.add.existing(this)
      scene.physics.add.existing(this)
      this.setCollideWorldBounds(true)
      this.setScale(0.2, 0.2);
      this.body.setSize(this.width, this.height);

      this.setScale(0.2, 0.2);   // Ajustement de la taille de l'image.
      this.body.setSize(this.width, this.height); 

    }
  
    update(cursors) {
      if (this.body.blocked.down || this.body.touching.down) {
        this.canJump = true;
        this.isJumping = false;
      }
  
      if (cursors.left.isDown) {
        this.setVelocityX(-160 * 2)
      } else if (cursors.right.isDown) {
        this.setVelocityX(160 * 2)
      } else {
        this.setVelocityX(0)
      }
  
      if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.canJump) {
        this.setVelocityY(-330 * 1.5);
        this.isJumping = true;
        this.canJump = false;
      } else if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.isJumping) {
        this.setVelocityY(-330 * 1.5);
        this.isJumping = false;
      }
    }
  }
  
  window.addEventListener('load', () => {
    const game = new Phaser.Game(config)
  
    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
  
      let width = DEFAULT_WIDTH
      let height = DEFAULT_HEIGHT
      let maxWidth = MAX_WIDTH
      let maxHeight = MAX_HEIGHT
      let scaleMode = SCALE_MODE
  
      let scale = Math.min(w / width, h / height)
      let newWidth = Math.min(w / scale, maxWidth)
      let newHeight = Math.min(h / scale, maxHeight)
  
      let defaultRatio = DEFAULT_WIDTH / DEFAULT_HEIGHT
      let maxRatioWidth = MAX_WIDTH / DEFAULT_HEIGHT
      let maxRatioHeight = DEFAULT_WIDTH / MAX_HEIGHT
  
      let smooth = 1
      if (scaleMode === 'SMOOTH') {
        const maxSmoothScale = 1.15
        const normalize = (value, min, max) => {
          return (value - min) / (max - min)
        }
        if (width / height < w / h) {
          smooth =
            -normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) / (1 / (maxSmoothScale - 1)) + maxSmoothScale
        } else {
          smooth =
            -normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) / (1 / (maxSmoothScale - 1)) + maxSmoothScale
        }
      }
  
      game.scale.resize(newWidth * smooth, newHeight * smooth)
  
      game.canvas.style.width = newWidth * scale + 'px'
      game.canvas.style.height = newHeight * scale + 'px'
  
      game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`
      game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`
    }
    window.addEventListener('resize', event => {
      console.log('resize event')
      resize()
    })
    console.log('resize at start')
    resize()
  })