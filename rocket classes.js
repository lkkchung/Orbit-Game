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

    explosion(_x, _y, powerValue * cos(angleValue + PI), powerValue * sin(angleValue + PI), 2);

    console.log(this.body);
  }

  update() {
    let x = this.body.position.x;
    let y = this.body.position.y;
    let m = this.body.mass;

    Body.applyForce(this.body, this.body.position, grav(x, y, m));
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
    rocketDraw();
    pop();
    this.lastPos = {
      x: x,
      y: y
    };

    trailPoints.push(new trail(x, y, Vector.magnitude(this.body.velocity)));
  }

  kill(_i) {
    let x = this.body.position.x;
    let y = this.body.position.y;
    let velX = this.body.velocity.x;
    let velY = this.body.velocity.y;

    removeItem(2, _i);
    World.remove(world, this.body);
    // console.log("killing rocket");
    explosion(x, y, velX, velY, 1);
  }
}

class spark {
  constructor(_x, _y, _vX, _vY, _type) {
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

    this.type = _type;
  }

  update() {
    let x = this.body.position.x;
    let y = this.body.position.y;
    let m = this.body.mass;

    let originalRad = this.rad;
    this.rad -= 0.08;
    Matter.Body.scale(this.body, this.rad / originalRad, this.rad / originalRad);

    Body.applyForce(this.body, this.body.position, grav(x, y, m));
  }

  render() {
    let x = this.body.position.x;
    let y = this.body.position.y;
    // fill(255);
    // noStroke();
    if (this.type == 1) {
      stroke(255, 200, 0);
    } else {
      stroke(100, 120, 255);
    }
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

class trail {
  constructor(_x, _y, _v) {
    this.x = _x;
    this.y = _y;
    this.v = map(_v, 0, 15, 0, 255);
  }

  render() {
    strokeWeight(2);
    stroke(this.v, 255, 255 - this.v);
    point
      (this.x, this.y, 2, 2);

  }
}

class spaceDust {
  constructor(_x) {
    this.x = _x;
    this.y = random(height);

    this.v = random(1, 10);
  }
  update(_i) {
    this.x -= this.v;
    if (this.x <= 0) {
      this.x = width;
    }
  }
  render() {
    stroke(255);
    strokeWeight(this.v / 2);
    point(this.x, this.y);
  }
}