function networkIllegalTransitionTask(){
  sectionType = "mainTask";
  taskName = "IllegalTransitionTask";

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
  trialHistory.push(activeNode.name);
  transitionType = "l";

  // set taskFunc so countdown goes to right task
  taskFunc = runIllegalTransition;

  // start task after countdown
  countDown(3);
}

function runIllegalTransition(){
  if (trialCount <= nNetworkTrials) {
    if (trialCount > 1 && trialCount != nNetworkTrials && (trialCount - 1)%breakEveryNTrials == 0 && !breakOn) {
      breakOn = true;
      networkBlockBreak();
    } else {
      breakOn = false;
      networkTrial();
    }
  } else {
    // end of experiment code
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

      console.log(activeNode.name);
      console.log(transitionType);

      // set up for response
      stimOnset = new Date().getTime() - runStart;
      keyListener = 1, respTime = NaN, partResp = NaN, respOnset = NaN, acc = NaN;

      // go to next trial after delay
      setTimeout(networkTransition, stimInterval);
    }
  }
}

function networkTransition(){
  if (keyListener == 1 && speed != "fast") {
    // tooSlowScreen();
    // if (playSounds && playSoundsExperiment && switchType != "n") {
    //   mistakeSound.play();
    // }
    // keyListener == 0;
  }

  // log data from previous trial
  // data.push([]);
  // console.log(data);

  prevNode = activeNode;
  activeNode.reset();

  if (Math.random() < 0.1) {
    transitionType = "i"; //illegal transition
    activeNode = _.sample(taskNetwork.nodes.filter(node => !activeNode.neighbors.includes(node) && node != activeNode),1)[0];
  } else {
    transitionType = "l"; //legal (random) transition
    activeNode = _.sample(activeNode.neighbors,1)[0];
  }

  activeNode.activate();
  trialHistory.push(activeNode.name);

  // iterate trial count
  trialCount++; blockTrialCount++;

  // return to taskFlow func
  runIllegalTransition();
}

function networkBlockBreak(){
  sectionType = "blockBreak";
  sectionStart = new Date().getTime() - runStart;
  keyListener = 0; //else keylistener stays = 1 till below runs
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
    ctx.fillText("Your overall accuracy so far is " + Math.round((accCount/trialCount)*100) + "%.",canvas.width/2,canvas.height/2+50);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 200);
  }
}
