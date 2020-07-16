//Global javascript included by all webpages (states).


//TWO EVENT METHODS (must be implemented by each page's .js file)
//custom_pageStart: startup script for the page, mainly about behavior.
//custom_updateGraphics: script for keeping custom images on the page up-to-date with data.
//                       What to draw, toggle (in)visible, etc. Called at startup.


//Inventory values may be 0, 1, or 2. They should link to inventory image locations for:
//0: hoe
//1: sword
//2: book


//Global setting adjusted per page or left to the default of false.
//When true, skips the localStorage check. Should be "true" for a page that needs to
//reset localStorage and not get interrupted by the "no localstorage" error
var newGamePage = false;

//Debug mode, when true, starts the game with 1000 gold and prevents clearning the localstorage when the game ends. That way refreshing the browser lets another option get picked without forcing a restart.
var debugMode = false;

//Size of inventory. Affects the number of rendered slots, localStorage "inv_slot_" keys,
//and aryInventory size.
var INVENTORY_SLOTS = 2;




var ID_INV_HOE = 0;
var ID_INV_SWORD = 1;
var ID_INV_BOOK = 2;

//Greatest item ID possible is one less than this.
var ID_INV_COUNT = 3;


//Each item has a corresponding path to reach its inventory image.
//It is possible for inventory slot images to be changed in real time.
var inventoryMap = [
"img/inventory_hoe.png",
"img/inventory_sword.png",
"img/inventory_book.png"
];



var aryInventory = new Array(INVENTORY_SLOTS);




//Audio system - references to generated elements.
var sound_audioRef = null;  //jquery <audio>
var sound_audioRefRaw = null;  //DOM <audio>  (same element)
var sound_source_mp3_ref = null;  //<source> for mp3's
var sound_source_mp3_refRaw = null;  //DOM
var sound_source_wav_ref = null;  //<source> for wav's
var sound_source_wav_refRaw = null;  //DOM
var sound_source_ogg_ref = null;  //<source> for ogg's
var sound_source_ogg_refRaw = null;  //DOM



$(window).on("load", function(){
    //second
	
});//END OF window.load


$(document).ready(function(){
    //first
	pageStart(); //General startup.
});//END OF document.ready





function nullCheck(arg){
    return (arg == null || arg == "null");
}




//The webpage may want to play sound on demand at startup or at some event, like clicking
//a button. Adds an invisible <audio> element to the document's <body> and sets up some
//other expected references for the dynamic audio system.
function setupSound(){
  
    sound_audioRefRaw = document.createElement("audio");
    sound_audioRef = $(sound_audioRefRaw);
	sound_audioRef.css({display:"none"});
	
	sound_source_mp3_refRaw = document.createElement("source");
	sound_source_wav_refRaw = document.createElement("source");
	sound_source_ogg_refRaw = document.createElement("source");
	
	sound_source_mp3_ref = $(sound_source_mp3_refRaw);
	sound_source_wav_ref = $(sound_source_wav_refRaw);
	sound_source_ogg_ref = $(sound_source_ogg_refRaw);
	
	
	//Blank sound path to fill each <source>'s "src" attribute,
	//which doesn't need to exist, to keep it from complaining about starting with
	//a nonexistent "src" attribute in console.
	setSoundVariants("");
	
	
	//preload: none or auto?
	sound_audioRef.attr({preload:"none", controls:"none", autoplay:false});
    sound_source_mp3_ref.attr({preload:"none", controls:"none", autoplay:false});
    sound_source_wav_ref.attr({preload:"none", controls:"none", autoplay:false});
    sound_source_ogg_ref.attr({preload:"none", controls:"none", autoplay:false});
   
	sound_audioRef.append(sound_source_mp3_ref);
	sound_audioRef.append(sound_source_wav_ref);
	sound_audioRef.append(sound_source_ogg_ref);
	
	
	/*
	//Even though this didn't stop the warnings, these "e" parent event stoppers may be helpful sometimes.
	sound_audioRefRaw.onloadstart = function(e){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
			console.log("TEST1");
			};
	*/
	
	document.body.appendChild(sound_audioRefRaw);
}//END OF setupSound


