



//See constant.js for more configurables.


//var sceneWidth = 800;
//var sceneHeight = 600;
var sceneWidth = 850;
var sceneHeight = 640;


//in seconds.
var gameDuration = 180;



var imgPlayerArrowProjectile;
var imgGrass;




//to keep track of the generated player.
//Actually a safe link so if the player is removed (out of health), references
//don't go to bad memory.
var player1;

var playerScore = 0;


var timer;


var gameTimeLeft;
var longFrame = false;


var btnStart = null;
var btnInstructions = null;
var btnQuit = null;

var playerKilled = false;

var endTimeString = "";


var spawnMin_x = scroll_bound_min_x + 80;
var spawnMin_y = scroll_bound_min_y + 80;
var spawnMax_x = scroll_bound_max_x - 80;
var spawnMax_y = scroll_bound_max_y - 80;
var spawnDist_x = spawnMax_x - spawnMin_x;
var spawnDist_y = spawnMax_y - spawnMin_y;

	
	
	
	

	
var HitSoundMap = [
	"hit/hit_1",
	"hit/hit_2",
	"hit/hit_3",
	"hit/hit_4",
	"hit/hit_5"
];

	
	

	
	
function preInit(){

	
	//Keep the placeholder, divCanvas, the size we expect the generated Canvas to be.
	var divCanvas_ref = document.getElementById("divCanvas");
	divCanvas_ref.style.width = sceneWidth+"px";
	divCanvas_ref.style.height = sceneHeight+"px";
 
 
    precacheInit();
	
	precacheImageMap(PersonSpriteMap);
	precacheImageMap(ArrowProjectileSpriteMap);
	precacheImageMap(MapTileSpriteMap);
	
	precacheApply();

	setupSound();
	
	precacheSound("arrow/woosh");
	precacheSoundMap(HitSoundMap);
	precacheSound("end/lost");
	precacheSound("end/victory");
	
    //var tempImage = new Image();
	//tempImage.src = "img/player/player_arrow.png";
	//console.log("WHAT ARE MY DIMENSIONS? " + tempImage.width + " " + tempImage.height);
	
	
	
	
}//END OF preInit()





function changeScreen(arg_newIndex){
	
	btnStart.setVisible(false);
	btnInstructions.setVisible(false);
	btnQuit.setVisible(false);
	
	if(arg_newIndex == SCREEN_SPLASH){
		btnStart.setVisible(true);
		btnInstructions.setVisible(true);
		btnQuit.setVisible(true);
	}else if(arg_newIndex == SCREEN_INSTRUCTIONS){
		
		btnStart.setVisible(true);
	
	}else if(arg_newIndex == SCREEN_INGAME){
		gameInit();
		
	}else if(arg_newIndex == SCREEN_END){
		
		btnStart.setVisible(true);
		btnStart.changeLabel("Restart");
		btnQuit.setVisible(true);
	}
	
	screenIndex = arg_newIndex;
	
}//END OF changeScreen(...)



function Init(){
	timer = new Timer();
	

	scene = new Scene();
	
	extraCanvasSetup();
	
	
	
	imgPlayerArrowProjectile = generateImage("player/player_arrow.png");
	imgGrass = generateImage("map/grass.png");
	imgTitleLogo = generateImage("ui/title_logo.png");
	
	scene.setSize(sceneWidth, sceneHeight);
	
	
	scene.start();
	
	scene.setPos(0, 0);
	scene.setBG("#66bdd2");
	
	
	
	
	init_aryButtonCustom();

	
	btnStart = CreateButtonCustom("Start");
	btnStart.setPositionCustom(sceneWidth / 2 - 80/2, sceneHeight - 120);
	btnStart.setSize(80, 30);
	btnStart.setVisible(false);
	
	btnInstructions = CreateButtonCustom("Instructions");
	btnInstructions.setPositionCustom(sceneWidth / 2 - 120/2, sceneHeight - 120 + 40);
	btnInstructions.setSize(120, 30);
	btnInstructions.setVisible(false);
	
	btnQuit = CreateButtonCustom("Quit");
	btnQuit.setPositionCustom(sceneWidth / 2 - 70/2, sceneHeight - 120 + 80);
	btnQuit.setSize(70, 30);
	btnQuit.setVisible(false);
	
	
	
	//!!!
	changeScreen(SCREEN_SPLASH);


}//END OF Init


	

