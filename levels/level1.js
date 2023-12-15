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
          this.enemy2.setScale(0.3);
      
          this.enemy = this.physics.add.sprite(1000, 450, 'enemy');
          this.enemy.setCollideWorldBounds(true);
          this.enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
          this.enemy.allowGravity = false;
          this.enemy.setScale(0.2);
      
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
            player.setTint(0xF2F20D);
            this.time.delayedCall(250, function() {
              player.clearTint();
            });
            score += 10
            scoreText.setText('ECTS Gagnés: ' + score)
            if (score >= 230) {
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
            this.physics.add.collider(this.player, [this.enemy, this.enemy2], function(player, enemy) {
              if (player.body.touching.down && enemy.body.touching.up) {
                enemy.disableBody(true, true);
                player.setTint(0x4AE314);
                this.time.delayedCall(300, function() {
                  player.clearTint();
                });
              } else {
                this.endGame();
              }
            }, null, this);
      
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
        
          let background = this.add.rectangle(centerX, centerY, this.game.config.width, 200, 0x000000);
          background.setAlpha(0.8);
          background.setDepth(1);
        
          let gameOver = this.add.text(centerX, centerY, 'Cihan est mort', { fontSize: '64px', fill: '#ffffff' });
          gameOver.setOrigin(0.5);
          gameOver.setDepth(2);
        
          let replayButton = this.add.text(centerX, centerY + 70, 'Rejouer', { fontSize: '32px', fill: '#ffffff' });
          replayButton.setOrigin(0.5);
          replayButton.setInteractive();
          replayButton.setDepth(2);
          replayButton.on('pointerdown', () => {
            this.scene.restart();
          });
        }
        
        victory() {
          this.physics.pause();
        
          let centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
          let centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
          let background = this.add.rectangle(centerX, centerY, this.game.config.width, 200, 0x000000);
          background.setAlpha(0.5);
          background.setDepth(1);
        
          let victoryText = this.add.text(centerX, centerY, 'Cihan a gagné', { fontSize: '64px', fill: '#ffffff' });
          victoryText.setOrigin(0.5);
          victoryText.setDepth(2);
        
          let replayButton = this.add.text(centerX, centerY + 70, 'Rejouer', { fontSize: '32px', fill: '#ffffff' });
          replayButton.setOrigin(0.5);
          replayButton.setInteractive();
          replayButton.setDepth(2);
          replayButton.on('pointerdown', () => {
            this.scene.restart();
          });
        }
        
      }
module.exports = {PreloadScene, MainScene};
