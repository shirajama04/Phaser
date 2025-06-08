var config =  {
    type: Phaser.AUTO, 
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300},
            debug: false
        }
        },
    scene: {
        preload: preload,
        create: create,
        update:update
        
    }
};
var score = 0;
var scoreText;
var gameover= false;
var game = new Phaser.Game(config); 

function preload() {
    this.load.image('sky', 'assets/paisajeball.svg'); 
    this.load.image('ground', 'assets/platform.svg' );
    this.load.image('star', 'assets/star.svg');
    this.load.image('bomb','assets/nuclear.svg');
    this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48})
}

function create() {
    this.add.image(400, 300, 'sky'); 

    platforms = this.physics.add.staticGroup();

    
    platforms.create(400, 568, 'ground')
    .setScale(2)
    .refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude',{start: 0, end: 3}),
        frameRete: 10,
        repeat:-1
    });

    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 4 }), 
        frameRete: 10,
    
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude',{start: 5, end: 8}),
        frameRete: 10,
        repeat:-1
    });

    // player.body.setGravityY(300);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: {x: 12, y:0, stepX: 70}


    })

    stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        
 stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

   

});

 this.physics.add.collider(stars, platforms);
 this.physics.add.overlap(player, stars, collectStar, null, true);
 
 scoreText = this.add.text(16, 16, 'Score = 0', {fontSize: '32px', fill: '#000'});

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms)
    this.physics.add.collider(player, bombs, hitBomb, null, this);



}
function update() {

    if (gameover){
        return
    }

    if (cursors.left.isDown) {
        
        player.setVelocityX(-160);

        player.anims.play('left', true)

    } else if (cursors.right.isDown) {
        
    player.setVelocityX(160);
    
      player.anims.play('right', true)
        
    }else {
    
       player.setVelocityX(0);
    
      player.anims.play('turn')

} if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
}
}
function collectStar(player, star) {
    star.disableBody(true, true)

    score  +=10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
       child.enableBody(true, child.x, 0, true, true);
    });
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)
    var bomb = bombs.create(x, 16, 'bomb')
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

}
}
function hitBomb(player, bomb) {

    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');

    gameover= true;

}
function restartGame() {
    gameover = false;
    score = 0;
    scoreText.setText('Score: ' + score);
    player.clearTint();
    player.setPosition(100, 450);
    player.setVelocity(0, 0);
    stars.children.iterate(function(child) {
        child.enableBody(true, child.x, 0, true, true);
    });
    bombs.clear(true, true);
}
document.getElementById('restart').addEventListener('click', function() {
    restartGame();
}   );