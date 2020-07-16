
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 9 September 2016
 PURPOSE: see functions.html for the purpose, this does the work.
 MODIFICATION HISTORY:
 Original Build.
 */
 


$(document).ready(function(){
	"use strict";
	
	
	//GLOBAL VARIABLES:
	////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////
	var bolCheatMode = false;
	var bolCheated = false;
	
	
	var messageLogList = [
	$("#aMessageLog1"),
	$("#aMessageLog2"),
	$("#aMessageLog3"),
	$("#aMessageLog4"),
	$("#aMessageLog5"),
	$("#aMessageLog6"),
	$("#aMessageLog7"),
	$("#aMessageLog8"),
	$("#aMessageLog9"),
	$("#aMessageLog10"),
	$("#aMessageLog11"),
	$("#aMessageLog12")
	];
	var intRecentOutputChoice = 0;
	
	var bolViewingMessageLog = false;
	var bolAlertsEnabled = true;
	//var strMessageLog = "";  canned.
	var shpPlayer;
	var shpEnemy;
	var intOutputLines = 12;  //number of "aMessageLog" elements for storing previously sent quantity-involved strings.
	
	var intActionIndex = 0;
	//-1 = game over (prompt for restart)
	//0 = start ("get ready")
	//1 = player 1's turn
	//2 = player 1 text
	//3 = player 2's turn (AI)
	//4 = player 2 text
	//...and back to 1.
	//loop broken when either ship "sinks"
	//5 = either won
	var intEventIndex = 0;
	//sub-categories for a particular action under a player's turn
	//0 = none
	//1 = fire
	//2 = plunder
	//3 = taunt
	//4 = repair
	//5 = swerve
	//6 = retreating
	
	////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//Purpose: Constructor for the "Ship" object.
	//Parameters: (int) health, (int) cannons, (queryRef) some reference to an HTML element
	//Return: a "Ship".
	function Ship(arg_intHealth, arg_intCannons, arg_qryHealth){
		//max & current health start at the provided value.
		this.intCurHealth =	arg_intHealth;
		this.intMaxHealth =	arg_intHealth;
		this.bolSunk = false;   //true when out of health.
		this.bolSwerve = false;
		//true when the "swerve" option is picked for a turn.  Increases chance to miss enemy attack that turn.
		
		this.intCannons = arg_intCannons;   //factors into how much damage is done in an attack.
		this.intMorale = 100;    //only applies to enemy.  Reduced morale gives a chance to miss.
		this.qryHealth = arg_qryHealth;
		//what element do I print my health to?  "qry" is short for "query", or "query Reference", a reference to an element via JQuery.
		
		
		
		/*
		Purpose: heal the ship by the provided amount (add to curHealth)
		Parameters: (int) amount
		Return: none
		*/
		this.heal = function(arg_intAmount){
			var testHealth = this.intCurHealth + arg_intAmount;
			//if the projected "healed" health is above the max, clip at max.
			if(testHealth <= this.intMaxHealth){
				this.intCurHealth = testHealth;
			}else{
				this.intCurHealth = this.intMaxHealth;	
			}
			this.updateHealthString();
		};
		
		/*
		Purpose: damage this ship by the provided amount (subtract from curHealth)
		Parameters: (int) amount
		Return: none
		*/
		this.takeDamage = function(arg_intamount){
			var testHealth = this.intCurHealth - arg_intamount;
			//if the damage is above 0, nothing special.  Otherwise, force 0 (no negatives) and set "bolSunk".
			if(testHealth > 0){
				this.intCurHealth =	testHealth;
			}else{
				this.intCurHealth = 0;
				this.bolSunk = true;	//out of health?  Sunk.
			}
			this.updateHealthString();
		};
		
		/*
		Purpose: create & return a string containing  "current health / max health".
		Parameters: none
		Return: the string.
		*/
		this.getHealthString = function(){
			return this.intCurHealth + " / " + this.intMaxHealth;
		};
		
		/*
		Purpose: update my designated Query reference (HTML element) to show the health string.
		Parameters: none
		Return: none
		*/
		this.updateHealthString = function(){
			this.qryHealth.text(this.getHealthString()); //update health.	
		};
		
		/*
		Purpose: create a randomly influenced number that factors in the # of cannons.
		Parameters: none
		Return: (int) damage to deal.
		*/
		this.generateCannonAttack = function(){
			//or, round down (15 * cannons * random(0.8 - 1.3))
			return Math.floor(15 * this.intCannons *  ((Math.random() * 0.8) + 0.5) );
		};
		
		
		//INITIALIZING SCRIPT HERE (think constructor).  Done here since doing this above methods is not a good idea, before they've been found.
		this.updateHealthString();  //start by updating health for the 1st time
		
		
	}//END OF object Ship()
	
	
	
	/*
	NAME: window.load (essentialy).
	PURPOSE:
		called at window startup.  Can start with a prompt or initialize features that need it by script.
	PARAMETRS: none.
	RETURN VALUE: none.
	*/
	$(window).load(function(){
		
		//on refresh, force the checkboxes to be safe.
		bolAlertsEnabled = true;
		$("#chkAlertsEnabled").prop("checked", true);
		bolCheatMode = false;
		$("#chkCheatMode").prop("checked", false);
		
		startGame();
		
	});//end of window.load


	/*
	Purpose: have commands that start a game.  Good for calling again to "restart" the game.
	Parameters: none.
	Return: none.
	*/
	function startGame(){
		
		//actions start disabled.  The player gets the first turn after clicking "proceed" or answering to the alert box.
		disableActions();
		
		
		$("btnClear").click();
		bolCheated = false;
		
		
		
		
		//intActionIndex of 0 is the start of the game.
		intActionIndex = 0;
		intEventIndex = 0;
		
		shpPlayer = new Ship(250, 4, $("#aPlayer1health") );
		shpEnemy = new Ship(450, 5, $("#aPlayer2health") );
		
		updateMessage("The seas be rife with action! Brace yerselves!");	
		
		
	}

	/*
	Purpose: Toggle showing the 12 most recent quantity-involving messages or not (back to game).
	Parameters: none.
	Return: none.
	*/
	$("#btnToggleMessageLog").click(function(){
	
		//toggle this boolean.
		bolViewingMessageLog = !bolViewingMessageLog;
		 
		if(bolViewingMessageLog){
			$("#btnToggleMessageLog").text("Return");
			
			//$("#btnProceed").hide();
			//$("#btnProceed").text("Spam");
			//$("#btnProceed").prop("disabled", false);
			
			$("#btnProceed").hide();
			$("#btnClear").show();
			$("#btnSpam").show();
			
			
			$("#divAction").hide();
			$("#divLeft").hide();
			$("#divRight").hide();
			$("#divMessageLog").show();
			
			$("#aBackLink").hide();  //hide the back link so it is not confused with "return".
			$("#aMessage").hide();
			
		}else{
			$("#btnToggleMessageLog").text("See Msg Log");
			
			$("#btnProceed").show();
			$("#btnClear").hide();
			$("#btnSpam").hide();
			/*
			//$("#btnProceed").show();
			if(intActionIndex !== -1){
				$("#btnProceed").text("Proceed");
			}else{
				//if the actionIndex is -1, the game is over.  Prompt for reset.
				$("#btnProceed").text("Reset");	
			}
			*/
			
			$("#divAction").show();
			$("#divLeft").show();
			$("#divRight").show();
			$("#divMessageLog").hide();	
			
			$("#aBackLink").show();  //hide the back link so it is not confused with "return".
			$("#aMessage").show();
			
		}//END OF if(bolViewingMessageLog)'s ELSE statement
	});//END OF btnToggleMessageLog.click
	
	
	/*
	Purpose: keep "bolAlertsEnabled" coordinated with its checkbox.
	Parameters: none.
	Return: none.
	*/
	$("#chkAlertsEnabled").click(function(){
		
		//always keep "bolAlertsEnabled" coordinated with the checkbox (checked or not)
		bolAlertsEnabled = $("#chkAlertsEnabled").prop("checked")  ;
	});
	
	
	/*
	Purpose: keep "bolCheatMode" coordinated with its checkbox.
	Parameters: none.
	Return: none.
	*/
	$("#chkCheatMode").click(function(){
		//always keep "bolAlertsEnabled" coordinated with the checkbox (checked or not)
		bolCheatMode = $("#chkCheatMode").prop("checked")  ;
	});
	
	
	
	
	
	
	
	
	/*
	Purpose: a filter for calling "alert" through.  Only does this if "bolAlertsEnabled" is on.
	Parameters: none.
	Return: none.
	*/
	function alertFiltered(arg_strToSay){
		//only show if alert boxes are enabled.
		if(bolAlertsEnabled){
			window.alert(arg_strToSay);
		}
	}//END OF alertFiltered(...)
	
	/*
	Purpose: update the "aMessage" element with text relevant to this event.
	Parameters: none.
	Return: none.
	*/
	function updateMessage(arg_strToSay){
		if(bolViewingMessageLog === false){
			//only update when not looking at the messageLog.  If we are, calls to "updateMessage" are from the "spam" method, which doesn't need to show up in here.
			$("#aMessage").text(arg_strToSay);
		}
		
		//strMessageLog += arg_strToSay + "\n";
	}//END OF updateMessage(...)
	
	/*
	Purpose: enable the "actions" bar, in the case of the player's turn to pick an action.  Disables "Proceed" to force a choice.
	Parameters: none.
	Return: none.
	*/
	function enableActions(){
		$("#btnFire").prop("disabled", false);
		$("#btnPlunder").prop("disabled", false);
		$("#btnTaunt").prop("disabled", false);
		$("#btnRepair").prop("disabled", false);
		$("#btnSwerve").prop("disabled", false);
		$("#btnRetreat").prop("disabled", false);
		
		//when actions are enabled, the "proceed" option is disabled.
		$("#btnProceed").prop("disabled", true);
	}//END OF enableActions()
	
	/*
	Purpose: disable the "Actions" bar, usually after picking one.  Then, an event happens (enabling proceed).
	Parameters: none.
	Return: none.
	*/
	function disableActions(){
		$("#btnFire").prop("disabled", true);
		$("#btnPlunder").prop("disabled", true);
		$("#btnTaunt").prop("disabled", true);
		$("#btnRepair").prop("disabled", true);
		$("#btnSwerve").prop("disabled", true);
		$("#btnRetreat").prop("disabled", true);
		
		//when actions are disabled, "proceed" is enabled.
		$("#btnProceed").prop("disabled", false);
	}//END OF disableActions()
	
	
	
	/*
	Purpose: locate the earliest available place of the output list in the messageLog.  If fout of space, delete the top-most, push all up, and print at the bottom.
	Parameters: none.
	Return: none.
	*/
	function getAvailableOutputQueryRef(){
		var chosenQueryRef = null;
		
		
		if(intRecentOutputChoice < intOutputLines){
			chosenQueryRef = messageLogList[intRecentOutputChoice];
			intRecentOutputChoice++;
			return chosenQueryRef;
		}else{
			chosenQueryRef = messageLogList[intOutputLines-1];
			//out of space.  push all output up, erasing the one on top (#0).  Return the bottom to write to.
			for(var i = 0; i < intOutputLines-1; i++){  //go up to less than intOutputLines.  The last has none after it [index + 1].
				messageLogList[i].text( messageLogList[i + 1].text() );
			}
			return chosenQueryRef;
				
		}
		
		
	}//END OF getAvailableOutputQueryRef()
	
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	//!!! CUSTOM TEXT FUNCTIONS
	//////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	/*
	Purpose: print text involving repairing the ship.  This is called with only the number to send.  It will call the "Specific" version with a JQuery reference to an element.
	Parameters: (int) value.
	Return: none.
	*/
	function repairMessage(arg_toRepair){
		var pickedQueryRef = getAvailableOutputQueryRef();
		repairMessageSpecific(pickedQueryRef, arg_toRepair);
	}
	/*
	Purpose: same as above with a specific element in mind (arg_qryPrintOut).
	Parameters: (jquery ref) to print to, (int) value.
	Return: none.
	*/
	function repairMessageSpecific(arg_qryPrintOut, arg_intValue){
		var strConcatenate = "That ought ta do it.  Just don\'t lean on it too hard. ( + " + arg_intValue + " health)";
		
		arg_qryPrintOut.text(strConcatenate);
		updateMessage(strConcatenate);
	}
	
	
	/*
	Purpose: print text involving damage to the enemy.  This is called with only the number to send.  It will call the "Specific" version with a JQuery reference to an element.
	Parameters: (int) value.
	Return: none.
	*/
	function damageEnemyMessage(arg_intDamage){
		var pickedQueryRef = getAvailableOutputQueryRef();
		
		damageEnemyMessageSpecific(pickedQueryRef, arg_intDamage);
	}
	/*
	Purpose: same as above with a specific element in mind (arg_qryPrintOut).
	Parameters: (jquery ref) to print to, (int) value.
	Return: none.
	*/
	function damageEnemyMessageSpecific(arg_qryPrintOut, arg_intDamage){
		var strConcatenate = "FIRE!  That ought ta send a clear message.  (" + arg_intDamage + " damage)";
		arg_qryPrintOut.text(strConcatenate);
		updateMessage(strConcatenate);
	}
	
	
	/*
	Purpose: print text involving the player taking damage.  This is called with only the number to send.  It will call the "Specific" version with a JQuery reference to an element.
	Parameters: (int) value.
	Return: none.
	*/
	function damagePlayerMessage(arg_intDamage){
		var pickedQueryRef = getAvailableOutputQueryRef();
		
		damagePlayerMessageSpecific(pickedQueryRef, arg_intDamage);
	}
	/*
	Purpose: same as above with a specific element in mind (arg_qryPrintOut).
	Parameters: (jquery ref) to print to, (int) value.
	Return: none.
	*/
	function damagePlayerMessageSpecific(arg_qryPrintOut, arg_intDamage){
		var strConcatenate = "\'Yargh!  That\'s goin\' ta leave a mark.  (took " + arg_intDamage + " damage)";
		arg_qryPrintOut.text(strConcatenate);
		updateMessage(strConcatenate);
	}
	
	
	
	
	/*
	Purpose: print text involving health stolen from the enemy.  This is called with only the number to send.  It will call the "Specific" version with a JQuery reference to an element.
	Parameters: (int) value.
	Return: none.
	*/
	function stealHealthMessage(arg_intDamage){
		var pickedQueryRef = getAvailableOutputQueryRef();
		
		stealHealthMessageSpecific(pickedQueryRef, arg_intDamage);
	}
	/*
	Purpose: same as above with a specific element in mind (arg_qryPrintOut).
	Parameters: (jquery ref) to print to, (int) value.
	Return: none.
	*/
	function stealHealthMessageSpecific(arg_qryPrintOut, arg_intDamage){
		var strConcatenate = "They won\'t be needin\' this timber, now will they?  (stole " + arg_intDamage + " health)";
	
		arg_qryPrintOut.text(strConcatenate);
		updateMessage(strConcatenate);
	}
	
	
	
	/*
	Purpose: print text involving stealing coins (no impact on the game).  This is called with only the number to send.  It will call the "Specific" version with a JQuery reference to an element.
	Parameters: (int) value.
	Return: none.
	*/
	function stealCoinsMessage(arg_intCoins){
		var pickedQueryRef = getAvailableOutputQueryRef();
		
		stealCoinsMessageSpecific(pickedQueryRef, arg_intCoins);
	}
	/*
	Purpose: same as above with a specific element in mind (arg_qryPrintOut).
	Parameters: (jquery ref) to print to, (int) value.
	Return: none.
	*/
	function stealCoinsMessageSpecific(arg_qryPrintOut, arg_intCoins){
		var strConcatenate = "Found some treasure.  Spoils \'o war! (stole " + arg_intCoins + " coins)";
	
		arg_qryPrintOut.text(strConcatenate);
		updateMessage(strConcatenate);
	}
	
	
	/*
	Purpose: print text involving harming enemy morale.  This is called with only the number to send.  It will call the "Specific" version with a JQuery reference to an element.
	Parameters: (int) value.
	Return: none.
	*/
	function moraleDropMessage(arg_intMoraleDrop){
		var pickedQueryRef = getAvailableOutputQueryRef();
		
		moraleDropMessageSpecific(pickedQueryRef, arg_intMoraleDrop);
	}
	/*
	Purpose: same as above with a specific element in mind (arg_qryPrintOut).
	Parameters: (jquery ref) to print to, (int) value.
	Return: none.
	*/
	function moraleDropMessageSpecific(arg_qryPrintOut, arg_intMoraleDrop){
		var strConcatenate = "They\'re breakin\' out in tears as salty as the sea!  That one always gets \'em! (morale -" + arg_intMoraleDrop + ")";
	
		arg_qryPrintOut.text(strConcatenate);
		updateMessage(strConcatenate);
	}
		
	
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	
	
	
	
	
	/*
	Purpose: only availbe when viewing the message log.  Prints one of each of the six custom message options with an "alert" prompt (if the "Alerts Enabled" checkbox is marked).
	Parameters: none.
	Return: none.
	*/
	$("#btnSpam").click(function(){
	
		alertFiltered("Calling \"repairMessage\"");
		repairMessage(45);
		alertFiltered("Calling \"damageEnemyMessage\"");
		damageEnemyMessage(60);
		alertFiltered("Calling \"damagePlayerMessage\"");
		damagePlayerMessage(80);
		alertFiltered("Calling \"stealHealthMessage\"");
		stealHealthMessage(38);
		alertFiltered("Calling \"stealCoinsMessage\"");
		stealCoinsMessage(12);
		alertFiltered("Calling \"moraleDropMessage\"");
		moraleDropMessage(11);
		
	});
	
	/*
	Purpose: only availbe when viewing the message log.  Clears and sets printing to start from the top.
	Parameters: none.
	Return: none.
	*/
	$("#btnClear").click(function(){
		intRecentOutputChoice = 0;  //ready to start at the top.
		for(var i = 0; i < intOutputLines;i++){
			messageLogList[i].text("");  //clear each output place.
		}
	});
	
	
		/*
	Purpose: The workhorse of game logic.  In a nutshell, moves events by each click.  How is described in detail via comments below.
	Parameters: none.
	Return: none.
	*/
	$("#btnProceed").click(function(){
		
		//temp vars to potentially be used.  Sometimes there are issues with declaring inside switch statements, so all are specified here.
		var intRepairAmount = 0;
		var fltChance = 0;
		var intDamage = 0;
		var intToSteal = 0;
		var fltMoraleChance = 0;
		var intMoraleDrop = 0;
		
		var fltNormalAccuracy = 0.92;
		var fltVsSwerveAccuracy = 0.4;
		var fltAccuracy = 0;  //chosen at go-time
		var intCoinsStolen = 0;
		
		//alert("ACTIE " + intActionIndex + " " + intEventIndex);
		
		
		
		//But before event processing, check to see if either ship has "sunk" (out of health).  If so, a final event (victory or defeat) is run instead of the next turn.
		if(shpPlayer.bolSunk){
			updateMessage("Cap\'n... it\'s been a pleasure servin\' ya.  (all health lost)");
			$("#btnProceed").text("Reset");
			intActionIndex = -1;
			shpPlayer.bolSunk = false;
			return;  //in either case, let the player press "proceed" to get a chance to read the text first.
		}else if(shpEnemy.bolSunk){
			
			if(bolCheated === false){
				updateMessage("Cap\'n, we did it!  I always knew ye could pull through!  Quick, loot what ya can before she sinks!");
			}else{
				updateMessage("Gettin\' gold this easy just ain\'t any fun.  I don\'t know what ye did, cap\'n.");
			}
			$("#btnProceed").text("Reset");
			intActionIndex = -1;
			
			shpEnemy.bolSunk = false;
			return;
		}
		
		
		
		
		
		
		
		//Event processing start.  "intActionIndex" handles who's turn it is and if this is the end of an event (events are two choices long at most).
		switch(intActionIndex){
		case -1:  //-1 is the end of the game.
			startGame();
			$("#btnProceed").text("Proceed");
		
		break;	
		case 0: //start of the game, give slightly more instruction than usual.  Player chooses an action.
		
			updateMessage("It\'s your turn.  Take yer pickin\' of the above options.");
			intActionIndex = 1;
			enableActions();
			
		break;	
		case 1: //player's turn, can choose from actions here too.
		
			shpPlayer.bolSwerve = false;  //if this player was swerving, isn't at the start of the turn.
		
			//player 1's turn; no proceed.
			updateMessage("It\'s our time ta shine, cap\'n.  Let em\' have it!");
			enableActions();
			
		break;
		case 2: //player 1's turn event, or end of.
			
			switch(intEventIndex){
				
				case -1:
					
				break;
				case 0://error?
					updateMessage("I don\'t fathom what ya mean, lad.");
					intActionIndex = 3;
				break;
				case 1://fire
				
					//if the enemy is swerving (by previous turn), accuracy is reduced.
					if(!shpEnemy.bolSwerve){
						fltAccuracy = fltNormalAccuracy;
					}else{
						fltAccuracy = fltVsSwerveAccuracy;	
					}
					fltChance = Math.random();
					//there is a chance to miss, seen here.
					if(fltAccuracy >= fltChance){
						intDamage = shpPlayer.generateCannonAttack();
						damageEnemyMessage(intDamage);
						shpEnemy.takeDamage(intDamage);
					}else{
						updateMessage("BLIMEY! We just missed, cap\'n!");
					}
				break;
				case 2: //steal something (plunder)
					
					//What did we find?  Matter of luck:
					fltChance = Math.random();
					
					//found money.
					if(fltChance <= 0.12){
						intCoinsStolen = Math.floor(10*((Math.random()*0.8)+0.5)  );
						stealCoinsMessage(intCoinsStolen);
					}else
					//stole health
					if(fltChance <= 0.43){
						
						intToSteal = Math.floor(40*((Math.random()*0.8)+0.5));
						
						if(intToSteal > shpEnemy.intCurHealth){
							intToSteal = shpEnemy.intCurHealth - 1;  //steal all but one.	
						}
						
						stealHealthMessage(intToSteal);
						
						shpPlayer.heal(intToSteal);
						shpEnemy.takeDamage(intToSteal);
					}else
					//stole cannon (if any present)
					if(fltChance <= 0.86){
						
						if(shpEnemy.intCannons > 0){
							updateMessage("Yar-har-har!  We done stole a cannon from those scurvy dogs!  That ought ta even the odds.");	
							shpEnemy.intCannons--;
							shpPlayer.intCannons++;
						}else{
							updateMessage("That be a dry-run cap\'n.  We\'ve taken a lot, we have.");	
						}
						
						
					}
					//nothing.
					else{
						updateMessage("Y\'argh.  They put up a good fight... (nothing found)");
						
					}				
				break;
				case 3:  //taunt
					
					//if enemy moralie is above 80, it can be reduced by taunting.
					//Reduced morale gives chance of missing (more than usual)
					if(shpEnemy.intMorale >= 80){
						
						intMoraleDrop = Math.floor( 9*((Math.random()*0.9)+0.4) );
						
						moraleDropMessage(intMoraleDrop);			
						shpEnemy.intMorale -= intMoraleDrop;
					}else{
						//you're same taunt is getting stale.	
						updateMessage("...hm, they don\'t seem terribly interested.  Need ta find sum better insults one o\' these days.");				
					}
				
				break;
				case 4: //repair.
				
					intRepairAmount = Math.floor(90*((Math.random()*1)+0.6));	
					repairMessage(intRepairAmount);
					shpPlayer.heal(intRepairAmount);
				
				break;
				//there is no "5"; that needs only one turn at button press (swerve).
				case 6:  //run away aftermath.  End of game.
					updateMessage("And so we left with what we had.  Perhaps it was a better fate than sinkin\'.");
					$("#btnProceed").text("Reset");
					intActionIndex = -1;
				break;
				
				
			}
			
			//if not the end of the game (-1), proceed.  +1 goes to player 2's turn.
			if(intActionIndex !== -1){
				intActionIndex += 1;
			}
		
		break;
		case 3:
			shpEnemy.bolSwerve = false;  //if this player was swerving, isn't at the start of the turn.
			
			//enemy player's turn.  Pick fire (83%) or swerve (17%).
			fltChance = Math.random();
			if(fltChance <= 0.83){
				intEventIndex = 1;		
			}else{
				intEventIndex = 4;
			}
			
			switch(intEventIndex){
				case 1:  //fire.
					//Requires cannons, which can be stolen.
					if(shpEnemy.intCannons > 0){
						updateMessage("They\'re mannin\' the cannons.  Keep yer\' \'ead down!");
					}else{
						//Out of cannons?  Skip.
						updateMessage("Without their cannon, they be sittin\' ducks.  Let\'s finish em\' off!");
						intActionIndex = 1;  //skipping #4			
					}
				break;
				case 4:  //swerve.
					updateMessage("Bl\'argh. They be takin\' evasive action.");
					shpEnemy.bolSwerve = true;
					intActionIndex = 1;  //skipping #4	
				break;
			}
			if(intActionIndex === 3){  //if "intActionIndex" was changed by other processes, don't bump it.
				intActionIndex ++;
			}
			
		break;	
		case 4:
		
			switch(intEventIndex){
				case 1:
					
					fltMoraleChance = Math.floor(Math.random() * 100);  //that is, if the enemy morale is less than 100, there is a chance of failing to fire (a "moral" out of 100 chance of firing)
					if(shpEnemy.intMorale >= fltMoraleChance){
						
						//if the player is swerving, accuracy is reduced toward the player.
						if(!shpPlayer.bolSwerve){
							fltAccuracy = fltNormalAccuracy;
						}else{
							fltAccuracy = fltVsSwerveAccuracy;	
						}
						fltChance = Math.random();
						if(fltAccuracy >= fltChance){
							
							//Cheat mode makes all enemy cannon damage just "1" (tiny).  Also, the "pirate friend" will almost recognize the player cheated in victory text (bolCheated).
							if(!bolCheatMode){
								intDamage = shpEnemy.generateCannonAttack();
							}else{
								bolCheated = true;
								intDamage = 1;	
							}
							
							damagePlayerMessage(intDamage);					
							shpPlayer.takeDamage(intDamage);
						}else{
							updateMessage("Woah!  A bit closer and we\'d have another leak on our hands. (missed)"  );
						}
					}else{
							updateMessage("...Ey?  Nothin\'?  HA!  Now they know just who they\'re dealin\' with!");	
					}
					
					
				break;
				//nothing for swerve.  that's it.
			}
			intActionIndex = 1;
		break;
		
			
		}
		
	});//end of #btnSomeButton.click
	
	
	
	
	/*
	Purpose: when any action button is chosen (of class "btnSample"), disable actions.  Enable proceed; an event will occur soon. 
	Parameters: none.
	Return: none.
	*/
	$(".btnSample").click(function(){
		
		disableActions();
		intActionIndex += 1;  //for either player's turn, + 1 goes to text-response mode.
	});
	
	
	
	/*
	Purpose: The next six methods start the according events, linked for being continued in "btnProceed"'s click method above.
	Parameters: none.
	Return: none.
	*/
	/////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////
	$("#btnFire").click(function(){
		intEventIndex = 1;
		updateMessage("Ready the cannons.  Aim...");
		
	});
	$("#btnPlunder").click(function(){
		intEventIndex = 2;
		updateMessage("Take what ya can, crew!");
		
	});
	$("#btnTaunt").click(function(){
		intEventIndex = 3;
		updateMessage("\"Ye bunch o\' sheltered landlubbers havn\'t a chance at hittin\' the broad side of a whale!\"");
	
	});
	
	
	$("#btnRepair").click(function(){
		intEventIndex = 4;
		updateMessage("Get yer hammers, get yer boards!  We got holes ta fix!");
	
	});
	
	$("#btnSwerve").click(function(){
		intEventIndex = 5;
		updateMessage("To the helm, cap\'n!");
		shpPlayer.bolSwerve = true;
		intActionIndex = 3;  //nothing else to do, player 2's turn now.
	
	});
	
	$("#btnRetreat").click(function(){
		intEventIndex = 6;
		
		//Note that the "pirate friend" may comment on the ship's condition if leaving after taking a bruising, or call the player "merciful" for leaving an almost defeated / defenseless opponent.
		if(shpEnemy.intCannons === 0 || shpEnemy.intCurHealth < 100){
			updateMessage("Showin\' em\' mercey, eh cap\'n?  Wish a heart o\' gold could buy me rum.");	
		}else if(shpPlayer.intCurHealth < 130){
			updateMessage("Aye, best flee while we got wood under our feet.  Perhaps another day...");	
		}else if(shpPlayer.intCurHealth < 70){
			updateMessage("Cuttin\' it close, cap\'n.  Let\'s hope she can still take us back.");	
		}else{
			updateMessage("Run away, cap\'n?  If ye insist...");
		}
	
	});
	/////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////
	
	

});//end of document.ready

