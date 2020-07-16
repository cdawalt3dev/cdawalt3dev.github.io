



//The next created entity will have this ID. It is incremented with each creation to give
//each entity a unique ID. It wraps around back to 0 when it surpasses 255.
//Deleted entities set off a flag that allows their slots to be overwritten with a new
//entity. The first empty entity slot is used.
var entityNextID = 0;
var aryEntity = new Array(256);


//record a count of all entities, disregarding missing ID's.
var entityCount = 0;



//CLASS Entity_Common.
//Used to keep track of one entity in the game, by its "linkedEntity" varaible.
//Can also be read to see if this entity has ever been deleted or replaced
//since another entity last referred to this particular slot for its entity.
function Entity_Common(){
    this.linkedEntity = null;
	
	//counts up with each assignment to linkedEntity.
	//NOT necessarily unique per Entity_Common.
	this.usageID = -1;
}//END OF Class Entity_Common

Entity_Common.prototype.removeLink = function(){
    if(this.linkedEntity != null){
		delete this.linkedEntity;
		this.linkedEntity = null;
	}
}

Entity_Common.prototype.setLink = function(arg_newEntity){
    this.linkedEntity = arg_newEntity;
	this.usageID++;
	
	entityCount++;
}







//static.
function setupEntityCommon(){
	var i;
	for(i = 0; i < aryEntity.length; i++){
	    aryEntity[i] = new Entity_Common();
	}
}//END OF setupEntityCommon


//static.
function removeEntity(arg_entToRemove){
    //aryEntity[arg_entToRemove.entityID].removeSelf();
	var myEntityCommonRef = aryEntity[arg_entToRemove.entityID];
	myEntityCommonRef.removeLink();
	arg_entToRemove.onDelete();
	
	entityCount--;
}//END OF removeEntity


//static.
function getFirstAvailableEntityID(){
    var currentPos = entityNextID;
	var triesLeft = aryEntity.length;
    while(triesLeft > 0){
	    //It is available.
	    if(aryEntity[currentPos].linkedEntity == null){
		    //this is a good place.
			entityNextID = (currentPos+1)%aryEntity.length;  //wrap around to 0 if this + 1 reaches aryEntity.length.
			return currentPos;
		}
		currentPos++;  //try the next.
		if(currentPos >= aryEntity.length){
		    currentPos = 0; //try 0 next.
		}
		triesLeft--;
	}
	//nothing? oh no
	return -1;
}










//CLASS SafeEntityLink
//Stores a link to a member of "aryEntity", a list that refers to every entity
//in the game as .linkedList links, one per element.
//Each SafeEntityLink starts blank and can be assigned an entity by setLinkedEntity.
//Doing so records the entity's position in aryEntity (pointer to that element)
//and checks to see if this element reports this entity missing (deleted) or 
//replaced since (usageID mismatch). If either is true, this link is bad and must
//be discarded.
//Example: A PersonAI may need to keep track of another PersonAI to aim at it
//and fire at it soon. If the other one is deleted early, this would not let the 
//first PersonAI know, causing to the first PersonAI's reference to the second
//to refer to bad memory.
//With a SafeEntityLink set to the second PersonAI, the first PersonAI could let
//the SafeEntityLink determine whether the reference to the second has gone bad
//( .linkedEntity is null or usageID mismatch). If either is the case, don't
//attempt to get the second PersonAI and report it as null. Otherwise trust it.
function SafeEntityLink(){
	this.entity_common_ref = null;
	this.usageID_memory = null;
}//END OF Class SafeEntityLink




//This is a filter. return "null" if we have reason not to trust the entity_common reference
//this entity was originally linked by.
SafeEntityLink.prototype.getLinkedEntity = function(){
    //decide whether this entity still exists and hasn't been replaced since.
	if(
	  this.entity_common_ref != null &&   //must be referring to some member of the list of entity links.
	  this.entity_common_ref.linkedEntity != null &&
	  this.entity_common_ref.usageID == this.usageID_memory
	){
		//valid, the entity fetched earlier to this link still exists.
	    return this.entity_common_ref.linkedEntity;
	}else{
		//invalid. Entity no longer exists at this ID (.linkedEntity is null) or has been
		//overwritten with a new entity since (inconsistent usageID_memory, since usageID
		//is incremented anytime a new entity is assigned to the same slot)
		this.entity_common_ref = null;   //no sense in holding on to this member of the list entity links.
		return null;
	}
}//END OF getLinkedEntity


//Sets this link to refer to an entity_common element (the one that refers to this entity,
//the .entityID'th member) and remembers its .usageID for tracking any replacement since
//this fetch.
SafeEntityLink.prototype.setLinkedEntity = function(arg_entity){
	this.entity_common_ref = aryEntity[arg_entity.entityID];
	this.usageID_memory = this.entity_common_ref.usageID;
}//END OF setLinkedEntity

SafeEntityLink.prototype.forgetLinkedEntity = function(){
	this.entity_common_ref = null;
	this.usageID_memory = null;
}//END OF forgetLinkedEntity






