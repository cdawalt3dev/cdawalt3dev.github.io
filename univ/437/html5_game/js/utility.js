

//Methods that may be helpful across the rest of the project.




var PI = Math.PI;
var doublePI = 2*PI;
var halfPI = PI/2;


//Mouse coordinates are stored in these variables. Default to NaN to mean, not collected yet.
//The mouse must move in the window once to send a onmousemove call and fill them.
var _mouse_x = NaN;
var _mouse_y = NaN;


//Checks whether the mouse was clicked this frame. Does not count holding the button down.
var mouseClicked = false;
//Checks if the mouse is held down. Stays if the mouse is held down.
var mouseDown = false;

//if the cursor leaves the scene, remember whether the mouse was held down at the time?
var mouseDownLeaveMemory = false;


var elementCanvas = null;
var ctx;
var scene = null;
var frameCount = 0;


//how long this frame took to run. See the timer.
var timeDelta = 0;
var previousTime = NaN;


	

var _nextImgPrecacheID = 0;
var _imgPrecache = null;
var _imgPrecacheListSize_soft = 0;
var _imgPrecacheListSize_hard = 128;

var _aryImgPrecacheFilePathList = new Array(_imgPrecacheListSize_hard);





//Starter to avoid editing HTML. Start running the game when this page has finished loading.
//preInit will precache images instead, and lead into init() when they are loaded.
window.onload = function(){
    preInit();
}//END OF window.onload




//Given a number, turn it into a string with leading 0's if it is not large enough to take up that
//number of digits.
function fillerZeros(arg_numb, arg_zeros){
    var numbAsString = arg_numb.toString();
	var numbDigits = numbAsString.length;
	
	var zeroString = "";
	
	var i;
	for(i = 0; i < (arg_zeros - numbDigits); i++){
	    zeroString += "0";
	}
	
	return zeroString + numbAsString;
	
}//END OF fillerZeros





//Thankyou,
//https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
function _getMousePosition(argCanvas, argEvent){
    var rect = argCanvas.getBoundingClientRect();
    var scaleX = argCanvas.width / rect.width;
    var scaleY = argCanvas.height / rect.height;
	
    _mouse_x = Math.floor((argEvent.clientX - rect.left) * scaleX);
    _mouse_y = Math.floor((argEvent.clientY - rect.top) * scaleY);
}//END OF getMousePosition



//NOTICE - this is the mouse position in the scrollable world, or absolute coords.
//Set getMousePositionFixed for coords relative to this screen (top-left corner always (0, 0)  ).
function getMousePosition(){
    return{
	    x:_mouse_x + scroll_x,
		y:_mouse_y + scroll_y
	};
}


//Same as above, but without the scroll offset. Use for GUI.
function getMousePositionFixed(){
    return{
	    x:_mouse_x,
		y:_mouse_y
	};
}





function getDirectionVectorToMouse(arg_x, arg_y){
    var mousePos = getMousePositionFixed();
	
	if(isNaN(mousePos.x) || isNaN(mousePos.y) )
	{
	    return null;
	}
	
	return getDirectionVectorToPoint(arg_x - scroll_x, arg_y - scroll_y, mousePos.x, mousePos.y);
}//END OF getDirectionVectorToMouse

function getDirectionVectorToPoint(arg_x, arg_y, arg_x2, arg_y2){
	
	var xDelta = arg_x2 - arg_x;
	var yDelta = arg_y2 - arg_y;
	var distaa = distanceBetweenPoints(0, 0, xDelta, yDelta);
	
	return{
	  x: xDelta / distaa,
	  y: yDelta / distaa
	};
	
}//END OF getDirectionVectorToPoint








function debugDrawRectCentered(arg_draw_x, arg_draw_y, arg_draw_size_w, arg_draw_size_h, arg_draw_color){
    debugDrawRectFixed(arg_draw_x - arg_draw_size_w/2 - scroll_x, arg_draw_y - arg_draw_size_h/2 - scroll_y, arg_draw_size_w, arg_draw_size_h, arg_draw_color);
}

function debugDrawRect(arg_draw_x, arg_draw_y, arg_draw_size_w, arg_draw_size_h, arg_draw_color){
	debugDrawRectFixed(arg_draw_x - scroll_x, arg_draw_y - scroll_y, arg_draw_size_w, arg_draw_size_h, arg_draw_color);
}//END OF debugDrawRect

function debugDrawRectFixedCentered(arg_draw_x, arg_draw_y, arg_draw_size_w, arg_draw_size_h, arg_draw_color){
    debugDrawRectFixed(arg_draw_x - arg_draw_size_w/2, arg_draw_y - arg_draw_size_h/2, arg_draw_size_w, arg_draw_size_h, arg_draw_color);
}
	
function debugDrawRectAbsolute(arg_draw_x, arg_draw_y, arg_draw_x2, arg_draw_y2, arg_draw_color){
	debugDrawRectFixed(arg_draw_x - scroll_x, arg_draw_y - scroll_y, arg_draw_x2-arg_draw_x, arg_draw_y2-arg_draw_y, arg_draw_color);
}


