


//static
var nextButtonID = 0;

var aryButtonCustom = null;


function init_aryButtonCustom(){
    var i;
	aryButtonCustom = new Array(128);
	for(i = 0; i < aryButtonCustom.length; i++){
		aryButtonCustom[i] = null;
	}
}

function CreateButtonCustom(argLabel){
    
	if(nextButtonID < aryButtonCustom.length){
		var tempRef = new ButtonCustom(argLabel);
		aryButtonCustom[nextButtonID] = tempRef;
		nextButtonID++;
		return tempRef;
	}else{
		console.log("ERROR - max number of buttons created!");
	}
	
	return null;
}//END OF CreateButtonCustom



//CLASS ButtonCustom
//Extension of SimpleGame's GameButton for positioning relative to the
//game window in a different location.
function ButtonCustom(argLabel){

	GameButton.call(this, argLabel);
	
	this.x = 0;
	this.y = 0;

}//END OF ButtonCustom class



ButtonCustom.prototype = Object.create(GameButton.prototype);


//Set my position in a way that stores the intended position compared to the 
//size of the canvas. Flexible for different zoom levels.
ButtonCustom.prototype.setPositionCustom = function(arg_x, arg_y){
	this.x = arg_x;
	this.y = arg_y;
	
	this.setPos(arg_x, arg_y);
	
	this.updatePositionAuto();
	
	this._isVisible = true;
	
}//END OF setPositionCustom



ButtonCustom.prototype.updatePositionAuto = function(){
	this.updatePosition( elementCanvas.getBoundingClientRect() );
}//END OF updatePositionAuto

//re-adjust my position based on the new canvas bounds since zooming in or out in the browser.
ButtonCustom.prototype.updatePosition = function(arg_canvasBounds){
	
	this.setPos(arg_canvasBounds.left + this.x, arg_canvasBounds.top + this.y);
	
}//END OF updatePosition

ButtonCustom.prototype.setVisible = function(arg_vis){
    
	if(arg_vis){
		//makes it visible, really.
		this.updatePositionAuto();  //in case it needs updating.
		this.button.style.display = "";
		this._isVisible = true;
	}else{
		//hides it.
		this.button.style.display = "none";
		this._isVisible = false;
	}
	
}//END OF setVisible


ButtonCustom.prototype.testFunc = function(){
    console.log("Oh looky!");
} 


//Give the property and function the same name at your own peril!
//Or something firefox can pick up but chrome can't.  So yea, peril.
ButtonCustom.prototype.isVisible = function(){
	return this._isVisible;
}//END OF isVisible


ButtonCustom.prototype.changeLabel = function(argNewLabel){
	this.button.innerHTML = argNewLabel;
}//END OF changeLabel




