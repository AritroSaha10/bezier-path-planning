/// <reference path="./p5.global-mode.d.ts" />

const [width, height] = [800, 600];
let p0, p1, p2, p3;

let step = 0.01;
let t = 0;

let myCurve = [];

function setup() {
  createCanvas(800, 600);
  p0 = createVector(80, 220);
  p1 = createVector(330, 70);
  p2 = createVector(500, 400);
  p3 = createVector(700, 200);
}

function draw() {
  background(240);

  // t value
  noStroke();
  fill("black")
  textSize(20);
  text("t: " + str(round(t * 100)/100), 15, 30);

  if (t > 1 || t < 0) {
    step *= -1;
  }
  t += step;

  // quadraticBezierDemonstration();
  cubicBezierDemonstration();
  

  /*
  const curve1 = quadraticBezier(p0, p1, p2);
  console.log(curve1);
  for (let i = 0; i < curve1.length - 1; i++) {
    drawLine(curve1[i], curve1[i + 1], "black", 2);
  }

  noLoop();
  */
  
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
  let l1 = p5.Vector.lerp(p0, p1, t);
  let l2 = p5.Vector.lerp(p1, p2, t);

  // Draw their corresponding dots
  drawDot(l1, "red");
  drawDot(l2, "red");

  // Draw line between the lerped vectors
  drawLine(l1, l2, "green");

  // Lerp the line between lerped vectors, this is our curve
  let l3 = p5.Vector.lerp(l1, l2, t);
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
  let l1 = p5.Vector.lerp(p0, p1, t);
  let l2 = p5.Vector.lerp(p1, p2, t);
  let l3 = p5.Vector.lerp(p2, p3, t);

  // Draw their corresponding dots
  drawDot(l1, "red");
  drawDot(l2, "red");
  drawDot(l3, "red");

  // Draw line between the lerped vectors
  drawLine(l1, l2, "green");
  drawLine(l2, l3, "green");

  // Lerp the line between the first two lerped vectors, this is our curve
  let l4 = p5.Vector.lerp(l1, l2, t);
  drawDot(l4, "purple");

  // Lerp the line between second set of lerped vectors, this is our curve
  let l5 = p5.Vector.lerp(l2, l3, t);
  drawDot(l5, "purple");

  // Draw line between l4 and l5 since we'll be lerping on this as well
  drawLine(l4, l5, "orange");

  // Get the final lerp between l4 and l5
  let fl = p5.Vector.lerp(l4, l5, t);
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
    let l1 = p5.Vector.lerp(v0, v1, t1);
    let l2 = p5.Vector.lerp(v1, v2, t1);

    // Lerp between lerped vectors to get curve
    let l3 = p5.Vector.lerp(l1, l2, t1);

    tmpCurve.push(l3);
  }

  return tmpCurve
}