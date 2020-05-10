function networkWithMathTask() {
  let timerObj, mathProblem, easyCounter = 0, difficultCounter = 0;
  let chanceOfMathProblem = 0.9;

  // data logging vars
  sectionType = "mainTask";
  taskName = "networkWithMathTask";

  // hide instructions
  $('#instructionsDiv').hide();

  // show canvasas
  frCanvas.style.display = "inline-block";
  if (showNetworkWalk == true) {ntCanvas.style.display = "inline-block";}
  $(".canvasas").show();

  // clear node visitCounts from learn network task
  taskNetwork.nodes.forEach(node => node.visitCount = 0);

  // set up first active node
  activeNode = _.sample(taskNetwork.nodes,1)[0];
  activeNode.activate();

  // set taskFunc so countdown() goes to right task
  taskFunc = taskFlow;

  // set up submit button for math problem
  $("#mathSubmit2").hide();
  $("#mathSubmit1").click(function(){
    console.log("math task submit");
    partResp = document.getElementById("mathInput").value;
    if (partResp == "") { //no resp
      window.alert("Please enter your answer.")
    } else {
      let respIsOK = /^\d+(\.\d+)?$/.test(partResp); //checks for integer with or without decimal
      if (respIsOK) {
        $("#mathTask").hide();
        clearTimeout(timerObj);
        processResponse();
      } else {
        partResp = NaN;
        window.alert("Invalid response. Answer must be a whole number in the form '###'. Letters [A-Z] and special charachters [!@#$%^&*()] are not allowed.")
      }
    }
  });

  // shuffle mathDict
  shuffle(mathDict.easy)
  shuffle(mathDict.difficult)

  // start task after countdown
  countDown(3);

  function taskFlow(){
    if (trialCount < mathTaskTrials) {
      respTime = NaN, partResp = NaN, respOnset = NaN, acc = 0;
      runTrial();
    } else {
      // end of experiment code
      taskNetwork.nodes.forEach((node) => {console.log(node.name, node.visitCount)});
      // clear previous math listener
      $(document).off("click","#mathSubmit");
      navigateInstructionPath();
    }
  }

  function runTrial(){
    // display network and fractal
    if (showNetworkWalk == true) {drawNetwork();}
    displayFractal();
    stimOnset = new Date().getTime() - runStart;

    let rand = Math.random();
    if (testMode) {
      setTimeout(transitionToNextNode, 50);
    } else {
      if (activeNode.associatedWithTask && rand < chanceOfMathProblem) {
        // show math problem after 1000 ms
        setTimeout(showMathProblem, 1500);
      } else {
        setTimeout(noGoTrial, 1500);
      }
    }
  }

  function noGoTrial(){
    // log data
    trialType = "noGoTrial";
    data.push([sectionType, NaN, taskName, trialType, trialCount, blockTrialCount, block, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.associatedWithTask, fileOnly(activeNode.img.src), NaN, partResp, NaN, NaN, NaN, NaN, NaN, stimOnset, respOnset, respTime, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
    console.log(data);

    transitionToNextNode();
  }

  function showMathProblem(){
    // clear old response
    $("#mathInput").val("");

    // start timer
    stimOnset = new Date().getTime() - runStart;

    // select next problem based on difficulty
    mathProblem = mathDict[activeNode.community].shift(); //remove 1st element
    // increment counters that determine end of task
    if (activeNode.community == "easy") {
      easyCounter++;
    } else {
      difficultCounter++;
    }
    let txt = mathProblem[0];

    // draw white background to make text easier to ready
    frCtx.fillStyle = "white";
    frCtx.globalAlpha = 0.9;
    frCtx.fillRect(frCanvas.width/2 - 90,
      frCanvas.height/2 - 40, 180, 70);
    frCtx.globalAlpha = 1.0;

    // draw math problem
    frCtx.textAlign = "center";
    frCtx.fillStyle = "red";
    frCtx.font = "bold 50px Arial";
    frCtx.fillText(txt, frCanvas.width/2,frCanvas.height/2)

    // display response input box
    $("#mathTask").show();

    // start timer for problem
    countDownTimer(20);
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
      // participant didn't respond
      partResp = NaN;
      trialType = "mathProblem";
      data.push([sectionType, NaN, taskName, trialType, trialCount, blockTrialCount, block, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.associatedWithTask, fileOnly(activeNode.img.src), NaN, partResp, acc, NaN, NaN, mathProblem[0], mathProblem[1], stimOnset, respOnset, respTime, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
      console.log(data);

      // procede to next
      $("#mathTask").hide();
      transitionToNextNode();
    }
  }

  function processResponse(){
    // set variables for data logger
    acc = (partResp == mathProblem[1]) ? 1 : 0;
    respOnset = new Date().getTime() - runStart;
    respTime = respOnset - stimOnset;
    trialType = "mathProblem";

    // log data
    data.push([sectionType, NaN, taskName, trialType, trialCount, blockTrialCount, block, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.associatedWithTask, fileOnly(activeNode.img.src), NaN, partResp, acc, NaN, NaN, mathProblem[0], mathProblem[1], stimOnset, respOnset, respTime, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
    console.log(data);

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
    // activeNode = _.sample(activeNode.neighbors,1)[0];
    activeNode = sampleNeighbors(activeNode.neighbors);

    //set graph drawing info for new active node
    activeNode.activate();

    // iterate trial count
    trialCount++;
    blockTrialCount++;

    // return to taskFlow func
    taskFlow();
  }

  function sampleNeighbors(neighborsArr){
    // console.log("neighborsArr: ", neighborsArr);
    // create visit count arr
    let visitCountArr = [];
    for (let i = 0; i < neighborsArr.length; i++) {
      visitCountArr.push(neighborsArr[i].visitCount);
    }
    // console.log("visitCountArr: ", visitCountArr);

    // get unique visit counts
    let uniqueVisitCounts = visitCountArr.filter((v, i, a) => a.indexOf(v) === i);
    uniqueVisitCounts.sort((a,b)=>a-b);
    uniqueVisitCounts.reverse();
    // console.log("uniqueVisitCounts: ", uniqueVisitCounts);

    // assign rankings
    let visitCountRankings = {};
    for (let i = 0; i < uniqueVisitCounts.length; i++) {
      visitCountRankings[uniqueVisitCounts[i]] = i + 1; //0th index (highest value) gets rank 1
    }
    // console.log("visitCountRankings: ", visitCountRankings);

    // assign rankings to nodes based on visitCount
    let nodeRankings = {};
    for (let i = 0; i < neighborsArr.length; i++) {
      let node = neighborsArr[i];
      nodeRankings[node.name] = visitCountRankings[node.visitCount];
    }
    // console.log("nodeRankings: ", nodeRankings);

    // calculate softmax probability for each node
    let sumExp = 0;
    Object.values(nodeRankings).forEach(r => sumExp += Math.exp(r));
    // softmax
    let nodeProbabilities = {};
    Object.keys(nodeRankings).forEach(
      n => nodeProbabilities[n] = Math.exp(nodeRankings[n]) / sumExp
    );
    // console.log("nodeProbabilities: ", nodeProbabilities);

    // now sample from neighbors based on their probability
    let probabilitiesArr = [];
    neighborsArr.forEach(n => probabilitiesArr.push(nodeProbabilities[n.name]))
    return multinomialSample(neighborsArr, probabilitiesArr);
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
