var horizontal_space = 50;
var vertical_space = 50;
var pin_radius = 20;
var boundary = 30;
var empty_pin_color = [100,100,100];

if(pin_radius > horizontal_space) {
  console.log("Your pin radius is larger than the pin spacing!");
}

map_colors = function(color) {
  if(color == "blue") { return [135,206,250];}
  if(color == "green") { return [0,255,127];}
  if(color == "purple") { return [238,130,238];}
  if(color == "red") { return [240,128,128];}
  if(color == "yellow") { return [255,255,102];}
  if(color == "pink") { return [199,21,133];}
  if(color == "orange") { return [255,127,80];}
  if(color == "white") { return [255,255,255];}
  if(color == "black") { return [0,0,0];}
  if(color == "empty") { return empty_pin_color;}
  if(color == "active") { return [255,255,255];}
  return [0,0,0];
}

//..
//--o-o-o-o-|-o-o-o-o--
//...
//--o-o-o-o-|-o-o-o-o--
//---------------------
//----------o-o-o-o-o--
//---------------------
function Grid(game) {
  this.rows = game.rounds;
  this.cols = game.pins;
  this.number_colors = game.colors.length;
  this.colors = game.colors;
  this.width = boundary+2*this.cols*horizontal_space+boundary;
  this.height = boundary+this.rows*vertical_space+vertical_space+boundary;

  this.dragging = false;
  this.dragged = [false,"empty"];
  this.temp_answer = new Array(this.cols);
  for(var i = 0; i < this.cols; ++i) {
    this.temp_answer[i] = "empty";
  }

  this.answer_pins = new Array(this.rows);
  this.query_pins = new Array(this.rows);
  this.color_pins = new Array(this.number_colors);
  //reference for later use
  this.game = game;

  this.text = "";

  this.current_query = new Array(this.cols);
  for(var i = 0; i < this.rows; ++i) {
      this.answer_pins[i] = new Array(this.cols);
      this.query_pins[i] = new Array(this.cols);
      for(var j = 0; j < this.cols; ++j) {
        this.answer_pins[i][j] = [boundary+j*horizontal_space,boundary+i*vertical_space,"empty"];
        this.query_pins[i][j] = [boundary+(j+this.cols+1)*horizontal_space,boundary+i*vertical_space,"empty"];
      }
  }
  for(var i = 0; i < this.number_colors; ++i) {
    this.color_pins[i] = [this.width-boundary-horizontal_space*i,this.height-boundary,this.colors[i]];
  }

  this.check_button_coordinates = function() {

  }

  this.restart_button_coordinates = function() {

  }

  this.restart = function() {
    for(var i = 0; i < this.rows; ++i) {
      for(var j = 0; j < this.cols; ++j) {
        this.answer_pins[i][j][2] = "empty";
        this.query_pins[i][j][2] = "empty";
      }
    }
  }

  this.reset_temp_answer = function() {
    for(var i = 0; i < this.temp_answer.length; ++i) {
      this.temp_answer[i] = "empty";
    }
  }
  this.set_dragging = function(value) {
    this.dragging = value;
    var pin;
    if(value) {
      //check if close to color pin
      for(var i = 0; i < this.color_pins.length; ++i) {
        pin = this.color_pins[i];
        if(dist(pin[0],pin[1],mouseX,mouseY) < pin_radius) {
          this.dragged = [true,pin[2]];
        }
      }
    }
    if(!value) {
      //check if done close to one answer if so then set the answer;
      for(var i = 0; i < this.cols; ++i) {
        pin = this.query_pins[this.rows-this.game.stage-1][i];
        if(dist(pin[0],pin[1],mouseX,mouseY) < pin_radius) {
          this.temp_answer[i] = this.dragged[1];
        }
      }
      this.dragged = [false,"empty"];
    }
  }

  this.paint_pin = function(pin) {
    fill(map_colors(pin[2]));
    stroke(map_colors(pin[2]));
    ellipse(pin[0],pin[1],pin_radius,pin_radius);
  }

  this.paint_active_pin = function(pin) {
    fill(map_colors(pin[2]));
    stroke(map_colors("active"));
    ellipse(pin[0],pin[1],pin_radius,pin_radius);
  }

  this.update = function() {
    var whites = 0;
    var blacks = 0;
    for(var i = 0; i < this.rows; ++i) {
      if(this.game.answers[i][0] != undefined) {
        for(var j = 0; j < this.cols; ++j) {
          this.query_pins[this.rows-i-1][j][2] = this.game.queries[i][j];
        }
        blacks = this.game.answers[i][0];
        whites = this.game.answers[i][1];
        for(var j = 0; j < blacks+whites; ++j) {
          if(j < blacks) {
            this.answer_pins[this.rows-i-1][j][2] = "black";
          } else {
            this.answer_pins[this.rows-i-1][j][2] = "white";
          }
        }
      }
    }
  }

  this.draw_board = function() {
    this.update();
    for(var i = 0; i < this.rows; ++i) {
      for(var j = 0; j < this.cols; ++j) {
        this.paint_pin(this.answer_pins[i][j]);
        this.paint_pin(this.query_pins[i][j]);
      }
    }
    for(var i = 0; i < this.number_colors; ++i) {
      this.paint_pin(this.color_pins[i]);
    }
  }

  this.draw_active = function() {
    var stage = game.stage;
    var pin;
    for(var i = 0; i < this.cols; ++i) {
      pin = this.query_pins[this.rows-stage-1][i];
      //bad fix
      pin[2] = this.temp_answer[i];
      if(dist(pin[0],pin[1],mouseX,mouseY) < pin_radius) {
        this.paint_active_pin(pin);
      } else {
        this.paint_pin(pin);
      }
    }
    for(var i = 0; i < this.color_pins.length; ++i) {
      pin = this.color_pins[i];
      if(dist(pin[0],pin[1],mouseX,mouseY) < pin_radius) {
        this.paint_active_pin(pin);
      } else {
        this.paint_pin(pin);
      }
    }
    if(this.dragged[0]) {
      pin = [mouseX,mouseY,this.dragged[1]];
      this.paint_active_pin(pin);
    }
  }

  this.set_text = function(event) {
    if(event == "won") {
      this.text = "You won!! Congratulations!!";
    } else if(event == "lost") {
      this.text = "You lost!! You are a loser!!";
    } else {
      this.text = "";
    }
  }

  this.draw_text = function() {
    var size = 30;
    for(var i = 0; i < this.rows; ++i) {
      textSize(size);
      text(this.text,10,G.answer_pins[i][0][1]);
    }
  }
}
