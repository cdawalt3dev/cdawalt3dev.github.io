
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: Day Month Year
 PURPOSE: see pick_me.html, this does the work.
 MODIFICATION HISTORY:
 Original Build.
 
 */
 


$(document).ready(function(){
	"use strict";
	
	
	
	var ary_qryRef_RecentSelection = null;
	
	//saved this way in case of non-standard ASCII incompatibility.
	var strCheckmark = parseASCIIInt(10004);
	
	//These are lists of acceptable start search terms.  This disallows the user from highlighting things not on the table, which would cause issues with the check-heirarchy-logic (2 levels up the tree, first child changed to a checkmark won't bode well for unexpected elements)
	var ary_str_legalTag = [ "h2", "p", "h3", "sup", "img"   ];
	var ary_str_legalID = [ "Larry", "Susan", "Tom", "Gerald", "Harold", "Lewis", "Alex", "Carol", "Slacker", "RedBeard" ];
	var ary_str_legalClass = [ "Scrubber", "Buccaneer", "Sabeteur", "Comedian", "Captain"  ];
	
	var strErrorTag = "The only tags for selection allowed are h2, h3, p, sup, & img.";
	var strErrorClass = "The only classes for selection allowed are Scrubber, Buccaneer, Sabeteur, Comedian, & Captain (case sensitive).";
	var strErrorID = "Pick one of the ID's above, case sensitive.";
				
				
				
	
	
	
	/*
	Purpose: called at window startup.  Can start with a prompt or initialize features that need it by script.
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		
		clearInput();
		
		fillInstructions();
		
		
	});//end of window.load
	
	
	
	/*
	Purpose: Fill the read-only "instructions" text boxes of the 2nd selection-button table at the bottom of the window.
	Parameters: none
	Return: none
	*/
	function fillInstructions(){
		
		$("#txtApplyMulti").prop("value", "{background-color: red, font-size: 34px, float:right} & append \"!!!\"");
		
		
		$("#txtSelectTagFiltered").prop("value", "h2:even");
		$("#txtSelectClassFiltered").prop("value", "P.Scrubber:last"); 
		$("#txtSelectIDFiltered").prop("value", "#\"Whole Table\".children(\":last\").children(\":last\").children(\":last\").children(\":last\")");
		
		/*
		var ary_qryRef_selection = $("h2:even");
		var ary_qryRef_selection = $(".Scrubber:last");
		var ary_qryRef_selection = $( $("#WholeTable").children(":last").children(":last").children(":last").children(":last") ) ;
		*/
		
		
	}
	
	
	
	
	
	
	
	/*
	Purpose: SelectTag button click method.  Selects all of a particular tag given in the nearby textbox.
	Parameters: none
	Return: none
	*/
	$("#btnSelectTag").click(function(){
		
		
		var strSelector = attemptGetText( $("#txtSelectTag"), "Select By Tag", 1 );
		var ary_qryRef_selection = null;
		
		if(strSelector !== null){
			ary_qryRef_selection = $(strSelector);
			
			if(ary_qryRef_selection === null || ary_qryRef_selection.length === 0){
				alert("WARNING: Nothing selected.  Selections are often case sensitive.");
			}else{
				
				showSelection( ary_qryRef_selection );
				
				
			}
			
		}//END OF if(strSelector != null)
		
		
		//var ary_qryRef = 
		
	});
	
	
	/*
	Purpose: SelectClass button click method.  Selects all of a particular class given in the nearby textbox.
	Parameters: none
	Return: none
	*/
	$("#btnSelectClass").click(function(){
		
		var strSelector = attemptGetText( $("#txtSelectClass"), "Select By Class", 2 );
		var ary_qryRef_selection = null;
		
		if(strSelector !== null){
			ary_qryRef_selection = $("."+strSelector);
			
			if(ary_qryRef_selection === null || ary_qryRef_selection.length === 0){
				alert("WARNING: Nothing selected.  Selections are often case sensitive.");
			}else{
				
				showSelection( ary_qryRef_selection );
				
			}
		}//END OF if(strSelector != null)
		
	});
	
	
	/*
	Purpose: SelectID button click method.  Selects the tag of a particular ID given in the nearby textbox.
	Parameters: none
	Return: none
	*/
	$("#btnSelectID").click(function(){
		
		var strSelector = attemptGetText( $("#txtSelectID"), "Select By ID", 3 );
		var ary_qryRef_selection = null;
		
		if(strSelector !== null){
			ary_qryRef_selection = $("#"+strSelector);
			
			if(ary_qryRef_selection === null || ary_qryRef_selection.length === 0){
				alert("WARNING: Nothing selected.  Selections are often case sensitive.");
			}else{
				
				
				showSelection( ary_qryRef_selection );
				
			}
		}//END OF if(strSelector != null)
		
	});
	
	
	
	
	
	
	
	
	/*
	Purpose: Try to get the text from the (given) nearby input textbox.
	Parameters: arg_qryRef (input textbox), arg_refName (what to refer to in an error), arg_extraRestriction (type of restriction to impose on input, 1 - 3)
	Return: null (failure), string (passed)
	*/
	function attemptGetText(arg_qryRef, arg_refName, arg_extraRestriction){
		
		
		var strRaw = arg_qryRef.prop("value");
		
		var strRawTrimmed = strRaw.trim();
		
		if(strRawTrimmed === ""){
			alert("The accompanying textbox to \"" + arg_refName + "\" is blank.");
			//failure.
			return null;
		}
		
		
		if(startsWith(strRawTrimmed, ".")){
			if(arg_extraRestriction === 2){
				//okay.  Just remove from the front.
				strRawTrimmed = strRawTrimmed.substring(1, strRawTrimmed.length);
			}else{
				alert("WARNING: only class selections may begin with periods!");
				return null;
			}
		}
		if(startsWith(strRawTrimmed, "#")){
			if(arg_extraRestriction === 3){
				//okay.  Just remove from the front.
				strRawTrimmed = strRawTrimmed.substring(1, strRawTrimmed.length);
			}else{
				alert("WARNING: only ID selections may begin with #");
				return null;
			}
		}
		
		
		
		
		if(arg_extraRestriction){
			var strRawTrimmedLower = strRawTrimmed.toLowerCase();
			
			var ary_str_restrictionList = null;
			switch(arg_extraRestriction){
				case 1:
					//what is acceptable for a tag selection?
					ary_str_restrictionList = ary_str_legalTag;
				break;
				case 2:
					//what is acceptable for a class selection?
					ary_str_restrictionList = ary_str_legalClass;
				break;
				case 3:
					//what is acceptable for an ID selection?
					ary_str_restrictionList = ary_str_legalID;
				break;
			}
			
			
			var strCompare;
			
			//only #1, tags, is case-insensitive (always compare two lowercase things).
			if(arg_extraRestriction === 1){
				strCompare = strRawTrimmedLower;	
			}else{
				//otherwise, preserve case.
				strCompare = strRawTrimmed;	
			}
			
			
			
			var bolPassed = false;
			for(var i = 0; i < ary_str_restrictionList.length; i++){
				
				var strCompareTo;
				//always okay.  Even for exraRestriction #1, we're comparing against lowercase tag names.
				strCompareTo = ary_str_restrictionList[i];
				
				if(startsWith(strCompare, ary_str_restrictionList[i]) ){
					bolPassed = true;
				}
			}
			
			
			
			if(!bolPassed){
				//pick an error to show the user in case of failure.
				switch(arg_extraRestriction){
					case 1:
						alert(strErrorTag);
					break;
					case 2:
						alert(strErrorClass);
					break;
					case 3:
						alert(strErrorID);
					break;
				}
				return null;
			}
			
		}
		
		
		
		//pass.
		return strRawTrimmed;
		
	}
	
	
	
	
	
	
	/*
	Purpose: ApplyMulti button click method.  From the most recent selection (notifies the user if there is none), take that selection and apply 3 predefined steps in CSS and one append (3 exclamation marks).
	Parameters: none
	Return: none
	*/
	$("#btnApplyMulti").click(function(){
		//clearSelection();
		
		
		//$("#txtApplyMulti").prop("value", "{background-color: red, font-size: 34px, float:right}");
		
		if(ary_qryRef_RecentSelection !== null){
			
			ary_qryRef_RecentSelection.css({
				backgroundColor: "#FF0000",
				fontSize: "34px",
				float: "right"
				
			}).append("!!!");
		}else{
			alert("NOTE:  Please make a successful CSS selection first.");	
		}
		
		
		
	
	});
	
	
	/*
	Purpose: SelectTagFiltered button click method.  Hard-coded selection.  From all "h2" tags, select those with an "even" index in the resulting list (counting starts at 0, and counts "0" as even).
	Parameters: none
	Return: none
	*/
	$("#btnSelectTagFiltered").click(function(){
		
		var ary_qryRef_selection = $("h2:even");
		
		showSelection(ary_qryRef_selection);
		
	});
	
	
	/*
	Purpose: SelectClassFiltered button click method.  Hard-coded selection.  Selects the last element of the "Scrubber" Class's selection. 
	Parameters: none
	Return: none
	*/
	$("#btnSelectClassFiltered").click(function(){
		
		var ary_qryRef_selection = $(".Scrubber:last");
		
		showSelection(ary_qryRef_selection);
		
	});
	
	/*
	Purpose: SelectionIDFiltered button click method.  Hard-coded selection.  A bit unorthodox as the single-string selector is unable to navigate "last" multiple times to go further down the hierarchy, so this has been taken by several " .children(":last") " calls instead.  Regardless, this ends up getting the last element of the entire top-table (with the ID "#WholeTable").
	Parameters: none
	Return: none
	*/
	$("#btnSelectIDFiltered").click(function(){
		
		var ary_qryRef_selection = $( $("#WholeTable").children(":last").children(":last").children(":last").children(":last") ) ;
		
		
		//checkOnTable(ary_qryRef_selection);
		showSelection(ary_qryRef_selection);
		
		
	});
	
	/*
	Purpose: given a selection (treated as an array of elements), take each one and send it off to the "checkOnTable" method to mark this element as "selected" and do the needed CSS change to highlight that selected element's row in yellow.  Also marks the most recently sent selection as "arg_ary_qryRef_selection".
	Parameters: a selection
	Return: none
	*/
	function showSelection(arg_ary_qryRef_selection){
		
		
		//old loop method.  Same result.
		/*	
		var i = 0;	
		
		for(i = 0; i < arg_ary_qryRef_selection.length; i++){
			//oddly enough, "ary_qryRef_selection[i]" always returns a plain HTML reference.  Convert it to a JQuery one before sending.
			var qryRefTemp = $(arg_ary_qryRef_selection[i]);
					
			checkOnTable(qryRefTemp);
		}
		*/
		
		arg_ary_qryRef_selection.each(function(){
			//for each member of the selection (a plain reference to a DOM element for whatever reason?  convert to a JQuery object before sending), send it to "checkOnTable" to be recognized.
			checkOnTable($(this));
			
		});
		
		
		
				
		//this is the most recently working selection (at least 1 element caught)
		ary_qryRef_RecentSelection = arg_ary_qryRef_selection;	
	}
	
	
	
	
	
	
	/*
	Purpose: clear the input boxes on the bottom-left table.
	Parameters: a selection
	Return: none
	*/
	function clearInput(){
		$("#txtSelectTag").prop("value", "");
		$("#txtSelectClass").prop("value", "");
		$("#txtSelectID").prop("value", "");
		
	}
	
	
	/*
	Purpose: ClearSelection button click method.  Calls "clearSelection".
	Parameters: a selection
	Return: none
	*/
	$("#btnClearSelection").click(function(){
		clearSelection();
	
	});
	/*
	Purpose: ClearInputs button click method.  Calls "clearInput".
	Parameters: a selection
	Return: none
	*/
	$("#btnClearInputs").click(function(){
		clearInput();
	
	});
	
	/*
	Purpose: FillInputs button click method.  Fill the input boxes (bottom-left table's fields) with some safe defaults.
	Parameters: a selection
	Return: none
	*/
	$("#btnFillInputs").click(function(){
		$("#txtSelectTag").prop("value", "h2");
		$("#txtSelectClass").prop("value", "Scrubber");
		$("#txtSelectID").prop("value", "Larry");
		
		
	});
	
	
	
	
	
	
	/*
	Purpose: remove the formatting caused by any selections (remove yellow highlighting) and remove the check marks from the expected possible places for check marks.
	Parameters: a selection
	Return: none
	*/
	function clearSelection(){
		//.css(
		
		
		clearOnTable($("#Larry"));
		clearOnTable($("#Susan"));
		clearOnTable($("#Tom"));
		clearOnTable($("#Gerald"));
		clearOnTable($("#Harold"));
		clearOnTable($("#Lewis"));
		clearOnTable($("#Alex"));
		clearOnTable($("#Carol"));
		clearOnTable($("#Slacker"));
		clearOnTable($("#RedBeard"));
		
		//All cleared, so forget it.
		ary_qryRef_RecentSelection = null;
	}
	
	
	/*
	Purpose: Mark this "arg_jqyRef" as part of a selection.  Highlights it yellow and checks this row's "selected?" box on the table.
	Parameters: a selection
	Return: none
	*/
	function checkOnTable(arg_jqyRef){
		//alert(arg_jqyRef[0].innerHTML);   DOM proof help.
		
		//this seems to work on an array of selections too, fascinating.
		//Doing it individually won't hurt though.
		arg_jqyRef.parent().css( {
			backgroundColor: "#FFFF00"
		});
		
		//Checkmark.  The parent's parent is this "row" of the table.  The first member (place in column) is where the check mark is expected.
		arg_jqyRef.parent().parent().children(":first").text(strCheckmark);
		
	}
	
	
	/*
	Purpose: Clear the given element's formatting resulting from selection before.  Reset the background color and remove the checkmark.  Also, remove possible formatting from the "Apply to last selection" button (apply a fix to the table location containing the button).
	Return: none
	*/
	function clearOnTable(arg_jqyRef){
		
		arg_jqyRef.parent().css( {
			//backgroundColor: "rgba(0,0,0,0)" 
			backgroundColor: "transparent" 
		});
		arg_jqyRef.css( {
			//backgroundColor: "rgba(0,0,0,0)" 
			backgroundColor: "transparent",
			fontSize: "20px",
			float: "none"
			
		});
		
		var strContents = arg_jqyRef.text();
		
		
		//Remove any appended exclamation marks.  They never appear naturally in triples, and are always bundled at the end, so this removes any number of them.
		var intExcIndex = strContents.indexOf("!!!");
		if(intExcIndex !== -1){
			var strReplacement = strContents.substring(0, intExcIndex);
			arg_jqyRef.text(strReplacement);
		}
		
		
		
		
		arg_jqyRef.parent().parent().children(":first").text(" ");
		
	}
	
	
	
	
	
	
	
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
	
	
	/*
	Purpose: determine whether a given string begins with a particular string or not.  (case is unimportant)
	Parameters: (string) source, (string) check	
	Return: (bool)
	*/
	function startsWithCaseless(arg_src, arg_check){
		
		if(arg_src.length < arg_check.length){
			return false;   //not possible.	
		}
		
		if(arg_src.substring(0, arg_check.length).toLowerCase() === arg_check.toLowerCase() ){
			return true;   //passed!
		}
		
		return false;  //reached here? failure.
		
	}
	
	/*
	Purpose: determine whether a given string begins with a particular string or not.
	Parameters: (string) source, (string) check	
	Return: (bool)
	*/
	function startsWith(arg_src, arg_check){
		
		if(arg_src.length < arg_check.length){
			return false;   //not possible.	
		}
		
		if(arg_src.substring(0, arg_check.length) === arg_check ){
			return true;   //passed!
		}
		
		return false;  //reached here? failure.
		
	}
	

});//end of document.ready

	