function debugDrawRectFixed(arg_draw_x, arg_draw_y, arg_draw_size_w, arg_draw_size_h, arg_draw_color){
	
	ctx.beginPath();
	ctx.lineWidth = "3";
	ctx.strokeStyle = arg_draw_color;

	ctx.rect(
	arg_draw_x,
	arg_draw_y,
	arg_draw_size_w,
	arg_draw_size_h
	);
	ctx.stroke(); 
}//END OF debugDrawRectFixed



function debugFillRectCentered(arg_draw_x, arg_draw_y, arg_draw_size_w, arg_draw_size_h, arg_draw_color){
	debugFillRectFixed(arg_draw_x - arg_draw_size_w/2 - scroll_x, arg_draw_y - arg_draw_size_h/2 - scroll_y, arg_draw_size_w, arg_draw_size_h, arg_draw_color);
}//END OF debugDrawRect

function debugFillRect(arg_draw_x, arg_draw_y, arg_draw_size_w, arg_draw_size_h, arg_draw_color){
	debugFillRectFixed(arg_draw_x - scroll_x, arg_draw_y - scroll_y, arg_draw_size_w, arg_draw_size_h, arg_draw_color);
}//END OF debugDrawRect

function debugFillRectFixedCentered(arg_draw_x, arg_draw_y, arg_draw_size_w, arg_draw_size_h, arg_draw_color){
    debugFillRectFixed(arg_draw_x - arg_draw_size_w/2, arg_draw_y - arg_draw_size_h/2, arg_draw_size_w, arg_draw_size_h, arg_draw_color);
}


function debugFillRectFixed(arg_draw_x, arg_draw_y, arg_draw_size_w, arg_draw_size_h, arg_draw_color){
	ctx.fillStyle = arg_draw_color;
	ctx.fillRect(
	arg_draw_x,
	arg_draw_y,
	arg_draw_size_w,
	arg_draw_size_h
	);
}//END OF debugDrawRectFixed



//rgba(255, 255, 255, 0.5)"
//Draw a health bar centered on this location, with this size,
//and with this percentage of health left (0 to 1, decimal).
//Coordinates are implied FIXED. subtract out scroll_x and scroll_y before sending coords.
function drawHealthBar(arg_draw_x, arg_draw_y, arg_draw_size_w, arg_draw_size_h, argPercent, argTransparency){
    
	argPercent = clamp(argPercent, 0, 1);
    
	transparencyBorder = clamp(argTransparency + 0.3, 0, 1);
	
	
	//***Draw the green part from the left (health left)
	ctx.fillStyle = "rgba(1, 255, 1, "+argTransparency+")";
	ctx.fillRect(
	arg_draw_x - arg_draw_size_w/2,
	arg_draw_y - arg_draw_size_h/2,
	arg_draw_size_w * argPercent,
	arg_draw_size_h
	);
	
	
	if(argPercent < 1){
		//***Draw the red part from the right (missing)
		ctx.fillStyle = "rgba(255, 1, 1, "+argTransparency+")";
		ctx.fillRect(
		  //round down to go one pixel left if suggested. Don't want to leave a gap.
		  Math.floor(arg_draw_x - arg_draw_size_w/2 + arg_draw_size_w * argPercent),
		  arg_draw_y - arg_draw_size_h/2,
		  arg_draw_size_w * (1 - argPercent) + 1,
		  arg_draw_size_h
		);
	}
	
	
	//***Draw the black outline around the bar.
	ctx.beginPath();
	var lineWidth;
	if(arg_draw_size_w > 100){
		lineWidth = 2;
	}else{
		lineWidth = 1;
	}
	ctx.lineWidth = lineWidth.toString();
	ctx.strokeStyle = "rgba(0, 0, 0, "+transparencyBorder+")";

	ctx.rect(
	  arg_draw_x - arg_draw_size_w/2 - lineWidth,
	  arg_draw_y - arg_draw_size_h/2 - lineWidth,
	  arg_draw_size_w + lineWidth*2,
	  arg_draw_size_h + lineWidth*2
	);
	ctx.stroke();
	
}//END OF drawHealthBar




function isPointOutsideOfScene(arg_point_x, arg_point_y){
    if(
	  //outside to the left, right, above, or below?
	  arg_point_x < scroll_x ||
	  arg_point_x > scroll_x + sceneWidth ||
	  arg_point_y < scroll_y ||
	  arg_point_y > scroll_y + sceneHeight
	){
	    return true;
	}else{
		return false;
	}
}//END OF isPointOutsideOfScene




function distanceBetweenPoints(arg_x1, arg_y1, arg_x2, arg_y2){
    
    return Math.sqrt( Math.pow(arg_x2 - arg_x1, 2) + Math.pow(arg_y2 - arg_y1, 2) );
}//END OF distanceBetweenPoints


