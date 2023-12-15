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
    this.load.image('ground', 'images/brick.png')
    this.load.image('cihan', 'images/cihan.png')
  }

  create() {
    this.scene.start('MainScene')
  }
}

class MainScene extends Phaser.Scene {
  cursors
  player

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

    this.cameras.main.setBounds(0, 0, world.width, world.height)
    this.physics.world.setBounds(0, 0, world.width, world.height)

    let safeArea = this.add
      .rectangle(
        this.cameras.main.width / 2 - +this.game.config.width / 2,
        this.cameras.main.height - +this.game.config.height,
        +this.game.config.width,
        +this.game.config.height,
        0xff00ff,
        0.08
      )
      .setStrokeStyle(4, 0xff00ff, 0.25)
      .setOrigin(0)
      .setDepth(2)
      .setScrollFactor(0)
      let platforms = this.physics.add.staticGroup();

let platform1 = platforms.create(800, 500, 'ground').setDisplaySize(100, 50);
let platform2 = platforms.create(200, 300, 'ground').setDisplaySize(100, 50);
let platform3 = platforms.create(300, 300, 'ground').setDisplaySize(100, 50);

  
platform1.refreshBody();  // Add this line
platform2.refreshBody();
platform3.refreshBody();

      this.player = new Player(this, 450, 450)
   
      this.physics.add.collider(this.player, platforms); 
  
      this.cursors = this.input.keyboard.createCursorKeys()
      this.cameras.main.startFollow(this.player, true)

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
            debug: true
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
      if (cursors.left.isDown) {
        this.setVelocityX(-160 * 2)
  
      } else if (cursors.right.isDown) {
        this.setVelocityX(160 * 2)
  
      } else {
        this.setVelocityX(0)
  
      }
  
      if (cursors.up.isDown /*&& this.body.touching.down*/) {
        this.setVelocityY(-330 * 1.5)
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
  