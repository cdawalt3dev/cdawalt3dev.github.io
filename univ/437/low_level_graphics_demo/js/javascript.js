

var canvas_ref;
var ctx;

var canvasWidth = 800;
var canvasHeight = 600;

var mouse_x;
var mouse_y;

var frameCount = 0;


var batPosition_x = 200;
var batPosition_y = canvasHeight - 200;

var batLength = 150;



$(window).on("load", function(){
    //second
	
});//END OF window.load


$(document).ready(function(){
    //first
	setupCanvas(); //Create and attach the <canvas> element to the page.
	initialize();  //logic startup
	
});//END OF document.ready





//Generate a canvas element and attach it to the "divCanvas" element as a child.
//Save a reference to this canvas element as "canvas_ref".
function setupCanvas(){
    var divCanvas_ref;
	
	divCanvas_ref = document.getElementById("divCanvas");
	
	divCanvas_ref.style.backgroundColor = "#000000";
	divCanvas_ref.style.width = canvasWidth+"px";
	divCanvas_ref.style.height = canvasHeight+"px";
	
	canvas_ref = document.createElement("canvas");
	canvas_ref.setAttribute("width", canvasWidth+"px");
	canvas_ref.setAttribute("height", canvasHeight+"px");
	
	canvas_ref.setAttribute("onmousemove", "getMouseCoords(event)");
	
	ctx = canvas_ref.getContext("2d");
	
	divCanvas_ref.appendChild(canvas_ref);
}//END OF setupCanvas




function initialize(){

    window.setInterval(frame, 50);

    ctx.fillStyle="#dddddd";
	
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    
	ctx.setTransform(1, 0, 0, 1, 0, 0);
}//END OF initialize




//Thankyou,
//https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
function  getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

  return {
    x: Math.ceil((evt.clientX - rect.left) * scaleX),   // scale mouse coordinates after they have
    y: Math.ceil((evt.clientY - rect.top) * scaleY)     // been adjusted to be relative to element
  }
}

 
function getMouseCoords(event){
	var tempMousePos = getMousePos(canvas_ref, event);
	mouse_x = tempMousePos.x;
	mouse_y = tempMousePos.y;
}



function frame(evt){
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.resetTransform();
	
	//ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	ctx.fillStyle = "#0e9800";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	
	
	
	
	//field, an arc to the top-right corner and lines to the rest of the screen.
	ctx.beginPath();
	ctx.lineWidth = "14"
	ctx.strokeStyle="#115c11";
	ctx.arc(380,420,400, Math.PI*1.5, 2*Math.PI);
	ctx.moveTo(380, 20);  //top-left corner of arc to left of the screen.
	ctx.lineTo(0, 20);
	ctx.moveTo(canvasWidth - 20, 420);  //bottom-right corner of the arc to bottom of the screen.
	ctx.lineTo(canvasWidth - 20, 600);
	ctx.stroke();
	
	
	
	
	//Circle around the bat.
	ctx.beginPath();
	ctx.arc(batPosition_x,batPosition_y,batLength, 0, 2*Math.PI);
	
	//fill first,
	ctx.fillStyle = "#3bb930";
	ctx.fill();
	
	//draw the outline.
	ctx.lineWidth = "8"
	ctx.strokeStyle="#227722";
	ctx.stroke();
	
	
	
	
	
	
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	
	
	ctx.translate(batPosition_x, batPosition_y);
	
	
	var delta_x = mouse_x - batPosition_x;
	var delta_y = mouse_y - batPosition_y;
	var angleToMouse = Math.atan2(delta_y, delta_x);
	
	
	//Draws the baseball bat toward the mouse from a fixed origin.
	ctx.rotate(angleToMouse);
    ctx.fillStyle="#a05c26";
	ctx.fillRect(0,-10,batLength,20);
	

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	
	ctx.font = "20px Arial";
    ctx.fillStyle="#ffffff";
	ctx.fillText("mouse coords: (" + mouse_x + ", " + mouse_y + ")", 20, 60);
	ctx.fillText("angle from bat origin (rads): " + angleToMouse, 20, 94);
	
	
	
	
	
	frameCount++;
	
	
	
	
}//END OF frame