function isPointOutsideOfMap(arg_point_x, arg_point_y){
    if(
	  //outside to the left, right, above, or below?
	  arg_point_x < scroll_bound_min_x ||
	  arg_point_x > scroll_bound_max_x ||
	  arg_point_y < scroll_bound_min_y ||
	  arg_point_y > scroll_bound_max_y
	){
	    return true;
	}else{
		return false;
	}
}//END OF isPointOutsideOfScene



function isEntityOutsideOfScene(arg_ent){
	//a check on image bounds. Would this not appear in the current scene (game window),
	//given its position and dimensions, centered?
	if(
	  //outside to the left, right, above, or below?
	  arg_ent.x + arg_ent.width/2 < scroll_x ||
	  arg_ent.x - arg_ent.width/2 > scroll_x + sceneWidth ||
	  arg_ent.y + arg_ent.height/2 < scroll_y ||
	  arg_ent.y - arg_ent.height/2 > scroll_y + sceneHeight
	){
	    return true;
	}else{
		return false;
	}
}//END OF isEntityOutsideOfScene

function isEntityOutsideOfMap(arg_ent){
	if(
	  //outside to the left, right, above, or below?
	  arg_ent.x + arg_ent.width/2 < scroll_bound_min_x ||
	  arg_ent.x - arg_ent.width/2 > scroll_bound_max_x ||
	  arg_ent.y + arg_ent.height/2 < scroll_bound_min_y ||
	  arg_ent.y - arg_ent.height/2 > scroll_bound_max_y
	){
	    return true;
	}else{
		return false;
	}
}//END OF isEntityOutsideOfScene




//Is a rectangle with this info outside of the scene (game screen)?
//Good for draw methods to skip draw calls that have no overlap with the screen.
//The first two inputs are the top-left point.
function isRectOutsideOfScene(arg_x, arg_y, arg_w, arg_h){
	if(
	  arg_x + arg_w < scroll_x ||
	  arg_x         > scroll_x + sceneWidth ||
	  arg_y + arg_h < scroll_y ||
	  arg_y         > scroll_y + sceneHeight
	){
	    return true;
	}else{
		return false;
	}
}//END OF isRectOutsideOfScene

//Similar to isRectOutsideOfScene above, but takes the last pair of inputs as an
//end point instead of width / height (distance from the top-left corner)
function isRectAbsoluteOutsideOfScene(arg_x, arg_y, arg_x2, arg_y2){
	if(
	  arg_x2        < scroll_x ||
	  arg_x         > scroll_x + sceneWidth ||
	  arg_y2        < scroll_y ||
	  arg_y         > scroll_y + sceneHeight
	){
	    return true;
	}else{
		return false;
	}
}//END OF isRectAbsoluteOutsideOfScene





//Returns the angle to move at full speed from arrow inputs.
//That is, holding down one arrow keys moves as fast as possible in that direction.
//But holding two arrow keys, such as up and right, should move partially in those directions.
//SPECIAL: Returns NaN if no keys are pressed.
function getMovementAngle(){
	var upPressed = false;
	var rightPressed = false;
	var downPressed = false;
	var leftPressed = false;
	
	if(keysDown[K_UP] || keysDown[K_W]){
	    upPressed = true;
	}
	if(keysDown[K_RIGHT] || keysDown[K_D]){
	    rightPressed = true;
	}
	if(keysDown[K_DOWN] || keysDown[K_S]){
	    downPressed = true;
	}
	if(keysDown[K_LEFT] || keysDown[K_A]){
	    leftPressed = true;
	}
	
	var anyMovementKeyPressed = false;
	var moveAng = 0;
	
	if(upPressed){
	    if(downPressed){
		    //opposites.
		    return NaN;
	    }else if(leftPressed){
		    return 360 - 45;
		}else if(rightPressed){
		    return 0 + 45
		}else{
		    return 0;
		}
	}else if(downPressed){
	    if(leftPressed){
		    return 180 + 45;
		}else if(rightPressed){
		    return 180 - 45;
		}else{
		    return 180;
		}
	}else if(leftPressed){
	    if(rightPressed){
		    //opposites.
		    return NaN;
		}else{
	        return 270;
		}
	}else if(rightPressed){
	    return 90;
	}else{
	    //No movement keys pressed?
		//Return nothing to signify, no movement hinted. After all, 0 and -1 are angles.
	    return NaN;
	}
}
	
	
	
	
	
-1.56
1.56




//Is ent1 facing ent2, within the tolerance (radians)?
function isFacing(arg_ent1, arg_ent2, arg_tolerance){
    var actualDir = arg_ent1.getImgAngle_raw();
	
	var xDelta = arg_ent2.x - arg_ent1.x;
	var yDelta = arg_ent2.y - arg_ent1.y;
	
	var idealDir = Math.atan2(yDelta, xDelta);
	
	var rawDiff = Math.abs( idealDir - actualDir);
	//"(PI - rawDiff)" in case the angle wraps around where the angles
	//go negative. Such as -1.56 vs. 1.56. -1.56 minus 1.56 is -3.12.
	//abs value: 3.12. 3.14 - 3.12: 0.02, within tolerance.
	if( rawDiff < arg_tolerance || (PI - rawDiff) < arg_tolerance){
		return true;
	}
	return false;
}//END OF isFacing
	
	

	
	
