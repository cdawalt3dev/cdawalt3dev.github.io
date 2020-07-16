

//CLASS Entity.
//Has some methods / varaibles needed by all other objects, including the Sprite class's behavior from the SimpleGame engine.
function Entity(argEntityID){
    Sprite.call(this, scene, "", 0, 0);
	
	this.entityID = argEntityID;
	
	
	//safe default. This game supports scrolling.
	this.setBoundAction(CONTINUE);
	
	
	this.healthCurrent = this.getMaxHealth();
	
	
	//default. MUST call "setSpriteIndex" to actually get an image using this at all.
	this.spriteIndex = 0;
	this.spriteInfoRef = null;
	
	this.setPosition(0, 0);
	this.setAngle(0);
    this.setSpeed(0);
	
	
	this.bound_min_x = NaN;
	this.bound_min_y = NaN;
	this.bound_max_x = NaN;
	this.bound_max_y = NaN;
	
	
}//END OF Entity class

//Probably unnecessary. Sprite does not put methods under "prototype".
Entity.prototype = Object.create(Sprite.prototype);


//Keep the health in range (0, maxHealth). after a change.
Entity.prototype.changeHealth = function(arg_healthChange){
	
	this.healthCurrent = clamp(this.healthCurrent + arg_healthChange, 0, this.getMaxHealth());
}//END OF changeHealth


//
Entity.prototype.determineBounds = function(){
    if(this.spriteInfoRef != null){
		var myPosition = this.getPosition();
		
		var angRad = this.getImgAngle_raw();
		
		//myPosition.x + spriteInfoRef.boundCenter_x;
		//myPosition.y + spriteInfoRef.boundCenter_y;
		
		var absBoundCenter = rotateAroundPoint(0, 0, this.spriteInfoRef.boundCenter_x, this.spriteInfoRef.boundCenter_y, angRad);
		
		this.bound_min_x = myPosition.x + absBoundCenter.x - this.spriteInfoRef.boundSize_x;
		this.bound_min_y = myPosition.y + absBoundCenter.y - this.spriteInfoRef.boundSize_y;
		this.bound_max_x = myPosition.x + absBoundCenter.x + this.spriteInfoRef.boundSize_x;
		this.bound_max_y = myPosition.y + absBoundCenter.y + this.spriteInfoRef.boundSize_y;
		
		/*
		var bound_min = rotateAroundPoint(0, 0, this.spriteInfoRef.bound_min_x, this.spriteInfoRef.bound_min_y, angRad);
		var bound_max = rotateAroundPoint(0, 0, this.spriteInfoRef.bound_max_x, this.spriteInfoRef.bound_max_y, angRad);
		
		this.bound_min_x = bound_min.x + myPosition.x;
		this.bound_min_y = bound_min.y + myPosition.y;
		this.bound_max_x = bound_max.x + myPosition.x;
		this.bound_max_y = bound_max.y + myPosition.y;
		*/
		
		
		//debugDrawRectAbsolute(this.bound_min_x, this.bound_min_y, this.bound_max_x, this.bound_max_y, "#ff0000");
		
		
	}else{
	    //invisible? no bounds.
		this.bound_min_x = NaN;
		this.bound_min_y = NaN;
		this.bound_max_x = NaN;
		this.bound_max_y = NaN;
	}
}//END OF determineBounds






Entity.prototype.setSpriteIndex = function(argIndex){
	var newSpriteInfoRef = this.getSpriteMap()[argIndex];
	this.customChangeImage(newSpriteInfoRef);
	
    this.spriteIndex = argIndex;
	//arrowProjectileWidth*this.spriteScale, arrowProjectileHeight*this.spriteScale
	
	this.setSize(this.spriteInfoRef.width, this.spriteInfoRef.height);
	
	//alert("?? " + this.width + " : " + this.height);
	//document.getElementById("debug").innerHTML = width + "<br/>" + height;

}

//Ends up setting the SimpleGame's "image" var of this Sprite subclass, but also keeps track of
//the SpriteInfo it came from. It stores the image's native size, boundCenter (rotatable), and 
//boundSize from there. 
Entity.prototype.customChangeImage = function(argSpriteInfoRef){
	this.spriteInfoRef = argSpriteInfoRef;
	this.changeImage(this.spriteInfoRef.filePath);
}//END OF customChangeImage


Entity.prototype.getSpriteIndex = function(){
    return this.spriteIndex;
}


//sets the speed as a DX and DY instead.
Entity.prototype.setVelocity = function(arg_vel_x, arg_vel_y){
    this.dx = arg_vel_x;
	this.dy = arg_vel_y;
	//SimpleGame probably expects the "speed" to be kept in synch with dx and dy.
	this.speed = Math.sqrt( this.dx * this.dx + this.dy * this.dy);
}

Entity.prototype.getVelocity = function(){
    return{x:this.dx, y:this.dy};
}



//subclasses MUST override these! at least those that create things (new ...).
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


Entity.prototype.getSpriteMap = function(){
    return null;
}
//Create a constant for this class in constant.java and return it here in subclasses meant
//to be created from.
Entity.prototype.getClassID = function(){
    //this is a default, replace.
    return CLASSID_NONE;
}

//Get the bound offset from the center of this entity and rotate it to fit
//where the entity is facing now.
Entity.prototype.getBoundCenter = function(){
    return {x:0, y:0};
}







//Custom alternative to SimpleGame's checkBounds in a sense. This will modify
//the .dx or .dy to instead move against a colliding object without going
//through it if there is a collision that frame.
Entity.prototype.checkCollision = function(){
    
	
	

}//END OF checkCollision


Entity.prototype.playDamageSound = function(){
	//Play a sound when taking damage. Must be manually called elsewhere.
	//No default behavior, to be implemented in subclasses.
}//END OF playDamageSound






