
/*
 TITLE: javascript_textcontents.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 4 September 2016
 PURPOSE: See corresponding HTML file
 LAST MODIFIED BY: Chris Dawalt (CPD)
 MODIFICATION HISTORY:
 Original build.
 */
 


$(document).ready(function(){
	"use strict";
	
	
	/*
	NAME: window.load (essentialy).
	PURPOSE:
		change the default text below the makeshift navigation header using the page's suggested method.
	PARAMETRS: none.
	RETURN VALUE: none.
	*/
	$(window).load(function(){
		
		document.getElementById("aTestText").textContent = "Not bad, but it'd benefit from a spot o' rum.";
		
	});//end of window.load
	 
	 
	

});//end of document.ready

	