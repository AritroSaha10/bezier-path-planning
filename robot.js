class Robot {
    forwardSpeed = 0;
    strafeSpeed = 0;
    turnSpeed = 0;

    // robotX is in feet
    // robotY is in feet
    // robotRot is in radians
    constructor(robotX = 7, robotY = 1, robotRot = 0) {
        this.robotPos = fieldCoordsToRealCoords(robotX, robotY);
        this.robotRot = robotRot
    }

    // dir is a p5.Vector
    // turn is in radians
    move(dir = createVector(0, 0), turn = 0) {
        // Get direction relative to robot pose
        dir.rotate(-this.robotRot)
        const xVel = dir.x
        const yVel = dir.y

        // Pass values down to moveDrivetrain
        moveDrivetrain(xVel * 127, yVel * 127, turn * 127)
    }

    handleControls() {
        // W -> Forward
        if (keyIsDown(87)) {
            this.robotPos.y -= 4
        }
        // S -> Backawrd
        if (keyIsDown(83)) {
            this.robotPos.y += 4
        }
        // A -> Left
        if (keyIsDown(65)) {
            this.robotPos.x -= 4
        }
        // D -> Right
        if (keyIsDown(68)) {
            this.robotPos.x += 4
        }

        // Rotate left
        if (keyIsDown(LEFT_ARROW)) {
            this.robotRot -= PI / 45
        }
        // Rotate right
        if (keyIsDown(RIGHT_ARROW)) {
            this.robotRot += PI / 45
        }
    }

    // All values should be in of range [-127, 127]
    moveDrivetrain(forward = 0, strafe = 0, turn = 0) {
        forward = constrain(forward / 127, -1, 1)
        strafe = constrain(strafe / 127, -1, 1)
        turn = constrain(turn / 127, -1, 1)

        this.robotPos.y -= forward * this.forwardSpeed
        this.robotPos.x -= strafe * this.strafeSpeed
        this.robotRot += turn * this.turnSpeed
    }

    show() {
        drawSquare(this.robotPos, this.robotRot, 100, "red", 2)
    }
}