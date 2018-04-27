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
      }
    };

    this.body = Bodies.circle(x, y, this.rad, params);
    World.add(engine.world, this.body);

    console.log(this.body);
  }

  render() {
    let x = this.body.position.x;
    let y = this.body.position.y;

    let diam = this.rad * 2;
    fill(this.color.r, this.color.g, this.color.b);
    ellipse(x, y, diam, diam);
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