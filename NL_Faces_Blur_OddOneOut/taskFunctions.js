let screenSizePromptCount = 0, numScreenSizeWarnings = 2;
function countDown(seconds, cdSpeed = "normal"){
  let timePerCycle = (cdSpeed == "fast") ? 500 : 1000;
  frCtx.clearRect(0, 0, frCanvas.width, frCanvas.height);
  frCtx.fillStyle = "black";
  frCtx.font = "bold 60px Arial";
  if (seconds > 0){
    frCtx.fillText(seconds,frCanvas.width/2,frCanvas.height/2)
    setTimeout(function(){countDown(seconds - 1, cdSpeed)},timePerCycle);
  } else {
    taskFunc();
  }
}

// function for permutating arrays
function permutator(inputArr){
  let result = [];
  function permute(arr, m = []){
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
     }
   }
 }
 permute(inputArr)
 return result;
}

// Fisher-Yates shuffle
function shuffle(array){
  for(let j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
  return array;
}

function promptLetGo(){
  keyListener = 0;
  setTimeout(function(){keyListener = 4},1000);

  //prepare canvas
  frCtx.clearRect(0, 0, frCanvas.width, frCanvas.height);

  // show warning
  frCtx.fillStyle = "black";
  frCtx.font = "30px Arial";
  frCtx.fillText("Please try and release key",frCanvas.width/2,frCanvas.height/2);
  frCtx.fillText("as quickly as possible after responding.",frCanvas.width/2,frCanvas.height/2 + 30);

  frCtx.font = "bold 25px Arial";
  frCtx.fillText("Press any button to resume.",frCanvas.width/2,frCanvas.height/2 + 150);

  frCtx.fillStyle = "red";
  frCtx.font = "bold 30px Arial";
  frCtx.fillText("Can't initiate trial if a key is held down.",frCanvas.width/2,frCanvas.height/2 - 100);
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

function fileOnly(strSRC){
  return strSRC.match(/[^\\/:*?"<>|\r\n]+$/g)[0];
}