//For a given faction and amount to spawn, place this many AI person's randomly across the map,
//away from the player's view.
function spawnPersons(argFactionToSpawn, argNumberToSpawn){
	
	var consecutiveTriesAllowed = 5;
	
	var player1test = player1.getLinkedEntity();
	if(player1test != null){
		for(i = 0; i < argNumberToSpawn; i++){
		
			if(consecutiveTriesAllowed <= 0){
				//oops. failed too much, stop.
				return;
			}
		
			var spawnX = spawnMin_x + Math.random() * spawnDist_x;
			var spawnY = spawnMin_y + Math.random() * spawnDist_y;
			
			
			var distTest = distanceBetweenPoints(spawnX, spawnY, player1test.x, player1test.y);
			
			if(distTest < 1200){
				//too close, retry. spawning too close to the player looks weird.
				i -= 1;
				consecutiveTriesAllowed--;
				continue;
			}
			
			var spawnAng = -PI + Math.random() * (doublePI);
			//alert("I MADE THIS OKAY " + spawnAng);
			createPersonAI( argFactionToSpawn, spawnX, spawnY, spawnAng, );
			
			consecutiveTriesAllowed = 5; //reset this counter.
		}
	}
}//END OF spawnPersons



function gameInit(){


	
	var i;
	
	timer.reset();

	//hideCursor? showCursor?
	setupEntityCommon();
	
    setupMap();
	
	gameTimer = 180;
	
	
	//TODO - parameterize
	var player1_rawRef = createPlayer(FACTION_PLAYER, sceneWidth/2, 230, PI*1.5);
	
	player1 = new SafeEntityLink();
	player1.setLinkedEntity(player1_rawRef);
	
	
	spawnPersons(FACTION_ENEMY, 30);
	spawnPersons(FACTION_ALLY, 13);
	
	setupScroll(player1_rawRef);
	
	
}//END OF gameInit



function update(){
	
    scene.clear();
	
	if(screenIndex == SCREEN_SPLASH){
		
		drawImage(imgTitleLogo, sceneWidth / 2, imgTitleLogo.height * 0.5 + 50, 0, 0.91);
	}else if(screenIndex == SCREEN_INSTRUCTIONS){
		
		var drawX = 40;
		var drawY = 80;
		ctx.fillStyle = "#001100";
		ctx.font = "20px Arial";
		ctx.fillText("Use the arrow keys or ASDW keys to move around.", drawX, drawY);
		drawY += 36;
		ctx.fillText("ASDW keys may avoid scrolling problems.", drawX, drawY);
		drawY += 36;
		ctx.fillText("Use the mouse to aim and click or hold down to fire arrows.", drawX, drawY);
		drawY += 36;
		ctx.fillText("The screen is pushed toward the mouse to look further in that direction.", drawX, drawY);
		drawY += 28;
		ctx.fillText("Press space, control, shift, alt, numpad0, or numpad1 to lock/unlock scroll push.", drawX, drawY);
		drawY += 36;
		ctx.fillText("Your character is red.", drawX, drawY);
		drawY += 36;
		ctx.fillText("Enemies are blue and friends are yellow.", drawX, drawY);
		drawY += 36;
		ctx.fillText("Enemies try to attack friends and you. Shoot for points (20 points).", drawX, drawY);
		drawY += 36;
		ctx.fillText("Friends attack enemies. Do not shoot them (100 point penalty).", drawX, drawY);
		drawY += 36;
		ctx.fillText("You have 3 minutes. Don't run out of health.", drawX, drawY);
		
	
	}else if(screenIndex == SCREEN_INGAME){
		
	    gameUpdate();
		
	}else if(screenIndex == SCREEN_END){
		
		var drawX = 40;
		var drawY = 80;
		
		if(playerKilled){
			ctx.fillStyle = "#991111";
			ctx.font = "bold 64px Arial";
			ctx.fillText("GAME OVER.", drawX, drawY);
			drawY += 80;
			ctx.font = "20px Arial";
			ctx.fillText("Your score was " + playerScore + ".", drawX, drawY);
			drawY += 36;
			ctx.fillText("You lasted " + endTimeString + ".", drawX, drawY);
			
		}else{
			ctx.fillStyle = "#074707";
			ctx.font = "bold 64px Arial";
			ctx.fillText("TIME UP.", drawX, drawY);
			drawY += 80;
			ctx.font = "20px Arial";
			ctx.fillText("Your score was " + playerScore + ".", drawX, drawY);
			drawY += 36;
		
		}
	}
	

	if(btnStart.isClicked()){
		btnStart.button.clicked = false;
		//appreciate the enthusiasm but PLEASE stop staying clicked!
			
		if(screenIndex == SCREEN_SPLASH || screenIndex == SCREEN_INSTRUCTIONS){
			changeScreen(SCREEN_INGAME);
		}else{
			restartGame();
		}
	}
	if(btnInstructions.isClicked()){
		btnInstructions.button.clicked = false;
		changeScreen(SCREEN_INSTRUCTIONS);
	}
	if(btnQuit.isClicked()){
		btnQuit.button.clicked = false;
		quitGame();
	}
		
		
	
}//END OF update


