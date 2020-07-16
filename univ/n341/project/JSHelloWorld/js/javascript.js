
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 26 August 2016
 PURPOSE: Print out "Hello World" with the assistance of javascript.
 LAST MODIFIED ON: 26 Aug 2016
 LAST MODIFIED BY: Chris Dawalt (CPD)
 MODIFICATION HISTORY:
 26 Aug 2016: looked up some basic JQuery.  Applied it for this file.
 31 Aug 2016: completed, supports toggling b/w construction and normal rendering.
 */
 


$(document).ready(function(){
	"use strict";
	var bolConstruction = false;
	
	
	/*
	NAME: window.load (essentialy).
	PURPOSE:
		was used to write the joke "Hello World" pile.  Now done by changing pre-defined HTML elements as ordered (by button press).  Left here as an example for a window's startup event.
	PARAMETRS: none.
	RETURN VALUE: none.
	*/
	$(window).load(function(){
		
	});//end of window.load
	 
	 
	 /*
	NAME: btnConstruction.click
	PURPOSE:
		toggle showing the construction gag or a normally rendered "Hello World".
	PARAMETRS: none.
	RETURN VALUE: none.
	*/
	$('#btnConstruction').click(function() {
		
  		var strTonsOfSpace = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
		
		if(!bolConstruction){
			//the button will always reflect the opposite state since it is meant to change the current.
			$('#btnConstruction').html("See Normal Version");
			
			$('#aLine1').html("He");
			$('#aLine2').html( strTonsOfSpace + "&nbsp&nbsp&nbsp&nbsp l" );
			$('#aLine3').html( strTonsOfSpace + "&nbsp&nbsp l o W" );
			$('#aLine4').html( strTonsOfSpace + "&nbsp o r l d" );
			
		}else{
			$('#btnConstruction').html("See Construction Version");	
			
			$('#aLine1').html("Hello World");
			$('#aLine2').html("");
			$('#aLine3').html("");
			$('#aLine4').html("");
			
		}
		
		//toggle "bolConstruction".
		bolConstruction = !bolConstruction;
		
		
    });//end of #btnConstruction.click
	

 	/*
	NAME: btnAlert.click
	PURPOSE:
		show some pirate-ish text in an "alert" box.
	PARAMETRS: none.
	RETURN VALUE: none.
	*/
	$('#btnAlert').click(function(){
		
		alert("Argh, the screen be minty fresh.");
		
	});//end of #btnAlert.click
	
	
	
	

});//end of document.ready

	