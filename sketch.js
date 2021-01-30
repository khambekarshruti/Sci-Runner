var backGround, backGroundImage, invisibleGround;
var platform, platformImage, platformGroup, invisiblePlatform, invisiblePlatformGroup;

var runner, runnerActive, runnerJump, runnerEnd;

var gameOver, gameOverImage;
var restart, restartImage;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var score = 0;
var timer = 2;

function preload() {
  backGroundImage = loadImage("background.png");
  platformImage = loadImage("dotted rectangle.png");

  runnerActive = loadAnimation("runner1.png","runner2.png","runner3.png","runner4.png","runner5.png","runner6.png","runner7.png","runner8.png","runner9.png","runner10.png","runner11.png","runner12.png",)
  runnerJump = loadAnimation("runner6.png");
  runnerEnd = loadAnimation("runner8.png");

  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);

  platformGroup = createGroup();
  invisiblePlatformGroup = createGroup();

  backGround = createSprite(200,132,20,20);
  backGround.addImage(backGroundImage);
  backGround.velocityX = -8;

  invisibleGround = createSprite(300,183,950,6);
  invisibleGround.visible = false;
  invisibleGround.velocityX = -8;

  runner = createSprite(40,140,20,20);
  runner.addAnimation("active",runnerActive);
  runner.addAnimation("jump",runnerJump);
  runner.addAnimation("end",runnerEnd);
  runner.scale = 0.3;

  gameOver = createSprite(300,50,20,20);
  gameOver.addImage(gameOverImage);
  gameOver.visible = false;

  restart = createSprite(300,130,20,20);
  restart.addImage(restartImage);
  restart.scale = 0.15;
  restart.visible = false;
}

function draw() {
  background("white");

  textSize(18);
  text("Score: " + score,500,20);
  text("Timer: " + timer,500,40);

  if(keyWentDown("UP") && gameState === PLAY){
    runner.velocityY = -12;
  }else if(keyDown("RIGHT") && gameState === PLAY){
    runner.x = runner.x + 6;
  }else if(keyDown("LEFT") && gameState === PLAY){
    runner.x = runner.x - 6;
  }else{
    runner.velocityX = 0;
  }

  if(gameState === PLAY){
    
    spawnPlatform();

    if(frameCount % 30 === 0){
      timer = timer - 1;
      score = score + 1;
    }

    if(backGround.isTouching(runner) || platformGroup.isTouching(runner)){
      runner.changeAnimation("active",runnerActive);
      timer = 2;
    }else{
      runner.changeAnimation("jump",runnerJump);
    }

    runner.velocityY = runner.velocityY + 0.8;
    runner.collide(invisibleGround);
    runner.collide(invisiblePlatformGroup);

    if(runner.x <= 0 || runner.y >= 200 || timer === 0){
      gameState = END;
    }

  }else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;

    runner.velocityY = 0;
    runner.velocityX = 0;
    backGround.velocityX = 0;
    invisibleGround.velocityX = 0;
    platformGroup.setVelocityXEach(0);
    invisiblePlatformGroup.setVelocityXEach(0);
    
    runner.changeAnimation("end",runnerEnd);
    
    platformGroup.setLifetimeEach(-1);
    invisiblePlatformGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)){
      reset();
    }
  }

  drawSprites();
}

function spawnPlatform(){
  if(frameCount % 30 === 0){
    var randY = Math.round(random(100,160));

    platform = createSprite(700,randY,20,20);
    platform.addImage(platformImage);
    platform.scale = 0.07;
    platform.velocityX = -8;
    platform.lifetime = 100;
    platformGroup.add(platform);

    invisiblePlatform = createSprite(700,randY + 5,90,10);
    invisiblePlatform.visible = false;
    invisiblePlatform.velocityX = -8;
    invisiblePlatform.lifetime = 100;
    invisiblePlatformGroup.add(invisiblePlatform);
  }
}

function reset(){
  gameOver.visible = false;
  restart.visible = false;

  gameState = PLAY;

  platformGroup.destroyEach();
  invisiblePlatformGroup.destroyEach();
  
  runner.x = 40;
  runner.y = 140;
  runner.changeAnimation("active",runnerActive);

  backGround.x = 200;
  invisibleGround.x = 200;
  backGround.velocityX = -8;
  invisibleGround.velocityX = -8;

  score = 0;
  timer = 2;
}