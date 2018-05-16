class planet {
  constructor(_x, _y, _r) {
    let x = _x; //random(100, width - 100); //width / 2;
    let y = _y; //random(100, height - 100); //height / 2;
    this.rad = _r; //random(50, 150);
    this.counter = [0, 8, 16];
    this.color = {
      r: 255,
      g: 255,
      b: 255
    };
    this.glow = [];
    for (let i = this.rad; i < this.rad * 1.5; i += 10) {
      this.glow.push(i);
    }


    let mainColor = random(["r", "g", "b"]);
    if (mainColor === "r") {
      this.color.r = 255;
      let colorFlip = random([0, 1]);
      if (colorFlip === 0) {
        this.color.g = random(125, 255);
        this.color.b = random(0, 120);
      } else {
        this.color.b = random(125, 255);
        this.color.g = random(0, 120);
      }
    }
    if (mainColor === "g") {
      this.color.g = 255;
      let colorFlip = random([0, 1]);
      if (colorFlip === 0) {
        this.color.r = random(125, 255);
        this.color.b = random(0, 120);
      } else {
        this.color.b = random(125, 255);
        this.color.r = random(0, 120);
      }
    }
    if (mainColor === "b") {
      this.color.b = 255;
      let colorFlip = random([0, 1]);
      if (colorFlip === 0) {
        this.color.r = random(125, 255);
        this.color.g = random(0, 120);
      } else {
        this.color.g = random(125, 255);
        this.color.r = random(0, 120);
      }
    }

    let params = {
      isStatic: true,
      friction: 0.01,
      mass: this.rad,
      label: 'planet',
      plugin: {
        attractors: [MatterAttractors.Attractors.gravity
          // function(bodyA, bodyB) {
          //   return {
          //     // x: (bodyA.position.x - bodyB.position.x) * 1e-6,
          //     // y: (bodyA.position.y - bodyB.position.y) * 1e-6,
          //   };
          // }
        ]
      },
      collisionFilter: {
        category: 0x0001,
        mask: 0x0002 | 0x0004
      }
    };

    this.body = Bodies.circle(x, y, this.rad, params);
    World.add(engine.world, this.body);

    console.log(this.body);

    introSound.play();
  }

  render() {
    let x = this.body.position.x;
    let y = this.body.position.y;

    for (let i = 0; i < this.glow.length; i++) {
      noFill();
      stroke(4);
      stroke(this.color.r, this.color.g, this.color.b, this.rad * 1.5 - this.glow[i]);
      ellipse(x, y, this.glow[i] * 2, this.glow[i] * 2);
      this.glow[i] += 0.1;
      if (this.glow[i] > this.rad * 1.5) {
        this.glow[i] = this.rad;
      }
    }

    let diam = this.rad * 2;
    noStroke();
    fill(this.color.r, this.color.g, this.color.b);
    ellipse(x, y, diam, diam);
  }

  kill(_i) {
    removeItem(1, _i);
    World.remove(world, this.body);
    console.log("killing planet" + _i);
  }
}

class gravitationalField {
  constructor(_x, _y) {
    let anchor = {
      x: _x,
      y: _y
    };
    this.point = Bodies.circle(_x, _y + 2, 0.5, {
      mass: 0.5,
      collisionFilter: {
        category: 4,
        mask: 4
      }
    });

    this.elastic = Constraint.create({
      pointA: anchor,
      bodyB: this.point,
      stiffness: 0.05
    });

    World.add(engine.world, [this.point, this.elastic]);
    // console.log(this.elastic);
  }

  render() {
    stroke(255);
    strokeWeight(1);
    line(this.elastic.pointA.x, this.elastic.pointA.y,
      this.point.position.x, this.point.position.y);
  }

}