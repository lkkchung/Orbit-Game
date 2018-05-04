const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const World = Matter.World;
const Vector = Matter.Vector;
const Body = Matter.Body;
const Events = Matter.Events;
const Constraint = Matter.Constraint

// Matter.use(
//   'matter-attractors' // PLUGIN_NAME
// );

let engine;
let world;

//-----universal variables-----

//game objects
let sparks = [];
let planets = [];
let points = [];
let rockets = [];
let deadRockets = [];
let trailPoints = [];
let dusts = [];
let startPos = {
  x: 0,
  y: 0
};

//text objects
let title;
let ready;
let success;
let gameOver;
let lost;
let crash;
let sprayTitle = [];
let fadeIn = 800;

//flow
let levelIndex = 0;
let levelMiddle = false;
let messageIndex = 0;
let levelFlow = {
  title: true,
  titleCountdown: 3 * 60,
  successCountdown: 3 * 60,
  stage: 0, //0 for intro, 1 for active portion, 2 for end
}

//inputs
let angleValue = 0;
let powerValue = 2;

let browserSize = {
  browserWidth: window.innerWidth || document.body.clientWidth,
  browserHeight: window.innerHeight || document.body.clientHeight
}


function preload() {
  title = loadImage('assets/Title.png');
  ready = loadImage('assets/ready.png');
  success = loadImage('assets/success.png');
  gameOver = loadImage('assets/game_over.png');
  crash = loadImage('assets/crash.png');
  lost = loadImage('assets/lost.png');
}

function setup() {
  createCanvas(browserSize.browserWidth, browserSize.browserHeight);

  engine = Engine.create();
  world = engine.world;

  engine.timing.timeScale = 1;

  world.gravity.scale = 0; //1e-4;
  world.frictionAir = 0;

  for (let i = 0; i <= 200; i++) {
    dusts.push(new spaceDust(random(width)));
  }


}

function draw() {
  background(0);

  if (levelFlow.stage == 1) {

    noStroke();
    fill(255);
    textSize(12);
    textAlign(RIGHT);
    text("ANGLE", 55, 24);
    text("POWER", 55, 54);

    textAlign(LEFT);
    text(int(degrees(angleValue)), 60, 24);
    text(int(powerValue * 10), 60, 54);
  }



  if (levelIndex == 0) {
    startMenu();
  } else {
    if (levelMiddle == false) {
      if (levelIndex == 1) {
        level1();
      }
      if (levelIndex == 2) {
        level2();
      }
      if (levelIndex == 3) {
        level3();
      }
      if (levelIndex == 4) {
        level4();
      }
      if (levelIndex == 5) {
        level5();
      }
    }
    drawLevels();
  }

  if (keyIsDown(LEFT_ARROW)) {
    powerValue -= 0.05;
    if (powerValue <= 2) {
      powerValue = 2;
    }
  } else if (keyIsDown(RIGHT_ARROW)) {
    powerValue += 0.05;
    if (powerValue >= 12) {
      powerValue = 12;
    }
  }

  if (keyIsDown(UP_ARROW)) {
    angleValue -= PI / 360;
    if (angleValue <= -PI / 2) {
      angleValue = -PI / 2;
    }
  } else if (keyIsDown(DOWN_ARROW)) {
    angleValue += PI / 360;
    if (angleValue >= PI / 2) {
      angleValue = PI / 2;
    }
  }
}

