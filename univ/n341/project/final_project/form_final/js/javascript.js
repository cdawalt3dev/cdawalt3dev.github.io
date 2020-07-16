
/*
 TITLE: javascript.js
 AUTHOR: Chris Dawalt (CPD)
 CREATE DATE: 4 December 2016
 PURPOSE: See the main html file
 MODIFICATION HISTORY:
 Original Build.
 */
 

$(document).ready(function(){
	"use strict";
	
	
	//debug mode.  Mostly for determining whether to show errors to the user or not.
	var bolDebugMode = false;
	
	
	//INDEX:
	//1. WINDOW SETUP
	//2. VALIDATION SETUP
	//3. ERROR RELATED & Z-INDEX
	//4. HELPER METHODS
	//5. UTILITY
	
	
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
		
		
		customizeErrorMessages();
		
		$("#chkStrictTelephone").change(function(){
			//re-check "txtTelephoneNumber" on altering this checkbox.
			$("#txtTelephoneNumber").valid();
		});
		
		
		$("#chkDebugMode").change(function(){
			checkDebugMode();
		});
		//check once now too.
		checkDebugMode();
		
		
		
		//Setup events for each of the radio group members.
		$("[name=TypeOfProject]").each(function(){
			$(this).change(function(){
				typeOfProjectRadioChange( $(this) );
			});
		});
		
		
		//Ttemporary variable for storing a seleciton of the two text boxes for cost estimate.
		var qryRefCostEstimateSelection = $("#txtEstimateLow, #txtEstimateHigh");
		
		
		qryRefCostEstimateSelection.each(function(){
			$(this).on({
				
				focus:function(){
					//when either is selected, both should have their error messages cleared.  Errors offset the center, so one error message present but the other missing will make it look shifted.
					clearErrorSelection(qryRefCostEstimateSelection);
					
				},
				keyup:function(){
					if(qryRefCostEstimateSelection.valid()){
						//why not?
						clearErrorSelection(qryRefCostEstimateSelection);
					}
				},
				blur:function(){
					qryRefCostEstimateSelection.valid();
					
				},
			
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
		
		
		var qryRefContactSelection = $("#txtContactEmail, #txtTelephoneNumber");
		
		//the two contact boxes are somewhat linked to one another.  They should know when to check for emptiness to show that at least one of the two is required.
		qryRefContactSelection.each(function(){
			$(this).on({
				keyup:function(){
					//In case of a recent "both are blank" error, clear it.  Since keyup, trust they are no longer both empty.
					if( $(this).data("recentNeitherError") === 1){
						//$(this).data("recentNeitherError", 0);
						clearErrorSelection(qryRefContactSelection);
						qryRefContactSelection.data("recentNeitherError", 0);
					}
					if($(this).val() === ""){
						//leaving this field empty?  check for whether the other is empty too.
						qryRefContactSelection.valid();
					}
				},
				blur:function(){
					//in case of clicking away when both are empty, show the "one required" error for each.
					qryRefContactSelection.valid();
					
				}
			});
			
		});
		
		assignCategoryAutocomplete();
		resetForm();
	});//end of window.load
	
	
	//error check method.  Requires "bolDebugMode" to fire.
	window.onerror = function(msg, url, linenumber){
		if(bolDebugMode){
			alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
		}
		return true;
	};
	
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	// 2. VALIDATION SETUP ///////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	
	
	/*
	Purpose: Validation setup.
	Parameters: none
	Return: none
	*/
	$.validator.setDefaults({
		submitHandler: function() {
			
			submitFormEvent();
			
		},
		
		//The "errorPlacement" event is used to place errors, possibly differently for a given element.
		errorPlacement: function(error, element) {
			
			error.css({
				//all errors have the "block" format.  Occupy their own line below.
				display:"block"
			});
			//if(element.data("error") === 0){
				////Defunct error prevention.
				//return;
			//}
			
			//any error for the radio group is placed after all radio buttons.
			if(element.prop("name") === "TypeOfProject"){
				error.text("Pick one.");
				error.insertAfter( $("#divRadTypeOfProjectErrorLocation") );
			}else{
				//default behavior
				error.insertAfter(element);	
			}
			
		}
		
	});
	
	
	
	$("#frmProposal").validate({
		rules:{
			Username: {
				required: true,
				maxlength: 20
			},
			Password: {
				required: true,
				minlength: 8,
				maxlength: 40
			},
			Title: {
				required: true,
				maxlength: 40
			},
			//"required" can be given a function as well.  If the other is missing, mark this as "required", failing validation if both (between ContactEmail & TelephoneNumber) are missing.
			ContactEmail: {
				required: function(element){
					//whether or not this particular element is marked as "required" depends on whether the other means of contact field is blank.  If the other is blank, this one is marked as required, regardless of whether or not this one is filled.  If this field is filled, validation is still satisfied (or, either is filled satisfies validation).
					var bolReturnVal = $("#txtTelephoneNumber").is(":blank");
					if(bolReturnVal && $(element).is(":blank") ){
						//in case of a recent blank error, signal this in both boxes.  The next edit to either will clear this error.
						$("#txtTelephoneNumber").data("recentNeitherError", 1);
						$(element).data("recentNeitherError", 1);
					}
					return bolReturnVal;
				}
			},
			TelephoneNumber: {
				required: function(element){
					//Reciprocal for the telephone field.  If both are blank, both are marked as "required" independently, failing validation & triggering the error for both "blank, required" fields.
					var bolReturnVal = $("#txtContactEmail").is(":blank");
					if(bolReturnVal && $(element).is(":blank") ){
						$("#txtContactEmail").data("recentNeitherError", 1);
						$(element).data("recentNeitherError", 1);
					}
					return bolReturnVal;
				},
				//custom method call, see below.
				customTelephoneCheck: {data: null}
			},
			
			CostEstimateLow: {
				required:true,
				moneyBoxCheck: { data: null }
			},
			CostEstimateHigh: {
				required:true,
				moneyBoxCheck: { data: null }
			},
			DateEstimate: {
				required:true,
				//custom method call, see below.
				customDateCheck: {data: null}
			},
			ProjectCategory:{
				required:true,	
			}
			
		},
		
		//error messages per case.  Custom validation methods below also add places for messages.
		messages:{
			Username: {
				//required: 
				maxlength: "over {0} char",
			},
			Password: {
				//required: 
				minlength: "under {0} characters",
				maxlength: "over {0} characters",
			},
			Title: {
				//required: 
				maxlength: "over {0} characters"
			},
			ContactEmail: {
				required: "Provide at least 1 means of contact."
			},
			TelephoneNumber: {
				required: "Provide at least 1 means of contact."
			}
			
		}
		
	});
	
	
	//email fields allow the usual symbols allowed by the email standard, numbers, and letters, upper & lowercase.
	//Should fit the format
	//<text>@<text>.<at least 2 characters>
	$.validator.methods.email = function( value, element ) {
		//[0-9a-zA-Z]
		//! # $ % & ' * + - / = ? ^ _ ` { | } ~
		//allowed characters in email.
		
		return this.optional( element ) || /^[0-9a-zA-Z\$_*\{\}\|\'\&\%\#\!\+\/\?\^\-]+@[0-9a-zA-Z\$_*\{\}\|\'\&\%\#\!\+\/\?\^\-]+\.[0-9a-zA-Z\$_*\{\}\|\'\&\%\#\!\+\/\?\^\-]{2,}/.test( value );
		
	};
	
	
	//telephone fields are more flexible so that the user may enter anything deemed a "number" when strict mode is off (see notes in method).  Also allows parenthesis surrounding the first 3 numbers and dashes.  The ideal format, (###) ###-####, is made apparent regardless.
	//In custom methods, returning true passes validation and does not show an error.
	//returning false fails validation and shows the error per the 2nd function.
	jQuery.validator.addMethod("customTelephoneCheck",
		function(value, element, options) {
			
			var qryRefElement = $(element);
			//the "error" data member will store the error to print out in case of one.
			qryRefElement.data("error", 0);
			
			//if blank and allowed to be blank, just pass.
			if(this.optional(element)){
				return true;
			}
			
			
		  	if(value.length > 50){
				qryRefElement.data("error", "Over 50 characters.");
				return false;	
			}
			
			//First, a more crude test.
			//Only certain characters are allowed at all.
			var blnTest = /^[\d \(\)\-]+$/.test( value );
			if(!blnTest){
				qryRefElement.data("error", "Invalid characters.  Digits, parenthesis, dashes only.");
				return false;	
			}
			
			//STRICT MODE
			if($("#chkStrictTelephone").prop("checked")){
				//if strict, Parenthesis must surround the first 3 numbers.  Spaces between dashes are optional.  The first dash is optional (separating area code from the last 7 digits), but the 2nd dash between the next 3 and 4 numbers is required.
				
				//a deeper test.
				blnTest = /^\([\d]{3,3}\)\ ?\-?\ ?[\d]{3,3}\ ?\-?\ ?[\d]{4,4}$/.test( value );
				
				if(!blnTest){
					qryRefElement.data("error", "Phone # format: (###) ###-####");
					return false;
				}else{
					//pass.	
				}
				
				
			}else{
				//if non strict, make all symbol ( /, -) characters optional.  
				//a deeper test.
				blnTest = /^\(?\ ?[\d]{3,3}\ ?\)?\ ?\-?\ ?[\d]{3,3}\ ?\-?\ ?[\d]{4,4}$/.test( value );
				
				if(!blnTest){
					qryRefElement.data("error", "Phone # format: (###) ###-####");
					return false;
				}else{
					//pass.	
				}

			}
			return true;	
		},
		function(params, element) {
			//print the error sent from the data member "error" (provided by the above method at failure).
		  	return $(element).data("error");
		}
	);
	
	
	//Knows to allow a dollar sign in front of an intended number.
	jQuery.validator.addMethod("moneyBoxCheck",
		function(value, element, options) {
			
			var qryRefElement = $(element);
			qryRefElement.data("error", 0);
			//removeSpacesFromInput(qryRefElement);
			//value = qryRefElement.val();
			value = removeSpaces(qryRefElement.val());
			
			//alert("VALIDATION ME: " + $(element).prop("name"));
			
			if(this.optional(element)){
				return true;	
			}
			
		  	if(value.length > 20){
				qryRefElement.data("error", "Over 20 characters.");
				return false;	
			}
			if(value.indexOf(".") !== -1){
				qryRefElement.data("error", "Whole number only.");
				return false;	
			}
			
			if( (value.length > 0 && value.charAt(0) === "-") || (value.length > 1 && value.charAt(1) === "-") ){
				qryRefElement.data("error", "Can not be negative.");
				return false;	
			}
			
			//dollar sign in front allowed, should not factor into number test.
			//NOTICE: my android phone lacked the "startsWith" method.  Can't assume anything anymore...
			//if(value.startsWith("$")){
			if(value.length > 0 && value.charAt(0) === "$"){
				value = value.substring(1);
			}
			
			//commas allowed.
			if(! /^[\d\,]+$/.test(value) ){
				qryRefElement.data("error", "Must be a number.");
				return false;	
			}
			
			//made it here?  Good.
			return true;
			
		},
		function(params, element) {
			//print the error sent.
		  	return $(element).data("error");
		}
	);
	
	
	
	
	//custom validation for the date.
	//allows any numbers and characters (non-special-characters) for the month and day parts.  Last, year, is 4 numbers.  Separated by dashes, spaces, or slashes.  Any special characters invalidate.
	//The day or month can come in either order.  At most one of the first two fields can be a 3-12 letter month name instead of a month number.  Both may also be numbers.
	//Should not be an issue given the apparent datepicker widget on selecting the date field, but
	//this filter may be worthwhile elsewhere.
	jQuery.validator.addMethod("customDateCheck",
		function(value, element, options) {
			
			var qryRefElement = $(element);
			qryRefElement.data("error", 0);
			//removeSpacesFromInput(qryRefElement);
			//value = qryRefElement.val();
			value = removeSpaces(qryRefElement.val());
			
			if(this.optional(element)){
				return true;	
			}
			
		  	if(value.length > 20){
				qryRefElement.data("error", "Must be < 20 characters");
				return false;	
			}
			
			//First, a more crude test, flat restriction on symbols.
			var blnTest = /^[a-zA-Z\d \\\/\-]+$/.test( value );
			if(!blnTest){
				qryRefElement.data("error", "Invalid characters.  Letters, numbers, slashes, dashes only.");
				return false;	
			}
			
			//deeper test:  
			blnTest = /^[a-zA-Z]{3,12}[\\\ \/\-][\d]{1,2}[\\\ \/\-][\d]{2,4}$/.test( value ) || 
			/^[\d]{1,2}[\\\ \/\-][a-zA-Z]{3,12}[\\\ \/\-][\d]{2,4}$/.test( value ) || 
			/^[\d]{1,2}[\\\ \/\-][\d]{1,2}[\\\ \/\-][\d]{2,4}$/.test( value );
			
			if(!blnTest){
				qryRefElement.data("error", "Best Date format: ##/##/####");
				return false;	
			}
			
			return true;
		},
		function(params, element) {
			//print the error sent.
		  	return $(element).data("error");
		}
	);
	
	




	/*
	Purpose: Change the default error message per scenario.
	Reference:
	  http://stackoverflow.com/questions/2457032/jquery-validation-change-default-error-message
	Parameters: none
	Return: none
	*/
	function customizeErrorMessages(){
		
		jQuery.extend(jQuery.validator.messages, {
		required: "Required.",
		remote: "Please fix this field.",
		email: "Email format: name@site.xxx",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		accept: "Please enter a value with a valid extension.",
		maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
		minlength: jQuery.validator.format("Please enter at least {0} characters."),
		rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
		range: jQuery.validator.format("Please enter a value between {0} and {1}."),
		max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
		min: jQuery.validator.format("Please enter a value greater than or equal to {0}."),
		tel: "Phone # format: (###) ###-####",
		
		
	});	
	}
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	// 3. ERROR RELATED & Z-INDEX ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	
	
	/*
	Purpose: clear errors or error-induced formatting related to the given JQuery reference.  Error creation produces an error nearby with the same ID as the given element with "-error" at the end, and adds the "error" class to the erroneous element.
	Parameters: JQuery Reference to clear of errors
	Return: none
	*/
	function clearError(arg_qryRef){
		//clear the CSS class "error" from the display element.
		arg_qryRef.removeClass("error");
		
		//build the error selector, just the old selector with "-error" added.  Remove that element.
		
		//ineffective
		//var strErrorLabelSelector = arg_qryRef.selector + "-error";
		
		//error ID to remove.
		var strErrorLabelSelector = arg_qryRef.prop("id") + "-error";
		$("#"+strErrorLabelSelector).remove();
	}
	
	/*
	Purpose: same as above, but can apply to a selection of multiple elements in need of error removal.  Good for coordinating any element's focus with the removal of all errors for the group (when it is easy to imply the user will fill all of them soon)
	Parameters: JQuery Selection
	Return: none
	*/
	function clearErrorSelection(arg_qryRef){
		//clear the CSS class "error" from the display element.
		arg_qryRef.removeClass("error");
		
		//build EACH error selector, just the old selector with "-error" added.  Remove that element.
		arg_qryRef.each(function(){
			//error ID to remove.
			var strErrorLabelSelector = $(this).prop("id") + "-error";
			$("#"+strErrorLabelSelector).remove();
		
		});
	}
	
	
	/*
	Purpose: Clear any error-related messages and formatting on the page.  Good for a reset.
	Parameters: none
	Return: none
	*/
	function clearAllErrors(){
		//only exact class matches of "error" should be removed entirely.  Those are the generated labels near the inputs that failed validation.  Removing anything that happens to have "class=error" among others (multiple classes possible) will include the elements marked as failed, making the form unusable.
		//This selection requires that the class exclusively be "error".
		$("[class=\"error\"]").remove();
		
		//anything with the "erorr" class should drop that.
		$(".error").removeClass("error");
	}
	
	
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
		
		//the resulting error from the Validation plugin may need to be cleared this way.
		//clearError($("#txtDateEstimate"));
		//$("#txtDateEstimate").valid();
		sendToFront( $("#txtDateEstimate") );
			
	}
	$("#txtDateEstimate").focus(function(){
		txtDateEstimateFocus();
	});
	
	
	/*
	Purpose: date estimate change method & event.
	Parameters: none
	Return: none
	*/
	function txtDateEstimateChange(){
		
		sendToFront( $("#txtDateEstimate") );
		$("#txtDateEstimate").valid();
	}
	$("#txtDateEstimate").change(function(){
		txtDateEstimateChange();
	});
	
	
	
	/*
	Purpose: date estimate blur method & event.
	Parameters: none
	Return: none
	*/
	function txtDateEstimateBlur(){
		//$(e.target)   ?
		
		//the resulting error from the Validation plugin may need to be cleared this way.
		//clearError($("#txtDateEstimate"));
		$("#txtDateEstimate").valid();	
	}
	$("#txtDateEstimate").blur(function(){
		txtDateEstimateBlur();
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
	// 4. HELPER FUNCTIONS ///////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	
	
	//Using the validation plugin causes the default behavior of a submit button to change.  When the validation plugin is active, submit buttons don't try to send to an email (even if a "mailto" attribute is provided in the form).  They will start the form's validation by plugin instead, which creates nearby error messages for problematic inputs.  In this case, "return false;" prevents any sort of behavior, including the plugin's validation.  The ".validate()" call in the form further above causes the default email creation to be replaced with the validation plugin's handler.
	
	
	
	
	
	
	
	/*
	Purpose: submit button click event.  "return false;" seems to be preventing any validation, including that of the validation plugin.
	Parameters: none
	Return: none
	*/
	$("#btnSubmit").click(function(){
		//submitFormEvent(e);
		//the handler does this instead now.
		
		
		//this route can also be re-enabled to see if there is a difference.
		//If not, this is, in the very least, a rough estimate of what goes on behind the scenes for the validation plugin.
		/*
		if($("#frmProposal").valid()){
			//note that ".valid()" being true or not isn't enough to call the "submit handler".
			//It can be called manually, should validation pass (the .validation method merely sets up the form for use by the validation plugin, but ".valid" does the checks on the form when desired).
			//It appears that behavior under mobile devices is inconsistent.  This run-through of the method, return false or not, still won't work.  This manual call in the case that the entire form passes validation should work in any case.
			
			$.validator.defaults.submitHandler();
		}
		
		return false;
		*/
		
		
		//NOTE: This route has been discarded.  Instead, simply don't "return false".  The default behavior seems to be handling the PC and mobile devices just fine.
		
		//return false;
	});
	
	


	/*
	Purpose: Debugging feature.  Fill the form with generic inputs in required fields to diagnose form submission problems (scraping to the output text area).
	Parameters: none
	Return: none
	*/
	$("#btnSpam").click(function(){
		
		$("#txtTitle").val("My Project Idea");
		$("#txtUsername").val("MYNAME");
		$("#txtPassword").val("********");
		$("#txtContactEmail").val("myname@site.bis");
		$("#txtTelephoneNumber").val("(999)-999-9999");
		
		$("#radSol").prop("checked", true);
		$("#radSol").button("refresh");
		$("#radSol").change();
		
		//sale modes (checkboxes) are empty, as the "Solution" radio choice offers none.
		
		
		$("#txtCategory").val("SMOOTH JAZZ");
		
		$("#txtEstimateLow").val("20000");
		$("#txtEstimateHigh").val("50000");
		
		$("#txtDateEstimate").val("04/30/2018");
		
		$("#txtExtra").val("BLA BLA BLA\nTEXT MORE TEXT\nBLA");
		
		$("#frmProposal").valid();
		
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
		//has "radSol" been chosen?
		var blnChecked = $("#radSol").prop("checked");
		
		//selection of the three "salesMode" checkboxes.
		var qryRef_SalesModes = $("[name=SaleModes]");
		
		if(blnChecked){
			//if radSol has been selected, deselect and uncheck the checkboxes one-by-one.
			qryRef_SalesModes.each(function() {
			  $(this).prop("disabled", true);
			  $(this).prop("checked", false);
			});
		}else{
			//otherwise, enable the 3 checkboxes.  The other radio choices allow for any selection of the 3 sales mode checkboxes.
			qryRef_SalesModes.each(function() {
			  $(this).prop("disabled", false);
			});
		}
		
		//call the widget "refresh"	procedure to update the widget appearance (fade on disable, check / uncheck)
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
		
		//a list to store each item's text of the "selCategory" menu.
		var categoryList = new Array();
		
		//within selCategory, any "div" is an item in the list.
		$("#selCategory").find("div").each(function(){
			//this item's text.
			var strItemText = $(this).text();
			//add to the list of strings.
			categoryList.push(strItemText);
		});
		
		//sort alphabetically.
		categoryList.sort();
		
		//finally, apply the list to the text field so that autocomplete can show up.
		$( "#txtCategory" ).autocomplete({
			//will show up in autocomplete if the user types in the category textbox.
			source: categoryList
		});	
		
	}
	
	
	/*
	Purpose: Check to see if the given string begins with a dollar sign or not.  If not, add one to the front.  Otherwise, return as is.
	Parameters: (string)
	Return: (string, one dollar sign in front)
	*/
	function safeDollarSign(arg_strText){	
		if(beginsWith(arg_strText, "$" ) ){
			return arg_strText;	
		}else{
			
			return "$" + arg_strText;
		}
		
	}
	
	/*
	Purpose: Scrape the data to print into the output text area at the bottom of the form.
	Parameters: none
	Return: none
	*/
	function submitFormEvent(){
		
		removeSpacesFromInput($("#txtTelephoneNumber"));
		
		//print to output text area at the very bottom (or, theoretically, send out to server / by email)
		var strOutput = "";
		
		//the title of the project.
		var strTitle = $("#txtTitle").val();
		//the login user name provided.
		var strUserName = $("#txtUsername").val();
		//the login password provided.
		var strPassword = $("#txtPassword").val();
		//the email provided.
		var strEmail = $("#txtContactEmail").val();
		//the telephone number provided.
		var strTelephoneNumber = $("#txtTelephoneNumber").val();
		//the "Type of Project" radio choice.
		var strTypeOfProject = getRadioGroupChoice("TypeOfProject");
		//A list of all "Sales modes" checkbox choices, delimited by commas.
		var strSaleModes = getCheckboxGroupChoice("SaleModes");
		//The category picked / typed.
		var strCategory = $("#txtCategory").val();
		//Cost estimate as a pair of values, generated from the slider nearby or typed and combined into one string.
		var strCostEstimate = safeDollarSign($("#txtEstimateLow").val()) + " - " + safeDollarSign($("#txtEstimateHigh").val());
		//Date estimate given.
		var strDateEstimate = $("#txtDateEstimate").val();
		//Comment text area, last thing on the page before the submit / reset buttons (excluding the output).
		var strExtra = $("#txtExtra").val();
		
		//generate the output string from the above variables and label them.
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
		
		//Send.
		$("#txtOutput").val(strOutput);
		
	}
	
	/*
	Purpose: given the name of the group, put the value of the chosen member in a string.
	Parameters: (string) name of group to check
	Return: (string) chosen radio value (if any)
	*/
	function getRadioGroupChoice(arg_groupName){
		//to send back as a string.
		var strChosen = "";
		//for each radio group member...
		$("[name=" + arg_groupName +"]").each(function(){
			//temporary JQuery selection of this object.
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
		//To send back as a string (list of checkboxes ticked)
		var strChosen = "";
		//Is this the first time sending a checkbox name to strChosen?
		var blnFirst = true;
		//for each checkbox group member...
		$("[name=" + arg_groupName +"]").each(function(){
			//temporary JQuery selection of this object.
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
		
		//the resulting error from the Validation plugin may need to be cleared this way.
		clearError($("#txtCategory"));
		$("#txtCategory").val(itemText);
		
		//remove focus on anything selected.  Good for mobile devices (verified on Android phone), which may try to return to an earlier selected input when this is clicked.
		$(":focus").blur();
		//it appears forcing focus onto something else (like a non-input) also works.
		//$("#selCategory").focus();
		
	}
	
	
	/*
	Purpose: reset the form to the default state.  Clear all fields, reset JQuery UI that needs it, and clear all error messages & element formatting caused by errors.
	Parameters: event
	Return: none
	*/
	function resetForm(){
		
		//all input values retain defaults (blank).  This is for text inputs only.
		$(":input:not([type=button],[type=submit],[type=reset],[type=checkbox], [type=radio])").each(function(){
			//alert( $(this).prop("id") );
			$(this).val(this.defaultValue);
		});
		
		//all radios and checkboxes are to be re-enabled and unchecked.
		//Except for ones of class "debug".
		$("[type=radio], [type=checkbox]").not(".debug").each(function() {
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
		
		
		//remove all errors.  The intuitive ".error" selector is tempting, but would cause every element that happened to have the "error" class to be called, including inputs that were marked with it.  Those should not be removed.
		//Only get elements whose only class is "error".  All validated elements have at least some class.
		clearAllErrors();
	}
	
	
	/*
	Purpose: given a selection of textboxes (one or several), remove all spaces from it (them) and re-apply.
	Parameters: (qryRef) input element(s) to remove spaces from.
	Return: none
	*/
	function removeSpacesFromInput(arg_qryRef_selection){
		
		arg_qryRef_selection.each(function(){
			
			//text from this element, as-is.
			var strRaw = $(this).val();
			//after removing all spaces from its text
			var strMod = removeSpaces(strRaw);
			//re-apply to this element.
			$(this).val(strMod);	
			
		});
		
	}
	
	/*
	Purpose: given a selection of textboxes (one or several), remove all consecutive spaces from it (them) and re-apply.
	Parameters: (qryRef) input element(s) to remove spaces from.
	Return: none
	*/
	function removeConsecutiveSpacesFromInput(arg_qryRef_selection){
		
		arg_qryRef_selection.each(function(){
			
			var strRaw = $(this).val();
			//same as above, but calls "removeConsecutiveSpaces" instead.
			//Spaces allowed, but any occurences of multiple space characters without separation will be trimmed to one space.
			var strMod = removeConsecutiveSpaces(strRaw);
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
		
		//send to the textbox.
		$("#txtEstimateLow").val("$" + resultMin);
		$("#txtEstimateHigh").val("$" + resultMax);
		
		//Filling the fields by dragging the slider should clear errors related to those fields.
		clearError($("#txtEstimateLow"));
		clearError($("#txtEstimateHigh"));
		
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
	
	/*
	Purpose: update global var "bolDebugMode" to represent whether "chkDebugMode" is checked or not.  Also toggle visibilty of the "strictPhone" checkbox.
	Parameters: none
	Return: none
	*/
	function checkDebugMode(){
		bolDebugMode = $("#chkDebugMode").prop("checked");
		if(bolDebugMode === true){
			$(".debug:not(#chkDebugMode)").prop("hidden", false);
			$(".debug:input:not(#chkDebugMode)").show();   //the button(s) need extra help.
		}else{
			$(".debug:not(#chkDebugMode)").prop("hidden", true);
			$(".debug:input:not(#chkDebugMode)").hide();
		}
	}
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////
	// 5. UTILITY FUNCTIONS //////////////////////////////////////////////////////////
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
		//to return (the source string without any spaces)
		var strResult = "";
		
		//no tab characters allowed, remove them first.
		var strWorking = replaceAllInString(arg_strBase, "\t", "");
		
		//last index without a space character (to start searching for new spaces from)
		var intPreviousStop = 0;
		//next index of a space character, starting from intPreviousStop (0 for start)
		var intRecentSpace = strWorking.indexOf(" ", 0);
		
		
		while(intRecentSpace !== -1){
			//the result receives the text from index "previous" to index "recent space", exclusive of recent space.
			strResult += strWorking.substring(intPreviousStop, intRecentSpace);
			
			//counter, starting at "intRecentSpace".
			var i2 = intRecentSpace;
			//find the next non-space char.  Terminate at that.
			while(strWorking.charAt(i2) === " " ){
				i2++;
			}
			//after terminating, "i2" is now the location of the non-space char rightmost of the space group.  The next text to append to the result starts here, as does the next search for spaces.
			intPreviousStop = i2;
			
			intRecentSpace = strWorking.indexOf(" ", intPreviousStop);
			
			//and repeat until no more space characters exist.
		}
		
		//possible overhang, add between previous and the last (no spaces left = valid)
		strResult += strWorking.substring(intPreviousStop);
			
		return strResult;
		
	}//END OF removeSpaces(...)
	
	
	/*
	Purpose: count the number of digits in the whole number as a string.  Ignore decimal digits.
	Parameters: (float) number
	Return: (int) number of whole digits
	*/
	function wholeNumberDigits(arg_number){
		var str = arg_number.toString();
		
		//index of the period.  The period's existence (or not) is important.
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
		//return this.
		var result; 
		//how many digits left of a possible decimal place (or just digits if there is none) are in the received number?
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
		//range is the difference between the max and min.
		var range = arg_max - arg_min;
		//put "arg_numb" into this range to put it on the scale [0, range].
		//Adding back the min puts it in range [arg_min, range+arg_min]
		//                                   = [arg_min, (arg_max - arg_min) + arg_min]
		//                                   = [arg_min, arg_max]
		return arg_numb * range + arg_min;
	}
	
	
	
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
		
		//last index after a good replacement.
		var intPreviousStop = 0;
		//Recent replacement instance found's start.
		var intRecent = strSrcSafe.indexOf(arg_strSearch, 0);
		
		//stop when no "search" strings remain
		while(intRecent !== -1){
			
			//add everything since the recently found search string
			strResult += arg_strSrc.substring(intPreviousStop, intRecent);
			
			//create an array of the replacement's size to be filled.  It will be filled with a blend of the original text's characters (case-wize) and the replacement's characters.
			var ary_chrTemp = new Array(strReplaceSafe.length);
			
			//compare the search string to the replacement string...
			for(i = 0; i < strReplaceSafe.length; i++){
				//keep track of the current character in the search and replacement strings.
				var chrSer;
				var chrRep;
				
				//if the replacement string is longer than the search, bolSkip will be true when it surpasses the search string in length.
				var bolSkip = (i >= strSearchSafe.length);
				
				//If not skipping the check, fetch the characters from search and replace to compare soon.
				if(!bolSkip){
					chrSer = strSearchSafe.charAt(i);
					chrRep = strReplaceSafe.charAt(i);
				}
				
				if(!bolSkip && chrSer === chrRep ){
					//If not skipping and the characters between the lowercased skip & replace match, copy over the source string's character case.
					//Corresponding index in the source string is of the start pos of the recently found match to search + i, the distance from that start.
					ary_chrTemp[i] = arg_strSrc.charAt(intRecent + i);
				}else{
					//Otherwise, stick to the replacment's own case (if applicable).
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
		
		//last index without a consecutive space character (to start searching for new spaces from)
		var intPreviousStop = 0;
		//next index of a space character, starting from intPreviousStop (0 for start) to search for consecutive spaces (if there are any)
		var intRecentSpace = strWorking.indexOf(" ", 0);
		
		
		while(intRecentSpace !== -1){
			
			if(intPreviousStop !== 0){
				strResult += " ";
				//a single space between words at least.  Any other spaces found will be ignored.
			}
			strResult += strWorking.substring(intPreviousStop, intRecentSpace);
			
			//counter.  Search for adjacent spaces.
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
	Purpose: merge an array of characters into a string.
	Parameters: (array-char) letters
	Return: (string) combined
	*/
	function concatenateLetterArray(arg_chrAry){
		//counter for loop.
		var i = 0;
		//result; the letters as one string.
		var strResultWord = "";
		
		for(i  = 0; i < arg_chrAry.length; i++){
			strResultWord += arg_chrAry[i];	
		}

		return strResultWord;
	}
	
	
	/*
	Purpose: count the number of digits in a string that may not consist entirely of digits
	
	Credit to 
	
http://stackoverflow.com/questions/7657824/count-the-number-of-integers-in-a-string
	
	Parameters: (array-char) letters
	Return: (string) combined
	*/
	function countDigits(arg_str){
		//remove all characters that are not digits.  "^" means not, so anything "not" 0 to 9 is removed.  Count what is left over.
		return arg_str.replace(/[^0-9]/g,"").length;
	}
	
	
	
	/*
	Purpose: check to see if the 1st string begins with the 2nd.  the usual string's "startsWith" method is sometimes unavailable in mobile devices.
	Parameters: (string) source, (string) to check (starts with?).
	Return: (bool) does the 1st begin with the 2nd?
	*/
	function beginsWith(arg_str, arg_check){
		if(arg_check.length > arg_str.length){
			//can't start with something longer than myself.
			return false;	
		}
		//cut the 1st string to the size of arg_check.  In the case of "eeffrr", if arg_check is "aa", this will cut "eeffrr" to "ee", which does not match "aa".  For "aaffrr", however, "aa" as arg_check does show a match.
		var strTest = arg_str.substring(0, arg_check.length);
		//if they match, 1st string begins with the 2nd.
		if(strTest === arg_check){
			return true;	
		}else{
			return false;	
		}
	}
	
	
	

});//end of document.ready

	