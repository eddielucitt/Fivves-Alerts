//ATA 
//by Atenshic (twitch.tv/atenshic, www.atenshic.com, twitter.com/Atenshic)

/*======================================================================================================================================*/
/*======================================================================================================================================*/
/*==========================================================START PASTING HERE==========================================================*/
/*======================================================================================================================================*/
/*======================================================================================================================================*/
/*======================================================================================================================================*/

//My code is really messy as I'm lazy, I tried to add some helpful comments but oh well
//I forgot javascript != java, so line spacing + indentation is all nasty if you happen to be a programmer

//For colors, if you set them with rgba(r,g,b,a) values you can make it so they have opacity levels
//Ex: rgba(150,150,150,0.5) will be gray with half transparency, this will work with any value below that has a color associated

/*======================================================================================================================================*/
/*=====================================YOU CAN EDIT THE FEW ANIMATIONS DISPLATED BELOW IF YOU WANT======================================*/
/*======================================================================================================================================*/

//This lists the animations that are randomly used, you can remove some. These are from the animation.css library (google it if you want to see what each
//looks like)

//If you want to remove an animation, simply remove the text and the two encasing quotations, as well as the comma of the animation you want gone
//Ex: var animationListExit = ["option animated flash","option animated shake", "option animated hinge"] would become
// var animationListExit = ["option animated flash","option animated hinge"] if you wished to remove the shake animation

//For when the follower alerts pops up (entrance animation)
var animationListEntrance = ["option animated zoomIn"];

//For when the follower alert leaves the screen (exit animation)
var animationListExit = ["option animated zoomOut"];


/*======================================================================================================================================*/
/*======================================================================================================================================*/
/*==================================DON'T MODIFY ANYTHING BELOW UNLESS YOU KNOW WHAT IT DOES============================================*/
/*======================================================================================================================================*/
/*======================================================================================================================================*/
/*======================================================================================================================================*/


//Variable from webm feature I'm probably abandoning
var isVideo = false;

var alertPlaying = true; //Since one is displayed at the start

//Audio stuff
var audio = new Audio('audio/alert1.mp3');
var ttsSource = "http://translate.google.com/translate_tts?ie=utf-8&tl=" + ttsLanguage + "&q=";

//Stuff
var imageSelected = false; //Variable used to check whether the randomize function has selected a valid image 
var currentDisplayedFollower = "Test User"; //Holds the naem of the current displayed follower on the current on screen alert
var currentImage ="blank"; //This holds the location of the current image being displayed
var firstLoad = true; //This is used more for testing alerts
var newFollowers = []; //Array used to hold the list of current followers


//This is used for creating the api requests to the twitch server
var baseRequest = "https://api.twitch.tv/kraken/channels/" + twitchChannel;
var followRequest = baseRequest + "/follows?direction=desc&limit=100&callback=?";

var subscribeRequest = baseRequest +"/subscriptions?direction=desc&limit=1&callback=?&oauth_token=" + accessToken;
var subscribers = {};
var newSubscribers = [];

//Creates the variable to hold the follower list 
var followers = {};

//Subscriber program link thing
var keyGeneratorLink = "https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=6d9h6o7vnuq5fa7t1xweutfs6ceigjy&redirect_uri=http://localhost&scope=channel_check_subscription+channel_subscriptions";
var invalidKey = "none";


//Variables used to pick the animation to be played
var animationEntAmount = animationListEntrance.length;
var animationExitAmount = animationListExit.length;
var currentEntAnimation= "nothing";
var currentExitAnimation = "nothing";

//Runs the loadFollowers function when page is loaded
window.onload=loadFollowers;

