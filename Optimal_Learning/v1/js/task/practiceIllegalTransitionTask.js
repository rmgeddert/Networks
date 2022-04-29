function practiceIllegalTransitionTask(){
  sectionType = "pracTask";
  taskName = "practiceTransitionTask";

  // declare task vars
  earlyReleaseExperiment = false;
  playSoundsExperiment = false;
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

  // prepare practice task array (illegal versus legal)
  legalIllegalArray = preparePracticeArray();
  // console.log(legalIllegalArray);
  transitionType = legalIllegalArray[trialCount-1];

  // set taskFunc so countdown goes to right task
  taskFunc = runIllegalPractice;
  transitionFunc = practiceTransition;

  // start task after countdown
  countDown(3);
}

function runIllegalPractice(){
  if (trialCount <= nPracticeTrials) {
    practiceTrial();
  } else {
    transitionType = "l";
    prevTransition = "i";
    practiceFeedback(Math.round( accCount / (trialCount - 1) * 100 ));
  }
}

function practiceTrial(){
  if (openerNeeded == true && !opener) {
    promptMenuClosed();
  } else {
    // check if key is being held down going into trial
    if (keyListener == 2 || keyListener == 3) {

      promptLetGo();

    } else {

      // display network and image
      if (showNetworkWalk == true) {drawNetwork()}
      displayImage();

      // set up for response
      stimOnset = new Date().getTime() - runStart;
      respTime = NaN, partResp = NaN, respOnset = NaN, acc = NaN;
      if (trialCount == 1) {
        setTimeout(practiceTransition, stimInterval);
      } else {
        keyListener = 1;
      }

      // go to next trial after delay
      // setTimeout(practiceTransition, stimInterval);
    }
  }
}

function practiceTransition(){
  if (!feedbackShown && trialCount != 1) {
    // feedback (legal or illegal)
    if (transitionType == "i") {
      showIllegalTransition();
    } else {
      showLegalTransition();
    }

  } else {

    // adjust accuracy
    if (!partResp) {acc = 0}
    if (trialCount == 1) {acc = 1}
    accCount = accCount + acc;

    // log data from previous trial
    data.push([sectionType, taskName, trialCount, blockTrialCount, block, NaN, stimOnset, respOnset, respTime, acc, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN,fileOnly(activeNode.img.src), activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", transitionType, isCommunityTransition() ? 1 : 0, partResp, missedSkip ? 0 : 1, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN ]);
    console.log(data);

    // remember where we just were
    prevNode = activeNode;
    activeNode.reset();
    prevTransition = transitionType;

    // randomly choose a new node (can be illegal or legal transition)
    // don't allow for consecutive illegal transitions
    if (legalIllegalArray[trialCount] == "i") {
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
    trialCount++; blockTrialCount++;
    feedbackShown = false;

    // return to taskFlow func
    runIllegalPractice();
  }
}

function preparePracticeArray(){
  let nIllegalTrials = Math.ceil(nPracticeTrials*illegalProbability)
  let arr = new Array(nIllegalTrials).fill('i').concat(new Array(nPracticeTrials - nIllegalTrials).fill('l'));
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
    // make sure first or second trial isn't i
    if (arr[0] == 'i' || arr[1] == 'i' || arr[arr.length-1] == "i") {
      return false;
    } else {
      return true;
    }
  }
}
