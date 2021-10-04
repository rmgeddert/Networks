let stroopTaskArray;
function stroopTaskPractice(){
  sectionType = "pracTask";
  taskName = "stroopTaskPractice";
  earlyReleaseExperiment = true;
  playSoundsExperiment = false;

  currentTaskArray = [];

  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  canvas.style.display = "inline-block";
  $(".canvasas").show();

  stroopTaskArray = createStroopArray(16);
  console.log(stroopTaskArray);

  //proceed to first trial
  taskFunc = stroopTaskFlow;
  countDown(3);
}

function stroopTaskFlow(){
  if (trialCount <= 16){
    fixationScreen();
    setTimeout(stroopTrial, fixInterval);
  } else {
    navigateInstructionPath();
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
  keyListener = 9, respTime = NaN, partResp = NaN, respOnset = NaN, acc = NaN

  //display stimulus
  stimOnset = new Date().getTime();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 50px Arial";
  ctx.fillStyle = stimulusColor;
  ctx.fillText(stimulusText.toUpperCase(), canvas.width/2, canvas.height/2);

  //proceed to transition
  timeoutFunc = practiceTransition;
  stimTimeout = setTimeout(practiceTransition, stroopStimInterval);
}

// function stroopFeedback(){
//   responseExpected = false;
//   instructionsScreen = false;
//   ctx.clearRect(0, 0, canvas.width, canvas. height);
//   ctx.font = "60px Arial";
//   if (accuracy == 1){
//     ctx.fillStyle = "green";
//     ctx.fillText("Correct", canvas.width/2, canvas.height/2);
//   }
//   else if (accuracy == 0){
//     ctx.fillStyle = "red";
//     ctx.fillText("Incorrect", canvas.width/2, canvas.height/2);
//   }
//   else {
//     ctx.fillStyle = "black";
//     ctx.fillText("Too slow!", canvas.width/2, canvas.height/2);
//   }
//   setTimeout (stroopPracticeITI, 1000);
// }

// function stroopPracticeITI(){
//   instructionsScreen = false;
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillText("", canvas.width/2, canvas.height/2);
//   reactionTime = (respOnset - stimOnset);
//   data.push([trialCount, stimulusArray[trialCount], responseKey, accuracy, reactionTime]);
//   console.log(data);
//   setTimeout(stroopTaskFlow, 500);
// }

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
  // data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, fileOnly(activeNode.img.src), NaN, getAccuracy(acc), stimOnset, respOnset, respTime, partResp, activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
  // console.log(data);

  // iterate trial count
  trialCount++; blockTrialCount++;

  // return to taskFlow func
  setTimeout(stroopTaskFlow,stroopITI);
}
