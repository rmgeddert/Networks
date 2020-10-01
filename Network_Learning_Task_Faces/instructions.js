// see function navigateInstructionPath() in tasks.js for navigation code

// global instruction iterator information. Change as needed
let instructions = {
  // contains the interator for each instruction block
  iterator: {
    "prac1-1": 1, "prac1-2": 1, "main1": 1, "main2": 1
  },
  // contains the max value of each instruction iteration. iteration will STOP at max.
  max: {
    "prac1-1": 4, "prac1-2": 7, "main1": 6, "main2": 6
  },
  // what does instruction section end with?
  // #nextSectionButton, #startExpButton, buttonPressNextSection, buttonPressStartTask
  exitResponse: {
    "prac1-1": '#nextSectionButton',
    "prac1-2": 'buttonPressStartTask',
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
          return "In this experiment, you will see a series of individual faces, presented one after another in succession.";
        case 2:
          $(imageTableDiv).insertAfter("#instructions" + slideNum);
          return "Take a moment to familiarize yourself with the faces you will be seeing in this task before continuing.";
        case 3:
          return "Sometimes the faces will be presented clearly, and sometimes they will be slightly blurry. Your task will be to indicate if the face you see is clear or blurry, using your left and right index fingers."
        case 4:
          return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen. Remember not to close any of the other windows during the duration of the experiment.";
      }
    case "prac1-2":
      switch (slideNum){
        case 1:
          return "You will begin with a practice block before completing the main experiment. Indicate if the face you see is clear or blurry.";
        case 2:
          return "Press 'M' with your right hand index finger if the face " + getKeyMappingText(1);
        case 3:
          return "Press 'Z' with your left hand index finger if the face " + getKeyMappingText(2);
        case 4:
          return "You will hear a buzzer if you make a mistake or if you respond too slowly. Please make sure your sound is turned on, and feel free to adjust the volume to a comfortable level.";
        case 5:
          return "This block will contain " + facesNeeded + " trials. You must get " + practiceAccCutoff + "% correct in order to move on to the main task."
        case 6:
          iterateAgain = true;
          $( getImageText(instructionImages[1]) ).insertAfter( "#instructions" + slideNum);
          return "Please place your index fingers on the 'M' and 'Z' keys as shown.";
        case 7:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to begin."
      }
    case "main1":
      switch (slideNum){
        case 1:
          return "You are now ready to start the main task. As you just practiced, you will see a series of faces appear on the screen."
        case 2:
          return "Press 'M' with your right hand index finger if the face " + getKeyMappingText(1);
        case 3:
          return "Press 'Z' with your left hand index finger if the face " + getKeyMappingText(2);
        case 4:
          return "This task will take approximately 15 minutes, and you will have periodic short breaks. Remember to respond to each trial as quickly and accurately as possible.";
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
          return "In this next task, you will see three faces. You will be asked to select the individual that does not fit with the other two individuals.";
        case 2:
          return "In the previous task, the stream of faces you saw adhered to a pattern. Thus, some individuals were presented after one another frequently while others were not."
        case 3:
          return "Your job in this task is to choose the person that would be UNLIKELY to appear after either of the other two people.";
        case 4:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Do not choose based on what the faces look like. Your choice should be based purely on the image sequence that you observed and which faces were presented after one another frequently.";
        case 5:
          return "Please take your time and think carefully about which person does not fit with the other two people based on the image sequence.";
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
    return "is clear.";
  } else {
    return "is blurry.";
  }
}
