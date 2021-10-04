let stroopTaskArray;
function stroopTaskPractice(){
  sectionType = "pracTask";
  taskName = "stroopTaskPractice";
  earlyReleaseExperiment = true;
  playSoundsExperiment = false;

  currentTaskArray = [];
  accCount = 0;

  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  canvas.style.display = "inline-block";
  $(".canvasas").show();

  stroopTaskArray = createStroopArray(nPracticeTrials);
  // console.log(stroopTaskArray);

  //proceed to first trial
  taskFunc = stroopTaskFlow;
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
  keyListener = 9, respTime = NaN, partResp = NaN, respOnset = NaN, acc = NaN, stimOnset = NaN;

  //display stimulus
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 50px Arial";
  ctx.fillStyle = stimulusColor;
  ctx.fillText(stimulusText.toUpperCase(), canvas.width/2, canvas.height/2);

  //proceed to transition
  timeoutFunc = practiceTransition;
  stimTimeout = setTimeout(practiceTransition, stroopStimInterval);
}

function createStroopArray(nTrials){
  //trial counts
  let nCongruentTrials = Math.ceil(nTrials/2);
  let nIncongruentTrials = nTrials - nCongruentTrials;

  //create array of 'c's and 'i's, shuffled
  let congruencyArr = shuffle(new Array(nCongruentTrials).fill("c").concat(new Array(nIncongruentTrials).fill("i")));

  //create array of stimuli for each trial, based on if trial is a 'c' or 'i' trial
  let stroopArray = [];
  for (var i = 0; i < congruencyArr.length; i++){
    if(congruencyArr[i] == "c"){
      stroopArray.push(_.sample(congruentStim));
    }
    else {//"i"
      stroopArray.push(_.sample(incongruentStim));
    }
  }
  return stroopArray;
}

function practiceTransition(){
  keyListener = 0;
  if (stroopITI > 0){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black"; //accFeedbackColor();
    ctx.font = "bold 60px Arial";
    ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);
  }

  // log Data
  data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, NaN, NaN, getAccuracy(acc), stimOnset, respOnset, respTime, partResp, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, stroopOnset, stroopTaskArray[trialCount - 1][0], stroopTaskArray[trialCount - 1][1], stroopTaskArray[trialCount - 1][2]]);
  console.log(data);

  // iterate trial count
  trialCount++; blockTrialCount++;

  // return to taskFlow func
  setTimeout(stroopTaskFlow,stroopITI);
}
