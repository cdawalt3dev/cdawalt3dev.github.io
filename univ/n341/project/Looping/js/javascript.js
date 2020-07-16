
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
	
	
	var intBinaryDigits = 8;  //vital constant.
	
	var ary_qryDigit = [
		$("#aBinaryDigit0"),
		$("#aBinaryDigit1"),
		$("#aBinaryDigit2"),
		$("#aBinaryDigit3"),
		$("#aBinaryDigit4"),
		$("#aBinaryDigit5"),
		$("#aBinaryDigit6"),
		$("#aBinaryDigit7")
	];
	var ary_qryInterpretation = [
		$("#aInterpretation0"),
		$("#aInterpretation1"),
		$("#aInterpretation2"),
		$("#aInterpretation3"),
		$("#aInterpretation4"),
		$("#aInterpretation5"),
		$("#aInterpretation6"),
		$("#aInterpretation7")
	];
	
	
	/*
	Purpose: called at window startup.  Can start with a prompt or initialize features that need it by script.
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		
		clearScreen(true);
		
	});//end of window.load
	
	
	/*
	Purpose: clear possibly altered fields between resets or a refresh.
	Parameters: (bool) also clear the input textbox.  Not desirable after clicking "Submit".
	Return: none
	*/
	function clearScreen(arg_bolIncludeInput){
		var i = 0;
		$("#aASCIIResult").text("");
		
		for(i = 0; i < intBinaryDigits; i++){
			ary_qryDigit[i].text("");
			ary_qryInterpretation[i].text("");
		}
		
		if(arg_bolIncludeInput){
			$("#txtCharBox").prop("value", "");  //not included in clean.
		}
	}//END OF clearScreen()
	
	/*
	Purpose: trigger "clearScreen" on clicking the "clear" button.
	Parameters: none
	Return: none
	*/
	$("#btnClear").click(function(){
		clearScreen(true);
	});//END OF btnClear's click
	
	/*
	Purpose: process the input in the textbox.  See if it is one character and proceed if so.
	Parameters: none
	Return: none
	*/
	$("#btnSubmit").click(function(){
		clearScreen(false); //reset output in case a failure leaves the old there.
		
		var strChar = getCharFromTextBox( $("#txtCharBox") );
		
		if(strChar !== null){
			
			processCharacter(strChar);
		}
	});//END OF btnSubmit's click
	
	
	/*
	Purpose: "Enter By Prompt" click. attempt to get the character from a generated prompt instead.
	Parameters: none
	Return: none
	*/
	$("#btnEnterByPrompt").click(function(){
		clearScreen(true); //reset output in case a failure leaves the old there.
				
		var strChar = getCharFromPrompt( );
		if(strChar !== null){
			
			$("#txtCharBox").prop("value", strChar);  //put the character typed into the input box just to show what is being represented.
			processCharacter(strChar);
		}
	});
	
	
	/*
	Purpose: check to see if what is in the given textbox is a single character.  If so, return that.
	Parameters: (jquery reference) element to look, a textbox
	Return: none
	*/
	function getCharFromTextBox(arg_qryRef){
		
		var strRaw = arg_qryRef.prop("value");
		
		while(true){
		
			if(strRaw === null){
				alert("Empty.  Type one character.");
				return null;
			}
			if(strRaw.length !== 1){
				alert("Multiple characters present.  One required.");
				return null;	
			}
			
			break;  //made it this far? done.	
		}//END OF while(true)
		return strRaw;
	}//END OF getCharFromTextBox()
	
	
	
	
	
	/*
	Purpose: attempt to get one character from a prompt.
	Parameters: (jquery reference) element to look, a textbox
	Return: none
	*/
	function getCharFromPrompt(){
		var strRaw = "";
		
		while(true){
			strRaw = prompt("Enter a character:");
			
			if(strRaw === null){
				//the user declined, signal failure.
				return null;	
			}
			
			if(strRaw.trim() === ""){
				alert("Empty.  Type one character.");
				continue;
			}
			if(strRaw.length !== 1){
				alert("Multiple characters present. One required.");
				continue;	
			}
			
			break;  //made it this far? done.	
		}//END OF while(true)
		return strRaw;
	}//END OF getCharFromTextBox()
	
	
	
	
	/*
	Purpose: take the given character and ultimately convert it to eight boolean digits to display in a table along with interpretations.
	Parameters: (jquery reference) element to look, a textbox
	Return: none
	*/
	function processCharacter(arg_strChar){
		
		var intASCII = parseAscii(arg_strChar);
		
		$("#aASCIIResult").text(intASCII);
		
		var strBinary = parseBin(intASCII);
		
		var ary_strDigit = strBinary.split("");
		var i = 0;
		
		
		for(i = 0; i < ary_strDigit.length; i++){
			ary_qryDigit[i].text(ary_strDigit[i]);
			
			if(ary_strDigit[i] === "1"){
				ary_qryInterpretation[i].text("true");
			}else if(ary_strDigit[i] === "0"){
				ary_qryInterpretation[i].text("false");
			}else{
				ary_qryInterpretation[i].text("?");
			}
		}
	}//END OF processCharacter
	
	
	
	
	
	/*****			
	Purpose: Takes a single character and returns its corresponding ASCII value (its place in the ASCII table, typically from 0 to 127).
	Parameters: single character / letter		
	Return: integer representing an ascii value
	*****/
	function parseAscii(chrCharacter)
	{
		var intAscii = chrCharacter.charCodeAt(0);
		return intAscii;
	}
	
	/*****			
	Purpose: Takes an ASCII value and gets its binary representation as a series of 0's and 1's that is 8 digits long.			
	Parameters: single integer representing an ascii value	
	Return: binary, base 2 representation of the number passed to this function
	*****/
	function parseBin(intAscii)
	{
		var strBin = parseInt(intAscii, 10).toString(2);
		if(strBin.length < 8)
		{
			var intPlaceHolders = 8 - strBin.length;
			for(var i = 0; i < intPlaceHolders; i++)
			{
				strBin = "0" + strBin;
			}
			
		}
		
		return strBin;
	}
	
	
	

});//end of document.ready

	