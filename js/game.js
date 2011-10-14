var starsLikeDust = {};

starsLikeDust.background = (function () {
	'use strict';
	var image = new Image(), draw = function (ctx) {
		ctx.drawImage(image, 0, 0);
	};
	image.src = "images/galaxy.jpg";
	return {
		draw : draw
	};
}());

starsLikeDust.hero = (function () {
	'use strict';
	var SPEED = 8, image = new Image(), x = 50, y = 250;
	image.src = "images/hero.png";
	function setPosition(positionX, positionY) {
		x = positionX;
		y = positionY;
	}
	function draw(ctx) {
		ctx.drawImage(image, x, y);
	}
	function moveLeft() {
		if (x > 0) {
			setPosition(x - SPEED, y);
		}
	}
	function moveRight() {
		if (x + image.width < canvas.width) {
			setPosition(x + SPEED, y);
		}
	}
	function moveUp() {
		if (y > 0) {
			setPosition(x, y - SPEED);
		}
	}
	function moveDown() {
		if (y + image.height < canvas.height) {
			setPosition(x, y + SPEED);
		}
	}
	return {
		draw : draw,
		moveUp : moveUp,
		moveDown : moveDown,
		moveLeft : moveLeft,
		moveRight : moveRight
	};
}());

starsLikeDust.engine = (function () {
	'use strict';
	var canvas = document.getElementById("canvas"), keys = [], CANVAS_HEIGHT = 500, loop;
	var ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth - 100;
	canvas.height = CANVAS_HEIGHT;

	function doKeyDown(evt) {
		keys[evt.keyCode] = true;
	}

	function doKeyUp(evt) {
		keys[evt.keyCode] = false;
	}

	window.addEventListener('keydown', doKeyDown, true);
	window.addEventListener('keyup', doKeyUp, true);

	function move() {
		var hero = starsLikeDust.hero;
		if ((keys[38] !== undefined && keys[38])
				|| (keys[87] !== undefined && keys[87])) { // up
			hero.moveUp();
		}
		if ((keys[40] !== undefined && keys[40])
				|| (keys[83] !== undefined && keys[83])) { // down
			hero.moveDown();
		}
		if ((keys[37] !== undefined && keys[37])
				|| (keys[65] !== undefined && keys[65])) { // left
			hero.moveLeft();
		}
		if ((keys[39] !== undefined && keys[39])
				|| (keys[68] !== undefined && keys[68])) { // right
			hero.moveRight();
		}
	}

	function start() {
		move();
		canvas.width = canvas.width;
		starsLikeDust.background.draw(ctx);
		starsLikeDust.hero.draw(ctx);
		loop = setTimeout(start, 1000 / 100);
	}

	return {
		start : start
	};
}());

starsLikeDust.engine.start();