function rotateAroundPoint(argAxisX, argAxisY, argRotX, argRotY, argRadToRotate){


	var deltaX = argRotX - argAxisX;
	var deltaY = argRotY - argAxisY;
	
	
	var distanceFromAxis = Math.sqrt( Math.pow(deltaX, 2) + Math.pow(deltaY, 2) );
	
	var radYet = Math.atan2(deltaY, deltaX);
	
	var radFinal = radYet + argRadToRotate;
	
	return{
	    x:argAxisX + Math.cos(radFinal) * distanceFromAxis,
	    y:argAxisY + Math.sin(radFinal) * distanceFromAxis,
	};
	
}//END OF rotateAroundPoint


	
//Given value "arg_val" and a range arg_min to arg_max,
//force the min or max if arg_val goes out of these bounds.
//Otherwise return arg_val.
//If arg_max is less than arg_min, the arg_min is guaranteed to be returned instead.
function clamp(arg_val, arg_min, arg_max){
    //return Math.min( Math.max( arg_val, arg_min   ), arg_max );
	return Math.max( arg_min, Math.min( arg_val, arg_max   ), );
}
	
	

//Ensure that a given angle only comes out in range (-PI, PI), or -180deg to 180deg.	
function filterAngle(arg_rad){
    
	var radTest = arg_rad / (doublePI);
	
	
	var decimal = radTest % 1;
	var wholeFits = Math.trunc(radTest);
	
	//remove all whole multiples that fit.
	arg_rad -= wholeFits * (doublePI);
	//console.log("arg_rad? " + arg_rad);
	
	if(arg_rad > 0 && decimal > 0.5){
	    //If over halfway onto the next portion of 2PI, it means we're between PI and 2PI.
		//console.log("decimal above 0.5");
	    return arg_rad - doublePI;
	}else if(arg_rad < 0 && decimal <= -0.5){
	    //If halfway to the next portion of 2PI in the other direction (between -2PI and -PI)
		//console.log("decimal below -0.5");
	    return arg_rad + doublePI;
	}
	
	return arg_rad;
	
}//END OF filterAngle
	
	
	
	


//Doesn't actually precache directly. Adds the given file path to a list
//of file paths to precache at the end with "precacheApply" after all typical
//precache calls (precacheImage, precacheImageMap) are done.
function precacheImage(arg_imgFilePath){
    _aryImgPrecacheFilePathList[_imgPrecacheListSize_soft] = "img/"+arg_imgFilePath;
	_imgPrecacheListSize_soft++;
}
//separate version that does not put "img/" in front.  ImageMaps already automatically
//add a "img/" in front and should use this instead.
function _precacheImage(arg_imgFilePath){
    _aryImgPrecacheFilePathList[_imgPrecacheListSize_soft] = arg_imgFilePath;
	_imgPrecacheListSize_soft++;
}
//Precache each filePath (to an image) in a given image map.
function precacheImageMap(arg_imageMap){
    //an image map is really an array of SpriteInfo's (file paths).
	var i;
	for(i = 0; i < arg_imageMap.length; i++){
	    _precacheImage(arg_imageMap[i].filePath);
	}
}

//Must be called before any typicaly precache calls like "precacheImage" are done.
function precacheInit(){
    _imgPrecache = new Image();
	_imgPrecache.onload = function(){
		console.log("Loaded image #"+(_nextImgPrecacheID) + " : " + this.src + " siz: " + this.width + "x" + this.height );
		
		_nextImgPrecacheID++;
	    _precacheNextImage();
	}
	_nextImgPrecacheID = 0;
}//END OF precacheInit

//apply the precache to preload all the images for faster access at initial use.
function precacheApply(){
    //Begin the first precache. As each one finishes, the image in _imgPrecache is
	//swapped out for the next one in _aryImgPrecacheFilePathList until all are done.
    _precacheNextImage();
}//END OF precacheApply

//Set _imgPrecache's .src to the next filepath to load the next image, or, if out of
//things to precache, clear the imgPrecache's .src and start the game with Init().
function _precacheNextImage(arg_filePath){
    if(_nextImgPrecacheID < _imgPrecacheListSize_soft){
		_imgPrecache.src = _aryImgPrecacheFilePathList[_nextImgPrecacheID];
	}else{
		//Ready to start the game.
		_imgPrecache.src = "";  //clear it.
		Init();
	}
}//END OF _precacheNextImage
	
	


