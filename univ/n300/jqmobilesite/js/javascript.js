/*
 Name: javascript.html
 Purpose: Stores Javascript
 Author: Chris Dawalt
 Created: 2018-1-25

*/



var errorPromptHappened = false;
var compoundPeriodsMemory = "";


$(window).on("load", function(){
    console.log("CUSTOM MESSAGE: Window Loaded!");
    
    
});//END OF window.load




$(document).ready(function(){
    console.log("CUSTOM MESSAGE: Document ready!");

    
    $("#buttonCalculate").click(function(){
        clearError();
        errorPromptHappened = false;
        clearOutputs();
        
        //inputs
        var interestType = $("#radGrpInterestType input:checked").val();
        var inputPrincipal = attemptParseFloat("Principal", $("#inputPrincipal").val());
        var inputInterestRate = attemptParseFloat("Interest Rate", $("#inputInterest").val());
        
        
        var inputTime = attemptParseFloat("Time", $("#inputTime").val());
        
        //may not necessarily be collected.
        var inputCompoundPeriods; 
        var continuousCompounding;
        
        //outputs to be determined
        var interestAmount;
        var totalAmount;
        
        
        //This section of script may be interrupted in case of an error message.
        while(true){
        
            //Any failure to collect inputs immediately halts the calculation.
            if(errorPromptHappened) break;
            
            
            if(interestType == "Simple"){
                //simple interestformula: Total = Principal + Principal * interestRate * time
                //                  or,   Interest = Principal * interestRate * time
                interestAmount = inputPrincipal * inputInterestRate * inputTime;
                totalAmount = interestAmount + inputPrincipal;
                
            }else{  //Compound
            
                continuousCompounding = $("#chkContinuous").prop("checked");
                
            
            
                if(continuousCompounding){
                    //continuous formula: Total = Principle * e^(interestRate * time)
                    
                    totalAmount = inputPrincipal * Math.exp(inputInterestRate * inputTime)
                    interestAmount = totalAmount - inputPrincipal;
                }else{
                    inputCompoundPeriods = attemptParseFloat("Compound Periods", $("#inputCompoundPeriods").val());
                    
                    //Issue getting Compound Periods? Stop.
                    if(errorPromptHappened) break;
                
                
                    //discrete continous formula: Total = Principle * (1 + interestRate / compoundPeriods)^(compoundPeriods * time)
                    totalAmount = inputPrincipal * Math.pow(1 + (inputInterestRate / inputCompoundPeriods), inputCompoundPeriods * inputTime )
                    interestAmount = totalAmount - inputPrincipal;
                }
                
            }
            
            //round to the nearest cent. Round 100 times as much as a whole number, then divide by 100.
            interestAmount = Math.round(interestAmount * 100) / 100;
            totalAmount = Math.round(totalAmount * 100) / 100;
            
            //write out outputs.
            $("#aInterestTotal").html(interestAmount);
            $("#aTotalAmount").html(totalAmount);
            
            
            //Forget this is meant to be a decimal?
            if(inputInterestRate >= 1){
                showError("WARNING: interest rate is 1 or more (100%).");
                errorPromptHappened = true;
            }
            
            break;  //this section only has to happen once.
        }//END OF !errorPromptHappened check
        
    });
    $("#buttonClearOutput").click(function(){
      clearOutputs();
      clearError();
    });
    $("#buttonClearAll").click(function(){
      clearInputs();
      clearOutputs();
      clearError();
    });
    
    $("#chkContinuous").change(function() {
        chkContinuous_onChange( $(this).prop("checked") );
        clearError();
    });
    
    $("#radGrpInterestType").change(function() {
        radGrp_onChange();
        clearError();
    });
    
    
    //init here.
    radGrp_onChange(   );
    chkContinuous_onChange_auto();
    clearError();
    
});//END OF document.ready





function clearInputs(){
    //$("#radGrpInterestType input:checked").val();
    $("#inputPrincipal").val("");
    $("#inputInterest").val("");
    $("#inputTime").val("");
    $("#inputCompoundPeriods").val("");
    chkContinuous_onChange_auto();
    
    
}


function clearOutputs(){
    $("#aInterestTotal").html("");
    $("#aTotalAmount").html("");
}


function attemptParseFloat(argName, argRawText){
    
    if(!errorPromptHappened){
    
        
        try {
            var floatAttempt = parseFloat(argRawText);
            
            if( isNaN(floatAttempt)){
                throw "fail";
            }
            return floatAttempt;
        }
        catch(err) {
            //only show once.
            //alert("ERROR: enter a number at '" + argName + "'.");
            showError("ERROR: Enter a number at \"" + argName + "\".");
            errorPromptHappened = true;
            return 0;
        }
        
    
    }

}//END OF attemptParseFloat(...)




function clearError(){
    $("#divInputError").css({"background-color":"rgba(0, 0, 0, 0.0)"});
    $("#pInputError").html("");
}
function showError(argMessage){
    $("#divInputError").css({"background-color":"#ffb4b4"});
    $("#pInputError").html(argMessage);
}


function chkContinuous_onChange_auto(){
    chkContinuous_onChange( $("#chkContinuous").prop("checked")  );
}

function chkContinuous_onChange(isChecked){
    
    clearOutputs();
    
    if( isChecked ) {
        compoundPeriodsMemory = $("#inputCompoundPeriods").val();
        $("#inputCompoundPeriods").prop("type", "text");
        $("#inputCompoundPeriods").val( String.fromCharCode(8734) );
        $("#inputCompoundPeriods").prop("readonly", true);
    }else{
    
        ////This browser may have form memory. If so, overwrite the old value ONLY IF it is infinity here. Otherwise, imply they wanted to keep what is here already.
        if($("#inputCompoundPeriods").val() == String.fromCharCode(8734) ){
        
            if(compoundPeriodsMemory != ""){
                //restore what the user entered before.
                $("#inputCompoundPeriods").val( compoundPeriodsMemory );
            }else{
                //blank it.
                $("#inputCompoundPeriods").val( "" );
            }
            
        }
        $("#inputCompoundPeriods").prop("readonly", false);
        $("#inputCompoundPeriods").prop("type", "number");
    }
    
}

function radGrp_onChange(){
    var myVal = $("#radGrpInterestType input:checked").val();
    
    clearOutputs();
    
    if(myVal == "Simple"){
        $(".divHidable").addClass("divHidden");
    }else{    //Compound
        $(".divHidable").removeClass("divHidden");
    }

}


function updateQuantity(){
    var DOMinputRangeQuantity = document.getElementById("inputRangeQuantity");
    var DOMpQuantity = document.getElementById("pQuantity");
    DOMpQuantity.innerText = DOMinputRangeQuantity.value;
}//END OF updateQuantity()
        


