"use strict"

// for testing
let testMode = false;
let speed = "normal"; //fast, normal
speed = (testMode == true) ? "fast" : speed; //testMode defaults to "fast"
let skipPractice = false; // <- turn practice blocks on or off
let openerNeeded = false; //true

// ----- Experiment Paramenters (CHANGE ME) ----- //
let fractalsNeeded = 11; //defined by network structure
let orientationCorrRespNeeded = 5;
let stimInterval = (speed == "fast") ? 5 : 1500; //2000
let nTrials = 600; //number of trials during random walk
let mathTaskTrials = 100;
let numBlocks = 5; //number of blocks to divide nTrials into
let practiceAccCutoff = (testMode == true) ? 0 : 80; // 70 acc%

// vars for network tasks
let activeNode, taskNetwork = new Network(), showNetworkWalk = false;
let imageIsRotated, proportionRotated = 0.3;

//initialize global task variables
let taskFunc //function for current task
let frCanvas, frCtx, ntCanvas, ntCtx; //fractal and network canvas
let expStage = (skipPractice == true) ? "main1" : "prac1-1"; //skip practice or not
let trialCount = 1, blockTrialCount = 1, acc, accCount = 0, stimOnset, respOnset, respTime, block = 1, partResp, runStart;
let breakOn = false, repeatNecessary = false, data=[];
let sectionStart, sectionEnd, sectionType, taskName, sectionTimer, trialType;
let mistakeSound = new Audio('sounds/mistakeSoundShort.m4a');
let keyListener = 0;
/*  keyListener explanations:
      0: No key press expected/needed
      1: Key press expected (triggered by stimulus appearing)
      2: Key press from 1 received. Awaiting keyup event, else promptLetGo() if new trial starts. After keyup resume experiment and reset to 0.
      3: Key press from 0 still being held down. On keyup, reset to 0. promptLetGo() if new trial starts.
      4: participant didn't let go in time, letgo prompt given. on key release resume task after countdown.
      5: mini block screen/feedback. Awaiting key press to continue, keyup resets to 0 and goes to next trial.
      6: instruction start task "press to continue"
      7: proceed to next instruction "press to continue"
      8: Screen Size too small, "press any button to continue"
*/
let keyMapping = randIntFromInterval(1,2);
/*
  case 1: 'Z' => correct orientation | 'M' => rotated image
  case 2: 'Z' => rotated image | 'M' => correct orientation
*/

function experimentFlow(){
  // reset block and trial counts (unless repeat)
  blockTrialCount = 1;
  if (!repeatNecessary) {
    block = 1;
    trialCount = 1;
    accCount = 0;
  } else {
    block++;
  }
  // designates which task gets called based on experiment stage var
  // experiment flow gets called by instructions.js listener
  if (expStage.indexOf("prac1") != -1){
    learnOrientationsTask();
  } else if (expStage.indexOf("prac2") != -1){
    learnNetworkTaskPractice();
  } else if (expStage.indexOf("main1") != -1){
    learnNetworkTask();
  } else if (expStage.indexOf("main2") != -1){
    oddOneOutTest();
  // } else if (expStage.indexOf("main3") != -1){
  //   networkWithMathTask();
  // } else if (expStage.indexOf("main4") != -1){
  //   fractalPreferenceTask();
  } else {
    endOfExperiment();
  }
}

$(document).ready(function(){

  // prepare fractal canvas no matter what
  frCanvas = document.getElementById('fractalCanvas');
  frCtx = fractalCanvas.getContext('2d');
  frCtx.textBaseline= "middle";
  frCtx.textAlign="center";

  // prepare network canvas if needed
  if (showNetworkWalk == true) {
    ntCanvas = document.getElementById('networkCanvas');
    ntCtx = networkCanvas.getContext('2d');
    ntCtx.textBaseline= "middle";
    ntCtx.textAlign="center";
  }

  // create key press listener
  $("body").keypress(function(event){
    if (keyListener == 0) { //bad press
      keyListener = 3;
    } else if (keyListener == 1) { //good press
      keyListener = 2;
      // accuracy
      partResp = event.which;
      if (keyMapping == 1 ? !imageIsRotated : imageIsRotated ) {
        acc = ([122,90].includes(event.which)) ? 1 : 0;
      } else {
        acc = ([109,77].includes(event.which)) ? 1 : 0;
      }
      if (acc == 1) {accCount++;}
      // task feedback
      if (acc == 0) {
        mistakeSound.play();
      }
      // reaction time
      respOnset = new Date().getTime() - runStart;
      respTime = respOnset - stimOnset;
    }
  });

  // create key release listener
  $("body").keyup(function(event){
    if (keyListener == 2 ) { //good press release
      keyListener = 0;
    } else if (keyListener == 3) { //resets bad press to 0
      keyListener = 0;
    } else if (keyListener == 4) { //didn't let go
      keyListener = 0;
      countDown(3, "fast");
    } else if (keyListener == 5) { //press button to start task (instructions)
      keyListener = 0;
      // log data
      sectionEnd = new Date().getTime() - runStart;
      data.push([sectionType, expStage, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
      console.log(data);
      // go to next experiment
      keyListener = 0;
      experimentFlow();
    } else if (keyListener == 6) { //navigates from task feedback to instructions (handles repeats)
      keyListener = 0;
      // log data
      sectionEnd = new Date().getTime() - runStart;
      data.push([sectionType, NaN, taskName, NaN, NaN, NaN, block, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
      console.log(data);
      // go to instructions
      navigateInstructionPath(repeatNecessary);
    } else if (keyListener == 7) { //block break screen
      keyListener = 0;
      clearInterval(sectionTimer);
      // increment block for next time
      block++;
      // log data
      sectionEnd = new Date().getTime() - runStart;
      data.push([sectionType, NaN, taskName, NaN, NaN, NaN, block, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
      console.log(data);
      // resume task
      keyListener = 0; sectionType = "mainTask";
      countDown(3);
    }
  });

  // see if menu.html is still open
  if (openerNeeded == true && opener == null) {
    promptMenuClosed();
  } else {
    // start experiment
    runStart = new Date().getTime();
    setUpNetwork();
    // learnNetworkTask();
    runInstructions();
    // fractalPreferenceTask();
    // oddOneOutTest();
    // networkWithMathTask();
  }
});

function promptMenuClosed(){
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

function randIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function multinomialSample(sampleArr, probArr){
  // build probability integer var
  let sampleProbs = [];
  let probability = 0;
  for (let i = 0; i < sampleArr.length; i++) {
    probability += probArr[i];
    sampleProbs.push(probability);
  }

  // get random number, use to grab value
  let randNumber = Math.random();
  for (let i = 0; i < sampleProbs.length; i++) {
    if (randNumber > sampleProbs[i]) {
      continue;
    } else {
      return sampleArr[i];
    }
  }
}

// // testing multinomialSample function
// let testingVar = {1:0,2:0,3:0,4:0}
// for (var i = 0; i < 10000; i++) {
//   testingVar[multinomialSample([1,2,3,4],[0.2,0.4,0.3,0.1])]++;
// }
// console.log(testingVar);
