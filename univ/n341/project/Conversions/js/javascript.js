
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 7 September 2016
 PURPOSE: see conversions.html.  Does the work.
 MODIFICATION HISTORY:
 Original Build.
 Day Mon Yr: insert comment here. (CPD)
 */
 


$(document).ready(function(){
	"use strict";
	
	
	/*
	NAME: window.load (essentialy).
	PURPOSE:
		called at window startup.  Can start with a prompt or initialize features that need it by script.
	PARAMETRS: none.
	RETURN VALUE: none.
	*/
	$(window).load(function(){
		
		promptForDoubloons();
		
		
		
	});//end of window.load
	 
	 
	 /*
	NAME: promptForDoubloons.
	PURPOSE:
		Heart of the program.  Prompt for name, doubloons, and update the resulting text to an HTML element.
	PARAMETRS: none.
	RETURN VALUE: none.
	*/
	function promptForDoubloons(){
		
		
		var strName = "";
		var intDoubloons = 0;
		var intDollars = 0;
		var doubloonPrice = 287;  //"const"
		var outputString = "";
		var outputString2 = "";
		
		
		
		
		strName = safeGetNameFromPrompt();
		
		
		
		
		//NOTE: "safeGetCountableFromPrompt" has the var "strDoubloonsRaw" for getting the input as a string.
		//      It checks for issues before converting to an integer (as well as afterwards) and returns that here.  It returns its own local var, "intDoubloons", identical in name to the one here.
		intDoubloons = safeGetCountableFromPrompt();
		
		
		//intDoubloons is null if the user declined to give that information.
		if(intDoubloons !== null){
			
			
			
			//nothing? check for that.
			if(intDoubloons > 0){
				//calculated profit.
				intDollars = intDoubloons * doubloonPrice;
			
				//Print the three desired values: name, doubloons, dollars.
				outputString = "Let it be known that shipmate " + strName + " amassed a grand total of " + unitsPlural(intDoubloons, "doubloon", "doubloons") + " worth $"  + intDollars.toLocaleString() + "." ;
				
			}else{
				outputString = "Shipmate " + strName + " hasn\'t even a scrap." ;
				
			}
			
			
			//some extra flavor text
			if(intDollars === 0){
				outputString2 = "This lazy lad gets ta scrub the poopdeck.";
			}else if(intDollars < 2400){
				outputString2 = "First time?  Below the deck, that flowin\' blue stuff is what we like ta call \"water\"...";	
			}else if(intDollars < 6400){
				outputString2 = "Not bad for a rookie, but ya\'v got a long way ta go.";
			}else if(intDollars < 24000){
				outputString2 = "A fine companion for the average journey. \'Yargh.";
			}else if(intDollars < 2000000){
				outputString2 = "A seasoned veteran of the sea.  And the years do go by...";
			}else if(intDollars < 50000000){
				outputString2 = "A legend among legends.  Pity the scalawags who dare cross ye.";
			}else if(intDollars < 1000000000){
				outputString2 = "Davy Jones\' Locker!  If\'n ye don\'t rule the seven seas n\' beyond by now...";
			}else{
				//no pirate is a billionaire...
				outputString2 = "Now I know yer fibbin\'.  Get back ta scrubbin\' the poopdeck, lacky.";	
			}//END OF extra flavor text chain.
			
			
		}else{
			//no amount given? can't really say anything.
			outputString = "Argh, shipmate " + strName + " prefers to keep ta themselves.";
			outputString2 = "";
		}//END OF if(intDoubloons !== null)'s else
		
		
		//equivalent of "textContent" for JQuery
		$("#aLineOut").text(outputString);
		$("#aLineOut2").text(outputString2);
		
		//unhide the restart button and back link.
		$("#btnRestart").show();
		$("#aBackLink").show();
		
	}//END OF promptForDoubloons
	
	
	
	
	 /*
	NAME: safeGetNameFromPrompt
	PURPOSE:
		Safely get some string from the user.  Prompt for retrying if something is wrong with what is given.
	PARAMETRS: none.
	RETURN VALUE: (string) a name.
	*/
	function safeGetNameFromPrompt(){
		
		var bolSuccess = false; //assume unsuccessful, haven't tried yet.
		var strName = "";
		
		
		while(!bolSuccess){
			strName = prompt("And who do I have the pleasure of addressin\':", "Smitty Werbenjagermanjensen");
			
			
			//strName is "null" if the prompt was cancled.  Force a name.
			if(strName === null){
				alert("Not up ta tellin\' me?  Alright, \"No-name Nelly\".");
				return "No-name Nelly";
			}
			
			//nothing is typed.  Spaces only aren't a name.
			if(strName.trim() === ""){
				alert("Unless I be mistaken, there\'s nothing written.  Surely, there\'s somethin\' mates call ye by.");
				continue;
			}
		
			bolSuccess = true;
		}//END OF while(!bolSuccess)
		return strName;
	}
	
	
	
	 /*
	NAME: safeGetCountableFromPrompt
	PURPOSE:
		Safely get some positive integer (non-decimal) from the user.  Prompt for retrying if something is wrong with what is given.
	PARAMETRS: none.
	RETURN VALUE: (int) the number of doubloons entered.
	*/
	function safeGetCountableFromPrompt(){

		var bolSuccess = false;  //assume false at start, haven't tried yet.
		var strDoubloonsRaw = "";
		var intDoubloons = 0;
		
		
		//This loop will be repeated on noticing a problem with the input.
		while(!bolSuccess){
	
			strDoubloonsRaw = prompt("What be yer worth in Doubloons:", "0");
			
			
			if(strDoubloonsRaw === null){
				alert("Can\'t tell me yer worth?  Alrighty then.");
				return null;	
			}
			
			if(strDoubloonsRaw.indexOf("-") !== -1){
				//The error is reported via "alert", and the "continue" keyword restarts the loop.
				alert("Negative Doubloons?  Nobody has less than nothin\'.");
				continue;
			}
			if(strDoubloonsRaw.indexOf(".") !== -1){
				alert("Never heard of \"part of\" a doubloon.  Round down fer broken ones.");
				continue;
			}
			
			//Try parsing the string as an integer, now that some preliminary things have been checked for.
			intDoubloons = parseInt(strDoubloonsRaw);
			
			//A less specific error.
			if(isNaN(intDoubloons)){
				alert("Not sure that\'s a number, lad.  Got some funny characters muckin\' about.");
				continue;
			}
			
			
			
			
			
			
			
			
			//made it here? Done.
			bolSuccess = true;
			
		}//END OF while(!bolSuccess)
		
		return intDoubloons;
	}//END OF safeGetCountableFromPrompt
	
	
	
	 /*
	NAME: unitsPlural
	PURPOSE:
		return a string containing some number and the appropriate type of units (singular or plural), both provided.  Also comma-delimits the number.
	PARAMETRS: (int) quantative number, (string) singular unit, (string) plural unit
	RETURN VALUE: (string) the concatenation of the quantity, a space, and the chosen label.
	*/
	function unitsPlural(arg_intValue, arg_strSingle, arg_strPlural ){
		
		//comma delimit while we're at it...
		var intDelimited = arg_intValue.toLocaleString();
		
		if(arg_intValue === 1){
			return (intDelimited + " " + arg_strSingle);
		}else{
			return (intDelimited + " " + arg_strPlural);
		}
	}//END OF unitsPlural(...)
	
	
	
	
	/*
	NAME: #btnAgain.click
	PURPOSE:
		re-prompt for a new printout.
	PARAMETRS: none.
	RETURN VALUE: none.
	*/
	$("#btnRestart").click(function(){
		
		$("#aLineOut").text(""); //clear the output.
		
		$("#aLineOut2").text(""); //clear the output.
		
		$("#btnRestart").hide();
		$("#aBackLink").hide();
		
		promptForDoubloons();
		
	});//end of #btnSomeButton.click
	
	
	
	

});//end of document.ready

	