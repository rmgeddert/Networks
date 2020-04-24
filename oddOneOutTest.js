function oddOneOutTest() {
  // holds task node sets
  let taskNodeSets = [];

  // fill taskNodesSets
  createNodeSetArr();

  // run algorithm to set up main task array
  // prevents repeat of nodes from one trial to next
  let mainTaskArr;
  let algorithmIterationCap = 10000;
  for (let i = 1; i < algorithmIterationCap; i++) {
    mainTaskArr = shuffleNodeSets();
    if (mainTaskArr.length != 0) {
      break;
    }
  }

  // set section type
  sectionType = "mainTask";
  taskName = "oddOneOutTest";

  // show task div and hide instructions
  $('#instructionsDiv').hide();
  $("#oddOneOutTaskDiv").show();

  // set up task vars
  let nodeSetIterator = 0;
  let currentNodeSet = mainTaskArr[nodeSetIterator];
  let nodeSetDisplayStart;
  let pressedSameButtonCounter = 0, prevResponse;
  let earlyButtonPressCounter = 0, spamEvent = false; spamEventCounter = 0;

  // set up DOM elements variables
  let image1 = document.getElementById("OO_image1");
  let image2 = document.getElementById("OO_image2");
  let image3 = document.getElementById("OO_image3");

  // set listener function of image clicks
  $("#OO_image1").click(function(){
    processImageClick(0);
  })

  $("#OO_image2").click(function(){
    processImageClick(1);
  })

  $("#OO_image3").click(function(){
    processImageClick(2);
  })

  // start by displaying first node set
  displayNodeSet(currentNodeSet);

  // FUNCTIONS:
  function processImageClick(index){
    respOnset = new Date().getTime() - runStart;
    if (respOnset - stimOnset < 500) {

      // earlyButtonPressCounter++;
      // if (earlyButtonPressCounter >= 2 && spamEvent == false) {
      //   spamEvent = true;
      //   spamEventCounter++;
      //   console.log("spamEvent");
      // }
      // if (spamEventCounter >= 3) { //three consecutive spamming events
      //   console.log("stop spamming button presses");
      //   // prompt stop spamming
      // }

    } else {
      // if (spamEvent == false) {
      //   spamEventCounter = 0;
      // }
      // // reset spam counters
      // spamEvent = false;
      // earlyButtonPressCounter = 0;
      // if (index == prevResponse) {
      //   pressedSameButtonCounter++;
      // } else {
      //   pressedSameButtonCounter = 0;
      // }
      // if (pressedSameButtonCounter >= 10) {
      //
      //   console.log("Stop pressing the same button over and over");
      //   // prompt stop pressing same response over and over
      // } else {
        acc = (currentNodeSet.indexer[index] == 1) ? 1 : 0;
        respOnset = new Date().getTime() - runStart;
        respTime = respOnset - stimOnset;

        // log data
        // data.push([sectionType, NaN, taskName, trialCount, blockTrialCount, block, NaN, NaN, NaN, acc, stimOnset, respOnset, respTime, NaN, NaN, NaN]);
        data.push([sectionType, NaN, taskName, NaN, NaN, NaN, NaN, NaN, NaN, NaN, acc, NaN, respOnset, respTime, NaN, NaN, NaN]);
        console.log(data);

        if (nodeSetIterator < mainTaskArr.length - 1) {
          prevResponse = index;
          nodeSetIterator++;
          currentNodeSet = mainTaskArr[nodeSetIterator];
          displayNodeSet(currentNodeSet);
        } else {
          // end of experiment, proceed to next instructions
          $("#oddOneOutTaskDiv").hide();
          // navigateInstructionPath();
          endOfExperiment();
        }
      // }
    }
  }

  function displayNodeSet(nodeSet){
    stimOnset = new Date().getTime() - runStart;

    // display images in node set
    image1.src = nodeSet.nodes[0].img.src;
    image2.src = nodeSet.nodes[1].img.src;
    image3.src = nodeSet.nodes[2].img.src;
  }

  function shuffleNodeSets(){
    // shuffle node sets so there are no repeats in images
    let newArr = [];
    let baseArr = shuffle($.extend(true,[],taskNodeSets)); //copy taskNodeSets into new variable (shuffled)

    // randomly splice from baseArr into newArr to start algorithm
    newArr.push(baseArr.splice(Math.floor(Math.random()*baseArr.length),1)[0]);

    // build array one nodeset at a time
    while (baseArr.length > 0) {
      let nextNode = getNextNodeSet();
      if (nextNode.length != 0) {
        newArr.push(nextNode);
      } else {
        // failure mode, return nothing
        return [];
      }
    }

    // if while loop succeeds, return newArr
    return newArr;

    function getNextNodeSet(){
      // identify last node set in newArr
      let lastNodeSet = newArr[newArr.length - 1];

      // filter baseArr to include only nodesets that don't have the same target node as lastNodeSet
      let filteredArr = baseArr.filter(checkNodeSet);

      function checkNodeSet(nodeSet){
        // // filter to those nodesets that don't include the previous target node
        // let targetNode = lastNodeSet.nodes[lastNodeSet.indexer.indexOf(1)];
        // return !nodeSet.nodes.includes(targetNode);

        //filter out all nodeSets that share nodes with previous nodeset
        return !nodeSet.nodes.some(n => lastNodeSet.nodes.includes(n));
      }

      if (filteredArr.length == 0) {

        // console.log("Oops, no values left in filteredArr");
        // console.log("lastNodeSet: ", lastNodeSet);
        // console.log("baseArr: ", baseArr);
        return [];

      } else {

        // randomly sample next node from filteredArr
        let nextNodeSet = _.sample(filteredArr,1)[0];

        // splice nextNodeSet and return value
        return baseArr.splice(baseArr.indexOf(nextNodeSet),1)[0];
      }
    }
  }

  function iterationTesting(){
    // for testing algorithmic efficiency
    // logs how many iterations algorithm takes to find solution
    let nTests = 1000;
    let algorithmicCap = 1000; //after testing 100,000 iterations of algorithm, max was 148 attempts to find solution
    let iterations = {
      "No Solution (500 attempts)": 0
    };
    for (var j = 1; j < nTests; j++) {
      let iterationCount = getIterationCount();
      if (iterationCount in iterations) {
        iterations[iterationCount]++;
      } else {
        iterations[iterationCount] = 1;
      }
    }
    console.log(iterations);

    function getIterationCount(){
      let taskArr;
      for (var i = 1; i < algorithmicCap; i++) {
        taskArr = shuffleNodeSets();
        if (taskArr.length != 0) {
          return i;
        }
      }
      return `No Solution (${algorithmicCap} attempts)`;
    }
  }

  function createNodeSetArr(){
    // create node sets for task
    taskNetwork.nodes.forEach((node) => {
      if (node.name != "Node6") { //dont consider center node
        let nodeSetsBatch = [];
        for (let i = 0; i < 3; i++) { //do three times
          // object for node set
          let newNodeSet = {
            nodes: [],
            indexer: []
          }

          // select two random neighbors from other community
          let oppCommName = (node.community == "easy") ? "difficult" : "easy";
          let oppCommNodes = taskNetwork.communityNodes(oppCommName);

          let oppCommSelection;
          do {
            oppCommSelection = _.sample(oppCommNodes,2);
          } while (repeatedNodeSelection()); //check nodeSetsBatch

          function repeatedNodeSelection(){
            return (nodeSetsBatch.length == 0) ? false : nodeSetsBatch.some(ns => oppCommSelection.every(n => ns.nodes.includes(n)));
          }

          // create nodeSet node array and indexer (which one is odd one)
          let nodeSetArr = oppCommSelection;
          nodeSetArr.splice(i, 0, node);
          let oddOneIndexer = [0,0];
          oddOneIndexer.splice(i, 0, 1);

          // update newNodeSet
          newNodeSet.nodes = nodeSetArr;
          newNodeSet.indexer = oddOneIndexer;

          // push newNodeSet into nodeSetsArr
          nodeSetsBatch.push(newNodeSet);
        }

        // add node set to task set
        taskNodeSets = taskNodeSets.concat(nodeSetsBatch);
      }
    });
  }
}
