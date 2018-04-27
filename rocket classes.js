class rocket {
  constructor(_x, _y, _vX, _vY) {
    let params = {
      frictionAir: 0,
      mass: 1e-4,
      restitution: 0.8,
      label: 'rocket'
    }
    this.body = Bodies.circle(_x, _y, 10, params);
    World.add(engine.world, this.body);

    Body.setVelocity(this.body, {
      x: _vX,
      y: _vY
    });

    this.lastPos = {
      x: _x,
      y: _y
    };
    this.countdown = 100;

    console.log(this.body);
  }

  update() {
    let x = this.body.position.x;
    let y = this.body.position.y;

    let g = 0.05;

    let gForce = Vector.create(0, 0);

    for (let i = 0; i < planets.length; i++) {
      let eachDir = Vector.sub(planets[i].body.position, this.body.position);
      let dSquared = Vector.magnitudeSquared(eachDir);
      let eachMag = g * planets[i].body.mass * this.body.mass / dSquared;
      let eachForce = Vector.mult(Vector.normalise(eachDir), eachMag);

      gForce = Vector.add(gForce, eachForce);
    }

    Body.applyForce(this.body, this.body.position, gForce);
    this.countdown -= 1;
  }

  render() {
    let x = this.body.position.x;
    let y = this.body.position.y;

    let alignment = Vector.create(x - this.lastPos.x, y - this.lastPos.y);
    let angle = Vector.angle(Vector.create(1, 0), alignment);

    stroke(255);
    noFill();
    strokeWeight(1);

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

  kill(_i) {
    let x = this.body.position.x;
    let y = this.body.position.y;
    let velX = this.body.velocity.x;
    let velY = this.body.velocity.y;

    removeItem(2, _i);
    World.remove(world, this.body);
    // console.log("killing rocket");
    explosion(x, y, velX, velY);
  }
}

class spark {
  constructor(_x, _y, _vX, _vY) {
    this.rad = random(0.5, 2);
    // let coinToss = [-1, 1];
    // let xForce = random(coinToss) * random(0, 0.2);
    // let yForce = random(coinToss) * random(0, sqrt(0.04 - xForce * xForce));
    let params = {
      friction: 0.9,
      mass: this.rad * 0.01,
      restitution: 0.9,
      collisionFilter: {
        category: 4,
        mask: 4
      }
    };

    this.body = Bodies.circle(_x, _y, this.rad, params);
    World.add(engine.world, this.body);
    // console.log(this.body.position.y);
    // console.log(this.body);

    Body.setVelocity(this.body, {
      x: 1.2 * random(_vX - 2, _vX + 2),
      y: 1.2 * random(_vY - 2, _vY + 2)
    });
  }

  update() {
    let originalRad = this.rad;
    this.rad -= 0.08;
    Matter.Body.scale(this.body, this.rad / originalRad, this.rad / originalRad);

    let g = 0.05;

    let gForce = Vector.create(0, 0);

    for (let i = 0; i < planets.length; i++) {
      let eachDir = Vector.sub(planets[i].body.position, this.body.position);
      let dSquared = Vector.magnitudeSquared(eachDir);
      let eachMag = g * planets[i].body.mass * this.body.mass / dSquared;
      let eachForce = Vector.mult(Vector.normalise(eachDir), eachMag);

      gForce = Vector.add(gForce, eachForce);
    }

    Body.applyForce(this.body, this.body.position, gForce);
  }

  render() {
    let x = this.body.position.x;
    let y = this.body.position.y;
    // fill(255);
    // noStroke();
    stroke(255, 200, 0);
    strokeWeight(1);
    noFill();
    ellipse(x, y, this.rad * 2, this.rad * 2);

    if (x > width * 2 || x < width * -1 ||
      y > height * 2 || x < height * -1) {
      World.remove(engine.world, this.body);
    }
  }

  kill(_i) {
    if (this.rad <= 0) {
      removeItem(3, _i);
      World.remove(world, this.body);
    }
  }
}