
//Assuming this variable is available to set. Skips the usual localstorage check.
//Otherwise, the game would report that "No game data found" instead of showing the
//page content. Of course there isn't any localstorage, this is a new game.
newGamePage = true;


//Event for loading the page.
function custom_pageStart(){
	//First page of the game will set localStorage with some reasonable defaults.
	resetMemory();
}


function custom_updateGraphics(){
    
}
