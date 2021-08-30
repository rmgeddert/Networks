function learnNetworkTask(){
  sectionType = "mainTask";
  taskName = "learnNetworkTask";

  // declare task vars
  earlyReleaseExperiment = false;
  playSoundsExperiment = true;

  // hide instructions and show canvas
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  canvas.style.display = "inline-block";
  if (showNetworkWalk == true) {ntCanvas.style.display = "inline-block";}
  $(".canvasas").show();

  // set up first active node
  activeNode = _.sample(taskNetwork.nodes,1)[0];
  activeNode.activate();
  fractalTrialHistory.push(activeNode.name);
  transitionType = "r";

  // set taskFunc so countdown goes to right task
  taskFunc = runFractalLearning;

  // start task after countdown
  countDown(3);
}

function runFractalLearning(){
  if (trialCount <= nFractalTrials) {
    if (trialCount > 1 && trialCount != nFractalTrials && (trialCount - 1)%300 == 0 && !breakOn) {
      breakOn = true;
      fractalBlockBreak();
    } else {
      breakOn = false;
      fractalTrial();
    }
  } else {
    // end of experiment code
    // taskNetwork.nodes.forEach((node) => {console.log(node.name, node.visitCount)})
    breakOn = false;
    navigateInstructionPath();
  }
}

function fractalTrial(){
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {
    // check if key is being held down going into trial
    if (keyListener == 2 || keyListener == 3) {

      promptLetGo();

    } else {
      // see if image is repeat
      trialIsRepeat = (blockTrialCount > 2) ?  fractalTrialHistory[trialCount - 1] == fractalTrialHistory[trialCount - 3] : false;
      trialIsNA = blockTrialCount <= 2;
      switchType = (blockTrialCount <= 2) ? "n" : (trialIsRepeat) ? "r" : "s";

      // display network and fractal
      if (showNetworkWalk == true) {drawNetwork();}
      displayFractal();
      
      // set up for response
      stimOnset = new Date().getTime() - runStart;
      keyListener = 1, respTime = NaN, partResp = NaN, respOnset = NaN, acc = NaN;

      // go to next trial after delay
      setTimeout(fractalTransition, stimInterval);
    }
  }
}

function fractalTransition(){
  if (keyListener == 1 && speed != "fast") {
    // tooSlowScreen();
    if (playSounds && playSoundsExperiment && switchType != "n") {
      mistakeSound.play();
    }
    // keyListener == 0;
  }

  // log data from previous trial
  data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, fileOnly(activeNode.img.src), switchType, getAccuracy(acc), stimOnset, respOnset, respTime, partResp, activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", transitionType, NaN, isCommunityTransition() ? 1 : 0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
  console.log(data);

  // reset old and activate new node
  prevNode = activeNode;
  activeNode.reset();
  activeNode = _.sample(activeNode.neighbors,1)[0];
  activeNode.activate();
  fractalTrialHistory.push(activeNode.name);

  // iterate trial count
  trialCount++; blockTrialCount++;

  // return to taskFlow func
  runFractalLearning();
}

function fractalBlockBreak(){
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
    ctx.fillText(minutes + ":" + seconds,canvas.width/2,canvas.height/2 - 100);

    // display miniblock text
    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText("This is a short break. Please don't pause for more than 3 minutes.",canvas.width/2,canvas.height/2 - 150);
    if (Math.ceil(nFractalTrials / 300) - block > 1) {
      ctx.fillText("You are finished with block " + block + ". You have " + (Math.ceil(nFractalTrials / 300)  - block) + " blocks left.",canvas.width/2,canvas.height/2);
    } else {
      ctx.fillText("You are finished with block " + block + ". You have " + (Math.ceil(nFractalTrials / 300) - block) + " block left.",canvas.width/2,canvas.height/2);
    }
    ctx.fillText("Your overall accuracy so far is " + Math.round((accCount/trialCount)*100) + "%.",canvas.width/2,canvas.height/2+50);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 200);
  }
}
