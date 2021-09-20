function stroopAssociationTask(){
  sectionType = "mainTask";
  taskName = "stroopAssociationTask";

  // declare task vars
  earlyReleaseExperiment = false;
  playSoundsExperiment = true;

  // hide instructions and show canvas
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  $("#fractalCanvas").show();
  $(".canvasas").show();

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

trialCount = 1
nStroopAssociationTrials = 100

function runStroopAssociation(){
  if (trialCount <= nStroopAssociationTrials) {
    stroopAssociationTrial();
  } else {
    navigateInstructionPath();
  }
}

function stroopAssociationTrial(){
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {

    // display network
    displayFractal();
    setTimeout(displayStroop,fractalPreStroopInterval);

    // set up for response
    stimOnset = new Date().getTime() - runStart;
    keyListener = 9, respTime = NaN, partResp = NaN, respOnset = NaN, acc = NaN;

    // go to next trial after delay
    setTimeout(stroopFractalTransition, stimInterval + fractalPreStroopInterval);
  }
}

function stroopFractalTransition(){

  // log data from previous trial
  //data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, fileOnly(activeNode.img.src), switchType, getAccuracy(acc), stimOnset, respOnset, respTime, partResp, activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", transitionType, NaN, isCommunityTransition() ? 1 : 0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
  //console.log(data);

  // reset old and activate new node
  prevNode = activeNode;
  activeNode.reset();

  // choose a new node from current nodes neighbors
  let neighborNodes = activeNode.neighbors;
  let filteredNeighbors = neighborNodes.filter(node => node.associatedWithTask);
  activeNode = _.sample(filteredNeighbors,1)[0];
  activeNode.activate();
  fractalTrialHistory.push(activeNode.name);

  // iterate trial count
  trialCount++; blockTrialCount++;

  // return to taskFlow func
  runStroopAssociation();
}

function displayStroop(){
  ctx.fillStyle = "white";
  ctx.fillRect(canvas.width/2 - 100, canvas.height/2 - 100, 200, 2000)
  ctx.fillStyle = "red";
  ctx.font = "bold 50px Arial";
  ctx.fillText("BLUE", canvas.width/2, canvas.height/2);
}
