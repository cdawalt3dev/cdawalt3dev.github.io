/*
 Name: javascript.html
 Purpose: Stores Javascript
 Author: Chris Dawalt
 Created: 2018-1-9

*/



    
$(window).on('load', function(){
    console.log("CUSTOM MESSAGE: Window Loaded!");
    
    
});//END OF window.load

$(document).ready(function(){
    console.log("CUSTOM MESSAGE: Document ready!");

});//END OF document.ready


function updateQuantity(){
    var DOMinputRangeQuantity = document.getElementById("inputRangeQuantity");
    var DOMpQuantity = document.getElementById("pQuantity");
    DOMpQuantity.innerText = DOMinputRangeQuantity.value;
}//END OF updateQuantity()
        


