function twoBackFacePractice(){
  // console.log("2-Back Face Practice task");

  // declare and set task variables
  sectionType = "pracTask";
  taskName = "2-Back_Face";
  earlyReleaseExperiment = false;
  playSoundsExperiment = true;

  // hide instructions, show canvas
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  canvas.style.display = "inline-block";
  $(".canvasas").show();

  // set up vowel sequence
  nBack = 2;
  switchRepeatArr = getSwitchRepeatArr(nPracticeTrials, percRepeats, nBack);
  // console.log(switchRepeatArr);
  stimArr = getFaceArr(switchRepeatArr, facesNeeded, nBack);
  // console.log(stimArr);
  accArr = [];
  accCount = 0;

  // stimArr.forEach((f) => {console.log(f.outerHTML);});

  // run taskFunc ()= run2BackFace) after countdown
  taskFunc = run2BackFace;
  countDown(3);
}

function run2BackFace(){
  if (trialCount <= nPracticeTrials) {

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

function getFaceArr(swRpArr, nFacesToUse, nBack){
  // initalize task arr
  let stimArr = [];

  // get faces to use
  let facesSet = selectedImages.slice(0,nFacesToUse);

  // fill task array with stimuli
  for (var i = 0; i < swRpArr.length; i++) {
    if (i < nBack) {
      if (i != 0) {
        face = _.sample(facesSet.filter(l => l != stimArr[i - 1]))
      } else {
        face = _.sample(facesSet);
      }
    } else if (swRpArr[i] == "r") {
      face = stimArr[i - nBack];
    } else {
      face = _.sample(facesSet.filter(l => l != stimArr[i - nBack] && l != stimArr[i - 1]));
    }
    stimArr.push(face);
  }
  return stimArr;
}