//Obtains any new followers than calls showFollower function to display them
function grabFollowers(firstTime) {
	
	//Request for followers
	$.getJSON(followRequest, function(data) {
	
		if(data.follows) {
			 if(firstTime) {
				  data.follows.forEach(function(follower) {
				  followers[follower.user.name] = true;
				   
				});
			 } else {
				data.follows.forEach(function(follower) {
					if(!followers[follower.user.name]) {
						followers[follower.user.name] = true;
						newFollowers.push(follower.user.display_name);
					
					}
				});
			  }
		}
	});
	
	baseRequest = "https://api.twitch.tv/kraken/channels/" + twitchChannel;
	var subscribeRequest = baseRequest +"/subscriptions?direction=desc&limit=1&callback=?&oauth_token=" + accessToken;
	//This checks for any new subscribers
	if (!(accessToken == "none" || accessToken == "invalidKey")){
		//Request for subscribers, I'm probably dropping this
		$.getJSON(subscribeRequest, function(data) {
	
			if (data.status == 422){
				invalidKey = accessToken;
				$('#keyValid').text("No subscriber program");
				return;
			}
			
			$('#keyValid').text("Invalid or no access key!");
			/* if(data) {
				 alert(JSON.stringify(data, null, 4));
			} */
			if(data.subscriptions) {
			$('#keyValid').text("Valid subscriber program!");
			 if(firstTime) {
				  data.subscriptions.forEach(function(subscriber) {
				  subscribers[subscriber.user.name] = true;
				   
				});
			 } else {
				data.subscriptions.forEach(function(subscriber) {
					if(!subscribers[subscriber.user.name]) {
						subscribers[subscriber.user.name] = true;
						newSubscribers.push(subscriber.user.display_name);
					
					}
				});
			  }
		}
			
			
		}); 
	}
	
	
	
	
	
	  
}
	
//Randomizes the next alert to be played (audio + image)
function randomizeAlert(){
		
	getRandomImage();
	getRandomAudio();
				 
	
}
	
	
//Obtains a random png,jpg, or gif image
function getRandomImage(){



	var randomImage;
	image = document.getElementById('alert-image');
	
	//Checks to see if there are any images or webm's in the list, if not, uses default blank image
	if (imageList.length!=0){
		randomImage = Math.floor((Math.random() * imageList.length) );
		currentImage = imageList[randomImage];
		
		
		//This runs if the image selected is secretly not an image, but a webm/mp4!
		var imageExtension = imageList[randomImage];
		imageExtension = imageExtension.split('.')[1];
		imageExtension.toLowerCase();
		
		if (imageExtension == "webm" || imageExtension == "mp4"){
			isVideo = true;
			$("#alert-video").attr("src", currentImage);
		}else{
			isVideo = false;
		}
	}else{
		isVideo = false;
		currentImage ="images/blank.gif";
	}

	
	
			
	image.src = currentImage;
	image.style.height = imageHeight;
	image.style.width = imageWidth;
}
	
//Function used to play random audio clips
function getRandomAudio(){
	
	if (ttsEnabled){
		//Uses tts instead of an audio clip
		audio.src =ttsSource + preMessage + currentDisplayedFollower + postMessage;
	}else{
		//Loads a random audio clip
		if (audioList.length!=0){
			var selectedAudio = Math.floor((Math.random() * audioList.length));
			var audioSource = audioList[selectedAudio];
			audio = new Audio(audioSource);
		}
		
	}

	audio.volume = alertVolume;
		
	//Plays the audio clip
	audio.play();
}
	
