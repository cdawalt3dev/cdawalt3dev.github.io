


//Event for loading the page.
function custom_pageStart(){
	//Will there be a goblin in the farm fields?
	determineGoblinEvent();
	setupOutside();
}


function custom_updateGraphics(){
    
}


//The outside state is a hub for the other locations in the game.
//The player can return home, go to the farm, or go to the shop.
//But there is a random chance of the goblin event occuring.
//If so, the farm button will lead to the state_goblin.html page instead.
//The player will be notified of the goblin's presence or abscence if recent.
function setupOutside(){
    if( localStorage.getItem("farm_goblin_event") == "1"  ){
        $("#pCustomMessage").html("The goblin has been spotted in the farm fields. Caution.");
		
		//If the player clicks the button this time, they'll go to the goblin state instead of the farm.
        $("#JS_choiceFarm").attr({href:"state_goblin.html"});
    }else if(localStorage.getItem("farm_goblin_event_left") == "1"){
	    //Let the player know the goblin that was recently sighted is no longer there.
		$("#pCustomMessage").html("The goblin is gone. It is safe to farm.");
		localStorage.setItem("farm_goblin_event_left", "0") 
	}
}//END OF setupOutside



