



var scroll_x = 0;
var scroll_y = 0;



var tileSize_x = 64;
var tileSize_y = 64;

var mapTileCount_x = 52;
var mapTileCount_y = 52;

var scroll_bound_min_x = 0;
var scroll_bound_min_y = 0;
var scroll_bound_max_x = mapTileCount_x * tileSize_x;
var scroll_bound_max_y = mapTileCount_y * tileSize_y;

var matrixMapTileType = null;







var freeScrollSpeed = 6;










var MapTileSpriteMap = [
  new SpriteInfo("map/grass.png", 64, 64, 1, 0, 0, 0, 0),
  
];

//to be populated with images of each MapTileSpriteMap's file path for quick copying.
var MapTileImageMap = new Array(MapTileSpriteMap.length);






function setupMap(){
	var i;
	var i2;
    
	for(i = 0; i < MapTileSpriteMap.length; i++){
	    MapTileImageMap[i] = new Image();
		MapTileImageMap[i].src = MapTileSpriteMap[i].filePath;
	}

    
	matrixMapTileType = new Array(mapTileCount_y);

	for(i = 0; i < mapTileCount_y; i++){
		matrixMapTileType[i] = new Array(mapTileCount_x);
		
	}

	//DEFAULT: all grass. Load from a map file later.
	for(i = 0; i < mapTileCount_y; i++){
		for(i2 = 0; i2 < mapTileCount_x; i2++){
			matrixMapTileType[i][i2] = 0;
		}
	}
		

}//END OF setupMap





var mouse_memory_x = NaN;
var mouse_memory_y = NaN;
var lockScrollBlend = false;

//Get the ideal position of the scroll.
//It is a blend of the player's position and the direction toward the mouse to look
//further in a particular direction.
function getBestScrollPosition(argPlayer){
    
	var bestScroll_x;
	var bestScroll_y;
	
	
	
	var mousePos;
	var playerPosFixed = argPlayer.getPositionFixed();
	
	if(lockScrollBlend && !isNaN(mouse_memory_x) && !isNaN(mouse_memory_y) ){
		//use the mouse position from memory to keep the scroll from involving the new mouse position.
		//Makes sense to do this at times.
		mousePos = {x: mouse_memory_x, y:mouse_memory_y};
		
		facingVector = getDirectionVectorToPoint(playerPosFixed.x, playerPosFixed.y, mousePos.x, mousePos.y);
	}else{
		//not locked? Get fresh mouse coords for blending the scroll with.
		mousePos = getMousePositionFixed();
		//get the direction towards where the player will face
		facingVector = getDirectionVectorToMouse(argPlayer.x, argPlayer.y);
		//and update the memory mouse position to stay when locked.
		mouse_memory_x = mousePos.x;
		mouse_memory_y = mousePos.y;
	}
	
	
	//if the mouse coords have never been picked up, just rely on the player's
	//raw direction.
	if(facingVector == null) facingVector = argPlayer.getImgDirectionVector();
	
	
	var distanceToMouse;
	if(!isNaN(mousePos.x) && !isNaN(mousePos.y)){
		
		//subtract out the scroll coords to make it fixed (relative to the scene window, not the map)
		
		distanceToMouse = distanceBetweenPoints(mousePos.x, mousePos.y, playerPosFixed.x, playerPosFixed.y);
		//console.log("?? " + distanceToMouse);
		
		
	}else{
		distanceToMouse = 0;
	}
	
			
	var playerPosition = argPlayer.getPosition();
	var playerVelocity = argPlayer.getVelocity();
	//apply the velocity too to anticipate where the player will move next frame.
	bestScroll_x = playerPosition.x + playerVelocity.x - sceneWidth/2 + clamp(facingVector.x*distanceToMouse*0.28, -240, 240);
	bestScroll_y = playerPosition.y + playerVelocity.y - sceneHeight/2 + clamp(facingVector.y*distanceToMouse*0.33, -160, 160);
	
	//bestScroll_x = argPlayer.x - sceneWidth/2;
	//bestScroll_y = argPlayer.y - sceneHeight/2;
	//bestScroll_x = argPlayer.x + argPlayer.dx - sceneWidth/2;
	//bestScroll_y = argPlayer.y + argPlayer.dy - sceneHeight/2;
	
	bestScroll_x = clamp(bestScroll_x, scroll_bound_min_x, scroll_bound_max_x - sceneWidth);
	bestScroll_y = clamp(bestScroll_y, scroll_bound_min_y, scroll_bound_max_y - sceneHeight);
	
	//return{x:bestScroll_x, y:bestScroll_y};
	return{x:bestScroll_x, y:bestScroll_y};
}//END OF getBestScrollPosition


//setup scroll to start centered on the player, but don't go past map edges.
function setupScroll(argPlayer){
    //Start with the scroll position in a way that puts the player in the center.
    
	var bestScrollPosition = getBestScrollPosition(argPlayer);
	
	scroll_x = bestScrollPosition.x;
	scroll_y = bestScrollPosition.y;
	

}//END OF setupScroll




//Move the scroll coords scroll_x and scroll_y closer to the ideal scroll position.
//Do so smoothly.
function updateScroll(argPlayer){
    
	var bestScrollPosition = getBestScrollPosition(argPlayer);
	
	
	var xDelta = bestScrollPosition.x - scroll_x;
	var yDelta = bestScrollPosition.y - scroll_y;
	
	var distanceToBestScroll = distanceBetweenPoints(scroll_x, scroll_y, bestScrollPosition.x, bestScrollPosition.y);
	var angleToBestScroll = Math.atan2(yDelta, xDelta);
	
	
	var proposedDistance = clamp(distanceToBestScroll/2, 2, 36);
	
	
	if(distanceToBestScroll - proposedDistance > 1){
		scroll_x += Math.cos(angleToBestScroll) * proposedDistance;
		scroll_y += Math.sin(angleToBestScroll) * proposedDistance;
		
		//clamp to map bounds for safety.
		scroll_x = clamp(scroll_x, scroll_bound_min_x, scroll_bound_max_x - sceneWidth);
		scroll_y = clamp(scroll_y, scroll_bound_min_y, scroll_bound_max_y - sceneHeight);
	
	}else{
		//just move there.
		scroll_x = bestScrollPosition.x;
		scroll_y = bestScrollPosition.y;
	}

}//END OF updateScroll



//If free scrolling is allowed, move the area of the map shown ingame with the
//I-J-K-L keys.
//"freeScroll" must be called in some update method to actually work. Mainly a test feature.
function freeScroll(){
	if(keysDown[K_I]){
	    scroll_y -= freeScrollSpeed;
		if(scroll_y < scroll_bound_min_y){
		    scroll_y = scroll_bound_min_y;
		}
	}
	if(keysDown[K_K]){
	    scroll_y += freeScrollSpeed;
		if(scroll_y + sceneHeight >= scroll_bound_max_y){
		    scroll_y = scroll_bound_max_y - sceneHeight;
		}
	}
	if(keysDown[K_J]){
	    scroll_x -= freeScrollSpeed;
		if(scroll_x < scroll_bound_min_x){
		    scroll_x = scroll_bound_min_x;
		}
	}
	if(keysDown[K_L]){
	    scroll_x += freeScrollSpeed;
		if(scroll_x + sceneWidth >= scroll_bound_max_x){
		    scroll_x = scroll_bound_max_x - sceneWidth;
		}
	}
	
}//END OF freeScroll
	
	

