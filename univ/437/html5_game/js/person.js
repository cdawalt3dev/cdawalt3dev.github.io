


//All image paths are implied under the "img" folder first.
var PersonSpriteMap = [
  new SpriteInfo("player/player_bow_ready.png", 192, 192, 0.5, 0, 0, 32, 32),
  new SpriteInfo("ally/ally_bow_ready.png", 192, 192, 0.5, 0, 0, 32, 32),
  new SpriteInfo("enemy/enemy_bow_ready.png", 192, 192, 0.5, 0, 0, 32, 32),
  
];



var personSpriteAimOriginOffsetX = 0; //84;
var personSpriteAimOriginOffsetY = 24;
var personSpriteArrowOriginOffsetX = -14;
var personSpriteArrowOriginOffsetY = 22;
//-8, 24??



//CLASS Person
//Represents a general archer that can be manually controlled (Player subclass)
//or given commands by game logic (PersonAI subclass).
//Create instances of the subclasses, not the general Person. Only here for structure.
function Person(argEntityID, argFactionID, argPositionX, argPositionY, argImgAngle){

	//because "getMaxHealth" needs to know our faction.
	this.factionID = argFactionID;
	
	Entity.call(this, argEntityID);
	
	
	
	
	this.recentDamagingFactionID = -1;
	this.targetLookAngle = 0;
	this.arrowReady = false;
	
	
	this.setSpriteIndex(this.factionID);
	
	this.setPosition(argPositionX, argPositionY);
	
	this.setTargetAngleInstant(argImgAngle);
	
	
	
	this.arrowReloadTimeLeft = this.getReloadDuration();
	this.autoHealCooldown = 1;
	
	
	
}//END OF Person class


Person.prototype = Object.create(Entity.prototype);



Person.prototype.getSpriteMap = function(){
    return PersonSpriteMap;
}

//time it takes to reload (get another arrow), in seconds.
Person.prototype.getReloadDuration = function(){
    return 1;  //default
}

//AmouNt of health to recover every second.
Person.prototype.getAutoHealAmount = function(){
	return 1;  //default
}



//Amount to divide the current remaining (angle) distance between current image angle
//and target angle. Such as, dividing a remaining distance of 1.2 rads by 2.6 to get
//how much to move by, before clamping is applied (TurnSpeed Min and Max below).
Person.prototype.getTurnDistanceDivisor = function(){
	return 2.6;
}
//These are in radians.
Person.prototype.getTurnSpeedMin = function(){
	return 0.07;
}
Person.prototype.getTurnSpeedMax = function(){
	return 0.79;
}




Person.prototype.getHatedBy = function(argOther){
    //Does the other thing hate me?
	if(this.factionID == FACTION_PLAYER || this.factionID == FACTION_ALLY){
		//players and allies are hated by enemies.
		if(argOther.factionID == FACTION_ENEMY){
			return true;
		}
	}
	
	if(this.factionID == FACTION_ENEMY){
		//vice versa.
		if(argOther.factionID == FACTION_PLAYER || argOther.factionID == FACTION_ALLY){
			
			return true;
		}
	}
	return false;
}//END OF getHatedBy





Person.prototype.checkCollision = function(){
	//Person's can not intercept other Person's or walk out of the map's bounds.
	if(this.spriteInfoRef == null){
	    //need spriteInfo for collision bounds.
		return;
	}
	
	var myVelocity = this.getVelocity();
	
	var newVelocity = {x:myVelocity.x, y:myVelocity.y};  //starts as a clone of myVelocity.
	
	
	//Package these as one object for convenience.
	var future_bound = {
	min_x: this.bound_min_x + myVelocity.x,
	min_y: this.bound_min_y + myVelocity.y,
	max_x: this.bound_max_x + myVelocity.x,
	max_y: this.bound_max_y + myVelocity.y
	};
	
	if(future_bound.min_x < scroll_bound_min_x){
		newVelocity.x = Math.max(newVelocity.x, scroll_bound_min_x - this.bound_min_x);
	}
	if(future_bound.max_x > scroll_bound_max_x){
		newVelocity.x = Math.min(newVelocity.x, scroll_bound_max_x - this.bound_max_x);
	}
	if(future_bound.min_y < scroll_bound_min_y){
		newVelocity.y = Math.max(newVelocity.y, scroll_bound_min_y - this.bound_min_y);
	}
	if(future_bound.max_y > scroll_bound_max_y){
		newVelocity.y = Math.min(newVelocity.y, scroll_bound_max_y - this.bound_max_y);
	}
	
	
	//go through all entities and see if I'm going to overlap with anything besides
	//myself. Don't go through other Person's.
	var i = 0;
	for(i = 0; i < aryEntity.length; i++){
		if(i == this.entityID)continue;  //do not attempt to collide with oneself.
		var otherEnt = aryEntity[i].linkedEntity;
		if(otherEnt == null)continue;  //do not proceed if this slot is empty.
		var otherClassID = otherEnt.getClassID();
		if(otherClassID == CLASSID_Player || otherClassID == CLASSID_PersonAI){
			//these will block my momentum.
			checkBlockingAndAdjustVelocity(newVelocity, future_bound, this, otherEnt);
			
			
			
		}
	}//END OF loop
	
	
	if(newVelocity.x != myVelocity.x || newVelocity.y != myVelocity.y){
	    //any change? Commmit.
		this.setVelocity(newVelocity.x, newVelocity.y);
	}//END OF difference check
	
}//END OF checkCollision




