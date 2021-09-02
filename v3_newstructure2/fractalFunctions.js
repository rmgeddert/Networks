class Network {
  constructor(){
    this.nodes = [];
    this.nCommunities = 2;
  }

  communityNodes(communityNumber){
    let nodeArr  = [];
    this.nodes.forEach((node) => {
      if (node.communityNumber == communityNumber) {
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
    this.isBoundaryNode = false;
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

function setUpNetwork(){
  // define edges between nodes
  let nodeNeighbors = {
    1: [2,3,4,5],
    2: [1,3,4,5],
    3: [1,2,4,5],
    4: [1,2,3,5],
    5: [1,2,3,4,7],
    6: [7,8,9,10],
    7: [5,6,8,9,10],
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

  // defines if node is a boundary node (connecting to other community)
  let boundaryNodes = {
    1: false, 2: false, 3: false, 4: true, 5: true,
    6: true, 7: true, 8: false, 9: false, 10: false
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
    node.coord.x = coordinates[node.index].x * canvas.width;
    node.coord.y = coordinates[node.index].y * canvas.height;
  })

  // assign communities to nodes
  taskNetwork.nodes.forEach((node, i) => {
    if (i < 5) {
      node.community = "lowControl";
      node.communityNumber = 1;
    } else if (i >= 5) {
      node.community = "highControl";
      node.communityNumber = 2;
    } else {
      node.community = NaN;
      node.communityNumber = 0;
    }
  })

  //set association statuses and boundary status
  taskNetwork.nodes.forEach((node, i) => {
    node.associatedWithTask = associationStatuses[node.index];
    node.isBoundaryNode = boundaryNodes[node.index];
  })
}

function displayFractal(){
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // display fractal
  ctx.drawImage(activeNode.img,canvas.width/2 - activeNode.img.width/2,canvas.height/2-activeNode.img.height/2);
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

function isCommunityTransition(){
  if (prevNode !== undefined) {
    return activeNode.communityNumber != prevNode.communityNumber;
  } else {
    return false;
  }
}
