function blob(r, x, y, inf, player) {
  this.r = r;
  this.pos = createVector(x, y);
  this.inf = inf ? inf : false;
  this.player = player ? player : false;
  this.draw = function() {
    if (this.inf) {
      fill(200, 0, 0);
    } else if(this.player){
      fill(0,200,0);
    } else {
      fill(0, 0, 200);
    }
    ellipse(this.pos.x, this.pos.y, 2 * this.r, 2 * this.r);
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
var diff_radio,instruction_div,diff;
var selected = false;

function resetBlobs() {
  blobs[0] = new blob(10, width / 2, height / 2, false, true); //your blob
  for (var i = 1; i <= Math.floor(initial_infected/4); i++) {
    //blobs[i] = new blob(10, random(0, width), random(0, height), random() < 0.5);
    blobs[i] = new blob(10, random(0, width/2-10), random(0, height/2-10), true);
  }

  for (i = Math.ceil(initial_infected/4); i <= Math.floor(2*initial_infected/4); i++) {
    //blobs[i] = new blob(10, random(0, width), random(0, height), random() < 0.5);
    blobs[i] = new blob(10, random(width/2+10, width), random(0, height/2-10), true);
  }
  for (i = Math.ceil(2*initial_infected/4); i <= Math.floor(3*initial_infected/4); i++) {
    //blobs[i] = new blob(10, random(0, width), random(0, height), random() < 0.5);
    blobs[i] = new blob(10, random(0, width/2-10), random(height/2+10, height), true);
  }
  for (i = Math.ceil(3*initial_infected/4); i < initial_infected; i++) {
    //blobs[i] = new blob(10, random(0, width), random(0, height), random() < 0.5);
    blobs[i] = new blob(10, random(width/2+10, width), random(height/2+10, height), true);
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
  var radio = createRadio();
  radio.option('easy','low');
  radio.option('not-so-easy','medium');
  radio.option('hard','high');
  radio.value('low');
  textAlign(CENTER);
  return radio;
}

function setup() {
  canvas_ = createCanvas(624, 557);
  print(windowWidth, windowHeight);
  //canvas_.parent('myContainer');
  gameEnded('Choose Difficulty:','Play!');
  noLoop();
}

function draw() {
  background(220);
  if (!selected) return;
  blobs[0].update(mouseX, mouseY);
  blobs[0].draw();
  groceries[0].draw();
  groceries[1].draw();
  groceries[2].draw();
  groceries[3].draw();


  for (var i = 1; i < blobs_length; i++) {
    var speed = 7;
    if(diff=='medium') speed=8.5;
    if(diff=='high') speed=10;
    blobs[i].update((blobs[i].pos.x + random(-speed, speed)) % width, (blobs[i].pos.y + random(-speed, speed)) % height);
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
    //So that draw() doesn't run after this.
    gameEnded('Woah man! You did it! <br> Choose Difficulty:', 'Play Again!');

    //Wait until play again is clicked.
    noLoop();
  }
  if (blobs[0].inf == true) {
    gameEnded('Sorry dude, you couldn\'t make it :| <br> Choose Difficulty:', 'Play Again!');

    noLoop();
  }

  frameRate(10);
}

function gameEnded(notif, button_label) {
  selected = false;
  fill(255,255,255)
  play_again_button = createButton(button_label);
  size_ = play_again_button.size();
  play_again_button.position(width / 2 - size_.width / 2, height / 2 - size_.height / 2);
  play_again_button.style('background-color', color(255, 255, 255,255));
  play_again_button.style('font-weight: bold;');

  lose_div = createDiv(notif);
  lose_div.style('background-color', color(255, 255, 255, 255))
  lose_div.style('color', color(0, 0, 0, 255));
  lose_div.style('text-align:center');
  lose_div.style('min-width: 200px;');
  lose_div.position(width/3, height / 3);

  diff_radio = difficultyButton();
  diff_radio.style('background-color', color(255, 255, 255, 255))
  diff_radio.size(lose_div.size().width,height/32);
  diff_radio.style('text-align:center');
  diff_radio.position(width / 3, height/2.5);
  
  //Instructions scrollable
  instruction_div = createDiv('Instructions:<br>1. Infected blobs(RED) can infect healthy blobs(BLUE/GREEN) by contact.<br>2.If you(GREEN) get infected, you lose!<br>3.Once your blob gets grocery from a store by coming in contact, the store turns gray from black.<br>4. To win, avoid infected blobs and collect groceries from all 4 corners.');
  //instruction_div.id('gm_instr');
  instruction_div.position(width/4, height/2+size_.height);
  instruction_div.size(width/2, height/4);
  instruction_div.style('text-align:center');
  instruction_div.style('background-color', color(255, 255, 255, 255))
  instruction_div.style('overflow-wrap: break-word;');
  instruction_div.style('overflow: scroll');

  play_again_button.mousePressed(startPlaying.bind(this, play_again_button, lose_div));
}

function startPlaying(start_button, lose_div) {
  if (lose_div) lose_div.hide();
  start_button.hide();
  diff = diff_radio.value();
  if (diff == 'low') {
    blobs_length = 40;
    initial_infected = 10;
  }
  if (diff == 'medium') {
    blobs_length = 70;
    initial_infected = 30;
  }
  if (diff == 'high') {
    blobs_length = 100;
    initial_infected = 50;
  }
  diff_radio.hide();
  //todo: remove later
  if(instruction_div) instruction_div.hide();
  resetBlobs();
  resetGroceries();
  selected = true;
  loop();
}