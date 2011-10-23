var starsLikeDust = (function() {
	'use strict';
	var canvas = document.getElementById("canvas"), keys = [], CANVAS_HEIGHT = 500, loop;
	var ctx = canvas.getContext("2d");
	var shoots = [], asteroids = [];
	canvas.width = window.innerWidth - 100;
	canvas.height = CANVAS_HEIGHT;

	for ( var i = 0, j = Math.floor(Math.random() * 7); i < j; i++) {
		asteroids.push(new Asteroid(canvas.width - (Math.random() * 100) - 50,
				canvas.height / 2 + (Math.random() * 300) - 150));
	}

	window.addEventListener('keydown', doKeyDown, true);
	window.addEventListener('keyup', doKeyUp, true);

	function Shoot(positionX, positionY) {
		this.x = positionX;
		this.y = positionY;
		this.image = new Image();
		this.image.src = "images/laser.png";
	}

	Shoot.prototype.draw = function(ctx) {
		if (this.x < canvas.width) {
			this.x = this.x + 10;
			ctx.drawImage(this.image, this.x, this.y + 25);
		}
	};

	function Asteroid(positionX, positionY) {
		this.x = positionX;
		this.y = positionY;
		this.image = new Image();
		this.image.src = "images/asteroid.png";
	}

	Asteroid.prototype.draw = function(ctx) {
		if (this.x < canvas.width) {
			this.x = this.x - 2;
			ctx.drawImage(this.image, this.x, this.y - 4);
		}
	};

	var hero = (function() {
		var SPEED = 6, image = new Image(), x = 50, y = 250;
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
		function shoot() {
			shoots.push(new Shoot(x, y));
		}
		return {
			draw : draw,
			moveUp : moveUp,
			moveDown : moveDown,
			moveLeft : moveLeft,
			moveRight : moveRight,
			shoot : shoot
		};
	}());

	var background = (function() {
		var x = 0;
		var image = new Image(), draw = function(ctx) {
			x = x - 0.5;
			ctx.drawImage(image, x, 0);
		};
		image.src = "images/galaxy.jpg";
		return {
			draw : draw
		};
	}());

	function doKeyDown(evt) {
		keys[evt.keyCode] = true;
		if (evt.keyCode === 32) {
			hero.shoot();
		}
	}

	function doKeyUp(evt) {
		keys[evt.keyCode] = false;
	}

	function moveHero() {
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

	function drawEnvironment() {
		canvas.width = canvas.width; // clear canvas
		background.draw(ctx);
		hero.draw(ctx);
		shoots.forEach(function(shoot) {
			shoot.draw(ctx);
		});
		asteroids.forEach(function(asteroid) {
			asteroid.draw(ctx);
		})
	}

	function gameLoop() {
		moveHero();
		drawEnvironment();
		loop = setTimeout(gameLoop, 1000 / 100);
	}

	return {
		gameLoop : gameLoop
	};
}());

starsLikeDust.gameLoop();
