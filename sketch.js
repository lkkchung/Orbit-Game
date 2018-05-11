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
  y: 0,
  t: 0
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
let launching = false;
let readyToLaunch = false;
let distSensor = [0, 0];


//sounds
let explosions = [];
let introSound;

//serial variables
let serial; // variable to hold an instance of the serialport library
let portName = '/dev/cu.usbmodem1441';
let inData; // for incoming serial data

//interface variabls
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

  soundFormats('wav');
  explosion[0] = loadSound('assets/Explosion_01.wav');
  explosion[1] = loadSound('assets/Explosion_02.wav');
  introSound = loadSound('assets/Intro.wav');
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

  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port

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
    text("READY TO LAUNCH", 55, 84);

    textAlign(LEFT);
    text(int(degrees(angleValue)), 60, 24);
    text(int(powerValue), 60, 54);
    text(readyToLaunch, 60, 84);
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
        // // level5();
        levelIndex = 0;
        setup();
      }
    }
    drawLevels();
  }

  // if (keyIsDown(LEFT_ARROW)) {
  //   powerValue -= 0.05;
  //   if (powerValue <= 2) {
  //     powerValue = 2;
  //   }
  // } else if (keyIsDown(RIGHT_ARROW)) {
  //   powerValue += 0.05;
  //   if (powerValue >= 12) {
  //     powerValue = 12;
  //   }
  // }

  // if (keyIsDown(UP_ARROW)) {
  //   angleValue -= PI / 360;
  //   if (angleValue <= -PI / 2) {
  //     angleValue = -PI / 2;
  //   }
  // } else if (keyIsDown(DOWN_ARROW)) {
  //   angleValue += PI / 360;
  //   if (angleValue >= PI / 2) {
  //     angleValue = PI / 2;
  //   }
  // }
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

  for (let i = planets.length - 1; i >= 0; i--) {
    planets[i].render();
  }

  for (let i = rockets.length - 1; i >= 0; i--) {
    rockets[i].render();
    rockets[i].update(i);
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

// function keyPressed() {
//   if (keyCode == 32) {
//     if (levelFlow.stage == 1) {
//       rocketLaunch();
//     }
//   }
// }

function serialEvent() {
  // read a string from the serial port:
  var inString = serial.readLine();
  // check to see that there's actually a string there:
  if (inString.length > 0) {
    console.log(inString);
    let sensors = split(inString, ",");
    if (sensors.length > 1) {
      distSensor.push(sensors[0] / 10);
      powerValue = sensors[0] / 10;
      angleValue = radians(sensors[1]);
      distSensor.splice(0, 1);
    }
  }

  rocketLaunch();
  //
  // if (inData >= 101) {
  //   angleValue -= PI / 360;
  //   if (angleValue <= -PI / 2) {
  //     angleValue = -PI / 2;
  //   }
  // } else if (inData <= 201) {
  //   angleValue += PI / 360;
  //   if (angleValue >= PI / 2) {
  //     angleValue = PI / 2;
  //   }
  // }
}

function rocketLaunch() {
  if (distSensor[distSensor.length - 1] >= 2) {
    readyToLaunch = true;
  }

  if (readyToLaunch === true) {
    if (distSensor[distSensor.length - 1] <= 1) {
      powerValue = max(distSensor);
      rockets.push(new rocket(startPos.x, startPos.y,
        powerValue * cos(angleValue + startPos.t), powerValue * sin(angleValue + startPos.t)));
      readyToLaunch = false;
    }
  }

  // if (launching === true && readyToLaunch === true) {
  //   rockets.push(new rocket(startPos.x, startPos.y,
  //     powerValue * cos(angleValue + startPos.t), powerValue * sin(angleValue + startPos.t)));
  // }
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
    planets[i].kill(i);
  }
  for (let i = 0; i < rockets.length; i++) {
    rockets[i].kill(i);
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

function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + " " + portList[i]);
  }
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}


function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}