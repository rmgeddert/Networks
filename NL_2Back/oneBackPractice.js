function oneBackPractice(){
  console.log("Running 1-Back task...");

  // declare and set task variables
  sectionType = "pracTask";
  taskName = "1-Back Task (Practice)";

  // hide instructions, show canvas
  $('#instructionsDiv').hide();
  canvas.style.display = "inline-block";
  $(".canvasas").show();

  // set up vowel sequence
  nBack = 1, stimSet = ["A","E","I","O","U"];
  switchRepeatArr = getSwitchRepeatArr(nPracticeTrials, percRepeats, nBack);
  console.log(switchRepeatArr);
  stimArr = getStimArr(switchRepeatArr, stimSet, nBack);
  console.log(stimArr);
  accArr = [];

  trialCount = 0;

  // run taskFunc ()= run1Back) after countdown
  taskFunc = run1Back;
  countDown(3);
}

function run1Back(){
  if (trialCount < stimArr.length - 1) {

    if (screenSizeIsOk()){

      if (showFixation) {
        fixationScreen();
      } else {
        stimScreen();
      }

    } else {
      promptScreenSize();
    }

  } else {
    // let passesAccuracy = checkAccuracy(accArr, switchRepeatArr);
    // nBackFeedback(passesAccuracy);

    nBackFeedback(Math.round( accCount / (trialCount + 1) * 100 ));
  }
}
