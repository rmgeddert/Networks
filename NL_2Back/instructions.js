// see function navigateInstructionPath() in tasks.js for navigation code

// global instruction iterator information. Change as needed
let instructions = {
  // contains the interator for each instruction block
  iterator: {
    "prac1-1": 1, "prac1-2": 1, "prac2": 1, "prac3": 1, "main1": 1, "main2": 1, "main3": 1
  },
  // contains the max value of each instruction iteration. iteration will STOP at max.
  max: {
    "prac1-1": 4, "prac1-2": 6, "prac2": 6, "prac3": 6, "main1": 5, "main2": 5, "main3": 6
  },
  // what does instruction section end with?
  // #nextSectionButton, #startExpButton, buttonPressNextSection, buttonPressStartTask
  exitResponse: {
    "prac1-1": '#nextSectionButton',
    "prac1-2": 'buttonPressStartTask',
    "prac2": 'buttonPressStartTask',
    "prac3": 'buttonPressStartTask',
    "main1": 'buttonPressStartTask',
    "main2": 'buttonPressStartTask',
    "main3": '#startExpButton'
  }
};
let iterateAgain = false, task;

function navigateInstructionPath(repeat = false){
  if (repeat == true) {
    // if multi stage instructions, ensures it goes back to first not second
    // switch (expStage){
    //   case "prac1-1":
    //   case "prac1-2":
    //     expStage = "prac1-1";
    //     break;
    // }
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
      case "main2":
        expStage = "main3";
        break;
    }
  }
  runInstructions();
}

function displayDefaults(stage){
  // default values of instruction blocks. add any special cases
  switch(stage){
    case "prac1-1":
    case "prac1-2":
    case "prac2":
    case "main1":
    case "main2":
       // showFirst();
    default:
      showFirst();
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
          return "Welcome to the experiment, thank you for your participation!";
        case 2:
          return "In this experiment you will be completing several practice tasks followed by the main task. There will be a few minor tasks after the main task as well. The experiment is expected to take approximately XXXXXX minutes";
        case 3:
          return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen.";
        case 4:
          return "Always respond as quickly and as accurately as possible during the tasks.";
      }
    case "prac1-2":
      switch (slideNum){
        case 1:
          return "In this first practice task, you will see a sequence of vowels presented one at a time.";
        case 2:
          return "Press the '1' key on your keyboard if the vowel you see is a repeat of the previous vowel from one trial before. Press the '0' key if it is not a repeat.";
        case 3:
          return "For example, if you see A then E, press '0'. If you see A then A, press '1'.";
        case 4:
          return "You will need to get at least 75% correct on this task in order to move on to the next section, otherwise you will need to repeat the practice.";
        case 5:
          iterateAgain = true;
          $( getImageText(instructionImages[1])).insertAfter( "#instructions" + slideNum);
          return "Please place your fingers on the 1 and 0 keys before beginning the task.";
        case 6:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to start.";
      }
    case "prac2":
      switch (slideNum){
        case 1:
          return "Great job! In this second practice task, you will see a sequence of vowels presented one at a time just as in the first practice task. However, in this task you will be paying attention to repeats from TWO trials before.";
        case 2:
          return "Press the '1' key if the vowel you see is the same as the vowel from two trials before in the sequence. Otherwise, press the '0' key.";
        case 3:
          return "For example, if you see the sequence A, I, A press the '1' key. If you see the sequence A, A, I press the '0' key.";
        case 4:
          return "You will need to get a least 75% correct on this task in order to move onto the next section, otherwise you will need to repeat the practice.";
        case 5:
          iterateAgain = true;
          $( getImageText(instructionImages[1])).insertAfter( "#instructions" + slideNum);
          return "Please place your fingers on the 1 and 0 keys before beginning the task.";
        case 6:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to start."
      }
      case "prac3":
        switch (slideNum){
          case 1:
            $(imageTableDiv).insertAfter("#instructions" + slideNum);
            return "In the third and final practice task, you will see a sequence of fractal images, like those pictured below.";
          case 2:
            return "You will perform a similar task as in the second practice task in which you will pay attention to repeats from TWO trials before, but in this task you will be looking at repeats in the fractal images presented.";
          case 3:
            return " Press the '1' key if the fractal image you see is the same as the fractal image from two trials before in the sequence. Otherwise, press the '0' key.";
          case 4:
            return "You will need to get a least 75% correct on this task in order to move onto the next section, otherwise you will need to repeat the practice.";
          case 5:
            iterateAgain = true;
            $( getImageText(instructionImages[1])).insertAfter( "#instructions" + slideNum);
            return "Please place your fingers on the 1 and 0 keys before beginning the task.";
          case 6:
            changeTextFormat('#instructions' + slideNum,'font-weight','bold');
            return "Press any button to start."
        }
    case "main1":
      switch (slideNum){
        case 1:
          return "You are now ready to start the main task. In the main task, you will follow the same procedure as in the final practice task. This task will last approximately 25 minutes. You will get periodic breaks about every 7 minutes."
        case 2:
          $(imageTableDiv).insertAfter("#instructions" + slideNum);
          return "As a reminder, you will see a sequence of fractal images, like those pictured below.";
        case 3:
          return "Press the '1' key if the fractal image you see is the same as the fractal image from two trials before in the sequence. Otherwise, press the '0' key.";
        case 4:
          iterateAgain = true;
          $( getImageText(instructionImages[4]) ).insertAfter( "#instructions" + slideNum);
          return "Please place your fingers on the '1' and '0' keys before beginning the task. Remember to respond as quickly and as accurately as possible.";
        case 5:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to start."
      }
      case "main2":
        switch (slideNum){
          case 1:
            return "Great job! In this next task, you will see a sequence of fractal images again."
          case 2:
            changeTextFormat('#instructions' + slideNum,'font-weight','bold');
            return "Press the space bar every time you think you have come to a natural breaking point in the sequence.";
          case 3:
            return "This next task will take about 15 minutes, and you will get a break halfway through.";
          case 4:
            return "Please place your finger on the spacebar before beginning the task.";
          case 5:
            changeTextFormat('#instructions' + slideNum,'font-weight','bold');
            return "Press any button to start."
        }
    case "main3":
      switch (slideNum){
        case 1:
          return "In this final task, you will see three fractal images. You will be asked to select the image that does not fit with the other two images.";
        case 2:
          return "In the main task that you completed, the stream of images you saw adhered to a pattern. Thus, some images were presented after one another frequently while others were not."
        case 3:
          return "Your job in this task is to choose the image that would be UNLIKELY to appear after either of the other two images.";
        case 4:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Do not choose based on what the images look like. Your choice should be based purely on the image sequence that you observed and which images were presented after one another frequently.";
        case 5:
          return "Please take your time and think carefully about which image does not fit with the other two images based on the image sequence.";
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
