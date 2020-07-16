
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 26 October 2016
 PURPOSE: Show the use of JQuery to edit HTML elements.
 MODIFICATION HISTORY:
 Original Build.
 */
 


$(document).ready(function(){
	"use strict";
	
	
	/*
	Purpose: called at window startup.  Changes the only "p" element's text.
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		
		$('p').html('Written through JQuery.');
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
	
	
	
	

});//end of document.ready

	