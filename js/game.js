var starsLikeDust = function() {
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth - 100;
	canvas.height = 500;
	var ctx = canvas.getContext("2d");
	var loop;
	var keys = new Array();
	var background = new Background();
	var hero = new Hero(canvas.width, canvas.height);
	window.addEventListener('keydown', doKeyDown, true);
	window.addEventListener('keyup', doKeyUp, true);

	var clear = function() {
		canvas.width = canvas.width;
	}

	function Background() {
		this.image = new Image();
		this.image.src = "images/galaxy.jpg";
	}

	Background.prototype.draw = function(ctx) {
		ctx.drawImage(this.image, 0, 0);
	}

	function Hero(width, height) {
		this.image = new Image();
		this.image.src = "images/hero.png";
		this.canvasWidth = width;
		this.canvasHeight = height;
		this.x = 50;
		this.y = height / 2;
		this.setPosition = function(positionX, positionY) {
			this.x = positionX;
			this.y = positionY;
		};
		this.draw = function(ctx) {
			ctx.drawImage(this.image, this.x, this.y);
		};
		this.moveLeft = function() {
			if (this.x > 0) {
				this.setPosition(this.x - 8, this.y);
			}
		};
	}

	Hero.prototype.moveRight = function() {
		if (this.x + this.image.width < this.canvasWidth) {
			this.setPosition(this.x + 8, this.y);
		}
	}

	Hero.prototype.moveUp = function() {
		if (this.y > 0) {
			this.setPosition(this.x, this.y - 8);
		}
	}

	Hero.prototype.moveDown = function() {
		if (this.y + this.image.height < this.canvasHeight) {
			this.setPosition(this.x, this.y + 9);
		}
	}

	function doKeyDown(evt) {
		keys[evt.keyCode] = true;
	}
	function doKeyUp(evt) {
		keys[evt.keyCode] = false;
	}

	function move() {
		if (38 in keys && keys[38] || 87 in keys && keys[87]) { // up
			hero.moveUp();
		}
		if (40 in keys && keys[40] || 83 in keys && keys[83]) { // down
			hero.moveDown();
		}
		if (37 in keys && keys[37] || 65 in keys && keys[65]) { // left
			hero.moveLeft();
		}
		if (39 in keys && keys[39] || 68 in keys && keys[68]) { // right
			hero.moveRight();
		}
	}

	var start = function() {
		move();
		clear();
		background.draw(ctx);
		hero.draw(ctx);
		loop = setTimeout(start, 1000 / 100);
	}

	return {
		start : start,
	}

}();
starsLikeDust.start();
