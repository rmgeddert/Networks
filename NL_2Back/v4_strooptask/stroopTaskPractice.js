function stroopTaskPractice(){

}

$(document).ready(function(){
  createStroopArray();
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  ctx.textbaseline = "middle";
  ctx.textAlign = "center";
  console.log(canvas);
  console.log(ctx);
  console.log(ctx.textBaseline);
  console.log(ctx.textAlign);
  showInstructions();
  $("body").keypress(function(event){
      console.log(event.which);
      responseKey = event.which;
      if (instructionsScreen == true){
        if (event.which == 32) {
          taskFlow();
        }
      }
      else {
        if (stimulusColor == "red"){
          if (event.which == 90){

          }
          else {

          }
        }
        if (stimulusColor == "green"){
          if (event.which == 88){
            accuracy = 1
          }
          else {
            accuracy = 0
          }

        }
        if (stimulusColor == "blue"){
          if (event.which == 78){
            accuracy = 1
          }
          else {
            accuracy = 0
          }

        }
        if (stimulusColor == "orange"){
          if (event.which == 77){
            accuracy = 1
          }
          else {
            accuracy = 0
          }

        }

      }
  }
}


function stroopTaskFlow(){
  if (trialCount <= 16){
    stroopTrial();
  }
  else {
    navigateInstructionPath();
  }
}

function stroopTrial(){
  responseExpected = true;
  instructionsScreen = false;
  accuracy = NaN;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "60px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(stroopArray[trialCount],  canvas.width/2, canvas.height/2);
  stimOnset = new Date().getTime();
  respOnset = new Date().getTime();
  setTimeout(stroopFeedback, stroopITI);
}

function stroopFeedback(){
  responseExpected = false;
  instructionsScreen = false;
  ctx.clearRect(0, 0, canvas.width, canvas. height);
  ctx.font = "60px Arial";
  if (accuracy == 1){
    ctx.fillStyle = "green";
    ctx.fillText("Correct", canvas.width/2, canvas.height/2);
  }
  else if (accuracy == 0){
    ctx.fillStyle = "red";
    ctx.fillText("Incorrect", canvas.width/2, canvas.height/2);
  }
  else {
    ctx.fillStyle = "black";
    ctx.fillText("Too slow!"), canvas.width/2, canvas.height/2);
  }
  setTimeout (stroopITI, 1000);

function stroopITI(){
  instructionsScreen = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText("", canvas.width/2, canvas.height/2);
  reactionTime = (respOnset - stimOnset);
  data.push([trialCount, stimulusArray[trialCount], responseKey, accuracy, reactionTime]);
  console.log(data);
  setTimeout(stroopTaskFlow, 500);
}

function createStroopArray(){
  let stimulusSet = ["red", "green", "blue", "orange"]
    let nCongruentTrials = Math.ceil(nTrials/2)
    let nIncongruentTrials = nTrials - nCongruentTrials
    let congruencyArr = shuffle(new Array(nCongruentTrials).fill("c").concat(new Array(nIncongruentTrials).fill("i")))

    let stroopArray = []
    for (var i = 0; i < congruencyArr.length; i++) {
      stimulus = _.sample(stimulusSet)
      if (congruencyArr[i] == "c") {
        stimulusColor = stimulus;
        } else { // "i"
          stimulusColor = _.sample(stimulusSet.filter(color => color != stimulus))
        }
        stroopArray.push([stimulus, stimulusColor])
      }
      return stroopArray;
    }
}
