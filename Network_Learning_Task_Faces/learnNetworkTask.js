class Network {
  constructor(){
    this.nodes = [];
    this.nCommunities = 2;
  }

  communityNodes(communityName){
    let nodeArr  = [];
    this.nodes.forEach((node) => {
      if (node.community == communityName) {
        nodeArr.push(node);
      }
    })
    return nodeArr;
  }

  addNode(newNode){
    this.nodes.push(newNode);
  }
}

class Node {
  constructor(i, imageObj) {
    this.name = `Node${i}`;
    this.index = i;
    this.img = imageObj;
    this.neighbors = [];
    this.coord = {x: NaN, y: NaN};
    this.rad = 7;
    this.color = "black";
    this.visitCount = 0;
    this.community = NaN;
    this.communityNumber = NaN;
    this.associatedWithTask = false;
  }

  addNeighbor(newNeighbor) {
    // add node as neighbor if it doesn't already exist
    if (this.neighbors.indexOf(newNeighbor != -1)) {
      this.neighbors.push(newNeighbor);
    }
  }

  activate(){
    activeNode.rad = 15;
    activeNode.color = "red";
    this.visitCount++;
  }

  reset(){
    this.rad = 7;
    this.color = "black";
  }
}

// vvvvvvvvvvvvvv START HERE vvvvvvvvvvvvvv
function learnNetworkTask(){
  sectionType = "mainTask";
  taskName = "learnNetworkTask";

  // declare task vars

  // hide instructions and show canvas
  $('#instructionsDiv').hide();
  frCanvas.style.display = "inline-block";
  if (showNetworkWalk == true) {ntCanvas.style.display = "inline-block";}
  $(".canvasas").show();

  // set up first active node
  activeNode = _.sample(taskNetwork.nodes,1)[0];
  activeNode.activate();

  // set taskFunc so countdown goes to right task
  taskFunc = taskFlow;

  // start task after countdown
  countDown(3);

  function taskFlow(){
    // need to add block breaks in here still
    if (trialCount < nTrials) {
      if (trialCount%(nTrials/numBlocks) == 0 && !breakOn) {
        breakOn = true;
        blockBreak();

      } else {
        breakOn = false;
        runTrial();
      }
    } else {
      // end of experiment code
      // taskNetwork.nodes.forEach((node) => {console.log(node.name, node.visitCount)})
      breakOn = false;
      navigateInstructionPath();
    }
  }

  function runTrial(){
    // check if key is being held down going into trial
    if (keyListener == 2 || keyListener == 3) {

      promptLetGo();

    } else {
      // see if image is rotated
      imageIsRotated = Math.random() < proportionRotated;

      // display network and fractal
      if (showNetworkWalk == true) {drawNetwork();}
      displayFractal();

      // set up for response
      stimOnset = new Date().getTime() - runStart;
      keyListener = 1, respTime = NaN, partResp = NaN, respOnset = NaN, acc = 0;

      // go to next trial after delay
      setTimeout(transitionToNextNode, stimInterval);
    }
  }

  function transitionToNextNode(){
    if (keyListener == 1 && speed != "fast") {
      // tooSlowScreen();
      mistakeSound.play();
      // keyListener == 0;
    }

    // log data from previous trial
    data.push([sectionType, NaN, taskName, NaN, trialCount, blockTrialCount, block, activeNode.index, activeNode.communityNumber, NaN, NaN,  fileOnly(activeNode.img.src), imageIsRotated ? 1 : 0, partResp, acc, NaN, NaN, NaN, NaN, stimOnset, respOnset, respTime, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
    console.log(data);

    // reset old and activate new node
    activeNode.reset();
    activeNode = _.sample(activeNode.neighbors,1)[0];
    activeNode.activate();

    // iterate trial count
    trialCount++; blockTrialCount++;

    // return to taskFlow func
    taskFlow();
  }

  function displayFractal(){
    // clear canvas
    frCtx.clearRect(0, 0, frCanvas.width, frCanvas.height);

    // rotate context (or don't, based on % criterion)
    if (imageIsRotated) {

      frCtx.save();
      frCtx.translate(frCanvas.width/2 + activeNode.img.width/2,frCanvas.height/2-activeNode.img.height/2);
      frCtx.rotate(0.5*Math.PI);
      frCtx.drawImage(activeNode.img,0,0);
      frCtx.restore();

    } else {

      // // display fractal
      frCtx.drawImage(activeNode.img,frCanvas.width/2 - activeNode.img.width/2,frCanvas.height/2-activeNode.img.height/2);

    }
  }

  function blockBreak(){
    sectionType = "blockBreak";
    sectionStart = new Date().getTime() - runStart;
    keyListener = 0; //else keylistener stays = 1 till below runs
    setTimeout(function(){keyListener = 7},2000);

    // display break screen (With timer)
    drawBreakScreen("02","00");
    blockBreakFunction(2,0);

    function blockBreakFunction(minutes, seconds){
      let time = minutes*60 + seconds;
      frCtx.fillStyle = "black";
      sectionTimer = setInterval(function(){
        if (time < 0) {return}
        frCtx.fillStyle = (time <= 60) ? "red" : "black";
        let minutes = Math.floor(time / 60);
        if (minutes < 10) minutes = "0" + minutes;
        let seconds = Math.floor(time % 60);
        if (seconds < 10) seconds = "0" + seconds;
        drawBreakScreen(minutes, seconds);
        time--;
      }, 1000);
    }

    function drawBreakScreen(minutes, seconds){
      frCtx.clearRect(0, 0, frCanvas.width, frCanvas.height);

      // draw timer (with color from previous function)
      frCtx.font = "bold 45px Arial";
      frCtx.fillText(minutes + ":" + seconds,frCanvas.width/2,frCanvas.height/2 - 100);

      // display miniblock text
      frCtx.fillStyle = "black";
      frCtx.font = "25px Arial";
      frCtx.fillText("This is a short break. Please don't pause for more than 3 minutes.",frCanvas.width/2,frCanvas.height/2 - 150);
      if (numBlocks - block > 1) {
        frCtx.fillText("You are finished with block " + block + ". You have " + (numBlocks - block) + " blocks left.",frCanvas.width/2,frCanvas.height/2);
      } else {
        frCtx.fillText("You are finished with block " + block + ". You have " + (numBlocks - block) + " block left.",frCanvas.width/2,frCanvas.height/2);
      }
      frCtx.fillText("Your overall accuracy so far is " + Math.round((accCount/trialCount)*100) + "%.",frCanvas.width/2,frCanvas.height/2+50);
      frCtx.font = "bold 25px Arial";
      frCtx.fillText("Press any button to continue.",frCanvas.width/2,frCanvas.height/2 + 200);
    }
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

function setUpNetwork(){
  // define edges between nodes
  let nodeNeighbors = {
    1: [2,3,4,5],
    2: [1,3,4,5],
    3: [1,2,4,5],
    4: [1,2,3,6],
    5: [1,2,3,7],
    6: [4,8,9,10],
    7: [5,8,9,10],
    8: [6,7,9,10],
    9: [6,7,8,10],
    10: [6,7,8,9],
  }

  // define coordinates for nodes for drawing purposes
  let coordinates = {
    1: {x: (1/5), y: (4/5)}, 2: {x: (1/20), y: (1/2)},
    3: {x: (1/5), y: (1/5)}, 4: {x: (17/40), y: (1/3)},
    5: {x: (17/40), y: (2/3)}, 6: {x: (23/40), y: (1/3)},
    7: {x: (23/40), y: (2/3)}, 8: {x: (4/5), y: (1/5)},
    9: {x: (19/20), y: (1/2)}, 10: {x: (4/5), y: (4/5)}
  }

  // defines which nodes are being associated and whose associations will need to be inferred
  let associationStatuses = {
    1: false, 2: true, 3: true, 4: true, 5: true,
    6: true, 7: true, 8: false, 9: true, 10: true
  }

  // create network with nodes for each image
  selectedImages.forEach((imageObj, i) => {
    taskNetwork.addNode(new Node(i + 1, imageObj));
  });

  // add neighbors to objects as specified in nodeNeighbors var
  taskNetwork.nodes.forEach((node, i) => {
    nodeNeighbors[node.index].forEach((neighbor) => {
      taskNetwork.nodes[i].addNeighbor(taskNetwork.nodes[neighbor - 1]);
    })
  })

  // add address to each node as specified in coordinates var
  taskNetwork.nodes.forEach((node, i) => {
    node.coord.x = coordinates[node.index].x * frCanvas.width;
    node.coord.y = coordinates[node.index].y * frCanvas.height;
  })

  // assign communities to nodes
  taskNetwork.nodes.forEach((node, i) => {
    // console.log(i, node.name);
    if (i < 5) {
      node.community = "easy";
      node.communityNumber = 1;
    } else if (i >= 5) {
      node.community = "difficult";
      node.communityNumber = 2;
    }
    // console.log(node.community);
  })

  //set association statuses
  taskNetwork.nodes.forEach((node, i) => {
    node.associatedWithTask = associationStatuses[node.index];
  })
}
