



//static. Use this to create this as an entity and add it to the list of all entities.
function createPlayer(argFactionID, argPositionX, argPositionY, argImgAngle){
    var availableID = getFirstAvailableEntityID();
	var templink = null;
	if(availableID != -1){
	    templink = new Player(availableID, argFactionID, argPositionX, argPositionY, argImgAngle);
	    aryEntity[availableID].setLink( templink );
		//alert("??? " + aryEntity[0].linkedEntity);
	}
	return templink;
}



//CLASS Player
//Represents a Person that can take orders from user input (arrow keys, mouse).
//Also keeps track of score.
function Player(argEntityID, argFactionID, argPositionX, argPositionY, argImgAngle){
    Person.call(this, argEntityID, argFactionID, argPositionX, argPositionY, argImgAngle);
	
}//END OF Player class

Player.prototype = Object.create(Person.prototype);

//Player relies on the Person's "getSpriteMap", PersonSpriteMap


Player.prototype.getClassID = function(){
    return CLASSID_Player;
}

Player.prototype.getMaxHealth = function(){
    return Player_MAXHEALTH;
}//END OF getMaxHealth

Player.prototype.getPointBoundy = function(){
    return 100;  //multi-player?
}

Player.prototype.getReloadDuration = function(){
    return Player_RELOADDURATION;
}

Player.prototype.getAutoHealAmount = function(){
	return Player_AutoHealAmount;
}



//Player gets improved turn attributes for better control.
Player.prototype.getTurnDistanceDivisor = function(){
	return 1.9;
}
//These are in radians.
Player.prototype.getTurnSpeedMin = function(){
	return 0.22;
}
Player.prototype.getTurnSpeedMax = function(){
	return 0.83;
}



Player.prototype.customUpdate = function(){

	var moveAng = getMovementAngle();
	var currentSpeed;
	
	if(!isNaN(moveAng)){
		currentSpeed = this.getSpeed();
		var speedFactor = ((currentSpeed + 0.3) / (5));
		if(speedFactor > 1)speedFactor = 1;
		var adjustedMoveSpeed = personMoveSpeed * speedFactor;
		
		//document.getElementById("debug").innerHTML = speedFactor + "<br/>" + this.dx + "<br/>" + this.dy;
	
	    this.addVector(moveAng, adjustedMoveSpeed);
	}
	
	this.updateMouseLook();
	
	
	if(this.arrowReady){
	    if(mouseDown){
		    //make before the physics call (customUpdate calls Sprite.update in Entity).
			//That way the arrow's first physics call will still appear to move the arrow
			//along the player's bow while it is coming out, if the player moves at the 
			//same speed while firing.  Does not affect firing stationary of course.
			this.fireArrow();
		}else{
			
		}
	}//END OF this.arrowReady check

    Person.prototype.customUpdate.call(this);
	
}//END OF customUpdate



Player.prototype.customUpdateLate = function(){
	
	if(this.healthCurrent <= 0){
		
		removeEntity(this);
		endGame(false);    //game over.
		return;
	}
	
}//END OF customUpdateLate



Player.prototype.changeScore = function(argScoreAdj){
	playerScore += argScoreAdj;
}//END OF changeScore


	
Player.prototype.updateMouseLook = function(){
	var mouseCoords = getMousePosition();
	var myVelocity = this.getVelocity();
	this.setTargetToLookAt(mouseCoords.x - myVelocity.x, mouseCoords.y - myVelocity.y);
	
	
	
	//debugDrawRectCentered(mouseCoords.x, mouseCoords.y, 8, 8, "#a05c26");
}//END OF updateMouseLook
	
	
