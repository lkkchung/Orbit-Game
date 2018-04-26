const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const World = Matter.World;
const Vector = Matter.Vector;
const Body = Matter.Body;
const Events = Matter.Events;
const Constraint = Matter.Constraint

Matter.use(
  'matter-attractors' // PLUGIN_NAME
);

let engine;
let world;

//universal variables
let sparks = [];
let planets = [];
let points = [];
let rockets = [];

let title;
let sprayTitle = [];

let levelIndex = 0;
let levelStart = true;


function preload() {
  title = loadImage('assets/Title.png');

}

function setup() {
  createCanvas(800, 800);

  engine = Engine.create();
  world = engine.world;
  world.gravity.scale = 0; //1e-4;

  // let rows = 20;
  // let columns = 20;
  //
  // let xSpacing = width / columns;
  // let ySpacing = height / rows;
  //
  // for (let i = 0; i < rows; i++) {
  //   points[i] = [];
  //   for (let j = 0; j < columns; j++) {
  //     let xCoord = i * xSpacing + xSpacing / 2;
  //     let yCoord = j * ySpacing + ySpacing / 2;
  //
  //     points[i][j] = new gravitationalField(xCoord, yCoord);
  //   }
  // }
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
    rockets.push(new rocket(mouseX, mouseY));
  }
}

function removeItem(_i) {
  sparks.splice(_i, 1);
}