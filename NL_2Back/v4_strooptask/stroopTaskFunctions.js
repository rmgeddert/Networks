let stroopColors = ["red", "green", "blue", "orange"];
let congruentStim = [], incongruentStim = [];

//build congruent and incongruent arrays
stroopColors.forEach(color => {
  //congruent
  congruentStim.push([color, color, "c", getResponseKeys(color)]);

  //incongruent
  let offColors = stroopColors.filter(c => c != color);
  offColors.forEach(offColor => {
   incongruentStim.push([color, offColor, "i", getResponseKeys(offColor)]);
  })
});

function fixationScreen(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 60px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("+",canvas.width/2,canvas.height/2);
}

function getResponseKeys(color){
  switch (color) {
    case "red":
      return [122, 90];
    case "green":
      return [120, 88];
    case "blue":
      return [110, 78];
    case "orange":
      return [109, 77];
  }
}