function drawLevels() {
  Engine.update(engine, 60);
  Events.on(engine, 'collisionStart', collision);

  if (levelFlow.stage == 1) {
    stroke(100 * sin(degrees(frameCount * 0.001)) + 200);
    noFill();
    strokeWeight(1);
    push();
    translate(startPos.x, startPos.y);
    rotate(angleValue);
    rocketDraw();

    stroke(255, 0, 62, 100 * sin(degrees(frameCount * 0.001)) + 200);
    strokeWeight(3);
    ellipse(0, 0, 80, 80);

    strokeWeight(1);
    push();
    translate(powerValue, 0);
    rocketDraw();
    translate(powerValue, 0);
    rocketDraw();
    translate(powerValue, 0);
    rocketDraw();
    translate(powerValue, 0);
    rocketDraw();

    pop();

    pop();

  }

  function collision(event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      let bodyA = pairs[i].bodyA.label; //checking to see which things collided
      let bodyB = pairs[i].bodyB.label;

      if (bodyA === 'rocket') {
        killRocket(pairs[i].bodyA.id); //sending id of collided rocket
      }
      if (bodyB === 'rocket') {
        killRocket(pairs[i].bodyB.id);
      }
    }
  }

  // for (let i = 0; i < points.length; i++) {
  //   for (let j = 0; j < points[i].length; j++) {
  //     points[i][j].render();
  //   }
  // }

  for (let i = planets.length - 1; i >= 0; i--) {
    planets[i].render();
  }

  for (let i = rockets.length - 1; i >= 0; i--) {
    rockets[i].render();
    rockets[i].update();
    // rockets[i].kill(i);
  }

  for (let i = sparks.length - 1; i >= 0; i--) {
    sparks[i].render();
    sparks[i].update();
    sparks[i].kill(i);
  }

  for (let i = trailPoints.length - 1; i >= 0; i--) {
    trailPoints[i].render();
    if (i >= 800) {
      removeItem(4, 0);
    }
  }

  for (let i = dusts.length - 1; i >= 0; i--) {
    dusts[i].render();
  }

  if (keyIsPressed && keyCode === RETURN) {
    levelFlow.stage = 2;
    levelMiddle = false;
    resetAll();
  }
}

function keyPressed() {
  if (keyCode == 32) {
    if (levelFlow.stage == 1) {
      for (let i = 0; i < 1; i++) {
        rockets.push(new rocket(startPos.x, startPos.y,
          powerValue * cos(angleValue), powerValue * sin(angleValue)));
      }
    }
  }
}

function rocketDraw() {
  beginShape();
  vertex(6, 0);
  vertex(-6, -5);
  vertex(-4, 0);
  vertex(-6, 5);
  vertex(6, 0);
  endShape();
}

function killRocket(_id) {
  for (let i = 0; i < rockets.length; i++) {
    if (rockets[i].body.id === _id) { //checking matter id against each rocket
      rockets[i].kill(i); //sending kill order to matching rocket
    }
  }
}

function removeItem(_item, _index) {
  if (_item == 1) {
    planets.splice(_index, 1);
  }
  if (_item == 2) {
    rockets.splice(_index, 1);
  }
  if (_item == 3) {
    sparks.splice(_index, 1);
  }
  if (_item == 4) {
    trailPoints.splice(_index, 1);
  }
}

function resetAll() {
  for (let i = 0; i < planets.length; i++) {
    planets.kill(i);
  }
  for (let i = 0; i < rockets.length; i++) {
    rockets.kill(i);
  }

  dusts.splice(0, dusts.length);
  trailPoints.splice(0, trailPoints.length);

  levelFlow.titleCountdown = 3 * 60;
  levelFlow.successCountdown = 3 * 60;
  fadeIn = 255;
}

function explosion(_x, _y, _vX, _vY, _type) {
  for (let i = 0; i < 20; i++) {
    sparks.push(new spark(_x, _y, _vX, _vY, _type));
  }
}

function grav(_x, _y, _m) {
  let g = 0.05;
  let pos = Vector.create(_x, _y);

  let gForce = Vector.create(0, 0);

  for (let i = 0; i < planets.length; i++) {
    let eachDir = Vector.sub(planets[i].body.position, pos);
    let dSquared = Vector.magnitudeSquared(eachDir);
    let eachMag = g * planets[i].body.mass * _m / dSquared;
    let eachForce = Vector.mult(Vector.normalise(eachDir), eachMag);

    gForce = Vector.add(gForce, eachForce);
  }

  return gForce;
}