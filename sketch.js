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

//universal variables
let sparks = [];
let planets = [];
let points = [];
let rockets = [];
let deadRockets = [];

let title;
let sprayTitle = [];

let levelIndex = 0;
let levelStart = true;
let messageIndex = 0;


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


}

function draw() {
  background(0);
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

function mousePressed() {
  for (let i = 0; i < 1; i++) {
    rockets.push(new rocket(mouseX, mouseY, 10, 0));
  }
}

function killRocket(_id) {
  for (let i = 0; i < rockets.length; i++) {
    if (rockets[i].body.id === _id) {
      rockets[i].kill(i);
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