function twoBackImagePractice(){
  // declare and set task variables
  sectionType = "pracTask";
  taskName = "2-Back_Image";
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
  stimArr = getImageArr(switchRepeatArr, networkSize, nBack);
  accArr = [];
  accCount = 0;

  // run taskFunc after countdown
  taskFunc = run2BackImage;
  countDown(3);
}

function run2BackImage(){
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

function getImageArr(swRpArr, nImagesToUse, nBack){
  let stimArr = [], image;

  // get images to use
  let imageSet = selectedImages.slice(0,nImagesToUse);

  // fill task array with stimuli
  for (var i = 0; i < swRpArr.length; i++) {
    if (i < nBack) {
      if (i != 0) {
        image = _.sample(imageSet.filter(l => l != stimArr[i - 1]))
      } else {
        image = _.sample(imageSet);
      }
    } else if (swRpArr[i] == "r") {
      image = stimArr[i - nBack];
    } else {
      image = _.sample(imageSet.filter(l => l != stimArr[i - nBack] && l != stimArr[i - 1]));
    }
    stimArr.push(image);
  }
  return stimArr;
}
