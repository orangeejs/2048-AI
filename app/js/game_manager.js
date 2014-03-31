function GameManager(size, InputManager, Actuator) {
  this.size         = size; // Size of the grid
  this.inputManager = new InputManager;
  this.actuator     = new Actuator;

  this.running      = false;

  var self = this;
  
  this.inputManager.on("move", function(direction) {
    var result = self.grid.move(direction);
      self.score += result.score;

      if (!result.won) {
        if (result.moved) {
          self.grid.computerMove();
        }
      } else {
        self.won = true;
      }

      //console.log(self.grid.valueSum());

      if (!self.grid.movesAvailable()) {
        self.over = true; // Game over!
      }

      self.actuate();

  });

  this.inputManager.on("restart", function() {
    self.actuator.restart();
    self.running = false;
    self.actuator.setRunButton('Auto-run');
    self.setup();
  });

  this.inputManager.on('think', function() {
    var best = this.ai.getBest();
    self.actuator.showHint(best.move);
  });


  this.inputManager.on('run', function() {
    if (this.running) {
      that.running = false;
      that.actuator.setRunButton('Auto-run');
    } else {
      that.running = true;
      that.run()
      that.actuator.setRunButton('Stop');
    }
  });

  this.setup();
}

// Set up the game
GameManager.prototype.setup = function () {
  this.grid         = new Grid(this.size);
  this.grid.addStartTiles();

  this.ai           = new AI(this.grid);

  this.score        = 0;
  this.over         = false;
  this.won          = false;

  // Update the actuator
  this.actuate();
};


// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  this.actuator.actuate(this.grid, {
    score: this.score,
    over:  this.over,
    won:   this.won
  });
};

// moves continuously until game is over
GameManager.prototype.run = function() {
  var best = this.ai.getBest();
  this.move(best.move);
  var timeout = animationDelay;
  if (this.running && !this.over && !this.won) {
    var self = this;
    setTimeout(function(){
      self.run();
    }, timeout);
  }
}
