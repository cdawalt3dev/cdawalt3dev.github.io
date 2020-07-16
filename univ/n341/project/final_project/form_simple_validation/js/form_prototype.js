
/*
 TITLE: form_prototype.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 26 November 2016
 PURPOSE: See form_prototype.html (and note below)
 MODIFICATION HISTORY:
 Original Build.
 */

///////////////////////////////////////////////////////////////////////////
///NOTE:
///////////////////////////////////////////////////////////////////////////
/*
This file has some preparation script to assist with setting up JQuery for this 
particular page.  Some changes / updates are still done in javascript.js, where
most of the page-specific script is, such as resetting features.

*/
///////////////////////////////////////////////////////////////////////////


//anything of this class will take from the theme.
$(".btnTheme").button();

$( "#divSaleModes" ).buttonset();
$( "#divRadTypeOfProject" ).buttonset();

//handled in javascript.js instead.
/*
$( "#divCostEstimate" ).slider({
	range: true,
	
	values: [ 36, 44 ]
	
});
*/


$( "#txtDateEstimate" ).datepicker({
	inline: true
	
});


//$( "#selSpecific" ).selectmenu();
  $( "#selSpecific" ).menu();

  
  
/*        
var availableTags = [
	
];
$( "#txtSpecific" ).autocomplete({
	source: availableTags
});
*/
//will be done in javascript.js.
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

//not relevant to this project.
/*
var availableTags = [
	"ActionScript",
	"AppleScript",
	"Asp",
	"BASIC",
	"C",
	"C++",
	"Clojure",
	"COBOL",
	"ColdFusion",
	"Erlang",
	"Fortran",
	"Groovy",
	"Haskell",
	"Java",
	"JavaScript",
	"Lisp",
	"Perl",
	"PHP",
	"Python",
	"Ruby",
	"Scala",
	"Scheme"
];
$( "#autocomplete" ).autocomplete({
	source: availableTags
});




$( "#button" ).button();
$( "#button-icon" ).button({
	icon: "ui-icon-gear",
	showLabel: false
});



//$( "#radioset" ).buttonset();



$( "#controlgroup" ).controlgroup();



$( "#tabs" ).tabs();



$( "#dialog" ).dialog({
	autoOpen: false,
	width: 400,
	buttons: [
		{
			text: "Ok",
			click: function() {
				$( this ).dialog( "close" );
			}
		},
		{
			text: "Cancel",
			click: function() {
				$( this ).dialog( "close" );
			}
		}
	]
});

// Link to open the dialog
$( "#dialog-link" ).click(function( event ) {
	$( "#dialog" ).dialog( "open" );
	event.preventDefault();
});



$( "#datepicker" ).datepicker({
	inline: true
});



$( "#slider" ).slider({
	range: true,
	values: [ 17, 67 ]
});



$( "#progressbar" ).progressbar({
	value: 20
});



$( "#spinner" ).spinner();



$( "#menu" ).menu();



$( "#tooltip" ).tooltip();



//$( "#selectmenu" ).selectmenu();





// Hover states on the static widgets
$( "#dialog-link, #icons li" ).hover(
	function() {
		$( this ).addClass( "ui-state-hover" );
	},
	function() {
		$( this ).removeClass( "ui-state-hover" );
	}
);
*/