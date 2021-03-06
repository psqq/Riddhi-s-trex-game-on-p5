var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score, highScore;

var isFalling = false;
var maxJumpYPosition = 50;
var eps = 1e-3;

var PLAY = 1;
var END = 0;

var Gamestate = PLAY;

var restartButton;

var can;

function preload() {
  trex_running = loadAnimation("./images/trex1.png", "./images/trex3.png", "./images/trex4.png");
  trex_collided = loadAnimation("./images/trex_collided.png");

  groundImage = loadImage("./images/ground2.png");

  cloudImage = loadImage("./images/cloud.png");

  obstacle1 = loadImage("./images/obstacle1.png");
  obstacle2 = loadImage("./images/obstacle2.png");
  obstacle3 = loadImage("./images/obstacle3.png");
  obstacle4 = loadImage("./images/obstacle4.png");
  obstacle5 = loadImage("./images/obstacle5.png");
  obstacle6 = loadImage("./images/obstacle6.png");

  restartButton = createImg("./images/restart.png");
  restartButton.elt.width = 32;
  restartButton.elt.height = 32;
  restartButton.addClass("button");
}

function startNewGame() {
  score = 0;
  ground.velocityX = -4;
  trex.changeAnimation("running");
  obstaclesGroup.removeSprites();
  cloudsGroup.removeSprites();
  Gamestate = PLAY;
}

function setup() {
  can = createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;

  trex.addAnimation("collided", trex_collided);

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -4;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;

  highScore = localStorage.getItem("high-score") || 0;

  restartButton.position(can.elt.width + can.elt.offsetLeft - restartButton.elt.width, can.elt.offsetTop);
  restartButton.mousePressed(startNewGame);
}

function windowResized() {
  restartButton.position(can.elt.width + can.elt.offsetLeft - restartButton.elt.width, can.elt.offsetTop);
}

function draw() {
  background(180);

  // PLAY STATE
  if (Gamestate === PLAY) {

    if (keyDown("space") && !isFalling) {
      trex.velocityY = -10;
      if (trex.position.y < maxJumpYPosition) {
        isFalling = true;
      }
    } else if (!isFalling && !trex.isTouching(ground)) {
      isFalling = true;
    } else if (isFalling && trex.isTouching(ground)) {
      isFalling = false;
    }
    score = score + Math.round(getFrameRate() / 60);
    if (score > highScore) {
      highScore = score;
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    spawnClouds();
    spawnObstacles();

    if (trex.isTouching(obstaclesGroup)) {
      Gamestate = END;
      localStorage.setItem("high-score", highScore);
    }
  }
  // GAME OVER STATE
  else if (Gamestate === END) {
    ground.velocityX = 0;
    trex.changeAnimation("collided");
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    for (let obstacle of obstaclesGroup) {
      obstacle.lifetime = 300;
    }
    for (let cloud of cloudsGroup) {
      cloud.lifetime = 300;
    }
  }

  // COMMON CODE
  text("Score: " + score, 500, 50);
  text("High score: " + highScore, 500, 70);
  trex.velocityY = trex.velocityY + 0.8;
  trex.collide(invisibleGround);

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if ((frameCount - 10) % 45 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -random(2.9, 3.1);

    //assign lifetime to the variable
    cloud.lifetime = 300;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if ((frameCount - 10) % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -4;

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}