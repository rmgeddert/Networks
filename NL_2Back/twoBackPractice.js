function twoBackPractice(){
  console.log("Running 2-Back task...");

  // declare and set task variables
  sectionType = "pracTask";
  taskName = "2-Back Task (Practice)";

  // hide instructions, show canvas
  $('#instructionsDiv').hide();
  canvas.style.display = "inline-block";
  $(".canvasas").show();

  // set up vowel sequence
  nBack = 2, stimSet = ["A","E","O","U","I"];
  switchRepeatArr = getSwitchRepeatArr(nPracticeTrials, percRepeats, nBack);
  console.log(switchRepeatArr);
  stimArr = getStimArr(switchRepeatArr, stimSet, nBack);
  console.log(stimArr);
  accArr = [];

  trialCount = 0;

  // run taskFunc ()= run2Back) after countdown
  taskFunc = run2Back;
  countDown(3);
}

function run2Back(){
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

    nBackFeedback(Math.round( accCount / (trialCount + 1) * 100 ));

  }
}
