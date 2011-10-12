var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 100;
canvas.height = 500;

var ctx = canvas.getContext("2d");
var loop;

var background = new Background();
var hero = new Hero(canvas.width, canvas.height);

var keys = new Array();
function doKeyDown(evt) {
	keys[evt.keyCode] = true;
}
function doKeyUp(evt) {
	keys[evt.keyCode] = false;
}

function move() {
	if (38 in keys && keys[38]) { // up
		hero.moveUp();
	}
	if (40 in keys && keys[40]) { // down
		hero.moveDown();
	}
	if (37 in keys && keys[37]) { // left
		hero.moveLeft();
	}
	if (39 in keys && keys[39]) { // right
		hero.moveRight();
	}
}

window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);

var GameLoop = function() {
	move();
	clear();
	background.draw(ctx);
	hero.draw(ctx);
	loop = setTimeout(GameLoop, 1000 / 100);
}
GameLoop();
