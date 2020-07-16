
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 14 September 2016
 PURPOSE: see index.html
 MODIFICATION HISTORY:
 Original Build.
 Day Mon Yr: insert comment here. (CPD)
 */
 


$(document).ready(function(){
	"use strict";
	
	
	/*
	Purpose: called at window startup.  Can start with a prompt or initialize features that need it by script.
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		
		runPrompt();
		
	});//end of window.load
	
	
	/*
	Purpose: call the method to provide the prompt and interpret the result (null, true, or false).
	Parameters: none
	Return: none
	*/
	function runPrompt(){
		
		hideDisplay();
		
		var strEndText = "";
		
		//the method returns a boolean: true or false, corresponding to "yes" or "no".  It returns "null" if it is declined (cancel).
		var blnOutput = safeGetYesNoAnswer("Did ye get to the port on time?", "maybe");
		
		
		
		if(blnOutput !== null){
			//if it isn't "null", it passed.  Expect "yes" or "no".		
			if(blnOutput){
				strEndText = "I knew ye were the punctual one.  Here\'s yer payment as promised.";
			}else{
				strEndText = "Aye, that be mighty disapointin\'.  No doubloons for ye.";
			}
			
		}else{
			strEndText = "Can\'t answer?  What exactly are ye hidin\'?";	
		}
		
		
		$("#aOutput").text(strEndText);	
		
		showDisplay();
			
	}//END OF runPrompt()
	
	/*
	Purpose: hide the GUI on window during a prompt.
	Parameters: none
	Return: none
	*/
	function hideDisplay(){
		$("#aOutput").text("");
		$("#aOutput").hide();
		$("#btnRestart").hide();
		$("#aBackLink").hide();
		
	}//END OF hideDisplay()
	
	/*
	Purpose: show the GUI on window after a prompt.
	Parameters: none
	Return: none
	*/
	function showDisplay(){
		$("#aOutput").show();
		$("#btnRestart").show();
		$("#aBackLink").show();
		
	}//END OF showDisplay()
	
	/*
	Purpose: restart the prompt by click.
	Parameters: none
	Return: none
	*/
	$("#btnRestart").click(function(){
		runPrompt();
		
	});
	
	
	
	/*
	Purpose: attempt to get "yes" or "no" from the user ("y" and "n" work too) in a case-neutral sense.  That is, case does not affect how the input is understood.
	Parameters: (string) prompt's label (question?), (string) default answer text
	Return: (bool) true or false, corresponding to "yes" or "no".  Can be "null" if the user declines the prompt.
	*/
	function safeGetYesNoAnswer(arg_strPromptText, arg_strDefaultText){
		
		var bolSuccess = false;  //always false; only returns break this method.
		var strRaw = "";
		var strUpper = "";
		
		while(!bolSuccess){
			
			strRaw = prompt(arg_strPromptText, arg_strDefaultText);
			
			
			if(strRaw === null){
				//the user declined the prompt.
				return null;  //cancel, don't bother anymore.
			}
			
			strUpper = strRaw.toUpperCase();
			
			if(strUpper === "MAYBE" || strUpper === "PERHAPS"){
				//special case for leaving the default case or "perhaps".	
				alert("What de ye mean \"" + strRaw + "\"?  Ye either made it on time or ye didn\'t!" );
				continue; //try again
			}
			
			if(strUpper === "YES" || strUpper === "Y"){
				return true;
			}
			if(strUpper === "NO" || strUpper === "N"){
				return false;
			}
			
			//made it here?  Something didn't go right, not recognized.  "return" exits the method, and "continue" resets this loop.
			alert("Sorry lad?  I need \"yes\" or \"no\" for an answer.");
			
			
			//Note that this loop is not broken by satisfying "bolSuccess".
			//it is broken by returning a value.  The "continue" word restarts it before this point.
			//At this point, the loop simply repeats, since the condition can't be passed.
		}//END OF while(!bolSuccess)
	}//END OF safeGetYesNoAnswer(...)
	
	
});//end of document.ready

	