
// Thanks,
//https://www.w3schools.com/howto/howto_js_fullscreen.asp
//https://stackoverflow.com/questions/3157372/css-horizontal-centering-of-a-fixed-div


// Meant to assist with conveniently running Arrowman 3D (or really an Armory project in general) in fullscreen mode.


var documentElementRef = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (documentElementRef.requestFullscreen) {
	documentElementRef.requestFullscreen();
  } else if (documentElementRef.mozRequestFullScreen) { /* Firefox */
	documentElementRef.mozRequestFullScreen();
  } else if (documentElementRef.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
	documentElementRef.webkitRequestFullscreen();
  } else if (documentElementRef.msRequestFullscreen) { /* IE/Edge */
	documentElementRef.msRequestFullscreen();
  }
}//END OF openFullscreen

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
	document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
	document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
	document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
	document.msExitFullscreen();
  }
}//END OF closeFullscreen




var startGameFunction = null;

function startGameCustom(){

	//Hide these, don't want distractions.
	document.getElementById("divContent").style.display = "none";
	document.getElementById("aBackButton").style.display = "none";
	openFullscreen();
	
	
	setTimeout(
		function(){
			startGameFunction = startGameCustomAfter;
			starterRef();
			var ele_khanvas = document.getElementById("khanvas");
			ele_khanvas.onclick = function(){
				startGameFunction();
			}//END OF onclick
		},
		2000
	);
}//END OF startGameCustom


// Must be hooked up to the game itself (html5/kha.js)
function quitGameCustom(){
	
	closeFullscreen();
	setTimeout(
		function(){
			// Back to the portfolio page.
			location.href = "../../index.html";
		},
		1500
	);
}//END OF quitGameCustom


function startGameCustomAfter(){
	openFullscreen();
}



//starts as this.
startGameFunction = startGameCustom;

//See kha.js (commented out there). This is what starts the game. Doing it for this button instead.