//Given this person's position, rotation and offset in the sprite, get the position
//and angle to draw an arrow or fire an arrow from. This info can be used for both.
Person.prototype.getArrowPosition = function(){

	var rawFacingRad = this.getImgAngle_raw();
	//document.getElementById("debug").innerHTML = rawFacingRad;

	var arrowOriginRawX = personSpriteArrowOriginOffsetX * arrowSpriteScale;
	var arrowOriginRawY = personSpriteArrowOriginOffsetY * arrowSpriteScale;
	
	//aimOrigin = {x:arrowOriginRawX, y:arrowOriginRawY};
	var aimOrigin = rotateAroundPoint(0,0, arrowOriginRawX, arrowOriginRawY, rawFacingRad);
	
	//push it forward so that the player's hand is at the back of the arrow.
	var aimVector = [Math.cos(rawFacingRad), Math.sin(rawFacingRad)];
	//yes, by width for both. We have to push the arrow in the direction of its width
	//by that aim vector a distance half of "arrowSpriteWidth", with arrowSpriteScale applied.
	aimOrigin.x += aimVector[0] * (arrowSpriteWidth*arrowSpriteScale)/2;
	aimOrigin.y += aimVector[1] * (arrowSpriteWidth*arrowSpriteScale)/2;
	
	currentPosition = this.getPosition();
	var absolutePositionX = currentPosition.x + aimOrigin.x;
	var absolutePositionY = currentPosition.y + aimOrigin.y;
	
	return {
		angle:this.getImgAngle_raw(),
		position:{x: absolutePositionX, y: absolutePositionY}
	};
	
}//END OF getArrowPosition



Person.prototype.playDamagedSound = function(){
	
	
	var player1test = player1.getLinkedEntity();
		
	//make the volume depend on how close we are to the player.
	if(player1test != null){
	
	
		//number between 0 and (HitSoundMap length - 1) inclusive.
		var randomHitSound = Math.floor(Math.random() * HitSoundMap.length);
		var hitSoundChoice = HitSoundMap[randomHitSound];
	
		var distToPlayer = distanceBetweenPoints(this.x, this.y, player1test.x, player1test.y);
		
		//these will get spammed a lot, keep the noise down.
		if(distToPlayer < 900){
			playSound(hitSoundChoice, 0.6);
		}else if(distToPlayer < 1200){
			playSound(hitSoundChoice, 0.05);
		}else{
			//too far away.
		}
	}
	
	
	



}//END OF playDamageSound


Person.prototype.fireArrow = function(){

	var spawnInfo = this.getArrowPosition();
	
	var playerMoveAngle = this.getMoveAngle_raw();
	var playerMoveSpeed = this.getSpeed();
	
	//var playerMoveVelocityX = playerMoveSpeed * Math.cos(playerMoveAngle);
	//var playerMoveVelocityY = playerMoveSpeed * Math.sin(playerMoveAngle);
	var playerVelocity = this.getVelocity();
	
	//Factoring in the player's velocity isn't so great...
	//var arrowMoveVelocityX = playerVelocity.x + Math.cos(spawnInfo.angle) * arrowSpeed;
	//var arrowMoveVelocityY = playerVelocity.y + Math.sin(spawnInfo.angle) * arrowSpeed;
	
	var arrowMoveVelocityX = Math.cos(spawnInfo.angle) * arrowSpeed;
	var arrowMoveVelocityY = Math.sin(spawnInfo.angle) * arrowSpeed;
	
	
	var createdTest = createArrowProjectile(this.factionID, spawnInfo.position.x, spawnInfo.position.y, spawnInfo.angle, arrowMoveVelocityX, arrowMoveVelocityY);
	
	if(createdTest != null){
	    //only play the firing sound if we actually fired something.
		
		var player1test = player1.getLinkedEntity();
		
		//make the volume depend on how close we are to the player.
		if(player1test != null){
			var distToPlayer = distanceBetweenPoints(this.x, this.y, player1test.x, player1test.y);
			
			//these will get spammed a lot, keep the noise down.
			if(distToPlayer < 900){
				playSound("arrow/woosh", 0.6);
			}else if(distToPlayer < 1200){
				playSound("arrow/woosh", 0.04);
			}else{
				//too far away.
			}
		}
		
		//little delay before firing again.
		this.arrowReady = false;
		this.arrowReloadTimeLeft += this.getReloadDuration();
		
		/*
		ctx.strokeStyle = "#0000ff";
		ctx.beginPath();
		ctx.moveTo(createdTest.x-scroll_x,createdTest.y-scroll_y);
		ctx.lineTo(createdTest.x+createdTest.dx*30-scroll_x,createdTest.y+createdTest.dy*30-scroll_y);
		ctx.stroke();
		*/
		
	}
	
}//END OF fireArrow