//Used for getting user input and changing it so they can preview alerts
function confirmTestChanges(){
	
	
	//Obtains the user input and changes all elements respectively based on them
		
	twitchChannel = $('#twitchChannel').val();
	accessToken = $('#accessToken').val();
	
	folderName = $('#folderName').val();
	folderName = folderName.replace(/\\/g,'\/');
	//Makes sure folder name is nice and proper
	if (folderName != "default"){
		folderName += "/";
	}
	
	//Font values
	fontColor = $('#fontColorBox').val();
	fontSize = $('#fontSize').val() + "px";
	fontType = $('#fontType').val();
	
	//Strips "p." text off the font type so it's proper
	fontType = fontType.replace('p.','');
	
	fontWidth = $('#fontWidth').val();
	fontOutlineColor = $('#fontOutlineColor').val();
	fontOutlineSize = $('#fontOutlineSize').val() + "px";
	fontFadeColor = $('#fontFadeColor').val();
	fontHeight = $('#fontHeight').val() + "px";
	
	shadowStrokeSizeX = $('#sssx').val();
	shadowStrokeSizeY = $('#sssy').val();
	shadowStrokeColor = $('#ssc').val();
	
	fontRotation =parseInt($('#fra').val());
	fontRadius =$('#frad').val();
	radiusStart =parseInt($('#frast').val());
	
	followerColor = $('#ffc').val();
	followerSize = $('#ffs').val() + "px";
		
	//Font background values
	fbc = $('#fbc').val();
	fbos = $('#fbos').val() + "px";
	fboc = $('#fboc').val();
	fbp = $('#fbp').val() + "px";
	fbs = $('#fbs').val();
	
	//Individual Font background values
	ifbc = $('#ifbc').val();
	ifbos = $('#ifbos').val() + "px";
	ifboc = $('#ifboc').val();
	ifbp = $('#ifbp').val() + "px";
	ifbs = $('#ifbs').val();
		
	//Image values
	imageOpacity = $('#imageOpacity').val();
	imageBorderStyle = $('#imageBorderStyle').val();
	imageBorderColor = $('#imageBorderColor').val();
	imageBorderSize = $('#imageBorderSize').val() + "px";
	imageWidth = $('#imageWidth').val();
	imageHeight = $('#imageHeight').val();
	imageZIndex = $('#imageZIndex').val();
		
	//Alert values 
	preMessage = $('#preM').val() + " ";
	postMessage = " " + $('#postM').val();
	alertVolume = $('#alertVolume').val();
	alertLength = $('#alertLength').val();
	requestTime = parseInt($('#requestTime').val());
	alertCheckTime = parseInt($('#alertCheckTime').val());
	
	//TTS values
	
	if ($('#ttsE').val() == "true"){
		ttsEnabled = true;
	}else{
		ttsEnabled = false;
	}
	
	//Gets the tts language, strips off the description and blank spaces and gets the source for it
	ttsLanguage = $('#ttsL').val();
	if(ttsLanguage.indexOf(') ') !== -1){
		ttsLanguage = ttsLanguage.split(') ')[1];
		ttsLanguage = ttsLanguage.trim();
		ttsSource = "http://translate.google.com/translate_tts?ie=utf-8&tl=" + ttsLanguage + "&q=";
	}
	

	
	//Updates all current on screen properties
	updateAppearance();
			
}
	
	
//Function used to display position information when an element is dragged
function viewInfo(){
	
		//Sets the default values on the first load
		if (firstLoad){
			
			
		
		//	$('#information').css("visibility", "visible");
			$('#fontColorForm').css("visibility", "visible");
			$('#changeValues').css("visibility", "visible");
			
			$('#twitchChannel').val(twitchChannel);
			$('#accessToken').val(accessToken);
			$('#folderName').val(folderName);
			
			$('#fontOutlineColor').val(fontOutlineColor);
			$('#fontOutlineSize').val(fontOutlineSize.replace('px',''));
			$('#ssc').val(shadowStrokeColor);
			$('#sssx').val(shadowStrokeSizeX);
			$('#sssy').val(shadowStrokeSizeY);
			$('#ffc').val(followerColor);
			$('#ffs').val(followerSize.replace('px',''));
			$('#fontColorBox').val(fontColor);
			$('#fontSize').val(fontSize.replace('px',''));
			$('#fontType').val(fontType);
			$('#fontWidth').val(fontWidth);
			$('#fontFadeColor').val(fontFadeColor);
			$('#imageWidth').val(imageWidth);
			$('#imageHeight').val(imageHeight);
			$('#alertLength').val(alertLength);
			$('#requestTime').val(requestTime);
			$('#alertCheckTime').val(alertCheckTime);
			$('#fontHeight').val(fontHeight.replace('px',''));
			$('#preM').val(preMessage);
			$('#postM').val(postMessage);
			$('#alertVolume').val(alertVolume);
			$('#fbc').val(fbc);
			$('#fboc').val(fboc);
			$('#fbp').val(fbp.replace('px',''));
			$('#fbos').val(fbos.replace('px',''));
			$('#fbs').val(fbs);
			$('#ifbc').val(ifbc);
			$('#ifboc').val(ifboc);
			$('#ifbp').val(ifbp.replace('px',''));
			$('#ifbos').val(ifbos.replace('px',''));
			$('#ifbs').val(ifbs);
			$('#fra').val(fontRotation);
			$('#frad').val(fontRadius.replace('px',''));
			$('#frast').val(radiusStart);
			
			if (ttsEnabled){
				$('#ttsE').val("true");
			}else{
				$('#ttsE').val("false");
			}
			
			$('#ttsL').val(ttsLanguage);
			$('#imageOpacity').val(imageOpacity);
			$('#imageBorderColor').val(imageBorderColor);
			$('#imageBorderStyle').val(imageBorderStyle);
			$('#imageBorderSize').val(imageBorderSize.replace('px',''));
			$('#imageZIndex').val(imageZIndex);
			firstLoad=false;
				
		}
			
			
		//Displays information to the user 
		var infoText ="";
		
		//Updates video/image position when the other is moved
		if (isVideo){
			imageXPos = $('#alert-video').css("left");
			imageYPos = $('#alert-video').css("top");
			$('#alert-image').css("left", imageXPos);
			$('#alert-image').css("top", imageYPos);
		}else{
			//THIS IS IT SOMEHOW
			imageXPos = $('#alert-image').css("left");
			imageYPos = $('#alert-image').css("top");
			//$('#alert-video').css("top", imageXPos);
			//$('#alert-video').css("left", imageYPos);
		}
			
		infoText+= "imgXPos: " + $('#alert-image').css("left") + " "; 
		infoText+= "|| imgYPos: " + $('#alert-image').css("top") + " "; 
		infoText+= "|| fontXPos: " + $('#new-subscriber').css("left") + " "; 
		infoText+= "|| fontYPos: " + $('#new-subscriber').css("top") + " " + " || "; 
		infoText+= "<br>Amount of entrance animations: " + animationListEntrance.length + " "; 
		infoText+= "Amount of exit animations: " + animationListExit.length + "<br>"; 
		//$('#information').html(infoText);
			
		//Sets it so that the scroll bar is at the top when loaded
		$( "#body" ).scrollTop();
		//$( "#body" ).text( "scrollTop:" + scrollTop() );
			
}

		
//Updates the appearance
function updateAppearance(){


	
	//Updates z-index 
	document.getElementById("alert-image").style.zIndex = imageZIndex;
	
	
	//Updates the look of the background border and stuff for the font
	$('#new-subscriber').css("border", fbos + " " + fbs + " " + fboc);
	$('#new-subscriber').css("background", fbc);
	$('#new-subscriber').css("padding", fbp);
	$('#new-subscriber').css("font-size", fontSize);
	$('#new-subscriber').css("color", fontColor);
	$('#new-subscriber').css("font-family", fontType);
	$('#new-subscriber').css("width", fontWidth);
	$('#new-subscriber').css("-webkit-text-stroke", fontOutlineSize + " " + fontOutlineColor);
	$('#new-subscriber').css("line-height", fontHeight);

	//Updates any values relating to the image
	$('#alert-image').css("border", imageBorderSize + " " + imageBorderStyle + " " + imageBorderColor);
	$('#alert-image').css("opacity", imageOpacity);
	$('#alert-image').css("width", imageWidth);
	$('#alert-image').css("height", imageHeight);
	
	//Updates any values relating to the video
	$('#alert-video').css("border", imageBorderSize + " " + imageBorderStyle + " " + imageBorderColor);
	$('#alert-video').css("opacity", imageOpacity);
	$('#alert-video').css("width", imageWidth);
	$('#alert-video').css("height", imageHeight);

	
	//Update any video values
	var myVideo = document.getElementById("alert-video"); 
	myVideo.width = imageWidth;
	
	
	//Applies lettering to the sentence to each letter can be individually manipulated
	$("h1").lettering();
		
		
	//Sets the font rotation stuff if it's used
	if (fontRotation == 0){
		$('h1 span').css("position","relative");
	}else{
		$('h1 span').css("position","absolute");
		$('h1 span').css("height",fontRadius);
	}
	
	
		//Generates the shadow for the font
		var strokeString = shadowStroke();
	
	
		//Applies the values to each individual letter
		var charTransformAmount = preMessage.length + currentDisplayedFollower.length + postMessage.length + 1;
		
		for (x=1;x<charTransformAmount;x++){
		
			var transformAmount = radiusStart + (fontRotation*x);
			transformAmount = "rotate(" + transformAmount + "deg)";
			
			$('.char' + x).css({
			"webkitTransform":transformAmount,
			"MozTransform":transformAmount,
			"msTransform":transformAmount,
			"OTransform":transformAmount,
			"transform":transformAmount,
			"font-size": fontSize,
			"color":fontColor,
			"font-family": fontType,
			"border":  ifbos + " " + ifbs + " " + ifboc,
			"background": ifbc,
			"padding": ifbp,
			"width":fontWidth,
			"line-height": fontHeight,
			"-webkit-text-stroke": fontOutlineSize + " " + fontOutlineColor,
			"text-shadow": strokeString
			}); 
			
			
			//Applies these values only to the follower name text
			if (x> preMessage.length && x<(preMessage.length + currentDisplayedFollower.length+1)){
				$('.char' + x).css({
				"color":followerColor,
				"font-size": followerSize
				});
			}
			
			
		}
		
		
		
		
}

