var s;
var scl = 20;
var food;

function setup() {
    createCanvas(500,500);
    s = new Snake();
    frameRate(10);
    pickLocation();
}

function draw() {
  background(51);

  if(s.eat(food)) {
    pickLocation();
  }
  //draw food
  fill(255,0,100);
  rect(food.x,food.y,scl,scl);

  s.death();
  s.update();
  s.show();
}

function pickLocation() {
  //make sure the location is different from the snake
  var cols = floor(width/scl);
  var rows = floor(height/scl);

  var nolocation = true;

  var d = 0;
  var earlystop = false;
  while(nolocation) {
    earlystop = false;
    food = createVector(floor(random(cols)),floor(random(rows)));
    food.mult(scl);
    for(var i = 0; i < s.tail.length; ++i) {
      d = dist(food.x,food.y,s.tail[i].x,s.tail[i].y)
      if(d < 1) {
          earlystop = true;
      }
    }
    if(!earlystop) {
      break;
    }
  }
}

function keyPressed() {
    if(keyCode == UP_ARROW) {
        s.dir(0,-1);
    } else if(keyCode == DOWN_ARROW) {
        s.dir(0,1);
    } else if(keyCode == RIGHT_ARROW) {
        s.dir(1,0);
    } else if(keyCode == LEFT_ARROW) {
        s.dir(-1,0);
    }
}