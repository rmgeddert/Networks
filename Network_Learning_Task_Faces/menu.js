console.log("Version - Last Updated 10-2-2020");
// create global curStage variable
let curStage = 0;
let onMturk = true;

// creates popup window
function basicPopup(url) {
  // opens popup with certain settings
  popupWindow = window.open(url,'popUpWindow','height=' + screen.height + ',width=' + screen.width + ',left=0,top=0,resizable=yes,scrollbars=yes,toolbar=no, menubar=no,location=no,directories=no,status=yes');
}

// this function allows Mturkers to get paid with their id
function gup(name, tmpURL){
  let regexS = "[\\?&]"+name+"=([^&#]*)";
  let results = new RegExp(regexS).exec(tmpURL);
  return (results == null) ? "" : results[1];
}

// stop users from closing the menu.html window
// window.onbeforeunload = function() {
//     return 'Please do not close this window!';
// }

// function for navigating experiment stages
function updateMainMenu(expStage){
  // update global curstage variable
  curStage = expStage;

  // display text based on experiment stage
  switch(expStage){
    case 0: //initial sound check
      $("#table").hide();
      $("#soundCheck").show();
      $("#instruction").text("This task involves audio feedback. Please complete the sound check below. Play the audio file below and select which word is spoken.");
      break;
    case 1: // demographics
      $("#instruction").text("Click button to fill out demographic survey. PLEASE DO NOT CLOSE THIS WINDOW.");
      $("#myButton").show();
      $("#table").show();
      $("#soundCheck").hide();
      $("#instruction").show();
      break;
    case 2: //main task
      $("#myButton").show();
      $("#instruction").text("Click 'Continue' button to start the main task. PLEASE DO NOT CLOSE THIS WINDOW.");
      $("#instruction").show();
      break;
    case 3: //debriefing
      // remove onbeforeunload listener
      window.onbeforeunload = function (){}
      $("#instruction").hide();
      $("#myButton").hide();
      $("#redo").hide();
      $("#mturk_form").show();
      break;
  }
}

// prevent duplicate workers from completing task
let workerArr = [];

// checks if workerID exists in workerid array
function duplicateWorker(workedID){
  workerId = gup('workerId', document.referrer);
  return jQuery.inArray(workerId, workerArr)!=-1 && workerId != "";
}

$(document).ready(function(){
  // initial hide all DOM elements
  $("#table").hide();
  $("#soundCheck").hide();
  $("#mturk_form").hide();
  $("#instructions").hide();
  $("#myButton").hide();
  $("#NoGo").hide();

  // gets MTurk Worker Information and assign to HTML elements
  document.getElementById('assignmentId').value = gup('assignmentId', document.referrer);
  document.getElementById('hitId').value = gup('hitId', document.referrer);
  document.getElementById('workerId').value = gup('workerId', document.referrer);

  // prevents multiple soundcheck checkboxes being selected
  $('input[type="checkbox"]').on('change', function(){
     $('input[type="checkbox"]').not(this).prop('checked', false);
  });

  // check worker ID
  if (onMturk && (document.getElementById("assignmentId").value == "" || document.getElementById("assignmentId").value == "ASSIGNMENT_ID_NOT_AVAILABLE")){

    // display text for accepting HIT
    $("#table").show();
    $("#instruction").text("Thank you for your interest, but you are unfortunetaly not eligible for this HIT because of previous participation. Please return the HIT. We apologize for any inconvenience.");
    $("#instruction").show();
    $("#myButton").hide();
    $("#redo").hide();

  } else {

    // prevents previous participants from participating again. See var workerArr above
    if (duplicateWorker(workerId)) {

  		$("#NoGo").html("You have performed our task before. Unfortunately, we are <br/> unable to allow duplicate entries. Please return this HIT. Thanks!")
  		$("#NoGo").show();
    } else {
    	prepareMenu();
    }

  }
});

function prepareMenu(){
  // update menu to first value
  updateMainMenu(0);

  // create button press code for switching between sections
  $("#myButton").click(function(){
    switch(curStage){
      case 1:
        basicPopup("demographics.html");
        break;
      case 2:
        basicPopup("main.html");
        break;
    }
  });

  $("#soundCheckSubmit").click(function(){
    if (document.getElementById("sc2").checked == true) {
      updateMainMenu(1);
    } else {
      window.alert("Incorrect. Please try again.");
    }
  });
}
