let trialAttempts = 0, consecutiveCorrectOnFirstTryTrials = 0;
let imageSize = 150, imageScale = 0.6;
function networkDragTask(){
  sectionType = "mainTask";
  taskName = "networkDragTask";

  // this code gets run when networkDragTask gets run

  // show task div
  $('#instructionsDiv').hide();
  $("#navButtons").hide();
  $("#networkDragTask").show();

  // set up key press listener
  $(document).on("click", "#networkDragCheckAnswer", function(){
    respOnset = new Date().getTime() - runStart;
    trialAttempts++;
    // color images if correct or incorrect
    let nCorrect = 0;
    let anyIncorrect = false;
    let slotDict = {}
    for (var i = 0; i < 10; i++) {
      slotDict["slot"+i] = checkAnswer("slot"+i,i) ? 1 : 0;
      if (checkAnswer("slot"+i,i)) {
        nCorrect++;
        document.getElementById("slot"+i).style.borderWidth = "2px";
        document.getElementById("slot"+i).style.borderColor = "#00ff00" //green
      } else {
        anyIncorrect = true;
        document.getElementById("slot"+i).style.borderWidth = "2px";
        document.getElementById("slot"+i).style.borderColor = "#ff0000" //red
      }
    }
    console.log(slotDict);

    // if none are incorrect, reveal next trial button
    if (!anyIncorrect) {
      $("#networkDragNextTrial").show();
      $("#networkDragCheckAnswer").hide();
    }

    // log data
    data.push([sectionType, taskName, trialCount, blockTrialCount, block, trialAttempts, stimOnset, respOnset, respOnset - stimOnset, NaN, nCorrect, slotDict["slot0"], slotDict["slot1"], slotDict["slot2"], slotDict["slot3"], slotDict["slot4"],slotDict["slot5"], slotDict["slot6"], slotDict["slot7"], slotDict["slot8"], slotDict["slot9"], NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
    console.log(data);
  });

  $(document).on("click", "#networkDragNextTrial", function(){
    trialCount++;
    blockTrialCount++;
    if (trialAttempts == 1) {
      consecutiveCorrectOnFirstTryTrials++;
    } else {
      consecutiveCorrectOnFirstTryTrials = 0;
    }

    resetNetwork();
    $("#networkDragNextTrial").hide();
    networkDragTaskFlow();
  });

  //draw network behind div boxes
  drawHTMLNetwork();

  //start task
  networkDragTaskFlow();
}

function networkDragTaskFlow(){
  if ((consecutiveCorrectOnFirstTryTrials == 3 || trialCount > 10) && trialCount > 4 ) {
    $("#networkDragTask").hide();
    navigateInstructionPath();
  } else {
    networkDragTrial();
  }
}

function networkDragTrial(){
  trialAttempts = 0;
  stimOnset = new Date().getTime() - runStart;

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

function correctlyFill(){
  for (var i = 0; i < 10; i++) {
    let imageDiv = new Image;
    imageDiv.src = selectedImages[i].src
    imageDiv.width = imageSize * imageScale; //
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
    imageDiv.width = imageSize * imageScale; //
    imageDiv.draggable = true;
    imageDiv.id = "drag" + i;
    imageDiv.ondragstart = function(){drag(event);}
    document.getElementById("slot"+i).append(imageDiv);
  }

  // remove table and show submit button
  document.getElementById("dragImageTable").remove();
  document.getElementById("picture-container").style.display = "none";
  $("#networkDragCheckAnswer").show();
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
    newImageObj.width = imageSize * imageScale; //
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
    console.log("DIV");
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
      // show check answer button
      $("#networkDragCheckAnswer").show();
    }
  } else {
    $("#networkDragCheckAnswer").show();
  }
}

function drawHTMLNetwork(){
  createSVG("svg","#network-container-lg", 700*imageScale + 'px', 1200*imageScale + 'px')
  drawSVGLines("svg","slot","#network-container-lg")
}
