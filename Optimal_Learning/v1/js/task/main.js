"use strict"

// for testing
let testMode = false;
let speed = "normal"; //fast, normal
speed = (testMode == true) ? "fast" : speed; //testMode defaults to "fast"
let skipPractice = false; // turn practice blocks on or off
let openerNeeded = false; // require menu.html to also be open to run experiment (needed for MTurk)
let playSounds = true;
let showNetworkWalk = false;
let showNavButtons = false;

// ----- Experiment Paramenters (CHANGE ME) -----
let networkSize = 10; //defined by network structure
let showFixation = false;
let fixationSymbol = ""; // "", "+"
let fixInterval = (speed == "fast") ? 5 : 500;
let showFeedback = true;
let feedbackInterval = (speed == "fast") ? 5 : 1000;
let stimInterval = (speed == "fast") ? 5 : 1500; //2000
let earlyRelease = true;
let nNetworkTrials = 800;
let breakEveryNTrials = 200;
let nPracticeTrials = 20; //number of practice trials for 1-back and 2-back tasks
let percRepeats = 0.25; //percent repeat in 1-back and 2-back practices (match frequency of repeats in random walk)
let numBlocks = 5; //number of blocks to divide nNetworkTrials into
let practiceAccCutoff = (testMode == true) ? 0 : 75; // 70 acc%
let expStage = (skipPractice == true) ? "main1" : "prac1-1"; //initial expStage

// task variables
let activeNode, prevNode, taskNetwork = new Network(), hamiltonianPath = [], transitionType, currentTaskArray = [];
let taskFunc, timeoutFunc, stimTimeout; //function for current task
let actionArr, stimArr, switchRepeatArr, buffer, stimSet, trialIsRepeat, trialIsNA, switchType, accArr, trialHistory = [], earlyReleaseExperiment = false, playSoundsExperiment = false;
let canvas, ctx, ntCanvas, ntCtx; //canvases
let trialCount = 1, blockTrialCount = 1, acc, accCount = 0, stimOnset, respOnset, respTime, block = 1, partResp, runStart;
let breakOn = false, repeatNecessary = false, data=[];
let mistakeSound = new Audio('././sounds/mistakeSoundShort.m4a');
let sectionStart, sectionEnd, sectionType, taskName, sectionTimer, trialType, taskSet;
let keyListener = 0;
/*  keyListener explanations:
      0: No key press expected/needed
      1: Key press expected (triggered by stimulus appearing)
      2: Key press from 1 received. Awaiting keyup event, else promptLetGo() if new trial starts. After keyup resume experiment and reset to 0.
      3: Key press from 0 still being held down. On keyup, reset to 0. promptLetGo() if new trial starts.
      4: Screen Size too small, "press any button to continue"
      5: press button to start experiment (from instructions)
      6: press button to continue to instructions (from feedback)
      7: proceed to next block of task (from block break screen)
*/

let keyMapping = randIntFromInterval(1,2);
keyMapping = 1;
/*
  case 1: '1' => n-back repeat | '0' => n-back no repeat
  case 2: '1' => n-back no repeat | '0' => n-back repeat
*/

function experimentFlow(){
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {
    // hide cursor
    document.body.style.cursor = 'none';

    // reset block and trial counts (unless repeat)
    blockTrialCount = 1;
    trialCount = 1;
    if (!repeatNecessary) {
      block = 1;
    } else {
      block++;
    }

    // navigateInstructionPath(repeatNecessary);
    // // go to the correct task based on expStage variable
    if (expStage.indexOf("prac1") != -1){
      // practiceTask()
    } else if (expStage.indexOf("main1") != -1){
      networkPairsTask();
    } else if (expStage.indexOf("main2") != -1){
      oddOneOutTest();
    } else {
      endOfExperiment();
    }
  }
}

$(document).ready(function(){

  // main display canvas
  canvas = document.getElementById('taskCanvas');
  ctx = canvas.getContext('2d');
  ctx.textBaseline= "middle";
  ctx.textAlign="center";

  // canvas for showing network walk
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
      if (keyMapping == 1 ? trialIsRepeat : !trialIsRepeat ) {
        acc = ([49,33].includes(event.which)) ? 1 : 0;
      } else {
        acc = ([48,41].includes(event.which)) ? 1 : 0;
      }

      if (acc == 1) {
        if (!trialIsNA) {
          accCount++;
        }
      } else {
        if (playSounds && playSoundsExperiment && !trialIsNA) {
          mistakeSound.play();
        }
      }

      // reaction time
      respOnset = new Date().getTime() - runStart;
      respTime = respOnset - stimOnset;
    }
  });

// create key release listener
    $("body").keyup(function(event){
    if (keyListener == 2 ) { //good press release
      if (earlyRelease){
        if (earlyReleaseExperiment) {
          clearTimeout(stimTimeout);
          timeoutFunc();
        }
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
      data.push([sectionType, expStage, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
      console.log(data);
      // go to next experiment
      keyListener = 0;
      experimentFlow();
    } else if (keyListener == 6) { //navigates from task feedback to instructions (handles repeats)
      keyListener = 0;
      // log data
      sectionEnd = new Date().getTime() - runStart;
      data.push([sectionType, NaN, taskName, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
      console.log(data);
      // go to instructions
      navigateInstructionPath(repeatNecessary);
    } else if (keyListener == 7) { //block break screen
      keyListener = 0;
      clearInterval(sectionTimer);
      // increment block
      block++;
      blockTrialCount = 1;

      // log data
      sectionEnd = new Date().getTime() - runStart;
      data.push([sectionType, NaN, taskName, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
      console.log(data);

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
    expStage = "main2";
    runInstructions();
  });


  // see if menu.html is still open
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {
    // start experiment
    runStart = new Date().getTime();

    setUpNetwork();
    runInstructions();
    // oddOneOutTest();
  }

});

function promptMenuClosed(){
  $(".canvasas").hide();
  $("#oddOneOutTaskDiv").hide();
  $('#instructionsDiv').hide();
  $('.MenuClosedPrompt').show();
}

function endOfExperiment(){
  // end of experiment stuff
  try {
    // upload data to menu.html's DOM element
    $("#RTs", opener.window.document).val(data.join(";"));

    // call menu debriefing script
    opener.updateMainMenu(3);

    // close the experiment window
    JavaScript:window.close();
  } catch (e) {
    alert("Data upload failed. Did you close the previous screen?");
  }
}