//Get the newly generated Canvas element (assuming it was recently placed at the end of the body element's
//child node list, childNodes) and attach it to divCanvas as the sole child node.
//This puts the game in the same general content area to fit the theme of this site.
//WARNING - may break if the simpleGame_1_0.js file puts the generated Canvas element in a different place.
function extraCanvasSetup(){

	elementCanvas = document.body.childNodes[document.body.childNodes.length - 1];
	document.body.removeChild(elementCanvas);
	
	var elementDivCanvas = document.getElementById("divCanvas");
	
	var hideMeTest = document.getElementById("hideme");
	if(hideMeTest != null){
		//remove the "Loading..." placeholder text
		elementDivCanvas.removeChild(hideMeTest);
	}
    
	
	elementDivCanvas.appendChild(elementCanvas);
	
	//The canvas should send its mouse coordinates. This is the most accurate
	//way to keep track of mouse coordinates for a Canvas on different parts
	//of the page, different zoom levels, etc.
	//Each time the mouse moves, it updates _mouse_x and _mouse_y with the
	//most recently recorded mouse coordinates.
	//  canvas_ref.setAttribute("onmousemove", "someFunctionName(event)");
	elementCanvas.onmousemove = function(arg_event){
	    _getMousePosition(elementCanvas, arg_event);
	}
	
	
	
	elementCanvas.onclick = function(arg_event){
	    //need this? Just in case.
		return false;
	}
	
	
	elementCanvas.onmousedown = function(arg_event){
		//just want to know when the mouse was pressed.
		//alert("????");
		mouseClicked = true;
		mouseDown = true;
		
		//https://stackoverflow.com/questions/3799686/clicking-inside-canvas-element-selects-text
		//Fix for chrome - otherwise, double clicking inside the canvas (easy to do) causes
		//some other element on the page to get highlighted.
		return false;
	}
	
	elementCanvas.onmouseup = function(arg_event){
	    mouseDown = false;
		return false;
	}
	
	elementCanvas.onmouseout = function(arg_event){
	    mouseDown = false;  //leaving the Canvas also counts as releasting the mouse.
		return false;
	}
	
	
	
	window.onresize = function(){
		//Anytime the window is resized (zoom?), readjust all button positions.
		var i;
		var canvasBounds = elementCanvas.getBoundingClientRect();
		
		if(aryButtonCustom != null){
			for(i = 0; i < aryButtonCustom.length; i++){
				
				
				if(aryButtonCustom[i] != null && aryButtonCustom[i].isVisible() ){
					aryButtonCustom[i].updatePosition(canvasBounds);
				}
				
			}
		}
	
	};
		
	
	
	
	//For drawing to for debug.
	ctx = elementCanvas.getContext("2d");
	

}//END OF extraCanvasSetup

	
	
	
//Given a filePath, create a new Image instance, set its .src to arg_filePath to load that image,
//and return the image instance.
//Do this once ahead of time for things that need to be drawn often, like the Arrow sprite
//for being drawn on top of Person graphics when ready to fire.
function generateImage(arg_filePath){
    var img = new Image();
	img.src = "img/"+arg_filePath;
	return img;
}

	
	
function getImageRotationPadding(arg_width, arg_height){
	
	//if(arg_angle_rad != 0){
		//if rotating, just add some padding to the lesser dimension and then a little more overall.
		//Requirements for deciding to draw or not that is, not drawn itself.
		if(arg_width > arg_height){
			return{
			  x: 0.3*arg_width,
			  y: (arg_width - arg_height) + 0.3*arg_width
			};
		}
		else{   //if arg_height < arg_width or equal
			return{
			  x: (arg_height - arg_width) + 0.3*arg_height,
			  y: 0.3*arg_height
			};
		}
	//}
	
	
}//END OF getImageRotationPadding
	
	

//TODO: rename with "test" at the end?
	
//CREDIT TO SimpleGame. Started as a clone of The Sprite's "collidesWith" method.
//This now accepts the bounds as parameters instead of a sprite in the context of a sprite.
 function rectangleCollision(r1x1, r1y1, r1x2, r1y2, r2x1, r2y1, r2x2, r2y2){
    
	//to relate to sides,
	//y1: top
	//y2: bottom
	//x1: left
	//x2: right
	
	/*
	if(
	  r1y2 < r2y1 ||
	  r1y1 > r2y2 ||
	  r1x2 < r2x1 ||
	  r1x1 > r2x2
	){
	    return false;
	}else{
	    return true;
	}
	*/
	
	if(
	  r1y2 >= r2y1 &&
	  r1y1 <= r2y2 &&
	  r1x2 >= r2x1 &&
	  r1x1 <= r2x2
	){
	    return true;
	}else{
	    return false;
	}
	
	
}//END OF rectangleCollision

	
/*
function entityCollision(arg_ent1, arg_ent2){
	return rectangleCollision(arg_ent1.bound_min_x, arg_ent1.bound_min_y,
}//END OF entityCollision
*/


