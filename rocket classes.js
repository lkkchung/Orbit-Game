class rocket {
  constructor(_x, _y, _vX, _vY) {
    let params = {
      frictionAir: 0,
      mass: 1e-4,
      restitution: 0.8,
      label: 'rocket',
      collisionFilter: {
        category: 0x0002,
        mask: 0x0001 | 0x0002
      }
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

    explosion[1].play();

    explosion(_x, _y, powerValue * cos(angleValue + PI), powerValue * sin(angleValue + PI), 2);

    console.log(this.body);
  }

  update(_i) {
    let x = this.body.position.x;
    let y = this.body.position.y;
    let m = this.body.mass;

    Body.applyForce(this.body, this.body.position, grav(x, y, m));
    this.countdown -= 1;

    if (x > 3000 || x < -1560 || y > 3000 || y < -2100) {
      this.kill(_i);
    }
  }

  render() {
    let x = this.body.position.x;
    let y = this.body.position.y;

    let offScreen = false;

    let alignment = Vector.create(x - this.lastPos.x, y - this.lastPos.y);
    let angle = Vector.angle(Vector.create(1, 0), alignment);

    this.lastPos = {
      x: x,
      y: y
    };

    trailPoints.push(new trail(x, y, Vector.magnitude(this.body.velocity)));

    //this gives a little indicator that the ship is off screen.
    if (x >= width - 30) {
      x = width - 30;
      offScreen = true;
    }
    if (x <= 30) {
      x = 30;
      offScreen = true;
    }
    if (y >= height - 30) {
      y = height - 30;
      offScreen = true;
    }
    if (y <= 30) {
      y = 30;
      offScreen = true;
    }

    noFill();
    push();
    translate(x, y);
    rotate(angle);
    if (offScreen == true) {
      strokeWeight(3);
      stroke(255, 100 * sin(degrees(frameCount * 0.001)) + 200);
      ellipse(0, 0, 40, 40);
    }

    stroke(255);
    strokeWeight(1);
    rocketDraw();
    pop();
  }

  kill(_i) {
    let x = this.body.position.x;
    let y = this.body.position.y;
    let velX = this.body.velocity.x;
    let velY = this.body.velocity.y;

    explosion[0].play();

    removeItem(2, _i);
    World.remove(world, this.body);
    // console.log("killing rocket");
    explosion(x, y, velX, velY, 0);
    explosion(x, y, velX, velY, 1);
  }
}

class spark {
  constructor(_x, _y, _vX, _vY, _type) {
    this.rad = random(3, 10);
    // let coinToss = [-1, 1];
    // let xForce = random(coinToss) * random(0, 0.2);
    // let yForce = random(coinToss) * random(0, sqrt(0.04 - xForce * xForce));
    let params = {
      friction: 0.9,
      mass: 1,
      restitution: 0.9,
      collisionFilter: {
        category: 0x0004,
        mask: 0x0001 | 0x0002
      }
    };

    this.type = _type;

    if (this.type == 1) {
      this.color = random(['#222222', '#777777', '#bbbbbb']);

    } else {
      this.color = random(['#ff003e', '#ff723e', '#ffaa3e', '#ff4f3e', '#ffe43e']);
    }
    this.body = Bodies.circle(_x, _y, this.rad, params);
    World.add(engine.world, this.body);
    // console.log(this.body.position.y);
    // console.log(this.body);

    Body.setVelocity(this.body, {
      x: 1.2 * random(_vX - 2, _vX + 2),
      y: 1.2 * random(_vY - 2, _vY + 2)
    });

    Body.setAngularVelocity(this.body, random(1));
  }

  update() {
    let x = this.body.position.x;
    let y = this.body.position.y;
    let m = this.body.mass;

    let originalRad = this.rad;
    this.rad *= 0.95;
    Matter.Body.scale(this.body, this.rad / originalRad, this.rad / originalRad);

    // Body.applyForce(this.body, this.body.position, grav(x, y, m));
  }

  render() {
    let x = this.body.position.x;
    let y = this.body.position.y;
    // fill(255);
    noStroke();
    fill(this.color);

    push();
    translate(x, y);

    if (this.type == 1) {
      rotate(this.body.angle);
      rectMode(CENTER);
      rect(0, 0, this.rad * 2, this.rad);
    } else {
      ellipse(0, 0, this.rad * 2, this.rad * 2);
    }

    pop();

    if (x > width * 2 || x < width * -1 ||
      y > height * 2 || x < height * -1) {
      World.remove(engine.world, this.body);
    }
  }

  kill(_i) {
    if (this.rad <= 0.05) {
      removeItem(3, _i);
      World.remove(world, this.body);
    }
  }
}

class trail {
  constructor(_x, _y, _v) {
    this.x = _x;
    this.y = _y;
    this.v = map(_v, 0, 15, 0, 64);
    this.t = 0;
  }

  render() {
    strokeWeight(2);
    colorMode(HSL, 255);
    let hue = 40 + this.v;
    stroke(this.v + 161, 255, 120, 255 - 3 * (this.t % 50));
    point(this.x, this.y, 2, 2);
    colorMode(RGB, 255);

    this.t += 1;

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