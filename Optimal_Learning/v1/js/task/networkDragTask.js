function networkDragTask(){
  // this code gets run when networkDragTask gets run

  // show task div
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  $("#networkDragTask").show();

  // set up key press listener

    $(document).on("click", "#networkDragButton", function(){
      let anyIncorrect = false;
      for (var i = 0; i < 10; i++) {
        if (checkAnswer("slot"+i,i)) {
          document.getElementById("slot"+i).style.borderWidth = "5px";
          document.getElementById("slot"+i).style.borderColor = "#00ff00"
        } else {
          anyIncorrect = true;
          document.getElementById("slot"+i).style.borderWidth = "5px";
          document.getElementById("slot"+i).style.borderColor = "#ff0000"
        }
      }
    });

      // if none are incorrect, proceed to next trial
      if (!anyIncorrect) {
        $("#networkDragButton").hide();
        networkDragDelayButton();
      }

      $(document).on("click", "#networkDragDelayButton", function(){
        resetNetwork();
        networkDragTaskFlow();
      });

  //draw network behind div boxes
  drawHTMLNetwork();

  //start task
  networkDragTaskFlow();
}
//
function networkDragTaskFlow(){
  //copy code from other function
  // pseudo code:
  // if trialcount <= trialCountfortask
  //   networkDragTrial();
  // else {
  //   go to isntructions
  // }
  networkDragTrial();
}

function networkDragTrial(){
  //defines one trial of task

  // randomly display the nework images in the picture-container div
  displayImages();

}

function resetNetwork(){
  document.body.querySelectorAll("*").forEach((node) => {
    if (node.id.indexOf("slot") != -1) {
      node.style.borderWidth = "1px";
      node.style.borderColor = "black";
      node.removeChild(node.childNodes[0]);
    }
  })
}

// node_name: "slot1" or "slot2"
// node_position integer between 0 and 9. indexes the taskNetwork variable
function checkAnswer(slot_name, node_position){
  // this function runs when submit is hit. checks if answers are correct.
    if (document.getElementById(slot_name).childNodes[0].src == taskNetwork.nodes[node_position].img.src) {
      return true;
    }
    else {
      return false;
    }
}

function randomlyFill(){
  let images = [];
  document.body.querySelectorAll("*").forEach((node) => {
    if (node.tagName == "IMG") {
      images.push(node);
      node.parentElement.remove();
    }
  })

  images = shuffle(images);

  for (var i = 0; i < 10; i++) {
    document.getElementById("slot"+i).append(images[i]);
  }

  checkIfImageBoxEmpty();
}

function correctlyFill(){
  for (var i = 0; i < 10; i++) {
    let imageDiv = new Image;
    imageDiv.src = selectedImages[i].src
    imageDiv.width = 150; //
    imageDiv.draggable = true;
    imageDiv.id = "drag" + i;
    imageDiv.ondragstart = function(){drag(event);}
    document.getElementById("slot"+i).append(imageDiv);
  }

  // remove table and show submit button
  document.getElementById("dragImageTable").remove();
  document.getElementById("picture-container").style.display = "none";
  $("#networkDragButton").show();
}

// function getFeedback(node_position){
//   document.body.querySelectorAll("*").forEach(node =>
//     if (node.id.indexOf("slot" != -1)) {
//       if (checkAnswer(node.id, parseInt(node.id.match(/\d+/)[0])-1) == true) {
//         document.getElementById(node_position).style.outlineColor = "00ff00"
//       } else {
//         document.getElementById(node_position).style.outlineColor = "ff0000"
//       }
//     }
// });
// }



function displayImages(){
  // shuffle images
  let images = _.shuffle(selectedImages);

  // create image table to hold images
  let imageTable = document.createElement("div");
  imageTable.className = "imageTable";
  imageTable.id = "dragImageTable";

  //loop through images
  images.forEach((imageObj, i) => {

    // create div element to hold image
    let imageDiv = document.createElement("div");
    imageDiv.className = "imageDiv";

    // create new image object for image
    let newImageObj = new Image();
    newImageObj.src = imageObj.src;
    newImageObj.width = 150; //
    newImageObj.draggable = true;
    newImageObj.id = "drag" + i;
    newImageObj.ondragstart = function(){drag(event);}

    // add image to imageDiv
    imageDiv.appendChild(newImageObj);

    // add imageDiv to imageTable
    imageTable.appendChild(imageDiv);
  });

  // insert image table into images box above network
  document.getElementById("picture-container").appendChild(imageTable);
  document.getElementById("picture-container").style.display = "block";

}

