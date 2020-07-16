

//Extra key constants for SimpleGame.
K_ENTER = 13;
K_SHIFT = 16;
K_CTRL = 17;
K_ALT = 18;
K_INSERT = 45;
K_DEL = 46;
K_NUMPAD_0 =  96;
K_NUMPAD_1 =  97;
K_NUMPAD_2 =  98;
K_NUMPAD_3 =  99;
K_NUMPAD_4 = 100;
K_NUMPAD_5 = 101;
K_NUMPAD_6 = 102;
K_NUMPAD_7 = 103;
K_NUMPAD_8 = 104;
K_NUMPAD_9 = 105;
K_NUMPAD_PERIOD = 110;
//K_END = 35;



//WARNING - if simpleGame_1_0.js is updated, make sure the generated Canvas element is still placed
//in the same spot (see method "extraCanvasSetup" below). If not, this must be fixed to run properly.



var audioSlotAmount = 16;


var personMoveSpeed = 7.9;
var personMoveFriction = 0.64;




var screenIndex = SCREEN_SPLASH;
var SCREEN_SPLASH = 0;
var SCREEN_INSTRUCTIONS = 1;
var SCREEN_INGAME = 2;
var SCREEN_END = 3;




//Class ID's are quick ways to identify the type of something else.
var CLASSID_NONE = 0;
var CLASSID_Player = 1;
var CLASSID_PersonAI = 2;
var CLASSID_ArrowProjectile = 3;



var arrowSpeed = 40;

//ownerFactionID represents who owns the arrow.
var FACTION_PLAYER = 0;
var FACTION_ALLY = 1;
var FACTION_ENEMY = 2;




var playerHealthBarTransparency = 0.73;
var genericHealthBarTransparency = 0.68;

//Distance to place the healthbar away from the PersonAI vertically,
//in the direction above or below accordingly.
//A positive number is further away from the PersonAI, negative is closer.
var personAI_healthBarVerticalOffset = -22;	



var PersonAI_MAXHEALTH = 55;
var Player_MAXHEALTH = 160;

var ArrowProjectile_HITDAMAGE = 20;

//how much to affect the player score by for making the final hit on
//an ally (penalty; negative) or enemy.
var Ally_POINTBOUNTY = -100;
var Enemy_POINTBOUNTY = 20;

var PersonAI_RELOADDURATION = 1.5;
var Player_RELOADDURATION = 0.14;

//var Player_POWER_DURATION = 5;
//var Player_POWER_COOLDOWN_DURATION = 30;

	
//how much health to add (recover) every second of time.
var Player_AutoHealAmount = 4;
var PersonAI_AutoHealAmount = 2.5;


//if moving less than this speed while slowing down, instantly stop.
//No need to keep sliding like we're on ice.
var personStopSpeed = 5;
	
	
	
	
	
//CLASS SpriteInfo.
//More of a struct. Only stores the path to load an image and its dimensions.
//Gets a scale to apply to width, height and several other features too.
//Also gets a boundCeneter and boundSize as X,Y pairs.
//boundCenter stores a rotatable point to act as the center of bounds for collision, assuming the sprite is facing right like in the source image.
//NOTE that boundCenter starts from the center of the sprite, not the top-left corner. So a center of (0, 0) is at the center.
//boundSize is used to build the bounds centered on this point rotated to match how the image is rotated in real use.
//NOTE - scale is already applied to the width, height, etc. But is still saved for reference for hardcoded points gathered when the image was at 100% size.
function SpriteInfo(arg_filePath, arg_width, arg_height, arg_scale, arg_boundCenter_x, arg_boundCenter_y, arg_boundSize_x, arg_boundSize_y){
    this.filePath = "img/"+arg_filePath;
	this.spriteScale = arg_scale;
	this.width = arg_width * this.spriteScale;
    this.height = arg_height * this.spriteScale;
	this.boundCenter_x = arg_boundCenter_x * this.spriteScale;
	this.boundCenter_y = arg_boundCenter_y * this.spriteScale;
	this.boundSize_x = arg_boundSize_x * this.spriteScale;
	this.boundSize_y = arg_boundSize_y * this.spriteScale;
	
	//pre-calculated offsets from the boundCenter_x to be individually rotated too.
	this.bound_min_x = this.boundCenter_x - this.boundSize_x/2;
	this.bound_min_y = this.boundCenter_y - this.boundSize_y/2;
	this.bound_max_x = this.boundCenter_x + this.boundSize_x/2;
	this.bound_max_y = this.boundCenter_y + this.boundSize_y/2;
	
}//END OF SpriteInfo class (struct?)


