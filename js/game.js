var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 100;
canvas.height = 400;

// Configuración del contexto
var ctx = canvas.getContext("2d");

var image = new Image();
image.onload = function() {
	ctx.drawImage(image, 0, 0);
};
image.src = "images/galaxy.jpg";
