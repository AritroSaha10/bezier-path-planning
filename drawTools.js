function drawLine(start, end, color, weight = 3) {
  push()
  stroke(color)
  strokeWeight(weight)
  fill(color)
  line(start.x, start.y, end.x, end.y)
  pop()
}

function drawSquare(center, rotation, size, color, weight = 3) {
  push()
  stroke(color)
  strokeWeight(weight)
  fill(color)

  const origin = createVector(
    center.x - size / 2,
    center.y - size / 2
  )

  translate(center.x, center.y)
  rotate(rotation)
  translate(-center.x, -center.y)

  rect(origin.x, origin.y, size, size)

  fill("blue")
  rect(center.x - 5, center.y - size/2, 10, size/2)
  pop()
}

function drawDot(vec, color, radius = 5, weight = 5) {
  push()
  stroke(color)
  strokeWeight(weight)
  fill(color)
  ellipse(vec.x, vec.y, radius, radius)
  pop()
}
