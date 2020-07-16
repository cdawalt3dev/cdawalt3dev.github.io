




//Event for loading the page.
function custom_pageStart(){
	precacheSound("cough");
	precacheSound("coins");
	
	setupFarm();
}


function custom_updateGraphics(){
    
}




//The farm state is separate from the goblin one. Separate web pages.
//Visiting the farm alone implies the player came there to work.
//The player makes 20 gold if they brought the hoe, or 5 gold if they didn't.
//Also allow the goblin event to occur since we've visited the farm at least once.
function setupFarm(){
    var hasHoe = hasInventoryItem(ID_INV_HOE);
	//What to write to the pCustomMessage element. Stored here to take separate messages
	//before a final write-out to pCustomMessage at the end.
	var strCustomMessage = "";
	
	if(localStorage.getItem("farm_visit_first") == "1"){
	
		//Create a message talking about the goblin, since it may show up in warnings
		//from the outside page now.
		
		strCustomMessage += "Howdy stranger.<br/>" + 
		"A goblin\'s been terrifying us. Watch out, he\'s tough.<br/><br/>";
		
	    //Have visited the farm before now.
	    localStorage.setItem("farm_visit_first", "0");
	}
	if(hasHoe == true){
	    playSound("coins");
	    //farming went well.
		//playSound("chaching_good");
		strCustomMessage += "You made 20 gold.";
		changeGold(20);
	}else{
	    playSound("cough");
	    //farming did not go so well.
		//playSound("chaching_poor");
		strCustomMessage += "You made 5 gold.<br/>" + 
		"Bring a tool next time.";
		changeGold(5);
	}
	
	$("#pCustomMessage").html(strCustomMessage);
	
}//END OF setupFarm

