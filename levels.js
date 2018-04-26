function startMenu() {
  // textAlign(CENTER);
  // textSize(50);
  // fill(0);
  // text("Rocket Slingshot!", width / 2, height / 2);
  push();
  translate(width / 2, height / 3);
  scale(0.4, 0.4);
  translate(-title.width / 2, -title.height / 2);
  let titlePos = {
    x: 0,
    y: 8 * sin(frameCount / 5)
  };
  image(title, titlePos.x, titlePos.y);

  // sprayTitle.push(new titleTrail(titlePos.x, titlePos.y));
  // for (let i = 0; i < sprayTitle.length; i++) {
  //   sprayTitle[i].update();
  //   sprayTitle[i].render();
  //
  //   if (sprayTitle[i].scale <= 0.1) {
  //     sprayTitle.splice(i, 1);
  //   }
  // }

  pop();

  if (mouseIsPressed) {
    levelIndex = 1;
  }
}
//
// class titleTrail {
//   constructor(_x, _y) {
//     this.pos = {
//       x: _x,
//       y: _y
//     };
//     this.scale = 1;
//     this.tint = 255;
//   }
//   update() {
//     this.pos.x -= 2;
//     this.pos.y += this.pos.y / 100;
//     // this.tint -= 255 / 5;
//     this.scale -= 1 / 5;
//   }
//   render() {
//     push()
//     scale(this.scale, this.scale);
//     // tint(255, this.tint);
//     image(title, this.pos.x / this.scale, this.pos.y / this.scale);
//     pop();
//   }
// }

function drawLevels() {
  Engine.update(engine, 60);
  Events.on(engine, 'collisionStart', collision);
  // sparks.push(new particle(mouseX, mouseY));

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

  for (let i = 0; i < rockets.length; i++) {
    rockets[i].render();
  }

}

function level1() {
  for (let i = 0; i < 1; i++) {
    planets[i] = new planet(width / 2, height / 2, 50);
  }
  levelStart = false;
}