//Generates the string for adding a shadow to the font
function shadowStroke(){
		//Font shadow thing
		var shadowFont = "";

		for (x=-1*shadowStrokeSizeX;x<shadowStrokeSizeX;x++){
			for (y=-1*shadowStrokeSizeY;y<shadowStrokeSizeY;y++){
				shadowFont+= x + "px " + y + "px " + " 0 " + shadowStrokeColor + ","; 
			}
			
		}
		
		shadowFont = shadowFont.substring(0, shadowFont.length - 1);
		
		return shadowFont;
}
	
//When the page loads, it will set an interval to contact the twitch server for followers
function loadFollowers()
{

	//Alows video to be dragged
	 $( "#alert-video" ).draggable({
		drag: function(event,ui){
			
			viewInfo();
		}
	});
 
	//Allows image to be dragged, and triggers viewInfo() when it is
	 $( "#alert-image" ).draggable({
		drag: function(event,ui){
			
			viewInfo();
		}
	});
	

	//Allows text to be dragged, and triggers viewInfo() when it is
	$( "#new-subscriber" ).draggable({
		drag: function(event,ui){
			viewInfo();
		}
	});
	
	//Loads image values
	$('#alert-image').css("width", imageWidth);
	$('#alert-image').css("height", imageHeight);
	$('#alert-image').css("left", imageXPos);
	$('#alert-image').css("top", imageYPos);
	$('#alert-image').css("opacity", imageOpacity);
	
	//Loads video values
	$('#alert-video').css("width", imageWidth);
	$('#alert-video').css("height", imageHeight);
	$('#alert-video').css("left", imageXPos);
	$('#alert-video').css("top", imageYPos);
	$('#alert-video').css("opacity", imageOpacity);
	
	//Loads font values
	$('#new-subscriber').css("font-family", fontType);
	$('#new-subscriber').css("font-size", fontSize);
	$('#new-subscriber').css("font-size", fontSize);
	$('#new-subscriber').css("-webkit-text-stroke", fontOutlineSize + " " + fontOutlineColor);
	$('#new-subscriber').css("left", fontXPos);
	$('#new-subscriber').css("top", fontYPos);
	$('#new-subscriber').css("color", fontFadeColor);	

    grabFollowers(true);
	showAlert("Test User");
	
	//setTimeout(setInterval(grabFollowers(false), requestTime),5000);
	setInterval(grabFollowers, requestTime); //How often fetch requests are sent to the twitch server, 20000ms = 2 seconds
	//setInterval(alertCheck, alertLength+3000); //Alert queue check interval
	setInterval(alertCheck,alertCheckTime);
	//setInterval(alertCheck,1000);
 }
  
  //Checks every alertLength + 3 seconds for any new followers in the queue
