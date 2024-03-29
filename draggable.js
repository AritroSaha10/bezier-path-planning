class Draggable {
  constructor(x = 100, y = 100, i) {

    this.dragging = false; // Is the object being dragged?
    this.draggedBefore = false;
    this.rollover = false; // Is the mouse over the ellipse?
    this.noShow = false;

    this.x = x;
    this.y = y;
    // Dimensions
    this.w = 20;
    this.h = 20;
    this.i = i;
  }

  over() {
    // Is mouse over object
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }

  }

  update() {

    // Adjust location if being dragged
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }

  }

  show() {
    stroke(0);
    // Different fill based on state
    if (this.dragging) {
      fill(50);
    } else if (this.rollover) {
      fill(100);
    } else if (this.end) {
      fill("green")
    } else if (this.start) {
      fill("red")
    } else {
      fill(175, 200);
    }

    if (this.noShow) {
      noFill();
      noStroke();
    }

    if (this.i !== BEZIER_CONTROL_IDX) {
      rect(this.x, this.y, this.w, this.h);

      push()
      stroke(0)
      strokeWeight(1)
      fill("black")
      text(this.i, this.x, this.y);
      pop()
    } else {
      // is a bezier control, draw differently
      push()
      rect(this.x, this.y, 15, 15)
      pop()
    }
  }

  pressed() {
    // Did I click on the rectangle?
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      this.dragging = true;
      // If so, keep track of relative location of click to corner of rectangle
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  released() {
    // Quit dragging
    this.dragging = false;
  }

  vectorPos() {
    return createVector(this.x + this.w / 2, this.y + this.h / 2);
  }
}
