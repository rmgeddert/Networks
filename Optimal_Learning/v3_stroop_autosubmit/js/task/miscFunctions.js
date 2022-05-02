let screenSizePromptCount = 0, numScreenSizeWarnings = 3;
function countDown(seconds, cdSpeed = "normal"){
  let timePerCycle = (cdSpeed == "fast") ? 500 : 1000;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "bold 60px Arial";
  if (seconds > 0){
    ctx.fillText(seconds,canvas.width/2,canvas.height/2)
    setTimeout(function(){countDown(seconds - 1, cdSpeed)},timePerCycle);
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
  keyListener = 0;
  setTimeout(function(){keyListener = 4},1000);

  //prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // show warning
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Please release key",canvas.width/2,canvas.height/2);
  ctx.fillText("immediately after responding.",canvas.width/2,canvas.height/2 + 30);

  ctx.font = "bold 25px Arial";
  ctx.fillText("Press any button to resume.",canvas.width/2,canvas.height/2 + 150);

  ctx.fillStyle = "red";
  ctx.font = "bold 30px Arial";
  ctx.fillText("Can't initiate trial if a key is held down.",canvas.width/2,canvas.height/2 - 100);
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
  keyListener = 4;

  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";

  // allows up to two warnings before terminating experiment
  if (screenSizePromptCount < numScreenSizeWarnings) {
    screenSizePromptCount++;

    // display screen size prompt
    ctx.font = "25px Arial";
    ctx.fillText("Your screen is not full screen or the",canvas.width/2,canvas.height/2);
    ctx.fillText("screen size on your device is too small.",canvas.width/2,(canvas.height/2) + 40);
    ctx.fillText("If this issue persists, you will need",canvas.width/2,(canvas.height/2)+160);
    ctx.fillText("to restart the experiment and will ",canvas.width/2,(canvas.height/2)+200);
    ctx.fillText("not be paid for your previous time.",canvas.width/2,(canvas.height/2)+240);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Please correct this and press any button to continue.",canvas.width/2,(canvas.height/2)+100);

  } else {

    // display screen size prompt
    ctx.fillText("Your screen is not full screen",canvas.width/2,canvas.height/2 - 100);
    ctx.fillText("or the screen size on your device is too small.",canvas.width/2,(canvas.height/2) - 50);
    ctx.fillText("This problem has persisted despite several warnings,",canvas.width/2,(canvas.height/2)+50);
    ctx.fillText("thus the experiment cannot be finished.",canvas.width/2,(canvas.height/2)+100);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Please refresh the page to restart the experiment.",canvas.width/2,(canvas.height/2)+200);

  }
}

function fileOnly(strSRC){
  return strSRC.match(/[^\\/:*?"<>|\r\n]+$/g)[0];
}

function accFeedback(){
  if (acc == 1){
    return "Correct";
  } else if (acc == 0) {
    return "Incorrect";
  } else {
    return "Too Slow";
  }
}

function accFeedbackColor(){
  if (acc == 1){
    return "green";
  } else if (acc == 0) {
    return "red";
  } else {
    return "black";
  }
}

function getAccuracy(accValue){
  //normalizes accuracy values into 0 or 1 (NaN becomes 0)
  return accValue == 1 ? 1 : 0;
}

function randIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function multinomialSample(sampleArr, probArr){
  // build probability integer var
  let sampleProbs = [];
  let probability = 0;
  for (let i = 0; i < sampleArr.length; i++) {
    probability += probArr[i];
    sampleProbs.push(probability);
  }

  // get random number, use to grab value
  let randNumber = Math.random();
  for (let i = 0; i < sampleProbs.length; i++) {
    if (randNumber > sampleProbs[i]) {
      continue;
    } else {
      return sampleArr[i];
    }
  }
}

function endOfExperiment(){
  console.log('end of experiment');
  // end of experiment stuff
  try {
    $('#instructionsDiv').hide();
    $('#startExpButton').hide();
    $(".canvasas").hide();
    $("#oddOneOutTaskDiv").hide();
    $("#network-diagram").hide();
    document.body.style.cursor = 'auto';

    // upload data to menu.html's DOM element
    $("#RTs").val(data.join(";"));

    // debriefing script
    updateMainMenu(4);
  } catch (e) {
    alert("Data upload failed. Please refer to the instructions below.");
  }
}

function practiceFeedback(accuracy){

  sectionStart = new Date().getTime() - runStart;
  sectionType = "pracFeedback";

  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  // 1 sec buffer before proceed allowed
  setTimeout(function(){
    keyListener = 6;
  }, 500);

  // display feedback
  if (accuracy < practiceAccCutoff) { //if accuracy is too low
    repeatNecessary = true;

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.fillText("Remember, you need to get >" + practiceAccCutoff + "%.",canvas.width/2,canvas.height/2);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Press any button to go back ",canvas.width/2,canvas.height/2 + 80);
    ctx.fillText("to the instructions and try again.",canvas.width/2,canvas.height/2 + 110);

  } else { //otherwise proceed to next section

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Press any button to go on to the next section.",canvas.width/2,canvas.height/2 + 100);

    // prep key press/instruction logic
    repeatNecessary = false;

  }
}

function logSectionData(){
  data.push([sectionType, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN,  NaN, NaN, expStage, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, NaN, NaN ]);
  console.log(data);
}
