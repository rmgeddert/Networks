let conStroopArr, incStroopArr;
let con_idx, inc_idx;
let communityCounter = 0;
let communityCountersLog = [];
function stroopAssociationTask(){
  // task details
  sectionType = "mainTask";
  taskName = "stroopAssociationTask";
  earlyReleaseExperiment = true;
  playSoundsExperiment = false;

  //reset currentTaskArray
  currentTaskArray = [];

  // hide instructions and show canvas
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  canvas.style.display = "inline-block";
  if (showNetworkWalk == true) {ntCanvas.style.display = "inline-block";}
  $(".canvasas").show();

  // create congruent and incongruent stimulus arrays
  con_idx = 0, inc_idx = 0;
  conStroopArr = createCongruentsArr(nStroopAssociationTrials);
  incStroopArr = createIncongruentsArr(nStroopAssociationTrials);

  // filter the nodes
  let allNodes = taskNetwork.nodes;
  let filteredNodes = allNodes.filter(node => node.associatedWithTask)

  // choose our first active node
  activeNode = _.sample(filteredNodes,1)[0];
  activeNode.activate();
  fractalTrialHistory.push(activeNode.name);
  transitionType = "r";

  // set taskFunc so countdown goes to right task
  taskFunc = runStroopAssociation;

  // start task after countdown
  countDown(3);
}

function runStroopAssociation(){
  if (trialCount <= nStroopAssociationTrials) {
    fixationScreen();
    setTimeout(stroopAssociationTrial, fixInterval);
  } else {
    // console.log(communityCountersLog);
    navigateInstructionPath();
  }
}

function stroopAssociationTrial(){
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {

    // display network
    stimOnset = new Date().getTime() - runStart;
    if (showNetworkWalk == true) {drawNetwork();}
    displayFractal();

    // go to stroop after delay
    setTimeout(associationStroopTrial, fractalPreStroopInterval);
  }
}

function associationStroopTrial(){
  // get stroop stimulus
  let stimulus;
  if (activeNode.community == "congruent") {
    stimulus = conStroopArr[con_idx];
    con_idx++;
  } else {
    stimulus = incStroopArr[inc_idx];
    inc_idx++;
  }

  // add stimulus to currentTaskArray (for access by key listener)
  // console.log(stimulus);
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
  timeoutFunc = stroopFractalTransition;
  stimTimeout = setTimeout(stroopFractalTransition, stroopStimInterval);
}

function stroopFractalTransition(){
  keyListener = 0;
  if (stroopITI > 0){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black"; //accFeedbackColor();
    ctx.font = "bold 60px Arial";
    ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);
  }

  // log data from previous trial
  data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, fileOnly(activeNode.img.src), NaN, getAccuracy(acc), stimOnset, respOnset, respTime, partResp, activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", transitionType, NaN, isCommunityTransition() ? 1 : 0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
  console.log(data);

  // reset old and activate new node
  prevNode = activeNode;
  activeNode.reset();

  // choose a new node from current nodes neighbors
  let neighborNodes = activeNode.neighbors;
  let filteredNeighbors = neighborNodes.filter(node => node.associatedWithTask);
  if (activeNode.isBoundaryNode) {
    if (communityCounter < 5) {
      //force remain in community
      activeNode = _.sample(filteredNeighbors.filter(node => node.communityNumber == activeNode.communityNumber));
    } else if (communityCounter > 10){
      // force community transition
      activeNode = _.sample(filteredNeighbors.filter(node => node.isBoundaryNode && node.communityNumber != activeNode.communityNumber));
    } else {
      // random choice of neighbors
      activeNode = _.sample(filteredNeighbors,1)[0];
    }
  } else {
    // random choice
    activeNode = _.sample(filteredNeighbors,1)[0];
  }

  // increment community counter
  if (activeNode.communityNumber != prevNode.communityNumber) {
    communityCountersLog.push(communityCounter);
    communityCounter = 0;
  } else {
    communityCounter++;
  }

  // activate next node
  activeNode.activate();

  // iterate trial count
  trialCount++; blockTrialCount++;

  // return to taskFlow func
  setTimeout(runStroopAssociation,stroopITI);
}

function createCongruentsArr(nTrials){
  // build stroop array of congruent trials
  let prevColor = "", stimArray = [], stimulus;
  for (var i = 0; i < nTrials; i++) {
    stimulus = _.sample(congruentStim);
    stimArray.push(stimulus);
    prevColor = stimulus[0];
  }
  return stimArray;
}

function createIncongruentsArr(nTrials){
  // build stroop array of congruent trials
  let prevStim = [], stimArray = [], stimulus;
  for (var i = 0; i < nTrials; i++) {
    stimulus = _.sample(incongruentStim);
    stimArray.push(stimulus);
    prevStim = stimulus;
  }
  return stimArray;
}
