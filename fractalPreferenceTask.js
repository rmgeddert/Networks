function fractalPreferenceTask(){

  // set up task

  // show task div and hide instructions
  $('#instructionsDiv').hide();
  $("#fractalPreferenceTask").show();

  // set up DOM elements variables
  let image1 = document.getElementById("FP_image1");
  let image2 = document.getElementById("FP_image2");

  // set listener function of image clicks
  $("#FP_image1").click(function(){
    processImageClick(0);
  })

  $("#FP_image2").click(function(){
    processImageClick(1);
  })

  function processSelection(selectionIndex){

  }

  function displayNodePair(nodePair){
    // display images in node set
    image1.src = nodePair.nodes[0].img.src;
    image2.src = nodePair.nodes[1].img.src;
  }

}
