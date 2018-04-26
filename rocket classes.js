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
    let y = this.body.position.y
    fill(255);
    noStroke();
    ellipse(x, y, this.rad * 2, this.rad * 2);

    if (x > width * 2 || x < width * -1 ||
      y > height * 2 || x < height * -1) {
      World.remove(engine.world, this.body);
    }
  }
}