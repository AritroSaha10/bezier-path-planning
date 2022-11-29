/// <reference path="./p5.global-mode.d.ts" />

const step = 0.01

// (name is misleading) Points to pass curve through
let controlPoints = []

// Control points that exist between the other points
let betweenControlPoints = []

let fieldImg
let newWaypointBtn, removeWaypointBtn, resetBtn
let resolutionSlider, lineThicknessSlider
let autogenCheckbox, controlPointHandlesCheckbox
let shouldAutogen = false;
let showControlPointHandles = false;

let robot

let currentPath

function preload() {
  // Load in field asset
  fieldImg = loadImage('assets/spin-up.png')
}

function setup() {
  createCanvas(900, 900)

  // Create robot
  robot = new Robot(7, 1)

  // Create new waypoint btn
  newWaypointBtn = createButton('New Waypoint')
  newWaypointBtn.position(20, 925)
  newWaypointBtn.mousePressed(() => {
    // Add new control point
    controlPoints.push(
      new Draggable(
        clamp(Math.random() * 1000, 300, 700),
        clamp(Math.random() * 1000, 300, 700),
        controlPoints.length
      ),
    )
  })

  // Create remove waypoint btn
  removeWaypointBtn = createButton('Remove Waypoint')
  removeWaypointBtn.position(140, 925)
  removeWaypointBtn.mousePressed(() => {
    // Add new control point
    if (controlPoints.length > 2) {
      controlPoints.pop()
    }
  })

  // Create reset btn
  resetBtn = createButton('Reset Path')
  resetBtn.position(280, 925)
  resetBtn.mousePressed(resetPath)

  // Create generate path btn
  newWaypointBtn = createButton('Generate Path')
  newWaypointBtn.position(380, 925)
  newWaypointBtn.mousePressed(generateBezierPath)

  // Add resolution slider
  resolutionSlider = createSlider(1, 50, 10, 1)
  resolutionSlider.position(20, 970)
  resolutionSlider.style('width', '80px')
  createP('Resolution slider').position(23, 937)

  // Add line thickness slider
  lineThicknessSlider = createSlider(0.5, 10, 2)
  lineThicknessSlider.position(150, 970)
  lineThicknessSlider.style('width', '80px')
  createP('Line thickness slider').position(153, 937)

  // Create auto pathgen checkbox
  autogenCheckbox = createCheckbox(' Autogenerate Path', false)
  autogenCheckbox.position(320, 960)
  autogenCheckbox.changed(() => {
    shouldAutogen = autogenCheckbox.checked()
  })

  // Create auto pathgen checkbox
  controlPointHandlesCheckbox = createCheckbox(' Show Control Point Handles', false)
  controlPointHandlesCheckbox.position(490, 960)
  controlPointHandlesCheckbox.changed(() => {
    showControlPointHandles = controlPointHandlesCheckbox.checked()
  })

  const spacer = createDiv();
  spacer.style("height", "200px")

  // Make all draggable control points
  resetPath();
}

function draw() {
  background(240)
  image(fieldImg, 0, 0, 900, 900)

  // Generate bezier path if we're on autogen
  if (shouldAutogen) {
    generateBezierPath()
  }

  // Draw the actual path
  for (let i = 0; i < controlPoints.length - 1; i++) {
    push()
    noFill()
    stroke("orange")
    strokeWeight(lineThicknessSlider.value())

    // Draw bezier line
    bezier(
      // bezierCurve[0].x, bezierCurve[0].y,
      controlPoints[i].x, controlPoints[i].y,
      // bezierCurve[1].x, bezierCurve[1].y,
      betweenControlPoints[i][0].x, betweenControlPoints[i][0].y,
      // bezierCurve[2].x, bezierCurve[2].y,
      betweenControlPoints[i][1].x, betweenControlPoints[i][1].y,
      // bezierCurve[3].x, bezierCurve[3].y,
      controlPoints[i + 1].x, controlPoints[i + 1].y,
    )

    pop()

    // Draw lines from bezier control point to actual point
    if (showControlPointHandles) {
      push()
      noFill()
      stroke("grey")
      strokeWeight(3)
      line(controlPoints[i].x, controlPoints[i].y, betweenControlPoints[i][0].x, betweenControlPoints[i][0].y)
      line(controlPoints[i + 1].x, controlPoints[i + 1].y, betweenControlPoints[i][1].x, betweenControlPoints[i][1].y)
      pop()
    }
  }

  /*
  const curve = evaluateBezier(
    controlPoints.map((p) => p.vectorPos()),
    resolutionSlider.value(),
  )

  for (let i = 0; i < curve.length - 1; i++) {
    drawLine(curve[i], curve[i + 1], "black", lineThicknessSlider.value())
  }
  */

  robot.handleControls()
  robot.show()

  controlPoints.forEach((p, i) => updateDraggable(p, i))

  if (showControlPointHandles) betweenControlPoints.forEach((pSet, i) => pSet.forEach((p, z) => updateDraggable(p, BEZIER_CONTROL_IDX)))
}

function updateDraggable(drag, i) {
  drag.update()
  drag.over()
  drag.show()

  if (i === controlPoints.length - 1) {
    drag.end = true
  } else if (i === 0) {
    drag.start = true
  } else {
    drag.start = false
    drag.end = false
  }
}

function mousePressed() {
  controlPoints.forEach((p) => p.pressed())
  betweenControlPoints.forEach(pSet => pSet.forEach(p => p.pressed()))
}

function mouseReleased() {
  controlPoints.forEach((p) => p.released())
  betweenControlPoints.forEach(pSet => pSet.forEach(p => p.released()))
}

function resetPath() {
  controlPoints = []
  // Make all draggable control points
  for (let i = 0; i < 2; i++) {
    controlPoints.push(
      new Draggable(
        clamp(Math.random() * 1000, 300, 700),
        clamp(Math.random() * 1000, 300, 700),
        i
      ),
    )
  }

  // Make sure to regenerate
  generateBezierPath();
}

// Generates the bezier path to show on screen
function generateBezierPath() {
  let [A, B] = getBezierCoef(controlPoints)

  const path = range(controlPoints.length - 1).map(i => [
    createVector(controlPoints[i].x, controlPoints[i].y),
    matrixToVector(A[i]),
    matrixToVector(B[i]),
    createVector(controlPoints[i + 1].x, controlPoints[i + 1].y)
  ]);

  // Create draggable control pointss
  betweenControlPoints = []
  for (let i = 0; i < path.length; i++) {
    betweenControlPoints.push([
      new Draggable(
        path[i][1].x,
        path[i][1].y,
        BEZIER_CONTROL_IDX
      ),
      new Draggable(
        path[i][2].x,
        path[i][2].y,
        BEZIER_CONTROL_IDX
      )
    ])
  }

  currentPath = path
}
