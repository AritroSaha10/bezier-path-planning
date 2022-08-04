/// <reference path="./p5.global-mode.d.ts" />

const step = 0.01
let controlPoints = []
let fieldImg
let newWaypointBtn, removeWaypointBtn, resetBtn
let resolutionSlider, lineThicknessSlider

function preload() {
  // Load in field asset
  fieldImg = loadImage('assets/spin-up.png')
}

function setup() {
  createCanvas(800, 800)

  // Create new waypoint btn
  newWaypointBtn = createButton('New Waypoint')
  newWaypointBtn.position(20, 825)
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
  removeWaypointBtn.position(140, 825)
  removeWaypointBtn.mousePressed(() => {
    // Add new control point
    if (controlPoints.length > 2) {
      controlPoints.pop()
    }
  })

  // Create reset btn
  resetBtn = createButton('Reset Path')
  resetBtn.position(280, 825)
  resetBtn.mousePressed(resetPath)

  // Add resolution slider
  resolutionSlider = createSlider(1, 50, 10, 1)
  resolutionSlider.position(20, 900)
  resolutionSlider.style('width', '80px')
  createP('Resolution slider').position(23, 867)

  // Add line thickness slider
  lineThicknessSlider = createSlider(0.5, 10, 2)
  lineThicknessSlider.position(150, 900)
  lineThicknessSlider.style('width', '80px')
  createP('Line thickness slider').position(153, 867)

  // Make all draggable control points
  resetPath();
}

function draw() {
  background(240)
  image(fieldImg, 0, 0, 800, 800)

  const curve = evaluateBezier(
    controlPoints.map((p) => p.vectorPos()),
    resolutionSlider.value(),
  )

  for (let i = 0; i < curve.length - 1; i++) {
    drawLine(curve[i], curve[i + 1], "black", lineThicknessSlider.value())

    /*
    drawDot(
      curve[i],
      'blue',
      lineThicknessSlider.value() + 1,
      lineThicknessSlider.value(),
    )
    */

    // Number each sub point calculated
    /*
    push()
    stroke(0)
    strokeWeight(1)
    fill("black")
    text(i, curve[i].x, curve[i].y);
    pop()
    */
  }

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
  for (let i = 0; i < 5; i++) {
    controlPoints.push(
      new Draggable(
        clamp(Math.random() * 1000, 300, 700),
        clamp(Math.random() * 1000, 300, 700),
        i
      ),
    )
  }
}
