


//Cost of a sword in the shop.
var SHOP_COST_SWORD = 100;



//Event for loading the page.
function custom_pageStart(){
	setupShopClickables();
}


function custom_updateGraphics(){
    
}









//The shop has one item for sale: a sword for SHOP_COST_SWORD gold.
//Clicking the buy button works intuitively: tell the player they don't 
//have enough gold if that is the case, or put the sword in their inventory
//and hide the buy button if they have enough.
//Returning to the shop shows a "out of stock" message. The buy button won't 
//come back.
function setupShopClickables(){
	
	if(localStorage.getItem("shop_sword") == "1"){
		
		$("#pCustomMessage").html("Welcome to the shop.<br/>We have a sword for " + SHOP_COST_SWORD + " coins.");

		$("#JS_ChoiceBuySword").css({display:"inline-block"});
					
		$("#JS_ChoiceBuySword").click(function(){
			var playerGoldInitial = getGold();
			if(playerGoldInitial >= SHOP_COST_SWORD){
				var availableInventoryID = getEmptyInventoryID();
				if(availableInventoryID != -1){
					localStorage.setItem("shop_sword", "0");
					
					setInventorySlot(availableInventoryID, ID_INV_SWORD);
					changeGold( -SHOP_COST_SWORD);
					
					$("#JS_ChoiceBuySword").css({display:"none"});
					
					$("#pCustomMessage").html("Thank you!");
				}else{
					$("#pCustomMessage").html("Your inventory is full, can\'t take it.");
				}
			}else{
				$("#pCustomMessage").html("Sorry, not enough gold.");
			}
			
		});
	}else{
		$("#pCustomMessage").html("Welcome to the shop.<br/>Sorry, out of stock.");
	}
}//END OF setupShopClickables