//Set each of the <audio> element's <source> children to one of this sound, plus one of the 
//anticipated extensions. This lets lets the browser pick the first working version of the
//sound in one call.
function setSoundVariants(arg_finalSoundPathExtensionless){
    sound_source_mp3_ref.attr({"src":arg_finalSoundPathExtensionless+".mp3"});
    sound_source_wav_ref.attr({"src":arg_finalSoundPathExtensionless+".wav"});
    sound_source_ogg_ref.attr({"src":arg_finalSoundPathExtensionless+".ogg"});
	//alert("what? " + arg_finalSoundPathExtensionless);
}//END OF setSoundVariants


//Should force the requested sound to be downloaded to browser cache, if not already there.
//See notes below on how to provide a sound by name.
function precacheSound(arg_soundPathExtensionless){
    var finalSoundPath = "snd/"+arg_soundPathExtensionless+"/"+arg_soundPathExtensionless;
	setSoundVariants(finalSoundPath);
	
	//sound_audioRefRaw.pause();
	sound_audioRefRaw.load();
}//END OF precacheSound


//Play the given sound. Sounds are assumed to be within the "snd" subfolder in another subfolder of their name.
//Do not provide that part here.
//ex: there is snd/mySound/mySound.mp3, .wav, and .ogg.  To play this, do this:
//    playSound("mySound");
//...This will make snd/mySound/mySound.mp3, snd/mySound/mySound.wav, and snd/mySound/mySound.ogg choices for playing.
function playSound(arg_soundPathExtensionless){
	//give it a snd/ in front.
    var finalSoundPath = "snd/"+arg_soundPathExtensionless+"/"+arg_soundPathExtensionless;
	setSoundVariants(finalSoundPath);
	
	//sound_audioRefRaw.pause();
	sound_audioRefRaw.load();
    sound_audioRefRaw.play();
	
}//END OF playSound





//When a page loads, determine what state this is by the presence of a 
//"JS_State_NAME" class'd element. That leads to setting up what each
//of the buttons do, whether certain graphics or buttons appear based on
//localstorage such as home scene item graphics and the shop's Buy button, etc.
function pageStart(){

    setupSound();
	
	
	if(newGamePage == false){
		//Run this check (chance for error prompt) for typical pages that likely depend on localStorage.
		if( nullCheck( localStorage.getItem("game_started") )){
			//If the game_started localstorage entry is missing, we started
			//the game from a page without any memory of beginning a game.
			//Replace the page with an error notice.
			
			$("#divContent").html(
				"<p class=\"pErrorTitle\">ERROR</p>" +
				"<p id=\"pErrorMessage\"> No game data found. Start from the beginning. </p>" + 
				"<a class=\"aChoice\" href=\"index.html\">OK</a>"
				
			);
			
			$("#divContent").attr({ID:"divError"});
			
			return;
		}//END OF bad local storage check
	}//END OF newGamePage check
	
	//JS_divInventorySlots
    setupInventory();
	
	//This method must be supplied by each page's own Javascript file.
	//Including the dummy.js instead lets this method do nothing.
	custom_pageStart();
	
    updateGraphics();
}//END OF pageStart


//Returns the ID of the first (closest to 0) inventory ID (slot) available.
//Returns -1 if none could be found (all slots full).
function getEmptyInventoryID(){
    return getInventoryItem(-1);  //Empty inventory slots have an ID of -1. This works.

}//END OF getEmptyInventoryID


//Returns the ID of the desired "arg_ItemID" item. Such as 0 for hoe, 1 for sword, etc.
//Returns -1 if this item wasn't found in any of the slots.
//Can also be given "-1" for arg_ItemID to find the first empty slot.
function getInventoryItem(arg_ItemID){
	var i;
	
    for(i = 0; i < INVENTORY_SLOTS; i++){
	    if(aryInventory[i] == arg_ItemID){
		    return i;  //this slot has the item.
		}
	}
	
	//didn't return anything? Made it here? return "-1" to signify being full.
	return -1;
}//END OF getInventoryItem


