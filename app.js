const config = {
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 1000}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config);
let cihan
let cursors
let jumpCount = 0;

function preload(){
    this.load.image('cihan', 'images/cihan.png');
    this.load.image('background', 'images/background.jpg');

}

function create(){
    let bg = this.add.image(config.width / 2, config.height / 2, 'background');
    bg.displayWidth = config.width;
    bg.displayHeight = config.height;

    cihan = this.physics.add.image(100, 100, 'cihan').setScale(0.5);
    cihan.body.collideWorldBounds = true;
    cihan.body.onWorldBounds = true;

    this.physics.world.on('worldbounds', function(body) {
        if (body.gameObject === cihan) {
            jumpCount = 0;
        }
    }, this);

    cursors = this.input.keyboard.createCursorKeys();
}

function update(){
    cihan.setVelocityX(0);

    if(cursors.up.isDown && jumpCount < 2){
        cihan.setVelocityY(-450);
        jumpCount++;
    }
    if(cursors.down.isDown){
        cihan.setVelocityY(500);
    }
    if(cursors.right.isDown){
        cihan.setVelocityX(200);
    }
    if(cursors.left.isDown){
        cihan.setVelocityX(-200);
    }
}