function checkBlockingAndAdjustVelocity(out_newVelocity, arg_future_bound, arg_thisEnt, arg_otherEnt){
	
	//if(arg_future_bound.min_x > arg_otherEnt.bound_min_x &&
	//   arg_future_bound.min_y > arg_otherEnt.bound_min_y
	
	
	var collisionTest = rectangleCollision(
	  arg_future_bound.min_x,
	  arg_future_bound.min_y,
	  arg_future_bound.max_x,
	  arg_future_bound.max_y,
	  arg_otherEnt.bound_min_x,
	  arg_otherEnt.bound_min_y,
	  arg_otherEnt.bound_max_x,
	  arg_otherEnt.bound_max_y
	);
			
	if(!collisionTest){
		//no collision at all? nothing to do here.
	}else{
		//At what side(s) did it collide?
		var thisEntVel = arg_thisEnt.getVelocity();
			if(arg_thisEnt.getClassID()==CLASSID_Player)debug(" ");
		if(thisEntVel.x > 0){
			//if(arg_thisEnt.getClassID()==CLASSID_Player)debug("??? " + thisEntVel.x);
			//moving right?
			if(thisEntVel.y > 0){
			    //moving right-down?
				//Snap to the top or left side of the other entity. Decide which:
				var delta_x_fits = (arg_otherEnt.bound_min_x - arg_thisEnt.bound_max_x) / thisEntVel.x;
				var delta_y_fits = (arg_otherEnt.bound_min_y - arg_thisEnt.bound_max_y) / thisEntVel.y;
				//whichever is greater becomes the new speed (length of velocity vector)
				var greaterDelta = Math.max(delta_x_fits, delta_y_fits);
				out_newVelocity.x = out_newVelocity.x * greaterDelta; //todo: clamp to old?
				out_newVelocity.y = out_newVelocity.y * greaterDelta;
			}else if(thisEntVel.y < 0){
				var delta_x_fits = (arg_otherEnt.bound_min_x - arg_thisEnt.bound_max_x) / thisEntVel.x;
				var delta_y_fits = (arg_otherEnt.bound_max_y - arg_thisEnt.bound_min_y) / thisEntVel.y;
				//whichever is greater becomes the new speed (length of velocity vector)
				var greaterDelta = Math.max(delta_x_fits, delta_y_fits);
				out_newVelocity.x = out_newVelocity.x * greaterDelta; //todo: clamp to old?
				out_newVelocity.y = out_newVelocity.y * greaterDelta;
			}else{
				//dy = 0?
				var delta_x_fits = (arg_otherEnt.bound_min_x - arg_thisEnt.bound_max_x) / thisEntVel.x;
				var greaterDelta = delta_x_fits;
				out_newVelocity.x = out_newVelocity.x * greaterDelta; //todo: clamp to old?
				out_newVelocity.y = out_newVelocity.y * greaterDelta;
				
			}
		}else if(thisEntVel.x < 0){
		
			if(thisEntVel.y > 0){
			    //moving right-down?
				//Snap to the top or left side of the other entity. Decide which:
				var delta_x_fits = (arg_otherEnt.bound_max_x - arg_thisEnt.bound_min_x) / thisEntVel.x;
				var delta_y_fits = (arg_otherEnt.bound_min_y - arg_thisEnt.bound_max_y) / thisEntVel.y;
				//whichever is greater becomes the new speed (length of velocity vector)
				var greaterDelta = Math.max(delta_x_fits, delta_y_fits);
				out_newVelocity.x = out_newVelocity.x * greaterDelta; //todo: clamp to old?
				out_newVelocity.y = out_newVelocity.y * greaterDelta;
			}else if(thisEntVel.y < 0){
				var delta_x_fits = (arg_otherEnt.bound_max_x - arg_thisEnt.bound_min_x) / thisEntVel.x;
				var delta_y_fits = (arg_otherEnt.bound_max_y - arg_thisEnt.bound_min_y) / thisEntVel.y;
				//whichever is greater becomes the new speed (length of velocity vector)
				var greaterDelta = Math.max(delta_x_fits, delta_y_fits);
				out_newVelocity.x = out_newVelocity.x * greaterDelta; //todo: clamp to old?
				out_newVelocity.y = out_newVelocity.y * greaterDelta;
			}else{
				//dy = 0?
				var delta_x_fits = (arg_otherEnt.bound_max_x - arg_thisEnt.bound_min_x) / thisEntVel.x;
				var greaterDelta = delta_x_fits;
				out_newVelocity.x = out_newVelocity.x * greaterDelta; //todo: clamp to old?
				out_newVelocity.y = out_newVelocity.y * greaterDelta;
				
			}
		}else{
			//x = 0?
			
			
			if(thisEntVel.y > 0){
			    //moving right-down?
				//Snap to the top or left side of the other entity. Decide which:
				var delta_y_fits = (arg_otherEnt.bound_min_y - arg_thisEnt.bound_max_y) / thisEntVel.y;
				//whichever is greater becomes the new speed (length of velocity vector)
				var greaterDelta = delta_y_fits;
				out_newVelocity.x = out_newVelocity.x * greaterDelta; //todo: clamp to old?
				out_newVelocity.y = out_newVelocity.y * greaterDelta;
			}else if(thisEntVel.y < 0){
				var delta_y_fits = (arg_otherEnt.bound_max_y - arg_thisEnt.bound_min_y) / thisEntVel.y;
				//whichever is greater becomes the new speed (length of velocity vector)
				var greaterDelta = delta_y_fits;
				out_newVelocity.x = out_newVelocity.x * greaterDelta; //todo: clamp to old?
				out_newVelocity.y = out_newVelocity.y * greaterDelta;
			}else{
				//dy = 0?... what.
				
			}
			
			
		}
		
	}
	
	
}//END OF checkBlockingAndAdjustVelocity

	
	
	
	
	
	

