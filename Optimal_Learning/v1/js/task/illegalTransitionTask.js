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

  // get svg network diagram ready (centered) and add text spots
  getNetworkDiagramReady();

  // set up first active node
  activeNode = _.sample(taskNetwork.nodes,1)[0];
  activeNode.activate();
  trialHistory.push(activeNode.name);
  transitionType = "l";

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
      networkBlockBreak();
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
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {
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
}

function networkTransition(){
  if (transitionType == "i") {
    acc = (Boolean(partResp)) ? 1 : 0;
  } else {
    acc = (Boolean(partResp)) ? 0 : 1;
  }
  let missedSkip = (transitionType == "i" && !partResp);
  if (missedSkip) {
    console.log('missed skip');
  }
  let falseAlarm = (transitionType == "l" && Boolean(partResp));
  if (falseAlarm) {
    console.log('false alarm');
  }
  let mistake = missedSkip || falseAlarm;
  if (mistake && !feedbackShown && showFeedback) {

    if (transitionType == "i") {
      showIllegalTransition();
    } else {
      showLegalTransition();
    }

  } else {

    // log data from previous trial
    data.push([sectionType, taskName, trialCount, blockTrialCount, block, NaN, stimOnset, respOnset, respTime, acc, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN,fileOnly(activeNode.img.src), activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", transitionType, isCommunityTransition() ? 1 : 0, partResp, missedSkip ? 0 : 1, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN ]);
    console.log(data);
    // console.log(data);

    // remember where we just were
    prevNode = activeNode;
    activeNode.reset();
    prevTransition = transitionType;

    // randomly choose a new node (can be illegal or legal transition)
    // don't allow for consecutive illegal transitions
    if (Math.random() < illegalProbability && prevTransition != "i") {
      transitionType = "i"; //illegal transition
      activeNode = _.sample(taskNetwork.nodes.filter(node => !activeNode.neighbors.includes(node) && node != activeNode),1)[0];
      console.log("illegal - press space!");
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
    runIllegalTransition();
  }
}

function networkBlockBreak(){
  sectionType = "blockBreak";
  sectionStart = new Date().getTime() - runStart;
  keyListener = 0; //make sure no responses can get through
  setTimeout(function(){keyListener = 7},2000);

  // display break screen (With timer)
  drawBreakScreen("02","00");
  blockBreakFunction(2,0);

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
    ctx.fillText(minutes + ":" + seconds,canvas.width/2,canvas.height/2 - 100);

    // display miniblock text
    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText("This is a short break. Please don't pause for more than 2 minutes.",canvas.width/2,canvas.height/2 - 150);
    if (Math.ceil(nNetworkTrials / breakEveryNTrials) - block > 1) {
      ctx.fillText("You are finished with block " + block + ". You have " + (Math.ceil(nNetworkTrials / breakEveryNTrials)  - block) + " blocks left.",canvas.width/2,canvas.height/2);
    } else {
      ctx.fillText("You are finished with block " + block + ". You have " + (Math.ceil(nNetworkTrials / breakEveryNTrials) - block) + " block left.",canvas.width/2,canvas.height/2);
    }
    ctx.font = "bold 25px Arial";
    ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 100);
  }
}