function alertCheck(){
	
	//opacityChange();
	
	var followerName ="none";
	
	//For checking subscribers, no testing has been done
	if (newSubscribers.length>0 && !alertPlaying){
		followerName = newSubscribers.shift(); //Shift so it's FIFO instead of FILO
		currentDisplayedFollower = followerName;
		alertPlaying = true;
		showAlert("User "  + followerName + " has subscribed to the channel");
		return;
	}
	
	//For checking followers
	if (newFollowers.length>0 && !alertPlaying){
		//followerName = newFollowers.pop(); This is FILO
		followerName = newFollowers.shift(); //Shift so it's FIFO instead of FILO
		currentDisplayedFollower = followerName;
		alertPlaying = true;
		showAlert(preMessage + followerName + postMessage);
	}
	
	//Updates alert count for user to see
	$('#alertMessage').html(newFollowers.length);
}

  //Animation that displays the followers
  function showFollower(followerText) {
  
	$('#new-subscriber').html(followerText);

	//Re-enables the visibility
	$('#new-subscriber').css("visibility", "visible");	
	
	
	//Changes opacity for webm or gif stuff
	if (isVideo){
		$('#alert-video').css("visibility", "visible");	
		var myVideo = document.getElementById("alert-video"); 
		myVideo.style.left = imageXPos;
		myVideo.style.top = imageYPos;
		myVideo.play();
		
	}else{
		$('#alert-image').css("visibility", "visible");	
	}
	
	
	//Removes the left over exit animation class
	$('#new-subscriber').removeClass(currentExitAnimation);
	$('#alert-image').removeClass(currentExitAnimation);
	
	
	updateAppearance();
	//Runs the follower animation
	$('#alert-image').css("-webkit-transition", "width 0.5s, opacity 0.5s, color 0.5s 0.5s");
	
	//Code for the follower text transition in
	$('#new-subscriber').css("-webkit-transition", "width 0.5s, opacity 0.5s, color 0.5s 0.5s");
	$('#new-subscriber').css("opacity", 1);
	
	
	
	//Chooses a random animation for entering
	var chosenAnimation = Math.floor((Math.random() * animationEntAmount) );
	currentEntAnimation = animationListEntrance[chosenAnimation];
	
	//Adds the entrance animation
	$('#new-subscriber').addClass(currentEntAnimation);
	$('#alert-image').addClass(currentEntAnimation);
	
	setTimeout(hideFollower,alertLength);
	
}

