let stroopColors = ["red", "green", "blue", "orange"];
let congruentStim = [], incongruentStim = [];

//build congruent and incongruent arrays
stroopColors.forEach(color => {
  //congruent
  congruentStim.push([color, color, "c", getResponseKeys(color)]);

  //incongruent
  let offColors = stroopColors.filter(c => c != color);
  offColors.forEach(offColor => {
   incongruentStim.push([color, offColor, "i", getResponseKeys(offColor)]);
  })
});

function fixationScreen(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 60px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("+",canvas.width/2,canvas.height/2);
}

function getResponseKeys(color){
  switch (color) {
    case "red":
      return [122, 90];
    case "green":
      return [120, 88];
    case "blue":
      return [110, 78];
    case "orange":
      return [109, 77];
  }
}

function createStroopArray(nTrials){
  //trial counts
  let nCongruentTrials = Math.ceil(nTrials/2);
  let nIncongruentTrials = nTrials - nCongruentTrials;

  //create array of 'c's and 'i's, shuffled
  let congruencyArr = shuffle(new Array(nCongruentTrials).fill("c").concat(new Array(nIncongruentTrials).fill("i")));

  //create array of stimuli for each trial, based on if trial is a 'c' or 'i' trial
  let stroopArray = [];
  for (var i = 0; i < congruencyArr.length; i++){
    if(congruencyArr[i] == "c"){
      stroopArray.push(_.sample(congruentStim));
    }
    else {//"i"
      stroopArray.push(_.sample(incongruentStim));
    }
  }
  return stroopArray;
}

function createCongruentsArr(nTrials){
  // build stroop array of congruent trials
  let prevColor = "", stimArray = [], stimulus;
  for (var i = 0; i < nTrials; i++) {
    stimulus = _.sample(congruentStim);
    stimArray.push(stimulus);
    prevColor = stimulus[0];
  }
  return stimArray;
}

function createIncongruentsArr(nTrials){
  // build stroop array of congruent trials
  let prevStim = [], stimArray = [], stimulus;
  for (var i = 0; i < nTrials; i++) {
    stimulus = _.sample(incongruentStim);
    stimArray.push(stimulus);
    prevStim = stimulus;
  }
  return stimArray;
}
