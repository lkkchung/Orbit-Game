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

//text objects
let title;
let sprayTitle = [];

//flow
let levelIndex = 0;
let levelStart = true;
let messageIndex = 0;
let levelPhase = 0;
let levelFlow = {
  title: true,
  titleCountdown: 3 * 60,
  stage: 0, //0 for intro, 1 for active portion, 2 for end
}

//inputs
let angleSlider;
let powerSlider;


function preload() {
  title = loadImage('assets/Title.png');

}

function setup() {
  createCanvas(800, 600);

  engine = Engine.create();
  world = engine.world;

  engine.timing.timeScale = 1;

  world.gravity.scale = 0; //1e-4;
  world.frictionAir = 0;

  angleSlider = createSlider(0, 2 * PI, 0);
  angleSlider.position(65, 10);
  angleSlider.style('width', '80px');

  powerSlider = createSlider(0, 10, 0);
  powerSlider.position(65, 40);
  powerSlider.style('width', '80px');

}

function draw() {
  background(0);

  noStroke();
  fill(255);
  textSize(12);
  textAlign(RIGHT);
  text("ANGLE", 55, 24);
  text("POWER", 55, 54);



  if (levelIndex == 0) {
    startMenu();
  } else {
    if (levelStart == true) {
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
}

function drawLevels() {
  Engine.update(engine, 60);
  Events.on(engine, 'collisionStart', collision);

  stroke(200 * sin(degrees(frameCount * 0.001)) + 50);
  noFill();
  strokeWeight(1);

  push();
  translate(width / 2, 150);
  rotate(angleSlider.value());
  beginShape();
  vertex(10, 0);
  vertex(-2.5, -5);
  vertex(2.5, 0);
  vertex(-2.5, 5);
  vertex(10, 0);
  endShape();
  pop();

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

  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points[i].length; j++) {
      points[i][j].render();
    }
  }

  for (let i = sparks.length - 1; i >= 0; i--) {
    sparks[i].render();
    sparks[i].update();
    sparks[i].kill(i);
  }

  for (let i = planets.length - 1; i >= 0; i--) {
    planets[i].render();
  }

  for (let i = rockets.length - 1; i >= 0; i--) {
    rockets[i].render();
    rockets[i].update();
    // rockets[i].kill(i);
  }

}

function mousePressed() {
  if (levelFlow.stage == 1) {
    for (let i = 0; i < 1; i++) {
      let ang = angleSlider.value();
      let pow = powerSlider.value();
      rockets.push(new rocket(width / 2, 150, pow * cos(ang), pow * sin(ang)));
      explosion(width / 2, 150, pow * cos(ang + PI), pow * sin(ang + PI));
    }
  }
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
}

function explosion(_x, _y, _vX, _vY) {
  for (let i = 0; i < 20; i++) {
    sparks.push(new spark(_x, _y, _vX, _vY));
  }
}