
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 29 October 2016
 PURPOSE: Show the use of JQuery to edit HTML elements.
 MODIFICATION HISTORY:
 Original Build.
 */
 


$(document).ready(function(){
	"use strict";
	
	var bolFontToggle = true;
	//true = original.  false = alternate.
	
	var ary_qryRef = [
		$("#imgPirateShip0"),
		$("#imgPirateShip1"),
		$("#imgPirateShip2"),
		$("#imgPirateShip3"),
		$("#imgPirateShip4")
		
	];
	
	//remember X coordinates so that ships steadily move a little past the previous X value.  Y values are re-done every frame (ships always snap to the bottom of the window).
	var ary_pirateShipX = new Array(5);
	//var ary_pirateShipY = new Array(5);
	
	
	
	/*
	Purpose: called at window startup.  Changes the only "p" element's text.
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		
		$('p').html('Written through JQuery.');
		
		setInterval(frameLogic, 50);
		
		initImagePlacement();
		
	});//end of window.load
	
	/*
	Purpose: Reset button click method.  Refreshes the page.
	Parameters: none
	Return: none
	*/
	$("#btnReset").click( function(){
		//window.location.href = "?";
		//or,
		location.reload();
	});
	
	/*
	Purpose: Append button click method.  Adds a new line of text to the "p" element.
	Parameters: none
	Return: none
	*/
	$("#btnAppend").click( function(){
		$('p').append("<br/>New line, added through JQuery.");
	});
	
	/*
	Purpose: Replace button click method.  Replace the only "p"'s text with something different.
	Parameters: none
	Return: none
	*/
	$("#btnReplace").click( function(){
		$('p').html("Replaced through JQuery.");
	});
	
	/*
	Purpose: "Toggle Font" button click method.  Alter the font.
	Parameters: none
	Return: none
	*/
	$("#btnToggleFont").click( function(){
		//$('p').html("Replaced through JQuery.");
		
		
		bolFontToggle = !bolFontToggle;
		
		if(bolFontToggle){
			$('p').css("font-family", "Gotham, \"Helvetica Neue\", Helvetica, Arial, sans-serif");
		}else{
			$('p').css("font-family", "Consolas, \"Andale Mono\", \"Lucida Console\", \"Lucida Sans Typewriter\", Monaco, \"Courier New\", monospace");
			
		}
		
		
	});
	
	
	/*
	Purpose: Put the pirate ship images on-screen at a decent position at startup.
	Parameters: none
	Return: none
	*/
	function initImagePlacement(){
		
		var w = getBrowserWidth();
		var h = getBrowserHeight();
		
		for(var i = 0; i < ary_qryRef.length; i++){
			
			ary_qryRef[i].css("position", "absolute");
			
			ary_pirateShipX[i] = (w * 0.1) + 76*2 * i;
			setCoordinates(ary_qryRef[i], ary_pirateShipX[i], h - 76);
		}
		
		//alert(ary_qryRef[0].css("left"));
		
	}
	
	/*
	Purpose: Runs several times every second.  Moves the five pirate ship images to the left and moves them back to the right (wrap-around) if they go far enough to be completely off-screen (left-point is beyond the negative width)
	Parameters: none
	Return: none
	*/
	function frameLogic(){
		var w = getBrowserWidth();
		var h = getBrowserHeight();
		
		
		for(var i = 0; i < ary_qryRef.length; i++){
			
			ary_qryRef[i].css("position", "absolute");
			
			ary_pirateShipX[i] -= 2;
			
			if(ary_pirateShipX[i] < -76){
				ary_pirateShipX[i] = w;	
			}
			
			setCoordinates(ary_qryRef[i], ary_pirateShipX[i], h - 76);
			
		}
		
	}
	
	
	/*
	Purpose: set the coordinates (left and top, or "X" and "Y" accordingly) of a given JQuery reference (HTML element).
	Parameters: none
	Return: none
	*/
	function setCoordinates(ary_qryRefToMove, arg_x, arg_y){
		ary_qryRefToMove.css("left", arg_x + "px");
		ary_qryRefToMove.css("top", arg_y + "px");
	}
	
	
	
	
	/*
	//unused methods for editing X and Y coords individually.
	function setX(ary_qryRefToMove, arg_x){
		ary_qryRefToMove.css("left", arg_x + "px");
	}
	function setY(ary_qryRefToMove, arg_y){
		ary_qryRefToMove.css("top", arg_y + "px");
	}
	*/
	
	
	/*
	Purpose: versatile way of getting width across browsers that may handle this procedure differently.
	Parameters: none
	Return: browser view-port width.
	*/
	function getBrowserWidth(){
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		return w;
	}
	
	/*
	Purpose: versatile way of getting height across browsers that may handle this procedure differently.
	Parameters: none
	Return: browser view-port height.
	*/
	function getBrowserHeight(){
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		return h;
	}

	
	
	
	

});//end of document.ready

	