// *****************
// code below allows for dragging and dropping, don't touch
let oldParentDiv;

function allowDrop(event){
  event.preventDefault();
}

function drag(event){
  // console.log("drag");
  oldParentDiv = event.target.parentElement;
  // console.log(event.target.parentElement);
  event.dataTransfer.setData("id", event.target.id);
}

function drop(event) {
  event.preventDefault();
  // console.log(event.target);

  // first, figure out what is being dropped
  let data_id = event.dataTransfer.getData("id");
  let data = document.getElementById(data_id);

  // check if data recipient is an empty div or an image
  if (event.target.tagName == "DIV") {

    // if div, just append
    event.target.appendChild(data);

    if (oldParentDiv.className == "imageDiv") {
      // then delete old parent, don't need anymore
      oldParentDiv.remove();
    }

  } else {

    let oldDiv, newDiv;

    // only run if image is not being dragged onto itself
    if (event.target.id != data_id) {

      // check if coming from image table
      if (oldParentDiv.className == "imageDiv") {

        // get parent of target
        document.body.querySelectorAll("*").forEach(node => {
          for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].id == event.target.id) {
              newDiv = node;
            }
          }
        });

        oldParentDiv.innerHTML = '';
        oldParentDiv.appendChild(event.target);
        newDiv.innerHTML = '';
        newDiv.appendChild(data);

      } else {

        // figure out which divs are parents of both images
        document.body.querySelectorAll("*").forEach(node => {
          for (let i = 0; i < node.childNodes.length; i++) {
            if(node.childNodes[i].id == data_id){
              oldDiv = node;
            }
            if (node.childNodes[i].id == event.target.id) {
              newDiv = node;
            }
          }
        });

        // make swap
        newDiv.innerHTML = '';
        newDiv.appendChild(data);
        oldDiv.appendChild(event.target);
      }
    }
  }

  checkIfImageBoxEmpty();

}

function checkIfImageBoxEmpty(){
  if (document.getElementById("dragImageTable")) {
    if (document.getElementById("dragImageTable").childNodes.length == 0) {
      document.getElementById("dragImageTable").remove();
      document.getElementById("picture-container").style.display = "none";
      $("#networkDragButton").show();
    }
  }
}

function drawHTMLNetwork(){
  // add svg (for drawing lines)
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', '1206px');
  svg.setAttribute('height', '706px');
  svg.style.position = 'absolute';
  svg.setAttribute('z-index', '-1');
  $(svg).insertBefore("#network-container");

  // which nodes are connected to which
  let nodeNeighbors = {
    0: [1,2,3,4],
    1: [0,2,3,4],
    2: [0,1,3,4],
    3: [0,1,2,4],
    4: [0,1,2,3,6],
    5: [6,7,8,9],
    6: [4,5,7,8,9],
    7: [5,6,8,9],
    8: [5,6,7,9],
    9: [5,6,7,8],
  }

  // loop through html elements and draw lines for each
  document.body.querySelectorAll("*").forEach(node => {
    if (node.id.indexOf("slot") != -1) {
      let x1 = $("#"+node.id).offset().left+ (node.offsetWidth / 2) - $("#network-container").offset().left;
      let y1 = $("#"+node.id).offset().top + (node.offsetHeight / 2) - $("#network-container").offset().top;
      let nodeN = node.id.match(/\d+/g);
      let neighbors = nodeNeighbors[nodeN];
      neighbors.forEach( neighbor => {
        let name = "#slot" + neighbor;
        let x2 = $(name).offset().left+ $(name).outerWidth() / 2 - $("#network-container").offset().left;
        let y2 = $(name).offset().top + $(name).outerHeight() / 2 - $("#network-container").offset().top;

        // draw line
        let newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        newLine.setAttribute('id','line1');
        newLine.setAttribute('x1',x1);
        newLine.setAttribute('y1',y1);
        newLine.setAttribute('x2',x2);
        newLine.setAttribute('y2',y2);
        newLine.setAttribute("stroke", "black");
        newLine.setAttribute("stroke-width", "5px");
        $("svg").append(newLine);
      });
    }
  });
}
