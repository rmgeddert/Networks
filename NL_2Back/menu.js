console.log("Version - Last Updated 6-2-2020");
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

function startExperiment(){
  prepareMenu();
  updateMainMenu(1);
}

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
  // document.getElementById('assignmentId').value = gup('assignmentId', document.referrer);
  // document.getElementById('hitId').value = gup('hitId', document.referrer);
  // document.getElementById('workerId').value = gup('workerId', document.referrer);
  let mt = getAllUrlParams(window.location.href);
  // console.log(mt);
  // if(mt.hitid == ""){mt.hitid = "NA"}
  // if(mt.workerid == ""){mt.workerid  = "NA"}
  // if(mt.assid == ""){mt.assid = "NA"}

  document.getElementById('assignmentId').value = mt.assid;
  document.getElementById('hitId').value = mt.hitid;
  document.getElementById('workerId').value = mt.workerid;

  console.log(document.getElementById('assignmentId').value);
  console.log(document.getElementById('hitId').value);
  console.log(document.getElementById('workerId').value);

  // prevents multiple soundcheck checkboxes being selected
  $('input[type="checkbox"]').on('change', function(){
     $('input[type="checkbox"]').not(this).prop('checked', false);
  });

  // check worker ID
  if (onMturk && (document.getElementById("assignmentId").value == "" || document.getElementById("assignmentId").value == "ASSIGNMENT_ID_NOT_AVAILABLE")){

    // display text for accepting HIT
    $("#table").show();
    $("#instruction").text("Accept HIT first");
    $("#instruction").show();
    $("#myButton").hide();
    $("#redo").hide();

  } else {

    // prevents previous participants from participating again. See var workerArr above
    if (duplicateWorker(workerId)) {

  		$("#NoGo").html("You have performed our task before or are otherwise ineligible. Please return this HIT. Thank you for your cooperation, we apologize for any inconvenience.")
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


function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}
