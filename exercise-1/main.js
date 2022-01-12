/// <reference path="./p5.global-mode.d.ts" />

const [width, height] = [800, 600];
let p0, p1, p2, p3;

const step = 0.01;
let t = 0;

let myCurve = [];

let curve1;

function lerpVector(p1, p2, t) {
  return createVector((1-t) * p1.x + t * p2.x, (1-t) * p1.y + t * p2.y)
}

function setup() {
  createCanvas(800, 600);
  p0 = new Draggable(80, 220);
  p1 = new Draggable(330, 70);
  p2 = new Draggable(500, 400);
  p3 = new Draggable(700, 300);

  curve1 = cubicBezier(p0.vectorPos(), p1.vectorPos(), p2.vectorPos(), p3.vectorPos());
}

let updateCurve = false;

function updateDraggable(drag) {
  drag.update();
  drag.over();
  drag.show();
}

function draw() {
  background(240);

  // Draw line from start to p1
  drawLine(p0.vectorPos(), p1.vectorPos(), "gray", 1);

  // Draw line from p2 to end
  drawLine(p2.vectorPos(), p3.vectorPos(), "gray", 1);

  updateDraggable(p0);
  updateDraggable(p1);
  updateDraggable(p2);
  updateDraggable(p3);
  
  if (p0.dragging || p1.dragging || p2.dragging || p3.dragging) {
    curve1 = cubicBezier(
      p0.vectorPos(), 
      p1.vectorPos(), 
      p2.vectorPos(), 
      p3.vectorPos()
    );
  }

  for (let i = 0; i < curve1.length - 1; i++) {
    drawLine(curve1[i], curve1[i + 1], "black", 2);
  }
}

function drawLine(start, end, color, weight = 3) {
  stroke(color);
  strokeWeight(weight);
  fill(color);
  line(start.x, start.y, end.x, end.y);
}

function drawDot(vec, color, radius = 5, weight = 5) {
  stroke(color);
  strokeWeight(weight);
  fill(color);
  ellipse(vec.x, vec.y, radius, radius);
}

// Should be run every loop
function quadraticBezierDemonstration() {
  // Lines between each point
  drawLine(p0, p1, "blue")
  drawLine(p1, p2, "blue")

  // Lerp the lines
  let l1 = lerpVector(p0, p1, t);
  let l2 = lerpVector(p1, p2, t);

  // Draw their corresponding dots
  drawDot(l1, "red");
  drawDot(l2, "red");

  // Draw line between the lerped vectors
  drawLine(l1, l2, "green");

  // Lerp the line between lerped vectors, this is our curve
  let l3 = lerpVector(l1, l2, t);
  drawDot(l3, "purple");

  // Store vector into curve array
  myCurve.push(l3);

  for (let i = 0; i < myCurve.length - 1; i++) {
    drawLine(myCurve[i], myCurve[i + 1], "black", 2);
  }
}

// Should be run every loop
function cubicBezierDemonstration() {
  // Lines between each point
  drawLine(p0, p1, "blue")
  drawLine(p1, p2, "blue")
  drawLine(p2, p3, "blue")

  // Lerp the lines
  let l1 = lerpVector(p0, p1, t);
  let l2 = lerpVector(p1, p2, t);
  let l3 = lerpVector(p2, p3, t);

  // Draw their corresponding dots
  drawDot(l1, "red");
  drawDot(l2, "red");
  drawDot(l3, "red");

  // Draw line between the lerped vectors
  drawLine(l1, l2, "green");
  drawLine(l2, l3, "green");

  // Lerp the line between the first two lerped vectors, this is our curve
  let l4 = lerpVector(l1, l2, t);
  drawDot(l4, "purple");

  // Lerp the line between second set of lerped vectors, this is our curve
  let l5 = lerpVector(l2, l3, t);
  drawDot(l5, "purple");

  // Draw line between l4 and l5 since we'll be lerping on this as well
  drawLine(l4, l5, "orange");

  // Get the final lerp between l4 and l5
  let fl = lerpVector(l4, l5, t);
  drawDot(fl, "black", 6, 6);


  // Store vector into curve array
  myCurve.push(fl);

  for (let i = 0; i < myCurve.length - 1; i++) {
    drawLine(myCurve[i], myCurve[i + 1], "black", 2);
  }
}

// Returns an array with bezier
function quadraticBezier(v0, v1, v2) {
  let tmpCurve = [];

  for (let t1 = 0; t1 <= 1; t1 += step) {
    // Get lerps between each point
    let l1 = lerpVector(v0, v1, t1);
    let l2 = lerpVector(v1, v2, t1);

    // Lerp between lerped vectors to get curve
    let l3 = lerpVector(l1, l2, t1);

    tmpCurve.push(l3);
  }

  return tmpCurve
}

// Returns an array with bezier using De Casteljau's algorithm
function cubicBezier(start, v1, v2, end) {
  let tmpCurve = [];

  for (let t1 = 0; t1 <= 1; t1 += step) {
    /*
    // Get lerps between each point
    let l1 = lerpVector(start, v1, t1);
    let l2 = lerpVector(v1, v2, t1);
    let l3 = lerpVector(v2, end, t1);

    // Lerp between each of those sets
    let l12 = lerpVector(l1, l2, t1);
    let l23 = lerpVector(l2, l3, t1);

    // Lerp between those two
    let fl = lerpVector(l12, l23, t1);
    */

    let sect1 = pow(1 - t1, 3);
    let sect2 = 3 * pow(1 - t1, 2) * t1;
    let sect3 = 3 * (1 - t1) * pow(t1, 2);
    let sect4 = pow(t1, 3);
    
    let fl = createVector(
      sect1 * start.x + sect2 * v1.x + sect3 * v2.x + sect4 * end.x,
      sect1 * start.y + sect2 * v1.y + sect3 * v2.y + sect4 * end.y
    )
    
    tmpCurve.push(fl);
  }


  return tmpCurve
}

function nDegreeBezier(start, v1, v2, end) {
  let tmpCurve = [];

  for (j = N - 1; j > 0; j--) {
    for (i = 0; i < j; i++) {
      Px[i] = (1 - t) * Px[i] + t * Px[i + 1];
      Py[i] = (1 - t) * Py[i] + t * Py[i + 1];
    }
  }
}

function mousePressed() {
  p0.pressed();
  p1.pressed();
  p2.pressed();
  p3.pressed();
}

function mouseReleased() {
  // Quit dragging
  p0.released();
  p1.released();
  p2.released();
  p3.released();
}