//Returns whether an item of this ID type (arg_itemID) was found at all.
function hasInventoryItem(arg_ItemID){

    return ( getInventoryItem(arg_ItemID) != -1);
}//END OF hasInventoryItem






function disableInventoryClick(){
    var i;
    for(i = 0; i < INVENTORY_SLOTS; i++){
		$("#imgInvSlot"+i).unbind( "click" );
	}
}

//Some option was picked that ends the game. "arg_blnWon" tells us whether
//this is a positive or negative outcome with the appropriate "You won!"
//or "Game Over" heading above respectively.
function setupGameEnd(argWon){

	disableInventoryClick();
    
	if(debugMode == false){
	    //Not in debug mode? Wipe memory so a refresh won't 
	    //let the player see another ending so quickly.
		clearMemory();
	}
    
	$("#pTitleSub").css({display:"block"});
	
	$("#JS_StandardOptions").css({display:"none"});
	
	$("#JS_GameOverOptions").css({display:"block"});
	
	if(argWon == false){
	    $("#pTitleSub").attr({class:"pLost"});
		$("#pTitleSub").html("Game Over");
	
	}else{
		$("#pTitleSub").attr({class:"pWon"});
		$("#pTitleSub").html("You won!");
	}

}//END OF setupGameEnd






//Load the local storage inventory values from "inv_slot_#" keys and
//put them as numbers in the aryInventory array as Numbers.
//Also generate the elements needed to convey each inventory slot in the
//"JS_divInventorySlots" element.
function setupInventory(){
    var i;
	
	var inventorySlotContainer = $("#JS_divInventorySlots");
	
    for(i = 0; i < INVENTORY_SLOTS; i++){
		
		/*	    <a class="aClickable" href="#"><img id="imgInvSlot0" class="imgInventorySlot"></img></a>
*/
        setupInventorySlot(inventorySlotContainer, i);
	}

}//END OF setupInventory


function getInventoryItemImagePath(argInventorySlotID){

    var invItemID = aryInventory[argInventorySlotID];

	if(invItemID == -1){
		//set blank, force if needed.
		return "img/inventory_blank.png";
	}else{
		return inventoryMap[invItemID];
	}
	

}//END OF getInventoryItemImagePath


//Setup this particular inventory slot.
//Generate the HTML <a> and inner <img> elements.
//Give the outtermost <a> to the slot container element to appear on the page.
function setupInventorySlot(argSlotContainer, argInventorySlotID){
	var loadAttempt = localStorage.getItem("inv_slot_" + argInventorySlotID);
	
	if( !nullCheck(loadAttempt) && loadAttempt != "-1" ){
		//if not null and not equal to -1, this is a valid ID.
		var parsedInventoryID = parseInt(loadAttempt);
		aryInventory[argInventorySlotID] = parsedInventoryID;
	}else{
		aryInventory[argInventorySlotID] = -1; //mark of being empty; blank.
	}
	
	var startingImagePath = getInventoryItemImagePath(argInventorySlotID);
	
	var newImageSlot = $(document.createElement("a"));
	newImageSlot.attr(
	  {
		class:"aClickable",
		href:"#"
	  }
	);
	
	var newImageSlotImage = $(document.createElement("img"));
	newImageSlotImage.attr(
	  {
		id:"imgInvSlot"+argInventorySlotID,
		class:"imgInventorySlot",
		src:startingImagePath
	  }
	);
	
	newImageSlot.append(newImageSlotImage);
	
	argSlotContainer.append(newImageSlot);

}//END OF setupInventorySlot



