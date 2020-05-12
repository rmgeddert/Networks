function fractalPreferenceTask(){
  let timerObj, mathProblem, node1, node2;
  let chanceOfMathProblem = 0.9;
  let image1 = document.getElementById("FP_image1");
  let image2 = document.getElementById("FP_image2");

  // data logging vars
  sectionType = "mainTask";
  taskName = "fractalPreferenceTask";

  // set up canvas display properties
  frCanvas.style.display = "inline-block";
  if (showNetworkWalk == true) {
    ntCanvas.style.display = "none";
  }

  // show task div and hide instructions
  $('#instructionsDiv').hide();
  $("#fractalPreferenceTask").show();

  // set up submit button for math problem
  $("#mathSubmit1").hide();
  $("#mathSubmit2").show();
  $("#mathSubmit2").click(function(){
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

  // set listener function of image clicks
  $("#FP_image1").click(function(){
    processImageClick(node1);
  })

  $("#FP_image2").click(function(){
    processImageClick(node2);
  })

  // set up task
  let mainTaskArr = [], iterator = 0;
  let nodePairs = [[1,7], [1,8], [2,7], [2,8], [3,9], [4,9], [5,9], [3,10], [4,10], [5,10], [3,11], [4,11], [5,11]];

  // shuffle nodePairs to meet requirements
  for (var i = 0; i < 100; i++) {
    mainTaskArr = shuffleNodeSets();
    console.log($.extend(true,[],mainTaskArr));
  }
  while (mainTaskArr.length == 0){
    mainTaskArr = shuffleNodeSets();
  }
  console.log("Main Task Arr");
  console.log(mainTaskArr);

  // set first trial
  let currentNodeSet = mainTaskArr[iterator];

  // vvvvv START HERE vvvvv
  // --------------------------------
  displayNodePair(currentNodeSet);
  // --------------------------------

  function displayNodePair(nodePair){
    trialType = "fractalOptions";

    // randomly assign nodes to nodes 1 (left) and 2 (right)
    if (Math.random() > 0.5) {
      node1 = getNodeObject(nodePair[0]);
      node2 = getNodeObject(nodePair[1]);
    } else {
      node1 = getNodeObject(nodePair[1]);
      node2 = getNodeObject(nodePair[0]);
    }

    // log which nodes were displayed
    stimOnset = new Date().getTime() - runStart;
    data.push([sectionType, NaN, taskName, trialType, trialCount, blockTrialCount, block, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, stimOnset, NaN, NaN, NaN, NaN, NaN, node1.name, node1.community, node1.associatedWithTask, node2.name, node2.community, node2.associatedWithTask, NaN, NaN]);
    console.log(data);

    // display images
    image1.src = node1.img.src;
    image2.src = node2.img.src;
  }

  function processImageClick(selectedNode){
    // log data
    respOnset = new Date().getTime() - runStart;
    respTime = respOnset - stimOnset;
    trialType = "fractalChoice";
    data.push([sectionType, NaN, taskName, trialType, trialCount, blockTrialCount, block, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, stimOnset, respOnset, respTime, NaN, NaN, NaN, node1.name, node1.community, node1.associatedWithTask, node2.name, node2.community, node2.associatedWithTask, selectedNode.name, selectedNode.community]);
    console.log(data);

    // display trial for selection
    displayChoice(selectedNode);
  }

  function displayChoice(node){
    trialType = "nodePreference";

    // change appearance
    $("#fractalPreferenceTask").hide();
    $(".canvasas").show();

    // set active node
    activeNode = node;

    // clear canvas
    frCtx.clearRect(0, 0, frCanvas.width, frCanvas.height);

    // display fractal
    frCtx.drawImage(node.img,frCanvas.width/2 - node.img.width/2,frCanvas.height/2-node.img.height/2);

    // display single image here
    if (node.associatedWithTask) {
      setTimeout(showMathProblem, 1500);
    } else {
      setTimeout(proceedToNextTrial, 1500);
    }
  }

  function proceedToNextTrial(){
    if (iterator < mainTaskArr.length - 1) {
      // change display settings
      $("#fractalPreferenceTask").show();
      $(".canvasas").hide();

      // proceed to next trial
      trialCount++; blockTrialCount++; iterator++;
      respTime = NaN, partResp = NaN, respOnset = NaN, acc = 0;
      currentNodeSet = mainTaskArr[iterator];

      displayNodePair(currentNodeSet);
    } else {
      // end of task
      // navigateInstructionPath();
      endOfExperiment();
    }
  }

  function showMathProblem(){
    // clear any old response
    $("#mathInput").val("");

    // start timer
    stimOnset = new Date().getTime() - runStart;

    // set math problem
    mathProblem = mathDict[activeNode.community].shift(); //remove 1st element
    txt = mathProblem[0];

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
      proceedToNextTrial();
    }
  }

  function processResponse(){
    // set variables for data logger
    respOnset = new Date().getTime() - runStart;
    respTime = respOnset - stimOnset;
    trialType = "mathProblem";
    acc = (partResp == mathProblem[1]) ? 1 : 0;

    // log data
    data.push([sectionType, NaN, taskName, trialType, trialCount, blockTrialCount, block, activeNode.index, activeNode.communityNumber, activeNode.community, activeNode.associatedWithTask, fileOnly(activeNode.img.src), NaN, partResp, acc, NaN, NaN, mathProblem[0], mathProblem[1], stimOnset, respOnset, respTime, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
    console.log(data);

    proceedToNextTrial();
  }

  function shuffleNodeSets(){
    // shuffling function for fractal preference taskArr
    let newArr = [];
    let baseArr = shuffle($.extend(true,[],nodePairs))

    // subset of nodePairs that are paired
    let pairedNodeSets = baseArr.filter(np => np.some(node => ![1,2,7,8].includes(node)));
    // console.log($.extend(true,[],pairedNodeSets));

    // --- TRIAL 1 --- //
    let nextNodeSet = _.sample(pairedNodeSets,1)[0];
    // console.log("Chosen:");
    // console.log($.extend(true,[],nextNodeSet));
    newArr.push(nextNodeSet);
    // console.log($.extend(true,[],newArr));
    baseArr.splice(baseArr.indexOf(nextNodeSet),1);
    pairedNodeSets.splice(pairedNodeSets.indexOf(nextNodeSet),1);
    // console.log("baseArr after splice");
    // console.log($.extend(true,[],baseArr));

    // --- TRIAL 2 --- //
    nextPairedSet = pairedNodeSets.filter(pns => !pns.some(node => newArr[newArr.length-1].includes(node)));
    // console.log("Next set of paired:");
    // console.log($.extend(true,[],nextPairedSet));
    nextNodeSet = _.sample(nextPairedSet,1)[0];
    // console.log("Chosen:");
    // console.log($.extend(true,[],nextNodeSet));
    newArr.push(nextNodeSet);
    baseArr.splice(baseArr.indexOf(nextNodeSet),1)
    // console.log("baseArr after two splices");
    // console.log($.extend(true,[],baseArr));

    // repeat but this time with baseArr instead
    while (baseArr.length > 0) {
      nextNodeSet = getNextNodeSet();
      if (nextNodeSet.length != 0) {
        newArr.push(nextNodeSet);
      } else {
        return [];
      }
    }

    // if loop succeeds, return new arr
    return newArr;

    function getNextNodeSet(){
      let lastNodeSet = newArr[newArr.length - 1];
      // filter array to nodes that don't repeat previous nodeset
      let filteredArr = baseArr.filter(np => !np.some(node => lastNodeSet.includes(node)));

      if (filteredArr.length == 0) {

        return [];

      } else {

        // randomly sample next node from filteredArr
        let nextNodeSet = _.sample(filteredArr,1)[0];

        // splice nextNodeSet and return value
        return baseArr.splice(baseArr.indexOf(nextNodeSet),1)[0];
      }
    }
  }

  function getNodeObject(nodeNumber){
    for (let i = 0; i < taskNetwork.nodes.length; i++) {
      if (taskNetwork.nodes[i].name == "Node" + nodeNumber) {
        return taskNetwork.nodes[i];
      }
    }
  }
}

// OLD SHUFFLING CODE - TOO INEFFICIENT
//
// do {
//   shuffle(nodePairs);
// } while (!taskOrderisOk(nodePairs));
// console.log(nodePairs);
//
// function taskOrderisOk(arr){
//   console.log("Running Algorithm");
//   let prevNodePair = [];
//   let prevIsUnpairedSet = false;
//   for (let i = 0; i < arr.length; i++) {
//     let nodePair = arr[i];
//     // console.log(i + ": " + nodePair);
//     if (nodePair.some(node => prevNodePair.includes(node))) {
//       // console.log("Node Repeat");
//       // if any nodes repeat from one trial to next
//       return false;
//     } else if (nodePair.some(node => [1,2,7,8].includes(node))) {
//       // if is unpaired node set (nodes 1, 2, 7 or 8)
//       if (prevIsUnpairedSet || [0,1].includes(i)) {
//         // console.log("Unpaired repeat on first/second trial");
//         // and previous trial was as well, or if it's the first or second trial
//         return false;
//       }
//       prevIsUnpairedSet = true;
//     } else {
//       prevIsUnpairedSet = false;
//     }
//     prevNodePair = nodePair;
//   }
//
//   return true;
// }
