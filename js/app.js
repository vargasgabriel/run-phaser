var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
}

var player;
var platforms;
var cursors;

var stars;
var baddie;
var score = 0;
var scoreText;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.world.setBounds(0, 0, 1920, 600);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    background = game.add.tileSprite(0, 0, 1920, 600, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 32, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(4.8, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    for (var i = 0; i < 4; i++) {
        var position_x = Math.floor(Math.random() * (1920 - 50)) + 50,
            position_y = Math.floor(Math.random() * (550 - 450)) + 450;

        var ledge = platforms.create(position_x, position_y, 'ground');
        ledge.body.immovable = true;

        var scale_x = Math.random() * (0.5 - 0.25) + 0.25;
        ledge.scale.setTo(scale_x, 0.25);
    }

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    game.camera.follow(player);

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    baddie = game.add.sprite(512, game.world.height - 150, 'baddie');
    game.physics.arcade.enable(baddie);

    baddie.body.bounce.y = 0.1;
    baddie.body.gravity.y = 300;
    baddie.body.collideWorldBounds = true;
    baddie.animations.add('left', [0, 1], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(baddie, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    baddie.body.velocity.x = 0;

    for (var i = 1888; i > 128; i--) {
        baddie.body.velocity.x = -220;
        
        baddie.animations.play('left');
    }

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -250;

        player.animations.play('left');

        background.tilePosition.x -= 250;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 250;

        player.animations.play('right');

        background.tilePosition.x += 250;
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

}

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

function render () {
    game.debug.cameraInfo(game.camera, 32, 32);
}