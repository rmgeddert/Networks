function learnNetworkTaskPractice(){
  // declare and set task variables
  sectionType = "pracTask";
  taskName = "learnNetworkTaskPractice";
  let imageIterator = 0, proportionBlurry = 0.3;
  accCount = 0;

  // hide instructions, show canvas
  $('#instructionsDiv').hide();
  frCanvas.style.display = "inline-block";
  $(".canvasas").show();

  // set taskFunc so countdown goes to right task
  taskFunc = taskFlow;

  // shuffle selected images
  let taskImages = shuffle(selectedImages);

  // start task after countdown
  countDown(3);

  function blurryArrIsOK(arr){
    // first trial is not blurry
    if (arr[0] == 1) {return false;}
    // no blurry repeat images
    for (var i = 0; i < arr.length; i++) {
      if ((arr[i] == 1) && (arr[i] == arr[i+1])) {
        return false;
      }
    }
    return true;
  }

  function taskFlow(){
    if (imageIterator < taskImages.length) {
      // reset task vars
      acc = 0;
      imageIsBlurry = (blurryArray[imageIterator] == 1)
      displayFractal();
    } else {
      showTaskFeedback( Math.round((accCount / taskImages.length) * 100));
    }
  }

  function displayFractal(){
    // check if key is being held down going into trial
    if (keyListener == 2 || keyListener == 3) {

      promptLetGo();

    } else {

      // clear canvas
      frCtx.clearRect(0, 0, frCanvas.width, frCanvas.height);

      // set img variable
      let img = taskImages[imageIterator];

      // blur context (or don't, based on % criterion)
      if (imageIsBlurry) {

        frCtx.filter = 'blur(2px)';
        frCtx.drawImage(img,frCanvas.width/2 - img.width/2,frCanvas.height/2-img.height/2);
        frCtx.filter = 'blur(0px)';

      } else {

        // // display fractal
        frCtx.drawImage(img,frCanvas.width/2 - img.width/2,frCanvas.height/2-img.height/2);

      }

      // set up for participant response
      stimOnset = new Date().getTime() - runStart;
      keyListener = 1, respTime = NaN, partResp = NaN, respOnset = NaN, acc = 0;

      // go to next fractal after delay
      setTimeout(transitionFunction, stimInterval);
    }
  }

  function transitionFunction(){
    // log data from previous trial
    data.push([sectionType, NaN, taskName, NaN, trialCount, blockTrialCount, block, NaN, NaN, NaN, NaN, fileOnly(taskImages[imageIterator].src), imageIsBlurry ? 1 : 0, partResp, acc, NaN, NaN, NaN, NaN, stimOnset, respOnset, respTime, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
    console.log(data);

    // check if participant responded in time
    if (keyListener == 1 && speed != "fast") {
      // tooSlowScreen();
      if (playSounds) {mistakeSound.play()}
      // keyListener == 0;
    }
    // } else {
    // reset and proceed to next image
    imageIterator++; trialCount++; blockTrialCount++;
    taskFlow();
  }

  function showTaskFeedback(accuracy){
    sectionStart = new Date().getTime() - runStart;
    sectionType = "pracFeedback";

    // clear frCanvas
    frCtx.clearRect(0, 0, frCanvas.width, frCanvas.height);
    frCtx.fillStyle = "black";
    frCtx.font = "25px Arial";
    setTimeout(function(){keyListener = 6},1000);

    // display feedback
    repeatNecessary = accuracy < practiceAccCutoff;
    if (accuracy < practiceAccCutoff) { //if accuracy is too low

      // display feedback text
      frCtx.fillText("You got " + accuracy + "% correct in this practice block.",frCanvas.width/2,frCanvas.height/2 - 50);
      frCtx.fillText("Remember, you need to get >" + practiceAccCutoff + "%.",frCanvas.width/2,frCanvas.height/2);
      frCtx.fillText("Press any button to go back ",frCanvas.width/2,frCanvas.height/2 + 80);
      frCtx.fillText("to the instructions and try again.",frCanvas.width/2,frCanvas.height/2 + 110);

    } else { //otherwise proceed to next section

      // display feedback text
      frCtx.fillText("You got " + accuracy + "% correct in this practice block.",frCanvas.width/2,frCanvas.height/2 - 50);
      frCtx.fillText("Press any button to go on to the next section.",frCanvas.width/2,frCanvas.height/2 + 100);

    }
  }
}

function tooSlowScreen(){
  keyListener = 4;

  //prepare canvas
  frCtx.clearRect(0, 0, frCanvas.width, frCanvas.height);
  frCtx.textAlign = "center";

  // show warning
  frCtx.fillStyle = "red";
  frCtx.font = "bold 35px Arial";
  frCtx.fillText("Too slow.",frCanvas.width/2,frCanvas.height/2-100);

  frCtx.fillStyle = "black";
  frCtx.font = "30px Arial";
  frCtx.fillText("Try and repond as quickly as possible.",frCanvas.width/2,frCanvas.height/2 - 10);
  frCtx.fillText("Remember, each image only appears", frCanvas.width/2,frCanvas.height/2 + 20);
  frCtx.fillText("for 1.5 seconds before the next.",frCanvas.width/2,frCanvas.height/2 + 50);

  frCtx.font = "bold 30px Arial";
  frCtx.fillText("Press any button to continue.",frCanvas.width/2,frCanvas.height/2 + 140);

}
