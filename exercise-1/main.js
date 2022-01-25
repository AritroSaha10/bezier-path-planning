/// <reference path="./p5.global-mode.d.ts" />

const [width, height] = [800, 600];
let p0, p1, p2, p3;
let p4, point5, p6, p7;
let btn, noShowControl = false;

const step = 0.01;
let t = 0;

let myCurve = [];

let curve1, curve2;
let img;

function lerpVector(p1, p2, t) {
  return createVector((1-t) * p1.x + t * p2.x, (1-t) * p1.y + t * p2.y)
}

// Basically range from function, useful for iteration using map
const range = n => Array.from(Array(n).keys())

function getBezierCoef(points) {
  // Formula says n+1 points, so n is 1 less
  let n = points.length - 1;

  // Built coefficients matrix
  let C = range(n).map((_, z) => {
    let newArr = [];
    for (let i = 0; i < n; i++) {
      if (i == z) {
        // 4 * np.identity(n)
        newArr.push(4);
      } else if (i == z - 1) {
        // np.fill_diagonal(C[1:], 1)
        newArr.push(1);
      } else if (i == z + 1) {
        // np.fill_diagonal(C[:, 1:], 1)
        newArr.push(1);
      } else {
        newArr.push(0);
      }
    }

    return newArr;
  });

  C[0][0] = 2
  C[n - 1][n - 1] = 7
  C[n - 1][n - 2] = 2

  // Build Points vector
  let P = range(n).map(i => (
    [
      2 * (2 * points[i].x + points[i + 1].x),
      2 * (2 * points[i].y + points[i + 1].y)
    ]
  ));

  P[0] = [
    points[0].x + 2 * points[1].x,
    points[0].y + 2 * points[1].y
  ];
  P[n - 1] = [
    8 * points[n - 1].x + points[n].x,
    8 * points[n - 1].y + points[n].y
  ];

  // Solve the system, find A & B
  let A = linear.solve(C, P);

  let B = range(n - 1).map(i => ([
    2 * points[i + 1].x - A[i + 1][0],
    2 * points[i + 1].y - A[i + 1][1]
  ]));
  B.push([0, 0])

  B[n - 1] = [
    (A[n - 1][0] + points[n].x) / 2,
    (A[n - 1][1] + points[n].y) / 2
  ]
  
  return [ A, B ];
}

const matrixToVector = matrix => createVector(matrix[0], matrix[1])

function getBezierCubicFromPoints(points) {
  let [A, B] = getBezierCoef(points);
  return range(points.length - 1).map(i => (
    getNDegreeBezierFunc([points[i], matrixToVector(A[i]), matrixToVector(B[i]), points[i + 1]])
  ));
}

function evaluateBezier(points, n) {
  let curves = getBezierCubicFromPoints(points);

  let finalCurve = [];

  for (let t1 = 0; t1 <= 1; t1 += 1/n) {
    curves.forEach(func => finalCurve.push(func(t1)));
  }

  return finalCurve;
}

function reflectPointOverPoint(origin, reflected) {
  return createVector(
    origin.x - (reflected.x - origin.x),
    origin.y - (reflected.y - origin.y)
  );
}

function preload() {
  img = loadImage('assets/field.png');
}

function setup() {
  createCanvas(800, 800);

  
  p0 = new Draggable(60, 310);
  p1 = new Draggable(60, 10);
  p2 = new Draggable(400, 5);
  p3 = new Draggable(390, 300);

  p4 = new Draggable(391, 560);
  /*
  point5 = new Draggable(690, 570);
  p6 = new Draggable(700, 280);
  p7 = new Draggable(700, 450);
  

  curve1 = cubicBezier(p0.vectorPos(), p1.vectorPos(), p2.vectorPos(), p3.vectorPos());
  curve2 = cubicBezier(p3.vectorPos(), p4.vectorPos(), point5.vectorPos(), p6.vectorPos());

  btn = createButton("Turn on / off point control");
  btn.position(0, 610);
  btn.mousePressed(() => {
    noShowControl = !noShowControl;
    
    p0.noShow = noShowControl;
    p1.noShow = noShowControl;
    p2.noShow = noShowControl;
    p3.noShow = noShowControl;
    p4.noShow = noShowControl;
    point5.noShow = noShowControl;
    p6.noShow = noShowControl;
    p7.noShow = noShowControl;
  });
  */
}

let updateCurve = false;

function updateDraggable(drag) {
  drag.update();
  drag.over();
  drag.show();
}

