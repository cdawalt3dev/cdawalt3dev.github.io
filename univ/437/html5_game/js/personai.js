


//TODO - when offscreen for too long, auto delete.

//20 frames in one second.
var PersonAI_ExpirationFrames = 25 * 20;


//static. Use this to create this as an entity and add it to the list of all entities.
function createPersonAI(argFactionID, argPositionX, argPositionY, argImgAngle){
    var availableID = getFirstAvailableEntityID();
	var templink = null;
	if(availableID != -1){
	    templink = new PersonAI(availableID, argFactionID, argPositionX, argPositionY, argImgAngle);
	    aryEntity[availableID].setLink( templink );
		//alert("??? " + aryEntity[0].linkedEntity);
	}
	return templink;
}




//CLASS PersonAI
function PersonAI(argEntityID, argFactionID, argPositionX, argPositionY, argImgAngle){
	Person.call(this, argEntityID, argFactionID, argPositionX, argPositionY, argImgAngle);
	
	this.enemyLink = new SafeEntityLink();
	
	//each PersonAI will expire in 30 seconds if the player never comes by.
	this.lifeFrames = PersonAI_ExpirationFrames;
	
}//END OF PersonAI class


PersonAI.prototype = Object.create(Person.prototype);


//PersonAI relies on the Person's "getSpriteMap", PersonSpriteMap


PersonAI.prototype.getClassID = function(){
    return CLASSID_PersonAI;
}

PersonAI.prototype.getMaxHealth = function(){
	if(this.factionID == FACTION_ALLY){
		//gets more health to compensate for rarity.
		return PersonAI_MAXHEALTH * 3;
	}else{
		return PersonAI_MAXHEALTH;
	}
}//END OF getMaxHealth

PersonAI.prototype.getPointBounty = function(){
    if(this.factionID == FACTION_ALLY){
		return Ally_POINTBOUNTY
	}else if(this.factionID == FACTION_ENEMY){
		return Enemy_POINTBOUNTY
	}else{
		//???
		return 0;
	}
}//END OF getBounty



//time it takes to reload (get another arrow), in seconds.
PersonAI.prototype.getReloadDuration = function(){
    return PersonAI_RELOADDURATION + Math.random() * 0.6;
}


PersonAI.prototype.getAutoHealAmount = function(){
	return PersonAI_AutoHealAmount;
}


//Relying on defaults from Person for
//getTurnDistanceDivisor, getTurnSpeedMin, and getTurnSpeedMax




PersonAI.prototype.customUpdate = function(){



    //Entity.prototype.customUpdate.call(this);
    Person.prototype.customUpdate.call(this);
    
	var enemyLinkTest = this.enemyLink.getLinkedEntity();
    if(enemyLinkTest != null){
		this.setTargetToLookAt(enemyLinkTest.x - enemyLinkTest.dx, enemyLinkTest.y - enemyLinkTest.dy);
		
		if(this.arrowReady && isFacing(this, enemyLinkTest, 0.1) ){
			this.fireArrow();
		}
	}
	
	
	
	
	
	
	

	
}//END OF customUpdate



PersonAI.prototype.customUpdateLate = function(){

	this.lifeFrames --;
	
	
	if(this.healthCurrent <= 0){
	    //delete self!
		//But first if the player dealt the last hit...
		if(this.recentDamagingFactionID == FACTION_PLAYER){
			//affect the player score by my bounty. Friendlies penalize.
			
			var player1test = player1.getLinkedEntity();
			if(player1test != null){
				player1test.changeScore( this.getPointBounty() );
			}
		}
		
		removeEntity(this);
		return;
	}

	
	if(this.lifeFrames <= 0){
		removeEntity(this);
		return;
	}
	
	
	
	//draw healthbar below me, if I am visible on screen.
	if(!isEntityOutsideOfScene(this)){
		var myPositionFixed = this.getPositionFixed();
		var myHealthBarVerticalOffset;
		
		if(myPositionFixed.y + this.height + 10 < sceneHeight){
			//by default, draw the healthbar below, but draw it above instead if there is
			//not enough space to do that below.
			myHealthBarVerticalOffset = this.height/2 + personAI_healthBarVerticalOffset;
		}else{
			myHealthBarVerticalOffset = -(this.height/2 + personAI_healthBarVerticalOffset);
		}
		
		drawHealthBar(
		  myPositionFixed.x,
		  myPositionFixed.y + myHealthBarVerticalOffset,
		  32, 8, this.healthCurrent / this.getMaxHealth(), genericHealthBarTransparency
		);
		
	}//END OF in scene check
	
	
	
	
	
	
	
}//END OF customUpdateLate()


PersonAI.prototype.customUpdateLong = function(){

	
	var i;
	var bestDistanceYet = 800;
	var enemyTest = null;
	
	for(i = 0; i < aryEntity.length; i++){
		var otherEnt = aryEntity[i].linkedEntity;
		//don't check myself.
		if(i != this.entityID && otherEnt != null){
			var otherClass = otherEnt.getClassID();
			if( (otherClass == CLASSID_Player || otherClass == CLASSID_PersonAI) && otherEnt.getHatedBy(this) ){
				//If the other entity is a player or PersonAI and I hate them, allow them to be an enemy.
				var dist = distanceBetweenPoints( this.x, this.y, otherEnt.x, otherEnt.y);
				if(dist < bestDistanceYet){
				    bestDistanceYet = dist;
					enemyTest = otherEnt;
				}
				
			}
			
			
			
		}
	}//END OF for loop through all entities.
	
	
	
	
	player1Test = player1.getLinkedEntity();
	//Another check...
	if(player1Test != null){
		//If the player is up to this close, reset the expiration time.
		//Deleting oneself in front of the player is just bad manners.
		var dist = distanceBetweenPoints( this.x, this.y, player1Test.x, player1Test.y);
		if(dist < 1100){
			this.lifeFrames = PersonAI_ExpirationFrames;
		}
	}
			
	
	
	if(enemyTest != null){
		//This will be my enemy. Re-setting to the extact same enemy is also valid (still the closest).
		this.enemyLink.setLinkedEntity(enemyTest);
	}
	
	var enemyLinkTest = this.enemyLink.getLinkedEntity();
	if(enemyLinkTest != null){
		//if we already have an enemy but they are too far away, forget them.
		var dist = distanceBetweenPoints( this.x, this.y, enemyLinkTest.x, enemyLinkTest.y);
		if(dist > 1000){
			this.enemyLink.forgetLinkedEntity();
		}
	}
	
	
	

}//END OF customUpdateLong











