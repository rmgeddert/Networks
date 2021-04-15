function twoBackFractalPractice(){
  console.log("Running 2-Back fractal practice task...");

  // declare and set task variables
  sectionType = "pracTask";
  taskName = "2-Back Fractal Task (Practice)";

  // hide instructions, show canvas
  $('#instructionsDiv').hide();
  canvas.style.display = "inline-block";
  $(".canvasas").show();

  // set up vowel sequence
  buffer = 2, stimSet = ["A","E","O","U","I"];
  switchRepeatArr = getSwitchRepeatArr(nPracticeTrials, percRepeats, buffer);
  console.log(switchRepeatArr);
  stimArr = getStimArr(switchRepeatArr, stimSet, buffer);
  console.log(stimArr);
  accArr = [];

  trialCount = 0;

  // start 1 back task
  taskFunc = run2Back;
  countDown(3);
}

function run2Back(){
  if (trialCount < stimArr.length - 1) {

    if (showFixation) {
      fixationScreen();
    } else {
      stimScreen();
    }

  } else {

    let passesAccuracy = checkAccuracy(accArr, switchRepeatArr);
    pracFeedback_1Back(passesAccuracy);

  }
}

function fixationScreen(){
    // prepare canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 60px Arial";
    ctx.fillStyle = "black";

    // display fixation
    ctx.fillText(fixationSymbol,canvas.width/2,canvas.height/2);

    // go to next after appropriate time
    setTimeout(stimScreen, fixInterval);
}

function stimScreen(){
    stimOnset = new Date().getTime() - runStart;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // display stimulus
    drawStimulus();

    //reset all response variables and await response (expType = 1)
    keyListener = 1; acc = NaN, respTime = NaN, partResp = NaN, respOnset = NaN;

    // proceed to next screen after timeout
    trialIsRepeat = switchRepeatArr[trialCount] == "r";
    stimTimeout = setTimeout(itiScreen,stimInterval);
}

function drawStimulus(){
    let letter = stimArr[trialCount];

    // prepare canvas
    ctx.fillStyle = "black";
    ctx.font = "bold 100px Arial";

    // draw letter on canvas
    ctx.fillText(letter,canvas.width/2,canvas.height/2);
}

function itiScreen(){
  if (keyListener == 1) { // participant didn't respond
    if (playSounds && speed != "fast") {mistakeSound.play();}
    keyListener = 0;
  } else if (keyListener == 2) { //participant still holding down response key
    keyListener = 3;
  }

  // log data

  // iterate trial count
  trialCount++;
  accCount = accCount + getAccuracy(acc);
  accArr.push(getAccuracy(acc));

  if (showFeedback) {
    drawFeedback();

    // proceed to next trial or to next section after delay
    setTimeout(taskFunc, feedbackInterval);
  } else {
    taskFunc();
  }
}

function drawFeedback(){
  // prepare canvas
  ctx.fillStyle = accFeedbackColor();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // display response feedback (correct/incorrect/too slow)
  ctx.font = "bold 70px Arial";
  ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);
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

function pracFeedback_fractal(accuracy){
  sectionStart = new Date().getTime() - runStart;
  sectionType = "pracFeedback";

  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  keyListener = 6;

  // display feedback
  if (accuracy < practiceAccCutoff) { //if accuracy is too low
    repeatNecessary = true;

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.fillText("Remember, you need to get >" + practiceAccCutoff + "%.",canvas.width/2,canvas.height/2);
    ctx.fillText("Press any button to go back ",canvas.width/2,canvas.height/2 + 80);
    ctx.fillText("to the instructions and try again.",canvas.width/2,canvas.height/2 + 110);

  } else { //otherwise proceed to next section

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.fillText("Press any button to go on to the next section.",canvas.width/2,canvas.height/2 + 100);

    // prep key press/instruction logic
    repeatNecessary = false;

  }
}