function endGame(argLastedToEnd){

	playerKilled = !argLastedToEnd;
    changeScreen(SCREEN_END);
	
	
	//no wooshes or grunts.
	stopAllSound();
	
	if(playerKilled){
		playSound("end/lost", 1.0);
	}else{
		playSound("end/victory", 1.0);
	}
	
	
	endTimeString = getInvertedTimerString();
	//give a prompt about this? option to restart? etc.
}




function gameUpdate(){
	
	var i;
	
	if(!isNaN(previousTime)){
		timeDelta = timer.getElapsedTime() - previousTime;
	}
	previousTime = timer.getElapsedTime();
	
	
	if(
	  keysDown[K_NUMPAD_0] || keysDown[K_INSERT] ||
	  keysDown[K_NUMPAD_1] || keysDown[K_END] ||
	  keysDown[K_SPACE] || keysDown[K_SHIFT] || keysDown[K_CTRL] || keysDown[K_ALT]
	  
	){
		//don't keep these keys held down. Only interested in tapping the keys.
		keysDown[K_NUMPAD_0] = false;
		keysDown[K_INSERT] = false;
		keysDown[K_NUMPAD_1] = false;
		keysDown[K_END] = false;
		keysDown[K_ALT] = false;
		keysDown[K_SPACE] = false;
		keysDown[K_CTRL] = false;
		keysDown[K_ALT] = false;
		//lock!
		lockScrollBlend = !lockScrollBlend;
	}
	
	
	//document.getElementById("debug").innerHTML = "??? " + scene.getMouseClicked();
	//document.getElementById("debug").innerHTML = "??? " + (aryEntity[0].linkedEntity);
	
	gameTimeLeft = clamp(gameDuration - timer.getElapsedTime(), 0, 9999);
	
	//mapTileCount_y, mapTileCount_x
	var firstTile_x = Math.floor(scroll_x / tileSize_x);
	var firstTile_y = Math.floor(scroll_y / tileSize_y);
	var lastTile_x = Math.ceil((scroll_x + sceneWidth) / tileSize_x - 1);
	var lastTile_y = Math.ceil((scroll_y + sceneHeight) / tileSize_y - 1);
	
	//console.log(firstTile_x + " " + firstTile_y + " : " + lastTile_x + " " + lastTile_y);
	
	
	
	//These picked tiles are the only ones shown onscreen at this given time, 
	//given the player's scroll position and screen (scene) dimensions.
	for(i = firstTile_y; i <= lastTile_y; i++){
	    for(i2 = firstTile_x; i2 <= lastTile_x; i2++){
		    var tileImgID = matrixMapTileType[i][i2];
			//console.log(i + " " + i2 + " : " + MapTileSpriteMap[tileImgID].filePath);
		    drawImageSimple( MapTileImageMap[tileImgID]  , i2*tileSize_y, i*tileSize_x);
		}
	}
	
	
	//this will happen a little over every second (1.25 seconds).
	if(frameCount % 25 == 0){
		//special frame for some checks that don't need to be done every
		//single frame, like distance from the player or picking a target from nearby entities.
		longFrame = true;
	}else{
		longFrame = false;
	}
	
	
	//happens every 3 seconds.
	if(frameCount % 60){
		//Spawn some things to keep the player entertained.
		if(entityCount < 150){
			spawnPersons(FACTION_ENEMY, 9);
			spawnPersons(FACTION_ALLY, 4);
		}
	
	}
	
	if(longFrame == true){
		for(i = 0; i < aryEntity.length; i++){
			if(aryEntity[i].linkedEntity != null){
				//console.log("HEY LISTEN " + i);
				aryEntity[i].linkedEntity.customUpdateLong();
			}
		}
	}
	
	for(i = 0; i < aryEntity.length; i++){
	    if(aryEntity[i].linkedEntity != null){
			//console.log("HEY LISTEN " + i);
		    aryEntity[i].linkedEntity.customUpdate();
		}
	}
	
	for(i = 0; i < aryEntity.length; i++){
	    if(aryEntity[i].linkedEntity != null){
			//console.log("HEY LISTEN " + i);
		    aryEntity[i].linkedEntity.customUpdateLate();
		}
	}
	
	
	//roughly follow the player and go forwards in the direciton they are facing.
	var player1test = player1.getLinkedEntity();
	if(player1test != null){
		updateScroll(player1test);
	}
	
	
	//comes last to draw things that must show up at all times, like the player GUI overlay or
	//graphics relevant to this screen if not ingame.
	drawGameGUI();
	
	if(gameTimeLeft <= 0){
	    endGame(true);
	}
	
	frameCount++;
	
	//does not count holding it down. Re-click to turn this back on.
	mouseClicked = false;

}//END OF gameUpdate







