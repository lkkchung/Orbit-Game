class rocket {
  constructor(_x, _y) {
    let params = {
      frictionAir: 0,
      mass: 1e-4
      // force: {
      //   x: 1,
      //   y: 0,
      // }
    }
    this.body = Bodies.circle(_x, _y, 10, params);
    World.add(engine.world, this.body);

    Body.setVelocity(this.body, {
      x: 5,
      y: 0
    });

    this.lastPos = {
      x: _x,
      y: _y
    };
  }

  update() {
    let x = this.body.position.x;
    let y = this.body.position.y;

    // let eachDir = [];
    let gDir = Vector.sub(planets[0].body.position, this.body.position);
    // console.log(gDir);
    // for(let i = 0; i < planets.length; i++){
    //
    // }
    let dSquared = Vector.magnitudeSquared(gDir);
    let g = 0.05;
    let gMag = g * planets[0].body.mass * this.body.mass / dSquared;

    let gForce = Vector.mult(Vector.normalise(gDir), gMag);

    let newVelocity = Vector.add(this.body.velocity, gDir);

    Body.applyForce(this.body, this.body.position, gForce);

  }

  render() {
    let x = this.body.position.x;
    let y = this.body.position.y;

    let alignment = Vector.create(x - this.lastPos.x, y - this.lastPos.y);
    let angle = Vector.angle(Vector.create(1, 0), alignment);

    stroke(255);
    noFill();
    strokeWeight(0.5);

    push();
    translate(x, y);
    rotate(angle);
    beginShape();
    vertex(10, 0);
    vertex(-2.5, -5);
    vertex(2.5, 0);
    vertex(-2.5, 5);
    vertex(10, 0);
    endShape();
    pop();
    this.lastPos = {
      x: x,
      y: y
    };
  }
}

class particle {
  constructor(_x, _y) {
    this.rad = 5; //random(5, 20);
    let coinToss = [-1, 1];
    let xForce = random(coinToss) * random(0, 0.2);
    let yForce = random(coinToss) * random(0, sqrt(0.04 - xForce * xForce));
    let params = {
      friction: 0.01,
      mass: this.rad * 4,
      restitution: 0.9,
      force: {
        x: 0.1 / 2,
        y: 0
      }
    };

    this.body = Bodies.circle(_x, _y, this.rad, params);
    World.add(engine.world, this.body);
    // console.log(this.body.position.y);
    // console.log(this.body);

    this.countdown = 10;
  }

  update(_i) {
    let originalRad = this.rad;
    // this.rad -= 0.2;
    Matter.Body.scale(this.body, this.rad / originalRad, this.rad / originalRad);

    this.countdown -= 0.01;

    if (this.countdown < 0.01) {
      removeItem(_i);
      World.remove(world, this.body);
      return 1;
    }
    return 0;
  }

  render() {
    let x = this.body.position.x;
    let y = this.body.position.y;
    fill(255);
    noStroke();
    ellipse(x, y, this.rad * 2, this.rad * 2);

    if (x > width * 2 || x < width * -1 ||
      y > height * 2 || x < height * -1) {
      World.remove(engine.world, this.body);
    }
  }
}