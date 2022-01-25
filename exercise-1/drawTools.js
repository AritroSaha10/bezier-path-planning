function drawLine(start, end, color, weight = 3) {
  push()
  stroke(color)
  strokeWeight(weight)
  fill(color)
  line(start.x, start.y, end.x, end.y)
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