//This plays the exit animation and hides the alert
function hideFollower() {

	//Removes the entrance animation class
	$('#new-subscriber').removeClass(currentEntAnimation);
	$('#alert-image').removeClass(currentEntAnimation);
	
	//Chooses a random animation for exiting
	var chosenAnimation = Math.floor((Math.random() * animationExitAmount) );
	currentExitAnimation = animationListExit[chosenAnimation];
	$('#new-subscriber').addClass(currentExitAnimation);
	$('#alert-image').addClass(currentExitAnimation);
	
	//Code for the follower text transition out
	$('#new-subscriber').css("-webkit-transition", "width 0.5s 0.5s, opacity 0.5s 0.5s, color 0.5s");
	$('#new-subscriber').css("width", 0);
	$('#new-subscriber').css("opacity", 0);
	$('#new-subscriber').css("color", fontFadeColor);	
	
	//Code for the image transition out
	$('#alert-image').css("-webkit-transition", "width 0.5s, opacity 0.5s, color 0.5s 0.5s");
	$('#alert-image').css("width", 0);
	$('#alert-image').css("opacity", 0);
	$('#alert-image').css("color", 'rgba(153, 153, 153, 0');
	
	//Code for the video transition out
	$('#alert-video').css("-webkit-transition", "width 0.5s, opacity 0.5s, color 0.5s 0.5s");
	$('#alert-video').css("width", 0);
	$('#alert-video').css("opacity", 0);
	$('#alert-video').css("color", 'rgba(153, 153, 153, 0');

	
	setTimeout(opacityChange,3000);
	
	
}

