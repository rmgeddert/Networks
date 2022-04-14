"use strict"

// ----- Meta parameters (for testing) -----
let speed = "normal"; //fast, normal
let openerNeeded = false; // require menu.html to also be open to run experiment (needed for MTurk)
let showNetworkWalk = false;
let showNavButtons = false;
let showFeedback = true;

// ----- Experiment Paramenters (CHANGE ME) -----
let networkSize = 10; //don't change without also updating network structure in networkFunctions.js
let nNetworkTrials = 200; //# of trials in illegal transition task
let breakEveryNTrials = 100;
let nPracticeTrials = 20;
let stimInterval = (speed == "fast") ? 50 : 2000; //1500 is default for now
let expStage = "main1-1"; //initialize expStage (make sure matches instructions)
let illegalProbability = 0.2; //frequency of illegal transitions
let correctTime = 1000;
let incorrectTime = 3000;
let practiceAccCutoff = 80;
// stroop related
let imagePreStroopInterval = 500;
let fixInterval = (speed == "fast") ? 5 : 500;
let stroopStimInterval = (speed == "fast") ? 5 : 1500; //2000
let stroopITI = (speed == "fast") ? 1 : 1000; //1200
let nStroopAssociationTrials = 96;
let nTransferTrials = 96;
let nNovelNodes = 6;

// task variables
let taskNetwork = new Network(), activeNode, prevNode, transitionType;
let taskFunc, transitionFunc, stimTimeout, feedbackShown, missedSkip;
let trialHistory = [], earlyReleaseExperiment = false, playSoundsExperiment = false;
let actionArr, stimArr, switchRepeatArr, buffer, stimSet, stroopOnset, trialIsRepeat, trialIsNA, switchType, accArr;
let canvas, ctx, ntCanvas, ntCtx; //canvas variables
let data=[], taskName, trialCount, blockTrialCount, acc, accCount, stimOnset, respOnset, respTime, block, partResp, runStart, legalIllegalArray = [], trialType, taskSet; //variables for data logging
let breakOn = false, repeatNecessary = false; //variables for block breaks and repeating practie blocks
let mistakeSound = new Audio('././sounds/mistakeSoundShort.m4a'); //default error buzz
let sectionStart, sectionEnd, sectionType, sectionTimer; //for logging non experimental sections (instruction and break screens)
let keyListener = 0;
/*  key press listener values:
      0: No key press expected/needed => do nothing. KL => 3
      1: Key press expected (triggered by stimulus appearing) KL => 2
      2: Key press from 1 received. Reset to 0 on keyup.  promptLetGo() if new trial starts without them having let go yet.
      3: Key press from 0 still being held down. Reset to 0 on keyup.  promptLetGo() if new trial starts without them having let go yet.
      4: Screen Size too small, "press any button to continue"
      5: Press button to start experiment (from instructions)
      6: Press button to continue to instructions (from feedback)
      7: Proceed to next block of task (from block break screen)
*/

function experimentFlow(){
  // proceed to task unless menu.js is closed
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {
    // set block and trial counts (unless repeat of task)
    trialCount = 1;
    blockTrialCount = 1;
    accCount = 0;
    if (!repeatNecessary) {
      block = 1;
    } else {
      block++;
    }

    // go to the relevant task based on expStage variable
    if (expStage.indexOf("main1") != -1){
      networkDragTask();
    } else if (expStage.indexOf("main2") != -1){
      if (!repeatNecessary) {
        getNetworkDiagramReady(); //this needs to run before first illegal transition task
      }
      practiceIllegalTransitionTask();
    } else if (expStage.indexOf("main3") != -1){
      illegalTransitionTask();
    } else if (expStage.indexOf("main4") != -1){
      oddOneOutTest();
    } else if (expStage.indexOf("prac5") != -1){
      stroopTaskPractice();
    } else if (expStage.indexOf("main6") != -1){
      stroopAssociationTask();
    } else if (expStage.indexOf("main7") != -1) {
      stroopTransferTask();
    } else {
      endOfExperiment();
    }
  }
}

// Experiment starts here
$(document).ready(function(){

  // set up main display canvas
  canvas = document.getElementById('taskCanvas');
  ctx = canvas.getContext('2d');
  ctx.textBaseline= "middle";
  ctx.textAlign="center";

  // set up canvas for showing network walk
  ntCanvas = document.getElementById('networkCanvas');
  ntCtx = networkCanvas.getContext('2d');
  ntCtx.textBaseline= "middle";
  ntCtx.textAlign="center";

  // create key press listener
  $("body").keypress(function(event){
    if (keyListener == 0) { //bad press
      keyListener = 3;
    } else if (keyListener == 1) { //good press
      keyListener = 2; //await key up

      // accuracy
      partResp = event.which;
      // reaction time
      respOnset = new Date().getTime() - runStart;
      respTime = respOnset - stimOnset;

      if (taskName == "practiceTransitionTask") {
        if (transitionType == "l") {
          // partResp will = 90 or 122 if 'z' pressed
          if ([90, 122].indexOf(partResp) != -1) {
            acc = 1;
          } else {
            acc = 0;
          }
        } else if (transitionType == "i") {
          // partResp will = 77 or 109 if 'z' pressed
          if ([77, 109].indexOf(partResp) != -1) {
            acc = 1;
          } else {
            acc = 0;
          }
        }
      } else if (taskName.indexOf("stroop") != -1) {
        acc = (currentTaskArray[trialCount-1][3].includes(partResp)) ? 1 : 0;
        if (acc) {
          accCount++;
        }
        respTime = respOnset - stroopOnset;
      }
    }
  });

// create key release listener
    $("body").keyup(function(event){
    if (keyListener == 2 ) { //good press release
      if (taskName == "practiceTransitionTask") {
        transitionFunc();
      }
      if (earlyReleaseExperiment) {
        clearTimeout(stimTimeout);
        transitionFunc();
      }
      keyListener = 0;
    } else if (keyListener == 3) { //resets bad press to 0
      keyListener = 0;
    } else if (keyListener == 4) { //screen size warning
      keyListener = 0;
      countDown(3, "fast");
    } else if (keyListener == 5) { //press button to start task (instructions)
      keyListener = 0;
      // log data
      sectionEnd = new Date().getTime() - runStart;
      logSectionData();
      logSectionData();
      // go to next experiment
      keyListener = 0;
      experimentFlow();
    } else if (keyListener == 6) { //navigates from task feedback to instructions (handles repeats)
      keyListener = 0;
      // log data
      sectionEnd = new Date().getTime() - runStart;

      // go to instructions
      navigateInstructionPath(repeatNecessary);
    } else if (keyListener == 7) { //block break screen
      keyListener = 0;
      clearInterval(sectionTimer);
      logSectionData();
      // increment block
      block++;
      blockTrialCount = 1;

      // log data
      logSectionData();

      // resume task
      keyListener = 0; sectionType = "mainTask";
      countDown(3);
    }
  });

  //set up navButtons
  $(document).on("click", "#navNetworkLearning", function(){
    expStage = "main1";
    runInstructions();
  });

  $(document).on("click", "#navOddOneOut", function(){
    expStage = "main3";
    runInstructions();
  });

  // having set up all the various key and button listeners, start task
  if (openerNeeded == true && opener == null) {
    $("#network-diagram").hide();
    promptMenuClosed();
  } else {
    // start experiment
    runStart = new Date().getTime();

    setUpNetwork();
    prepareNetworkDiagram();
    $("#network-diagram").hide();
    runInstructions();
    // networkDragTask();
  }

});
