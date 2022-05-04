function illegalTransitionTask(){
  sectionType = "mainTask";
  taskName = "illegalTransitionTask";

  // declare task vars
  earlyReleaseExperiment = false;
  playSoundsExperiment = true;
  feedbackShown = false;
  document.body.style.cursor = 'none';

  // hide instructions and show canvas
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  canvas.style.display = "inline-block";
  if (showNetworkWalk == true) {ntCanvas.style.display = "inline-block";}
  $(".canvasas").show();

  // set up first active node
  activeNode = _.sample(taskNetwork.nodes,1)[0];
  activeNode.activate();
  trialHistory.push(activeNode.name);
  transitionType = legalIllegalArray[trialCount-1];

  // get legalIllagalArray
  legalIllegalArray = prepareLegalIllegalArray();

  // set taskFunc so countdown goes to right task
  taskFunc = runIllegalTransition;
  transitionFunc = networkTransition;

  // start task after countdown
  countDown(3);
}

function runIllegalTransition(){
  if (trialCount <= nNetworkTrials) {
    // go to break screen every n trials, but only if trial count > 1, its not the end of the task (trialCount == nNetworkTrials), and we didn't JUST do have a break screen (breakOn)
    if (trialCount > 1 && trialCount != nNetworkTrials && (trialCount - 1)%breakEveryNTrials == 0 && !breakOn) {
      breakOn = true;
      blockBreak(nNetworkTrials, breakEveryNTrials)
    } else {
      breakOn = false;
      networkTrial();
    }
  } else {
    // taskNetwork.nodes.forEach((node) => {console.log(node.name, node.visitCount)})
    breakOn = false;
    navigateInstructionPath();
  }
}

function networkTrial(){
  // check if key is being held down going into trial
  if (keyListener == 2 || keyListener == 3) {

    promptLetGo();

  } else {

    // display network and image
    if (showNetworkWalk == true) {drawNetwork();}
    displayImage();

    // console.log(activeNode.name);
    // console.log(transitionType);

    // set up for response
    stimOnset = new Date().getTime() - runStart;
    keyListener = 1, respTime = NaN, partResp = NaN, respOnset = NaN, acc = NaN;

    // go to next trial after delay
    setTimeout(networkTransition, stimInterval);
  }
}

function networkTransition(){
  if (transitionType == "i") {
    acc = (Boolean(partResp)) ? 1 : 0;
  } else {
    acc = (Boolean(partResp)) ? 0 : 1;
  }
  let missedSkip = (transitionType == "i" && !partResp);
  let falseAlarm = (transitionType == "l" && Boolean(partResp));
  let mistake = missedSkip || falseAlarm;
  if (mistake && !feedbackShown && showFeedback) {

    if (transitionType == "i") {
      showIllegalTransition();
    } else {
      showLegalTransition();
    }

  } else {

    // log data from previous trial
    data.push([sectionType, taskName, trialCount, blockTrialCount, block, NaN, stimOnset, respOnset, respTime, acc, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN,fileOnly(activeNode.img.src), activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", transitionType, isCommunityTransition() ? 1 : 0, partResp, missedSkip ? 0 : 1, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN ]);
    console.log(data);

    // remember where we just were
    prevNode = activeNode;
    activeNode.reset();

    trialCount++; blockTrialCount++;

    // randomly choose a new node if legal or illegal
    if (legalIllegalArray[trialCount - 1] == "i") {
      transitionType = "i"; //illegal transition
      activeNode = _.sample(taskNetwork.nodes.filter(node => !activeNode.neighbors.includes(node) && node != activeNode),1)[0];
      // console.log("illegal - press space!");
    } else {
      transitionType = "l"; //legal (random) transition
      activeNode = _.sample(activeNode.neighbors,1)[0];
    }

    activeNode.activate();
    trialHistory.push(activeNode.name);

    // iterate trial count
    feedbackShown = false;

    // return to taskFlow func
    runIllegalTransition();
  }
}

function prepareLegalIllegalArray(){
  let nBlocks = Math.ceil(nNetworkTrials/breakEveryNTrials);
  let batch, mainArr = [];
  // for each block
  for (var i = 0; i < nBlocks; i++) {
    let arr = [];
    let nBatches = Math.ceil(breakEveryNTrials/20);

    // first batch (make sure first 2 trials aren't illegal)
    do {
      batch = getBatch();
    } while (batch[0] == 'i' || batch[1] == 'i');
    arr = arr.concat(batch);

    // rest of batches
    for (var j = 0; j < nBatches - 1; j++) {
      do {
        batch = getBatch();
      } while (batch[0] == 'i' && arr[arr.length - 1] == 'i');
      arr = arr.concat(batch);
    }

    mainArr = mainArr.concat(arr.slice(0, breakEveryNTrials));
  }

  // SO code for checking instances of 'i' and 'l'
  //   console.log(mainArr.reduce(function (arr, i) {
  //   return arr[i] ? ++arr[i] : arr[i] = 1, arr
  // }, {}));
  return mainArr;

  function getBatch(){
    let nIllegalTrials = Math.ceil(20*illegalProbability)
    let arr = new Array(nIllegalTrials).fill('i').concat(new Array(20 - nIllegalTrials).fill('l'));
    do {
      arr = shuffle(arr);
    } while (!arrShuffled(arr));
    return arr;

    function arrShuffled(arr){
      // make sure there are no consecutive "i"s
      for (var i = 0; i < arr.length; i++) {
        if (i != 0) {
          if (arr[i] == 'i' && arr[i - 1] == 'i') {
            return false;
          }
        }
      }
      return true;
    }
  }
}
