function oddOneOutTest() {
  // holds task node sets
  let taskNodeSets = [];

  // fill taskNodesSets
  // let newNodeSetArr = createNodeSetArr();
  let mainTaskArr = shuffle(createNodeSetArr());
  console.log(mainTaskArr);

  function createNodeSetArr(){
    let nodeSetArr = [];

    // loop through each node in network
    taskNetwork.nodes.forEach(node => {
      if (![4,5,6,7].includes(node.index)) { //excluding boundary nodes
        let nodeSet = [];
        nodeSet.push([node, 1]);

        // select two nodes from opposite community
        let oppCommName = (node.community == "easy") ? "difficult" : "easy";
        let oppCommNodes = taskNetwork.communityNodes(oppCommName);
        let nonBoundaryNodes = oppCommNodes.filter(n => ![4,5,6,7].includes(n.index)); //filter out boundary nodes
        oppCommSelection = _.sample(nonBoundaryNodes,2);
        oppCommSelection.forEach(node => nodeSet.push([node,0]));
        // get every possible permutation of stimuli positions/orders and add to main task array
        permutator(nodeSet).forEach(permutation => nodeSetArr.push(shuffle(permutation)));
      }
    });

    return nodeSetArr;
  }

  // set section type
  sectionType = "mainTask";
  taskName = "oddOneOutTest";

  // show task div and hide instructions
  $('#instructionsDiv').hide();
  $("#oddOneOutTaskDiv").show();

  // set up task vars
  let nodeSetIterator = 0;
  let nodeSetDisplayStart;
  let pressedSameButtonCounter = 0, prevResponse;
  let earlyButtonPressCounter = 0, spamEvent = false; spamEventCounter = 0;

  // set up DOM elements variables
  let image1 = document.getElementById("OO_image1");
  let image2 = document.getElementById("OO_image2");
  let image3 = document.getElementById("OO_image3");

  // set listener function of image clicks
  $("#OO_image1").click(function(){
    processImageClick(1);
  })

  $("#OO_image2").click(function(){
    processImageClick(2);
  })

  $("#OO_image3").click(function(){
    processImageClick(3);
  })

  // initialize currentNodeSet
  let currentNodeSet = mainTaskArr[nodeSetIterator];

  // start by displaying first node set
  displayNodeSet(currentNodeSet);

  // FUNCTIONS:
  function processImageClick(imageNum){
    respOnset = new Date().getTime() - runStart;
    if (respOnset - stimOnset > 500) {
      acc = (currentNodeSet[imageNum - 1][1] == 1) ? 1 : 0;
      partResp = imageNum;
      respOnset = new Date().getTime() - runStart;
      respTime = respOnset - stimOnset;

      // log data
      data.push([sectionType, NaN, taskName, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, partResp, acc, imageNum, currentNodeSet[imageNum - 1][1], NaN, NaN, stimOnset, respOnset, respTime, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
      console.log(data);

      if (nodeSetIterator < mainTaskArr.length - 1) {
        prevResponse = imageNum;
        nodeSetIterator++;
        currentNodeSet = mainTaskArr[nodeSetIterator];
        displayNodeSet(currentNodeSet);
      } else {
        // end of experiment, proceed to next instructions
        $("#oddOneOutTaskDiv").hide();
        // navigateInstructionPath();
        endOfExperiment();
      }
    }
  }

  function displayNodeSet(nodeSet){
    stimOnset = new Date().getTime() - runStart;

    // display images in node set
    image1.src = nodeSet[0][0].img.src;
    image2.src = nodeSet[1][0].img.src;
    image3.src = nodeSet[2][0].img.src;
  }
}
