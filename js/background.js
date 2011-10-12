function Background() {
	this.image = new Image();
	this.image.src = "images/galaxy.jpg";
}

Background.prototype.draw = function(ctx) {
	ctx.drawImage(this.image, 0, 0);
}
