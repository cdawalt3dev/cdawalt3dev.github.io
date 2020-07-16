
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 21 September 2016
 PURPOSE: see looping.html
 MODIFICATION HISTORY:
 Original Build.
 */
 


$(document).ready(function(){
	"use strict";
	
	
	/*
	Purpose: called at window startup.  Can start with a prompt or initialize features that need it by script.
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		
		
		alert("Tresspassers shall spend eternity in the loopin\' whirlpool!");
		someLoop();
		
		
	});//end of window.load
	
	
	
	function someLoop(){
	
		var strLine = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";
		var strPool = strLine + "\n" + strLine + "\n" + strLine + "\n" + strLine + "\n" + strLine + "\n" + strLine + "\n" + strLine + "\n" + strLine + "\n" + strLine + "\n" + strLine + "\n" + strLine + "\n" + strLine + "\n" + strLine;
		
		while(true){
			
			alert(strPool);		
			
		}
		
		
	}
	
	
	
	//example: clickable button.
	/*
	$("#btnSomeButton").click(function(){
		alert("Argh, the screen be minty fresh.");
		
	});//end of #btnSomeButton.click
	*/
	
	
	

});//end of document.ready

	