function startMenu() {
  textAlign(CENTER);
  textSize(50);
  fill(0);
  text("Rocket Slingshot!", width / 2, height / 2);
}

function drawLevels() {
  function collision(event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      let bodyA = pairs[i].bodyA;
      let bodyB = pairs[i].bodyB;
    }

  }
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points[i].length; j++) {
      points[i][j].render();
    }
  }

  for (let i = 0; i < sparks.length; i++) {
    sparks[i].render();
    i -= sparks[i].update(i);
  }

  for (let i = 0; i < planets.length; i++) {
    planets[i].render();
  }
}

function level1() {
  for (let i = 0; i < 1; i++) {
    planets[i] = new planet();
  }
}