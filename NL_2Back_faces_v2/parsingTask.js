function parsingTask(){
  sectionType = "mainTask";
  taskName = "parsingTask";

  // declare task vars
  earlyReleaseExperiment = false;

  // hide instructions and show canvas
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  canvas.style.display = "inline-block";
  if (showNetworkWalk == true) {ntCanvas.style.display = "inline-block";}
  $(".canvasas").show();

  //  get hamiltonian path for this participant
  hamiltonianPath = getHamiltonianPath();

  // set up first active node
  activeNode = _.sample(taskNetwork.nodes,1)[0];
  activeNode.activate();
  transitionType = "n";

  // set taskFunc so countdown goes to right task
  taskFunc = runParsingTask;

  // start task after countdown
  countDown(3);
}

function runParsingTask(){
  if (openerNeeded == true && opener == null){
    promptMenuClosed();
  } else {
    if (trialCount <= nParsingTrials) {
      if (trialCount > 1 && trialCount != nParsingTrials && (trialCount - 1)%(300) == 0 && !breakOn) {
        breakOn = true;
        parsingBlockBreak();
      } else {
        breakOn = false;
        parsingTrial();
      }
    } else {
      // end of experiment code
      // taskNetwork.nodes.forEach((node) => {console.log(node.name, node.visitCount)})
      breakOn = false;
      navigateInstructionPath();
    }
  }
}

function parsingTrial(){
  // display network and fractal
  if (showNetworkWalk == true) {drawNetwork();}
  displayStim();

  // set up for response
  stimOnset = new Date().getTime() - runStart;
  keyListener = 8, respTime = NaN, partResp = NaN, respOnset = NaN, acc = 0;

  // go to next trial after delay
  setTimeout(parsingTransition, stimInterval);
}

function parsingTransition(){
  let backwards;
  // log data from previous trial
  data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, fileOnly(activeNode.img.src), NaN, NaN, stimOnset, respOnset, respTime, partResp, activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", transitionType, isNaN(partResp) ? 0 : 1, isCommunityTransition() ? 1 : 0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
  console.log(data);

  // reset old and activate new node
  prevNode = activeNode;
  activeNode.reset();

  // setect next node from random or hamiltonian walk
  if ((trialCount - 1)%30 < 15) {
    // console.log("Trial ", trialCount);
    // console.log("Hamiltonian transition");
    if ((trialCount - 1)%30 == 0) {
      backwards = Math.random() > 0.5;
    }
    activeNode = nextHamiltonianNode(activeNode, backwards);
    transitionType = "h";
  } else {
    // console.log("Trial ", trialCount);
    // console.log("Random transition");
    activeNode = _.sample(activeNode.neighbors,1)[0];
    transitionType = "r";
  }
  // console.log(activeNode.name);
  activeNode.activate();

  // iterate trial count
  trialCount++; blockTrialCount++;

  // return to taskFlow func
  runParsingTask();
}

function getHamiltonianPath(){

  let newPath = [];
  let nodesRemaining = true;

  // randomly select first location in path
  activeNode = _.sample(taskNetwork.nodes,1)[0];
  newPath.push(activeNode);

  // loop through remaining nodes and create hamiltonian
  while (nodesRemaining) {
    if (newPath.length == 1) { //if first location of hamiltonian
      activeNode = _.sample(activeNode.neighbors,1)[0];
    } else { //there have been previous locations
      if (activeNode.isBoundaryNode){ //if boundary node
        if (newPath[newPath.length - 2].isBoundaryNode){ //boundary => boundary transition
          //choose from remaining internals, else finish
          if (activeNode.neighbors.filter(node => !node.isBoundaryNode).filter(node => !newPath.includes(node)).length > 0) {
            activeNode = _.sample(activeNode.neighbors.filter(node => !node.isBoundaryNode).filter(node => !newPath.includes(node)),1)[0];
          } else {
            nodesRemaining = false;
          }
        } else { //internal => boundary transition
          //choose opposite boundary if remaining, else finish
          if (activeNode.neighbors.filter(node => node.isBoundaryNode).filter(node => !newPath.includes(node)).length > 0) {
            activeNode = _.sample(activeNode.neighbors.filter(node => node.isBoundaryNode),1)[0];
          } else {
            nodesRemaining = false;
          }
        }
      } else { //is internal node
        if (activeNode.neighbors.filter(node => !node.isBoundaryNode).filter(node => !newPath.includes(node)).length > 0){ //if remaning internal nodes, randomly choose one of internals
          activeNode = _.sample(activeNode.neighbors.filter(node => !node.isBoundaryNode).filter(node => !newPath.includes(node)),1)[0];
        } else if (activeNode.neighbors.filter(node => node.isBoundaryNode).filter(node => !newPath.includes(node)).length > 0)
        { //else if remaining boundary nodes
          activeNode = _.sample(activeNode.neighbors.filter(node => node.isBoundaryNode).filter(node => !newPath.includes(node)),1)[0];
        } else {
          nodesRemaining = false;
        }
      }
    }
    // having picked the next node, add it to the newPath
    if (nodesRemaining) {
      newPath.push(activeNode);
    }
  }
  return newPath;
}

function nextHamiltonianNode(node, backwards){
  // choose next node from selected hamiltonian path
  let currentIndex = hamiltonianPath.indexOf(node), nextNode;

  if (backwards) {
    if (currentIndex == 0){
      return nextNode = hamiltonianPath[hamiltonianPath.length - 1];
    } else {
      return nextNode = hamiltonianPath[currentIndex - 1];
    }
  } else {
    if (currentIndex == hamiltonianPath.length - 1){
      return nextNode = hamiltonianPath[0];
    } else {
      return nextNode = hamiltonianPath[currentIndex + 1];
    }
  }
}

function parsingBlockBreak(){
  sectionType = "blockBreak";
  sectionStart = new Date().getTime() - runStart;
  keyListener = 0; //else keylistener stays = 1 till below runs
  setTimeout(function(){keyListener = 7},2000);

  // display break screen (With timer)
  drawBreakScreen("03","00");
  blockBreakFunction(3,0);

  function blockBreakFunction(minutes, seconds){
    let time = minutes*60 + seconds;
    ctx.fillStyle = "black";
    sectionTimer = setInterval(function(){
      if (time < 0) {return}
      ctx.fillStyle = (time <= 60) ? "red" : "black";
      let minutes = Math.floor(time / 60);
      if (minutes < 10) minutes = "0" + minutes;
      let seconds = Math.floor(time % 60);
      if (seconds < 10) seconds = "0" + seconds;
      drawBreakScreen(minutes, seconds);
      time--;
    }, 1000);
  }

  function drawBreakScreen(minutes, seconds){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw timer (with color from previous function)
    ctx.font = "bold 45px Arial";
    ctx.fillText(minutes + ":" + seconds,canvas.width/2,canvas.height/2 - 50);

    // display miniblock text
    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText("This is a short break. Please don't pause for more than 3 minutes.",canvas.width/2,canvas.height/2 - 150);
    if (Math.ceil(nParsingTrials / 300) - block > 1) {
      ctx.fillText("You are finished with block " + block + ". You have " + (Math.ceil(nParsingTrials / 300) - block) + " blocks left.",canvas.width/2,canvas.height/2 + 50);
    } else {
      ctx.fillText("You are finished with block " + block + ". You have " + (Math.ceil(nParsingTrials / 300) - block) + " block left.",canvas.width/2,canvas.height/2 + 50);
    }
    ctx.font = "bold 25px Arial";
    ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 100);
  }
}
