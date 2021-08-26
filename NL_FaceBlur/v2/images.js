// -------------------------------------------//
//         Define and load task images
// -------------------------------------------//

let instructionImages = {
  1: 'images/oneFingerKeyboard1.png',
  2: 'images/oneFingerKeyboard2.png',
  3: 'images/oneFingerKeyboard3.png'
}

// male face images
let maleFacesSRCs = [];
for (let i = 1; i <= 5; i++) { //15
  maleFacesSRCs.push(`faces/Group_${imageSet}/Male/face_${i}.jpeg`);
}

// female face images
let femaleFacesSRCs = [];
for (let i = 1; i <= 5; i++) { //15
  femaleFacesSRCs.push(`faces/Group_${imageSet}/Female/face_${i}.jpeg`);
}

// // randomly sample from fractal images
// let selectedMaleSRCs = _.sample(facesSRCs,facesNeeded);

// load male images
let selectedMaleImages = {};
for (var i = 0; i < maleFacesSRCs.length; i++) {
  selectedMaleImages["Male " + (i+1)] = {};
  selectedMaleImages["Male " + (i+1)]["img"] = new Image();
  selectedMaleImages["Male " + (i+1)]["img"].src = maleFacesSRCs[i];
  selectedMaleImages["Male " + (i+1)]["sex"] = "male";
}

// load female images
let selectedFemaleImages = {};
for (var i = 0; i < femaleFacesSRCs.length; i++) {
  selectedFemaleImages["Female " + (i+1)] = {};
  selectedFemaleImages["Female " + (i+1)]["img"] = new Image();
  selectedFemaleImages["Female " + (i+1)]["img"].src = femaleFacesSRCs[i];
  selectedFemaleImages["Female " + (i+1)]["sex"] = "female";
}

//create single array for images
let selectedImages = {...selectedMaleImages, ...selectedFemaleImages};

// -------------------------------------------//
// Code for displaying faces in instructions:
// -------------------------------------------//

// defines how many images fit per row (within 900px width and 26px padding)
let chunkSize = 6;

// create image table
let imageTable = document.createElement("div");
imageTable.className = "imageTable";

// add images to imageTable
for (var image in selectedImages) {
  let imageObj = selectedImages[image]["img"];

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
};

// wrap imageTable in div wrapper of class "insertedContent"
let imageTableDiv = document.createElement("div");
imageTableDiv.className = "insertedContent";
imageTableDiv.appendChild(imageTable);
