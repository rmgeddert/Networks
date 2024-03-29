function getSwitchRepeatArr(nTrials, percRepeat, nBack){
  let nRepeats = Math.ceil(nTrials * percRepeat);
  let nSwitch = nTrials - nRepeats;

  // build array of switch and repeats (starts with a repeat)
  let switchRepeatArr = new Array(nBack).fill("n").concat(shuffle(new Array(nRepeats).fill("r").concat(new Array(nSwitch - nBack).fill("s"))));

  return switchRepeatArr;
}

function getStimArr(swRpArr, stimSet, nBack){
  // initalize task arr
  let stimArr = [];

  // fill task array with stimuli
  for (var i = 0; i < swRpArr.length; i++) {
    if (i < nBack) {
      letter = _.sample(stimSet);
    } else if (swRpArr[i] == "r") {
      letter = stimArr[i - nBack];
    } else {
      letter = _.sample(stimSet.filter(l => l != stimArr[i - nBack]));
    }
    stimArr.push(letter);
  }
  return stimArr;
}

// function checkAccuracy(accArr, switchRepeatArr){
//   let switchCount = 0, switchAccCount = 0;
//   let repeatCount = 0, repeatAccCount = 0;
//   for (var i = 0; i < switchRepeatArr.length; i++) {
//     if (switchRepeatArr[i] == "r") {
//       repeatCount++;
//       if (accArr[i] == 1) {
//         repeatAccCount++;
//       }
//     } else {
//       switchCount++;
//       if (accArr[i] == 1) {
//         switchAccCount++;
//       }
//     }
//   }
//   if ((switchAccCount / switchCount) > practiceAccCutoff) {
//     return "failed_switches";
//   } else if ((repeatAccCount / repeatCount) > practiceAccCutoff) {
//     return "failed_repeats";
//   } else {
//     return "passed";
//   }
// }

function nBackFixationScreen(){
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
    if (isImage(stimArr[trialCount - 1])) {
      drawImage();
    } else {
      drawLetter();
    }

    //reset all response variables and await response (expType = 1)
    keyListener = 1; acc = NaN, respTime = NaN, partResp = NaN, respOnset = NaN;

    // proceed to next screen after timeout
    trialIsRepeat = switchRepeatArr[trialCount - 1] == "r";
    trialIsNA = switchRepeatArr[trialCount - 1] == "n";
    timeoutFunc = itiScreen;
    stimTimeout = setTimeout(itiScreen,stimInterval);
}

function isImage(i){
  return i instanceof HTMLImageElement;
}

function drawLetter(){
    let letter = stimArr[trialCount - 1];

    // prepare canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "bold 100px Arial";

    // draw letter on canvas
    ctx.fillText(letter,canvas.width/2,canvas.height/2);
}

function drawImage(){
  let img = stimArr[trialCount - 1];

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // display image
  ctx.drawImage(img,canvas.width/2 - img.width/2,canvas.height/2-img.height/2);
}

function itiScreen(){
  if (keyListener == 1) { // participant didn't respond
    if (playSounds && speed != "fast" && playSoundsExperiment && !trialIsNA) {mistakeSound.play();}
    keyListener = 0;
  } else if (keyListener == 2) { //participant still holding down response key
    keyListener = 3;
  }

  // display feedback
  if (showFeedback) {
    if (switchRepeatArr[trialCount - 1] != "n") {
      drawFeedback();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // log data
  data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, getStim(stimArr[trialCount - 1]), switchRepeatArr[trialCount - 1], getAccuracy(acc), stimOnset, respOnset, respTime, partResp, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
  console.log(data);

  // iterate trial count
  trialCount++;
  blockTrialCount++;
  accArr.push(getAccuracy(acc));

  // proceed to next after delay
  if (showFeedback && !playSoundsExperiment) {
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

function nBackFeedback(accuracy){
  sectionStart = new Date().getTime() - runStart;
  sectionType = "pracFeedback";

  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  // 1 sec buffer before proceed allowed
  setTimeout(function(){
    keyListener = 6;
  }, 1000);

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

function getStim(stim){
  if (isImage(stim)) {
    return fileOnly(stim.src);
  } else {
    return stim
  }
}