Person.prototype.drawArrowAimGraphic = function(){
	var drawInfo = this.getArrowPosition();
	drawImage(imgPlayerArrowProjectile, drawInfo.position.x, drawInfo.position.y, drawInfo.angle, arrowSpriteScale);
}//END OF drawArrowAimGraphic





//Called every frame.
//Makes this Person turn to face the target angle, but not
//instantly (unless close enough to round to that).
//The further away the image angle is from the target angle, the faster the turn.
//Turns slower near the target angle.
Person.prototype.faceTargetAngle = function(){

	
	
	var currentImgAngle = this.getImgAngle_raw( );
	var angleToTarget = this.targetLookAngle - currentImgAngle;
	var angleDist = Math.abs(angleToTarget);
	
	//hacky - if the targetDist is above PI, the halfway point, we probably wrapped around.
	//Just remove angleDist from 2*Math.PI to leave it positive and equivalent in a shorter route around.
	if(angleDist > PI)angleDist = 2*Math.PI - angleDist;
	
	var newImgAngle = NaN;  //default to not a number.
	
	var sign = NaN;
	
	if(angleDist == 0){
		//already there?
	}
	//no need, the clamp below will bring to the exact angle if
	//it is within the min turn speed's distance.
	/*else if( angleDist < 0.05){
	    //close enough, just force it.
		
		newImgAngle = this.targetLookAngle;
	}*/
	else{
	    sign = directionTowardsAngle(angleToTarget);
	}
	
	if(!isNaN(sign)){
	
		var turnSpeedDivisor = this.getTurnDistanceDivisor();
		var turnSpeedMin = this.getTurnSpeedMin();
		var turnSpeedMax = this.getTurnSpeedMax();
	
	    newImgAngle = filterAngle(currentImgAngle + sign * clamp(angleDist / turnSpeedDivisor, turnSpeedMin, turnSpeedMax));
		//debug(clamp(angleDist / 2.6, 0.07, 0.79));
		var angleToTargetNew = this.targetLookAngle - newImgAngle;
		
		var signn = directionTowardsAngle(angleToTargetNew);
		
		//debug("_");
		
		if(sign == 1 && signn == -1){
			//debug("YEA " + newImgAngle + " " + this.targetLookAngle + " " + signn);
		    newImgAngle = this.targetLookAngle;
		}
		if(sign == -1 && signn == 1){
		    //debug("NEA" + newImgAngle + " " + this.targetLookAngle + " " + signn);
		    newImgAngle = this.targetLookAngle;
		}
		
	}
	
	
	
	if(!isNaN(newImgAngle)){
		this.setImgAngle_raw( newImgAngle);
	}
	

}//END OF faceTargetAngle



