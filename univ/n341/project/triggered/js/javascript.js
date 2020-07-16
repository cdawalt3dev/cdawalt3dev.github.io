
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 2 November 2016
 PURPOSE: see triggered.html
 MODIFICATION HISTORY:
 Original Build.
 */
 

$(document).ready(function(){
	"use strict";
	
	//can start by initializing startup events.
	initStartupWindowEvents();
	initInputWindowEvents();
	
	//Global vars.  These vars represent one "row" of the event table.
	//Each "row" represents a different type of event, and each of the 3 columns tells whether the event registered for the window, the document, or the sample element below the table.
	var loadEventRow;
	var resizeEventRow;
	var keyPressRow;
	var keyDownRow;
	var mouseMoveRow;
	var mouseDownRow;
	
	var readyEventRow;
	var keyUpRow;
	var clickEventRow;
	var mouseUpRow;
		
	
	
	
	/*
	Purpose: EventRow-Type constructor.  Receives 3 selectors strings to get the display label of each of the expected categories for events (window, document, sample element) and uses them to derive other related things (namely, the two accompanying images that change to show an event has recently fired).
	Parameters: 3 strings (selectors for the display labels, one per column)
	Return: (with "new") and object of "EventRow" type.
	*/
	function EventRow(arg_strWindowEventSelector, arg_strDocumentEventSelector, arg_strElementEventSelector){
		
		//At creation, map the selectors to some instance vars and derive the appropriate images from the hierarchy.
		
		//temp array for storing the result of "getCorrespondingImages".
		var ary_qryRefTemp;
		
		//display labels.
		this.qryRefWindowEventLabel = $(arg_strWindowEventSelector);
		this.qryRefDocumentEventLabel = $(arg_strDocumentEventSelector);
		this.qryRefElementEventLabel = $(arg_strElementEventSelector);
		
		//the 1st ([0]) is the one for off, 2nd ([1]) for on.
		ary_qryRefTemp = getCorrespondingImages(this.qryRefWindowEventLabel);
		this.qryRefWindowEventImgOff = ary_qryRefTemp[0];
		this.qryRefWindowEventImgOn = ary_qryRefTemp[1];
		
		ary_qryRefTemp = getCorrespondingImages(this.qryRefDocumentEventLabel);
		this.qryRefDocumentEventImgOff = ary_qryRefTemp[0];
		this.qryRefDocumentEventImgOn = ary_qryRefTemp[1];
		
		ary_qryRefTemp = getCorrespondingImages(this.qryRefElementEventLabel);
		this.qryRefElementEventImgOff = ary_qryRefTemp[0];
		this.qryRefElementEventImgOn = ary_qryRefTemp[1];
		
		
		
		
		/*
		Purpose: each event may quickly show the check mark and hide the red X when an event fires, as well as fade back from showing the check, hiding the X to showing the X, hiding the check (so that firing repeatedly is noticable).
		*One per column for window, doc, & element.
		Parameters: none
		Return: none
		*/
		this.flashWindowEventCheckMark = function(){
			fadeExchange(this.qryRefWindowEventImgOff, this.qryRefWindowEventImgOn);
			this.updateImgPositions();
		};
		this.flashDocumentEventCheckMark = function(){
			fadeExchange(this.qryRefDocumentEventImgOff, this.qryRefDocumentEventImgOn);
			this.updateImgPositions();
		};
		this.flashElementEventCheckMark = function(){
			fadeExchange(this.qryRefElementEventImgOff, this.qryRefElementEventImgOn);
			this.updateImgPositions();
		};
		
		
		
		/*
		Purpose: for events that only occur at or near startup once, the check may be shown in palce of the X permanently instead.  Also once for each of the columns.
		Parameters: none
		Return: none
		*/
		this.showWindowEventCheckMark = function(){
			this.qryRefWindowEventImgOff.css({opacity:0});
			this.qryRefWindowEventImgOn.css({opacity:1});
			this.updateImgPositions();
		};
		this.showDocumentEventCheckMark = function(){
			this.qryRefDocumentEventImgOff.css({opacity:0});
			this.qryRefDocumentEventImgOn.css({opacity:1});
			this.updateImgPositions();
		};
		this.showElementEventCheckMark = function(){
			this.qryRefElementEventImgOff.css({opacity:0});
			this.qryRefElementEventImgOn.css({opacity:1});
			this.updateImgPositions();
		};
		
		
		
		/*
		Purpose: same as "flashWindowEventCheckMark", but accepts a string to change the display text to.  Good for reading-in something relevant, such as the coords for a mouse event or the keycode / char of a key event.
		Parameters: text to display (string)
		Return: none
		*/
		this.flashWindowEventCheckMarkWithText = function(arg_strMessage){
			fadeExchange(this.qryRefWindowEventImgOff, this.qryRefWindowEventImgOn);
			this.qryRefWindowEventLabel.text(arg_strMessage);
			this.updateImgPositions();
		};
		this.flashDocumentEventCheckMarkWithText = function(arg_strMessage){
			fadeExchange(this.qryRefDocumentEventImgOff, this.qryRefDocumentEventImgOn);
			this.qryRefDocumentEventLabel.text(arg_strMessage);
			this.updateImgPositions();
		};
		this.flashElementEventCheckMarkWithText = function(arg_strMessage){
			fadeExchange(this.qryRefElementEventImgOff, this.qryRefElementEventImgOn);
			this.qryRefElementEventLabel.text(arg_strMessage);
			this.updateImgPositions();
		};
		
		
		/*
		Purpose: same as "showWindowEventCheckMark", accepts a text argument to show nearby.
		Parameters: text to display (string)
		Return: none
		*/
		this.showWindowEventCheckMarkWithText = function(arg_strMessage){
			this.qryRefWindowEventImgOff.css({opacity:0});
			this.qryRefWindowEventImgOn.css({opacity:1});
			this.qryRefWindowEventLabel.text(arg_strMessage);
			this.updateImgPositions();
		};
		this.showDocumentEventCheckMarkWithText = function(arg_strMessage){
			this.qryRefDocumentEventImgOff.css({opacity:0});
			this.qryRefDocumentEventImgOn.css({opacity:1});
			this.qryRefDocumentEventLabel.text(arg_strMessage);
			this.updateImgPositions();
		};
		this.showElementEventCheckMarkWithText = function(arg_strMessage){
			this.qryRefElementEventImgOff.css({opacity:0});
			this.qryRefElementEventImgOn.css({opacity:1});
			this.qryRefElementEventLabel.text(arg_strMessage);
			this.updateImgPositions();
		};
		
		
		/*
		Purpose: Updates the image positions of each row, called at screen resize.  This is because the check images have "absolute" positions (to be placed on top of X images), and zooming in / out puts them out of sync otherwise.
		Parameters: none
		Return: none
		*/
		this.updateImgPositions = function(){
			//only re-position the floating check images if they are visible at all (opacity > 0).
			if(this.qryRefWindowEventImgOn.css("opacity") > 0){
				placeOnTop(this.qryRefWindowEventImgOn, this.qryRefWindowEventImgOff);
			}
			if(this.qryRefDocumentEventImgOn.css("opacity") > 0){
				placeOnTop(this.qryRefDocumentEventImgOn, this.qryRefDocumentEventImgOff);
			}
			if(this.qryRefElementEventImgOn.css("opacity") > 0){
				placeOnTop(this.qryRefElementEventImgOn, this.qryRefElementEventImgOff);
			}
		};
		this.updateImgPositions();
		//go ahead and call it at creation.
		
		
		
		
		//show all images, the use of "hide" or "hidden" has been disallowed to stop an offset in the label's position from occurring.  Setting opacity to "0" to hide lacks this side effect.
		this.qryRefWindowEventImgOn.show();
		this.qryRefDocumentEventImgOn.show();
		this.qryRefElementEventImgOn.show();
		
		this.qryRefWindowEventImgOn.css({opacity:0});
		this.qryRefDocumentEventImgOn.css({opacity:0});
		this.qryRefElementEventImgOn.css({opacity:0});
		
		
		
		
		/*
		Purpose: Flash the check image, and update this column's label with relative mouse coords (for window & document, just the page's raw coords, but the sample element uses coords relative to its top-left corner as an origin).
		Parameters: the mouse event
		Return: none
		*/
		this.displayWindowEventRelativeCoords = function(e){
			//NOTE: $(window) and $(document)'s ".offset()" call returns "undefined".
			this.flashWindowEventCheckMarkWithText("(coords: " + e.pageX + ", " + e.pageY + ")");
		};
		this.displayDocumentEventRelativeCoords = function(e){
			this.flashDocumentEventCheckMarkWithText("(coords: " + e.pageX + ", " + e.pageY + ")");
		};
		this.displayElementEventRelativeCoords = function(e){
			var offsetTemp = $("#divTest").offset();
			var intRelativeX = Math.round(e.pageX - offsetTemp.left);
			var intRelativeY = Math.round(e.pageY - offsetTemp.top);
			this.flashElementEventCheckMarkWithText("coords: (" + intRelativeX + ", " + intRelativeY + ")");
		};
		
		
		
		/*
		Purpose: for the window object, show the size (width & height) on a resize.  Document & elements do not utilize the "load" event.
		Parameters: none
		Return: none
		*/
		this.displayWindowEventSize = function(){
			this.flashWindowEventCheckMarkWithText("(winsize: " + $( window ).width() + ", " + $( window ).height() + ")");
		};
		
		
		
		/*
		Purpose: Flash the check image and show the "charCode" typed.  That's the ASCII of the raw character typed (or would be typed) to screen.
		Parameters: the key event
		Return: none
		*/
		this.displayWindowEventCharCode = function(e){
			this.flashWindowEventCheckMarkWithText("(charCode: " + e.charCode + " \"" + parseASCIIInt(e.charCode) + "\")");
		};
		this.displayDocumentEventCharCode = function(e){
			this.flashDocumentEventCheckMarkWithText("(charCode: " + e.charCode + " \"" + parseASCIIInt(e.charCode) + "\")");
		};
		this.displayElementEventCharCode = function(e){
			this.flashElementEventCheckMarkWithText("(charCode: " + e.charCode + " \"" + parseASCIIInt(e.charCode) + "\")");
		};
		
		
		
		/*
		Purpose: Flash the check image and show the "keyCode" typed.  Note that keyCode has information only related to the key pressed (assumes the capital of any letter-keys), and is not influenced by Shift or capslock.
		Return: none
		*/
		this.displayWindowEventKeyCode = function(e){
			this.flashWindowEventCheckMarkWithText("(keyCode: " + e.keyCode + ")");
		};
		this.displayDocumentEventKeyCode = function(e){
			this.flashDocumentEventCheckMarkWithText("(keyCode: " + e.keyCode + ")");
		};
		this.displayElementEventKeyCode = function(e){
			this.flashElementEventCheckMarkWithText("(keyCode: " + e.keyCode + ")");
		};
		
		
	}//END OF EventRow constructor.
	
	
	
	
	
	/*
	Purpose: called at window startup.  Well, what a coincidence.  This is an acceptable event for the assignment.  Also sets up the input events (those should wait for "load" to finish at least).
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		
		//initInputWindowEvents();
		
		//the documents's "ready" had to have fired, as all Javascript is contained by its ready event.
		
		
		readyEventRow.showDocumentEventCheckMarkWithText("Occurred!");
		
		loadEventRow.showWindowEventCheckMarkWithText("Occurred!");
		
	});//end of window.load
	
	
	
	
	
	
	
	/*
	Purpose: take two elements.  Fade the first in and the other one out at the same time (if overlapping, this makes a transition effect, ideally for a recently shown checkmark back to an X
	Parameters: 2 JQuery references
	Return: none
	*/
	function fadeExchange(arg_qryRefStart, arg_qryRefEnd){
		smartFadeIn(arg_qryRefStart);
		smartFadeOut(arg_qryRefEnd);
	}
	
	
	
	
	/*
	Purpose: take the given element, reset any fade in progress (min-opacity) and start fading from that to opaque.
	Parameters: JQuery reference
	Return: none
	*/
	function smartFadeIn(arg_qryRef){
		
		arg_qryRef.stop(true, true, false);
		
		//.hide()
		arg_qryRef.css({opacity:0});
		arg_qryRef.animate({opacity:1}, 700, "swing", null);
		
	}
	
	/*
	Purpose: take the given element, reset any fade in progress (max-opacity) and start fading from that to invisible.
	Parameters: JQuery reference
	Return: none
	*/
	function smartFadeOut(arg_qryRef){
		
		arg_qryRef.stop(true, true, false);
		
		//arg_qryRef.show();
		arg_qryRef.css({opacity:1});
		arg_qryRef.animate({opacity:0}, 700, "swing", null);
		
	}
	
	
	/*
	Purpose: Get the corresponding image elements of a given text element.  This method is to be used with elements that have two "img" sibling that come before them (or, the first in the groups of 3 expected: 2 img's & "a")
	Parameters: JQuery reference
	Return: the corresponding image.
	*/
	function getCorrespondingImages(arg_qryRef){
		
		
		
		//var qryRefImg = arg_qryRef.parent().children(":first");
		
		
		var qryRefImg = arg_qryRef.parent().parent().children(":first");
		var qryRefImgNext = qryRefImg.next();
		return [qryRefImg, qryRefImgNext];
	}
	
	
	
	
	/*
	Purpose: place the 1st reference on top of the 2nd, by making the first have an "absolute" position that matches that of the 2nd.
	Parameters: 2 JQuery references
	Return: none
	*/
	function placeOnTop(arg_qryRefMove, arg_aryRefTarget){
		
		var ary_coords = getAbsoluteCoords(arg_aryRefTarget);
		
		arg_qryRefMove.css( {position: "absolute"});
		
		arg_qryRefMove.css( {left: ary_coords[0]+"px", top: ary_coords[1]+"px"});
		
		//new coords.
		//arg_qryRefMove.prop("left", ary_coords[0]);
		//arg_qryRefMove.prop("top", ary_coords[1]);
		
	}
	
	
	/*
	Purpose: get the location of the 2nd qryRef, and move the 1st "arg_intX" & "arg_intY" to an absolute position away from there.
	Parameters: 2 JQuery references, 2 ints (relative x,y)
	Return: none
	*/
	function moveDistAway(arg_qryRefMove, arg_qryRefReference, arg_intX, arg_intY){
		
		arg_qryRefMove.css( {position: "absolute"});
		
		alert(arg_qryRefMove.text());
		
		var fltReferenceX = parseFloatPx( arg_qryRefReference.css("left"));
		var fltReferenceY = parseFloatPx( arg_qryRefReference.css("top"));
		
		var intResultX = Math.round(fltReferenceX + arg_intX);
		var intResultY = Math.round(fltReferenceY + arg_intY);
		
		//var intResultX = fltReferenceX + 0;
		//var intResultY = fltReferenceY + 0;
		
		
		
		arg_qryRefMove.css( {left:intResultX + "px", top: intResultY + "px"} );
	}
	
	
	
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
			
			var borderWidth = parseFloatPx(qryRefCurrent.css("border-left-width"));
			
			
			
			//var padding = parseFloatPx(qryRefCurrent.css("padding"));
			//var margin = parseFloatPx(qryRefCurrent.css("margin"));
			//alert("border " + borderWidth + " mar " + margin + " pad " + padding);
			
			//parseIntPx(borderWidth);
			
			
			if(!isNaN(tryX)){
				x += tryX + borderWidth;
			}
			if(!isNaN(tryY)){
				y += tryY + borderWidth;
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
	Purpose: absolute-positioned elements change undesirably when the screen zooms in / out.  This re-adjusts the floating absolute-positioned elements (visible ones are affected).
	Parameters: none
	Return: none
	*/
	
	function updateRowImages(){
		loadEventRow.updateImgPositions();
		resizeEventRow.updateImgPositions();
		
		keyPressRow.updateImgPositions();
		keyDownRow.updateImgPositions();
		mouseMoveRow.updateImgPositions();
		mouseDownRow.updateImgPositions();
		
		readyEventRow.updateImgPositions();
		keyUpRow.updateImgPositions();
		clickEventRow.updateImgPositions();
		mouseUpRow.updateImgPositions();
				
	}
	
	
	
	
	
	/*
	Purpose: initialize all startup events.  Fill the row vars with instances of "EventRow" with 3 selectors (to match the display labels in the columns of that row).  Then setup most of the relevant events to refer to these rows for updating on event calls.
	Parameters: none
	Return: none
	*/
	function initStartupWindowEvents(){
		
		
		readyEventRow = new EventRow("#lblWindowReady", "#lblDocumentReady", "#lblElementReady");
		loadEventRow = new EventRow("#lblWindowLoad", "#lblDocumentLoad", "#lblElementLoad");
		resizeEventRow = new EventRow("#lblWindowResize", "#lblDocumentResize", "#lblElementResize");
		
		$(window).ready(function(){
			readyEventRow.showWindowEventCheckMarkWithText("Occurred!");
		});
		//note: "$(document).ready" already set up.  Encapsulates the whole program, in fact.
		$("#divTest").ready(function(){
			readyEventRow.showElementEventCheckMarkWithText("Occurred!");
		});
		
			
		//note: "$(window).load" was already set up and called by this point.  Also, "document" and elements don't seem to utilize the "load" event.
		$(document).load(function(){
			loadEventRow.showDocumentEventCheckMarkWithText("Occurred!");
		});
		$("#divTest").load(function(){
			loadEventRow.showElementEventCheckMarkWithText("Occurred!");
		});
		
		
		$(window).resize(function(){
			//also responsible for coordinating the floating "absolute" position'd check mark images to the hard X's.
			updateRowImages();
			
			resizeEventRow.displayWindowEventSize();
		});//END OF resize(...)
		$(document).resize(function(){
			resizeEventRow.flashDocumentEventCheckMarkWithText("Occurred!");
		});
		$("#divTest").resize(function(){
			resizeEventRow.flashElementEventCheckMarkWithText("Occurred!");
		});	
		
		
	}
	
	
	
	/*
	Purpose: same, but for input events.  Handled separately so that these may be covered later (somewhat dependent on having loaded).
	**  ANTIQUATED PURPOSE: no longer seems to be a need for this discrepency.  No harm done though.
	Parameters: none
	Return: none
	*/
	function initInputWindowEvents(){
		
		
		
		keyUpRow = new EventRow("#lblWindowKeyUp", "#lblDocumentKeyUp", "#lblElementKeyUp");
		keyPressRow = new EventRow("#lblWindowKeyPress", "#lblDocumentKeyPress", "#lblElementKeyPress");
		keyDownRow = new EventRow("#lblWindowKeyDown", "#lblDocumentKeyDown", "#lblElementKeyDown");
		clickEventRow = new EventRow("#lblWindowClick", "#lblDocumentClick", "#lblElementClick");
		mouseMoveRow = new EventRow("#lblWindowMouseMove", "#lblDocumentMouseMove", "#lblElementMouseMove");
		mouseDownRow = new EventRow("#lblWindowMouseDown", "#lblDocumentMouseDown", "#lblElementMouseDown");
		mouseUpRow = new EventRow("#lblWindowMouseUp", "#lblDocumentMouseUp", "#lblElementMouseUp");
			
			
		
		
		$(window).keypress(function(e){
			keyPressRow.displayWindowEventCharCode(e);
		});//END OF resize(...)
		$(document).keypress(function(e){
			keyPressRow.displayDocumentEventCharCode(e);
		});
		$("#divTest").keypress(function(e){
			keyPressRow.displayElementEventCharCode(e);
		});
		
		
		
		$(window).keydown(function(e){
			keyDownRow.displayWindowEventKeyCode(e);
		});//END OF resize(...)
		$(document).keydown(function(e){
			keyDownRow.displayDocumentEventKeyCode(e);
		});
		$("#divTest").keydown(function(e){
			keyDownRow.displayElementEventKeyCode(e);
		});
		
		
		
		$(window).keyup(function(e){
			keyUpRow.displayWindowEventKeyCode(e);
		});//END OF resize(...)
		$(document).keyup(function(e){
			keyUpRow.displayDocumentEventKeyCode(e);
		});
		$("#divTest").keyup(function(e){
			keyUpRow.displayElementEventKeyCode(e);
		});
		
		
		
		
		$(window).mousemove(function(e){
			mouseMoveRow.displayWindowEventRelativeCoords(e);
		});//END OF resize(...)
		$(document).mousemove(function(e){
			mouseMoveRow.displayDocumentEventRelativeCoords(e);
		});
		$("#divTest").mousemove(function(e){
			mouseMoveRow.displayElementEventRelativeCoords(e);
		});
		
		$(window).mousedown(function(e){
			mouseDownRow.displayWindowEventRelativeCoords(e);
		});//END OF resize(...)
		$(document).mousedown(function(e){
			mouseDownRow.displayDocumentEventRelativeCoords(e);
		});
		$("#divTest").mousedown(function(e){
			mouseDownRow.displayElementEventRelativeCoords(e);
		});
		
		
		
		$(window).mouseup(function(e){
			mouseUpRow.displayWindowEventRelativeCoords(e);
		});//END OF resize(...)
		$(document).mouseup(function(e){
			mouseUpRow.displayDocumentEventRelativeCoords(e);
		});
		$("#divTest").mouseup(function(e){
			mouseUpRow.displayElementEventRelativeCoords(e);
		});
		
		
		$(window).click(function(e){
			clickEventRow.displayWindowEventRelativeCoords(e);
		});//END OF resize(...)
		$(document).click(function(e){
			clickEventRow.displayDocumentEventRelativeCoords(e);
		});
		$("#divTest").click(function(e){
			clickEventRow.displayElementEventRelativeCoords(e);
		});
		
		
		
		
		
	}//END OF initInputWindowEvents()
	
	
	
	
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
