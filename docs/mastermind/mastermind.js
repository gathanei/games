var base_colors = ["blue","green","yellow","red"];

// http://stackoverflow.com/questions/962802#962890
function random_array(n) {
  for (var array=[], i=0; i < n; ++i) array[i] = i;
  var tmp, current, top = array.length;
  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    }).filter(function (e, i, c) { // extra step to remove duplicates
        return c.indexOf(e) === i;
    });
}

function Mastermind(pins,rounds,colors,solution) {
  if(pins === undefined) {
    this.pins = 4;
  } else {
    this.pins = pins;
  }
  if(rounds === undefined) {
    this.rounds = 12;
  } else {
    this.rounds = rounds;
  }
  if(colors === undefined) {
    this.colors = base_colors;
  } else {
    this.colors = colors;
  }
  if(solution === undefined) {
    this.solution = new Array(this.pins);
    for(var i = 0; i < this.solution.length; ++i) {
      this.solution[i] = this.colors[(Math.random()*this.colors.length)|0]
    }
  } else {
    this.solution = solution;
  }
  this.stage = 0;
  this.queries = new Array(this.rounds);
  this.answers = new Array(this.rounds);
  for(var i = 0; i < this.rounds; ++i) {
    this.queries[i] = new Array(this.pins);
    this.answers[i] = new Array(2);
  }

  this.restart = function() {
    this.stage = 0;
    this.won = false;
    this.over = false;
    for(var i = 0; i < this.rounds; ++i) {
      this.queries[i] = new Array(this.pins);
      this.answers[i] = new Array(2);
    }
    //new solution
    for(var i = 0; i < this.solution.length; ++i) {
      this.solution[i] = this.colors[(Math.random()*this.colors.length)|0]
    }
    console.log("Game restarted");
  }

  this.gameOver = function() {
    if(this.stage == this.rounds-1) {
      if(this.answers[this.stage][0] == this.pins) {
        console.log("Game won in last move");
        return false;
      } else {
        console.log("Game over!");
        return true;
      }
    }
    return false;
  }

  this.gameWon = function() {
    if(this.answers[this.stage][0] == this.pins) {
      console.log("Game won!");
      return true;
    } else {
      return false;
    }
  }

  this.gameOver = function() {
    if(this.stage >= this.rounds) {
      console.log("Game lost");
      return true;
    } else {
      return false;
    }
  }

  this.validQuery = function(query) {
    //check if colors are the same
    if(query.length == this.pins) {
      var uniquequerycolors = Array.from(new Set(query));
      var correctcolors = intersect(uniquequerycolors,this.colors).length == uniquequerycolors.length;
      if(correctcolors) {
        return true;
      } else {
        console.log("Query does not contain colors specified in initialization");
        return false;
      }
    } else {
      console.log("Query does not contain correct number of elements");
      return false;
    }
    return false;
  }

  this.setQuery = function(query) {
    for(var i = 0; i < this.pins; ++i) {
      this.queries[this.stage][i] = query[i];
    }
  }

  this.setAnswer = function(query) {
    var count_correct = 0;
    var wrong_positions = 0;
    var temp_solution = new Array(this.solution.length);
    var temp_query = new Array(query.length);
    var random_positions = random_array(query.length); //randomly assigns positions to obfuscate the coding

    //count correct color&position
    var position;
    for(var i = 0; i < this.solution.length; ++i) {
      //position = random_positions[i];
      position = i;
      if(this.solution[position] == query[position]) {
        ++count_correct;
        temp_solution[position] = "solution_color_counted";
        temp_query[position] = "query_color_counted";
      } else {
        temp_solution[position] = this.solution[position];
        temp_query[position] = query[position];
      }
    }
    //count correct color
    for(var i = 0; i < temp_query.length; ++i) {
      for(var j = 0; j < temp_solution.length; ++j) {
        if(temp_solution[j] == temp_query[i]) {
          ++wrong_positions;
          temp_solution[j] = "solution_color_counted";
          temp_query[i] = "query_color_counted";
          //j = temp_solution.length;
        }
      }
    }
    this.answers[this.stage][0] = count_correct;
    this.answers[this.stage][1] = wrong_positions;
  }

  this.nextMove = function(query) {
    if(this.stage < this.rounds) {
      if(this.validQuery(query)) {
        this.setQuery(query);
        this.setAnswer(query);
        //check if won
        if(this.answers[this.stage][0] == this.pins) {
          this.won = true;
          console.log("won!");
        } 
        if(this.stage == this.rounds-1 && !this.won) {
          this.over = true;
          console.log("lost!");
        }
        //increase stage by one
        if(this.stage < this.rounds-1) {
          ++this.stage;
        }
      }
    } else {
      console.log("All rounds have been played, no further moves available.")
    }
  }
}
