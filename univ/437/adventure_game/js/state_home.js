



//Local storage keys for remembering whether each item was left in the home or not.
//They are boolean's, "0" or "1" for absent or present.
var homeLocalStorageMap = [
"home_hoe",
"home_sword",
"home_book"
];

//Each image element's ID in the home state for finding that image element
//to enable / disable.
var homeImgElementMap = [
"imgHomeHoe",
"imgHomeSword",
"imgHomeBook"
]





//Event for loading the page.
function custom_pageStart(){
	
	setupHomeClickables();
}


function custom_updateGraphics(){
    updateHomeGraphics();
}







//Setup each item graphic in the home scene (appears when clicking an item
//in the inventory to put in the home scene), and show a help message if this
//is the first time the player has been home.
function setupHomeClickables(){
	var i;

	setupHomeInventoryClickables();

	if(localStorage.getItem("home_visit_first") == "1"){
		$("#JS_HomeHelpText").css({display:"inline-block"});
		localStorage.setItem("home_visit_first", "0");
		$("#JS_LeaveHome").html("Let\'s go!");
	}
	
	for(i = 0; i < ID_INV_COUNT; i++){
	    setupHomeItemClickable(i);
	}

}//END OF setupHomeClickables














//Each item graphic in the home scene can be clicked to remove itself 
//(turn invisible) and put that item in the first open inventory slot.
function setupHomeItemClickable(argItemID){

	//Get the localStorage key to edit (home_hoe, home_sword, etc.)
	var thisLocalStorageKey = homeLocalStorageMap[argItemID];
	//and get the ID of the HTML element to apply to (imgHomeHoe, imgHomeSword, etc.)
	var thisImgElementID = "#" + homeImgElementMap[argItemID];
	
	$(thisImgElementID).click(function(){
	    if(localStorage.getItem(thisLocalStorageKey) == "1"){
			var availableInventoryID = getEmptyInventoryID();
			if(availableInventoryID != -1){
				localStorage.setItem(thisLocalStorageKey, "0");
				setInventorySlot(availableInventoryID, argItemID);
				updateHomeGraphic(argItemID);
				$("#pCustomMessage").html("");
			}else{
				$("#pCustomMessage").html("Your inventory is full, drop something first.");
			}
	    }
	});
	
	
}//END OF setupHomeItemClickable











//Keep the home scene graphics consistent with whether or not the home actually has them (storage values).
function updateHomeGraphics(){
    var i;
	for(i = 0; i < ID_INV_COUNT; i++){
	    //Update each home graphic. Each value of "i" corresponds to a possible item.
		//See the other inventory constants such as ID_INV_SWORD above.
	    updateHomeGraphic(i);
	}
	
}//END OF updateHomeGraphics


function updateHomeGraphic(argItemID){
	//Get the localStorage key to edit (home_hoe, home_sword, etc.)
	var thisLocalStorageKey = homeLocalStorageMap[argItemID];
	//and get the ID of the HTML element to edit (imgHomeHoe, imgHomeSword, etc.)
	var thisImgElementID = "#" + homeImgElementMap[argItemID];
	
	if(localStorage.getItem(thisLocalStorageKey) == "1"){
		//If the localStorage key is 1, this item is in the home. Allow its element to be rendered.
	    $(thisImgElementID).css({display:"inline-block"});
	}else{
		//Otherwise, this item is not in the home. Do not draw.
	    $(thisImgElementID).css({display:"none"});
	}
}//END OF updateHomeGraphic













//Set up each inventory slot for putting items in the scene when clicked.
function setupHomeInventoryClickables(){
	if( $("#divInventory").length == 1){
		for(i = 0; i < INVENTORY_SLOTS; i++){
			//$("#imgInvSlot0" + (i)).attr({src:"img/inventory_blank.png"});
			setupHomeInventoryClick(i);
		}//END OF click methods for each inventory slot in the home.
	}//END OF divInventory check
}//END OF setupHomeInventoryClickables


//Set up each slot of the player's inventory for, when clicked, moving the item
//to the home scene by making the corresponding scene graphic visible and 
//making the home's storage key recognize this,
//and removing the item from the player's inventory, graphic and storage wise.
function setupHomeInventoryClick(i){
	$("#imgInvSlot"+i).click(function(){
	  if(aryInventory[i] != -1){
		var inventoryItemTypeID = aryInventory[i];
		var localStorageKey = homeLocalStorageMap[inventoryItemTypeID];
		if(localStorage.getItem( localStorageKey ) == "0"){
			//put it back in the scene above.
			localStorage.setItem( localStorageKey, "1");
			
			setInventorySlot(i, -1);
			updateHomeGraphic(inventoryItemTypeID);
			
			//If there was a "inventory is full" notice, remove it.
			$("#pCustomMessage").html("");
		}
	  }
	});
}//END OF setupHomeInventoryClick



























