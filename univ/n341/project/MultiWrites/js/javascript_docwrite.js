
/*
 TITLE: javascript_docwrite.js
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
		was used to write the joke "Hello World" pile.  Now done by changing pre-defined HTML elements as ordered (by button press).  Left here as an example for a window's startup event.
	PARAMETRS: none.
	RETURN VALUE: none.
	*/
	$(window).load(function(){
		
		document.write("<a> Feelin' a tad <i>parched</i>, lad.  Fetch me a drink, would ye? </a>");
		
	});//end of window.load
	 
	 
	

});//end of document.ready

	