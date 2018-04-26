const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const World = Matter.World;
const Vector = Matter.Vector;
const Body = Matter.Body;
const Events = Matter.Events;

Matter.use(
  'matter-attractors' // PLUGIN_NAME
);

let engine;
let world;
let sparks = [];

let bottom;

function setup() {
  createCanvas(800, 800);

  engine = Engine.create();
  world = engine.world;
  world.gravity.scale = 1e-4;

  let params = {
    isStatic: true,
    restitution: 0.2,
  };

  bottom = Bodies.rectangle(width / 2, height - 10, width, 20, params);
  World.add(engine.world, bottom);
}

function draw() {
  background(0, 100);
  Engine.update(engine, 60);
  Events.on(engine, 'collisionStart', collision);
  sparks.push(new particle(mouseX, mouseY));

  function collision(event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      let bodyA = pairs[i].bodyA;
      let bodyB = pairs[i].bodyB;
    }

  }

  fill(100);
  rectMode(CENTER);
  rect(width / 2, height - 10, width, 20);

  for (let i = 0; i < sparks.length; i++) {
    sparks[i].render();
    i -= sparks[i].update(i);
  }
}

function mousePressed() {
  for (let i = 0; i < 20; i++) {
    sparks.push(new particle(mouseX, mouseY));
  }
}

class particle {
  constructor(_x, _y) {
    this.rad = random(5, 20);
    let coinToss = [-1, 1];
    let xForce = random(coinToss) * random(0, 0.05);
    let yForce = random(coinToss) * random(0, sqrt(0.0025 - xForce * xForce));
    let params = {
      friction: 0.01,
      mass: this.rad * 2,
      restitution: 0.9,
      force: {
        x: xForce,
        y: yForce
      }
    };

    this.body = Bodies.circle(_x, _y, this.rad, params);
    World.add(engine.world, this.body);
    // console.log(this.body.position.y);
    // console.log(this.body);
  }

  update(_i) {
    let originalRad = this.rad;
    this.rad -= 0.2;
    Matter.Body.scale(this.body, this.rad / originalRad, this.rad / originalRad);

    if (this.rad < 1) {
      removeItem(_i);
      World.remove(world, this.body);
      return 1;
    }
    return 0;
  }

  render() {
    fill(255);
    noStroke();
    ellipse(this.body.position.x, this.body.position.y, this.rad * 2, this.rad * 2);

    if (this.body.position.x > width * 2 || this.body.position.x < width * -1 ||
      this.body.position.y > height * 2 || this.body.position.x < height * -1) {
      World.remove(engine.world, this.body);
    }
  }
}

function removeItem(_i) {
  sparks.splice(_i, 1);
}