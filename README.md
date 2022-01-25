# Bézier Path Planning (VEX)
A p5.js simulator for creating curved paths using Bézier curves. Given a few waypoints, it will generate a curved path with C1 continuity (position and tangent).
It also has the backdrop of a VEX Tipping Point field for planning autonomous runs.

![Screenshot of application](https://i.imgur.com/LsFQwHS.png)

## Usage
The application starts off with five random waypoints / control points. You can drag each of them around anywhere. \
The red waypoint represents the start of the path. \
The green waypoint represents the end of the path.

### Adding Waypoints
When a waypoint is added, it is connected to the last waypoint, becoming the new end of the path.

### Removing Waypoints
When clicking this button, the last waypoint (green) is removed from the path.

### Reset Path
This resets the entire path and goes back to a random set of five waypoints.

### Resolution Slider
This adjusts the resolution of the curve, or how many points will be calculated. \
Do note that maxing this out will likely lag your machine as the calculation function is run every draw loop.

### Line Thickness Slider
This adjusts the thickness of the dots that make up the line. Increase this if you want a more continuous line.

## Resources
I primarily used this for the linear system of equations calculations: [Towards Data Science: Bézier Interpolation](https://towardsdatascience.com/b%C3%A9zier-interpolation-8033e9a262c2) \
To understand Bézier curves themselves, I used these videos / articles:
- [Bézier Curves Explained](https://www.youtube.com/watch?v=pnYccz1Ha34)
- [The Beauty of Bézier Curves](https://www.youtube.com/watch?v=pnYccz1Ha34)
- [De Casteljau's algorithm](https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm)
- [Bézier Curve](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)
