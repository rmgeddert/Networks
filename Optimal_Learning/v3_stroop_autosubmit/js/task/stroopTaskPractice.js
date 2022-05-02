let stroopTaskArray;
function stroopTaskPractice(){
  sectionType = "pracTask";
  taskName = "stroopTaskPractice";
  earlyReleaseExperiment = true;
  playSoundsExperiment = false;
  document.body.style.cursor = 'none';

  currentTaskArray = [];

  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  canvas.style.display = "inline-block";
  $(".canvasas").show();

  stroopTaskArray = createStroopArray(nPracticeTrials);
  // console.log(stroopTaskArray);

  //proceed to first trial
  taskFunc = stroopTaskFlow;
  transitionFunc = stroopPracticeTransition;
  countDown(3);
}

function stroopTaskFlow(){
  if (trialCount <= nPracticeTrials){
    fixationScreen();
    setTimeout(stroopTrial, fixInterval);
  } else {
    practiceFeedback(Math.round( accCount / (trialCount - 1) * 100 ));
  }
}

function stroopTrial(){
  let stimulusText = stroopTaskArray[trialCount - 1][0]
  let stimulusColor = stroopTaskArray[trialCount - 1][1]
  let stimulus = stroopTaskArray[trialCount - 1]

  //add stimulus to currentTaskArray (for access by key listener)
  currentTaskArray.push(stimulus);

  //set up for response
  stroopOnset = new Date().getTime() - runStart;
  keyListener = 1, respTime = NaN, partResp = NaN, respOnset = NaN, acc = NaN, stimOnset = NaN;

  //display stimulus
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 60px Arial";
  ctx.fillStyle = stimulusColor;
  ctx.fillText(stimulusText.toUpperCase(), canvas.width/2, canvas.height/2);

  //proceed to transition
  stimTimeout = setTimeout(stroopPracticeTransition, stroopStimInterval);
}

function stroopPracticeTransition(){
  keyListener = 0;
  if (stroopITI > 0){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black"; //accFeedbackColor();
    ctx.font = "bold 60px Arial";
    ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);
  }

  // log Data
  data.push([sectionType, taskName, trialCount, blockTrialCount, block, NaN, stimOnset, respOnset, respTime, getAccuracy(acc),  NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, partResp, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN,  NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, stroopOnset, stroopTaskArray[trialCount - 1][0], stroopTaskArray[trialCount - 1][1], stroopTaskArray[trialCount - 1][2]]);
  console.log(data);

  // iterate trial count
  trialCount++; blockTrialCount++;

  // return to taskFlow func
  setTimeout(stroopTaskFlow,stroopITI);
}
