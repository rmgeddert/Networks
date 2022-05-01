// see function navigateInstructionPath() in tasks.js for navigation code

// global instruction iterator information. Change as needed
let instructions = {
  // contains the interator for each instruction block
  iterator: {
    "main1-1": 1, "main1-2": 1, "main2": 1, "main3": 1, "main4": 1,"prac5": 1, "main6": 1, "main7": 1, "final": 1
  },
  // contains the max value of each instruction iteration. iteration will STOP at max.
  max: {
    "main1-1": 5, "main1-2": 7, "main2": 6, "main3": 4, "main4": 8,"prac5": 6, "main6": 6, "main7": 5,"final": 7
  },
  // what does instruction section end with?
  // #nextSectionButton, #startExpButton, keyPressNextSection, keyPressStartTask
  exitResponse: {
    "main1-1": '#nextSectionButton',
    "main1-2": '#startExpButton',
    "main2": 'keyPressStartTask',
    "main3": 'keyPressStartTask',
    "main4": '#startExpButton',
    "prac5": 'keyPressStartTask',
    "main6": 'keyPressStartTask',
    "main7": 'keyPressStartTask',
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
        expStage = "main4";
        break;
      case "main4":
        expStage = "prac5";
        break;
      case "prac5":
        expStage = "main6";
        break;
      case "main6":
        expStage = "main7";
        break;
      case "main7":
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
    - $( getImageText(instructionImages[1])).insertAfter( "#instructions" + slideNum);
*/
  switch (expStage){
    case "main1-1":
      switch (slideNum){
        case 1:
          return "Welcome to the experiment, thank you for your participation!";
        case 2:
          return "Remember, do not touch or close the previous window (that said 'Click continue to start the main task').";
        case 3:
          return "In this experiment you will perform a task where you learn a network structure of objects. The experiment is expected to take approximately 30 minutes.";
        case 4:
          return "Please enlarge this window to its maximum size and sit a comfortable distance from your computer screen.";
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
          return "If your placement of an image is correct, the box will be outlined in green. However, if your placement of an image is incorrect, the box will be outlined in red.";
        case 5:
          return "If an image is incorrect, drag and drop to replace it with other incorrect images, and press 'check answer' again. You will continue guessing and checking which images go where until all the images are in the correct box, as indicated by green outlines.";
        case 6:
          return "You will repeat this process until you have learned the network structure. The task is expected to take approximately 10 minutes, but varies depending on your accuracy.";
        case 7:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Take a minute to familiarize yourself with the network structure above before beginning the experiment.";
      }
    case "main2":
      switch (slideNum){
        case 1:
          $( getImageText(instructionImages[3])).insertAfter( "#instructions" + slideNum);
          changeTextFormat('#instructions' + slideNum,'margin-bottom', '5px');
          return "Jack and Jill are playing a game where they take turns choosing a picture from the network you just memorized. They are only allowed to pick a picture that is adjacent to the previous picture. For example, in the diagram below, if the current picture is scissors they would only be allowed to pick cake or lightbulb, not nail polish.";
        case 2:
          return "Imagine you are Jack and Jill's caretaker, and you want to make sure they are playing fairly. Jill loves to cheat. Sometimes, she will choose a picture that is NOT adjacent to the previous picture. Your job is to catch whenever she tries to cheat.";
        case 3:
          return "In this next task, you will see a series of images from the network structure you just memorized. Press 'z' whenever Jill makes a correct move and 'm' whenever she cheats.";
        case 4:
          return "You will start with a practice task, and you will receive feedback on every trial. You need at least 80% accuracy to proceed to the main task."
        case 5:
          iterateAgain = true;
          $( getImageText(instructionImages[4])).insertAfter( "#instructions" + slideNum);
          return "Please place your fingers on the 'z' and 'm' keys before beginning the task. Remember to respond as quickly and as accurately as possible."
        case 6:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to begin the task."
      }
    case "main3":
      switch (slideNum){
        case 1:
          return "You will now begin the main task. Remember, Jack and Jill may only choose images that are adjacent to the last image, and it is your job to catch Jill whenever she cheats and chooses a non-adjacent image.";
        case 2:
          return "For this task, you only need to respond if and when Jill cheats, i.e., when an image appears that was not adjacent to the previous image in the task sequence. Press 'space bar' whenever this occurs, otherwise press nothing at all.";
        case 3:
          return "You will get feedback whenever you accuse Jill of cheating when she wasn't, or if you accidentally miss an instance when Jill did cheat. Otherwise, the task will proceed uninterrupted. This task is expected to take 10 minutes.";
        case 4:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press the space bar to begin the task."
    }
    case "main4":
      switch (slideNum){
        case 1:
          return "Great job! You will now be tested on your memory of the network structure.";
        case 2:
          return "In this task, you will use your knowledge of the network structure that you memorized. You may remember that the images in the network structure belong to two distinct groups or communities, one on the left and one on the right.";
        case 3:
          return "In this task, you will see three images. Two of these images will belong to one of the communities, and the third image will belong to the other community.";
        case 4:
          return "Your job is to choose the image that belongs to a different community than the other two images. For example, if you think that the first and third image were in the same community, choose the second image.";
        case 5:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Do not choose based on what the images look like. Your choice should be based purely on the position of the images in the network structure.";
        case 6:
          return "Note that the position of the images in the three locations is random and should not influence your decision.";
        case 7:
          return "Please take your time and think carefully about which image does not fit with the other two. If you are unsure, make your best guess.";
        case 8:
          return "This task is expected to take 10 minutes.";
    }
    case "prac5":
      switch (slideNum){
        case 1:
          return "Great job! You will now begin the second half of the experiment. You will start with a short practice task.";
        case 2:
          return "In this task, you will see a color word (e.g., 'RED' or 'BLUE') appear on the screen. The font color of the word can either match the word's meaning (e.g., 'RED' in red font) or may not match the word's meaning (e.g., 'RED' in blue font)."
        case 3:
          $( getImageText(instructionImages[5]) ).insertBefore( "#instructions" + slideNum);
          return "Your job is to indicate the FONT COLOR of the word, while ignoring what the word itself says. On your keyboard, press 'z' if the font color is red, 'x' if it is green, 'n' if it is blue, and 'm' if it is orange, using the index and middle fingers of both hands."
        case 4:
          return "You will need to get a least " + practiceAccCutoff + "% correct on this task in order to move onto the next section, otherwise you will need to repeat the practice."
        case 5:
          iterateAgain = true;
          $( getImageText(instructionImages[2]) ).insertAfter( "#instructions" + slideNum);
          return "Please place your fingers on the keyboard as shown. Remember to respond as quickly and as accurately as possible.";
        case 6:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to start.";
      }
    case "main6":
        switch (slideNum) {
          case 1:
            return "Great job! You have two tasks remaining, each taking about 5 minutes.";
          case 2:
            return "In this task, you will see an image from the network you memorized. Next, a color word will appear superimposed on the image. For example, you might see the word 'RED' or 'BLUE'.";
          case 3:
            return "Your job is again to indicate the font color of the word, regardless of what the word meaning is.";
          case 4:
            $( getImageText(instructionImages[5]) ).insertBefore( "#instructions" + slideNum);
            return "Press 'z' if the font color is red, 'x' if it is green, 'n' if it is blue, and 'm' if it is orange, using the index and middle finger of both hands.";
          case 5:
            iterateAgain = true;
            $( getImageText(instructionImages[2]) ).insertAfter( "#instructions" + slideNum);
            return "Please place your fingers on the keyboard as shown. Remember to respond as quickly and as accurately as possible.";
          case 6:
            changeTextFormat('#instructions' + slideNum,'font-weight','bold');
            return "Press any button to start.";
      }
    case "main7":
      switch (slideNum) {
        case 1:
          return "Great job! You will now begin the final task of the experiment.";
        case 2:
          return "This task is identical to the one you just completed. You will see an image followed by a color word, written in a particular font color.";
        case 3:
          $( getImageText(instructionImages[5]) ).insertBefore( "#instructions" + slideNum);
          return "Press 'z' if the font color is red, 'x' if it is green, 'n' if it is blue, and 'm' if it is orange, using the index and middle finger of both hands.";
        case 4:
          iterateAgain = true;
          $( getImageText(instructionImages[2]) ).insertAfter( "#instructions" + slideNum);
          return "Please place your fingers on the keyboard as shown. Remember to respond as quickly and as accurately as possible.";
        case 5:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to start.";
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
          iterateAgain = true;
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button on your keyboard to close this window.";
        case 4:
          iterateAgain = true;
          return "- - - - - - - - - - - - - - - - - - - -"
        case 5:
          iterateAgain = true;
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          changeTextFormat('#instructions' + slideNum,'color','red');
          return "If pressing a key doesn't work (Data upload failed):";
        case 6:
          iterateAgain = true;
          return "If pressing a key doesn't work, please follow the following instructions. Please do NOT close this window or go back to the other window (that says press the button to start the task) or you will lose your data."
        case 7:
          return "Right click anywhere on this page and click inspect. Among the options at the top ('Elements', 'Console', 'Network', etc) press 'Console'. Type in 'data' and press enter. Right click what appears and select 'Copy object'. Paste into an email to egner.lab.studies@gmail.com. Thank you!"
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
    let confirm = true;
    if (expStage == "main1-2" && Boolean(window.confirm)) {
      confirm = window.confirm("Are you sure you are ready to proceed? Remember to review the image network before proceeding. You will be expected to reproduce it from memory.");
    }

    if (confirm) {
      // update data logger on time spent in section
      sectionEnd = new Date().getTime() - runStart;
      logSectionData();

      $('#instructionsDiv').hide();
      $('#startExpButton').hide();
      clearInsertedContent();

      // clear all button press listeners
      $(document).off("click","#nextInstrButton");
      $(document).off("click","#startExpButton");
      $(document).off("click","#nextSectionButton");
      experimentFlow();
    }
  });

  $(document).on('click', '#nextSectionButton', function(){
    // update data logger on time spent in section
    sectionEnd = new Date().getTime() - runStart;
    logSectionData();

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