//Function that is used to display alerts
function showAlert(followerText){
	randomizeAlert();
	showFollower(followerText);
  
}
 
 
 //Function used for playing a test alert
function playTestAlert(){
	
	//Pushes the amount of alerts specified by the user to the alert queue
	for (x=0;x<$('#alertQueue').val();x++){
		newFollowers.push("test" + x);
	}
	
	//Gets current alert queue amount and adds any new ones the user queues
	var currentAmount = document.getElementById('alertMessage').textContent;
	currentAmount = parseInt(currentAmount);
	$('#alertMessage').html(currentAmount + x);
}

	
//Some exit animations seem to glitch and leave left over stuff, this is to hide that if it happens
function opacityChange(){
	$('#new-subscriber').css("visibility", "hidden");	
	$('#alert-image').css("visibility", "hidden");
	$('#alert-video').css("visibility", "hidden");

	//Pauses the video
	var myVideo = document.getElementById("alert-video"); 
	myVideo.pause();
	
	alertPlaying = false;
	
}

function generateCode(){

	
	var codeGenerated = "";
	codeGenerated+="var twitchChannel = \"" + twitchChannel + "\";" + "<br>";
	codeGenerated+="var accessToken = \"" + accessToken + "\";" + "<br>";
	codeGenerated+="var requestTime = " + requestTime + ";" + "<br>";
	codeGenerated+="var alertCheckTime = " + alertCheckTime + ";" + "<br>";
	
	codeGenerated+="var ttsEnabled = " + ttsEnabled + ";" + "<br>";
	codeGenerated+="var ttsLanguage = \"" + ttsLanguage + "\";" + "<br>";
	
	codeGenerated+="var imageXPos = \"" + $('#alert-image').css("left") + "\";" + "<br>";
	codeGenerated+="var imageYPos = \"" + $('#alert-image').css("top") + "\";" + "<br>";
	codeGenerated+="var fontXPos = \"" + $('#new-subscriber').css("left") + "\";" + "<br>";
	codeGenerated+="var fontYPos = \"" + $('#new-subscriber').css("top") + "\";" + "<br>";
	
	codeGenerated+="var fontType = \"" + fontType + "\";" + "<br>";
	codeGenerated+="var fontWidth = " + fontWidth + ";" + "<br>";
	codeGenerated+="var fontHeight = \"" + fontHeight + "\";" + "<br>";
	codeGenerated+="var fontSize = \"" + fontSize + "\";" + "<br>";
	codeGenerated+="var fontColor = \"" + fontColor + "\";" + "<br>";
	codeGenerated+="var fontFadeColor = \"" + fontFadeColor + "\";" + "<br>";
	
	codeGenerated+="var folderName = \"" + folderName + "\";" + "<br>";
	codeGenerated+="var audioFolder = \"" + audioFolder + "\";" + "<br>";
	codeGenerated+="var imageFolder = \"" + imageFolder + "\";" + "<br>";
	
	codeGenerated+="var followerColor = \"" + followerColor + "\";" + "<br>";
	//codeGenerated+="var followerSize = " + followerSize + ";" + "<br>";
	codeGenerated+="var followerSize = \"" + followerSize + "\";" + "<br>";
	
	codeGenerated+="var fontOutlineColor = \"" + fontOutlineColor + "\";" + "<br>";
	codeGenerated+="var fontOutlineSize = \"" + fontOutlineSize + "\";" + "<br>";
	
	codeGenerated+="var shadowStrokeColor = \"" + shadowStrokeColor + "\";" + "<br>";
	codeGenerated+="var shadowStrokeSizeX = " + shadowStrokeSizeX + ";" + "<br>";
	codeGenerated+="var shadowStrokeSizeY = " + shadowStrokeSizeY + ";" + "<br>";
	
	codeGenerated+="var fbc = \"" + fbc + "\";" + "<br>";
	codeGenerated+="var fbp = \"" + fbp + "\";" + "<br>";
	codeGenerated+="var fbos = \"" + fbos + "\";" + "<br>";
	codeGenerated+="var fboc = \"" + fboc + "\";" + "<br>";
	codeGenerated+="var fbs = \"" + fbs + "\";" + "<br>";
	
	codeGenerated+="var ifbc = \"" + ifbc + "\";" + "<br>";
	codeGenerated+="var ifbp = \"" + ifbp + "\";" + "<br>";
	codeGenerated+="var ifbos = \"" + ifbos + "\";" + "<br>";
	codeGenerated+="var ifboc = \"" + ifboc + "\";" + "<br>";
	codeGenerated+="var ifbs = \"" + ifbs + "\";" + "<br>";
	
	codeGenerated+="var fontRotation = " + fontRotation + ";" + "<br>";
	codeGenerated+="var fontRadius = \"" + fontRadius + "\";" + "<br>";
	codeGenerated+="var radiusStart = " + radiusStart + ";" + "<br>";
	
	codeGenerated+="var imageWidth = \"" + imageWidth + "\";" + "<br>";
	codeGenerated+="var imageHeight = \"" + imageHeight + "\";" + "<br>";
	codeGenerated+="var imageOpacity = \"" + imageOpacity + "\";" + "<br>";
	codeGenerated+="var imageBorderColor = \"" + imageBorderColor + "\";" + "<br>";
	codeGenerated+="var imageBorderSize = \"" + imageBorderSize + "\";" + "<br>";
	codeGenerated+="var imageBorderStyle = \"" + imageBorderStyle + "\";" + "<br>";
	codeGenerated+="var imageZIndex = " + imageZIndex + ";" + "<br>";
	
	codeGenerated+="var preMessage = \"" + preMessage + "\";" + "<br>";
	codeGenerated+="var postMessage = \"" + postMessage + "\";" + "<br>";
	codeGenerated+="var alertLength = " + alertLength + ";" + "<br>";
	codeGenerated+="var alertVolume = " + alertVolume + ";" + "<br>";
	
	codeGenerated+="var imageList = [";
	
	for (x=0;x<imageList.length;x++){
		codeGenerated += "\"" + imageList[x] + "\"";
		if (!(x == (imageList.length-1))){
			codeGenerated += ",";
		}
		
	}
	codeGenerated+="];<br>";
	
	codeGenerated+="var audioList = [";
	
	for (x=0;x<audioList.length;x++){
		codeGenerated += "\"" + audioList[x] + "\"";
		if (!(x == (audioList.length-1))){
			codeGenerated += ",";
		}
		
	}
	codeGenerated+="];<br>";
	
    newWindow = window.open("", null, "height=200,width=400,status=yes,toolbar=no,menubar=no,location=no");  

	newWindow.document.write("//Copy and replace all the text into alert-variables.js! <br><br>");
    newWindow.document.write(codeGenerated);  

}

function audioReset(){
	audioList = [];
}

function getKey(){
	newWindow = window.open("", null, "height=650,width=550,status=yes,toolbar=no,menubar=no,location=no");  
	newWindow.moveTo(500, 100)
	newWindow.document.write("<center><img src=\"images/clover.png\" width=200 height=200/></center><br><br>");
	newWindow.document.write("<h4>");
	newWindow.document.write("When you click the link below named \"Get access key\", you'll be asked to allow authorization for access to channel subscriptions. Click authorize ");
	newWindow.document.write("and it'll take you to a blank page. In this new blank page, what you'll want to get is the access token in the address ");
	newWindow.document.write("bar. Just copy the text between the = sign and the & sign. This is your access token, do not share it as it is like ");
	newWindow.document.write("a password for your account. The image below is an example of what you want to copy.<br>");
	newWindow.document.write("<br><img src=\"images/example.jpg\" /><br><br>");
	newWindow.document.write("<center><a href=\"" + keyGeneratorLink + "\">Get access key</a></center><br>");
	
    //newWindow.document.write(codeGenerated);  
}

function imageReset(){
	imageList = [];
}