function stroopTransferTask(){

  sectionType = "mainTask";
  taskName = "stroopTransferTask";

  // declare task vars
  earlyReleaseExperiment = true;
  playSoundsExperiment = false;

  // hide instructions and show canvas
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  $("#fractalCanvas").show();

  // set taskFunc so countdown goes to right task
  taskFunc = runStroopTransfer;

  // start task after countdown
  countDown(3);
}

function runStroopTransfer(){
  if (trialCount <= nTransferTrials) {
    transferTrial();
  } else {
    navigateInstructionPath();
  }
}

function transferTrial(){
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {
    drawFractal();
    drawStroopStim();
    setTimeout(transferTransition, stimInterval);
  }
}

function transferTransition(){
  // log Data

  // iterate trial count
  trialCount++; blockTrialCount++;

  // return to taskFlow func
  runStroopTransfer();
}

function makeStroopTrialArray(){
  let stroopAssociationTaskSet = [];

  // add images not associated with task from network
  taskNetwork.nodes.filter(node => !node.associatedWithTask).forEach((node) => {
    stroopAssociationTaskSet.push(new fractalAssociationImage(node.img, true));
  });

  // add novel images to task set
  let extraImages = _.sample(unselectedImages,8);
  extraImages.forEach((image) => {
    stroopAssociationTaskSet.push(new fractalAssociationImage(image, false));
  });

  return stroopAssociationTaskSet;
}

function drawFractal(img){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img,canvas.width/2 - img.width/2,canvas.height/2-img.height/2);
}

function drawStroopStim(){
  ctx.fillStyle = "white";
  ctx.fillRect(canvaswidth/2 - 100, canvasheight/2 - 100, 200, 2000)
  ctx.fillStyle = "red";
  ctx.font = "bold 50px Arial";
  ctx.fillText("BLUE", canvas.width/2, canvas.height/2);
}
