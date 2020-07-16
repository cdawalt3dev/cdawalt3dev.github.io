
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: September 13 2016
 PURPOSE: see functions.html
 MODIFICATION HISTORY:
 Original Build.
 */
 


$(document).ready(function(){
	"use strict";
	
	//global variables
	/////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	var pirCaptain;
	var pirPlayer;  //the player (web page user) also plays the game by picking their own guess.
	
	//size of AI pirates.  To be larger, requires more text elements.  Adjusting the captain's end lines may be necessary.
	var intMateQuantity = 3;
	
	//array of AI pirates.
	var ary_pirMate;
	
	//which "frame" is the window on in terms of dialogue / action?
	var intEventIndex;
	
	//who won?
	var ary_winnerList;
	
	//text to show the player at the end, regarding how much grog they won (fractions if multiple "mates" guess correctly)
	var strEndText = "";
	
	//array of text elements.  Here for quick and easy access of the five text elements, corresponding to each of the five pirates.
	var ary_qryText = [$("#aText1"), $("#aText2"), $("#aText3"), $("#aText4"), $("#aText5") ];
	
	
	
	/////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	
	
	/*
	NAME: window.load (essentialy).
	PURPOSE: allow for creation of a "Pirate" object via constructor notation.
	PARAMETRS: none.
	RETURN VALUE: none.
	*/
	function Pirate(arg_strRank, arg_intFavNumb, arg_qryRefOut){
		this.strRank = arg_strRank;
		this.qryRefOut = arg_qryRefOut;
		
		this.intRecentGuess = -2; //not yet randomized.  -1 means force a randomization.
		
		/*
		Purpose: create a random number between 1 and 10.
		Parameters: none
		Return: the random number (it is also stored to instance var "intRecentGuess")
		*/
		this.generateRandom = function(){
			//return Math.ceil(Math.random()*10) ;
			this.intRecentGuess =  Math.ceil(Math.random()*10) ;
			
			return this.intRecentGuess;  //just return this out of convenience, even if it isn't used.
			//Question: is this equivalent to
			//Math.floor( (Math.random()*9) + 1  ) ;     ?
		};//END OF generateRandom()
		
		/*
		Purpose: print the given text to my designated output element.
		Parameters: (string) some text
		Return: none
		*/
		this.speakToOutput = function(arg_strText){
			this.qryRefOut.text(this.strRank + ": " + arg_strText);
		};
		
		//NOTE: this var is assigned here so that, in the case of -1, it can be randomized by an instance method.
		//Instance methods may not be called until they've been seen by the script.
		if(arg_intFavNumb !== -1){
			this.intFavNumb = arg_intFavNumb;
		}else{
			this.intFavNumb = this.generateRandom();	
		}
		
		
	}//END OF Pirate constructor
	
	
	
	
	/*
	Purpose: called at window startup.  Can start with a prompt or initialize features that need it by script.
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		
		
		/*
		//early random test.
		var thetext = "";
		for(var i = 0; i < 100; i++){
			thetext += " " + Math.ceil(Math.random()*10);
		}
		$("#aText2").text(thetext);
		*/
		
		
		//the argument sent, "true", fills parameter "firstTime".  This is the first time running the game, as opposed to a possible restart later.
		startGame(true);
		
	});//end of window.load
	
	
	/*
	Purpose: initializes everything needed to start the guessing game, or restart it if this is not the first time (skip a few intro frames)
	Parameters: none
	Return: none
	*/
	function startGame(arg_bolFirstTime){
		
		$("#btnProceed").text("Proceed");
		if(arg_bolFirstTime === true){
			intEventIndex = 0;
		}else{
			intEventIndex = 5;
			//this will be increased by 1 when "proceed" is triggered.
			//6 means, just ask for the number b/w 1 and 10.	
		}
		
		disableGuessing();
		clearText();
		
		
		pirCaptain = new Pirate("Captain", -1, ary_qryText[0]);
		pirPlayer = new Pirate("Stranger", -1, ary_qryText[intMateQuantity+1] ) ;
		
		var ary_strMateRanks = ["Scrubber", "Spotter", "Scrounger"];
		
		ary_pirMate = new Array(intMateQuantity);
		for(var i = 0; i < ary_pirMate.length; i++){
			
			ary_pirMate[i] = new Pirate( ary_strMateRanks[i], -2, ary_qryText[i+1] );
		}
		
		//start off a chat.
		$("#btnProceed").click();
		
		
	}//END OF startGame()
	
	/*
	Purpose: disable guessing buttons, enable the "proceed" button.  Done at start or after the user has submitted already submitted guess.
	Parameters: none
	Return: none
	*/
	function disableGuessing(){
		for(var i = 1; i <= 10; i++){
			var qryRefBtn = $("#btnGuess" + i);
			qryRefBtn.prop("disabled", true);
		}
		$("#btnProceed").prop("disabled", false);
		
		//disable text submission too.
		$("#txtGuess").prop("disabled", true);
		$("#btnSubmitGuess").prop("disabled", true);
		
	}//END OF disableGuessing()
	
	/*
	Purpose: enable guessing buttons, disable "proceed".   Called when the user is asked to guess.
	Parameters: none
	Return: none
	*/
	function enableGuessing(){
		for(var i = 1; i <= 10; i++){
			var qryRefBtn = $("#btnGuess" + i);
			qryRefBtn.prop("disabled", false);
		}
		$("#btnProceed").prop("disabled", true);
		
		//disable text submission too.
		$("#txtGuess").prop("disabled", false);
		$("#btnSubmitGuess").prop("disabled", false);
		
	}//END OF disableGuessing()
	
	/*
	Purpose: sutmit the received number as the player's guess.  Stores it to the player's "intRecentGuess" var to be retrieved later.
	Parameters: (int) player's guess
	Return: none
	*/
	function submitGuess(arg_intPlayerGuess){
		
		//set the player's guess.
		pirPlayer.intRecentGuess = arg_intPlayerGuess;
		
		$("#btnProceed").click();
	}// END OF submitGuess(...)
	
	/*
	Purpose: btnProceed click event, can be called manually to move the event along (such as at the start of the game or picking a guess).  Sets the chat messages according to this point of the script (intEventIndex).
	Parameters: none
	Return: none
	*/
	$("#btnProceed").click(function(){
		
		var i;
		var intWinnerLength = 0;
		
		intEventIndex++;
		
		switch(intEventIndex){
		case 1:
			pirCaptain.speakToOutput("Gather \'round, it be time fer another guessin\' game!");
		break;	
		case 2:
			ary_pirMate[0].speakToOutput("an\' what does it matter ta us");
		break;	
		case 3:
			pirCaptain.speakToOutput("First off, I'm the cap\'n.  Second, the winner gets a nice bottle o\' grog!");
			ary_pirMate[0].speakToOutput("");
		break;
		case 4:
			ary_pirMate[0].speakToOutput("");
			ary_pirMate[1].speakToOutput("");
			ary_pirMate[2].speakToOutput("");
			pirPlayer.speakToOutput("");
		break;
		case 5:
			pirCaptain.speakToOutput("Har!  I knew that\'d get yer attention!");
		
		break;
		case 6:
			pirCaptain.speakToOutput("Alrighty.  Guess a number between 1 n\' 10...");
			
			//all the AI pirates make a guess and submit it by text.
			for(i = 0; i < ary_pirMate.length; i++){
				var rand = ary_pirMate[i].generateRandom();
				ary_pirMate[i].speakToOutput( rand + "." );
			}
			
			pirPlayer.speakToOutput(""); //in case this is a reset, show a blank for the player's guess
			
			$("#aBottomMessage").text("Go on, pick a number.");
			enableGuessing();
		break;
		case 7: //player picked a guess.
			disableGuessing();
			pirCaptain.speakToOutput("Ev\'ryone answered?");
			$("#aBottomMessage").text("");
			
			//!!!other possible place for NPC guessing, with the player instead of before
			
			pirPlayer.speakToOutput(pirPlayer.intRecentGuess + ".");
			
		
		break;
		case 8:
			
			//new blank array of winners.
			ary_winnerList = [];
			
			for(i = 0; i < (ary_pirMate.length); i++){	
				//check each of the AI pirates for the correct guess.
				if(ary_pirMate[i].intRecentGuess === pirCaptain.intFavNumb){
					//If so, they are added to the "winner" list.
					ary_winnerList.push(ary_pirMate[i]);
				}
			}
			
			//The player's guess is also checked.
			if(pirPlayer.intRecentGuess === pirCaptain.intFavNumb){
				ary_winnerList.push(pirPlayer);
				
				intWinnerLength = ary_winnerList.length;
				if(intWinnerLength === 1){
					//If the player is the only winner (1 winner, and the player won), the bottom prompt text indicates the player won the whole bottle.
					strEndText = "Won a whole bottle o\' grog!";	
				}else{
					//otherwise, if there are multiple winners, it is a fraction, as it is shared with the other winners.
					strEndText = "Won 1" + "/" + intWinnerLength + " of a bottle o\' grog.";	
				}
				
				
			}else{
				//player wasn't among the winning group or no one won.  No reward.
				strEndText = "No grog.  Better luck next time.";
			}
				
			
			pirCaptain.speakToOutput("\'an the number be... " + pirCaptain.intFavNumb + ".");
			
		break;
		case 9:
			
			intWinnerLength = ary_winnerList.length;
			
			
			//EVALUATE - the captain comments on how many won and lists who won.
			if(intWinnerLength === 0){
				pirCaptain.speakToOutput("\'Yar har har!  None of ye got it right.  This one\'s mine.");
			}else if(intWinnerLength === 1){
				pirCaptain.speakToOutput("Well done, " + ary_winnerList[0].strRank + ".  The bottle\'s all yours.");
				
			}else if(intWinnerLength === 2){
				pirCaptain.speakToOutput("Two of ye got it right?  I guess you\'ll just have te split this\'n, " + ary_winnerList[0].strRank + " and " + ary_winnerList[1].strRank + ".");
				
			}else if(intWinnerLength === 3){
				pirCaptain.speakToOutput("The three of ye guessed it right?  Well, ye certainly put all yer eggs in one basket... Three way for " + ary_winnerList[0].strRank + ", " + ary_winnerList[1].strRank + ", n\' " + ary_winnerList[2].strRank + ".");
				
			}else{
				//all
				pirCaptain.speakToOutput("Alas! All of ye guessed the right number?  Aye, if\'n I didn\'t know any better, I\'d suspsect one of ye with loose lips of readin\' minds... But that be crazy talk.  Four way for all o\' ye.");
			}
			
			$("#aBottomMessage").text(strEndText);
			
			$("#btnProceed").text("Reset");
		
		break;
		case 10://restart the game at index 6 (sending "false" for the "firstTime" arg does this).
			
			startGame(false);
		
		break;
		}//END OF switch
		
	}); //END OF btnProceed click
	
	
	
	/*
	Purpose: clear the chat text for restarting the game.
	Parameters: none
	Return: none
	*/
	function clearText(){
		$("#aBottomMessage").text("");
		for(var i = 0; i < ary_qryText.length;i++){
			ary_qryText[i].text("");  //clear each output place.
		}
		//the text in a textbox is stored in the "value" property.
		$("#txtGuess").prop("value", "");
		
		
	}
	
	/*
	Purpose: the following 10 methods correspond to the guesses.  Each sends what it has printed (named as such) as a guess.
	Parameters: none
	Return: none
	*/
	$("#btnGuess1").click(function(){
		submitGuess(1);	
	});
	$("#btnGuess2").click(function(){
		submitGuess(2);	
	});
	$("#btnGuess3").click(function(){
		submitGuess(3);	
	});
	$("#btnGuess4").click(function(){
		submitGuess(4);	
	});
	$("#btnGuess5").click(function(){
		submitGuess(5);	
	});
	$("#btnGuess6").click(function(){
		submitGuess(6);	
	});
	$("#btnGuess7").click(function(){
		submitGuess(7);
	});
	$("#btnGuess8").click(function(){
		submitGuess(8);	
	});
	$("#btnGuess9").click(function(){
		submitGuess(9);	
	});
	$("#btnGuess10").click(function(){
		submitGuess(10);	
	});
	
	
	
	/*
	Purpose: click method for the guess text box, an alternate way of submitting a guess.
	Parameters: none
	Return: none
	*/
	$("#btnSubmitGuess").click(function(){
		
		var intGuess = attemptGetCountable( $("#txtGuess").prop("value") );
		
		if(intGuess !== null){
			submitGuess(intGuess);	
		}
		
		$("#txtGuess").prop("value", "");
	});
	
	
	
	/*
	Purpose: Given a string (from the textbox), turn it into an integer.  Return "null" if this fails and tell why in the bottom message box.
	Parameters: (string) text to process
	Return: (int) result of parse, but NULL on failure
	*/
	function attemptGetCountable(arg_strRaw){

		var intParsed = 0;
		
		
		if(arg_strRaw === null || arg_strRaw.trim() === ""){
			$("#aBottomMessage").text("Speak up, lad, I can\'t hear ye. (nothing entered)");
			return null;	
		}
		
		if(arg_strRaw.indexOf(".") !== -1){
			$("#aBottomMessage").text("Don\'t go overcomplicatin\' a lil\' guessin\' game. (no decimals allowed)");
			return null;	
		}
		
		//Try parsing the string as an integer, now that some preliminary things have been checked for.
		intParsed = parseInt(arg_strRaw);
		
		//A less specific error.
		if(isNaN(intParsed)){
			$("#aBottomMessage").text("Are ye sure that\'s a number? (only numeric characters allowed)");
			return null;	
		}
		
		
		
		//lastly, range check: b/w 1 and 10 inclusive.
		
		
		if(intParsed < 1){
			$("#aBottomMessage").text("Shootin\' a little low, don\'t ye think?  (range is 1 - 10)");
			return null;
		}
		if(intParsed > 10){
			$("#aBottomMessage").text("Shootin\' a little high, don\'t ye think?  (range is 1 - 10)");
			return null;
		}
		
		
		//no errors? haven't returned "null" earlier?  Something went right.
		return intParsed;
	}//END OF attemptGetCountable(...)
	
	
	
	
});//end of document.ready

	