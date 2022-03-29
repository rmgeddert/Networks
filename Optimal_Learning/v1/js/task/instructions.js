// see function navigateInstructionPath() in tasks.js for navigation code

// global instruction iterator information. Change as needed
let instructions = {
  // contains the interator for each instruction block
  iterator: {
    "main1-1": 1, "main1-2": 1, "main2": 1, "main3": 1, "final": 1
  },
  // contains the max value of each instruction iteration. iteration will STOP at max.
  max: {
    "main1-1": 5, "main1-2": 7, "main2": 6, "main3": 8,"final": 3
  },
  // what does instruction section end with?
  // #nextSectionButton, #startExpButton, keyPressNextSection, keyPressStartTask
  exitResponse: {
    "main1-1": '#nextSectionButton',
    "main1-2": '#startExpButton',
    "main2": 'keyPressStartTask',
    "main3": '#startExpButton',
    "final": 'keyPressStartTask'
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
    // what is the sequence of experimental instruction stages?
    switch (expStage){
      case "main1-1":
        expStage = "main1-2";
        break;
      case "main1-2":
        expStage = "main2";
        break;
      case "main2":
        expStage = "main3";
        break;
      case "main3":
        expStage = "final";
        break;
    }
  }
  runInstructions();
}

function displayDefaults(stage){
  // default values of instruction blocks. add any special cases
  switch(stage){
    case "final":
      showFirst();
      $('.instruction-header').hide();
      break;
    case "intro1":
    case "main1":
    case "main2":
    case "main3":
    case "main4":
    case "main5":
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
    case "main1-1":
      switch (slideNum){
        case 1:
          return "Welcome to the experiment, thank you for your participation!";
        case 2:
          return "Remember, do not touch or close the previous window (that said 'Click continue to start the main task').";
        case 3:
          return "In this experiment you will perform a task where you learn the network structure of objects. The experiment is expected to take approximately 25-30 minutes.";
        case 4:
          return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen.";
        case 5:
          return "Always respond as quickly and as accurately as possible during the tasks.";
      }
    case "main1-2":
      switch (slideNum){
        case 1:
          $("#network-diagram").insertAfter("#instructions" + slideNum);
          $("#network-diagram").show();
          return "In this first task, you will memorize the locations of the images within the network structure shown below.";
        case 2:
          return "You will see an empty network structure and a bank of images at the top.";
        case 3:
          return "Drag & drop each image from the image bank into the slots of the network structure to correspond to their positions shown above. Press 'check answer' when you are finished.";
        case 4:
          return "If your placement of an image is correct, the box will be outlined in green.";
        case 5:
          return "However, if your placement of an image is incorrect, the box will be outlined in red. If an image is incorrect, drag and drop to replace it with other incorrect images, and press 'check answer' again.";
        case 6:
          return "You will continue this process of guessing and checking which images go where until all the images are in the correct box, as indicated by green outlines.";
        case 7:
          return "You will repeat this process several times. The task is expected to last approximately _ minutes, but varies depending on your accuracy.";
      }
    case "main2":
      switch (slideNum){
        case 1:
          return " Jack and Jill are playing a game in which they each take turns picking a picture from a network. However, they are only allowed to pick a picture that is adjacent to the previous picture. For example, in the diagram below, if the current picture is _ then next they would only be allowed to pick __ or __, not __";
        case 2:
          return "Imagine you are Jack and Jill's caretaker, and you want to make sure they are playing fairly. Jill loves to cheat. Sometimes, she will choose a picture that is NOT adjacent to the previous picture. Your job is to catch whenever she tries to cheat.";
        case 3:
          return "In this next task, you will see a series of images from the network structure you just memorized. Press ‘space bar’ whenever Jill cheats, i.e. whenever the image in the series was NOT adjacent on the network structure to the previous image in the series.";
        case 4:
          return "You will hear a buzzer when you accidentally accuse Jill of cheating when she wasn't. Make sure your volume is turned on.";
        case 5:
          return "This task is expected to take ___ minutes.";
        case 6:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press the space bar to start the task."
      }
    case "main3":
    switch (slideNum){
      case 1:
        return "Great job! You will now begin the final task of this experiment.";
      case 2:
        return "In this task, you will use your knowledge of the network structure that you memorized in the tasks you just completed. You may have noticed that the images in the network structure belong to two distinct groups or communities, meaning that they were grouped adjacent to each other in the first task and often showed up close to each other in the series in the second task.";
      case 3:
        return "In this task, you will see three images. Two of these images with belong to one of these communities, and the third image will belong to the other community in the network structure.";
      case 4:
        return "Your job is to choose the image that belongs to a different community than the other two images (the image that ‘doesn’t fit’ with the other two images). For example, if you think that the first and third image were in the same community, choose the second image.";
      case 5:
        changeTextFormat('#instructions' + slideNum,'font-weight','bold');
        return "Do not choose based on what the images look like. Your choice should be based purely on the network structure that you observed and which images were presented together frequently.";
      case 6:
        return "Note that the position of the images in the three positions is random and should not influence your decision.";
      case 7:
        return "Please take your time and think carefully about which image does not fit with the other two. If you are unsure, make your best guess.";
      case 8:
        return "This task is expected to take __ minutes.";
    }

    case "final":
      switch (slideNum){
        case 1:
          iterateAgain = true;
          return "Thank you for your participation. Press any button to return to the other experiment window, which you used to open this experiment window. Be sure to read the final paragraph carefully and then submit your data to receive your confirmation code.";
        case 2:
          iterateAgain = true;
          return "DO NOT GO BACK TO THE OTHER WINDOW WITHOUT FIRST CLOSING THIS SCREEN VIA BUTTON PRESS. Doing otherwise may result in you losing all data from your participation.";
        case 3:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button on your keyboard to close this window.";
      }
  }
}

function runInstructions(){
  // show cursor
  document.body.style.cursor = 'auto';

  // main instruction function (come here at start of instruction block)
  sectionStart = new Date().getTime() - runStart;
  sectionType = "instructions";

  // hide/clear everything, just in case
  hideInstructions();

  // hide canvas and other tasks if visible
  $(".canvasas").hide();
  $("#oddOneOutTaskDiv").hide();
  $("#network-diagram").hide();
  if (showNavButtons) {
    $("#navButtons").show();
  }

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
    displayDefaults(expStage);
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
    data.push([sectionType, expStage, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
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
    data.push([sectionType, expStage, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]);
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
  } else if (instructions["exitResponse"][expStage] == "keyPressStartTask"){
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
