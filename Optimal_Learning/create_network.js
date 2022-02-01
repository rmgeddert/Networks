function allowDrop(ev){
  ev.preventDefault();
}

function drag(ev){
  ev.dataTransfer.setData("id", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();

  // id name of what is being dropped
  let data_id = ev.dataTransfer.getData("id");
  let data = document.getElementById(data_id);

  // check if data recipient is an empty div or an image
  if (ev.target.tagName == "DIV") {
    // if div, just append
    ev.target.appendChild(data);

  } else {

    // create clone of recipient
    let clone = ev.target.cloneNode(true);
    let oldDiv, newDiv;

    // only run if image is not being dragged onto itself
    if (clone.id != data_id) {

      // figure out which divs are parents of both images
      document.body.querySelectorAll("*").forEach(node => {
        for (let i = 0; i < node.childNodes.length; i++) {
          if(node.childNodes[i].id == data_id){
            oldDiv = node;
          }
          if (node.childNodes[i].id == clone.id) {
            newDiv = node;
          }
        }
      });

      // make swap
      newDiv.innerHTML = '';
      newDiv.appendChild(data);
      oldDiv.appendChild(clone);

    }
  }


}

$(document).ready(function(){

  // add svg (for drawing lines)
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', '1206px');
  svg.setAttribute('height', '706px');
  svg.style.position = 'absolute';
  svg.setAttribute('z-index', '-1');
  $(svg).insertBefore("#network-container");

  // which nodes are connected to which
  let nodeNeighbors = {
    1: [2,3,4,5],
    2: [1,3,4,5],
    3: [1,2,4,5],
    4: [1,2,3,5],
    5: [1,2,3,4,6],
    6: [5,7,8,9,10],
    7: [6,8,9,10],
    8: [6,7,9,10],
    9: [6,7,8,10],
    10: [6,7,8,9],
  }

  // loop through html elements and draw lines for each
  document.body.querySelectorAll("*").forEach(node => {
    if (node.id.indexOf("slot") != -1) {
      let x1 = $("#"+node.id).offset().left+ (node.offsetWidth / 2) - $("#network-container").offset().left;
      let y1 = $("#"+node.id).offset().top + (node.offsetHeight / 2) - $("#network-container").offset().top;
      let nodeN = node.id.match(/\d+/g);
      let neighbors = nodeNeighbors[nodeN];
      neighbors.forEach( neighbor => {
        let name = "#slot" + neighbor;
        let x2 = $(name).offset().left+ $(name).outerWidth() / 2 - $("#network-container").offset().left;
        let y2 = $(name).offset().top + $(name).outerHeight() / 2 - $("#network-container").offset().top;

        // draw line
        let newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        newLine.setAttribute('id','line1');
        newLine.setAttribute('x1',x1);
        newLine.setAttribute('y1',y1);
        newLine.setAttribute('x2',x2);
        newLine.setAttribute('y2',y2);
        newLine.setAttribute("stroke", "black");
        newLine.setAttribute("stroke-width", "5px");
        $("svg").append(newLine);
      });
    }
  });

});
