
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 13 November 2016
 PURPOSE: work for movers_and_shakers_challenge.html
 MODIFICATION HISTORY:
 23 Nov 2016: explicitly named functions given for each effect-related button's click event. (CPD)

 
 ***Accompanying HTML page Tested in Firefox, Google Chrome, and Microsoft Edge (see movers_and_shakers_challenge.html for more information).  Functionality deemed identical across all 3.
 */
 


$(document).ready(function(){
	"use strict";
	
	
	/*
	Index:
	
	1. GLOBAL VARAIBLES & WINDOW EVENTS
	2. MASS CONTROL METHODS
	3. EFFECT CLICK EVENTS / METHODS
	4. RESET CLICK EVENTS / METHODS
	5. HELPER METHODS
	6. UTILITY METHODS
	
	*/
		
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// 1. GLOBAL VARAIBLES & WINDOW EVENTS ///////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

	
	//Good to remember the starting positions of elements since a reset (or screen re-size) so that elements can't leave their starting boxes (movement that tries to too far past an origin is blocked).
	var fltTestMovementXOrigin = null;
	var fltTestMovementYOrigin = null;
	
	var fltTestGlideXOrigin = null;
	var fltTestGlideYOrigin = null;
	
	var fltTestNudgeXOrigin = null;
	var fltTestNudgeYOrigin = null;
	
	
	
	/*
	Purpose: called at window startup.  Can start with a prompt or initialize features that need it by script.
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		fillCustomDefaults();
		//actually, resetting all suffices.
		$("#btnResetAll").click();
	});//end of window.load
	
	
	
	/*
	Purpose: window resize event.  On resize, the movement, glide, and nudge elements must be re-adjusted (positions made "relative" again, re-placed to the same location in "absolute" position mode for more control over movement).
	Parameters: none
	Return: none
	*/
	$(window).resize(function(){
		resetMovement();
		resetGlide();
		resetNudge();
	});
	
	
	
	
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// 2. MASS CONTROL METHODS ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

	
	/*
	Purpose: "Enbale" & "Disable" pairs of methods that enable / disable (accordingly) the buttons in their row.
	Parameters: none
	Return: none
	*/
	function visibilityEnable(){
		$("#btnHide").prop("disabled", false);
		$("#btnShow").prop("disabled", false);
		$("#btnToggle").prop("disabled", false);
	}
	function visibilityDisable(){
		$("#btnHide").prop("disabled", true);
		$("#btnShow").prop("disabled", true);
		$("#btnToggle").prop("disabled", true);
	}
	
	function fadeEnable(){
		$("#btnFadeIn").prop("disabled", false);
		$("#btnFadeOut").prop("disabled", false);
		$("#btnFadeToggle").prop("disabled", false);
	}
	function fadeDisable(){
		$("#btnFadeIn").prop("disabled", true);
		$("#btnFadeOut").prop("disabled", true);
		$("#btnFadeToggle").prop("disabled", true);
	}
	function slideEnable(){
		$("#btnSlideUp").prop("disabled", false);
		$("#btnSlideDown").prop("disabled", false);
		$("#btnSlideToggle").prop("disabled", false);
	}
	function slideDisable(){
		$("#btnSlideUp").prop("disabled", true);
		$("#btnSlideDown").prop("disabled", true);
		$("#btnSlideToggle").prop("disabled", true);
	}
	
	function allVisibilityEnable(){
		$("#btnAllVisibility").prop("disabled", false);
	}
	function allVisibilityDisable(){
		$("#btnAllVisibility").prop("disabled", true);
	}
	
	function movementEnable(){
		$("#btnMovementLeft").prop("disabled", false);
		$("#btnMovementRight").prop("disabled", false);
		$("#btnMovementTop").prop("disabled", false);
		$("#btnMovementBottom").prop("disabled", false);
	}
	function movementDisable(){
		$("#btnMovementLeft").prop("disabled", true);
		$("#btnMovementRight").prop("disabled", true);
		$("#btnMovementTop").prop("disabled", true);
		$("#btnMovementBottom").prop("disabled", true);
	}
	
	function glideEnable(){
		$("#btnGlideTopLeft").prop("disabled", false);
		$("#btnGlideTopRight").prop("disabled", false);
		$("#btnGlideBottomLeft").prop("disabled", false);
		$("#btnGlideBottomRight").prop("disabled", false);
	}
	function glideDisable(){
		$("#btnGlideTopLeft").prop("disabled", true);
		$("#btnGlideTopRight").prop("disabled", true);
		$("#btnGlideBottomLeft").prop("disabled", true);
		$("#btnGlideBottomRight").prop("disabled", true);
	}
	
	function nudgeEnable(){
		$("#btnNudgeLeft").prop("disabled", false);
		$("#btnNudgeRight").prop("disabled", false);
		$("#btnNudgeUp").prop("disabled", false);
		$("#btnNudgeDown").prop("disabled", false);
	}
	function nudgeDisable(){
		$("#btnNudgeLeft").prop("disabled", true);
		$("#btnNudgeRight").prop("disabled", true);
		$("#btnNudgeUp").prop("disabled", true);
		$("#btnNudgeDown").prop("disabled", true);
	}
	
	function easingEnable(){
		$("#btnEasing").prop("disabled", false);
	}
	function easingDisable(){
		$("#btnEasing").prop("disabled", true);
	}
	
	
	/*
	Purpose: fill the two inputs with custom settings.  Just a link.
	Parameters: none
	Return: none
	*/
	$("#btnDefaultSettings").click(function(){
		fillCustomDefaults();
	});
	/*
	Purpose: fill the two inputs with custom settings.  Gives textboxes "txtLength" and "txtEasing" reasonable defaults.
	Parameters: none
	Return: none
	*/
	function fillCustomDefaults(){
		
		//var qryRefRadLinear = $("#radEasingModeLinear");
		//var qryRefRadSwing = $("#radEasingModeSwing");
		
		$("#txtLength").prop("value", "400");
		//qryRefRadSwing.prop("checked", false);
		//qryRefRadLinear.prop("checked", true);
		
		$("#txtEasing").prop("value", "linear");
	}//END OF fillCustomDefaults()
	
	/*
	Purpose: calls the "reset" button of each row.  Essentially, an all-in-one page-reset (besides the two custom fields at the bottom).
	Parameters: none
	Return: none
	*/
	function resetAll(){
		resetVisibility();
		resetFade();
		resetSlide();
		resetAllVisibility();
		resetMovement();
		resetGlide();
		resetNudge();
		resetEasing();	
	}
	/*
	Purpose: btnResetAll click method.
	Parameters: none
	Return: none
	*/
	$("#btnResetAll").click(function(){
		resetAll();
	});
	
	
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// 3. EFFECT CLICK EVENTS / METHODS //////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

	/*
	Purpose: Hides the "visibility test div".
	Parameters: none
	Return: none
	*/
	function visibilityHide(){
		var intTime = attemptReadTime();
		var strEasingMode = getEasingMode();
		
		visibilityDisable();
		var qryRefDivVisibilityTest = $("#divVisibilityTest");
		qryRefDivVisibilityTest.stop(true, true, false);
		//qryRefDivVisibilityTest.hide();
		qryRefDivVisibilityTest.hide(intTime, strEasingMode, visibilityEnable);
		//qryRefDivVisibilityTest.fadeIn(intTime, strEasingMode, null);
	}
	/*
	Purpose: btnHide click method.
	Parameters: none
	Return: none
	*/
	$("#btnHide").click(function(){
		visibilityHide();
	});//END OF #btnHide.click
	
	
	/*
	Purpose: Shows the "visibility test div".
	Parameters: none
	Return: none
	*/
	function visibilityShow(){
		var intTime = attemptReadTime();
		var strEasingMode = getEasingMode();
		visibilityDisable();
		var qryRefDivVisibilityTest = $("#divVisibilityTest");
		qryRefDivVisibilityTest.stop(true, true, false);
		qryRefDivVisibilityTest.show(intTime, strEasingMode, visibilityEnable);
	}
	/*
	Purpose: btnShow click method.
	Parameters: none
	Return: none
	*/
	$("#btnShow").click(function(){
		visibilityShow();
	});//END OF #btnShow.click
	
	
	/*
	Purpose: Toggle the "visibility test div" (that is, "show" if hidden, "hide" if visible).
	Parameters: none
	Return: none
	*/
	function visibilityToggle(){
		var intTime = attemptReadTime();
		var strEasingMode = getEasingMode();
		visibilityDisable();
		var qryRefDivVisibilityTest = $("#divVisibilityTest");
		qryRefDivVisibilityTest.stop(true, true, false);
		qryRefDivVisibilityTest.toggle(intTime, strEasingMode, visibilityEnable);
	}
	/*
	Purpose: btnToggle click method.
	Parameters: none
	Return: none
	*/
	$("#btnToggle").click(function(){
		visibilityToggle();
	});//END OF #btnToggle.click
	
	
	
	
	
	
	/*
	Purpose: Fade in the "fade test div".
	Parameters: none
	Return: none
	*/
	function fadeIn(){
		var intTime = attemptReadTime();
		var strEasingMode = getEasingMode();
		fadeDisable();
		var qryRefDivFadeTest = $("#divFadeTest");
		qryRefDivFadeTest.stop(true, true, false);
		
		
		if($("#chkGrowShrink").prop("checked") === false){
			qryRefDivFadeTest.fadeIn( intTime, strEasingMode, fadeEnable);
		}else{
			qryRefDivFadeTest.animate({opacity:1,width:120, height:120}, {duration: intTime, easing: strEasingMode, complete: fadeEnable});
		}
		
		//a precaution.
		//qryRefDivFadeTest.css({display: "inline-block"});	
	}
	/*
	Purpose: btnFadeIn click method.
	Parameters: none
	Return: none
	*/
	$("#btnFadeIn").click(function(){
		fadeIn();
	});//END OF #btnFadeIn.click
	
	/*
	Purpose: Fade out the "fade test div".
	Parameters: none
	Return: none
	*/
	function fadeOut(){
		var intTime = attemptReadTime();
		var strEasingMode = getEasingMode();
		fadeDisable();
		var qryRefDivFadeTest = $("#divFadeTest");
		qryRefDivFadeTest.stop(true, true, false);
		
		if($("#chkGrowShrink").prop("checked") === false){
			qryRefDivFadeTest.fadeOut(intTime, strEasingMode, fadeEnable);
		}else{
			qryRefDivFadeTest.animate({opacity:0,width:50, height:50}, {duration: intTime, easing: strEasingMode, complete: fadeEnable});
		}
		
	}
	/*
	Purpose: btnFadeOut click method.
	Parameters: none
	Return: none
	*/
	$("#btnFadeOut").click(function(){
		fadeOut();
	});//END OF #btnFadeOut.click
	
	/*
	Purpose: Fade out the "fade test div".
	Parameters: none
	Return: none
	*/
	function fadeToggle(){
		var intTime = attemptReadTime();
		var strEasingMode = getEasingMode();
		fadeDisable();
		var qryRefDivFadeTest = $("#divFadeTest");
		qryRefDivFadeTest.stop(true, true, false);
		
		if($("#chkGrowShrink").prop("checked") === false){
			qryRefDivFadeTest.fadeToggle(intTime, strEasingMode, fadeEnable);
		}else{
			var fltTargetWidthHeight;
			var fltTargetOpacity;
			if(parseFloat(qryRefDivFadeTest.css("opacity"), 10) === 0){
				fltTargetOpacity = 1;
				fltTargetWidthHeight = 120;
			}else{
				fltTargetOpacity = 0;
				fltTargetWidthHeight = 50;
			}
			
			qryRefDivFadeTest.animate({opacity:fltTargetOpacity,width:fltTargetWidthHeight, height:fltTargetWidthHeight}, {duration: intTime, easing: strEasingMode, complete: fadeEnable});
		}
		
	}
	
	/*
	Purpose: btnFadeToggle click method.
	Parameters: none
	Return: none
	*/
	$("#btnFadeToggle").click(function(){
		fadeToggle();
	});//END OF #btnFadeToggle.click
	
	
	/*
	Purpose: Slide a visible div into invisibility. 
	Parameters: none
	Return: none
	*/
	function slideUp(){
		var intTime = attemptReadTime();
		var strEasingMode = getEasingMode();
		slideDisable();
		var qryRefDivSlideTest = $("#divSlideTest");
		qryRefDivSlideTest.stop(true, true, false);
		qryRefDivSlideTest.slideUp(intTime, strEasingMode, slideEnable);
	}
	/*
	Purpose: btnSlideUp click method.
	Parameters: none
	Return: none
	*/
	$("#btnSlideUp").click(function(){
		slideUp();
	});//END OF #btnSlideUp.click
	
	/*
	Purpose: Slide an invisible div back into visibility. 
	Parameters: none
	Return: none
	*/
	function slideDown(){
		var intTime = attemptReadTime();
		var strEasingMode = getEasingMode();
		slideDisable();
		var qryRefDivSlideTest = $("#divSlideTest");
		qryRefDivSlideTest.stop(true, true, false);
		qryRefDivSlideTest.slideDown(intTime, strEasingMode, slideEnable);
	}
	/*
	Purpose: btnSlideDown click method.
	Parameters: none
	Return: none
	*/
	$("#btnSlideDown").click(function(){
		slideDown();
	});//END OF #btnSlideDown.click
	
	/*
	Purpose: Toggle the slide animation. Tthat is, slide to visibility or invisibility depending on whether the test div is invisible or not accordingly.
	Parameters: none
	Return: none
	*/
	function slideToggle(){
		var intTime = attemptReadTime();
		var strEasingMode = getEasingMode();
		slideDisable();
		var qryRefDivSlideTest = $("#divSlideTest");
		qryRefDivSlideTest.stop(true, true, false);
		qryRefDivSlideTest.slideToggle(intTime, strEasingMode, slideEnable);
	}
	/*
	Purpose: btnSlideToggle click method.
	Parameters: none
	Return: none
	*/
	$("#btnSlideToggle").click(function(){
		slideToggle();
	});//END OF #btnSlideToggle.click
	
	
	
	/*
	Purpose: Chains together all non-toggle animations above (hide / show, fade in / out, slide up / down).
	Parameters: none
	Return: none
	*/
	function allVisibilityInitiate(){
		var intTime = attemptReadTime();
		var strEasingMode = getEasingMode();
		allVisibilityDisable();
		var qryRefDivAllVisibilityTest = $("#divAllVisibilityTest");
		qryRefDivAllVisibilityTest.stop(true, true, false);
		
		qryRefDivAllVisibilityTest
		.hide(intTime, strEasingMode, null)
		.show(intTime, strEasingMode, null)
		.fadeOut(intTime, strEasingMode, null)
		.fadeIn(intTime, strEasingMode, null)
		.slideUp(intTime, strEasingMode, null)
		.slideDown(intTime, strEasingMode, allVisibilityEnable);
		
	}
	/*
	Purpose: btnAllVisibility click method.
	Parameters: none
	Return: none
	*/
	$("#btnAllVisibility").click(function(){
		allVisibilityInitiate();
	});//END OF #btnAllVisibility.click
	
	
	
	/*
	Purpose: Move the movement test div to the furthest left possible in the bounding box (a distance from origin).
	Parameters: none
	Return: none
	*/
	function movementLeft(){
		var qryRefDivMovementTest = $("#divMovementTest");
		moveToLocationChoice(qryRefDivMovementTest, fltTestMovementXOrigin - 66, null);	
	}
	/*
	Purpose: btnMovementLeft click method.
	Parameters: none
	Return: none
	*/
	$("#btnMovementLeft").click(function(){
		movementLeft();
	});//END OF #btnMovementLeft.click
	
	
	/*
	Purpose: Move the movement test div to the furthest right possible in the bounding box (a distance from origin).
	Parameters: none
	Return: none
	*/
	function movementRight(){
		var qryRefDivMovementTest = $("#divMovementTest");
		moveToLocationChoice(qryRefDivMovementTest, fltTestMovementXOrigin + 66, null);	
	}
	/*
	Purpose: btnMovementRight click method.
	Parameters: none
	Return: none
	*/
	$("#btnMovementRight").click(function(){
		movementRight();
	});//END OF #btnMovementRight.click
	
	
	/*
	Purpose: Move the movement test div to the furthest up possible in the bounding box (a distance from origin).
	Parameters: none
	Return: none
	*/
	function movementTop(){
		var qryRefDivMovementTest = $("#divMovementTest");
		moveToLocationChoice(qryRefDivMovementTest, null, fltTestMovementYOrigin - 66);	
	}
	/*
	Purpose: btnSlideToggle click method.
	Parameters: none
	Return: none
	*/
	$("#btnMovementTop").click(function(){
		movementTop();
	});//END OF #btnMovementTop.click
	
	
	/*
	Purpose: Move the movement test div to the furthest down possible in the bounding box (a distance from origin).
	Parameters: none
	Return: none
	*/
	function movementBottom(){
		var qryRefDivMovementTest = $("#divMovementTest");
		moveToLocationChoice(qryRefDivMovementTest, null, fltTestMovementYOrigin + 66);	
	}
	/*
	Purpose: btnMovementBottom click method.
	Parameters: none
	Return: none
	*/
	$("#btnMovementBottom").click(function(){
		movementBottom();
	});//END OF #btnMovementBottom.click
	
	
	
	/*
	Purpose: move the glide test div to the furthesest position left & up possible (or just slide along whichever axis is not in the desired position yet, such as, on a call to topLeft when the test div is at the bottom-left, just move up).  Moves diagonally if two axes are not in their goal positions.
	Parameters: none
	Return: none
	*/
	function glideTopLeft(){
		var qryRefDivGlideTest = $("#divGlideTest");
		animateMoveQryRefToLocation(qryRefDivGlideTest, fltTestGlideXOrigin - 66, fltTestGlideYOrigin - 66, glideDisable, glideEnable);
	}
	/*
	Purpose: btnGlideTopLeft click method.
	Parameters: none
	Return: none
	*/
	$("#btnGlideTopLeft").click(function(){
		glideTopLeft();
	});//END OF #btnGlideTopLeft.click
	
	
	/*
	Purpose: move the glide test div to the furthesest position right & up possible.  Slides along the side if one axis is in the goal position, moves diagonally if two axes are not in their goal positions.
	Parameters: none
	Return: none
	*/
	function glideTopRight(){
		var qryRefDivGlideTest = $("#divGlideTest");
		animateMoveQryRefToLocation(qryRefDivGlideTest, fltTestGlideXOrigin + 66, fltTestGlideYOrigin - 66, glideDisable, glideEnable);
		
	}
	/*
	Purpose: btnGlideTopRight click method.
	Parameters: none
	Return: none
	*/
	$("#btnGlideTopRight").click(function(){
		glideTopRight();
	});//END OF #btnGlideTopRight.click
	
	/*
	Purpose: move the glide test div to the furthesest position left & down possible.  Slides along the side if one axis is in the goal position, moves diagonally if two axes are not in their goal positions.
	Parameters: none
	Return: none
	*/
	function glideBottomLeft(){
		var qryRefDivGlideTest = $("#divGlideTest");
		animateMoveQryRefToLocation(qryRefDivGlideTest, fltTestGlideXOrigin - 66, fltTestGlideYOrigin + 66, glideDisable, glideEnable);	
	}
	/*
	Purpose: btnGlideBottomLeft click method.
	Parameters: none
	Return: none
	*/
	$("#btnGlideBottomLeft").click(function(){
		glideBottomLeft();
	});//END OF #btnGlideBottomLeft.click
	
	/*
	Purpose: move the glide test div to the furthesest position right & down possible.  Slides along the side if one axis is in the goal position, moves diagonally if two axes are not in their goal positions.
	Parameters: none
	Return: none
	*/

	function glideBottomRight(){
		var qryRefDivGlideTest = $("#divGlideTest");
		animateMoveQryRefToLocation(qryRefDivGlideTest, fltTestGlideXOrigin + 66, fltTestGlideYOrigin + 66, glideDisable, glideEnable);
	}
	/*
	Purpose: btnGlideBottomRight click method.
	Parameters: none
	Return: none
	*/
	$("#btnGlideBottomRight").click(function(){
		glideBottomRight();
	});//END OF #btnGlideBottomRight.click
	
	
	
	
	/*
	Purpose: Move the element 22 pixels left by animation.  Controlled so that it may not move out of bounds.
	Parameters: none
	Return: none
	*/
	function nudgeLeft(){
		var qryRefDivNudgeTest = $("#divNudgeTest");
		var fltTargetX = parseFloatPx(qryRefDivNudgeTest.css("left")) - 22;
		//how far am I allowed to go?  Some distance away from the origin.
		if(fltTargetX >= fltTestNudgeXOrigin - (66 + 5)){
			animateMoveQryRefToLocation(qryRefDivNudgeTest, fltTargetX, null, nudgeDisable, nudgeEnable);
		}	
	}
	/*
	Purpose: btnNudgeLeft click method.
	Parameters: none
	Return: none
	*/
	$("#btnNudgeLeft").click(function(){
		nudgeLeft();
	});//END OF #btnNudgeLeft.click
	
	/*
	Purpose: Move the element 22 pixels right by animation.  Controlled so that it may not move out of bounds.
	Parameters: none
	Return: none
	*/
	function nudgeRight(){
		var qryRefDivNudgeTest = $("#divNudgeTest");
		var fltTargetX = parseFloatPx(qryRefDivNudgeTest.css("left")) + 22;
		//how far am I allowed to go?  Some distance away from the origin.
		if(fltTargetX <= fltTestNudgeXOrigin + (66 + 5)){
			animateMoveQryRefToLocation(qryRefDivNudgeTest, fltTargetX, null, nudgeDisable, nudgeEnable);
		}
	}
	/*
	Purpose: btnNudgeRight click method.
	Parameters: none
	Return: none
	*/
	$("#btnNudgeRight").click(function(){
		nudgeRight();
		
	});//END OF #btnNudgeRight.click
	
	/*
	Purpose: Move the element 22 pixels up by animation.  Controlled so that it may not move out of bounds.
	Parameters: none
	Return: none
	*/
	function nudgeUp(){
		var qryRefDivNudgeTest = $("#divNudgeTest");
		var fltTargetY = parseFloatPx(qryRefDivNudgeTest.css("top")) - 22;
		//how far am I allowed to go?  Some distance away from the origin.
		if(fltTargetY >= fltTestNudgeYOrigin - (66 + 5)){
			animateMoveQryRefToLocation(qryRefDivNudgeTest, null, fltTargetY, nudgeDisable, nudgeEnable);
		}	
	}
	/*
	Purpose: btnNudgeUp click method.
	Parameters: none
	Return: none
	*/
	$("#btnNudgeUp").click(function(){
		nudgeUp();
	});//END OF #btnNudgeUp.click
	
	/*
	Purpose: Move the element 22 pixels down by animation.  Controlled so that it may not move out of bounds.
	Parameters: none
	Return: none
	*/
	function nudgeDown(){
		var qryRefDivNudgeTest = $("#divNudgeTest");
		var fltTargetY = parseFloatPx(qryRefDivNudgeTest.css("top")) + 22;
		//how far am I allowed to go?  Some distance away from the origin.
		if(fltTargetY <= fltTestNudgeYOrigin + (66 + 5)){
			animateMoveQryRefToLocation(qryRefDivNudgeTest, null, fltTargetY, nudgeDisable, nudgeEnable);
		}	
	}
	/*
	Purpose: btnNudgeDown click method.
	Parameters: none
	Return: none
	*/
	$("#btnNudgeDown").click(function(){
		nudgeDown();
	});//END OF #btnNudgeDown.click
	
	
	/*
	Purpose: Force the easing mode to one hardcoded instead of the one provided by the text box at the bottom of the window.  It is used to apply a "Fade" effect by changing opacity.
	Parameters: none
	Return: none
	*/
	function easeToggle(){
		var intTime = attemptReadTime();
		//ignored this time.
		//var strEasingMode = getEasingMode();
		easingDisable();
		var qryRefDivEasingTest = $("#divEasingTest");
		qryRefDivEasingTest.stop(true, true, false);
		
		
		var fltTargetOpacity;
		if(parseFloat(qryRefDivEasingTest.css("opacity"), 10) === 0){
			fltTargetOpacity = 1;
		}else{
			fltTargetOpacity = 0;
		}
		
		qryRefDivEasingTest.animate({opacity:fltTargetOpacity}, {duration: intTime, easing: "easeInOutBounce", complete: easingEnable});
	}
	
	/*
	Purpose: btnEasing click method.
	Parameters: none
	Return: none
	*/
	$("#btnEasing").click(function(){
		easeToggle();
	});//END OF #btnEasing.click
	
	
	

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// 4. RESET CLICK EVENTS / METHODS ///////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
	
	/*
	Purpose: reset the visibility row's test element to the default state.  Stops any animation in progress and shows it again (if it is not visible).
	Parameters: none
	Return: none
	*/
	function resetVisibility(){
		var qryRefDivVisibilityTest = $("#divVisibilityTest");
		qryRefDivVisibilityTest.stop(true, true, false);
		qryRefDivVisibilityTest.hide();
		qryRefDivVisibilityTest.show();
		visibilityEnable();	
	}//END OF resetVisibility()
	/*
	Purpose: btnVisibilityReset click method.  Links the button to the method below.
	Parameters: none
	Return: none
	*/
	$("#btnVisibilityReset").click(function(){
		resetVisibility();
	});//END OF #btnSomeButton.click
	
	/*
	Purpose: reset the fade row's test element to the default state.  Stops any animation in progress and shows it again (if it is not visible).
	Parameters: none
	Return: none
	*/
	function resetFade(){
		var qryRefDivFadeTest = $("#divFadeTest");
		qryRefDivFadeTest.stop(true, true, false);
		qryRefDivFadeTest.hide();
		qryRefDivFadeTest.show();
		
		if($("#chkGrowShrink").prop("checked")){
			//start out hidden instead.
			//qryRefDivFadeTest.css({opacity:0});
			//actually, just start at max size:
			qryRefDivFadeTest.css({width:120, height:120, opacity:1});
		}else{
			qryRefDivFadeTest.css({width:50, height:50, opacity:1});	
		}
		
		fadeEnable();
	}//END OF resetFade()
	/*
	Purpose: Check box "change" event (fires on checking / unchecking).  Resets the fade test div.
	Parameters: none
	Return: none
	*/
	$("#chkGrowShrink").change(function(){
		resetFade();	
	});
	/*
	Purpose: btnFadeReset click method.  Links the button to the method below.
	Parameters: none
	Return: none
	*/
	$("#btnFadeReset").click(function(){
		resetFade();
	});//END OF #btnFadeReset.click
	
	
	
	/*
	Purpose: reset the slide row's test element to the default state.  Stops any animation in progress and shows it again (if it is not visible).
	Parameters: none
	Return: none
	*/
	function resetSlide(){
		var qryRefDivSlideTest = $("#divSlideTest");
		qryRefDivSlideTest.stop(true, true, false);
		qryRefDivSlideTest.hide();
		qryRefDivSlideTest.show();
		slideEnable();	
	}//END OF resetSlide()
	/*
	Purpose: btnSlideReset click method.  Links the button to the method below.
	Parameters: none
	Return: none
	*/
	$("#btnSlideReset").click(function(){
		resetSlide();
	});//END OF #btnSlideReset.click
	
	
	/*
	Purpose: reset the "resetAllVisibility" row's test element to the default state.  Stops any animation in progress and shows it again (if it is not visible).
	Parameters: none
	Return: none
	*/
	function resetAllVisibility(){
		var qryRefDivAllVisibilityTest = $("#divAllVisibilityTest");
		qryRefDivAllVisibilityTest.stop(true, true, false);
		qryRefDivAllVisibilityTest.hide();
		qryRefDivAllVisibilityTest.show();	
		allVisibilityEnable();
	}//END OF resetAllVisibility()
	/*
	Purpose: btnAllVisibilityReset click method.  Links the button to the method below.
	Parameters: none
	Return: none
	*/
	$("#btnAllVisibilityReset").click(function(){
		resetAllVisibility();
	});//END OF #btnAllVisibilityReset.click
	
	
	/*
	Purpose: reset the movement row's test element to the default state.  Stops any animation in progress and shows it again (if it is not visible).  Also alter the CSS in a paricular way to get the element's absolute position out of the heirarchy of relative positions and set the test element to (roughly) the original location for more control over position edits.
	Parameters: none
	Return: none
	*/
	function resetMovement(){
		
		var absPos = specialReset($("#divMovementTest"));
		fltTestMovementXOrigin = absPos[0];
		fltTestMovementYOrigin = absPos[1];
		movementEnable();
	}//END OF resetMovement()
	/*
	Purpose: btnMovementReset click method.  Links the button to the method below.
	Parameters: none
	Return: none
	*/
	$("#btnMovementReset").click(function(){
		resetMovement();
	});//END OF #btnMovementReset.click
	
	/*
	Purpose: reset the glide row's test element to the default state.  Stops any animation in progress and shows it again (if it is not visible).  Does the same CSS edits as above.
	Parameters: none
	Return: none
	*/
	function resetGlide(){
		
		var absPos = specialReset($("#divGlideTest"));
		fltTestGlideXOrigin = absPos[0];
		fltTestGlideYOrigin = absPos[1];
		glideEnable();
	}//END OF resetGlide()
	/*
	Purpose: btnGlideReset click method.  Links the button to the method below.
	Parameters: none
	Return: none
	*/
	$("#btnGlideReset").click(function(){
		resetGlide();
	});//END OF #btnGlideReset.click
	
	
	
	
	/*
	Purpose: reset the Nudge row's test element to the default state.  Stops any animation in progress and shows it again (if it is not visible).  Also alter the CSS in a paricular way to get the element's absolute position out of the heirarchy of relative positions and set the test element to (roughly) the original location for more control over position edits.
	Parameters: none
	Return: none
	*/
	function resetNudge(){
		var absPos = specialReset($("#divNudgeTest"));
		fltTestNudgeXOrigin = absPos[0];
		fltTestNudgeYOrigin = absPos[1];
		nudgeEnable();
	}//END OF resetNudge()
	
	/*
	Purpose: btnNudgeReset click method.  Links the button to the method below.
	Parameters: none
	Return: none
	*/
	$("#btnNudgeReset").click(function(){
		resetNudge();
	});//END OF #btnSomeButton.click
	
	
	
	/*
	Purpose: reset the visibility row's test element to the default state.  Stops any animation in progress and shows it again (if it is not visible).
	Parameters: none
	Return: none
	*/
	function resetEasing(){
		var qryRefDivEasingTest = $("#divEasingTest");
		qryRefDivEasingTest.stop(true, true, false);
		qryRefDivEasingTest.hide();
		qryRefDivEasingTest.show();	
		qryRefDivEasingTest.css({opacity:1});
		
		easingEnable();
	}//END OF resetEasing()
	/*
	Purpose: btnEasingReset click method.  Links the button to the method below.
	Parameters: none
	Return: none
	*/
	$("#btnEasingReset").click(function(){
		resetEasing();
	});//END OF #btnEasingReset.click
	
	
	
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// 5. HELPER METHODS /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

	
	/*
	Purpose: Try to read the animation time (milliseconds) as an integer from text box "txtLength".  If nothing is there or it is not a number, the user is notified of this and the text box is filled with a default of 400.
	Parameters: none
	Return: (int) the milliseconds an animation should last (throughout the program)
	*/
	function attemptReadTime(){
		
		var qryRefSrc = $("#txtLength");
		var intToReturn = 400;
		var bolSuccess = false;
		//default.
		
		while(true){
			var strRaw = qryRefSrc.val();
			var strTrimmed = strRaw.trim();
			
			if(strTrimmed === ""){
				alert("\"Length\" input ignored: blank.  Default of 400 used instead.");
				break;
			}
			if(strTrimmed.indexOf(".") !== -1){
				alert("\"Length\" input ignored: decimal (only whole numbers allowed).  Default of 400 used instead.");
				break;
			}
			var intParsed = parseInt(strTrimmed, 10);
			
			if(isNaN(intParsed) === true){
				alert("\"Length\" input ignored: unable to parse.  Only use numbers.  Default of 400 used instead.");	
				break;
			}
			
			//made it here?  The input given was okay.
			intToReturn = intParsed;
			bolSuccess = true;
			break;
			
		}//END OF while(true)
		
		if(!bolSuccess){
			//unsuccessful? revert input to default.
			qryRefSrc.val( "400" );
		}

		return intToReturn;			
	}//END OF attemptReadTime()
	
	
	
	/*
	Purpose: Read the contents of "txtEasing" and send this off as the easing mode used by most animations.
	Parameters: none
	Return: (string) animation easing mode
	*/
	function getEasingMode(){
		
		//var qryRefRadLinear = $("#radEasingModeLinear");
		//var qryRefRadSwing = $("#radEasingModeSwing");
		var qryRefTxtEasing = $("#txtEasing");
		
		
		var strRaw = qryRefTxtEasing.val();
		//alert(strRaw);
		var strTrimmed = null;
		if(strRaw !== null){
			strTrimmed = strRaw.trim();	
		}
		if(strTrimmed !== null && strTrimmed !== ""){
			
			//use the textbox's string.
			return strTrimmed;
			
		}else{
			
			/*
			if(qryRefRadLinear.prop("checked") === true){
				return qryRefRadLinear.val();
			}else if(qryRefRadSwing.prop("checked") === true){
				return qryRefRadSwing.val();
			}else{
				alert("\"Easing Mode\" input ignored: nothing selected.  Selecting default.");
				qryRefRadLinear.prop("checked", true);
				return "linear";
			}
			*/

			alert("\"Easing Mode\" input ignored: blank.  Using default.");
			qryRefTxtEasing.val("linear");
			return "linear";
		}
		
	}//END OF getEasingMode()
	
	
	/*
	Purpose: move a given JQuery reference (HTML element) to the given X and Y coords instantly (no animation, UNLESS a nearby checkbox is ticked).
	Parameters: JQuery reference, coordinate pair
	Return: none
	*/
	function moveToLocationChoice(arg_qryRef, arg_x, arg_y){
		var blnUseAnimationChecked = $("#chkAnimation").prop("checked");
		
		if(!blnUseAnimationChecked){
			//no animation, move instantly as usual.		
			moveToLocation(arg_qryRef, arg_x, arg_y);
		}else{
			//If animation is allowed, move with the existing animation function.  Implied that the "movement" row is choosing to do this, so sending the movement's "disable" & "enable" methods.
			animateMoveQryRefToLocation(arg_qryRef, arg_x, arg_y, movementDisable, movementEnable);
		}
		
		
	}//END OF moveToLocation(...)
	
	
	/*
	Purpose: move a given JQuery reference (HTML element) to the given X and Y coords instantly (no animation).
	Parameters: JQuery reference, coordinate pair
	Return: none
	*/
	function moveToLocation(arg_qryRef, arg_x, arg_y){
				
		if(arg_x === null && arg_y === null){
			//both coords null? can't really do anything with this information.
			
		}if(arg_x === null){
			//adjust the Y only:
			arg_qryRef.css( {top: arg_y + "px"} );
		
		}else if(arg_y === null){
			//adjust the X only:
			arg_qryRef.css( {left: arg_x + "px"} );
		}else{
			//both coords given, so adjust both.
			arg_qryRef.css( {left:arg_x + "px", top: arg_y + "px"} );
		}
		
	}//END OF moveToLocation(...)
	
	
	
	
	
	/*
	Purpose: given a JQuery reference (to a HTML element) and some destination coords (null  means relative; no movement on that axis), let the JQuery reference glide from its current location to the destination (or on either axis).  Also, this will then call the appropriate (given) disable & enable methods to disallow the user from starting a new animation until the current one has finished (or the row is reset).
	Parameters: JQuery reference, coordinate pair
	Return: none
	*/
	function animateMoveQryRefToLocation(arg_qryRef, arg_x, arg_y, arg_fcnDisableCall, arg_fcnEnableCall){
		
		var intTime = attemptReadTime();
		var strEasingMode = getEasingMode();
		
		var fltTempDeltaX = 0;
		var fltTempDeltaY = 0;
		
		//If an argument is null, it means don't do any movement in that axis.  A null X and a provided Y would let the given QryRef glide to the given Y coord, preserving the X (only up & down movement).
		if(arg_x !== null){
			fltTempDeltaX = Math.abs(parseFloatPx(arg_qryRef.css("left")) - (arg_x));
		}
		if(arg_y !== null){
			fltTempDeltaY = Math.abs(parseFloatPx(arg_qryRef.css("top")) - (arg_y));
		}
		if(fltTempDeltaX > 1 || fltTempDeltaY > 1){
			//if we're going to glide at all, do this.
			arg_fcnDisableCall();
			arg_qryRef.stop(true, true, false);
				
			
			if(fltTempDeltaX > 1 && fltTempDeltaY > 1){
				arg_qryRef.animate({left: arg_x, top: arg_y}, intTime, strEasingMode, arg_fcnEnableCall);
			}else if(fltTempDeltaX > 1  ){
				arg_qryRef.animate({left: arg_x}, intTime, strEasingMode, arg_fcnEnableCall);
			}else if(fltTempDeltaY > 1  ){
				arg_qryRef.animate({top: arg_y}, intTime, strEasingMode, arg_fcnEnableCall);
			}else{
				
				//noting possible.	
			}
			
		}//END OF "or" check
		
	}//END OF animateMoveQryRefToLocation(...)
	
	
	
	
	
	/*
	Purpose: reset a test div (one of the squares in a row for testing effects on) by using a few CSS edits to gather the absolute position and place it in its original spot with absolute coords (centered in its box).
	Parameters: none
	Return: none
	*/
	function specialReset(arg_qryRef){
		
		arg_qryRef.stop(true, true, false);
		arg_qryRef.hide();
		arg_qryRef.show();
		
		//position at the start of the page load was this.
		arg_qryRef.css( {position: "static"});
		//Looks like changing "position" to "absolute" makes the "display" CSS property become "block".  Resetting to the original "inline-block"...
		arg_qryRef.css( {display: "inline-block"});
		
		

		var absPos = getAbsoluteCoords( arg_qryRef );
		arg_qryRef.css( {position: "absolute"});
		moveToLocation(arg_qryRef, absPos[0], absPos[1]);
		
		return absPos;
	}
	
	
	
	
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// 6. UTILITY METHODS ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////


	
	/*
	Purpose: get the coordinates of a "relative" positioned element on screen by traveling up its containers and accounting for border-influence.
	***heavily based off of this stack overflow question's solution:
http://stackoverflow.com/questions/1480133/how-can-i-get-an-objects-absolute-position-on-the-page-in-javascript
	Parameters: jquery reference
	Return: none
	
	*/
	function getAbsoluteCoords(arg_qryRef){
		
		var x = 0.0;
		var y = 0.0;
		
		//start with this.
		var qryRefCurrent = arg_qryRef;
		
		while(true){
			
			if(qryRefCurrent === null){
				//done here.
				break;	
			}
			
			var tryX = qryRefCurrent.prop("offsetLeft");
			var tryY = qryRefCurrent.prop("offsetTop");
			
			
			//alert(tryX + " " + tryY);
			
			//var borderVWidth = parseFloatPx(qryRefCurrent.css("border-top-width"));
			var borderWidth = parseFloatPx(qryRefCurrent.css("border-left-width"));
			
			
			var padding = parseFloatPx(qryRefCurrent.css("padding-left"));
			var margin = parseFloatPx(qryRefCurrent.css("margin-left"));
			
			
			//PRINTOUT:::
			//alert("ID " + qryRefCurrent.attr("id") + " Class: " + qryRefCurrent.attr("class") + " border " + borderWidth + " mar " + margin + " pad " + padding + " bkgcolor: " + qryRefCurrent.css("background-color") );
			
			//parseIntPx(borderWidth);
			
			if(qryRefCurrent !== arg_qryRef){
				//This is any element other than the start one up the heirarchy of elements that factor into the start's position.
				if(!isNaN(tryX)){
					x += tryX + borderWidth + 0;
				}
				if(!isNaN(tryY)){
					y += tryY + borderWidth + 0;
				}
			}else{
				//This means it is the original element.
				if(!isNaN(tryX)){
					x += tryX + borderWidth + padding+ -margin*1 ;
				}
				if(!isNaN(tryY)){
					y += tryY + borderWidth + padding + -margin*1;
				}
			}
			
			//alert("X " + x);
			
			//alert("Before: " + qryRefCurrent);
			qryRefCurrent = qryRefCurrent.prop("offsetParent");
			
			if(qryRefCurrent === null){
				//done here.
				break;	
			}else{
				qryRefCurrent = $(qryRefCurrent);
			}
			
			//alert("After: " + qryRefCurrent);
		}//END OF while(true)
		
		
		//var padExtraX 
		
		
		return [x, y];
		
	}//END OF getAbsoluteCoords(...)
	
	
	
	/*
	Purpose: given a string ending in "px" with a number in front, remove "px" and parse as a float.  Ideal for getting numbers out of CSS attributes.
	Parameters: string (#px)
	Return: none
	*/
	function parseFloatPx(arg_strSrc){
		
		if(arg_strSrc === null || arg_strSrc === ""){
			//arg sent missing?  just give up, nothing there.
			return 0;
		}
		
		var strToParse;
		
		var fltTestIndex = arg_strSrc.indexOf("px");
		if(fltTestIndex !== -1){
			//cut off "px".
			strToParse = arg_strSrc.substring(0, fltTestIndex);
		}else{
			//no "px"? trust it as it came.
			strToParse = arg_strSrc;	
		}
		
		var fltReturn = parseFloat(strToParse, 10);
		
		//alert("GIVEN: " + arg_strSrc + " RESULT: " + fltReturn);
		return fltReturn;
	}
	
	
	
	/*
	Purpose: get the width & height CSS properties of an element, send as a pair (array of size 2)
	Parameters: none
	Return: none
	*/
	function getSize(arg_qryRef){
		var w = 0.0;
		var h = 0.0;	
		
		w = parseFloatPx(arg_qryRef.css("width"));
		h = parseFloatPx(arg_qryRef.css("height"));
		return [w, h];
	}
	

});//end of document.ready

	