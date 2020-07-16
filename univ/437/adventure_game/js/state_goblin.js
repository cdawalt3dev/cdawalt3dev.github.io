




//Each item has a specific function to call during the Goblin event.
var goblinItemFunctionMap = [
eventFunc_goblin_hoe,
eventFunc_goblin_sword,
eventFunc_goblin_book
]


//Event for loading the page.
function custom_pageStart(){
    precacheSound("goblin_mad");
    precacheSound("victory");
	
	setupGoblinClickables();
}


function custom_updateGraphics(){
    
}




//Set up each of the inventory slots for looking up that inventory item's
//function to run, given this is the Goblin state. Also set up the other
//two options besides running away.
function setupGoblinClickables(){
    
	if( $("#divInventory").length == 1){	
		for(i = 0; i < INVENTORY_SLOTS; i++){
			setupGoblinInventoryClick(i);
		}//END OF click methods for each inventory slot.
	}//END OF divInventory check
	
	$("#JS_choiceAskToLeave").click(function(){
	    $("#pCustomMessage").html("It didn\'t work.");
		//this does not end the game.
	});
	
	$("#JS_choiceFistFight").click(function(){
		playSound("goblin_mad");
		//This can not end well.
	    $("#pCustomMessage").html("You were no match for the goblin\'s brute strength.");
		setupGameEnd(false);
	});
	
}//END OF setupGoblinClickables


//Let each inventory slot look up the function appropriate for that item
//during the Goblin event.
function setupGoblinInventoryClick(i){
	$("#imgInvSlot"+i).click(function(){
		if(aryInventory[i] != -1){
			var inventoryItemID = aryInventory[i];
			//Run this item's function for the goblin event.
			//As in, a hoe, regardless of what slot it is in, leads to
			//one outcome. A book leads to another. etc.
			goblinItemFunctionMap[inventoryItemID]();

			//remove?
			//setInventorySlot(i, -1);
		}
	});
}//END OF setupGoblinInventoryClick



function eventFunc_goblin_hoe(){

    playSound("goblin_mad");
    setupGameEnd(false);
    $("#pCustomMessage").html("That was not very effective.<br/>" +
	"The goblin beat you up and took your lunch money."
	);
	
	setGold(0);
}//END OF eventFunc_goblin_hoe
function eventFunc_goblin_sword(){

    playSound("victory");
    setupGameEnd(true);
    $("#pCustomMessage").html("You slayed the goblin."
	);
    
}//END OF eventFunc_goblin_sword
function eventFunc_goblin_book(){

    playSound("victory");
    setupGameEnd(true);
	
	//This choice involves giving the item, so remove it from the inventory.
	//Find what slot the book is in...
	var bookInvID = getInventoryItem(ID_INV_BOOK);
	if(bookInvID != -1){
	    //And set that slot to -1 (empty).
		setInventorySlot(bookInvID, -1);
	}
	
	
    $("#pCustomMessage").html("You gave the goblin the book.<br/>" +
	    "It\'s a book about agriculture. The goblin learned how to farm and got a job here."
	);
}//END OF eventFunc_goblin_book



