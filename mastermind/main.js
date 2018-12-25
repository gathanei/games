var M = new Mastermind();
var G = new Grid(M);
var pause = false;
var delays = 0;
var board_color = [245,222,179];

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

function mousePressed() {
  // Did I click on the button
  G.set_dragging(true);
}

function mouseReleased() {
  // Quit dragging
  G.set_dragging(false);
}

function restart() {
  M.restart();
  G.restart();
  G.draw_board();
}

function check_pressed() {
	M.nextMove(G.temp_answer);
  G.reset_temp_answer();

  if(M.won) {
    //show message when game is won
    G.set_text("won");
    pause = true;
  }

  if(M.over) {
    //show message when game is over
    G.set_text("lost");
    pause = true;
  }
}

function restart_pressed() {
  restart();
}

function setup() {
  createCanvas(G.width,G.height);
  background(board_color);
  
  //buttons
  button_check = createButton('check answer!');
  button_check.position(70, 650);
  button_check.mousePressed(check_pressed);
    
  button_restart = createButton('restart game');
  button_restart.position(70,680);
  button_restart.mousePressed(restart_pressed);
}

function draw() {
  background(board_color);
  G.draw_board();
  G.draw_active();
  if(pause) {
    G.draw_text();
    delays = delays + 1;
    if(delays > 200) {
      delays = 0;
      pause = false;
      restart();
    }
  }
}
