$(document).ready(function(){

  console.log("adding line");

  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', '1200px');
  svg.setAttribute('height', '700px');
  svg.style.position = 'absolute';
  svg.setAttribute('z-index', '-1');
  $(svg).insertBefore("#network-container");



  let newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  newLine.setAttribute('id','line1');
  newLine.setAttribute('x1','50');
  newLine.setAttribute('y1','50');
  newLine.setAttribute('x2','350');
  newLine.setAttribute('y2','350');
  newLine.setAttribute("stroke", "black");

  $("svg").append(newLine);

});
