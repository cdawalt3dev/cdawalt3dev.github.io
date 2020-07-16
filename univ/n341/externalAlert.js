/**************************************
 TITLE: externalAlert.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 26 August 2016
 PURPOSE: Link from the homepage to here.
 LAST MODIFIED ON: 26 Aug 2016
 LAST MODIFIED BY: Chris Dawalt (CPD)
 Modification History:
 7 May 2015: Add comments (SAS)
 26 Aug 2016: Customized a bit (CPD)
 
***************************************/

// The $ is the jQuery object
// "document" is the document object
// ready is a method of the jQuery object
// function creates an anonymous function to contain the code that should run
// In English, when the DOM has finished loading, execute the code in the function.
// See pages 312-313 of the text for details.
$(document).ready(function(){
			
	// Pop up a window that says something.  Maybe two.
	alert("You should click \"OK\".  OK?");
	alert("Great.  Once more?");
	
	
		
}); // end of $(document).ready()