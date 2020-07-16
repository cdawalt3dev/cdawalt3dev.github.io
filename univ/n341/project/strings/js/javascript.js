
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: Day Month Year
 PURPOSE: see strings.html.
 MODIFICATION HISTORY:
 Original Build.
 */
 


$(document).ready(function(){
	"use strict";
	
	//store the deviations of the base string.  size is 13 so that indexes 0 - 12 are available.
	var ary_strDeviation = new Array(13);
	
	var ary_qryOutput = [
	$("#aOutput0"),
	$("#aOutput1"),
	$("#aOutput2"),
	$("#aOutput3"),
	$("#aOutput4"),
	$("#aOutput5"),
	$("#aOutput6"),
	$("#aOutput7"),
	$("#aOutput8"),
	$("#aOutput9"),
	$("#aOutput10"),
	$("#aOutput11"),
	$("#aOutput12")
	];
	
	
	
	
	
	
	
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//1. Normal Methods ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
	
	
	
	/*
	Purpose: called at window startup.  Can start with a prompt or initialize features that need it by script.
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		
		program();
		
	});//end of window.load
	
	/*
	Purpose: get the base ship name, make 12 deviations of it using various string rules, and output to the screen.
	Parameters: none
	Return: none
	*/
	function program(){
		
		var strBaseShipName = getStringSafe("Enter a base name:", "the Wild Circus Of PILFERING");
		var i = 0;
		
		
		clearOutput();
		
		
		if(strBaseShipName === null){
			//do nothing, leave the outputs empty if the user declined.	
		}else{
			
			//split the string into an array of words once here and just send that.  More efficient.
			var ary_strBaseShipNameWords = strBaseShipName.split(" ");
			
			//deviations that can be done in one line are done right here.
			//Otherwise, they are delegated to other methods.
			ary_strDeviation[0] = strBaseShipName;
			ary_strDeviation[1] = strBaseShipName.toLowerCase();
			ary_strDeviation[2] = strBaseShipName.toUpperCase();
			ary_strDeviation[3] = getAlternateLetterCase(strBaseShipName, ary_strBaseShipNameWords);
			ary_strDeviation[4] = getCapitalizedWords(strBaseShipName, ary_strBaseShipNameWords);
			
			ary_strDeviation[5] = get1337(strBaseShipName, ary_strBaseShipNameWords);
			
			ary_strDeviation[6] = getScrambledLetters(strBaseShipName, ary_strBaseShipNameWords);
			
			ary_strDeviation[7] = getScrambledWords(strBaseShipName, ary_strBaseShipNameWords);
			
			ary_strDeviation[8] = getScrambledBoth(strBaseShipName, ary_strBaseShipNameWords);
			
			ary_strDeviation[9] = shiftASCII(strBaseShipName, ary_strBaseShipNameWords);
			
			ary_strDeviation[10] = removeSpaces(strBaseShipName, ary_strBaseShipNameWords);
			
			ary_strDeviation[11] = pirateApostrophe(strBaseShipName, ary_strBaseShipNameWords);
			ary_strDeviation[12] = pirateApostrophePlus(strBaseShipName, ary_strBaseShipNameWords);
			
			//Take each of the deviations and put them in the appropriate output (they are coordinated so that the output elements hold deviations of the same index between the arrays)
			for(i = 0; i < 13; i++){
				ary_qryOutput[i].text(ary_strDeviation[i]);
			}
			
		}//END OF if(baseShipName === null)'s ELSE statement
		
	}//END OF runProgram()
	
	
	/*
	Purpose: method for getting the base ship name from the user.  Warn on a single-word name (not utilizing all the deviations, some go between words).
	Parameters: (string) text in the prompt suggesting what the user should enter, (string) a reasonable default
	Return: (string) if not cancelled, null otherwise.
	*/
	function getStringSafe(arg_strPrompt, arg_strDefault){
		
		var strRaw = "";
		var strTrimmed = "";
		var bolContinue = true;
		
		
		//break out of the loop by returning a string or "null".
		while(true){
			
			bolContinue = true;  //assume what is received is good to go at the end until proven otherwise.
			
			strRaw = prompt(arg_strPrompt, arg_strDefault);
			
			if(strRaw === null){
				//user canceled, give up.
				return null;	
			}
			
			strTrimmed = strRaw.trim();
			if(strRaw.trim() === ""){
				alert("Empty, at least one non-space character required.");
			}
			
			//single-word-warning?  No spaces after trimming means there is one word.
			if(strRaw.indexOf(" ") === -1){
				bolContinue = confirm("Multiple words advised to get the full effect. Proceed anyways?");
				//This is a chance to interrupt by "blnContinue".  If the user does not want to go on with a single word after the warning (false), prompt will restart.
			}else{
				//Remove any consecutive spaces from the base string.
				strTrimmed = removeConsecutiveSpaces(strTrimmed);	
				
			}
			//alert(strTrimmed);   //just a test.
			if(bolContinue){
				return strTrimmed;
			}
			
			
		}//END OF while(true)
		
	}//END OF getStringSafe()
	
	
	
	
	
	
	
	
	
		
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//2. Deviation Methods /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
	
	
	/*
	Purpose: starting lowercased, alternate the case of each letter, excluding spaces.  Non-alphabetic characters are not excluded, but are unaffected.
	Parameters: (string) base string, (array-string) base string's words split by space
	Return: (string), see purpose
	*/
	function getAlternateLetterCase(arg_strBase, arg_ary_strBaseWords){
		var i = 0;
		var i2 = 0;
		var strResult = "";
		
		//var ary_strWord = new String(arg_ary_strBaseWords.length);
		
		var bolQueueCase = false;
		
		for(i = 0; i < arg_ary_strBaseWords.length; i++){
			
			var ary_chrWord = new Array(arg_ary_strBaseWords[i].length);
			
			for(i2 = 0; i2 < ary_chrWord.length; i2++){	
				
				//alternate case of each char from the source word:
				if(bolQueueCase){
					ary_chrWord[i2] = arg_ary_strBaseWords[i].charAt(i2).toUpperCase();
				}else{
					ary_chrWord[i2] = arg_ary_strBaseWords[i].charAt(i2).toLowerCase();
				}
				
				bolQueueCase = !bolQueueCase;
				//this toggles the boolean, false -> true & true -> false.
				
			}//END OF for(i2 = 0...)
			if(i > 0){
				//space before all new words except the first.
				strResult += " ";
			}
			strResult += concatenateLetterArray(ary_chrWord);
			
		}//END OF for(i = 0...)
		
		return strResult;
		
		
	}//END OF getAlternateLetterCase(...)
	
	
	
	
	
	/*
	Purpose: capitalize (uppercase the first letter of) each word in the string.
	Parameters: (string) base string, (array-string) base string's words split by space
	Return: (string), see purpose
	*/
	function getCapitalizedWords(arg_strBase, arg_ary_strBaseWords){
		var i = 0;
		var i2 = 0;
		var strResult = "";
		
		for(i = 0; i < arg_ary_strBaseWords.length; i++){
			
			var ary_chrWord = new Array(arg_ary_strBaseWords[i].length);
			
			for(i2 = 0; i2 < ary_chrWord.length; i2++){	
				
				if(i2 === 0){
					//if this is the first letter, capitalize.
					ary_chrWord[i2] = arg_ary_strBaseWords[i].charAt(i2).toUpperCase();
				}else{
					//otherwise, force lowercase.
					ary_chrWord[i2] = arg_ary_strBaseWords[i].charAt(i2).toLowerCase();
				}
			}//END OF for(i2 = 0...)
			if(i > 0){
				//space before all new words except the first.
				strResult += " ";
			}
			strResult += concatenateLetterArray(ary_chrWord);
			
		}//END OF for(i = 0...)
		
		return strResult;
		
		
	}//END OF getAlternateLetterCase(...)
	
	
	/*
	Purpose: replace several characters with look-alike numbers or some look-alike symbols.
	Parameters: (string) base string, (array-string) base string's words split by space
	Return: (string), see purpose
	*/
	function get1337(arg_strBase, arg_ary_strBaseWords){

		//copies the string, starting in lowercase.
		var strResult = arg_strBase.toLowerCase();
		
		//replace a bunch.
		strResult = replaceAllInString(strResult, "o", "0");
		strResult = replaceAllInString(strResult, "g", "9");
		strResult = replaceAllInString(strResult, "d", "o|");
		strResult = replaceAllInString(strResult, "c", "(");
		strResult = replaceAllInString(strResult, "w", "\\/\\/");
		strResult = replaceAllInString(strResult, "v", "\\/");
		strResult = replaceAllInString(strResult, "t", "+");
		strResult = replaceAllInString(strResult, "s", "5");
		strResult = replaceAllInString(strResult, "m", "/|/|");
		strResult = replaceAllInString(strResult, "n", "/|/");
		strResult = replaceAllInString(strResult, "t", "7");
		strResult = replaceAllInString(strResult, "h", "|-|");
		strResult = replaceAllInString(strResult, "b", "8");
		strResult = replaceAllInString(strResult, "a", "4");
		strResult = replaceAllInString(strResult, "l", "1");
		strResult = replaceAllInString(strResult, "e", "3");
		strResult = replaceAllInString(strResult, "u", "|_|");
		strResult = replaceAllInString(strResult, "p", "/°");
		strResult = replaceAllInString(strResult, "k", "|<");
		
		return strResult;
		
	}//END OF getAlternateLetterCase(...)
	
	
	
	/*
	Purpose: return a version of the base ship name where all letters among the words are randomized (by position).
	Parameters: (string) base string, (array-string) base string's words split by space
	Return: (string), see purpose
	*/
	function getScrambledLetters(arg_strBase, arg_ary_strBaseWords){
		var i = 0;
		var i2 = 0;
		var strResult = "";
		
		for(i = 0; i < arg_ary_strBaseWords.length; i++){
			
			//array of characters to replace this word with the same chars in possibly different places
			var ary_chrWord = new Array(arg_ary_strBaseWords[i].length);
			
			//Just swap each char with another position randomly, including its own (no effect).
			for(i2 = 0; i2 < ary_chrWord.length; i2++){
				
				ary_chrWord = arg_ary_strBaseWords[i].split("");
				
				var intIndex = randomInRangeWhole(0, arg_ary_strBaseWords[i].length - 1);
				
				//do the swap.  Remember the starting char (at i2)
				var tempChar = ary_chrWord[i2];
				//change the start char to the randomly picked one.
				ary_chrWord[i2] = ary_chrWord[intIndex];
				//and change the randomly picked one to the first (from memory)
				ary_chrWord[intIndex] = tempChar;
				
			}//END OF for(i2 = 0...)
			
			if(i > 0){
				//space before all new words except the first.
				strResult += " ";
			}
			strResult += concatenateLetterArray(ary_chrWord);
			
			
		}//END OF for(i = 0...)
		
		return strResult;
		
	}//END OF getRandomLetters(...)
	
	
	/*
	Purpose: return a version of the base ship name where all words are randomized by position.
	Parameters: (string) base string, (array-string) base string's words split by space
	Return: (string), see purpose
	*/
	function getScrambledWords(arg_strBase, arg_ary_strBaseWords){
		var i = 0;
		var strResult = "";
		
		var ary_strResultWords = cloneStringArray(arg_ary_strBaseWords);
		
		for(i = 0; i < ary_strResultWords.length; i++){
			
			var intIndex = randomInRangeWhole(0, ary_strResultWords.length - 1);
			
			//do the swap.
			var tempWord = ary_strResultWords[i];
			ary_strResultWords[i] = ary_strResultWords[intIndex];
			ary_strResultWords[intIndex] = tempWord;
				
			
		}//END OF for(i = 0...)
		
		strResult = concatenateStringArray(ary_strResultWords);
		
		return strResult;
		
	}//END OF getRandomLetters(...)
	
	
	/*
	Purpose: scramble the word order, then scramble the letter order of those words.
	Parameters: (string) base string, (array-string) base string's words split by space
	Return: (string), see purpose
	*/
	function getScrambledBoth(arg_strBase, arg_ary_strBaseWords){
		var strResult = "";
		
		strResult = getScrambledWords(arg_strBase, arg_ary_strBaseWords);
		
		var ary_strUpdatedBaseWords = strResult.split(" ");
		strResult = getScrambledLetters(strResult, ary_strUpdatedBaseWords);
		
		return strResult;
	}//END OF getScrambledBoth()
	
	
	
	/*
	Purpose: take each character's ASCII value and increment it by one.
	Parameters: (string) base string, (array-string) base string's words split by space
	Return: (string), see purpose
	*/
	function shiftASCII(arg_strBase, arg_ary_strBaseWords){
		var i = 0;
		var strResult = "";
		
		var ary_chrLetter = new Array(arg_strBase.length);
		
		
		for(i = 0; i < arg_strBase.length; i++){
			
			var targetASCIIValue = parseASCII(arg_strBase[i]) + 1;
			
			ary_chrLetter[i] = parseASCIIInt(targetASCIIValue);
			
		}//END OF for(i...)
		
		strResult = concatenateLetterArray(ary_chrLetter);
		return strResult;
	}
	
	/*
	Purpose: delete all spaces in the string.
	Parameters: (string) base string, (array-string) base string's words split by space
	Return: (string), see purpose
	*/
	function removeSpaces(arg_strBase, arg_ary_strBaseWords){
		var strResult = "";
		strResult = replaceAllInString(arg_strBase, " ", "");
		
		return strResult;
	}
	
	
	/*
	Purpose: make the text appear more "pirate"-ey by switching out some common words, often with apostrophes.
	Parameters: (string) base string, (array-string) base string's words split by space
	Return: (string), see purpose
	*/
	function pirateApostrophe(arg_strBase, arg_ary_strBaseWords){
		var strResult = "";
		
		strResult = arg_strBase;
		
		strResult = replaceAllInStringIgnoreCase(strResult, "to", "te" );
		strResult = replaceAllInStringIgnoreCase(strResult, "there", "thar" );
		
		strResult = replaceAllInStringIgnoreCase(strResult, "ed", "\'d" );
		
		strResult = replaceAllInStringIgnoreCase(strResult, "are", "be" );
		strResult = replaceAllInStringIgnoreCase(strResult, "the ", "th\' " );
		strResult = replaceAllInStringIgnoreCase(strResult, " the ", " th\' " );
		strResult = replaceAllInStringIgnoreCase(strResult, "of", "o\'" );
		strResult = replaceAllInStringIgnoreCase(strResult, "ing", "in\'" );
		strResult = replaceAllInStringIgnoreCase(strResult, "you ", "ye " );
		strResult = replaceAllInStringIgnoreCase(strResult, "your ", "yer " );
		strResult = replaceAllInStringIgnoreCase(strResult, "er", "\'r" );
		
		strResult = replaceAllInStringIgnoreCase(strResult, "for", "fer" );
		
		
		return strResult;
		
	}
	
	
	
	/*
	Purpose: same as above, but enhanced by using "replaceAllInStringPreserveCase" instead.  This attempts to preserve the case of affected text.
	Parameters: (string) base string, (array-string) base string's words split by space
	Return: (string), see purpose
	*/
	function pirateApostrophePlus(arg_strBase, arg_ary_strBaseWords){
		var strResult = "";
		
		strResult = arg_strBase;
		
		strResult = replaceAllInStringPreserveCase(strResult, "of", "o\'" );
		strResult = replaceAllInStringPreserveCase(strResult, "there", "thar" );
		
		strResult = replaceAllInStringPreserveCase(strResult, "ed", "\'d" );
		
		strResult = replaceAllInStringPreserveCase(strResult, "are", "be" );
		strResult = replaceAllInStringPreserveCase(strResult, "the ", "th\' " );
		strResult = replaceAllInStringPreserveCase(strResult, " the ", " th\' " );
		strResult = replaceAllInStringPreserveCase(strResult, "of", "o\'" );
		strResult = replaceAllInStringPreserveCase(strResult, "ing", "in\'" );
		strResult = replaceAllInStringPreserveCase(strResult, "you ", "ye " );
		strResult = replaceAllInStringPreserveCase(strResult, "your ", "yer " );
		strResult = replaceAllInStringPreserveCase(strResult, "er", "\'r" );
		
		strResult = replaceAllInStringPreserveCase(strResult, "for", "fer" );
		return strResult;
		
	}
	
	
	
	
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//3. Utility Methods////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
	
	
	
	/*
	Purpose: replace each occurence of a search string in the source string, with the replace string.
	Parameters: (string) source, (string) search, (string) replace
	Return: (string)
	*/
	function replaceAllInString(arg_strSrc, arg_strSearch, arg_strReplace){
		
		return arg_strSrc.replace(new RegExp(arg_strSearch, "g"), arg_strReplace);
	}
	
	
	/*
	Purpose: same as above, but ignores case in the search.
	Parameters: (string) source, (string) search, (string) replace
	Return: (string)
	*/
	function replaceAllInStringIgnoreCase(arg_strSrc, arg_strSearch, arg_strReplace){
		
		return arg_strSrc.replace(new RegExp(arg_strSearch, "ig"), arg_strReplace);
	}
	
	
	
	/*
	Purpose: same as above, but also attempts to preserve the case in the replaced text.
	For instance, with source
	"aaa FiNdMe bbb"
	search
	"findme"
	replace
	"fin'"
	the result is
	"aaa FiN'Me bbb"
	Parameters: (string) source, (string) search, (string) replace
	Return: (string)
	*/
	function replaceAllInStringPreserveCase(arg_strSrc, arg_strSearch, arg_strReplace){
		var i = 0;
		var strResult = "";
		
		
		
		//lowercase input for less picky searching.
		var strSrcSafe = arg_strSrc.toLowerCase();
		var strSearchSafe = arg_strSearch.toLowerCase();
		var strReplaceSafe = arg_strReplace.toLowerCase();
		
		var intPreviousStop = 0;
		var intRecent = strSrcSafe.indexOf(arg_strSearch, 0);
		
		//stop when no "search" strings remain
		while(intRecent !== -1){
			
			//add everything since the recently found search string
			strResult += arg_strSrc.substring(intPreviousStop, intRecent);
			
			//create an array of the replacement's size.  It will be filled with a blend of the original text's characters (case-wize) and the replacement's characters that conflict with those.
			var ary_chrTemp = new Array(strReplaceSafe.length);
			for(i = 0; i < strReplaceSafe.length; i++){
				
				var chrSer;
				var chrRep;
				
				//if the replacement string is longer than the search, bolSkip will be true when it surpasses the search string in length.
				var bolSkip = (i >= strSearchSafe.length);
				
				//If not skipping the check, fetch the characters from search and replace to compare soon.
				if(!bolSkip){
					chrSer = strSearchSafe.charAt(i);
					chrRep = strReplaceSafe.charAt(i);
				}
				
				//alert("COMPARE: " + chrSer + " " + chrRep);
				
				//alert("Skip? " + (!bolSkip && chrSer === chrRep) );
				if(!bolSkip && chrSer === chrRep ){
					//If not skipping and the characters between the lowercased skip & replace match, copy over the source string's character case.
					//Corresponding index in the source string is of the start pos of the recently found match to search + i, the distance from that start.
					ary_chrTemp[i] = arg_strSrc.charAt(intRecent + i);
				}else{
					//Otherwise, stick to the replacment's own case (if applicable), trust it was intentional.
					ary_chrTemp[i] = arg_strReplace.charAt(i);
				}
				//alert("result? " + ary_chrTemp[i]);			
			}//END OF for(...)
			
			//the array of letters is appended to the result.
			var strTemp = concatenateLetterArray(ary_chrTemp);
			strResult += strTemp;
			
			//the previous stop is the end of the recently found term (pos + length)
			intPreviousStop = intRecent + arg_strSearch.length;
			//Try to find another.
			intRecent = strSrcSafe.indexOf(arg_strSearch, intPreviousStop);
			
		}//END OF while(...)
		
		//overhang?  Add what is left over in the text (no further search text found beyond the most recently found one)
		strResult += arg_strSrc.substring(intPreviousStop);
		
		
		return strResult;
		
	}//END OF replaceAllInStringPreserveCapital(...)
	
	
	
	
	/*
	Purpose: remove all consecutive spaces from a string (leave only one space in their place), and remove all tab characters.
	Note that a call to "trim" would be done, but this is already done before the only place this method is called.
	Parameters: (string) base
	Return: (string)
	*/
	function removeConsecutiveSpaces(arg_strBase){
		var strResult = "";
		
		//no tab characters allowed, remove them first.
		var strWorking = replaceAllInString(arg_strBase, "\t", "");
		
		var intPreviousStop = 0;
		var intRecentSpace = strWorking.indexOf(" ", 0);
		
		
		while(intRecentSpace !== -1){
			
			if(intPreviousStop !== 0){
				strResult += " ";
				//a single space between "words" at least.	
			}
			strResult += strWorking.substring(intPreviousStop, intRecentSpace);
			
			var i2 = intRecentSpace;
			//find the next non-space char.  Terminate at that.
			while(strWorking.charAt(i2) === " " ){
				i2++;
			}
			//after terminating, "i2" is now the location of the non-space char rightmost of the space group.  The next text to append to the result starts here, as does the next search for spaces.
			intPreviousStop = i2;
			
			intRecentSpace = strWorking.indexOf(" ", intPreviousStop);
		}
		
		//overhang?  Add what is left over in the text (no further spaces beyond the most recently found one).
		if(intPreviousStop !== 0){
			strResult += " ";
		}
		strResult += strWorking.substring(intPreviousStop);
			
		return strResult;
		
	}//END OF removeConsecutiveSpaces(...)
	
	
	/*
	Purpose: Generate a random decimal number in a range of two numbers, exclusive (but potentially close).
	Parameters: (float) lower bound, (float) upper bound
	Return: (float) random number
	*/
	function randomInRange(arg_int1, arg_int2){
			
		return (Math.random() * (arg_int2 - arg_int1)) + arg_int1  ;
	}
	
	/*
	Purpose: Generate a random whole number in a range of two numbers, inclusive.
	Parameters: (int) lower bound, (int) upper bound
	Return: (int) random number
	*/
	function randomInRangeWhole(arg_int1, arg_int2){
		/*Adds one to the range of Math.random before adding the min bound.
		This is so that the range of Math.random becomes (0, delta + 1),
		making the range of the resulting Math.floor() become [0, delta]
		(inclusive of bounds as whole numbers).  If the min. bound is also a whole
		number, adding to the multiplied Math.random() before or after the
		Math.floor call makes no difference.*/
		
		return Math.floor ((Math.random() * (arg_int2 - arg_int1 + 1)) + arg_int1)  ;
	}
	
	/*
	Purpose: Clone an array of strings (usually words).  Changes to the clone are not reflected in the original.
	Parameters: (array-string) source
	Return: (array-string) clone
	*/
	function cloneStringArray(arg_strAry){
		var i = 0;
		var ary_strResult = new Array(arg_strAry.length);
		
		//For Strings, this is enough to copy (not just refer to, which would cause changes in either to affect both, not desired)
		for(i = 0; i < ary_strResult.length; i++){
			ary_strResult[i] = arg_strAry[i];
		}
		return ary_strResult;
	}
	
	
	/*
	Purpose: merge an array of characters into a string.
	Parameters: (array-char) letters
	Return: (string) combined
	*/
	function concatenateLetterArray(arg_chrAry){
		var i = 0;	
		var strResultWord = "";
		
		for(i  = 0; i < arg_chrAry.length; i++){
			strResultWord += arg_chrAry[i];	
		}
		return strResultWord;
	}
	
	/*
	Purpose: merge an array of strings (words) into a single space-delimited string.
	Parameters: (array-string) words
	Return: (string) combined, space-delimited
	*/
	function concatenateStringArray(arg_strAry){
		var i = 0;
		var strResult = "";
		
		for(i = 0; i < arg_strAry.length; i++){
			
			if(i !== 0){
				//a space goes before each new word, except for the first.
				strResult += " ";	
			}
			
			strResult += arg_strAry[i];
		}//END OF for(...)
		
		return strResult;
	}//END OF concatenateStringArray(...)
	
	
	
	/*
	Purpose: btnEnterByPrompt's click method.  Treat as clearing the output, re-prompting for the base name.
	Parameters: none
	Return: none
	*/
	$("#btnEnterByPrompt").click(function(){
		program();
	});
	
	
	/*
	Purpose: clears all the output fields (blank out the text)
	Parameters: none
	Return: none
	*/
	function clearOutput(){
		var i = 0;
		
		for(i = 0; i < ary_qryOutput.length; i++){
			ary_qryOutput[i].text("");
		}
			
	}//END OF clearOutput()
	
	
	/*
	Purpose: Get the corresponding ASCII value of a character.
	Parameters: (char)	
	Return: (int) ASCII value
	*/
	function parseASCII(chrCharacter){
		return chrCharacter.charCodeAt(0);
	}
	function parseASCIIInt(intASCII){
		return String.fromCharCode(intASCII);
		
	}
	
	
});//end of document.ready

	