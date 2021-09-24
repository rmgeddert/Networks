let transferStimArray, transferTaskArray;
let transferCongruencyArr;
function stroopTransferTask(){
  // task details
  sectionType = "mainTask";
  taskName = "stroopTransferTask";
  earlyReleaseExperiment = true;
  playSoundsExperiment = false;

  //reset currentTaskArray
  currentTaskArray = [];

  // hide instructions and show canvas
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  $("#fractalCanvas").show();
  $(".canvasas").show();

  // create stim array for experiment
  let transferTaskNodes = createTransferTaskNodes();
  transferStimArray = createTransferStimArray(transferTaskNodes);

  // create task array for experiment
  transferCongruencyArr = createCongruencyArray(nTransferTrials);
  transferTaskArray = createTransferTaskArray(nTransferTrials);

  // set taskFunc so countdown goes to right task
  taskFunc = runStroopTransfer;

  // start task after countdown
  countDown(3);
}

function runStroopTransfer(){
  if (trialCount <= nTransferTrials) {
    fixationScreen();
    setTimeout(transferTrial, fixInterval);
  } else {
    navigateInstructionPath();
  }
}

function transferTrial(){
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {
    stimOnset = new Date().getTime() - runStart;
    activeNode = transferStimArray[trialCount - 1];
    displayFractal();

    // go to stroop after delay
    setTimeout(transferStroopTrial, fractalPreStroopInterval);
  }
}

function transferStroopTrial(){
  let stimulus = transferTaskArray[trialCount - 1];

  // // add stimulus to currentTaskArray (for access by key listener)
  currentTaskArray.push(stimulus);

  // set up for response
  stroopOnset = new Date().getTime() - runStart;
  keyListener = 9, respTime = NaN, partResp = NaN, respOnset = NaN, acc = NaN;

  // display stroop
  ctx.globalAlpha = 0.80;
  ctx.fillStyle = "white";
  ctx.fillRect(canvas.width/2 - 125, canvas.height/2 - 45, 250, 80)
  ctx.globalAlpha = 1;
  ctx.fillStyle = stimulus[1];
  ctx.font = "bold 50px Arial";
  ctx.fillText(stimulus[0].toUpperCase(), canvas.width/2, canvas.height/2);

  // proceed to transition
  timeoutFunc = transferTransition;
  stimTimeout = setTimeout(transferTransition, stroopStimInterval);
}

function transferTransition(){
  keyListener = 0;
  if (stroopITI > 0){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = accFeedbackColor();;
    ctx.font = "bold 60px Arial";
    ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);
  }

  // log Data
  data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, fileOnly(activeNode.img.src), NaN, getAccuracy(acc), stimOnset, respOnset, respTime, partResp, activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
  console.log(data);

  // iterate trial count
  trialCount++; blockTrialCount++;

  // return to taskFlow func
  setTimeout(runStroopTransfer,stroopITI);
}

function createTransferTaskNodes(){
  let transferTaskSet = [];

  // add images not associated with task from network
  taskNetwork.nodes.filter((node) => !node.associatedWithTask).forEach((unaffiliated_node) => {
    transferTaskSet.push(unaffiliated_node);
  });

  // add novel images to task set as nodes
  let extraImages = _.sample(unselectedImages,8);
  extraImages.forEach((image, i) => {
    let newNode = new Node(i + fractalsNeeded + 1, image);
    newNode.community = "novel";
    transferTaskSet.push(newNode);
  });

  return transferTaskSet;
}

function createTransferStimArray(nodeArr){
  let stimArr = [], newBatc = [];
  let batchesNeeded = Math.ceil(nTransferTrials/nodeArr.length*2);
  for (var i = 0; i < batchesNeeded; i++) {
    do {
      newBatch = createTransferStimBatch(nodeArr);
    } while (newBatch[0] == stimArr[stimArr.length - 1]);
    stimArr = stimArr.concat(newBatch);
  }
  return stimArr.slice(0, nTransferTrials);
}

function createTransferStimBatch(nodeArr){
  // create basic task array batch
  let stimArrBatch = [];
  nodeArr.forEach(node => {
    stimArrBatch = stimArrBatch.concat(new Array(2).fill(node))
  })

  //use algorithm to shuffle array (with no repeats allowed)
  do {
    stimArrBatch = shuffle(stimArrBatch);
  } while (stimRepeat(stimArrBatch));
  return stimArrBatch;

  function stimRepeat(arr){
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == arr[i+1]) {
        return true;
      }
    }
    return false;
  }
}

function createCongruencyArray(nTrials){
  let nCongruentTrials = Math.ceil(nTrials/2);
  let nIncongruentTrials = nTrials - nCongruentTrials;
  return arr = shuffle(new Array(nIncongruentTrials).fill("i").concat(new Array(nCongruentTrials).fill("c")));
}

function createTransferTaskArray(nTrials){
  let prevStim = [], taskArray = [], stimulus;
  for (var i = 0; i < nTrials; i++) {
    if (transferCongruencyArr[i] == "c") {
      stimulus = _.sample(congruentStim.filter(s => s[0] != prevStim[0] && s[1] != prevStim[1]));
      taskArray.push(stimulus);
      prevStim = stimulus;
    } else {
      stimulus = _.sample(incongruentStim.filter(s => s[0] != prevStim[0] && s[1] != prevStim[1]));
      taskArray.push(stimulus);
      prevStim = stimulus;
    }
  }
  return taskArray;
}