Person.prototype.customUpdate = function(){
	
	currentPosition = this.getPosition();
	
	if(this.arrowReloadTimeLeft > 0){
	    this.arrowReloadTimeLeft -= timeDelta;
	}
	if(this.arrowReloadTimeLeft <= 0){
		this.arrowReady = true;
	}
	
	this.autoHealCooldown -= timeDelta;
	if(this.autoHealCooldown <= 0){
		this.autoHealCooldown += 1; //seconds, always 1.
		this.changeHealth(this.getAutoHealAmount());
	}
	
	/*
	if(keysDown[K_Q]){
	    this.changeImgAngleBy_raw(-0.1);
	}
	if(keysDown[K_E]){
	    this.changeImgAngleBy_raw(0.1);
	}
	*/
	
	
	
	this.faceTargetAngle();
	
	
	var moveAng = getMovementAngle();
	currentSpeed = this.getSpeed();
	
	if(!isNaN(moveAng) || currentSpeed > personStopSpeed){
		//So long as there is a moveAng (any controls pressed, trying to move) or our speed is still
		//above the "stopSpeed" since stopping, continue applying this.
		//Important not to try stopping while simply accelerating into a run.
		this.setSpeed(  currentSpeed * personMoveFriction  );
	}else{
		//Otherwise, stop. No need to keep spliding.
	    this.setSpeed(0);
	}
	
	
	
	
	
	
	/*
	//PLAYER ONLY
	if(this.arrowReady){
	    if(mouseClicked){
		    //make before the physics call (customUpdate calls Sprite.update in Entity).
			//That way the arrow's first physics call will still appear to move the arrow
			//along the player's bow while it is coming out, if the player moves at the 
			//same speed while firing.  Does not affect firing stationary of course.
			this.fireArrow();
			this.arrowReady = false;
		}else{
			
		}
	}//END OF this.arrowReady check
	*/
	
    //apply a change in position based on speed.
    Entity.prototype.customUpdatePhysics.call(this);
	
	
	/*
	if(this.arrowReady){
	    if(mouseClicked){
			//this.fireArrow();
			//this.arrowReady = false;
		}else{
		    //Draw the aim graphic before drawing the player sprite. It goes on top of the arrow.
			//This is the arrow ready to fire.
			//This is also done after the physics above (moves the sprite) so it is drawn to the
			//exact correct place this frame.
			this.drawArrowAimGraphic();
		}
	}//END OF this.arrowReady check
	*/
	
	
	if(this.arrowReady){
		this.drawArrowAimGraphic();
	}//END OF this.arrowReady check
	
	
	
	Entity.prototype.customDraw.call(this);
	
	
	/*
	//var mouse_delta_x = mouse_x - currentPosition.x;
	//var mouse_delta_y = mouse_y - currentPosition.y;
	//var rawFacingRad = Math.atan2(mouse_delta_y, mouse_delta_x);
	var rawFacingRad = (this.getImgAngle() - 90) * (PI / 180);
	
	var aimOriginRawX = personSpriteAimOriginOffsetX * this.spriteScale;
	var aimOriginRawY = personSpriteAimOriginOffsetY * this.spriteScale;
	var aimOrigin = rotateAroundPoint(0,0, aimOriginRawX, aimOriginRawY, rawFacingRad);
	
	
	currentPosition = this.getPosition();
	
	ctx.fillStyle="#a05c26";
	//ctx.fillRect(aimOrigin.x - 4 + 100,aimOrigin.y - 4+ 100, 8, 8);
	ctx.fillRect(
	currentPosition.x + aimOrigin.x - 4,
	currentPosition.y + aimOrigin.y - 4,
	8,
	8
	);

	*/
	
	
	
	
}//END OF customUpdate


Person.prototype.setTargetAngleInstant = function(arg_ang){
	this.targetLookAngle = arg_ang;
	this.setImgAngle_raw(arg_ang);
}//END OF setTargetAngleInstant

Person.prototype.setTargetToLookAt = function(arg_x, arg_y){


	var currentPosition = this.getPosition();
    
	
	if( !isNaN(arg_x) && !isNaN(arg_y) ){
		
	
		var mouse_delta_x = arg_x - currentPosition.x;
		var mouse_delta_y = arg_y - currentPosition.y;
		var rawFacingRad = Math.atan2(mouse_delta_y, mouse_delta_x);
		
		
		var aimOriginRawX = personSpriteAimOriginOffsetX * this.spriteInfoRef.spriteScale + currentPosition.x;
		var aimOriginRawY = personSpriteAimOriginOffsetY * this.spriteInfoRef.spriteScale + currentPosition.y;
		var aimOrigin = rotateAroundPoint(currentPosition.x, currentPosition.y, aimOriginRawX, aimOriginRawY, rawFacingRad);
		
		
		
		
		var mouse_aim_delta_x = arg_x - aimOrigin.x;
		var mouse_aim_delta_y = arg_y - aimOrigin.y;
		var rawAimFacingRad = Math.atan2(mouse_aim_delta_y, mouse_aim_delta_x);
		
		//console.log("("+mouse_aim_delta_x+", " + -mouse_aim_delta_y+")" + "  " + rawAimFacingRad);
		
		this.targetLookAngle = rawAimFacingRad;
		
	}//END OF arg_x and arg_y NaN checks


}//END OF setTargetToLookAt