//CREDIT TO SimpleGame - modified version of the Sprite's draw method to draw a given image
//at a given position and rotation (centered), scale applied. For use outside of a Sprite
//object such as for a preview graphic or temporary overlay (arrow a person is holding
//before firing).
function drawImage(arg_img, arg_position_x, arg_position_y, arg_angle_rad, arg_scale){
	//"ctx" is a global varaible set at the beginning. Relying on that.
    ctx.save();
	
	var drawWidth = (arg_img.width * arg_scale);
	var drawHeight = (arg_img.height * arg_scale);
	
	var padding = getImageRotationPadding(drawWidth, drawHeight);
	
	if(isRectOutsideOfScene(arg_position_x - (drawWidth / 2) - padding.x/2, arg_position_y - (drawHeight / 2) - padding.y/2, drawWidth + padding.x, drawHeight + padding.y)){
		//Stop! Don't draw if we're outside of the scene entirely.
		//console.log("ANYONE?!");
		return;
	}
	
	//Draws collision bounds of an entity.
	//debugDrawRect(arg_position_x - (drawWidth / 2) - padding.x/2, arg_position_y - (drawHeight / 2) - padding.y/2, drawWidth + padding.x, drawHeight + padding.y);
    
    ctx.translate(arg_position_x - scroll_x, arg_position_y - scroll_y);
    ctx.rotate(arg_angle_rad);
    
	
	ctx.drawImage(
	  arg_img, 
      0 - (drawWidth / 2), 
      0 - (drawHeight / 2),
      drawWidth,
	  drawHeight
	);
	
    ctx.restore();
}//END OF drawImage


//Version of above that only draws an image at an X Y location, no rotation, at its original size.
//Also from the top-left corner instead of the center.
function drawImageSimple(arg_img, arg_position_x, arg_position_y){
    
	ctx.drawImage(
	  arg_img, 
      arg_position_x - scroll_x,
      arg_position_y - scroll_y,
      arg_img.width,
	  arg_img.height
	);
	
}//END OF drawImageSimple


//Ignores the scroll position (scroll_x, scroll_y). Use for drawing GUI.
function drawImageSimpleFixed(arg_img, arg_position_x, arg_position_y){
    
	ctx.drawImage(
	  arg_img, 
      arg_position_x,
      arg_position_y,
      arg_img.width,
	  arg_img.height
	);
	
}//END OF drawImageSimple




function nullCheck(arg){
    return (arg == null || arg == "null");
}

















var nextAudioSlotPlayID = 0;
var aryAudioSlot = null;

var elementAudioHolder = null;


//CLASS.
function AudioSlot(){

    this.sound_audioRef = document.createElement("audio");
	this.sound_audioRef.style.display = "none";
	
    this.sound_source_mp3_ref = document.createElement("source");
	this.sound_source_wav_ref = document.createElement("source");
	this.sound_source_ogg_ref = document.createElement("source");
	
	
	//Blank sound path to fill each <source>'s "src" attribute,
	//which doesn't need to exist, to keep it from complaining about starting with
	//a nonexistent "src" attribute in console.
	
	this.blankSoundVariants();
	
	//preload: none or auto?
	setupAudioElementAttributes(this.sound_audioRef);
	setupAudioElementAttributes(this.sound_source_mp3_ref);
	setupAudioElementAttributes(this.sound_source_wav_ref);
	setupAudioElementAttributes(this.sound_source_ogg_ref);
   
	this.sound_audioRef.appendChild(this.sound_source_mp3_ref);
	this.sound_audioRef.appendChild(this.sound_source_wav_ref);
	this.sound_audioRef.appendChild(this.sound_source_ogg_ref);
	
	//document.body.appendChild(this.sound_audioRef);
	//elementAudioHolder.appendChild(this.sound_audioRef);
	
}//END OF AudioSlot


//just to stop the error message. These files are tiny.
AudioSlot.prototype.blankSoundVariants = function(){
	this.sound_source_mp3_ref.src = "snd/_engine/dummy.mp3";
	this.sound_source_wav_ref.src = "snd/_engine/dummy.wav";
	this.sound_source_ogg_ref.src = "snd/_engine/dummy.ogg";
}//END OF blankSoundVariants()


