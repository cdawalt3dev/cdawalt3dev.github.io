
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 27 Jan 2017
 PURPOSE: see the main html page.
 MODIFICATION HISTORY:
 Original Build.
 */
 
 
 

$(document).ready(function(){
	"use strict";
	
	
	var blnInputMode = false;
	var blnEmptyFlag = false;
	var epicFailureFlag = false;
	
	var aryInput = new Array(2048);
	var aryInput2 = new Array(2048);
	var softMaxInput = 0;
	var softMaxInput2 = 0;
	
 	var tooManyNumbersFlag = false;
	
	
	/*
	Purpose: called at window startup.  Can start with a prompt or initialize features that need it by script.
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		
		clearAll();
		
	});//end of window.load
	
	
	
	function clearAll(){
		
		clearInput();
		clearOutput();
		//...	
		
	}
	function clearInput(){
		$("#txtAreaInput").val("");
		$("#txtAreaInput2").val("");
	}
	function clearOutput(){
		$("#txtAreaOutput").val("");	
	}
	
	
	
	
	
	
 function saveNumber(argNumber, argAryToSendTo){
	 
	switch(argAryToSendTo){
		case 0:
			if(softMaxInput < 2048){
				//save.
				aryInput[softMaxInput] = argNumber;
				softMaxInput++;
			}else{
				clearOutput();
				if(!tooManyNumbersFlag){
					alert("WARNING: too many numbers for X! Some not committed");
					tooManyNumbersFlag = true;
				}
				return;	
			}
		
		break;
		case 1:
			if(softMaxInput2 < 2048){
				//save.
				aryInput2[softMaxInput2] = argNumber;
				softMaxInput2++;
			}else{
				clearOutput();
				if(!tooManyNumbersFlag){
					alert("WARNING: too many numbers for X! Some not committed");
					tooManyNumbersFlag = true;
				}
				return;	
			}
		
		break;
		default:
			//????????
		break;	
	}//END OF switch(...)
	
 }//END OF saveNumber(...)

	
	
	
	$("#btnToggleInput").click(function(){
		
		
	});
	$("#btnHelp").click(function(){
		alert("Not designed... yet?");
		
	});
	
	
	
	$("#btnClearInput").click(function(){
		clearInput();
	});
	$("#btnClearOutput").click(function(){
		clearOutput();
	});
	
	$("#btnSubmit").click(function(){
		
		var i = 0;
		
		//reset.
		softMaxInput = 0;
		softMaxInput2 = 0;
		tooManyNumbersFlag = false;
		epicFailureFlag = false;
		
		if(blnInputMode === false){
			//single text box.  Read as separate numbers separated by spaces or commas.
			attemptReadNumbers( $("#txtAreaInput"), 0 );
			
			if(epicFailureFlag === true){
				//if we encountered any terrible issue, just stop.
				return;	
			}
			
			attemptReadNumbers( $("#txtAreaInput2"), 1 );
			
			if(epicFailureFlag === true){
				//if we encountered any terrible issue, just stop.
				return;	
			}
		}else{
			//One text box per input.  #TODO
			
		}
		
		
		//Trust we can use the two arrays to do the logic.
		//aryInput = x's
		//aryInput2 = y's
		
		
		if(softMaxInput != softMaxInput2){
			clearOutput();
			alert("WARNING: Discrepency between X and Y data sizes.  There must be an equal number of X and Y inputs!");
			return;
		}
		
		//either, really.
		var n = softMaxInput;
		
		var coordinatedMultiSum = 0;  //sum of (x * y)
		var xSum = 0;
		var ySum = 0;
		
		var xCubedSum = 0;
		var xQuarticSum = 0;
		
		var xSquaredSum = 0;  //sum of (x^2)
		var ySquaredSum = 0;
		
		var xSumSquared = 0;
		var ySumSquared = 0;
		
		var coordinatedMultiSumXSquared = 0;
		
		var xMean = 0;
		var yMean = 0;
		var xVariance = 0;
		var yVariance = 0;
		var xStandardDeviation = 0;
		var yStandardDeviation = 0;
		var coVariance = 0;
		var coStandardDeviation = 0;
		
		var correlationCoefficient_r = 0;
		var determinationCoefficient_rSquared = 0;
		
		
		//fill the sum variables.
		for(i = 0; i < n; i++){
			
			var thisXSquared = (Math.pow(aryInput[i], 2) );
			
			xSum += aryInput[i];
			ySum += aryInput2[i];
			coordinatedMultiSum += (aryInput[i] * aryInput2[i]);
			xSquaredSum += (thisXSquared );
			ySquaredSum += (Math.pow(aryInput2[i], 2) );
			
			xCubedSum += (Math.pow(aryInput[i], 3) );
			xQuarticSum += (Math.pow(aryInput[i], 4) );
			
			coordinatedMultiSumXSquared += thisXSquared * aryInput2[i];
			
		}
		
		xSumSquared = Math.pow(xSum, 2);
		ySumSquared = Math.pow(ySum, 2);
		
		var extrasSuccess = false;
		
		try{
		
			xMean = xSum / n;
			yMean = ySum / n; 
			xVariance = ( xSquaredSum + -(xSumSquared)/ n ) / (n - 1);
			yVariance = ( ySquaredSum + -(ySumSquared)/ n ) / (n - 1);
			
			xStandardDeviation = Math.sqrt(xVariance);
			yStandardDeviation = Math.sqrt(yVariance);
			
			coVariance = (coordinatedMultiSum - n * xMean * yMean) / (n - 1);
			coStandardDeviation = Math.sqrt(coVariance);
			
			
			correlationCoefficient_r = coVariance / (xStandardDeviation * yStandardDeviation);
			
			determinationCoefficient_rSquared = Math.pow(correlationCoefficient_r, 2);
			
			//just, if we can.
			extrasSuccess = true;
		}catch( e){
			
		}
		
		
		
		//alert("READOUT " + xSum + " " + ySum + " " + coordinatedMultiSum + " " + xSquaredSum + " " + xSumSquared);
		
		
		var strToOutput = "";
		
		var slopeDenominatorZero = (n * xSquaredSum === xSumSquared);
		var slopeNumeratorZero = (n * coordinatedMultiSum === (xSum * ySum));
		
		/*
		if(slopeDenominatorZero && slopeNumeratorZero){
			
			strToOutput = ("Least regression line: NA; only one point?");
		}else if(slopeDenominatorZero){
			//it means this is a vertical line.  Change the rules!	
			strToOutput = ("Least regression line: x = 0");
			
		}
		*/
		
		var blnCanDoQuad = true;
		
		if(slopeDenominatorZero){
			//it means this is a vertical line.  Change the rules!
			
			if(n === 1 || yVariance === 0 ){
				//the Y's do not varry (identical)?  Do this.
				strToOutput = ("Least Reg. Line: Single Point?");
			}else{
				strToOutput = ("Least Reg. Line: x = " + xMean);
			}
			blnCanDoQuad = false;
		}
		else{
		
			
			//with those vars, get the coefficients:
			//AKA, b1
			var slope = (n * coordinatedMultiSum - (xSum * ySum) ) / (n * xSquaredSum - xSumSquared );
			//AKA, b0
			var intercept =  (ySum - slope * xSum) / n;
			
			
			var slopeDisplay = roundToFourPlaces(slope);
			var interceptDisplay = roundToFourPlaces(intercept);
			
			
			if(slopeNumeratorZero){
				//it means this is a horizontal line.  Change the rules!	
				strToOutput = ("Least reg. line: y = " + interceptDisplay);
				blnCanDoQuad = false;
			
			}else{
				//we got it!
				strToOutput = ("Least reg. line: y = " + interceptDisplay + " + " + slopeDisplay + "x");
			}
			
			
		}
		
		
		if(blnCanDoQuad){
			
			var s11 = xSquaredSum - (xSumSquared/n);
			var s12 = xCubedSum - ( ( xSum * xSquaredSum) / n);
			var s22 = xQuarticSum - ( ( Math.pow(xSquaredSum, 2) ) / n);
			
			var sy1 = coordinatedMultiSum - ( (ySum * xSum) / n);
			var sy2 = coordinatedMultiSumXSquared - ( ( ySum * xSquaredSum) / n );
			
			var bar_x1 = xMean;
			var bar_x2 = xSquaredSum / n;
			
			var bar_y = yMean;
			
			var b2 = (sy1 * s22 - sy2*s12) / (s22*s11 - Math.pow(s12, 2) );
			var b3 = (sy2 * s11 - sy1 * s12) / (s22*s11 - Math.pow(s12, 2) );
			var b1 = bar_y - b2*bar_x1 - b3*bar_x2;
			
			
			
			
			var b1d = roundToFourPlaces(b1);
			var b2d = roundToFourPlaces(b2);
			var b3d = roundToFourPlaces(b3);
			
			
			
			strToOutput += "\nLeast reg. curve: y = " + b1d + " + " + b2d + "x + " + b3d + "x" + String.fromCharCode(178);
			
			/*
			~Results agreed upon by:
			*http://keisan.casio.com/exec/system/14059932254941
			*https://www.desmos.com/calculator
			
			Thank you, kind sir!
			http://math.stackexchange.com/questions/267865/equations-for-quadratic-regression

			*/
			
			
		}else{
			strToOutput += "\nLeast regression curve: NA";
		}
		
		
		
		if(extrasSuccess){
			strToOutput += "\n" + 
			"X_mean: " + roundToFourPlaces(xMean) + "\n" +
			"Y_mean: " + roundToFourPlaces(yMean) + "\n" +
			"X_variance: " + roundToFourPlaces(xVariance) + "\n" + 
			"Y_variance: " + roundToFourPlaces(yVariance) + "\n" + 
			"X_standard dev: " + roundToFourPlaces(xStandardDeviation) + "\n" + 
			"Y_standard dev: " + roundToFourPlaces(yStandardDeviation) + "\n" + 
			"Co-variance: " + roundToFourPlaces(coVariance) + "\n" + 
			"Co-deviation: " + roundToFourPlaces(coStandardDeviation) + "\n" + 
			
			"Correlation Coeff: " + roundToFourPlaces(correlationCoefficient_r) + "\n" + 
			"Determination Coeff: " + roundToFourPlaces(determinationCoefficient_rSquared);
			
			
			
		}else{
			
		}
		
		$("#txtAreaOutput").val(strToOutput);
		
		
		
		/*
		for(i = 0; i < softMaxInput; i++){
			alert(i + " : " + aryInput[i]);
		}
		alert("#2:::");
		for(i = 0; i < softMaxInput2; i++){
			alert(i + " : " + aryInput2[i]);
		}
		*/
		
	});//end of #btnSomeButton.click
	
	
	function attemptReadNumbers(arg_qryRef_src, arg_aryToSendTo){
		
		var strThisNumber;
		var fltResult;
			
			
		var strSrc = arg_qryRef_src.val().trim();
		
		if(strSrc === ""){
			clearOutput();
			alert("Empty input?");
			epicFailureFlag = true;
			return;
		}
		
		var lastPos = 0;
		var blnReadingNumber = false;
		
		var i = 0;
		
		while(i < strSrc.length ){
			
			var thisChar = strSrc.charAt(i);
			
			if( (thisChar >= '0' && thisChar <= '9') || thisChar === '.' || thisChar === '-'  ){
				//this is a number.
				if(blnReadingNumber === false){
					//we are now!
					blnReadingNumber = true;
					lastPos = i;	
				}
					
			}else{
				//not a number.	
				if(blnReadingNumber === true){
					//no longer.
					blnReadingNumber = false;
					//save what we have.
					strThisNumber = strSrc.substring(lastPos, i);
					fltResult = attemptConvertToNumber(strThisNumber, false);
					
					if(fltResult === null){
						//only happens if something bad happened while trying to read the number.  Quit.
						epicFailureFlag = true;
						return;	
					}
					
					
					saveNumber(fltResult, arg_aryToSendTo);
					
					
				}//END OF if(blnReadingNumber)
				
			}
			i++;
			
			
			
			
		}//END OF while(...)
		
		
		//If we were reading a number right when the input textbox ended, wrap that up.
		if(blnReadingNumber === true){
			blnReadingNumber = false;
			//save what we have.
			strThisNumber = strSrc.substr(lastPos, i);
			fltResult = attemptConvertToNumber(strThisNumber, false);
			
			if(fltResult === null){
				//only happens if something bad happened while trying to read the number.  Quit.
				return;	
			}
			
			
			saveNumber(fltResult, arg_aryToSendTo);
					
		}//END OF if(blnReadingNumber)
		
		
		//made it here? great.
		
		
		
		
		
		
		
		
	}//END OF attemptReadNumbers(...)
	
	
	
	function attemptConvertToNumber(arg_strSrc, arg_emptyOk){
		
		
		blnEmptyFlag = false;
		
		var strSrc = arg_strSrc.trim();
		
		if(strSrc === ""){
			
			if(arg_emptyOk){
				//just a notice that nothing was here, and that is ok.
				blnEmptyFlag = true;
				return null;
			}else{
				clearOutput();
				alert("WARNING: error in input: \"" + strSrc + "\". This is empty!");
				return null;
			}
			
		}
		
		var minusSignPlace = strSrc.indexOf('-');
		if(minusSignPlace !== -1 && minusSignPlace !== 0){
			clearOutput();
			alert("WARNING: error in input: \"" + strSrc + "\". One minus sign allowed. Can only be in front.");
			return null;
		}
		
		var decimalPlace = strSrc.indexOf('.');
		if(decimalPlace !== -1 && strSrc.indexOf('.', decimalPlace+1) !== -1){
			clearOutput();
			alert("WARNING: error in input: \"" + strSrc + "\". Only one decimal point allowed.");
			return null;
		}
		
		
		var fltThisNumber = parseFloat(strSrc);
		
		if(isNaN(fltThisNumber) ){
			clearOutput();
			alert("WARNING: error in input: \"" + strSrc + "\". Could not be understood as a quantity.");
			return null;
		}
		
		//all of the above reports ok?  Move on.
		return fltThisNumber;	

	}
	
	
	
	
	function roundToFourPlaces(arg_flt){
		
		return (Math.round(arg_flt * 10000) / 10000);	
	}
	
	
	
	
	

});//end of document.ready

	