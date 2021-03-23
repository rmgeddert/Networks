// see function navigateInstructionPath() in tasks.js for navigation code

// global instruction iterator information. Change as needed
let instructions = {
  // contains the interator for each instruction block
  iterator: {
    "prac1-1": 1, "prac1-2": 1, "prac2": 1, "main1": 1, "main2": 1
  },
  // contains the max value of each instruction iteration. iteration will STOP at max.
  max: {
    "prac1-1": 4, "prac1-2": 4, "prac2": 8, "main1": 6, "main2": 6
  },
  // what does instruction section end with?
  // #nextSectionButton, #startExpButton, buttonPressNextSection, buttonPressStartTask
  exitResponse: {
    "prac1-1": '#nextSectionButton',
    "prac1-2": '#startExpButton',
    "prac2": 'buttonPressStartTask',
    "prac3": 'buttonPressStartTask',
    "main1": 'buttonPressStartTask',
    "main2": '#startExpButton'
  }
};
let iterateAgain = false, task;

function navigateInstructionPath(repeat = false){
  if (repeat == true) {
    // if multi stage instructions, ensures it goes back to first not second
    switch (expStage){
      case "prac1-1":
      case "prac1-2":
        expStage = "prac1-1";
        break;
    }
  } else {
    switch (expStage){
      case "prac1-1":
        expStage = "prac1-2";
        break;
      case "prac1-2":
        expStage = "prac2";
        break;
      case "prac2":
        expStage = "main1";
        break;
      case "main1":
        expStage = "main2";
        break;
    }
  }
  runInstructions();
}

function displayDefaults(stage){
  // default values of instruction blocks. add any special cases
  switch(stage){
    case "prac1-2":
    case "prac2":
    case "main1":
    case "main2":
       showFirst();
    default:
      $('.instruction-header').show();
      break;
  }
}

function getNextInstructions(slideNum, expStage){
/* use the following options when modifying text appearance
    -  iterateAgain = true;
    -  changeTextFormat('#instructions' + slideNum,'font-weight','bold');
    -  changeTextFormat('#instructions' + slideNum,'font-size','60px');
    -  changeTextFormat('#instructions' + slideNum,'color','red');
    -  changeTextFormat('#instructions' + slideNum,'margin-top', '20px');
    -  changeTextFormat('#instructions' + slideNum,'margin-bottom', '20px');
    - $("<img src='../pics/finalpics/M33.jpg' class='insertedImage'>").insertAfter( "#instructions" + slideNum);
*/
  switch (expStage){
    case "prac1-1":
      switch (slideNum){
        case 1:
          return "In this experiment, you will see a series of fractal images. You will need to indicate if the image is oriented correctly or if it has been rotated.";
        case 2:
          return "You will first complete a series of practice tasks designed to familiarize you with the images and help you complete the main task.";
        case 3:
          return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen. Try your best to pay attention to what each image looks like.";
        case 4:
          $(imageTableDiv).insertAfter("#instructions" + slideNum);
          return "Below are the images you will be using in this experiment. Please take a few moments to familiarize yourself with them before continuing to the next section.";
      }
    case "prac1-2":
      switch (slideNum){
        case 1:
          return "In the first practice task, you will see each image and its rotated version.";
        case 2:
          return "Click on the image that is rotated correctly. If you make a mistake, you will be prompted to 'Try Again' until you respond correctly.";
        case 3:
          return "You will keep going until you have correctly identified each image " + orientationCorrRespNeeded + " times.";
        case 4:
          return "At first you may just be guessing, but try and pay attention to what each image looks like so you can remember the correct orientation.";
      }
    case "prac2":
      switch (slideNum){
        case 1:
          return "Great job! Now that you are familiar with the images and their correct orientation, you will now practice the main task.";
        case 2:
          return "You will see a single image on the screen. You will need to indicate if the image is in its correct orientation or if it has been rotated.";
        case 3:
          return "Press 'M' with your right hand index finger if the number " + getKeyMappingText(1);
        case 4:
          return "Press 'Z' with your left hand index finger if the number " + getKeyMappingText(2);;
        case 5:
          return "You will hear a buzzer if you make a mistake or if you respond too slowly. Please make sure your sound is turned on, and feel free to adjust the volume to a comfortable level.";
        case 6:
          return "This block will contain "+fractalsNeeded+" trials. You must get " + practiceAccCutoff +"% correct in order to move on to the main task."
        case 7:
          iterateAgain = true;
          $( getImageText(instructionImages[1]) ).insertAfter( "#instructions" + slideNum);
          return "Please place your index fingers on the 'M' and 'Z' keys as shown.";
        case 8:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to begin."
      }
    case "main1":
      switch (slideNum){
        case 1:
          return "You are now ready to start the main task. As you just practiced, you will see one image appear on the screen."
        case 2:
          return "Press 'M' with your right hand index finger if the image " + getKeyMappingText(1);
        case 3:
          return "Press 'Z' with your left hand index finger if the image " + getKeyMappingText(2);
        case 4:
          return "This task will take approximately 15 minutes, and you will have periodic short breaks. Remember to respond to each image as quickly and accurately as possible.";
        case 5:
          iterateAgain = true;
          $( getImageText(instructionImages[1]) ).insertAfter( "#instructions" + slideNum);
          return "Please place your index fingers on the 'M' and 'Z' keys as shown.";
        case 6:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to begin."
      }
    case "main2":
      switch (slideNum){
        case 1:
          return "In this next task, you will see three images. You will be asked to select the image that does not fit with the other two images.";
        case 2:
          return "In the previous task, the stream of images you saw adhered to a pattern. Thus, some images were presented after one another frequently while others were not."
        case 3:
          return "Your job in this task is to choose the image that would be UNLIKELY to appear after either of the other two images.";
        case 4:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Do not choose based on what the images look like. Your choice should be based purely on the image sequence that you observed and which images were presented after one another frequently.";
        case 5:
          return "Please take your time and think carefully about which image does not fit with the other two images based on the image sequence. If we detect button mashing you will not be compensated. Thank you.";
        case 6:
          return "If you are unsure, make your best guess.";
      }
  }
}

