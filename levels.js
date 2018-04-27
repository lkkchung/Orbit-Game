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

function level1() {
  if (levelFlow.stage == 0) {
    textAlign(CENTER);
    push();
    stroke(255);
    noFill();
    translate(width / 2, height / 2);
    strokeWeight(1);
    scale(1);
    textSize(48);
    text("LEVEL 1", 0, 0);
    pop();

    levelFlow.titleCountdown -= 1.5;
    if (levelFlow.titleCountdown <= 0) {
      levelFlow.stage = 1;
    }

  } else if (levelFlow.stage == 1) {
    for (let i = 0; i < 1; i++) {
      planets[i] = new planet(width / 2, height / 2, 50);
      // planets[i] = new planet(random(width), random(height), random(20, 80));
    }
    levelStart = false;
  }
}