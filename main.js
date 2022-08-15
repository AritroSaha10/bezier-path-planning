/// <reference path="./p5.global-mode.d.ts" />

const step = 0.01
let controlPoints = []
let fieldImg
let newWaypointBtn, removeWaypointBtn, resetBtn
let resolutionSlider, lineThicknessSlider

let robot

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

  const spacer = createDiv();
  spacer.style("height", "200px")

  // Make all draggable control points
  resetPath();
}

function draw() {
  background(240)
  image(fieldImg, 0, 0, 900, 900)

  const curve = evaluateBezier(
    controlPoints.map((p) => p.vectorPos()),
    resolutionSlider.value(),
  )

  for (let i = 0; i < curve.length - 1; i++) {
    drawLine(curve[i], curve[i + 1], "black", lineThicknessSlider.value())
  }

  robot.handleControls()
  robot.show()

  controlPoints.forEach((p, i) => updateDraggable(p, i))
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
}

function mouseReleased() {
  controlPoints.forEach((p) => p.released())
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
}
