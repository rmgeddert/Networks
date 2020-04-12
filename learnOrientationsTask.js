function learnOrientationsTask(){
  // declare and set task variables
  sectionType = "pracTask";
  taskName = "learnOrientationsTask";
  let nCorrectResponsesNeeded = 4;
  let mistakeAlreadyMade = false;
  let correctImageDOM = document.getElementById("correctImage");
  let rotatedImageDOM = document.getElementById("rotatedImage");

  // show task div and hide instructions
  $('#instructionsDiv').hide();
  $("#orientationPracticeDiv").show();

  // set up queue for fractals
  pictureQueue = new Array(nCorrectResponsesNeeded).fill(selectedImages).flat();

  // set up click event listener for  correct image
  $("#correctImage").click(function(){
    respOnset = new Date().getTime() - runStart;
    respTime = respOnset - stimOnset;
    if (respTime > 500) {
      // update data logger
      acc = (mistakeAlreadyMade) ? 0 : 1;
      data.push([sectionType, NaN, taskName, trialCount, blockTrialCount, block, NaN, NaN, NaN, acc, stimOnset, respOnset, respTime, NaN, NaN, NaN]);
      console.log(data);

      //remove item from queue once correct is clicked
      pictureQueue.shift()

      if (pictureQueue.length > 0) {
        // prepare for next trial
        trialCount++; blockTrialCount++;
        mistakeAlreadyMade = false;
        $("#OP_task_feedback").css("visibility", "hidden");

        // display next
        displayFractals();
      } else {
        $("#orientationPracticeDiv").hide();
        navigateInstructionPath(); //proceed to next instructions
      }
    }
  })

  // set up click event listener for rotated image
  $("#rotatedImage").click(function(){
    respOnset = new Date().getTime() - runStart;
    respTime = respOnset - stimOnset;
    if (respTime > 500 && !mistakeAlreadyMade) {
      mistakeAlreadyMade = true;

      // add item back at end of queue if incorrect response is given
      pictureQueue.push(pictureQueue[0]);

      // show feedback for incorrect response
      $("#OP_task_feedback").css("visibility", "visible");
    }
  })

  // call function to start
  displayFractals();

  function displayFractals(){
    stimOnset = new Date().getTime() - runStart;

    // shuffle images left vs right using fisher-yates
    //(https://stackoverflow.com/questions/7070054/javascript-shuffle-html-list-element-order)
    let taskDiv = document.querySelector('#OP_images');
    for (let i = taskDiv.children.length; i >= 0; i--) {
      taskDiv.appendChild(taskDiv.children[Math.random() * i | 0]);
    }

    // rotate image to left or to right
    rotatedImageDOM.style.transform = "rotate(90deg)"; //rotate image

    // assign src's to images
    correctImageDOM.src = pictureQueue[0].src; //set src
    rotatedImageDOM.src = pictureQueue[0].src; //set src
  }
}