//Sets or resets localstorage for a new game.
function resetMemory(){
    localStorage.setItem("game_started", "1");
    localStorage.setItem("home_visit_first", "1");
    localStorage.setItem("farm_visit_first", "1");
    localStorage.setItem("home_hoe", "1");
    localStorage.setItem("home_sword", "0");
    localStorage.setItem("home_book", "1");
    localStorage.setItem("inv_slot_0", "-1");
    localStorage.setItem("inv_slot_1", "-1");
    localStorage.setItem("inv_slot_2", "-1");
    localStorage.setItem("inv_slot_3", "-1");
    localStorage.setItem("inv_slot_4", "-1");
	
	if(debugMode == true){
		localStorage.setItem("gold", "1000");
	}else{
		localStorage.setItem("gold", "0");
	}
	
    localStorage.setItem("shop_sword", "1");
	localStorage.setItem("farm_goblin_event", "0");
	localStorage.setItem("farm_goblin_event_left", "0");
}//END OF resetMemory

//Finished the game? Be nice and clean up their memory.
function clearMemory(){
    localStorage.clear();
}//END OF clearMemory



//Make some UI graphics consistent with the real data, such as the inventory slot pictures 
//consistent with the "inv_slot_#" storage values, and the gold number displayed consistent
//with the "gold" storage value.
function updateGraphics(){

    custom_updateGraphics();

	
	//have a gold counter?
	if( $("#divGold").length == 1){
	    updateGold();
	}
	
}//END OF updateGraphics


//Set an inventory slot (argInventorySlotID) to hold this type of item (argNewItemID).
//Updates the aryInventory array, "inv_slot_#" localStorage key, and the inventory
//slot graphic.
function setInventorySlot(argInventorySlotID, argNewItemID){    
	aryInventory[argInventorySlotID] = argNewItemID;
	
	localStorage.setItem("inv_slot_"+argInventorySlotID, argNewItemID.toString() );
	updateInventorySlotGraphic(argInventorySlotID);
}//END OF setInventorySlot

//Update the inventory slot graphic to be in sync with aryInventory / localstorage.
function updateInventorySlotGraphic(argInventorySlotID){
	var invImgPath = getInventoryItemImagePath(argInventorySlotID);
	$("#imgInvSlot" + (argInventorySlotID)).attr({src: invImgPath });
}//END OF updateInventorySlotGraphic


//Get the amount of gold the player has, as a number for doing 
//math / comparisons most likely.
function getGold(){
    return parseInt(localStorage.getItem("gold"));
}//END OF getGold


//Adjust the player's gold value by this much, compared to what it was before.
function changeGold(arg_numShiftGoldValue){
    //var strShiftGoldValue = argShiftGoldValue.toString();
	var strOldGoldValue = localStorage.getItem("gold");
	var numNewGoldValue = parseInt(strOldGoldValue) + arg_numShiftGoldValue;
	setGold(numNewGoldValue);
}//END OF changeGold

//Force the player's gold value to a new value, ignores the old.
//Also updates the graphic.
function setGold(arg_numNewGoldValue){
    var strNewGoldValue = arg_numNewGoldValue.toString();
    localStorage.setItem("gold", strNewGoldValue);
	$("#pGoldQuantity").html( strNewGoldValue );
}//END OF setGold

//Just update the gold graphic from localStorage's count.
//Good for the start of a page to keep the graphic relevant.
function updateGold(){
    $("#pGoldQuantity").html( localStorage.getItem("gold") );
}//END OF updateGold



//See if the goblin should show up the next time the player goes to the farm,
//along with a warning before going there.
function determineGoblinEvent(){

    //The goblin can only show up if the player has been to the farm at least once.
    if(localStorage.getItem("farm_visit_first") == "0"){
	    //been to the farm before? Chance of the goblin showing up.
		var randomChance = Math.random();
		if(randomChance < 0.3){
		    //30% chance of the goblin appearing when this page loads.
			localStorage.setItem("farm_goblin_event", "1");
			localStorage.setItem("farm_goblin_event_left", "0");
		}else{
			//otherwise, safe to farm.
			if(localStorage.getItem("farm_goblin_event") == "1"){
			    //If the event was on before but is now off,
				//let the player know this changed.
				localStorage.setItem("farm_goblin_event_left", "1");
			}
			localStorage.setItem("farm_goblin_event", "0");
		}
	}else{
	    //Otherwise, no chance of the goblin showing up.
		localStorage.setItem("farm_goblin_event", "0");
	}

}//END OF determineGoblinEvent




