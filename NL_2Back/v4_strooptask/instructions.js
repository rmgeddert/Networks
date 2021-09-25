// see function navigateInstructionPath() in tasks.js for navigation code

// global instruction iterator information. Change as needed
let instructions = {
  // contains the interator for each instruction block
  iterator: {
    "prac1-1": 1, "prac1-2": 1, "prac2": 1, "prac3": 1, "main1": 1, "main2": 1, "main3": 1, "main4": 1, "final": 1
  },
  // contains the max value of each instruction iteration. iteration will STOP at max.
  max: {
    "prac1-1": 5, "prac1-2": 6, "prac2": 6, "prac3": 7, "main1": 6, "main2": 8, "main3": 7, "main4": 5, "final": 3
  },
  // what does instruction section end with?
  // #nextSectionButton, #startExpButton, keyPressNextSection, keyPressStartTask
  exitResponse: {
    "prac1-1": '#nextSectionButton',
    "prac1-2": 'keyPressStartTask',
    "prac2": 'keyPressStartTask',
    "prac3": 'keyPressStartTask',
    "main1": 'keyPressStartTask',
    "main2": '#startExpButton',
    "prac4": 'keyPressStartTask',
    "main3": 'keyPressStartTask',
    "main4": 'keyPressStartTask',
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
    switch (expStage){
      case "prac1-1":
        expStage = "prac1-2";
        break;
      case "prac1-2":
        expStage = "prac2";
        break;
      case "prac2":
        expStage = "prac3";
        break;
      case "prac3":
        expStage = "main1";
        break;
      case "main1":
        expStage = "main2";
        break;
      case "main2":
        expStage = "prac4";
        break;
      case "prac4":
        expStage = "main3";
        break;
      case "main3":
        expStage = "main4";
        break;
      case "main4":
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
          return "Remember, do not touch or close the previous window (that said 'Click continue to start the main task').";
        case 3:
          return "In this experiment you will perform a task where you detect and respond to repetitions in fractal images. You will begin with several practice tasks designed to familiarize you with the main task. The experiment is expected to take approximately 30-40 minutes.";
        case 4:
          return "Please enlarge this window to your entire screen and sit a comfortable distance from the computer screen.";
        case 5:
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
          return "You will need to get at least " + practiceAccCutoff + "% correct on this task in order to move on to the next section, otherwise you will need to repeat the practice.";
        case 5:
          iterateAgain = true;
          $( getImageText(instructionImages[1])).insertAfter( "#instructions" + slideNum);
          return "Please place your fingers on the '1' and '0' keys before beginning the task.";
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
          return "You will need to get a least " + practiceAccCutoff+ "% correct on this task in order to move onto the next section, otherwise you will need to repeat the practice.";
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
            return "You will perform the same task as in the second practice task in which you will pay attention for repeats from TWO trials before, but in this case you will be looking for repeats in the fractal images.";
          case 3:
            return " Press the '1' key if the fractal image you see is the same as the fractal image from two trials before in the sequence. Otherwise, press the '0' key.";
          case 4:
            return "You will need to get a least " + practiceAccCutoff + "% correct on this task in order to move onto the next section, otherwise you will need to repeat the practice.";
          case 5:
            changeTextFormat('#instructions' + slideNum,'font-weight','bold');
            return "You will hear a buzzer sound if you make a mistake or forget to respond. Please make sure your volume is turned on.";
          case 6:
            iterateAgain = true;
            $( getImageText(instructionImages[1])).insertAfter( "#instructions" + slideNum);
            return "Please place your fingers on the 1 and 0 keys before beginning the task.";
          case 7:
            changeTextFormat('#instructions' + slideNum,'font-weight','bold');
            return "Press any button to start.";
        }
    case "main1":
      switch (slideNum){
        case 1:
          return "You are now ready to start the main task. In the main task, you will follow the same procedure as in the final practice task. This task will last approximately 25 minutes. You will get periodic breaks about every 7 minutes.";
        case 2:
          $(imageTableDiv).insertAfter("#instructions" + slideNum);
          return "As a reminder, you will see a sequence of fractal images, like those pictured below.";
        case 3:
          return "Press the '1' key if the fractal image you see is the same as the fractal image from two trials before in the sequence. Otherwise, press the '0' key.";
        case 4:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "You will hear a buzzer sound if you make a mistake or forget to respond. Please make sure your volume is turned on.";
        case 5:
          iterateAgain = true;
          $( getImageText(instructionImages[1]) ).insertAfter( "#instructions" + slideNum);
          return "Please place your fingers on the '1' and '0' keys before beginning the task. Remember to respond as quickly and as accurately as possible.";
        case 6:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Press any button to start.";
      }
    case "main2":
      switch (slideNum){
        case 1:
          return "Great job! You will now begin the next task of this experiment.";
        case 2:
          return "In the task that you just completed, you may have noticed that the fractal images belonged to two distinct groups.";
        case 3:
          return "In this task, you will see three fractal images. Two of these images will belong to one of these groups, and the third image will belong to the other group.";
        case 4:
          return "Your job is to choose the fractal image that 'doesn't fit' with the other two images. For example, if you think that the first and third image were in the same group, choose the second image.";
        case 5:
          changeTextFormat('#instructions' + slideNum,'font-weight','bold');
          return "Do not choose based on what the images look like. Your choice should be based purely on the image sequence that you observed and which images were grouped together frequently.";
        case 6:
          return "Please take your time and think carefully about which image does not fit with the other two. If you are unsure, make your best guess.";
        case 7:
          return "Note that the position of the images in the three positions is random and should not influence your decision.";
        case 8:
          return "";
      }
    case "prac4"
      switch (slideNum){
        case 1:
          return "Great job! You will now begin the next practice task."
        case 2:
          return "In this task, you will see the word for a color written in a specific font."
        case 3:
          return "The font color can either match the word's meaning (e.g., 'RED' in red font), or may not match the word's meaning (e.g., 'RED' in blue font.)"
        case 4:
          return "Regardless of what the word reads, your job is to respond to the FONT COLOR the word is written in. On your keyboard, press 'z' if the font color is red, 'x' if it is green, 'n' if it is blue, and 'm' if it is orange, using the index and middle finger of both hands."
        case 5:
          return "Remember, only respond based on the font color of the word, NOT what the word reads."
      }
    case "main3":
        switch (slideNum) {
          case 1:
            return "Great job! You have two tasks remaining, each taking about 5 minutes.";
          case 2:
            return "In this task, you will see a fractal image from the previous task, with the word for a specific color superimposed on top of it. For example, you might see the word 'RED' or 'BLUE'.";
          case 3:
            return "These words will be written in a specific colored font (red, green, blue, or orange), which can either match the word's meaning (e.g., 'RED' in red font), or may not match the word's meaning (e.g., 'RED' in blue font).";
          case 4:
            return "Regardless of what the word reads, your job is to respond to the FONT COLOR the word is written in. On your keyboard, press 'z' if the font color is red, 'x' if it is green, 'n' if it is blue, and 'm' if it is orange, using the index and middle finger of both hands.";
          case 5:
            return "Remember, only respond based on the font color of the word, NOT what the word reads.";
          case 6:
            iterateAgain = true;
            $( getImageText(instructionImages[2]) ).insertAfter( "#instructions" + slideNum);
            return "Please place your fingers on the keyboard as shown. Remember to respond as quickly and as accurately as possible.";
          case 7:
            changeTextFormat('#instructions' + slideNum,'font-weight','bold');
            return "Press any button to start.";
      }
      case "main4":
          switch (slideNum) {
            case 1:
              return "Great job! You will now begin the final task of the experiment.";
            case 2:
              return "This task is identical to the on you just completed. You will see a fractal image followed by a color word (e.g., 'RED' or 'BLUE'), written in a specific colored font (e.g., 'RED' in blue font).";
            case 3:
              return "Remember to indicate the font COLOR, not what the word reads. Press 'z' if the font color is red, 'x' if it is green, 'n' if it is blue, and 'm' if it is orange, using the index and middle finger of both hands.";
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
  $("#mathTask").hide();
  $("#fractalPreferenceTask").hide();
  $("#oddOneOutTaskDiv").hide();
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
