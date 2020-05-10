// define edges between nodes
let nodeNeighbors = {
  1: [2,3,4,5,6],
  2: [1,3,4,5,6],
  3: [1,2,4,5,6],
  4: [1,2,3,5,6],
  5: [1,2,3,4,6],
  6: [1,2,3,4,5,7,8,9,10,11],
  7: [6,8,9,10,11],
  8: [6,7,9,10,11],
  9: [6,7,8,10,11],
  10: [6,7,8,9,11],
  11: [6,7,8,9,10]
}

// define coordinates for nodes for drawing purposes
let coordinates = {
  1: {x: (7/32), y: (1/4)}, 2: {x: (3/8), y: (1/4)},
  3: {x: (3/32), y: (1/2)}, 4: {x: (7/32), y: (3/4)},
  5: {x: (3/8), y: (3/4)}, 6: {x: (1/2), y: (1/2)},
  7: {x: (5/8), y: (1/4)}, 8: {x: (25/32), y: (1/4)},
  9: {x: (29/32), y: (1/2)}, 10: {x: (5/8), y: (3/4)},
  11: {x: (25/32), y: (3/4)}
}

// defines which nodes are being associated and whose associations will need to be inferred
let associationStatuses = {
  1: false, 2: false, 3: true, 4: true, 5: true,
  6: false, 7: false, 8: false, 9: true, 10: true,
  11: true
}

// define edges between nodes
let nodeNeighbors = {
  1: [2,3,4,5],
  2: [1,3,4,5],
  3: [1,2,5,6],
  4: [1,2,5,10],
  5: [1,2,3,4],
  6: [3,7,8,9],
  7: [6,8,9,10],
  8: [6,7,9,10],
  9: [6,7,8,10],
  10: [7,8,9,4],
}

// define coordinates for nodes for drawing purposes
let coordinates = {
  1: {x: (1/20), y: (1/2)}, 2: {x: (1/5), y: (1/5)},
  3: {x: (17/40), y: (1/3)}, 4: {x: (17/40), y: (2/3)},
  5: {x: (1/5), y: (4/5)}, 6: {x: (23/40), y: (1/3)},
  7: {x: (4/5), y: (1/5)}, 8: {x: (19/20), y: (1/2)},
  9: {x: (4/5), y: (4/5)}, 10: {x: (23/40), y: (2/3)}
}

// defines which nodes are being associated and whose associations will need to be inferred
let associationStatuses = {
  1: false, 2: false, 3: true, 4: true, 5: true,
  6: true, 7: false, 8: false, 9: true, 10: true
}
