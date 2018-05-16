function startMenu() {
  for (let i = 0; i < dusts.length; i++) {
    dusts[i].update(i);
    if (dusts[i].v <= 5) {
      dusts[i].render();
    }
  }


  push();
  translate(width / 2, height / 3);
  fill(255, 255 - fadeIn);
  noStroke();
  textSize(16);
  textAlign(CENTER);
  text("writen and built by", 0, 80);
  textSize(32);
  text("Lucas Chung & Shreiya Chowdhary", 0, 120);

  translate(-title.width / 2, -title.height / 2);
  tint(255, 255 - fadeIn)
  image(title, 0, 8 * sin(frameCount / 5));

  pop();

  fadeIn -= 4;

  push();
  translate(width / 2, 2 * height / 3);
  translate(0, 100 * sin(frameCount / 25) + 50 * sin(frameCount / 18));
  scale(5, 5);
  rotate(PI / 20 * cos(frameCount / 25) + PI / 20 * cos(frameCount / 18));
  noStroke();
  fill(255);
  rocketDraw();
  pop();

  for (let i = 0; i < dusts.length; i++) {
    if (dusts[i].v > 5) {
      dusts[i].render();
    }
  }

  if (keyIsPressed && keyCode === 32) {
    levelIndex = 1;
    resetAll();
  }
}

function level1() {

  planets[0] = new planet(width / 2, height / 2, 50);

  for (let i = 0; i < 200; i++) {
    dusts[i] = new spaceDust(random(width));
  }
  startPos.x = 0.3 * width;
  startPos.y = 0.3 * width;
  startPos.t = atan((height / 2 - startPos.y) / (width / 2 - startPos.x));

  levelMiddle = true;
}

function level2() {
  planets[0] = new planet(width / 2, height / 2, 100);

  for (let i = 0; i < 200; i++) {
    dusts[i] = new spaceDust(random(width));
  }
  startPos.x = 0.3 * width;
  startPos.y = 0.3 * height;
  startPos.t = atan((height / 2 - startPos.y) / (width / 2 - startPos.x));
  levelMiddle = true;

}

function level3() {

  planets[0] = new planet(width * 0.3, height * 0.3, 100);
  planets[1] = new planet(width * 0.7, height * 0.7, 100);

  for (let i = 0; i < 200; i++) {
    dusts[i] = new spaceDust(random(width));
  }
  startPos.x = width / 6;
  startPos.y = 150;
  startPos.t = atan((height / 2 - startPos.y) / (width / 2 - startPos.x));
  levelMiddle = true;

}

function level4() {

  planets[0] = new planet(width * 0.3, height * 0.5, 200);
  planets[1] = new planet(width * 0.7, height * 0.6, 30);

  for (let i = 0; i < 200; i++) {
    dusts[i] = new spaceDust(random(width));
  }
  startPos.x = width / 6;
  startPos.y = 0.8 * height;
  startPos.t = atan((height / 2 - startPos.y) / (width / 2 - startPos.x));
  levelMiddle = true;
}

function level5() {
  planets[0] = new planet(width * 0.3, height * 0.7, 80);
  planets[1] = new planet(width * 0.5, height * 0.5, 50);
  planets[2] = new planet(width * 0.7, height * 0.3, 40);

  for (let i = 0; i < 200; i++) {
    dusts[i] = new spaceDust(random(width));
  }
  startPos.x = 0.2 * width;
  startPos.y = 0.9 * height;
  startPos.t = atan((height / 2 - startPos.y) / (width / 2 - startPos.x));
  levelMiddle = true;
}

function level6() {
  planets[0] = new planet(width * 0.5, height * 0.3, 80);
  planets[1] = new planet(width * 0.2, height * 0.7, 50);
  planets[2] = new planet(width * 0.8, height * 0.7, 40);

  for (let i = 0; i < 200; i++) {
    dusts[i] = new spaceDust(random(width));
  }
  startPos.x = 0.1 * width;
  startPos.y = 0.9 * height;
  startPos.t = atan((height / 2 - startPos.y) / (width / 2 - startPos.x));
  levelMiddle = true;
}