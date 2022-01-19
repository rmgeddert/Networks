function oneBackPractice(){
  // console.log("1-Back Practice task");

  // declare and set task variables
  sectionType = "pracTask";
  taskName = "1-Back";
  earlyReleaseExperiment = true;
  playSoundsExperiment = false;

  // hide instructions, show canvas
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  canvas.style.display = "inline-block";
  $(".canvasas").show();

  // set up vowel sequence
  nBack = 1, stimSet = ["A","E","I","O","U"];
  switchRepeatArr = getSwitchRepeatArr(nPracticeTrials, percRepeats, nBack);
  // console.log(switchRepeatArr);
  stimArr = getStimArr(switchRepeatArr, stimSet, nBack);
  // console.log(stimArr);
  accArr = [];
  accCount = 0;

  // run taskFunc ()= run1Back) after countdown
  taskFunc = run1Back;
  countDown(3);
}

function run1Back(){
  if (trialCount <= Math.ceil(nPracticeTrials/2)) {

    if (screenSizeIsOk()){

      if (showFixation) {
        nBackFixationScreen();
      } else {
        stimScreen();
      }

    } else {
      promptScreenSize();
    }

  } else {
    // let passesAccuracy = checkAccuracy(accArr, switchRepeatArr);
    // nBackFeedback(passesAccuracy);

    nBackFeedback(Math.round( accCount / (trialCount - 1 - nBack) * 100 ));
  }
}
