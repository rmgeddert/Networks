// -------------------------------------------//
//         Define and load task images
// -------------------------------------------//

let instructionImages = {
  1: 'images/handsOnKeyboard5.png',
  2: 'images/handsOnKeyboard2.png'
}

// array for fractal images
let fractalSRCs = [];
for (let i = 1; i <= 21; i++) {
  fractalSRCs.push(`qbist_fractals/Fractal${i}.png`);
}

// randomly sample from fractal images
let selectedSRCs = _.sample(fractalSRCs,fractalsNeeded);
let unselectedSRCs = fractalSRCs.filter(fractal =>  !selectedSRCs.includes(fractal))

// load images based on URL's and store in selectedImages var
let selectedImages = Array(selectedSRCs.length);
for (var i = 0; i < selectedImages.length; i++) {
  selectedImages[i] = new Image();
  selectedImages[i].src = selectedSRCs[i];
}

// save unselected images for later (Fractal transfer test)
let unselectedImages = Array(unselectedSRCs.length);
for (var i = 0; i < unselectedImages.length; i++) {
  unselectedImages[i] = new Image();
  unselectedImages[i].src = unselectedSRCs[i];
}

// -------------------------------------------//
// Code for displaying fractals in instructions:
// -------------------------------------------//

// defines how many images fit per row (within 900px width and 26px padding)
let chunkSize = 5;

// create image table
let imageTable = document.createElement("div");
imageTable.className = "imageTable";

// add images to imageTable
selectedImages.forEach((imageObj, i) => {

  // create div element to hold image
  let imageDiv = document.createElement("div");
  imageDiv.className = "imageDiv";

  // transfor imageObj to new variable for resizing
  let newImageObj = new Image();
  newImageObj.src = imageObj.src;
  newImageObj.ondragstart = function(){return false;};

  // resize image
  newImageObj.width = (900 / chunkSize) - 26; //

  // add image to imageDiv
  imageDiv.appendChild(newImageObj);

  // add imageDiv to imageRow
  imageTable.appendChild(imageDiv);
});

// wrap imageTable in div wrapper of class "insertedContent"
let imageTableDiv = document.createElement("div");
imageTableDiv.className = "insertedContent";
imageTableDiv.appendChild(imageTable);