function runInstructions(){
  // main instruction function (come here at start of instruction block)
  sectionStart = new Date().getTime() - runStart;
  sectionType = "instructions";

  // hide/clear everything, just in case
  hideInstructions();

  // hide canvas if visible
  $(".canvasas").hide();

  // if need to repeat instructions (e.g., participant failed to meet accuracy requirement), then reshow all instructions
  if (instructions["iterator"][expStage] >= instructions["max"][expStage]){

    // loop through instructions and show
    for (var i = 1; i <= instructions["max"][expStage]; i++) {
      $('#instructions' + i).text( getNextInstructions( i, expStage ));
    }

    // reset iterateAgain in case looping turned it on by accident
    iterateAgain = false;

    // display instructions and prepare exit response mapping
    $('#instructionsDiv').show();
    exitResponse();

  } else {

    // remove any previous click listeners, if any
    $(document).off("click","#nextInstrButton");
    $(document).off("click","#startExpButton");
    $(document).off("click","#nextSectionButton");

    // clear all previous instructions, reset styles, and remove pictures
    for (let i = 1; i <= 8; i++) {
      $('#instructions' + i).text("");
      resetDefaultStyles('#instructions' + i);
      clearInsertedContent();
    }

    // display proper instruction components, in case they are hidden
    $('#instructionsDiv').show();
    $('#nextInstrButton').show();
    $('#nextSectionButton').hide();
    $('#startExpButton').hide();
    displayDefaults(expStage);
  }

  /* code for "Next" button click during instruction display
        if running from Atom, need to use $(document).on, if through Duke Public Home Directory, either works.
        https://stackoverflow.com/questions/19237235/jquery-button-click-event-not-firing
  */
  $(document).on("click", "#nextInstrButton", function(){
  // $("#nextInstrButton").on('click', function(){
    iterateInstruction();
  });

  // code for click startExperiment button
  $(document).on('click', '#startExpButton', function(){
    // update data logger on time spent in section
    sectionEnd = new Date().getTime() - runStart;
    data.push([sectionType, expStage, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN])
    console.log(data);

    $('#instructionsDiv').hide();
    $('#startExpButton').hide();
    clearInsertedContent();

    // clear all button press listeners
    $(document).off("click","#nextInstrButton");
    $(document).off("click","#startExpButton");
    $(document).off("click","#nextSectionButton");
    experimentFlow();
  });

  $(document).on('click', '#nextSectionButton', function(){
    // update data logger on time spent in section
    sectionEnd = new Date().getTime() - runStart;
    data.push([sectionType, expStage, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN])
    console.log(data);

    // clear all button press listeners
    $(document).off("click","#nextInstrButton");
    $(document).off("click","#startExpButton");
    $(document).off("click","#nextSectionButton");
    navigateInstructionPath();
  });
};

function iterateInstruction(){
  let instrNum = instructions["iterator"][expStage];
  $('#instructions' + instrNum).text( getNextInstructions( instrNum, expStage));

  // iterate as appropriate or allow next phase
  if (instrNum < instructions["max"][expStage]){
    instructions["iterator"][expStage]++;
  } else{
    exitResponse();
  }

  if (iterateAgain == true) {
    iterateAgain = false;
    iterateInstruction();
  }
}

function exitResponse(){
  $('#nextInstrButton').hide();
  if (instructions["exitResponse"][expStage] == "#startExpButton"){
    $('#startExpButton').show();
  } else if (instructions["exitResponse"][expStage] == "#nextSectionButton") {
    $('#nextSectionButton').show();
  } else if (instructions["exitResponse"][expStage] == "buttonPressStartTask"){
    keyListener = 5;
  } //else if (instructions["exitResponse"][expStage] == "buttonPressNextSection"){
    //keyListener = 6;
  //}
}

function getImageText(imageURL){
  return "<img src='" + imageURL + "' class='insertedImage'>";
}

function showFirst() {
  iterateInstruction();
}

function changeTextFormat(elementName, property ,changeTo){
  $(elementName).css( property , changeTo );
}

function clearInsertedContent(){
  $('.insertedImage').remove();
  $('.insertedContent').remove();
}

function hideInstructions(){
  // remove any previous click listeners, if any
  $(document).off("click","#nextInstrButton");
  $(document).off("click","#startExpButton");
  $(document).off("click","#nextSectionButton");

  // hide instruction DOMs
  $('#instructionsDiv').hide();
  $('#startExpButton').hide();
  $('#nextSectionButton').hide();

  // clear text from instruction DOMs
  for (let i = 1; i <= 8; i++) {
    $('#instructions' + i).text("");
    resetDefaultStyles('#instructions' + i);
    clearInsertedContent();
  }
}

function resetDefaultStyles(domObject){
  $(domObject).css('font-weight','');
  $(domObject).css('font-size','');
  $(domObject).css('color','');
  $(domObject).css('margin-top','');
  $(domObject).css('margin-bottom','');
}

function getKeyMappingText(item){
  if (keyMapping == 1 ? item == 2 : item == 1) {
    return "is oriented correctly.";
  } else {
    return "has been rotated.";
  }
}
