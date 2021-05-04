function twoBackFractalPractice(){
  // console.log("2-Back Fractal Practice task");

  // declare and set task variables
  sectionType = "pracTask";
  taskName = "2-Back_Fractal";
  earlyReleaseExperiment = false;
  playSoundsExperiment = true;

  // hide instructions, show canvas
  $('#instructionsDiv').hide();
  canvas.style.display = "inline-block";
  $(".canvasas").show();

  // set up vowel sequence
  nBack = 2;
  switchRepeatArr = getSwitchRepeatArr(nPracticeTrials, percRepeats, nBack);
  // console.log(switchRepeatArr);
  stimArr = getFractalArr(switchRepeatArr, fractalsNeeded, nBack);
  // console.log(stimArr);
  accArr = [];
  accCount = 0;

  // stimArr.forEach((f) => {console.log(f.outerHTML);});

  // run taskFunc ()= run2BackFractal) after countdown
  taskFunc = run2BackFractal;
  countDown(3);
}

function run2BackFractal(){
  if (trialCount < nPracticeTrials) {

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

    nBackFeedback(Math.round( accCount / (trialCount - 1 - nBack) * 100 ));

  }
}

function getFractalArr(swRpArr, nFractalsToUse, nBack){
  // initalize task arr
  let stimArr = [];

  // get fractals to use
  let fractalSet = selectedImages.slice(0,nFractalsToUse);

  // fill task array with stimuli
  for (var i = 0; i < swRpArr.length; i++) {
    if (i < nBack) {
      if (i != 0) {
        fractal = _.sample(fractalSet.filter(l => l != stimArr[i - 1]))
      } else {
        fractal = _.sample(fractalSet);
      }
    } else if (swRpArr[i] == "r") {
      fractal = stimArr[i - nBack];
    } else {
      fractal = _.sample(fractalSet.filter(l => l != stimArr[i - nBack] && l != stimArr[i - 1]));
    }
    stimArr.push(fractal);
  }
  return stimArr;
}
