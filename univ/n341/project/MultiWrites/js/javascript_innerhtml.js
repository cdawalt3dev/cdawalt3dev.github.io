
/*
 TITLE: javascript_innerhtml.js
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
		
		document.getElementById("aTestText").innerHTML = "Avast, ye spineless shrimps. \'Tis only the <b> boldest</b>, <strong> strongest</strong> mates that stand a chance at gettin\' <h1> ahead. <h1>";
		
	});//end of window.load
	 
	 
	

});//end of document.ready

	