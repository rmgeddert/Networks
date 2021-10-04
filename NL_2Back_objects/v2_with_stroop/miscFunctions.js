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

// //instructions
// data.push([sectionType, expStage, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, block, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
//
// //feedback or block breaks
// data.push([sectionType, NaN, taskName, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, block, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
//
// //nback tasks
// data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, getStim(stimArr[trialCount - 1]), switchRepeatArr[trialCount - 1], getAccuracy(acc), stimOnset, respOnset, respTime, partResp, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
//
// //network learning task
// data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, fileOnly(activeNode.img.src), switchType, getAccuracy(acc), stimOnset, respOnset, respTime, partResp, activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", transitionType, isCommunityTransition() ? 1 : 0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
//
// //odd one out task
// data.push([sectionType, NaN, taskName, NaN, NaN, NaN,  nodeSetIterator + 1, nodeSetIterator + 1, block, NaN, NaN, acc, stimOnset, respOnset, respTime, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, partResp, currentNodeSet.nodes[imageNum - 1].name, fileOnly(currentNodeSet.nodes[imageNum - 1].img.src), currentNodeSet.nodes[imageNum - 1].communityNumber, currentNodeSet.nodes[0].name, fileOnly(currentNodeSet.nodes[0].img.src), currentNodeSet.nodes[0].communityNumber, currentNodeSet.nodes[1].name,  fileOnly(currentNodeSet.nodes[1].img.src), currentNodeSet.nodes[1].communityNumber, currentNodeSet.nodes[2].name,  fileOnly(currentNodeSet.nodes[2].img.src), currentNodeSet.nodes[2].communityNumber, NaN, NaN, NaN, NaN]);
//
// //stroop practice task
// data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, NaN, NaN, getAccuracy(acc), stimOnset, respOnset, respTime, partResp, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, stroopOnset, stroopTaskArray[trialCount - 1][0], stroopTaskArray[trialCount - 1][1], stroopTaskArray[trialCount - 1][2]]);
//
// //stroop association task
// data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, fileOnly(activeNode.img.src), NaN, getAccuracy(acc), stimOnset, respOnset, respTime, partResp, activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", transitionType, isCommunityTransition() ? 1 : 0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, stroopOnset, stroopTaskArray[trialCount - 1][0], stroopTaskArray[trialCount - 1][1], stroopTaskArray[trialCount - 1][2]]]);
//
// //stroop transfer task
// data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, fileOnly(activeNode.img.src), NaN, getAccuracy(acc), stimOnset, respOnset, respTime, partResp, activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", transitionType, isCommunityTransition() ? 1 : 0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, stroopOnset, stroopTaskArray[trialCount - 1][0], stroopTaskArray[trialCount - 1][1], stroopTaskArray[trialCount - 1][2]]]);
