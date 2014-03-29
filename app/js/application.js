animationDelay = 100;
minSearchTime = 100;

// Wait till the browser is ready to render the game (avoids glitches)
window.onload = function() {
	OrangeeJS.init(function() {
    window.requestAnimationFrame(function () {
      var manager = new GameManager(4, KeyboardInputManager, HTMLActuator);
    });
	});

};
