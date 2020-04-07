let screenSizePromptCount = 0, numScreenSizeWarnings = 2;
function countDown(seconds){
  frCtx.clearRect(0, 0, frCanvas.width, frCanvas.height);
  frCtx.fillStyle = "black";
  frCtx.font = "bold 60px Arial";
  if (seconds > 0){
    frCtx.fillText(seconds,frCanvas.width/2,frCanvas.height/2)
    setTimeout(function(){countDown(seconds - 1)},1000);
  } else {
    taskFunc();
  }
}

// Fisher-Yates shuffle
function shuffle(array){
  for(let j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
  return array;
}

function promptLetGo(){
  keyListener = 4;

  //prepare canvas
  frCtx.clearRect(0, 0, frCanvas.width, frCanvas.height);
  frCtx.fillStyle = "black";
  frCtx.font = "30px Arial";

  // show warning
  frCtx.fillText("Please release key",frCanvas.width/2,frCanvas.height/2);
  frCtx.fillText("immediately after responding.",frCanvas.width/2,frCanvas.height/2 + 30);
}

// code for checking screen size
function screenSizeIsOk(){
  // attempts to check window width and height, using first base JS then jquery.
  // if both fail, returns TRUE
  let w, h, minWidth = 800, midHeight = 600;
  try {
    // base javascript
    w = window.innerWidth;
    h = window.innerHeight;
    if (w == null | h == null) {throw "window.innerWidth/innerHeight failed.";}
  } catch (err) {
    try{
      // jquery
      w = $(window).width();
      h = $(window).height();
      if (w == null | h == null) {throw "$(window).width/height failed.";}
    } catch (err2) {
      // failure mode, returns true if both screen checks failed
      return true;
    }
  }
  // return dimension check if values are defined
  return w >= minWidth && h >= midHeight;
};

function promptScreenSize(){
  // set key press experiment type
  keyListener = 10;

  // prepare canvas
  frCtx.clearRect(0, 0, canvas.width, canvas.height);
  frCtx.fillStyle = "black";
  frCtx.font = "25px Arial";

  // allows up to two warnings before terminating experiment
  if (screenSizePromptCount < numScreenSizeWarnings) {
    screenSizePromptCount++;

    // display screen size prompt
    frCtx.font = "25px Arial";
    frCtx.fillText("Your screen is not full screen or the",myCanvas.width/2,myCanvas.height/2);
    frCtx.fillText("screen size on your device is too small.",myCanvas.width/2,(myCanvas.height/2) + 40);
    frCtx.fillText("If this issue persists, you will need",myCanvas.width/2,(myCanvas.height/2)+160);
    frCtx.fillText("to restart the experiment and will ",myCanvas.width/2,(myCanvas.height/2)+200);
    frCtx.fillText("not be paid for your previous time.",myCanvas.width/2,(myCanvas.height/2)+240);
    frCtx.font = "bold 25px Arial";
    frCtx.fillText("Please correct this and press any button to continue.",myCanvas.width/2,(myCanvas.height/2)+100);

  } else {

    // display screen size prompt
    frCtx.fillText("Your screen is not full screen",myCanvas.width/2,myCanvas.height/2);
    frCtx.fillText("or the screen size on your device is too small.",myCanvas.width/2,(myCanvas.height/2)+50);
    frCtx.font = "bold 25px Arial";
    frCtx.fillText("Please refresh the page to restart the experiment.",myCanvas.width/2,(myCanvas.height/2)+100);

  }
}