AudioSlot.prototype.setSoundVariants = function(arg_finalSoundPathExtensionless){
	this.sound_source_mp3_ref.src = arg_finalSoundPathExtensionless+".mp3";
    this.sound_source_wav_ref.src = arg_finalSoundPathExtensionless+".wav";
    this.sound_source_ogg_ref.src = arg_finalSoundPathExtensionless+".ogg";
	
	
	
	//alert("what? " + arg_finalSoundPathExtensionless);
}//END OF setSoundVariants



function setupAudioElementAttributes(arg_ele){
	
	arg_ele.preload = "auto";
	arg_ele.controls = "none";
	arg_ele.autoplay = false;
	
}//END OF setupAudioElementAttributes



//The webpage may want to play sound on demand at startup or at some event, like clicking
//a button. Adds an invisible <audio> element to the document's <body> and sets up some
//other expected references for the dynamic audio system.
function setupSound(){

    //elementAudioHolder = document.createElement("div");
	//elementAudioHolder.style.display = "none";
	//this element does not even have to be in the page?
	//document.body.appendChild(elementAudioHolder);
	
    _sound_audioRef_precache = new AudioSlot();
    
    aryAudioSlot = new Array(audioSlotAmount)
	var i;
	for(i = 0; i < audioSlotAmount; i++){
	    aryAudioSlot[i] = new AudioSlot();
	}
	
	/*
	//Even though this didn't stop the warnings, these "e" parent event stoppers may be helpful sometimes.
	sound_audioRefRaw.onloadstart = function(e){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
			console.log("TEST1");
			};
	*/
	
}//END OF setupSound



//Should force the requested sound to be downloaded to browser cache, if not already there.
//See notes below on how to provide a sound by name.
function precacheSound(arg_soundPathExtensionless){
    var finalSoundPath = "snd/"+arg_soundPathExtensionless;
	_sound_audioRef_precache.setSoundVariants(finalSoundPath);
	
	//sound_audioRef.pause();
	_sound_audioRef_precache.sound_audioRef.load();
}//END OF precacheSound



function precacheSoundMap(argMap){
	var i;
	for(i = 0; i < argMap.length; i++){
		precacheSound(argMap[i] );
	}

}//END OF precacheSoundMap
	




//Play the given sound. Sounds are assumed to be within the "snd" subfolder in another subfolder of their name.
//Do not provide that part here.
//ex: there is snd/mySound/mySound.mp3, .wav, and .ogg.  To play this, do this:
//    playSound("mySound");
//...This will make snd/mySound/mySound.mp3, snd/mySound/mySound.wav, and snd/mySound/mySound.ogg choices for playing.
function playSound(arg_soundPathExtensionless, arg_volume){

	//give it a snd/ in front.
    var finalSoundPath = "snd/"+arg_soundPathExtensionless;
	
	var nextAudioSlot = getNextAudioSlot();
	
	nextAudioSlot.setSoundVariants(finalSoundPath);
	
	//sound_audioRef.pause();
	nextAudioSlot.sound_audioRef.volume = arg_volume;
	nextAudioSlot.sound_audioRef.load();
    nextAudioSlot.sound_audioRef.play();
	
}//END OF playSound




function getNextAudioSlot(){
    var audioSlotRef = aryAudioSlot[nextAudioSlotPlayID];
	//console.log("SOUNDSLOT: " + nextAudioSlotPlayID);
	nextAudioSlotPlayID++;
	if(nextAudioSlotPlayID >= aryAudioSlot.length){
	    //loop back around to 0
	    nextAudioSlotPlayID = 0;
	}
	return audioSlotRef;
}//END OF getNextAudioSlot



//Tell each sound slot to stop playing sound.
function stopAllSound(){
	var i;
	for(i = 0; i < aryAudioSlot.length; i++){
		aryAudioSlot[i].sound_audioRef.pause();
		aryAudioSlot[i].sound_audioRef.currentTime = 0;
	}
}//END OF stopAllSound






function directionTowardsAngle(argRadDifference){
    if( (argRadDifference > 0 && argRadDifference < PI) || (argRadDifference < -PI) ){
		//angle in (0, PI) or (-2PI, -PI);
		//document.getElementById("debug").innerHTML = "clock " + angleToTarget + " " + this.targetLookAngle + " " + this.getImgAngle_raw( );
	    //go towards it clockwise (right from the top)
		//debug(argTarget + " c");
		
		//sign = 1;
		return 1;
	}else{
		//angle in (PI, 2PI) or (-PI, 0)
		//document.getElementById("debug").innerHTML = "counter clockwise " + angleToTarget + " " + this.targetLookAngle + " " + this.getImgAngle_raw( );;
	    //go towards it counter-clockwise (left from the top)
		//debug(argTarget + " cc");
		
		//sign = -1;
		return -1;
	}

}



function debug(arg){
	//document.getElementById("debug").innerHTML = arg;

}


	
	
	