function draw() {
  background(240);
  image(img, 0, 0, 800, 800);

  updateDraggable(p0);
  updateDraggable(p1);
  updateDraggable(p2);
  updateDraggable(p3);
  updateDraggable(p4);

  /*
  if (!noShowControl) {
    // Draw line from start to p1
    drawLine(p0.vectorPos(), p1.vectorPos(), "gray", 1);

    // Draw line from p2 to end
    drawLine(p2.vectorPos(), p3.vectorPos(), "gray", 1);

    // Draw line from start to p1
    drawLine(p3.vectorPos(), p4.vectorPos(), "gray", 1);

    // Draw line from p2 to end
    drawLine(point5.vectorPos(), p6.vectorPos(), "gray", 1);
  }

  updateDraggable(p0);
  updateDraggable(p1);
  updateDraggable(p2);
  updateDraggable(p3);
  updateDraggable(p4);
  updateDraggable(point5);
  updateDraggable(p6);
  updateDraggable(p7);

  p4.x = reflectPointOverPoint(p3, p2).x;
  p4.y = reflectPointOverPoint(p3, p2).y;
  
  if (p0.dragging || p1.dragging || p2.dragging || p3.dragging) {
    curve1 = cubicBezier(
      p0.vectorPos(), 
      p1.vectorPos(), 
      p2.vectorPos(), 
      p3.vectorPos()
    );
  }

  if (p2.dragging || p3.dragging || p4.dragging || point5.dragging || p6.dragging) {
    curve2 = cubicBezier(
      p3.vectorPos(), 
      p4.vectorPos(), 
      point5.vectorPos(), 
      p6.vectorPos()
    );
  }

  for (let i = 0; i < curve1.length - 1; i++) {
    drawLine(curve1[i], curve1[i + 1], "black", 2);
  }

  for (let i = 0; i < curve1.length - 1; i++) {
    drawLine(curve2[i], curve2[i + 1], "black", 2);
  }
  */

  const points = evaluateBezier([
    p0.vectorPos(),
    p1.vectorPos(),
    p2.vectorPos(),
    p3.vectorPos(),
    p4.vectorPos(),
    ], 100);
    for (let i = 0; i < points.length - 1; i++) {
      // drawLine(points[i], points[i + 1], "black", 2);
      drawDot(points[i], "black", 2, 2)
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

  nDegreeBezier([start, v1, v2, end], 0);

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

    /*
    let sect1 = pow(1 - t1, 3);
    let sect2 = 3 * pow(1 - t1, 2) * t1;
    let sect3 = 3 * (1 - t1) * pow(t1, 2);
    let sect4 = pow(t1, 3);
    
    let fl = createVector(
      sect1 * start.x + sect2 * v1.x + sect3 * v2.x + sect4 * end.x,
      sect1 * start.y + sect2 * v1.y + sect3 * v2.y + sect4 * end.y
    )
    */
    

    fl = nDegreeBezier([start, v1, v2, end], t1);
    
    tmpCurve.push(fl);
  }


  return tmpCurve
}

function factorial(x) {
  if (x < 2) {
    return 1;
  }

  return x * factorial(x - 1);
}

function nCr(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function nDegreeBezier(points, t) {
  let n = points.length - 1;
  let Bx = 0;
  let By = 0;
  for (let i = 0; i <= n; i++) {
    Bx += nCr(3, i) * Math.pow((1 - t), (n - i)) * pow(t, i) * points[i].x;
    By += nCr(3, i) * Math.pow((1 - t), (n - i)) * pow(t, i) * points[i].y;
  }

  return createVector(Bx, By);
}

function getNDegreeBezierFunc(points) {
  let n = points.length - 1;

  const curveFunc = t => {
    let Bx = 0;
    let By = 0;
    for (let i = 0; i <= n; i++) {
      Bx += nCr(3, i) * Math.pow((1 - t), (n - i)) * pow(t, i) * points[i].x;
      By += nCr(3, i) * Math.pow((1 - t), (n - i)) * pow(t, i) * points[i].y;
    }
    return createVector(Bx, By);
  }

  return curveFunc;
}

function mousePressed() {
  p0.pressed();
  p1.pressed();
  p2.pressed();
  p3.pressed();
  p4.pressed();
  point5.pressed();
  p6.pressed();
  p7.pressed();
}

function mouseReleased() {
  // Quit dragging
  p0.released();
  p1.released();
  p2.released();
  p3.released();
  p4.released();
  point5.released();
  p6.released();
  p7.released();
}