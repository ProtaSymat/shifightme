const DEFAULT_WIDTH = 1024
const DEFAULT_HEIGHT = 576
const MAX_WIDTH = 1536
const MAX_HEIGHT = 864
const SCALE_MODE = 'SMOOTH';

const { PreloadScene, MainScene } = require('./levels/level1.js');

/*#########################################--PARA JOUEUR--#########################################*/
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'cihan')
      scene.add.existing(this)
      scene.physics.add.existing(this)
      this.setCollideWorldBounds(true)
      this.setScale(0.2, 0.2);
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


  /*#########################################--CONFIG JEU--#########################################*/
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