//CREDIT TO SimpleGame. Started as a copy of the Sprite's update method, but calls a modified draw
//method that factors in the scroll position.
//Also, split up "customUpdate" into "customUpdatePhysics" and "customDraw" below.
//The general customUpdate still exists and calls both of those, which is equivalent to SimpleGame's update.
//A class can choose to instead call customUpdatePhyiscs and customDraw separately on its own to do something
//between these calls, like use customUpdatePhysics to get an accurate position given velocity, draw a graphic
//based on the position, and then draw the intended sprite with customDraw.
Entity.prototype.customUpdate = function(){

    this.customUpdatePhysics();
    this.customDraw();
	
}//END OF customUpdate


//Called after every entity's customUpdate has been called in a frame.
//Good for logic that runs assuming everything else already has, like drawing GUI.
Entity.prototype.customUpdateLate = function(){
    //no default behavior.
}//END OF customUpdateLate


Entity.prototype.customUpdateLong = function(){
    //For things that may be more intense that don't need to be done every single frame
	//of game logic.
	//Every 1.25 seconds may be adequate.
	//Like AI checks: any enemy players nearby to target?
}//END OF customUpdateLong



Entity.prototype.customUpdatePhysics = function(){
    this.checkCollision();
    this.x += this.dx;
    this.y += this.dy;
	
	/*
	if(this.dx != 0 || this.dy != 0){
		ctx.strokeStyle = "#0000ff";
		ctx.beginPath();
		ctx.moveTo(this.x-scroll_x,this.y-scroll_y);
		ctx.lineTo(this.x + this.dx*30-scroll_x,this.y + this.dy*30-scroll_y);
		ctx.stroke();
	}
	*/
	
    this.checkBounds();
	this.determineBounds();
}//END OF customUpdatePhysics



//CREDIT TO SimpleGame. Started as a copy of the Sprite's draw method, but factors in the scroll
//position.
Entity.prototype.customDraw = function(){
	
	//Now includes .visible check automatically.
	//Must also be within the current scene, even partially
	if(this.visible && !isEntityOutsideOfScene(this)){
		
		//rely on "ctx", a global varaible that stores the canvas's context.
		ctx.save();
		
		//transform element
		ctx.translate(this.x - scroll_x, this.y - scroll_y);
		ctx.rotate(this.imgAngle);
		
		//draw image with center on origin
		ctx.drawImage(
		  this.image,
		  0 - (this.width / 2),
		  0 - (this.height / 2),
		  this.width,
		  this.height
		);
		
		ctx.restore();
		
    }//END OF visible check (varaible)
	
	
}//END OF customDraw


//OPTIONAL - no default behavior. Method is called as this entity is getting deleted.
//Do any cleanup.
Entity.prototype.onDelete = function(){
    
}

//How this entity determines its maximum health.
//Likely a constant per class. "20" is the default.
Entity.prototype.getMaxHealth = function(){
    return 20;
}//END OF getMaxHealth

//How many points to award if the player makes the killing hit on this entity.
Entity.prototype.getPointBounty = function(){
    return 0;
}//END OF getBounty



/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////



//Get the direction the image is facing as a vector.
//That is, a vector made of cos(ang), sin(ang) for something else to move in that direction.
Entity.prototype.getImgDirectionVector = function(){
    return{
	  x:Math.cos(this.getImgAngle_raw()),
	  y:Math.sin(this.getImgAngle_raw())
	};
}//END OF getImgDirectionVector



//just a getter.
Entity.prototype.getPosition = function(){
	//NOTICE - putting the { bracket immediately after the return keyword or a line below makes a GREAT difference.
	//That is there is a script error if the { bracket starts on the next line instead.
	//Who... Who comes up with this
    return{
	  x:this.x,
	  y:this.y,
	};
}//END OF getPosition


//Similar to above but returns relative to the top-left corner of the window
//instead of the entire map (does not include scrolling)
Entity.prototype.getPositionFixed = function(){
    return{
	  x:this.x - scroll_x,
	  y:this.y - scroll_y,
	};
}//END OF getPositionFixed




//ditto?
Entity.prototype.setSize = function(arg_width, arg_height){
    this.width = arg_width;
	this.height = arg_height;
}



//"_raw" versions of angle methods from SimpleGame will accept angle measures as radians for 
//setting, changing and getting. This avoids an unnecessary degree-to-radian conversion when
//this game works in radians anyways.
Entity.prototype.setAngle_raw = function(arg_rad){
    arg_rad = filterAngle(arg_rad);
	this.imgAngle = arg_rad;
	this.moveAngle = arg_rad;
    this.calcVector();
}
Entity.prototype.setImgAngle_raw = function(arg_rad){
	this.imgAngle = filterAngle(arg_rad);
}
Entity.prototype.setMoveAngle_raw = function(arg_rad){
	this.moveAngle = filterAngle(arg_rad);
    this.calcVector();
}

Entity.prototype.changeAngleBy_raw = function(arg_rad){
    this.imgAngle = filterAngle(this.imgAngle + arg_rad);
    this.moveAngle = filterAngle(this.moveAngle + arg_rad);
    this.calcVector();
}
Entity.prototype.changeImgAngleBy_raw = function(arg_rad){
    this.imgAngle = filterAngle(this.imgAngle + arg_rad);
}
Entity.prototype.changeMoveAngleBy_raw = function(arg_rad){
    this.moveAngle = filterAngle(this.moveAngle + arg_rad);
	this.calcVector();
}


Entity.prototype.getImgAngle_raw = function(){
	return this.imgAngle;
}
Entity.prototype.getMoveAngle_raw = function(){
	return this.moveAngle;
}