//Draw player-specific GUI like the health bar, score count, and timer.
//Does not apply scroll position.
function drawGameGUI(){

    ctx.fillStyle = "#114411";
	ctx.font = "bold 32px Arial";
	ctx.fillText("Health",10, sceneHeight - 10 - 6);
    
	var playerHealthBarWidth = 200;
	var playerHealthBarHeight = 30;
	var playerHealthBarDrawX = 108 + 10 +(playerHealthBarWidth/2);
	var playerHealthBarDrawY = sceneHeight - 10 - playerHealthBarHeight + (playerHealthBarHeight/2);
	
	
	var playerHealthPercentage = 0;
	
	var player1test = player1.getLinkedEntity();
	if(player1test != null){
		//set if the player actually exists.
		playerHealthPercentage = player1test.healthCurrent / player1test.getMaxHealth();
	}
	
	drawHealthBar(playerHealthBarDrawX, playerHealthBarDrawY, playerHealthBarWidth, playerHealthBarHeight, playerHealthPercentage, playerHealthBarTransparency);
	
	
	debugFillRectFixed(sceneWidth - 224, sceneHeight - 10-2 - 26, 218, 32, "rgba(255, 255, 255, 0.6)");
    ctx.fillStyle = "#114411";
	ctx.font = "italic 24px Arial";
	ctx.fillText("Score: " + playerScore, sceneWidth - 220, sceneHeight - 10 - 2);
	
	
	
	
	
	
	
	debugFillRectFixed(sceneWidth - 146, 8, 138, 40, "rgba(255, 255, 255, 0.6)");
	ctx.fillStyle = "#114411";
	ctx.font = "italic 24px Arial";
	ctx.fillText("Timer: " + getTimerString(), sceneWidth - 140, 40 - 2);
	
	
	


}//END OF drawGameGUI



//Get the current elapsed time as minutes:seconds, #:##.
function getTimerString(){
	return generateTimeString(gameTimeLeft);
}//END OF getTimerString

//Get the reverse: how much time passed instead of counting down.
function getInvertedTimerString(){
	return generateTimeString(gameDuration - gameTimeLeft);
}//END OF getTimerString


//Generates a time from a given time value (seconds).
function generateTimeString(argTime){
	var minutes = Math.floor(argTime / 60);
	var seconds = Math.floor(argTime % 60);
	
	return minutes+":"+fillerZeros(seconds, 2);
}//END OF generateTimeString






function quitGame(){
	//go back to the root.
	window.location.href = "../index.html";
}//END OF quitGame


function restartGame(){
	//ha
	window.location.href = "";
}//END OF restartGame









