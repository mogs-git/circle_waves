let c
let w
let h
let circles = []
let grid_x = []
let grid_y = []
let n_circles
let scale


class Circle {
  constructor(x,y,width,height) {
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
  }

  display(width, height) {
    noFill()
    stroke(200,200,200,500)
    ellipse(this.x, this.y, w, h);
  }
}

class BigCircle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  display(width, height) {
    noFill()
    stroke(200,200,200,500)
    ellipse(this.x, this.y, this.width, this.height);
  }
}
class BigSpot {
    constructor(parent_x, parent_y, parent_radius, angle, speed, colour) {
    this.parent_x = parent_x;
    this.parent_y = parent_y;
    this.parent_radius = parent_radius;
    this.angle = angle;
    this.speed = speed;
    this.radius = 20;
    this.colour = colour;
  }

  display() {  
    fill(this.colour)
    let x = this.parent_x + this.parent_radius/2 * cos(this.angle);
    let y = this.parent_y + this.parent_radius/2 * sin(this.angle);
    ellipse(x, y, this.radius, this.radius);
    fill(this.colour)
    this.angle = this.angle + this.speed;
  }
}

class Spot {
  constructor(parent_x, parent_y, parent_radius, angle, speed, colour) {
    this.parent_x = parent_x;
    this.parent_y = parent_y;
    this.parent_radius = parent_radius;
    this.angle = angle;
    this.speed = speed;
    this.radius = 5;
    this.colour = colour;
  }

  display() {  
    fill(this.colour)
    let x = this.parent_x + w/2 * cos(this.angle);
    let y = this.parent_y + h/2 * sin(this.angle);
    ellipse(x, y, this.radius, this.radius);
    fill(this.colour)
    this.angle = this.angle + this.speed;
  }
}

let width = 1000;
let height = 1000;
let wave_section_width = width*0.7;
let wave_section_height = height*0.7;
let coords;
let spots = [];
let start_angles = [];
let wave_scale;
let default_width = 30;
let start_coord = 100
scale = 1.2

for (let i = start_coord; i < wave_section_width -start_coord; i+=default_width/scale) {
  grid_x.push(i)
}

for (let i = start_coord; i < wave_section_height-start_coord; i+=default_width/scale) {
  grid_y.push(i)
}

coords = []
for (let i = 0; i < grid_y.length; i++) {
  for (let j = 0; j < grid_x.length; j++) {
    coords.push([grid_x[j], grid_y[i]])
  }
}

function setup() {
  createCanvas(width, height);
  let button = createButton("reset sketch");
  button.mousePressed(resetSketch);

    function make_slider(x, y, start, end, initial, step) {
      slider = createSlider(start,end,initial,step)
      slider.position(x, y)
      slider.style('width', "200px");
      return slider
    }

    checkbox = createCheckbox('lock dimensions', true);
    show_circles_checkbox = createCheckbox('Show circles', true);
    width_slider = make_slider(50,20,0,150,default_width,1)
    height_slider = make_slider(50,50,0,150,default_width,1)
    wave_slider = make_slider(260,20,0,40,0.1,0.01)
    scale_slider = make_slider(260,50,0,2,1.2,0.02)
    wave_scale = wave_slider.value();

    scale = scale_slider.value();


    diagram_circle = new BigCircle(width*0.85, height*0.2, width*0.1, width*0.1)
    diagram_spot1 = new BigSpot(diagram_circle.x, diagram_circle.y, diagram_circle.width, (0*wave_scale /(2*Math.PI)), 0, "blue")
    diagram_spot2 = new BigSpot(diagram_circle.x, diagram_circle.y, diagram_circle.width, (1*wave_scale / (2*Math.PI)), 0, "blue")

    n_circles = grid_x.length * grid_y.length

    for (let i = 0; i < n_circles; i++) {
      circles.push(new Circle(coords[i][0], coords[i][1], w, h));
  }

    for (let i = 0; i < n_circles; i++) {
      spots.push(new Spot(coords[i][0], coords[i][1], default_width/2, i*wave_scale /(2*Math.PI), 0.05, "red"));
  }
}


function resetSketch() {
  grid_x = []
  grid_y = []

  for (let i = start_coord; i < wave_section_width -start_coord; i+=default_width/scale) {
    grid_x.push(i)
  }

  for (let i = start_coord; i < wave_section_height-start_coord; i+=default_width/scale) {
    grid_y.push(i)
  }

coords = []
for (let i = 0; i < grid_y.length; i++) {
  for (let j = 0; j < grid_x.length; j++) {
    coords.push([grid_x[j], grid_y[i]])
  }
}

  circles.forEach((circle, index) => {
    circle.x = coords[index][0]
    circle.y = coords[index][1]
  })
  spots.forEach((spot, index) => {
    spot.parent_x = coords[index][0]
    spot.parent_y = coords[index][1]
    spot.angle = index*wave_scale /(2*Math.PI)
  })

  diagram_spot1.angle = 0 * wave_scale / (2*Math.PI)
  diagram_spot2.angle = 1 * wave_scale / (2*Math.PI)
}

function draw() {
  clear()

  // Slider values
  w = width_slider.value();
  if (checkbox.checked()) {
    h = width_slider.value();
  } else {
    h = height_slider.value();
  }
  scale = scale_slider.value();
  wave_scale = wave_slider.value();
  wave_slider.changed(resetSketch)
  scale_slider.changed(resetSketch)

  diagram_circle.display();
  diagram_spot1.display();
  diagram_spot2.display();

  if (show_circles_checkbox.checked()) {
    circles.forEach((circle) => {
      circle.display(w, h);
    })
  }

  spots.forEach((spot, index) => {
    spot.display();
  })

}



/*
Some resources

Circular motion: https://editor.p5js.org/kjhollen/sketches/ryZBahkKx
Wave circles: https://markd87.github.io/posts/2016/05/06/wave-circles.html

*/