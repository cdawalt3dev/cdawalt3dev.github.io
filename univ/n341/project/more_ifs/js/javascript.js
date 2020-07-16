
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: September 19 2016
 PURPOSE: see more_ifs.html
 MODIFICATION HISTORY:
 Original Build.
 */
 


$(document).ready(function(){
	"use strict";
	
	//GLOBAL VARIABLES
	
		
	
	/*
	Purpose: called at window startup.  Calls the clear method just in case.
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		
		
		
		
		clearScreen();
		
	});//end of window.load
	
	
	/*
	Purpose: clean all fields / text that could have possibly changed since start (or from a page refresh)
	Parameters: none
	Return: none
	*/
	function clearScreen(){
		$("#txtCoordsFromLat").prop("value", "");
		$("#txtCoordsFromLon").prop("value", "");
		$("#txtCoordsToLat").prop("value", "");
		$("#txtCoordsToLon").prop("value", "");
		
		$("#aIfResultsText").text("");
		$("#aSwitchResultsText").text("");
		
	}
	
	/*
	Purpose: clear button click method.  Triggers "clearScreen()".
	Parameters: none
	Return: none
	*/
	$("#btnClear").click(function(){
		clearScreen();
	});
	
	/*
	Purpose: submit button click method.  Attempts to interpret user fields and report an error (bad numbers, non-numbers entered) or proceed to send for, ultimately, output.
	Parameters: none
	Return: none
	*/
	$("#btnSubmit").click(function(){
		
		//clear output in case an error occurs (leaving an old success could be deceiving)
		$("#aIfResultsText").text("");
		$("#aSwitchResultsText").text("");
			
		
		//y, x pairs
		var fltCurrentLatitude;
		var fltCurrentLongitude;
		var fltDestinationLatitude;
		var fltDestinationLongitude;
		
		var bolSuccess = false; //must reach the end of the loop without breaking to be successful.
		
		//this is a loop that inevitably breaks, and can be broken earlier in case of error.
		while(true){
			
			fltCurrentLatitude = attemptGetFloat($("#txtCoordsFromLat"), "Current Location\'s Lattitude");
			
			//note that any failure point here doesn't print an alert.  It is implied that "attemptGetFloat" mentioned what is wrong already.
			if(isNaN(fltCurrentLatitude) ){
				break;
			}
			fltCurrentLongitude = attemptGetFloat($("#txtCoordsFromLon"), "Current Location\'s Longitude");
			if(isNaN(fltCurrentLongitude) ){
				break;
			}
			fltDestinationLatitude = attemptGetFloat($("#txtCoordsToLat"), "Destination Location\'s Lattitude");
			if(isNaN(fltDestinationLatitude) ){
				break;
			}
			fltDestinationLongitude = attemptGetFloat($("#txtCoordsToLon"), "Destination Location\'s Longitude");
			if(isNaN(fltDestinationLongitude) ){
				break;
			}
			bolSuccess = true;  //made it to the end, take a note of that.
			break;
		}//END OF while(true), planned broken loop
		
		
		//only do work if all inputs could be read, no errors shown.
		if(bolSuccess){
			
			//send the coords off to be interpreted by the "if" and "switch" logic separately.
			processCoords(fltCurrentLatitude, fltCurrentLongitude, fltDestinationLatitude, fltDestinationLongitude);
			
		}//END OF if(bolSuccess)
		
		
	});//END OF btnSubmit's click method
	
	
	/*
	Purpose: Given two pairs of coords, return the angle between the 1st and 2nd in range [0, 360).
	Parameters: two x-y pairs (four floats) (longitudes first since they are "X", horizontal, values)
	Return: (float) degrees, unless both deltas are 0 (no angle possible; return NaN)
	*/
	function getDegreesAcrossCoords(arg_fltX1, arg_fltY1, arg_fltX2, arg_fltY2){
		
		var fltDeltaY = arg_fltY2 - arg_fltY1;
		var fltDeltaX = arg_fltX2 - arg_fltX1;
		
		var fltRadians = 0;
		var fltDegrees = 0;
		
		if(fltDeltaY !== 0 || fltDeltaX !== 0){
			//even if the denominator, "fltDeltaX", is 0, atan2 seems to handle it gracefully.
			fltRadians = Math.atan2(fltDeltaY, fltDeltaX);
			fltDegrees = fltRadians * (180.0 / Math.PI);
		}else{
			fltRadians = NaN;
			fltDegrees = NaN;
		}
		
		//If "fltDegrees" is NaN, leaves it that way (does not add 360 to it).
		if(fltDegrees < 0){
			fltDegrees += 360;	
		}
		
		return fltDegrees;
	}
	
	
	/*
	Purpose: Given an angle, give some advice on the direction that should be traveled, using a chain of "if-else" conditions.  The trig version has a +- 15 degree tolerance for the four cardinal directions before taking a 45-degree one (North West, South East, etc.)
	Parameters: (float) degrees
	Return: (String) advice on direction to travel to approach the destination.
	*/
	function getDirectionAdviceIfTrig(arg_fltDegrees){
		var strDirectionAdvice = "";
		
		if(arg_fltDegrees >= 360 - 15 || arg_fltDegrees <= 0 + 15 ){
			strDirectionAdvice = "Head East.";
		}else if(arg_fltDegrees > 0 + 15 && arg_fltDegrees < 90 - 15){
			strDirectionAdvice = "Head North East.";
		}else if(arg_fltDegrees >= 90 - 15 && arg_fltDegrees <= 90 + 15){
			strDirectionAdvice = "Head North.";
		}else if(arg_fltDegrees > 90 + 15 && arg_fltDegrees < 180 - 15){
			strDirectionAdvice = "Head North West.";
		}else if(arg_fltDegrees >= 180 - 15 && arg_fltDegrees <= 180 + 15){
			strDirectionAdvice = "Head West.";
		}else if(arg_fltDegrees > 180 + 15 && arg_fltDegrees < 270 - 15){
			strDirectionAdvice = "Head South West.";
		}else if(arg_fltDegrees >= 270 - 15 && arg_fltDegrees <= 270 + 15){
			strDirectionAdvice = "Head South.";
		}else if(arg_fltDegrees > 270 + 15 && arg_fltDegrees <= 360 - 15){
			strDirectionAdvice = "Head South East.";
		}else{
			strDirectionAdvice = "Land Ho!";
		}
		
		return strDirectionAdvice;
		
		
		
	}//END OF getDirectionAdviceIfTrig(...)
	
	
	/*
	Purpose: Same as above, but using a series of switch-case conditions instead.
	Parameters: (float) degrees
	Return: (String) advice on direction to travel to approach the destination.
	*/
	function getDirectionAdviceSwitchTrig(arg_fltDegrees){
		
		var strDirectionAdvice = "";
		
		switch(true){
			case (arg_fltDegrees >= 360 - 15 || arg_fltDegrees <= 0 + 15):
				strDirectionAdvice = "Head East.";
			break;
			case (arg_fltDegrees > 0 + 15 && arg_fltDegrees < 90 - 15):
				strDirectionAdvice = "Head North East.";
			break;
			case (arg_fltDegrees >= 90 - 15 && arg_fltDegrees <= 90 + 15):
				strDirectionAdvice = "Head North.";
			break;
			case (arg_fltDegrees > 90 + 15 && arg_fltDegrees < 180 - 15):
				strDirectionAdvice = "Head North West.";
			break;
			case (arg_fltDegrees >= 180 - 15 && arg_fltDegrees <= 180 + 15):
				strDirectionAdvice = "Head West.";
			break;
			case (arg_fltDegrees > 180 + 15 && arg_fltDegrees < 270 - 15):
				strDirectionAdvice = "Head South West.";
			break;
			case (arg_fltDegrees >= 270 - 15 && arg_fltDegrees <= 270 + 15):
				strDirectionAdvice = "Head South.";
			break;
			case (arg_fltDegrees > 270 + 15 && arg_fltDegrees <= 360 - 15):
				strDirectionAdvice = "Head South East.";
			break;
			default:
				strDirectionAdvice = "Land Ho!";
			break;
			
		}//END OF switch(fltDegrees)
		
		return strDirectionAdvice;
	}
	
	
	/*
	Purpose: Take two received lattitude - longitude pairs (current and destination locations) and give some advice on which direction to go using some chained if-then conditions.
	Parameters: two lat-long pairs (four floats)
	Return: (String) advice on direction to travel to approach the destination.
	*/
	function getDirectionAdviceIf(arg_fltCurrentLatitude, arg_fltCurrentLongitude, arg_fltDestinationLatitude, arg_fltDestinationLongitude){
		
		var strDirectionAdvice = "";

		if(arg_fltCurrentLatitude <= arg_fltDestinationLatitude && arg_fltCurrentLongitude <= arg_fltDestinationLongitude){
			strDirectionAdvice = "Head North East";
		}else if(arg_fltCurrentLatitude <= arg_fltDestinationLatitude && arg_fltCurrentLongitude >= arg_fltDestinationLongitude){
			strDirectionAdvice = "Head North West";
		}else if(arg_fltCurrentLatitude >= arg_fltDestinationLatitude && arg_fltCurrentLongitude >= arg_fltDestinationLongitude){
			strDirectionAdvice = "Head South West";
		}else if(arg_fltCurrentLatitude >= arg_fltDestinationLatitude && arg_fltCurrentLongitude <= arg_fltDestinationLongitude){
			strDirectionAdvice = "Head South East";
		}else{
			strDirectionAdvice = "Land Ho!";
		}
		
		return strDirectionAdvice;
	}
	
	/*
	Purpose: Same as above, but using some switch-case conditions.
	Parameters: two lat-long pairs (four floats)
	Return: (String) advice on direction to travel to approach the destination.
	*/
	function getDirectionAdviceSwitch(arg_fltCurrentLatitude, arg_fltCurrentLongitude, arg_fltDestinationLatitude, arg_fltDestinationLongitude){
	
		var strDirectionAdvice = "";
		
		switch(true){
			case (arg_fltCurrentLatitude <= arg_fltDestinationLatitude && arg_fltCurrentLongitude <= arg_fltDestinationLongitude):
				strDirectionAdvice = "Head North East";
			break;
			case (arg_fltCurrentLatitude <= arg_fltDestinationLatitude && arg_fltCurrentLongitude >= arg_fltDestinationLongitude):
				strDirectionAdvice = "Head North West";
			break;
			case (arg_fltCurrentLatitude >= arg_fltDestinationLatitude && arg_fltCurrentLongitude >= arg_fltDestinationLongitude):
				strDirectionAdvice = "Head South West";
			break;
			case (arg_fltCurrentLatitude >= arg_fltDestinationLatitude && arg_fltCurrentLongitude <= arg_fltDestinationLongitude):
				strDirectionAdvice = "Head South East";
			break;
			default:
				strDirectionAdvice = "Land Ho!";
			break;
		}
		
		return strDirectionAdvice;
		
	}
	
	
	
	
	
	
	
	/*
	Purpose: try to get a float from a text box, prompt if something goes wrong and return NaN so that the caller may also adjust for failure.
	Parameters: (JQuery link) element to read, (String) display name of field for showing in case of error
	Return: (float) at successful extraction, NaN otherwise
	*/
	function attemptGetFloat(arg_qryRefRead, arg_strFieldName){
		
		//expect a reference to a textbox.  Extract text from its "value" property.
		var strRaw = arg_qryRefRead.prop("value");
		if(strRaw === null || strRaw.trim() === ""){
			//fail, return NaN to show this.  Skips the rest of this method too.
			alert("ERROR: could not read " + arg_strFieldName + " : blank"); 
			return NaN;
		}
		
		var fltResult = parseFloat(strRaw);
		
		if(isNaN(fltResult)){
			alert("ERROR: could not read " + arg_strFieldName + " : check for non-numeric characters");
			return NaN;
		}
		
		//havn't returned by now due to error?  Success.  Return what is here.
		return fltResult;
		
	}
	
	
	/*
	Purpose: "Enter By Prompt" button clicked.  Prompt the user for the four values (two lat - long pairs) instead of taking what is in the input boxes.
	Parameters: none
	Return: none
	*/
	$("#btnEnterByPrompt").click(function(){
		
		$("#txtCoordsFromLat").prop("value", "");
		$("#txtCoordsFromLon").prop("value", "");
		$("#txtCoordsToLat").prop("value", "");
		$("#txtCoordsToLon").prop("value", "");
			
		
		
		var bolSuccess = false;
		
		var fltCurrentLatitude;
		var fltCurrentLongitude;
		var fltDestinationLatitude;
		var fltDestinationLongitude;
		
		
		while(true){
			
			//on failure, break, leaving "bolSuccess" as false.
			//Note that "NaN" is returned when the user cancels the prompt.
			//Assume the user wants to skip the other unfinished prompts too; just give up.
			fltCurrentLatitude = safeGetFloatFromPrompt("Current location\'s lattitude:");
			if(isNaN(fltCurrentLatitude)){
				break;
			}
			fltCurrentLongitude = safeGetFloatFromPrompt("Current location\'s longitude:");
			if(isNaN(fltCurrentLongitude)){
				break;
			}
			fltDestinationLatitude = safeGetFloatFromPrompt("Destination\'s lattitude:");
			if(isNaN(fltDestinationLatitude)){
				break;
			}
			fltDestinationLongitude = safeGetFloatFromPrompt("Destination\'s longitude:");
			if(isNaN(fltDestinationLongitude)){
				break;
			}
			
			//made it here without breaking?  Successful.
			bolSuccess = true;
			break;
		}//END OF while(true)
		
		
		if(bolSuccess){
			
			//fill in inputs anyways to show what was entered by prompts to get the results seen.
			$("#txtCoordsFromLat").prop("value", fltCurrentLatitude);
			$("#txtCoordsFromLon").prop("value", fltCurrentLongitude);
			$("#txtCoordsToLat").prop("value", fltDestinationLatitude);
			$("#txtCoordsToLon").prop("value", fltDestinationLongitude);
			
			processCoords(fltCurrentLatitude, fltCurrentLongitude, fltDestinationLatitude, fltDestinationLongitude);	
		}else{
			//only way to have reached here and not succeeded: cancled.  Mention that.
			$("#aIfResultsText").text("Prompts cancled.  Try again.");
			$("#aSwitchResultsText").text("Prompts cancled.  Try again.");
		}
		
		
		
	});//END OF btnEnterByPrompt's click method
	
	
	
	/*
	Purpose: take the four successfully entered floats (two lat / long pairs) and try to get some direction between them 
	Parameters: none
	Return: none
	*/
	function processCoords(arg_fltCurrentLatitude, arg_fltCurrentLongitude, arg_fltDestinationLatitude, arg_fltDestinationLongitude){
		
		//if checked, use the trigonometry version.
		var useTrig = $("#chkUseTrigonometry").prop("checked");
		
		var ifOutput = "";
		var switchOutput = "";
		//alert("USE TRIG? " + useTrig);
		
		if(useTrig){	
			//get the degrees between two "points" made up of the long-lat pairs (x, y).
			var fltDegrees = getDegreesAcrossCoords(arg_fltCurrentLongitude, arg_fltCurrentLatitude, arg_fltDestinationLongitude, arg_fltDestinationLatitude);
			//send to the two methods that use chained if-else & switch-cases respectively to give advise for what direction to go in.
			ifOutput = getDirectionAdviceIfTrig(fltDegrees);
			switchOutput = getDirectionAdviceSwitchTrig(fltDegrees);
		}else{
			ifOutput = getDirectionAdviceIf(arg_fltCurrentLatitude, arg_fltCurrentLongitude, arg_fltDestinationLatitude, arg_fltDestinationLongitude);
			switchOutput = getDirectionAdviceSwitch(arg_fltCurrentLatitude, arg_fltCurrentLongitude, arg_fltDestinationLatitude, arg_fltDestinationLongitude);
		}
		
		$("#aIfResultsText").text(ifOutput);
		$("#aSwitchResultsText").text(switchOutput);
		
	}//END OF processCoords
	
	
	
	
	
	/*
	Purpose: try to get a float from the user.
	Parameters: (string) text to prompt the user (request).
	Return: the number that passes a few checks, or "null" if the user cancels.
	*/
	function safeGetFloatFromPrompt(arg_strPrompt){

		var strRaw = "";
		var fltResult = 0;
		
		//This loop will be repeated on noticing a problem with the input (except for getting canceled)
		while(true){
	
			strRaw = prompt(arg_strPrompt, "0");
			
			if(strRaw === null){
				//User decided to stop, let the caller handle this.
				return NaN;	
			}
			
			fltResult = parseFloat(strRaw);
			
			//A less specific error.
			if(isNaN(fltResult)){
				alert("Not sure that\'s a number, lad.  Got some funny characters muckin\' about.");
				continue;
			}
			
			//made it here? Done, return
			break;
			
		}//END OF while(true)
		
		return fltResult;
	}//END OF safeGetFloatFromPrompt(...)
	
	
	
	
	
	
	
	

});//end of document.ready

	