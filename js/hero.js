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
