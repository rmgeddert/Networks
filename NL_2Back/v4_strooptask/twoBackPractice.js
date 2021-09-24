function twoBackPractice(){
  // console.log("2-Back Practice task");

  // declare and set task variables
  sectionType = "pracTask";
  taskName = "2-Back";
  earlyReleaseExperiment = true;
  playSoundsExperiment = false;

  // hide instructions, show canvas
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  canvas.style.display = "inline-block";
  $(".canvasas").show();

  // set up vowel sequence
  nBack = 2, stimSet = ["A","E","O","U","I"];
  switchRepeatArr = getSwitchRepeatArr(nPracticeTrials, percRepeats, nBack);
  // console.log(switchRepeatArr);
  stimArr = getStimArr(switchRepeatArr, stimSet, nBack);
  // console.log(stimArr);
  accArr = [];
  accCount = 0;

  // run taskFunc ()= run2Back) after countdown
  taskFunc = run2Back;
  countDown(3);
}

function run2Back(){
  if (trialCount <= nPracticeTrials) {

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

    nBackFeedback(Math.round( accCount / (trialCount - 1 - nBack) * 100 ));

  }
}
