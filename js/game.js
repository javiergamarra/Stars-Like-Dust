var starsLikeDust = (function () {
	var CANVAS_HEIGHT = 500, canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth - 100;
	canvas.height = CANVAS_HEIGHT;
	var keys = [];
	var ctx = canvas.getContext("2d");
	var loop;

	function doKeyDown(evt) {
		keys[evt.keyCode] = true;
	}
	
	function doKeyUp(evt) {
		keys[evt.keyCode] = false;
	}
	
	window.addEventListener('keydown', doKeyDown, true);
	window.addEventListener('keyup', doKeyUp, true);
	
	var background = (function () {
		var image = new Image();
		image.src = "images/galaxy.jpg";
		var draw = function (ctx) {
			ctx.drawImage(image, 0, 0);
		};
		return {
			draw : draw
		};
	}());

	var hero = (function () {
		var SPEED = 8;
		var image = new Image();
		image.src = "images/hero.png";
		var x = 50;
		var y = CANVAS_HEIGHT / 2;
		var setPosition = function (positionX, positionY) {
			x = positionX;
			y = positionY;
		};
		var draw = function (ctx) {
			ctx.drawImage(image, x, y);
		};
		var moveLeft = function () {
			if (x > 0) {
				setPosition(x - SPEED, y);
			}
		};
		var moveRight = function () {
			if (x + image.width < canvas.width) {
				setPosition(x + SPEED, y);
			}
		};
		var moveUp = function () {
			if (y > 0) {
				setPosition(x, y - 8);
			}
		};
		var moveDown = function () {
			if (y + image.height < canvas.height) {
				setPosition(x, y + SPEED);
			}
		};
		return {
			draw : draw,
			moveUp : moveUp,
			moveDown : moveDown,
			moveLeft : moveLeft,
			moveRight : moveRight
		};
	}());

	function move() {
		if ((keys[38] !== undefined && keys[38]) || (keys[87] !== undefined && keys[87])) { // up
			hero.moveUp();
		}
		if ((keys[40] !== undefined && keys[40]) || (keys[83] !== undefined && keys[83])) { // down
			hero.moveDown();
		}
		if ((keys[37] !== undefined && keys[37]) || (keys[65] !== undefined && keys[65])) { // left
			hero.moveLeft();
		}
		if ((keys[39] !== undefined && keys[39]) || (keys[68] !== undefined && keys[68])) { // right
			hero.moveRight();
		}
	}

	var start = function () {
		move();
		canvas.width = canvas.width;
		background.draw(ctx);
		hero.draw(ctx);
		loop = setTimeout(start, 1000 / 100);
	};

	return {
		start : start
	};

}());
starsLikeDust.start();
