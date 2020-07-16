
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 22 November 2016
 PURPOSE: See the main html file
 MODIFICATION HISTORY:
 Original Build.
 */
 

$(document).ready(function(){
	"use strict";
	
	//INDEX:
	//1. WINDOW SETUP
	//2. Z-INDEX
	//3. HELPER METHODS
	//4. UTILITY
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	// 1. WINDOW SETUP ///////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	
	/*
	Purpose: called at window startup.  Can start with a prompt or initialize features that need it by script.
	  ~For safety, several JQuery UI events are setup with events in this load function so that it is safe to assume the other methods are ready to be used.
	Parameters: none
	Return: none
	*/
	$(window).load(function(){
		
		//Setup events for each of the radio group members.
		$("[name=TypeOfProject]").each(function(){
			$(this).change(function(){
				typeOfProjectRadioChange( $(this) );
			});
		});
		
		
		//give the slider events.
		$( "#divCostEstimate" ).slider({
			
			min: 0,
			max: 100,
			step: 0.1,
			slide : divCostEstimateUpdate,
			stop: divCostEstimateUpdate
		});
		
		$("#selCategory").menu({
			select:selCategorySelect
		});
		
		assignCategoryAutocomplete();
		resetForm();
	});//end of window.load
	
	
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	// 2. Z-INDEX ////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	
	
	/*
	Purpose: selCategory hover method & event.  When hovering the mouse over selCategory, send it to the front. 
	Parameters: none
	Return: none
	*/
	function selCategoryHover(){
		sendToFront( $("#selCategory"));	
	}
	$("#selCategory").hover(function(){
		selCategoryHover();
	});
	
	
	/*
	Purpose: date estimate focus method & event.
	Parameters: none
	Return: none
	*/
	function txtDateEstimateFocus(){
		//$(e.target)   ?
		sendToFront( $("#txtDateEstimate") );
			
	}
	$("#txtDateEstimate").focus(function(){
		txtDateEstimateFocus();
	});
	
	/*
	Purpose: category focus method & event.
	Parameters: none
	Return: none
	*/
	function txtCategoryFocus(){
		sendToFront( $("#txtCategory") );
		sendToBack( $("#txtDateEstimate") );
	}
	$("#txtCategory").focus(function(){
		txtCategoryFocus();
	});
	
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	// 3. HELPER FUNCTIONS ///////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	
	
	/*
	Purpose: submit button click event.
	Parameters: event "e"
	Return: none
	*/
	$("#btnSubmit").click(function(e){
		submitFormEvent(e);
		
		//also disables validation checks that "submit" usually does, it seems.
		return false;
	});
	
	
	/*
	Purpose: reset form method and button event.  Filters out the default reset procedure so that a more fine-tuned one can be done by "resetForm".
	Parameters: event
	Return: none
	*/
	function resetFormEvent(arg_e){
		arg_e.preventDefault();
		resetForm();
		
	}
	$("#btnReset").click(function(e){
		resetFormEvent(e);
	});
	
	
	/*
	Purpose: The radio group should disable the "ModesOfSale" checkboxes when the 3rd radio button "Solution" is chosen, and re-enable otherwise.
	Parameters: radio button clicked on
	Return: none
	*/
	function typeOfProjectRadioChange(arg_qryRef){
		var blnChecked = $("#radSol").prop("checked");
		
		
		var qryRef_SalesModes = $("[name=SaleModes]");
		
		if(blnChecked){
			
			qryRef_SalesModes.each(function() {
			  $(this).prop("disabled", true);
			  $(this).prop("checked", false);
			});
		}else{
			qryRef_SalesModes.each(function() {
			  $(this).prop("disabled", false);
			});
		}
			
		qryRef_SalesModes.each(function() {
		  $(this).button( "refresh" );
		});
			
	}
	
	
	/*
	Purpose: fill the "autocomplete" component of "txtCategory" with all the choices from "selCategory", the menu nearby.  It is also possible to type in a category while autocomplete suggests anything already in the menu.
	Parameters: none
	Return: none
	*/
	function assignCategoryAutocomplete(){
		
		var categoryList = new Array();
		
		//within selCategory, any "div" is an item in the list.
		$("#selCategory").find("div").each(function(){
			var strItemText = $(this).text();
			//add to the list of strings.
			categoryList.push(strItemText);
		});
		
		//sort alphabetically.
		categoryList.sort();
		
		$( "#txtCategory" ).autocomplete({
			//will show up in autocomplete if the user types in the category textbox.
			source: categoryList
		});	
		
	}
	
	
	/*
	Purpose: Scrape the data to print into the output text area at the bottom of the form.
	Parameters: none
	Return: none
	*/
	function submitFormEvent(){
		
		
		removeSpacesFromInput($("#txtTelephoneNumber"));
		
		var strOutput = "";
		
		var strTitle = $("#txtTitle").val();
		var strUserName = $("#txtUsername").val();
		var strPassword = $("#txtPassword").val();
		var strEmail = $("#txtContactEmail").val();
		var strTelephoneNumber = $("#txtTelephoneNumber").val();
		
		var strTypeOfProject = getRadioGroupChoice("TypeOfProject");
		var strSaleModes = getCheckboxGroupChoice("SaleModes");
		
		var strCategory = $("#txtCategory").val();
		
		var strCostEstimate = $("#txtEstimateLow").val() + " - " + $("#txtEstimateHigh").val();
		
		var strDateEstimate = $("#txtDateEstimate").val();
		
		var strExtra = $("#txtExtra").val();
		
		
		
		strOutput =
		"Title : " + strTitle + "\n" +
		"UserName : " + strUserName + "\n" +
		"Password : " + strPassword + "\n" +
		"Email : " + strEmail + "\n" +
		"Telephone Number : " + strTelephoneNumber + "\n" +
		"Type of Project : " + strTypeOfProject + "\n" +
		"Sales Modes : " + strSaleModes + "\n" +
		"Category: " + strCategory + "\n" +
		"Cost Estimate: " + strCostEstimate + "\n" +
		"Date Estimate: " + strDateEstimate + "\n" +
		"Extra:\n" + strExtra;

		
		
		$("#txtOutput").val(strOutput);
		
		
	}
	
	/*
	Purpose: given the name of the group, put the value of the chosen member in a string.
	Parameters: (string) name of group to check
	Return: (string) chosen radio value (if any)
	*/
	function getRadioGroupChoice(arg_groupName){
		var strChosen = "";
		$("[name=" + arg_groupName +"]").each(function(){
			var qryRef = $(this);
			if(qryRef.prop("checked") ) {
				strChosen = qryRef.val();
			}
		});
		return strChosen;
	}
	/*
	Purpose: given the name of the group, add each checked member's value to a comma-delimited string.
	Parameters: (string) name of group to check
	Return: (string) list of checked values
	*/
	function getCheckboxGroupChoice(arg_groupName){
		var strChosen = "";
		var blnFirst = true;
		$("[name=" + arg_groupName +"]").each(function(){
			var qryRef = $(this);
			if(qryRef.prop("checked") ) {
				if(blnFirst){
					blnFirst = false;
					strChosen += qryRef.val();	
				}else{
					//after the first, a comma goes in front to separate.
					strChosen += ", " + qryRef.val();
				}
			}
		});
		return strChosen;
	}
	
	
	
	/*
	Purpose: when a category has been chosen from selCategory (any option picked), print it to the nearby textbox.
	Parameters: event, JQuery Reference of the selected item.
	Return: none
	*/
	function selCategorySelect(e, arg_qryRefSelection){
		
		//get the selected item, put in text box nearby.
		//Note that "children().first()" gets the first child, which is the "div" (each "item" contains one).  This div has the text of this item only.
		var itemText = arg_qryRefSelection.item.children().first().text();
		
		$("#txtCategory").val(itemText);
	}
	
	
	
	
	/*
	Purpose: reset the form to the default state.  Clear all fields and reset JQuery UI that needs it.
	Parameters: event
	Return: none
	*/
	function resetForm(){
		
		//all input values retain defaults (blank).
		$(":input").each(function(){
		  $(this).val(this.defaultValue);
		});
		
		//all radios and checkboxes are to be re-enabled and unchecked.
		$("[type=radio], [type=checkbox]").each(function() {
		  $(this).prop("disabled", false);
		  $(this).prop("checked", false);
		  $(this).button("refresh");
		});
		
		//reset the slider.
		$( "#divCostEstimate" ).slider({
			range: true,
			values: [ 36, 44 ]
		});
		
		//clear text areas.
		$("#txtOutput").val("");
		$("#txtExtra").val("");
		
	}
	
	
	/*
	Purpose: given an input text box, remove all spaces from it.
	Parameters: (qryRef) input element to remove spaces from.
	Return: none
	*/
	function removeSpacesFromInput(arg_qryRef_selection){
		
		arg_qryRef_selection.each(function(){
			
			var strRaw = $(this).val();
			var strMod = removeSpaces(strRaw);
			$(this).val(strMod);	
			
		});
	}
	
	
	/*
	Purpose: when the sliders are adjusted, update the nearby textboxes to neatly show the resulting value.
	Parameters: none
	Return: none
	*/
	function divCostEstimateUpdate(){
		
		var qryRefSlider = $("#divCostEstimate");
		
		//offset slightly, as the slider is interpreted as going from 0.3 to 1.0 as to not appear
		//extremely slow at the beginning (as is the case with something taken to a high power)
		var minCost = 500 - 10;
		var maxCost = 2000000;
		
		// # * 0.3 = 500
		
		//interpret as starting at 0.3 instead.
		var sliderRawMin = interpretOfRange(qryRefSlider.slider("values", 0)/100, 0.3, 1.0  ); 
		var sliderRawMax = interpretOfRange(qryRefSlider.slider("values", 1)/100, 0.3, 1.0  ); 
		
		//take to the 10th power.  Slows growth at the beginning, increases rapidly near the end.
		sliderRawMin = Math.pow(sliderRawMin, 10); 
		sliderRawMax = Math.pow(sliderRawMax, 10);
		
		//put this number b/w 0 and 1 into the range of minCost, maxCost.
		sliderRawMin = interpretOfRange(sliderRawMin, minCost, maxCost);
		sliderRawMax = interpretOfRange(sliderRawMax, minCost, maxCost);
		
		//round to the first two largest (highest, left-most) digits.  Likely not concerned with anything less.
		var resultMin =  roundFirstDigits( sliderRawMin, 2 );
		var resultMax =  roundFirstDigits( sliderRawMax, 2 );
		
		//send to the textbox.  Put dollar signs in front.
		$("#txtEstimateLow").val("$" + resultMin);
		$("#txtEstimateHigh").val("$" + resultMax);
		
	}
	
	/*
	Purpose: send a particular element to the front.  Some JQuery UI elements compete for appearing "on top" when they happen to overlap, such as when menus open or the datepicker appears.
	Parameters: (JQuery reference) to prioritize
	Return: none
	*/
	function sendToFront(arg_qryRef){
		//send the others to the back.
		$("#selCategory, #txtDateEstimate, #divCostEstimate").each(function(){
			$(this).css({
				zIndex:0
			});
		});
		//to the front.
		arg_qryRef.css({
			zIndex:10000	
		});
	}
	/*
	Purpose: send a particular element behind others.
	Parameters: (JQuery reference)
	Return: none
	*/
	function sendToBack(arg_qryRef){
		
		arg_qryRef.css({
			zIndex:0	
		});
	}
	
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	// 4. UTILITY FUNCTIONS //////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	
	
	/*
	Purpose: replace each occurence of a search string in the source string, with the replace string.
	Parameters: (string) source, (string) search, (string) replace
	Return: (string)
	*/
	function replaceAllInString(arg_strSrc, arg_strSearch, arg_strReplace){
		
		return arg_strSrc.replace(new RegExp(arg_strSearch, "g"), arg_strReplace);
	}
	
	
	/*
	Purpose: remove all spaces from a string.
	Note that a call to "trim" would be done, but this is already done before the only place this method is called.
	Parameters: (string) base
	Return: (string)
	*/
	function removeSpaces(arg_strBase){
		var strResult = "";
		
		//no tab characters allowed, remove them first.
		var strWorking = replaceAllInString(arg_strBase, "\t", "");
		
		var intPreviousStop = 0;
		var intRecentSpace = strWorking.indexOf(" ", 0);
		
		
		while(intRecentSpace !== -1){
			
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
		
		strResult += strWorking.substring(intPreviousStop);
			
		return strResult;
		
	}//END OF removeConsecutiveSpaces(...)
	
	
	/*
	Purpose: count the number of digits in the whole number as a string.  Ignore decimal digits.
	Parameters: (float) number
	Return: (int) number of whole digits
	*/
	function wholeNumberDigits(arg_number){
		var str = arg_number.toString();
		
		var period = str.indexOf(".");
		if(period !== -1){
			//wherever the decimal at is also how many whole number digits there are:
			//124436.135
			//period position of 6 = number of whole numbers.
			return period;
		}else{
			//intuitive, just the number of digits here.
			return str.length;
		}
		
	}
	
	/*
	Purpose: round the number to the first # (largest) whole places.  Good for neatly showing abstract large numbers.  It is easy to imply we're concerned with 10's of dollars in a number under 1000, but not in a greater number.  Also rounds to a whole number in any case.
	Parameters: (float) number, (int) # of digits to round to (first two, three, four, etc.).
	Return: (int) desired rounded number.
	*/
	function roundFirstDigits(arg_number, arg_firstDigits){
		var result; 
		var digits = wholeNumberDigits(arg_number);
		if(digits > arg_firstDigits){
			//there must be enough whole digits for this filter to even be necessary (more than arg_firstDigits).  A number 2 whole digits or smaller would not benefit from this approach with arg_firstDigits = 2.
			result = Math.round(arg_number / Math.pow(10, digits-arg_firstDigits)) * Math.pow(10, digits-arg_firstDigits) ;
		}else{
			//no digits factored in.
			result = Math.round(arg_number);
		}
		return result;
	}
	
		/*
	Purpose: given a number between 0 and 1 (decimal) and a range from arg_min to arg_max, scale this number to that range.  In a range of 300, 800,   arg_numb = 0.4 yields 500.  0 -> 300, 1 -> 800.
	Parameters: (float) scale of 0 to 1.  (two floats) range.
	Return: (float) arg_numb scaled to the given range.
	*/
	function interpretOfRange( arg_numb, arg_min, arg_max){
		var range = arg_max - arg_min;
		return arg_numb * range + arg_min;
	}
	
	

});//end of document.ready

	