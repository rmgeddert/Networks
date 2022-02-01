$(document).ready(function(){

  // add svg (for drawing lines)
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', '1200px');
  svg.setAttribute('height', '700px');
  svg.style.position = 'absolute';
  svg.setAttribute('z-index', '-1');
  $(svg).insertBefore("#network-container");

  // loop through html elements and draw lines for each
  document.body.querySelectorAll("*").forEach(node => {
    console.log(node.id);
  });

  let newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  let box1 = $("#slot1");
  let box2 = $("#slot2");
  newLine.setAttribute('id','line1');
  newLine.setAttribute('x1',box1.offset().left);
  newLine.setAttribute('y1',box1.offset().top);
  newLine.setAttribute('x2',box2.offset().left);
  newLine.setAttribute('y2',box2.offset().top);
  newLine.setAttribute("stroke", "black");

  $("svg").append(newLine);

});
