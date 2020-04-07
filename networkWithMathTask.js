function networkWithMathTask() {
  console.log("I ran");
  let timerObj;

  // hide instructions
  $('#instructionsDiv').hide();

  // show canvasas
  frCanvas.style.display = "inline-block";
  if (showNetworkWalk == true) {ntCanvas.style.display = "inline-block";}
  $(".canvasas").show();

  // set up first active node
  activeNode = _.sample(taskNetwork.nodes,1)[0];
  activeNode.activate();

  // set taskFunc so countdown goes to right task
  taskFunc = taskFlow;

  // set up submit button for math problem
  $("#mathSubmit").click(function(){
    let resp = document.getElementById("mathInput").value;
    if (resp === "") { //no resp
      window.alert("Please enter your answer.")
    } else {
      let respIsOK = /^\d+(\.\d+)?$/.test(resp); //checks for integer with or without decimal
      if (respIsOK) {
        $("#mathTask").hide();
        clearTimeout(timerObj);
        processResponse(resp);
      } else {
        window.alert("Invalid response. Answer must be a number in the form '###' or '###.###'. Letters [A-Z] and special charachters [!@#$%^&*()] are not allowed.")
      }
    }
  });

  // start task after countdown
  countDown(1);

  function taskFlow(){
    // need to add block breaks in here still
    if (trialCount < nTrials) {

      runTrial();

    } else {
      // end of experiment code
      taskNetwork.nodes.forEach((node) => {console.log(node.name, node.visitCount)})
      navigateInstructionPath();
    }
  }

  function runTrial(){

    // display network and fractal
    if (showNetworkWalk == true) {drawNetwork();}
    displayFractal();
    console.log("----",activeNode.name,"----");
    console.log("Associated with task: ",activeNode.associatedWithTask);
    let rand = Math.random();
    if (activeNode.associatedWithTask) {
      console.log(`Math.random() = ${rand}`);
      console.log("Greater than cutoff 0.1 = ",rand>0.1);
    }

    if (testMode) {

      setTimeout(transitionToNextNode, 50);

    } else {
      if (activeNode.associatedWithTask == true & rand > 0.1) {

          console.log("Displaying math problem...");
          console.log(activeNode.community);
          // show math problem after 1000 ms
          setTimeout(showMathProblem, 500);

      } else {

        console.log("Moving to next....");
        // go to next trial after delay
        setTimeout(transitionToNextNode, 1000);

      }
    }
  }

  function showMathProblem(){

    // clear old response
    $("#mathInput").val("");

    // show problem based on difficulty
    let txt = (activeNode.community == "easy") ? "2+2" : "12 x 7";

    // draw white background to make text easier to ready
    frCtx.fillStyle = "white";
    frCtx.globalAlpha = 0.9;
    let mt = frCtx.measureText(txt);
    frCtx.fillRect(frCanvas.width/2 - mt.width/2 - 10,
      frCanvas.height/2 - 55, mt.width + 20, 80);
    frCtx.globalAlpha = 1.0;

    // draw math problem
    frCtx.textAlign = "center";
    frCtx.fillStyle = "red";
    frCtx.font = "bold 50px Arial";
    frCtx.fillText(txt, frCanvas.width/2,frCanvas.height/2 + 5)

    // display response input box
    $("#mathTask").show();

    // start timer for problem
    countDownTimer(10);
  }

  function countDownTimer(seconds){
    if (seconds >= 0){
      // display timer
      let timerBase = (seconds < 10) ? "0:0" : "0:"
      $("#timer").text(timerBase + seconds);

      // change timer color
      let timerColor = (seconds < 6) ? 'red' : 'black';
      $("#timer").css('color', timerColor)

      // proceed to next iteration
      timerObj = setTimeout(function(){countDownTimer(seconds - 1)},1000);

    } else {

      $("#mathTask").hide();
      transitionToNextNode();

    }
  }

  function processResponse(value){
    transitionToNextNode();
  }

  function displayFractal(){

    // clear canvas
    frCtx.clearRect(0, 0, frCanvas.width, frCanvas.height);

    // display fractal
    frCtx.drawImage(activeNode.img,frCanvas.width/2 - activeNode.img.width/2,frCanvas.height/2-activeNode.img.height/2);

  }

  function transitionToNextNode(){
    // reset drawing info for old node
    activeNode.reset();

    // sample a random new neighbor to become new active node
    activeNode = _.sample(activeNode.neighbors,1)[0];

    //set graph drawing info for new active node
    activeNode.activate();

    // iterate trial count
    trialCount++;

    // return to taskFlow func
    taskFlow();
  }

  function drawNetwork(){
    // clear canvas
    ntCtx.clearRect(0, 0, ntCanvas.width, ntCanvas.height);

    // draw edges
    taskNetwork.nodes.forEach((node) => {
      node.neighbors.forEach((neighbor) => {
        ntCtx.beginPath();
        ntCtx.moveTo(node.coord.x,node.coord.y);
        ntCtx.lineTo(neighbor.coord.x,neighbor.coord.y);
        ntCtx.stroke();
      });
    });

    // draw nodes
    taskNetwork.nodes.forEach((node) => {
      ntCtx.fillStyle = node.color;
      ntCtx.beginPath();
      ntCtx.arc(node.coord.x,node.coord.y,node.rad,0,2*Math.PI);
      ntCtx.fill();
    });
  }

}
