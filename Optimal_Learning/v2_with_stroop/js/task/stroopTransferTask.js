let transferStimArray, transferTaskArray;
function stroopTransferTask(){
  // task details
  sectionType = "mainTask";
  taskName = "stroopTransferTask";
  earlyReleaseExperiment = true;
  playSoundsExperiment = false;
  document.body.style.cursor = 'none';

  //reset currentTaskArray
  currentTaskArray = [];

  // hide instructions and show canvas
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  $("#taskCanvas").show();
  $(".canvasas").show();

  // create task array for experiment
  let transferTaskNodes = createTransferTaskNodes();
  transferTaskArray = createTransferTaskArray(transferTaskNodes);
  // console.log(transferTaskArray);

  // create stim array for experiment
  transferStimArray = createTransferStimArray(nTransferTrials);
  // console.log(transferStimArray);

  // set taskFunc so countdown goes to right task
  taskFunc = runStroopTransfer;
  transitionFunc = transferTransition;

  // start task after countdown
  countDown(3);
}

function runStroopTransfer(){
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {
    if (trialCount <= nTransferTrials) {
      fixationScreen();
      setTimeout(transferTrial, fixInterval);
    } else {
      navigateInstructionPath();
    }
  }
}

function transferTrial(){
  stimOnset = new Date().getTime() - runStart;
  activeNode = transferTaskArray[trialCount - 1][0];
  displayImage();

  // go to stroop after delay
  setTimeout(transferStroopTrial, imagePreStroopInterval);
}

function transferStroopTrial(){
  let stimulus = transferStimArray[trialCount - 1];

  // // add stimulus to currentTaskArray (for access by key listener)
  currentTaskArray.push(stimulus);

  // set up for response
  stroopOnset = new Date().getTime() - runStart;
  keyListener = 1, respTime = NaN, partResp = NaN, respOnset = NaN, acc = NaN;

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
    if (getAccuracy(acc) != 1) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black"; //accFeedbackColor();
      ctx.font = "bold 60px Arial";
      ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);
    }
  }

  // log Data
  data.push([sectionType, taskName, trialCount, blockTrialCount, block, NaN, stimOnset, respOnset, respTime, getAccuracy(acc), NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN,fileOnly(activeNode.img.src), activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", transitionType, isCommunityTransition() ? 1 : 0, partResp, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, stroopOnset, currentTaskArray[trialCount - 1][0], currentTaskArray[trialCount - 1][1], currentTaskArray[trialCount - 1][2]]);
  console.log(data);

  // iterate trial count
  trialCount++; blockTrialCount++;

  // return to taskFlow func
  if (getAccuracy(acc) != 1) {
    setTimeout(runStroopTransfer,stroopITI);
  } else {
    runStroopTransfer();
  }
}

function createTransferTaskNodes(){
  let transferTaskSet = [];

  // add images not associated with task from network
  taskNetwork.nodes.filter((node) => !node.associatedWithTask).forEach((unaffiliated_node) => {
    transferTaskSet.push(unaffiliated_node);
  });

  // add novel images to task set as nodes
  let extraImages = _.sample(unselectedImages,nNovelNodes);
  extraImages.forEach((image, i) => {
    let newNode = new Node(i + networkSize + 1, image);
    newNode.community = "novel";
    transferTaskSet.push(newNode);
  });

  return transferTaskSet;
}

function createTransferTaskArray(nodeArr){
  let taskArr, newBatch;
  let batchesNeeded = Math.ceil(nTransferTrials/(nodeArr.length*2));
  do {
    taskArr = [];
    for (var i = 0; i < batchesNeeded; i++) {
      do {
        newBatch = createTransferTaskBatch(nodeArr);
      } while (newBatch[0] == taskArr[taskArr.length - 1]);
      taskArr = taskArr.concat(newBatch);
    }
  } while (checkTaskArr(taskArr));
  return taskArr.slice(0, nTransferTrials);

  function checkTaskArr(arr){
    let congruentPrevCon = 0, congruentPrevInc = 0;
    let incongruentPrevCon = 0, incongruentPrevInc = 0;
    //count number of previous congruent and incongruents
    arr.forEach((nodePair, i) => {
      let community = nodePair[0].community;
      if (community != "novel") {
        if (i == 0) {
          return true;
        } else if (community == "congruent") {
          if (arr[i - 1][1] == "c") {
            congruentPrevCon++;
          } else {
            congruentPrevInc++;
          }
        } else {
          if (arr[i - 1][1] == "c") {
            incongruentPrevCon++;
          } else {
            incongruentPrevInc++;
          }
        }
      }
    });

    if (congruentPrevCon != congruentPrevInc ||  incongruentPrevCon != incongruentPrevInc) {
      return true;
    } else {
      return false;
    }
  }
}

function createTransferTaskBatch(nodeArr, batchCount){
  // create basic task array batch
  let taskArrBatch = [];
  nodeArr.forEach(node => {
    taskArrBatch.push([node, "i"]);
    taskArrBatch.push([node, "c"]);
  })

  //use algorithm to shuffle array (with no repeats allowed)
  do {
    taskArrBatch = shuffle(taskArrBatch);
  } while (checkShuffle(taskArrBatch));
  return taskArrBatch;

  function checkShuffle(arr){
    //if very first batch, make sure trial 1 isn't a transfer node
    if (batchCount == 0) {
      if (arr[0][0].community != "novel") {
        return true;
      }
    }
    //make sure there are no node repeats in batch of 16
    for (var i = 1; i < arr.length; i++) {
      if (arr[i][0] == arr[i-1][0]) {
        return true;
      }
    }
    return false;
  }
}

function createTransferStimArray(nTrials){
  let taskArray = [], prevStim, stimulus;
  for (var i = 0; i < nTrials; i++) {
    if (transferTaskArray[i][1] == "c") {
      stimulus = _.sample(congruentStim);
      taskArray.push(stimulus);
      prevStim = stimulus;
    } else {
      stimulus = _.sample(incongruentStim);
      taskArray.push(stimulus);
      prevStim = stimulus;
    }
  }
  return taskArray;
}
