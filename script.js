let c
let w
let h
let circles = []
let grid_x = []
let grid_y = []
let n_circles
let scale
let button
let button_on = false;
let pause_button;
let pause = false;

class Circle {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
  }

  display() {
    noFill()
    stroke(200,200,200,500)
    ellipse(this.x, this.y, w, h);
  }
}

class BigCircle extends Circle{
  constructor(x, y, width, height) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  display(angle) {
    noFill()
    fill("black")
    text(String(angle) + String("PI") ,this.x-this.width/4, this.y)
    stroke(200,200,200,500)
    noFill()
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

let width = 800;
let height = 750;
let wave_section_width = width*0.9;
let wave_section_height = height*0.9;
let coords;
let spots = [];
let start_angles = [];
let wave_scale = 1.84;
let default_width = 30;
let start_coord = 100
scale = 1.32

function make_grid_coordinates() {
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
  
  return coords
}

function initialize_circles() {
  n_circles = grid_x.length * grid_y.length

  for (let i = 0; i < n_circles; i++) {
    circles.push(new Circle(coords[i][0], coords[i][1], w, h));
  }

  for (let i = 0; i < n_circles; i++) {
    spots.push(new Spot(coords[i][0], coords[i][1], default_width/2, i*wave_scale /(2*Math.PI), 0.05, "red"));
  }
}



function setup() {
  let canvas = createCanvas(width, height);
  canvas.parent('sketch-holder');

  coords = make_grid_coordinates()

  function make_slider(x, y, start, end, initial, step) {
    slider = createSlider(start,end,initial,step)
    slider.position(x, y)
    slider.style('width', "200px");
    return slider
  }

  checkbox = createCheckbox('Lock height to width', true);
  show_circles_checkbox = createCheckbox('Show circles', true);
  button = createButton('Start/Stop cycle');
  pause_button = createButton('Start/Pause animation');
  
  checkbox.position(720, 20)
  show_circles_checkbox.position(720, 50)
  button.position(720, 80)
  pause_button.position(width*0.9, height*0.7)
  
  width_slider = make_slider(50,20,0,150,default_width,1)
  height_slider = make_slider(50,50,0,150,default_width,1)
  wave_slider = make_slider(350,20,0,39.6,1.84,0.02)
  scale_slider = make_slider(350,50,0,2,1.32,0.02)

  wave_scale = wave_slider.value();

  scale = scale_slider.value();

  dc_x = width*0.92
  dc_y = height*0.25
  dc_w = width*0.1
  diagram_circle = new BigCircle(dc_x,dc_y,dc_w,dc_w, 0)
  diagram_spot1 = new BigSpot(dc_x, dc_y, dc_w, (0*wave_scale /(2*Math.PI)), 0, "blue")
  diagram_spot2 = new BigSpot(dc_x, dc_y, dc_w, (1*wave_scale / (2*Math.PI)), 0, "blue")

  initialize_circles()
}

function change_animation_state() {
  pause = (pause == true) ? false : true;
  if (pause) {
    noLoop();
  } else {
    loop();
  }
}

function resetSketch() {
  grid_x = []
  grid_y = []

  coords = make_grid_coordinates()

  circles = []
  spots = []
  
  initialize_circles();

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

function alternate_button() {
  button_on = (button_on == true) ? false : true
}

function draw() {
  pause_button.mousePressed(change_animation_state)

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
  if (checkbox.checked()) {
    height_slider.value(width_slider.value());
  }

  wave_slider.changed(resetSketch)
  scale_slider.changed(resetSketch)

  button.mousePressed(alternate_button)
  if (button_on) {
    if (frameCount % 2 == 0) {
      if (wave_scale < 39.6) {
        wave_slider.value(wave_scale += 0.02)
        resetSketch();
      } 
    }
  }

  // slider text
  fill("black")
  text("Circle width", width_slider.x + 200, width_slider.y + 8)
  text("Circle height", height_slider.x + 200, height_slider.y + 8)
  text("Spot stagger angle", wave_slider.x + 200, wave_slider.y + 8)
  text("Circle grid density", scale_slider.x + 200, scale_slider.y + 8)


  diagram_circle.display((diagram_spot2.angle/Math.PI).toFixed(3));
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