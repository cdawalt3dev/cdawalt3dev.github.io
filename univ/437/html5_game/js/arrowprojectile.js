
	

var ArrowProjectileSpriteMap = [
  new SpriteInfo("player/player_arrow.png", 96, 24, 0.5, 38, 0, 15, 15),
  new SpriteInfo("ally/ally_arrow.png", 96, 24, 0.5, 38, 0, 15, 15),
  new SpriteInfo("enemy/enemy_arrow.png", 96, 24, 0.5, 38, 0, 15, 15)
  
];



//for common use elsewhere.
var arrowSpriteWidth = ArrowProjectileSpriteMap[0].width;
var arrowSpriteHeight = ArrowProjectileSpriteMap[0].height;
var arrowSpriteScale = ArrowProjectileSpriteMap[0].spriteScale;


function createArrowProjectile(argOwnerFactionID, argPositionX, argPositionY, argImgAngle, argVelocityX, argVelocityY){
    var availableID = getFirstAvailableEntityID();
	var templink = null;
	if(availableID != -1){
	    templink = new ArrowProjectile(availableID, argOwnerFactionID, argPositionX, argPositionY, argImgAngle, argVelocityX, argVelocityY);
	    aryEntity[availableID].setLink( templink );
	}
	return templink;
}





	
	
//CLASS ArrowProjectile
function ArrowProjectile(argEntityID, argOwnerFactionID, argPositionX, argPositionY, argImgAngle, argVelocityX, argVelocityY){
    //original sprite size: 256x256. Use as a reference for offsets.
	Entity.call(this, argEntityID);
	this.spriteIndex = 0;
	this.ownerFactionID = argOwnerFactionID;
	this.setSpriteIndex( this.ownerFactionID);
	
	this.setPosition(argPositionX, argPositionY);
	this.setAngle_raw(argImgAngle);
	this.setVelocity(argVelocityX, argVelocityY);
	
	this.lifeFrames = 60;
	
}//END OF ArrowProjectile constructor

ArrowProjectile.prototype = Object.create(Entity.prototype);


ArrowProjectile.prototype.getSpriteMap = function(){
    return ArrowProjectileSpriteMap;
}

ArrowProjectile.prototype.getClassID = function(){
    return CLASSID_ArrowProjectile;
}









ArrowProjectile.prototype.checkCollision = function(){
    
	//Person's can not intercept other Person's or walk out of the map's bounds.
	if(this.spriteInfoRef == null){
	    //need spriteInfo for collision bounds.
		return;
	}
	
	
	if(this.ownerFactionID == FACTION_PLAYER){
		//Player arrows expire fast if they go outside of the screen to help avoid
		//unintentional friendly fire.
		var outsideOfScene = isEntityOutsideOfScene(this);
		
		if(outsideOfScene && this.lifeFrames > 7){
			//actually still last a little longer to not be as easy to tell this is happening.
			this.lifeFrames = 7;
		}
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
	
	
	//Go through all entities and see if I'm going to overlap with anything besides
	//myself. Really anything PersonAI or Player.
	var i = 0;
	for(i = 0; i < aryEntity.length; i++){
		if(i == this.entityID)continue;  //do not attempt to collide with oneself.
		var otherEnt = aryEntity[i].linkedEntity;
		if(otherEnt == null)continue;  //do not proceed if this slot is empty.
		var otherClassID = otherEnt.getClassID();
		if(otherClassID == CLASSID_Player || otherClassID == CLASSID_PersonAI){
			//these will block my momentum.
			//checkBlockingAndAdjustVelocity(newVelocity, future_bound, this, otherEnt);
			
			if(this.ownerFactionID == otherEnt.factionID){
				//those of the same faction, like fellow allies or enemies, may not hit each other.
				continue;
			}
			
			if(rectangleCollision(
				future_bound.min_x,
				future_bound.min_y,
				future_bound.max_x,
				future_bound.max_y,
				otherEnt.bound_min_x,
				otherEnt.bound_min_y,
				otherEnt.bound_max_x,
				otherEnt.bound_max_y
			)){
				//reduce the victim's health by 20, but health can not go below 0.
				otherEnt.changeHealth( -20 );
				//report who damaged this recently.
				
				
				otherEnt.playDamagedSound();
				
				otherEnt.recentDamagingFactionID = this.ownerFactionID;
				removeEntity(this);
				return;
			}
			
		}
	}//END OF loop
	
	
	if(newVelocity.x != myVelocity.x || newVelocity.y != myVelocity.y){
	    //any change? Commmit.
		this.setVelocity(newVelocity.x, newVelocity.y);
	}//END OF difference check
	
}//END OF checkCollision










ArrowProjectile.prototype.customUpdate = function(){
    
	this.lifeFrames--;
	
	
	
	//Arrows may also be deleted by leaving the visible area onscreen. This helps prevent arrows
	//from accidentally hitting allies offscreen.
	
	
	if(this.lifeFrames <= 0){
	    //delete self!
		removeEntity(this);
		return;
	}
	
	
    Entity.prototype.customUpdate.call(this);
		
		
	
}//END OF customUpdate


