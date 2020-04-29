function blob(r, x, y, inf, player) {
  this.r = r;
  this.pos = createVector(x, y);
  this.inf = inf ? inf : false;
  this.player = player ? player : false;
  this.draw = function() {
    if (this.inf) {
      fill(200, 0, 0);
    } else {
      fill(0, 0, 200);
    }
    ellipse(this.pos.x, this.pos.y, 2 * r, 2 * r);
  }
  this.update = function(x, y) {
    var xpos, ypos;
    xpos = x;
    if (player && xpos - r < 0) {
      xpos = r;
    }
    if (player && xpos + r > width) {
      xpos = width - r;
    }
    ypos = y;
    if (player && ypos - r < 0) {
      ypos = r;
    }
    if (player && ypos + r > height) {
      ypos = height - r;
    }
    this.pos = createVector(xpos, ypos);
  }
}

function grocery(x, y, w, h) {
  this.pos = createVector(x, y, w, h);
  this.visited = false;
  this.draw = function() {
    if (this.visited) {
      fill(100, 100, 100);
    } else {
      fill(0, 0, 0);
    }
    rect(x, y, w, h);
  }
}

var blobs = [];
var blobs_length = 60;
var groceries = [];
var initial_infected = 25;
var diff_radio;
var selected = false;

function resetBlobs() {
  blobs[0] = new blob(10, width / 2, height / 2, false, true); //your blob
  for (var i = 1; i < initial_infected; i++) {
    //blobs[i] = new blob(10, random(0, width), random(0, height), random() < 0.5);
    blobs[i] = new blob(10, random(0, width), random(0, height), true);
  }
  for (i = initial_infected; i < blobs_length; i++) {
    blobs[i] = new blob(10, random(0, width), random(0, height), false);
  }
}

function resetGroceries() {
  groceries[0] = new grocery(0, 0, 15, 15);
  groceries[1] = new grocery(width - 15, 0, 15, 15);
  groceries[2] = new grocery(0, height - 15, 15, 15);
  groceries[3] = new grocery(width - 15, height - 15, 15, 15);
}

function difficultyButton() {
  var radio = createRadio("Choose difficulty:");
  radio.option('low');
  radio.option('medium');
  radio.option('high');
  radio.value('low');
  textAlign(CENTER);
  return radio;
}

function setup() {
  createCanvas(400, 400);
  start_button = createButton('Play!');
  size_ = start_button.size();
  start_button.position(width / 2 - size_.width / 2, height / 2 - size_.height / 2);
  start_button.mousePressed(startPlaying.bind(this, start_button));
  diff_radio = difficultyButton();
  diff_radio.position(width / 2 - 3 * size_.width / 2, height / 2 - 3 * size_.height / 2);
  noLoop();
}

function draw() {
  background(220);
  if(!selected) return;
  blobs[0].update(mouseX, mouseY);
  blobs[0].draw();
  groceries[0].draw();
  groceries[1].draw();
  groceries[2].draw();
  groceries[3].draw();


  for (var i = 1; i < blobs_length; i++) {
    blobs[i].update((blobs[i].pos.x + random(-7, 7)) % width, (blobs[i].pos.y + random(-7, 7)) % height);
    blobs[i].draw();
  }
  //compute distance between every blob
  for (i = 0; i < blobs_length; i++) {
    for (var j = i + 1; j < blobs_length; j++) {
      if (dist(blobs[i].pos.x, blobs[i].pos.y, blobs[j].pos.x, blobs[j].pos.y) < (blobs[i].r + blobs[j].r)) {
        if (blobs[i].inf == true) blobs[j].inf = true;
        if (blobs[j].inf == true) blobs[i].inf = true;
      }
    }
  }

  //compute distance between your blob and grocery
  for (i = 0; i < 4; i++) {
    if (dist(blobs[0].pos.x, blobs[0].pos.y, groceries[i].pos.x, groceries[i].pos.y) < (15 + blobs[0].r)) {
      groceries[i].visited = true;
    }
  }

  if (groceries[0].visited == true &&
    groceries[1].visited == true &&
    groceries[2].visited == true &&
    groceries[3].visited == true) {
    selected = false;
    win_div = createDiv('You Win!');
    win_div.position(width / 2, height / 2 - 20);
    play_again_button = createButton('Play Again!');
    play_again_button.position(width / 2, height / 2);
    play_again_button.mousePressed(startPlaying.bind(this, play_again_button, win_div));
    resetBlobs();
    noLoop();
  }
  if (blobs[0].inf == true) {
    selected = false;
    play_again_button = createButton('Play Again!');
    size_ = play_again_button.size();
    play_again_button.position(width / 2 - size_.width / 2, height / 2 - size_.height / 2);
    lose_div = createDiv('You Lose!');
    lose_div.style("z-index: 200");
    lose_div.style('background-color',color(0,100,0,100))
    lose_div.style('color', color(0, 0, 0, 255))
    lose_div.position(width / 2 - size_.width / 2, height / 2 - 3 * size_.height);
    diff_radio = difficultyButton();
    diff_radio.style('background-color',color(0,100,0,0))
    diff_radio.position(width / 2 - size_.width, height / 2 - 3 * size_.height / 2);

    play_again_button.style('background-color',color(0,100,0));
    play_again_button.mousePressed(startPlaying.bind(this, play_again_button, lose_div));
    resetBlobs();
    noLoop();
  }

  frameRate(10);
}

function startPlaying(start_button, lose_div) {
  if (lose_div) lose_div.hide();
  start_button.hide();
  diff = diff_radio.value();
  if (diff == 'low') {
    blobs_length = 30;
    initial_infected = 5;
  }
  if (diff == 'medium') {
    blobs_length = 60;
    initial_infected = 25;
  }
  if (diff == 'high') {
    blobs_length = 80;
    initial_infected = 45;
  }
  diff_radio.hide();
  resetBlobs();
  resetGroceries();
  selected = true;
  loop();
}