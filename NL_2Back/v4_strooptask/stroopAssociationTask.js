function stroopAssociationTask(){
  sectionType = "mainTask";
  taskName = "stroopAssociationTask";

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
  taskNetwork.nodes.filter(node => node.associatedWithTask)
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
    // end of experiment code
    // taskNetwork.nodes.forEach((node) => {console.log(node.name, node.visitCount)})
    navigateInstructionPath();
  }
}

function stroopAssociationTrial(){
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {
    // check if key is being held down going into trial
    if (keyListener == 2 || keyListener == 3) {

      promptLetGo();

    } else {
      // display network and fractal
      if (showNetworkWalk == true) {drawNetwork();}
      displayFractal();
      //setTimeout(displayStroop,fractalPreStroopInterval);
      // set up for response
      stimOnset = new Date().getTime() - runStart;
      keyListener = 9, respTime = NaN, partResp = NaN, respOnset = NaN, acc = NaN;

      // go to next trial after delay
      setTimeout(stroopFractalTransition, stimInterval + fractalPreStroopInterval);
    }
  }
}

function stroopFractalTransition(){
  if (keyListener == 9 && speed != "fast") {
    // tooSlowScreen();
    }
    // keyListener == 0;
  }

  // log data from previous trial
  //data.push([sectionType, NaN, taskName, NaN, NaN, NaN, trialCount, blockTrialCount, block, fileOnly(activeNode.img.src), switchType, getAccuracy(acc), stimOnset, respOnset, respTime, partResp, activeNode.name, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.isBoundaryNode ? "b" : "i", transitionType, NaN, isCommunityTransition() ? 1 : 0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
  //console.log(data);

  // reset old and activate new node
  prevNode = activeNode;
  activeNode.reset();
  activeNode = _.sample(activeNode.neighbors,1)[0];
  activeNode.neighbors.filter(node => node.associatedWithTask);
  activeNode.activate();
  fractalTrialHistory.push(activeNode.name);

  // iterate trial count
  trialCount++; blockTrialCount++;

  // return to taskFlow func
  runStroopAssociation();
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

function displayStroop [
  ctx.fillStyle = "white";
  ctx.fillRect(canvaswidth/2 - 100, canvasheight/2 - 100, 200, 2000)
  ctx.fillStyle = "red";
  ctx.font = "bold 50px Arial";
  ctx.fillText("BLUE", canvas.width/2, canvas.height/2);
]
